import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { Navbar } from './Navbar'
import { MobileBottomNav } from './MobileBottomNav'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerDescription, DrawerClose } from './ui/drawer'
import { Search, TrendingUp, TrendingDown, Star, ChevronDown, X } from 'lucide-react'
import React from 'react'

// TradingView类型声明
declare global {
  interface Window {
    TradingView: any
  }
}

interface CryptoData {
  symbol: string
  name: string
  description: string
  icon: string
  price: number
  change24h: number
  volume24h: number
  high24h: number
}

// 主标签
const MAIN_TABS = ['自选', '买币', '行情', '图表']

// 行情二级标签
const MARKET_TABS = ['股票', '币币', '加密货币', '秒合约', '期权', '外汇', '大宗商品']

// 图标映射
const ICON_MAP: { [key: string]: string } = {
  // 加密货币
  'BTCUSDT': 'https://assets.coingecko.com/coins/images/1/small/bitcoin.png',
  'ETHUSDT': 'https://assets.coingecko.com/coins/images/279/small/ethereum.png',
  'BNBUSDT': 'https://assets.coingecko.com/coins/images/825/small/bnb-icon2_2x.png',
  'SOLUSDT': 'https://assets.coingecko.com/coins/images/4128/small/solana.png',
  'XRPUSDT': 'https://assets.coingecko.com/coins/images/44/small/xrp-symbol-white-128.png',
  'ADAUSDT': 'https://assets.coingecko.com/coins/images/975/small/cardano.png',
  'DOGEUSDT': 'https://assets.coingecko.com/coins/images/5/small/dogecoin.png',
  'AVAXUSDT': 'https://assets.coingecko.com/coins/images/12559/small/coin-round-red.png',
  'DOTUSDT': 'https://assets.coingecko.com/coins/images/12171/small/polkadot.png',
  'MATICUSDT': 'https://assets.coingecko.com/coins/images/4713/small/matic-token-icon.png',
  'LINKUSDT': 'https://assets.coingecko.com/coins/images/877/small/chainlink-new-logo.png',
  'ATOMUSDT': 'https://assets.coingecko.com/coins/images/1481/small/cosmos_hub.png',
  'UNIUSDT': 'https://assets.coingecko.com/coins/images/12504/small/uniswap-uni.png',
  'LTCUSDT': 'https://assets.coingecko.com/coins/images/2/small/litecoin.png',
  'TRXUSDT': 'https://assets.coingecko.com/coins/images/1094/small/tron-logo.png',
  
  // 股票
  'AAPL': 'https://api.dicebear.com/7.x/shapes/svg?seed=AAPL&backgroundColor=000000',
  'GOOGL': 'https://api.dicebear.com/7.x/shapes/svg?seed=GOOGL&backgroundColor=4285F4',
  'MSFT': 'https://api.dicebear.com/7.x/shapes/svg?seed=MSFT&backgroundColor=00A4EF',
  'AMZN': 'https://api.dicebear.com/7.x/shapes/svg?seed=AMZN&backgroundColor=FF9900',
  'TSLA': 'https://api.dicebear.com/7.x/shapes/svg?seed=TSLA&backgroundColor=CC0000',
  'NVDA': 'https://api.dicebear.com/7.x/shapes/svg?seed=NVDA&backgroundColor=76B900',
  'META': 'https://api.dicebear.com/7.x/shapes/svg?seed=META&backgroundColor=0668E1',
  'NFLX': 'https://api.dicebear.com/7.x/shapes/svg?seed=NFLX&backgroundColor=E50914',
  'AMD': 'https://api.dicebear.com/7.x/shapes/svg?seed=AMD&backgroundColor=ED1C24',
  'BABA': 'https://api.dicebear.com/7.x/shapes/svg?seed=BABA&backgroundColor=FF6A00',
  
  // 外汇
  'EURUSD': 'https://www.bosss.club/static/img/crypto/EURUSD.svg?v=3.6.0',
  'GBPUSD': 'https://www.bosss.club/static/img/crypto/GBPUSD.svg?v=3.6.0',
  'USDJPY': 'https://www.bosss.club/static/img/crypto/USDJPY.svg?v=3.6.0',
  'AUDUSD': 'https://www.bosss.club/static/img/crypto/AUDUSD.svg?v=3.6.0',
  'USDCAD': 'https://www.bosss.club/static/img/crypto/USDCAD.svg?v=3.6.0',
}

export function MarketsPage() {
  const navigate = useNavigate()
  const [mainTab, setMainTab] = useState('行情')
  const [marketTab, setMarketTab] = useState('加密货币')
  const [loading, setLoading] = useState(true)
  const [cryptoData, setCryptoData] = useState<CryptoData[]>([])
  const [stockData, setStockData] = useState<CryptoData[]>([])
  const [forexData, setForexData] = useState<CryptoData[]>([])
  const [commodityData, setCommodityData] = useState<CryptoData[]>([])
  const [favorites, setFavorites] = useState<Set<string>>(new Set())
  const [searchTerm, setSearchTerm] = useState('')
  const [tradeType, setTradeType] = useState<'buy' | 'sell'>('buy')
  const [selectedPair, setSelectedPair] = useState('BTC/USDT')
  const [selectedCrypto, setSelectedCrypto] = useState<CryptoData | null>(null)
  const [amount, setAmount] = useState('')
  const [showSearch, setShowSearch] = useState(false)
  const [showSymbolPicker, setShowSymbolPicker] = useState(false)
  const chartRef = useRef<HTMLDivElement>(null)

  // 获取加密货币数据
  useEffect(() => {
    const fetchCryptoData = async () => {
      try {
        setLoading(true)
        const symbols = ['BTCUSDT', 'ETHUSDT', 'BNBUSDT', 'SOLUSDT', 'XRPUSDT', 
                        'ADAUSDT', 'DOGEUSDT', 'AVAXUSDT', 'DOTUSDT', 'MATICUSDT',
                        'LINKUSDT', 'ATOMUSDT', 'UNIUSDT', 'LTCUSDT', 'TRXUSDT']
        
        const tickerPromises = symbols.map(symbol =>
          fetch(`https://api.binance.com/api/v3/ticker/24hr?symbol=${symbol}`)
            .then(res => res.json())
        )
        
        const tickerData = await Promise.all(tickerPromises)
        
        const formatted = tickerData.map((ticker) => ({
          symbol: ticker.symbol,
          name: ticker.symbol.replace('USDT', ''),
          description: ticker.symbol.replace('USDT', '') + '/USDT',
          icon: ICON_MAP[ticker.symbol] || '',
          price: parseFloat(ticker.lastPrice),
          change24h: parseFloat(ticker.priceChangePercent),
          volume24h: parseFloat(ticker.volume),
          high24h: parseFloat(ticker.highPrice),
        }))
        
        setCryptoData(formatted)
      } catch (error) {
        console.error('获取加密货币数据失败:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchCryptoData()
    const interval = setInterval(fetchCryptoData, 10000)
    return () => clearInterval(interval)
  }, [])

  // 获取股票数据（模拟）
  useEffect(() => {
    const mockStocks: CryptoData[] = [
      { symbol: 'AAPL', name: '苹果', description: 'Apple Inc.', icon: ICON_MAP['AAPL'], price: 178.25, change24h: 2.34, volume24h: 45000000, high24h: 180.50 },
      { symbol: 'GOOGL', name: '谷歌', description: 'Alphabet Inc.', icon: ICON_MAP['GOOGL'], price: 142.80, change24h: -1.23, volume24h: 28000000, high24h: 145.20 },
      { symbol: 'MSFT', name: '微软', description: 'Microsoft Corp.', icon: ICON_MAP['MSFT'], price: 405.63, change24h: 1.87, volume24h: 32000000, high24h: 410.00 },
      { symbol: 'AMZN', name: '亚马逊', description: 'Amazon.com Inc.', icon: ICON_MAP['AMZN'], price: 168.92, change24h: 3.45, volume24h: 55000000, high24h: 172.30 },
      { symbol: 'TSLA', name: '特斯拉', description: 'Tesla Inc.', icon: ICON_MAP['TSLA'], price: 234.56, change24h: -2.67, volume24h: 88000000, high24h: 242.10 },
      { symbol: 'NVDA', name: '英伟达', description: 'NVIDIA Corp.', icon: ICON_MAP['NVDA'], price: 895.42, change24h: 5.23, volume24h: 42000000, high24h: 910.50 },
      { symbol: 'META', name: 'Meta', description: 'Meta Platforms Inc.', icon: ICON_MAP['META'], price: 485.20, change24h: 1.92, volume24h: 28000000, high24h: 490.80 },
      { symbol: 'NFLX', name: '奈飞', description: 'Netflix Inc.', icon: ICON_MAP['NFLX'], price: 612.34, change24h: -0.87, volume24h: 15000000, high24h: 618.90 },
    ]
    setStockData(mockStocks)
  }, [])

  // 获取外汇数据（模拟）
  useEffect(() => {
    const mockForex: CryptoData[] = [
      { symbol: 'EURUSD', name: '欧元/美元', description: 'EUR/USD', icon: ICON_MAP['EURUSD'], price: 1.0923, change24h: 0.12, volume24h: 1200000, high24h: 1.0945 },
      { symbol: 'GBPUSD', name: '英镑/美元', description: 'GBP/USD', icon: ICON_MAP['GBPUSD'], price: 1.2678, change24h: -0.23, volume24h: 980000, high24h: 1.2701 },
      { symbol: 'USDJPY', name: '美元/日元', description: 'USD/JPY', icon: ICON_MAP['USDJPY'], price: 149.82, change24h: 0.34, volume24h: 1100000, high24h: 150.12 },
      { symbol: 'AUDUSD', name: '澳元/美元', description: 'AUD/USD', icon: ICON_MAP['AUDUSD'], price: 0.6534, change24h: -0.45, volume24h: 750000, high24h: 0.6568 },
      { symbol: 'USDCAD', name: '美元/加元', description: 'USD/CAD', icon: ICON_MAP['USDCAD'], price: 1.3612, change24h: 0.18, volume24h: 680000, high24h: 1.3634 },
    ]
    setForexData(mockForex)
  }, [])

  // 获取大宗商品数据（模拟）
  useEffect(() => {
    const mockCommodities: CryptoData[] = [
      { symbol: 'XAUUSD', name: 'XAU/USD', description: 'XAU/USD', icon: 'https://www.bosss.club/static/img/crypto/XAUUSD.svg?v=3.6.0', price: 3995.689, change24h: 0.16, volume24h: 1500000, high24h: 4010.00 },
      { symbol: 'XAGUSD', name: 'XAG/USD', description: 'XAG/USD', icon: 'https://www.bosss.club/static/img/crypto/XAGUSD.svg?v=3.6.0', price: 48.158, change24h: 0.52, volume24h: 1200000, high24h: 48.50 },
      { symbol: 'USOIL', name: 'USOIL', description: 'USOIL', icon: 'https://www.bosss.club/static/img/crypto/USOIL.svg?v=3.6.0', price: 59.8, change24h: 0.33, volume24h: 1000000, high24h: 60.50 },
      { symbol: 'NGAS', name: 'NGAS', description: 'NGAS', icon: 'https://www.bosss.club/static/img/crypto/NGAS.svg?v=3.6.0', price: 4.267, change24h: 0.92, volume24h: 800000, high24h: 4.30 },
      { symbol: 'XPTUSD', name: 'XPTUSD', description: 'XPTUSD', icon: 'https://www.bosss.club/static/img/crypto/XPTUSD.svg?v=3.6.0', price: 1547.68, change24h: -0.17, volume24h: 650000, high24h: 1560.00 },
      { symbol: 'XPDUSD', name: 'XPDUSD', description: 'XPDUSD', icon: 'https://www.bosss.club/static/img/crypto/XPDUSD.svg?v=3.6.0', price: 1436.49, change24h: 0.21, volume24h: 580000, high24h: 1445.00 },
    ]
    setCommodityData(mockCommodities)
  }, [])

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

  const getCurrentData = () => {
    let data: CryptoData[] = []
    
    if (mainTab === '自选') {
      const allData = [...cryptoData, ...stockData, ...forexData, ...commodityData]
      return allData.filter(item => favorites.has(item.symbol))
    }
    
    if (mainTab !== '行情') return []
    
    switch (marketTab) {
      case '加密货币':
      case '币币':
        data = cryptoData
        break
      case '股票':
        data = stockData
        break
      case '外汇':
        data = forexData
        break
      case '秒合约':
      case '期权':
      case '大宗商品':
        data = commodityData
        break
      default:
        data = cryptoData
    }
    
    if (searchTerm) {
      data = data.filter(item => 
        item.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }
    
    return data
  }

  const handleRowClick = (symbol: string) => {
    // 找到被点击的交易对数据
    const allData = [...cryptoData, ...stockData, ...forexData, ...commodityData]
    const selectedData = allData.find(item => item.symbol === symbol)
    
    if (selectedData) {
      setSelectedCrypto(selectedData)
      setMainTab('图表')
    }
  }

  // 渲染买币页面
  const renderBuyPage = () => (
    <div className="max-w-md mx-auto px-4 py-6">
      {/* 买入/卖出切换 */}
      <div className="bg-white/5 rounded-lg p-1 mb-6 flex gap-1">
        <button
          onClick={() => setTradeType('buy')}
          className={`flex-1 py-3 rounded-md transition-all ${
            tradeType === 'buy'
              ? 'bg-[#A3F030] text-black font-medium'
              : 'text-white/60'
          }`}
        >
          买入
        </button>
        <button
          onClick={() => setTradeType('sell')}
          className={`flex-1 py-3 rounded-md transition-all ${
            tradeType === 'sell'
              ? 'bg-red-500 text-white font-medium'
              : 'text-white/60'
          }`}
        >
          卖出
        </button>
      </div>

      {/* 交易对选择 */}
      <div className="mb-6">
        <label className="text-white/60 text-sm mb-2 block">交易对</label>
        <div className="bg-white/5 border border-white/10 rounded-lg p-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img 
              src={ICON_MAP['BTCUSDT']} 
              alt="BTC"
              className="w-8 h-8 rounded-full"
            />
            <div>
              <div className="text-white font-medium">{selectedPair}</div>
              <div className="text-white/40 text-xs">比特币</div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-white font-medium">$96,234.50</div>
            <div className="text-[#A3F030] text-xs">+2.34%</div>
          </div>
        </div>
      </div>

      {/* 金额输入 */}
      <div className="mb-6">
        <label className="text-white/60 text-sm mb-2 block">
          {tradeType === 'buy' ? '买入金额' : '卖出金额'}
        </label>
        <div className="relative">
          <Input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="请输入金额"
            className="bg-white/5 border-white/10 text-white placeholder:text-white/40 h-12 pr-20"
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-white/60">
            USDT
          </div>
        </div>
        
        {/* 快捷金额 */}
        <div className="grid grid-cols-4 gap-2 mt-3">
          {['100', '500', '1000', '5000'].map(value => (
            <button
              key={value}
              onClick={() => setAmount(value)}
              className="py-2 bg-white/5 hover:bg-white/10 rounded-md text-white/60 text-sm transition-colors"
            >
              {value}
            </button>
          ))}
        </div>
      </div>

      {/* 预计获得 */}
      <div className="bg-white/5 border border-white/10 rounded-lg p-4 mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-white/60 text-sm">预计获得</span>
          <span className="text-white font-medium">
            {amount ? (parseFloat(amount) / 96234.50).toFixed(8) : '0.00000000'} BTC
          </span>
        </div>
        <div className="flex justify-between items-center text-sm">
          <span className="text-white/40">手续费 (0.1%)</span>
          <span className="text-white/40">
            {amount ? (parseFloat(amount) * 0.001).toFixed(2) : '0.00'} USDT
          </span>
        </div>
      </div>

      {/* 交易按钮 */}
      <Button
        className={`w-full h-12 ${
          tradeType === 'buy'
            ? 'bg-[#A3F030] hover:bg-[#92D929] text-black'
            : 'bg-red-500 hover:bg-red-600 text-white'
        }`}
        disabled={!amount || parseFloat(amount) <= 0}
      >
        {tradeType === 'buy' ? '买入' : '卖出'} BTC
      </Button>

      {/* 账户余额 */}
      <div className="mt-6 p-4 bg-white/5 rounded-lg">
        <div className="text-white/60 text-sm mb-2">可用余额</div>
        <div className="text-white text-xl font-medium">10,000.00 USDT</div>
      </div>
    </div>
  )

  // TradingView图表集成
  useEffect(() => {
    if (!(mainTab === '图表' && chartRef.current && selectedCrypto)) return

    const containerId = `tv_chart_${selectedCrypto.symbol}`
    const container = chartRef.current
    container.id = containerId
    container.innerHTML = '<div class="flex items-center justify-center h-full text-white/40">TradingView 图表加载中...</div>'

    const resolveSymbol = () => {
      if (selectedCrypto.symbol.includes('USDT')) return `BINANCE:${selectedCrypto.symbol}`
      if (['AAPL', 'GOOGL', 'MSFT', 'AMZN', 'TSLA', 'NVDA', 'META', 'NFLX', 'AMD', 'BABA'].includes(selectedCrypto.symbol)) {
        const exchange = selectedCrypto.symbol === 'BABA' ? 'NYSE' : 'NASDAQ'
        return `${exchange}:${selectedCrypto.symbol}`
      }
      if (selectedCrypto.symbol.includes('USD') || selectedCrypto.symbol.includes('JPY')) return `FX:${selectedCrypto.symbol}`
      return 'BINANCE:BTCUSDT'
    }

    const tvSymbol = resolveSymbol()

    const createWidget = () => {
      if (!window.TradingView) return false
      try {
        container.innerHTML = ''
        new window.TradingView.widget({
          width: '100%',
          height: '100%',
          symbol: tvSymbol,
          interval: 'D',
          timezone: 'Asia/Shanghai',
          theme: 'dark',
          style: '1',
          locale: 'zh_CN',
          toolbar_bg: '#000000',
          enable_publishing: false,
          hide_side_toolbar: false,
          allow_symbol_change: true,
          container_id: containerId,
          backgroundColor: '#000000',
          gridColor: 'rgba(255, 255, 255, 0.05)',
          overrides: {
            "paneProperties.background": "#000000",
            "paneProperties.backgroundType": "solid",
          },
        })
        return true
      } catch (error) {
        console.error('图表初始化错误:', error)
        container.innerHTML = '<div class="flex items-center justify-center h-full text-red-500">图表加载失败</div>'
        return true
      }
    }

    if (createWidget()) return

    const scriptId = 'tradingview-widget-script'
    let pollingTimer: ReturnType<typeof setInterval> | null = null

    const appendScript = () => {
      if (document.getElementById(scriptId)) return
      const script = document.createElement('script')
      script.id = scriptId
      script.src = 'https://s3.tradingview.com/tv.js'
      script.async = true
      script.onload = () => createWidget()
      script.onerror = () => {
        container.innerHTML = '<div class="flex items-center justify-center h-full text-red-500">图表加载失败</div>'
      }
      document.body.appendChild(script)
    }

    if (document.getElementById(scriptId)) {
      pollingTimer = setInterval(() => {
        if (createWidget()) {
          if (pollingTimer) clearInterval(pollingTimer)
        }
      }, 300)
      setTimeout(() => {
        if (pollingTimer) {
          clearInterval(pollingTimer)
          if (!window.TradingView) {
            container.innerHTML = '<div class="flex items-center justify-center h-full text-red-500">图表加载超时</div>'
          }
        }
      }, 8000)
    } else {
      appendScript()
    }

    return () => {
      if (pollingTimer) clearInterval(pollingTimer)
    }
  }, [mainTab, selectedCrypto])

  // 渲染图表页面
  const renderChartPage = () => {
    // 使用选中的交易对数据，如果没有则使用默认的 BTC
    const displayData = selectedCrypto || cryptoData[0]
    
    if (!displayData) {
      return (
        <div className="flex items-center justify-center py-20">
          <div className="text-white/40">加载中...</div>
        </div>
      )
    }

    // 获取当前产品类别
    const getCurrentCategory = () => {
      if (cryptoData.some(item => item.symbol === displayData.symbol)) return '加密货币'
      if (stockData.some(item => item.symbol === displayData.symbol)) return '股票'
      if (forexData.some(item => item.symbol === displayData.symbol)) return '外汇'
      if (commodityData.some(item => item.symbol === displayData.symbol)) return '大宗商品'
      return '全部'
    }

    return (
      <div className="h-[calc(100vh-57px)] lg:h-[calc(100vh-106px)] flex flex-col">
        {/* 顶部交易对信息 */}
        <div className="flex-none px-4 py-3 border-b border-white/10">
          {/* 交易对名称 + 收藏按钮 */}
          <div className="flex items-center justify-between mb-3">
            <button
              onClick={() => setShowSymbolPicker(true)}
              className="flex items-center gap-2 hover:bg-white/5 rounded-lg px-2 py-1 transition-colors"
            >
              <div className="text-white font-medium text-lg">
                {displayData.description}
              </div>
              <ChevronDown className="w-4 h-4 text-white/60" />
            </button>
            
            <button
              onClick={() => toggleFavorite(displayData.symbol)}
              className="text-white/60 hover:text-yellow-400 transition-colors"
            >
              <Star 
                className={`w-6 h-6 ${favorites.has(displayData.symbol) ? 'fill-yellow-400 text-yellow-400' : ''}`}
              />
            </button>
          </div>

          {/* 价格和统计信息 */}
          <div className="flex items-start justify-between gap-8">
            {/* 左侧：价格和涨跌幅 */}
            <div>
              <div className={`text-2xl font-medium mb-1 ${
                displayData.change24h >= 0 ? 'text-[#A3F030]' : 'text-red-500'
              }`}>
                {displayData.price.toLocaleString(undefined, { 
                  minimumFractionDigits: 2,
                  maximumFractionDigits: displayData.price < 1 ? 6 : 2
                })}
              </div>
              <div className={`flex items-center gap-2 text-sm ${
                displayData.change24h >= 0 ? 'text-[#A3F030]' : 'text-red-500'
              }`}>
                <span>
                  {displayData.change24h >= 0 ? '+' : ''}{displayData.change24h.toFixed(2)}%
                </span>
                <span>
                  {displayData.change24h >= 0 ? '+' : ''}{(displayData.price * displayData.change24h / 100).toFixed(2)}
                </span>
              </div>
            </div>

            {/* 右侧：统计数据 */}
            <div className="grid grid-cols-2 gap-x-8 gap-y-1 text-sm">
              <div className="flex justify-between gap-4">
                <span className="text-white/40">最高</span>
                <span className="text-[#A3F030]">
                  {displayData.high24h.toLocaleString(undefined, { 
                    minimumFractionDigits: 2,
                    maximumFractionDigits: displayData.high24h < 1 ? 6 : 2
                  })}
                </span>
              </div>
              <div className="flex justify-between gap-4">
                <span className="text-white/40">成交量</span>
                <span className="text-white">
                  {(displayData.volume24h / 1000000).toFixed(2)}M
                </span>
              </div>
              <div className="flex justify-between gap-4">
                <span className="text-white/40">最低</span>
                <span className="text-[#A3F030]">
                  {((displayData.high24h * (1 - Math.abs(displayData.change24h) / 100))).toLocaleString(undefined, { 
                    minimumFractionDigits: 2,
                    maximumFractionDigits: displayData.price < 1 ? 6 : 2
                  })}
                </span>
              </div>
              <div className="flex justify-between gap-4">
                <span className="text-white/40">成交额</span>
                <span className="text-white">
                  {(displayData.volume24h * displayData.price / 1000000).toFixed(2)}M
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* TradingView图表 - 占据剩余空间 */}
        <div className="flex-1 relative">
          <div 
            ref={chartRef}
            id={`tv_chart_${displayData.symbol}`}
            className="absolute inset-0"
          >
            <div className="flex items-center justify-center h-full text-white/40">
              TradingView 图表加载中...
            </div>
          </div>
        </div>

        {/* 底部抽屉：产品选择器 */}
        <Drawer open={showSymbolPicker} onOpenChange={setShowSymbolPicker}>
          <DrawerContent className="bg-[#0A0A0A] border-white/10 max-h-[85vh]">
            <DrawerHeader className="border-b border-white/10 px-4 py-4">
              <div className="flex items-center justify-between">
                <DrawerTitle className="text-white text-lg">{getCurrentCategory()}</DrawerTitle>
                <button 
                  onClick={() => setShowSymbolPicker(false)}
                  className="p-2 -mr-2 hover:bg-white/5 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-white/60" />
                </button>
              </div>
              <DrawerDescription className="sr-only">
                选择产品进行交易
              </DrawerDescription>
            </DrawerHeader>

            {/* 搜索框 */}
            <div className="px-4 py-4 border-b border-white/10">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                <Input
                  placeholder="搜索股票代码或名称"
                  className="pl-10 bg-[#1A1A1A] border-white/10 text-white h-11 placeholder:text-white/40"
                />
              </div>
            </div>

            {/* 产品列表 */}
            <div className="overflow-y-auto flex-1">
              {/* 加密货币 */}
              {cryptoData.map((item) => (
                <button
                  key={item.symbol}
                  onClick={() => {
                    setSelectedCrypto(item)
                    setShowSymbolPicker(false)
                  }}
                  className={`w-full px-4 py-4 flex items-center justify-between border-b border-white/5 hover:bg-white/5 transition-colors ${
                    selectedCrypto?.symbol === item.symbol ? 'bg-white/5' : ''
                  }`}
                >
                  <div className="flex-1 text-left">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-white">{item.symbol.replace('USDT', '')}</span>
                      {selectedCrypto?.symbol === item.symbol && (
                        <div className="w-1.5 h-1.5 rounded-full bg-[#A3F030]"></div>
                      )}
                    </div>
                    <div className="text-sm text-white/50">{item.name}</div>
                  </div>
                  
                  <div className="text-right">
                    <div className="text-white mb-1">${item.price.toFixed(2)}</div>
                    <div className={`text-sm flex items-center justify-end gap-1 ${
                      item.change24h >= 0 ? 'text-[#A3F030]' : 'text-red-500'
                    }`}>
                      {item.change24h >= 0 ? (
                        <TrendingUp className="w-3.5 h-3.5" />
                      ) : (
                        <TrendingDown className="w-3.5 h-3.5" />
                      )}
                      <span>{item.change24h >= 0 ? '+' : ''}{item.change24h.toFixed(2)}%</span>
                    </div>
                  </div>
                </button>
              ))}

              {/* 股票 */}
              {stockData.map((item) => (
                <button
                  key={item.symbol}
                  onClick={() => {
                    setSelectedCrypto(item)
                    setShowSymbolPicker(false)
                  }}
                  className={`w-full px-4 py-4 flex items-center justify-between border-b border-white/5 hover:bg-white/5 transition-colors ${
                    selectedCrypto?.symbol === item.symbol ? 'bg-white/5' : ''
                  }`}
                >
                  <div className="flex-1 text-left">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-white">{item.symbol}</span>
                      {selectedCrypto?.symbol === item.symbol && (
                        <div className="w-1.5 h-1.5 rounded-full bg-[#A3F030]"></div>
                      )}
                    </div>
                    <div className="text-sm text-white/50">{item.name}</div>
                  </div>
                  
                  <div className="text-right">
                    <div className="text-white mb-1">${item.price.toFixed(2)}</div>
                    <div className={`text-sm flex items-center justify-end gap-1 ${
                      item.change24h >= 0 ? 'text-[#A3F030]' : 'text-red-500'
                    }`}>
                      {item.change24h >= 0 ? (
                        <TrendingUp className="w-3.5 h-3.5" />
                      ) : (
                        <TrendingDown className="w-3.5 h-3.5" />
                      )}
                      <span>{item.change24h >= 0 ? '+' : ''}{item.change24h.toFixed(2)}%</span>
                    </div>
                  </div>
                </button>
              ))}

              {/* 外汇 */}
              {forexData.map((item) => (
                <button
                  key={item.symbol}
                  onClick={() => {
                    setSelectedCrypto(item)
                    setShowSymbolPicker(false)
                  }}
                  className={`w-full px-4 py-4 flex items-center justify-between border-b border-white/5 hover:bg-white/5 transition-colors ${
                    selectedCrypto?.symbol === item.symbol ? 'bg-white/5' : ''
                  }`}
                >
                  <div className="flex-1 text-left">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-white">{item.symbol}</span>
                      {selectedCrypto?.symbol === item.symbol && (
                        <div className="w-1.5 h-1.5 rounded-full bg-[#A3F030]"></div>
                      )}
                    </div>
                    <div className="text-sm text-white/50">{item.name}</div>
                  </div>
                  
                  <div className="text-right">
                    <div className="text-white mb-1">${item.price.toFixed(4)}</div>
                    <div className={`text-sm flex items-center justify-end gap-1 ${
                      item.change24h >= 0 ? 'text-[#A3F030]' : 'text-red-500'
                    }`}>
                      {item.change24h >= 0 ? (
                        <TrendingUp className="w-3.5 h-3.5" />
                      ) : (
                        <TrendingDown className="w-3.5 h-3.5" />
                      )}
                      <span>{item.change24h >= 0 ? '+' : ''}{item.change24h.toFixed(2)}%</span>
                    </div>
                  </div>
                </button>
              ))}

              {/* 大宗商品 */}
              {commodityData.map((item) => (
                <button
                  key={item.symbol}
                  onClick={() => {
                    setSelectedCrypto(item)
                    setShowSymbolPicker(false)
                  }}
                  className={`w-full px-4 py-4 flex items-center justify-between border-b border-white/5 hover:bg-white/5 transition-colors ${
                    selectedCrypto?.symbol === item.symbol ? 'bg-white/5' : ''
                  }`}
                >
                  <div className="flex-1 text-left">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-white">{item.symbol}</span>
                      {selectedCrypto?.symbol === item.symbol && (
                        <div className="w-1.5 h-1.5 rounded-full bg-[#A3F030]"></div>
                      )}
                    </div>
                    <div className="text-sm text-white/50">{item.name}</div>
                  </div>
                  
                  <div className="text-right">
                    <div className="text-white mb-1">${item.price.toFixed(2)}</div>
                    <div className={`text-sm flex items-center justify-end gap-1 ${
                      item.change24h >= 0 ? 'text-[#A3F030]' : 'text-red-500'
                    }`}>
                      {item.change24h >= 0 ? (
                        <TrendingUp className="w-3.5 h-3.5" />
                      ) : (
                        <TrendingDown className="w-3.5 h-3.5" />
                      )}
                      <span>{item.change24h >= 0 ? '+' : ''}{item.change24h.toFixed(2)}%</span>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </DrawerContent>
        </Drawer>
      </div>
    )
  }

  // 渲染行情列表
  const renderMarketList = () => {
    const data = getCurrentData()
    
    if (loading && mainTab === '行情' && marketTab === '加密货币') {
      return (
        <div className="flex items-center justify-center py-20">
          <div className="text-white/40">加载中...</div>
        </div>
      )
    }

    if (data.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center py-20">
          <div className="text-white/40 mb-2">
            {mainTab === '自选' ? '暂无自选' : '暂无数据'}
          </div>
          {mainTab === '自选' && (
            <div className="text-white/20 text-sm">点击星标添加自选</div>
          )}
        </div>
      )
    }

    // 判断是否需要显示logo（股票、期权、大宗不显示）
    const shouldShowLogo = !['股票', '期权', '大宗商品'].includes(marketTab)

    return (
      <div className="px-4 py-2">
        {data.map((item) => (
          <div
            key={item.symbol}
            onClick={() => handleRowClick(item.symbol)}
            className="flex items-center justify-between py-4 border-b border-white/5 hover:bg-white/5 cursor-pointer transition-all group"
          >
            {/* 左侧：Logo + 名称 */}
            <div className="flex items-center gap-3 flex-1 min-w-0">
              {shouldShowLogo && (
                <img 
                  src={item.icon} 
                  alt={item.name}
                  className="w-10 h-10 rounded-full flex-shrink-0"
                  onError={(e) => {
                    e.currentTarget.src = 'https://api.dicebear.com/7.x/shapes/svg?seed=' + item.symbol
                  }}
                />
              )}
              <div className="min-w-0">
                <div className="text-white font-medium truncate">{item.name}</div>
                <div className="text-white/40 text-sm truncate">{item.description}</div>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  toggleFavorite(item.symbol)
                }}
                className="ml-2 text-white/40 hover:text-yellow-400 transition-colors opacity-0 group-hover:opacity-100 flex-shrink-0"
              >
                <Star 
                  className={`w-4 h-4 ${favorites.has(item.symbol) ? 'fill-yellow-400 text-yellow-400 opacity-100' : ''}`}
                />
              </button>
            </div>

            {/* 中间：价格 */}
            <div className={`text-right mx-4 flex-shrink-0 ${
              item.change24h >= 0 ? 'text-[#A3F030]' : 'text-red-500'
            }`}>
              <div className="font-medium text-lg">
                ${item.price.toLocaleString(undefined, { 
                  minimumFractionDigits: 2,
                  maximumFractionDigits: item.price < 1 ? 6 : 2
                })}
              </div>
            </div>

            {/* 右侧：涨跌幅和变化值 */}
            <div className="flex flex-col items-end gap-1 flex-shrink-0">
              <div className={`text-sm font-medium ${
                item.change24h >= 0 ? 'text-[#A3F030]' : 'text-red-500'
              }`}>
                {item.change24h >= 0 ? '+' : ''}{(item.price * item.change24h / 100).toFixed(2)}
              </div>
              <div 
                className={`px-3 py-1 rounded-full text-sm font-medium ${
                  item.change24h >= 0 
                    ? 'bg-[#A3F030] text-black' 
                    : 'bg-red-500 text-white'
                }`}
              >
                {item.change24h >= 0 ? '+' : ''}{item.change24h.toFixed(0)}%
              </div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black">
      <Navbar />
      
      <div className="pb-20 lg:pb-0">
        {/* 页头：主标签 + 搜索图标 */}
        <div className="sticky top-0 lg:top-14 z-40 bg-black border-b border-white/10">
          <div className="max-w-[1400px] mx-auto px-4">
            <div className="flex items-center justify-between">
              {/* 主标签导航 */}
              <div className="flex gap-6 lg:gap-8">
                {MAIN_TABS.map((tab) => (
                  <button
                    key={tab}
                    onClick={() => {
                      setMainTab(tab)
                      setShowSearch(false) // 切换标签时关闭搜索
                    }}
                    className={`py-4 relative transition-colors whitespace-nowrap ${
                      mainTab === tab
                        ? 'text-white'
                        : 'text-white/60 hover:text-white/80'
                    }`}
                  >
                    {tab}
                    {mainTab === tab && (
                      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#A3F030]" />
                    )}
                  </button>
                ))}
              </div>

              {/* 右上角搜索图标 */}
              <div className="relative">
                <button
                  onClick={() => setShowSearch(!showSearch)}
                  className="w-9 h-9 flex items-center justify-center text-white/70 hover:text-white transition-colors"
                >
                  <Search className="w-5 h-5" />
                </button>
                
                {/* 搜索框下拉 */}
                {showSearch && (
                  <div className="absolute top-full right-0 mt-2 w-64 bg-[#1a1a1a] border border-white/10 rounded-lg shadow-xl p-2 z-50">
                    <Input
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder="搜索交易对..."
                      className="bg-white/5 border-white/10 text-white placeholder:text-white/40 h-9"
                      autoFocus
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* 二级标签（仅行情页显示） */}
        {mainTab === '行情' && (
          <div className="sticky top-[57px] lg:top-[106px] z-30 bg-black border-b border-white/10">
            <div className="max-w-[1400px] mx-auto px-4">
              <div className="flex gap-3 overflow-x-auto scrollbar-hide py-3">
                {MARKET_TABS.map((tab) => (
                  <button
                    key={tab}
                    onClick={(e) => {
                      setMarketTab(tab)
                      // 自动滚动到被点击的标签，并显示其右侧内容
                      e.currentTarget.scrollIntoView({
                        behavior: 'smooth',
                        block: 'nearest',
                        inline: 'center'
                      })
                    }}
                    className={`whitespace-nowrap px-3 lg:px-4 py-1.5 lg:py-2 rounded-full transition-all text-sm ${
                      marketTab === tab
                        ? 'bg-[#A3F030] text-black font-medium'
                        : 'bg-white/5 text-white/60 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 内容区域 */}
        <div className="max-w-[1400px] mx-auto">
          {mainTab === '买币' && renderBuyPage()}
          {mainTab === '图表' && renderChartPage()}
          {(mainTab === '行情' || mainTab === '自选') && renderMarketList()}
        </div>
      </div>

      <MobileBottomNav />
    </div>
  )
}