import express from 'express'
import jwt from 'jsonwebtoken'
import { pool } from '../db.js'

const router = express.Router()

// JWT 验证中间件
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

// 获取文章列表（支持按 type 分类筛选）
router.get('/', async (req, res) => {
  const { type } = req.query
  try {
    let sql = `SELECT id, title, type,
      DATE_FORMAT(updated_at, '%Y-%m-%d %H:%i') AS updated_at,
      DATE_FORMAT(created_at, '%Y-%m-%d %H:%i') AS created_at
      FROM posts`
    const params = []

    if (type) {
      sql += ' WHERE type = ?'
      params.push(type)
    }

    sql += ' ORDER BY updated_at DESC'

    const [rows] = await pool.query(sql, params)
    res.json(rows)
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: '服务器错误' })
  }
})

// 搜索文章（按标题和内容模糊匹配）
router.get('/search/:keyword', async (req, res) => {
  const keyword = `%${req.params.keyword}%`
  try {
    const [rows] = await pool.query(
      `SELECT id, title, type, content,
       DATE_FORMAT(updated_at, '%Y-%m-%d %H:%i') AS updated_at,
       DATE_FORMAT(created_at, '%Y-%m-%d %H:%i') AS created_at
       FROM posts
       WHERE title LIKE ? OR content LIKE ? OR type LIKE ?
       ORDER BY updated_at DESC`,
      [keyword, keyword, keyword]
    )
    res.json(rows)
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: '服务器错误' })
  }
})

// 获取单篇文章
router.get('/:id', async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT id, title, type, content,
       DATE_FORMAT(updated_at, '%Y-%m-%d %H:%i') AS updated_at,
       DATE_FORMAT(created_at, '%Y-%m-%d %H:%i') AS created_at
       FROM posts WHERE id = ?`,
      [req.params.id]
    )
    if (rows.length === 0) return res.status(404).json({ message: '文章不存在' })
    res.json(rows[0])
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: '服务器错误' })
  }
})

// 新建文章（需登录）
router.post('/', auth, async (req, res) => {
  const { title, type = '博客', content } = req.body
  if (!title || !content) {
    return res.status(400).json({ message: '标题和内容不能为空' })
  }

  try {
    const [result] = await pool.query(
      'INSERT INTO posts (title, type, content) VALUES (?, ?, ?)',
      [title, type, content]
    )
    res.json({ message: '创建成功', id: result.insertId })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: '服务器错误' })
  }
})

// 更新文章（需登录）
router.put('/:id', auth, async (req, res) => {
  const { title, type, content } = req.body
  try {
    await pool.query(
      'UPDATE posts SET title = ?, type = ?, content = ? WHERE id = ?',
      [title, type, content, req.params.id]
    )
    res.json({ message: '更新成功' })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: '服务器错误' })
  }
})

// 删除文章（需登录）
router.delete('/:id', auth, async (req, res) => {
  try {
    await pool.query('DELETE FROM posts WHERE id = ?', [req.params.id])
    res.json({ message: '删除成功' })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: '服务器错误' })
  }
})

export default router