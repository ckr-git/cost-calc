// 默认费率文件模板（重庆2018 mock 费率规则）
// calc_base 取费基数: subdivision=分部分项费, labor=人工费, subdivision_labor=分部分项人工费
// category: measure=措施费, regulation=规费, tax=税金, other=其他

export interface FeeRateFileSeed {
  name: string
  description: string
  rules: FeeRuleSeed[]
}

export interface FeeRuleSeed {
  name: string
  calc_base: string
  rate: number
  category: string
  sort_order: number
}

export const feeRateFiles: FeeRateFileSeed[] = [
  {
    name: '房屋建筑工程费率',
    description: '重庆2018 房建工程通用费率',
    rules: [
      // 措施项目费
      { name: '安全文明施工费', calc_base: 'subdivision', rate: 3.50, category: 'measure', sort_order: 1 },
      { name: '夜间施工增加费', calc_base: 'subdivision', rate: 0.15, category: 'measure', sort_order: 2 },
      { name: '二次搬运费', calc_base: 'subdivision', rate: 0.30, category: 'measure', sort_order: 3 },
      { name: '冬雨季施工增加费', calc_base: 'subdivision', rate: 0.25, category: 'measure', sort_order: 4 },
      { name: '已完工程及设备保护费', calc_base: 'subdivision', rate: 0.10, category: 'measure', sort_order: 5 },
      // 规费
      { name: '社会保险费', calc_base: 'subdivision_labor', rate: 26.00, category: 'regulation', sort_order: 10 },
      { name: '住房公积金', calc_base: 'subdivision_labor', rate: 8.00, category: 'regulation', sort_order: 11 },
      { name: '工程排污费', calc_base: 'subdivision', rate: 0.10, category: 'regulation', sort_order: 12 },
      // 税金
      { name: '增值税', calc_base: 'pretax_total', rate: 9.00, category: 'tax', sort_order: 20 },
    ]
  },
  {
    name: '装饰工程费率',
    description: '重庆2018 装饰工程费率',
    rules: [
      { name: '安全文明施工费', calc_base: 'subdivision', rate: 3.00, category: 'measure', sort_order: 1 },
      { name: '夜间施工增加费', calc_base: 'subdivision', rate: 0.20, category: 'measure', sort_order: 2 },
      { name: '二次搬运费', calc_base: 'subdivision', rate: 0.50, category: 'measure', sort_order: 3 },
      { name: '成品保护费', calc_base: 'subdivision', rate: 0.30, category: 'measure', sort_order: 4 },
      { name: '社会保险费', calc_base: 'subdivision_labor', rate: 26.00, category: 'regulation', sort_order: 10 },
      { name: '住房公积金', calc_base: 'subdivision_labor', rate: 8.00, category: 'regulation', sort_order: 11 },
      { name: '增值税', calc_base: 'pretax_total', rate: 9.00, category: 'tax', sort_order: 20 },
    ]
  },
  {
    name: '安装工程费率',
    description: '重庆2018 安装工程费率',
    rules: [
      { name: '安全文明施工费', calc_base: 'subdivision', rate: 4.00, category: 'measure', sort_order: 1 },
      { name: '夜间施工增加费', calc_base: 'subdivision', rate: 0.20, category: 'measure', sort_order: 2 },
      { name: '高层施工增加费', calc_base: 'subdivision', rate: 0.50, category: 'measure', sort_order: 3 },
      { name: '脚手架搭拆费', calc_base: 'subdivision_labor', rate: 5.00, category: 'measure', sort_order: 4 },
      { name: '社会保险费', calc_base: 'subdivision_labor', rate: 26.00, category: 'regulation', sort_order: 10 },
      { name: '住房公积金', calc_base: 'subdivision_labor', rate: 8.00, category: 'regulation', sort_order: 11 },
      { name: '增值税', calc_base: 'pretax_total', rate: 9.00, category: 'tax', sort_order: 20 },
    ]
  }
]
