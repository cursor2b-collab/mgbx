import { createClient } from '@supabase/supabase-js'
import { projectId, publicAnonKey } from './info'

// Supabase 客户端配置
const supabaseUrl = `https://${projectId}.supabase.co`
const supabaseAnonKey = publicAnonKey

// 创建 Supabase 客户端单例
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    flowType: 'pkce', // 推荐使用 PKCE 流程
  }
})

// 认证相关的工具函数
export const auth = {
  // Google 登录
  async signInWithGoogle(redirectTo?: string) {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: redirectTo || `https://cryptonxs.netlify.app/auth/callback`,
        queryParams: {
          access_type: 'offline',
          prompt: 'consent',
        },
      }
    })
    
    if (error) {
      console.error('Google 登录错误:', error)
      throw error
    }
    
    return data
  },

  // GitHub 登录
  async signInWithGithub(redirectTo?: string) {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'github',
      options: {
        redirectTo: redirectTo || `${window.location.origin}/auth/callback`,
      }
    })
    
    if (error) {
      console.error('GitHub 登录错误:', error)
      throw error
    }
    
    return data
  },

  // 邮箱密码登录
  async signInWithEmail(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    
    if (error) {
      console.error('邮箱登录错误:', error)
      throw error
    }
    
    return data
  },

  // 邮箱注册
  async signUpWithEmail(email: string, password: string, metadata?: any) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: metadata,
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      }
    })
    
    if (error) {
      console.error('注册错误:', error)
      throw error
    }
    
    return data
  },

  // 登出
  async signOut() {
    const { error } = await supabase.auth.signOut()
    
    if (error) {
      console.error('登出错误:', error)
      throw error
    }
  },

  // 获取当前会话
  async getSession() {
    const { data, error } = await supabase.auth.getSession()
    
    if (error) {
      console.error('获取会话错误:', error)
      throw error
    }
    
    return data.session
  },

  // 获取当前用户
  async getUser() {
    const { data, error } = await supabase.auth.getUser()
    
    if (error) {
      console.error('获取用户错误:', error)
      throw error
    }
    
    return data.user
  },

  // 刷新会话
  async refreshSession() {
    const { data, error } = await supabase.auth.refreshSession()
    
    if (error) {
      console.error('刷新会话错误:', error)
      throw error
    }
    
    return data.session
  },

  // 监听认证状态变化
  onAuthStateChange(callback: (event: string, session: any) => void) {
    return supabase.auth.onAuthStateChange(callback)
  },

  // 重置密码
  async resetPassword(email: string) {
    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/reset-password`,
    })
    
    if (error) {
      console.error('重置密码错误:', error)
      throw error
    }
    
    return data
  },

  // 更新密码
  async updatePassword(newPassword: string) {
    const { data, error } = await supabase.auth.updateUser({
      password: newPassword,
    })
    
    if (error) {
      console.error('更新密码错误:', error)
      throw error
    }
    
    return data
  },

  // 发送 OTP 验证码到邮箱
  async signInWithOTP(email: string) {
    const { data, error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      }
    })
    
    if (error) {
      console.error('发送 OTP 错误:', error)
      throw error
    }
    
    return data
  },

  // 验证 OTP 代码
  async verifyOTP(email: string, token: string) {
    const { data, error } = await supabase.auth.verifyOtp({
      email,
      token,
      type: 'email'
    })
    
    if (error) {
      console.error('验证 OTP 错误:', error)
      throw error
    }
    
    return data
  },
}

export default supabase
