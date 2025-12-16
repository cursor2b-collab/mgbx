import { Card, CardContent } from './ui/card'
import { TrendingUp } from 'lucide-react'

export function TradingViewWidget() {
  return (
    <Card className="bg-slate-900/50 border-slate-800 backdrop-blur-xl">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white">BTC/USDT 实时走势</h3>
          <div className="flex items-center gap-2 text-green-500 font-semibold">
            <TrendingUp className="w-4 h-4" />
            <span>+2.34%</span>
          </div>
        </div>

        {/* 模拟K线图 */}
        <div className="relative h-64 bg-slate-950/50 rounded-lg border border-slate-800 overflow-hidden">
          {/* 网格线 */}
          <div className="absolute inset-0">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="absolute left-0 right-0 border-t border-slate-800/30"
                style={{ top: `${(i + 1) * 20}%` }}
              />
            ))}
          </div>

          {/* 模拟价格线 */}
          <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
            <defs>
              <linearGradient id="priceGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="rgb(59, 130, 246)" stopOpacity="0.5" />
                <stop offset="100%" stopColor="rgb(59, 130, 246)" stopOpacity="0" />
              </linearGradient>
            </defs>
            <path
              d="M 0 120 Q 100 100, 200 80 T 400 70 T 600 85 T 800 75 T 1000 60 T 1200 65 L 1200 256 L 0 256 Z"
              fill="url(#priceGradient)"
            />
            <path
              d="M 0 120 Q 100 100, 200 80 T 400 70 T 600 85 T 800 75 T 1000 60 T 1200 65"
              fill="none"
              stroke="rgb(59, 130, 246)"
              strokeWidth="2"
            />
          </svg>

          {/* 价格标签 */}
          <div className="absolute top-4 left-4 bg-slate-900/90 rounded px-3 py-2 border border-slate-700">
            <p className="text-slate-400 text-xs mb-1">当前价格</p>
            <p className="text-white font-bold text-lg">$43,567.89</p>
          </div>
        </div>

        {/* 时间周期选择 */}
        <div className="flex items-center gap-2 mt-4">
          {['1分', '5分', '15分', '1小时', '4小时', '1天'].map((period) => (
            <button
              key={period}
              className="px-3 py-1 rounded text-sm text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              {period}
            </button>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
