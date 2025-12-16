import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Settings, X } from 'lucide-react'
import { Button } from './ui/button'

/**
 * 开发辅助工具 - 仅在开发环境显示
 * 提供快速访问测试账号管理等开发工具
 */
export function DevHelper() {
  const [isOpen, setIsOpen] = useState(false)

  // 检查是否为生产环境 - 使用更安全的方式
  const isProduction = typeof window !== 'undefined' && window.location.hostname !== 'localhost'
  
  // 可以通过添加 ?dev=true 参数来在生产环境强制显示
  const forceShow = typeof window !== 'undefined' && new URLSearchParams(window.location.search).get('dev') === 'true'

  // 生产环境且未强制显示时隐藏
  if (isProduction && !forceShow) {
    return null
  }

  return (
    <>
      {/* 浮动按钮 */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full shadow-2xl flex items-center justify-center hover:scale-110 transition-transform"
      >
        {isOpen ? (
          <X className="w-6 h-6 text-white" />
        ) : (
          <Settings className="w-6 h-6 text-white animate-spin-slow" />
        )}
      </button>

      {/* 工具面板 */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-50 bg-[#1A1A1A] border border-white/10 rounded-2xl p-4 shadow-2xl min-w-[300px]">
          <h3 className="text-white mb-3 pb-2 border-b border-white/10">开发工具</h3>
          <div className="space-y-2">
            <Link to="/test-accounts">
              <Button
                variant="outline"
                className="w-full justify-start bg-purple-500/10 border-purple-500/30 text-purple-400 hover:bg-purple-500/20"
              >
                🔧 测试账号管理
              </Button>
            </Link>
            <Link to="/login">
              <Button
                variant="outline"
                className="w-full justify-start bg-blue-500/10 border-blue-500/30 text-blue-400 hover:bg-blue-500/20"
              >
                🔑 登录页面
              </Button>
            </Link>
            <Link to="/mobile">
              <Button
                variant="outline"
                className="w-full justify-start bg-green-500/10 border-green-500/30 text-green-400 hover:bg-green-500/20"
              >
                📱 移动交易页
              </Button>
            </Link>
            <Link to="/trading">
              <Button
                variant="outline"
                className="w-full justify-start bg-yellow-500/10 border-yellow-500/30 text-yellow-400 hover:bg-yellow-500/20"
              >
                💹 桌面交易页
              </Button>
            </Link>
          </div>
          <div className="mt-3 pt-3 border-t border-white/10 text-xs text-white/50">
            开发环境专用工具
          </div>
        </div>
      )}

      <style>{`
        @keyframes spin-slow {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
        .animate-spin-slow {
          animation: spin-slow 8s linear infinite;
        }
      `}</style>
    </>
  )
}