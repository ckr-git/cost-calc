import { ipcMain } from 'electron'
import { getDb } from '../database/connection'

export function registerUnitPriceHandlers(): void {
  const db = getDb()

  // 单价文件列表
  ipcMain.handle('unitprice:list', () => {
    return db.prepare('SELECT * FROM unit_price_files ORDER BY id').all()
  })

  // 创建单价文件
  ipcMain.handle('unitprice:create', (_event, data) => {
    const result = db.prepare('INSERT INTO unit_price_files (name, description) VALUES (?, ?)')
      .run(data.name, data.description || '')
    return { id: result.lastInsertRowid, ...data }
  })

  // 删除单价文件
  ipcMain.handle('unitprice:delete', (_event, id: number) => {
    db.prepare('DELETE FROM unit_price_files WHERE id = ?').run(id)
    return { success: true }
  })

  // 获取单价文件中的材料价格列表
  ipcMain.handle('unitprice:materials', (_event, fileId: number, keyword?: string) => {
    let sql = 'SELECT * FROM material_prices WHERE unit_price_file_id = ?'
    const args: any[] = [fileId]
    if (keyword) {
      sql += ' AND (name LIKE ? OR code LIKE ?)'
      args.push(`%${keyword}%`, `%${keyword}%`)
    }
    sql += ' ORDER BY category, code'
    return db.prepare(sql).all(...args)
  })

  // 添加材料到单价文件
  ipcMain.handle('unitprice:addMaterial', (_event, data) => {
    const result = db.prepare(`
      INSERT INTO material_prices (unit_price_file_id, code, name, unit, market_price, quota_price, category)
      VALUES (@unit_price_file_id, @code, @name, @unit, @market_price, @quota_price, @category)
    `).run(data)
    return { id: result.lastInsertRowid, ...data }
  })

  // 更新材料价格（白名单过滤）
  ipcMain.handle('unitprice:updateMaterial', (_event, id: number, data) => {
    const ALLOWED = ['code', 'name', 'unit', 'market_price', 'quota_price', 'category']
    const safe = Object.fromEntries(Object.entries(data).filter(([k]) => ALLOWED.includes(k)))
    if (Object.keys(safe).length === 0) return { id }
    const fields = Object.keys(safe).map((k) => `${k} = @${k}`).join(', ')
    db.prepare(`UPDATE material_prices SET ${fields} WHERE id = @id`).run({ ...safe, id })
    return { id, ...safe }
  })

  // 删除材料
  ipcMain.handle('unitprice:deleteMaterial', (_event, id: number) => {
    db.prepare('DELETE FROM material_prices WHERE id = ?').run(id)
    return { success: true }
  })

  // 批量导入默认人材机（初始化单价文件时使用）
  ipcMain.handle('unitprice:seedDefaults', (_event, fileId: number) => {
    const existing = (db.prepare('SELECT COUNT(*) c FROM material_prices WHERE unit_price_file_id = ?').get(fileId) as any).c
    if (existing > 0) return { message: '已有数据，跳过' }

    const defaults = getDefaultMaterials()
    const stmt = db.prepare(`
      INSERT INTO material_prices (unit_price_file_id, code, name, unit, market_price, quota_price, category)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `)
    const insertAll = db.transaction(() => {
      for (const m of defaults) {
        stmt.run(fileId, m.code, m.name, m.unit, m.market_price, m.quota_price, m.category)
      }
    })
    insertAll()
    return { message: `已导入 ${defaults.length} 条默认人材机` }
  })
}

function getDefaultMaterials() {
  return [
    // 人工
    { code: 'R001', name: '综合人工', unit: '工日', market_price: 120.00, quota_price: 90.00, category: 'labor' },
    { code: 'R002', name: '技术工人', unit: '工日', market_price: 150.00, quota_price: 110.00, category: 'labor' },
    { code: 'R003', name: '普通工人', unit: '工日', market_price: 100.00, quota_price: 80.00, category: 'labor' },
    // 材料
    { code: 'M001', name: 'C30商品混凝土', unit: 'm³', market_price: 420.00, quota_price: 380.00, category: 'material' },
    { code: 'M002', name: 'C25商品混凝土', unit: 'm³', market_price: 390.00, quota_price: 360.00, category: 'material' },
    { code: 'M003', name: 'HRB400钢筋 φ12', unit: 't', market_price: 4200.00, quota_price: 3900.00, category: 'material' },
    { code: 'M004', name: 'HRB400钢筋 φ20', unit: 't', market_price: 4100.00, quota_price: 3850.00, category: 'material' },
    { code: 'M005', name: '标准砖 MU10', unit: '千块', market_price: 380.00, quota_price: 350.00, category: 'material' },
    { code: 'M006', name: 'M5水泥砂浆', unit: 'm³', market_price: 280.00, quota_price: 250.00, category: 'material' },
    { code: 'M007', name: 'M7.5混合砂浆', unit: 'm³', market_price: 310.00, quota_price: 280.00, category: 'material' },
    { code: 'M008', name: '木模板', unit: 'm²', market_price: 45.00, quota_price: 38.00, category: 'material' },
    { code: 'M009', name: '复合模板', unit: 'm²', market_price: 55.00, quota_price: 48.00, category: 'material' },
    { code: 'M010', name: '石膏板', unit: 'm²', market_price: 28.00, quota_price: 24.00, category: 'material' },
    { code: 'M011', name: '600×600地砖', unit: 'm²', market_price: 65.00, quota_price: 55.00, category: 'material' },
    { code: 'M012', name: '乳胶漆', unit: 'kg', market_price: 18.00, quota_price: 15.00, category: 'material' },
    { code: 'M013', name: 'PPR管DN20', unit: 'm', market_price: 8.50, quota_price: 7.00, category: 'material' },
    { code: 'M014', name: 'PVC电线管DN20', unit: 'm', market_price: 4.50, quota_price: 3.50, category: 'material' },
    { code: 'M015', name: 'BV线2.5mm²', unit: 'm', market_price: 2.80, quota_price: 2.30, category: 'material' },
    // 机械
    { code: 'J001', name: '挖掘机 1m³', unit: '台班', market_price: 1800.00, quota_price: 1500.00, category: 'machine' },
    { code: 'J002', name: '塔吊 50t·m', unit: '台班', market_price: 2500.00, quota_price: 2200.00, category: 'machine' },
    { code: 'J003', name: '混凝土泵车', unit: '台班', market_price: 3000.00, quota_price: 2600.00, category: 'machine' },
    { code: 'J004', name: '钢筋弯曲机', unit: '台班', market_price: 350.00, quota_price: 300.00, category: 'machine' },
    { code: 'J005', name: '电焊机', unit: '台班', market_price: 200.00, quota_price: 160.00, category: 'machine' },
  ]
}
