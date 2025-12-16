/**
 * 认证 API 示例
 * 这是一个示例文件，展示如何集成后端 API
 */

// 方式 1: 使用原生 Fetch API
export class AuthAPI {
  private baseURL: string

  constructor(baseURL: string = 'https://your-api.com') {
    this.baseURL = baseURL
  }

  /**
   * 发送验证码到邮箱
   */
  async sendVerificationCode(email: string): Promise<{ success: boolean; message: string }> {
    try {
      const response = await fetch(`${this.baseURL}/api/auth/send-code`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      })

      if (!response.ok) {
        throw new Error('发送验证码失败')
      }

      return await response.json()
    } catch (error) {
      console.error('发送验证码错误:', error)
      throw error
    }
  }

  /**
   * 验证验证码并登录
   */
  async verifyCode(
    email: string,
    code: string
  ): Promise<{
    success: boolean
    token: string
    user: {
      id: string
      email: string
      name: string
    }
  }> {
    try {
      const response = await fetch(`${this.baseURL}/api/auth/verify-code`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, code }),
      })

      if (!response.ok) {
        throw new Error('验证码错误')
      }

      return await response.json()
    } catch (error) {
      console.error('验证验证码错误:', error)
      throw error
    }
  }

  /**
   * Google OAuth 登录
   */
  async googleLogin(token: string): Promise<{
    success: boolean
    token: string
    user: any
  }> {
    try {
      const response = await fetch(`${this.baseURL}/api/auth/google`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token }),
      })

      if (!response.ok) {
        throw new Error('Google 登录失败')
      }

      return await response.json()
    } catch (error) {
      console.error('Google 登录错误:', error)
      throw error
    }
  }

  /**
   * 刷新访问令牌
   */
  async refreshToken(refreshToken: string): Promise<{
    success: boolean
    token: string
  }> {
    try {
      const response = await fetch(`${this.baseURL}/api/auth/refresh`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refreshToken }),
      })

      if (!response.ok) {
        throw new Error('刷新令牌失败')
      }

      return await response.json()
    } catch (error) {
      console.error('刷新令牌错误:', error)
      throw error
    }
  }

  /**
   * 退出登录
   */
  async logout(token: string): Promise<{ success: boolean }> {
    try {
      const response = await fetch(`${this.baseURL}/api/auth/logout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        throw new Error('退出登录失败')
      }

      return await response.json()
    } catch (error) {
      console.error('退出登录错误:', error)
      throw error
    }
  }
}

// 方式 2: 使用 Axios (需要先安装: npm install axios)
/*
import axios, { AxiosInstance } from 'axios'

export class AuthAPIWithAxios {
  private api: AxiosInstance

  constructor(baseURL: string = 'https://your-api.com') {
    this.api = axios.create({
      baseURL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    })

    // 请求拦截器
    this.api.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('token')
        if (token) {
          config.headers.Authorization = `Bearer ${token}`
        }
        return config
      },
      (error) => {
        return Promise.reject(error)
      }
    )

    // 响应拦截器
    this.api.interceptors.response.use(
      (response) => response.data,
      async (error) => {
        if (error.response?.status === 401) {
          // Token 过期，尝试刷新
          const refreshToken = localStorage.getItem('refreshToken')
          if (refreshToken) {
            try {
              const { token } = await this.refreshToken(refreshToken)
              localStorage.setItem('token', token)
              // 重试原请求
              error.config.headers.Authorization = `Bearer ${token}`
              return this.api.request(error.config)
            } catch (refreshError) {
              // 刷新失败，清除令牌并跳转到登录页
              localStorage.removeItem('token')
              localStorage.removeItem('refreshToken')
              window.location.href = '/login'
            }
          }
        }
        return Promise.reject(error)
      }
    )
  }

  async sendVerificationCode(email: string) {
    return await this.api.post('/api/auth/send-code', { email })
  }

  async verifyCode(email: string, code: string) {
    return await this.api.post('/api/auth/verify-code', { email, code })
  }

  async googleLogin(token: string) {
    return await this.api.post('/api/auth/google', { token })
  }

  async refreshToken(refreshToken: string) {
    return await this.api.post('/api/auth/refresh', { refreshToken })
  }

  async logout() {
    return await this.api.post('/api/auth/logout')
  }
}
*/

// 使用示例
export const authAPI = new AuthAPI('https://your-api.com')

// 在组件中使用:
/*
import { authAPI } from '@/api/auth'

const handleEmailSubmit = async () => {
  try {
    const result = await authAPI.sendVerificationCode(email.value)
    if (result.success) {
      // 切换到验证码页面
    }
  } catch (error) {
    // 错误处理
  }
}

const handleCodeSubmit = async () => {
  try {
    const result = await authAPI.verifyCode(email.value, code.value.join(''))
    if (result.success) {
      localStorage.setItem('token', result.token)
      localStorage.setItem('user', JSON.stringify(result.user))
      // 切换到成功页面
    }
  } catch (error) {
    // 错误处理
  }
}
*/
