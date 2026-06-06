import { ipcMain, dialog } from 'electron'
import { getDb } from '../database/connection'
import { calcEngineeringSummary } from './summary'
import ExcelJS from 'exceljs'

export function registerExportHandlers(): void {
  const db = getDb()

  // 导出预算汇总表
  ipcMain.handle('export:summary', async (_event, engineeringId: number) => {
    const result = await dialog.showSaveDialog({
      title: '导出预算汇总表',
      defaultPath: '预算汇总表.xlsx',
      filters: [{ name: 'Excel', extensions: ['xlsx'] }]
    })
    if (result.canceled || !result.filePath) return { success: false }

    const eng = db.prepare('SELECT * FROM engineering WHERE id = ?').get(engineeringId) as any
    const bills = db.prepare('SELECT * FROM bill_items WHERE engineering_id = ? ORDER BY sort_order').all(engineeringId) as any[]

    // 造价汇总数据（复用 summary 模块）
    const summaryData = calcEngineeringSummary(engineeringId)

    const workbook = new ExcelJS.Workbook()

    // Sheet 1: 造价汇总表
    const ws1 = workbook.addWorksheet('造价汇总表')
    ws1.columns = [
      { header: '序号', key: 'seq', width: 8 },
      { header: '费用名称', key: 'name', width: 30 },
      { header: '金额(元)', key: 'amount', width: 18 },
      { header: '备注', key: 'remark', width: 20 },
    ]
    ws1.getRow(1).font = { bold: true }
    ws1.addRow({ seq: '一', name: '分部分项工程费', amount: summaryData.subdivision })
    ws1.addRow({ seq: '', name: '  其中：人工费', amount: summaryData.subdivisionLabor })
    ws1.addRow({ seq: '二', name: '措施项目费', amount: summaryData.measureTotal })
    for (const item of summaryData.measureItems) {
      ws1.addRow({ seq: '', name: `  ${item.name}`, amount: item.amount, remark: `${item.rate}%` })
    }
    ws1.addRow({ seq: '三', name: '其他项目费', amount: summaryData.otherTotal })
    ws1.addRow({ seq: '四', name: '规费', amount: summaryData.regulationTotal })
    for (const item of summaryData.regulationItems) {
      ws1.addRow({ seq: '', name: `  ${item.name}`, amount: item.amount, remark: `${item.rate}%` })
    }
    ws1.addRow({ seq: '五', name: '税前造价', amount: summaryData.pretaxTotal })
    ws1.addRow({ seq: '六', name: '税金', amount: summaryData.taxTotal })
    for (const item of summaryData.taxItems) {
      ws1.addRow({ seq: '', name: `  ${item.name}`, amount: item.amount, remark: `${item.rate}%` })
    }
    const totalRow = ws1.addRow({ seq: '', name: '工程造价合计', amount: summaryData.grandTotal })
    totalRow.font = { bold: true }

    // Sheet 2: 分部分项工程量清单
    const ws2 = workbook.addWorksheet('分部分项清单')
    ws2.columns = [
      { header: '序号', key: 'seq', width: 6 },
      { header: '项目编码', key: 'code', width: 14 },
      { header: '项目名称', key: 'name', width: 28 },
      { header: '单位', key: 'unit', width: 8 },
      { header: '工程量', key: 'quantity', width: 12 },
      { header: '综合单价', key: 'unit_price', width: 14 },
      { header: '合价', key: 'total_price', width: 16 },
    ]
    ws2.getRow(1).font = { bold: true }
    bills.forEach((bill, i) => {
      ws2.addRow({
        seq: i + 1,
        code: bill.code,
        name: bill.name,
        unit: bill.unit,
        quantity: bill.quantity,
        unit_price: bill.unit_price,
        total_price: bill.total_price
      })
    })
    const billTotalRow = ws2.addRow({ seq: '', code: '', name: '合计', unit: '', quantity: '', unit_price: '', total_price: bills.reduce((s: number, b: any) => s + b.total_price, 0) })
    billTotalRow.font = { bold: true }

    // Sheet 3: 定额组价明细
    const ws3 = workbook.addWorksheet('定额组价明细')
    ws3.columns = [
      { header: '清单项', key: 'bill_name', width: 22 },
      { header: '定额编号', key: 'quota_code', width: 12 },
      { header: '定额名称', key: 'quota_name', width: 28 },
      { header: '单位', key: 'unit', width: 8 },
      { header: '工程量', key: 'quantity', width: 10 },
      { header: '基价', key: 'base_price', width: 12 },
      { header: '人工费', key: 'labor', width: 10 },
      { header: '材料费', key: 'material', width: 10 },
      { header: '机械费', key: 'machine', width: 10 },
      { header: '小计', key: 'subtotal', width: 14 },
    ]
    ws3.getRow(1).font = { bold: true }
    for (const bill of bills) {
      const quotas = db.prepare('SELECT * FROM quota_items WHERE bill_item_id = ? ORDER BY sort_order').all(bill.id) as any[]
      for (const q of quotas) {
        ws3.addRow({
          bill_name: bill.name,
          quota_code: q.quota_code,
          quota_name: q.name,
          unit: q.unit,
          quantity: q.quantity,
          base_price: q.base_price,
          labor: q.labor_cost,
          material: q.material_cost,
          machine: q.machine_cost,
          subtotal: q.base_price * q.quantity
        })
      }
    }

    await workbook.xlsx.writeFile(result.filePath)
    return { success: true, path: result.filePath }
  })
}
