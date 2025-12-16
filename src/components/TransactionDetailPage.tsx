import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Button } from './ui/button'
import { Card } from './ui/card'
import { Badge } from './ui/badge'
import { MobileBottomNav } from './MobileBottomNav'
import { 
  ArrowLeft,
  Copy,
  CheckCircle2,
  Clock,
  XCircle,
  AlertCircle,
  ExternalLink,
  ArrowDownLeft,
  ArrowUpRight,
  ArrowUpDown
} from 'lucide-react'
import { toast } from 'sonner'

// 交易详情类型
interface TransactionDetail {
  id: string
  type: 'deposit' | 'withdraw' | 'buy' | 'sell'
  asset: string
  network?: string
  amount: number
  fee: number
  address?: string
  price?: number
  total?: number
  status: 'pending' | 'processing' | 'confirming' | 'completed' | 'failed' | 'rejected'
  confirmations?: number
  requiredConfirmations?: number
  txHash?: string
  orderId?: string
  time: string
  completedTime?: string
  note?: string
}

// 模拟数据
const MOCK_TRANSACTIONS: { [key: string]: TransactionDetail } = {
  '1': {
    id: '1',
    type: 'deposit',
    asset: 'USDT',
    network: 'TRC20',
    amount: 1000,
    fee: 0,
    address: 'TXo8rgKpL9c2wUZ7rN3xKVPqJ5mF6Hn8rQwXz2',
    status: 'completed',
    confirmations: 19,
    requiredConfirmations: 19,
    txHash: '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef',
    time: '2025-11-06 14:30:25',
    completedTime: '2025-11-06 14:35:10'
  },
  '2': {
    id: '2',
    type: 'withdraw',
    asset: 'BTC',
    network: 'Bitcoin',
    amount: 0.01,
    fee: 0.0005,
    address: '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa',
    status: 'processing',
    txHash: '0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890',
    time: '2025-11-06 14:20:10',
    note: '提现正在处理中，预计10分钟内完成'
  },
  '3': {
    id: '3',
    type: 'buy',
    asset: 'BTC',
    amount: 0.05,
    price: 85000,
    total: 4250,
    fee: 4.25,
    status: 'completed',
    orderId: 'OD20251106131510',
    time: '2025-11-06 13:15:10',
    completedTime: '2025-11-06 13:15:11'
  },
  '4': {
    id: '4',
    type: 'sell',
    asset: 'ETH',
    amount: 1,
    price: 3300,
    total: 3300,
    fee: 3.3,
    status: 'completed',
    orderId: 'OD20251106104530',
    time: '2025-11-06 10:45:30',
    completedTime: '2025-11-06 10:45:31'
  }
}

export function TransactionDetailPage() {
  const navigate = useNavigate()
  const { id } = useParams()
  const [transaction, setTransaction] = useState<TransactionDetail | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (id && MOCK_TRANSACTIONS[id]) {
      setLoading(true)
      setTimeout(() => {
        setTransaction(MOCK_TRANSACTIONS[id])
        setLoading(false)
      }, 500)
    } else {
      navigate('/profile')
    }
  }, [id, navigate])

  // 复制文本
  const copyText = (text: string, label: string = '内容') => {
    navigator.clipboard.writeText(text)
    toast.success(`${label}已复制到剪贴板`)
  }

  // 获取状态配置
  const getStatusConfig = (status: TransactionDetail['status']) => {
    switch (status) {
      case 'completed':
        return {
          color: 'bg-green-500/20 text-green-400 border-green-500/30',
          icon: <CheckCircle2 className="w-5 h-5" />,
          label: '已完成'
        }
      case 'processing':
        return {
          color: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
          icon: <Clock className="w-5 h-5" />,
          label: '处理中'
        }
      case 'confirming':
        return {
          color: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
          icon: <Clock className="w-5 h-5" />,
          label: '确认中'
        }
      case 'pending':
        return {
          color: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
          icon: <Clock className="w-5 h-5" />,
          label: '待处理'
        }
      case 'failed':
        return {
          color: 'bg-red-500/20 text-red-400 border-red-500/30',
          icon: <XCircle className="w-5 h-5" />,
          label: '失败'
        }
      case 'rejected':
        return {
          color: 'bg-red-500/20 text-red-400 border-red-500/30',
          icon: <XCircle className="w-5 h-5" />,
          label: '已拒绝'
        }
      default:
        return {
          color: 'bg-gray-500/20 text-gray-400 border-gray-500/30',
          icon: <AlertCircle className="w-5 h-5" />,
          label: '未知'
        }
    }
  }

  // 获取交易类型配置
  const getTypeConfig = (type: TransactionDetail['type']) => {
    switch (type) {
      case 'deposit':
        return {
          label: '充值',
          icon: <ArrowDownLeft className="w-12 h-12" />,
          color: 'bg-green-500/20 text-green-400',
          amountColor: 'text-green-400'
        }
      case 'withdraw':
        return {
          label: '提现',
          icon: <ArrowUpRight className="w-12 h-12" />,
          color: 'bg-red-500/20 text-red-400',
          amountColor: 'text-red-400'
        }
      case 'buy':
        return {
          label: '买入',
          icon: <ArrowUpDown className="w-12 h-12" />,
          color: 'bg-blue-500/20 text-blue-400',
          amountColor: 'text-green-400'
        }
      case 'sell':
        return {
          label: '卖出',
          icon: <ArrowUpDown className="w-12 h-12" />,
          color: 'bg-purple-500/20 text-purple-400',
          amountColor: 'text-red-400'
        }
    }
  }

  if (loading || !transaction) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 border-4 border-[#A3F030] border-t-transparent rounded-full animate-spin" />
          <p className="text-white/50">加载中...</p>
        </div>
      </div>
    )
  }

  const statusConfig = getStatusConfig(transaction.status)
  const typeConfig = getTypeConfig(transaction.type)

  return (
    <div className="min-h-screen bg-[#0A0A0A] pb-20 md:pb-8">
      {/* 顶部导航栏 */}
      <div className="sticky top-0 z-40 bg-[#0A0A0A]/95 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => navigate(-1)}
              className="text-white/70 hover:text-white"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <h1 className="text-white text-xl">交易详情</h1>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6 space-y-4">
        {/* 状态卡片 */}
        <Card className="bg-white/5 border-white/10">
          <div className="p-6 text-center">
            {/* 图标 */}
            <div className={`w-20 h-20 rounded-full ${typeConfig.color} flex items-center justify-center mx-auto mb-4`}>
              {typeConfig.icon}
            </div>

            {/* 金额 */}
            <div className={`text-3xl font-bold mb-2 ${typeConfig.amountColor}`}>
              {(transaction.type === 'deposit' || transaction.type === 'buy') ? '+' : '-'}
              {transaction.amount} {transaction.asset}
            </div>

            {/* 状态 */}
            <Badge className={`${statusConfig.color} border px-3 py-1`}>
              <span className="flex items-center gap-2">
                {statusConfig.icon}
                {statusConfig.label}
              </span>
            </Badge>

            {/* 备注 */}
            {transaction.note && (
              <p className="text-white/50 text-sm mt-4">{transaction.note}</p>
            )}
          </div>
        </Card>

        {/* 交易信息 */}
        <Card className="bg-white/5 border-white/10">
          <div className="p-6">
            <h3 className="text-white font-semibold mb-4">交易信息</h3>
            <div className="space-y-4">
              {/* 交易类型 */}
              <div className="flex items-center justify-between">
                <span className="text-white/70">类型</span>
                <span className="text-white">{typeConfig.label}</span>
              </div>

              {/* 资产 */}
              <div className="flex items-center justify-between">
                <span className="text-white/70">资产</span>
                <span className="text-white font-semibold">{transaction.asset}</span>
              </div>

              {/* 数量 */}
              <div className="flex items-center justify-between">
                <span className="text-white/70">数量</span>
                <span className="text-white font-semibold">{transaction.amount} {transaction.asset}</span>
              </div>

              {/* 网络（充值/提现） */}
              {transaction.network && (
                <div className="flex items-center justify-between">
                  <span className="text-white/70">网络</span>
                  <span className="text-white">{transaction.network}</span>
                </div>
              )}

              {/* 价格（买入/卖出） */}
              {transaction.price && (
                <div className="flex items-center justify-between">
                  <span className="text-white/70">价格</span>
                  <span className="text-white">${transaction.price.toLocaleString()}</span>
                </div>
              )}

              {/* 总额（买入/卖出） */}
              {transaction.total && (
                <div className="flex items-center justify-between">
                  <span className="text-white/70">总额</span>
                  <span className="text-white">${transaction.total.toLocaleString()}</span>
                </div>
              )}

              {/* 手续费 */}
              <div className="flex items-center justify-between">
                <span className="text-white/70">手续费</span>
                <span className="text-white">{transaction.fee} {transaction.type === 'buy' || transaction.type === 'sell' ? 'USDT' : transaction.asset}</span>
              </div>

              {/* 订单号 */}
              {transaction.orderId && (
                <div className="flex items-center justify-between">
                  <span className="text-white/70">订单号</span>
                  <div className="flex items-center gap-2">
                    <span className="text-white text-sm">{transaction.orderId}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 w-6 p-0"
                      onClick={() => copyText(transaction.orderId!, '订单号')}
                    >
                      <Copy className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              )}

              {/* 地址（充值/提现） */}
              {transaction.address && (
                <div className="flex items-start justify-between">
                  <span className="text-white/70">地址</span>
                  <div className="flex items-center gap-2 max-w-[60%]">
                    <span className="text-white text-sm break-all text-right">{transaction.address}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 w-6 p-0 flex-shrink-0"
                      onClick={() => copyText(transaction.address!, '地址')}
                    >
                      <Copy className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              )}

              {/* 确认进度 */}
              {transaction.confirmations !== undefined && transaction.requiredConfirmations && (
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-white/70">确认进度</span>
                    <span className="text-[#A3F030]">
                      {transaction.confirmations}/{transaction.requiredConfirmations}
                    </span>
                  </div>
                  <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-[#A3F030] transition-all"
                      style={{ width: `${(transaction.confirmations / transaction.requiredConfirmations) * 100}%` }}
                    />
                  </div>
                </div>
              )}

              {/* 交易哈希 */}
              {transaction.txHash && (
                <div className="flex items-start justify-between">
                  <span className="text-white/70">TxHash</span>
                  <div className="flex items-center gap-2 max-w-[60%]">
                    <span className="text-white text-sm break-all text-right font-mono">
                      {transaction.txHash.slice(0, 10)}...{transaction.txHash.slice(-10)}
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 w-6 p-0 flex-shrink-0"
                      onClick={() => copyText(transaction.txHash!, 'TxHash')}
                    >
                      <Copy className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              )}

              {/* 时间信息 */}
              <div className="pt-4 border-t border-white/10 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-white/70">创建时间</span>
                  <span className="text-white text-sm">{transaction.time}</span>
                </div>
                {transaction.completedTime && (
                  <div className="flex items-center justify-between">
                    <span className="text-white/70">完成时间</span>
                    <span className="text-white text-sm">{transaction.completedTime}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </Card>

        {/* 区块链浏览器链接 */}
        {transaction.txHash && (
          <Card className="bg-white/5 border-white/10">
            <div className="p-6">
              <Button
                variant="outline"
                className="w-full border-[#A3F030]/30 text-[#A3F030] hover:bg-[#A3F030]/10"
                onClick={() => {
                  // 这里应该根据不同的网络跳转到对应的区块链浏览器
                  toast.info('跳转到区块链浏览器')
                }}
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                在区块链浏览器中查看
              </Button>
            </div>
          </Card>
        )}

        {/* 客服支持 */}
        {(transaction.status === 'failed' || transaction.status === 'rejected') && (
          <Card className="bg-red-500/10 border-red-500/20">
            <div className="p-6">
              <div className="flex items-start gap-3 mb-4">
                <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-red-400 font-semibold mb-1">交易异常</h4>
                  <p className="text-white/70 text-sm">
                    您的交易未能完成，如有疑问请联系客服。
                  </p>
                </div>
              </div>
              <Button
                variant="outline"
                className="w-full border-red-500/30 text-red-400 hover:bg-red-500/10"
              >
                联系客服
              </Button>
            </div>
          </Card>
        )}
      </div>

      <MobileBottomNav />
    </div>
  )
}
