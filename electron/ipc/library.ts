import { ipcMain } from 'electron'
import { getDb } from '../database/connection'

export function registerLibraryHandlers(): void {
  const db = getDb()

  // 定额库查询（支持按章节、关键词过滤）
  ipcMain.handle('library:quotas', (_event, params = {}) => {
    const { keyword, chapter } = params
    let sql = 'SELECT * FROM quota_library WHERE 1=1'
    const args: any[] = []
    if (chapter) {
      sql += ' AND chapter = ?'
      args.push(chapter)
    }
    if (keyword) {
      sql += ' AND (name LIKE ? OR code LIKE ?)'
      args.push(`%${keyword}%`, `%${keyword}%`)
    }
    sql += ' ORDER BY code'
    return db.prepare(sql).all(...args)
  })

  // 定额库章节列表
  ipcMain.handle('library:quotaChapters', () => {
    return db.prepare('SELECT DISTINCT chapter FROM quota_library ORDER BY code').all()
      .map((r: any) => r.chapter)
  })

  // 清单编码库查询
  ipcMain.handle('library:billCodes', (_event, params = {}) => {
    const { keyword, chapter } = params
    let sql = 'SELECT * FROM bill_code_library WHERE 1=1'
    const args: any[] = []
    if (chapter) {
      sql += ' AND chapter = ?'
      args.push(chapter)
    }
    if (keyword) {
      sql += ' AND (name LIKE ? OR code LIKE ?)'
      args.push(`%${keyword}%`, `%${keyword}%`)
    }
    sql += ' ORDER BY code'
    return db.prepare(sql).all(...args)
  })

  // 清单编码章节列表
  ipcMain.handle('library:billChapters', () => {
    return db.prepare('SELECT DISTINCT chapter FROM bill_code_library ORDER BY code').all()
      .map((r: any) => r.chapter)
  })

  // 费率文件列表
  ipcMain.handle('library:feeRateFiles', () => {
    return db.prepare('SELECT * FROM fee_rate_files ORDER BY id').all()
  })

  // 费率文件明细规则
  ipcMain.handle('library:feeRules', (_event, fileId) => {
    return db.prepare('SELECT * FROM fee_rules WHERE fee_rate_file_id = ? ORDER BY sort_order').all(fileId)
  })
}
