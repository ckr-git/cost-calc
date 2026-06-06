import { getDb } from '../connection'
import { civilQuotas } from './quota-civil'
import { decorationQuotas } from './quota-decoration'
import { installQuotas } from './quota-install'
import { billCodes } from './bill-codes'
import { feeRateFiles } from './fee-rates'

// 检查是否已初始化系统数据，未初始化则写入 seed
export function seedSystemData(): void {
  const db = getDb()

  const quotaCount = (db.prepare('SELECT COUNT(*) as c FROM quota_library').get() as any).c
  if (quotaCount === 0) {
    seedQuotas()
  }

  const billCount = (db.prepare('SELECT COUNT(*) as c FROM bill_code_library').get() as any).c
  if (billCount === 0) {
    seedBillCodes()
  }

  const feeCount = (db.prepare('SELECT COUNT(*) as c FROM fee_rate_files').get() as any).c
  if (feeCount === 0) {
    seedFeeRates()
  }
}

function seedQuotas(): void {
  const db = getDb()
  const allQuotas = [...civilQuotas, ...decorationQuotas, ...installQuotas]

  const stmt = db.prepare(`
    INSERT INTO quota_library (chapter, code, name, unit, base_price, labor_cost, material_cost, machine_cost, labor_hours)
    VALUES (@chapter, @code, @name, @unit, @base_price, @labor_cost, @material_cost, @machine_cost, @labor_hours)
  `)

  const insertMany = db.transaction((quotas: typeof allQuotas) => {
    for (const q of quotas) stmt.run(q)
  })
  insertMany(allQuotas)
  console.log(`[Seed] ${allQuotas.length} quota items inserted`)
}

function seedBillCodes(): void {
  const db = getDb()
  const stmt = db.prepare(`
    INSERT INTO bill_code_library (code, name, unit, chapter, description)
    VALUES (@code, @name, @unit, @chapter, @description)
  `)
  const insertMany = db.transaction((codes: typeof billCodes) => {
    for (const c of codes) stmt.run(c)
  })
  insertMany(billCodes)
  console.log(`[Seed] ${billCodes.length} bill codes inserted`)
}

function seedFeeRates(): void {
  const db = getDb()
  const fileStmt = db.prepare(`
    INSERT INTO fee_rate_files (name, description) VALUES (@name, @description)
  `)
  const ruleStmt = db.prepare(`
    INSERT INTO fee_rules (fee_rate_file_id, name, calc_base, rate, category, sort_order)
    VALUES (@fee_rate_file_id, @name, @calc_base, @rate, @category, @sort_order)
  `)

  const insertAll = db.transaction(() => {
    for (const file of feeRateFiles) {
      const result = fileStmt.run({ name: file.name, description: file.description })
      const fileId = result.lastInsertRowid as number
      for (const rule of file.rules) {
        ruleStmt.run({ fee_rate_file_id: fileId, ...rule })
      }
    }
  })
  insertAll()
  console.log(`[Seed] ${feeRateFiles.length} fee rate files inserted`)
}
