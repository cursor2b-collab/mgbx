import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from './ui/button'
import { Card } from './ui/card'
import { Badge } from './ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs'
import { MobileBottomNav } from './MobileBottomNav'
import { Navbar } from './Navbar'
import { useAuth } from '../hooks/useAuth'
import { projectId } from '../utils/supabase/info'
import { 
  Wallet,
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
  ArrowDownLeft,
  History,
  RefreshCcw,
  Search,
  ChevronRight,
  PieChart,
  Download,
  Upload,
  Clock,
  CheckCircle2,
  XCircle,
  Filter,
  LogOut
} from 'lucide-react'
import { PieChart as RechartsPie, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts'
import { toast } from 'sonner'

// 资产类型
interface Asset {
  id: string
  symbol: string
  name: string
  icon: string
  balance: number
  availableBalance: number
  frozenBalance: number
  usdValue: number
  price: number
  change24h: number
  avgBuyPrice?: number
  profit?: number
  profitPercent?: number
}

// 交易记录类型
interface Transaction {
  id: string
  type: 'deposit' | 'withdraw' | 'buy' | 'sell' | 'transfer'
  asset: string
  amount: number
  status: 'completed' | 'pending' | 'failed'
  time: string
  txHash?: string
}

// 模拟资产数据
const MOCK_ASSETS: Asset[] = [
  {
    id: '1',
    symbol: 'USDT',
    name: 'Tether',
    icon: 'https://assets.coingecko.com/coins/images/325/small/Tether.png',
    balance: 10000,
    availableBalance: 8500,
    frozenBalance: 1500,
    usdValue: 10000,
    price: 1,
    change24h: 0.01,
    avgBuyPrice: 1,
    profit: 0,
    profitPercent: 0
  },
  {
    id: '2',
    symbol: 'BTC',
    name: 'Bitcoin',
    icon: 'https://assets.coingecko.com/coins/images/1/small/bitcoin.png',
    balance: 0.5,
    availableBalance: 0.5,
    frozenBalance: 0,
    usdValue: 43500,
    price: 87000,
    change24h: 2.45,
    avgBuyPrice: 75000,
    profit: 6000,
    profitPercent: 16
  },
  {
    id: '3',
    symbol: 'ETH',
    name: 'Ethereum',
    icon: 'https://assets.coingecko.com/coins/images/279/small/ethereum.png',
    balance: 5,
    availableBalance: 5,
    frozenBalance: 0,
    usdValue: 16500,
    price: 3300,
    change24h: 1.85,
    avgBuyPrice: 3000,
    profit: 1500,
    profitPercent: 10
  },
  {
    id: '4',
    symbol: 'BNB',
    name: 'BNB',
    icon: 'https://assets.coingecko.com/coins/images/825/small/bnb-icon2_2x.png',
    balance: 10,
    availableBalance: 10,
    frozenBalance: 0,
    usdValue: 6200,
    price: 620,
    change24h: -1.2,
    avgBuyPrice: 650,
    profit: -300,
    profitPercent: -4.62
  },
  {
    id: '5',
    symbol: 'SOL',
    name: 'Solana',
    icon: 'https://assets.coingecko.com/coins/images/4128/small/solana.png',
    balance: 50,
    availableBalance: 40,
    frozenBalance: 10,
    usdValue: 10500,
    price: 210,
    change24h: 3.2,
    avgBuyPrice: 180,
    profit: 1500,
    profitPercent: 16.67
  },
  {
    id: '6',
    symbol: 'DOGE',
    name: 'Dogecoin',
    icon: 'https://assets.coingecko.com/coins/images/5/small/dogecoin.png',
    balance: 0,
    availableBalance: 0,
    frozenBalance: 0,
    usdValue: 0,
    price: 0.08,
    change24h: 0.5,
    avgBuyPrice: 0.08,
    profit: 0,
    profitPercent: 0
  },
  {
    id: '7',
    symbol: 'USDC',
    name: 'USD Coin',
    icon: 'https://assets.coingecko.com/coins/images/6319/small/USD_Coin_icon.png',
    balance: 0,
    availableBalance: 0,
    frozenBalance: 0,
    usdValue: 0,
    price: 1,
    change24h: 0.01,
    avgBuyPrice: 1,
    profit: 0,
    profitPercent: 0
  },
  {
    id: '8',
    symbol: 'TRX',
    name: 'TRON',
    icon: 'https://assets.coingecko.com/coins/images/1094/small/tron-trx-logo.png',
    balance: 0,
    availableBalance: 0,
    frozenBalance: 0,
    usdValue: 0,
    price: 0.11,
    change24h: -0.3,
    avgBuyPrice: 0.11,
    profit: 0,
    profitPercent: 0
  },
  {
    id: '9',
    symbol: 'TON',
    name: 'Toncoin',
    icon: 'https://assets.coingecko.com/coins/images/17980/small/ton_symbol.png',
    balance: 0,
    availableBalance: 0,
    frozenBalance: 0,
    usdValue: 0,
    price: 5.2,
    change24h: 1.8,
    avgBuyPrice: 5.2,
    profit: 0,
    profitPercent: 0
  }
]

// 模拟交易记录
const MOCK_TRANSACTIONS: Transaction[] = [
  {
    id: '1',
    type: 'deposit',
    asset: 'USDT',
    amount: 5000,
    status: 'completed',
    time: '2025-11-06 14:30:25',
    txHash: '0x1234...5678'
  },
  {
    id: '2',
    type: 'buy',
    asset: 'BTC',
    amount: 0.05,
    status: 'completed',
    time: '2025-11-06 13:15:10'
  },
  {
    id: '3',
    type: 'withdraw',
    asset: 'ETH',
    amount: 1,
    status: 'pending',
    time: '2025-11-06 12:00:00',
    txHash: '0xabcd...efgh'
  },
  {
    id: '4',
    type: 'sell',
    asset: 'SOL',
    amount: 10,
    status: 'completed',
    time: '2025-11-06 10:45:30'
  },
  {
    id: '5',
    type: 'deposit',
    asset: 'USDT',
    amount: 3000,
    status: 'completed',
    time: '2025-11-05 16:20:15',
    txHash: '0x9876...5432'
  }
]

export function AssetsPage() {
  const navigate = useNavigate()
  const { user, session, signOut, loading: authLoading } = useAuth()
  const [assets, setAssets] = useState<Asset[]>([])
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)
  const [hideBalance, setHideBalance] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState<'all' | 'deposit' | 'withdraw' | 'trade'>('all')

  // 计算总资产
  const totalAssets = assets.reduce((sum, asset) => sum + asset.usdValue, 0)
  const totalProfit = assets.reduce((sum, asset) => sum + (asset.profit || 0), 0)
  const totalProfitPercent = totalAssets > 0 ? (totalProfit / (totalAssets - totalProfit)) * 100 : 0

  // 从API获取资产数据
  const fetchAssets = async () => {
    try {
      if (!session?.access_token) {
        console.error('No access token available')
        toast.error('请先登录')
        navigate('/login')
        return
      }

      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-2d551b3c/assets`,
        {
          headers: {
            'Authorization': `Bearer ${session.access_token}`,
            'Content-Type': 'application/json',
          },
        }
      )

      if (!response.ok) {
        if (response.status === 401) {
          toast.error('登录已过期，请重新登录')
          navigate('/login')
          return
        }
        throw new Error('Failed to fetch assets')
      }

      const data = await response.json()
      console.log('获取到的资产数据:', data)
      setAssets(data.assets || [])
    } catch (error: any) {
      console.error('获取资产失败:', error)
      toast.error(error.message || '获取资产失败')
    }
  }

  // 从API获取交易记录
  const fetchTransactions = async () => {
    try {
      if (!session?.access_token) {
        console.error('No access token available')
        return
      }

      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-2d551b3c/transactions`,
        {
          headers: {
            'Authorization': `Bearer ${session.access_token}`,
            'Content-Type': 'application/json',
          },
        }
      )

      if (!response.ok) {
        throw new Error('Failed to fetch transactions')
      }

      const data = await response.json()
      console.log('获取到的交易记录:', data)
      
      // 格式化交易时间
      const formattedTransactions = (data.transactions || []).map((tx: any) => ({
        ...tx,
        time: new Date(tx.time).toLocaleString('zh-CN', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        })
      }))
      
      setTransactions(formattedTransactions)
    } catch (error: any) {
      console.error('获取交易记录失败:', error)
      toast.error(error.message || '获取交易记录失败')
    }
  }

  // 加载数据
  useEffect(() => {
    const loadData = async () => {
      if (authLoading) return

      if (!user || !session) {
        console.log('用户未登录，跳转到登录页')
        navigate('/login')
        return
      }

      setLoading(true)
      await Promise.all([fetchAssets(), fetchTransactions()])
      setLoading(false)
    }

    loadData()
  }, [authLoading, user, session])

  // 刷新数据
  const handleRefresh = async () => {
    setLoading(true)
    await Promise.all([fetchAssets(), fetchTransactions()])
    setLoading(false)
    toast.success('刷新成功')
  }

  // 过滤资产
  const filteredAssets = assets.filter(asset => 
    asset.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
    asset.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  // 过滤交易记录
  const filteredTransactions = transactions.filter(tx => {
    if (filterType === 'all') return true
    if (filterType === 'deposit') return tx.type === 'deposit'
    if (filterType === 'withdraw') return tx.type === 'withdraw'
    if (filterType === 'trade') return tx.type === 'buy' || tx.type === 'sell'
    return true
  })

  // 资产分布数据
  const pieData = filteredAssets.map(asset => ({
    name: asset.symbol,
    value: asset.usdValue
  }))

  const COLORS = ['#A3F030', '#00C49F', '#FFBB28', '#FF8042', '#8884D8']

  // 获取交易类型标签
  const getTypeLabel = (type: Transaction['type']) => {
    const labels = {
      deposit: '充值',
      withdraw: '提现',
      buy: '买入',
      sell: '卖出',
      transfer: '转账'
    }
    return labels[type]
  }

  // 获取状态颜色
  const getStatusColor = (status: Transaction['status']) => {
    switch (status) {
      case 'completed': return 'bg-green-500/20 text-green-400'
      case 'pending': return 'bg-yellow-500/20 text-yellow-400'
      case 'failed': return 'bg-red-500/20 text-red-400'
      default: return 'bg-gray-500/20 text-gray-400'
    }
  }

  // 获取状态图标
  const getStatusIcon = (status: Transaction['status']) => {
    switch (status) {
      case 'completed': return <CheckCircle2 className="w-4 h-4" />
      case 'pending': return <Clock className="w-4 h-4" />
      case 'failed': return <XCircle className="w-4 h-4" />
      default: return null
    }
  }

  // 处理退出登录
  const handleLogout = async () => {
    try {
      await signOut()
      toast.success('退出登录成功')
      navigate('/')
    } catch (error) {
      toast.error('退出登录失败')
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

  return (
    <div className="min-h-screen bg-black pb-24">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
        {/* 资产概览卡片 */}
        <Card className="bg-gradient-to-br from-[#A3F030]/20 to-[#A3F030]/5 border-[#A3F030]/20 overflow-hidden">
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Wallet className="w-5 h-5 text-[#A3F030]" />
                <span className="text-white/70 text-sm">总资产 (USDT)</span>
              </div>
              <Button size="sm" variant="ghost" className="text-[#A3F030] hover:bg-[#A3F030]/10" onClick={handleRefresh}>
                <RefreshCcw className="w-4 h-4" />
              </Button>
            </div>

            <div className="space-y-3">
              <div>
                <div className="text-4xl font-bold text-white mb-2">
                  {hideBalance ? '****' : totalAssets.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </div>
                {!hideBalance && (
                  <div className="flex items-center gap-2">
                    <span className="text-white/50 text-sm">≈ ${totalAssets.toLocaleString()}</span>
                    <div className={`flex items-center gap-1 text-sm ${totalProfitPercent >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                      {totalProfitPercent >= 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                      {totalProfitPercent >= 0 ? '+' : ''}{totalProfitPercent.toFixed(2)}%
                    </div>
                  </div>
                )}
              </div>

              {/* 快捷操作按钮 */}
              <div className="grid grid-cols-2 gap-3 pt-4">
                <Button 
                  onClick={() => navigate('/deposit')}
                  className="bg-[#A3F030] hover:bg-[#8FD622] text-black h-11"
                >
                  <Download className="w-4 h-4 mr-2" />
                  充值
                </Button>
                <Button 
                  onClick={() => navigate('/withdraw')}
                  variant="outline" 
                  className="border-[#A3F030]/30 text-[#A3F030] hover:bg-[#A3F030]/10 h-11"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  提现
                </Button>
              </div>
            </div>
          </div>
        </Card>

        {/* 主要内容标签页 */}
        <Tabs defaultValue="assets" className="space-y-4">
          <TabsList className="bg-white/5 border-white/10 w-full grid grid-cols-3">
            <TabsTrigger value="assets" className="data-[state=active]:bg-[#A3F030] data-[state=active]:text-black">
              资产列表
            </TabsTrigger>
            <TabsTrigger value="distribution" className="data-[state=active]:bg-[#A3F030] data-[state=active]:text-black">
              资产分布
            </TabsTrigger>
            <TabsTrigger value="records" className="data-[state=active]:bg-[#A3F030] data-[state=active]:text-black">
              资产记录
            </TabsTrigger>
          </TabsList>

          {/* 资产列表 */}
          <TabsContent value="assets" className="space-y-4">
            {/* 搜索框 */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
              <input
                type="text"
                placeholder="搜索币种..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full h-11 pl-10 pr-4 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-white/40 focus:outline-none focus:border-[#A3F030]/50"
              />
            </div>

            {/* 资产列表 */}
            {filteredAssets.length === 0 ? (
              <Card className="bg-white/5 border-white/10">
                <div className="p-8 text-center space-y-3">
                  <div className="mx-auto w-14 h-14 rounded-full bg-white/10 flex items-center justify-center">
                    <Wallet className="w-7 h-7 text-white/60" />
                  </div>
                  <h3 className="text-white text-lg font-semibold">暂无资产</h3>
                  <p className="text-white/50 text-sm">完成充值或交易后，这里会展示您的资产明细。</p>
                  <div className="flex gap-3 justify-center">
                    <Button onClick={() => navigate('/deposit')} className="bg-[#A3F030] hover:bg-[#8FD622] text-black h-10 px-6">
                      <Download className="w-4 h-4 mr-2" />充值
                    </Button>
                    <Button onClick={() => navigate('/trading')} variant="outline" className="border-white/20 text-white hover:bg-white/10 h-10 px-6">
                      去交易
                    </Button>
                  </div>
                </div>
              </Card>
            ) : (
              <div className="space-y-2">
                {filteredAssets.map((asset) => (
                  <Card 
                    key={asset.id} 
                    onClick={() => navigate(`/asset/${asset.symbol}`)}
                    className="bg-white/5 border-white/10 hover:bg-white/10 transition-all cursor-pointer"
                  >
                    <div className="p-4">
                      <div className="flex items-center gap-4">
                        {/* 图标和名称 */}
                        <img src={asset.icon} alt={asset.symbol} className="w-10 h-10 rounded-full flex-shrink-0" />
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-white font-semibold">{asset.symbol}</span>
                            <span className="text-white/50 text-sm">{asset.name}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-white/70 text-sm">
                              {hideBalance ? '****' : asset.balance.toFixed(8)}
                            </span>
                            {asset.frozenBalance > 0 && (
                              <Badge variant="outline" className="text-xs border-orange-500/50 text-orange-400">
                                冻结 {asset.frozenBalance}
                              </Badge>
                            )}
                          </div>
                        </div>

                        {/* 价值和涨跌 */}
                        <div className="text-right">
                          <div className="text-white font-semibold mb-1">
                            {hideBalance ? '****' : `$${asset.usdValue.toLocaleString()}`}
                          </div>
                          <div className="flex items-center justify-end gap-2">
                            {asset.profitPercent && (
                              <span className={`text-sm ${asset.profitPercent >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                                {asset.profitPercent >= 0 ? '+' : ''}{asset.profitPercent.toFixed(2)}%
                              </span>
                            )}
                            <ChevronRight className="w-4 h-4 text-white/40" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* 资产分布 */}
          <TabsContent value="distribution" className="space-y-4">
            <Card className="bg-white/5 border-white/10">
              <div className="p-6">
                <div className="flex items-center gap-2 mb-6">
                  <PieChart className="w-5 h-5 text-[#A3F030]" />
                  <h3 className="text-white font-semibold">资产分布图</h3>
                </div>

                {/* 饼图 */}
                <div className="h-64 mb-6">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsPie>
                      <Pie
                        data={pieData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {pieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: '#1A1A1A', 
                          border: '1px solid rgba(255,255,255,0.1)',
                          borderRadius: '8px'
                        }}
                        labelStyle={{ color: '#fff' }}
                      />
                    </RechartsPie>
                  </ResponsiveContainer>
                </div>

                {/* 资产占比列表 */}
                <div className="space-y-3">
                  {filteredAssets.map((asset, index) => (
                    <div key={asset.id} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div 
                          className="w-3 h-3 rounded-full" 
                          style={{ backgroundColor: COLORS[index % COLORS.length] }}
                        />
                        <img src={asset.icon} alt={asset.symbol} className="w-6 h-6 rounded-full" />
                        <span className="text-white">{asset.symbol}</span>
                      </div>
                      <div className="text-right">
                        <div className="text-white font-semibold">
                          ${asset.usdValue.toLocaleString()}
                        </div>
                        <div className="text-white/50 text-sm">
                          {((asset.usdValue / totalAssets) * 100).toFixed(2)}%
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          </TabsContent>

          {/* 资产记录 */}
          <TabsContent value="records" className="space-y-4">
            {/* 过滤器 */}
            <div className="flex gap-2 overflow-x-auto pb-2">
              {(['all', 'deposit', 'withdraw', 'trade'] as const).map((type) => (
                <Button
                  key={type}
                  variant={filterType === type ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setFilterType(type)}
                  className={filterType === type ? 'bg-[#A3F030] text-black hover:bg-[#8FD622]' : 'border-white/20 text-white/70'}
                >
                  {type === 'all' && '全部'}
                  {type === 'deposit' && '充值'}
                  {type === 'withdraw' && '提现'}
                  {type === 'trade' && '交易'}
                </Button>
              ))}
            </div>

            {/* 交易记录列表 */}
            {filteredTransactions.length === 0 ? (
              <Card className="bg-white/5 border-white/10">
                <div className="p-8 text-center space-y-3">
                  <div className="mx-auto w-14 h-14 rounded-full bg-white/10 flex items-center justify-center">
                    <History className="w-7 h-7 text-white/60" />
                  </div>
                  <h3 className="text-white text-lg font-semibold">暂无资产记录</h3>
                  <p className="text-white/50 text-sm">进行充值、提现或交易后，记录会显示在这里。</p>
                  <Button onClick={() => navigate('/trading')} className="bg-[#A3F030] hover:bg-[#8FD622] text-black h-10 px-6">
                    立即交易
                  </Button>
                </div>
              </Card>
            ) : (
              <div className="space-y-2">
                {filteredTransactions.map((tx) => (
                  <Card key={tx.id} className="bg-white/5 border-white/10">
                    <div className="p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                            tx.type === 'deposit' ? 'bg-green-500/20' :
                            tx.type === 'withdraw' ? 'bg-red-500/20' :
                            'bg-blue-500/20'
                          }`}>
                            {tx.type === 'deposit' && <ArrowDownLeft className="w-5 h-5 text-green-400" />}
                            {tx.type === 'withdraw' && <ArrowUpRight className="w-5 h-5 text-red-400" />}
                            {(tx.type === 'buy' || tx.type === 'sell') && <History className="w-5 h-5 text-blue-400" />}
                          </div>
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-white font-semibold">{getTypeLabel(tx.type)}</span>
                              <Badge className={getStatusColor(tx.status)} variant="outline">
                                <span className="flex items-center gap-1">
                                  {getStatusIcon(tx.status)}
                                  {tx.status === 'completed' && '已完成'}
                                  {tx.status === 'pending' && '处理中'}
                                  {tx.status === 'failed' && '失败'}
                                </span>
                              </Badge>
                            </div>
                            <div className="text-white/50 text-sm">{tx.time}</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className={`font-semibold ${
                            tx.type === 'deposit' || tx.type === 'buy' ? 'text-green-400' : 'text-red-400'
                          }`}>
                            {tx.type === 'deposit' || tx.type === 'buy' ? '+' : '-'}{tx.amount} {tx.asset}
                          </div>
                        </div>
                      </div>
                      {tx.txHash && (
                        <div className="text-xs text-white/40 truncate">
                          TxHash: {tx.txHash}
                        </div>
                      )}
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>

      {/* 移动端底部导航 */}
      <MobileBottomNav />
    </div>
  )
}