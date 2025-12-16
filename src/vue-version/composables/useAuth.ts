/**
 * 认证相关的组合式函数
 * 提供可复用的认证逻辑
 */

import { ref, computed } from 'vue'

export interface User {
  id: string
  email: string
  name: string
  avatar?: string
}

export interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
}

/**
 * 认证状态管理
 */
export function useAuth() {
  const user = ref<User | null>(null)
  const token = ref<string | null>(localStorage.getItem('token'))
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  const isAuthenticated = computed(() => !!token.value && !!user.value)

  /**
   * 初始化用户信息
   */
  const initUser = () => {
    const storedUser = localStorage.getItem('user')
    if (storedUser) {
      try {
        user.value = JSON.parse(storedUser)
      } catch (e) {
        console.error('解析用户信息失败:', e)
        localStorage.removeItem('user')
      }
    }
  }

  /**
   * 登录
   */
  const login = async (email: string, code: string) => {
    isLoading.value = true
    error.value = null

    try {
      // TODO: 替换为实际的 API 调用
      const response = await fetch('/api/auth/verify-code', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, code }),
      })

      if (!response.ok) {
        throw new Error('登录失败')
      }

      const data = await response.json()

      token.value = data.token
      user.value = data.user

      localStorage.setItem('token', data.token)
      localStorage.setItem('user', JSON.stringify(data.user))

      return { success: true, data }
    } catch (e) {
      error.value = e instanceof Error ? e.message : '登录失败'
      return { success: false, error: error.value }
    } finally {
      isLoading.value = false
    }
  }

  /**
   * 退出登录
   */
  const logout = () => {
    token.value = null
    user.value = null
    error.value = null

    localStorage.removeItem('token')
    localStorage.removeItem('user')
  }

  /**
   * 更新用户信息
   */
  const updateUser = (updates: Partial<User>) => {
    if (user.value) {
      user.value = { ...user.value, ...updates }
      localStorage.setItem('user', JSON.stringify(user.value))
    }
  }

  // 初始化
  initUser()

  return {
    user,
    token,
    isLoading,
    error,
    isAuthenticated,
    login,
    logout,
    updateUser,
  }
}

/**
 * 验证码发送逻辑
 */
export function useVerificationCode() {
  const isLoading = ref(false)
  const error = ref<string | null>(null)
  const cooldown = ref(0)
  let timer: number | null = null

  /**
   * 发送验证码
   */
  const sendCode = async (email: string) => {
    if (cooldown.value > 0) {
      error.value = `请等待 ${cooldown.value} 秒后重试`
      return { success: false, error: error.value }
    }

    isLoading.value = true
    error.value = null

    try {
      // TODO: 替换为实际的 API 调用
      const response = await fetch('/api/auth/send-code', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      })

      if (!response.ok) {
        throw new Error('发送验证码失败')
      }

      // 启动倒计时（60秒）
      startCooldown(60)

      return { success: true }
    } catch (e) {
      error.value = e instanceof Error ? e.message : '发送验证码失败'
      return { success: false, error: error.value }
    } finally {
      isLoading.value = false
    }
  }

  /**
   * 启动冷却倒计时
   */
  const startCooldown = (seconds: number) => {
    cooldown.value = seconds

    if (timer) {
      clearInterval(timer)
    }

    timer = window.setInterval(() => {
      cooldown.value--
      if (cooldown.value <= 0) {
        if (timer) {
          clearInterval(timer)
          timer = null
        }
      }
    }, 1000)
  }

  /**
   * 清理定时器
   */
  const cleanup = () => {
    if (timer) {
      clearInterval(timer)
      timer = null
    }
  }

  return {
    isLoading,
    error,
    cooldown,
    sendCode,
    cleanup,
  }
}

/**
 * 表单验证
 */
export function useFormValidation() {
  const errors = ref<Record<string, string>>({})

  /**
   * 验证邮箱
   */
  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!email) {
      errors.value.email = '请输入邮箱地址'
      return false
    }
    if (!emailRegex.test(email)) {
      errors.value.email = '邮箱格式不正确'
      return false
    }
    delete errors.value.email
    return true
  }

  /**
   * 验证验证码
   */
  const validateCode = (code: string[]): boolean => {
    if (code.some(digit => !digit)) {
      errors.value.code = '请输入完整的验证码'
      return false
    }
    if (code.some(digit => !/^\d$/.test(digit))) {
      errors.value.code = '验证码只能包含数字'
      return false
    }
    delete errors.value.code
    return true
  }

  /**
   * 清除错误
   */
  const clearError = (field: string) => {
    delete errors.value[field]
  }

  /**
   * 清除所有错误
   */
  const clearAllErrors = () => {
    errors.value = {}
  }

  return {
    errors,
    validateEmail,
    validateCode,
    clearError,
    clearAllErrors,
  }
}

/**
 * Google OAuth 登录
 */
export function useGoogleAuth() {
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  /**
   * 初始化 Google 登录
   */
  const initGoogleLogin = () => {
    // TODO: 加载 Google OAuth SDK
    // 参考: https://developers.google.com/identity/gsi/web/guides/overview
  }

  /**
   * 处理 Google 登录
   */
  const loginWithGoogle = async () => {
    isLoading.value = true
    error.value = null

    try {
      // TODO: 实现 Google OAuth 流程
      // 1. 获取 Google 令牌
      // 2. 发送到后端验证
      // 3. 获取用户信息和访问令牌

      return { success: true }
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Google 登录失败'
      return { success: false, error: error.value }
    } finally {
      isLoading.value = false
    }
  }

  return {
    isLoading,
    error,
    initGoogleLogin,
    loginWithGoogle,
  }
}
