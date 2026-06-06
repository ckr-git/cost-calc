/**
 * 工程造价费率计算引擎
 *
 * 计算顺序:
 *   1. 分部分项费 = Σ(清单项合价)
 *   2. 措施费 = 按费率规则取费
 *   3. 其他项目费（暂按项计，本版 = 0）
 *   4. 规费 = 按费率规则取费
 *   5. 税前合计 = 1 + 2 + 3 + 4
 *   6. 税金 = 税前合计 × 税率
 *   7. 工程造价 = 税前合计 + 税金
 *
 * calc_base 取费基数:
 *   - subdivision: 分部分项费合计
 *   - subdivision_labor: 分部分项费中的人工费合计
 *   - labor: 人工费合计（同上）
 *   - pretax_total: 税前合计
 */

export interface FeeRule {
  name: string
  calc_base: string  // subdivision | subdivision_labor | labor | pretax_total
  rate: number       // 百分比，如 3.5 表示 3.5%
  category: string   // measure | regulation | tax | other
}

export interface SubdivisionInput {
  totalPrice: number    // 分部分项费合计
  laborTotal: number    // 分部分项中人工费合计
}

export interface FeeCalcResult {
  subdivision: number       // 分部分项费
  subdivisionLabor: number  // 分部分项人工费
  measureItems: FeeLineItem[]   // 措施费明细
  measureTotal: number      // 措施费合计
  otherTotal: number        // 其他项目费
  regulationItems: FeeLineItem[] // 规费明细
  regulationTotal: number   // 规费合计
  pretaxTotal: number       // 税前合计
  taxItems: FeeLineItem[]   // 税金明细
  taxTotal: number          // 税金合计
  grandTotal: number        // 工程造价
}

export interface FeeLineItem {
  name: string
  calcBase: string
  rate: number
  baseAmount: number   // 取费基数金额
  amount: number       // 计算结果
}

export function calculateFees(input: SubdivisionInput, rules: FeeRule[]): FeeCalcResult {
  const { totalPrice: subdivision, laborTotal: subdivisionLabor } = input

  // 按类别分组
  const measureRules = rules.filter((r) => r.category === 'measure')
  const regulationRules = rules.filter((r) => r.category === 'regulation')
  const taxRules = rules.filter((r) => r.category === 'tax')

  // 计算措施费
  const measureItems = measureRules.map((rule) => calcLine(rule, subdivision, subdivisionLabor, 0))
  const measureTotal = measureItems.reduce((s, item) => s + item.amount, 0)

  // 其他项目费（本版固定为 0，后续可扩展）
  const otherTotal = 0

  // 计算规费
  const regulationItems = regulationRules.map((rule) => calcLine(rule, subdivision, subdivisionLabor, 0))
  const regulationTotal = regulationItems.reduce((s, item) => s + item.amount, 0)

  // 税前合计
  const pretaxTotal = subdivision + measureTotal + otherTotal + regulationTotal

  // 计算税金
  const taxItems = taxRules.map((rule) => calcLine(rule, subdivision, subdivisionLabor, pretaxTotal))
  const taxTotal = taxItems.reduce((s, item) => s + item.amount, 0)

  // 工程造价
  const grandTotal = pretaxTotal + taxTotal

  return {
    subdivision,
    subdivisionLabor: subdivisionLabor,
    measureItems,
    measureTotal,
    otherTotal,
    regulationItems,
    regulationTotal,
    pretaxTotal,
    taxItems,
    taxTotal,
    grandTotal
  }
}

function calcLine(rule: FeeRule, subdivision: number, subdivisionLabor: number, pretaxTotal: number): FeeLineItem {
  let baseAmount = 0
  switch (rule.calc_base) {
    case 'subdivision':
      baseAmount = subdivision
      break
    case 'subdivision_labor':
    case 'labor':
      baseAmount = subdivisionLabor
      break
    case 'pretax_total':
      baseAmount = pretaxTotal
      break
    default:
      baseAmount = subdivision
  }
  const amount = round2(baseAmount * rule.rate / 100)
  return {
    name: rule.name,
    calcBase: rule.calc_base,
    rate: rule.rate,
    baseAmount,
    amount
  }
}

function round2(n: number): number {
  return Math.round(n * 100) / 100
}
