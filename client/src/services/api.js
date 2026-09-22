// src/services/api.js
const BASE_URL = '/api'

/**
 * 通用请求封装
 * @param {string} url - 接口路径（不含 BASE_URL）
 * @param {object} options - fetch 配置
 */
async function request(url, options = {}) {
  const token = localStorage.getItem('token')

  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {})
  }

  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }

  const res = await fetch(`${BASE_URL}${url}`, { ...options, headers })

  // 尝试解析 JSON
  let data = null
  try {
    data = await res.json()
  } catch {
    data = { message: '服务器返回数据格式错误' }
  }

  if (!res.ok) {
    throw new Error(data.message || `请求失败 (${res.status})`)
  }

  return data
}

// 认证
export const authApi = {
  register: (username, password, inviteCode) =>
    request('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ username, password, inviteCode })
    }),

  login: (username, password) =>
    request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password })
    })
}

// 文章
export const postApi = {
  list: () => request('/posts'),

  get: (id) => request(`/posts/${id}`),

  create: (post) =>
    request('/posts', {
      method: 'POST',
      body: JSON.stringify(post)
    }),

  update: (id, post) =>
    request(`/posts/${id}`, {
      method: 'PUT',
      body: JSON.stringify(post)
    }),

  remove: (id) =>
    request(`/posts/${id}`, { method: 'DELETE' })
}