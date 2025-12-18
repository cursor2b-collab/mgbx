import { useState, useEffect, useRef, useMemo } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { ChevronLeft, Share2, Star, Eye, MoreVertical, ChevronDown, Search, X } from 'lucide-react'
import { ImageWithFallback } from './figma/ImageWithFallback'
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerDescription } from './ui/drawer'
import * as echarts from 'echarts'

interface TickerData {
  symbol: string
  lastPrice: string
  priceChangePercent: string
  markPrice: string
  high24h: string
  low24h: string
  volume24h: string
  quoteVolume24h: string
}

interface OrderBookItem {
  price: string
  amount: string
  total?: string
}

interface TradeItem {
  time: string
  side: 'buy' | 'sell'
  price: string
  amount: string
}

const SYMBOL_ICON_MAP: Record<string, string> = {
  BTC: 'https://assets.coingecko.com/coins/images/1/small/bitcoin.png',
  ETH: 'https://assets.coingecko.com/coins/images/279/small/ethereum.png',
  SOL: 'https://assets.coingecko.com/coins/images/4128/small/solana.png',
  BNB: 'https://assets.coingecko.com/coins/images/825/small/bnb-icon2_2x.png',
  XRP: 'https://assets.coingecko.com/coins/images/44/small/xrp-symbol-white-128.png',
  ADA: 'https://assets.coingecko.com/coins/images/975/small/cardano.png',
  DOGE: 'https://assets.coingecko.com/coins/images/5/small/dogecoin.png',
  TRX: 'https://assets.coingecko.com/coins/images/1094/small/tron-logo.png',
  DOT: 'https://assets.coingecko.com/coins/images/12171/small/polkadot.png',
  MATIC: 'https://assets.coingecko.com/coins/images/4713/small/polygon.png',
  AVAX: 'https://assets.coingecko.com/coins/images/12559/small/coin-round-red.png',
  LINK: 'https://assets.coingecko.com/coins/images/877/small/chainlink-new-logo.png',
}

function getIconForSymbol(symbol: string) {
  const name = symbol.replace('USDT', '').toUpperCase()
  return SYMBOL_ICON_MAP[name] || 'https://www.svgrepo.com/show/428655/crypto-coin.svg'
}

// 币种信息数据
interface CoinInfo {
  name: string
  fullName: string
  launchDate: string
  totalSupply: string
  circulatingSupply: string
  icoPrice: string
  whitepaper: string
  website: string
  description: string
}

const COIN_INFO_MAP: Record<string, CoinInfo> = {
  BTCUSDT: {
    name: 'Bitcoin',
    fullName: 'Bitcoin(BTC)',
    launchDate: '2008-11-01',
    totalSupply: '21000000.0',
    circulatingSupply: '19059518.0',
    icoPrice: '--',
    whitepaper: 'https://bitcoin.org/bitcoin.pdf',
    website: 'https://bitcoin.org/',
    description: 'Bitcoin（BitCoin，BTC）是一种基于密码学和分布式账本技术实现的点对点电子货币系统，由中本聪提出。在互联网交易中，人们通常依赖中心化的金融机构进行支付，这往往导致限制、数据不透明和篡改风险。Bitcoin通过其密码学分布式账本技术，提供了一个去中心化的电子支付系统，实现了透明、公开的交易数据存储、追溯和查询，允许全球任何人参与，不受地理或交易金额限制。'
  },
  ETHUSDT: {
    name: 'Ethereum',
    fullName: 'Ethereum(ETH)',
    launchDate: '2015-07-30',
    totalSupply: '无上限',
    circulatingSupply: '120000000.0',
    icoPrice: '0.311 USD',
    whitepaper: 'https://ethereum.org/whitepaper/',
    website: 'https://ethereum.org/',
    description: 'Ethereum（以太坊）是一个开源的、去中心化的区块链平台，支持智能合约功能。由Vitalik Buterin于2013年提出，2015年正式上线。以太坊不仅是一种加密货币，更是一个去中心化应用（DApp）平台，允许开发者在其上构建和部署智能合约和去中心化应用。'
  },
  BNBUSDT: {
    name: 'BNB',
    fullName: 'BNB(BNB)',
    launchDate: '2017-07-25',
    totalSupply: '200000000.0',
    circulatingSupply: '153432897.0',
    icoPrice: '0.15 USD',
    whitepaper: 'https://www.binance.com/en/blog/ecosystem/introducing-binance-coin-bnb-3384298776719034496',
    website: 'https://www.binance.com/',
    description: 'BNB（Binance Coin）是币安交易所的原生代币，最初基于以太坊ERC-20标准发行，后迁移到币安链（Binance Chain）。BNB可用于支付币安交易所的交易手续费、参与币安Launchpad项目、支付币安链上的交易费用等。'
  },
  SOLUSDT: {
    name: 'Solana',
    fullName: 'Solana(SOL)',
    launchDate: '2020-03-16',
    totalSupply: '无上限',
    circulatingSupply: '450000000.0',
    icoPrice: '0.22 USD',
    whitepaper: 'https://solana.com/solana-whitepaper.pdf',
    website: 'https://solana.com/',
    description: 'Solana是一个高性能的区块链平台，旨在支持去中心化应用和加密货币。Solana使用独特的共识机制Proof of History（PoH）结合Proof of Stake（PoS），实现了高吞吐量和低延迟的交易处理能力。'
  },
  XRPUSDT: {
    name: 'XRP',
    fullName: 'XRP(XRP)',
    launchDate: '2012-09-24',
    totalSupply: '100000000000.0',
    circulatingSupply: '55000000000.0',
    icoPrice: '--',
    whitepaper: 'https://ripple.com/files/ripple_consensus_whitepaper.pdf',
    website: 'https://ripple.com/',
    description: 'XRP是Ripple网络的原生加密货币，设计用于快速、低成本的跨境支付。XRP可以在Ripple网络中作为桥梁货币，帮助不同货币之间的快速转换和结算。'
  },
  ADAUSDT: {
    name: 'Cardano',
    fullName: 'Cardano(ADA)',
    launchDate: '2017-09-29',
    totalSupply: '45000000000.0',
    circulatingSupply: '35000000000.0',
    icoPrice: '0.0024 USD',
    whitepaper: 'https://cardano.org/whitepaper/',
    website: 'https://cardano.org/',
    description: 'Cardano是一个去中心化的公共区块链和加密货币项目，采用科学哲学和同行评审的研究方法开发。Cardano旨在提供一个更可持续和平衡的生态系统，支持智能合约和去中心化应用。'
  },
  DOGEUSDT: {
    name: 'Dogecoin',
    fullName: 'Dogecoin(DOGE)',
    launchDate: '2013-12-06',
    totalSupply: '无上限',
    circulatingSupply: '142000000000.0',
    icoPrice: '--',
    whitepaper: 'https://github.com/dogecoin/dogecoin/blob/master/README.md',
    website: 'https://dogecoin.com/',
    description: 'Dogecoin（狗狗币）是一种基于Litecoin代码的加密货币，最初是作为一个玩笑创建的，以"Doge"网络表情包为特色。尽管最初是作为玩笑，但Dogecoin已经发展成为一个拥有活跃社区和实际应用场景的加密货币。'
  },
  TRXUSDT: {
    name: 'TRON',
    fullName: 'TRON(TRX)',
    launchDate: '2017-09-01',
    totalSupply: '100000000000.0',
    circulatingSupply: '88000000000.0',
    icoPrice: '0.0019 USD',
    whitepaper: 'https://tron.network/static/doc/white_paper_v_2_0.pdf',
    website: 'https://tron.network/',
    description: 'TRON是一个去中心化的内容娱乐平台，旨在构建一个全球免费的内容娱乐系统。TRON使用区块链技术，允许内容创作者直接与消费者互动，无需中间商。'
  },
  DOTUSDT: {
    name: 'Polkadot',
    fullName: 'Polkadot(DOT)',
    launchDate: '2020-05-26',
    totalSupply: '无上限',
    circulatingSupply: '1200000000.0',
    icoPrice: '0.29 USD',
    whitepaper: 'https://polkadot.network/PolkaDotPaper.pdf',
    website: 'https://polkadot.network/',
    description: 'Polkadot是一个多链互操作协议，允许不同的区块链网络之间进行数据和资产传输。Polkadot旨在创建一个完全去中心化的网络，使不同的区块链能够安全地协同工作。'
  },
  MATICUSDT: {
    name: 'Polygon',
    fullName: 'Polygon(MATIC)',
    launchDate: '2019-05-15',
    totalSupply: '10000000000.0',
    circulatingSupply: '9500000000.0',
    icoPrice: '0.00263 USD',
    whitepaper: 'https://polygon.technology/lightpaper-polygon.pdf',
    website: 'https://polygon.technology/',
    description: 'Polygon（原Matic Network）是一个用于构建和连接与以太坊兼容的区块链网络的框架。Polygon旨在解决以太坊的可扩展性问题，提供更快的交易速度和更低的交易费用。'
  },
  AVAXUSDT: {
    name: 'Avalanche',
    fullName: 'Avalanche(AVAX)',
    launchDate: '2020-09-21',
    totalSupply: '720000000.0',
    circulatingSupply: '360000000.0',
    icoPrice: '0.50 USD',
    whitepaper: 'https://assets.website-files.com/5d80307810123f5ff2ca1b49/5d80307810123f5ff2ca1b4a_Avalanche%20Platform%20Whitepaper.pdf',
    website: 'https://www.avax.network/',
    description: 'Avalanche是一个开源平台，用于启动去中心化应用和企业区块链部署。Avalanche使用独特的共识协议，实现了高吞吐量、低延迟和可扩展性，支持智能合约和去中心化应用。'
  },
  LINKUSDT: {
    name: 'Chainlink',
    fullName: 'Chainlink(LINK)',
    launchDate: '2017-09-20',
    totalSupply: '1000000000.0',
    circulatingSupply: '550000000.0',
    icoPrice: '0.11 USD',
    whitepaper: 'https://chain.link/whitepaper',
    website: 'https://chain.link/',
    description: 'Chainlink是一个去中心化的预言机网络，旨在将智能合约与现实世界的数据连接起来。Chainlink允许区块链应用安全地访问外部数据源、API和支付系统，实现智能合约与现实世界的交互。'
  }
}

function getCoinInfo(symbol: string): CoinInfo {
  return COIN_INFO_MAP[symbol] || COIN_INFO_MAP['BTCUSDT']
}

export function MobilePerpetualTradingPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [selectedSymbol, setSelectedSymbol] = useState(searchParams.get('symbol') || 'BTCUSDT')
  const [ticker, setTicker] = useState<TickerData | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'orderbook' | 'trades' | 'info'>('orderbook')
  const [timeframe, setTimeframe] = useState('15m')
  const [indicator, setIndicator] = useState<'MA' | 'BOLL' | 'VOL' | 'MACD' | 'KDJ' | 'RSI' | 'WR'>('MACD')
  const [orderBook, setOrderBook] = useState<{ bids: OrderBookItem[], asks: OrderBookItem[] }>({ bids: [], asks: [] })
  const [trades, setTrades] = useState<TradeItem[]>([])
  const [favorites, setFavorites] = useState<Set<string>>(new Set())
  const [symbolDrawerOpen, setSymbolDrawerOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  
  const chartRef = useRef<HTMLDivElement>(null)
  const macdChartRef = useRef<HTMLDivElement>(null)
  const chartInstance = useRef<echarts.ECharts | null>(null)
  const macdChartInstance = useRef<echarts.ECharts | null>(null)

  // 永续合约产品列表
  const perpetualSymbols = [
    { symbol: 'BTCUSDT', name: 'Bitcoin', icon: getIconForSymbol('BTCUSDT') },
    { symbol: 'ETHUSDT', name: 'Ethereum', icon: getIconForSymbol('ETHUSDT') },
    { symbol: 'BNBUSDT', name: 'BNB', icon: getIconForSymbol('BNBUSDT') },
    { symbol: 'SOLUSDT', name: 'Solana', icon: getIconForSymbol('SOLUSDT') },
    { symbol: 'XRPUSDT', name: 'XRP', icon: getIconForSymbol('XRPUSDT') },
    { symbol: 'ADAUSDT', name: 'Cardano', icon: getIconForSymbol('ADAUSDT') },
    { symbol: 'DOGEUSDT', name: 'Dogecoin', icon: getIconForSymbol('DOGEUSDT') },
    { symbol: 'TRXUSDT', name: 'TRON', icon: getIconForSymbol('TRXUSDT') },
    { symbol: 'DOTUSDT', name: 'Polkadot', icon: getIconForSymbol('DOTUSDT') },
    { symbol: 'MATICUSDT', name: 'Polygon', icon: getIconForSymbol('MATICUSDT') },
    { symbol: 'AVAXUSDT', name: 'Avalanche', icon: getIconForSymbol('AVAXUSDT') },
    { symbol: 'LINKUSDT', name: 'Chainlink', icon: getIconForSymbol('LINKUSDT') },
  ]

  // 过滤产品列表
  const filteredSymbols = perpetualSymbols.filter(item =>
    item.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

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

  // 选择交易对
  const handleSymbolSelect = (symbol: string) => {
    setSelectedSymbol(symbol)
    setSymbolDrawerOpen(false)
    setSearchQuery('')
    // 更新URL参数
    navigate(`/trading?type=perpetual&symbol=${symbol}`, { replace: true })
  }

  // 获取市场数据
  useEffect(() => {
    const fetchTicker = async () => {
      try {
        const response = await fetch(`https://api.binance.com/api/v3/ticker/24hr?symbol=${selectedSymbol}`)
        if (response.ok) {
          const data = await response.json()
          setTicker({
            symbol: data.symbol,
            lastPrice: parseFloat(data.lastPrice).toFixed(1),
            priceChangePercent: parseFloat(data.priceChangePercent).toFixed(2),
            markPrice: parseFloat(data.lastPrice).toFixed(1), // 使用lastPrice作为标记价格
            high24h: parseFloat(data.highPrice).toFixed(1),
            low24h: parseFloat(data.lowPrice).toFixed(1),
            volume24h: (parseFloat(data.volume) / 1000).toFixed(2) + 'K',
            quoteVolume24h: (parseFloat(data.quoteVolume) / 1000000).toFixed(2) + 'M'
          })
        }
      } catch (error) {
        console.error('Failed to fetch ticker:', error)
        // 使用模拟数据
        setTicker({
          symbol: selectedSymbol,
          lastPrice: '86675.0',
          priceChangePercent: '-0.89',
          markPrice: '86667.7',
          high24h: '90325.0',
          low24h: '85278.6',
          volume24h: '3.03K',
          quoteVolume24h: '264.37M'
        })
      } finally {
        setLoading(false)
      }
    }

    fetchTicker()
    const interval = setInterval(fetchTicker, 5000)
    return () => clearInterval(interval)
  }, [selectedSymbol])

  // 获取K线数据
  useEffect(() => {
    const fetchKline = async () => {
      if (!chartRef.current) return

      try {
        const intervalMap: Record<string, string> = {
          '1m': '1m',
          '15m': '15m',
          '1h': '1h',
          '4h': '4h',
          '1d': '1d'
        }

        const response = await fetch(
          `https://api.binance.com/api/v3/klines?symbol=${selectedSymbol}&interval=${intervalMap[timeframe] || '15m'}&limit=200`
        )

        if (response.ok) {
          const data = await response.json()
          const klineData = data.map((item: any) => [
            item[0], // time
            parseFloat(item[1]), // open
            parseFloat(item[2]), // high
            parseFloat(item[3]), // low
            parseFloat(item[4]), // close
            parseFloat(item[5]) // volume
          ])

          // 计算MA指标
          const closes = klineData.map((k: number[]) => k[4])
          const ma7 = calculateMA(closes, 7)
          const ma25 = calculateMA(closes, 25)
          const ma99 = calculateMA(closes, 99)

          // 计算MACD
          const macdData = calculateMACD(closes)

          if (!chartInstance.current) {
            chartInstance.current = echarts.init(chartRef.current!)
          }

          const option: echarts.EChartsOption = {
            backgroundColor: 'transparent',
            grid: {
              left: '5%',
              right: '8%',
              top: '10%',
              bottom: '15%'
            },
            xAxis: {
              type: 'category',
              data: klineData.map((k: number[]) => new Date(k[0]).toLocaleString('zh-CN', { month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' })),
              axisLine: { lineStyle: { color: '#666' } },
              axisLabel: { color: '#999', fontSize: 10 }
            },
            yAxis: {
              type: 'value',
              scale: true,
              axisLine: { lineStyle: { color: '#666' } },
              axisLabel: { color: '#999', fontSize: 10 },
              splitLine: { lineStyle: { color: '#333' } }
            },
            series: [
              {
                name: 'K线',
                type: 'candlestick',
                data: klineData.map((k: number[]) => [k[1], k[2], k[3], k[4]]),
                itemStyle: {
                  color: '#00C087',
                  color0: '#FF4D4F',
                  borderColor: '#00C087',
                  borderColor0: '#FF4D4F'
                }
              },
              {
                name: 'MA7',
                type: 'line',
                data: ma7,
                smooth: true,
                lineStyle: { color: '#00C087', width: 1 },
                symbol: 'none'
              },
              {
                name: 'MA25',
                type: 'line',
                data: ma25,
                smooth: true,
                lineStyle: { color: '#1890FF', width: 1 },
                symbol: 'none'
              },
              {
                name: 'MA99',
                type: 'line',
                data: ma99,
                smooth: true,
                lineStyle: { color: '#722ED1', width: 1 },
                symbol: 'none'
              }
            ]
          }

          chartInstance.current.setOption(option)

          // MACD图表
          if (macdChartRef.current && indicator === 'MACD') {
            if (!macdChartInstance.current) {
              macdChartInstance.current = echarts.init(macdChartRef.current)
            }

            const macdOption: echarts.EChartsOption = {
              backgroundColor: 'transparent',
              grid: {
                left: '5%',
                right: '8%',
                top: '10%',
                bottom: '15%'
              },
              xAxis: {
                type: 'category',
                data: klineData.map((k: number[]) => new Date(k[0]).toLocaleString('zh-CN', { month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' })),
                axisLine: { lineStyle: { color: '#666' } },
                axisLabel: { color: '#999', fontSize: 10 }
              },
              yAxis: {
                type: 'value',
                axisLine: { lineStyle: { color: '#666' } },
                axisLabel: { color: '#999', fontSize: 10 },
                splitLine: { lineStyle: { color: '#333' } }
              },
              series: [
                {
                  name: 'MACD',
                  type: 'bar',
                  data: macdData.macd.map((val, idx) => ({
                    value: val,
                    itemStyle: { color: val >= 0 ? '#00C087' : '#FF4D4F' }
                  })),
                  barWidth: '60%'
                },
                {
                  name: 'DIF',
                  type: 'line',
                  data: macdData.dif,
                  lineStyle: { color: '#1890FF', width: 1 },
                  symbol: 'none'
                },
                {
                  name: 'DEA',
                  type: 'line',
                  data: macdData.dea,
                  lineStyle: { color: '#FA8C16', width: 1 },
                  symbol: 'none'
                }
              ]
            }

            macdChartInstance.current.setOption(macdOption)
          }
        }
      } catch (error) {
        console.error('Failed to fetch kline:', error)
      }
    }

    fetchKline()
    const interval = setInterval(fetchKline, 10000)
    return () => {
      clearInterval(interval)
      if (chartInstance.current) {
        chartInstance.current.dispose()
        chartInstance.current = null
      }
      if (macdChartInstance.current) {
        macdChartInstance.current.dispose()
        macdChartInstance.current = null
      }
    }
  }, [selectedSymbol, timeframe, indicator])

  // 获取订单簿数据
  useEffect(() => {
    const fetchOrderBook = async () => {
      try {
        const response = await fetch(`https://api.binance.com/api/v3/depth?symbol=${selectedSymbol}&limit=20`)
        if (response.ok) {
          const data = await response.json()
          
          // 处理买单数据
          const bids: OrderBookItem[] = (data.bids || [])
            .filter((item: string[]) => item && item.length >= 2 && parseFloat(item[1]) > 0)
            .slice(0, 20)
            .map((item: string[]) => {
              const amount = parseFloat(item[1])
              const formattedAmount = amount >= 1000 
                ? (amount / 1000).toFixed(2) + 'K'
                : amount.toFixed(4)
              return {
                price: parseFloat(item[0]).toFixed(1),
                amount: formattedAmount
              }
            })
          
          // 处理卖单数据
          const asks: OrderBookItem[] = (data.asks || [])
            .filter((item: string[]) => item && item.length >= 2 && parseFloat(item[1]) > 0)
            .slice(0, 20)
            .map((item: string[]) => {
              const amount = parseFloat(item[1])
              const formattedAmount = amount >= 1000 
                ? (amount / 1000).toFixed(2) + 'K'
                : amount.toFixed(4)
              return {
                price: parseFloat(item[0]).toFixed(1),
                amount: formattedAmount
              }
            })
          
          console.log('Order book data:', { bids: bids.length, asks: asks.length })
          setOrderBook({ bids, asks })
        } else {
          throw new Error('Failed to fetch order book')
        }
      } catch (error) {
        console.error('Failed to fetch order book:', error)
        // 使用模拟数据
        const basePrice = ticker ? parseFloat(ticker.lastPrice) : 86617.5
        const mockBids: OrderBookItem[] = Array.from({ length: 20 }, (_, i) => {
          const amount = Math.random() * 5 + 0.0001
          return {
            price: (basePrice - (i + 1) * 0.1).toFixed(1),
            amount: amount.toFixed(4)
          }
        })
        const mockAsks: OrderBookItem[] = Array.from({ length: 20 }, (_, i) => {
          const amount = Math.random() * 5 + 0.0001
          return {
            price: (basePrice + (i + 1) * 0.1).toFixed(1),
            amount: amount.toFixed(4)
          }
        })
        setOrderBook({ bids: mockBids, asks: mockAsks })
      }
    }

    fetchOrderBook()
    const interval = setInterval(fetchOrderBook, 2000)
    return () => clearInterval(interval)
  }, [selectedSymbol, ticker])

  // 获取最新成交数据
  useEffect(() => {
    const fetchTrades = async () => {
      try {
        const response = await fetch(`https://api.binance.com/api/v3/trades?symbol=${selectedSymbol}&limit=20`)
        if (response.ok) {
          const data = await response.json()
          const tradesData: TradeItem[] = data.map((item: any) => ({
            time: new Date(item.time).toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
            side: item.isBuyerMaker ? 'sell' : 'buy',
            price: parseFloat(item.price).toFixed(1),
            amount: parseFloat(item.qty).toFixed(4)
          }))
          setTrades(tradesData)
        }
      } catch (error) {
        console.error('Failed to fetch trades:', error)
        // 使用模拟数据
        const mockTrades: TradeItem[] = Array.from({ length: 10 }, (_, i) => ({
          time: new Date(Date.now() - i * 1000).toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
          side: Math.random() > 0.5 ? 'buy' : 'sell',
          price: (86667.5 + (Math.random() - 0.5) * 10).toFixed(1),
          amount: (Math.random() * 2000 + 10).toFixed(4)
        }))
        setTrades(mockTrades)
      }
    }

    fetchTrades()
    const interval = setInterval(fetchTrades, 2000)
    return () => clearInterval(interval)
  }, [selectedSymbol])

  // 计算MA
  function calculateMA(data: number[], period: number): number[] {
    const result: number[] = []
    for (let i = 0; i < data.length; i++) {
      if (i < period - 1) {
        result.push(NaN)
      } else {
        const sum = data.slice(i - period + 1, i + 1).reduce((a, b) => a + b, 0)
        result.push(sum / period)
      }
    }
    return result
  }

  // 计算MACD
  function calculateMACD(data: number[]): { dif: number[], dea: number[], macd: number[] } {
    const ema12 = calculateEMA(data, 12)
    const ema26 = calculateEMA(data, 26)
    const dif = ema12.map((val, idx) => val - ema26[idx])
    const dea = calculateEMA(dif, 9)
    const macd = dif.map((val, idx) => (val - dea[idx]) * 2)
    return { dif, dea, macd }
  }

  // 计算EMA
  function calculateEMA(data: number[], period: number): number[] {
    const multiplier = 2 / (period + 1)
    const result: number[] = [data[0]]
    for (let i = 1; i < data.length; i++) {
      result.push((data[i] - result[i - 1]) * multiplier + result[i - 1])
    }
    return result
  }

  const priceChange = ticker ? parseFloat(ticker.priceChangePercent) : 0
  const isPositive = priceChange >= 0

  return (
    <div className="min-h-screen bg-black text-white pb-24">
      {/* 顶部导航栏 */}
      <div className="sticky top-0 z-50 bg-black/95 backdrop-blur-xl border-b border-white/10">
        <div className="flex items-center justify-between px-4 py-3">
          <button onClick={() => navigate(-1)} className="p-2 -ml-2">
            <ChevronLeft className="w-6 h-6 text-white" />
          </button>
          <button 
            onClick={() => setSymbolDrawerOpen(true)}
            className="flex items-center gap-2"
          >
            <span className="text-white font-medium">{selectedSymbol} 永续</span>
            <ChevronDown className="w-4 h-4 text-white/60" />
          </button>
          <button className="p-2">
            <Share2 className="w-5 h-5 text-white/60" />
          </button>
        </div>
      </div>

      {/* 价格信息区域 */}
      {ticker && (
        <div className="px-4 py-4 border-b border-white/10">
          <div className="text-gray-400 text-xs mb-1">最新价格</div>
          <div className={`text-3xl font-bold mb-1 ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
            {parseFloat(ticker.lastPrice).toLocaleString('en-US', { minimumFractionDigits: 1, maximumFractionDigits: 1 })}
          </div>
          <div className={`text-sm mb-2 ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
            ≈${parseFloat(ticker.lastPrice).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} {isPositive ? '+' : ''}{ticker.priceChangePercent}%
          </div>
          <div className="text-gray-400 text-xs mb-3">标记价格 {ticker.markPrice}</div>
          
          <div className="grid grid-cols-2 gap-4 text-xs">
            <div>
              <div className="text-gray-400 mb-1">24h最高价</div>
              <div className="text-white">{ticker.high24h}</div>
            </div>
            <div>
              <div className="text-gray-400 mb-1">24h成交量(BTC)</div>
              <div className="text-white">{ticker.volume24h}</div>
            </div>
            <div>
              <div className="text-gray-400 mb-1">24h最低价</div>
              <div className="text-white">{ticker.low24h}</div>
            </div>
            <div>
              <div className="text-gray-400 mb-1">24h成交额(USDT)</div>
              <div className="text-white">{ticker.quoteVolume24h}</div>
            </div>
          </div>
        </div>
      )}

      {/* 时间周期选择 */}
      <div className="flex items-center gap-2 px-4 py-2 border-b border-white/10 overflow-x-auto">
        {['分时', '15分', '1时', '4时', '1天'].map((tf) => (
          <button
            key={tf}
            onClick={() => {
              const map: Record<string, string> = { '分时': '1m', '15分': '15m', '1时': '1h', '4时': '4h', '1天': '1d' }
              setTimeframe(map[tf] || '15m')
            }}
            className={`px-3 py-1 text-sm whitespace-nowrap ${
              (tf === '15分' && timeframe === '15m') || 
              (tf === '分时' && timeframe === '1m') ||
              (tf === '1时' && timeframe === '1h') ||
              (tf === '4时' && timeframe === '4h') ||
              (tf === '1天' && timeframe === '1d')
                ? 'text-white border-b-2 border-white' 
                : 'text-gray-400'
            }`}
          >
            {tf}
          </button>
        ))}
        <div className="flex-1"></div>
        <button className="text-xs text-gray-400 flex items-center gap-1">
          更多<ChevronDown className="w-3 h-3" />
        </button>
        <button className="text-xs text-gray-400">深度图</button>
      </div>

      {/* MA指标显示 */}
      {ticker && (
        <div className="flex items-center gap-4 px-4 py-2 text-xs border-b border-white/10">
          <span className="text-green-500">MA7: {ticker.markPrice}</span>
          <span className="text-blue-500">MA25: {ticker.markPrice}</span>
          <span className="text-purple-500">MA99: {ticker.markPrice}</span>
        </div>
      )}

      {/* K线图 */}
      <div className="h-64 border-b border-white/10">
        <div ref={chartRef} className="w-full h-full"></div>
      </div>

      {/* MACD图表 */}
      {indicator === 'MACD' && (
        <div className="h-32 border-b border-white/10">
          <div ref={macdChartRef} className="w-full h-full"></div>
          {ticker && (
            <div className="flex items-center gap-4 px-4 py-2 text-xs">
              <span className="text-blue-500">DIF: 58.8</span>
              <span className="text-orange-500">DEA: -30.5</span>
              <span className="text-green-500">MACD: 178.7</span>
            </div>
          )}
        </div>
      )}

      {/* 技术指标选择 */}
      <div className="flex items-center gap-2 px-4 py-2 border-b border-white/10 overflow-x-auto">
        {['MA', 'BOLL', 'VOL', 'MACD', 'KDJ', 'RSI', 'WR'].map((ind) => (
          <button
            key={ind}
            onClick={() => setIndicator(ind as any)}
            className={`px-3 py-1 text-xs whitespace-nowrap ${
              indicator === ind 
                ? 'text-green-500 border-b-2 border-green-500' 
                : 'text-gray-400'
            }`}
          >
            {ind}
          </button>
        ))}
        <div className="flex-1"></div>
        <button className="p-1">
          <MoreVertical className="w-4 h-4 text-gray-400" />
        </button>
      </div>

      {/* 标签页：委托订单/最新成交/信息 */}
      <div className="flex items-center gap-4 px-4 py-3 border-b border-white/10">
        {[
          { key: 'orderbook', label: '委托订单' },
          { key: 'trades', label: '最新成交' },
          { key: 'info', label: '信息' }
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key as any)}
            className={`text-sm ${
              activeTab === tab.key 
                ? 'text-white border-b-2 border-white' 
                : 'text-gray-400'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* 内容区域 */}
      {activeTab === 'orderbook' && (
        <div className="px-4 py-2">
          {/* 价格精度选择 */}
          <div className="flex items-center justify-end mb-2">
            <button className="text-xs text-gray-400 flex items-center gap-1">
              0.00001
              <ChevronDown className="w-3 h-3" />
            </button>
          </div>
          
          {/* 买卖比例进度条 */}
          {(() => {
            const totalBidVolume = orderBook.bids.reduce((sum, bid) => {
              const amount = parseFloat(bid.amount.replace('K', '')) * (bid.amount.includes('K') ? 1000 : 1)
              return sum + amount
            }, 0)
            const totalAskVolume = orderBook.asks.reduce((sum, ask) => {
              const amount = parseFloat(ask.amount.replace('K', '')) * (ask.amount.includes('K') ? 1000 : 1)
              return sum + amount
            }, 0)
            const totalVolume = totalBidVolume + totalAskVolume
            const bidPercent = totalVolume > 0 ? Math.round((totalBidVolume / totalVolume) * 100) : 50
            const askPercent = 100 - bidPercent
            
            return (
              <div className="mb-3">
                <div className="flex h-2 bg-gray-800 rounded overflow-hidden">
                  <div 
                    className="bg-green-500" 
                    style={{ width: `${bidPercent}%` }}
                  ></div>
                  <div 
                    className="bg-red-500" 
                    style={{ width: `${askPercent}%` }}
                  ></div>
                </div>
                <div className="flex justify-between text-xs mt-1">
                  <span className="text-green-400">{bidPercent}%</span>
                  <span className="text-red-400">{askPercent}%</span>
                </div>
              </div>
            )
          })()}
          
          {/* 表头 */}
          <div className="grid grid-cols-3 gap-1 mb-2 text-xs text-gray-400">
            <div className="text-left">买(USDT)</div>
            <div className="text-center">价格</div>
            <div className="text-right">卖(USDT)</div>
          </div>
          
          {/* 订单簿内容 */}
          {loading && orderBook.asks.length === 0 && orderBook.bids.length === 0 ? (
            <div className="text-center text-gray-500 text-sm py-8">加载中...</div>
          ) : (
            <div className="space-y-0">
              {(() => {
                // 获取最大行数
                const maxRows = Math.max(orderBook.bids.length, orderBook.asks.length)
                const rows: Array<{ bid?: OrderBookItem, ask?: OrderBookItem }> = []
                
                // 创建行数据，买单和卖单配对显示
                for (let i = 0; i < maxRows; i++) {
                  rows.push({
                    bid: orderBook.bids[i],
                    ask: orderBook.asks[orderBook.asks.length - 1 - i] // 卖单从高到低
                  })
                }
                
                return rows.map((row, idx) => (
                  <div key={`row-${idx}`} className="grid grid-cols-3 gap-1 text-xs py-0.5">
                    {/* 买单数量 - 左边，绿色 */}
                    <div className="text-left text-green-400 truncate">
                      {row.bid?.amount || ''}
                    </div>
                    {/* 价格 - 中间，分为两列显示 */}
                    <div className="flex items-center justify-center gap-2">
                      {row.bid && (
                        <span className="text-green-400 font-medium">{row.bid.price}</span>
                      )}
                      {row.ask && (
                        <span className="text-red-400 font-medium">{row.ask.price}</span>
                      )}
                    </div>
                    {/* 卖单数量 - 右边，红色 */}
                    <div className="text-right text-red-400 truncate">
                      {row.ask?.amount || ''}
                    </div>
                  </div>
                ))
              })()}
              
              {/* 如果没有数据，显示提示 */}
              {orderBook.asks.length === 0 && orderBook.bids.length === 0 && !loading && (
                <div className="text-center text-gray-500 text-sm py-8">暂无数据</div>
              )}
            </div>
          )}
        </div>
      )}

      {activeTab === 'trades' && (
        <div className="px-4 py-2">
          <div className="grid grid-cols-4 gap-2 text-xs mb-2 text-gray-400">
            <span>时间</span>
            <span>方向</span>
            <span>价格(BTC)</span>
            <span>数量(USDT)</span>
          </div>
          <div className="space-y-1">
            {trades.map((trade, idx) => (
              <div key={idx} className="grid grid-cols-4 gap-2 text-xs">
                <span className="text-gray-400">{trade.time}</span>
                <span className={trade.side === 'buy' ? 'text-green-400' : 'text-red-400'}>
                  {trade.side === 'buy' ? '买' : '卖'}
                </span>
                <span className="text-white">{trade.price}</span>
                <span className="text-white">{trade.amount}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'info' && (() => {
        const coinInfo = getCoinInfo(selectedSymbol)
        return (
          <div className="px-4 py-4">
            <div className="flex items-center gap-3 mb-4">
              <ImageWithFallback
                src={getIconForSymbol(selectedSymbol)}
                alt={selectedSymbol}
                className="w-10 h-10 rounded-full"
              />
              <div>
                <div className="text-white font-medium">{coinInfo.fullName}</div>
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <div className="text-white font-medium mb-2">基础信息</div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-400">发行时间</span>
                    <span className="text-white">{coinInfo.launchDate}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">发行总量</span>
                    <span className="text-white">{coinInfo.totalSupply}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">流通总量</span>
                    <span className="text-white">{coinInfo.circulatingSupply}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">众筹价格</span>
                    <span className="text-white">{coinInfo.icoPrice}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">白皮书</span>
                    <a href={coinInfo.whitepaper} target="_blank" rel="noopener noreferrer" className="text-blue-400 truncate max-w-[200px]">
                      {coinInfo.whitepaper}
                    </a>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">官网</span>
                    <a href={coinInfo.website} target="_blank" rel="noopener noreferrer" className="text-blue-400 truncate max-w-[200px]">
                      {coinInfo.website}
                    </a>
                  </div>
                </div>
              </div>

              <div>
                <div className="text-white font-medium mb-2">简介</div>
                <div className="text-sm text-gray-300 leading-relaxed">
                  {coinInfo.description}
                </div>
              </div>
            </div>
          </div>
        )
      })()}

      {/* 底部操作栏 */}
      <div className="fixed bottom-0 left-0 right-0 bg-black/95 backdrop-blur-xl border-t border-white/10 z-40">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-4">
            <button className="flex items-center gap-1 text-sm text-gray-400">
              <Star className={`w-4 h-4 ${favorites.has(selectedSymbol) ? 'fill-yellow-400 text-yellow-400' : ''}`} />
              自选
            </button>
            <button className="flex items-center gap-1 text-sm text-gray-400">
              <Eye className="w-4 h-4" />
              现货
            </button>
          </div>
          <div className="flex gap-3">
            <Button 
              onClick={() => {/* 打开买入面板 */}}
              className="bg-green-500 hover:bg-green-600 text-white px-8 py-2 rounded-lg font-medium"
            >
              买入
            </Button>
            <Button 
              onClick={() => {/* 打开卖出面板 */}}
              className="bg-red-500 hover:bg-red-600 text-white px-8 py-2 rounded-lg font-medium"
            >
              卖出
            </Button>
          </div>
        </div>
      </div>

      {/* 交易对选择抽屉 */}
      <Drawer open={symbolDrawerOpen} onOpenChange={setSymbolDrawerOpen}>
        <DrawerContent className="bg-[#0A0A0A] border-t border-white/10 max-h-[85vh]">
          <DrawerHeader className="border-b border-white/10 px-4 py-4">
            <div className="flex items-center justify-between">
              <DrawerTitle className="text-white text-lg">永续合约</DrawerTitle>
              <button 
                onClick={() => setSymbolDrawerOpen(false)}
                className="p-2 -mr-2 hover:bg-white/5 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-white/60" />
              </button>
            </div>
            <DrawerDescription className="sr-only">
              选择永续合约交易对
            </DrawerDescription>
          </DrawerHeader>

          {/* 搜索框 */}
          <div className="px-4 py-4 border-b border-white/10">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
              <Input
                type="text"
                placeholder="搜索交易对..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-white/40"
              />
            </div>
          </div>

          {/* 产品列表 */}
          <div className="flex-1 overflow-y-auto px-4 py-4">
            {filteredSymbols.length > 0 ? (
              <div className="space-y-1">
                {filteredSymbols.map((item) => (
                  <button
                    key={item.symbol}
                    onClick={() => handleSymbolSelect(item.symbol)}
                    className={`w-full flex items-center justify-between p-3 rounded-lg transition-colors ${
                      selectedSymbol === item.symbol
                        ? 'bg-[#A3F030]/20 border border-[#A3F030]/30'
                        : 'bg-white/5 hover:bg-white/10 border border-transparent'
                    }`}
                  >
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <ImageWithFallback
                        src={item.icon}
                        alt={item.name}
                        className="w-8 h-8 rounded-full flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0 text-left">
                        <div className="text-white font-medium truncate">{item.symbol}</div>
                        <div className="text-xs text-white/50 truncate">{item.name}</div>
                      </div>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        toggleFavorite(item.symbol)
                      }}
                      className="p-2 -mr-2 hover:bg-white/5 rounded-lg transition-colors flex-shrink-0"
                    >
                      <Star 
                        className={`w-5 h-5 ${
                          favorites.has(item.symbol) 
                            ? 'fill-yellow-400 text-yellow-400' 
                            : 'text-white/40'
                        }`} 
                      />
                    </button>
                  </button>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12">
                <Search className="w-12 h-12 text-white/20 mb-3" />
                <p className="text-white/40 text-sm">未找到匹配的交易对</p>
              </div>
            )}
          </div>
        </DrawerContent>
      </Drawer>
    </div>
  )
}

