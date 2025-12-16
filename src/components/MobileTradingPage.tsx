import { useState, useEffect, useMemo } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Card } from './ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs'
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerDescription } from './ui/drawer'
import { CircleChevronDownIcon } from './ui/circle-chevron-down-icon'
import { 
  ChevronDown,
  BarChart3,
  Star,
  Settings,
  ChevronLeft,
  Info,
  Search,
  X,
  TrendingUp,
  TrendingDown
} from 'lucide-react'
import { MobileBottomNav } from './MobileBottomNav'
import { MobileCryptoTradingPage } from './MobileCryptoTradingPage'
import { MobileOptionsTradingPage } from './MobileOptionsTradingPage'
import { MobileForexTradingPage } from './MobileForexTradingPage'
import { MobileCommoditiesTradingPage } from './MobileCommoditiesTradingPage'
import { MobileCopyTradingPage } from './MobileCopyTradingPage'
import { MobileStakingPage } from './MobileStakingPage'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import React from 'react'

interface TickerData {
  symbol: string
  name: string
  lastPrice: string
  priceChangePercent: string
  highPrice: string
  lowPrice: string
  volume: string
}

interface StockItem {
  symbol: string
  name: string
  price: number
  change: number
  changePercent: number
}

interface ChartDataPoint {
  time: string
  price: number
  volume: number
}

export function MobileTradingPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  // 股票列表数据
  const stockList: StockItem[] = [
    { symbol: 'CVCO', name: 'Cavco Industries Inc.', price: 521.1, change: -14.42, changePercent: -2.69 },
    { symbol: 'AAPL', name: 'Apple Inc.', price: 178.45, change: 2.35, changePercent: 1.33 },
    { symbol: 'TSLA', name: 'Tesla, Inc.', price: 242.84, change: -5.67, changePercent: -2.28 },
    { symbol: 'NVDA', name: 'NVIDIA Corporation', price: 495.22, change: 8.91, changePercent: 1.83 },
    { symbol: 'MSFT', name: 'Microsoft Corporation', price: 378.91, change: 3.24, changePercent: 0.86 },
    { symbol: 'GOOGL', name: 'Alphabet Inc.', price: 142.56, change: -1.23, changePercent: -0.86 },
    { symbol: 'AMZN', name: 'Amazon.com Inc.', price: 178.35, change: 3.45, changePercent: 1.97 },
    { symbol: 'META', name: 'Meta Platforms Inc.', price: 485.33, change: 7.22, changePercent: 1.51 },
    { symbol: 'NFLX', name: 'Netflix Inc.', price: 512.45, change: -3.21, changePercent: -0.62 },
    { symbol: 'AMD', name: 'Advanced Micro Devices', price: 156.78, change: 4.56, changePercent: 2.99 },
  ]

  const initialSymbol = searchParams.get('symbol') || 'CVCO'
  const initialName = stockList.find(stock => stock.symbol === initialSymbol)?.name || 'Cavco Industries Inc.'
  const initialTab = (searchParams.get('tab') as 'trading' | 'copy' | 'staking' | 'ipo' | null) || 'trading'
  const initialType = (searchParams.get('type') as 'stock' | 'crypto' | 'options' | 'forex' | 'commodities' | 'copy' | null) || (initialTab === 'copy' ? 'copy' : 'stock')

  const [selectedSymbol, setSelectedSymbol] = useState(initialSymbol)
  const [selectedName, setSelectedName] = useState(initialName)
  const [selectedType, setSelectedType] = useState<'stock' | 'crypto' | 'options' | 'forex' | 'commodities' | 'copy'>(initialType)
  const [topNavTab, setTopNavTab] = useState<'trading' | 'copy' | 'staking' | 'ipo'>(initialTab === 'copy' ? 'copy' : initialTab)
  const [tradeMode, setTradeMode] = useState<'normal' | 'margin' | 'premarket'>('normal')
  const [orderType, setOrderType] = useState<'market' | 'limit'>('market')
  const [leverage, setLeverage] = useState('20X')
  const [position, setPosition] = useState('全仓')
  const [price, setPrice] = useState('')
  const [amount, setAmount] = useState('')
  const [sliderValue, setSliderValue] = useState(0)
  const [ticker, setTicker] = useState<TickerData | null>(null)
  const [isMarketClosed, setIsMarketClosed] = useState(false)
  const [stopLoss, setStopLoss] = useState(false)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [chartDrawerOpen, setChartDrawerOpen] = useState(false)
  const [timeframe, setTimeframe] = useState('1D')
  const [favorites, setFavorites] = useState<Set<string>>(new Set())
  const [inlineChartOpen, setInlineChartOpen] = useState(false)

  // 过滤股票列表
  const filteredStocks = stockList.filter(stock =>
    stock.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
    stock.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  // 模拟数据加载
  useEffect(() => {
    setTicker({
      symbol: 'CVCO',
      name: 'Cavco Industries Inc.',
      lastPrice: '425.80',
      priceChangePercent: '+2.34',
      highPrice: '430.20',
      lowPrice: '418.50',
      volume: '1.2M'
    })
  }, [])

  useEffect(() => {
    const tabParam = searchParams.get('tab')
    if (tabParam && ['trading', 'copy', 'staking', 'ipo'].includes(tabParam)) {
      setTopNavTab(tabParam as any)
    }

    const typeParam = searchParams.get('type')
    if (typeParam && ['stock', 'crypto', 'options', 'forex', 'commodities', 'copy'].includes(typeParam)) {
      setSelectedType(typeParam as any)
    }

    const symbolParam = searchParams.get('symbol')
    if (symbolParam) {
      const stock = stockList.find(s => s.symbol === symbolParam)
      if (stock) {
        setSelectedSymbol(stock.symbol)
        setSelectedName(stock.name)
      }
    }
  }, [searchParams])

  const handleSliderChange = (value: number) => {
    setSliderValue(value)
  }

  const handleStockSelect = (stock: StockItem) => {
    setSelectedSymbol(stock.symbol)
    setSelectedName(stock.name)
    setDrawerOpen(false)
    setSearchQuery('')
  }

  // 切换自选收藏
  const toggleFavorite = (symbol: string) => {
    setFavorites(prev => {
      const newFavorites = new Set(prev)
      if (newFavorites.has(symbol)) {
        newFavorites.delete(symbol)
      } else {
        newFavorites.add(symbol)
      }
      return newFavorites
    })
  }

  // 生成图表数据 - 使用 useMemo 确保在 selectedSymbol 或 timeframe 改变时更新
  const chartData = useMemo<ChartDataPoint[]>(() => {
    const stock = stockList.find(s => s.symbol === selectedSymbol)
    if (!stock) return []
    
    const basePrice = stock.price
    const dataPoints = timeframe === '1m' ? 30 : timeframe === '1h' ? 24 : timeframe === '1D' ? 7 : timeframe === '1W' ? 30 : 90
    const data: ChartDataPoint[] = []
    
    for (let i = 0; i < dataPoints; i++) {
      const randomChange = (Math.random() - 0.5) * basePrice * 0.02
      const price = basePrice + randomChange + (stock.changePercent / 100 * basePrice * (i / dataPoints))
      
      let time = ''
      if (timeframe === '1m') {
        time = `${String(i).padStart(2, '0')}:00`
      } else if (timeframe === '1h') {
        time = `${String(i).padStart(2, '0')}:00`
      } else if (timeframe === '1D') {
        const days = ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
        time = days[i % 7]
      } else if (timeframe === '1W') {
        time = `${i + 1}日`
      } else {
        time = `${i + 1}月`
      }
      
      data.push({
        time,
        price: parseFloat(price.toFixed(2)),
        volume: Math.floor(Math.random() * 1000000)
      })
    }
    
    return data
  }, [selectedSymbol, timeframe])

  return (
    <div className="min-h-screen bg-black text-white pb-24">
      {/* 顶部导航栏 */}
      <div className="sticky top-0 z-50 bg-[#0A0A0A] border-b border-white/10">
        <div className="flex items-center justify-between px-4 py-3">
          <button onClick={() => navigate('/')} className="p-2 -ml-2">
            <ChevronLeft className="w-6 h-6 text-white" />
          </button>
          <div className="flex items-center gap-4">
            <button
              className={`text-white/60 hover:text-white ${
                topNavTab === 'trading' ? 'text-white' : ''
              }`}
              onClick={() => setTopNavTab('trading')}
            >
              交易
            </button>
            <button
              className={`text-white/60 hover:text-white ${
                topNavTab === 'copy' ? 'text-white' : ''
              }`}
              onClick={() => setTopNavTab('copy')}
            >
              跟单
            </button>
            <button
              className={`text-white/60 hover:text-white ${
                topNavTab === 'staking' ? 'text-white' : ''
              }`}
              onClick={() => setTopNavTab('staking')}
            >
              质押挖矿
            </button>
            <button
              className={`text-white/60 hover:text-white ${
                topNavTab === 'ipo' ? 'text-white' : ''
              }`}
              onClick={() => setTopNavTab('ipo')}
            >
              IPO
            </button>
          </div>
        </div>
      </div>

      {/* 交易类型标签 */}
      {topNavTab === 'trading' && (
        <div className="border-b border-white/10 overflow-x-auto">
          <div className="flex px-4 py-3 gap-6 min-w-max">
            {[
              { key: 'stock', label: '股票' },
              { key: 'crypto', label: '币币' },
              { key: 'options', label: '期权' },
              { key: 'forex', label: '外汇' },
              { key: 'commodities', label: '大宗商品' }
            ].map((type) => (
              <button
                key={type.key}
                onClick={() => setSelectedType(type.key as any)}
                className={`relative pb-2 whitespace-nowrap ${
                  selectedType === type.key ? 'text-white' : 'text-white/50'
                }`}
              >
                {type.label}
                {selectedType === type.key && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#A3F030]"></div>
                )}
                {selectedType === type.key && type.key === 'stock' && (
                  <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-4 h-1 bg-[#A3F030] rounded-full"></div>
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* 根据顶部导航和选中的类型显示不同的页面 */}
      {topNavTab === 'copy' ? (
        <MobileCopyTradingPage />
      ) : topNavTab === 'trading' && selectedType === 'crypto' ? (
        <MobileCryptoTradingPage />
      ) : topNavTab === 'trading' && selectedType === 'options' ? (
        <MobileOptionsTradingPage />
      ) : topNavTab === 'trading' && selectedType === 'forex' ? (
        <MobileForexTradingPage />
      ) : topNavTab === 'trading' && selectedType === 'commodities' ? (
        <MobileCommoditiesTradingPage />
      ) : topNavTab === 'staking' ? (
        <MobileStakingPage />
      ) : (
        <>
      {/* 交易对信息 */}
      <div className="px-4 py-4 border-b border-white/10">
        <div className="flex items-center justify-between">
          <button 
            onClick={() => setDrawerOpen(true)}
            className="flex items-center gap-2"
          >
            <div>
              <div className="text-white">{selectedSymbol}</div>
              <div className="text-sm text-white/50">{selectedName}</div>
            </div>
            <ChevronDown className="w-5 h-5 text-white/50" />
          </button>
          
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setChartDrawerOpen(true)}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            >
              <BarChart3 className="w-5 h-5 text-white/60" />
            </button>
            <button 
              onClick={(e) => {
                e.stopPropagation()
                toggleFavorite(selectedSymbol)
              }}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            >
              <Star 
                className={`w-5 h-5 transition-colors ${
                  favorites.has(selectedSymbol) 
                    ? 'fill-yellow-400 text-yellow-400' 
                    : 'text-white/60 hover:text-yellow-400'
                }`}
              />
            </button>
            <button 
              onClick={() => setInlineChartOpen(!inlineChartOpen)}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            >
              <CircleChevronDownIcon size={20} className="text-white/60" />
            </button>
          </div>
        </div>
      </div>

      {/* 内联展开图表区域 */}
      {inlineChartOpen && (
        <div className="bg-[#0A0A0A] border-b border-white/10 animate-in slide-in-from-top duration-300">
          {/* 时间选择器 */}
          <div className="px-4 py-3 flex items-center gap-2 border-b border-white/10 overflow-x-auto">
            <span className="text-sm text-white/50 mr-2 flex-shrink-0">Time</span>
            {['1m', '1h', '1D', '1W', '1M'].map((tf) => (
              <button
                key={tf}
                onClick={() => setTimeframe(tf)}
                className={`px-3 py-1.5 rounded-full text-sm transition-all flex-shrink-0 ${
                  timeframe === tf
                    ? 'bg-white text-black'
                    : 'bg-white/10 text-white/70 hover:bg-white/20'
                }`}
              >
                {tf}
              </button>
            ))}
          </div>

          {/* K线图表 */}
          <div className="px-4 py-4" style={{ height: '300px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart 
                data={chartData}
                margin={{ top: 5, right: 5, left: -20, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="inlineColorPrice" x1="0" y1="0" x2="0" y2="1">
                    <stop 
                      offset="5%" 
                      stopColor={
                        stockList.find(s => s.symbol === selectedSymbol)?.changePercent >= 0 
                          ? '#A3F030' 
                          : '#ef4444'
                      } 
                      stopOpacity={0.3}
                    />
                    <stop 
                      offset="95%" 
                      stopColor={
                        stockList.find(s => s.symbol === selectedSymbol)?.changePercent >= 0 
                          ? '#A3F030' 
                          : '#ef4444'
                      } 
                      stopOpacity={0}
                    />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis 
                  dataKey="time" 
                  stroke="rgba(255,255,255,0.3)"
                  tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 11 }}
                  tickLine={false}
                />
                <YAxis 
                  stroke="rgba(255,255,255,0.3)"
                  tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 11 }}
                  tickLine={false}
                  domain={['dataMin - 5', 'dataMax + 5']}
                  tickFormatter={(value) => `$${value.toFixed(0)}`}
                />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: '#0A0A0A',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '8px',
                    color: '#fff'
                  }}
                  formatter={(value: any) => [`$${parseFloat(value).toFixed(2)}`, '价格']}
                  labelStyle={{ color: 'rgba(255,255,255,0.7)' }}
                />
                <Area 
                  type="monotone" 
                  dataKey="price" 
                  stroke={
                    stockList.find(s => s.symbol === selectedSymbol)?.changePercent >= 0 
                      ? '#A3F030' 
                      : '#ef4444'
                  }
                  strokeWidth={2}
                  fill="url(#inlineColorPrice)"
                  animationDuration={300}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* 成交量图表 */}
          <div className="px-4 pb-4" style={{ height: '120px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart 
                data={chartData}
                margin={{ top: 0, right: 5, left: -20, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="colorVolume" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#A3F030" stopOpacity={0.5}/>
                    <stop offset="95%" stopColor="#A3F030" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis 
                  dataKey="time" 
                  stroke="rgba(255,255,255,0.3)"
                  tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 11 }}
                  tickLine={false}
                />
                <YAxis 
                  stroke="rgba(255,255,255,0.3)"
                  tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 11 }}
                  tickLine={false}
                  tickFormatter={(value) => `${(value / 1000).toFixed(0)}K`}
                />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: '#0A0A0A',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '8px',
                    color: '#fff'
                  }}
                  formatter={(value: any) => [value.toLocaleString(), '成交量']}
                  labelStyle={{ color: 'rgba(255,255,255,0.7)' }}
                />
                <Area 
                  type="monotone" 
                  dataKey="volume" 
                  stroke="#A3F030"
                  strokeWidth={1}
                  fill="url(#colorVolume)"
                  animationDuration={300}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* 市场休市提示 (盘前模式) */}
      {tradeMode === 'premarket' && (
        <div className="mx-4 mt-4 px-4 py-3 bg-orange-500/10 border border-orange-500/30 rounded-lg flex items-center gap-2">
          <Info className="w-5 h-5 text-orange-500 flex-shrink-0" />
          <p className="text-sm text-orange-500">该品种休市中，期间暂停交易</p>
        </div>
      )}

      {/* 交易模式选择 */}
      <div className="px-4 py-4">
        <div className="flex gap-4 mb-4">
          <button
            onClick={() => setTradeMode('normal')}
            className={`pb-2 relative ${
              tradeMode === 'normal' ? 'text-white' : 'text-white/50'
            }`}
          >
            普通交易
            {tradeMode === 'normal' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#A3F030]"></div>
            )}
          </button>
          <button
            onClick={() => setTradeMode('margin')}
            className={`pb-2 relative ${
              tradeMode === 'margin' ? 'text-white' : 'text-white/50'
            }`}
          >
            融资融券
            {tradeMode === 'margin' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#A3F030]"></div>
            )}
          </button>
          <button
            onClick={() => setTradeMode('premarket')}
            className={`pb-2 relative ${
              tradeMode === 'premarket' ? 'text-white' : 'text-white/50'
            }`}
          >
            盘前
            {tradeMode === 'premarket' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#A3F030]"></div>
            )}
          </button>
        </div>

        {/* 订单类型 (非盘前模式) */}
        {tradeMode !== 'premarket' && (
          <div className="flex gap-2 mb-4">
            <button
              onClick={() => setOrderType('market')}
              className={`px-6 py-2 rounded-full transition-all ${
                orderType === 'market'
                  ? 'bg-[#A3F030] text-black'
                  : 'bg-white/5 text-white/70'
              }`}
            >
              市价
            </button>
            <button
              onClick={() => setOrderType('limit')}
              className={`px-6 py-2 rounded-full transition-all ${
                orderType === 'limit'
                  ? 'bg-[#A3F030] text-black'
                  : 'bg-white/5 text-white/70'
              }`}
            >
              限价
            </button>
            {tradeMode === 'margin' && (
              <div className="flex items-center gap-2 ml-auto">
                <input
                  type="checkbox"
                  id="stop-loss"
                  checked={stopLoss}
                  onChange={(e) => setStopLoss(e.target.checked)}
                  className="w-4 h-4"
                />
                <label htmlFor="stop-loss" className="text-sm text-white/70">
                  止盈/止损
                </label>
              </div>
            )}
          </div>
        )}

        {/* 盘前模式内容 */}
        {tradeMode === 'premarket' && (
          <>
            <div className="mb-4 px-4 py-3 bg-[#1A1A1A] border border-white/10 rounded-lg">
              <p className="text-sm text-white/50">以盘后价格成交</p>
            </div>

            {/* 全仓和杠杆选择 */}
            <div className="grid grid-cols-2 gap-3 mb-4">
              <button className="px-4 py-3 bg-[#1A1A1A] rounded-lg flex items-center justify-between">
                <span className="text-white">{position}</span>
                <ChevronDown className="w-4 h-4 text-white/50" />
              </button>
              <button className="px-4 py-3 bg-[#1A1A1A] rounded-lg flex items-center justify-between">
                <span className="text-white">{leverage}</span>
                <ChevronDown className="w-4 h-4 text-white/50" />
              </button>
            </div>
          </>
        )}

        {/* 杠杆和仓位选择 (仅融资融券模式) */}
        {tradeMode === 'margin' && (
          <div className="grid grid-cols-2 gap-3 mb-4">
            <button className="px-4 py-3 bg-[#1A1A1A] rounded-lg flex items-center justify-between">
              <span className="text-white">{position}</span>
              <ChevronDown className="w-4 h-4 text-white/50" />
            </button>
            <button className="px-4 py-3 bg-[#1A1A1A] rounded-lg flex items-center justify-between">
              <span className="text-white">{leverage}</span>
              <ChevronDown className="w-4 h-4 text-white/50" />
            </button>
          </div>
        )}

        {/* 限价输入 (仅限价模式显示) */}
        {tradeMode !== 'premarket' && orderType === 'limit' && (
          <div className="mb-4">
            <div className="relative">
              <Input
                type="number"
                placeholder="价格"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="bg-[#1A1A1A] border-white/10 text-white h-12 placeholder:text-white/30"
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-white/40">
                满足价格才能成交
              </div>
            </div>
          </div>
        )}

        {/* 数量输入 */}
        <div className="mb-4">
          <Input
            type="number"
            placeholder="数量"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="bg-[#1A1A1A] border-white/10 text-white h-12 placeholder:text-white/30"
          />
        </div>

        {/* 百分比滑块 */}
        <div className="mb-6">
          <input
            type="range"
            min="0"
            max="100"
            value={sliderValue}
            onChange={(e) => handleSliderChange(parseInt(e.target.value))}
            className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer slider-green"
            style={{
              background: `linear-gradient(to right, #A3F030 0%, #A3F030 ${sliderValue}%, rgba(255,255,255,0.1) ${sliderValue}%, rgba(255,255,255,0.1) 100%)`
            }}
          />
          <div className="flex justify-between mt-2 text-xs text-white/40">
            <span>0%</span>
            <span>25%</span>
            <span>50%</span>
            <span>75%</span>
            <span>100%</span>
          </div>
        </div>

        {/* 交易按钮 */}
        {tradeMode === 'normal' && (
          <Button
            disabled={isMarketClosed}
            className={`w-full h-14 rounded-xl text-lg transition-all ${
              isMarketClosed
                ? 'bg-white/10 text-white/30 cursor-not-allowed'
                : 'bg-[#A3F030] hover:bg-[#8FD622] text-black'
            }`}
          >
            {isMarketClosed ? '休市中，暂停下单' : '买入'}
          </Button>
        )}

        {tradeMode === 'margin' && (
          <div className="grid grid-cols-2 gap-3">
            <Button className="h-14 rounded-xl text-lg bg-[#A3F030] hover:bg-[#8FD622] text-black">
              融资
            </Button>
            <Button className="h-14 rounded-xl text-lg bg-[#EF4444] hover:bg-[#DC2626] text-white">
              融券
            </Button>
          </div>
        )}

        {tradeMode === 'premarket' && (
          <Button
            disabled
            className="w-full h-14 rounded-xl text-lg bg-white/10 text-white/30 cursor-not-allowed"
          >
            休市中，暂停下单
          </Button>
        )}
      </div>

      {/* 当前委托和历史订单 */}
      <div className="px-4 py-4 border-t border-white/10">
        <div className="flex gap-6 mb-4">
          <button className="pb-2 relative text-white border-b-2 border-[#A3F030]">
            当前委托
          </button>
          <button className="pb-2 text-white/50">
            历史订单
          </button>
        </div>

        {/* 空状态 */}
        <div className="flex flex-col items-center justify-center py-12">
          <div className="relative mb-4">
            <div className="w-24 h-24 flex items-center justify-center">
              <svg className="w-20 h-20 text-white/10" viewBox="0 0 24 24" fill="none">
                <rect x="4" y="4" width="16" height="16" rx="2" stroke="currentColor" strokeWidth="2"/>
                <path d="M8 8h8M8 12h6M8 16h4" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
              <div className="absolute bottom-0 right-0 w-10 h-10 flex items-center justify-center">
                <svg className="w-8 h-8 text-[#A3F030]" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                  <path d="M12 8v8M8 12h8" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </div>
            </div>
          </div>
          <p className="text-white/40 text-sm">暂无数据</p>
        </div>
      </div>

      {/* 底部导航 */}
      <MobileBottomNav />

      {/* 股票选择抽屉 */}
      <Drawer open={drawerOpen} onOpenChange={setDrawerOpen}>
        <DrawerContent className="bg-[#0A0A0A] border-t border-white/10 max-h-[85vh]">
          <DrawerHeader className="border-b border-white/10 px-4 py-4">
            <div className="flex items-center justify-between">
              <DrawerTitle className="text-white text-lg">股票</DrawerTitle>
              <button 
                onClick={() => setDrawerOpen(false)}
                className="p-2 -mr-2 hover:bg-white/5 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-white/60" />
              </button>
            </div>
            <DrawerDescription className="sr-only">
              选择股票进行交易
            </DrawerDescription>
          </DrawerHeader>

          {/* 搜索框 */}
          <div className="px-4 py-4 border-b border-white/10">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
              <Input
                placeholder="搜索股票代码或名称"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-[#1A1A1A] border-white/10 text-white h-11 placeholder:text-white/40"
              />
            </div>
          </div>

          {/* 股票列表 */}
          <div className="overflow-y-auto flex-1">
            {filteredStocks.map((stock) => (
              <button
                key={stock.symbol}
                onClick={() => handleStockSelect(stock)}
                className={`w-full px-4 py-4 flex items-center justify-between border-b border-white/5 hover:bg-white/5 transition-colors ${
                  selectedSymbol === stock.symbol ? 'bg-white/5' : ''
                }`}
              >
                <div className="flex-1 text-left">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-white">{stock.symbol}</span>
                    {selectedSymbol === stock.symbol && (
                      <div className="w-1.5 h-1.5 rounded-full bg-[#A3F030]"></div>
                    )}
                  </div>
                  <div className="text-sm text-white/50">{stock.name}</div>
                </div>
                
                <div className="text-right">
                  <div className="text-white mb-1">${stock.price.toFixed(2)}</div>
                  <div className={`text-sm flex items-center justify-end gap-1 ${
                    stock.changePercent >= 0 ? 'text-[#A3F030]' : 'text-red-500'
                  }`}>
                    {stock.changePercent >= 0 ? (
                      <TrendingUp className="w-3.5 h-3.5" />
                    ) : (
                      <TrendingDown className="w-3.5 h-3.5" />
                    )}
                    <span>{stock.changePercent >= 0 ? '+' : ''}{stock.changePercent.toFixed(2)}%</span>
                  </div>
                </div>
              </button>
            ))}

            {filteredStocks.length === 0 && (
              <div className="flex flex-col items-center justify-center py-16">
                <Search className="w-12 h-12 text-white/20 mb-3" />
                <p className="text-white/40 text-sm">未找到匹配的股票</p>
              </div>
            )}
          </div>
        </DrawerContent>
      </Drawer>

      {/* 图表抽屉 */}
      <Drawer open={chartDrawerOpen} onOpenChange={setChartDrawerOpen}>
        <DrawerContent className="h-[90vh] max-h-[90vh] bg-[#0A0A0A] border-t border-white/10">
          <DrawerHeader className="sr-only">
            <DrawerTitle>股票图表</DrawerTitle>
            <DrawerDescription>查看{selectedName}的实时价格图表</DrawerDescription>
          </DrawerHeader>

          <div className="flex flex-col h-full">
            {/* 顶部栏 */}
            <div className="px-4 py-4 flex items-start justify-between flex-shrink-0 border-b border-white/10">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h2 className="text-xl text-white">{selectedSymbol}</h2>
                  <button className="p-1 hover:bg-white/10 rounded transition-colors">
                    <ChevronDown className="w-4 h-4 text-white/50" />
                  </button>
                </div>
                
                {/* 价格信息 */}
                <div className="flex items-baseline gap-3 mb-2">
                  <span className="text-3xl text-[#A3F030]">
                    ${stockList.find(s => s.symbol === selectedSymbol)?.price.toFixed(2) || '0.00'}
                  </span>
                  {(() => {
                    const stock = stockList.find(s => s.symbol === selectedSymbol)
                    const isPositive = stock && stock.changePercent >= 0
                    return (
                      <div className="flex items-center gap-1">
                        {isPositive ? (
                          <TrendingUp className="w-4 h-4 text-[#A3F030]" />
                        ) : (
                          <TrendingDown className="w-4 h-4 text-red-500" />
                        )}
                        <span className={isPositive ? 'text-[#A3F030]' : 'text-red-500'}>
                          {stock ? `${stock.changePercent >= 0 ? '+' : ''}${stock.changePercent.toFixed(2)}%` : '0.00%'}
                        </span>
                      </div>
                    )
                  })()}
                </div>

                {/* 统计信息 */}
                <div className="grid grid-cols-3 gap-3 text-sm">
                  <div>
                    <p className="text-white/50 text-xs mb-1">今开</p>
                    <p className="text-white">${stockList.find(s => s.symbol === selectedSymbol)?.price.toFixed(2) || '0.00'}</p>
                  </div>
                  <div>
                    <p className="text-white/50 text-xs mb-1">最高</p>
                    <p className="text-[#A3F030]">${((stockList.find(s => s.symbol === selectedSymbol)?.price ?? 0) * 1.02).toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="text-white/50 text-xs mb-1">最低</p>
                    <p className="text-red-500">${((stockList.find(s => s.symbol === selectedSymbol)?.price ?? 0) * 0.98).toFixed(2)}</p>
                  </div>
                </div>
              </div>

              {/* 右侧操作按钮 */}
              <div className="flex items-center gap-2 ml-4">
                <button className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                  <Star className="w-5 h-5 text-white/60" />
                </button>
                <button 
                  onClick={() => setChartDrawerOpen(false)}
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-white/60" />
                </button>
              </div>
            </div>

            {/* 时间选择器 */}
            <div className="hidden md:flex md:px-4 md:py-3 md:items-center md:gap-2 md:flex-shrink-0">
              <span className="text-sm text-white/50 mr-2">Time</span>
              {['1m', '1h', '1D', '1W', '1M'].map((tf) => (
                <button
                  key={tf}
                  onClick={() => setTimeframe(tf)}
                  className={`px-3 py-1.5 rounded-full text-sm transition-all ${
                    timeframe === tf
                      ? 'bg-white text-black'
                      : 'bg-white/10 text-white/70 hover:bg-white/20'
                  }`}
                >
                  {tf}
                </button>
              ))}
            </div>

            {/* 价格图表 */}
            <div className="flex-1 px-4 pb-4 min-h-0">
              <div className="h-full bg-[#1A1A1A] rounded-lg overflow-hidden p-4">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart 
                    data={chartData}
                    margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                  >
                    <defs>
                      <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                        <stop 
                          offset="5%" 
                          stopColor={
                            stockList.find(s => s.symbol === selectedSymbol)?.changePercent >= 0 
                              ? '#A3F030' 
                              : '#ef4444'
                          } 
                          stopOpacity={0.3}
                        />
                        <stop 
                          offset="95%" 
                          stopColor={
                            stockList.find(s => s.symbol === selectedSymbol)?.changePercent >= 0 
                              ? '#A3F030' 
                              : '#ef4444'
                          } 
                          stopOpacity={0}
                        />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                    <XAxis 
                      dataKey="time" 
                      stroke="rgba(255,255,255,0.3)"
                      tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 12 }}
                      tickLine={false}
                    />
                    <YAxis 
                      stroke="rgba(255,255,255,0.3)"
                      tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 12 }}
                      tickLine={false}
                      domain={['dataMin - 5', 'dataMax + 5']}
                      tickFormatter={(value) => `$${value.toFixed(0)}`}
                    />
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: '#0A0A0A',
                        border: '1px solid rgba(255,255,255,0.1)',
                        borderRadius: '8px',
                        color: '#fff'
                      }}
                      formatter={(value: any) => [`$${parseFloat(value).toFixed(2)}`, '价格']}
                      labelStyle={{ color: 'rgba(255,255,255,0.7)' }}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="price" 
                      stroke={
                        stockList.find(s => s.symbol === selectedSymbol)?.changePercent >= 0 
                          ? '#A3F030' 
                          : '#ef4444'
                      }
                      strokeWidth={2}
                      fill="url(#colorPrice)"
                      animationDuration={300}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* 底部交易按钮 */}
            <div className="px-4 pb-6 flex gap-3 flex-shrink-0">
              <Button className="flex-1 h-12 bg-[#A3F030] hover:bg-[#8FD622] text-black rounded-xl">
                买入
              </Button>
              <Button className="flex-1 h-12 bg-red-500 hover:bg-red-600 text-white rounded-xl">
                卖出
              </Button>
            </div>
          </div>
        </DrawerContent>
      </Drawer>

      <style>{`
        .slider-green::-webkit-slider-thumb {
          appearance: none;
          width: 18px;
          height: 18px;
          border-radius: 50%;
          background: #A3F030;
          cursor: pointer;
          box-shadow: 0 0 8px rgba(163, 240, 48, 0.5);
        }
        
        .slider-green::-moz-range-thumb {
          width: 18px;
          height: 18px;
          border-radius: 50%;
          background: #A3F030;
          cursor: pointer;
          border: none;
          box-shadow: 0 0 8px rgba(163, 240, 48, 0.5);
        }
      `}</style>
        </>
      )}
    </div>
  )
}