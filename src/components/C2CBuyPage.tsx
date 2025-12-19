import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from './ui/button'
import { Card } from './ui/card'
import { Badge } from './ui/badge'
import { MobileBottomNav } from './MobileBottomNav'
import { useAuth } from '../hooks/useAuth'
import { 
  ArrowLeft,
  Filter,
  CreditCard,
  Clock,
  Lock,
  CheckCircle2,
  AlertCircle,
  DollarSign,
  Users,
  TrendingUp,
  TrendingDown
} from 'lucide-react'

// 微信和支付宝图标组件
const AlipayIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M21.5 4.5c0-1.1-.9-2-2-2h-15c-1.1 0-2 .9-2 2v15c0 1.1.9 2 2 2h15c1.1 0 2-.9 2-2v-15zm-2 15h-15v-15h15v15z"/>
    <path d="M12 8c-2.2 0-4 1.8-4 4s1.8 4 4 4 4-1.8 4-4-1.8-4-4-4zm0 6c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2z"/>
  </svg>
)

const WeChatIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M8.691 2.188C3.891 2.188 0 5.476 0 9.53c0 2.212 1.17 4.203 3.002 5.55a.59.59 0 0 1 .213.665l-.39 1.48c-.019.07-.048.141-.048.213 0 .163.13.295.29.295a.326.326 0 0 0 .167-.054l1.903-1.114a.864.864 0 0 1 .717-.098 10.16 10.16 0 0 0 2.837.403c.276 0 .543-.027.811-.05-.857-2.578.157-4.972 1.932-6.446 1.703-1.415 4.138-1.98 6.44-1.838-.576-3.583-4.196-6.35-8.577-6.35zM5.785 5.991c.642 0 1.162.529 1.162 1.18 0 .66-.52 1.18-1.162 1.18-.651 0-1.171-.52-1.171-1.18 0-.651.52-1.18 1.171-1.18zm5.813 0c.642 0 1.162.529 1.162 1.18 0 .66-.52 1.18-1.162 1.18-.651 0-1.171-.52-1.171-1.18 0-.651.52-1.18 1.171-1.18zm5.34 3.633c-1.693 1.801-1.515 4.337-.396 6.02.636.95 1.838 1.653 3.014 1.98a.59.59 0 0 1 .405.402l.31 1.321c.02.09.04.18.04.27 0 .163.14.295.31.295a.31.31 0 0 0 .16-.054l1.829-1.07a.89.89 0 0 1 .74-.098c1.32.39 2.72.39 4.04 0 .857-.25 1.66-.68 2.35-1.24-1.09-3.087-4.188-5.336-7.766-5.336-.65 0-1.28.07-1.89.19zm2.234 2.02c.5 0 .9.41.9.9 0 .5-.4.9-.9.9-.49 0-.9-.4-.9-.9 0-.49.41-.9.9-.9zm4.5 0c.5 0 .9.41.9.9 0 .5-.4.9-.9.9-.49 0-.9-.4-.9-.9 0-.49.41-.9.9-.9z"/>
  </svg>
)
import { toast } from 'sonner'

// 支付方式类型
type PaymentMethod = 'alipay' | 'wechat' | 'bank'

// 商户类型
interface Merchant {
  id: string
  name: string
  avatar: string
  orderCount: number
  completionRate: number
  price: number // CNY per USDT
  minLimit: number // 最小限额 CNY
  maxLimit: number // 最大限额 CNY
  available: number // 可用 USDT
  paymentMethods: PaymentMethod[]
  processingTime: string // 处理时间
  isMerchant: boolean // 是否为商家
  depositRequired?: boolean // 是否需要保证金
}

// 订单类型
type OrderType = 'buy' | 'sell'

export function C2CBuyPage() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [orderType, setOrderType] = useState<OrderType>('buy')
  const [selectedCurrency, setSelectedCurrency] = useState('USDT')
  const [selectedAmount, setSelectedAmount] = useState('')
  const [selectedPayment, setSelectedPayment] = useState<PaymentMethod | 'all'>('all')
  const [selectedFiat, setSelectedFiat] = useState('CNY')
  const [merchants, setMerchants] = useState<Merchant[]>([])
  const [loading, setLoading] = useState(true)
  const [isMerchant, setIsMerchant] = useState(false)
  const [kycVerified, setKycVerified] = useState(false)
  const [showMerchantApply, setShowMerchantApply] = useState(false)
  const [showDepositModal, setShowDepositModal] = useState(false)

  // 模拟商户数据
  useEffect(() => {
    const loadMerchants = async () => {
      setLoading(true)
      // 模拟API调用
      setTimeout(() => {
        const mockMerchants: Merchant[] = [
          {
            id: '1',
            name: '四季阳光好运来666',
            avatar: '四',
            orderCount: 6893,
            completionRate: 94.41,
            price: 7.13,
            minLimit: 66,
            maxLimit: 66666,
            available: 3793.65,
            paymentMethods: ['alipay', 'wechat'],
            processingTime: '30分钟',
            isMerchant: true
          },
          {
            id: '2',
            name: '快速加仓补仓-时光商行',
            avatar: '快',
            orderCount: 5060,
            completionRate: 99.43,
            price: 7.16,
            minLimit: 500,
            maxLimit: 300000,
            available: 276.00,
            paymentMethods: ['alipay'],
            processingTime: '30分钟',
            isMerchant: true
          },
          {
            id: '3',
            name: '洛川币胜客-秒速-安全',
            avatar: '洛',
            orderCount: 3614,
            completionRate: 98.85,
            price: 7.16,
            minLimit: 313,
            maxLimit: 61316,
            available: 4770.63,
            paymentMethods: ['alipay'],
            processingTime: '30分钟',
            isMerchant: true
          },
          {
            id: '4',
            name: '發財商行',
            avatar: '發',
            orderCount: 1197,
            completionRate: 97.15,
            price: 7.15,
            minLimit: 100,
            maxLimit: 50000,
            available: 2500.00,
            paymentMethods: ['alipay', 'wechat', 'bank'],
            processingTime: '30分钟',
            isMerchant: true
          }
        ]
        setMerchants(mockMerchants)
        setLoading(false)
      }, 500)
    }

    loadMerchants()
  }, [orderType])

  // 检查用户KYC状态和商家状态
  useEffect(() => {
    const checkUserStatus = async () => {
      // 这里应该从API获取用户状态
      // 模拟：假设用户已通过KYC
      setKycVerified(true)
      setIsMerchant(false) // 假设用户还不是商家
    }
    checkUserStatus()
  }, [user])

  // 过滤商户
  const filteredMerchants = merchants.filter(merchant => {
    if (selectedPayment !== 'all' && !merchant.paymentMethods.includes(selectedPayment)) {
      return false
    }
    return true
  })

  // 获取支付方式图标
  const getPaymentIcon = (method: PaymentMethod) => {
    switch (method) {
      case 'alipay':
        return <AlipayIcon className="w-4 h-4 text-blue-500" />
      case 'wechat':
        return <WeChatIcon className="w-4 h-4 text-green-500" />
      case 'bank':
        return <CreditCard className="w-4 h-4 text-purple-500" />
    }
  }

  // 获取支付方式名称
  const getPaymentName = (method: PaymentMethod) => {
    switch (method) {
      case 'alipay':
        return '支付宝'
      case 'wechat':
        return '微信'
      case 'bank':
        return '银行卡'
    }
  }

  // 处理买入/卖出
  const handleTrade = (merchant: Merchant) => {
    if (!user) {
      toast.error('请先登录')
      navigate('/login')
      return
    }
    // 导航到交易详情页
    navigate(`/c2c/trade/${merchant.id}?type=${orderType}`)
  }

  // 申请成为商家
  const handleApplyMerchant = () => {
    if (!kycVerified) {
      toast.error('请先完成KYC认证')
      navigate('/kyc')
      return
    }
    setShowMerchantApply(true)
  }

  // 支付保证金
  const handlePayDeposit = async () => {
    // 这里应该调用API支付保证金
    toast.success('保证金支付成功，正在审核中...')
    setShowDepositModal(false)
    setShowMerchantApply(false)
    // 更新商家状态
    setIsMerchant(true)
  }

  // 创建挂单
  const handleCreateOrder = () => {
    if (!isMerchant) {
      toast.error('请先申请成为商家')
      return
    }
    navigate('/c2c/create-order')
  }

  return (
    <div className="min-h-screen bg-black pb-20">
      {/* 顶部导航栏 */}
      <div className="sticky top-0 z-40 bg-black/95 backdrop-blur-xl border-b border-white/10">
        <div className="px-4 py-3">
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => navigate(-1)}
              className="text-white/70 hover:text-white p-0"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <h1 className="text-white text-lg font-semibold flex-1">C2C买币</h1>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={handleCreateOrder}
              className="text-white/70 hover:text-white"
            >
              <Filter className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>

      {/* 买入/卖出切换 */}
      <div className="px-4 py-3">
        <div className="flex gap-2 bg-white/5 rounded-lg p-1">
          <button
            onClick={() => setOrderType('buy')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${
              orderType === 'buy'
                ? 'bg-white/10 text-white'
                : 'text-white/60 hover:text-white'
            }`}
          >
            买入
          </button>
          <button
            onClick={() => setOrderType('sell')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${
              orderType === 'sell'
                ? 'bg-white/10 text-white'
                : 'text-white/60 hover:text-white'
            }`}
          >
            卖出
          </button>
        </div>
      </div>

      {/* 筛选器 */}
      <div className="px-4 pb-3">
        <div className="grid grid-cols-4 gap-2">
          <select
            value={selectedCurrency}
            onChange={(e) => setSelectedCurrency(e.target.value)}
            className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-[#A3F030]"
          >
            <option value="USDT" className="bg-black">USDT</option>
            <option value="BTC" className="bg-black">BTC</option>
            <option value="ETH" className="bg-black">ETH</option>
          </select>
          <select
            value={selectedAmount}
            onChange={(e) => setSelectedAmount(e.target.value)}
            className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-[#A3F030]"
          >
            <option value="" className="bg-black">金额</option>
            <option value="100-1000" className="bg-black">100-1000</option>
            <option value="1000-10000" className="bg-black">1000-10000</option>
            <option value="10000+" className="bg-black">10000+</option>
          </select>
          <select
            value={selectedPayment}
            onChange={(e) => setSelectedPayment(e.target.value as PaymentMethod | 'all')}
            className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-[#A3F030]"
          >
            <option value="all" className="bg-black">支付方式</option>
            <option value="alipay" className="bg-black">支付宝</option>
            <option value="wechat" className="bg-black">微信</option>
            <option value="bank" className="bg-black">银行卡</option>
          </select>
          <select
            value={selectedFiat}
            onChange={(e) => setSelectedFiat(e.target.value)}
            className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-[#A3F030]"
          >
            <option value="CNY" className="bg-black">CNY</option>
            <option value="USD" className="bg-black">USD</option>
          </select>
        </div>
      </div>

      {/* 商家申请提示 */}
      {kycVerified && !isMerchant && (
        <div className="px-4 pb-3">
          <Card className="bg-[#A3F030]/10 border-[#A3F030]/20 p-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-[#A3F030]" />
                <span className="text-white text-sm">成为商家，自主挂单交易</span>
              </div>
              <Button
                onClick={handleApplyMerchant}
                className="bg-[#A3F030] hover:bg-[#8FD622] text-black text-sm px-4 py-1 h-auto"
              >
                申请商家
              </Button>
            </div>
          </Card>
        </div>
      )}

      {/* 商户列表 */}
      <div className="px-4 space-y-3 pb-4">
        {loading ? (
          <div className="text-center py-12">
            <img 
              src="/logo.1730b8a9.gif" 
              alt="Loading..." 
              style={{
                maxWidth: '150px',
                height: 'auto',
                margin: '0 auto'
              }}
            />
          </div>
        ) : filteredMerchants.length === 0 ? (
          <Card className="bg-white/5 border-white/10 p-12 text-center">
            <p className="text-white/50">暂无商户</p>
          </Card>
        ) : (
          filteredMerchants.map((merchant) => (
            <Card key={merchant.id} className="bg-white/5 border-white/10 p-4">
              <div className="flex items-start gap-3">
                {/* 商户头像 */}
                <div className="w-10 h-10 rounded-lg bg-[#A3F030]/20 flex items-center justify-center flex-shrink-0">
                  <span className="text-[#A3F030] font-semibold text-lg">{merchant.avatar}</span>
                </div>

                {/* 商户信息 */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-white font-medium text-sm">{merchant.name}</span>
                    {merchant.isMerchant && (
                      <Badge className="bg-[#A3F030]/20 text-[#A3F030] text-xs px-1.5 py-0">
                        商家
                      </Badge>
                    )}
                  </div>
                  <div className="text-white/60 text-xs mb-2">
                    成单量 {merchant.orderCount.toLocaleString()} ({merchant.completionRate}%)
                  </div>
                  
                  <div className="flex items-center gap-4 mb-2">
                    <div>
                      <span className="text-white/40 text-xs">¥ </span>
                      <span className="text-white font-semibold">{merchant.price}</span>
                      <span className="text-white/40 text-xs"> /USDT</span>
                    </div>
                    {orderType === 'buy' ? (
                      <TrendingUp className="w-4 h-4 text-green-400" />
                    ) : (
                      <TrendingDown className="w-4 h-4 text-red-400" />
                    )}
                  </div>

                  <div className="text-white/60 text-xs mb-2">
                    限额 {merchant.minLimit.toLocaleString()} - {merchant.maxLimit.toLocaleString()} CNY
                  </div>
                  <div className="text-white/60 text-xs mb-2">
                    可用 {merchant.available.toLocaleString()} USDT
                  </div>

                  {/* 支付方式和处理时间 */}
                  <div className="flex items-center gap-3 mt-2">
                    <div className="flex items-center gap-1">
                      {merchant.paymentMethods.map((method) => (
                        <div key={method} className="w-4 h-4 rounded-full bg-white/10 flex items-center justify-center">
                          {getPaymentIcon(method)}
                        </div>
                      ))}
                    </div>
                    <div className="flex items-center gap-1 text-white/60 text-xs">
                      <Clock className="w-3 h-3" />
                      <span>{merchant.processingTime}</span>
                    </div>
                  </div>
                </div>

                {/* 操作按钮 */}
                <div className="flex flex-col gap-2 flex-shrink-0">
                  <div className="px-2 py-1 bg-white/5 rounded text-xs text-white/60 flex items-center gap-1">
                    <Lock className="w-3 h-3" />
                    <span>不满足广告方要求</span>
                  </div>
                  <Button
                    onClick={() => handleTrade(merchant)}
                    className="bg-white/10 hover:bg-white/20 text-white text-sm px-4 py-2 h-auto"
                  >
                    {orderType === 'buy' ? '买入' : '卖出'}
                  </Button>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>

      {/* 商家申请弹窗 */}
      {showMerchantApply && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
          <Card className="bg-black border-white/10 p-6 max-w-md w-full">
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-white text-lg font-semibold">申请成为商家</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowMerchantApply(false)}
                  className="text-white/70 hover:text-white"
                >
                  ×
                </Button>
              </div>

              <div className="space-y-3">
                <div className="flex items-start gap-3 p-3 bg-white/5 rounded-lg">
                  <CheckCircle2 className="w-5 h-5 text-[#A3F030] flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="text-white font-medium text-sm">KYC认证</div>
                    <div className="text-white/60 text-xs">已完成</div>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 bg-white/5 rounded-lg">
                  <DollarSign className="w-5 h-5 text-[#A3F030] flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="text-white font-medium text-sm">保证金</div>
                    <div className="text-white/60 text-xs">需要支付 10,000 USDT 作为保证金</div>
                  </div>
                </div>

                <div className="p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 text-yellow-400 flex-shrink-0 mt-0.5" />
                    <div className="text-white/80 text-xs">
                      保证金将在您退出商家身份时退还。如违反平台规则，保证金可能被扣除。
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <Button
                  onClick={() => setShowMerchantApply(false)}
                  className="flex-1 bg-white/10 hover:bg-white/20 text-white"
                >
                  取消
                </Button>
                <Button
                  onClick={() => setShowDepositModal(true)}
                  className="flex-1 bg-[#A3F030] hover:bg-[#8FD622] text-black"
                >
                  支付保证金
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* 保证金支付弹窗 */}
      {showDepositModal && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
          <Card className="bg-black border-white/10 p-6 max-w-md w-full">
            <div className="space-y-4">
              <h3 className="text-white text-lg font-semibold">支付保证金</h3>
              
              <div className="space-y-3">
                <div className="p-4 bg-white/5 rounded-lg">
                  <div className="text-white/60 text-sm mb-1">保证金金额</div>
                  <div className="text-white text-2xl font-semibold">10,000 USDT</div>
                </div>

                <div className="p-4 bg-white/5 rounded-lg">
                  <div className="text-white/60 text-sm mb-2">支付方式</div>
                  <div className="space-y-2">
                    <button className="w-full p-3 bg-white/10 hover:bg-white/20 rounded-lg text-left flex items-center justify-between">
                      <span className="text-white text-sm">账户余额</span>
                      <span className="text-white/60 text-sm">0.00 USDT</span>
                    </button>
                    <button className="w-full p-3 bg-white/10 hover:bg-white/20 rounded-lg text-left flex items-center justify-between">
                      <span className="text-white text-sm">充值支付</span>
                      <span className="text-[#A3F030] text-sm">去充值</span>
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <Button
                  onClick={() => setShowDepositModal(false)}
                  className="flex-1 bg-white/10 hover:bg-white/20 text-white"
                >
                  取消
                </Button>
                <Button
                  onClick={handlePayDeposit}
                  className="flex-1 bg-[#A3F030] hover:bg-[#8FD622] text-black"
                >
                  确认支付
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}

      <MobileBottomNav />
    </div>
  )
}

