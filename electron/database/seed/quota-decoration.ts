// 装饰工程定额（重庆2018 mock 数据）
import type { QuotaSeed } from './quota-civil'

export const decorationQuotas: QuotaSeed[] = [
  // 楼地面工程
  { chapter: '楼地面工程', code: 'B1-1', name: '水泥砂浆找平层 20mm', unit: '10m²', base_price: 256.30, labor_cost: 126.30, material_cost: 110.00, machine_cost: 20.00, labor_hours: 1.40 },
  { chapter: '楼地面工程', code: 'B1-5', name: '陶瓷地砖楼地面 周长≤2400mm', unit: '10m²', base_price: 1256.80, labor_cost: 456.80, material_cost: 780.00, machine_cost: 20.00, labor_hours: 5.07 },
  { chapter: '楼地面工程', code: 'B1-6', name: '陶瓷地砖楼地面 周长≤3200mm', unit: '10m²', base_price: 1356.20, labor_cost: 456.20, material_cost: 880.00, machine_cost: 20.00, labor_hours: 5.07 },
  { chapter: '楼地面工程', code: 'B1-10', name: '大理石楼地面', unit: '10m²', base_price: 3256.40, labor_cost: 656.40, material_cost: 2580.00, machine_cost: 20.00, labor_hours: 7.29 },
  { chapter: '楼地面工程', code: 'B1-12', name: '花岗岩楼地面', unit: '10m²', base_price: 3856.20, labor_cost: 656.20, material_cost: 3180.00, machine_cost: 20.00, labor_hours: 7.29 },
  { chapter: '楼地面工程', code: 'B1-15', name: '复合木地板', unit: '10m²', base_price: 1856.30, labor_cost: 356.30, material_cost: 1480.00, machine_cost: 20.00, labor_hours: 3.96 },
  { chapter: '楼地面工程', code: 'B1-20', name: '地毯铺设', unit: '10m²', base_price: 1256.40, labor_cost: 256.40, material_cost: 980.00, machine_cost: 20.00, labor_hours: 2.85 },

  // 墙柱面工程
  { chapter: '墙柱面工程', code: 'B2-1', name: '内墙面一般抹灰 混合砂浆', unit: '10m²', base_price: 256.80, labor_cost: 156.80, material_cost: 80.00, machine_cost: 20.00, labor_hours: 1.74 },
  { chapter: '墙柱面工程', code: 'B2-5', name: '外墙面一般抹灰 水泥砂浆', unit: '10m²', base_price: 326.40, labor_cost: 206.40, material_cost: 100.00, machine_cost: 20.00, labor_hours: 2.29 },
  { chapter: '墙柱面工程', code: 'B2-10', name: '墙面贴瓷砖 周长≤1200mm', unit: '10m²', base_price: 1456.30, labor_cost: 556.30, material_cost: 880.00, machine_cost: 20.00, labor_hours: 6.18 },
  { chapter: '墙柱面工程', code: 'B2-15', name: '墙面挂贴大理石', unit: '10m²', base_price: 4256.80, labor_cost: 856.80, material_cost: 3380.00, machine_cost: 20.00, labor_hours: 9.51 },
  { chapter: '墙柱面工程', code: 'B2-20', name: '墙面干挂花岗岩', unit: '10m²', base_price: 5256.40, labor_cost: 1056.40, material_cost: 3900.00, machine_cost: 300.00, labor_hours: 11.74 },
  { chapter: '墙柱面工程', code: 'B2-25', name: '柱面装饰 不锈钢板', unit: '10m²', base_price: 3856.20, labor_cost: 856.20, material_cost: 2800.00, machine_cost: 200.00, labor_hours: 9.51 },

  // 天棚工程
  { chapter: '天棚工程', code: 'B3-1', name: '天棚抹灰 混合砂浆', unit: '10m²', base_price: 286.40, labor_cost: 186.40, material_cost: 80.00, machine_cost: 20.00, labor_hours: 2.07 },
  { chapter: '天棚工程', code: 'B3-5', name: '轻钢龙骨石膏板吊顶 平面', unit: '10m²', base_price: 856.30, labor_cost: 356.30, material_cost: 480.00, machine_cost: 20.00, labor_hours: 3.96 },
  { chapter: '天棚工程', code: 'B3-6', name: '轻钢龙骨石膏板吊顶 跌级', unit: '10m²', base_price: 1056.20, labor_cost: 456.20, material_cost: 580.00, machine_cost: 20.00, labor_hours: 5.07 },
  { chapter: '天棚工程', code: 'B3-10', name: '铝合金条板吊顶', unit: '10m²', base_price: 1256.40, labor_cost: 356.40, material_cost: 880.00, machine_cost: 20.00, labor_hours: 3.96 },
  { chapter: '天棚工程', code: 'B3-15', name: '矿棉板吊顶', unit: '10m²', base_price: 956.30, labor_cost: 356.30, material_cost: 580.00, machine_cost: 20.00, labor_hours: 3.96 },

  // 油漆涂料工程
  { chapter: '油漆涂料工程', code: 'B4-1', name: '内墙乳胶漆 两遍', unit: '10m²', base_price: 186.40, labor_cost: 106.40, material_cost: 60.00, machine_cost: 20.00, labor_hours: 1.18 },
  { chapter: '油漆涂料工程', code: 'B4-5', name: '外墙涂料 弹性涂料', unit: '10m²', base_price: 326.80, labor_cost: 156.80, material_cost: 150.00, machine_cost: 20.00, labor_hours: 1.74 },
  { chapter: '油漆涂料工程', code: 'B4-10', name: '木材面油漆 调和漆', unit: '10m²', base_price: 256.40, labor_cost: 156.40, material_cost: 80.00, machine_cost: 20.00, labor_hours: 1.74 },
  { chapter: '油漆涂料工程', code: 'B4-15', name: '金属面防锈漆', unit: '10m²', base_price: 226.30, labor_cost: 126.30, material_cost: 80.00, machine_cost: 20.00, labor_hours: 1.40 },

  // 门窗工程
  { chapter: '门窗工程', code: 'B5-1', name: '木质夹板门安装', unit: '10m²', base_price: 3256.40, labor_cost: 656.40, material_cost: 2580.00, machine_cost: 20.00, labor_hours: 7.29 },
  { chapter: '门窗工程', code: 'B5-5', name: '塑钢窗安装', unit: '10m²', base_price: 3856.30, labor_cost: 556.30, material_cost: 3280.00, machine_cost: 20.00, labor_hours: 6.18 },
  { chapter: '门窗工程', code: 'B5-10', name: '铝合金平开窗', unit: '10m²', base_price: 4256.80, labor_cost: 556.80, material_cost: 3680.00, machine_cost: 20.00, labor_hours: 6.18 },
  { chapter: '门窗工程', code: 'B5-15', name: '不锈钢卷帘门', unit: '10m²', base_price: 5856.20, labor_cost: 856.20, material_cost: 4800.00, machine_cost: 200.00, labor_hours: 9.51 },
]
