import { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { auth, supabase } from '../../utils/supabase/client';

interface AdminProtectedRouteProps {
  children: React.ReactNode;
}

export function AdminProtectedRoute({ children }: AdminProtectedRouteProps) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    let isMounted = true;
    let hasInitialSession = false;
    
    // 设置监听器监听认证状态变化 - 必须最先设置
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('认证状态变化:', event, session?.user?.email);
      
      if (!isMounted) return;
      
      if (event === 'INITIAL_SESSION') {
        hasInitialSession = true;
        // 初始会话事件 - 这是最重要的，会在组件加载时立即触发
        if (session?.user) {
          console.log('检测到初始会话:', session.user.email);
          setIsAuthenticated(true);
          setIsLoading(false);
        } else {
          console.log('初始会话无用户');
          setIsAuthenticated(false);
          setIsLoading(false);
        }
      } else if (event === 'SIGNED_IN' && session?.user) {
        console.log('用户已登录:', session.user.email);
        setIsAuthenticated(true);
        setIsLoading(false);
      } else if (event === 'SIGNED_OUT') {
        console.log('用户已登出');
        setIsAuthenticated(false);
        setIsLoading(false);
      } else if (event === 'TOKEN_REFRESHED' && session?.user) {
        setIsAuthenticated(true);
      }
    });

    // 如果 INITIAL_SESSION 没有在短时间内触发，则手动检查会话
    const timeoutId = setTimeout(async () => {
      if (!hasInitialSession && isMounted) {
        console.log('INITIAL_SESSION 未触发，手动检查会话');
        try {
          const session = await auth.getSession();
          
          if (isMounted) {
            if (session?.user) {
              console.log('手动检查到现有会话:', session.user.email);
              setIsAuthenticated(true);
              setIsLoading(false);
            } else {
              console.log('手动检查未找到会话');
              setIsAuthenticated(false);
              setIsLoading(false);
            }
          }
        } catch (error) {
          console.error('手动认证检查失败:', error);
          if (isMounted) {
            setIsAuthenticated(false);
            setIsLoading(false);
          }
        }
      }
    }, 500);

    return () => {
      isMounted = false;
      clearTimeout(timeoutId);
      subscription.unsubscribe();
    };
  }, []);

  // 添加调试日志
  useEffect(() => {
    console.log('AdminProtectedRoute 状态:', { isAuthenticated, isLoading, path: location.pathname });
  }, [isAuthenticated, isLoading, location.pathname]);

  if (isLoading) {
    console.log('AdminProtectedRoute: 显示加载中...');
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
    );
  }

  if (!isAuthenticated) {
    console.log('AdminProtectedRoute: 未认证，重定向到登录页');
    // 保存当前路径，登录后可以重定向回来
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  console.log('AdminProtectedRoute: 已认证，渲染子组件');
  return <>{children}</>;
}


