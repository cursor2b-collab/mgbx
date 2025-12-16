import { InitTestAccounts } from './InitTestAccounts'
import { testAccounts } from '../utils/testAccounts'
import { Card } from './ui/card'
import { User, Shield, TrendingUp } from 'lucide-react'

export function TestAccountsManagement() {
  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'admin':
        return <Shield className="w-5 h-5 text-red-400" />
      case 'trader':
        return <TrendingUp className="w-5 h-5 text-blue-400" />
      default:
        return <User className="w-5 h-5 text-green-400" />
    }
  }

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'admin':
        return 'bg-red-500/20 text-red-400 border-red-500/30'
      case 'trader':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30'
      default:
        return 'bg-green-500/20 text-green-400 border-green-500/30'
    }
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A] p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl text-white mb-2">测试账号管理</h1>
          <p className="text-white/70">管理和初始化开发测试账号</p>
        </div>

        {/* 初始化区域 */}
        <Card className="bg-[#1A1A1A] border-white/10 p-6 mb-6">
          <h2 className="text-xl text-white mb-4">初始化测试账号</h2>
          <p className="text-white/70 text-sm mb-4">
            点击下方按钮将在 Supabase 中创建所有测试账号。如果账号已存在，将会跳过。
          </p>
          <InitTestAccounts />
        </Card>

        {/* 账号列表 */}
        <Card className="bg-[#1A1A1A] border-white/10 p-6">
          <h2 className="text-xl text-white mb-4">测试账号列表</h2>
          <div className="space-y-4">
            {testAccounts.map((account) => (
              <div
                key={account.email}
                className="bg-[#0A0A0A] rounded-xl p-5 border border-white/5"
              >
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-white/5 rounded-lg">
                    {getRoleIcon(account.role)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-white text-lg">{account.name}</h3>
                      <span className={`text-xs px-2 py-1 rounded border ${getRoleBadgeColor(account.role)}`}>
                        {account.role.toUpperCase()}
                      </span>
                    </div>
                    {account.description && (
                      <p className="text-white/50 text-sm mb-3">{account.description}</p>
                    )}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                      <div className="flex items-center gap-2">
                        <span className="text-white/50">邮箱:</span>
                        <code className="text-[#A3F030] bg-white/5 px-2 py-1 rounded">
                          {account.email}
                        </code>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-white/50">密码:</span>
                        <code className="text-white/70 bg-white/5 px-2 py-1 rounded font-mono">
                          {account.password}
                        </code>
                      </div>
                      {account.balance && (
                        <div className="flex items-center gap-2">
                          <span className="text-white/50">初始余额:</span>
                          <span className="text-[#A3F030]">
                            {account.balance.toLocaleString()} USDT
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* 使用说明 */}
        <Card className="bg-blue-500/10 border-blue-500/30 p-6 mt-6">
          <h3 className="text-blue-400 mb-3">使用说明</h3>
          <ul className="space-y-2 text-sm text-blue-300/80">
            <li>• 点击"初始化测试账号"按钮创建所有测试账号</li>
            <li>• 在登录页面点击"测试账号快速登录"可以快速选择账号登录</li>
            <li>• 测试账号邮箱已自动确认，无需验证</li>
            <li>• 每个账号都有预设的初始余额用于测试交易功能</li>
            <li>• 这些账号仅用于开发测试，请勿在生产环境使用</li>
          </ul>
        </Card>
      </div>
    </div>
  )
}
