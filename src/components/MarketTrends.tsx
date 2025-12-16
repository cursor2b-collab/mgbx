import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import * as echarts from 'echarts'
import { useLanguage } from '../contexts/LanguageContext'

interface MarketData {
  symbol: string
  icon: string
  price: string
  priceUSD: string
  change24h: string
  high24h: string
  volume24h: string
  klineData: number[]
  isPositive: boolean
}

type CategoryKey = 'forex' | 'stocks' | 'crypto' | 'futures' | 'metals'

const CATEGORIES: CategoryKey[] = ['forex', 'stocks', 'crypto', 'futures', 'metals']

const CRYPTO_SYMBOLS = ['ETHUSDT', 'BTCUSDT', 'SOLUSDT', 'XRPUSDT', 'BNBUSDT']

// 图标映射
const ICON_MAP: { [key: string]: string } = {
  // 加密货币图标 - 使用CoinGecko API
  'ETHUSDT': 'https://assets.coingecko.com/coins/images/279/small/ethereum.png',
  'BTCUSDT': 'https://assets.coingecko.com/coins/images/1/small/bitcoin.png',
  'SOLUSDT': 'https://assets.coingecko.com/coins/images/4128/small/solana.png',
  'XRPUSDT': 'https://assets.coingecko.com/coins/images/44/small/xrp-symbol-white-128.png',
  'BNBUSDT': 'https://assets.coingecko.com/coins/images/825/small/bnb-icon2_2x.png',
  
  // 外汇图标
  'EURUSD': 'https://www.bosss.club/static/img/crypto/EURUSD.svg?v=3.6.0',
  'GBPUSD': 'https://www.bosss.club/static/img/crypto/GBPUSD.svg?v=3.6.0',
  'USDJPY': 'https://www.bosss.club/static/img/crypto/USDJPY.svg?v=3.6.0',
  'AUDUSD': 'https://www.bosss.club/static/img/crypto/AUDUSD.svg?v=3.6.0',
  'USDCAD': 'https://www.bosss.club/static/img/crypto/USDCAD.svg?v=3.6.0',
  
  // 股票图标
  'AAPL': 'https://api.dicebear.com/7.x/shapes/svg?seed=AAPL&backgroundColor=000000',
  'GOOGL': 'https://api.dicebear.com/7.x/shapes/svg?seed=GOOGL&backgroundColor=4285F4',
  'MSFT': 'https://api.dicebear.com/7.x/shapes/svg?seed=MSFT&backgroundColor=00A4EF',
  'AMZN': 'https://api.dicebear.com/7.x/shapes/svg?seed=AMZN&backgroundColor=FF9900',
  'TSLA': 'https://api.dicebear.com/7.x/shapes/svg?seed=TSLA&backgroundColor=CC0000',
  
  // 期货图标
  'CL(原油)': 'https://api.dicebear.com/7.x/shapes/svg?seed=OIL&backgroundColor=1C1C1C',
  'GC(黄金)': 'https://api.dicebear.com/7.x/shapes/svg?seed=GOLD&backgroundColor=FFD700',
  'NG(天然气)': 'https://api.dicebear.com/7.x/shapes/svg?seed=GAS&backgroundColor=4169E1',
  'SI(白银)': 'https://api.dicebear.com/7.x/shapes/svg?seed=SILVER&backgroundColor=C0C0C0',
  'HG(铜)': 'https://api.dicebear.com/7.x/shapes/svg?seed=COPPER&backgroundColor=B87333',
  
  // 贵金属图标
  'XAUUSD(黄金)': 'https://api.dicebear.com/7.x/shapes/svg?seed=XAU&backgroundColor=FFD700',
  'XAGUSD(白银)': 'https://api.dicebear.com/7.x/shapes/svg?seed=XAG&backgroundColor=C0C0C0',
  'XPTUSD(铂金)': 'https://api.dicebear.com/7.x/shapes/svg?seed=XPT&backgroundColor=E5E4E2',
  'XPDUSD(钯金)': 'https://api.dicebear.com/7.x/shapes/svg?seed=XPD&backgroundColor=CED0DD',
  'XRHUSD(铑)': 'https://api.dicebear.com/7.x/shapes/svg?seed=XRH&backgroundColor=808080',
}

export function MarketTrends() {
  const navigate = useNavigate()
  const { t } = useLanguage()
  const [selectedCategory, setSelectedCategory] = useState<CategoryKey>('forex')
  const [marketData, setMarketData] = useState<MarketData[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const chartRefs = useRef<(HTMLDivElement | null)[]>([])

  useEffect(() => {
    fetchMarketData()
    const interval = setInterval(fetchMarketData, 10000)
    return () => clearInterval(interval)
  }, [selectedCategory])

  useEffect(() => {
    // 清理旧图表实例
    chartRefs.current.forEach((chartDom) => {
      if (chartDom) {
        const instance = echarts.getInstanceByDom(chartDom)
        if (instance) {
          instance.dispose()
        }
      }
    })

    // 初始化新图表
    if (marketData.length > 0) {
      marketData.forEach((item, index) => {
        const chartDom = chartRefs.current[index]
        if (chartDom && item.klineData && item.klineData.length > 0) {
          const chart = echarts.init(chartDom)
          const option = {
            grid: {
              left: 0,
              right: 0,
              top: 2,
              bottom: 2
            },
            xAxis: {
              type: 'category',
              show: false,
              boundaryGap: false
            },
            yAxis: {
              type: 'value',
              show: false,
              scale: true
            },
            series: [
              {
                data: item.klineData,
                type: 'line',
                smooth: true,
                symbol: 'none',
                lineStyle: {
                  color: item.isPositive ? '#00C087' : '#FF4D4F',
                  width: 1.5
                },
                areaStyle: {
                  color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                    {
                      offset: 0,
                      color: item.isPositive ? 'rgba(0, 192, 135, 0.3)' : 'rgba(255, 77, 79, 0.3)'
                    },
                    {
                      offset: 1,
                      color: item.isPositive ? 'rgba(0, 192, 135, 0)' : 'rgba(255, 77, 79, 0)'
                    }
                  ])
                }
              }
            ]
          }
          chart.setOption(option)
        }
      })
    }
  }, [marketData])

  const fetchMarketData = async () => {
    try {
      if (selectedCategory === 'crypto') {
        // 获取加密货币真实数据
        const promises = CRYPTO_SYMBOLS.map(async (symbol) => {
          try {
            // 获取24小时数据
            const tickerRes = await fetch(`https://api.binance.com/api/v3/ticker/24hr?symbol=${symbol}`)
            
            if (!tickerRes.ok) {
              throw new Error('Failed to fetch ticker')
            }
            
            const ticker = await tickerRes.json()
            
            // 获取K线数据
            const klineRes = await fetch(`https://api.binance.com/api/v3/klines?symbol=${symbol}&interval=5m&limit=48`)
            
            if (!klineRes.ok) {
              throw new Error('Failed to fetch klines')
            }
            
            const klines = await klineRes.json()
            
            const klineData = klines.map((k: any) => parseFloat(k[4]))

            const price = parseFloat(ticker.lastPrice)
            const change = parseFloat(ticker.priceChangePercent)

            return {
              symbol,
              icon: ICON_MAP[symbol] || `https://api.dicebear.com/7.x/shapes/svg?seed=${symbol}&backgroundColor=333333`,
              price: formatPrice(price),
              priceUSD: `$${formatPriceUSD(price)}`,
              change24h: `${change >= 0 ? '+' : ''}${change.toFixed(2)}%`,
              high24h: formatNumber(parseFloat(ticker.highPrice)),
              volume24h: formatVolume(parseFloat(ticker.volume) * price),
              klineData,
              isPositive: change >= 0
            }
          } catch (err) {
            // API调用失败，使用模拟数据（静默失败）
            // 返回模拟数据
            const mockPrices: Record<string, number> = {
              'BTCUSDT': 67234.50,
              'ETHUSDT': 3456.78,
              'BNBUSDT': 345.67,
              'SOLUSDT': 145.23,
              'ADAUSDT': 0.5234,
              'XRPUSDT': 0.6234,
              'DOGEUSDT': 0.0823,
              'MATICUSDT': 0.8456
            }
            const price = mockPrices[symbol] || 100
            const change = (Math.random() - 0.5) * 10
            const klineData = Array.from({ length: 48 }, () => price * (1 + (Math.random() - 0.5) * 0.02))
            
            return {
              symbol,
              icon: ICON_MAP[symbol] || `https://api.dicebear.com/7.x/shapes/svg?seed=${symbol}&backgroundColor=333333`,
              price: formatPrice(price),
              priceUSD: `$${formatPriceUSD(price)}`,
              change24h: `${change >= 0 ? '+' : ''}${change.toFixed(2)}%`,
              high24h: formatNumber(price * 1.05),
              volume24h: formatVolume(Math.random() * 1000000000),
              klineData,
              isPositive: change >= 0
            }
          }
        })

        const results = await Promise.all(promises)
        setMarketData(results.filter(Boolean) as MarketData[])
      } else {
        // 其他分类使用模拟数据
        const mockData = generateMockData(selectedCategory)
        setMarketData(mockData)
      }
      
      setIsLoading(false)
    } catch (error) {
      // API调用失败（静默失败）
      setIsLoading(false)
    }
  }

  const generateMockData = (category: CategoryKey): MarketData[] => {
    let symbols: string[] = []
    
    switch (category) {
      case 'forex':
        symbols = ['EURUSD', 'GBPUSD', 'USDJPY', 'AUDUSD', 'USDCAD']
        break
      case 'stocks':
        symbols = ['AAPL', 'GOOGL', 'MSFT', 'AMZN', 'TSLA']
        break
      case 'futures':
        symbols = ['CL(原油)', 'GC(黄金)', 'NG(天然气)', 'SI(白银)', 'HG(铜)']
        break
      case 'metals':
        symbols = ['XAUUSD(黄金)', 'XAGUSD(白银)', 'XPTUSD(铂金)', 'XPDUSD(钯金)', 'XRHUSD(铑)']
        break
      default:
        symbols = ['AAPL', 'GOOGL', 'MSFT', 'AMZN', 'TSLA']
    }

    return symbols.map((symbol, idx) => {
      // 为每个symbol生成不同的基准价格
      const basePrice = (100 + idx * 150) * (1 + Math.random() * 0.5)
      const change = (Math.random() - 0.5) * 15
      
      // 生成波动的K线数据
      const klineData: number[] = []
      let currentPrice = basePrice
      for (let i = 0; i < 48; i++) {
        const volatility = (Math.random() - 0.5) * 0.03 // 3% 波动
        currentPrice = currentPrice * (1 + volatility)
        klineData.push(currentPrice)
      }

      return {
        symbol,
        icon: ICON_MAP[symbol] || `https://api.dicebear.com/7.x/shapes/svg?seed=${symbol}&backgroundColor=333333`,
        price: formatPrice(basePrice),
        priceUSD: `$${formatPriceUSD(basePrice)}`,
        change24h: `${change >= 0 ? '+' : ''}${change.toFixed(2)}%`,
        high24h: formatNumber(basePrice * 1.05),
        volume24h: formatVolume(Math.random() * 1000000000),
        klineData,
        isPositive: change >= 0
      }
    })
  }

  const formatPrice = (price: number): string => {
    if (price >= 1000) {
      return `₮${price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
    }
    return `₮${price.toFixed(price < 1 ? 5 : 2)}`
  }

  const formatPriceUSD = (price: number): string => {
    if (price >= 1000) {
      return price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
    }
    return price.toFixed(price < 1 ? 2 : 2)
  }

  const formatNumber = (num: number): string => {
    if (num >= 1000) {
      return num.toLocaleString('en-US', { minimumFractionDigits: 1, maximumFractionDigits: 1 })
    }
    return num.toFixed(num < 1 ? 5 : 2)
  }

  const formatVolume = (volume: number): string => {
    if (volume >= 1e9) return `${(volume / 1e9).toFixed(2)}B`
    if (volume >= 1e6) return `${(volume / 1e6).toFixed(2)}M`
    if (volume >= 1e3) return `${(volume / 1e3).toFixed(2)}K`
    return volume.toFixed(2)
  }

  const handleTrade = () => {
    switch (selectedCategory) {
      case 'forex':
        navigate('/forex')
        break
      case 'stocks':
        navigate('/stocks')
        break
      case 'crypto':
        navigate('/trading')
        break
      case 'futures':
        navigate('/trading')
        break
      case 'metals':
        navigate('/trading')
        break
      default:
        navigate('/trading')
    }
  }

  return (
    <section className="py-16 lg:py-24 bg-black">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <header className="flex items-center justify-between mb-14">
          <h2 className="text-5xl lg:text-[54px] text-white">{t('marketTrends.title')}</h2>
          <button 
            onClick={() => navigate('/markets')} 
            className="text-gray-400 hover:text-white transition-colors flex items-center gap-1.5 text-sm cursor-pointer bg-transparent border-none"
          >
            {t('marketTrends.viewMore')}
            <ArrowRight className="w-3 h-3" />
          </button>
        </header>

        {/* Category Tabs */}
        <section className="flex items-center gap-8 mb-14">
          {CATEGORIES.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`text-lg cursor-pointer transition-colors relative pb-2 bg-transparent border-none ${
                selectedCategory === category
                  ? 'text-white'
                  : 'text-gray-500 hover:text-gray-300'
              }`}
            >
              {t(`marketTrends.categories.${category}`)}
              {selectedCategory === category && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-white" />
              )}
            </button>
          ))}
        </section>

        {/* Market Table */}
        <table className="w-full min-h-[520px]">
          {/* Table Header */}
          <thead>
            <tr className="border-b border-white/10 flex items-center">
              <th className="text-left py-4 pl-3 text-gray-500 text-sm font-normal" style={{ width: '18%' }}>
                {t('marketTrends.table.pair')}
              </th>
              <th className="text-left py-4 pl-3 text-gray-500 text-sm font-normal" style={{ width: '15%' }}>
                {t('marketTrends.table.price')}
              </th>
              <th className="text-left py-4 pl-3 text-gray-500 text-sm font-normal" style={{ width: '10%' }}>
                {t('marketTrends.table.change')}
              </th>
              <th className="text-left py-4 pl-3 text-gray-500 text-sm font-normal" style={{ width: '15%' }}>
                {t('marketTrends.table.high')}
              </th>
              <th className="text-left py-4 pl-3 text-gray-500 text-sm font-normal" style={{ width: '14%' }}>
                {t('marketTrends.table.volume')}
              </th>
              <th className="text-left py-4 pl-3 text-gray-500 text-sm font-normal" style={{ width: '18%' }}>
                {t('marketTrends.table.trend')}
              </th>
              <th className="py-4" style={{ flex: '1 1 0%' }}></th>
            </tr>
          </thead>

          {/* Table Body */}
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={7} className="py-12 text-center text-gray-500">
                  {t('common.loading')}
                </td>
              </tr>
            ) : (
              marketData.map((item, index) => (
                <tr
                  key={index}
                  className="border-b border-white/5 hover:bg-[#1A1C1E] transition-all rounded-lg cursor-pointer group flex"
                >
                  {/* Symbol */}
                  <td className="pl-3 h-20 flex items-center" style={{ width: '18%' }}>
                    <div className="flex items-center gap-2">
                      <img
                        src={item.icon}
                        alt={item.symbol}
                        className="w-8 h-8 rounded-full"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="32" height="32"%3E%3Ccircle cx="16" cy="16" r="16" fill="%23333"/%3E%3C/svg%3E'
                        }}
                      />
                      <span className="text-white text-base">{item.symbol}</span>
                    </div>
                  </td>

                  {/* Price */}
                  <td className="py-[22px] pl-3 flex flex-wrap items-start justify-start h-20" style={{ width: '15%' }}>
                    <span className="text-white text-sm w-full">{item.price}</span>
                    <div className="text-gray-500 text-xs">{item.priceUSD}</div>
                  </td>

                  {/* 24h Change */}
                  <td className="pl-3 h-20 flex items-center" style={{ width: '10%' }}>
                    <span
                      className="inline-block"
                      style={{
                        color: item.isPositive ? '#00C087' : '#FF4D4F'
                      }}
                    >
                      {item.change24h}
                    </span>
                  </td>

                  {/* 24h High */}
                  <td className="pl-3 text-white h-20 flex items-center" style={{ width: '15%' }}>
                    {item.high24h}
                  </td>

                  {/* 24h Volume */}
                  <td className="pl-3 text-white h-20 flex items-center" style={{ width: '14%' }}>
                    {item.volume24h}
                  </td>

                  {/* Chart */}
                  <td className="pl-3 h-20 flex items-center" style={{ width: '18%' }}>
                    <div
                      ref={(el) => (chartRefs.current[index] = el)}
                      className="w-[180px] h-[36px]"
                    />
                  </td>

                  {/* Trade Button */}
                  <td className="pr-[10px] h-20 flex justify-end items-center" style={{ flex: '1 1 0%' }}>
                    <button 
                      onClick={handleTrade}
                      className="px-3 h-10 leading-10 bg-[#1A1C1E] group-hover:bg-[#A3F030] text-white group-hover:text-black rounded-lg transition-all cursor-pointer text-center"
                    >
                      {t('market.action')}
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </section>
  )
}