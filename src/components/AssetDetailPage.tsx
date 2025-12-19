import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Button } from './ui/button'
import { Card } from './ui/card'
import { 
  ChevronDown,
  History,
  RefreshCcw
} from 'lucide-react'
import { ChevronLeftIcon } from './ui/chevron-left-icon'
import { useAuth } from '../hooks/useAuth'
import { hzUserService, hzCoinsCogsService, hzRechargeService, hzWithdrawService, hzBillService, type HzCoinsCogs, type HzRecharge, type HzWithdraw, type HzBill } from '../services/hzDatabase'
import { toast } from 'sonner'

// 交易历史类型
interface TransactionHistory {
  id: string
  type: 'deposit' | 'withdraw' | 'transfer'
  amount: number
  status: 'completed' | 'pending' | 'failed'
  time: string
  txHash?: string
  coinname: string
}

// 理财产品类型
interface FinancialProduct {
  id: string
  name: string
  coin: string
  type: 'flexible' | 'fixed'
  interestRate: string
  period?: string
  icon: string
}

export function AssetDetailPage() {
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()
  const { user, loading: authLoading } = useAuth()
  const [coinData, setCoinData] = useState<HzCoinsCogs | null>(null)
  const [balance, setBalance] = useState(0)
  const [availableBalance, setAvailableBalance] = useState(0)
  const [frozenBalance, setFrozenBalance] = useState(0)
  const [transactions, setTransactions] = useState<TransactionHistory[]>([])
  const [filterType, setFilterType] = useState<'all' | 'deposit' | 'withdraw' | 'transfer'>('all')
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)

  // 理财产品数据（模拟数据，实际应该从数据库读取）
  const financialProducts: FinancialProduct[] = [
    {
      id: '1',
      name: '灵活理财',
      coin: 'USDT',
      type: 'flexible',
      interestRate: '3.00-3.01%',
      icon: 'https://assets.coingecko.com/coins/images/325/small/Tether.png'
    },
    {
      id: '2',
      name: '双币理财',
      coin: 'BTC-USDT',
      type: 'fixed',
      interestRate: '2.20-3.70%',
      period: '7天',
      icon: 'https://assets.coingecko.com/coins/images/1/small/bitcoin.png'
    }
  ]

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
        // 获取币种信息
        const coins = await hzCoinsCogsService.getAllCoins()
        const coin = coins.find(c => c.coinname?.toUpperCase() === id.toUpperCase() && c.state === 1)

        if (!coin) {
          setNotFound(true)
          return
        }

        setCoinData(coin)

        // 获取用户信息
        const hzUser = await hzUserService.getOrCreateUserFromAuth(user.email || '')

        // 根据币种名称获取余额
        const coinname = coin.coinname?.toUpperCase() || ''
        let balanceValue = 0
        let frozenValue = 0

        if (coinname === 'USDT') {
          balanceValue = hzUser.usdtbalance || 0
          frozenValue = hzUser.usdtbalance_dj || 0
        } else if (coinname === 'BTC') {
          balanceValue = hzUser.btcbalance || 0
        } else if (coinname === 'ETH') {
          balanceValue = hzUser.ethbalance || 0
        }

        setBalance(balanceValue)
        setAvailableBalance(balanceValue - frozenValue)
        setFrozenBalance(frozenValue)

        // 获取交易历史
        const [recharges, withdraws, bills] = await Promise.all([
          hzRechargeService.getAllRecharges({ uid: hzUser.id, coinname: coinname }, 50, 0),
          hzWithdrawService.getAllWithdraws({ uid: hzUser.id, coinname: coinname }, 50, 0),
          hzBillService.getAllBills({ uid: hzUser.id }, 50, 0)
        ])

        // 合并交易记录
        const history: TransactionHistory[] = []

        recharges.forEach((recharge) => {
          history.push({
            id: `recharge-${recharge.id}`,
            type: 'deposit',
            amount: Number(recharge.num || 0),
            status: recharge.state === 2 ? 'completed' : recharge.state === 1 ? 'pending' : 'failed',
            time: new Date(recharge.addtime).toLocaleString('zh-CN'),
            txHash: recharge.txid,
            coinname: recharge.coinname || ''
          })
        })

        withdraws.forEach((withdraw) => {
          history.push({
            id: `withdraw-${withdraw.id}`,
            type: 'withdraw',
            amount: Number(withdraw.num || 0),
            status: withdraw.state === 1 ? 'completed' : withdraw.state === 0 ? 'pending' : 'failed',
            time: new Date(withdraw.addtime).toLocaleString('zh-CN'),
            txHash: withdraw.txid,
            coinname: withdraw.coinname || ''
          })
        })

        // 从资金记录中筛选转账记录（acttype可能需要根据实际情况调整）
        bills
          .filter(bill => {
            const billCoin = bill.remarks?.toUpperCase() || ''
            return billCoin.includes(coinname) || bill.type?.toUpperCase().includes(coinname)
          })
          .forEach((bill) => {
            history.push({
              id: `bill-${bill.id}`,
              type: 'transfer',
              amount: Number(bill.num || 0),
              status: bill.state === 1 ? 'completed' : 'pending',
              time: new Date(bill.addtime).toLocaleString('zh-CN'),
              coinname: coinname
            })
          })

        // 按时间排序
        history.sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime())
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

  // 过滤交易记录
  const filteredTransactions = transactions.filter(tx => {
    if (filterType === 'all') return true
    return tx.type === filterType
  })

  // 获取交易类型标签
  const getTypeLabel = (type: TransactionHistory['type']) => {
    const labels = {
      deposit: '充值',
      withdraw: '提现',
      transfer: '转账'
    }
    return labels[type]
  }

  // 获取状态颜色
  const getStatusColor = (status: TransactionHistory['status']) => {
    switch (status) {
      case 'completed': return 'text-green-400'
      case 'pending': return 'text-yellow-400'
      case 'failed': return 'text-red-400'
      default: return 'text-gray-400'
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <img 
            src="/logo.1730b8a9.gif" 
            alt="Loading..." 
            style={{
              maxWidth: '200px',
              height: 'auto'
            }}
          />
        </div>
      </div>
    )
  }

  if (notFound || !coinData) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center gap-6 text-center px-6">
        <div className="w-20 h-20 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
          <History className="w-10 h-10 text-white/40" />
        </div>
        <div className="space-y-2">
          <h2 className="text-white text-2xl font-semibold">币种不存在</h2>
          <p className="text-white/50 text-sm">该币种未启用或不存在。</p>
        </div>
        <Button onClick={() => navigate('/assets')} className="bg-[#A3F030] hover:bg-[#8FD622] text-black">
          返回资产列表
        </Button>
      </div>
    )
  }

  // 过滤匹配当前币种的理财产品
  const matchedProducts = financialProducts.filter(p => 
    p.coin === coinData.coinname?.toUpperCase() || 
    p.coin.includes(coinData.coinname?.toUpperCase() || '')
  )

  return (
    <div className="min-h-screen bg-black pb-24">
      {/* 顶部导航栏 */}
      <div className="sticky top-0 z-40 bg-black/95 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="relative flex items-center justify-center">
            {/* 返回按钮 - 绝对定位在左边 */}
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => navigate('/assets')}
              className="absolute left-0 text-white/70 hover:text-white p-2"
            >
              <ChevronLeftIcon size={20} />
            </Button>
            {/* 图标和币种名称 - 居中 */}
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-[#A3F030] flex items-center justify-center flex-shrink-0">
                {coinData.coinlogo ? (
                  <img src={coinData.coinlogo} alt={coinData.coinname} className="w-full h-full rounded-full object-cover" />
                ) : (
                  <span className="text-black font-bold text-sm">{coinData.coinname?.[0]}</span>
                )}
              </div>
              <h1 className="text-white text-lg font-semibold">{coinData.coinname}</h1>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
        {/* 资产余额卡片 */}
        <Card className="bg-white/5 border-white/10">
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-white text-lg font-semibold">资产余额</h2>
              <Button 
                variant="ghost" 
                size="sm"
                className="text-white/70 hover:text-white p-2"
              >
                <RefreshCcw className="w-4 h-4" />
              </Button>
            </div>

            {/* 总余额 */}
            <div className="mb-6">
              <div className="text-3xl font-bold text-white mb-2">
                {balance.toFixed(2)}
              </div>
              <div className="grid grid-cols-2 gap-4 mt-4">
                <div>
                  <div className="text-white/50 text-sm mb-1">可用资产</div>
                  <div className="text-white font-semibold">{availableBalance.toFixed(2)}</div>
                </div>
                <div>
                  <div className="text-white/50 text-sm mb-1">冻结资产</div>
                  <div className="text-white font-semibold">{frozenBalance.toFixed(2)}</div>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* 理财部分 */}
        {matchedProducts.length > 0 && (
          <div>
            <h2 className="text-white text-lg font-semibold mb-4">理财</h2>
            <div className="grid grid-cols-2 gap-4">
              {matchedProducts.map((product) => (
                <Card key={product.id} className="bg-white/5 border-white/10 hover:bg-white/10 transition-all cursor-pointer">
                  <div className="p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-8 h-8 rounded-full bg-[#A3F030] flex items-center justify-center flex-shrink-0">
                        {product.icon ? (
                          <img src={product.icon} alt={product.coin} className="w-full h-full rounded-full object-cover" />
                        ) : (
                          <span className="text-black font-bold text-xs">{product.coin[0]}</span>
                        )}
                      </div>
                      <span className="text-white font-medium text-sm">{product.coin}</span>
                    </div>
                    <div className="text-white/70 text-sm mb-2">{product.name}</div>
                    <div className="text-[#A3F030] text-lg font-bold mb-3">{product.interestRate}</div>
                    {product.period && (
                      <div className="inline-block px-2 py-1 bg-white/10 rounded-full text-white/70 text-xs">
                        {product.period}
                      </div>
                    )}
                    {!product.period && (
                      <div className="inline-block px-2 py-1 bg-white/10 rounded-full text-white/70 text-xs">
                        活期
                      </div>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* 历史记录 */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-white text-lg font-semibold">历史记录</h2>
            <div className="relative">
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value as any)}
                className="appearance-none bg-white/5 border border-white/10 rounded-lg px-4 py-2 pr-8 text-white text-sm focus:outline-none focus:border-[#A3F030]/50"
              >
                <option value="all" className="bg-slate-900">全部</option>
                <option value="deposit" className="bg-slate-900">充值</option>
                <option value="withdraw" className="bg-slate-900">提现</option>
                <option value="transfer" className="bg-slate-900">转账</option>
              </select>
              <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40 pointer-events-none" />
            </div>
          </div>

          {filteredTransactions.length === 0 ? (
            <Card className="bg-white/5 border-white/10">
              <div className="p-8 text-center">
                <History className="w-12 h-12 text-white/20 mx-auto mb-3" />
                <p className="text-white/50 text-sm">暂无交易记录</p>
              </div>
            </Card>
          ) : (
            <div className="space-y-2">
              {filteredTransactions.map((tx) => (
                <Card key={tx.id} className="bg-white/5 border-white/10 hover:bg-white/10 transition-all">
                  <div className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          tx.type === 'deposit' ? 'bg-green-500/20' :
                          tx.type === 'withdraw' ? 'bg-red-500/20' :
                          'bg-blue-500/20'
                        }`}>
                          <History className={`w-5 h-5 ${
                            tx.type === 'deposit' ? 'text-green-400' :
                            tx.type === 'withdraw' ? 'text-red-400' :
                            'text-blue-400'
                          }`} />
                        </div>
                        <div>
                          <div className="text-white font-semibold">{getTypeLabel(tx.type)}</div>
                          <div className="text-white/50 text-sm">{tx.time}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className={`font-semibold ${
                          tx.type === 'deposit' ? 'text-green-400' : 'text-red-400'
                        }`}>
                          {tx.type === 'deposit' ? '+' : '-'}{tx.amount.toFixed(8)} {tx.coinname}
                        </div>
                        <div className={`text-sm ${getStatusColor(tx.status)}`}>
                          {tx.status === 'completed' ? '已完成' : tx.status === 'pending' ? '处理中' : '失败'}
                        </div>
                      </div>
                    </div>
                    {tx.txHash && (
                      <div className="mt-2 text-xs text-white/40 font-mono truncate">
                        {tx.txHash}
                      </div>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* 底部操作按钮 */}
      <div className="fixed bottom-0 left-0 right-0 bg-black/95 backdrop-blur-xl border-t border-white/10 z-30">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <Button 
              onClick={() => navigate('/deposit')}
              className="bg-[#A3F030] hover:bg-[#8FD622] text-black h-12 text-base font-semibold rounded-xl"
            >
              买币
            </Button>
            <Button 
              onClick={() => navigate('/assets')}
              variant="outline"
              className="border-white/20 text-white hover:bg-white/10 h-12 text-base font-semibold rounded-xl"
            >
              划转
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
