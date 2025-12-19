import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, EyeOff } from 'lucide-react';
import { auth } from '../utils/supabase/client';
import { toast } from 'sonner';
import { useLanguage } from '../contexts/LanguageContext';
import { LanguageSelector } from './LanguageSelector';
import { Navbar } from './Navbar';
import { Footer } from './ui/footer-section';
import { WalletConnectButton } from './WalletConnectButton';

// Google Icon Component
const GoogleIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 48 48">
    <path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8-6.627 0-12-5.373-12-12s12-5.373 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-2.641-.21-5.236-.611-7.743z" />
    <path fill="#FF3D00" d="M6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 16.318 4 9.656 8.337 6.306 14.691z" />
    <path fill="#4CAF50" d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238C29.211 35.091 26.715 36 24 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z" />
    <path fill="#1976D2" d="M43.611 20.083H42V20H24v8h11.303c-.792 2.237-2.231 4.166-4.087 5.571l6.19 5.238C42.022 35.026 44 30.038 44 24c0-2.641-.21-5.236-.611-7.743z" />
  </svg>
);

// Testimonial Data
const testimonials = [
  {
    avatar: "https://randomuser.me/api/portraits/women/57.jpg",
    name: "Sarah Chen",
    handle: "@sarahdigital",
    text: "Amazing platform! The user experience is seamless and the features are exactly what I needed."
  },
  {
    avatar: "https://randomuser.me/api/portraits/men/64.jpg",
    name: "Marcus Johnson",
    handle: "@marcustech",
    text: "This service has transformed how I work. Clean design, powerful features, and excellent support."
  },
  {
    avatar: "https://randomuser.me/api/portraits/men/32.jpg",
    name: "David Martinez",
    handle: "@davidcreates",
    text: "I've tried many platforms, but this one stands out. Intuitive, reliable, and genuinely helpful for productivity."
  },
];

const signInVideo = "/sing.2a93cfb1.mp4"; // 登录页面视频
const signUpVideo = "/atomic.mp4"; // 注册页面视频

export function AuthPage() {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [isSignUp, setIsSignUp] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [windowHeight, setWindowHeight] = useState(typeof window !== 'undefined' ? window.innerHeight : 800);

  useEffect(() => {
    setIsMobile(window.innerWidth < 768);
    setWindowHeight(window.innerHeight);
    
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      setWindowHeight(window.innerHeight);
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleSignIn = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    try {
      await auth.signInWithEmail(email, password);
      toast.success(t('auth.loginSuccess') || "登录成功！");
      navigate("/dashboard");
    } catch (err: any) {
      setError(err.message || t('auth.loginFailed') || "登录失败，请检查邮箱和密码");
      setIsLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const confirmPassword = formData.get('confirmPassword') as string;

    if (password !== confirmPassword) {
      setError(t('auth.passwordsDoNotMatch'));
      setIsLoading(false);
      return;
    }

    try {
      await auth.signUpWithEmail(email, password);
      toast.success(t('auth.registerSuccess') || 'Account created successfully! Please check your email.');
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || t('auth.registerFailed') || 'Sign up failed');
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    setError(null);
    try {
      await auth.signInWithGoogle('https://cryptonxs.netlify.app/auth/callback');
    } catch (err: any) {
      setError(err.message || t('auth.googleLoginFailed') || "Google 登录失败");
      setIsLoading(false);
    }
  };

  const handleGithubSignIn = async () => {
    setIsLoading(true);
    setError(null);
    try {
      await auth.signInWithGithub('https://cryptonxs.netlify.app/auth/callback');
    } catch (err: any) {
      setError(err.message || t('auth.githubLoginFailed') || "GitHub 登录失败");
      setIsLoading(false);
    }
  };

  return (
    <div style={{
      width: '100%',
      height: '100vh',
      display: 'flex',
      flexDirection: 'column',
      fontFamily: 'system-ui, -apple-system, sans-serif',
      overflowX: 'hidden',
      overflowY: 'auto',
      position: 'relative'
    }}>
      <Navbar />
      <div style={{
        flex: '1 1 auto',
        display: 'flex',
        flexDirection: isMobile ? 'column' : 'row',
        overflow: 'visible',
        paddingTop: '56px',
        scrollMarginTop: '56px',
        position: 'relative',
        width: '100%',
        minHeight: '600px',
        flexShrink: 0
      }}>

      {/* Left Section - Form for Sign In, Image for Sign Up */}
      <div style={{ 
        flex: 1, 
        position: 'relative', 
        overflow: 'auto',
        display: isMobile && isSignUp ? 'none' : 'block',
        minHeight: 0
      }}>
        <AnimatePresence mode="sync">
          {isSignUp ? (
            <motion.div
              key="signup-image"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
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
                padding: '16px',
                backgroundColor: '#000000',
                display: !isMobile ? 'block' : 'none',
                overflow: 'hidden',
                borderRadius: '24px'
              }}
          >
            <div style={{
              position: 'absolute',
              top: '80px',
              left: '50%',
              transform: 'translateX(-50%)',
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
                MGBX 新手大礼包
              </h2>
              <p style={{
                fontSize: 'clamp(1.75rem, 5vw, 2.5rem)',
                fontWeight: 500,
                margin: 0,
                textShadow: '0 2px 10px rgba(0, 0, 0, 0.5)'
              }}>
                单人最高可得 <span style={{ color: '#C5FF30' }}>6888 USDT</span>
              </p>
            </div>
            <div style={{
              position: 'absolute',
              top: '60%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: '60%',
              height: '60%',
              borderRadius: '24px',
            }}>
              <video
                autoPlay
                loop
                muted
                playsInline
                preload="auto"
                style={{
                  position: 'relative',
                  width: '100%',
                  height: '100%',
                  borderRadius: '24px',
                  objectFit: 'contain',
                  imageRendering: 'crisp-edges',
                  WebkitImageRendering: 'crisp-edges',
                  zIndex: 1
                }}
              >
                <source src={signUpVideo} type="video/mp4" />
              </video>
              {/* 底部荧光效果 */}
              <div style={{
                position: 'absolute',
                bottom: '-8px',
                left: '50%',
                transform: 'translateX(-50%)',
                width: '120%',
                height: '20px',
                background: `linear-gradient(to top, rgba(0, 229, 255, 0.6), rgba(0, 229, 255, 0.2), transparent)`,
                borderRadius: '50%',
                filter: 'blur(12px)',
                zIndex: 0,
                pointerEvents: 'none'
              }} />
            </div>
          </motion.div>
          ) : (
            <motion.div
              key="signin-form"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
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
                padding: isMobile ? '0px 16px 24px' : '32px',
                paddingTop: isMobile ? '0px' : undefined,
                backgroundColor: '#000000',
                minHeight: isMobile ? 'auto' : '100%'
              }}
          >
            <div style={{ 
              width: '100%', 
              maxWidth: isMobile ? '100%' : '448px',
              padding: isMobile ? '0' : '0'
            }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: isMobile ? '20px' : '24px' }}>
                <h1 style={{
                  fontSize: 'clamp(2rem, 5vw, 3rem)',
                  fontWeight: 600,
                  lineHeight: 1.2,
                  color: '#fff',
                  margin: 0
                }}>
                  登录MGBX
                </h1>
                <p style={{
                  color: 'rgba(255, 255, 255, 0.6)',
                  margin: 0
                }}>
                  {t('auth.accessAccount')}
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

                <form onSubmit={handleSignIn} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  <div>
                    <label style={{
                      display: 'block',
                      fontSize: '14px',
                      fontWeight: 500,
                      color: 'rgba(255, 255, 255, 0.6)',
                      marginBottom: '8px'
                    }}>
                      {t('auth.emailAddress')}
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
                        name="email"
                        type="email"
                        placeholder={t('auth.enterEmailPlaceholder')}
                        required
                        disabled={isLoading}
                        style={{
                          width: '100%',
                          backgroundColor: 'transparent',
                          fontSize: '14px',
                          padding: '16px',
                          borderRadius: '16px',
                          border: 'none',
                          outline: 'none',
                          color: '#fff'
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
                      {t('auth.password')}
                    </label>
                    <div 
                      className="auth-input-wrapper"
                      style={{
                        borderRadius: '16px',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        backgroundColor: 'rgba(255, 255, 255, 0.05)',
                        backdropFilter: 'blur(10px)',
                        position: 'relative'
                      }}
                    >
                      <input
                        name="password"
                        type={showPassword ? 'text' : 'password'}
                        placeholder={t('auth.enterPasswordPlaceholder')}
                        required
                        disabled={isLoading}
                        style={{
                          width: '100%',
                          backgroundColor: 'transparent',
                          fontSize: '14px',
                          padding: '16px 48px 16px 16px',
                          borderRadius: '16px',
                          border: 'none',
                          outline: 'none',
                          color: '#fff'
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        disabled={isLoading}
                        style={{
                          position: 'absolute',
                          right: '12px',
                          top: '50%',
                          transform: 'translateY(-50%)',
                          background: 'none',
                          border: 'none',
                          cursor: 'pointer',
                          color: 'rgba(255, 255, 255, 0.6)',
                          padding: '4px'
                        }}
                      >
                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                      </button>
                    </div>
                  </div>

                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    fontSize: '14px'
                  }}>
                    <label style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      cursor: 'pointer',
                      color: 'rgba(255, 255, 255, 0.9)'
                    }}>
                      <input
                        type="checkbox"
                        name="rememberMe"
                        disabled={isLoading}
                        style={{
                          width: '18px',
                          height: '18px',
                          cursor: 'pointer'
                        }}
                      />
                      {t('auth.keepMeSignedIn')}
                    </label>
                    <a
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        navigate('/auth/reset-password');
                      }}
                      style={{
                        color: '#C5FF30',
                        textDecoration: 'none'
                      }}
                    >
                      {t('auth.resetPassword')}
                    </a>
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
                      opacity: isLoading ? 0.5 : 1,
                      transition: 'opacity 0.2s'
                    }}
                  >
                    {isLoading ? t('auth.signInLoading') : t('auth.signIn')}
                  </button>
                </form>

                <div style={{
                  position: 'relative',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '8px 0'
                }}>
                  <div style={{
                    width: '100%',
                    height: '1px',
                    backgroundColor: 'rgba(255, 255, 255, 0.1)'
                  }} />
                  <span style={{
                    position: 'absolute',
                    padding: '0 16px',
                    fontSize: '14px',
                    color: 'rgba(255, 255, 255, 0.6)',
                    backgroundColor: '#000000'
                  }}>
                    {t('auth.orContinueWith')}
                  </span>
                </div>

                <div style={{
                  display: 'flex',
                  gap: '12px'
                }}>
                  <button
                    onClick={handleGoogleSignIn}
                    disabled={isLoading}
                    style={{
                      flex: 1,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '12px',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      borderRadius: '16px',
                      padding: '16px',
                      backgroundColor: 'transparent',
                      color: '#fff',
                      fontSize: '14px',
                      cursor: isLoading ? 'not-allowed' : 'pointer',
                      opacity: isLoading ? 0.5 : 1,
                      transition: 'background-color 0.2s'
                    }}
                    onMouseEnter={(e) => {
                      if (!isLoading) e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.05)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'transparent';
                    }}
                  >
                    <GoogleIcon />
                    <span>Google</span>
                  </button>
                  {/* Web3 钱包连接按钮 - 替换原来的 GitHub 按钮 */}
                  <WalletConnectButton disabled={isLoading} isLoading={isLoading} />
                </div>

                <p style={{
                  textAlign: 'center',
                  fontSize: '14px',
                  color: 'rgba(255, 255, 255, 0.6)',
                  margin: 0
                }}>
                  {t('auth.newToPlatform')}{' '}
                  <a
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      setIsSignUp(true);
                    }}
                    style={{
                      color: '#C5FF30',
                      textDecoration: 'none'
                    }}
                  >
                    {t('auth.createAccount')}
                  </a>
                </p>
                
                {isMobile && (
                  <div style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginTop: '32px',
                    paddingBottom: '16px',
                    marginLeft: '-24px',
                    marginRight: '-24px',
                    width: 'calc(100% + 48px)'
                  }}>
                    <img 
                      src="/logo.1730b8a9.gif" 
                      alt="MGBX Logo" 
                      style={{
                        height: '120px',
                        width: 'auto',
                        maxWidth: '100%'
                      }}
                    />
                  </div>
                )}
              </div>
            </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Right Section - Image for Sign In, Form for Sign Up */}
      <div style={{ 
        flex: 1, 
        position: 'relative', 
        overflow: 'auto',
        width: isMobile ? '100%' : 'auto',
        display: isMobile && !isSignUp ? 'none' : 'block',
        minHeight: 0
      }}>
        <AnimatePresence mode="sync">
          {isSignUp ? (
            <motion.div
              key="signup-form"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 50 }}
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
                  {t('auth.createAccount')}
                </h1>
                <p style={{
                  color: 'rgba(255, 255, 255, 0.6)',
                  margin: 0
                }}>
                  {t('auth.signUpSubtitle')}
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

                <form onSubmit={handleSignUp} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  <div>
                    <label style={{
                      display: 'block',
                      fontSize: '14px',
                      fontWeight: 500,
                      color: 'rgba(255, 255, 255, 0.6)',
                      marginBottom: '8px'
                    }}>
                      {t('auth.emailAddress')}
                    </label>
                    <div 
                      className="auth-input-wrapper"
                      style={{
                        borderRadius: '16px',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        backgroundColor: 'rgba(255, 255, 255, 0.05)',
                        backdropFilter: 'blur(10px)'
                      }}
                    >
                      <input
                        name="email"
                        type="email"
                        placeholder={t('auth.enterEmailPlaceholder')}
                        required
                        disabled={isLoading}
                        style={{
                          width: '100%',
                          backgroundColor: 'transparent',
                          fontSize: '14px',
                          padding: '16px',
                          borderRadius: '16px',
                          border: 'none',
                          outline: 'none',
                          color: '#fff'
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
                      {t('auth.password')}
                    </label>
                    <div 
                      className="auth-input-wrapper"
                      style={{
                        borderRadius: '16px',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        backgroundColor: 'rgba(255, 255, 255, 0.05)',
                        backdropFilter: 'blur(10px)',
                        position: 'relative'
                      }}
                    >
                      <input
                        name="password"
                        type={showPassword ? 'text' : 'password'}
                        placeholder={t('auth.createPasswordPlaceholder')}
                        required
                        minLength={6}
                        disabled={isLoading}
                        style={{
                          width: '100%',
                          backgroundColor: 'transparent',
                          fontSize: '14px',
                          padding: '16px 48px 16px 16px',
                          borderRadius: '16px',
                          border: 'none',
                          outline: 'none',
                          color: '#fff'
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        disabled={isLoading}
                        style={{
                          position: 'absolute',
                          right: '12px',
                          top: '50%',
                          transform: 'translateY(-50%)',
                          background: 'none',
                          border: 'none',
                          cursor: 'pointer',
                          color: 'rgba(255, 255, 255, 0.6)',
                          padding: '4px'
                        }}
                      >
                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                      </button>
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
                      {t('auth.confirmPassword')}
                    </label>
                    <div 
                      className="auth-input-wrapper"
                      style={{
                        borderRadius: '16px',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        backgroundColor: 'rgba(255, 255, 255, 0.05)',
                        backdropFilter: 'blur(10px)',
                        position: 'relative'
                      }}
                    >
                      <input
                        name="confirmPassword"
                        type={showConfirmPassword ? 'text' : 'password'}
                        placeholder={t('auth.confirmPasswordPlaceholder')}
                        required
                        disabled={isLoading}
                        style={{
                          width: '100%',
                          backgroundColor: 'transparent',
                          fontSize: '14px',
                          padding: '16px 48px 16px 16px',
                          borderRadius: '16px',
                          border: 'none',
                          outline: 'none',
                          color: '#fff'
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        disabled={isLoading}
                        style={{
                          position: 'absolute',
                          right: '12px',
                          top: '50%',
                          transform: 'translateY(-50%)',
                          background: 'none',
                          border: 'none',
                          cursor: 'pointer',
                          color: 'rgba(255, 255, 255, 0.6)',
                          padding: '4px'
                        }}
                      >
                        {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                      </button>
                    </div>
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
                      opacity: isLoading ? 0.5 : 1,
                      transition: 'opacity 0.2s'
                    }}
                  >
                    {isLoading ? t('auth.createAccountLoading') : t('auth.createAccount')}
                  </button>
                </form>

                <div style={{
                  position: 'relative',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '8px 0'
                }}>
                  <div style={{
                    width: '100%',
                    height: '1px',
                    backgroundColor: 'rgba(255, 255, 255, 0.1)'
                  }} />
                  <span style={{
                    position: 'absolute',
                    padding: '0 16px',
                    fontSize: '14px',
                    color: 'rgba(255, 255, 255, 0.6)',
                    backgroundColor: '#000000'
                  }}>
                    {t('auth.orContinueWith')}
                  </span>
                </div>

                {/* Web3 钱包连接按钮 */}
                <div style={{
                  width: '100%',
                  display: 'flex',
                  justifyContent: 'center',
                  marginBottom: '16px'
                }}>
                  <WalletConnectButton disabled={isLoading} isLoading={isLoading} fullWidth />
                </div>

                <p style={{
                  textAlign: 'center',
                  fontSize: '14px',
                  color: 'rgba(255, 255, 255, 0.6)',
                  margin: 0
                }}>
                  {t('auth.alreadyHaveAccount')}{' '}
                  <a
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      setIsSignUp(false);
                    }}
                    style={{
                      color: '#C5FF30',
                      textDecoration: 'none'
                    }}
                  >
                    {t('auth.signIn')}
                  </a>
                </p>
                
                {isMobile && (
                  <div style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginTop: '32px',
                    paddingBottom: '16px',
                    marginLeft: '-24px',
                    marginRight: '-24px',
                    width: 'calc(100% + 48px)'
                  }}>
                    <img 
                      src="/logo.1730b8a9.gif" 
                      alt="MGBX Logo" 
                      style={{
                        height: '120px',
                        width: 'auto',
                        maxWidth: '100%'
                      }}
                    />
                  </div>
                )}
              </div>
            </div>
          </motion.div>
          ) : (
            <motion.div
              key="signin-image"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 50 }}
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
                padding: '16px',
                backgroundColor: '#000000',
                display: !isMobile ? 'block' : 'none',
                overflow: 'hidden',
                borderRadius: '24px'
              }}
          >
            <div style={{
              position: 'absolute',
              top: '80px',
              left: '50%',
              transform: 'translateX(-50%)',
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
                MGBX 新手大礼包
              </h2>
              <p style={{
                fontSize: 'clamp(1.75rem, 5vw, 2.5rem)',
                fontWeight: 500,
                margin: 0,
                textShadow: '0 2px 10px rgba(0, 0, 0, 0.5)'
              }}>
                单人最高可得 <span style={{ color: '#C5FF30' }}>6888 USDT</span>
              </p>
            </div>
            <div style={{
              position: 'absolute',
              top: '60%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: '60%',
              height: '60%',
              borderRadius: '24px',
            }}>
              <video
                autoPlay
                loop
                muted
                playsInline
                preload="auto"
                style={{
                  position: 'relative',
                  width: '100%',
                  height: '100%',
                  borderRadius: '24px',
                  objectFit: 'contain',
                  imageRendering: 'crisp-edges',
                  WebkitImageRendering: 'crisp-edges',
                  zIndex: 1
                }}
              >
                <source src={signInVideo} type="video/mp4" />
              </video>
              {/* 底部荧光效果 */}
              <div style={{
                position: 'absolute',
                bottom: '-8px',
                left: '50%',
                transform: 'translateX(-50%)',
                width: '120%',
                height: '20px',
                background: `linear-gradient(to top, rgba(0, 229, 255, 0.6), rgba(0, 229, 255, 0.2), transparent)`,
                borderRadius: '50%',
                filter: 'blur(12px)',
                zIndex: 0,
                pointerEvents: 'none'
              }} />
            </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      </div>
      {windowHeight >= 800 && !isMobile && (
        <div style={{
          flexShrink: 1,
          minHeight: 0
        }}>
          <Footer />
        </div>
      )}
      <style>{`
        .auth-input-wrapper:focus-within {
          border-color: #C5FF30 !important;
        }
      `}</style>
    </div>
  );
}

