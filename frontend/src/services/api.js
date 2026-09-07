import {API_BASE_URL} from '../config/api'

const getToken = () => localStorage.getItem('ordercareToken')

const request = async (path, options = {}) => {
  const headers = {...(options.headers || {})}

  if (options.body !== undefined && !headers['Content-Type']) {
    headers['Content-Type'] = 'application/json'
  }

  const token = getToken()
  if (token) {
    headers.Authorization = `Bearer ${token}`
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
  })

  const data = await response.json().catch(() => ({}))

  if (response.status === 401) {
    localStorage.removeItem('ordercareToken')
    localStorage.removeItem('ordercareUser')
  }

  if (!response.ok) {
    throw new Error(data.message || 'Something went wrong.')
  }

  return data
}

export const api = {
  get: path => request(path),
  post: (path, body) => request(path, {method: 'POST', body: JSON.stringify(body)}),
  patch: (path, body = {}) => request(path, {method: 'PATCH', body: JSON.stringify(body)}),
}
