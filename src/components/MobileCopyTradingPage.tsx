import { useState } from 'react'
import { Button } from './ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog'
import { Badge } from './ui/badge'

interface Trader {
  id: string
  username: string
  userId: string
  level: number
  avatar: string
  winRate: number
  totalAmount: number
  followers?: number
}

interface CopyTrade {
  trader: Trader
  copyTime: string
  amount: number
}

export function MobileCopyTradingPage() {
  const [activeTab, setActiveTab] = useState<'ranking' | 'all' | 'mine'>('ranking')
  const [confirmDialog, setConfirmDialog] = useState<{ open: boolean, trader: Trader | null }>({ open: false, trader: null })
  const [copyAmount, setCopyAmount] = useState('100')
  const [copyLimit, setCopyLimit] = useState('unlimited')
  const [myCopyTrades, setMyCopyTrades] = useState<CopyTrade[]>([])

  const topTraders: Trader[] = [
    {
      id: '1',
      username: 'book',
      userId: '@u4511844',
      level: 1,
      avatar: '👨‍💼',
      winRate: 2.62,
      totalAmount: 250000,
      followers: 1234
    },
    {
      id: '2',
      username: 'rich33',
      userId: '@e8428155',
      level: 1,
      avatar: '🌊',
      winRate: 0.34,
      totalAmount: 10000,
      followers: 567
    },
    {
      id: '3',
      username: 'CryptoKing',
      userId: '@ck9876543',
      level: 2,
      avatar: '👑',
      winRate: 5.78,
      totalAmount: 580000,
      followers: 3456
    },
    {
      id: '4',
      username: 'TradeMaster',
      userId: '@tm7654321',
      level: 3,
      avatar: '🎯',
      winRate: 8.92,
      totalAmount: 1250000,
      followers: 8901
    },
    {
      id: '5',
      username: 'DiamondHands',
      userId: '@dh5432109',
      level: 2,
      avatar: '💎',
      winRate: 4.15,
      totalAmount: 320000,
      followers: 2345
    },
    {
      id: '6',
      username: 'BullRun',
      userId: '@br3210987',
      level: 1,
      avatar: '🐂',
      winRate: 1.89,
      totalAmount: 95000,
      followers: 890
    }
  ]

  const handleCopyClick = (trader: Trader) => {
    setConfirmDialog({ open: true, trader })
  }

  const handleConfirmCopy = () => {
    if (confirmDialog.trader) {
      const newCopyTrade: CopyTrade = {
        trader: confirmDialog.trader,
        copyTime: new Date().toISOString().replace('T', ' ').substring(0, 19),
        amount: parseFloat(copyAmount)
      }
      setMyCopyTrades([newCopyTrade, ...myCopyTrades])
      setConfirmDialog({ open: false, trader: null })
      setCopyAmount('100')
      setCopyLimit('unlimited')
    }
  }

  const handleCancelCopy = (traderId: string) => {
    setMyCopyTrades(myCopyTrades.filter(ct => ct.trader.id !== traderId))
  }

  const isAlreadyCopying = (traderId: string) => {
    return myCopyTrades.some(ct => ct.trader.id === traderId)
  }

  return (
    <div className="flex flex-col min-h-[calc(100vh-120px)] bg-black">
      {/* 标签导航 */}
      <div className="px-4 py-4 border-b border-white/10">
        <div className="flex gap-3">
          <button
            onClick={() => setActiveTab('ranking')}
            className={`px-6 py-2.5 rounded-full transition-all ${
              activeTab === 'ranking'
                ? 'bg-[#A3F030] text-black'
                : 'bg-[#1A1A1A] text-white/70'
            }`}
          >
            排行榜
          </button>
          <button
            onClick={() => setActiveTab('all')}
            className={`px-6 py-2.5 rounded-full transition-all ${
              activeTab === 'all'
                ? 'bg-[#A3F030] text-black'
                : 'bg-[#1A1A1A] text-white/70'
            }`}
          >
            全部跟单
          </button>
          <button
            onClick={() => setActiveTab('mine')}
            className={`px-6 py-2.5 rounded-full transition-all ${
              activeTab === 'mine'
                ? 'bg-[#A3F030] text-black'
                : 'bg-[#1A1A1A] text-white/70'
            }`}
          >
            我的跟单
          </button>
        </div>
      </div>

      {/* 内容区域 */}
      <div className="flex-1 overflow-y-auto px-4 py-4">
        {/* 排行榜和全部跟单 */}
        {(activeTab === 'ranking' || activeTab === 'all') && (
          <div className="space-y-4">
            {topTraders.map((trader) => (
              <div
                key={trader.id}
                className="bg-black rounded-2xl p-4 border border-white/30"
              >
                {/* 交易员信息 */}
                <div className="flex items-start gap-3 mb-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#A3F030]/20 to-[#A3F030]/5 flex items-center justify-center text-2xl border-2 border-[#A3F030]/30">
                    {trader.avatar}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-white">{trader.username}</span>
                      <Badge className="bg-orange-500/20 text-orange-400 border-orange-500/30 text-xs px-2 py-0">
                        LV.{trader.level}
                      </Badge>
                    </div>
                    <div className="text-sm text-white/50">{trader.userId}</div>
                  </div>
                </div>

                {/* 统计信息 */}
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <div className="text-xs text-white/50 mb-1">收益率</div>
                    <div className={`text-lg ${trader.winRate >= 0 ? 'text-[#A3F030]' : 'text-red-500'}`}>
                      {trader.winRate >= 0 ? '+' : ''}{trader.winRate.toFixed(2)}%
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-white/50 mb-1">带单总金额</div>
                    <div className="text-lg text-white">
                      {trader.totalAmount.toLocaleString()}
                    </div>
                  </div>
                </div>

                {/* 跟单按钮 */}
                <Button
                  onClick={() => handleCopyClick(trader)}
                  disabled={isAlreadyCopying(trader.id)}
                  className={`w-full h-12 rounded-xl text-base ${
                    isAlreadyCopying(trader.id)
                      ? 'bg-white/10 text-white/40 cursor-not-allowed'
                      : 'bg-[#A3F030] hover:bg-[#8FD622] text-black'
                  }`}
                >
                  {isAlreadyCopying(trader.id) ? '已跟单' : '跟单'}
                </Button>
              </div>
            ))}
          </div>
        )}

        {/* 我的跟单 */}
        {activeTab === 'mine' && (
          <div className="space-y-4">
            {myCopyTrades.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16">
                <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mb-4">
                  <span className="text-4xl">📋</span>
                </div>
                <p className="text-white/40 text-sm">暂无跟单记录</p>
              </div>
            ) : (
              myCopyTrades.map((copyTrade) => (
                <div
                  key={copyTrade.trader.id}
                  className="bg-black rounded-2xl p-4 border border-white/30"
                >
                  <div className="flex items-start gap-3 mb-3">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#A3F030]/20 to-[#A3F030]/5 flex items-center justify-center text-2xl border-2 border-[#A3F030]/30">
                      {copyTrade.trader.avatar}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-white">{copyTrade.trader.username}</span>
                        <Badge className="bg-orange-500/20 text-orange-400 border-orange-500/30 text-xs px-2 py-0">
                          LV.{copyTrade.trader.level}
                        </Badge>
                      </div>
                      <div className="text-sm text-white/50">{copyTrade.trader.userId}</div>
                    </div>
                    <button
                      onClick={() => handleCancelCopy(copyTrade.trader.id)}
                      className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-white/80 text-sm transition-colors"
                    >
                      取消跟单
                    </button>
                  </div>

                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-white/50">跟单时间</span>
                    <span className="text-white">{copyTrade.copyTime}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {/* 跟单确认对话框 */}
      <Dialog open={confirmDialog.open} onOpenChange={(open) => !open && setConfirmDialog({ open: false, trader: null })}>
        <DialogContent className="bg-black border border-white/30 text-white max-w-[90vw] rounded-2xl p-0">
          <DialogHeader className="border-b border-white/30 px-6 py-4">
            <DialogTitle className="text-white text-lg">跟单</DialogTitle>
            <DialogDescription className="sr-only">
              设置跟单参数
            </DialogDescription>
          </DialogHeader>
          
          <div className="px-6 py-6 space-y-6">
            {/* 跟单金额 */}
            <div className="flex items-center justify-between">
              <span className="text-white">跟单金额</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCopyAmount('50')}
                  className={`px-4 py-2 rounded-lg text-sm transition-colors ${
                    copyAmount === '50'
                      ? 'bg-[#A3F030] text-black'
                      : 'bg-white/10 text-white/70 hover:bg-white/20'
                  }`}
                >
                  50%
                </button>
                <button
                  onClick={() => setCopyAmount('100')}
                  className={`px-4 py-2 rounded-lg text-sm transition-colors ${
                    copyAmount === '100'
                      ? 'bg-[#A3F030] text-black'
                      : 'bg-white/10 text-white/70 hover:bg-white/20'
                  }`}
                >
                  100%
                </button>
              </div>
            </div>

            {/* 跟单次数 */}
            <div className="flex items-center justify-between">
              <span className="text-white">跟单次数</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCopyLimit('10')}
                  className={`px-4 py-2 rounded-lg text-sm transition-colors ${
                    copyLimit === '10'
                      ? 'bg-[#A3F030] text-black'
                      : 'bg-white/10 text-white/70 hover:bg-white/20'
                  }`}
                >
                  10次
                </button>
                <button
                  onClick={() => setCopyLimit('unlimited')}
                  className={`px-4 py-2 rounded-lg text-sm transition-colors ${
                    copyLimit === 'unlimited'
                      ? 'bg-[#A3F030] text-black'
                      : 'bg-white/10 text-white/70 hover:bg-white/20'
                  }`}
                >
                  不限制
                </button>
              </div>
            </div>
          </div>

          <div className="px-6 pb-6">
            <Button
              onClick={handleConfirmCopy}
              className="w-full h-14 bg-[#A3F030] hover:bg-[#8FD622] text-black rounded-xl text-base"
            >
              确定
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}