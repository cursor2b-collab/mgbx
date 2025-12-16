import { useState, useEffect, useMemo } from 'react'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { ChevronDown, Star, TrendingUp, TrendingDown, Search, X } from 'lucide-react'
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerDescription } from './ui/drawer'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { CircleChevronDownIcon } from './ui/circle-chevron-down-icon'

interface ForexPair {
  symbol: string
  name: string
  price: number
  change: number
  changePercent: number
  bid: number
  ask: number
}

export function MobileForexTradingPage() {
  const [selectedPair, setSelectedPair] = useState('EUR/USD')
  const [orderType, setOrderType] = useState<'market' | 'limit'>('market')
  const [leverage, setLeverage] = useState('100')
  const [position, setPosition] = useState('标准手')
  const [price, setPrice] = useState('')
  const [lots, setLots] = useState('0.01')
  const [sliderValue, setSliderValue] = useState(0)
  const [stopLoss, setStopLoss] = useState('')
  const [takeProfit, setTakeProfit] = useState('')
  const [showAdvanced, setShowAdvanced] = useState(false)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [inlineChartOpen, setInlineChartOpen] = useState(false)
  const [timeframe, setTimeframe] = useState('1D')
  const [favorites, setFavorites] = useState<Set<string>>(new Set())

  const forexPairs: ForexPair[] = [
    { symbol: 'EUR/USD', name: '欧元/美元', price: 1.0923, change: 0.0012, changePercent: 0.11, bid: 1.0922, ask: 1.0924 },
    { symbol: 'GBP/USD', name: '英镑/美元', price: 1.2734, change: -0.0023, changePercent: -0.18, bid: 1.2733, ask: 1.2735 },
    { symbol: 'USD/JPY', name: '美元/日元', price: 149.85, change: 0.42, changePercent: 0.28, bid: 149.84, ask: 149.86 },
    { symbol: 'AUD/USD', name: '澳元/美元', price: 0.6582, change: 0.0008, changePercent: 0.12, bid: 0.6581, ask: 0.6583 },
    { symbol: 'USD/CAD', name: '美元/加元', price: 1.3842, change: -0.0015, changePercent: -0.11, bid: 1.3841, ask: 1.3843 },
    { symbol: 'USD/CHF', name: '美元/瑞郎', price: 0.8765, change: 0.0006, changePercent: 0.07, bid: 0.8764, ask: 0.8766 },
    { symbol: 'NZD/USD', name: '纽元/美元', price: 0.6123, change: 0.0045, changePercent: 0.74, bid: 0.6122, ask: 0.6124 },
    { symbol: 'EUR/GBP', name: '欧元/英镑', price: 0.8576, change: -0.0012, changePercent: -0.14, bid: 0.8575, ask: 0.8577 },
  ]

  const currentPair = forexPairs.find(p => p.symbol === selectedPair) || forexPairs[0]

  const filteredPairs = forexPairs.filter(pair =>
    pair.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
    pair.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  // 生成图表数据
  const chartData = useMemo(() => {
    const basePrice = currentPair.price
    const dataPoints = timeframe === '1m' ? 30 : timeframe === '1h' ? 24 : timeframe === '1D' ? 7 : timeframe === '1W' ? 30 : 90
    const data = []
    
    for (let i = 0; i < dataPoints; i++) {
      const randomChange = (Math.random() - 0.5) * basePrice * 0.01
      const price = basePrice + randomChange + (currentPair.changePercent / 100 * basePrice * (i / dataPoints))
      
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
        price: parseFloat(price.toFixed(4)),
        volume: Math.floor(Math.random() * 1000000)
      })
    }
    
    return data
  }, [currentPair, timeframe])

  const handleSliderChange = (value: number) => {
    setSliderValue(value)
    const calculatedLots = (value / 100 * 1).toFixed(2)
    setLots(calculatedLots)
  }

  const handlePairSelect = (pair: ForexPair) => {
    setSelectedPair(pair.symbol)
    setDrawerOpen(false)
    setSearchQuery('')
  }

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

  const leverageOptions = ['50', '100', '200', '500']
  const positionTypes = ['标准手', '迷你手', '微型手']

  return (
    <div className="flex flex-col min-h-[calc(100vh-120px)]">
      {/* 交易对信息 */}
      <div className="px-4 py-4 border-b border-white/10">
        <div className="flex items-center justify-between mb-3">
          <button
            onClick={() => setDrawerOpen(true)}
            className="flex items-center gap-2"
          >
            <div>
              <div className="text-white">{currentPair.symbol}</div>
              <div className="text-sm text-white/50">{currentPair.name}</div>
            </div>
            <ChevronDown className="w-5 h-5 text-white/50" />
          </button>
          
          <div className="flex items-center gap-3">
            <button
              onClick={(e) => {
                e.stopPropagation()
                toggleFavorite(currentPair.symbol)
              }}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            >
              <Star
                className={`w-5 h-5 transition-colors ${
                  favorites.has(currentPair.symbol)
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

        {/* 价格信息 */}
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-[#1A1A1A] rounded-lg p-3">
            <div className="text-xs text-white/50 mb-1">当前价</div>
            <div className={`text-lg ${currentPair.changePercent >= 0 ? 'text-[#A3F030]' : 'text-red-500'}`}>
              {currentPair.price.toFixed(4)}
            </div>
          </div>
          
          <div className="bg-[#1A1A1A] rounded-lg p-3">
            <div className="text-xs text-white/50 mb-1">买价</div>
            <div className="text-lg text-[#A3F030]">
              {currentPair.bid.toFixed(4)}
            </div>
          </div>
          
          <div className="bg-[#1A1A1A] rounded-lg p-3">
            <div className="text-xs text-white/50 mb-1">卖价</div>
            <div className="text-lg text-red-500">
              {currentPair.ask.toFixed(4)}
            </div>
          </div>
        </div>

        {/* 涨跌幅 */}
        <div className="mt-3 flex items-center justify-center gap-2">
          <div className={`flex items-center gap-1 ${
            currentPair.changePercent >= 0 ? 'text-[#A3F030]' : 'text-red-500'
          }`}>
            {currentPair.changePercent >= 0 ? (
              <TrendingUp className="w-4 h-4" />
            ) : (
              <TrendingDown className="w-4 h-4" />
            )}
            <span>{currentPair.changePercent >= 0 ? '+' : ''}{currentPair.change.toFixed(4)}</span>
            <span>({currentPair.changePercent >= 0 ? '+' : ''}{currentPair.changePercent.toFixed(2)}%)</span>
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
                  <linearGradient id="forexColorPrice" x1="0" y1="0" x2="0" y2="1">
                    <stop 
                      offset="5%" 
                      stopColor={currentPair.changePercent >= 0 ? '#A3F030' : '#ef4444'} 
                      stopOpacity={0.3}
                    />
                    <stop 
                      offset="95%" 
                      stopColor={currentPair.changePercent >= 0 ? '#A3F030' : '#ef4444'} 
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
                  domain={['dataMin - 0.001', 'dataMax + 0.001']}
                  tickFormatter={(value) => value.toFixed(4)}
                />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: '#0A0A0A',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '8px',
                    color: '#fff'
                  }}
                  formatter={(value: any) => [parseFloat(value).toFixed(4), '价格']}
                  labelStyle={{ color: 'rgba(255,255,255,0.7)' }}
                />
                <Area 
                  type="monotone" 
                  dataKey="price" 
                  stroke={currentPair.changePercent >= 0 ? '#A3F030' : '#ef4444'}
                  strokeWidth={2}
                  fill="url(#forexColorPrice)"
                  animationDuration={300}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* 订单类型 */}
      <div className="px-4 py-4 border-b border-white/10">
        <div className="flex gap-2 mb-4">
          <button
            onClick={() => setOrderType('market')}
            className={`px-6 py-2 rounded-full transition-all ${
              orderType === 'market'
                ? 'bg-[#A3F030] text-black'
                : 'bg-white/5 text-white/70'
            }`}
          >
            市价单
          </button>
          <button
            onClick={() => setOrderType('limit')}
            className={`px-6 py-2 rounded-full transition-all ${
              orderType === 'limit'
                ? 'bg-[#A3F030] text-black'
                : 'bg-white/5 text-white/70'
            }`}
          >
            限价单
          </button>
        </div>

        {/* 杠杆和手数类型 */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div>
            <div className="text-sm text-white/50 mb-2">杠杆</div>
            <div className="relative">
              <select
                value={leverage}
                onChange={(e) => setLeverage(e.target.value)}
                className="w-full px-4 py-3 bg-[#1A1A1A] border border-white/10 rounded-lg text-white appearance-none cursor-pointer"
              >
                {leverageOptions.map(lev => (
                  <option key={lev} value={lev}>{lev}x</option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/50 pointer-events-none" />
            </div>
          </div>

          <div>
            <div className="text-sm text-white/50 mb-2">手数类型</div>
            <div className="relative">
              <select
                value={position}
                onChange={(e) => setPosition(e.target.value)}
                className="w-full px-4 py-3 bg-[#1A1A1A] border border-white/10 rounded-lg text-white appearance-none cursor-pointer"
              >
                {positionTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/50 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* 限价输入 */}
        {orderType === 'limit' && (
          <div className="mb-4">
            <div className="text-sm text-white/50 mb-2">限价</div>
            <Input
              type="number"
              placeholder="输入限价"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="bg-[#1A1A1A] border-white/10 text-white h-12 placeholder:text-white/30"
            />
          </div>
        )}

        {/* 手数输入 */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-white/50">手数</span>
            <span className="text-xs text-white/40">1标准手 = 100,000基础货币</span>
          </div>
          <Input
            type="number"
            step="0.01"
            placeholder="输入手数"
            value={lots}
            onChange={(e) => setLots(e.target.value)}
            className="bg-[#1A1A1A] border-white/10 text-white h-12 placeholder:text-white/30"
          />
        </div>

        {/* 百分比滑块 */}
        <div className="mb-4">
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

        {/* 高级选项 */}
        <button
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="w-full flex items-center justify-between text-sm text-white/70 hover:text-white transition-colors mb-2"
        >
          <span>高级选项</span>
          <ChevronDown className={`w-4 h-4 transition-transform ${showAdvanced ? 'rotate-180' : ''}`} />
        </button>

        {showAdvanced && (
          <div className="space-y-3 mt-3">
            <div>
              <div className="text-sm text-white/50 mb-2">止损 (Stop Loss)</div>
              <Input
                type="number"
                placeholder="止损价格"
                value={stopLoss}
                onChange={(e) => setStopLoss(e.target.value)}
                className="bg-[#1A1A1A] border-white/10 text-white h-12 placeholder:text-white/30"
              />
            </div>
            
            <div>
              <div className="text-sm text-white/50 mb-2">止盈 (Take Profit)</div>
              <Input
                type="number"
                placeholder="止盈价格"
                value={takeProfit}
                onChange={(e) => setTakeProfit(e.target.value)}
                className="bg-[#1A1A1A] border-white/10 text-white h-12 placeholder:text-white/30"
              />
            </div>
          </div>
        )}
      </div>

      {/* 预估信息 */}
      <div className="px-4 py-3 bg-[#1A1A1A]/30 border-b border-white/10">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center justify-between">
            <span className="text-white/50">保证金</span>
            <span className="text-white">
              ${(parseFloat(lots || '0') * 100000 / parseInt(leverage)).toFixed(2)}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-white/50">点差</span>
            <span className="text-white">
              {((currentPair.ask - currentPair.bid) * 10000).toFixed(1)} pips
            </span>
          </div>
        </div>
      </div>

      {/* 交易按钮 */}
      <div className="px-4 py-6 mt-auto">
        <div className="grid grid-cols-2 gap-3">
          <Button className="h-14 rounded-xl text-lg bg-[#A3F030] hover:bg-[#8FD622] text-black">
            买入
          </Button>
          <Button className="h-14 rounded-xl text-lg bg-red-500 hover:bg-red-600 text-white">
            卖出
          </Button>
        </div>
      </div>

      {/* 产品选择抽屉 */}
      <Drawer open={drawerOpen} onOpenChange={setDrawerOpen}>
        <DrawerContent className="bg-[#0A0A0A] border-t border-white/10 max-h-[85vh]">
          <DrawerHeader className="border-b border-white/10 px-4 py-4">
            <div className="flex items-center justify-between">
              <DrawerTitle className="text-white text-lg">外汇交易对</DrawerTitle>
              <button 
                onClick={() => setDrawerOpen(false)}
                className="p-2 -mr-2 hover:bg-white/5 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-white/60" />
              </button>
            </div>
            <DrawerDescription className="sr-only">
              选择外汇交易对进行交易
            </DrawerDescription>
          </DrawerHeader>

          {/* 搜索框 */}
          <div className="px-4 py-4 border-b border-white/10">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
              <Input
                placeholder="搜索交易对"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-[#1A1A1A] border-white/10 text-white h-11 placeholder:text-white/40"
              />
            </div>
          </div>

          {/* 产品列表 */}
          <div className="overflow-y-auto flex-1">
            {filteredPairs.map((pair) => (
              <button
                key={pair.symbol}
                onClick={() => handlePairSelect(pair)}
                className={`w-full px-4 py-4 flex items-center justify-between border-b border-white/5 hover:bg-white/5 transition-colors ${
                  selectedPair === pair.symbol ? 'bg-white/5' : ''
                }`}
              >
                <div className="flex-1 text-left">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-white">{pair.symbol}</span>
                    {selectedPair === pair.symbol && (
                      <div className="w-1.5 h-1.5 rounded-full bg-[#A3F030]"></div>
                    )}
                  </div>
                  <div className="text-sm text-white/50">{pair.name}</div>
                </div>
                
                <div className="text-right">
                  <div className="text-white mb-1">{pair.price.toFixed(4)}</div>
                  <div className={`text-sm flex items-center justify-end gap-1 ${
                    pair.changePercent >= 0 ? 'text-[#A3F030]' : 'text-red-500'
                  }`}>
                    {pair.changePercent >= 0 ? (
                      <TrendingUp className="w-3.5 h-3.5" />
                    ) : (
                      <TrendingDown className="w-3.5 h-3.5" />
                    )}
                    <span>{pair.changePercent >= 0 ? '+' : ''}{pair.changePercent.toFixed(2)}%</span>
                  </div>
                </div>
              </button>
            ))}

            {filteredPairs.length === 0 && (
              <div className="flex flex-col items-center justify-center py-16">
                <Search className="w-12 h-12 text-white/20 mb-3" />
                <p className="text-white/40 text-sm">未找到匹配的产品</p>
              </div>
            )}
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
    </div>
  )
}
