import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from './ui/button'
import { Card } from './ui/card'
import { Badge } from './ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs'
import { Navbar } from './Navbar'
import { MobileBottomNav } from './MobileBottomNav'
import { 
  Bot, 
  TrendingUp, 
  Zap, 
  Target, 
  Shield,
  Brain,
  Activity,
  DollarSign,
  ChevronRight,
  Play,
  Pause,
  Settings,
  BarChart3,
  Clock,
  CheckCircle2,
  AlertCircle,
  ArrowUpRight,
  ArrowDownLeft,
  Sparkles
} from 'lucide-react'
import { useLanguage } from '../contexts/LanguageContext'
import { LanguageSelector } from './LanguageSelector'

interface TradingBot {
  id: string
  name: string
  description: string
  strategy: string
  performance: number
  winRate: number
  totalTrades: number
  profit: number
  status: 'active' | 'paused' | 'stopped'
  risk: 'low' | 'medium' | 'high'
}

interface SignalHistory {
  id: string
  pair: string
  type: 'buy' | 'sell'
  price: number
  time: string
  profit?: number
  status: 'success' | 'pending' | 'failed'
}

const TRADING_BOTS: TradingBot[] = [
  {
    id: '1',
    name: 'AI趋势追踪机器人',
    description: '基于机器学习算法，自动识别市场趋势并执行交易',
    strategy: 'Trend Following',
    performance: 128.5,
    winRate: 76.3,
    totalTrades: 458,
    profit: 15670.50,
    status: 'active',
    risk: 'medium'
  },
  {
    id: '2',
    name: '网格交易机器人',
    description: '在震荡行情中自动低买高卖，获取稳定收益',
    strategy: 'Grid Trading',
    performance: 85.2,
    winRate: 82.1,
    totalTrades: 1256,
    profit: 8920.30,
    status: 'active',
    risk: 'low'
  },
  {
    id: '3',
    name: '套利机器人',
    description: '跨交易所套利，捕捉价格差异机会',
    strategy: 'Arbitrage',
    performance: 156.8,
    winRate: 91.5,
    totalTrades: 2134,
    profit: 28450.80,
    status: 'paused',
    risk: 'low'
  },
  {
    id: '4',
    name: '高频交易机器人',
    description: '毫秒级高频交易，捕捉微小价格波动',
    strategy: 'High Frequency',
    performance: 245.6,
    winRate: 68.9,
    totalTrades: 8956,
    profit: 42380.20,
    status: 'active',
    risk: 'high'
  }
]

const SIGNAL_HISTORY: SignalHistory[] = [
  {
    id: '1',
    pair: 'BTC/USDT',
    type: 'buy',
    price: 87250,
    time: '2025-11-06 15:30:25',
    profit: 1250.50,
    status: 'success'
  },
  {
    id: '2',
    pair: 'ETH/USDT',
    type: 'sell',
    price: 3315,
    time: '2025-11-06 14:15:10',
    profit: 325.80,
    status: 'success'
  },
  {
    id: '3',
    pair: 'SOL/USDT',
    type: 'buy',
    price: 212,
    time: '2025-11-06 13:45:00',
    status: 'pending'
  },
  {
    id: '4',
    pair: 'BNB/USDT',
    type: 'sell',
    price: 622,
    time: '2025-11-06 12:30:45',
    profit: -45.20,
    status: 'failed'
  }
]

export function SmartTradingPage() {
  const navigate = useNavigate()
  const { t } = useLanguage()
  const [selectedBot, setSelectedBot] = useState<TradingBot | null>(null)

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'low': return 'text-green-400 bg-green-500/20'
      case 'medium': return 'text-yellow-400 bg-yellow-500/20'
      case 'high': return 'text-red-400 bg-red-500/20'
      default: return 'text-gray-400 bg-gray-500/20'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-400 bg-green-500/20'
      case 'paused': return 'text-yellow-400 bg-yellow-500/20'
      case 'stopped': return 'text-gray-400 bg-gray-500/20'
      default: return 'text-gray-400 bg-gray-500/20'
    }
  }

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
                  <Brain className="w-6 h-6 text-[#A3F030]" />
                </div>
                <h1 className="text-4xl font-bold text-white">AI智能交易</h1>
              </div>
              <p className="text-white/70 text-lg max-w-2xl">
                采用先进的机器学习算法，自动分析市场趋势，24/7 无人值守交易
              </p>
            </div>
            <LanguageSelector />
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="bg-white/5 border-white/10">
              <div className="p-4">
                <div className="flex items-center gap-3 mb-2">
                  <DollarSign className="w-5 h-5 text-[#A3F030]" />
                  <span className="text-white/70 text-sm">总收益</span>
                </div>
                <div className="text-2xl font-bold text-white">$95,421.80</div>
                <div className="flex items-center gap-1 text-green-400 text-sm mt-1">
                  <TrendingUp className="w-4 h-4" />
                  <span>+23.5%</span>
                </div>
              </div>
            </Card>

            <Card className="bg-white/5 border-white/10">
              <div className="p-4">
                <div className="flex items-center gap-3 mb-2">
                  <Activity className="w-5 h-5 text-[#A3F030]" />
                  <span className="text-white/70 text-sm">运行中机器人</span>
                </div>
                <div className="text-2xl font-bold text-white">3</div>
                <div className="text-white/50 text-sm mt-1">共4个机器人</div>
              </div>
            </Card>

            <Card className="bg-white/5 border-white/10">
              <div className="p-4">
                <div className="flex items-center gap-3 mb-2">
                  <Target className="w-5 h-5 text-[#A3F030]" />
                  <span className="text-white/70 text-sm">胜率</span>
                </div>
                <div className="text-2xl font-bold text-white">79.7%</div>
                <div className="text-white/50 text-sm mt-1">12,804 笔交易</div>
              </div>
            </Card>

            <Card className="bg-white/5 border-white/10">
              <div className="p-4">
                <div className="flex items-center gap-3 mb-2">
                  <Zap className="w-5 h-5 text-[#A3F030]" />
                  <span className="text-white/70 text-sm">24h交易量</span>
                </div>
                <div className="text-2xl font-bold text-white">$285K</div>
                <div className="flex items-center gap-1 text-green-400 text-sm mt-1">
                  <ArrowUpRight className="w-4 h-4" />
                  <span>+15.2%</span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <Tabs defaultValue="bots" className="space-y-6">
          <TabsList className="bg-white/5 border-white/10">
            <TabsTrigger value="bots" className="data-[state=active]:bg-[#A3F030] data-[state=active]:text-black">
              <Bot className="w-4 h-4 mr-2" />
              交易机器人
            </TabsTrigger>
            <TabsTrigger value="signals" className="data-[state=active]:bg-[#A3F030] data-[state=active]:text-black">
              <Sparkles className="w-4 h-4 mr-2" />
              交易信号
            </TabsTrigger>
            <TabsTrigger value="performance" className="data-[state=active]:bg-[#A3F030] data-[state=active]:text-black">
              <BarChart3 className="w-4 h-4 mr-2" />
              绩效分析
            </TabsTrigger>
          </TabsList>

          {/* 交易机器人列表 */}
          <TabsContent value="bots" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {TRADING_BOTS.map((bot) => (
                <Card 
                  key={bot.id} 
                  className="bg-white/5 border-white/10 hover:bg-white/10 transition-all cursor-pointer"
                  onClick={() => setSelectedBot(bot)}
                >
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="w-10 h-10 rounded-full bg-[#A3F030]/20 flex items-center justify-center">
                            <Bot className="w-5 h-5 text-[#A3F030]" />
                          </div>
                          <div>
                            <h3 className="text-white font-semibold">{bot.name}</h3>
                            <Badge variant="outline" className="text-xs border-white/20 text-white/60 mt-1">
                              {bot.strategy}
                            </Badge>
                          </div>
                        </div>
                        <p className="text-white/60 text-sm mb-4">{bot.description}</p>
                      </div>
                      <Badge className={getStatusColor(bot.status)}>
                        {bot.status === 'active' && <Play className="w-3 h-3 mr-1" />}
                        {bot.status === 'paused' && <Pause className="w-3 h-3 mr-1" />}
                        {bot.status === 'active' ? '运行中' : bot.status === 'paused' ? '已暂停' : '已停止'}
                      </Badge>
                    </div>

                    {/* 性能指标 */}
                    <div className="grid grid-cols-3 gap-4 mb-4 pb-4 border-b border-white/10">
                      <div>
                        <div className="text-white/50 text-xs mb-1">总收益</div>
                        <div className="text-[#A3F030] font-semibold">+${bot.profit.toLocaleString()}</div>
                      </div>
                      <div>
                        <div className="text-white/50 text-xs mb-1">胜率</div>
                        <div className="text-white font-semibold">{bot.winRate}%</div>
                      </div>
                      <div>
                        <div className="text-white/50 text-xs mb-1">交易次数</div>
                        <div className="text-white font-semibold">{bot.totalTrades.toLocaleString()}</div>
                      </div>
                    </div>

                    {/* 底部操作 */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-white/50 text-xs">风险等级:</span>
                        <Badge variant="outline" className={getRiskColor(bot.risk)}>
                          {bot.risk === 'low' ? '低风险' : bot.risk === 'medium' ? '中风险' : '高风险'}
                        </Badge>
                      </div>
                      <Button size="sm" variant="ghost" className="text-[#A3F030] hover:bg-[#A3F030]/10">
                        配置 <Settings className="w-4 h-4 ml-1" />
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            {/* 创建新机器人 */}
            <Card className="bg-gradient-to-br from-[#A3F030]/10 to-transparent border-[#A3F030]/20 cursor-pointer hover:from-[#A3F030]/20 transition-all">
              <div className="p-8 text-center">
                <div className="w-16 h-16 rounded-full bg-[#A3F030]/20 flex items-center justify-center mx-auto mb-4">
                  <Bot className="w-8 h-8 text-[#A3F030]" />
                </div>
                <h3 className="text-white font-semibold mb-2">创建自定义机器人</h3>
                <p className="text-white/60 text-sm mb-4">根据您的交易策略定制专属AI机器人</p>
                <Button className="bg-[#A3F030] hover:bg-[#8FD622] text-black">
                  开始创建
                </Button>
              </div>
            </Card>
          </TabsContent>

          {/* 交易信号 */}
          <TabsContent value="signals" className="space-y-4">
            <div className="space-y-3">
              {SIGNAL_HISTORY.map((signal) => (
                <Card key={signal.id} className="bg-white/5 border-white/10">
                  <div className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                          signal.type === 'buy' ? 'bg-green-500/20' : 'bg-red-500/20'
                        }`}>
                          {signal.type === 'buy' ? (
                            <ArrowDownLeft className="w-6 h-6 text-green-400" />
                          ) : (
                            <ArrowUpRight className="w-6 h-6 text-red-400" />
                          )}
                        </div>
                        <div>
                          <div className="flex items-center gap-3 mb-1">
                            <span className="text-white font-semibold">{signal.pair}</span>
                            <Badge className={signal.type === 'buy' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}>
                              {signal.type === 'buy' ? '买入' : '卖出'}
                            </Badge>
                            <Badge variant="outline" className={
                              signal.status === 'success' ? 'border-green-500/50 text-green-400' :
                              signal.status === 'pending' ? 'border-yellow-500/50 text-yellow-400' :
                              'border-red-500/50 text-red-400'
                            }>
                              {signal.status === 'success' ? (
                                <><CheckCircle2 className="w-3 h-3 mr-1" /> 成功</>
                              ) : signal.status === 'pending' ? (
                                <><Clock className="w-3 h-3 mr-1" /> 进行中</>
                              ) : (
                                <><AlertCircle className="w-3 h-3 mr-1" /> 失败</>
                              )}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-4 text-sm text-white/60">
                            <span>价格: ${signal.price.toLocaleString()}</span>
                            <span>时间: {signal.time}</span>
                          </div>
                        </div>
                      </div>
                      {signal.profit !== undefined && (
                        <div className={`text-right ${signal.profit >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                          <div className="font-semibold">
                            {signal.profit >= 0 ? '+' : ''}${Math.abs(signal.profit).toFixed(2)}
                          </div>
                          <div className="text-xs">
                            {signal.profit >= 0 ? '+' : ''}{((signal.profit / signal.price) * 100).toFixed(2)}%
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* 绩效分析 */}
          <TabsContent value="performance">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-white/5 border-white/10">
                <div className="p-6">
                  <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                    <BarChart3 className="w-5 h-5 text-[#A3F030]" />
                    月度收益趋势
                  </h3>
                  <div className="h-64 flex items-center justify-center text-white/40">
                    图表区域 - 集成 TradingView 或 Recharts
                  </div>
                </div>
              </Card>

              <Card className="bg-white/5 border-white/10">
                <div className="p-6">
                  <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                    <Target className="w-5 h-5 text-[#A3F030]" />
                    策略表现对比
                  </h3>
                  <div className="h-64 flex items-center justify-center text-white/40">
                    图表区域 - 策略对比分析
                  </div>
                </div>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <MobileBottomNav />
    </div>
  )
}
