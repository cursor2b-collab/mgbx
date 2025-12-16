import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from './ui/button'
import { Card } from './ui/card'
import { Badge } from './ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs'
import { Navbar } from './Navbar'
import { MobileBottomNav } from './MobileBottomNav'
import { 
  Coins,
  TrendingUp,
  Shield,
  Zap,
  DollarSign,
  Percent,
  Clock,
  ArrowRight,
  ArrowUpRight,
  ArrowDownLeft,
  Info,
  CheckCircle2,
  AlertCircle,
  Calculator
} from 'lucide-react'
import { useLanguage } from '../contexts/LanguageContext'
import { LanguageSelector } from './LanguageSelector'
import React from 'react'

interface LendingAsset {
  id: string
  symbol: string
  name: string
  icon: string
  supplyAPY: number
  borrowAPY: number
  totalSupply: number
  totalBorrow: number
  liquidity: number
  collateralFactor: number
  utilizationRate: number
}

interface UserPosition {
  id: string
  type: 'supply' | 'borrow'
  asset: string
  amount: number
  apy: number
  value: number
  startTime: string
  earned?: number
}

const LENDING_ASSETS: LendingAsset[] = [
  {
    id: '1',
    symbol: 'USDT',
    name: 'Tether',
    icon: 'https://assets.coingecko.com/coins/images/325/small/Tether.png',
    supplyAPY: 8.5,
    borrowAPY: 12.3,
    totalSupply: 125000000,
    totalBorrow: 89000000,
    liquidity: 36000000,
    collateralFactor: 85,
    utilizationRate: 71.2
  },
  {
    id: '2',
    symbol: 'USDC',
    name: 'USD Coin',
    icon: 'https://assets.coingecko.com/coins/images/6319/small/USD_Coin_icon.png',
    supplyAPY: 7.8,
    borrowAPY: 11.5,
    totalSupply: 98000000,
    totalBorrow: 72000000,
    liquidity: 26000000,
    collateralFactor: 85,
    utilizationRate: 73.5
  },
  {
    id: '3',
    symbol: 'BTC',
    name: 'Bitcoin',
    icon: 'https://assets.coingecko.com/coins/images/1/small/bitcoin.png',
    supplyAPY: 2.5,
    borrowAPY: 5.8,
    totalSupply: 5600,
    totalBorrow: 3200,
    liquidity: 2400,
    collateralFactor: 75,
    utilizationRate: 57.1
  },
  {
    id: '4',
    symbol: 'ETH',
    name: 'Ethereum',
    icon: 'https://assets.coingecko.com/coins/images/279/small/ethereum.png',
    supplyAPY: 3.2,
    borrowAPY: 6.9,
    totalSupply: 85000,
    totalBorrow: 58000,
    liquidity: 27000,
    collateralFactor: 80,
    utilizationRate: 68.2
  },
  {
    id: '5',
    symbol: 'BNB',
    name: 'BNB',
    icon: 'https://assets.coingecko.com/coins/images/825/small/bnb-icon2_2x.png',
    supplyAPY: 4.5,
    borrowAPY: 8.2,
    totalSupply: 250000,
    totalBorrow: 180000,
    liquidity: 70000,
    collateralFactor: 70,
    utilizationRate: 72.0
  }
]

const USER_POSITIONS: UserPosition[] = [
  {
    id: '1',
    type: 'supply',
    asset: 'USDT',
    amount: 10000,
    apy: 8.5,
    value: 10000,
    startTime: '2025-10-15',
    earned: 425.50
  },
  {
    id: '2',
    type: 'borrow',
    asset: 'USDC',
    amount: 5000,
    apy: 11.5,
    value: 5000,
    startTime: '2025-10-20'
  },
  {
    id: '3',
    type: 'supply',
    asset: 'ETH',
    amount: 2.5,
    apy: 3.2,
    value: 8250,
    startTime: '2025-11-01',
    earned: 22.15
  }
]

export function LendingPage() {
  const navigate = useNavigate()
  const { t } = useLanguage()
  const [selectedAsset, setSelectedAsset] = useState<LendingAsset | null>(null)
  const [lendingTab, setLendingTab] = useState<'supply' | 'borrow'>('supply')

  // 计算用户总资产
  const totalSupplied = USER_POSITIONS
    .filter(p => p.type === 'supply')
    .reduce((sum, p) => sum + p.value, 0)

  const totalBorrowed = USER_POSITIONS
    .filter(p => p.type === 'borrow')
    .reduce((sum, p) => sum + p.value, 0)

  const totalEarned = USER_POSITIONS
    .filter(p => p.type === 'supply' && p.earned)
    .reduce((sum, p) => sum + (p.earned || 0), 0)

  const netAPY = totalSupplied > 0 
    ? USER_POSITIONS.filter(p => p.type === 'supply')
        .reduce((sum, p) => sum + (p.value * p.apy / 100), 0) / totalSupplied 
    : 0

  return (
    <div className="min-h-screen bg-black pb-24">
      <Navbar />

      {/* Hero Section */}
      <div className="bg-gradient-to-br from-[#A3F030]/20 via-black to-black border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 py-16">
          <div className="flex items-center justify-between mb-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-[#A3F030]/20 flex items-center justify-center">
                  <Coins className="w-6 h-6 text-[#A3F030]" />
                </div>
                <h1 className="text-4xl font-bold text-white">加密货币借贷</h1>
              </div>
              <p className="text-white/70 text-lg max-w-2xl">
                安全、透明的DeFi借贷协议 - 存入资产赚取收益，或抵押借款获取流动性
              </p>
            </div>
            <LanguageSelector />
          </div>

          {/* 用户总览 */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="bg-white/5 border-white/10">
              <div className="p-4">
                <div className="flex items-center gap-3 mb-2">
                  <TrendingUp className="w-5 h-5 text-[#A3F030]" />
                  <span className="text-white/70 text-sm">供应总额</span>
                </div>
                <div className="text-2xl font-bold text-white">${totalSupplied.toLocaleString()}</div>
                <div className="text-[#A3F030] text-sm mt-1">赚取收益中</div>
              </div>
            </Card>

            <Card className="bg-white/5 border-white/10">
              <div className="p-4">
                <div className="flex items-center gap-3 mb-2">
                  <DollarSign className="w-5 h-5 text-blue-400" />
                  <span className="text-white/70 text-sm">借款总额</span>
                </div>
                <div className="text-2xl font-bold text-white">${totalBorrowed.toLocaleString()}</div>
                <div className="text-white/50 text-sm mt-1">使用中额度</div>
              </div>
            </Card>

            <Card className="bg-white/5 border-white/10">
              <div className="p-4">
                <div className="flex items-center gap-3 mb-2">
                  <Percent className="w-5 h-5 text-purple-400" />
                  <span className="text-white/70 text-sm">净APY</span>
                </div>
                <div className="text-2xl font-bold text-white">{netAPY.toFixed(2)}%</div>
                <div className="text-white/50 text-sm mt-1">平均收益率</div>
              </div>
            </Card>

            <Card className="bg-white/5 border-white/10">
              <div className="p-4">
                <div className="flex items-center gap-3 mb-2">
                  <Coins className="w-5 h-5 text-yellow-400" />
                  <span className="text-white/70 text-sm">累计收益</span>
                </div>
                <div className="text-2xl font-bold text-[#A3F030]">${totalEarned.toFixed(2)}</div>
                <div className="text-white/50 text-sm mt-1">总赚取金额</div>
              </div>
            </Card>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <Tabs defaultValue="markets" className="space-y-6">
          <TabsList className="bg-white/5 border-white/10">
            <TabsTrigger value="markets" className="data-[state=active]:bg-[#A3F030] data-[state=active]:text-black">
              <TrendingUp className="w-4 h-4 mr-2" />
              借贷市场
            </TabsTrigger>
            <TabsTrigger value="positions" className="data-[state=active]:bg-[#A3F030] data-[state=active]:text-black">
              <Shield className="w-4 h-4 mr-2" />
              我的仓位
            </TabsTrigger>
            <TabsTrigger value="calculator" className="data-[state=active]:bg-[#A3F030] data-[state=active]:text-black">
              <Calculator className="w-4 h-4 mr-2" />
              收益计算器
            </TabsTrigger>
          </TabsList>

          {/* 借贷市场 */}
          <TabsContent value="markets" className="space-y-4">
            {/* 切换供应/借款 */}
            <div className="flex gap-2 mb-4">
              <Button
                onClick={() => setLendingTab('supply')}
                className={lendingTab === 'supply' ? 'bg-[#A3F030] text-black' : 'bg-white/5 text-white'}
              >
                <ArrowDownLeft className="w-4 h-4 mr-2" />
                供应资产
              </Button>
              <Button
                onClick={() => setLendingTab('borrow')}
                className={lendingTab === 'borrow' ? 'bg-blue-500 text-white' : 'bg-white/5 text-white'}
              >
                <ArrowUpRight className="w-4 h-4 mr-2" />
                借款
              </Button>
            </div>

            {/* 资产列表 */}
            <div className="space-y-3">
              {LENDING_ASSETS.map((asset) => (
                <Card key={asset.id} className="bg-white/5 border-white/10 hover:bg-white/10 transition-all">
                  <div className="p-4">
                    <div className="flex items-center justify-between">
                      {/* 资产信息 */}
                      <div className="flex items-center gap-4 flex-1">
                        <img src={asset.icon} alt={asset.symbol} className="w-10 h-10 rounded-full" />
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-white font-semibold">{asset.symbol}</span>
                            <span className="text-white/50 text-sm">{asset.name}</span>
                          </div>
                          <div className="text-white/60 text-sm">
                            抵押率: {asset.collateralFactor}%
                          </div>
                        </div>
                      </div>

                      {/* APY信息 */}
                      <div className="grid grid-cols-4 gap-8 flex-1">
                        <div>
                          <div className="text-white/50 text-xs mb-1">
                            {lendingTab === 'supply' ? '存款APY' : '借款APY'}
                          </div>
                          <div className={`font-semibold ${lendingTab === 'supply' ? 'text-[#A3F030]' : 'text-blue-400'}`}>
                            {lendingTab === 'supply' ? asset.supplyAPY : asset.borrowAPY}%
                          </div>
                        </div>
                        <div>
                          <div className="text-white/50 text-xs mb-1">总存款</div>
                          <div className="text-white">
                            ${(asset.totalSupply / 1000000).toFixed(2)}M
                          </div>
                        </div>
                        <div>
                          <div className="text-white/50 text-xs mb-1">总借款</div>
                          <div className="text-white">
                            ${(asset.totalBorrow / 1000000).toFixed(2)}M
                          </div>
                        </div>
                        <div>
                          <div className="text-white/50 text-xs mb-1">利用率</div>
                          <div className="text-white">{asset.utilizationRate.toFixed(1)}%</div>
                        </div>
                      </div>

                      {/* 操作按钮 */}
                      <div className="flex gap-2">
                        <Button 
                          size="sm"
                          className={lendingTab === 'supply' ? 'bg-[#A3F030] hover:bg-[#8FD622] text-black' : 'bg-blue-500 hover:bg-blue-600 text-white'}
                          onClick={() => setSelectedAsset(asset)}
                        >
                          {lendingTab === 'supply' ? '供应' : '借款'}
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            {/* 说明卡片 */}
            <Card className="bg-gradient-to-br from-blue-500/10 to-transparent border-blue-500/20">
              <div className="p-6">
                <div className="flex gap-4">
                  <Info className="w-6 h-6 text-blue-400 flex-shrink-0" />
                  <div>
                    <h3 className="text-white font-semibold mb-2">如何使用借贷服务</h3>
                    <ul className="text-white/70 text-sm space-y-2">
                      <li>• <strong>供应资产</strong>: 存入加密货币资产，自动开始赚取利息</li>
                      <li>• <strong>抵押借款</strong>: 使用您的资产作为抵押，借出其他币种</li>
                      <li>• <strong>随时提取</strong>: 供应的资产可随时提取，无锁定期</li>
                      <li>• <strong>安全保障</strong>: 智能合约审计，资金池保险，清算机制保护</li>
                    </ul>
                  </div>
                </div>
              </div>
            </Card>
          </TabsContent>

          {/* 我的仓位 */}
          <TabsContent value="positions" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* 供应仓位 */}
              <div className="space-y-3">
                <h3 className="text-white font-semibold flex items-center gap-2">
                  <ArrowDownLeft className="w-5 h-5 text-[#A3F030]" />
                  我的供应
                </h3>
                {USER_POSITIONS.filter(p => p.type === 'supply').map((position) => (
                  <Card key={position.id} className="bg-white/5 border-white/10">
                    <div className="p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-[#A3F030]/20 flex items-center justify-center">
                            <Coins className="w-5 h-5 text-[#A3F030]" />
                          </div>
                          <div>
                            <div className="text-white font-semibold">{position.asset}</div>
                            <div className="text-white/50 text-sm">APY: {position.apy}%</div>
                          </div>
                        </div>
                        <Badge className="bg-green-500/20 text-green-400">
                          <CheckCircle2 className="w-3 h-3 mr-1" />
                          赚取中
                        </Badge>
                      </div>

                      <div className="grid grid-cols-2 gap-4 mb-3 pb-3 border-b border-white/10">
                        <div>
                          <div className="text-white/50 text-xs mb-1">供应数量</div>
                          <div className="text-white font-semibold">{position.amount.toLocaleString()}</div>
                        </div>
                        <div>
                          <div className="text-white/50 text-xs mb-1">价值</div>
                          <div className="text-white font-semibold">${position.value.toLocaleString()}</div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-white/50 text-xs mb-1">已赚取</div>
                          <div className="text-[#A3F030] font-semibold">+${position.earned?.toFixed(2)}</div>
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" className="border-white/20 text-white">
                            提取
                          </Button>
                          <Button size="sm" className="bg-[#A3F030] hover:bg-[#8FD622] text-black">
                            追加
                          </Button>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>

              {/* 借款仓位 */}
              <div className="space-y-3">
                <h3 className="text-white font-semibold flex items-center gap-2">
                  <ArrowUpRight className="w-5 h-5 text-blue-400" />
                  我的借款
                </h3>
                {USER_POSITIONS.filter(p => p.type === 'borrow').map((position) => (
                  <Card key={position.id} className="bg-white/5 border-white/10">
                    <div className="p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center">
                            <DollarSign className="w-5 h-5 text-blue-400" />
                          </div>
                          <div>
                            <div className="text-white font-semibold">{position.asset}</div>
                            <div className="text-white/50 text-sm">APY: {position.apy}%</div>
                          </div>
                        </div>
                        <Badge className="bg-yellow-500/20 text-yellow-400">
                          <Clock className="w-3 h-3 mr-1" />
                          使用中
                        </Badge>
                      </div>

                      <div className="grid grid-cols-2 gap-4 mb-3 pb-3 border-b border-white/10">
                        <div>
                          <div className="text-white/50 text-xs mb-1">借款数量</div>
                          <div className="text-white font-semibold">{position.amount.toLocaleString()}</div>
                        </div>
                        <div>
                          <div className="text-white/50 text-xs mb-1">价值</div>
                          <div className="text-white font-semibold">${position.value.toLocaleString()}</div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-white/50 text-xs mb-1">开始时间</div>
                          <div className="text-white text-sm">{position.startTime}</div>
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" className="bg-blue-500 hover:bg-blue-600 text-white">
                            还款
                          </Button>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>

          {/* 收益计算器 */}
          <TabsContent value="calculator">
            <Card className="bg-white/5 border-white/10">
              <div className="p-8">
                <div className="text-center max-w-2xl mx-auto">
                  <Calculator className="w-16 h-16 mx-auto mb-4 text-[#A3F030]" />
                  <h3 className="text-2xl font-bold text-white mb-2">收益计算器</h3>
                  <p className="text-white/60 mb-8">
                    计算您的借贷收益 - 功能开发中
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
                    <div>
                      <label className="text-white/70 text-sm mb-2 block">存入金额 (USD)</label>
                      <input
                        type="number"
                        placeholder="10000"
                        className="w-full h-12 px-4 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-white/40"
                      />
                    </div>
                    <div>
                      <label className="text-white/70 text-sm mb-2 block">存款期限</label>
                      <select className="w-full h-12 px-4 bg-white/5 border border-white/10 rounded-lg text-white">
                        <option>30 天</option>
                        <option>90 天</option>
                        <option>180 天</option>
                        <option>365 天</option>
                      </select>
                    </div>
                  </div>
                  <Button className="bg-[#A3F030] hover:bg-[#8FD622] text-black mt-6 w-full md:w-auto px-8">
                    计算收益
                  </Button>
                </div>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      <MobileBottomNav />
    </div>
  )
}
