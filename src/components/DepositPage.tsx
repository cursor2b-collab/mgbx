import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from './ui/button'
import { Card } from './ui/card'
import { Badge } from './ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs'
import { MobileBottomNav } from './MobileBottomNav'
import { useAuth } from '../hooks/useAuth'
import { depositService, type Deposit } from '../services/database'
import { 
  ArrowLeft,
  Copy,
  CheckCircle2,
  AlertCircle,
  Info,
  QrCode,
  Wallet,
  Clock,
  ChevronRight,
  Search
} from 'lucide-react'
import { toast } from 'sonner'

// 币种类型
interface CryptoAsset {
  symbol: string
  name: string
  icon: string
  networks: Network[]
}

// 网络类型
interface Network {
  id: string
  name: string
  fullName: string
  minDeposit: number
  confirmations: number
  estimatedTime: string
  fee: number
}

// 支持的币种
const SUPPORTED_ASSETS: CryptoAsset[] = [
  {
    symbol: 'USDT',
    name: 'Tether',
    icon: 'https://assets.coingecko.com/coins/images/325/small/Tether.png',
    networks: [
      { id: 'trc20', name: 'TRC20', fullName: 'Tron (TRC20)', minDeposit: 1, confirmations: 19, estimatedTime: '2分钟', fee: 0 },
      { id: 'erc20', name: 'ERC20', fullName: 'Ethereum (ERC20)', minDeposit: 10, confirmations: 12, estimatedTime: '5分钟', fee: 0 },
      { id: 'bep20', name: 'BEP20', fullName: 'BNB Smart Chain (BEP20)', minDeposit: 1, confirmations: 15, estimatedTime: '3分钟', fee: 0 }
    ]
  },
  {
    symbol: 'BTC',
    name: 'Bitcoin',
    icon: 'https://assets.coingecko.com/coins/images/1/small/bitcoin.png',
    networks: [
      { id: 'bitcoin', name: 'Bitcoin', fullName: 'Bitcoin Network', minDeposit: 0.0001, confirmations: 2, estimatedTime: '30分钟', fee: 0 }
    ]
  },
  {
    symbol: 'ETH',
    name: 'Ethereum',
    icon: 'https://assets.coingecko.com/coins/images/279/small/ethereum.png',
    networks: [
      { id: 'erc20', name: 'ERC20', fullName: 'Ethereum Network', minDeposit: 0.01, confirmations: 12, estimatedTime: '5分钟', fee: 0 }
    ]
  },
  {
    symbol: 'BNB',
    name: 'BNB',
    icon: 'https://assets.coingecko.com/coins/images/825/small/bnb-icon2_2x.png',
    networks: [
      { id: 'bep20', name: 'BEP20', fullName: 'BNB Smart Chain', minDeposit: 0.01, confirmations: 15, estimatedTime: '3分钟', fee: 0 }
    ]
  }
]

export function DepositPage() {
  const navigate = useNavigate()
  const { user, loading: authLoading } = useAuth()
  const [selectedAsset, setSelectedAsset] = useState<CryptoAsset | null>(null)
  const [selectedNetwork, setSelectedNetwork] = useState<Network | null>(null)
  const [depositAddress, setDepositAddress] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [deposits, setDeposits] = useState<Deposit[]>([])
  const [historyLoading, setHistoryLoading] = useState(true)
  const [showQR, setShowQR] = useState(false)

  useEffect(() => {
    const loadDeposits = async () => {
      if (authLoading) return
      if (!user) {
        navigate('/login', { replace: true })
        return
      }

      try {
        setHistoryLoading(true)
        const data = await depositService.getUserDeposits(user.id)
        setDeposits(data)
      } catch (error: any) {
        console.error('获取充值记录失败:', error)
        toast.error(error.message || '获取充值记录失败')
      } finally {
        setHistoryLoading(false)
      }
    }

    loadDeposits()
  }, [authLoading, user, navigate])

  // 生成模拟地址
  useEffect(() => {
    if (selectedAsset && selectedNetwork) {
      // 模拟生成地址
      const mockAddress = `${selectedNetwork.id}_${selectedAsset.symbol}_${Math.random().toString(36).substring(2, 15)}`
      setDepositAddress(mockAddress)
    } else {
      setDepositAddress('')
    }
  }, [selectedAsset, selectedNetwork])

  // 复制地址
  const copyAddress = () => {
    navigator.clipboard.writeText(depositAddress)
    toast.success('地址已复制到剪贴板')
  }

  // 过滤币种
  const filteredAssets = SUPPORTED_ASSETS.filter(asset =>
    asset.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
    asset.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  // 获取状态颜色
  const getStatusColor = (status: Deposit['status']) => {
    switch (status) {
      case 'completed': return 'bg-green-500/20 text-green-400'
      case 'confirming': return 'bg-yellow-500/20 text-yellow-400'
      case 'pending': return 'bg-blue-500/20 text-blue-400'
      case 'failed': return 'bg-red-500/20 text-red-400'
      default: return 'bg-gray-500/20 text-gray-400'
    }
  }

  // 获取状态文本
  const getStatusText = (status: Deposit['status']) => {
    switch (status) {
      case 'completed': return '已完成'
      case 'confirming': return '确认中'
      case 'pending': return '待处理'
      case 'failed': return '失败'
      default: return '未知'
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
            <h1 className="text-white text-xl">充值</h1>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        <Tabs defaultValue="deposit" className="space-y-6">
          <TabsList className="bg-white/5 border-white/10 w-full grid grid-cols-2">
            <TabsTrigger value="deposit" className="data-[state=active]:bg-[#A3F030] data-[state=active]:text-black">
              充值
            </TabsTrigger>
            <TabsTrigger value="history" className="data-[state=active]:bg-[#A3F030] data-[state=active]:text-black">
              充值记录
            </TabsTrigger>
          </TabsList>

          {/* 充值标签页 */}
          <TabsContent value="deposit" className="space-y-6">
            {/* 选择币种 */}
            {!selectedAsset ? (
              <Card className="bg-white/5 border-white/10">
                <div className="p-6">
                  <h3 className="text-white font-semibold mb-4">选择充值币种</h3>
                  
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
                    <div>
                      <h3 className="text-white font-semibold">{selectedAsset.symbol}</h3>
                      <p className="text-white/50 text-sm">{selectedAsset.name}</p>
                    </div>
                  </div>

                  <h4 className="text-white font-semibold mb-4">选择充值网络</h4>
                  
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
                          <span className="text-white/40">最小充值: {network.minDeposit} {selectedAsset.symbol}</span>
                          <span className="text-white/40">预计到账: {network.estimatedTime}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </Card>
            ) : (
              // 显示充值地址
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

                    {/* 充值地址 */}
                    <div className="space-y-4">
                      <div>
                        <label className="text-white/70 text-sm mb-2 block">充值地址</label>
                        <div className="flex gap-2">
                          <div className="flex-1 p-3 bg-white/5 border border-white/10 rounded-lg">
                            <p className="text-white text-sm break-all">{depositAddress}</p>
                          </div>
                          <Button
                            onClick={copyAddress}
                            className="bg-[#A3F030] hover:bg-[#8FD622] text-black"
                          >
                            <Copy className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>

                      {/* 二维码 */}
                      <div className="flex justify-center">
                        <div className="w-48 h-48 bg-white rounded-lg flex items-center justify-center">
                          <QrCode className="w-40 h-40 text-black" />
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>

                {/* 充值信息 */}
                <Card className="bg-white/5 border-white/10">
                  <div className="p-6">
                    <div className="flex items-center gap-2 mb-4">
                      <Info className="w-5 h-5 text-[#A3F030]" />
                      <h4 className="text-white font-semibold">充值须知</h4>
                    </div>
                    <div className="space-y-3 text-sm text-white/70">
                      <div className="flex items-start gap-2">
                        <AlertCircle className="w-4 h-4 text-yellow-400 flex-shrink-0 mt-0.5" />
                        <p>最小充值金额: {selectedNetwork.minDeposit} {selectedAsset.symbol}</p>
                      </div>
                      <div className="flex items-start gap-2">
                        <Clock className="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5" />
                        <p>需要 {selectedNetwork.confirmations} 个区块确认，预计 {selectedNetwork.estimatedTime} 到账</p>
                      </div>
                      <div className="flex items-start gap-2">
                        <Wallet className="w-4 h-4 text-purple-400 flex-shrink-0 mt-0.5" />
                        <p>请勿向该地址充值任何非 {selectedAsset.symbol} 资产，否则资产将不可找回</p>
                      </div>
                      <div className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
                        <p>充值到账后，我们会通过邮件/短信通知您</p>
                      </div>
                    </div>
                  </div>
                </Card>
              </div>
            )}
          </TabsContent>

          {/* 充值记录标签页 */}
          <TabsContent value="history" className="space-y-4">
            {historyLoading ? (
              <Card className="bg-white/5 border-white/10">
                <div className="p-12 text-center space-y-4">
                  <div className="w-12 h-12 mx-auto border-4 border-[#A3F030] border-t-transparent rounded-full animate-spin" />
                  <p className="text-white/50">加载充值记录中...</p>
                </div>
              </Card>
            ) : deposits.length === 0 ? (
              <Card className="bg-white/5 border-white/10">
                <div className="p-12 text-center">
                  <Wallet className="w-16 h-16 text-white/20 mx-auto mb-4" />
                  <p className="text-white/50">暂无充值记录</p>
                </div>
              </Card>
            ) : (
              <div className="space-y-3">
                {deposits.map((deposit) => (
                  <Card 
                    key={deposit.id} 
                    className="bg-white/5 border-white/10 hover:bg-white/10 transition-all cursor-pointer"
                    onClick={() => navigate(`/deposit/${deposit.id}`)}
                  >
                    <div className="p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center">
                            <Wallet className="w-5 h-5 text-green-400" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-white font-semibold">充值 {deposit.asset}</span>
                              <Badge className={getStatusColor(deposit.status)} variant="outline">
                                {getStatusText(deposit.status)}
                              </Badge>
                            </div>
                            <div className="text-white/50 text-sm">{new Date(deposit.created_at).toLocaleString('zh-CN', {
                              year: 'numeric',
                              month: '2-digit',
                              day: '2-digit',
                              hour: '2-digit',
                              minute: '2-digit',
                              second: '2-digit'
                            })}</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-green-400 font-semibold">+{deposit.amount} {deposit.asset}</div>
                          <div className="text-white/50 text-sm">{deposit.network}</div>
                        </div>
                      </div>
                      {deposit.status === 'confirming' && deposit.required_confirmations > 0 && (
                        <div className="mt-3 pt-3 border-t border-white/10">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-white/50">确认进度</span>
                            <span className="text-[#A3F030]">{deposit.confirmations}/{deposit.required_confirmations}</span>
                          </div>
                          <div className="mt-2 h-1.5 bg-white/10 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-[#A3F030] transition-all"
                              style={{ width: `${Math.min(100, (deposit.confirmations / deposit.required_confirmations) * 100)}%` }}
                            />
                          </div>
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