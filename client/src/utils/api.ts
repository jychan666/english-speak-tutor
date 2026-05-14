import axios from 'axios'

const DEVICE_TOKEN_KEY = 'english-speak-device-token'

function getDeviceToken(): string | null {
  try {
    return localStorage.getItem(DEVICE_TOKEN_KEY)
  } catch {
    return null
  }
}

function setDeviceToken(token: string): void {
  try {
    localStorage.setItem(DEVICE_TOKEN_KEY, token)
  } catch {
    // localStorage unavailable (incognito, etc.), silently fail
  }
}

const api = axios.create({
  baseURL: '/',
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
})

// Request interceptor: automatically attach device token
api.interceptors.request.use((config) => {
  const token = getDeviceToken()
  if (token) {
    config.headers['X-Device-Token'] = token
  }
  return config
})

// Response interceptor: automatically store server-returned token
api.interceptors.response.use(
  (response) => {
    const token = response.headers['x-device-token']
    if (token && typeof token === 'string') {
      setDeviceToken(token)
    }
    return response
  },
  (error) => {
    console.error('API Error:', error.message)
    return Promise.reject(error)
  }
)

export { api }
