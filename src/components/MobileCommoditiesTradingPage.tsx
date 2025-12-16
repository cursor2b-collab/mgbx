import { useState, useEffect, useMemo } from 'react'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { ChevronDown, Star, TrendingUp, TrendingDown, Search, X } from 'lucide-react'
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerDescription } from './ui/drawer'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { CircleChevronDownIcon } from './ui/circle-chevron-down-icon'

interface CommodityItem {
  symbol: string
  name: string
  price: number
  change: number
  changePercent: number
  unit: string
}

export function MobileCommoditiesTradingPage() {
  const [selectedCommodity, setSelectedCommodity] = useState('XAUUSD')
  const [orderType, setOrderType] = useState<'market' | 'limit'>('market')
  const [leverage, setLeverage] = useState('100')
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

  const commodities: CommodityItem[] = [
    { symbol: 'XAUUSD', name: '黄金', price: 2034.50, change: 12.30, changePercent: 0.61, unit: '美元/盎司' },
    { symbol: 'XAGUSD', name: '白银', price: 24.85, change: -0.15, changePercent: -0.60, unit: '美元/盎司' },
    { symbol: 'USOIL', name: '美国原油', price: 78.45, change: 1.20, changePercent: 1.55, unit: '美元/桶' },
    { symbol: 'UKOIL', name: '布伦特原油', price: 82.30, change: 0.85, changePercent: 1.04, unit: '美元/桶' },
    { symbol: 'NATGAS', name: '天然气', price: 2.845, change: -0.035, changePercent: -1.21, unit: '美元/百万英热' },
    { symbol: 'COPPER', name: '铜', price: 3.8425, change: 0.0225, changePercent: 0.59, unit: '美元/磅' },
    { symbol: 'WHEAT', name: '小麦', price: 625.50, change: -8.25, changePercent: -1.30, unit: '美分/蒲式耳' },
    { symbol: 'CORN', name: '玉米', price: 485.75, change: 3.50, changePercent: 0.73, unit: '美分/蒲式耳' },
  ]

  const currentCommodity = commodities.find(c => c.symbol === selectedCommodity) || commodities[0]

  const filteredCommodities = commodities.filter(commodity =>
    commodity.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
    commodity.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  // 生成图表数据
  const chartData = useMemo(() => {
    const basePrice = currentCommodity.price
    const dataPoints = timeframe === '1m' ? 30 : timeframe === '1h' ? 24 : timeframe === '1D' ? 7 : timeframe === '1W' ? 30 : 90
    const data = []
    
    for (let i = 0; i < dataPoints; i++) {
      const randomChange = (Math.random() - 0.5) * basePrice * 0.02
      const price = basePrice + randomChange + (currentCommodity.changePercent / 100 * basePrice * (i / dataPoints))
      
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
  }, [currentCommodity, timeframe])

  const handleSliderChange = (value: number) => {
    setSliderValue(value)
    const calculatedLots = (value / 100 * 1).toFixed(2)
    setLots(calculatedLots)
  }

  const handleCommoditySelect = (commodity: CommodityItem) => {
    setSelectedCommodity(commodity.symbol)
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

  return (
    <div className="flex flex-col min-h-[calc(100vh-120px)]">
      {/* 商品信息 */}
      <div className="px-4 py-4 border-b border-white/10">
        <div className="flex items-center justify-between mb-3">
          <button
            onClick={() => setDrawerOpen(true)}
            className="flex items-center gap-2"
          >
            <div>
              <div className="text-white">{currentCommodity.symbol}</div>
              <div className="text-sm text-white/50">{currentCommodity.name}</div>
            </div>
            <ChevronDown className="w-5 h-5 text-white/50" />
          </button>
          
          <div className="flex items-center gap-3">
            <button
              onClick={(e) => {
                e.stopPropagation()
                toggleFavorite(currentCommodity.symbol)
              }}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            >
              <Star
                className={`w-5 h-5 transition-colors ${
                  favorites.has(currentCommodity.symbol)
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

        {/* 价格卡片 */}
        <div className="bg-[#1A1A1A] rounded-xl p-4">
          <div className="flex items-end justify-between mb-3">
            <div>
              <div className="text-sm text-white/50 mb-1">当前价格</div>
              <div className={`text-3xl ${
                currentCommodity.changePercent >= 0 ? 'text-[#A3F030]' : 'text-red-500'
              }`}>
                ${currentCommodity.price.toFixed(2)}
              </div>
            </div>
            
            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full ${
              currentCommodity.changePercent >= 0 ? 'bg-[#A3F030]/10' : 'bg-red-500/10'
            }`}>
              {currentCommodity.changePercent >= 0 ? (
                <TrendingUp className="w-4 h-4 text-[#A3F030]" />
              ) : (
                <TrendingDown className="w-4 h-4 text-red-500" />
              )}
              <span className={currentCommodity.changePercent >= 0 ? 'text-[#A3F030]' : 'text-red-500'}>
                {currentCommodity.changePercent >= 0 ? '+' : ''}{currentCommodity.changePercent.toFixed(2)}%
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 pt-3 border-t border-white/10">
            <div>
              <div className="text-xs text-white/50 mb-1">涨跌额</div>
              <div className={currentCommodity.change >= 0 ? 'text-[#A3F030]' : 'text-red-500'}>
                {currentCommodity.change >= 0 ? '+' : ''}{currentCommodity.change.toFixed(2)}
              </div>
            </div>
            <div>
              <div className="text-xs text-white/50 mb-1">单位</div>
              <div className="text-white">{currentCommodity.unit}</div>
            </div>
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
                  <linearGradient id="commodityColorPrice" x1="0" y1="0" x2="0" y2="1">
                    <stop 
                      offset="5%" 
                      stopColor={currentCommodity.changePercent >= 0 ? '#A3F030' : '#ef4444'} 
                      stopOpacity={0.3}
                    />
                    <stop 
                      offset="95%" 
                      stopColor={currentCommodity.changePercent >= 0 ? '#A3F030' : '#ef4444'} 
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
                  stroke={currentCommodity.changePercent >= 0 ? '#A3F030' : '#ef4444'}
                  strokeWidth={2}
                  fill="url(#commodityColorPrice)"
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

        {/* 杠杆选择 */}
        <div className="mb-4">
          <div className="text-sm text-white/50 mb-2">杠杆倍数</div>
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

        {/* 限价输入 */}
        {orderType === 'limit' && (
          <div className="mb-4">
            <div className="text-sm text-white/50 mb-2">限价</div>
            <div className="relative">
              <Input
                type="number"
                placeholder="输入限价"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="bg-[#1A1A1A] border-white/10 text-white h-12 placeholder:text-white/30"
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-white/40">
                USD
              </div>
            </div>
          </div>
        )}

        {/* 手数输入 */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-white/50">手数</span>
            <span className="text-xs text-white/40">最小: 0.01</span>
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
        <div className="grid grid-cols-3 gap-3 text-sm">
          <div>
            <div className="text-white/50 text-xs mb-1">保证金</div>
            <div className="text-white">
              ${((currentCommodity.price * parseFloat(lots || '0') * 100) / parseInt(leverage)).toFixed(2)}
            </div>
          </div>
          <div>
            <div className="text-white/50 text-xs mb-1">合约价值</div>
            <div className="text-white">
              ${(currentCommodity.price * parseFloat(lots || '0') * 100).toFixed(2)}
            </div>
          </div>
          <div>
            <div className="text-white/50 text-xs mb-1">隔夜费</div>
            <div className="text-white/70">
              -$0.50
            </div>
          </div>
        </div>
      </div>

      {/* 市场信息提示 */}
      <div className="px-4 py-3 bg-blue-500/10 border-l-4 border-blue-500 mx-4 mt-4 rounded">
        <div className="flex items-start gap-2">
          <div className="text-blue-500 mt-0.5">ⓘ</div>
          <div className="text-sm text-blue-400">
            <p className="mb-1">大宗商品交易提示：</p>
            <ul className="text-xs text-blue-300/80 space-y-0.5">
              <li>• 贵金属交易时间: 周一至周五 24小时</li>
              <li>• 能源商品受地缘政治影响较大</li>
              <li>• 建议设置止损以控制风险</li>
            </ul>
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
              <DrawerTitle className="text-white text-lg">大宗商品</DrawerTitle>
              <button 
                onClick={() => setDrawerOpen(false)}
                className="p-2 -mr-2 hover:bg-white/5 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-white/60" />
              </button>
            </div>
            <DrawerDescription className="sr-only">
              选择大宗商品进行交易
            </DrawerDescription>
          </DrawerHeader>

          {/* 搜索框 */}
          <div className="px-4 py-4 border-b border-white/10">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
              <Input
                placeholder="搜索商品"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-[#1A1A1A] border-white/10 text-white h-11 placeholder:text-white/40"
              />
            </div>
          </div>

          {/* 产品列表 */}
          <div className="overflow-y-auto flex-1">
            {filteredCommodities.map((commodity) => (
              <button
                key={commodity.symbol}
                onClick={() => handleCommoditySelect(commodity)}
                className={`w-full px-4 py-4 flex items-center justify-between border-b border-white/5 hover:bg-white/5 transition-colors ${
                  selectedCommodity === commodity.symbol ? 'bg-white/5' : ''
                }`}
              >
                <div className="flex-1 text-left">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-white">{commodity.name}</span>
                    {selectedCommodity === commodity.symbol && (
                      <div className="w-1.5 h-1.5 rounded-full bg-[#A3F030]"></div>
                    )}
                  </div>
                  <div className="text-sm text-white/50">{commodity.symbol} · {commodity.unit}</div>
                </div>
                
                <div className="text-right">
                  <div className="text-white mb-1">${commodity.price.toFixed(2)}</div>
                  <div className={`text-sm flex items-center justify-end gap-1 ${
                    commodity.changePercent >= 0 ? 'text-[#A3F030]' : 'text-red-500'
                  }`}>
                    {commodity.changePercent >= 0 ? (
                      <TrendingUp className="w-3.5 h-3.5" />
                    ) : (
                      <TrendingDown className="w-3.5 h-3.5" />
                    )}
                    <span>{commodity.changePercent >= 0 ? '+' : ''}{commodity.changePercent.toFixed(2)}%</span>
                  </div>
                </div>
              </button>
            ))}

            {filteredCommodities.length === 0 && (
              <div className="flex flex-col items-center justify-center py-16">
                <Search className="w-12 h-12 text-white/20 mb-3" />
                <p className="text-white/40 text-sm">未找到匹配的商品</p>
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
