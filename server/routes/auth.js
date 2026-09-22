import express from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { pool } from '../db.js'

const router = express.Router()

// 注册
router.post('/register', async (req, res) => {
  const { username, password, inviteCode } = req.body
  if (!username || !password || !inviteCode) {
    return res.status(400).json({ message: '用户名、密码、邀请码都不能为空' })
  }

  try {
    const [codes] = await pool.query(
      'SELECT * FROM invite_codes WHERE code = ? AND used = 0',
      [inviteCode]
    )
    if (codes.length === 0) {
      return res.status(400).json({ message: '邀请码无效或已被使用' })
    }

    const [existing] = await pool.query('SELECT id FROM users WHERE username = ?', [username])
    if (existing.length > 0) {
      return res.status(400).json({ message: '用户名已存在' })
    }

    const hashed = await bcrypt.hash(password, 10)
    await pool.query('INSERT INTO users (username, password) VALUES (?, ?)', [username, hashed])

    await pool.query(
      'UPDATE invite_codes SET used = 1, used_by = ?, used_at = NOW() WHERE code = ?',
      [username, inviteCode]
    )

    res.json({ message: '注册成功' })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: '服务器错误' })
  }
})

// 中间件：验证用户身份
function auth(req, res, next) {
  const header = req.headers.authorization
  if (!header) return res.status(401).json({ message: '未登录' })
  const token = header.split(' ')[1]
  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET)
    next()
  } catch {
    res.status(401).json({ message: '登录已过期，请重新登录' })
  }
}

function adminOnly(req, res, next) {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: '只有管理员才能执行此操作' })
  }
  next()
}

router.post('/invite-code', auth, adminOnly, async (req, res) => {
  try {
    // 先把之前没用过的码全部作废
    await pool.query('UPDATE invite_codes SET used = 1, used_by = "expired", used_at = NOW() WHERE used = 0')

    // 再生成一个新的
    const code = 'YVES-' + Math.random().toString(36).slice(2, 8).toUpperCase()
    await pool.query('INSERT INTO invite_codes (code) VALUES (?)', [code])
    res.json({ code })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: '服务器错误' })
  }
})

// 登录
router.post('/login', async (req, res) => {
  const { username, password } = req.body
  if (!username || !password) {
    return res.status(400).json({ message: '用户名和密码不能为空' })
  }

  try {
    const [rows] = await pool.query('SELECT * FROM users WHERE username = ?', [username])
    if (rows.length === 0) {
      return res.status(400).json({ message: '用户名或密码错误' })
    }

    const user = rows[0]
    const ok = await bcrypt.compare(password, user.password)
    if (!ok) {
      return res.status(400).json({ message: '用户名或密码错误' })
    }

    const token = jwt.sign(
    { id: user.id, username: user.username, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  )

  res.json({ message: '登录成功', token, username: user.username, role: user.role })

  } catch (err) {
    console.error(err)
    res.status(500).json({ message: '服务器错误' })
  }
})

export default router