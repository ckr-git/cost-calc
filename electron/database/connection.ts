import Database from 'better-sqlite3'
import path from 'path'
import { app } from 'electron'
import { seedSystemData } from './seed'

let db: Database.Database

export function getDb(): Database.Database {
  if (!db) {
    throw new Error('Database not initialized')
  }
  return db
}

export function initDatabase(): void {
  const dbPath = path.join(app.getPath('userData'), 'cost-calc.db')
  db = new Database(dbPath)

  // 启用 WAL 模式提升性能
  db.pragma('journal_mode = WAL')
  db.pragma('foreign_keys = ON')

  runMigrations()
  seedSystemData()
}

function runMigrations(): void {
  const db = getDb()

  db.exec(`
    CREATE TABLE IF NOT EXISTS projects (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      description TEXT DEFAULT '',
      quota_version TEXT DEFAULT '重庆定额(2018)',
      created_at TEXT DEFAULT (datetime('now', 'localtime')),
      updated_at TEXT DEFAULT (datetime('now', 'localtime'))
    );

    CREATE TABLE IF NOT EXISTS engineering (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      project_id INTEGER NOT NULL,
      parent_id INTEGER DEFAULT NULL,
      name TEXT NOT NULL,
      specialty TEXT DEFAULT '',
      unit_price_file TEXT DEFAULT '',
      fee_rate_file TEXT DEFAULT '',
      sort_order INTEGER DEFAULT 0,
      created_at TEXT DEFAULT (datetime('now', 'localtime')),
      FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
      FOREIGN KEY (parent_id) REFERENCES engineering(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS bill_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      engineering_id INTEGER NOT NULL,
      code TEXT DEFAULT '',
      name TEXT NOT NULL,
      unit TEXT DEFAULT '',
      quantity REAL DEFAULT 0,
      quantity_formula TEXT DEFAULT '',
      unit_price REAL DEFAULT 0,
      total_price REAL DEFAULT 0,
      sort_order INTEGER DEFAULT 0,
      FOREIGN KEY (engineering_id) REFERENCES engineering(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS quota_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      bill_item_id INTEGER NOT NULL,
      quota_code TEXT DEFAULT '',
      name TEXT NOT NULL,
      unit TEXT DEFAULT '',
      quantity REAL DEFAULT 0,
      labor_cost REAL DEFAULT 0,
      material_cost REAL DEFAULT 0,
      machine_cost REAL DEFAULT 0,
      base_price REAL DEFAULT 0,
      sort_order INTEGER DEFAULT 0,
      FOREIGN KEY (bill_item_id) REFERENCES bill_items(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS quota_library (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      chapter TEXT NOT NULL,
      code TEXT NOT NULL UNIQUE,
      name TEXT NOT NULL,
      unit TEXT DEFAULT '',
      base_price REAL DEFAULT 0,
      labor_cost REAL DEFAULT 0,
      material_cost REAL DEFAULT 0,
      machine_cost REAL DEFAULT 0,
      labor_hours REAL DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS bill_code_library (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      code TEXT NOT NULL UNIQUE,
      name TEXT NOT NULL,
      unit TEXT DEFAULT '',
      chapter TEXT DEFAULT '',
      description TEXT DEFAULT ''
    );

    CREATE TABLE IF NOT EXISTS fee_rate_files (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      description TEXT DEFAULT '',
      created_at TEXT DEFAULT (datetime('now', 'localtime'))
    );

    CREATE TABLE IF NOT EXISTS fee_rules (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      fee_rate_file_id INTEGER NOT NULL,
      name TEXT NOT NULL,
      calc_base TEXT NOT NULL,
      rate REAL DEFAULT 0,
      sort_order INTEGER DEFAULT 0,
      category TEXT DEFAULT 'measure',
      FOREIGN KEY (fee_rate_file_id) REFERENCES fee_rate_files(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS unit_price_files (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      description TEXT DEFAULT '',
      created_at TEXT DEFAULT (datetime('now', 'localtime'))
    );

    CREATE TABLE IF NOT EXISTS material_prices (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      unit_price_file_id INTEGER NOT NULL,
      code TEXT DEFAULT '',
      name TEXT NOT NULL,
      unit TEXT DEFAULT '',
      market_price REAL DEFAULT 0,
      quota_price REAL DEFAULT 0,
      category TEXT DEFAULT 'material',
      FOREIGN KEY (unit_price_file_id) REFERENCES unit_price_files(id) ON DELETE CASCADE
    );
  `)
}
