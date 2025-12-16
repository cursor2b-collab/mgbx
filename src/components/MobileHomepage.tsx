import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from './ui/button'
import { Card } from './ui/card'
import { 
  Trophy,
  CheckSquare,
  Wallet,
  MoreHorizontal,
  Shield,
  Zap,
  Link as LinkIcon,
  Headphones,
  ChevronRight,
  TrendingUp,
  Sparkles,
  MessageCircle,
  Search,
  ShoppingCart,
  Users,
  Banknote,
  Image as ImageIcon,
  UserPlus
} from 'lucide-react'
import { useAuth } from '../hooks/useAuth'
import { ImageWithFallback } from './figma/ImageWithFallback'
import { motion } from 'motion/react'
import * as echarts from 'echarts'

// 市场数据
interface MarketData {
  symbol: string
  name: string
  price: string
  change: string
  icon: string
}

const QUICK_ACTIONS = [
  {
    imageUrl: 'https://www.nrdx.com/wp-content/uploads/copy-trade-4.png',
    label: '买币',
    description: '快速购买',
    href: '/deposit'
  },
  {
    imageUrl: 'https://www.nrdx.com/wp-content/uploads/copy-trade-1.png',
    label: '跟单',
    description: '跟随专家',
    href: '/mobile?tab=copy'
  },
  {
    imageUrl: 'https://www.nrdx.com/wp-content/uploads/copy-trade-2.png',
    label: 'KYC认证',
    description: '身份验证',
    href: '/kyc'
  },
  {
    imageUrl: 'https://www.nrdx.com/wp-content/uploads/copy-trade-3.png',
    label: '邀请返佣',
    description: '赚取奖励',
    href: '/invite'
  }
]

const FEATURES = [
  {
    icon: Shield,
    title: '安全',
    description: '行業領先的安全加密資産交易平臺，儲備金VS用戶資産>1:1。',
    color: '#A3F030',
    svg: (
      <svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" preserveAspectRatio="xMidYMid meet">
        <circle opacity="0.1" cx="60" cy="60" r="60" fill="#808080"></circle>
        <path d="M92.4092 21.3076L99.4493 34.0476C98.8648 32.9809 97.4723 32.4432 95.8218 32.7381C83.5124 34.9149 73.8591 30.8128 68.4609 27.5432C67.1285 26.7366 65.4093 26.5632 63.6729 26.9361L56.6328 14.1873C58.3606 13.8144 60.0884 13.9879 61.4208 14.7944C66.819 18.0727 76.4723 22.1748 88.7817 19.9893C90.4236 19.6945 91.8161 20.2322 92.4092 21.2989V21.3076Z" fill="#C3F53A"></path>
        <path d="M56.6317 14.1873C54.904 14.5602 53.1762 15.4708 51.8352 16.8498C46.4025 22.4436 36.6891 30.6999 24.3797 33.8047C22.1877 34.3511 20.4341 36.1897 20.4255 38.0283L20.2794 70.646C20.2708 73.0483 20.8983 75.2425 22.0072 77.2459L29.0473 89.986C27.9384 87.9826 27.3109 85.7884 27.3195 83.3861L27.4656 50.7684C27.4656 48.9298 29.2278 47.0999 31.4198 46.5448C43.7292 43.4487 53.4426 35.1923 58.8753 29.5898C60.2163 28.2109 61.9441 27.2916 63.6718 26.9273L56.6317 14.1873Z" fill="#C3F53A"></path>
        <path d="M63.6728 26.9276C65.4006 26.5547 67.1284 26.7281 68.4607 27.5347C73.859 30.8129 83.5123 34.9151 95.8217 32.7296C98.0137 32.3393 99.7587 33.4234 99.7501 35.262L99.604 67.8797C99.5266 84.5919 68.3662 104.808 63.3375 105.883C58.3003 106.967 27.2517 100.09 27.3204 83.3777L27.4666 50.7599C27.4666 48.9214 29.2287 47.0914 31.4207 46.5364C43.7301 43.4403 53.4436 35.1839 58.8762 29.5814C60.2172 28.2025 61.945 27.2832 63.6728 26.9189V26.9276Z" fill="#F7FFF9"></path>
        <path d="M63.6728 26.9276C65.4006 26.5547 67.1284 26.7281 68.4607 27.5347C73.859 30.8129 83.5123 34.9151 95.8217 32.7296C98.0137 32.3393 99.7587 33.4234 99.7501 35.262L99.604 67.8797C99.5266 84.5919 68.3662 104.808 63.3375 105.883C58.3003 106.967 27.2517 100.09 27.3204 83.3777L27.4666 50.7599C27.4666 48.9214 29.2287 47.0914 31.4207 46.5364C43.7301 43.4403 53.4436 35.1839 58.8762 29.5814C60.2172 28.2025 61.945 27.2832 63.6728 26.9189V26.9276Z" stroke="black" strokeMiterlimit="10"></path>
        <path d="M87.3964 40.0835C89.684 39.9382 91.596 41.7656 91.5864 44.0577L91.4992 64.8312C91.4449 77.6296 68.1615 93.115 64.4033 93.942C60.6379 94.769 37.4449 89.5037 37.4991 76.7053L37.5969 54.1856C37.6035 52.6712 38.4579 51.2949 39.8348 50.6642C44.4308 48.5589 55.3177 43.894 64.6456 42.3659C71.8553 41.1848 81.8223 40.4376 87.3964 40.0835Z" fill="#1F2B1F"></path>
        <path d="M77.373 56.4517C78.0059 56.3225 78.642 56.3856 79.123 56.6712C80.0882 57.2393 80.0819 58.4748 79.1104 59.4338L64.1447 74.1996C63.6605 74.6776 63.0244 74.9932 62.3883 75.1225C61.6098 75.2788 60.9769 75.2187 60.4959 74.9361L52.3342 70.1324C51.369 69.5672 51.3753 68.3287 52.3469 67.3698C52.8342 66.8888 53.4672 66.5702 54.1033 66.4439C54.7394 66.3177 55.3723 66.3778 55.8533 66.6634L62.3377 70.4781L75.6166 57.3776C76.1039 56.8966 76.7369 56.578 77.373 56.4517Z" fill="#B9F641"></path>
      </svg>
    )
  },
  {
    icon: Zap,
    title: '快捷',
    description: '高效快速首次上交易，$10即可開啓您的加密之旅。',
    color: '#00D4FF',
    svg: (
      <svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" preserveAspectRatio="xMidYMid meet">
        <circle opacity="0.1" cx="60" cy="60" r="60" fill="#808080"></circle>
        <path d="M108.832 54.1696C109.863 55.6893 108.566 57.4099 105.944 58.0015L32.3091 74.615C29.6876 75.2066 26.7134 74.4522 25.6876 72.9271L5.18243 42.647C4.15121 41.1273 5.44838 39.4067 8.06987 38.8151L81.7049 22.2016C84.3264 21.61 87.3007 22.3644 88.3265 23.8895L108.832 54.1696Z" fill="#1F2B1F" stroke="black" strokeMiterlimit="10"></path>
        <path d="M38.0234 38.5764L51.8799 35.4502L53.9803 38.5493L40.1239 41.6755L38.0234 38.5764Z" fill="#00C605"></path>
        <path d="M15.7822 43.5913L34.8545 39.2927L36.9549 42.3918L17.8772 46.6958L15.7822 43.5913Z" fill="#00C605"></path>
        <path d="M50.4053 97.8113C52.7609 99.1681 56.609 99.1681 58.9645 97.8113L114.624 65.675C116.458 64.6166 116.458 62.8798 114.624 61.8214L79.106 41.3162C76.7505 39.9594 72.9024 39.9594 70.5468 41.3162L15.8321 72.9043C13.4765 74.2612 13.4765 76.4865 15.8321 77.8434L50.4053 97.8058V97.8113Z" fill="#C3F53A"></path>
        <path d="M115.676 62.7605C115.448 62.4186 115.095 62.1038 114.623 61.827L79.1054 41.3219C76.7498 39.965 72.9017 39.965 70.5462 41.3219L33.4111 62.7605H115.676Z" fill="white"></path>
        <path d="M35.3613 89.1276L44.1485 94.2024L107.422 57.6697L98.6353 52.595L35.3613 89.1276Z" fill="#1F2B1F"></path>
        <path d="M50.4053 97.8113C52.7609 99.1681 56.609 99.1681 58.9645 97.8113L114.624 65.675C116.458 64.6166 116.458 62.8798 114.624 61.8214L79.106 41.3162C76.7505 39.9594 72.9024 39.9594 70.5468 41.3162L15.8321 72.9043C13.4765 74.2612 13.4765 76.4865 15.8321 77.8434L50.4053 97.8058V97.8113Z" stroke="black" strokeMiterlimit="10"></path>
      </svg>
    )
  },
  {
    icon: LinkIcon,
    title: '連接',
    description: '和全球投資者在交流，賞時獲取最新加密消息。',
    color: '#FFD700',
    svg: (
      <svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" preserveAspectRatio="xMidYMid meet" fill="none">
        <circle cx="60" cy="60" r="60" opacity=".1" fill="gray"></circle>
        <circle cx="60.276" cy="60.077" r="37.503" fill="#C3F53A" stroke="#000"></circle>
        <path d="M51.3691 96.0014C67.5034 92.0147 79.4661 77.4429 79.4661 60.077C79.4661 42.7111 67.5034 28.1393 51.3691 24.1526C54.2218 23.4477 57.205 23.0737 60.2754 23.0737C80.7118 23.0737 97.2787 39.6407 97.2787 60.077C97.2787 80.5133 80.7118 97.0803 60.2754 97.0803C57.205 97.0803 54.2218 96.7063 51.3691 96.0014Z" fill="#00C605"></path>
        <path fillRule="evenodd" d="M101.525 38.0622C99.5991 37.4745 97.0785 37.2628 94.0382 37.4715C93.2118 37.5282 92.4958 36.9042 92.4391 36.0777C92.3823 35.2512 93.0064 34.5352 93.8328 34.4785C97.0882 34.2551 100.005 34.4619 102.401 35.1928C104.806 35.9269 106.781 37.2238 107.94 39.2306C109.429 41.8097 109.229 44.95 108.018 48.1653C106.802 51.3936 104.49 54.9264 101.356 58.5483C95.0792 65.8032 85.2786 73.6758 73.4552 80.5021C61.6318 87.3283 49.9137 91.8796 40.4922 93.6881C35.7888 94.591 31.5732 94.827 28.1694 94.2659C24.7793 93.7071 21.96 92.3097 20.471 89.7306C18.7662 86.7779 19.2692 83.0987 20.9933 79.3652C21.3406 78.6131 22.2319 78.2849 22.984 78.6323C23.7361 78.9796 24.0642 79.8708 23.7169 80.6229C22.1551 84.0051 22.0857 86.5275 23.069 88.2306C23.9272 89.7169 25.7189 90.8215 28.6573 91.3059C31.582 91.788 35.4125 91.6085 39.9266 90.7419C48.94 89.0117 60.3423 84.6087 71.9552 77.904C83.5682 71.1992 93.0824 63.5261 99.0875 56.5854C102.095 53.1093 104.166 49.8818 105.211 47.1078C106.26 44.3209 106.2 42.2169 105.341 40.7306C104.671 39.5688 103.441 38.6467 101.525 38.0622Z" clipRule="evenodd" fill="#FFC657"></path>
      </svg>
    )
  },
  {
    icon: Headphones,
    title: '服務',
    description: '支持24/7多語言在線服務，隨時爲您解疑答惑。',
    color: '#FF6B6B',
    svg: (
      <svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" preserveAspectRatio="xMidYMid meet">
        <circle opacity="0.1" cx="60" cy="60" r="60" fill="#808080"></circle>
        <path d="M75.2621 86.5133L75.4719 86.9642L75.9239 86.7569C88.4327 81.0197 97.1222 68.3858 97.1222 53.7213C97.1222 33.6591 80.8586 17.3955 60.7965 17.3955C40.7343 17.3955 24.4707 33.6591 24.4707 53.7213C24.4707 55.7229 24.6326 57.6871 24.9442 59.6013L25.0576 60.2979L25.6772 59.9599L28.2552 58.5537L28.5566 58.3893L28.5115 58.049C28.3236 56.6333 28.2265 55.1888 28.2265 53.7213C28.2265 35.7334 42.8086 21.1513 60.7965 21.1513C78.7843 21.1513 93.3664 35.7334 93.3664 53.7213C93.3664 66.8739 85.5702 78.2066 74.3448 83.3484L73.8875 83.5578L74.0996 84.0139L75.2621 86.5133Z" fill="#FFC657" stroke="black"></path>
        <path d="M53.4469 69.2969H52.9469V69.7969V80.9658C52.9469 86.8723 49.59 92.2655 44.2903 94.8733L32.9463 100.455C27.4758 103.147 24.0107 108.714 24.0107 114.811V121.205C24.0107 121.98 24.4566 122.685 25.1562 123.018C47.9985 133.871 74.5117 133.871 97.354 123.018C98.0537 122.685 98.4995 121.98 98.4995 121.205V114.811C98.4995 108.714 95.0344 103.147 89.5639 100.455L78.2199 94.8733C72.9202 92.2655 69.5633 86.8723 69.5633 80.9658V69.7969V69.2969H69.0633H53.4469Z" fill="#C3F53A" stroke="black"></path>
        <circle cx="61.0259" cy="53.4915" r="27.8286" fill="#C3F53A" stroke="black"></circle>
      </svg>
    )
  }
]

// K线数据类型
interface KlineData {
  time: number
  close: number
}

// 简单的条形图渲染（用于滚动卡片）
function SimpleBarChart({ data, isPositive }: { data: KlineData[], isPositive: boolean }) {
  if (!data || data.length === 0) {
    return (
      <div className="mt-3 h-12 flex items-end gap-0.5">
        {[12, 18, 15, 22, 19, 25, 20, 28, 24, 30, 27, 32].map((height, i) => (
          <div key={i} className="flex-1 bg-gray-700 opacity-20 rounded-t" style={{ height: `${height}%` }}></div>
        ))}
      </div>
    )
  }

  const prices = data.map(d => d.close)
  const minPrice = Math.min(...prices)
  const maxPrice = Math.max(...prices)
  const priceRange = maxPrice - minPrice || 1

  return (
    <div className="mt-3 h-12 flex items-end gap-0.5">
      {data.slice(0, 12).map((item, i) => {
        const normalizedHeight = ((item.close - minPrice) / priceRange) * 70 + 15
        return (
          <div 
            key={i} 
            className="flex-1 rounded-t"
            style={{ 
              height: `${normalizedHeight}%`,
              backgroundColor: isPositive ? '#00C087' : '#FF4D4F',
              opacity: 0.3
            }}
          ></div>
        )
      })}
    </div>
  )
}

const SYMBOL_ICON_MAP: Record<string, string> = {
  BTC: 'https://assets.coingecko.com/coins/images/1/small/bitcoin.png',
  ETH: 'https://assets.coingecko.com/coins/images/279/small/ethereum.png',
  SOL: 'https://assets.coingecko.com/coins/images/4128/small/solana.png',
  BNB: 'https://assets.coingecko.com/coins/images/825/small/bnb-icon2_2x.png',
  XRP: 'https://assets.coingecko.com/coins/images/44/small/xrp-symbol-white-128.png',
  TRX: 'https://assets.coingecko.com/coins/images/1094/small/tron-logo.png',
  ADA: 'https://assets.coingecko.com/coins/images/975/small/cardano.png',
  DOGE: 'https://assets.coingecko.com/coins/images/5/small/dogecoin.png',
  DOT: 'https://assets.coingecko.com/coins/images/12171/small/polkadot.png',
  MATIC: 'https://assets.coingecko.com/coins/images/4713/small/polygon.png',
  AVAX: 'https://assets.coingecko.com/coins/images/12559/small/coin-round-red.png'
}

function getIconForSymbol(symbol: string) {
  const name = symbol.replace('USDT', '').toUpperCase()
  return SYMBOL_ICON_MAP[name] || 'https://www.svgrepo.com/show/428655/crypto-coin.svg'
}

export function MobileHomepage() {
  const navigate = useNavigate()
  const { isAuthenticated } = useAuth()
  const [activeTab, setActiveTab] = useState<'contracts' | 'spot' | 'gainers'>('contracts')
  const [marketData, setMarketData] = useState<MarketData[]>([])
  const [loading, setLoading] = useState(true)
  const [klineData, setKlineData] = useState<{ [key: string]: KlineData[] }>({})
  const chartRefs = useRef<(HTMLDivElement | null)[]>([])

  // 获取市场数据
  useEffect(() => {
    const fetchMarketData = async () => {
      try {
        const response = await fetch('https://api.binance.com/api/v3/ticker/24hr')
        
        if (!response.ok) {
          throw new Error('Failed to fetch market data')
        }
        
        const data = await response.json()
        
        // 根据不同标签页选择不同的币种
        let symbols: string[] = []
        let filteredData: MarketData[] = []
        
        if (activeTab === 'contracts') {
          // 热门合约 - 主流币种
          symbols = ['BTCUSDT', 'ETHUSDT', 'SOLUSDT', 'BNBUSDT', 'XRPUSDT']
          filteredData = data
            .filter((item: any) => symbols.includes(item.symbol))
            .map((item: any) => {
              const price = parseFloat(item.lastPrice)
              const formattedPrice = price >= 1 
                ? price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
                : price.toFixed(6)
              
              return {
                symbol: item.symbol,
                name: item.symbol.replace('USDT', ''),
                price: formattedPrice,
                change: parseFloat(item.priceChangePercent).toFixed(2),
                icon: getIconForSymbol(item.symbol)
              }
            })
        } else if (activeTab === 'spot') {
          // 热门现货 - 其他流行币种
          symbols = ['ADAUSDT', 'DOGEUSDT', 'DOTUSDT', 'MATICUSDT', 'AVAXUSDT']
          filteredData = data
            .filter((item: any) => symbols.includes(item.symbol))
            .map((item: any) => {
              const price = parseFloat(item.lastPrice)
              const formattedPrice = price >= 1 
                ? price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
                : price.toFixed(6)
              
              return {
                symbol: item.symbol,
                name: item.symbol.replace('USDT', ''),
                price: formattedPrice,
                change: parseFloat(item.priceChangePercent).toFixed(2),
                icon: getIconForSymbol(item.symbol)
              }
            })
        } else if (activeTab === 'gainers') {
          // 涨幅榜 - 按涨幅排序，只显示USDT交易对
          filteredData = data
            .filter((item: any) => 
              item.symbol.endsWith('USDT') && 
              parseFloat(item.priceChangePercent) > 0 &&
              parseFloat(item.lastPrice) > 0.01 && // 过滤掉价格太低的币
              parseFloat(item.volume) > 1000000 // 过滤掉交易量太小的币
            )
            .sort((a: any, b: any) => parseFloat(b.priceChangePercent) - parseFloat(a.priceChangePercent))
            .slice(0, 5)
            .map((item: any) => {
              const price = parseFloat(item.lastPrice)
              const formattedPrice = price >= 1 
                ? price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
                : price.toFixed(6)
              
              return {
                symbol: item.symbol,
                name: item.symbol.replace('USDT', ''),
                price: formattedPrice,
                change: parseFloat(item.priceChangePercent).toFixed(2),
                icon: getIconForSymbol(item.symbol)
              }
            })
        }

        setMarketData(filteredData)
      } catch (error) {
        // API调用失败，使用模拟数据（静默失败）
        let mockData: MarketData[] = []
        
        if (activeTab === 'contracts') {
          mockData = [
            { symbol: 'BTCUSDT', name: 'BTC', price: '67,234.50', change: '2.34', icon: getIconForSymbol('BTCUSDT') },
            { symbol: 'ETHUSDT', name: 'ETH', price: '3,456.78', change: '-1.23', icon: getIconForSymbol('ETHUSDT') },
            { symbol: 'SOLUSDT', name: 'SOL', price: '145.23', change: '5.67', icon: getIconForSymbol('SOLUSDT') },
            { symbol: 'BNBUSDT', name: 'BNB', price: '345.67', change: '3.45', icon: getIconForSymbol('BNBUSDT') },
            { symbol: 'XRPUSDT', name: 'XRP', price: '0.623400', change: '1.56', icon: getIconForSymbol('XRPUSDT') },
          ]
        } else if (activeTab === 'spot') {
          mockData = [
            { symbol: 'ADAUSDT', name: 'ADA', price: '0.485600', change: '2.45', icon: getIconForSymbol('ADAUSDT') },
            { symbol: 'DOGEUSDT', name: 'DOGE', price: '0.087500', change: '4.12', icon: getIconForSymbol('DOGEUSDT') },
            { symbol: 'DOTUSDT', name: 'DOT', price: '6.234000', change: '-0.89', icon: getIconForSymbol('DOTUSDT') },
            { symbol: 'MATICUSDT', name: 'MATIC', price: '0.876500', change: '1.67', icon: getIconForSymbol('MATICUSDT') },
            { symbol: 'AVAXUSDT', name: 'AVAX', price: '34.560000', change: '3.21', icon: getIconForSymbol('AVAXUSDT') },
          ]
        } else if (activeTab === 'gainers') {
          mockData = [
            { symbol: 'INJUSDT', name: 'INJ', price: '28.450000', change: '12.45', icon: getIconForSymbol('INJUSDT') },
            { symbol: 'ARBUSDT', name: 'ARB', price: '1.234000', change: '9.87', icon: getIconForSymbol('ARBUSDT') },
            { symbol: 'OPUSDT', name: 'OP', price: '2.567000', change: '8.56', icon: getIconForSymbol('OPUSDT') },
            { symbol: 'LINKUSDT', name: 'LINK', price: '15.340000', change: '7.23', icon: getIconForSymbol('LINKUSDT') },
            { symbol: 'NEARUSDT', name: 'NEAR', price: '3.450000', change: '6.78', icon: getIconForSymbol('NEARUSDT') },
          ]
        }
        
        setMarketData(mockData)
      } finally {
        setLoading(false)
      }
    }

    fetchMarketData()
    const interval = setInterval(fetchMarketData, 10000)
    return () => clearInterval(interval)
  }, [activeTab])

  // 获取K线数据（5分钟，48根，和PC端一致）
  useEffect(() => {
    const fetchKlineData = async () => {
      // 根据activeTab获取对应的币种
      let symbols: string[] = []
      if (activeTab === 'contracts') {
        symbols = ['BTCUSDT', 'ETHUSDT', 'SOLUSDT', 'BNBUSDT', 'XRPUSDT']
      } else if (activeTab === 'spot') {
        symbols = ['ADAUSDT', 'DOGEUSDT', 'DOTUSDT', 'MATICUSDT', 'AVAXUSDT']
      } else if (activeTab === 'gainers') {
        // 涨幅榜的K线数据会在marketData更新后动态获取
        symbols = marketData.map(item => item.symbol)
      }

      const klineDataMap: { [key: string]: KlineData[] } = {}

      try {
        for (const symbol of symbols) {
          const response = await fetch(
            `https://api.binance.com/api/v3/klines?symbol=${symbol}&interval=5m&limit=48`)
          
          if (response.ok) {
            const data = await response.json()
            klineDataMap[symbol] = data.map((item: any) => ({
              time: item[0],
              close: parseFloat(item[4])
            }))
          }
        }
        
        setKlineData(klineDataMap)
      } catch (error) {
        console.error('Failed to fetch kline data:', error)
      }
    }

    fetchKlineData()
    const interval = setInterval(fetchKlineData, 60000)
    return () => clearInterval(interval)
  }, [activeTab, marketData])

  // 初始化ECharts图表
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
        const itemKlineData = klineData[item.symbol]
        
        if (chartDom && itemKlineData && itemKlineData.length > 0) {
          const chart = echarts.init(chartDom)
          const isPositive = parseFloat(item.change) >= 0
          
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
                data: itemKlineData.map(k => k.close),
                type: 'line',
                smooth: true,
                symbol: 'none',
                lineStyle: {
                  color: isPositive ? '#00C087' : '#FF4D4F',
                  width: 1.5
                },
                areaStyle: {
                  color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                    {
                      offset: 0,
                      color: isPositive ? 'rgba(0, 192, 135, 0.3)' : 'rgba(255, 77, 79, 0.3)'
                    },
                    {
                      offset: 1,
                      color: isPositive ? 'rgba(0, 192, 135, 0)' : 'rgba(255, 77, 79, 0)'
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
  }, [marketData, klineData])

  // 无缝循环滚动效果
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const [isPaused, setIsPaused] = useState(false)
  
  useEffect(() => {
    const container = scrollContainerRef.current
    if (!container) return

    let scrollPosition = 0
    const scrollSpeed = 0.3 // 滚动速度（降低到0.3，更慢更舒适）
    let animationFrameId: number
    
    // 计算单组卡片的宽度（5个卡片 * 160px宽度 + 4个间隙 * 12px）
    const cardWidth = 160
    const gap = 12
    const cardsCount = 5
    const singleSetWidth = (cardWidth + gap) * cardsCount

    const autoScroll = () => {
      if (!container || isPaused) {
        animationFrameId = requestAnimationFrame(autoScroll)
        return
      }

      scrollPosition += scrollSpeed
      
      // 当滚动超过第一组内容时，无缝重置
      if (scrollPosition >= singleSetWidth) {
        scrollPosition = 0
      }
      
      container.scrollLeft = scrollPosition
      animationFrameId = requestAnimationFrame(autoScroll)
    }

    animationFrameId = requestAnimationFrame(autoScroll)

    return () => {
      cancelAnimationFrame(animationFrameId)
    }
  }, [isPaused])

  return (
    <div className="min-h-screen bg-black pb-32">
      {/* Hero Section with Welcome Bonus */}
      <section className="px-4 pt-20 pb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          {/* 3D Icon */}
          <div className="mb-6 flex justify-center">
            <div className="relative w-48 h-48">
              {/* Banner Image */}
              <div className="w-full h-full flex items-center justify-center">
                <ImageWithFallback
                  src="https://cy-747263170.imgix.net/888.png"
                  alt="新人禮包"
                  className="w-full h-full object-cover rounded-2xl"
                  style={{
                    animation: 'float 3s ease-in-out infinite'
                  }}
                />
              </div>
              {/* Glow Effect */}
              <div className="absolute inset-0 bg-[#A3F030] opacity-20 blur-3xl -z-10"></div>
            </div>
          </div>

          {/* Title */}
          <h1 className="text-4xl mb-2">
            <span className="text-[#A3F030]">$10,000</span>
            <span className="text-white"> 新人禮包</span>
          </h1>

          {/* Subtitle */}
          <p className="text-gray-400 mb-6">解鎖新手獎勵</p>

          {/* CTA Button */}
          <Button
            onClick={() => navigate(isAuthenticated ? '/trading' : '/login')}
            className="w-full max-w-xs bg-[#A3F030] hover:bg-[#8FD622] text-black rounded-full py-6 text-lg transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            {isAuthenticated ? '開始交易' : '註冊/登入'}
          </Button>

          {/* CTA Animation */}
          <div className="relative mt-10 h-40 overflow-hidden flex items-center justify-center">
            <div className="absolute inset-0 flex items-center justify-center">
              <video
                className="w-full h-full object-contain opacity-100"
                autoPlay
                loop
                muted
                playsInline
                preload="auto"
                poster="https://www.okx.com/cdn/assets/imgs/2210/2763D233C494439D.jpg?x-oss-process=image/format,webp/ignore-error,1"
                style={{ mixBlendMode: 'normal', filter: 'contrast(1.15) brightness(1.05)' }}
              >
                <source
                  src="https://www.okx.com/cdn/assets/files/2210/1F383F502741A3F160C6.mp4"
                  type="video/mp4"
                />
                <source
                  src="https://www.okx.com/cdn/assets/files/2210/D47D930F643E7A00.webm"
                  type="video/webm"
                />
              </video>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Quick Actions */}
      <section className="px-4 py-4 border-y border-gray-800">
        <div className="grid grid-cols-4 gap-4">
          {QUICK_ACTIONS.map((action, index) => (
            <motion.button
              key={action.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="flex flex-col items-center justify-center gap-2 group"
              onClick={() => {
                if (action.href) {
                  navigate(action.href)
                }
              }}
            >
              <ImageWithFallback
                src={action.imageUrl}
                alt={action.label}
                className="w-14 h-14 object-contain group-hover:opacity-80 transition-opacity"
              />
              <span
                className="text-xs text-gray-300 text-center"
                style={['邀请返佣', 'KYC认证'].includes(action.label) ? { transform: 'translateX(-4px)' } : undefined}
              >
                {action.label}
              </span>
            </motion.button>
          ))}
        </div>
      </section>

      {/* Promotional Cards */}
      <section className="py-6">
        <div className="px-4 mb-3 flex items-center justify-between">
          <h2 className="text-white">市场行情</h2>
          <button className="text-xs text-gray-400">更多 →</button>
        </div>
        <div 
          ref={scrollContainerRef} 
          className="overflow-x-auto scrollbar-hide"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          onTouchStart={() => setIsPaused(true)}
          onTouchEnd={() => setIsPaused(false)}
        >
          <div className="flex gap-3 px-4 pb-2" style={{ width: 'max-content' }}>
            {/* BTC Card */}
            <motion.button
              type="button"
              onClick={() => navigate(`/trading?symbol=BTCUSDT`)}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4 }}
              className="min-w-[160px] bg-gradient-to-br from-gray-900 to-black border border-gray-800 rounded-xl p-4 relative overflow-hidden text-left"
            >
              <div className="absolute top-0 right-0 w-16 h-16 bg-[#A3F030] opacity-5 blur-xl"></div>
              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-2">
                  <ImageWithFallback
                    src="https://assets.coingecko.com/coins/images/1/small/bitcoin.png"
                    alt="BTC"
                    className="w-6 h-6"
                  />
                  <span className="text-white text-sm">BTC</span>
                </div>
                <div className="text-xl text-white mb-1">
                  {marketData.find(m => m.symbol === 'BTCUSDT')?.price || '$43,521'}
                </div>
                <div className={`flex items-center gap-1 text-xs ${
                  parseFloat(marketData.find(m => m.symbol === 'BTCUSDT')?.change || '2.34') >= 0 
                    ? 'text-[#A3F030]' 
                    : 'text-red-400'
                }`}>
                  <TrendingUp className={`w-3 h-3 ${
                    parseFloat(marketData.find(m => m.symbol === 'BTCUSDT')?.change || '2.34') >= 0 
                      ? '' 
                      : 'rotate-180'
                  }`} />
                  <span>{marketData.find(m => m.symbol === 'BTCUSDT')?.change || '+2.34'}%</span>
                </div>
                <SimpleBarChart 
                  data={klineData['BTCUSDT'] || []} 
                  isPositive={parseFloat(marketData.find(m => m.symbol === 'BTCUSDT')?.change || '2.34') >= 0}
                />
              </div>
            </motion.button>

            {/* ETH Card */}
            <motion.button
              type="button"
              onClick={() => navigate(`/trading?symbol=ETHUSDT`)}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="min-w-[160px] bg-gradient-to-br from-gray-900 to-black border border-gray-800 rounded-xl p-4 relative overflow-hidden text-left"
            >
              <div className="absolute top-0 right-0 w-16 h-16 bg-blue-500 opacity-5 blur-xl"></div>
              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-2">
                  <ImageWithFallback
                    src="https://assets.coingecko.com/coins/images/279/small/ethereum.png"
                    alt="ETH"
                    className="w-6 h-6"
                  />
                  <span className="text-white text-sm">ETH</span>
                </div>
                <div className="text-xl text-white mb-1">
                  {marketData.find(m => m.symbol === 'ETHUSDT')?.price || '$2,287'}
                </div>
                <div className={`flex items-center gap-1 text-xs ${
                  parseFloat(marketData.find(m => m.symbol === 'ETHUSDT')?.change || '1.89') >= 0 
                    ? 'text-[#A3F030]' 
                    : 'text-red-400'
                }`}>
                  <TrendingUp className={`w-3 h-3 ${
                    parseFloat(marketData.find(m => m.symbol === 'ETHUSDT')?.change || '1.89') >= 0 
                      ? '' 
                      : 'rotate-180'
                  }`} />
                  <span>{marketData.find(m => m.symbol === 'ETHUSDT')?.change || '+1.89'}%</span>
                </div>
                <SimpleBarChart 
                  data={klineData['ETHUSDT'] || []} 
                  isPositive={parseFloat(marketData.find(m => m.symbol === 'ETHUSDT')?.change || '1.89') >= 0}
                />
              </div>
            </motion.button>

            {/* SOL Card */}
            <motion.button
              type="button"
              onClick={() => navigate(`/trading?symbol=SOLUSDT`)}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
              className="min-w-[160px] bg-gradient-to-br from-gray-900 to-black border border-gray-800 rounded-xl p-4 relative overflow-hidden text-left"
            >
              <div className="absolute top-0 right-0 w-16 h-16 bg-purple-500 opacity-5 blur-xl"></div>
              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-2">
                  <ImageWithFallback
                    src="https://assets.coingecko.com/coins/images/4128/small/solana.png"
                    alt="SOL"
                    className="w-6 h-6"
                  />
                  <span className="text-white text-sm">SOL</span>
                </div>
                <div className="text-xl text-white mb-1">
                  {marketData.find(m => m.symbol === 'SOLUSDT')?.price || '$98.45'}
                </div>
                <div className={`flex items-center gap-1 text-xs ${
                  parseFloat(marketData.find(m => m.symbol === 'SOLUSDT')?.change || '-0.56') >= 0 
                    ? 'text-[#A3F030]' 
                    : 'text-red-400'
                }`}>
                  <TrendingUp className={`w-3 h-3 ${
                    parseFloat(marketData.find(m => m.symbol === 'SOLUSDT')?.change || '-0.56') >= 0 
                      ? '' 
                      : 'rotate-180'
                  }`} />
                  <span>{marketData.find(m => m.symbol === 'SOLUSDT')?.change || '-0.56'}%</span>
                </div>
                <SimpleBarChart 
                  data={klineData['SOLUSDT'] || []} 
                  isPositive={parseFloat(marketData.find(m => m.symbol === 'SOLUSDT')?.change || '-0.56') >= 0}
                />
              </div>
            </motion.button>

            {/* BNB Card */}
            <motion.button
              type="button"
              onClick={() => navigate(`/trading?symbol=BNBUSDT`)}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.3 }}
              className="min-w-[160px] bg-gradient-to-br from-gray-900 to-black border border-gray-800 rounded-xl p-4 relative overflow-hidden text-left"
            >
              <div className="absolute top-0 right-0 w-16 h-16 bg-yellow-500 opacity-5 blur-xl"></div>
              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-2">
                  <ImageWithFallback
                    src="https://assets.coingecko.com/coins/images/825/small/bnb-icon2_2x.png"
                    alt="BNB"
                    className="w-6 h-6"
                  />
                  <span className="text-white text-sm">BNB</span>
                </div>
                <div className="text-xl text-white mb-1">
                  {marketData.find(m => m.symbol === 'BNBUSDT')?.price || '$312.87'}
                </div>
                <div className={`flex items-center gap-1 text-xs ${
                  parseFloat(marketData.find(m => m.symbol === 'BNBUSDT')?.change || '3.12') >= 0 
                    ? 'text-[#A3F030]' 
                    : 'text-red-400'
                }`}>
                  <TrendingUp className={`w-3 h-3 ${
                    parseFloat(marketData.find(m => m.symbol === 'BNBUSDT')?.change || '3.12') >= 0 
                      ? '' 
                      : 'rotate-180'
                  }`} />
                  <span>{marketData.find(m => m.symbol === 'BNBUSDT')?.change || '+3.12'}%</span>
                </div>
                <SimpleBarChart 
                  data={klineData['BNBUSDT'] || []} 
                  isPositive={parseFloat(marketData.find(m => m.symbol === 'BNBUSDT')?.change || '3.12') >= 0}
                />
              </div>
            </motion.button>

            {/* XRP Card */}
            <button
              type="button"
              onClick={() => navigate(`/trading?symbol=XRPUSDT`)}
              className="min-w-[160px] bg-gradient-to-br from-gray-900 to-black border border-gray-800 rounded-xl p-4 relative overflow-hidden text-left"
            >
              <div className="absolute top-0 right-0 w-16 h-16 bg-gray-500 opacity-5 blur-xl"></div>
              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-2">
                  <ImageWithFallback
                    src="https://assets.coingecko.com/coins/images/44/small/xrp-symbol-white-128.png"
                    alt="XRP"
                    className="w-6 h-6"
                  />
                  <span className="text-white text-sm">XRP</span>
                </div>
                <div className="text-xl text-white mb-1">
                  {marketData.find(m => m.symbol === 'XRPUSDT')?.price || '$0.6234'}
                </div>
                <div className={`flex items-center gap-1 text-xs ${
                  parseFloat(marketData.find(m => m.symbol === 'XRPUSDT')?.change || '1.23') >= 0 
                    ? 'text-[#A3F030]' 
                    : 'text-red-400'
                }`}>
                  <TrendingUp className={`w-3 h-3 ${
                    parseFloat(marketData.find(m => m.symbol === 'XRPUSDT')?.change || '1.23') >= 0 
                      ? '' 
                      : 'rotate-180'
                  }`} />
                  <span>{marketData.find(m => m.symbol === 'XRPUSDT')?.change || '+1.23'}%</span>
                </div>
                <SimpleBarChart 
                  data={klineData['XRPUSDT'] || []} 
                  isPositive={parseFloat(marketData.find(m => m.symbol === 'XRPUSDT')?.change || '1.23') >= 0}
                />
              </div>
            </button>
          </div>
        </div>
      </section>

      {/* Market Section */}
      <section className="px-4 py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-white text-2xl">市場趨勢</h2>
          <button 
            onClick={() => navigate('/markets')}
            className="text-xs text-gray-400 hover:text-white transition-colors"
          >
            更多 →
          </button>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-6 mb-6 border-b border-gray-800 overflow-x-auto scrollbar-hide">
          <button
            onClick={() => setActiveTab('contracts')}
            className={`pb-3 px-1 relative transition-colors whitespace-nowrap ${
              activeTab === 'contracts' ? 'text-white' : 'text-gray-500'
            }`}
          >
            熱門合約
            {activeTab === 'contracts' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-white"></div>
            )}
          </button>
          <button
            onClick={() => setActiveTab('spot')}
            className={`pb-3 px-1 relative transition-colors whitespace-nowrap ${
              activeTab === 'spot' ? 'text-white' : 'text-gray-500'
            }`}
          >
            熱門現貨
            {activeTab === 'spot' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-white"></div>
            )}
          </button>
          <button
            onClick={() => setActiveTab('gainers')}
            className={`pb-3 px-1 relative transition-colors whitespace-nowrap ${
              activeTab === 'gainers' ? 'text-white' : 'text-gray-500'
            }`}
          >
            漲幅榜
            {activeTab === 'gainers' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-white"></div>
            )}
          </button>
        </div>

        {/* Market Table */}
        <div className="overflow-x-auto scrollbar-hide">
          <table className="w-full min-w-full">
            {/* Table Header */}
            <thead>
              <tr className="border-b border-white/10">
                <th className="text-left py-2.5 text-gray-500 text-xs pl-0 w-[75px]">名稱</th>
                <th className="text-right py-2.5 text-gray-500 text-xs w-[75px]">價格</th>
                <th className="text-right py-2.5 text-gray-500 text-xs w-[60px]">漲跌</th>
                <th className="text-center py-2.5 text-gray-500 text-xs w-[65px]">走勢</th>
              </tr>
            </thead>

            {/* Table Body */}
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={4} className="py-8 text-center text-gray-500 text-sm">
                    加載中...
                  </td>
                </tr>
              ) : (
                marketData.map((item, index) => (
                  <tr
                    key={item.symbol}
                    onClick={() => navigate(`/trading?symbol=${item.symbol}`)}
                    className="border-b border-white/5 hover:bg-[#1A1C1E] transition-colors group cursor-pointer active:bg-[#252729]"
                  >
                    {/* Symbol */}
                    <td className="py-3 pl-0">
                      <div className="flex items-center gap-1">
                        <ImageWithFallback
                          src={getIconForSymbol(item.symbol)}
                          alt={item.symbol.replace('USDT', '')}
                          className="w-5 h-5"
                        />
                        <span className="text-white text-xs truncate">{item.symbol.replace('USDT', '')}</span>
                      </div>
                    </td>

                    {/* Price */}
                    <td className="py-3 text-right">
                      <div className="text-white text-xs truncate">{item.price}</div>
                    </td>

                    {/* 24h Change */}
                    <td className="py-3 text-right">
                      <span
                        className="text-xs whitespace-nowrap"
                        style={{
                          color: parseFloat(item.change) >= 0 ? '#00C087' : '#FF4D4F'
                        }}
                      >
                        {parseFloat(item.change) >= 0 ? '+' : ''}
                        {item.change}%
                      </span>
                    </td>

                    {/* Chart */}
                    <td className="py-3">
                      <div className="flex justify-center">
                        <div
                          ref={(el) => (chartRefs.current[index] = el)}
                          className="w-12 h-5"
                        />
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="px-4 py-8">
        <h2 className="text-white text-2xl mb-6">為什麼選擇我們？</h2>
        
        <div className="overflow-x-auto scrollbar-hide -mx-4 px-4">
          <div className="flex gap-4 pb-2">
            {FEATURES.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="min-w-[280px]"
              >
                <div className="group relative bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-sm rounded-2xl p-4 border border-white/10 hover:border-[#A3F030]/30 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-[#A3F030]/10 h-full">
                  {/* 背景光效 */}
                  <div className="absolute inset-0 bg-gradient-to-br from-[#A3F030]/0 via-[#A3F030]/0 to-[#A3F030]/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  
                  {/* 内容 */}
                  <div className="relative z-10 flex flex-col items-center text-center gap-3">
                    {/* SVG Icon */}
                    <div className="w-full aspect-square max-w-[100px] transform group-hover:scale-110 transition-transform duration-500">
                      {feature.svg}
                    </div>

                    {/* Content */}
                    <div>
                      <h3 className="text-white mb-1.5 text-base">{feature.title}</h3>
                      <p className="text-xs text-gray-400 leading-relaxed">{feature.description}</p>
                    </div>
                  </div>

                  {/* 底部装饰线 */}
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#A3F030] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-b-2xl" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-4 py-8">
        <Card className="bg-gradient-to-br from-gray-900 via-[#A3F030]/10 to-gray-900 border-[#A3F030]/30 p-8 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-[#A3F030] opacity-5"></div>
          <div className="relative z-10">
            <h3 className="text-white text-2xl mb-3">開啓您的交易之旅</h3>
            <p className="text-gray-400 mb-6">立即註冊，領取新人專屬禮包</p>
            <Button
              onClick={() => navigate(isAuthenticated ? '/trading' : '/login')}
              className="bg-[#A3F030] hover:bg-[#8FD622] text-black px-8 py-4 rounded-full transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              {isAuthenticated ? '立即交易' : '立即註冊'}
            </Button>
          </div>
        </Card>
      </section>
    </div>
  )
}