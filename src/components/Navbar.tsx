import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { 
  ChevronDown,
  Search,
  Menu,
  X,
  Bell,
  User,
  LogIn,
  MessageSquare,
  BarChart3,
  LogOut
} from 'lucide-react'
import { LanguageSwitcher } from './LanguageSwitcher'
import { useLanguage } from '../contexts/LanguageContext'
import { useAuth } from '../hooks/useAuth'

export function Navbar() {
  const navigate = useNavigate()
  const location = useLocation()
  const { isAuthenticated, user, signOut } = useAuth()
  const { t } = useLanguage()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(window.innerWidth < 992)

  // 处理退出登录
  const handleLogout = async () => {
    try {
      await signOut()
      navigate('/')
    } catch (error) {
      console.error('退出登录失败:', error)
    }
  }

  // 检测是否为移动设备 - 添加防抖优化
  useEffect(() => {
    let timeoutId: NodeJS.Timeout
    
    const checkMobile = () => {
      clearTimeout(timeoutId)
      timeoutId = setTimeout(() => {
        setIsMobile(window.innerWidth < 992)
      }, 100)
    }
    
    window.addEventListener('resize', checkMobile)
    return () => {
      clearTimeout(timeoutId)
      window.removeEventListener('resize', checkMobile)
    }
  }, [])

  const navItems = [
    { label: '首页', href: '/', hasDropdown: false },
    { label: '市场', href: '/markets', hasDropdown: false },
    { label: '股票', href: '/stocks', hasDropdown: false },
    { label: '借贷', href: '/lending', hasDropdown: false },
    { label: '账户', href: '/profile', hasDropdown: false },
  ]

  // 在移动端行情页面隐藏 Navbar
  if (isMobile && location.pathname === '/markets') {
    return null
  }

  return (
    <header className="sticky top-0 z-50 bg-black border-b border-white/10">
      <div className="w-full">
        <div className="flex items-center justify-between h-14 pl-0 pr-3 sm:pr-4 lg:pr-6">
          {/* 左侧：Logo + 导航 */}
          <div className="flex items-center gap-4 lg:gap-6 flex-shrink-0">
            {/* Logo */}
            <a href="/" className="flex items-center gap-1.5">
              <img 
                src="https://cy-747263170.imgix.net/logo.1730b8a9.gif" 
                alt="CRYPTONX" 
                className="h-12 w-auto"
              />
            </a>

            {/* 桌面导航 */}
            <nav className="hidden lg:flex items-center gap-8">
              {navItems.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  onClick={(e) => {
                    if (item.href.startsWith('/')) {
                      e.preventDefault()
                      navigate(item.href)
                    }
                  }}
                  className="flex items-center gap-0.5 text-white/90 hover:text-white transition-colors text-base cursor-pointer whitespace-nowrap"
                >
                  {item.label}
                  {item.hasDropdown && <ChevronDown className="w-3.5 h-3.5" />}
                </a>
              ))}
            </nav>
          </div>

          {/* 右侧：搜索 + 按钮 + 图标 */}
          <div className="flex items-center gap-2 flex-shrink-0">
            {/* 桌面端：搜索框 */}
            <div className="hidden lg:flex items-center relative">
              <Search className="absolute left-2.5 w-3.5 h-3.5 text-white/40" />
              <Input
                placeholder="搜索货币"
                className="w-40 h-8 pl-8 pr-2.5 bg-white/5 border-white/10 text-white placeholder:text-white/40 text-xs focus:bg-white/10 focus:border-white/20"
              />
            </div>

            {/* 移动端专用按钮组 */}
            {isMobile && (
              <>
                {/* 注册按钮 */}
                {!isAuthenticated && (
                  <Button 
                    onClick={() => navigate('/register')}
                    className="h-8 px-4 text-black text-sm rounded-full"
                    style={{ backgroundColor: '#A3F030', fontWeight: 500 }}
                  >
                    注册
                  </Button>
                )}
              </>
            )}

            {/* 桌面端：登录/注册按钮 */}
            {!isMobile && !isAuthenticated && (
              <>
                <Button 
                  onClick={() => navigate('/login')}
                  variant="ghost" 
                  className="h-8 px-3 text-white/90 hover:text-white hover:bg-white/5 text-xs"
                >
                  登录
                </Button>
                <Button 
                  onClick={() => navigate('/register')}
                  className="h-8 px-4 bg-[#A3F030] hover:bg-[#8FD622] text-black text-xs rounded-full"
                >
                  注册
                </Button>
              </>
            )}
            
            {/* 移动端：已登录时显示退出登录按钮，未登录时显示语言切换 */}
            {isMobile ? (
              isAuthenticated ? (
                <Button
                  onClick={handleLogout}
                  variant="ghost"
                  className="h-8 px-3 text-white/90 hover:text-white hover:bg-white/5"
                >
                  <LogOut className="w-4 h-4" />
                </Button>
              ) : (
                <div className="ml-1">
                  <LanguageSwitcher />
                </div>
              )
            ) : (
              <div className="ml-1">
                <LanguageSwitcher />
              </div>
            )}

            {/* 桌面端：通知和消息 */}
            {!isMobile && isAuthenticated && (
              <>
                <button className="w-7 h-7 flex items-center justify-center text-white/70 hover:text-white transition-colors">
                  <Bell className="w-4 h-4" />
                </button>
              </>
            )}

            {/* 移动端菜单按钮 */}
            {!isMobile && (
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden text-white/90 hover:text-white"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            )}
          </div>
        </div>

        {/* 移动端菜单 */}
        {mobileMenuOpen && (
          <div className="lg:hidden py-4 border-t border-white/10">
            <nav className="flex flex-col gap-4">
              {/* 移动端搜索 */}
              <div className="relative mb-2">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                <Input
                  placeholder="搜索货币"
                  className="w-full h-9 pl-9 pr-3 bg-white/5 border-white/10 text-white placeholder:text-white/40"
                />
              </div>

              {/* 导航链接 */}
              {navItems.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  onClick={(e) => {
                    if (item.href.startsWith('/')) {
                      e.preventDefault()
                      navigate(item.href)
                      setMobileMenuOpen(false)
                    }
                  }}
                  className="flex items-center justify-between text-white/90 hover:text-white transition-colors py-2"
                >
                  <span>{item.label}</span>
                  {item.hasDropdown && <ChevronDown className="w-4 h-4" />}
                </a>
              ))}

              {/* 移动端按钮 */}
              {!isAuthenticated && (
                <div className="flex gap-2 pt-4 border-t border-white/10">
                  <Button 
                    onClick={() => {
                      navigate('/login')
                      setMobileMenuOpen(false)
                    }}
                    variant="outline" 
                    className="flex-1 border-white/20 text-white hover:bg-white/10"
                  >
                    登录
                  </Button>
                  <Button 
                    onClick={() => {
                      navigate('/register')
                      setMobileMenuOpen(false)
                    }}
                    className="flex-1 text-black"
                    style={{ backgroundColor: '#A3F030' }}
                  >
                    注册
                  </Button>
                </div>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}