// 临时组件文件 - 用于订单簿和最新成交标签页

import { TrendingUp, TrendingDown } from 'lucide-react'

interface OrderBookItem {
  price: number
  amount: number
}

interface OrderbookTabProps {
  sellOrders: OrderBookItem[]
  buyOrders: OrderBookItem[]
  currentPrice: number
  changePercent: number
  maxSellAmount: number
  maxBuyAmount: number
}

export function OrderbookTab({ sellOrders, buyOrders, currentPrice, changePercent, maxSellAmount, maxBuyAmount }: OrderbookTabProps) {
  return (
    <div className="flex-1 overflow-y-auto px-4 py-4">
      {/* 订单簿视图切换按钮 */}
      <div className="flex gap-2 mb-4">
        <button className="w-8 h-8 flex items-center justify-center bg-white/10 rounded hover:bg-white/20 transition-colors">
          <div className="flex flex-col gap-0.5">
            <div className="w-3 h-0.5 bg-red-500"></div>
            <div className="w-3 h-0.5 bg-[#A3F030]"></div>
          </div>
        </button>
        <button className="w-8 h-8 flex items-center justify-center bg-white/5 rounded hover:bg-white/10 transition-colors">
          <div className="flex flex-col gap-0.5">
            <div className="w-3 h-0.5 bg-[#A3F030]"></div>
            <div className="w-3 h-0.5 bg-[#A3F030]"></div>
          </div>
        </button>
        <button className="w-8 h-8 flex items-center justify-center bg-white/5 rounded hover:bg-white/10 transition-colors">
          <div className="flex flex-col gap-0.5">
            <div className="w-3 h-0.5 bg-red-500"></div>
            <div className="w-3 h-0.5 bg-red-500"></div>
          </div>
        </button>
      </div>

      {/* 订单簿表头 */}
      <div className="flex justify-between text-xs text-white/50 mb-3">
        <span>价格(USDT)</span>
        <span>数量(SOL)</span>
      </div>

      {/* 卖单列表（红色，倒序显示） */}
      <div className="mb-4">
        {sellOrders.slice(0, 10).reverse().map((order, idx) => (
          <div key={idx} className="relative flex justify-between text-sm py-1.5">
            <div 
              className="absolute right-0 top-0 bottom-0 bg-red-500/10" 
              style={{ width: `${(order.amount / maxSellAmount) * 100}%` }}
            />
            <span className="relative z-10 text-red-500">{order.price.toFixed(3)}</span>
            <span className="relative z-10 text-white">{order.amount.toFixed(6)}</span>
          </div>
        ))}
      </div>

      {/* 当前价格 */}
      <div className={`flex items-center justify-between py-3 mb-4 ${changePercent >= 0 ? 'text-[#A3F030]' : 'text-red-500'}`}>
        <div className="flex items-center gap-2">
          <span className="text-2xl">{currentPrice.toFixed(3)}</span>
          {changePercent >= 0 ? (
            <TrendingUp className="w-5 h-5" />
          ) : (
            <TrendingDown className="w-5 h-5" />
          )}
        </div>
        <span className="text-sm text-white/50">{currentPrice.toFixed(2)}</span>
      </div>

      {/* 买单列表（绿色） */}
      <div>
        {buyOrders.slice(0, 20).map((order, idx) => (
          <div key={idx} className="relative flex justify-between text-sm py-1.5">
            <div 
              className="absolute right-0 top-0 bottom-0 bg-[#A3F030]/10" 
              style={{ width: `${(order.amount / maxBuyAmount) * 100}%` }}
            />
            <span className="relative z-10 text-[#A3F030]">{order.price.toFixed(3)}</span>
            <span className="relative z-10 text-white">{order.amount.toFixed(6)}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

interface TradesTabProps {
  currentPrice: number
}

export function TradesTab({ currentPrice }: TradesTabProps) {
  // 生成成交记录
  const trades = (() => {
    const result = []
    const now = new Date()
    for (let i = 0; i < 30; i++) {
      const isBuy = Math.random() > 0.5
      const priceVariance = (Math.random() - 0.5) * 2
      const price = currentPrice + priceVariance
      const amount = Math.random() * 20 + 0.5
      const time = new Date(now.getTime() - i * 1000)
      const timeStr = `${String(time.getHours()).padStart(2, '0')}:${String(time.getMinutes()).padStart(2, '0')}:${String(time.getSeconds()).padStart(2, '0')}`
      
      result.push({
        price: price,
        amount: amount,
        time: timeStr,
        isBuy: isBuy
      })
    }
    return result
  })()

  return (
    <div className="flex-1 overflow-y-auto px-4 py-4">
      {/* 表头 */}
      <div className="flex justify-between text-xs text-white/50 mb-3">
        <span className="flex-1">价格(USDT)</span>
        <span className="flex-1 text-center">数量(SOL)</span>
        <span className="flex-1 text-right">时间</span>
      </div>

      {/* 成交记录列表 */}
      <div className="space-y-0.5">
        {trades.map((trade, idx) => (
          <div key={idx} className="flex justify-between text-sm py-1.5 hover:bg-white/5 transition-colors">
            <span className={`flex-1 ${trade.isBuy ? 'text-[#A3F030]' : 'text-red-500'}`}>
              {trade.price.toFixed(3)}
            </span>
            <span className="flex-1 text-center text-white">
              {trade.amount.toFixed(6)}
            </span>
            <span className="flex-1 text-right text-white/70">
              {trade.time}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
