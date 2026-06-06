// 土建工程定额（重庆2018 mock 数据）
// 字段: chapter 章节 | code 编号 | name 名称 | unit 单位 | base_price 基价 | labor 人工费 | material 材料费 | machine 机械费 | labor_hours 人工工日

export interface QuotaSeed {
  chapter: string
  code: string
  name: string
  unit: string
  base_price: number
  labor_cost: number
  material_cost: number
  machine_cost: number
  labor_hours: number
}

export const civilQuotas: QuotaSeed[] = [
  // 第一章 土石方工程
  { chapter: '土石方工程', code: 'A1-1', name: '人工挖一般土方 一、二类土', unit: '10m³', base_price: 235.80, labor_cost: 235.80, material_cost: 0, machine_cost: 0, labor_hours: 2.62 },
  { chapter: '土石方工程', code: 'A1-2', name: '人工挖一般土方 三类土', unit: '10m³', base_price: 360.90, labor_cost: 360.90, material_cost: 0, machine_cost: 0, labor_hours: 4.01 },
  { chapter: '土石方工程', code: 'A1-3', name: '人工挖一般土方 四类土', unit: '10m³', base_price: 525.60, labor_cost: 525.60, material_cost: 0, machine_cost: 0, labor_hours: 5.84 },
  { chapter: '土石方工程', code: 'A1-8', name: '机械挖一般土方 一、二类土', unit: '10m³', base_price: 38.50, labor_cost: 4.50, material_cost: 0, machine_cost: 34.00, labor_hours: 0.05 },
  { chapter: '土石方工程', code: 'A1-9', name: '机械挖一般土方 三类土', unit: '10m³', base_price: 45.20, labor_cost: 5.40, material_cost: 0, machine_cost: 39.80, labor_hours: 0.06 },
  { chapter: '土石方工程', code: 'A1-15', name: '人工挖基坑 三类土', unit: '10m³', base_price: 486.00, labor_cost: 486.00, material_cost: 0, machine_cost: 0, labor_hours: 5.40 },
  { chapter: '土石方工程', code: 'A1-20', name: '回填土 夯填', unit: '10m³', base_price: 178.20, labor_cost: 156.60, material_cost: 0, machine_cost: 21.60, labor_hours: 1.74 },
  { chapter: '土石方工程', code: 'A1-21', name: '回填土 松填', unit: '10m³', base_price: 89.10, labor_cost: 89.10, material_cost: 0, machine_cost: 0, labor_hours: 0.99 },
  { chapter: '土石方工程', code: 'A1-25', name: '余土外运 运距1km', unit: '10m³', base_price: 156.80, labor_cost: 12.60, material_cost: 0, machine_cost: 144.20, labor_hours: 0.14 },

  // 第二章 桩基工程
  { chapter: '桩基工程', code: 'A2-1', name: '预制钢筋混凝土方桩 桩长≤12m', unit: '10m³', base_price: 4256.30, labor_cost: 685.20, material_cost: 3201.10, machine_cost: 370.00, labor_hours: 7.61 },
  { chapter: '桩基工程', code: 'A2-8', name: '钻孔灌注桩 桩径≤800mm', unit: '10m³', base_price: 3856.70, labor_cost: 562.50, material_cost: 2894.20, machine_cost: 400.00, labor_hours: 6.25 },
  { chapter: '桩基工程', code: 'A2-15', name: '人工挖孔桩 桩芯混凝土', unit: '10m³', base_price: 4512.80, labor_cost: 1256.30, material_cost: 3056.50, machine_cost: 200.00, labor_hours: 13.96 },

  // 第三章 砌筑工程
  { chapter: '砌筑工程', code: 'A3-1', name: '砖基础', unit: '10m³', base_price: 3856.20, labor_cost: 985.60, material_cost: 2780.60, machine_cost: 90.00, labor_hours: 10.95 },
  { chapter: '砌筑工程', code: 'A3-5', name: 'M5水泥砂浆砌标准砖墙 1砖', unit: '10m³', base_price: 4125.80, labor_cost: 1256.40, material_cost: 2769.40, machine_cost: 100.00, labor_hours: 13.96 },
  { chapter: '砌筑工程', code: 'A3-6', name: 'M7.5混合砂浆砌标准砖墙 1砖', unit: '10m³', base_price: 4256.30, labor_cost: 1256.40, material_cost: 2899.90, machine_cost: 100.00, labor_hours: 13.96 },
  { chapter: '砌筑工程', code: 'A3-12', name: '加气混凝土砌块墙 200mm厚', unit: '10m³', base_price: 3256.70, labor_cost: 856.20, material_cost: 2300.50, machine_cost: 100.00, labor_hours: 9.51 },
  { chapter: '砌筑工程', code: 'A3-15', name: '空心砖墙', unit: '10m³', base_price: 3125.40, labor_cost: 925.60, material_cost: 2099.80, machine_cost: 100.00, labor_hours: 10.28 },
  { chapter: '砌筑工程', code: 'A3-20', name: '毛石挡土墙', unit: '10m³', base_price: 2856.30, labor_cost: 1125.60, material_cost: 1630.70, machine_cost: 100.00, labor_hours: 12.51 },

  // 第四章 混凝土及钢筋混凝土工程
  { chapter: '混凝土工程', code: 'A4-1', name: 'C15混凝土 基础垫层', unit: '10m³', base_price: 3568.20, labor_cost: 685.30, material_cost: 2682.90, machine_cost: 200.00, labor_hours: 7.61 },
  { chapter: '混凝土工程', code: 'A4-5', name: 'C30混凝土 独立基础', unit: '10m³', base_price: 4256.80, labor_cost: 756.20, material_cost: 3300.60, machine_cost: 200.00, labor_hours: 8.40 },
  { chapter: '混凝土工程', code: 'A4-8', name: 'C30混凝土 矩形柱', unit: '10m³', base_price: 4856.30, labor_cost: 1256.30, material_cost: 3400.00, machine_cost: 200.00, labor_hours: 13.96 },
  { chapter: '混凝土工程', code: 'A4-12', name: 'C30混凝土 现浇梁', unit: '10m³', base_price: 4756.20, labor_cost: 1156.20, material_cost: 3400.00, machine_cost: 200.00, labor_hours: 12.85 },
  { chapter: '混凝土工程', code: 'A4-15', name: 'C30混凝土 现浇板', unit: '10m³', base_price: 4658.40, labor_cost: 1058.40, material_cost: 3400.00, machine_cost: 200.00, labor_hours: 11.76 },
  { chapter: '混凝土工程', code: 'A4-20', name: 'C30混凝土 现浇楼梯', unit: '10m²', base_price: 856.20, labor_cost: 356.20, material_cost: 450.00, machine_cost: 50.00, labor_hours: 3.96 },
  { chapter: '混凝土工程', code: 'A4-25', name: '现浇构件钢筋 φ10以内', unit: 't', base_price: 5856.30, labor_cost: 856.30, material_cost: 4800.00, machine_cost: 200.00, labor_hours: 9.51 },
  { chapter: '混凝土工程', code: 'A4-26', name: '现浇构件钢筋 φ10以上', unit: 't', base_price: 5456.20, labor_cost: 656.20, material_cost: 4600.00, machine_cost: 200.00, labor_hours: 7.29 },
  { chapter: '混凝土工程', code: 'A4-30', name: '螺纹钢筋接头 φ20', unit: '10个', base_price: 156.80, labor_cost: 56.80, material_cost: 80.00, machine_cost: 20.00, labor_hours: 0.63 },

  // 第五章 模板工程
  { chapter: '模板工程', code: 'A5-1', name: '基础模板 木模', unit: '10m²', base_price: 456.30, labor_cost: 256.30, material_cost: 180.00, machine_cost: 20.00, labor_hours: 2.85 },
  { chapter: '模板工程', code: 'A5-5', name: '矩形柱模板 复合模板', unit: '10m²', base_price: 685.20, labor_cost: 385.20, material_cost: 280.00, machine_cost: 20.00, labor_hours: 4.28 },
  { chapter: '模板工程', code: 'A5-8', name: '梁模板 复合模板', unit: '10m²', base_price: 656.30, labor_cost: 356.30, material_cost: 280.00, machine_cost: 20.00, labor_hours: 3.96 },
  { chapter: '模板工程', code: 'A5-12', name: '板模板 复合模板', unit: '10m²', base_price: 625.40, labor_cost: 325.40, material_cost: 280.00, machine_cost: 20.00, labor_hours: 3.62 },
  { chapter: '模板工程', code: 'A5-15', name: '楼梯模板 木模', unit: '10m²', base_price: 856.20, labor_cost: 556.20, material_cost: 280.00, machine_cost: 20.00, labor_hours: 6.18 },

  // 第六章 金属结构工程
  { chapter: '金属结构工程', code: 'A6-1', name: '钢柱制作', unit: 't', base_price: 6856.30, labor_cost: 1256.30, material_cost: 5200.00, machine_cost: 400.00, labor_hours: 13.96 },
  { chapter: '金属结构工程', code: 'A6-5', name: '钢梁制作', unit: 't', base_price: 6756.20, labor_cost: 1156.20, material_cost: 5200.00, machine_cost: 400.00, labor_hours: 12.85 },
  { chapter: '金属结构工程', code: 'A6-10', name: '钢结构安装', unit: 't', base_price: 856.30, labor_cost: 456.30, material_cost: 100.00, machine_cost: 300.00, labor_hours: 5.07 },
]
