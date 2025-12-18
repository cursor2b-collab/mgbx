import { useState, useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from './ui/button'
import { Card } from './ui/card'
import { Badge } from './ui/badge'
import { Input } from './ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs'
import { MobileBottomNav } from './MobileBottomNav'
import { 
  ArrowLeft,
  AlertCircle,
  Info,
  Wallet,
  ChevronRight,
  Search,
  CheckCircle2,
  Clock,
  XCircle
} from 'lucide-react'
import { toast } from 'sonner'
import { useAuth } from '../hooks/useAuth'
import { hzUserService, hzWithdrawService, hzWithdrawBankService, type HzWithdraw, type HzWithdrawBank } from '../services/hzDatabase'

// 币种类型
interface CryptoAsset {
  symbol: string
  name: string
  icon: string
  balance: number
  networks: Network[]
}

// 网络类型
interface Network {
  id: string
  name: string
  fullName: string
  minWithdraw: number
  maxWithdraw: number
  fee: number
  estimatedTime: string
}

type WithdrawStatus = 'pending' | 'processing' | 'completed' | 'failed' | 'rejected' | 'cancelled'

interface WithdrawHistoryItem {
  id: string
  asset: string
  network: string
  amount: number
  fee: number
  address: string
  status: WithdrawStatus
  time: string
  txHash?: string
}

export function WithdrawPage() {
  const navigate = useNavigate()
  const { user, loading: authLoading } = useAuth()
  const [assets, setAssets] = useState<CryptoAsset[]>([])
  const [selectedAsset, setSelectedAsset] = useState<CryptoAsset | null>(null)
  const [selectedNetwork, setSelectedNetwork] = useState<Network | null>(null)
  const [withdrawAddress, setWithdrawAddress] = useState('')
  const [withdrawAmount, setWithdrawAmount] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [withdrawals, setWithdrawals] = useState<WithdrawHistoryItem[]>([])
  const [historyLoading, setHistoryLoading] = useState(true)
  const [assetsLoading, setAssetsLoading] = useState(true)
  const [hzUserId, setHzUserId] = useState<number | null>(null)

  useEffect(() => {
    const loadData = async () => {
      if (authLoading) return
      if (!user) {
        navigate('/login', { replace: true })
        return
      }

      try {
        setAssetsLoading(true)
        // 获取或创建 hz_users 记录
        const hzUser = await hzUserService.getOrCreateUserFromAuth(user.email || '')
        setHzUserId(hzUser.id)

        // 从 hz_users 获取余额并转换为资产格式
        const formattedAssets: CryptoAsset[] = [
          {
            symbol: 'USDT',
            name: 'Tether',
            icon: 'https://assets.coingecko.com/coins/images/325/small/Tether.png',
            balance: hzUser.usdtbalance || 0,
            networks: [
              { id: 'trc20', name: 'TRC20', fullName: 'Tron (TRC20)', minWithdraw: 10, maxWithdraw: 100000, fee: 1, estimatedTime: '10分钟' },
              { id: 'erc20', name: 'ERC20', fullName: 'Ethereum (ERC20)', minWithdraw: 50, maxWithdraw: 100000, fee: 10, estimatedTime: '15分钟' },
              { id: 'bep20', name: 'BEP20', fullName: 'BNB Smart Chain (BEP20)', minWithdraw: 10, maxWithdraw: 100000, fee: 0.8, estimatedTime: '5分钟' }
            ]
          },
          {
            symbol: 'BTC',
            name: 'Bitcoin',
            icon: 'https://assets.coingecko.com/coins/images/1/small/bitcoin.png',
            balance: hzUser.btcbalance || 0,
            networks: [
              { id: 'bitcoin', name: 'Bitcoin', fullName: 'Bitcoin Network', minWithdraw: 0.001, maxWithdraw: 10, fee: 0.0005, estimatedTime: '1小时' }
            ]
          },
          {
            symbol: 'ETH',
            name: 'Ethereum',
            icon: 'https://assets.coingecko.com/coins/images/279/small/ethereum.png',
            balance: hzUser.ethbalance || 0,
            networks: [
              { id: 'erc20', name: 'ERC20', fullName: 'Ethereum Network', minWithdraw: 0.05, maxWithdraw: 50, fee: 0.005, estimatedTime: '15分钟' }
            ]
          }
        ].filter(asset => asset.balance > 0) // 只显示有余额的资产

        setAssets(formattedAssets)
      } catch (error: any) {
        console.error('获取用户资产失败:', error)
        toast.error(error.message || '获取资产失败')
      } finally {
        setAssetsLoading(false)
      }
    }

    loadData()
  }, [authLoading, user, navigate])

  useEffect(() => {
    const loadWithdrawals = async () => {
      if (authLoading) return
      if (!user || !hzUserId) return

      try {
        setHistoryLoading(true)
        // 获取加密货币提现记录
        const cryptoWithdraws = await hzWithdrawService.getAllWithdraws({ uid: hzUserId }, 100, 0)
        // 获取银行卡提现记录
        const bankWithdraws = await hzWithdrawBankService.getAllWithdrawBanks({ uid: hzUserId }, 100, 0)
        
        // 合并并格式化记录
        const formatted: WithdrawHistoryItem[] = [
          ...cryptoWithdraws.map(w => ({
            id: String(w.id),
            asset: w.coinname,
            network: 'crypto',
            amount: Number(w.num),
            fee: Number(w.fee || 0),
            address: w.address || '',
            status: w.state === 1 ? 'completed' : w.state === 2 ? 'rejected' : 'pending' as WithdrawStatus,
            time: new Date(w.addtime).toLocaleString('zh-CN'),
            txHash: w.txid || undefined,
          })),
          ...bankWithdraws.map(w => ({
            id: String(w.id),
            asset: w.coinname,
            network: 'bank',
            amount: Number(w.num),
            fee: 0,
            address: `${w.bankname || ''} ${w.bankaccount || ''}`,
            status: w.state === 1 ? 'completed' : w.state === 2 ? 'rejected' : 'pending' as WithdrawStatus,
            time: new Date(w.addtime).toLocaleString('zh-CN'),
          }))
        ].sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime())

        setWithdrawals(formatted)
      } catch (error: any) {
        console.error('获取提现记录失败:', error)
        toast.error(error.message || '获取提现记录失败')
      } finally {
        setHistoryLoading(false)
      }
    }

    if (hzUserId) {
      loadWithdrawals()
    }
  }, [authLoading, user, hzUserId])

  const mapAssetToCryptoAsset = (asset: any): CryptoAsset => {
    const NETWORK_TEMPLATES: Record<string, Network[]> = {
      USDT: [
        { id: 'trc20', name: 'TRC20', fullName: 'Tron (TRC20)', minWithdraw: 10, maxWithdraw: 100000, fee: 1, estimatedTime: '10分钟' },
        { id: 'erc20', name: 'ERC20', fullName: 'Ethereum (ERC20)', minWithdraw: 50, maxWithdraw: 100000, fee: 10, estimatedTime: '15分钟' },
        { id: 'bep20', name: 'BEP20', fullName: 'BNB Smart Chain (BEP20)', minWithdraw: 10, maxWithdraw: 100000, fee: 0.8, estimatedTime: '5分钟' }
      ],
      BTC: [
        { id: 'bitcoin', name: 'Bitcoin', fullName: 'Bitcoin Network', minWithdraw: 0.001, maxWithdraw: 10, fee: 0.0005, estimatedTime: '1小时' }
      ],
      ETH: [
        { id: 'erc20', name: 'ERC20', fullName: 'Ethereum Network', minWithdraw: 0.05, maxWithdraw: 50, fee: 0.005, estimatedTime: '15分钟' }
      ],
      BNB: [
        { id: 'bep20', name: 'BEP20', fullName: 'BNB Smart Chain', minWithdraw: 0.1, maxWithdraw: 100, fee: 0.0005, estimatedTime: '5分钟' }
      ],
    }

    const symbol = asset.symbol.toUpperCase()
    return {
      symbol,
      name: asset.name || symbol,
      icon: asset.icon || getAssetIcon(symbol),
      balance: asset.available_balance ?? asset.balance ?? 0,
      networks: NETWORK_TEMPLATES[symbol] || [
        { id: 'default', name: `${symbol} Network`, fullName: `${symbol} Network`, minWithdraw: 0.01, maxWithdraw: 1000000, fee: 0.001, estimatedTime: '15分钟' }
      ],
    }
  }

  // 格式化日期时间（已不再需要，因为数据已格式化）
  const formatDateTime = (dateStr: string) => {
    return new Date(dateStr).toLocaleString('zh-CN')
  }

  const getAssetIcon = (symbol: string) => {
    const ICON_MAP: Record<string, string> = {
      USDT: 'https://assets.coingecko.com/coins/images/325/small/Tether.png',
      BTC: 'https://assets.coingecko.com/coins/images/1/small/bitcoin.png',
      ETH: 'https://assets.coingecko.com/coins/images/279/small/ethereum.png',
      BNB: 'https://assets.coingecko.com/coins/images/825/small/bnb-icon2_2x.png',
    }
    return ICON_MAP[symbol] || 'https://www.svgrepo.com/show/428655/crypto-coin.svg'
  }

  const filteredAssets = useMemo(() => {
    return assets.filter(asset =>
      asset.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
      asset.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
  }, [assets, searchTerm])

  // 计算实际到账金额
  const actualAmount = withdrawAmount && selectedNetwork 
    ? Math.max(0, parseFloat(withdrawAmount) - selectedNetwork.fee)
    : 0

  // 提交提现
  const handleWithdraw = () => {
    if (!withdrawAddress) {
      toast.error('请输入提现地址')
      return
    }
    if (!withdrawAmount || parseFloat(withdrawAmount) <= 0) {
      toast.error('请输入提现金额')
      return
    }
    if (selectedNetwork && parseFloat(withdrawAmount) < selectedNetwork.minWithdraw) {
      toast.error(`最小提现金额为 ${selectedNetwork.minWithdraw} ${selectedAsset?.symbol}`)
      return
    }
    if (selectedNetwork && parseFloat(withdrawAmount) > selectedNetwork.maxWithdraw) {
      toast.error(`最大提现金额为 ${selectedNetwork.maxWithdraw} ${selectedAsset?.symbol}`)
      return
    }
    if (selectedAsset && parseFloat(withdrawAmount) > selectedAsset.balance) {
      toast.error('余额不足')
      return
    }

    toast.success('提现申请已提交')
    setTimeout(() => {
      navigate('/profile')
    }, 1000)
  }

  // 获取状态颜色
  const getStatusColor = (status: WithdrawStatus) => {
    switch (status) {
      case 'completed': return 'bg-green-500/20 text-green-400'
      case 'processing': return 'bg-blue-500/20 text-blue-400'
      case 'pending': return 'bg-yellow-500/20 text-yellow-400'
      case 'failed': return 'bg-red-500/20 text-red-400'
      case 'rejected':
      case 'cancelled':
        return 'bg-red-500/20 text-red-400'
      default: return 'bg-gray-500/20 text-gray-400'
    }
  }

  // 获取状态文本
  const getStatusText = (status: WithdrawStatus) => {
    switch (status) {
      case 'completed': return '已完成'
      case 'processing': return '处理中'
      case 'pending': return '待审核'
      case 'failed': return '失败'
      case 'rejected': return '已拒绝'
      case 'cancelled': return '已取消'
      default: return '未知'
    }
  }

  // 获取状态图标
  const getStatusIcon = (status: WithdrawStatus) => {
    switch (status) {
      case 'completed': return <CheckCircle2 className="w-5 h-5 text-green-400" />
      case 'processing': return <Clock className="w-5 h-5 text-blue-400" />
      case 'pending': return <Clock className="w-5 h-5 text-yellow-400" />
      case 'failed':
      case 'rejected':
      case 'cancelled':
        return <XCircle className="w-5 h-5 text-red-400" />
      default:
        return <Wallet className="w-5 h-5 text-gray-400" />
    }
  }

  return (
    <div className="min-h-screen bg-black pb-20 md:pb-8">
      {/* 顶部标题栏 */}
      <div className="sticky top-0 z-40 bg-black/95 backdrop-blur-xl border-b border-white/10">
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
            <h1 className="text-white text-xl">提现</h1>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        <Tabs defaultValue="withdraw" className="space-y-6">
          <TabsList className="bg-white/5 border-white/10 w-full grid grid-cols-2">
            <TabsTrigger value="withdraw" className="data-[state=active]:bg-[#A3F030] data-[state=active]:text-black">
              提现
            </TabsTrigger>
            <TabsTrigger value="history" className="data-[state=active]:bg-[#A3F030] data-[state=active]:text-black">
              提现记录
            </TabsTrigger>
          </TabsList>

          {/* 提现标签页 */}
          <TabsContent value="withdraw" className="space-y-6">
            {assetsLoading ? (
              <Card className="bg-white/5 border-white/10">
                <div className="p-12 text-center space-y-4">
                  <div className="w-12 h-12 mx-auto border-4 border-[#A3F030] border-t-transparent rounded-full animate-spin" />
                  <p className="text-white/50">正在加载可提现资产...</p>
                </div>
              </Card>
            ) : assets.length === 0 ? (
              <Card className="bg-white/5 border-white/10">
                <div className="p-12 text-center space-y-4">
                  <Wallet className="w-16 h-16 text-white/20 mx-auto" />
                  <p className="text-white/50">暂无可提现资产，请先完成充值或交易。</p>
                  <Button onClick={() => navigate('/deposit')} className="bg-[#A3F030] hover:bg-[#8FD622] text-black">
                    前往充值
                  </Button>
                </div>
              </Card>
            ) : !selectedAsset ? (
              <Card className="bg-white/5 border-white/10">
                <div className="p-6">
                  <h3 className="text-white font-semibold mb-4">选择提现币种</h3>
                  
                  {/* 搜索框 */}
                  <div className="relative mb-4">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                    <input
                      type="text"
                      placeholder="搜索币种..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full h-11 pl-10 pr-4 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-white/40 focus:outline-none focus:border-[#A3F030]/50"
                    />
                  </div>

                  {/* 币种列表 */}
                  <div className="space-y-2">
                    {filteredAssets.map((asset) => (
                      <div
                        key={asset.symbol}
                        onClick={() => setSelectedAsset(asset)}
                        className="flex items-center gap-4 p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-all cursor-pointer"
                      >
                        <img src={asset.icon} alt={asset.symbol} className="w-10 h-10 rounded-full" />
                        <div className="flex-1">
                          <div className="text-white font-semibold">{asset.symbol}</div>
                          <div className="text-white/50 text-sm">{asset.name}</div>
                        </div>
                        <div className="text-right">
                          <div className="text-white font-semibold">{asset.balance}</div>
                          <div className="text-white/50 text-sm">可用</div>
                        </div>
                        <ChevronRight className="w-5 h-5 text-white/40" />
                      </div>
                    ))}
                  </div>
                </div>
              </Card>
            ) : !selectedNetwork ? (
              // 选择网络
              <Card className="bg-white/5 border-white/10">
                <div className="p-6">
                  <div className="flex items-center gap-4 mb-6">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setSelectedAsset(null)}
                      className="text-white/70 hover:text-white p-0"
                    >
                      <ArrowLeft className="w-5 h-5" />
                    </Button>
                    <img src={selectedAsset.icon} alt={selectedAsset.symbol} className="w-10 h-10 rounded-full" />
                    <div className="flex-1">
                      <h3 className="text-white font-semibold">{selectedAsset.symbol}</h3>
                      <p className="text-white/50 text-sm">可用: {selectedAsset.balance}</p>
                    </div>
                  </div>

                  <h4 className="text-white font-semibold mb-4">选择提现网络</h4>
                  
                  <div className="space-y-3">
                    {selectedAsset.networks.map((network) => (
                      <div
                        key={network.id}
                        onClick={() => setSelectedNetwork(network)}
                        className="p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-all cursor-pointer"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-white font-semibold">{network.name}</span>
                          <ChevronRight className="w-5 h-5 text-white/40" />
                        </div>
                        <div className="text-white/50 text-sm mb-2">{network.fullName}</div>
                        <div className="flex items-center gap-4 text-xs">
                          <span className="text-white/40">手续费: {network.fee} {selectedAsset.symbol}</span>
                          <span className="text-white/40">预计到账: {network.estimatedTime}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </Card>
            ) : (
              // 提现表单
              <div className="space-y-4">
                {/* 返回按钮和网络信息 */}
                <Card className="bg-white/5 border-white/10">
                  <div className="p-6">
                    <div className="flex items-center gap-4 mb-6">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSelectedNetwork(null)}
                        className="text-white/70 hover:text-white p-0"
                      >
                        <ArrowLeft className="w-5 h-5" />
                      </Button>
                      <img src={selectedAsset.icon} alt={selectedAsset.symbol} className="w-10 h-10 rounded-full" />
                      <div className="flex-1">
                        <h3 className="text-white font-semibold">{selectedAsset.symbol}</h3>
                        <p className="text-white/50 text-sm">{selectedNetwork.name}</p>
                      </div>
                    </div>

                    {/* 余额显示 */}
                    <div className="mb-6 p-4 bg-[#A3F030]/10 border border-[#A3F030]/20 rounded-lg">
                      <div className="flex items-center justify-between">
                        <span className="text-white/70 text-sm">可用余额</span>
                        <span className="text-[#A3F030] font-semibold">{selectedAsset.balance} {selectedAsset.symbol}</span>
                      </div>
                    </div>

                    {/* 提现地址 */}
                    <div className="mb-4">
                      <label className="text-white/70 text-sm mb-2 block">提现地址</label>
                      <Input
                        placeholder={`请输入 ${selectedAsset.symbol} 地址`}
                        value={withdrawAddress}
                        onChange={(e) => setWithdrawAddress(e.target.value)}
                        className="bg-white/5 border-white/10 text-white placeholder:text-white/40"
                      />
                    </div>

                    {/* 提现金额 */}
                    <div className="mb-4">
                      <div className="flex items-center justify-between mb-2">
                        <label className="text-white/70 text-sm">提现金额</label>
                        <button
                          onClick={() => setWithdrawAmount(selectedAsset.balance.toString())}
                          className="text-[#A3F030] text-sm hover:underline"
                        >
                          全部
                        </button>
                      </div>
                      <Input
                        type="number"
                        placeholder="0.00"
                        value={withdrawAmount}
                        onChange={(e) => setWithdrawAmount(e.target.value)}
                        className="bg-white/5 border-white/10 text-white placeholder:text-white/40"
                      />
                      <p className="text-white/40 text-xs mt-1">
                        最小: {selectedNetwork.minWithdraw} {selectedAsset.symbol} | 
                        最大: {selectedNetwork.maxWithdraw} {selectedAsset.symbol}
                      </p>
                    </div>

                    {/* 费用明细 */}
                    <div className="mb-6 p-4 bg-white/5 rounded-lg space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-white/70">手续费</span>
                        <span className="text-white">{selectedNetwork.fee} {selectedAsset.symbol}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-white/70">实际到账</span>
                        <span className="text-[#A3F030] font-semibold">
                          {actualAmount.toFixed(8)} {selectedAsset.symbol}
                        </span>
                      </div>
                    </div>

                    {/* 提交按钮 */}
                    <Button
                      onClick={handleWithdraw}
                      className="w-full bg-[#A3F030] hover:bg-[#8FD622] text-black h-12"
                    >
                      提交提现
                    </Button>
                  </div>
                </Card>

                {/* 提现须知 */}
                <Card className="bg-white/5 border-white/10">
                  <div className="p-6">
                    <div className="flex items-center gap-2 mb-4">
                      <Info className="w-5 h-5 text-[#A3F030]" />
                      <h4 className="text-white font-semibold">提现须知</h4>
                    </div>
                    <div className="space-y-3 text-sm text-white/70">
                      <div className="flex items-start gap-2">
                        <AlertCircle className="w-4 h-4 text-yellow-400 flex-shrink-0 mt-0.5" />
                        <p>请务必确认提现地址正确，资产一旦转出无法撤回</p>
                      </div>
                      <div className="flex items-start gap-2">
                        <Clock className="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5" />
                        <p>提现申请提交后，预计 {selectedNetwork.estimatedTime} 内到账</p>
                      </div>
                      <div className="flex items-start gap-2">
                        <Wallet className="w-4 h-4 text-purple-400 flex-shrink-0 mt-0.5" />
                        <p>为保障您的资产安全，大额提现可能需要人工审核</p>
                      </div>
                    </div>
                  </div>
                </Card>
              </div>
            )}
          </TabsContent>

          {/* 提现记录标签页 */}
          <TabsContent value="history" className="space-y-4">
            {historyLoading ? (
              <Card className="bg-white/5 border-white/10">
                <div className="p-12 text-center space-y-4">
                  <div className="w-12 h-12 mx-auto border-4 border-[#A3F030] border-t-transparent rounded-full animate-spin" />
                  <p className="text-white/50">正在加载提现记录...</p>
                </div>
              </Card>
            ) : withdrawals.length === 0 ? (
              <Card className="bg-white/5 border-white/10">
                <div className="p-12 text-center">
                  <Wallet className="w-16 h-16 text-white/20 mx-auto mb-4" />
                  <p className="text-white/50">暂无提现记录</p>
                </div>
              </Card>
            ) : (
              <div className="space-y-3">
                {withdrawals.map((withdrawal) => (
                  <Card 
                    key={withdrawal.id} 
                    className="bg-white/5 border-white/10 hover:bg-white/10 transition-all cursor-pointer"
                    onClick={() => navigate(`/withdraw/${withdrawal.id}`)}
                  >
                    <div className="p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-red-500/20 flex items-center justify-center">
                            {getStatusIcon(withdrawal.status)}
                          </div>
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-white font-semibold">提现 {withdrawal.asset}</span>
                              <Badge className={getStatusColor(withdrawal.status)} variant="outline">
                                {getStatusText(withdrawal.status)}
                              </Badge>
                            </div>
                            <div className="text-white/50 text-sm">{withdrawal.time}</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-red-400 font-semibold">-{withdrawal.amount} {withdrawal.asset}</div>
                          <div className="text-white/50 text-sm">{withdrawal.network}</div>
                        </div>
                      </div>
                      <div className="text-white/40 text-xs truncate">
                        地址: {withdrawal.address}
                      </div>
                      {withdrawal.txHash && (
                        <div className="text-white/40 text-xs truncate mt-1">
                          TxHash: {withdrawal.txHash}
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

      <MobileBottomNav />
    </div>
  )
}