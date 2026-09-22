import mysql from 'mysql2/promise'
import fs from 'fs'
import dotenv from 'dotenv'

dotenv.config()

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  charset: 'utf8mb4'
})

async function exportData() {
  try {
    const [tables] = await pool.query('SHOW TABLES')
    const tableNames = tables.map(row => Object.values(row)[0])
    let sql = ''

    for (const table of tableNames) {
      const [rows] = await pool.query(`SELECT * FROM \`${table}\``)
      const [create] = await pool.query(`SHOW CREATE TABLE \`${table}\``)
      sql += `DROP TABLE IF EXISTS \`${table}\`;\n`
      sql += create[0]['Create Table'] + ';\n\n'
      for (const row of rows) {
        const values = Object.values(row).map(v => v === null ? 'NULL' : `'${String(v).replace(/'/g, "''")}'`).join(', ')
        sql += `INSERT INTO \`${table}\` VALUES (${values});\n`
      }
      sql += '\n'
    }

    fs.writeFileSync('blog_backup.sql', sql)
    console.log('导出成功：blog_backup.sql')
    process.exit(0)
  } catch (err) {
    console.error('导出失败：', err.message)
    process.exit(1)
  }
}

exportData()