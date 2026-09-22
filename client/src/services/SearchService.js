// src/services/SearchService.js
import { postApi } from './api'

/**
 * 搜索服务：调用后端接口
 */
export async function search(keyword) {
  const kw = keyword.trim()
  if (!kw) return []

  const res = await fetch(`/api/posts/search/${encodeURIComponent(kw)}`)
  if (!res.ok) {
    throw new Error('搜索失败')
  }

  const list = await res.json()
  // 转换为搜索页需要的格式
  return list.map(item => ({
    id: `post-${item.id}`,
    type: item.type,
    title: item.title,
    time: item.updated_at || '',
    content: item.content,
    rawMd: item.content
  }))
}