import { ipcMain } from 'electron'
import { getDb } from '../database/connection'

export interface SummaryResult {
  subdivision: number
  subdivisionLabor: number
  measureItems: { name: string; calcBase: string; rate: number; baseAmount: number; amount: number }[]
  measureTotal: number
  otherTotal: number
  regulationItems: { name: string; calcBase: string; rate: number; baseAmount: number; amount: number }[]
  regulationTotal: number
  pretaxTotal: number
  taxItems: { name: string; calcBase: string; rate: number; baseAmount: number; amount: number }[]
  taxTotal: number
  grandTotal: number
}

export function registerSummaryHandlers(): void {
  const db = getDb()

  // 计算工程汇总（核心）
  ipcMain.handle('summary:calculate', (_event, engineeringId: number, feeRateFileId?: number) => {
    return calcEngineeringSummary(engineeringId, feeRateFileId)
  })

  // 计算项目汇总（所有子工程合计）
  ipcMain.handle('summary:projectTotal', (_event, projectId: number) => {
    const engineerings = db.prepare(
      'SELECT id, fee_rate_file FROM engineering WHERE project_id = ?'
    ).all(projectId) as any[]

    let grandTotal = 0
    let subdivisionTotal = 0
    let measureTotal = 0
    let otherTotal = 0
    let regulationTotal = 0

    for (const eng of engineerings) {
      // 递归获取所有叶子工程
      const leafEngs = getLeafEngineerings(eng.id)
      for (const leafId of leafEngs) {
        const summary = calcEngineeringSummary(leafId, null)
        grandTotal += summary.grandTotal
        subdivisionTotal += summary.subdivision
        measureTotal += summary.measureTotal
        otherTotal += summary.otherTotal
        regulationTotal += summary.regulationTotal
      }
    }

    return { grandTotal, subdivisionTotal, measureTotal, otherTotal, regulationTotal }
  })

  // 获取单个工程的费用汇总（用于项目管理列表展示）
  ipcMain.handle('summary:engineeringTotals', (_event, engineeringId: number) => {
    const summary = calcEngineeringSummary(engineeringId, null)
    return {
      totalCost: summary.grandTotal,
      subdivisionTotal: summary.subdivision,
      measureTotal: summary.measureTotal,
      otherTotal: summary.otherTotal,
      regulationFee: summary.regulationTotal
    }
  })

  // 批量获取工程费用（项目管理列表一次性获取）
  ipcMain.handle('summary:batchTotals', (_event, engineeringIds: number[]) => {
    const results: Record<number, any> = {}
    for (const id of engineeringIds) {
      const summary = calcEngineeringSummary(id, null)
      results[id] = {
        totalCost: summary.grandTotal,
        subdivisionTotal: summary.subdivision,
        measureTotal: summary.measureTotal,
        otherTotal: summary.otherTotal,
        regulationFee: summary.regulationTotal
      }
    }
    return results
  })
}

export function calcEngineeringSummary(engineeringId: number, overrideFeeFileId?: number | null): SummaryResult {
  const db = getDb()

  // 1. 获取分部分项费
  const bills = db.prepare(`
    SELECT b.total_price, b.id FROM bill_items b WHERE b.engineering_id = ?
  `).all(engineeringId) as any[]

  const subdivision = bills.reduce((s: number, b: any) => s + (b.total_price || 0), 0)

  // 获取人工费合计
  let subdivisionLabor = 0
  for (const bill of bills) {
    const quotas = db.prepare(
      'SELECT labor_cost, quantity FROM quota_items WHERE bill_item_id = ?'
    ).all(bill.id) as any[]
    subdivisionLabor += quotas.reduce((s: number, q: any) => s + q.labor_cost * q.quantity, 0)
  }

  // 2. 获取费率规则
  let feeFileId = overrideFeeFileId
  if (!feeFileId) {
    // 从工程关联的费率文件获取
    const eng = db.prepare('SELECT fee_rate_file FROM engineering WHERE id = ?').get(engineeringId) as any
    if (eng?.fee_rate_file) {
      const feeFile = db.prepare('SELECT id FROM fee_rate_files WHERE name = ?').get(eng.fee_rate_file) as any
      feeFileId = feeFile?.id
    }
    // 若无关联，默认取第一个费率文件
    if (!feeFileId) {
      const first = db.prepare('SELECT id FROM fee_rate_files ORDER BY id LIMIT 1').get() as any
      feeFileId = first?.id
    }
  }

  let rules: any[] = []
  if (feeFileId) {
    rules = db.prepare('SELECT * FROM fee_rules WHERE fee_rate_file_id = ? ORDER BY sort_order').all(feeFileId) as any[]
  }

  // 3. 按类别计算
  const measureRules = rules.filter((r: any) => r.category === 'measure')
  const regulationRules = rules.filter((r: any) => r.category === 'regulation')
  const taxRules = rules.filter((r: any) => r.category === 'tax')

  const measureItems = measureRules.map((r: any) => calcLine(r, subdivision, subdivisionLabor, 0))
  const measureTotal = measureItems.reduce((s, i) => s + i.amount, 0)
  const otherTotal = 0
  const regulationItems = regulationRules.map((r: any) => calcLine(r, subdivision, subdivisionLabor, 0))
  const regulationTotal = regulationItems.reduce((s, i) => s + i.amount, 0)
  const pretaxTotal = subdivision + measureTotal + otherTotal + regulationTotal
  const taxItems = taxRules.map((r: any) => calcLine(r, subdivision, subdivisionLabor, pretaxTotal))
  const taxTotal = taxItems.reduce((s, i) => s + i.amount, 0)
  const grandTotal = pretaxTotal + taxTotal

  return {
    subdivision, subdivisionLabor,
    measureItems, measureTotal,
    otherTotal,
    regulationItems, regulationTotal,
    pretaxTotal,
    taxItems, taxTotal,
    grandTotal
  }
}

function calcLine(rule: any, subdivision: number, subdivisionLabor: number, pretaxTotal: number) {
  let baseAmount = 0
  switch (rule.calc_base) {
    case 'subdivision': baseAmount = subdivision; break
    case 'subdivision_labor': case 'labor': baseAmount = subdivisionLabor; break
    case 'pretax_total': baseAmount = pretaxTotal; break
    default: baseAmount = subdivision
  }
  const amount = Math.round(baseAmount * rule.rate / 100 * 100) / 100
  return { name: rule.name, calcBase: rule.calc_base, rate: rule.rate, baseAmount, amount }
}

function getLeafEngineerings(engineeringId: number, depth = 0, visited = new Set<number>()): number[] {
  if (depth > 20 || visited.has(engineeringId)) return []
  visited.add(engineeringId)
  const db = getDb()
  const children = db.prepare('SELECT id FROM engineering WHERE parent_id = ?').all(engineeringId) as any[]
  if (children.length === 0) return [engineeringId]
  const leaves: number[] = []
  for (const child of children) {
    leaves.push(...getLeafEngineerings(child.id, depth + 1, visited))
  }
  return leaves
}
