import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Button } from './ui/button'
import { Card } from './ui/card'
import { MobileBottomNav } from './MobileBottomNav'
import { 
  ArrowLeft,
  TrendingUp,
  TrendingDown,
  Download,
  Upload,
  ArrowUpDown,
  Eye,
  EyeOff,
  RefreshCcw,
  ArrowUpRight,
  ArrowDownLeft,
  History as HistoryIcon
} from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import { useAuth } from '../hooks/useAuth'
import { toast } from 'sonner'
import { assetService, transactionService, depositService, withdrawService, type Asset, type Transaction, type Deposit, type Withdraw } from '../services/database'

// 资产详情类型
interface AssetDetail {
  symbol: string
  name: string
  icon: string
  balance: number
  availableBalance: number
  frozenBalance: number
  usdValue: number
  price: number
  change24h: number
  high24h: number
  low24h: number
  volume24h: number
  avgBuyPrice?: number
  profit?: number
  profitPercent?: number
}

// 交易历史类型
interface TransactionHistory {
  id: string
  type: 'deposit' | 'withdraw' | 'buy' | 'sell' | 'transfer'
  amount: number
  price?: number
  total?: number
  fee?: number
  status: 'completed' | 'pending' | 'failed' | 'confirming' | 'cancelled'
  time: string
  txHash?: string
  confirmations?: number
  requiredConfirmations?: number
  network?: string
  timestamp: number
}

// 价格历史数据
const MOCK_PRICE_HISTORY = [
  { time: '00:00', price: 87000 },
  { time: '04:00', price: 86500 },
  { time: '08:00', price: 87200 },
  { time: '12:00', price: 88000 },
  { time: '16:00', price: 87800 },
  { time: '20:00', price: 88500 },
  { time: '24:00', price: 89000 }
]

export function AssetDetailPage() {
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()
  const { user, loading: authLoading } = useAuth()
  const [assetDetail, setAssetDetail] = useState<AssetDetail | null>(null)
  const [transactions, setTransactions] = useState<TransactionHistory[]>([])
  const [hideBalance, setHideBalance] = useState(false)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    const loadData = async () => {
      if (authLoading) return
      if (!user) {
        navigate('/login', { replace: true })
        return
      }

      if (!id) return

      setLoading(true)
      setNotFound(false)

      try {
        const uppercaseSymbol = id.toUpperCase()
        const asset = await assetService.getAsset(user.id, uppercaseSymbol)

        if (!asset) {
          setNotFound(true)
          setAssetDetail(null)
          setTransactions([])
          return
        }

        setAssetDetail(mapAssetToDetail(asset))

        const [allTransactions, deposits, withdraws] = await Promise.all([
          transactionService.getUserTransactions(user.id, 100),
          depositService.getUserDeposits(user.id),
          withdrawService.getUserWithdraws(user.id),
        ])

        const history = buildTransactionHistory({
          assetSymbol: uppercaseSymbol,
          transactions: allTransactions,
          deposits,
          withdraws,
        })

        setTransactions(history)
      } catch (error: any) {
        console.error('加载资产详情失败:', error)
        toast.error(error.message || '加载资产详情失败')
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [authLoading, user, id, navigate])

  const mapAssetToDetail = (asset: Asset): AssetDetail => {
    return {
      symbol: asset.symbol,
      name: asset.name || asset.symbol,
      icon: asset.icon || getAssetIcon(asset.symbol),
      balance: asset.balance,
      availableBalance: asset.available_balance,
      frozenBalance: asset.frozen_balance,
      usdValue: asset.usd_value,
      price: asset.price,
      change24h: asset.change_24h ?? 0,
      high24h: asset.usd_value > 0 ? asset.price * 1.02 : asset.price,
      low24h: asset.usd_value > 0 ? asset.price * 0.98 : asset.price,
      volume24h: asset.usd_value,
      avgBuyPrice: asset.avg_buy_price || undefined,
      profit: asset.profit || undefined,
      profitPercent: asset.profit_percent || undefined,
    }
  }

  const getAssetIcon = (assetSymbol: string) => {
    const ICON_MAP: Record<string, string> = {
      BTC: 'https://assets.coingecko.com/coins/images/1/small/bitcoin.png',
      ETH: 'https://assets.coingecko.com/coins/images/279/small/ethereum.png',
      USDT: 'https://assets.coingecko.com/coins/images/325/small/Tether.png',
      BNB: 'https://assets.coingecko.com/coins/images/825/small/bnb-icon2_2x.png',
    }
    return ICON_MAP[assetSymbol] || 'https://www.svgrepo.com/show/428655/crypto-coin.svg'
  }

  const buildTransactionHistory = ({
    assetSymbol,
    transactions,
    deposits,
    withdraws,
  }: {
    assetSymbol: string
    transactions: Transaction[]
    deposits: Deposit[]
    withdraws: Withdraw[]
  }): TransactionHistory[] => {
    const history: TransactionHistory[] = []

    deposits
      .filter((deposit) => deposit.asset === assetSymbol)
      .forEach((deposit) => {
        history.push({
          id: deposit.id,
          type: 'deposit',
          amount: deposit.amount,
          fee: 0,
          status: deposit.status,
          time: formatDateTime(deposit.created_at),
          timestamp: new Date(deposit.created_at).getTime(),
          txHash: deposit.tx_hash || undefined,
          confirmations: deposit.confirmations,
          requiredConfirmations: deposit.required_confirmations,
          network: deposit.network,
        })
      })

    withdraws
      .filter((withdraw) => withdraw.asset === assetSymbol)
      .forEach((withdraw) => {
        history.push({
          id: withdraw.id,
          type: 'withdraw',
          amount: withdraw.amount,
          fee: withdraw.fee,
          status: withdraw.status === 'processing' ? 'pending' : withdraw.status,
          time: formatDateTime(withdraw.created_at),
          timestamp: new Date(withdraw.created_at).getTime(),
          txHash: withdraw.tx_hash || undefined,
          confirmations: withdraw.confirmations,
          requiredConfirmations: withdraw.required_confirmations,
          network: withdraw.network,
        })
      })

    transactions
      .filter((tx) => tx.asset === assetSymbol && tx.type !== 'deposit' && tx.type !== 'withdraw')
      .forEach((tx) => {
        history.push({
          id: tx.id,
          type: tx.type,
          amount: tx.amount,
          fee: 0,
          status: tx.status,
          time: formatDateTime(tx.created_at),
          timestamp: new Date(tx.created_at).getTime(),
          txHash: tx.tx_hash || undefined,
        })
      })

    return history.sort((a, b) => b.timestamp - a.timestamp)
  }

  const formatDateTime = (isoString: string) => {
    return new Date(isoString).toLocaleString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    })
  }

  // 获取交易类型标签
  const getTypeLabel = (type: TransactionHistory['type']) => {
    const labels = {
      deposit: '充值',
      withdraw: '提现',
      buy: '买入',
      sell: '卖出',
      transfer: '转账'
    }
    return labels[type]
  }

  // 获取交易类型颜色
  const getTypeColor = (type: TransactionHistory['type']) => {
    switch (type) {
      case 'deposit':
      case 'buy':
        return 'text-green-400'
      case 'withdraw':
      case 'sell':
        return 'text-red-400'
      default:
        return 'text-blue-400'
    }
  }

  // 获取交易图标
  const getTypeIcon = (type: TransactionHistory['type']) => {
    switch (type) {
      case 'deposit':
        return <ArrowDownLeft className="w-5 h-5 text-green-400" />
      case 'withdraw':
        return <ArrowUpRight className="w-5 h-5 text-red-400" />
      case 'buy':
      case 'sell':
        return <ArrowUpDown className="w-5 h-5 text-blue-400" />
      default:
        return <HistoryIcon className="w-5 h-5 text-gray-400" />
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 border-4 border-[#A3F030] border-t-transparent rounded-full animate-spin" />
          <p className="text-white/50">加载中...</p>
        </div>
      </div>
    )
  }

  if (notFound || !assetDetail) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center gap-6 text-center px-6">
        <div className="w-20 h-20 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
          <ArrowUpDown className="w-10 h-10 text-white/40" />
        </div>
        <div className="space-y-2">
          <h2 className="text-white text-2xl font-semibold">资产数据不存在</h2>
          <p className="text-white/50 text-sm">请先完成充值或交易，或返回资产列表查看其他币种。</p>
        </div>
        <div className="flex gap-3">
          <Button onClick={() => navigate('/assets')} className="bg-[#A3F030] hover:bg-[#8FD622] text-black">
            返回资产列表
          </Button>
          <Button variant="outline" className="border-white/20 text-white hover:bg-white/10" onClick={() => navigate('/deposit')}>
            去充值
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black pb-20 md:pb-8">
      {/* 顶部导航栏 */}
      <div className="sticky top-0 z-40 bg-[#0A0A0A]/95 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => navigate('/profile')}
              className="text-white/70 hover:text-white"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <img src={assetDetail.icon} alt={assetDetail.symbol} className="w-8 h-8 rounded-full" />
            <div className="flex-1">
              <h1 className="text-white text-xl">{assetDetail.symbol}</h1>
              <p className="text-white/50 text-sm">{assetDetail.name}</p>
            </div>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => setHideBalance(!hideBalance)}
              className="text-white/70 hover:text-white"
            >
              {hideBalance ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
        {/* 资产概览卡片 */}
        <Card className="bg-gradient-to-br from-[#A3F030]/20 to-[#A3F030]/5 border-[#A3F030]/20 overflow-hidden">
          <div className="p-6">
            {/* 余额 */}
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-white/70 text-sm">总余额</span>
                <RefreshCcw className="w-4 h-4 text-white/40" />
              </div>
              <div className="text-4xl font-bold text-white mb-2">
                {hideBalance ? '****' : assetDetail.balance} {assetDetail.symbol}
              </div>
              {!hideBalance && (
                <div className="flex items-center gap-3">
                  <span className="text-white/50 text-sm">≈ ${assetDetail.usdValue.toLocaleString()}</span>
                  {assetDetail.profitPercent && (
                    <div className={`flex items-center gap-1 text-sm ${assetDetail.profitPercent >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                      {assetDetail.profitPercent >= 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                      {assetDetail.profitPercent >= 0 ? '+' : ''}{assetDetail.profitPercent.toFixed(2)}%
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* 余额明细 */}
            <div className="grid grid-cols-2 gap-4 mb-6 pb-6 border-b border-white/10">
              <div>
                <div className="text-white/50 text-sm mb-1">可用</div>
                <div className="text-white font-semibold">
                  {hideBalance ? '****' : assetDetail.availableBalance}
                </div>
              </div>
              <div>
                <div className="text-white/50 text-sm mb-1">冻结</div>
                <div className="text-white font-semibold">
                  {hideBalance ? '****' : assetDetail.frozenBalance}
                </div>
              </div>
            </div>

            {/* 快捷操作 */}
            <div className="grid grid-cols-3 gap-3">
              <Button 
                onClick={() => navigate('/deposit')}
                className="bg-[#A3F030] hover:bg-[#8FD622] text-black"
              >
                <Download className="w-4 h-4 mr-1" />
                充值
              </Button>
              <Button 
                onClick={() => navigate('/withdraw')}
                variant="outline"
                className="border-[#A3F030]/30 text-[#A3F030] hover:bg-[#A3F030]/10"
              >
                <Upload className="w-4 h-4 mr-1" />
                提现
              </Button>
              <Button 
                onClick={() => navigate(`/trading?symbol=${assetDetail.symbol}USDT`)}
                variant="outline"
                className="border-white/20 text-white hover:bg-white/10"
              >
                <ArrowUpDown className="w-4 h-4 mr-1" />
                交易
              </Button>
            </div>
          </div>
        </Card>

        {/* 价格信息卡片 */}
        <Card className="bg-white/5 border-white/10">
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-white font-semibold">价格信息</h3>
              <div className={`flex items-center gap-1 ${assetDetail.change24h >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                {assetDetail.change24h >= 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                {assetDetail.change24h >= 0 ? '+' : ''}{assetDetail.change24h.toFixed(2)}%
              </div>
            </div>

            {/* 价格图表 */}
            <div className="h-48 mb-4">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={MOCK_PRICE_HISTORY}>
                  <XAxis 
                    dataKey="time" 
                    stroke="#ffffff40"
                    style={{ fontSize: '12px' }}
                  />
                  <YAxis 
                    stroke="#ffffff40"
                    style={{ fontSize: '12px' }}
                    domain={['dataMin - 1000', 'dataMax + 1000']}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#1A1A1A', 
                      border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: '8px'
                    }}
                    labelStyle={{ color: '#fff' }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="price" 
                    stroke="#A3F030" 
                    strokeWidth={2}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* 价格统计 */}
            <div className="grid grid-cols-3 gap-4">
              <div>
                <div className="text-white/50 text-xs mb-1">24H最高</div>
                <div className="text-white font-semibold text-sm">${assetDetail.high24h.toLocaleString()}</div>
              </div>
              <div>
                <div className="text-white/50 text-xs mb-1">24H最低</div>
                <div className="text-white font-semibold text-sm">${assetDetail.low24h.toLocaleString()}</div>
              </div>
              <div>
                <div className="text-white/50 text-xs mb-1">24H成交量</div>
                <div className="text-white font-semibold text-sm">${(assetDetail.volume24h / 1000000).toFixed(0)}M</div>
              </div>
            </div>
          </div>
        </Card>

        {/* 持仓信息 */}
        {assetDetail.avgBuyPrice && (
          <Card className="bg-white/5 border-white/10">
            <div className="p-6">
              <h3 className="text-white font-semibold mb-4">持仓信息</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-white/70">持仓数量</span>
                  <span className="text-white font-semibold">{assetDetail.balance} {assetDetail.symbol}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-white/70">平均成本</span>
                  <span className="text-white font-semibold">${assetDetail.avgBuyPrice.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-white/70">当前价格</span>
                  <span className="text-white font-semibold">${assetDetail.price.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between pt-3 border-t border-white/10">
                  <span className="text-white/70">持仓盈亏</span>
                  <div className="text-right">
                    <div className={`font-semibold ${assetDetail.profit && assetDetail.profit >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                      {assetDetail.profit && assetDetail.profit >= 0 ? '+' : ''}${assetDetail.profit?.toLocaleString()}
                    </div>
                    <div className={`text-sm ${assetDetail.profitPercent && assetDetail.profitPercent >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                      {assetDetail.profitPercent && assetDetail.profitPercent >= 0 ? '+' : ''}{assetDetail.profitPercent?.toFixed(2)}%
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        )}

        {/* 交易历史 */}
        <Card className="bg-white/5 border-white/10">
          <div className="p-6">
            <h3 className="text-white font-semibold mb-4">交易历史</h3>
            
            {transactions.length === 0 ? (
              <div className="py-12 text-center">
                <HistoryIcon className="w-16 h-16 text-white/20 mx-auto mb-4" />
                <p className="text-white/50">暂无交易记录</p>
              </div>
            ) : (
              <div className="space-y-3">
                {transactions.map((tx) => (
                  <div
                    key={tx.id}
                    className="p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-all cursor-pointer"
                    onClick={() => {
                      if (tx.type === 'deposit') navigate(`/deposit/${tx.id}`)
                      else if (tx.type === 'withdraw') navigate(`/withdraw/${tx.id}`)
                      else navigate(`/trade/${tx.id}`)
                    }}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          tx.type === 'deposit' ? 'bg-green-500/20' :
                          tx.type === 'withdraw' ? 'bg-red-500/20' :
                          'bg-blue-500/20'
                        }`}>
                          {getTypeIcon(tx.type)}
                        </div>
                        <div>
                          <div className="text-white font-semibold">{getTypeLabel(tx.type)}</div>
                          <div className="text-white/50 text-sm">{tx.time}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className={`font-semibold ${getTypeColor(tx.type)}`}>
                          {tx.type === 'deposit' || tx.type === 'buy' ? '+' : '-'}{tx.amount} {assetDetail.symbol}
                        </div>
                        {tx.price && (
                          <div className="text-white/50 text-sm">@ ${tx.price.toLocaleString()}</div>
                        )}
                      </div>
                    </div>
                    {tx.total && (
                      <div className="flex items-center justify-between text-xs text-white/40 pt-2 border-t border-white/10">
                        <span>总额: ${tx.total.toLocaleString()}</span>
                        <span>手续费: ${tx.fee}</span>
                      </div>
                    )}
                    {tx.type === 'deposit' && tx.status === 'confirming' && tx.requiredConfirmations && tx.requiredConfirmations > 0 && (
                      <div className="mt-3 pt-3 border-t border-white/10">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-white/50">确认进度</span>
                          <span className="text-[#A3F030]">{tx.confirmations}/{tx.requiredConfirmations}</span>
                        </div>
                        <div className="mt-2 h-1.5 bg-white/10 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-[#A3F030] transition-all"
                            style={{ width: `${Math.min(100, (tx.confirmations / tx.requiredConfirmations) * 100)}%` }}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </Card>
      </div>

      <MobileBottomNav />
    </div>
  )
}
