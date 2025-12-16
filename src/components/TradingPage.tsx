import { useState, useEffect } from 'react'
import { Card, CardContent } from './ui/card'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs'
import { Navbar } from './Navbar'
import { MobileBottomNav } from './MobileBottomNav'
import { MobileTradingPage } from './MobileTradingPage'
import { 
  TrendingUp, 
  TrendingDown, 
  Search,
  Star,
  BarChart3,
  Activity,
  Wallet,
  History
} from 'lucide-react'

// 交易对数据类型
interface TradingPair {
  symbol: string
  baseAsset: string
  quoteAsset: string
  price: string
  priceChange: string
  priceChangePercent: string
  volume: string
  highPrice: string
  lowPrice: string
}

// 订单簿数据类型
interface OrderBookItem {
  price: string
  quantity: string
  total: string
}

// K线数据类型
interface Ticker24h {
  symbol: string
  priceChange: string
  priceChangePercent: string
  lastPrice: string
  volume: string
  quoteVolume: string
  openPrice: string
  highPrice: string
  lowPrice: string
}

// 生成模拟交易对数据
const generateMockTradingPairs = (): TradingPair[] => {
  const pairs = [
    { base: 'SOL', price: 145.23, change: 5.67 },
    { base: 'BTC', price: 67234.50, change: 2.34 },
    { base: 'ETH', price: 3456.78, change: -1.23 },
    { base: 'BNB', price: 345.67, change: 3.45 },
    { base: 'ADA', price: 0.5234, change: -2.11 },
    { base: 'DOGE', price: 0.0823, change: 7.89 },
    { base: 'XRP', price: 0.6234, change: 1.56 },
    { base: 'DOT', price: 7.234, change: -0.89 },
    { base: 'AVAX', price: 38.45, change: 4.23 },
    { base: 'MATIC', price: 0.8456, change: 2.67 },
    { base: 'LINK', price: 15.67, change: -1.45 },
    { base: 'UNI', price: 8.234, change: 3.12 },
  ]

  return pairs.map(pair => {
    const priceChange = (pair.price * pair.change / 100).toFixed(8)
    const volume = (Math.random() * 10000000 + 1000000).toFixed(2)
    const high = (pair.price * 1.05).toFixed(8)
    const low = (pair.price * 0.95).toFixed(8)

    return {
      symbol: `${pair.base}USDT`,
      baseAsset: pair.base,
      quoteAsset: 'USDT',
      price: pair.price.toFixed(8),
      priceChange,
      priceChangePercent: pair.change.toFixed(2),
      volume,
      highPrice: high,
      lowPrice: low
    }
  })
}

export function TradingPage() {
  const [isMobile, setIsMobile] = useState(false)
  const [selectedPair, setSelectedPair] = useState('SOLUSDT')
  const [tradingPairs, setTradingPairs] = useState<TradingPair[]>([])
  const [ticker, setTicker] = useState<Ticker24h | null>(null)
  const [orderBookAsks, setOrderBookAsks] = useState<OrderBookItem[]>([])
  const [orderBookBids, setOrderBookBids] = useState<OrderBookItem[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [orderType, setOrderType] = useState<'limit' | 'market'>('limit')
  const [side, setSide] = useState<'buy' | 'sell'>('buy')
  const [price, setPrice] = useState('')
  const [amount, setAmount] = useState('')
  const [loading, setLoading] = useState(true)

  // 检测是否为移动设备
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 992)
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // 热门交易对列表
  const popularPairs = [
    'SOLUSDT', 'BTCUSDT', 'ETHUSDT', 'BNBUSDT', 
    'ADAUSDT', 'DOGEUSDT', 'XRPUSDT', 'DOTUSDT',
    'AVAXUSDT', 'MATICUSDT', 'LINKUSDT', 'UNIUSDT'
  ]

  // 获取交易对列表（Binance API）
  useEffect(() => {
    const fetchTradingPairs = async () => {
      try {
        // 使用CORS代理
        const response = await fetch('https://api.binance.com/api/v3/ticker/24hr')
        
        if (!response.ok) {
          throw new Error('Network response was not ok')
        }
        
        const data = await response.json()
        
        // 过滤只显示USDT交易对
        const usdtPairs = data
          .filter((pair: any) => pair.symbol.endsWith('USDT'))
          .slice(0, 50) // 只取前50个
          .map((pair: any) => ({
            symbol: pair.symbol,
            baseAsset: pair.symbol.replace('USDT', ''),
            quoteAsset: 'USDT',
            price: parseFloat(pair.lastPrice).toFixed(8),
            priceChange: pair.priceChange,
            priceChangePercent: parseFloat(pair.priceChangePercent).toFixed(2),
            volume: parseFloat(pair.volume).toFixed(2),
            highPrice: pair.highPrice,
            lowPrice: pair.lowPrice
          }))

        setTradingPairs(usdtPairs)
        setLoading(false)
      } catch (error) {
        // API调用失败，使用模拟数据（静默失败）
        // 使用模拟数据作为后备
        const mockData = generateMockTradingPairs()
        setTradingPairs(mockData)
        setLoading(false)
      }
    }

    fetchTradingPairs()
    const interval = setInterval(fetchTradingPairs, 10000) // 每10秒更新

    return () => clearInterval(interval)
  }, [])

  // 获取选中交易对的详细信息
  useEffect(() => {
    const fetchTickerData = async () => {
      try {
        const response = await fetch(
          `https://api.binance.com/api/v3/ticker/24hr?symbol=${selectedPair}`
        )
        
        if (!response.ok) {
          throw new Error('Network response was not ok')
        }
        
        const data = await response.json()
        setTicker(data)
      } catch (error) {
        // API调用失败，使用模拟数据（静默失败）
        // 使用模拟数据
        const pair = tradingPairs.find(p => p.symbol === selectedPair)
        if (pair) {
          setTicker({
            symbol: pair.symbol,
            priceChange: pair.priceChange,
            priceChangePercent: pair.priceChangePercent,
            lastPrice: pair.price,
            volume: pair.volume,
            quoteVolume: (parseFloat(pair.volume) * parseFloat(pair.price)).toFixed(2),
            openPrice: (parseFloat(pair.price) - parseFloat(pair.priceChange)).toFixed(8),
            highPrice: pair.highPrice,
            lowPrice: pair.lowPrice
          })
        }
      }
    }

    if (tradingPairs.length > 0) {
      fetchTickerData()
      const interval = setInterval(fetchTickerData, 3000) // 每3秒更新
      return () => clearInterval(interval)
    }
  }, [selectedPair, tradingPairs])

  // 获取订单簿数据
  useEffect(() => {
    const fetchOrderBook = async () => {
      try {
        const response = await fetch(
          `https://api.binance.com/api/v3/depth?symbol=${selectedPair}&limit=20`
        )
        
        if (!response.ok) {
          throw new Error('Network response was not ok')
        }
        
        const data = await response.json()

        // 处理卖单（asks）
        const asks = data.asks.map((ask: string[]) => ({
          price: parseFloat(ask[0]).toFixed(2),
          quantity: parseFloat(ask[1]).toFixed(4),
          total: (parseFloat(ask[0]) * parseFloat(ask[1])).toFixed(2)
        }))

        // 处理买单（bids）
        const bids = data.bids.map((bid: string[]) => ({
          price: parseFloat(bid[0]).toFixed(2),
          quantity: parseFloat(bid[1]).toFixed(4),
          total: (parseFloat(bid[0]) * parseFloat(bid[1])).toFixed(2)
        }))

        setOrderBookAsks(asks)
        setOrderBookBids(bids)
      } catch (error) {
        // API调用失败，使用模拟数据（静默失败）
        // 生成模拟订单簿数据
        const pair = tradingPairs.find(p => p.symbol === selectedPair)
        if (pair) {
          const basePrice = parseFloat(pair.price)
          const asks: OrderBookItem[] = []
          const bids: OrderBookItem[] = []
          
          // 生成卖单（价格递增）
          for (let i = 0; i < 20; i++) {
            const askPrice = basePrice * (1 + (i + 1) * 0.0001)
            const quantity = Math.random() * 10 + 0.1
            asks.push({
              price: askPrice.toFixed(2),
              quantity: quantity.toFixed(4),
              total: (askPrice * quantity).toFixed(2)
            })
          }
          
          // 生成买单（价格递减）
          for (let i = 0; i < 20; i++) {
            const bidPrice = basePrice * (1 - (i + 1) * 0.0001)
            const quantity = Math.random() * 10 + 0.1
            bids.push({
              price: bidPrice.toFixed(2),
              quantity: quantity.toFixed(4),
              total: (bidPrice * quantity).toFixed(2)
            })
          }
          
          setOrderBookAsks(asks)
          setOrderBookBids(bids)
        }
      }
    }

    if (tradingPairs.length > 0) {
      fetchOrderBook()
      const interval = setInterval(fetchOrderBook, 2000) // 每2秒更新
      return () => clearInterval(interval)
    }
  }, [selectedPair, tradingPairs])

  const filteredPairs = tradingPairs.filter(pair =>
    pair.symbol.toLowerCase().includes(searchQuery.toLowerCase())
  )

  // 如果是移动设备，显示移动端布局
  if (isMobile) {
    return <MobileTradingPage />
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* 顶部导航栏 - 使用统一的 Navbar 组件 */}
      <Navbar />

      {/* 主要内容区域 */}
      <div className="flex flex-col lg:flex-row min-h-[calc(100vh-56px)] lg:h-[calc(100vh-56px)]">
        {/* 左侧：交易对列表 */}
        <div className="w-full lg:w-80 border-b lg:border-b-0 lg:border-r border-white/10 flex flex-col bg-black max-h-[400px] lg:max-h-none overflow-hidden">
          {/* 搜索框 */}
          <div className="p-4 border-b border-white/10">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/50" />
              <Input
                placeholder="搜索交易对"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-white/40"
              />
            </div>
          </div>

          {/* 交易对标题 */}
          <div className="px-4 py-2 text-xs text-white/60 grid grid-cols-3 border-b border-white/10">
            <div>交易对</div>
            <div className="text-right">最新价</div>
            <div className="text-right">涨跌幅</div>
          </div>

          {/* 交易对列表 */}
          <div className="flex-1 overflow-y-auto">
            {loading ? (
              <div className="flex items-center justify-center h-full">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
              </div>
            ) : (
              filteredPairs.map((pair) => (
                <button
                  key={pair.symbol}
                  onClick={() => setSelectedPair(pair.symbol)}
                  className={`w-full px-4 py-3 grid grid-cols-3 hover:bg-white/5 transition-colors ${
                    selectedPair === pair.symbol ? 'bg-white/10' : ''
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Star className="w-3 h-3 text-white/40" />
                    <div className="text-left">
                      <p className="font-semibold text-white">{pair.baseAsset}</p>
                      <p className="text-xs text-white/50">/USDT</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-white">{parseFloat(pair.price).toFixed(2)}</p>
                  </div>
                  <div className="text-right">
                    <span
                      className={`inline-flex items-center gap-1 text-sm font-semibold ${
                        parseFloat(pair.priceChangePercent) >= 0
                          ? 'text-green-500'
                          : 'text-red-500'
                      }`}
                    >
                      {parseFloat(pair.priceChangePercent) >= 0 ? (
                        <TrendingUp className="w-3 h-3" />
                      ) : (
                        <TrendingDown className="w-3 h-3" />
                      )}
                      {pair.priceChangePercent}%
                    </span>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>

        {/* 中间：图表和交易区域 */}
        <div className="flex-1 flex flex-col">
          {/* 交易对信息栏 */}
          <div className="border-b border-white/10 bg-black">
            <div className="p-4">
              <div className="flex flex-col lg:flex-row lg:items-center gap-4 lg:gap-8">
                <div>
                  <h2 className="text-2xl font-bold mb-1">
                    {selectedPair.replace('USDT', '/USDT')}
                  </h2>
                  {ticker && (
                    <div className="flex items-center gap-2">
                      <span className="text-3xl font-bold">
                        ${parseFloat(ticker.lastPrice).toFixed(2)}
                      </span>
                      <span
                        className={`text-lg font-semibold ${
                          parseFloat(ticker.priceChangePercent) >= 0
                            ? 'text-green-500'
                            : 'text-red-500'
                        }`}
                      >
                        {parseFloat(ticker.priceChangePercent) >= 0 ? '+' : ''}
                        {ticker.priceChangePercent}%
                      </span>
                    </div>
                  )}
                </div>

                {ticker && (
                  <div className="flex flex-wrap gap-4 lg:gap-8 text-sm">
                    <div>
                      <p className="text-white/60 mb-1">24h最高</p>
                      <p className="font-semibold text-white">${parseFloat(ticker.highPrice).toFixed(2)}</p>
                    </div>
                    <div>
                      <p className="text-white/60 mb-1">24h最低</p>
                      <p className="font-semibold text-white">${parseFloat(ticker.lowPrice).toFixed(2)}</p>
                    </div>
                    <div>
                      <p className="text-white/60 mb-1">24h成交量</p>
                      <p className="font-semibold text-white">
                        {(parseFloat(ticker.volume) / 1000000).toFixed(2)}M
                      </p>
                    </div>
                    <div>
                      <p className="text-white/60 mb-1">24h成交额</p>
                      <p className="font-semibold text-white">
                        ${(parseFloat(ticker.quoteVolume) / 1000000).toFixed(2)}M
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* TradingView图表 */}
          <div className="flex-1 bg-black min-h-[400px] lg:min-h-0">
            <iframe
              src={`https://www.tradingview.com/widgetembed/?frameElementId=tradingview_chart&symbol=BINANCE:${selectedPair}&interval=D&hidesidetoolbar=0&symboledit=1&saveimage=0&toolbarbg=000000&studies=[]&theme=dark&style=1&timezone=Asia/Shanghai&studies_overrides={}&overrides={}&enabled_features=[]&disabled_features=[]&locale=zh_CN&utm_source=localhost&utm_medium=widget&utm_campaign=chart&utm_term=BINANCE:${selectedPair}`}
              className="w-full h-full border-0"
            />
          </div>

          {/* 底部交易表单 */}
          <div className="border-t border-white/10 bg-black">
            <Tabs defaultValue="spot" className="w-full">
              <div className="border-b border-white/10 px-4">
                <TabsList className="bg-transparent">
                  <TabsTrigger value="spot" className="text-white data-[state=active]:bg-[#A3F030] data-[state=active]:text-black">
                    现货交易
                  </TabsTrigger>
                  <TabsTrigger value="margin" className="text-white data-[state=active]:bg-[#A3F030] data-[state=active]:text-black">
                    杠杆交易
                  </TabsTrigger>
                  <TabsTrigger value="futures" className="text-white data-[state=active]:bg-[#A3F030] data-[state=active]:text-black">
                    合约交易
                  </TabsTrigger>
                </TabsList>
              </div>

              <TabsContent value="spot" className="p-4">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {/* 买入区域 */}
                  <Card className="bg-white/5 border-white/10">
                    <CardContent className="p-4">
                      <div className="mb-4">
                        <div className="flex gap-2 mb-4">
                          <Button
                            variant={orderType === 'limit' ? 'default' : 'outline'}
                            onClick={() => setOrderType('limit')}
                            className="flex-1"
                          >
                            限价
                          </Button>
                          <Button
                            variant={orderType === 'market' ? 'default' : 'outline'}
                            onClick={() => setOrderType('market')}
                            className="flex-1"
                          >
                            市价
                          </Button>
                        </div>

                        {orderType === 'limit' && (
                          <div className="mb-3">
                            <label className="text-sm text-white/70 mb-1 block">价格</label>
                            <Input
                              type="number"
                              placeholder={ticker ? ticker.lastPrice : '0.00'}
                              value={price}
                              onChange={(e) => setPrice(e.target.value)}
                              className="bg-white/5 border-white/10 text-white"
                            />
                          </div>
                        )}

                        <div className="mb-3">
                          <label className="text-sm text-white/70 mb-1 block">数量</label>
                          <Input
                            type="number"
                            placeholder="0.00"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            className="bg-white/5 border-white/10 text-white"
                          />
                        </div>

                        <div className="flex gap-2 mb-3">
                          {[25, 50, 75, 100].map((percent) => (
                            <Button
                              key={percent}
                              variant="outline"
                              size="sm"
                              className="flex-1 border-white/10 text-white/80"
                            >
                              {percent}%
                            </Button>
                          ))}
                        </div>

                        <Button 
                          className="w-full text-black hover:opacity-90"
                          style={{ backgroundColor: '#A3F030' }}
                        >
                          买入 {selectedPair.replace('USDT', '')}
                        </Button>
                      </div>

                      <div className="flex items-center justify-between text-sm text-white/60">
                        <div className="flex items-center gap-1">
                          <Wallet className="w-4 h-4" />
                          <span>可用: 0.00 USDT</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* 卖出区域 */}
                  <Card className="bg-white/5 border-white/10">
                    <CardContent className="p-4">
                      <div className="mb-4">
                        <div className="flex gap-2 mb-4">
                          <Button
                            variant={orderType === 'limit' ? 'default' : 'outline'}
                            onClick={() => setOrderType('limit')}
                            className="flex-1"
                          >
                            限价
                          </Button>
                          <Button
                            variant={orderType === 'market' ? 'default' : 'outline'}
                            onClick={() => setOrderType('market')}
                            className="flex-1"
                          >
                            市价
                          </Button>
                        </div>

                        {orderType === 'limit' && (
                          <div className="mb-3">
                            <label className="text-sm text-white/70 mb-1 block">价格</label>
                            <Input
                              type="number"
                              placeholder={ticker ? ticker.lastPrice : '0.00'}
                              value={price}
                              onChange={(e) => setPrice(e.target.value)}
                              className="bg-white/5 border-white/10 text-white"
                            />
                          </div>
                        )}

                        <div className="mb-3">
                          <label className="text-sm text-white/70 mb-1 block">数量</label>
                          <Input
                            type="number"
                            placeholder="0.00"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            className="bg-white/5 border-white/10 text-white"
                          />
                        </div>

                        <div className="flex gap-2 mb-3">
                          {[25, 50, 75, 100].map((percent) => (
                            <Button
                              key={percent}
                              variant="outline"
                              size="sm"
                              className="flex-1 border-white/10 text-white/80"
                            >
                              {percent}%
                            </Button>
                          ))}
                        </div>

                        <Button className="w-full bg-red-600 hover:bg-red-700">
                          卖出 {selectedPair.replace('USDT', '')}
                        </Button>
                      </div>

                      <div className="flex items-center justify-between text-sm text-white/60">
                        <div className="flex items-center gap-1">
                          <Wallet className="w-4 h-4" />
                          <span>可用: 0.00 {selectedPair.replace('USDT', '')}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>

        {/* 右侧：订单簿和最近成交 */}
        <div className="w-full lg:w-96 border-t lg:border-t-0 lg:border-l border-white/10 bg-black">
          <Tabs defaultValue="orderbook" className="h-full flex flex-col">
            <div className="border-b border-white/10 px-4">
              <TabsList className="bg-transparent">
                <TabsTrigger value="orderbook" className="text-white data-[state=active]:bg-[#A3F030] data-[state=active]:text-black">
                  订单簿
                </TabsTrigger>
                <TabsTrigger value="trades" className="text-white data-[state=active]:bg-[#A3F030] data-[state=active]:text-black">
                  最近成交
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="orderbook" className="flex-1 overflow-hidden">
              <div className="h-full flex flex-col">
                {/* 订单簿标题 */}
                <div className="px-4 py-2 text-xs text-white/60 grid grid-cols-3 border-b border-white/10">
                  <div className="text-left">价格(USDT)</div>
                  <div className="text-right">数量</div>
                  <div className="text-right">总额</div>
                </div>

                {/* 卖单区域 */}
                <div className="flex-1 overflow-y-auto">
                  <div className="flex flex-col-reverse">
                    {orderBookAsks.slice(0, 15).map((ask, index) => (
                      <div
                        key={`ask-${index}`}
                        className="px-4 py-1 grid grid-cols-3 text-xs hover:bg-white/5"
                      >
                        <div className="text-red-500 font-mono">{ask.price}</div>
                        <div className="text-right text-white/70 font-mono">
                          {ask.quantity}
                        </div>
                        <div className="text-right text-white/50 font-mono">{ask.total}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 当前价格 */}
                {ticker && (
                  <div className="px-4 py-3 border-y border-white/10 bg-white/5">
                    <div className="text-center">
                      <p
                        className={`text-2xl font-bold font-mono ${
                          parseFloat(ticker.priceChangePercent) >= 0
                            ? 'text-green-500'
                            : 'text-red-500'
                        }`}
                      >
                        {parseFloat(ticker.lastPrice).toFixed(2)}
                      </p>
                      <p className="text-xs text-gray-400">
                        ≈ ${parseFloat(ticker.lastPrice).toFixed(2)}
                      </p>
                    </div>
                  </div>
                )}

                {/* 买单区域 */}
                <div className="flex-1 overflow-y-auto">
                  {orderBookBids.slice(0, 15).map((bid, index) => (
                    <div
                      key={`bid-${index}`}
                      className="px-4 py-1 grid grid-cols-3 text-xs hover:bg-white/5"
                    >
                      <div className="text-green-500 font-mono">{bid.price}</div>
                      <div className="text-right text-gray-300 font-mono">{bid.quantity}</div>
                      <div className="text-right text-gray-400 font-mono">{bid.total}</div>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="trades" className="flex-1 overflow-y-auto">
              <div className="px-4 py-2 text-xs text-gray-400 grid grid-cols-3 border-b border-white/10">
                <div className="text-left">价格(USDT)</div>
                <div className="text-right">数量</div>
                <div className="text-right">时间</div>
              </div>
              <div className="px-4 py-8 text-center text-gray-500">
                <Activity className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">暂无最近成交数据</p>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
      
      {/* Mobile Bottom Navigation */}
      <MobileBottomNav />
    </div>
  )
}
