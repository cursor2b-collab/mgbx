import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Shield, Lock, Mail } from 'lucide-react';
import { auth } from '../../utils/supabase/client';
import { toast } from 'sonner';
import { ShaderBackground } from '../ui/shader-background';

export function AdminLogin() {
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setIsMobile(window.innerWidth < 768);
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const data = await auth.signInWithEmail(email, password);

      if (data?.user) {
        toast.success('登录成功');
        
        // 等待会话保存到本地存储
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // 验证会话是否已保存
        const session = await auth.getSession();
        if (session?.user) {
          console.log('登录成功，会话已保存，跳转到:', (location.state as any)?.from?.pathname || '/admin');
          // 使用 navigate 而不是 window.location，让 React Router 处理
          const from = (location.state as any)?.from?.pathname || '/admin';
          navigate(from, { replace: true });
        } else {
          console.error('会话未保存，使用强制刷新');
          const from = (location.state as any)?.from?.pathname || '/admin';
          window.location.href = from;
        }
      }
    } catch (err: any) {
      setError(err.message || '登录失败，请检查邮箱和密码');
      setIsLoading(false);
    }
  };

  return (
    <div style={{
      width: '100%',
      display: 'flex',
      flexDirection: 'column',
      fontFamily: 'system-ui, -apple-system, sans-serif',
      overflowX: 'hidden',
      height: '100vh',
      overflowY: 'auto',
      backgroundColor: '#000000'
    }}>
      <div style={{
        flex: '1 1 auto',
        display: 'flex',
        flexDirection: isMobile ? 'column' : 'row',
        overflow: 'visible',
        paddingTop: '0',
        position: 'relative',
        width: '100%',
        minHeight: '600px',
        flexShrink: 0
      }}>
        {/* Left Section - Login Form */}
        <div style={{ 
          flex: 1, 
          position: 'relative', 
          overflow: 'auto',
          display: isMobile ? 'block' : 'block',
          minHeight: 0
        }}>
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ 
              duration: 0.5, 
              ease: [0.4, 0, 0.2, 1]
            }}
            style={{
              position: isMobile ? 'relative' : 'absolute',
              top: isMobile ? 'auto' : 0,
              left: isMobile ? 'auto' : 0,
              right: isMobile ? 'auto' : 0,
              bottom: isMobile ? 'auto' : 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: isMobile ? '24px 16px' : '32px',
              paddingTop: isMobile ? '48px' : undefined,
              backgroundColor: '#000000',
              minHeight: isMobile ? 'auto' : '100%'
            }}
          >
            <div style={{ 
              width: '100%', 
              maxWidth: isMobile ? '100%' : '448px',
              padding: isMobile ? '0' : '0'
            }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                <h1 style={{
                  fontSize: 'clamp(2rem, 5vw, 3rem)',
                  fontWeight: 600,
                  lineHeight: 1.2,
                  color: '#fff',
                  margin: 0
                }}>
                  管理后台登录
                </h1>
                <p style={{
                  color: 'rgba(255, 255, 255, 0.6)',
                  margin: 0
                }}>
                  请使用管理员账号登录
                </p>

                {error && (
                  <div style={{
                    padding: '16px',
                    borderRadius: '8px',
                    backgroundColor: 'rgba(239, 68, 68, 0.1)',
                    border: '1px solid rgba(239, 68, 68, 0.2)',
                    color: '#ef4444',
                    fontSize: '14px'
                  }}>
                    {error}
                  </div>
                )}

                <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  <div>
                    <label style={{
                      display: 'block',
                      fontSize: '14px',
                      fontWeight: 500,
                      color: 'rgba(255, 255, 255, 0.6)',
                      marginBottom: '8px'
                    }}>
                      邮箱地址
                    </label>
                    <div 
                      className="auth-input-wrapper"
                      style={{
                        borderRadius: '16px',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        backgroundColor: 'rgba(255, 255, 255, 0.05)',
                        backdropFilter: 'blur(10px)',
                        transition: 'all 0.2s',
                        position: 'relative'
                      }}
                    >
                      <input
                        type="email"
                        name="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="admin@example.com"
                        required
                        disabled={isLoading}
                        style={{
                          width: '100%',
                          backgroundColor: 'transparent',
                          border: 'none',
                          outline: 'none',
                          color: '#fff',
                          padding: '16px',
                          fontSize: '14px',
                          borderRadius: '16px'
                        }}
                      />
                    </div>
                  </div>

                  <div>
                    <label style={{
                      display: 'block',
                      fontSize: '14px',
                      fontWeight: 500,
                      color: 'rgba(255, 255, 255, 0.6)',
                      marginBottom: '8px'
                    }}>
                      密码
                    </label>
                    <div 
                      className="auth-input-wrapper"
                      style={{
                        borderRadius: '16px',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        backgroundColor: 'rgba(255, 255, 255, 0.05)',
                        backdropFilter: 'blur(10px)',
                        transition: 'all 0.2s',
                        position: 'relative',
                        display: 'flex',
                        alignItems: 'center'
                      }}
                    >
                      <input
                        type={showPassword ? 'text' : 'password'}
                        name="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="请输入密码"
                        required
                        disabled={isLoading}
                        style={{
                          flex: 1,
                          backgroundColor: 'transparent',
                          border: 'none',
                          outline: 'none',
                          color: '#fff',
                          padding: '16px',
                          fontSize: '14px',
                          borderRadius: '16px'
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        style={{
                          backgroundColor: 'transparent',
                          border: 'none',
                          color: 'rgba(255, 255, 255, 0.6)',
                          cursor: 'pointer',
                          padding: '0 16px',
                          display: 'flex',
                          alignItems: 'center'
                        }}
                      >
                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                      </button>
                    </div>
                  </div>

                  <div style={{
                    display: 'flex',
                    alignItems: 'center'
                  }}>
                    <input
                      type="checkbox"
                      id="remember"
                      style={{
                        marginRight: '8px',
                        backgroundColor: 'rgba(255, 255, 255, 0.1)',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                        borderRadius: '4px',
                        width: '16px',
                        height: '16px',
                        cursor: 'pointer'
                      }}
                    />
                    <label htmlFor="remember" style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '14px' }}>
                      记住我
                    </label>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    style={{
                      width: '100%',
                      borderRadius: '16px',
                      backgroundColor: '#C5FF30',
                      color: '#000',
                      padding: '16px',
                      fontSize: '14px',
                      fontWeight: 500,
                      border: 'none',
                      cursor: isLoading ? 'not-allowed' : 'pointer',
                      opacity: isLoading ? 0.7 : 1,
                      transition: 'background-color 0.2s'
                    }}
                    onMouseEnter={(e) => {
                      if (!isLoading) e.currentTarget.style.backgroundColor = '#8FD622';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = '#C5FF30';
                    }}
                  >
                    {isLoading ? '登录中...' : '登录'}
                  </button>
                </form>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Right Section - Shader Background */}
        <div style={{ 
          flex: 1, 
          position: 'relative', 
          overflow: 'hidden',
          width: isMobile ? '100%' : 'auto',
          display: isMobile ? 'none' : 'block',
          minHeight: 0
        }}>
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ 
              duration: 0.5, 
              ease: [0.4, 0, 0.2, 1]
            }}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: '#000000',
              display: !isMobile ? 'block' : 'none',
              overflow: 'hidden',
              borderRadius: '24px'
            }}
          >
            {/* Shader Background */}
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              width: '100%',
              height: '100%',
              borderRadius: '24px',
              overflow: 'hidden'
            }}>
              <ShaderBackground className="w-full h-full" />
            </div>
            
            {/* Radial Gradient Overlay */}
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'radial-gradient(120% 80% at 50% 50%, transparent 40%, rgba(0, 0, 0, 0.8) 100%)',
              pointerEvents: 'none'
            }} />

            {/* Text Overlay */}
            <div style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              zIndex: 10,
              textAlign: 'center',
              color: '#fff',
              width: 'calc(100% - 64px)',
              padding: '0 32px'
            }}>
              <h2 style={{
                fontSize: 'clamp(1.5rem, 4vw, 2.5rem)',
                fontWeight: 700,
                margin: 0,
                marginBottom: '12px',
                textShadow: '0 2px 10px rgba(0, 0, 0, 0.5)'
              }}>
                CRYPTONX 管理后台
              </h2>
              <p style={{
                fontSize: 'clamp(1rem, 3vw, 1.5rem)',
                fontWeight: 500,
                margin: 0,
                textShadow: '0 2px 10px rgba(0, 0, 0, 0.5)',
                color: 'rgba(255, 255, 255, 0.9)'
              }}>
                安全、高效、专业的管理平台
              </p>
            </div>
          </motion.div>
        </div>
      </div>
      <style>{`
        .auth-input-wrapper:focus-within {
          border-color: #C5FF30 !important;
        }
      `}</style>
    </div>
  );
}
