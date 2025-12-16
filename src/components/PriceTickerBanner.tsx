import { useState, useEffect } from 'react'
import { TrendingUp, TrendingDown } from 'lucide-react'

interface Ticker {
  symbol: string
  price: string
  change: number
}

const INITIAL_TICKERS: Ticker[] = [
  { symbol: 'BTC', price: '43,567.89', change: 2.34 },
  { symbol: 'ETH', price: '2,289.45', change: 3.67 },
  { symbol: 'BNB', price: '312.78', change: -1.23 },
  { symbol: 'SOL', price: '98.34', change: 5.12 },
  { symbol: 'XRP', price: '0.6234', change: -0.89 },
  { symbol: 'ADA', price: '0.4521', change: 1.45 },
  { symbol: 'DOGE', price: '0.0823', change: 2.11 },
  { symbol: 'MATIC', price: '0.7845', change: -2.34 },
]

export function PriceTickerBanner() {
  const [tickers, setTickers] = useState(INITIAL_TICKERS)

  useEffect(() => {
    // 模拟实时价格更新
    const interval = setInterval(() => {
      setTickers(prevTickers =>
        prevTickers.map(ticker => ({
          ...ticker,
          change: ticker.change + (Math.random() - 0.5) * 0.5,
        }))
      )
    }, 3000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="bg-white/5 border-y border-white/10 py-3 overflow-hidden">
      <div className="relative flex">
        <div className="flex gap-8 animate-scroll">
          {[...tickers, ...tickers].map((ticker, index) => (
            <div key={index} className="flex items-center gap-2 whitespace-nowrap px-4">
              <span className="text-gray-400 font-medium">{ticker.symbol}</span>
              <span className="text-white font-semibold">${ticker.price}</span>
              <span
                className={`flex items-center gap-1 text-sm font-medium ${
                  ticker.change >= 0 ? 'text-green-500' : 'text-red-500'
                }`}
              >
                {ticker.change >= 0 ? (
                  <TrendingUp className="w-3 h-3" />
                ) : (
                  <TrendingDown className="w-3 h-3" />
                )}
                {Math.abs(ticker.change).toFixed(2)}%
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
