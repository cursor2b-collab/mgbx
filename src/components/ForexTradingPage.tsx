import { useState, useEffect } from 'react'
import { Card, CardContent } from './ui/card'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Checkbox } from './ui/checkbox'
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs'
import { Navbar } from './Navbar'
import { MobileBottomNav } from './MobileBottomNav'
import { MobileTradingPage } from './MobileTradingPage'
import { ImageWithFallback } from './figma/ImageWithFallback'
import { 
  Search,
  Star,
  TrendingUp,
  TrendingDown,
  ChevronRight,
  X,
  FileText
} from 'lucide-react'
import React from 'react'

// 货币对数据类型
interface ForexPair {
  symbol: string
  name: string
  price: number
  change: number
  changePercent: number
  logo: string
}

// 外汇LOGO映射
const FOREX_LOGOS: { [key: string]: string } = {
  'EUR/USD': 'https://www.bosss.club/static/img/crypto/EURUSD.svg?v=3.6.0',
  'AUD/USD': 'https://www.bosss.club/static/img/crypto/AUDUSD.svg?v=3.6.0',
  'NZD/USD': 'https://www.bosss.club/static/img/crypto/NZDUSD.svg?v=3.6.0',
  'GBP/USD': 'https://www.bosss.club/static/img/crypto/GBPUSD.svg?v=3.6.0',
  'USD/CHF': 'https://www.bosss.club/static/img/crypto/USDCHF.svg?v=3.6.0',
  'USD/JPY': 'https://www.bosss.club/static/img/crypto/USDJPY.svg?v=3.6.0',
  'USD/CAD': 'https://www.bosss.club/static/img/crypto/USDCAD.svg?v=3.6.0',
  'USD/RUB': 'https://www.bosss.club/static/img/crypto/USDRUB.svg?v=3.6.0',
  'GBP/CAD': 'https://www.bosss.club/static/img/crypto/GBPCAD.svg?v=3.6.0',
  'CAD/CHF': 'https://www.bosss.club/static/img/crypto/CADCHF.svg?v=3.6.0',
  'HKD/SGD': 'https://www.bosss.club/static/img/crypto/HKDSGD.svg?v=3.6.0',
  'AUD/CAD': 'https://www.bosss.club/static/img/crypto/AUDCAD.svg?v=3.6.0',
  'NZD/HKD': 'https://www.bosss.club/static/img/crypto/NZDHKD.svg?v=3.6.0',
}

export function ForexTradingPage() {
  const [isMobile, setIsMobile] = useState(false)
  const [selectedPair, setSelectedPair] = useState('EUR/USD')
  const [searchQuery, setSearchQuery] = useState('')
  const [priceType, setPriceType] = useState<'market' | 'limit'>('market')
  const [price, setPrice] = useState('')
  const [amount, setAmount] = useState('')
  const [stopLossEnabled, setStopLossEnabled] = useState(false)

  // 检测是否为移动设备
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 992)
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // 外汇货币对列表
  const forexPairs: ForexPair[] = [
    { symbol: 'EUR/USD', name: '欧元/美元', price: 1.0850, change: 0.0012, changePercent: 0.11, logo: FOREX_LOGOS['EUR/USD'] },
    { symbol: 'GBP/USD', name: '英镑/美元', price: 1.2640, change: -0.0024, changePercent: -0.19, logo: FOREX_LOGOS['GBP/USD'] },
    { symbol: 'USD/JPY', name: '美元/日元', price: 149.85, change: 0.45, changePercent: 0.30, logo: FOREX_LOGOS['USD/JPY'] },
    { symbol: 'USD/CHF', name: '美元/瑞郎', price: 0.8890, change: 0.0008, changePercent: 0.09, logo: FOREX_LOGOS['USD/CHF'] },
    { symbol: 'AUD/USD', name: '澳元/美元', price: 0.6520, change: -0.0015, changePercent: -0.23, logo: FOREX_LOGOS['AUD/USD'] },
    { symbol: 'USD/CAD', name: '美元/加元', price: 1.3580, change: 0.0022, changePercent: 0.16, logo: FOREX_LOGOS['USD/CAD'] },
    { symbol: 'NZD/USD', name: '纽元/美元', price: 0.5890, change: -0.0010, changePercent: -0.17, logo: FOREX_LOGOS['NZD/USD'] },
    { symbol: 'USD/RUB', name: '美元/卢布', price: 96.50, change: 0.30, changePercent: 0.31, logo: FOREX_LOGOS['USD/RUB'] },
    { symbol: 'GBP/CAD', name: '英镑/加元', price: 1.7180, change: -0.0012, changePercent: -0.07, logo: FOREX_LOGOS['GBP/CAD'] },
    { symbol: 'AUD/CAD', name: '澳元/加元', price: 0.8850, change: 0.0015, changePercent: 0.17, logo: FOREX_LOGOS['AUD/CAD'] },
    { symbol: 'CAD/CHF', name: '加元/瑞郎', price: 0.6545, change: -0.0008, changePercent: -0.12, logo: FOREX_LOGOS['CAD/CHF'] },
    { symbol: 'NZD/HKD', name: '纽元/港元', price: 4.5920, change: 0.0120, changePercent: 0.26, logo: FOREX_LOGOS['NZD/HKD'] },
    { symbol: 'HKD/SGD', name: '港元/新元', price: 0.1730, change: -0.0005, changePercent: -0.29, logo: FOREX_LOGOS['HKD/SGD'] },
  ]

  const currentPair = forexPairs.find(p => p.symbol === selectedPair) || forexPairs[0]

  const filteredPairs = forexPairs.filter(pair =>
    pair.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
    pair.name.includes(searchQuery)
  )

  // 如果是移动设备，显示移动端布局
  if (isMobile) {
    return <MobileTradingPage />
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* 顶部导航栏 */}
      <Navbar />

      {/* 主要内容区域 */}
      <div className="flex flex-col min-h-[calc(100vh-56px)] lg:h-[calc(100vh-56px)] overflow-hidden">
        {/* 顶部：货币对信息栏（标题区域 - 横跨全宽） */}
        <div className="border-b border-white/10 bg-black px-4 lg:px-6 py-3 lg:py-4 flex-shrink-0">
          <div className="flex flex-col lg:flex-row lg:items-center gap-3 lg:gap-8">
            <div>
              <div className="flex items-center gap-2 mb-1">
                {currentPair.logo && (
                  <ImageWithFallback 
                    src={currentPair.logo} 
                    alt={selectedPair}
                    className="w-8 h-8 rounded-full"
                  />
                )}
                <h2 className="text-xl font-bold">{selectedPair}</h2>
                <span className="text-xs text-white/50">
                  {currentPair.name}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-2xl font-bold">
                  {currentPair.price.toFixed(selectedPair.includes('JPY') ? 2 : 4)}
                </span>
                <span
                  className={`flex items-center gap-1 ${
                    currentPair.changePercent >= 0 ? 'text-green-500' : 'text-red-500'
                  }`}
                >
                  {currentPair.changePercent >= 0 ? (
                    <TrendingUp className="w-4 h-4" />
                  ) : (
                    <TrendingDown className="w-4 h-4" />
                  )}
                  <span>
                    {currentPair.changePercent >= 0 ? '+' : ''}
                    {currentPair.changePercent.toFixed(2)}%
                  </span>
                </span>
              </div>
            </div>

            {/* 统计信息 */}
            <div className="flex gap-4 lg:gap-8 text-sm overflow-x-auto pb-2 lg:pb-0">
              <div>
                <p className="text-white/60 mb-1 text-xs">24h最高</p>
                <p className="font-semibold text-white">
                  {(currentPair.price + Math.abs(currentPair.change) * 2).toFixed(
                    selectedPair.includes('JPY') ? 2 : 4
                  )}
                </p>
              </div>
              <div>
                <p className="text-white/60 mb-1 text-xs">24h最低</p>
                <p className="font-semibold text-white">
                  {(currentPair.price - Math.abs(currentPair.change) * 1.5).toFixed(
                    selectedPair.includes('JPY') ? 2 : 4
                  )}
                </p>
              </div>
              <div>
                <p className="text-white/60 mb-1 text-xs">点差</p>
                <p className="font-semibold text-white">1.2</p>
              </div>
            </div>
          </div>
        </div>

        {/* 下方：三栏布局 */}
        <div className="flex flex-1 min-h-0">
          {/* 左侧：货币对列表 */}
          <div className="hidden lg:flex w-64 border-r border-white/10 flex-col bg-black">
          {/* 搜索框 */}
          <div className="p-3 border-b border-white/10">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/50" />
              <Input
                placeholder="搜索货币对"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-white/40 h-9 text-sm"
              />
            </div>
          </div>

          {/* 列表标题 */}
          <div className="px-3 py-2 text-xs text-white/60 flex items-center justify-between border-b border-white/10">
            <span>货币对</span>
            <span>涨跌幅</span>
          </div>

          {/* 货币对列表 */}
          <div className="flex-1 overflow-y-auto">
            {filteredPairs.map((pair) => (
              <button
                key={pair.symbol}
                onClick={() => setSelectedPair(pair.symbol)}
                className={`w-full px-3 py-3 hover:bg-white/5 transition-colors border-b border-white/5 ${
                  selectedPair === pair.symbol ? 'bg-white/10' : ''
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    {pair.logo ? (
                      <ImageWithFallback 
                        src={pair.logo} 
                        alt={pair.symbol}
                        className="w-8 h-8 rounded-full"
                      />
                    ) : (
                      <Star className="w-3 h-3 text-white/40" />
                    )}
                    <span className="text-sm text-white">{pair.symbol}</span>
                  </div>
                  <span
                    className={`text-xs ${
                      pair.changePercent >= 0 ? 'text-green-500' : 'text-red-500'
                    }`}
                  >
                    {pair.changePercent >= 0 ? '+' : ''}
                    {pair.changePercent.toFixed(2)}%
                  </span>
                </div>
                <div className="text-xs text-white/50 truncate text-left mb-1">
                  {pair.name}
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-white">
                    {pair.price.toFixed(pair.symbol.includes('JPY') ? 2 : 4)}
                  </span>
                  <span
                    className={`text-xs ${
                      pair.change >= 0 ? 'text-green-500' : 'text-red-500'
                    }`}
                  >
                    {pair.change >= 0 ? '+' : ''}
                    {pair.change.toFixed(pair.symbol.includes('JPY') ? 2 : 4)}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>

          {/* 中间：图表+订单区域 */}
          <div className="flex-1 flex flex-col min-w-0">
              {/* TradingView 图表 */}
            <div className="flex-1 bg-black min-h-0">
              <iframe
                src={`https://www.tradingview.com/widgetembed/?frameElementId=tradingview_forex&symbol=FX:${selectedPair.replace('/', '')}&interval=D&hidesidetoolbar=0&symboledit=1&saveimage=0&toolbarbg=000000&studies=[]&theme=dark&style=1&timezone=Asia/Shanghai&studies_overrides={}&overrides={}&enabled_features=[]&disabled_features=[]&locale=zh_CN&utm_source=localhost&utm_medium=widget&utm_campaign=chart&utm_term=FX:${selectedPair.replace('/', '')}`}
                className="w-full h-full border-0"
                title="TradingView Forex Chart"
              />
            </div>

            {/* 底部：订单区域 */}
            <div className="h-64 border-t border-white/10 bg-black flex-shrink-0">
              <Tabs defaultValue="current" className="h-full flex flex-col">
                <TabsList className="w-full justify-start bg-black border-b border-white/10 rounded-none h-12 p-0">
                  <TabsTrigger 
                    value="current" 
                    className="rounded-none data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-[#A3F030] px-6 text-white/70 data-[state=active]:text-white"
                  >
                    当前委托
                  </TabsTrigger>
                  <TabsTrigger 
                    value="history" 
                    className="rounded-none data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-[#A3F030] px-6 text-white/70 data-[state=active]:text-white"
                  >
                    订单历史
                  </TabsTrigger>
                </TabsList>
                
                {/* 当前委托 */}
                <TabsContent value="current" className="flex-1 m-0 overflow-auto">
                  <div className="min-w-[800px]">
                    {/* 表头 */}
                    <div className="grid grid-cols-7 gap-4 px-6 py-3 border-b border-white/10 bg-black text-xs text-white/60 sticky top-0">
                      <div>合约名称</div>
                      <div className="text-center">盈亏</div>
                      <div className="text-center">价格</div>
                      <div className="text-center">持仓数量</div>
                      <div className="text-center">成交价/平仓价</div>
                      <div className="text-center">止盈/止损</div>
                      <div className="text-center">详情</div>
                    </div>
                    
                    {/* 空状态 */}
                    <div className="flex flex-col items-center justify-center h-[calc(100%-45px)] text-white/40">
                      <FileText className="w-12 h-12 mb-3 text-white/20" />
                      <p className="text-sm">暂无委托</p>
                    </div>
                  </div>
                </TabsContent>
                
                {/* 订单历史 */}
                <TabsContent value="history" className="flex-1 m-0 overflow-auto">
                  <div className="min-w-[800px]">
                    {/* 表头 */}
                    <div className="grid grid-cols-7 gap-4 px-6 py-3 border-b border-white/10 bg-black text-xs text-white/60 sticky top-0">
                      <div>合约名称</div>
                      <div className="text-center">盈亏</div>
                      <div className="text-center">价格</div>
                      <div className="text-center">开仓数量</div>
                      <div className="text-center">成交价/平仓价</div>
                      <div className="text-center">止盈/止损</div>
                      <div className="text-center">详情</div>
                    </div>
                    
                    {/* 空状态 */}
                    <div className="flex flex-col items-center justify-center h-[calc(100%-45px)] text-white/40">
                      <FileText className="w-12 h-12 mb-3 text-white/20" />
                      <p className="text-sm">暂无历史</p>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>

          {/* 右侧：交易操作区域 */}
          <div className="hidden lg:block w-80 border-l border-white/10 bg-black overflow-y-auto">
            <Card className="bg-black border-0 rounded-none">
              <CardContent className="p-5">
              {/* 市价/限价切换 */}
              <div className="grid grid-cols-2 gap-2 mb-6">
                <Button
                  onClick={() => setPriceType('market')}
                  className={`h-12 rounded-full ${
                    priceType === 'market'
                      ? 'text-black hover:opacity-90'
                      : 'bg-[#1a1a1a] text-white/60 hover:bg-white/10'
                  }`}
                  style={priceType === 'market' ? { backgroundColor: '#A3F030' } : {}}
                >
                  市价
                </Button>
                <Button
                  onClick={() => setPriceType('limit')}
                  className={`h-12 rounded-full ${
                    priceType === 'limit'
                      ? 'text-black hover:opacity-90'
                      : 'bg-[#1a1a1a] text-white/60 hover:bg-white/10'
                  }`}
                  style={priceType === 'limit' ? { backgroundColor: '#A3F030' } : {}}
                >
                  限价
                </Button>
              </div>

              {/* 价格输入（仅限价时显示） */}
              {priceType === 'limit' && (
                <div className="mb-5">
                  <label className="text-sm text-white mb-2 block">价格</label>
                  <div className="relative">
                    <Input
                      type="text"
                      placeholder="价格"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      className="bg-[#1a1a1a] border-white/10 rounded-xl h-12 pr-10 text-white placeholder:text-white/30"
                    />
                    {price && (
                      <button
                        onClick={() => setPrice('')}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-white/50 hover:text-white"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              )}

              {/* 保证金模式和杠杆 */}
              <div className="grid grid-cols-2 gap-3 mb-5">
                <div>
                  <label className="text-sm text-white mb-2 block">保证金模式</label>
                  <button className="w-full bg-[#1a1a1a] border-0 rounded-xl h-12 px-3 flex items-center justify-between text-white hover:bg-[#252525]">
                    <span className="text-sm">全仓</span>
                    <ChevronRight className="w-4 h-4 text-white/50" />
                  </button>
                </div>
                <div>
                  <label className="text-sm text-white mb-2 block">杠杆</label>
                  <button className="w-full bg-[#1a1a1a] border-0 rounded-xl h-12 px-3 flex items-center justify-between text-white hover:bg-[#252525]">
                    <span className="text-sm">10X</span>
                    <ChevronRight className="w-4 h-4 text-white/50" />
                  </button>
                </div>
              </div>

              {/* 数量输入 */}
              <div className="mb-5">
                <label className="text-sm text-white mb-2 block">数量</label>
                <div className="relative">
                  <Input
                    type="number"
                    placeholder="数量"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="bg-[#1a1a1a] border-0 rounded-xl h-12 pr-12 text-white placeholder:text-white/30"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-white/70 text-sm">
                    张
                  </span>
                </div>
              </div>

              {/* 百分比选择器 */}
              <div className="flex items-center gap-2 mb-2">
                <div className="w-3 h-3 rounded-full bg-[#A3F030]" />
                <div className="flex-1 h-1 bg-white/10 rounded-full relative overflow-hidden">
                  <div className="absolute inset-0 bg-[#A3F030] w-0 rounded-full" />
                </div>
              </div>
              <div className="flex items-center justify-between mb-5">
                {[0, 25, 50, 75, 100].map((percent) => (
                  <span key={percent} className="text-xs text-white/50">
                    {percent}%
                  </span>
                ))}
              </div>

              {/* 可用和换算 */}
              <div className="flex items-center justify-between text-sm mb-1">
                <span className="text-white/50">可用</span>
                <span className="text-white">0 USD</span>
              </div>
              <div className="flex items-center justify-between text-sm mb-5">
                <span className="text-white/50">换算</span>
                <span className="text-white">1张=100 USD</span>
              </div>

              {/* 止盈/止损 */}
              <div className="flex items-center gap-2 mb-5">
                <Checkbox
                  checked={stopLossEnabled}
                  onCheckedChange={(checked) => setStopLossEnabled(checked as boolean)}
                  className="border-white/30"
                />
                <span className="text-sm text-white">止盈/止损</span>
              </div>

              {/* 可开多/保证金 */}
              <div className="flex items-center justify-between text-sm mb-1">
                <span className="text-white/50">可开多</span>
                <span className="text-white">0 张</span>
              </div>
              <div className="flex items-center justify-between text-sm mb-5">
                <span className="text-white/50">保证金</span>
                <span className="text-white">0 USD</span>
              </div>

              {/* 买涨按钮 */}
              <Button
                className="w-full h-14 text-black hover:opacity-90 mb-8 rounded-xl text-center"
                style={{ backgroundColor: '#A3F030' }}
              >
                买涨
              </Button>

              {/* 止盈/止损（卖） */}
              <div className="flex items-center gap-2 mb-5">
                <Checkbox
                  checked={stopLossEnabled}
                  onCheckedChange={(checked) => setStopLossEnabled(checked as boolean)}
                  className="border-white/30"
                />
                <span className="text-sm text-white">止盈/止损</span>
              </div>

              {/* 可开空/保证金 */}
              <div className="flex items-center justify-between text-sm mb-1">
                <span className="text-white/50">可开空</span>
                <span className="text-white">0 张</span>
              </div>
              <div className="flex items-center justify-between text-sm mb-5">
                <span className="text-white/50">保证金</span>
                <span className="text-white">0 USD</span>
              </div>

              {/* 买跌按钮 */}
              <Button className="w-full h-14 bg-[#FF6B6B] hover:bg-[#FF5252] text-black rounded-xl text-center">
                买跌
              </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* 移动端底部导航 */}
      <MobileBottomNav />
    </div>
  )
}
