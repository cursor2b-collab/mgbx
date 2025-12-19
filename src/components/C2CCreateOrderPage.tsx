import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from './ui/button'
import { Card } from './ui/card'
import { MobileBottomNav } from './MobileBottomNav'
import { 
  ArrowLeft,
  DollarSign,
  TrendingUp,
  TrendingDown,
  CreditCard,
  Info,
  AlertCircle
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

type OrderType = 'sell' | 'buy' // sell: 出售USDT, buy: 回收USDT
type PaymentMethod = 'alipay' | 'wechat' | 'bank'

export function C2CCreateOrderPage() {
  const navigate = useNavigate()
  const [orderType, setOrderType] = useState<OrderType>('sell')
  const [price, setPrice] = useState('')
  const [minAmount, setMinAmount] = useState('')
  const [maxAmount, setMaxAmount] = useState('')
  const [available, setAvailable] = useState('')
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([])
  const [processingTime, setProcessingTime] = useState('30')
  const [notes, setNotes] = useState('')

  // 切换支付方式
  const togglePaymentMethod = (method: PaymentMethod) => {
    if (paymentMethods.includes(method)) {
      setPaymentMethods(paymentMethods.filter(m => m !== method))
    } else {
      setPaymentMethods([...paymentMethods, method])
    }
  }

  // 提交挂单
  const handleSubmit = () => {
    if (!price || !minAmount || !maxAmount || !available) {
      toast.error('请填写完整信息')
      return
    }
    if (paymentMethods.length === 0) {
      toast.error('请至少选择一种支付方式')
      return
    }
    if (parseFloat(minAmount) >= parseFloat(maxAmount)) {
      toast.error('最大限额必须大于最小限额')
      return
    }
    if (parseFloat(available) < parseFloat(minAmount)) {
      toast.error('可用数量不能小于最小限额')
      return
    }

    // 这里应该调用API创建挂单
    toast.success(orderType === 'sell' ? '出售挂单创建成功' : '回收挂单创建成功')
    navigate('/c2c')
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
            <h1 className="text-white text-lg font-semibold flex-1">
              {orderType === 'sell' ? '出售USDT' : '回收USDT'}
            </h1>
          </div>
        </div>
      </div>

      <div className="px-4 py-6 space-y-4">
        {/* 订单类型切换 */}
        <Card className="bg-white/5 border-white/10 p-4">
          <div className="flex gap-2">
            <button
              onClick={() => setOrderType('sell')}
              className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-2 ${
                orderType === 'sell'
                  ? 'bg-[#A3F030] text-black'
                  : 'bg-white/10 text-white/60'
              }`}
            >
              <TrendingUp className="w-4 h-4" />
              出售USDT
            </button>
            <button
              onClick={() => setOrderType('buy')}
              className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-2 ${
                orderType === 'buy'
                  ? 'bg-[#A3F030] text-black'
                  : 'bg-white/10 text-white/60'
              }`}
            >
              <TrendingDown className="w-4 h-4" />
              回收USDT
            </button>
          </div>
        </Card>

        {/* 价格设置 */}
        <Card className="bg-white/5 border-white/10 p-4">
          <label className="text-white/70 text-sm mb-2 block">单价 (CNY/USDT)</label>
          <div className="relative">
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="请输入价格"
              className="w-full h-12 pl-4 pr-12 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-white/40 focus:outline-none focus:border-[#A3F030]"
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-white/60 text-sm">CNY</span>
          </div>
          <div className="mt-2 text-white/50 text-xs">
            当前市场价: ¥7.15/USDT
          </div>
        </Card>

        {/* 限额设置 */}
        <Card className="bg-white/5 border-white/10 p-4">
          <div className="space-y-4">
            <div>
              <label className="text-white/70 text-sm mb-2 block">最小限额 (CNY)</label>
              <input
                type="number"
                value={minAmount}
                onChange={(e) => setMinAmount(e.target.value)}
                placeholder="请输入最小限额"
                className="w-full h-12 px-4 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-white/40 focus:outline-none focus:border-[#A3F030]"
              />
            </div>
            <div>
              <label className="text-white/70 text-sm mb-2 block">最大限额 (CNY)</label>
              <input
                type="number"
                value={maxAmount}
                onChange={(e) => setMaxAmount(e.target.value)}
                placeholder="请输入最大限额"
                className="w-full h-12 px-4 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-white/40 focus:outline-none focus:border-[#A3F030]"
              />
            </div>
          </div>
        </Card>

        {/* 可用数量 */}
        <Card className="bg-white/5 border-white/10 p-4">
          <label className="text-white/70 text-sm mb-2 block">
            {orderType === 'sell' ? '可用USDT数量' : '可用CNY数量'}
          </label>
          <div className="relative">
            <input
              type="number"
              value={available}
              onChange={(e) => setAvailable(e.target.value)}
              placeholder="请输入可用数量"
              className="w-full h-12 pl-4 pr-16 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-white/40 focus:outline-none focus:border-[#A3F030]"
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-white/60 text-sm">
              {orderType === 'sell' ? 'USDT' : 'CNY'}
            </span>
          </div>
        </Card>

        {/* 支付方式 */}
        <Card className="bg-white/5 border-white/10 p-4">
          <label className="text-white/70 text-sm mb-3 block">支付方式</label>
          <div className="grid grid-cols-3 gap-3">
            <button
              onClick={() => togglePaymentMethod('alipay')}
              className={`p-4 rounded-lg border-2 transition-all ${
                paymentMethods.includes('alipay')
                  ? 'border-[#A3F030] bg-[#A3F030]/10'
                  : 'border-white/10 bg-white/5'
              }`}
            >
              <AlipayIcon className={`w-6 h-6 mx-auto mb-2 ${paymentMethods.includes('alipay') ? 'text-[#A3F030]' : 'text-white/60'}`} />
              <div className={`text-xs text-center ${paymentMethods.includes('alipay') ? 'text-[#A3F030]' : 'text-white/60'}`}>
                支付宝
              </div>
            </button>
            <button
              onClick={() => togglePaymentMethod('wechat')}
              className={`p-4 rounded-lg border-2 transition-all ${
                paymentMethods.includes('wechat')
                  ? 'border-[#A3F030] bg-[#A3F030]/10'
                  : 'border-white/10 bg-white/5'
              }`}
            >
              <WeChatIcon className={`w-6 h-6 mx-auto mb-2 ${paymentMethods.includes('wechat') ? 'text-[#A3F030]' : 'text-white/60'}`} />
              <div className={`text-xs text-center ${paymentMethods.includes('wechat') ? 'text-[#A3F030]' : 'text-white/60'}`}>
                微信
              </div>
            </button>
            <button
              onClick={() => togglePaymentMethod('bank')}
              className={`p-4 rounded-lg border-2 transition-all ${
                paymentMethods.includes('bank')
                  ? 'border-[#A3F030] bg-[#A3F030]/10'
                  : 'border-white/10 bg-white/5'
              }`}
            >
              <CreditCard className={`w-6 h-6 mx-auto mb-2 ${paymentMethods.includes('bank') ? 'text-[#A3F030]' : 'text-white/60'}`} />
              <div className={`text-xs text-center ${paymentMethods.includes('bank') ? 'text-[#A3F030]' : 'text-white/60'}`}>
                银行卡
              </div>
            </button>
          </div>
        </Card>

        {/* 处理时间 */}
        <Card className="bg-white/5 border-white/10 p-4">
          <label className="text-white/70 text-sm mb-2 block">处理时间 (分钟)</label>
          <select
            value={processingTime}
            onChange={(e) => setProcessingTime(e.target.value)}
            className="w-full h-12 px-4 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#A3F030]"
          >
            <option value="15" className="bg-black">15分钟</option>
            <option value="30" className="bg-black">30分钟</option>
            <option value="60" className="bg-black">1小时</option>
            <option value="120" className="bg-black">2小时</option>
          </select>
        </Card>

        {/* 备注 */}
        <Card className="bg-white/5 border-white/10 p-4">
          <label className="text-white/70 text-sm mb-2 block">备注 (可选)</label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="请输入备注信息"
            rows={3}
            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-white/40 focus:outline-none focus:border-[#A3F030] resize-none"
          />
        </Card>

        {/* 提示信息 */}
        <Card className="bg-yellow-500/10 border-yellow-500/20 p-4">
          <div className="flex items-start gap-2">
            <Info className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
            <div className="text-white/80 text-xs space-y-1">
              <div>• 挂单后，您的广告将在C2C市场展示</div>
              <div>• 请确保账户有足够的USDT/CNY余额</div>
              <div>• 请及时处理订单，避免超时</div>
            </div>
          </div>
        </Card>

        {/* 提交按钮 */}
        <Button
          onClick={handleSubmit}
          className="w-full bg-[#A3F030] hover:bg-[#8FD622] text-black text-base font-semibold py-6"
        >
          创建挂单
        </Button>
      </div>

      <MobileBottomNav />
    </div>
  )
}

