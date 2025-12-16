import { useState, useEffect } from 'react'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Checkbox } from './ui/checkbox'
import { 
  BarChart3,
  Star,
  TrendingUp,
  TrendingDown,
  ChevronDown,
  MoreHorizontal
} from 'lucide-react'

interface OrderBookItem {
  price: number
  amount: number
}

export function MobileContractTradingPage() {
  const [selectedSymbol] = useState('BTC/USDT')
  const [currentPrice] = useState(103254.71)
  const [changePercent] = useState(-0.45)
  const [orderType, setOrderType] = useState<'market' | 'limit'>('market')
  const [marginMode, setMarginMode] = useState<'cross' | 'isolated'>('cross')
  const [leverage, setLeverage] = useState('10X')
  const [price, setPrice] = useState('')
  const [quantity, setQuantity] = useState('')
  const [sliderValue, setSliderValue] = useState(0)
  const [longStopLoss, setLongStopLoss] = useState(false)
  const [shortStopLoss, setShortStopLoss] = useState(false)
  const [favorites, setFavorites] = useState<Set<string>>(new Set())
  const [activeTab, setActiveTab] = useState<'current' | 'history'>('current')

  // 订单簿数据
  const [buyOrders, setBuyOrders] = useState<OrderBookItem[]>([])
  const [sellOrders, setSellOrders] = useState<OrderBookItem[]>([])

  useEffect(() => {
    // 生成模拟订单簿数据
    const generateOrders = (basePrice: number, isBuy: boolean): OrderBookItem[] => {
      const orders: OrderBookItem[] = []
      for (let i = 0; i < 15; i++) {
        const priceOffset = isBuy ? -(i + 1) * 0.5 : (i + 1) * 0.5
        const price = basePrice + priceOffset
        const amount = Math.random() * 2 + 0.0001
        orders.push({ price, amount })
      }
      return orders
    }

    setBuyOrders(generateOrders(currentPrice, true))
    setSellOrders(generateOrders(currentPrice, false))

    // 每3秒更新订单簿
    const interval = setInterval(() => {
      setBuyOrders(generateOrders(currentPrice, true))
      setSellOrders(generateOrders(currentPrice, false))
    }, 3000)

    return () => clearInterval(interval)
  }, [currentPrice])

  const maxBuyAmount = Math.max(...buyOrders.map(o => o.amount), 1)
  const maxSellAmount = Math.max(...sellOrders.map(o => o.amount), 1)

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

  return (
    <div className="bg-[#0A0A0A] text-white min-h-screen">
      {/* 顶部导航 */}
      <div className="px-4 py-3 border-b border-white/10">
        <div className="flex gap-6 text-sm">
          <button className="text-white">交易</button>
          <button className="text-white/50">跟单</button>
          <button className="text-white/50">质押挖矿</button>
        </div>
      </div>

      {/* 二级导航 */}
      <div className="px-4 py-3 border-b border-white/10">
        <div className="flex gap-6 text-sm overflow-x-auto">
          <button className="text-white/50 whitespace-nowrap">股票</button>
          <button className="text-white/50 whitespace-nowrap">币币</button>
          <button className="text-white relative whitespace-nowrap">
            加密货币合约
            <div className="absolute -bottom-3 left-0 right-0 h-0.5 bg-[#A3F030]"></div>
          </button>
          <button className="text-white/50 whitespace-nowrap">秒合约</button>
          <button className="text-white/50 whitespace-nowrap">期权</button>
          <button className="text-white/50 whitespace-nowrap">外汇</button>
        </div>
      </div>

      {/* 交易对信息栏 */}
      <div className="px-4 py-3 border-b border-white/10">
        <div className="flex items-start justify-between mb-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-white">{selectedSymbol}</span>
              <ChevronDown className="w-4 h-4 text-white/50" />
            </div>
            <div className="flex items-center gap-2">
              <span className={`text-lg ${changePercent >= 0 ? 'text-[#A3F030]' : 'text-red-500'}`}>
                {currentPrice.toFixed(2)}
              </span>
              <span className={`text-sm ${changePercent >= 0 ? 'text-[#A3F030]' : 'text-red-500'}`}>
                {changePercent >= 0 ? '+' : ''}{changePercent}%
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button className="p-1.5">
              <BarChart3 className="w-5 h-5 text-white/60" />
            </button>
            <button 
              onClick={() => toggleFavorite(selectedSymbol)}
              className="p-1.5"
            >
              <Star 
                className={`w-5 h-5 transition-colors ${
                  favorites.has(selectedSymbol) 
                    ? 'fill-yellow-400 text-yellow-400' 
                    : 'text-white/60'
                }`}
              />
            </button>
            <button className="p-1.5">
              <MoreHorizontal className="w-5 h-5 text-white/60" />
            </button>
          </div>
        </div>

        {/* 价格和数量标签 */}
        <div className="flex items-center justify-between text-xs text-white/50">
          <span>价格<br />(USDT)</span>
          <span>数量<br />(BTC)</span>
        </div>
      </div>

      {/* 主要内容区域：交易表单 + 订单簿 */}
      <div className="grid grid-cols-[1fr_auto] gap-0">
        {/* 左侧：交易表单 */}
        <div className="px-4 py-4 border-r border-white/10">
          {/* 市价/限价切换 */}
          <div className="flex gap-3 mb-4">
            <button
              onClick={() => setOrderType('market')}
              className={`flex-1 py-2.5 rounded-full text-sm transition-all ${
                orderType === 'market'
                  ? 'bg-[#A3F030] text-black'
                  : 'bg-[#1A1A1A] text-white/70'
              }`}
            >
              市价
            </button>
            <button
              onClick={() => setOrderType('limit')}
              className={`flex-1 py-2.5 rounded-full text-sm transition-all ${
                orderType === 'limit'
                  ? 'bg-[#A3F030] text-black'
                  : 'bg-[#1A1A1A] text-white/70'
              }`}
            >
              限价
            </button>
          </div>

          {/* 全仓/逐仓 和 杠杆选择 */}
          <div className="flex gap-3 mb-4">
            <div className="flex-1 relative">
              <button className="w-full px-4 py-2.5 bg-[#1A1A1A] rounded-lg flex items-center justify-between text-sm">
                <span>{marginMode === 'cross' ? '全仓' : '逐仓'}</span>
                <ChevronDown className="w-4 h-4" />
              </button>
            </div>
            <div className="flex-1 relative">
              <button className="w-full px-4 py-2.5 bg-[#1A1A1A] rounded-lg flex items-center justify-between text-sm">
                <span>{leverage}</span>
                <ChevronDown className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* 限价模式：价格输入 */}
          {orderType === 'limit' && (
            <div className="mb-4">
              <div className="mb-2">
                <div className="flex justify-between text-sm">
                  <span className="text-white/70">价格</span>
                  <span className="text-xs text-white/50">满足价格才能成交</span>
                </div>
              </div>
              <Input
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder={currentPrice.toFixed(2)}
                className="bg-[#1A1A1A] border-white/10 text-white h-12"
              />
            </div>
          )}

          {/* 数量输入 */}
          <div className="mb-4">
            <div className="flex justify-between mb-2">
              <span className="text-sm text-white/70">数量</span>
              <span className="text-sm text-white/50">张</span>
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
          <div className="mb-4">
            <input
              type="range"
              min="0"
              max="100"
              value={sliderValue}
              onChange={(e) => setSliderValue(parseInt(e.target.value))}
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

          {/* 可用余额和换算信息 */}
          <div className="space-y-2 text-sm mb-3">
            <div className="flex justify-between">
              <span className="text-white/50">可用</span>
              <span className="text-white">0 USDT</span>
            </div>
            <div className="flex justify-between">
              <span className="text-white/50">换算</span>
              <span className="text-white">1张=100 USDT</span>
            </div>
          </div>

          {/* 止盈/止损 */}
          <div className="flex items-center gap-2 mb-4">
            <Checkbox 
              id="long-stop"
              checked={longStopLoss}
              onCheckedChange={(checked) => setLongStopLoss(checked as boolean)}
              className="border-white/30"
            />
            <label htmlFor="long-stop" className="text-sm text-white/70 cursor-pointer">
              止盈/止损
            </label>
          </div>

          {/* 可开多信息 */}
          <div className="space-y-2 text-sm mb-3">
            <div className="flex justify-between">
              <span className="text-white/50">可开多</span>
              <span className="text-white">0 张</span>
            </div>
            <div className="flex justify-between">
              <span className="text-white/50">保证金</span>
              <span className="text-white">0 USDT</span>
            </div>
          </div>

          {/* 买入开多按钮 */}
          <Button className="w-full h-12 bg-[#A3F030] hover:bg-[#92d929] text-black rounded-lg mb-4">
            买入开多
          </Button>

          {/* 止盈/止损 */}
          <div className="flex items-center gap-2 mb-4">
            <Checkbox 
              id="short-stop"
              checked={shortStopLoss}
              onCheckedChange={(checked) => setShortStopLoss(checked as boolean)}
              className="border-white/30"
            />
            <label htmlFor="short-stop" className="text-sm text-white/70 cursor-pointer">
              止盈/止损
            </label>
          </div>

          {/* 可开空信息 */}
          <div className="space-y-2 text-sm mb-3">
            <div className="flex justify-between">
              <span className="text-white/50">可开空</span>
              <span className="text-white">0 张</span>
            </div>
            <div className="flex justify-between">
              <span className="text-white/50">保证金</span>
              <span className="text-white">0 USDT</span>
            </div>
          </div>

          {/* 卖出开空按钮 */}
          <Button className="w-full h-12 bg-red-500 hover:bg-red-600 text-white rounded-lg">
            卖出开空
          </Button>
        </div>

        {/* 右侧：订单簿 */}
        <div className="w-32 py-4 pr-4">
          {/* 三个视图切换小图标 */}
          <div className="flex gap-1.5 mb-3 justify-center">
            <button className="w-5 h-5 flex items-center justify-center bg-white/10 rounded">
              <div className="flex flex-col gap-0.5">
                <div className="w-2 h-0.5 bg-red-500"></div>
                <div className="w-2 h-0.5 bg-[#A3F030]"></div>
              </div>
            </button>
            <button className="w-5 h-5 flex items-center justify-center bg-white/5 rounded">
              <div className="flex flex-col gap-0.5">
                <div className="w-2 h-0.5 bg-[#A3F030]"></div>
                <div className="w-2 h-0.5 bg-[#A3F030]"></div>
              </div>
            </button>
            <button className="w-5 h-5 flex items-center justify-center bg-white/5 rounded">
              <div className="flex flex-col gap-0.5">
                <div className="w-2 h-0.5 bg-red-500"></div>
                <div className="w-2 h-0.5 bg-red-500"></div>
              </div>
            </button>
          </div>

          {/* 卖单 (红色) - 倒序显示 */}
          <div className="space-y-0.5 mb-2">
            {sellOrders.slice(0, 6).reverse().map((order, idx) => (
              <div key={idx} className="relative flex justify-between text-xs py-0.5">
                <div 
                  className="absolute right-0 top-0 bottom-0 bg-red-500/10" 
                  style={{ width: `${(order.amount / maxSellAmount) * 100}%` }}
                />
                <span className="relative z-10 text-red-500">{order.price.toFixed(2)}</span>
                <span className="relative z-10 text-white/70">{order.amount.toFixed(8)}</span>
              </div>
            ))}
          </div>

          {/* 最新价格 */}
          <div className={`text-center py-2 my-2 flex flex-col items-center justify-center ${changePercent >= 0 ? 'text-[#A3F030]' : 'text-red-500'}`}>
            <span className="text-lg">{currentPrice.toFixed(2)}</span>
            <div className="flex items-center gap-1 text-xs">
              {changePercent >= 0 ? (
                <TrendingUp className="w-3 h-3" />
              ) : (
                <TrendingDown className="w-3 h-3" />
              )}
              <span>{currentPrice.toFixed(2)}</span>
            </div>
          </div>

          {/* 买单 (绿色) */}
          <div className="space-y-0.5">
            {buyOrders.slice(0, 10).map((order, idx) => (
              <div key={idx} className="relative flex justify-between text-xs py-0.5">
                <div 
                  className="absolute right-0 top-0 bottom-0 bg-[#A3F030]/10" 
                  style={{ width: `${(order.amount / maxBuyAmount) * 100}%` }}
                />
                <span className="relative z-10 text-[#A3F030]">{order.price.toFixed(2)}</span>
                <span className="relative z-10 text-white/70">{order.amount.toFixed(8)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 当前委托和历史订单 */}
      <div className="px-4 py-4 border-t border-white/10">
        <div className="flex gap-6 mb-4">
          <button 
            onClick={() => setActiveTab('current')}
            className={`pb-2 relative ${activeTab === 'current' ? 'text-white' : 'text-white/50'}`}
          >
            当前委托
            {activeTab === 'current' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#A3F030]"></div>
            )}
          </button>
          <button 
            onClick={() => setActiveTab('history')}
            className={`pb-2 relative ${activeTab === 'history' ? 'text-white' : 'text-white/50'}`}
          >
            历史订单
            {activeTab === 'history' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#A3F030]"></div>
            )}
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
