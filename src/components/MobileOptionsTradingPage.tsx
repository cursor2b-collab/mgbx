import { useState, useEffect, useMemo } from 'react'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { ChevronDown, TrendingUp, TrendingDown, BarChart3, Star, Search, X } from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog'
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerDescription } from './ui/drawer'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { CircleChevronDownIcon } from './ui/circle-chevron-down-icon'

interface OptionsData {
  symbol: string
  pair: string
  price: number
  change: number
  changePercent: number
}

export function MobileOptionsTradingPage() {
  const [selectedPeriod, setSelectedPeriod] = useState<'1min' | '2min'>('1min')
  const [amount, setAmount] = useState('')
  const [balance] = useState(10000.00)
  const [countdown, setCountdown] = useState({ hours: 0, minutes: 0, seconds: 30 })
  const [orderNumber] = useState('202511060001')
  const [selectedTime, setSelectedTime] = useState('15:30:00')
  const [showTimeDropdown, setShowTimeDropdown] = useState(false)
  const [confirmDialog, setConfirmDialog] = useState<{ open: boolean, direction: 'up' | 'down' | null }>({ open: false, direction: null })
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [inlineChartOpen, setInlineChartOpen] = useState(false)
  const [timeframe, setTimeframe] = useState('1D')
  const [favorites, setFavorites] = useState<Set<string>>(new Set())
  const [selectedOption, setSelectedOption] = useState('SEI/USDT')
  
  const optionsList: OptionsData[] = [
    { symbol: 'SEI', pair: 'SEI/USDT', price: 0.4523, change: 0.0032, changePercent: 0.71 },
    { symbol: 'BTC', pair: 'BTC/USDT', price: 43250.50, change: 850.30, changePercent: 2.01 },
    { symbol: 'ETH', pair: 'ETH/USDT', price: 2285.75, change: -45.20, changePercent: -1.94 },
    { symbol: 'BNB', pair: 'BNB/USDT', price: 312.45, change: 8.90, changePercent: 2.93 },
    { symbol: 'SOL', pair: 'SOL/USDT', price: 98.32, change: 3.45, changePercent: 3.64 },
    { symbol: 'ADA', pair: 'ADA/USDT', price: 0.5832, change: -0.0123, changePercent: -2.07 },
    { symbol: 'XRP', pair: 'XRP/USDT', price: 0.6245, change: 0.0189, changePercent: 3.12 },
    { symbol: 'DOT', pair: 'DOT/USDT', price: 7.234, change: 0.156, changePercent: 2.20 },
  ]

  const currentOption = optionsList.find(o => o.pair === selectedOption) || optionsList[0]

  const filteredOptions = optionsList.filter(option =>
    option.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
    option.pair.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const periodOptions = [
    { key: '1min', label: '1分钟', yield: '73-76%' },
    { key: '2min', label: '2分钟', yield: '75-78%' }
  ]

  const timeOptions = [
    '15:30:00', '15:31:00', '15:32:00', '15:33:00', '15:34:00',
    '15:35:00', '15:36:00', '15:37:00', '15:38:00', '15:39:00'
  ]

  // 生成图表数据
  const chartData = useMemo(() => {
    const basePrice = currentOption.price
    const dataPoints = timeframe === '1m' ? 30 : timeframe === '1h' ? 24 : timeframe === '1D' ? 7 : timeframe === '1W' ? 30 : 90
    const data = []
    
    for (let i = 0; i < dataPoints; i++) {
      const randomChange = (Math.random() - 0.5) * basePrice * 0.02
      const price = basePrice + randomChange + (currentOption.changePercent / 100 * basePrice * (i / dataPoints))
      
      let time = ''
      if (timeframe === '1m') {
        time = `${String(i).padStart(2, '0')}:00`
      } else if (timeframe === '1h') {
        time = `${String(i).padStart(2, '0')}:00`
      } else if (timeframe === '1D') {
        const days = ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
        time = days[i % 7]
      } else if (timeframe === '1W') {
        time = `${i + 1}日`
      } else {
        time = `${i + 1}月`
      }
      
      data.push({
        time,
        price: parseFloat(price.toFixed(basePrice < 1 ? 4 : 2)),
        volume: Math.floor(Math.random() * 1000000)
      })
    }
    
    return data
  }, [currentOption, timeframe])

  // 倒计时功能
  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown(prev => {
        let { hours, minutes, seconds } = prev
        
        if (seconds > 0) {
          seconds--
        } else if (minutes > 0) {
          minutes--
          seconds = 59
        } else if (hours > 0) {
          hours--
          minutes = 59
          seconds = 59
        } else {
          // 重置倒计时
          return { hours: 0, minutes: 0, seconds: 30 }
        }
        
        return { hours, minutes, seconds }
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  const handlePercentageClick = (percentage: number) => {
    const calculatedAmount = (balance * percentage / 100).toFixed(2)
    setAmount(calculatedAmount)
  }

  const handleTradeConfirm = (direction: 'up' | 'down') => {
    setConfirmDialog({ open: true, direction })
  }

  const executeOrder = () => {
    // 这里执行实际的订单逻辑
    setConfirmDialog({ open: false, direction: null })
    setAmount('')
  }

  const handleOptionSelect = (option: OptionsData) => {
    setSelectedOption(option.pair)
    setDrawerOpen(false)
    setSearchQuery('')
  }

  const toggleFavorite = (pair: string) => {
    setFavorites(prev => {
      const newFavorites = new Set(prev)
      if (newFavorites.has(pair)) {
        newFavorites.delete(pair)
      } else {
        newFavorites.add(pair)
      }
      return newFavorites
    })
  }

  return (
    <div className="flex flex-col min-h-[calc(100vh-120px)]">
      {/* 交易对信息 */}
      <div className="px-4 py-4 border-b border-white/10">
        <div className="flex items-center justify-between mb-3">
          <button
            onClick={() => setDrawerOpen(true)}
            className="flex items-center gap-2"
          >
            <div>
              <span className="text-white text-lg">{currentOption.pair}</span>
            </div>
            <ChevronDown className="w-4 h-4 text-white/50" />
          </button>
          
          <div className="flex items-center gap-3">
            <button
              onClick={(e) => {
                e.stopPropagation()
                toggleFavorite(currentOption.pair)
              }}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            >
              <Star
                className={`w-5 h-5 transition-colors ${
                  favorites.has(currentOption.pair)
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

        <div className="flex items-center justify-between">
          <div className="text-right">
            <div className="text-white text-lg">{currentOption.price < 1 ? currentOption.price.toFixed(4) : currentOption.price.toFixed(2)}</div>
            <div className={`text-sm flex items-center gap-1 ${
              currentOption.changePercent >= 0 ? 'text-[#A3F030]' : 'text-red-500'
            }`}>
              {currentOption.changePercent >= 0 ? (
                <TrendingUp className="w-3.5 h-3.5" />
              ) : (
                <TrendingDown className="w-3.5 h-3.5" />
              )}
              <span>{currentOption.changePercent >= 0 ? '+' : ''}{currentOption.changePercent.toFixed(2)}%</span>
            </div>
          </div>
        </div>

        {/* 订单号 */}
        <div className="flex items-center justify-between text-sm mt-3">
          <span className="text-white/50">订单号</span>
          <span className="text-white">{orderNumber}</span>
        </div>

        {/* 倒计时 */}
        <div className="bg-[#1A1A1A] rounded-lg p-3 border-2 border-red-500/50 mt-3">
          <div className="flex items-center justify-between mb-2">
            <span className="text-white/70 text-sm">距离截止</span>
            <div className="flex items-center gap-2">
              <div className="bg-red-500/20 px-2 py-1 rounded">
                <span className="text-red-500 text-lg tabular-nums">
                  {String(countdown.hours).padStart(2, '0')}
                </span>
              </div>
              <span className="text-white/50">:</span>
              <div className="bg-red-500/20 px-2 py-1 rounded">
                <span className="text-red-500 text-lg tabular-nums">
                  {String(countdown.minutes).padStart(2, '0')}
                </span>
              </div>
              <span className="text-white/50">:</span>
              <div className="bg-red-500/20 px-2 py-1 rounded">
                <span className="text-red-500 text-lg tabular-nums">
                  {String(countdown.seconds).padStart(2, '0')}
                </span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center justify-between text-xs text-white/50">
            <span>截止下单: 15:29:30</span>
            <span>交易周期: 15:30:00-15:31:00</span>
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
                  <linearGradient id="optionsColorPrice" x1="0" y1="0" x2="0" y2="1">
                    <stop 
                      offset="5%" 
                      stopColor={currentOption.changePercent >= 0 ? '#A3F030' : '#ef4444'} 
                      stopOpacity={0.3}
                    />
                    <stop 
                      offset="95%" 
                      stopColor={currentOption.changePercent >= 0 ? '#A3F030' : '#ef4444'} 
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
                  tickFormatter={(value) => currentOption.price < 1 ? value.toFixed(4) : `$${value.toFixed(0)}`}
                />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: '#0A0A0A',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '8px',
                    color: '#fff'
                  }}
                  formatter={(value: any) => [currentOption.price < 1 ? parseFloat(value).toFixed(4) : `$${parseFloat(value).toFixed(2)}`, '价格']}
                  labelStyle={{ color: 'rgba(255,255,255,0.7)' }}
                />
                <Area 
                  type="monotone" 
                  dataKey="price" 
                  stroke={currentOption.changePercent >= 0 ? '#A3F030' : '#ef4444'}
                  strokeWidth={2}
                  fill="url(#optionsColorPrice)"
                  animationDuration={300}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* 周期选择 */}
      <div className="px-4 py-4 border-b border-white/10">
        <div className="text-white/70 text-sm mb-3">选择周期</div>
        <div className="grid grid-cols-2 gap-3">
          {periodOptions.map((period) => (
            <button
              key={period.key}
              onClick={() => setSelectedPeriod(period.key as '1min' | '2min')}
              className={`p-4 rounded-lg border-2 transition-all ${
                selectedPeriod === period.key
                  ? 'bg-[#A3F030]/10 border-[#A3F030]'
                  : 'bg-[#1A1A1A] border-white/10'
              }`}
            >
              <div className="text-white mb-1 text-center">{period.label}</div>
              <div className={`text-sm ${
                selectedPeriod === period.key ? 'text-[#A3F030]' : 'text-white/50'
              }`}>
                收益率: {period.yield}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* 投资额设置 */}
      <div className="px-4 py-4 border-b border-white/10">
        <div className="flex items-center justify-between mb-3">
          <span className="text-white/70 text-sm">投资额</span>
          <span className="text-white/50 text-sm">可用: {balance.toFixed(2)} USDT</span>
        </div>
        
        <div className="relative mb-3">
          <Input
            type="number"
            placeholder="请输入投资额"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="bg-[#1A1A1A] border-white/10 text-white h-12 pr-16 placeholder:text-white/30"
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-white/50">
            USDT
          </div>
        </div>

        {/* 快捷百分比 */}
        <div className="grid grid-cols-4 gap-2">
          {[1, 25, 50, 100].map((percentage) => (
            <button
              key={percentage}
              onClick={() => handlePercentageClick(percentage)}
              className="py-2 bg-[#1A1A1A] hover:bg-white/10 rounded-lg text-white/70 text-sm transition-colors font-bold text-center"
            >
              {percentage}%
            </button>
          ))}
        </div>
      </div>

      {/* 时间选择 */}
      <div className="px-4 py-4 border-b border-white/10">
        <div className="text-white/70 text-sm mb-3">选择时间</div>
        <div className="relative">
          <button
            onClick={() => setShowTimeDropdown(!showTimeDropdown)}
            className="w-full px-4 py-3 bg-[#1A1A1A] rounded-lg flex items-center justify-between text-white"
          >
            <span>{selectedTime}</span>
            <ChevronDown className={`w-4 h-4 text-white/50 transition-transform ${
              showTimeDropdown ? 'rotate-180' : ''
            }`} />
          </button>
          
          {showTimeDropdown && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-[#1A1A1A] border border-white/10 rounded-lg max-h-48 overflow-y-auto z-10">
              {timeOptions.map((time) => (
                <button
                  key={time}
                  onClick={() => {
                    setSelectedTime(time)
                    setShowTimeDropdown(false)
                  }}
                  className={`w-full px-4 py-3 text-left hover:bg-white/10 transition-colors ${
                    selectedTime === time ? 'text-[#A3F030]' : 'text-white'
                  }`}
                >
                  {time}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* 交易按钮 */}
      <div className="px-4 py-6 mt-auto">
        <div className="grid grid-cols-2 gap-3">
          <Button
            onClick={() => handleTradeConfirm('up')}
            disabled={!amount || parseFloat(amount) <= 0}
            className="h-14 rounded-xl text-lg bg-[#A3F030] hover:bg-[#8FD622] text-black disabled:bg-white/10 disabled:text-white/30"
          >
            买涨
          </Button>
          <Button
            onClick={() => handleTradeConfirm('down')}
            disabled={!amount || parseFloat(amount) <= 0}
            className="h-14 rounded-xl text-lg bg-red-500 hover:bg-red-600 text-white disabled:bg-white/10 disabled:text-white/30"
          >
            买跌
          </Button>
        </div>
      </div>

      {/* 产品选择抽屉 */}
      <Drawer open={drawerOpen} onOpenChange={setDrawerOpen}>
        <DrawerContent className="bg-[#0A0A0A] border-t border-white/10 max-h-[85vh]">
          <DrawerHeader className="border-b border-white/10 px-4 py-4">
            <div className="flex items-center justify-between">
              <DrawerTitle className="text-white text-lg">期权产品</DrawerTitle>
              <button 
                onClick={() => setDrawerOpen(false)}
                className="p-2 -mr-2 hover:bg-white/5 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-white/60" />
              </button>
            </div>
            <DrawerDescription className="sr-only">
              选择期权产品进行交易
            </DrawerDescription>
          </DrawerHeader>

          {/* 搜索框 */}
          <div className="px-4 py-4 border-b border-white/10">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
              <Input
                placeholder="搜索交易对"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-[#1A1A1A] border-white/10 text-white h-11 placeholder:text-white/40"
              />
            </div>
          </div>

          {/* 产品列表 */}
          <div className="overflow-y-auto flex-1">
            {filteredOptions.map((option) => (
              <button
                key={option.pair}
                onClick={() => handleOptionSelect(option)}
                className={`w-full px-4 py-4 flex items-center justify-between border-b border-white/5 hover:bg-white/5 transition-colors ${
                  selectedOption === option.pair ? 'bg-white/5' : ''
                }`}
              >
                <div className="flex-1 text-left">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-white">{option.pair}</span>
                    {selectedOption === option.pair && (
                      <div className="w-1.5 h-1.5 rounded-full bg-[#A3F030]"></div>
                    )}
                  </div>
                  <div className="text-sm text-white/50">{option.symbol}</div>
                </div>
                
                <div className="text-right">
                  <div className="text-white mb-1">
                    {option.price < 1 ? option.price.toFixed(4) : option.price.toFixed(2)}
                  </div>
                  <div className={`text-sm flex items-center justify-end gap-1 ${
                    option.changePercent >= 0 ? 'text-[#A3F030]' : 'text-red-500'
                  }`}>
                    {option.changePercent >= 0 ? (
                      <TrendingUp className="w-3.5 h-3.5" />
                    ) : (
                      <TrendingDown className="w-3.5 h-3.5" />
                    )}
                    <span>{option.changePercent >= 0 ? '+' : ''}{option.changePercent.toFixed(2)}%</span>
                  </div>
                </div>
              </button>
            ))}

            {filteredOptions.length === 0 && (
              <div className="flex flex-col items-center justify-center py-16">
                <Search className="w-12 h-12 text-white/20 mb-3" />
                <p className="text-white/40 text-sm">未找到匹配的产品</p>
              </div>
            )}
          </div>
        </DrawerContent>
      </Drawer>

      {/* 确认对话框 */}
      <Dialog open={confirmDialog.open} onOpenChange={(open) => setConfirmDialog({ open, direction: null })}>
        <DialogContent className="bg-[#0A0A0A] border border-white/10 text-white max-w-[90vw] rounded-xl">
          <DialogHeader>
            <DialogTitle className="text-white text-lg">确认订单</DialogTitle>
            <DialogDescription className="sr-only">
              确认您的期权交易订单详情
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between py-2 border-b border-white/10">
              <span className="text-white/50">交易对</span>
              <span className="text-white">{currentOption.pair}</span>
            </div>
            
            <div className="flex items-center justify-between py-2 border-b border-white/10">
              <span className="text-white/50">方向</span>
              <span className={confirmDialog.direction === 'up' ? 'text-[#A3F030]' : 'text-red-500'}>
                {confirmDialog.direction === 'up' ? '买涨' : '买跌'}
              </span>
            </div>
            
            <div className="flex items-center justify-between py-2 border-b border-white/10">
              <span className="text-white/50">周期</span>
              <span className="text-white">
                {periodOptions.find(p => p.key === selectedPeriod)?.label}
              </span>
            </div>
            
            <div className="flex items-center justify-between py-2 border-b border-white/10">
              <span className="text-white/50">投资额</span>
              <span className="text-white">{amount} USDT</span>
            </div>
            
            <div className="flex items-center justify-between py-2 border-b border-white/10">
              <span className="text-white/50">预期收益</span>
              <span className="text-[#A3F030]">
                {(parseFloat(amount || '0') * 0.75).toFixed(2)} USDT
              </span>
            </div>
            
            <div className="flex items-center justify-between py-2">
              <span className="text-white/50">结算时间</span>
              <span className="text-white">{selectedTime}</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 mt-6">
            <Button
              onClick={() => setConfirmDialog({ open: false, direction: null })}
              className="h-12 bg-white/10 hover:bg-white/20 text-white rounded-lg"
            >
              取消
            </Button>
            <Button
              onClick={executeOrder}
              className="h-12 bg-[#A3F030] hover:bg-[#8FD622] text-black rounded-lg"
            >
              确认
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
