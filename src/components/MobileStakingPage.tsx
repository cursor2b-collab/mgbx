import { useState } from 'react'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { ChevronLeft, Plus, DollarSign } from 'lucide-react'

interface StakingPlan {
  id: string
  name: string
  minAmount: number
  maxAmount: number
  duration: number
  yieldMin: number
  yieldMax: number
  status: 'active' | 'trial' | 'full'
  coins: string[]
}

interface Coin {
  symbol: string
  name: string
  color: string
  gradient: string
}

// 真实货币图标组件
const CoinIcon = ({ symbol, className = '' }: { symbol: string; className?: string }) => {
  switch (symbol) {
    case 'USDC':
    case 'USDT':
      return (
        <div className={className}>
          <DollarSign className="w-full h-full" strokeWidth={2.5} />
        </div>
      )
    case 'ETH':
      return (
        <div className={className}>
          <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
            <path d="M11.944 17.97L4.58 13.62 11.943 24l7.37-10.38-7.372 4.35h.003zM12.056 0L4.69 12.223l7.365 4.354 7.365-4.35L12.056 0z"/>
          </svg>
        </div>
      )
    case 'BTC':
      return (
        <div className={className}>
          <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
            <path d="M23.638 14.904c-1.602 6.43-8.113 10.34-14.542 8.736C2.67 22.05-1.244 15.525.362 9.105 1.962 2.67 8.475-1.243 14.9.358c6.43 1.605 10.342 8.115 8.738 14.548v-.002zm-6.35-4.613c.24-1.59-.974-2.45-2.64-3.03l.54-2.153-1.315-.33-.525 2.107c-.345-.087-.705-.167-1.064-.25l.526-2.127-1.32-.33-.54 2.165c-.285-.067-.565-.132-.84-.2l-1.815-.45-.35 1.407s.975.225.955.236c.535.136.63.486.615.766l-1.477 5.92c-.075.166-.24.406-.614.314.015.02-.96-.24-.96-.24l-.66 1.51 1.71.426.93.242-.54 2.19 1.32.327.54-2.17c.36.1.705.19 1.05.273l-.51 2.154 1.32.33.545-2.19c2.24.427 3.93.257 4.64-1.774.57-1.637-.03-2.58-1.217-3.196.854-.193 1.5-.76 1.68-1.93h.01zm-3.01 4.22c-.404 1.64-3.157.75-4.05.53l.72-2.9c.896.23 3.757.67 3.33 2.37zm.41-4.24c-.37 1.49-2.662.735-3.405.55l.654-2.64c.744.18 3.137.524 2.75 2.084v.006z"/>
          </svg>
        </div>
      )
    default:
      return <DollarSign className={`${className} w-full h-full`} />
  }
}

export function MobileStakingPage() {
  const [selectedPlan, setSelectedPlan] = useState<StakingPlan | null>(null)
  const [selectedCoins, setSelectedCoins] = useState<string[]>(['USDC'])
  const [investAmount, setInvestAmount] = useState('')
  const [sliderValue, setSliderValue] = useState(0)
  const [availableBalance] = useState(1000000)

  const stakingPlans: StakingPlan[] = [
    {
      id: '1',
      name: '智能合约',
      minAmount: 100,
      maxAmount: 50000,
      duration: 30,
      yieldMin: 1,
      yieldMax: 3,
      status: 'active',
      coins: ['USDC', 'USDT']
    },
    {
      id: '2',
      name: '智能合约2',
      minAmount: 500,
      maxAmount: 700000,
      duration: 90,
      yieldMin: 3,
      yieldMax: 6,
      status: 'trial',
      coins: ['USDC', 'ETH']
    },
    {
      id: '3',
      name: '智能合约3',
      minAmount: 10000,
      maxAmount: 500000,
      duration: 180,
      yieldMin: 6,
      yieldMax: 15,
      status: 'active',
      coins: ['USDC', 'ETH', 'BTC']
    }
  ]

  const availableCoins: Coin[] = [
    { symbol: 'USDC', name: 'USD Coin', color: '#2775CA', gradient: 'from-blue-500 to-blue-600' },
    { symbol: 'ETH', name: 'Ethereum', color: '#627EEA', gradient: 'from-purple-500 to-purple-600' },
    { symbol: 'BTC', name: 'Bitcoin', color: '#F7931A', gradient: 'from-orange-500 to-orange-600' },
    { symbol: 'USDT', name: 'Tether', color: '#26A17B', gradient: 'from-green-500 to-green-600' }
  ]

  const handlePlanClick = (plan: StakingPlan) => {
    setSelectedPlan(plan)
    // 默认选择该计划支持的第一个币种
    setSelectedCoins([plan.coins[0]])
    setInvestAmount('')
    setSliderValue(0)
  }

  const handleCoinToggle = (coinSymbol: string) => {
    if (!selectedPlan) return
    
    if (selectedCoins.includes(coinSymbol)) {
      // 至少保留一个币种
      if (selectedCoins.length > 1) {
        setSelectedCoins(selectedCoins.filter(c => c !== coinSymbol))
      }
    } else {
      setSelectedCoins([...selectedCoins, coinSymbol])
    }
  }

  const handleSliderChange = (value: number) => {
    setSliderValue(value)
    const calculatedAmount = (availableBalance * value / 100).toFixed(2)
    setInvestAmount(calculatedAmount)
  }

  const handlePercentageClick = (percentage: number) => {
    setSliderValue(percentage)
    const calculatedAmount = (availableBalance * percentage / 100).toFixed(2)
    setInvestAmount(calculatedAmount)
  }

  const calculateEstimatedReturn = () => {
    if (!selectedPlan || !investAmount) return '0.00-0.00'
    const amount = parseFloat(investAmount)
    const minReturn = (amount * selectedPlan.yieldMin / 100 * selectedPlan.duration / 365).toFixed(2)
    const maxReturn = (amount * selectedPlan.yieldMax / 100 * selectedPlan.duration / 365).toFixed(2)
    return `${minReturn}-${maxReturn}`
  }

  const handleSubscribe = () => {
    // 处理申购逻辑
    console.log('申购:', {
      plan: selectedPlan?.name,
      coins: selectedCoins,
      amount: investAmount
    })
    // 返回列表页
    setSelectedPlan(null)
    setInvestAmount('')
    setSliderValue(0)
  }

  // 列表页面
  if (!selectedPlan) {
    return (
      <div className="min-h-[calc(100vh-120px)] bg-[#0A0A0A] px-4 py-6">
        <div className="space-y-4">
          {stakingPlans.map((plan) => (
            <div
              key={plan.id}
              className="bg-[#1A1A1A] rounded-2xl p-5 border border-white/10"
            >
              {/* 计划标题 */}
              <div className="flex items-center gap-3 mb-4">
                <div className="flex -space-x-2">
                  {plan.coins.slice(0, 3).map((coinSymbol, index) => {
                    const coin = availableCoins.find(c => c.symbol === coinSymbol)
                    if (!coin) return null
                    return (
                      <div
                        key={coinSymbol}
                        className={`w-8 h-8 rounded-full bg-gradient-to-br ${coin.gradient} flex items-center justify-center text-white text-sm border-2 border-[#1A1A1A]`}
                        style={{ zIndex: plan.coins.length - index }}
                      >
                        <CoinIcon symbol={coinSymbol} className="w-5 h-5" />
                      </div>
                    )
                  })}
                </div>
                <h3 className="text-white text-lg">{plan.name}</h3>
              </div>

              {/* 计划详情 */}
              <div className="space-y-3 mb-4">
                <div className="flex items-center justify-between">
                  <span className="text-white/50 text-sm">投资金额</span>
                  <span className="text-white">
                    {plan.minAmount}-{plan.maxAmount.toLocaleString()} USDT
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-white/50 text-sm">运行时长</span>
                  <span className="text-white">{plan.duration} 天</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-white/50 text-sm">收益率</span>
                  <span className="text-white">
                    {plan.yieldMin}-{plan.yieldMax}%/天
                  </span>
                </div>
              </div>

              {/* 操作按钮 */}
              {plan.status === 'trial' ? (
                <Button
                  onClick={() => handlePlanClick(plan)}
                  className="w-full h-12 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white rounded-xl text-base"
                >
                  免费试用
                </Button>
              ) : (
                <Button
                  onClick={() => handlePlanClick(plan)}
                  className="w-full h-12 bg-[#A3F030] hover:bg-[#8FD622] text-black rounded-xl text-base"
                >
                  申购
                </Button>
              )}
            </div>
          ))}
        </div>
      </div>
    )
  }

  // 详情页面
  return (
    <div className="min-h-[calc(100vh-120px)] bg-[#0A0A0A]">
      {/* 顶部标题栏 */}
      <div className="sticky top-0 bg-[#0A0A0A] border-b border-white/10 px-4 py-4 flex items-center gap-4 z-10">
        <button
          onClick={() => setSelectedPlan(null)}
          className="p-2 -ml-2 hover:bg-white/10 rounded-lg transition-colors"
        >
          <ChevronLeft className="w-6 h-6 text-white" />
        </button>
        <h1 className="text-white text-lg">质押挖矿交易</h1>
      </div>

      <div className="px-4 py-6">
        {/* 认购组合 */}
        <div className="mb-6">
          <h2 className="text-white mb-4">认购组合</h2>
          <div className="flex items-center gap-3 flex-wrap">
            {selectedPlan.coins.map((coinSymbol, index) => {
              const coin = availableCoins.find(c => c.symbol === coinSymbol)
              if (!coin) return null
              
              const isSelected = selectedCoins.includes(coinSymbol)
              
              return (
                <div key={coinSymbol} className="flex items-center gap-3">
                  {index > 0 && (
                    <div className="w-10 h-10 rounded-full bg-[#A3F030] flex items-center justify-center">
                      <Plus className="w-5 h-5 text-black" />
                    </div>
                  )}
                  <button
                    onClick={() => handleCoinToggle(coinSymbol)}
                    className={`transition-all ${
                      isSelected 
                        ? 'opacity-100 scale-100' 
                        : 'opacity-50 scale-95'
                    }`}
                  >
                    <div className="bg-[#1A1A1A] rounded-2xl p-4 border-2 border-white/10 min-w-[120px]">
                      <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${coin.gradient} flex items-center justify-center text-white text-xl mx-auto mb-2`}>
                        <CoinIcon symbol={coinSymbol} className="w-5 h-5" />
                      </div>
                      <div className="text-white text-center">{coin.symbol}</div>
                    </div>
                  </button>
                </div>
              )
            })}
          </div>
        </div>

        {/* 计划信息 */}
        <div className="bg-[#1A1A1A] rounded-2xl p-4 mb-6 border border-white/10">
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center justify-between">
              <span className="text-white/50 text-sm">运行时长</span>
              <span className="text-white">{selectedPlan.duration}天</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-white/50 text-sm">收益率</span>
              <span className="text-white">
                {selectedPlan.yieldMin}-{selectedPlan.yieldMax}%
              </span>
            </div>

            <div className="flex items-center justify-between col-span-2">
              <span className="text-white/50 text-sm">预估收益</span>
              <span className="text-white">{calculateEstimatedReturn()} USDT</span>
            </div>

            <div className="flex items-center justify-between col-span-2">
              <span className="text-white/50 text-sm">投资金额</span>
              <span className="text-white">
                {selectedPlan.minAmount}-{selectedPlan.maxAmount.toLocaleString()} USDT
              </span>
            </div>
          </div>
        </div>

        {/* 申购金额 */}
        <div className="mb-6">
          <h2 className="text-white mb-4">申购金额</h2>
          
          <div className="mb-3">
            <div className="flex items-center justify-between mb-2">
              <span className="text-white/50 text-sm">投资额</span>
              <button className="text-sm text-[#A3F030]">
                可用 {availableBalance.toLocaleString()} USDT
              </button>
            </div>
            
            <div className="relative">
              <Input
                type="number"
                placeholder="请输入金额"
                value={investAmount}
                onChange={(e) => setInvestAmount(e.target.value)}
                className="bg-[#1A1A1A] border-white/10 text-white h-14 pr-16 text-lg placeholder:text-white/30"
              />
              <div className="absolute right-4 top-1/2 -translate-y-1/2 text-white">
                USDT
              </div>
            </div>
          </div>

          {/* 百分比滑块 */}
          <div className="mb-4">
            <div className="relative">
              <input
                type="range"
                min="0"
                max="100"
                value={sliderValue}
                onChange={(e) => handleSliderChange(parseInt(e.target.value))}
                className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer slider-green"
                style={{
                  background: `linear-gradient(to right, #A3F030 0%, #A3F030 ${sliderValue}%, rgba(255,255,255,0.1) ${sliderValue}%, rgba(255,255,255,0.1) 100%)`
                }}
              />
              {/* 滑块上的圆点指示器 */}
              <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 flex justify-between px-0 pointer-events-none">
                {[0, 25, 50, 75, 100].map((percent) => (
                  <div
                    key={percent}
                    className={`w-3 h-3 rounded-full transition-all ${
                      sliderValue >= percent
                        ? 'bg-[#A3F030] scale-100'
                        : 'bg-white/20 scale-75'
                    }`}
                  />
                ))}
              </div>
            </div>
            
            <div className="flex justify-between mt-3">
              {[0, 25, 50, 75, 100].map((percentage) => (
                <button
                  key={percentage}
                  onClick={() => handlePercentageClick(percentage)}
                  className={`text-sm transition-colors ${
                    sliderValue === percentage
                      ? 'text-[#A3F030]'
                      : 'text-white/40 hover:text-white/60'
                  }`}
                >
                  {percentage}%
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* 申购按钮 */}
        <Button
          onClick={handleSubscribe}
          disabled={!investAmount || parseFloat(investAmount) < selectedPlan.minAmount || parseFloat(investAmount) > selectedPlan.maxAmount}
          className="w-full h-14 bg-[#A3F030] hover:bg-[#8FD622] text-black rounded-xl text-lg disabled:bg-white/10 disabled:text-white/30"
        >
          申购
        </Button>

        {/* 提示信息 */}
        {investAmount && (parseFloat(investAmount) < selectedPlan.minAmount || parseFloat(investAmount) > selectedPlan.maxAmount) && (
          <div className="mt-4 px-4 py-3 bg-orange-500/10 border border-orange-500/30 rounded-lg">
            <p className="text-sm text-orange-500">
              投资金额需在 {selectedPlan.minAmount.toLocaleString()} - {selectedPlan.maxAmount.toLocaleString()} USDT 之间
            </p>
          </div>
        )}

        {/* 收益说明 */}
        <div className="mt-6 px-4 py-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
          <div className="flex items-start gap-2">
            <div className="text-blue-500 mt-0.5">ⓘ</div>
            <div className="text-sm text-blue-400">
              <p className="mb-2">收益说明：</p>
              <ul className="text-xs text-blue-300/80 space-y-1">
                <li>• 每日收益自动复投，收益按日计算</li>
                <li>• 到期后本金和收益自动返还至账户</li>
                <li>• 提前赎回可能会损失部分收益</li>
                <li>• 最终收益以实际结算为准</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .slider-green::-webkit-slider-thumb {
          appearance: none;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: #A3F030;
          cursor: pointer;
          box-shadow: 0 0 8px rgba(163, 240, 48, 0.5);
          position: relative;
          z-index: 10;
        }
        
        .slider-green::-moz-range-thumb {
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: #A3F030;
          cursor: pointer;
          border: none;
          box-shadow: 0 0 8px rgba(163, 240, 48, 0.5);
          position: relative;
          z-index: 10;
        }
      `}</style>
    </div>
  )
}