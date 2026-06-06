// 安装工程定额（重庆2018 mock 数据）- 给排水/电气
import type { QuotaSeed } from './quota-civil'

export const installQuotas: QuotaSeed[] = [
  // 给排水工程
  { chapter: '给排水工程', code: 'C1-1', name: '镀锌钢管 DN15 螺纹连接', unit: '10m', base_price: 156.80, labor_cost: 86.80, material_cost: 60.00, machine_cost: 10.00, labor_hours: 0.96 },
  { chapter: '给排水工程', code: 'C1-2', name: '镀锌钢管 DN25 螺纹连接', unit: '10m', base_price: 226.40, labor_cost: 106.40, material_cost: 110.00, machine_cost: 10.00, labor_hours: 1.18 },
  { chapter: '给排水工程', code: 'C1-5', name: 'PPR给水管 DN20 热熔连接', unit: '10m', base_price: 186.30, labor_cost: 96.30, material_cost: 80.00, machine_cost: 10.00, labor_hours: 1.07 },
  { chapter: '给排水工程', code: 'C1-6', name: 'PPR给水管 DN32 热熔连接', unit: '10m', base_price: 256.40, labor_cost: 116.40, material_cost: 130.00, machine_cost: 10.00, labor_hours: 1.29 },
  { chapter: '给排水工程', code: 'C1-10', name: 'UPVC排水管 DN110 粘接', unit: '10m', base_price: 326.80, labor_cost: 126.80, material_cost: 190.00, machine_cost: 10.00, labor_hours: 1.40 },
  { chapter: '给排水工程', code: 'C1-15', name: '截止阀 DN25', unit: '个', base_price: 86.40, labor_cost: 26.40, material_cost: 55.00, machine_cost: 5.00, labor_hours: 0.29 },
  { chapter: '给排水工程', code: 'C1-20', name: '坐式大便器安装', unit: '套', base_price: 456.30, labor_cost: 156.30, material_cost: 290.00, machine_cost: 10.00, labor_hours: 1.74 },
  { chapter: '给排水工程', code: 'C1-21', name: '洗脸盆安装', unit: '套', base_price: 356.40, labor_cost: 126.40, material_cost: 220.00, machine_cost: 10.00, labor_hours: 1.40 },
  { chapter: '给排水工程', code: 'C1-25', name: '地漏安装 DN50', unit: '个', base_price: 56.30, labor_cost: 26.30, material_cost: 25.00, machine_cost: 5.00, labor_hours: 0.29 },

  // 电气工程
  { chapter: '电气工程', code: 'C2-1', name: 'PVC管暗敷 DN20', unit: '10m', base_price: 126.40, labor_cost: 76.40, material_cost: 40.00, machine_cost: 10.00, labor_hours: 0.85 },
  { chapter: '电气工程', code: 'C2-2', name: 'PVC管暗敷 DN25', unit: '10m', base_price: 146.80, labor_cost: 86.80, material_cost: 50.00, machine_cost: 10.00, labor_hours: 0.96 },
  { chapter: '电气工程', code: 'C2-5', name: 'BV电线 2.5mm² 管内穿线', unit: '10m', base_price: 56.30, labor_cost: 26.30, material_cost: 25.00, machine_cost: 5.00, labor_hours: 0.29 },
  { chapter: '电气工程', code: 'C2-6', name: 'BV电线 4mm² 管内穿线', unit: '10m', base_price: 76.40, labor_cost: 36.40, material_cost: 35.00, machine_cost: 5.00, labor_hours: 0.40 },
  { chapter: '电气工程', code: 'C2-10', name: 'YJV电缆 4×16mm² 敷设', unit: '10m', base_price: 856.30, labor_cost: 156.30, material_cost: 680.00, machine_cost: 20.00, labor_hours: 1.74 },
  { chapter: '电气工程', code: 'C2-15', name: '照明配电箱安装 半周长≤1m', unit: '台', base_price: 456.40, labor_cost: 256.40, material_cost: 180.00, machine_cost: 20.00, labor_hours: 2.85 },
  { chapter: '电气工程', code: 'C2-20', name: '单联单控开关安装', unit: '套', base_price: 36.30, labor_cost: 16.30, material_cost: 18.00, machine_cost: 2.00, labor_hours: 0.18 },
  { chapter: '电气工程', code: 'C2-21', name: '五孔插座安装', unit: '套', base_price: 46.40, labor_cost: 16.40, material_cost: 28.00, machine_cost: 2.00, labor_hours: 0.18 },
  { chapter: '电气工程', code: 'C2-25', name: '吸顶灯安装', unit: '套', base_price: 86.30, labor_cost: 36.30, material_cost: 48.00, machine_cost: 2.00, labor_hours: 0.40 },
  { chapter: '电气工程', code: 'C2-30', name: 'LED筒灯安装', unit: '套', base_price: 66.40, labor_cost: 26.40, material_cost: 38.00, machine_cost: 2.00, labor_hours: 0.29 },

  // 通风空调工程
  { chapter: '通风空调工程', code: 'C3-1', name: '镀锌钢板风管 周长≤2000mm', unit: '10m²', base_price: 1256.30, labor_cost: 456.30, material_cost: 780.00, machine_cost: 20.00, labor_hours: 5.07 },
  { chapter: '通风空调工程', code: 'C3-5', name: '风机盘管安装 卧式暗装', unit: '台', base_price: 856.40, labor_cost: 256.40, material_cost: 580.00, machine_cost: 20.00, labor_hours: 2.85 },
  { chapter: '通风空调工程', code: 'C3-10', name: '分体空调安装 挂壁式', unit: '台', base_price: 656.30, labor_cost: 256.30, material_cost: 380.00, machine_cost: 20.00, labor_hours: 2.85 },
]
