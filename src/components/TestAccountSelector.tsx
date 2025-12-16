import { useState } from 'react'
import { Button } from './ui/button'
import { Card } from './ui/card'
import { testAccounts, TestAccount } from '../utils/testAccounts'
import { auth } from '../utils/supabase/client'
import { toast } from 'sonner'
import { User, Shield, TrendingUp, Crown, Eye, EyeOff, Copy, Check } from 'lucide-react'
import { InitTestAccounts } from './InitTestAccounts'

interface TestAccountSelectorProps {
  onLoginSuccess?: () => void
  className?: string
}

export function TestAccountSelector({ onLoginSuccess, className = '' }: TestAccountSelectorProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [copiedEmail, setCopiedEmail] = useState<string | null>(null)
  const [showPasswords, setShowPasswords] = useState(false)

  const handleQuickLogin = async (account: TestAccount) => {
    setIsLoading(true)
    try {
      await auth.signInWithEmail(account.email, account.password)
      toast.success(`已登录为：${account.name}`, {
        description: `${account.email}`
      })
      if (onLoginSuccess) {
        onLoginSuccess()
      }
    } catch (error: any) {
      toast.error('登录失败', {
        description: error.message || '请检查账号配置'
      })
    } finally {
      setIsLoading(false)
    }
  }

  const copyToClipboard = async (text: string, type: 'email' | 'password') => {
    try {
      await navigator.clipboard.writeText(text)
      if (type === 'email') {
        setCopiedEmail(text)
        setTimeout(() => setCopiedEmail(null), 2000)
      }
      toast.success(`已复制${type === 'email' ? '邮箱' : '密码'}`)
    } catch (error) {
      toast.error('复制失败')
    }
  }

  const getRoleIcon = (role: TestAccount['role']) => {
    switch (role) {
      case 'admin':
        return <Shield className="w-5 h-5 text-red-400" />
      case 'trader':
        return <TrendingUp className="w-5 h-5 text-blue-400" />
      case 'user':
        return <User className="w-5 h-5 text-green-400" />
      default:
        return <User className="w-5 h-5 text-gray-400" />
    }
  }

  const getRoleBadgeColor = (role: TestAccount['role']) => {
    switch (role) {
      case 'admin':
        return 'bg-red-500/20 text-red-400 border-red-500/30'
      case 'trader':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30'
      case 'user':
        return 'bg-green-500/20 text-green-400 border-green-500/30'
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30'
    }
  }

  return (
    <div className={className}>
      {/* 触发按钮 */}
      <Button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        variant="outline"
        className="w-full bg-yellow-500/10 border-yellow-500/30 text-yellow-400 hover:bg-yellow-500/20 hover:border-yellow-500/50"
      >
        <Crown className="w-4 h-4 mr-2" />
        测试账号快速登录
      </Button>

      {/* 账号列表面板 */}
      {isOpen && (
        <Card className="absolute top-full left-0 right-0 mt-2 bg-[#1A1A1A] border-white/10 p-4 z-50 max-h-[500px] overflow-y-auto shadow-2xl">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/10">
            <h3 className="text-white">测试账号列表</h3>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setShowPasswords(!showPasswords)}
              className="text-white/70 hover:text-white"
            >
              {showPasswords ? (
                <>
                  <EyeOff className="w-4 h-4 mr-2" />
                  隐藏密码
                </>
              ) : (
                <>
                  <Eye className="w-4 h-4 mr-2" />
                  显示密码
                </>
              )}
            </Button>
          </div>

          <div className="space-y-3">
            {testAccounts.map((account) => (
              <div
                key={account.email}
                className="bg-[#0A0A0A] rounded-xl p-4 border border-white/5 hover:border-[#A3F030]/30 transition-all"
              >
                <div className="flex items-start gap-3 mb-3">
                  <div className="p-2 bg-white/5 rounded-lg">
                    {getRoleIcon(account.role)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-white">{account.name}</span>
                      <span className={`text-xs px-2 py-0.5 rounded border ${getRoleBadgeColor(account.role)}`}>
                        {account.role.toUpperCase()}
                      </span>
                    </div>
                    {account.description && (
                      <p className="text-xs text-white/50 mb-2">{account.description}</p>
                    )}
                  </div>
                </div>

                {/* 账号信息 */}
                <div className="space-y-2 mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-white/50 w-16">邮箱:</span>
                    <code className="flex-1 text-xs bg-white/5 px-2 py-1 rounded text-[#A3F030]">
                      {account.email}
                    </code>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => copyToClipboard(account.email, 'email')}
                      className="p-1 h-auto text-white/50 hover:text-white"
                    >
                      {copiedEmail === account.email ? (
                        <Check className="w-4 h-4 text-green-400" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </Button>
                  </div>

                  {showPasswords && (
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-white/50 w-16">密码:</span>
                      <code className="flex-1 text-xs bg-white/5 px-2 py-1 rounded text-white/70 font-mono">
                        {account.password}
                      </code>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => copyToClipboard(account.password, 'password')}
                        className="p-1 h-auto text-white/50 hover:text-white"
                      >
                        <Copy className="w-4 h-4" />
                      </Button>
                    </div>
                  )}

                  {account.balance && (
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-white/50 w-16">余额:</span>
                      <span className="text-xs text-[#A3F030]">
                        {account.balance.toLocaleString()} USDT
                      </span>
                    </div>
                  )}
                </div>

                {/* 快速登录按钮 */}
                <Button
                  type="button"
                  onClick={() => handleQuickLogin(account)}
                  disabled={isLoading}
                  className="w-full h-9 bg-[#A3F030] hover:bg-[#8FD622] text-black text-sm disabled:bg-white/10 disabled:text-white/30"
                >
                  {isLoading ? '登录中...' : '快速登录'}
                </Button>
              </div>
            ))}
          </div>

          {/* 提示信息 */}
          <div className="mt-4 pt-4 border-t border-white/10 space-y-3">
            {/* 初始化按钮 */}
            <div>
              <div className="text-xs text-white/70 mb-2">首次使用？请先初始化测试账号：</div>
              <InitTestAccounts />
            </div>
            
            <div className="flex items-start gap-2 text-xs text-white/50">
              <div className="text-yellow-500 mt-0.5">⚠️</div>
              <p>
                这些是开发测试账号，仅用于测试环境。生产环境请使用真实账号。
              </p>
            </div>
          </div>
        </Card>
      )}
    </div>
  )
}