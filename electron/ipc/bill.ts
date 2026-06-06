import { ipcMain } from 'electron'
import { getDb } from '../database/connection'

export function registerBillHandlers(): void {
  const db = getDb()

  // 获取工程下的所有清单项（含定额子目）
  ipcMain.handle('bill:getByEngineering', (_event, engineeringId: number) => {
    const bills = db.prepare(`
      SELECT * FROM bill_items WHERE engineering_id = ? ORDER BY sort_order
    `).all(engineeringId) as any[]

    return bills.map((bill) => ({
      ...bill,
      quotas: db.prepare(`
        SELECT * FROM quota_items WHERE bill_item_id = ? ORDER BY sort_order
      `).all(bill.id)
    }))
  })

  // 创建清单项
  ipcMain.handle('bill:create', (_event, data) => {
    const stmt = db.prepare(`
      INSERT INTO bill_items (engineering_id, code, name, unit, quantity, quantity_formula, sort_order)
      VALUES (@engineering_id, @code, @name, @unit, @quantity, @quantity_formula, @sort_order)
    `)
    const maxOrder = (db.prepare(
      'SELECT COALESCE(MAX(sort_order), 0) + 1 as next FROM bill_items WHERE engineering_id = ?'
    ).get(data.engineering_id) as any).next

    const result = stmt.run({ ...data, sort_order: data.sort_order ?? maxOrder })
    return { id: result.lastInsertRowid, ...data }
  })

  // 更新清单项（白名单字段过滤防注入）
  ipcMain.handle('bill:update', (_event, id: number, data) => {
    const ALLOWED = ['code', 'name', 'unit', 'quantity', 'quantity_formula', 'unit_price', 'total_price', 'sort_order']
    const safe = Object.fromEntries(Object.entries(data).filter(([k]) => ALLOWED.includes(k)))
    if (Object.keys(safe).length === 0) return { id }
    const fields = Object.keys(safe).map((k) => `${k} = @${k}`).join(', ')
    db.prepare(`UPDATE bill_items SET ${fields} WHERE id = @id`).run({ ...safe, id })
    // 数量变化时重新计算合价
    if ('quantity' in safe) recalcBillItem(id)
    return { id, ...safe }
  })

  // 删除清单项
  ipcMain.handle('bill:delete', (_event, id: number) => {
    db.prepare('DELETE FROM bill_items WHERE id = ?').run(id)
    return { success: true }
  })

  // 添加定额子目到清单项
  ipcMain.handle('bill:addQuota', (_event, billItemId: number, quotaLibraryId: number, quantity: number) => {
    // 从定额库读取基础数据
    const quota = db.prepare('SELECT * FROM quota_library WHERE id = ?').get(quotaLibraryId) as any
    if (!quota) throw new Error('定额不存在')

    const maxOrder = (db.prepare(
      'SELECT COALESCE(MAX(sort_order), 0) + 1 as next FROM quota_items WHERE bill_item_id = ?'
    ).get(billItemId) as any).next

    const stmt = db.prepare(`
      INSERT INTO quota_items (bill_item_id, quota_code, name, unit, quantity, labor_cost, material_cost, machine_cost, base_price, sort_order)
      VALUES (@bill_item_id, @quota_code, @name, @unit, @quantity, @labor_cost, @material_cost, @machine_cost, @base_price, @sort_order)
    `)
    const result = stmt.run({
      bill_item_id: billItemId,
      quota_code: quota.code,
      name: quota.name,
      unit: quota.unit,
      quantity,
      labor_cost: quota.labor_cost,
      material_cost: quota.material_cost,
      machine_cost: quota.machine_cost,
      base_price: quota.base_price,
      sort_order: maxOrder
    })

    // 重新计算清单项单价
    recalcBillItem(billItemId)

    return { id: result.lastInsertRowid }
  })

  // 更新定额子目（白名单字段过滤防注入）
  ipcMain.handle('bill:updateQuota', (_event, id: number, data) => {
    const ALLOWED = ['quantity', 'labor_cost', 'material_cost', 'machine_cost', 'base_price', 'sort_order']
    const safe = Object.fromEntries(Object.entries(data).filter(([k]) => ALLOWED.includes(k)))
    if (Object.keys(safe).length === 0) return { id }
    const fields = Object.keys(safe).map((k) => `${k} = @${k}`).join(', ')
    db.prepare(`UPDATE quota_items SET ${fields} WHERE id = @id`).run({ ...safe, id })

    // 重新计算父清单项单价
    const quotaItem = db.prepare('SELECT bill_item_id FROM quota_items WHERE id = ?').get(id) as any
    if (quotaItem) recalcBillItem(quotaItem.bill_item_id)

    return { id, ...safe }
  })

  // 删除定额子目
  ipcMain.handle('bill:deleteQuota', (_event, id: number) => {
    const quotaItem = db.prepare('SELECT bill_item_id FROM quota_items WHERE id = ?').get(id) as any
    db.prepare('DELETE FROM quota_items WHERE id = ?').run(id)
    if (quotaItem) recalcBillItem(quotaItem.bill_item_id)
    return { success: true }
  })
}

// 重新计算清单项的综合单价和合价
function recalcBillItem(billItemId: number): void {
  const db = getDb()
  const quotas = db.prepare('SELECT * FROM quota_items WHERE bill_item_id = ?').all(billItemId) as any[]

  // 综合单价 = Σ(定额基价 × 定额工程量)，四舍五入到分
  const unitPrice = round2(quotas.reduce((sum, q) => sum + q.base_price * q.quantity, 0))

  const bill = db.prepare('SELECT quantity FROM bill_items WHERE id = ?').get(billItemId) as any
  const totalPrice = round2(unitPrice * (bill?.quantity || 0))

  db.prepare('UPDATE bill_items SET unit_price = ?, total_price = ? WHERE id = ?')
    .run(unitPrice, totalPrice, billItemId)
}

function round2(n: number): number {
  return Math.round(n * 100) / 100
}
