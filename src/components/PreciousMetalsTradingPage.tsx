import { useState, useEffect } from 'react'
import { Card, CardContent } from './ui/card'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Checkbox } from './ui/checkbox'
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs'
import { Navbar } from './Navbar'
import { MobileBottomNav } from './MobileBottomNav'
import { ImageWithFallback } from './figma/ImageWithFallback'
import { 
  Search,
  Star,
  TrendingUp,
  TrendingDown,
  ChevronRight,
  X,
  FileText
} from 'lucide-react'

// 贵金属数据类型
interface PreciousMetal {
  symbol: string
  name: string
  price: number
  change: number
  changePercent: number
  logo: string
  unit?: string
}

// 贵金属LOGO映射
const METALS_LOGOS: { [key: string]: string } = {
  'XAU/USD': 'https://api.dicebear.com/7.x/shapes/svg?seed=XAU&backgroundColor=FFD700',
  'XAG/USD': 'https://api.dicebear.com/7.x/shapes/svg?seed=XAG&backgroundColor=C0C0C0',
  'XPT/USD': 'https://api.dicebear.com/7.x/shapes/svg?seed=XPT&backgroundColor=E5E4E2',
  'XPD/USD': 'https://api.dicebear.com/7.x/shapes/svg?seed=XPD&backgroundColor=CED0DD',
  'XRH/USD': 'https://api.dicebear.com/7.x/shapes/svg?seed=XRH&backgroundColor=808080',
  'XCU/USD': 'https://api.dicebear.com/7.x/shapes/svg?seed=XCU&backgroundColor=B87333',
  'XAU/EUR': 'https://api.dicebear.com/7.x/shapes/svg?seed=XAUEUR&backgroundColor=FFE66D',
  'XAU/JPY': 'https://api.dicebear.com/7.x/shapes/svg?seed=XAUJPY&backgroundColor=FFD93D',
  'XAU/GBP': 'https://api.dicebear.com/7.x/shapes/svg?seed=XAUGBP&backgroundColor=FFCC5C',
  'XAG/EUR': 'https://api.dicebear.com/7.x/shapes/svg?seed=XAGEUR&backgroundColor=D3D3D3',
  'XAG/JPY': 'https://api.dicebear.com/7.x/shapes/svg?seed=XAGJPY&backgroundColor=BEBEBE',
  'XAG/GBP': 'https://api.dicebear.com/7.x/shapes/svg?seed=XAGGBP&backgroundColor=A9A9A9',
  'XBR/USD': 'https://api.dicebear.com/7.x/shapes/svg?seed=XBRUSD&backgroundColor=2C3E50',
}

export function PreciousMetalsTradingPage() {
  const [selectedMetal, setSelectedMetal] = useState('XAU/USD')
  const [searchQuery, setSearchQuery] = useState('')
  const [priceType, setPriceType] = useState<'market' | 'limit'>('market')
  const [price, setPrice] = useState('')
  const [amount, setAmount] = useState('')
  const [stopLossEnabled, setStopLossEnabled] = useState(false)

  // 贵金属列表
  const preciousMetals: PreciousMetal[] = [
    { symbol: 'XAU/USD', name: '黄金/美元', price: 2045.50, change: 12.30, changePercent: 0.60, logo: METALS_LOGOS['XAU/USD'], unit: '盎司' },
    { symbol: 'XAG/USD', name: '白银/美元', price: 24.85, change: -0.15, changePercent: -0.60, logo: METALS_LOGOS['XAG/USD'], unit: '盎司' },
    { symbol: 'XPT/USD', name: '铂金/美元', price: 925.40, change: 5.20, changePercent: 0.56, logo: METALS_LOGOS['XPT/USD'], unit: '盎司' },
    { symbol: 'XPD/USD', name: '钯金/美元', price: 1045.75, change: -8.35, changePercent: -0.79, logo: METALS_LOGOS['XPD/USD'], unit: '盎司' },
    { symbol: 'XRH/USD', name: '铑金/美元', price: 4850.00, change: 25.00, changePercent: 0.52, logo: METALS_LOGOS['XRH/USD'], unit: '盎司' },
    { symbol: 'XCU/USD', name: '铜/美元', price: 3.825, change: 0.035, changePercent: 0.92, logo: METALS_LOGOS['XCU/USD'], unit: '磅' },
    { symbol: 'XAU/EUR', name: '黄金/欧元', price: 1878.50, change: 8.20, changePercent: 0.44, logo: METALS_LOGOS['XAU/EUR'], unit: '盎司' },
    { symbol: 'XAU/JPY', name: '黄金/日元', price: 305125.00, change: 1850.00, changePercent: 0.61, logo: METALS_LOGOS['XAU/JPY'], unit: '盎司' },
    { symbol: 'XAU/GBP', name: '黄金/英镑', price: 1609.25, change: 7.15, changePercent: 0.45, logo: METALS_LOGOS['XAU/GBP'], unit: '盎司' },
    { symbol: 'XAG/EUR', name: '白银/欧元', price: 21.65, change: -0.12, changePercent: -0.55, logo: METALS_LOGOS['XAG/EUR'], unit: '盎司' },
    { symbol: 'XAG/JPY', name: '白银/日元', price: 3514.50, change: -25.00, changePercent: -0.71, logo: METALS_LOGOS['XAG/JPY'], unit: '盎司' },
    { symbol: 'XAG/GBP', name: '白银/英镑', price: 18.54, change: -0.10, changePercent: -0.54, logo: METALS_LOGOS['XAG/GBP'], unit: '盎司' },
    { symbol: 'XBR/USD', name: '布伦特原油', price: 82.45, change: 1.25, changePercent: 1.54, logo: METALS_LOGOS['XBR/USD'], unit: '桶' },
  ]

  const currentMetal = preciousMetals.find(m => m.symbol === selectedMetal) || preciousMetals[0]

  const filteredMetals = preciousMetals.filter(metal =>
    metal.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
    metal.name.includes(searchQuery)
  )

  return (
    <div className="min-h-screen bg-black text-white">
      {/* 顶部导航栏 */}
      <Navbar />

      {/* 主要内容区域 */}
      <div className="flex flex-col min-h-[calc(100vh-56px)] lg:h-[calc(100vh-56px)] overflow-hidden">
        {/* 顶部：贵金属信息栏（标题区域 - 横跨全宽） */}
        <div className="border-b border-white/10 bg-black px-4 lg:px-6 py-3 lg:py-4 flex-shrink-0">
          <div className="flex flex-col lg:flex-row lg:items-center gap-3 lg:gap-8">
            <div>
              <div className="flex items-center gap-2 mb-1">
                {currentMetal.logo && (
                  <ImageWithFallback 
                    src={currentMetal.logo} 
                    alt={selectedMetal}
                    className="w-8 h-8 rounded-full"
                  />
                )}
                <h2 className="text-xl font-bold">{selectedMetal}</h2>
                <span className="text-xs text-white/50">
                  {currentMetal.name}
                </span>
                {currentMetal.unit && (
                  <span className="text-xs px-2 py-0.5 bg-white/10 rounded">
                    单位: {currentMetal.unit}
                  </span>
                )}
              </div>
            </div>
            
            <div className="flex flex-wrap items-center gap-3 lg:gap-6 text-sm">
              <div>
                <div className="text-white/50 text-xs mb-0.5">最新价</div>
                <div className={`text-lg ${currentMetal.change >= 0 ? 'text-[#00C087]' : 'text-[#FF4D4F]'}`}>
                  ${currentMetal.price.toFixed(2)}
                </div>
              </div>
              
              <div>
                <div className="text-white/50 text-xs mb-0.5">24h涨跌</div>
                <div className={currentMetal.change >= 0 ? 'text-[#00C087]' : 'text-[#FF4D4F]'}>
                  {currentMetal.change >= 0 ? '+' : ''}{currentMetal.change.toFixed(2)}
                </div>
              </div>
              
              <div>
                <div className="text-white/50 text-xs mb-0.5">24h涨幅</div>
                <div className={currentMetal.changePercent >= 0 ? 'text-[#00C087]' : 'text-[#FF4D4F]'}>
                  {currentMetal.changePercent >= 0 ? '+' : ''}{currentMetal.changePercent.toFixed(2)}%
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 下方：三栏布局（左中右） */}
        <div className="flex flex-1 overflow-hidden">
          {/* 左侧：贵金属列表 */}
          <div className="hidden lg:block w-80 border-r border-white/10 flex-shrink-0 bg-black overflow-hidden flex flex-col">
            <div className="p-4 border-b border-white/10 flex-shrink-0">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                <Input
                  placeholder="搜索贵金属"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-white/40 focus-visible:ring-[#A3F030]"
                />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto">
              {filteredMetals.map((metal) => (
                <div
                  key={metal.symbol}
                  onClick={() => setSelectedMetal(metal.symbol)}
                  className={`p-3 border-b border-white/5 cursor-pointer transition-colors hover:bg-white/5 ${
                    selectedMetal === metal.symbol ? 'bg-white/10' : ''
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 flex-1">
                      {metal.logo && (
                        <ImageWithFallback 
                          src={metal.logo} 
                          alt={metal.symbol}
                          className="w-10 h-10 rounded-full"
                        />
                      )}
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-white">{metal.symbol}</span>
                          {metal.unit && (
                            <span className="text-xs px-1.5 py-0.5 bg-white/5 rounded text-white/50">
                              {metal.unit}
                            </span>
                          )}
                        </div>
                        <div className="text-xs text-white/50">{metal.name}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-white text-sm">${metal.price.toFixed(2)}</div>
                      <div className={`text-xs ${metal.changePercent >= 0 ? 'text-[#00C087]' : 'text-[#FF4D4F]'}`}>
                        {metal.changePercent >= 0 ? '+' : ''}{metal.changePercent.toFixed(2)}%
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 中间：TradingView图表 */}
          <div className="flex-1 bg-black overflow-hidden flex flex-col">
            {/* TradingView图表 */}
            <div className="flex-1 bg-black min-h-0">
              <iframe
                src={`https://www.tradingview.com/widgetembed/?frameElementId=tradingview_metals&symbol=${currentMetal.symbol.replace('/', '')}&interval=D&hidesidetoolbar=0&symboledit=1&saveimage=0&toolbarbg=000000&studies=[]&theme=dark&style=1&timezone=America/New_York&studies_overrides={}&overrides={}&enabled_features=[]&disabled_features=[]&locale=zh_CN&utm_source=localhost&utm_medium=widget&utm_campaign=chart&utm_term=${currentMetal.symbol}`}
                className="w-full h-full border-0"
              />
            </div>
          </div>

          {/* 右侧：交易面板 */}
          <div className="w-full lg:w-96 border-l border-white/10 flex-shrink-0 bg-black overflow-y-auto">
            <Tabs defaultValue="buy" className="w-full">
              <TabsList className="w-full grid grid-cols-2 bg-white/5 p-1 m-4 mb-0">
                <TabsTrigger 
                  value="buy"
                  className="data-[state=active]:bg-[#A3F030] data-[state=active]:text-black"
                >
                  买入
                </TabsTrigger>
                <TabsTrigger 
                  value="sell"
                  className="data-[state=active]:bg-[#FF4D4F] data-[state=active]:text-white"
                >
                  卖出
                </TabsTrigger>
              </TabsList>

              {/* 买入面板 */}
              <TabsContent value="buy" className="p-4 space-y-4">
                <Card className="bg-white/5 border-white/10">
                  <CardContent className="p-4 space-y-4">
                    {/* 价格类型选择 */}
                    <div className="flex gap-2">
                      <Button
                        variant={priceType === 'market' ? 'default' : 'outline'}
                        className={`flex-1 ${priceType === 'market' ? 'bg-[#A3F030] text-black hover:bg-[#A3F030]/90' : 'border-white/10 text-white hover:bg-white/5'}`}
                        onClick={() => setPriceType('market')}
                      >
                        市价
                      </Button>
                      <Button
                        variant={priceType === 'limit' ? 'default' : 'outline'}
                        className={`flex-1 ${priceType === 'limit' ? 'bg-[#A3F030] text-black hover:bg-[#A3F030]/90' : 'border-white/10 text-white hover:bg-white/5'}`}
                        onClick={() => setPriceType('limit')}
                      >
                        限价
                      </Button>
                    </div>

                    {/* 价格输入 */}
                    {priceType === 'limit' && (
                      <div>
                        <label className="text-xs text-white/50 mb-1.5 block">价格 (USD/{currentMetal.unit})</label>
                        <Input
                          type="number"
                          placeholder="请输入价格"
                          value={price}
                          onChange={(e) => setPrice(e.target.value)}
                          className="bg-white/5 border-white/10 text-white placeholder:text-white/40 focus-visible:ring-[#A3F030]"
                        />
                      </div>
                    )}

                    {/* 数量输入 */}
                    <div>
                      <label className="text-xs text-white/50 mb-1.5 block">数量 ({currentMetal.unit})</label>
                      <Input
                        type="number"
                        placeholder={`请输入${currentMetal.unit}数`}
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        className="bg-white/5 border-white/10 text-white placeholder:text-white/40 focus-visible:ring-[#A3F030]"
                      />
                    </div>

                    {/* 止损设置 */}
                    <div className="flex items-center justify-between">
                      <label className="text-sm text-white/70">设置止损</label>
                      <Checkbox
                        checked={stopLossEnabled}
                        onCheckedChange={(checked) => setStopLossEnabled(!!checked)}
                        className="border-white/20 data-[state=checked]:bg-[#A3F030] data-[state=checked]:border-[#A3F030]"
                      />
                    </div>

                    {/* 账户信息 */}
                    <div className="pt-2 space-y-2 text-sm border-t border-white/10">
                      <div className="flex justify-between text-white/50">
                        <span>可用余额</span>
                        <span className="text-white">$50,000.00</span>
                      </div>
                      <div className="flex justify-between text-white/50">
                        <span>预计成本</span>
                        <span className="text-white">
                          ${amount ? (parseFloat(amount) * currentMetal.price).toFixed(2) : '0.00'}
                        </span>
                      </div>
                    </div>

                    {/* 买入按钮 */}
                    <Button 
                      className="w-full bg-[#A3F030] hover:bg-[#A3F030]/90 text-black"
                    >
                      买入 {currentMetal.symbol.split('/')[0]}
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* 卖出面板 */}
              <TabsContent value="sell" className="p-4 space-y-4">
                <Card className="bg-white/5 border-white/10">
                  <CardContent className="p-4 space-y-4">
                    {/* 价格类型选择 */}
                    <div className="flex gap-2">
                      <Button
                        variant={priceType === 'market' ? 'default' : 'outline'}
                        className={`flex-1 ${priceType === 'market' ? 'bg-[#FF4D4F] text-white hover:bg-[#FF4D4F]/90' : 'border-white/10 text-white hover:bg-white/5'}`}
                        onClick={() => setPriceType('market')}
                      >
                        市价
                      </Button>
                      <Button
                        variant={priceType === 'limit' ? 'default' : 'outline'}
                        className={`flex-1 ${priceType === 'limit' ? 'bg-[#FF4D4F] text-white hover:bg-[#FF4D4F]/90' : 'border-white/10 text-white hover:bg-white/5'}`}
                        onClick={() => setPriceType('limit')}
                      >
                        限价
                      </Button>
                    </div>

                    {/* 价格输入 */}
                    {priceType === 'limit' && (
                      <div>
                        <label className="text-xs text-white/50 mb-1.5 block">价格 (USD/{currentMetal.unit})</label>
                        <Input
                          type="number"
                          placeholder="请输入价格"
                          value={price}
                          onChange={(e) => setPrice(e.target.value)}
                          className="bg-white/5 border-white/10 text-white placeholder:text-white/40 focus-visible:ring-[#A3F030]"
                        />
                      </div>
                    )}

                    {/* 数量输入 */}
                    <div>
                      <label className="text-xs text-white/50 mb-1.5 block">数量 ({currentMetal.unit})</label>
                      <Input
                        type="number"
                        placeholder={`请输入${currentMetal.unit}数`}
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        className="bg-white/5 border-white/10 text-white placeholder:text-white/40 focus-visible:ring-[#A3F030]"
                      />
                    </div>

                    {/* 止损设置 */}
                    <div className="flex items-center justify-between">
                      <label className="text-sm text-white/70">设置止损</label>
                      <Checkbox
                        checked={stopLossEnabled}
                        onCheckedChange={(checked) => setStopLossEnabled(!!checked)}
                        className="border-white/20 data-[state=checked]:bg-[#A3F030] data-[state=checked]:border-[#A3F030]"
                      />
                    </div>

                    {/* 账户信息 */}
                    <div className="pt-2 space-y-2 text-sm border-t border-white/10">
                      <div className="flex justify-between text-white/50">
                        <span>持有数量</span>
                        <span className="text-white">0 {currentMetal.unit}</span>
                      </div>
                      <div className="flex justify-between text-white/50">
                        <span>预计收益</span>
                        <span className="text-white">
                          ${amount ? (parseFloat(amount) * currentMetal.price).toFixed(2) : '0.00'}
                        </span>
                      </div>
                    </div>

                    {/* 卖出按钮 */}
                    <Button 
                      className="w-full bg-[#FF4D4F] hover:bg-[#FF4D4F]/90 text-white"
                    >
                      卖出 {currentMetal.symbol.split('/')[0]}
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>

      {/* 移动端底部导航 */}
      <MobileBottomNav />
    </div>
  )
}
