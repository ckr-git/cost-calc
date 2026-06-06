// GB50500 工程量清单项目编码库（mock 数据）
// 编码规则: 12位，前9位国标固定（专业2+章节2+节2+项目3），后3位为项目顺序

export interface BillCodeSeed {
  code: string
  name: string
  unit: string
  chapter: string
  description: string
}

export const billCodes: BillCodeSeed[] = [
  // 010101 土石方工程
  { code: '010101001', name: '平整场地', unit: 'm²', chapter: '土石方工程', description: '土方挖填、找平' },
  { code: '010101002', name: '挖一般土方', unit: 'm³', chapter: '土石方工程', description: '排地表水、土方开挖、围护、运输' },
  { code: '010101003', name: '挖沟槽土方', unit: 'm³', chapter: '土石方工程', description: '排地表水、土方开挖、运输' },
  { code: '010101004', name: '挖基坑土方', unit: 'm³', chapter: '土石方工程', description: '排地表水、土方开挖、运输' },
  { code: '010103001', name: '回填方', unit: 'm³', chapter: '土石方工程', description: '运输、回填、压实' },
  { code: '010103002', name: '余方弃置', unit: 'm³', chapter: '土石方工程', description: '余方点装料运输至弃置点' },

  // 010401 砌筑工程
  { code: '010401001', name: '砖基础', unit: 'm³', chapter: '砌筑工程', description: '砂浆制作运输、砌砖、防潮层铺设' },
  { code: '010401003', name: '实心砖墙', unit: 'm³', chapter: '砌筑工程', description: '砂浆制作运输、砌砖、勾缝' },
  { code: '010401004', name: '多孔砖墙', unit: 'm³', chapter: '砌筑工程', description: '砂浆制作运输、砌砖、勾缝' },
  { code: '010402001', name: '砌块墙', unit: 'm³', chapter: '砌筑工程', description: '砂浆制作运输、砌块安装' },
  { code: '010403001', name: '石基础', unit: 'm³', chapter: '砌筑工程', description: '砂浆制作运输、砌石' },

  // 010501 现浇混凝土基础
  { code: '010501001', name: '垫层', unit: 'm³', chapter: '混凝土及钢筋混凝土工程', description: '混凝土制作运输、浇筑、养护' },
  { code: '010501003', name: '独立基础', unit: 'm³', chapter: '混凝土及钢筋混凝土工程', description: '混凝土制作运输、浇筑、养护' },
  { code: '010501004', name: '满堂基础', unit: 'm³', chapter: '混凝土及钢筋混凝土工程', description: '混凝土制作运输、浇筑、养护' },
  { code: '010502001', name: '矩形柱', unit: 'm³', chapter: '混凝土及钢筋混凝土工程', description: '混凝土制作运输、浇筑、养护' },
  { code: '010503002', name: '矩形梁', unit: 'm³', chapter: '混凝土及钢筋混凝土工程', description: '混凝土制作运输、浇筑、养护' },
  { code: '010505001', name: '有梁板', unit: 'm³', chapter: '混凝土及钢筋混凝土工程', description: '混凝土制作运输、浇筑、养护' },
  { code: '010506001', name: '直形楼梯', unit: 'm²', chapter: '混凝土及钢筋混凝土工程', description: '混凝土制作运输、浇筑、养护' },
  { code: '010515001', name: '现浇构件钢筋', unit: 't', chapter: '混凝土及钢筋混凝土工程', description: '钢筋制作、运输、安装' },

  // 010801 门窗工程
  { code: '010801001', name: '木质门', unit: 'm²', chapter: '门窗工程', description: '门安装、五金安装' },
  { code: '010802001', name: '金属（塑钢）门', unit: 'm²', chapter: '门窗工程', description: '门安装、五金、玻璃安装' },
  { code: '010807001', name: '金属（塑钢、断桥）窗', unit: 'm²', chapter: '门窗工程', description: '窗安装、五金、玻璃安装' },

  // 011101 楼地面装饰
  { code: '011101001', name: '水泥砂浆楼地面', unit: 'm²', chapter: '楼地面装饰工程', description: '基层清理、抹找平层、面层' },
  { code: '011102001', name: '石材楼地面', unit: 'm²', chapter: '楼地面装饰工程', description: '基层清理、面层铺设、嵌缝' },
  { code: '011102003', name: '块料楼地面', unit: 'm²', chapter: '楼地面装饰工程', description: '基层清理、面层铺设、嵌缝' },
  { code: '011104002', name: '竹、木地板', unit: 'm²', chapter: '楼地面装饰工程', description: '基层清理、龙骨铺设、面层铺设' },

  // 011201 墙面抹灰
  { code: '011201001', name: '墙面一般抹灰', unit: 'm²', chapter: '墙柱面装饰工程', description: '基层清理、砂浆制作、抹灰' },
  { code: '011204003', name: '块料墙面', unit: 'm²', chapter: '墙柱面装饰工程', description: '基层清理、面层安装、嵌缝' },
  { code: '011206002', name: '块料柱面', unit: 'm²', chapter: '墙柱面装饰工程', description: '基层清理、面层安装、嵌缝' },

  // 011301 天棚
  { code: '011301001', name: '天棚抹灰', unit: 'm²', chapter: '天棚工程', description: '基层清理、砂浆制作、抹灰' },
  { code: '011302001', name: '吊顶天棚', unit: 'm²', chapter: '天棚工程', description: '龙骨安装、基层板、面层' },

  // 011406 涂料
  { code: '011406001', name: '抹灰面油漆', unit: 'm²', chapter: '油漆涂料裱糊工程', description: '基层清理、刮腻子、刷油漆' },
  { code: '011407001', name: '墙面喷刷涂料', unit: 'm²', chapter: '油漆涂料裱糊工程', description: '基层清理、刮腻子、刷涂料' },

  // 安装-给排水 031001
  { code: '031001001', name: '镀锌钢管', unit: 'm', chapter: '给排水、采暖、燃气工程', description: '管道安装、管件、水压试验' },
  { code: '031001006', name: '塑料管', unit: 'm', chapter: '给排水、采暖、燃气工程', description: '管道安装、管件、水压试验' },
  { code: '031004003', name: '洗脸盆', unit: '组', chapter: '给排水、采暖、燃气工程', description: '器具安装、附件安装' },
  { code: '031004006', name: '大便器', unit: '组', chapter: '给排水、采暖、燃气工程', description: '器具安装、附件安装' },

  // 安装-电气 030404
  { code: '030404017', name: '配电箱', unit: '台', chapter: '电气设备安装工程', description: '本体安装、焊压接线端子、接线' },
  { code: '030411001', name: '配管', unit: 'm', chapter: '电气设备安装工程', description: '电线管路敷设、接地' },
  { code: '030411004', name: '配线', unit: 'm', chapter: '电气设备安装工程', description: '配线、管内穿线' },
  { code: '030412001', name: '普通灯具', unit: '套', chapter: '电气设备安装工程', description: '灯具安装' },
  { code: '030404034', name: '照明开关', unit: '个', chapter: '电气设备安装工程', description: '本体安装' },
  { code: '030404035', name: '插座', unit: '个', chapter: '电气设备安装工程', description: '本体安装' },
]
