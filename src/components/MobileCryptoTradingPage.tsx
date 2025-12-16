import { useState, useEffect, useMemo } from 'react'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { CircleChevronDownIcon } from './ui/circle-chevron-down-icon'
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerDescription } from './ui/drawer'
import { 
  BarChart3,
  Star,
  TrendingUp,
  TrendingDown,
  ChevronDown,
  X
} from 'lucide-react'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ComposedChart, Bar, Line } from 'recharts'
import { OrderbookTab, TradesTab } from './MobileCryptoTradingPage_OrderbookTrades'

interface CryptoItem {
  symbol: string
  name: string
  price: number
  change: number
  changePercent: number
}

interface OrderBookItem {
  price: number
  amount: number
}

export function MobileCryptoTradingPage() {
  const [selectedSymbol, setSelectedSymbol] = useState('SOL/USDT')
  const [orderType, setOrderType] = useState<'market' | 'limit'>('market')
  const [price, setPrice] = useState('')
  const [totalAmount, setTotalAmount] = useState('')
  const [quantity, setQuantity] = useState('')
  const [sliderValue, setSliderValue] = useState(0)
  const [inlineChartOpen, setInlineChartOpen] = useState(false)
  const [timeframe, setTimeframe] = useState('1D')
  const [favorites, setFavorites] = useState<Set<string>>(new Set())
  const [chartDrawerOpen, setChartDrawerOpen] = useState(false)
  const [chartTab, setChartTab] = useState<'market' | 'orderbook' | 'trades'>('market')
  const [chartTimeframe, setChartTimeframe] = useState('1h')
  const [symbolDrawerOpen, setSymbolDrawerOpen] = useState(false)

  // 币币数据
  const cryptoList: CryptoItem[] = [
    { symbol: 'SOL/USDT', name: 'Solana', price: 140.853, change: -1.412, changePercent: -1.00 },
    { symbol: 'SEI/USDT', name: 'Sei', price: 0.17887, change: 0.01237, changePercent: 6.91 },
    { symbol: 'BTC/USDT', name: 'Bitcoin', price: 103315.27, change: -404.23, changePercent: -0.39 },
    { symbol: 'ADA/USDT', name: 'Cardano', price: 0.536, change: -0.01248, changePercent: -2.32 },
    { symbol: 'HXB/USDT', name: 'Hedera', price: 0.1218, change: 0.0036, changePercent: 2.95 },
    { symbol: 'DOGE/USDT', name: 'Dogecoin', price: 0.163786, change: -0.003534, changePercent: -2.18 },
    { symbol: 'ETH/USDT', name: 'Ethereum', price: 3456.78, change: -45.32, changePercent: -1.29 },
    { symbol: 'BNB/USDT', name: 'Binance Coin', price: 612.34, change: 8.45, changePercent: 1.40 },
    { symbol: 'XRP/USDT', name: 'Ripple', price: 0.6234, change: -0.0123, changePercent: -1.94 },
  ]

  // 获取加密货币logo URL
  const getCryptoLogo = (symbol: string) => {
    const logoMap: { [key: string]: string } = {
      'BTC': 'https://assets.coingecko.com/coins/images/1/small/bitcoin.png',
      'ETH': 'https://assets.coingecko.com/coins/images/279/small/ethereum.png',
      'BNB': 'https://assets.coingecko.com/coins/images/825/small/bnb-icon2_2x.png',
      'SOL': 'https://assets.coingecko.com/coins/images/4128/small/solana.png',
      'XRP': 'https://assets.coingecko.com/coins/images/44/small/xrp-symbol-white-128.png',
      'ADA': 'https://assets.coingecko.com/coins/images/975/small/cardano.png',
      'DOGE': 'https://assets.coingecko.com/coins/images/5/small/dogecoin.png',
      'SEI': 'https://assets.coingecko.com/coins/images/28205/small/sei.png',
      'HXB': 'https://assets.coingecko.com/coins/images/3688/small/hbar.png',
    }
    return logoMap[symbol] || 'https://assets.coingecko.com/coins/images/1/small/bitcoin.png'
  }

  const currentCrypto = cryptoList.find(c => c.symbol === selectedSymbol) || cryptoList[3]

  // 订单簿数据
  const [buyOrders, setBuyOrders] = useState<OrderBookItem[]>([])
  const [sellOrders, setSellOrders] = useState<OrderBookItem[]>([])

  useEffect(() => {
    // 生成模拟订单簿数据
    const generateOrders = (basePrice: number, isBuy: boolean): OrderBookItem[] => {
      const orders: OrderBookItem[] = []
      for (let i = 0; i < 12; i++) {
        const priceOffset = isBuy ? -(i + 1) * 0.015 : (i + 1) * 0.015
        const price = basePrice + priceOffset
        const amount = Math.random() * 5 + 0.5
        orders.push({ price, amount })
      }
      return orders
    }

    setBuyOrders(generateOrders(currentCrypto.price, true))
    setSellOrders(generateOrders(currentCrypto.price, false))

    // 每3秒更新订单簿
    const interval = setInterval(() => {
      setBuyOrders(generateOrders(currentCrypto.price, true))
      setSellOrders(generateOrders(currentCrypto.price, false))
    }, 3000)

    return () => clearInterval(interval)
  }, [currentCrypto.price])

  // 生成图表数据 - 使用 useMemo
  const chartData = useMemo(() => {
    const data = []
    const basePrice = currentCrypto.price
    const hours = ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00', '24:00']
    
    const dataPoints = timeframe === '1m' ? 30 : timeframe === '1h' ? 24 : timeframe === '1D' ? 7 : timeframe === '1W' ? 30 : 90
    
    for (let i = 0; i < dataPoints; i++) {
      const variance = (Math.random() - 0.5) * (basePrice * 0.05)
      const price = basePrice + variance + (currentCrypto.changePercent / 100 * basePrice * (i / dataPoints))
      
      let time = ''
      if (timeframe === '1m') {
        time = `${String(i).padStart(2, '0')}:00`
      } else if (timeframe === '1h') {
        time = `${String(i).padStart(2, '0')}:00`
      } else if (timeframe === '1D') {
        time = hours[i % 7]
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
  }, [currentCrypto.price, currentCrypto.changePercent, timeframe])

  // 生成K线蜡烛图数据 - 用于抽屉图表
  const candlestickData = useMemo(() => {
    const data = []
    const basePrice = currentCrypto.price
    const dataPoints = chartTimeframe === '1m' ? 60 : chartTimeframe === '1h' ? 24 : chartTimeframe === '4h' ? 42 : chartTimeframe === '1D' ? 30 : chartTimeframe === '1W' ? 52 : chartTimeframe === '1M' ? 12 : 365
    
    let prevClose = basePrice
    
    for (let i = 0; i < dataPoints; i++) {
      const volatility = basePrice * 0.015
      const trend = (currentCrypto.changePercent / 100 * basePrice * (i / dataPoints))
      
      const open = prevClose
      const close = open + (Math.random() - 0.48) * volatility + trend / dataPoints
      const high = Math.max(open, close) + Math.random() * volatility * 0.5
      const low = Math.min(open, close) - Math.random() * volatility * 0.5
      const volume = Math.random() * 10 + 5
      
      let time = ''
      if (chartTimeframe === '1m') {
        time = `${String(i).padStart(2, '0')}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')}`
      } else if (chartTimeframe === '1h') {
        time = `${String(i).padStart(2, '0')}:00`
      } else if (chartTimeframe === '4h') {
        time = `${i % 6 * 4}h`
      } else if (chartTimeframe === '1D' || chartTimeframe === '1W') {
        time = `${i + 1}日`
      } else {
        time = `${i + 1}月`
      }
      
      data.push({
        time,
        open: parseFloat(open.toFixed(3)),
        high: parseFloat(high.toFixed(3)),
        low: parseFloat(low.toFixed(3)),
        close: parseFloat(close.toFixed(3)),
        volume: parseFloat(volume.toFixed(2)),
        ma5: i >= 4 ? parseFloat((data.slice(i - 4, i + 1).reduce((sum, d: any) => sum + d.close, close) / 5).toFixed(3)) : null,
        ma10: i >= 9 ? parseFloat((data.slice(i - 9, i + 1).reduce((sum, d: any) => sum + d.close, close) / 10).toFixed(3)) : null,
        ma30: i >= 29 ? parseFloat((data.slice(i - 29, i + 1).reduce((sum, d: any) => sum + d.close, close) / 30).toFixed(3)) : null,
      })
      
      prevClose = close
    }
    
    return data
  }, [currentCrypto.price, currentCrypto.changePercent, chartTimeframe])

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

  const handleSliderChange = (value: number) => {
    setSliderValue(value)
  }

  const maxBuyAmount = Math.max(...buyOrders.map(o => o.amount), 1)
  const maxSellAmount = Math.max(...sellOrders.map(o => o.amount), 1)

  return (
    <div className="bg-[#0A0A0A] text-white">
      {/* 交易对选择器 */}
      <div className="px-4 py-4 border-b border-white/10">
        <div className="flex items-center justify-between">
          <button 
            onClick={() => setSymbolDrawerOpen(true)}
            className="flex items-center gap-2"
          >
            <div>
              <div className="text-white">{selectedSymbol}</div>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-lg text-white">{currentCrypto.price.toFixed(3)}</span>
                <span className={`text-sm ${currentCrypto.changePercent >= 0 ? 'text-[#A3F030]' : 'text-red-500'}`}>
                  {currentCrypto.changePercent >= 0 ? '+' : ''}{currentCrypto.changePercent.toFixed(2)}%
                </span>
              </div>
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
                  <linearGradient id="cryptoColorPrice" x1="0" y1="0" x2="0" y2="1">
                    <stop 
                      offset="5%" 
                      stopColor={currentCrypto.changePercent >= 0 ? '#A3F030' : '#ef4444'} 
                      stopOpacity={0.3}
                    />
                    <stop 
                      offset="95%" 
                      stopColor={currentCrypto.changePercent >= 0 ? '#A3F030' : '#ef4444'} 
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
                  stroke={currentCrypto.changePercent >= 0 ? '#A3F030' : '#ef4444'}
                  strokeWidth={2}
                  fill="url(#cryptoColorPrice)"
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
                  <linearGradient id="cryptoColorVolume" x1="0" y1="0" x2="0" y2="1">
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
                  fill="url(#cryptoColorVolume)"
                  animationDuration={300}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* 主要内容区域：交易表单 + 订单簿 */}
      <div className="grid grid-cols-[1fr_auto] gap-0">
        {/* 左侧：交易表单 */}
        <div className="px-4 py-4 border-r border-white/10">
          {/* 市价/限价切换 */}
          <div className="flex gap-6 mb-4 border-b border-white/10">
            <button
              onClick={() => setOrderType('market')}
              className={`pb-3 relative text-sm transition-colors ${
                orderType === 'market'
                  ? 'text-white'
                  : 'text-white/50'
              }`}
            >
              市价
              {orderType === 'market' && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#A3F030]"></div>
              )}
            </button>
            <button
              onClick={() => setOrderType('limit')}
              className={`pb-3 relative text-sm transition-colors ${
                orderType === 'limit'
                  ? 'text-white'
                  : 'text-white/50'
              }`}
            >
              限价
              {orderType === 'limit' && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#A3F030]"></div>
              )}
            </button>
          </div>

          {/* 市价模式 */}
          {orderType === 'market' && (
            <div className="space-y-3">
              <div className="px-4 py-3 bg-[#1A1A1A] rounded-lg text-sm text-white/70">
                按当前市价下单
              </div>

              {/* 交易额 */}
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm text-white/70">交易额</span>
                  <span className="text-sm text-white/50">USDT</span>
                </div>
                <Input
                  type="number"
                  value={totalAmount}
                  onChange={(e) => setTotalAmount(e.target.value)}
                  placeholder="0"
                  className="bg-[#1A1A1A] border-white/10 text-white h-12"
                />
              </div>

              {/* 数量 */}
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm text-white/70">数量</span>
                  <span className="text-sm text-white/50">SOL</span>
                </div>
                <Input
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  placeholder="0"
                  className="bg-[#1A1A1A] border-white/10 text-white h-12"
                />
              </div>

              {/* 百分比滑块 */}
              <div className="pt-2">
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

              {/* 可用余额信息 */}
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-white/50">可用</span>
                  <span className="text-white">1000000 USDT</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/50">可买</span>
                  <span className="text-white">7084.14234895</span>
                </div>
              </div>

              {/* 买入按钮 */}
              <Button className="w-full h-12 bg-[#A3F030] hover:bg-[#92d929] text-black rounded-lg">
                买入
              </Button>

              {/* 可卖信息 */}
              <div className="flex justify-between text-sm">
                <span className="text-white/50">可卖</span>
                <span className="text-white">0</span>
              </div>

              {/* 卖出按钮 */}
              <Button className="w-full h-12 bg-red-500 hover:bg-red-600 text-white rounded-lg">
                卖出
              </Button>
            </div>
          )}

          {/* 限价模式 */}
          {orderType === 'limit' && (
            <div className="space-y-3">
              {/* 价格输入 */}
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm text-white/70">价格</span>
                  <span className="text-sm text-white/50">USDT</span>
                </div>
                <Input
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder={currentCrypto.price.toFixed(2)}
                  className="bg-[#1A1A1A] border-white/10 text-white h-12"
                />
              </div>

              {/* 交易额 */}
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm text-white/70">交易额</span>
                  <span className="text-sm text-white/50">USDT</span>
                </div>
                <Input
                  type="number"
                  value={totalAmount}
                  onChange={(e) => setTotalAmount(e.target.value)}
                  placeholder="0"
                  className="bg-[#1A1A1A] border-white/10 text-white h-12"
                />
              </div>

              {/* 数量 */}
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm text-white/70">数量</span>
                  <span className="text-sm text-white/50">SOL</span>
                </div>
                <Input
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  placeholder="0"
                  className="bg-[#1A1A1A] border-white/10 text-white h-12"
                />
              </div>

              {/* 百分比滑块 */}
              <div className="pt-2">
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

              {/* 可用余额信息 */}
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-white/50">可用</span>
                  <span className="text-white">1000000 USDT</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/50">可买</span>
                  <span className="text-white">7084.04195011</span>
                </div>
              </div>

              {/* 买入按钮 */}
              <Button className="w-full h-12 bg-[#A3F030] hover:bg-[#92d929] text-black rounded-lg">
                买入
              </Button>

              {/* 可卖信息 */}
              <div className="flex justify-between text-sm">
                <span className="text-white/50">可卖</span>
                <span className="text-white">0</span>
              </div>

              {/* 卖出按钮 */}
              <Button className="w-full h-12 bg-red-500 hover:bg-red-600 text-white rounded-lg">
                卖出
              </Button>
            </div>
          )}
        </div>

        {/* 右侧：订单簿 */}
        <div className="w-48 py-4 pr-4">
          <div className="mb-3">
            <div className="flex items-center justify-between text-xs mb-3">
              <span className="text-white/70">价格(USDT)</span>
              <span className="text-white/70">数量(SOL)</span>
            </div>

            {/* 三个小图标 */}
            <div className="flex gap-2 mb-3">
              <button className="w-6 h-6 flex items-center justify-center bg-white/5 rounded hover:bg-white/10">
                <div className="flex flex-col gap-0.5">
                  <div className="w-2 h-0.5 bg-red-500"></div>
                  <div className="w-2 h-0.5 bg-[#A3F030]"></div>
                </div>
              </button>
              <button className="w-6 h-6 flex items-center justify-center bg-white/5 rounded hover:bg-white/10">
                <div className="flex flex-col gap-0.5">
                  <div className="w-2 h-0.5 bg-[#A3F030]"></div>
                  <div className="w-2 h-0.5 bg-[#A3F030]"></div>
                </div>
              </button>
              <button className="w-6 h-6 flex items-center justify-center bg-white/5 rounded hover:bg-white/10">
                <div className="flex flex-col gap-0.5">
                  <div className="w-2 h-0.5 bg-red-500"></div>
                  <div className="w-2 h-0.5 bg-red-500"></div>
                </div>
              </button>
            </div>

            {/* 卖单 (红色) - 倒序显示 */}
            <div className="space-y-0.5 mb-2">
              {sellOrders.slice(0, 8).reverse().map((order, idx) => (
                <div key={idx} className="relative flex justify-between text-xs py-0.5">
                  <div 
                    className="absolute right-0 top-0 bottom-0 bg-red-500/10" 
                    style={{ width: `${(order.amount / maxSellAmount) * 100}%` }}
                  />
                  <span className="relative z-10 text-red-500">{order.price.toFixed(3)}</span>
                  <span className="relative z-10 text-white/70">{order.amount.toFixed(6)}</span>
                </div>
              ))}
            </div>

            {/* 最新价格 */}
            <div className={`text-center py-2 my-2 flex items-center justify-center gap-1 ${currentCrypto.changePercent >= 0 ? 'text-[#A3F030]' : 'text-red-500'}`}>
              <span className="text-lg">{currentCrypto.price.toFixed(3)}</span>
              {currentCrypto.changePercent >= 0 ? (
                <TrendingUp className="w-4 h-4" />
              ) : (
                <TrendingDown className="w-4 h-4" />
              )}
            </div>

            {/* 买单 (绿色) */}
            <div className="space-y-0.5">
              {buyOrders.slice(0, 12).map((order, idx) => (
                <div key={idx} className="relative flex justify-between text-xs py-0.5">
                  <div 
                    className="absolute right-0 top-0 bottom-0 bg-[#A3F030]/10" 
                    style={{ width: `${(order.amount / maxBuyAmount) * 100}%` }}
                  />
                  <span className="relative z-10 text-[#A3F030]">{order.price.toFixed(3)}</span>
                  <span className="relative z-10 text-white/70">{order.amount.toFixed(6)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
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

      {/* 交易对选择抽屉 */}
      <Drawer open={symbolDrawerOpen} onOpenChange={setSymbolDrawerOpen}>
        <DrawerContent className="h-[70vh] bg-[#2A2A2A] border-t border-white/10">
          <DrawerHeader className="sr-only">
            <DrawerTitle>选择交易对</DrawerTitle>
            <DrawerDescription>选择您要交易的加密货币对</DrawerDescription>
          </DrawerHeader>

          <div className="flex flex-col h-full">
            {/* 顶部标题栏 */}
            <div className="flex-shrink-0 px-4 py-4 border-b border-white/10">
              <div className="flex items-center justify-center relative">
                <h2 className="text-lg text-white">币币</h2>
                <button 
                  onClick={() => setSymbolDrawerOpen(false)}
                  className="absolute right-0 p-2 hover:bg-white/10 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-white/60" />
                </button>
              </div>
            </div>

            {/* 交易对列表 */}
            <div className="flex-1 overflow-y-auto">
              {cryptoList.map((crypto) => {
                const baseCurrency = crypto.symbol.split('/')[0]
                const logoUrl = getCryptoLogo(baseCurrency)
                
                return (
                  <button
                    key={crypto.symbol}
                    onClick={() => {
                      setSelectedSymbol(crypto.symbol)
                      setSymbolDrawerOpen(false)
                    }}
                    className="w-full px-4 py-4 flex items-center gap-4 hover:bg-white/5 transition-colors border-b border-white/5"
                  >
                    {/* 币种图标 - 使用真实logo */}
                    <div className="w-12 h-12 rounded-full flex items-center justify-center overflow-hidden bg-[#1A1A1A]">
                      <img 
                        src={logoUrl} 
                        alt={baseCurrency}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          // 如果logo加载失败，显示文字后备方案
                          const target = e.target as HTMLImageElement
                          target.style.display = 'none'
                          if (target.nextSibling) {
                            (target.nextSibling as HTMLElement).style.display = 'flex'
                          }
                        }}
                      />
                      <div 
                        className="w-full h-full items-center justify-center text-lg text-white hidden rounded-full"
                        style={{
                          background: baseCurrency === 'SOL' ? 'linear-gradient(135deg, #14F195, #9945FF)' :
                                      baseCurrency === 'SEI' ? 'linear-gradient(135deg, #FF6B6B, #FFA500)' :
                                      baseCurrency === 'BTC' ? 'linear-gradient(135deg, #F7931A, #FFA500)' :
                                      baseCurrency === 'ADA' ? 'linear-gradient(135deg, #0033AD, #66B2FF)' :
                                      baseCurrency === 'HXB' ? 'linear-gradient(135deg, #000000, #666666)' :
                                      baseCurrency === 'DOGE' ? 'linear-gradient(135deg, #C2A633, #FEBE12)' :
                                      baseCurrency === 'ETH' ? 'linear-gradient(135deg, #627EEA, #8A92B2)' :
                                      baseCurrency === 'BNB' ? 'linear-gradient(135deg, #F3BA2F, #FFA500)' :
                                      'linear-gradient(135deg, #4A90E2, #67B26F)'
                        }}
                      >
                        <span className="text-white">
                          {baseCurrency === 'BTC' ? '₿' :
                           baseCurrency === 'ETH' ? 'Ξ' :
                           baseCurrency === 'DOGE' ? 'Ð' :
                           baseCurrency.slice(0, 1)}
                        </span>
                      </div>
                    </div>

                    {/* 交易对信息 */}
                    <div className="flex-1">
                      <div className="text-white text-left">{crypto.symbol}</div>
                    </div>

                    {/* 价格和涨跌幅 */}
                    <div className="text-right">
                      <div className={`text-lg mb-1 ${crypto.changePercent >= 0 ? 'text-[#A3F030]' : 'text-red-500'}`}>
                        {crypto.price >= 1000 ? crypto.price.toLocaleString() : crypto.price.toFixed(6)}
                      </div>
                      <div className="flex items-center gap-2 justify-end">
                        <span className={`text-sm ${crypto.changePercent >= 0 ? 'text-red-500' : 'text-red-500'}`}>
                          {crypto.change >= 0 ? '' : ''}{Math.abs(crypto.change).toFixed(crypto.change >= 1 ? 2 : 6)}
                        </span>
                        <span 
                          className={`px-2 py-1 rounded text-xs text-white ${crypto.changePercent >= 0 ? 'bg-[#A3F030]' : 'bg-red-500'}`}
                        >
                          {crypto.changePercent >= 0 ? '+' : ''}{crypto.changePercent.toFixed(2)}%
                        </span>
                      </div>
                    </div>
                  </button>
                )
              })}
            </div>
          </div>
        </DrawerContent>
      </Drawer>

      {/* K线图表抽屉 */}
      <Drawer open={chartDrawerOpen} onOpenChange={setChartDrawerOpen}>
        <DrawerContent className="h-[90vh] max-h-[90vh] bg-[#0A0A0A] border-t border-white/10">
          <DrawerHeader className="sr-only">
            <DrawerTitle>{selectedSymbol} 图表</DrawerTitle>
            <DrawerDescription>实时K线图表和技术指标</DrawerDescription>
          </DrawerHeader>

          <div className="flex flex-col h-full overflow-hidden">
            {/* 顶部栏 */}
            <div className="flex-shrink-0 px-4 py-4 border-b border-white/10">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl text-white">{selectedSymbol}</h2>
                <button 
                  onClick={() => setChartDrawerOpen(false)}
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-white/60" />
                </button>
              </div>

              {/* 价格信息 */}
              <div className="grid grid-cols-2 gap-x-6 gap-y-2">
                <div>
                  <div className={`text-3xl mb-1 ${currentCrypto.changePercent >= 0 ? 'text-[#A3F030]' : 'text-red-500'}`}>
                    {currentCrypto.price.toFixed(2)}
                    {currentCrypto.changePercent >= 0 ? (
                      <TrendingUp className="w-6 h-6 inline ml-2" />
                    ) : (
                      <TrendingDown className="w-6 h-6 inline ml-2" />
                    )}
                  </div>
                  <div className={`text-sm ${currentCrypto.changePercent >= 0 ? 'text-[#A3F030]' : 'text-red-500'}`}>
                    {currentCrypto.change >= 0 ? '+' : ''}{currentCrypto.change.toFixed(3)} {currentCrypto.changePercent >= 0 ? '+' : ''}{currentCrypto.changePercent.toFixed(2)}%
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <p className="text-white/50 text-xs">最高</p>
                    <p className="text-white">{(currentCrypto.price * 1.02).toFixed(3)}</p>
                  </div>
                  <div>
                    <p className="text-white/50 text-xs">成交额</p>
                    <p className="text-white">4.94B</p>
                  </div>
                  <div>
                    <p className="text-white/50 text-xs">最低</p>
                    <p className="text-white">{(currentCrypto.price * 0.98).toFixed(3)}</p>
                  </div>
                  <div>
                    <p className="text-white/50 text-xs">成交量</p>
                    <p className="text-white">35.01M</p>
                  </div>
                </div>
              </div>

              <div className="flex gap-4 mt-3 text-sm">
                <div>
                  <span className="text-white/50">今开</span>
                  <span className="text-white ml-2">{(currentCrypto.price - currentCrypto.change).toFixed(3)}</span>
                </div>
                <div>
                  <span className="text-white/50">昨收</span>
                  <span className="text-white ml-2">{(currentCrypto.price - currentCrypto.change).toFixed(3)}</span>
                </div>
              </div>
            </div>

            {/* 标签栏 */}
            <div className="flex-shrink-0 px-4 py-3 flex gap-6 border-b border-white/10">
              {(['market', 'orderbook', 'trades'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setChartTab(tab)}
                  className={`pb-2 relative text-sm transition-colors ${
                    chartTab === tab ? 'text-white' : 'text-white/50'
                  }`}
                >
                  {tab === 'market' ? '行情' : tab === 'orderbook' ? '订单簿' : '最新成交'}
                  {chartTab === tab && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#A3F030]"></div>
                  )}
                </button>
              ))}
            </div>

            {/* 订单簿标签页 */}
            {chartTab === 'orderbook' && (
              <OrderbookTab
                sellOrders={sellOrders}
                buyOrders={buyOrders}
                currentPrice={currentCrypto.price}
                changePercent={currentCrypto.changePercent}
                maxSellAmount={maxSellAmount}
                maxBuyAmount={maxBuyAmount}
              />
            )}

            {/* 最新成交标签页 */}
            {chartTab === 'trades' && (
              <TradesTab currentPrice={currentCrypto.price} />
            )}

            {/* 行情标签页 */}
            {chartTab === 'market' && (
              <>
                {/* 时间选择器 */}
                <div className="flex-shrink-0 px-4 py-3 flex items-center gap-2 border-b border-white/10 overflow-x-auto">
              <span className="text-sm text-white/50 mr-2 flex-shrink-0">Time</span>
              <select className="px-2 py-1 bg-white/10 rounded text-sm text-white border-none outline-none">
                <option value="1m">1m</option>
              </select>
              {['1h', '4h', '1D', '1W', '1M', '1Y'].map((tf) => (
                <button
                  key={tf}
                  onClick={() => setChartTimeframe(tf)}
                  className={`px-3 py-1.5 rounded text-sm transition-all flex-shrink-0 ${
                    chartTimeframe === tf
                      ? 'bg-white/20 text-white'
                      : 'text-white/70 hover:bg-white/10'
                  }`}
                >
                  {tf}
                </button>
              ))}
            </div>

            {/* MA指标信息 */}
            <div className="flex-shrink-0 px-4 py-2 flex items-center gap-4 text-xs overflow-x-auto">
              <div className="flex items-center gap-1">
                <span className="text-white/50">MA(5,10,30,60)</span>
              </div>
              {candlestickData.length > 0 && candlestickData[candlestickData.length - 1].ma5 && (
                <div className="flex items-center gap-1">
                  <span className="text-[#c084fc]">MA5:</span>
                  <span className="text-[#c084fc]">{candlestickData[candlestickData.length - 1].ma5}</span>
                </div>
              )}
              {candlestickData.length > 0 && candlestickData[candlestickData.length - 1].ma10 && (
                <div className="flex items-center gap-1">
                  <span className="text-[#60a5fa]">MA10:</span>
                  <span className="text-[#60a5fa]">{candlestickData[candlestickData.length - 1].ma10}</span>
                </div>
              )}
              {candlestickData.length > 0 && candlestickData[candlestickData.length - 1].ma30 && (
                <div className="flex items-center gap-1">
                  <span className="text-[#f87171]">MA30:</span>
                  <span className="text-[#f87171]">{candlestickData[candlestickData.length - 1].ma30}</span>
                </div>
              )}
            </div>

            {/* K线图表区域 */}
            <div className="flex-1 px-4 overflow-hidden">
              <div className="h-full">
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart
                    data={candlestickData}
                    margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                    <XAxis 
                      dataKey="time" 
                      stroke="rgba(255,255,255,0.3)"
                      tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 11 }}
                      tickLine={false}
                    />
                    <YAxis 
                      yAxisId="price"
                      stroke="rgba(255,255,255,0.3)"
                      tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 11 }}
                      tickLine={false}
                      domain={['dataMin - 2', 'dataMax + 2']}
                      tickFormatter={(value) => value.toFixed(1)}
                    />
                    <YAxis 
                      yAxisId="volume"
                      orientation="right"
                      stroke="rgba(255,255,255,0.3)"
                      tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 11 }}
                      tickLine={false}
                    />
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: '#0A0A0A',
                        border: '1px solid rgba(255,255,255,0.1)',
                        borderRadius: '8px',
                        color: '#fff'
                      }}
                      labelStyle={{ color: 'rgba(255,255,255,0.7)' }}
                    />
                    
                    {/* MA均线 */}
                    <Line 
                      yAxisId="price"
                      type="monotone" 
                      dataKey="ma5" 
                      stroke="#c084fc" 
                      strokeWidth={1} 
                      dot={false}
                      connectNulls
                    />
                    <Line 
                      yAxisId="price"
                      type="monotone" 
                      dataKey="ma10" 
                      stroke="#60a5fa" 
                      strokeWidth={1} 
                      dot={false}
                      connectNulls
                    />
                    <Line 
                      yAxisId="price"
                      type="monotone" 
                      dataKey="ma30" 
                      stroke="#f87171" 
                      strokeWidth={1} 
                      dot={false}
                      connectNulls
                    />

                    {/* 蜡烛图 - 使用Bar模拟 */}
                    <Bar 
                      yAxisId="price"
                      dataKey={(data: any) => [data.low, data.high]}
                      fill="transparent"
                      shape={(props: any) => {
                        const { x, y, width, payload } = props
                        if (!payload) return null
                        const { open, close, high, low } = payload
                        const isUp = close >= open
                        const color = isUp ? '#A3F030' : '#ef4444'
                        const bodyHeight = Math.abs(close - open) * (props.height / (high - low || 1))
                        const bodyY = y + (high - Math.max(open, close)) * (props.height / (high - low || 1))
                        
                        return (
                          <g>
                            {/* 影线 */}
                            <line
                              x1={x + width / 2}
                              y1={y}
                              x2={x + width / 2}
                              y2={y + props.height}
                              stroke={color}
                              strokeWidth={1}
                            />
                            {/* 实体 */}
                            <rect
                              x={x + 1}
                              y={bodyY}
                              width={width - 2}
                              height={Math.max(bodyHeight, 1)}
                              fill={color}
                            />
                          </g>
                        )
                      }}
                    />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* 成交量图表 */}
            <div className="flex-shrink-0 px-4 pb-4" style={{ height: '100px' }}>
              <div className="text-xs text-white/50 mb-2">
                VOL: {candlestickData.length > 0 ? candlestickData[candlestickData.length - 1].volume.toFixed(2) : '0'}
              </div>
              <ResponsiveContainer width="100%" height="80%">
                <ComposedChart
                  data={candlestickData}
                  margin={{ top: 0, right: 10, left: 0, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis 
                    dataKey="time" 
                    stroke="rgba(255,255,255,0.3)"
                    tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 10 }}
                    tickLine={false}
                  />
                  <YAxis 
                    stroke="rgba(255,255,255,0.3)"
                    tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 10 }}
                    tickLine={false}
                  />
                  <Bar 
                    dataKey="volume"
                    fill={(data: any) => (data.close >= data.open ? '#A3F030' : '#ef4444')}
                    opacity={0.7}
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
              </>
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