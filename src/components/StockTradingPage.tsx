import { useState, useEffect } from 'react'
import { Card, CardContent } from './ui/card'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs'
import { Checkbox } from './ui/checkbox'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog'
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
  History,
  Menu,
  ChevronRight,
  FileText
} from 'lucide-react'

// 股票数据类型
interface Stock {
  symbol: string
  name: string
  price: number
  change: number
  changePercent: number
  volume: string
  marketCap: string
}

// 订单簿数据类型
interface OrderBookItem {
  price: string
  quantity: string
  total: string
}

export function StockTradingPage() {
  const [isMobile, setIsMobile] = useState(false)
  const [selectedStock, setSelectedStock] = useState('CVCO')
  const [searchQuery, setSearchQuery] = useState('')
  const [tradingMode, setTradingMode] = useState<'trade' | 'margin' | 'premarket'>('trade')
  const [priceType, setPriceType] = useState<'market' | 'limit'>('market')
  const [price, setPrice] = useState('')
  const [amount, setAmount] = useState('')
  const [orderBookAsks, setOrderBookAsks] = useState<OrderBookItem[]>([])
  const [orderBookBids, setOrderBookBids] = useState<OrderBookItem[]>([])
  const [stopLossDialog, setStopLossDialog] = useState(false)
  const [stopLossEnabled, setStopLossEnabled] = useState(false)
  const [takeProfitEnabled, setTakeProfitEnabled] = useState(false)
  const [marginMode, setMarginMode] = useState<'cross' | 'isolated'>('cross')
  const [leverage, setLeverage] = useState('20X')

  // 检测是否为移动设备
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 992)
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // 模拟股票数据
  const stocks: Stock[] = [
    { symbol: 'CVCO', name: 'Cavco Industries Inc.', price: 521.1, change: -14.42, changePercent: -2.69, volume: '10.15M', marketCap: '19.22K' },
    { symbol: 'JFKX', name: 'JFK Index', price: 95.23, change: -1.33, changePercent: -1.38, volume: '5.2M', marketCap: '8.5K' },
    { symbol: 'KLXY', name: 'Klarity Inc', price: 25.97, change: 0.85, changePercent: 3.38, volume: '12.1M', marketCap: '15.3K' },
    { symbol: 'HCOW', name: 'Health ETF Two Amplify COWS', price: 23.75, change: -0.52, changePercent: -2.14, volume: '8.7M', marketCap: '11.2K' },
    { symbol: 'SCS', name: 'Steelcase, Inc.', price: 15.89, change: 0.42, changePercent: 2.71, volume: '9.4M', marketCap: '14.6K' },
    { symbol: 'BBC', name: 'Virtus LifeSci Biotech Clinical Trials E', price: 30.33, change: -1.25, changePercent: -3.96, volume: '6.8M', marketCap: '9.1K' },
    { symbol: 'TWST', name: 'Twist Bioscience Corporation Common St', price: 38.8, change: 1.15, changePercent: 3.06, volume: '15.2M', marketCap: '18.9K' },
    { symbol: 'BBD', name: 'Banco Bradesco S.A. American', price: 3.41, change: -0.08, changePercent: -2.29, volume: '25.3M', marketCap: '32.5K' },
    { symbol: 'BBSH', name: 'Vertus Biotech ETF', price: 178.84, change: 2.35, changePercent: 1.33, volume: '4.1M', marketCap: '7.8K' },
    { symbol: 'SCZ', name: 'iShares MSCI EAFE Small-Cap ETF', price: 75.55, change: -0.89, changePercent: -1.16, volume: '11.6M', marketCap: '16.4K' },
    { symbol: 'JIVE', name: 'JIVE Software Inc', price: 75.65, change: 1.42, changePercent: 1.92, volume: '7.3M', marketCap: '10.8K' },
    { symbol: 'AAPL', name: 'Apple Inc.', price: 178.45, change: 2.35, changePercent: 1.33, volume: '52.3M', marketCap: '2.8T' },
    { symbol: 'TSLA', name: 'Tesla, Inc.', price: 242.84, change: -5.67, changePercent: -2.28, volume: '98.5M', marketCap: '771.2B' },
    { symbol: 'NVDA', name: 'NVIDIA Corporation', price: 495.22, change: 8.91, changePercent: 1.83, volume: '45.6M', marketCap: '1.2T' },
    { symbol: 'MSFT', name: 'Microsoft Corporation', price: 378.91, change: 3.24, changePercent: 0.86, volume: '28.7M', marketCap: '2.8T' },
  ]

  const filteredStocks = stocks.filter(stock =>
    stock.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
    stock.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const currentStock = stocks.find(s => s.symbol === selectedStock) || stocks[0]

  // 模拟订单簿数据
  useEffect(() => {
    const generateOrderBook = () => {
      const basePrice = currentStock.price
      const asks: OrderBookItem[] = []
      const bids: OrderBookItem[] = []

      for (let i = 0; i < 15; i++) {
        const askPrice = basePrice + (i * 0.5)
        const bidPrice = basePrice - (i * 0.5)
        const quantity = (Math.random() * 1000 + 100).toFixed(0)
        
        asks.push({
          price: askPrice.toFixed(2),
          quantity: quantity,
          total: (askPrice * parseFloat(quantity)).toFixed(2)
        })

        bids.push({
          price: bidPrice.toFixed(2),
          quantity: quantity,
          total: (bidPrice * parseFloat(quantity)).toFixed(2)
        })
      }

      setOrderBookAsks(asks)
      setOrderBookBids(bids)
    }

    generateOrderBook()
    const interval = setInterval(generateOrderBook, 3000)
    return () => clearInterval(interval)
  }, [selectedStock, currentStock.price])

  // 如果是移动设备，显示移动端布局
  if (isMobile) {
    return <MobileTradingPage />
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* 顶部导航栏 */}
      <Navbar />

      {/* 主要内容区域 */}
      <div className="flex flex-col min-h-[calc(100vh-56px)] lg:h-[calc(100vh-56px)]">
        {/* 顶部：股票信息栏 - 横跨全宽 */}
        <div className="border-b border-white/10 bg-black px-4 py-3 flex-shrink-0">
          <div className="flex flex-col lg:flex-row lg:items-center gap-3 lg:gap-8">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h2 className="text-xl font-bold">{selectedStock}</h2>
                <span className="text-xs text-white/60">
                  {currentStock.marketCap}
                </span>
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-2xl lg:text-3xl font-bold">
                  {currentStock.price.toFixed(2)}
                </span>
                <span
                  className={`text-base lg:text-lg font-semibold ${
                    currentStock.changePercent >= 0
                      ? 'text-red-500'
                      : 'text-green-500'
                  }`}
                >
                  {currentStock.changePercent >= 0 ? '+' : ''}
                  {currentStock.change.toFixed(2)}
                </span>
                <span
                  className={`text-base lg:text-lg font-semibold ${
                    currentStock.changePercent >= 0
                      ? 'text-red-500'
                      : 'text-green-500'
                  }`}
                >
                  {currentStock.changePercent >= 0 ? '+' : ''}
                  {currentStock.changePercent.toFixed(2)}%
                </span>
              </div>
            </div>

            <div className="flex gap-4 lg:gap-8 text-sm overflow-x-auto pb-2 lg:pb-0">
              <div>
                <p className="text-white/60 mb-1 text-xs">开</p>
                <p className="font-semibold text-white">{(currentStock.price - currentStock.change).toFixed(2)}</p>
              </div>
              <div>
                <p className="text-white/60 mb-1 text-xs">高</p>
                <p className="font-semibold text-white">{(currentStock.price + Math.abs(currentStock.change) * 2).toFixed(2)}</p>
              </div>
              <div>
                <p className="text-white/60 mb-1 text-xs">低</p>
                <p className="font-semibold text-white">{(currentStock.price - Math.abs(currentStock.change) * 1.5).toFixed(2)}</p>
              </div>
              <div>
                <p className="text-white/60 mb-1 text-xs">成交量</p>
                <p className="font-semibold text-white">{currentStock.volume}</p>
              </div>
            </div>
          </div>
        </div>

        {/* 下方：三栏布局 */}
        <div className="flex flex-1 min-h-0">
          {/* 左侧：股票列表 */}
          <div className="hidden lg:flex w-64 border-r border-white/10 flex-col bg-black">
          {/* 搜索框 */}
          <div className="p-3 border-b border-white/10">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/50" />
              <Input
                placeholder="输入股票代码"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-white/40 h-9 text-sm"
              />
            </div>
          </div>

          {/* 列表标题 */}
          <div className="px-3 py-2 text-xs text-white/60 flex items-center justify-between border-b border-white/10">
            <div className="flex items-center gap-2">
              <span>名称</span>
              <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                <Menu className="w-3 h-3" />
              </Button>
            </div>
          </div>

          {/* 股票列表 */}
          <div className="flex-1 overflow-y-auto">
            {filteredStocks.map((stock) => (
              <button
                key={stock.symbol}
                onClick={() => setSelectedStock(stock.symbol)}
                className={`w-full px-3 py-2.5 hover:bg-white/5 transition-colors border-b border-white/10 ${
                  selectedStock === stock.symbol ? 'bg-white/10' : ''
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-sm">{stock.symbol}</span>
                    <span 
                      className={`px-1.5 py-0.5 rounded text-xs font-medium ${
                        stock.changePercent >= 0 
                          ? 'bg-red-500/20 text-red-400' 
                          : 'bg-green-500/20 text-green-400'
                      }`}
                    >
                      {stock.changePercent >= 0 ? '+' : ''}{stock.changePercent.toFixed(2)}%
                    </span>
                  </div>
                </div>
                <div className="text-xs text-white/60 truncate text-left mb-1">
                  {stock.name}
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-white font-medium">{stock.price.toFixed(2)}</span>
                  <span className={stock.change >= 0 ? 'text-red-400' : 'text-green-400'}>
                    {stock.change >= 0 ? '+' : ''}{stock.change.toFixed(2)}
                  </span>
                </div>
              </button>
            ))}
          </div>

          {/* 订阅历史按钮 */}
          <div className="p-3 border-t border-white/10">
            <Button variant="ghost" className="w-full justify-start text-sm h-9">
              <History className="w-4 h-4 mr-2" />
              订阅历史
            </Button>
          </div>
        </div>

        {/* 中间：图表和订单记录区域 */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* 上部：TradingView图表 */}
          <div className="flex-1 flex flex-col min-h-0">
            {/* TradingView图表 */}
            <div className="flex-1 bg-black min-h-0">
              <iframe
                src={`https://www.tradingview.com/widgetembed/?frameElementId=tradingview_stock&symbol=${selectedStock}&interval=D&hidesidetoolbar=0&symboledit=1&saveimage=0&toolbarbg=000000&studies=[]&theme=dark&style=1&timezone=America/New_York&studies_overrides={}&overrides={}&enabled_features=[]&disabled_features=[]&locale=zh_CN&utm_source=localhost&utm_medium=widget&utm_campaign=chart&utm_term=${selectedStock}`}
                className="w-full h-full border-0"
              />
            </div>
          </div>

          {/* 底部：订单记录区域 */}
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
                    <div>股票代码</div>
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
                    <div>股票代码</div>
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
        <div className="hidden lg:flex w-80 border-l border-white/10 bg-black flex-col">
          <Card className="bg-black border-0 rounded-none h-full overflow-y-auto">
            <CardContent className="p-4">
              {/* 顶部标签 */}
              <div className="flex gap-2 mb-4">
                <Button
                  onClick={() => setTradingMode('trade')}
                  className={`flex-1 h-9 ${
                    tradingMode === 'trade'
                      ? 'text-black hover:opacity-90'
                      : 'bg-transparent text-white/60 hover:bg-white/5'
                  }`}
                  style={tradingMode === 'trade' ? { backgroundColor: '#A3F030' } : {}}
                >
                  交易
                </Button>
                <Button
                  onClick={() => setTradingMode('margin')}
                  className={`flex-1 h-9 ${
                    tradingMode === 'margin'
                      ? 'text-black hover:opacity-90'
                      : 'bg-transparent text-white/60 hover:bg-white/5'
                  }`}
                  style={tradingMode === 'margin' ? { backgroundColor: '#A3F030' } : {}}
                >
                  融资融券
                </Button>
                <Button
                  onClick={() => setTradingMode('premarket')}
                  className={`flex-1 h-9 ${
                    tradingMode === 'premarket'
                      ? 'text-black hover:opacity-90'
                      : 'bg-transparent text-white/60 hover:bg-white/5'
                  }`}
                  style={tradingMode === 'premarket' ? { backgroundColor: '#A3F030' } : {}}
                >
                  盘前
                </Button>
              </div>

              {/* 交易模式 */}
              {tradingMode === 'trade' && (
                <div>
                  {/* 市价/限价切换 */}
                  <div className="flex gap-4 mb-4 border-b border-white/10 pb-3">
                    <button
                      onClick={() => setPriceType('market')}
                      className={`relative pb-2 ${
                        priceType === 'market' ? 'text-white' : 'text-white/60'
                      }`}
                    >
                      市价
                      {priceType === 'market' && (
                        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#A3F030]" />
                      )}
                    </button>
                    <button
                      onClick={() => setPriceType('limit')}
                      className={`relative pb-2 ${
                        priceType === 'limit' ? 'text-white' : 'text-white/60'
                      }`}
                    >
                      限价
                      {priceType === 'limit' && (
                        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#A3F030]" />
                      )}
                    </button>
                  </div>

                  {/* 价格输入（仅限价时显示） */}
                  {priceType === 'limit' && (
                    <div className="mb-4">
                      <label className="text-sm text-white mb-2 block">价格</label>
                      <Input
                        type="text"
                        placeholder="满足价格才能成交"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        className="bg-[#1a1a1a] border-white/10 h-11 text-sm text-white"
                      />
                    </div>
                  )}

                  {/* 数量输入 */}
                  <div className="mb-4">
                    <label className="text-sm text-white/70 mb-2 block">数量</label>
                    <div className="relative">
                      <Input
                        type="number"
                        placeholder="≤ 0"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        className="bg-[#1a1a1a] border-white/10 h-11 pr-12 text-sm text-white"
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[#A3F030] text-sm">
                        全部
                      </span>
                    </div>
                  </div>

                  {/* 百分比选择器 */}
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-3 h-3 rounded-full bg-[#A3F030]" />
                    {[0, 25, 50, 75, 100].map((percent) => (
                      <span key={percent} className="text-xs text-white/60">
                        {percent}%
                      </span>
                    ))}
                  </div>

                  {/* 买入按钮 */}
                  <Button
                    className="w-full h-12 bg-[#2a2a2a] hover:bg-[#2a2a2a] text-white/40 cursor-not-allowed"
                    disabled
                  >
                    休市中，暂停下单
                  </Button>
                </div>
              )}

              {/* 融资融券模式 */}
              {tradingMode === 'margin' && (
                <div>
                  {/* 市价/限价切换 */}
                  <div className="flex gap-4 mb-4 border-b border-white/10 pb-3">
                    <button
                      onClick={() => setPriceType('market')}
                      className={`relative pb-2 ${
                        priceType === 'market' ? 'text-white' : 'text-white/60'
                      }`}
                    >
                      市价
                      {priceType === 'market' && (
                        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#A3F030]" />
                      )}
                    </button>
                    <button
                      onClick={() => setPriceType('limit')}
                      className={`relative pb-2 ${
                        priceType === 'limit' ? 'text-white' : 'text-white/60'
                      }`}
                    >
                      限价
                      {priceType === 'limit' && (
                        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#A3F030]" />
                      )}
                    </button>
                  </div>

                  {/* 价格输入（仅限价时显示） */}
                  {priceType === 'limit' && (
                    <div className="mb-4">
                      <label className="text-sm text-white mb-2 block">价格</label>
                      <Input
                        type="text"
                        placeholder="满足价格才能成交"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        className="bg-[#1a1a1a] border-white/10 h-11 text-sm text-white"
                      />
                    </div>
                  )}

                  {/* 止盈止损复选框 */}
                  <div className="flex items-center justify-end gap-2 mb-4">
                    <Checkbox
                      checked={stopLossEnabled || takeProfitEnabled}
                      onCheckedChange={() => setStopLossDialog(true)}
                      className="border-white/30"
                    />
                    <span className="text-sm text-white">止盈止损</span>
                  </div>

                  {/* 保证金模式和杠杆 */}
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <div>
                      <label className="text-sm text-white mb-2 block">保证金模式</label>
                      <button className="w-full bg-[#1a1a1a] border border-white/10 rounded-lg h-11 px-3 flex items-center justify-between text-white hover:bg-white/5">
                        <span className="text-sm">全仓</span>
                        <ChevronRight className="w-4 h-4 text-white/60" />
                      </button>
                    </div>
                    <div>
                      <label className="text-sm text-white mb-2 block">杠杆</label>
                      <button className="w-full bg-[#1a1a1a] border border-white/10 rounded-lg h-11 px-3 flex items-center justify-between text-white hover:bg-white/5">
                        <span className="text-sm">20X</span>
                        <ChevronRight className="w-4 h-4 text-white/60" />
                      </button>
                    </div>
                  </div>

                  {/* 数量输入 */}
                  <div className="mb-4">
                    <label className="text-sm text-white mb-2 block">数量</label>
                    <div className="relative">
                      <Input
                        type="number"
                        placeholder="≤ 0"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        className="bg-[#1a1a1a] border-white/10 h-11 pr-12 text-sm text-white"
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[#A3F030] text-sm cursor-pointer">
                        全部
                      </span>
                    </div>
                  </div>

                  {/* 百分比选择器 */}
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-3 h-3 rounded-full bg-[#A3F030]" />
                    {[0, 25, 50, 75, 100].map((percent) => (
                      <span key={percent} className="text-xs text-white/60">
                        {percent}%
                      </span>
                    ))}
                  </div>

                  {/* 融资/融券按钮 */}
                  <Button
                    className="w-full h-12 bg-[#2a2a2a] hover:bg-[#2a2a2a] text-white/40 cursor-not-allowed"
                    disabled
                  >
                    休市中，暂停下单
                  </Button>
                </div>
              )}

              {/* 盘前模式 */}
              {tradingMode === 'premarket' && (
                <div>
                  {/* 价格输入 */}
                  <div className="mb-4">
                    <label className="text-sm text-white mb-2 block">价格</label>
                    <Input
                      type="text"
                      placeholder="满足价格才能成交"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      className="bg-[#1a1a1a] border-white/10 h-11 text-sm text-white"
                    />
                  </div>

                  {/* 保证金模式和杠杆 */}
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <div>
                      <label className="text-sm text-white mb-2 block">保证金模式</label>
                      <button className="w-full bg-[#1a1a1a] border border-white/10 rounded-lg h-11 px-3 flex items-center justify-between text-white hover:bg-white/5">
                        <span className="text-sm">全仓</span>
                        <ChevronRight className="w-4 h-4 text-white/60" />
                      </button>
                    </div>
                    <div>
                      <label className="text-sm text-white mb-2 block">杠杆</label>
                      <button className="w-full bg-[#1a1a1a] border border-white/10 rounded-lg h-11 px-3 flex items-center justify-between text-white hover:bg-white/5">
                        <span className="text-sm">20X</span>
                        <ChevronRight className="w-4 h-4 text-white/60" />
                      </button>
                    </div>
                  </div>

                  {/* 数量输入 */}
                  <div className="mb-4">
                    <label className="text-sm text-white mb-2 block">数量</label>
                    <div className="relative">
                      <Input
                        type="number"
                        placeholder="≤ 0"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        className="bg-[#1a1a1a] border-white/10 h-11 pr-12 text-sm text-white"
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[#A3F030] text-sm cursor-pointer">
                        全部
                      </span>
                    </div>
                  </div>

                  {/* 百分比选择器 */}
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-3 h-3 rounded-full bg-[#A3F030]" />
                    {[0, 25, 50, 75, 100].map((percent) => (
                      <span key={percent} className="text-xs text-white/60">
                        {percent}%
                      </span>
                    ))}
                  </div>

                  {/* 融资按钮 */}
                  <Button
                    className="w-full h-12 text-black hover:opacity-90"
                    style={{ backgroundColor: '#A3F030' }}
                  >
                    融资
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* 止盈止损弹窗 */}
        <Dialog open={stopLossDialog} onOpenChange={setStopLossDialog}>
          <DialogContent className="bg-[#1a1a1a] border-white/10 text-white max-w-sm">
            <DialogHeader>
              <DialogTitle className="text-white">止盈止损</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="flex items-center gap-3">
                <Checkbox
                  checked={takeProfitEnabled}
                  onCheckedChange={(checked) => setTakeProfitEnabled(!!checked)}
                />
                <label className="text-sm text-gray-300">止盈</label>
              </div>
              <div className="flex items-center gap-3">
                <Checkbox
                  checked={stopLossEnabled}
                  onCheckedChange={(checked) => setStopLossEnabled(!!checked)}
                />
                <label className="text-sm text-gray-300">止损</label>
              </div>
            </div>
            <Button
              onClick={() => setStopLossDialog(false)}
              className="w-full h-11 text-black hover:opacity-90"
              style={{ backgroundColor: '#A3F030' }}
            >
              确认
            </Button>
          </DialogContent>
        </Dialog>
        </div>
      </div>

      {/* 移动端底部导航 */}
      <MobileBottomNav />
    </div>
  )
}
