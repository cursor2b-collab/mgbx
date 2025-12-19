import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

interface ProtectedRouteProps {
  children: React.ReactNode
  redirectTo?: string
}

/**
 * 受保护的路由组件
 * 如果用户未登录，自动重定向到登录页
 */
export function ProtectedRoute({ children, redirectTo = '/login' }: ProtectedRouteProps) {
  const { isAuthenticated, loading } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      navigate(redirectTo, { replace: true })
    }
  }, [isAuthenticated, loading, navigate, redirectTo])

  // 加载中显示加载状态
  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        backgroundColor: '#000000',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{ textAlign: 'center' }}>
          <img 
            src="/logo.1730b8a9.gif" 
            alt="Loading..." 
            style={{
              maxWidth: '200px',
              height: 'auto'
            }}
          />
        </div>
      </div>
    )
  }

  // 未认证时不渲染内容（将重定向）
  if (!isAuthenticated) {
    return null
  }

  // 已认证，渲染子组件
  return <>{children}</>
}
