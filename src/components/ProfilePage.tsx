import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Navbar } from './Navbar'
import { MobileBottomNav } from './MobileBottomNav'
import { FlickeringFooter } from './ui/flickering-footer'
import { useAuth } from '../hooks/useAuth'
import { projectId, publicAnonKey } from '../utils/supabase/info'
import '../styles/globals.css'
import { 
  ChevronRight,
  ChevronDown,
  Shield,
  Users,
  Phone,
  HelpCircle,
  Bell,
  Lock,
  Globe,
  Loader2
} from 'lucide-react'

interface Order {
  id: string
  pair: string
  rate: string
  duration: string
  profit: string
  profitColor: 'green' | 'red'
  amount: string
  status: string
  statusText: string
  openPrice?: string
  closePrice?: string
  investmentTime?: string
  redeemTime?: string
  investmentDuration?: string
  earnedProfit?: string
  dailyRate?: string
  penaltyRate?: string
  expanded?: boolean
}

interface Assets {
  balance: number
  loan: number
  margin: number
  expectedProfit: number
}

export function ProfilePage() {
  const navigate = useNavigate()
  const { isAuthenticated, user, accessToken } = useAuth()
  const [activeTab, setActiveTab] = useState<'futures' | 'smart'>('futures')
  const [orders, setOrders] = useState<Order[]>([])
  const [assets, setAssets] = useState<Assets>({
    balance: 0,
    loan: 0,
    margin: 0,
    expectedProfit: 0
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // 获取用户资产数据
  const fetchAssets = async () => {
    if (!accessToken) return

    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-2d551b3c/user/assets`,
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
          }
        }
      )

      const result = await response.json()
      
      if (result.success && result.data) {
        setAssets(result.data)
      } else {
        console.error('获取资产数据失败:', result.error)
      }
    } catch (err: any) {
      console.error('获取资产数据错误:', err)
      setError(err.message)
    }
  }

  // 获取用户订单数据
  const fetchOrders = async (type: 'futures' | 'smart') => {
    if (!accessToken) return

    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-2d551b3c/user/orders?type=${type}`,
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
          }
        }
      )

      const result = await response.json()
      
      if (result.success && result.data) {
        setOrders(result.data)
      } else {
        console.error('获取订单数据失败:', result.error)
        setOrders([])
      }
    } catch (err: any) {
      console.error('获取订单数据错误:', err)
      setError(err.message)
      setOrders([])
    }
  }

  // 初始化默认订单（仅在首次加载时）
  const initializeOrders = async () => {
    if (!accessToken) return

    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-2d551b3c/user/init-orders`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
          }
        }
      )

      const result = await response.json()
      
      if (result.success) {
        console.log('默认订单初始化成功:', result.data)
        // 重新获取订单数据
        await fetchOrders(activeTab)
      }
    } catch (err: any) {
      console.error('初始化订单错误:', err)
    }
  }

  // 首次加载时获取数据
  useEffect(() => {
    const loadData = async () => {
      if (!isAuthenticated || !accessToken) {
        setLoading(false)
        return
      }

      setLoading(true)
      setError(null)

      try {
        // 并行获取资产和订单数据
        await Promise.all([
          fetchAssets(),
          fetchOrders(activeTab)
        ])
      } catch (err: any) {
        console.error('加载数据错误:', err)
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [isAuthenticated, accessToken])

  // 当切换标签页时，重新获取订单数据
  useEffect(() => {
    if (isAuthenticated && accessToken) {
      fetchOrders(activeTab)
    }
  }, [activeTab, isAuthenticated, accessToken])

  const toggleOrderExpansion = (orderId: string) => {
    setOrders(orders.map(order => 
      order.id === orderId 
        ? { ...order, expanded: !order.expanded }
        : order
    ))
  }

  const settingsItems = [
    { icon: Shield, label: '账户验证', path: '/profile/verification', badge: '审核中' },
    { icon: Users, label: '邀请好友', path: '/profile/invite' },
    { icon: Phone, label: '联系我们', path: '/profile/contact' },
    { icon: HelpCircle, label: '常见问题', path: '/profile/faq' },
    { icon: Bell, label: '通知', path: '/profile/notifications' },
    { icon: Lock, label: '更改密码', path: '/profile/change-password' },
    { icon: Globe, label: '更改语言', path: '/profile/language' }
  ]

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />
      
      <div className="max-w-4xl mx-auto px-4 py-6 pt-20">
        {/* 加载状态 */}
        {loading && (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-[#A3F030]" />
            <span className="ml-3 text-white/60">加载中...</span>
          </div>
        )}

        {/* 错误提示 */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-2xl p-4 mb-6 text-red-400">
            加载数据时出错: {error}
          </div>
        )}

        {!loading && (
          <>
            {/* 余额卡片 */}
            <div className="relative bg-gradient-to-br from-[#1a1a2e] to-[#16213e] rounded-3xl p-6 mb-8 overflow-hidden border border-white/10">
              {/* 装饰球 */}
              <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-blue-500/30 to-green-500/30 rounded-full blur-3xl"></div>
              <div className="absolute bottom-0 left-20 w-32 h-32 bg-blue-600/20 rounded-full blur-2xl"></div>
              
              <div className="relative z-10">
                <h1 className="text-white text-4xl mb-6">{assets.balance.toLocaleString()} USD</h1>
                
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  <div>
                    <div className="text-yellow-500/80 text-sm mb-1">余额:</div>
                    <div className="text-white">{assets.balance.toLocaleString()} USD</div>
                  </div>
                  <div>
                    <div className="text-yellow-500/80 text-sm mb-1">贷款:</div>
                    <div className="text-white">{assets.loan.toLocaleString()} USD</div>
                  </div>
                  <div>
                    <div className="text-white/60 text-sm mb-1">占用保证金:</div>
                    <div className="text-white">{assets.margin.toLocaleString()} USD</div>
                  </div>
                  <div>
                    <div className="text-white/60 text-sm mb-1">预期利润:</div>
                    <div className="text-white">{assets.expectedProfit.toLocaleString()} USD</div>
                  </div>
                </div>
              </div>
            </div>

            {/* 订单部分 */}
            <div className="mb-8">
              <h2 className="text-3xl mb-4">订单</h2>
              
              {/* 标签页 */}
              <div className="flex gap-2 mb-4">
                <button
                  onClick={() => setActiveTab('futures')}
                  className={`px-6 py-2 rounded-full transition-colors ${
                    activeTab === 'futures'
                      ? 'bg-white/20 text-white'
                      : 'bg-white/5 text-white/60'
                  }`}
                >
                  期权
                </button>
                <button
                  onClick={() => setActiveTab('smart')}
                  className={`px-6 py-2 rounded-full transition-colors ${
                    activeTab === 'smart'
                      ? 'bg-white/20 text-white'
                      : 'bg-white/5 text-white/60'
                  }`}
                >
                  智能交易
                </button>
              </div>

              {/* 订单列表 */}
              {orders.length === 0 ? (
                <div className="text-center text-white/40 py-12">
                  暂无{activeTab === 'futures' ? '期权' : '智能交易'}订单
                </div>
              ) : (
                <div className="space-y-4">
                  {orders.map((order) => (
                    <div
                      key={order.id}
                      className="bg-white/5 border border-white/10 rounded-2xl p-4 hover:bg-white/10 transition-all"
                    >
                      <div 
                        className="flex items-start justify-between cursor-pointer"
                        onClick={() => toggleOrderExpansion(order.id)}
                      >
                        <div className="flex-1">
                          <div className="text-white/40 text-xs mb-2">{order.id}</div>
                          <div className="flex items-center gap-3 mb-2">
                            <span className="text-lg text-white">{order.pair}</span>
                            <span className="text-white/60">{order.rate}</span>
                            <span className="text-white/60">{order.duration}</span>
                            <span className={order.profitColor === 'green' ? 'text-[#A3F030]' : 'text-red-500'}>
                              {order.profit}
                            </span>
                          </div>
                          <div className="text-sm text-white/60">
                            {order.statusText} 已分润天数:{order.openPrice}
                          </div>
                        </div>
                        <div className="flex items-start gap-2">
                          <span className="text-white">{order.amount}</span>
                          <ChevronDown 
                            className={`w-5 h-5 text-white/40 transition-transform ${
                              order.expanded ? 'rotate-180' : ''
                            }`}
                          />
                        </div>
                      </div>

                      {/* 展开内容 */}
                      {order.expanded && (
                        <div className="mt-4 pt-4 border-t border-white/10 space-y-3">
                          <div className="flex justify-between text-sm">
                            <span className="text-white/60">投资时间:</span>
                            <span className="text-white">{order.investmentTime}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-white/60">下次收益时间:</span>
                            <span className="text-white">{order.redeemTime}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-white/60">金额:</span>
                            <span className="text-white">{order.amount}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-white/60">投资周期:</span>
                            <span className="text-white">{order.investmentDuration}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-white/60">已分润:</span>
                            <span className="text-white">{order.earnedProfit}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-white/60">当期利润:</span>
                            <span className="text-[#A3F030]">{order.earnedProfit}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-white/60">收益状态:</span>
                            <span className="text-white">{order.status}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-white/60">日利率:</span>
                            <span className="text-white">{order.dailyRate}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-white/60">叠加利率:</span>
                            <span className="text-white">{order.penaltyRate}</span>
                          </div>

                          <button className="w-full mt-4 py-3 bg-[#A3F030] text-black rounded-full hover:bg-[#8fd028] transition-colors text-center font-bold">
                            继续投资
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* 设置部分 */}
            <div className="mb-8">
              <h2 className="text-3xl mb-4">设置</h2>
              
              <div className="space-y-3">
                {settingsItems.map((item) => {
                  const Icon = item.icon
                  return (
                    <button
                      key={item.path}
                      onClick={() => navigate(item.path)}
                      className="w-full bg-white/5 border border-white/10 text-white rounded-2xl px-6 py-4 flex items-center justify-between hover:bg-white/10 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <Icon className="w-5 h-5" />
                        <span>{item.label}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        {item.badge && (
                          <span className="text-sm text-white/70">{item.badge}</span>
                        )}
                        <ChevronRight className="w-5 h-5 text-white/50" />
                      </div>
                    </button>
                  )
                })}
              </div>
            </div>
          </>
        )}
      </div>

      <FlickeringFooter />
      <MobileBottomNav />
    </div>
  )
}