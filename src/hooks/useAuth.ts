import { useState, useEffect } from 'react'
import { supabase, auth } from '../utils/supabase/client'
import type { User, Session } from '@supabase/supabase-js'

export interface AuthUser {
  id: string
  email: string
  name?: string
  avatar?: string
  provider?: string
}

export function useAuth() {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // 获取初始会话
    checkSession()

    // 监听认证状态变化
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('认证状态变化:', event, session)
        
        setSession(session)
        
        if (session?.user) {
          setUser(transformUser(session.user))
        } else {
          setUser(null)
        }
        
        setLoading(false)
      }
    )

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  const checkSession = async () => {
    try {
      const session = await auth.getSession()
      setSession(session)
      
      if (session?.user) {
        setUser(transformUser(session.user))
      }
    } catch (error) {
      console.error('检查会话错误:', error)
    } finally {
      setLoading(false)
    }
  }

  const transformUser = (supabaseUser: User): AuthUser => {
    return {
      id: supabaseUser.id,
      email: supabaseUser.email || '',
      name: supabaseUser.user_metadata?.full_name || 
            supabaseUser.user_metadata?.name || 
            supabaseUser.email?.split('@')[0],
      avatar: supabaseUser.user_metadata?.avatar_url || 
              supabaseUser.user_metadata?.picture,
      provider: supabaseUser.app_metadata?.provider,
    }
  }

  const signOut = async () => {
    try {
      await auth.signOut()
      setUser(null)
      setSession(null)
    } catch (error) {
      console.error('登出错误:', error)
      throw error
    }
  }

  return {
    user,
    session,
    loading,
    isAuthenticated: !!user,
    signOut,
  }
}
