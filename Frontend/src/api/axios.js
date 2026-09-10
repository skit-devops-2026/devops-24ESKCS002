// api/axios.js
import axios from 'axios'

const api = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' }
})

api.interceptors.request.use((config) => {
  const stored = localStorage.getItem('ph_user')
  const user   = stored ? JSON.parse(stored) : null
  const userId = user?.id

  if (!userId) return config

  const method = config.method?.toLowerCase()

  if (method === 'get' || method === 'delete') {
    // Append as query param
    config.params = { ...config.params, userId }
  } else {
    // config.data may be a plain object OR a JSON string — handle both
    let body = {}
    if (config.data) {
      body = typeof config.data === 'string' ? JSON.parse(config.data) : config.data
    }
    config.data = { userId, ...body }
  }

  return config
})

export default api