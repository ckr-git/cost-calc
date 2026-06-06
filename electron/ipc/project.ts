import { ipcMain } from 'electron'
import { getDb } from '../database/connection'

export function registerProjectHandlers(): void {
  const db = getDb()

  // 获取所有项目（含子工程树）
  ipcMain.handle('project:getAll', () => {
    const projects = db.prepare('SELECT * FROM projects ORDER BY created_at DESC').all()
    const engineerings = db.prepare('SELECT * FROM engineering ORDER BY sort_order').all()

    return projects.map((p: any) => ({
      ...p,
      children: buildTree(engineerings.filter((e: any) => e.project_id === p.id))
    }))
  })

  // 创建项目
  ipcMain.handle('project:create', (_event, data) => {
    const stmt = db.prepare('INSERT INTO projects (name, description) VALUES (?, ?)')
    const result = stmt.run(data.name, data.description || '')
    return { id: result.lastInsertRowid, ...data }
  })

  // 更新项目
  ipcMain.handle('project:update', (_event, id, data) => {
    const stmt = db.prepare(`
      UPDATE projects SET name = ?, description = ?, updated_at = datetime('now', 'localtime')
      WHERE id = ?
    `)
    stmt.run(data.name, data.description || '', id)
    return { id, ...data }
  })

  // 删除项目
  ipcMain.handle('project:delete', (_event, id) => {
    db.prepare('DELETE FROM projects WHERE id = ?').run(id)
    return { success: true }
  })

  // 获取项目下的工程列表
  ipcMain.handle('engineering:getByProject', (_event, projectId) => {
    const rows = db.prepare('SELECT * FROM engineering WHERE project_id = ? ORDER BY sort_order').all(projectId)
    return buildTree(rows)
  })

  // 创建工程
  ipcMain.handle('engineering:create', (_event, data) => {
    const stmt = db.prepare(`
      INSERT INTO engineering (project_id, parent_id, name, specialty, unit_price_file, fee_rate_file, sort_order)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `)
    const result = stmt.run(
      data.project_id,
      data.parent_id || null,
      data.name,
      data.specialty || '',
      data.unit_price_file || '',
      data.fee_rate_file || '',
      data.sort_order || 0
    )
    return { id: result.lastInsertRowid, ...data }
  })

  // 更新工程
  ipcMain.handle('engineering:update', (_event, id, data) => {
    const stmt = db.prepare(`
      UPDATE engineering SET name = ?, specialty = ?, unit_price_file = ?, fee_rate_file = ?
      WHERE id = ?
    `)
    stmt.run(data.name, data.specialty || '', data.unit_price_file || '', data.fee_rate_file || '', id)
    return { id, ...data }
  })

  // 删除工程
  ipcMain.handle('engineering:delete', (_event, id) => {
    db.prepare('DELETE FROM engineering WHERE id = ?').run(id)
    return { success: true }
  })
}

// 构建树形结构
function buildTree(items: any[], parentId: number | null = null): any[] {
  return items
    .filter((item: any) => item.parent_id === parentId)
    .map((item: any) => ({
      ...item,
      children: buildTree(items, item.id)
    }))
}
