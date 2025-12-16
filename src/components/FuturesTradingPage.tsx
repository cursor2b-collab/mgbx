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

// 期货数据类型
interface FuturesContract {
  symbol: string
  name: string
  price: number
  change: number
  changePercent: number
  logo: string
  expiry?: string
}

// 期货LOGO映射
const FUTURES_LOGOS: { [key: string]: string } = {
  'GC': 'https://api.dicebear.com/7.x/shapes/svg?seed=GOLD&backgroundColor=FFD700',
  'CL': 'https://api.dicebear.com/7.x/shapes/svg?seed=OIL&backgroundColor=000000',
  'NG': 'https://api.dicebear.com/7.x/shapes/svg?seed=GAS&backgroundColor=4169E1',
  'SI': 'https://api.dicebear.com/7.x/shapes/svg?seed=SILVER&backgroundColor=C0C0C0',
  'HG': 'https://api.dicebear.com/7.x/shapes/svg?seed=COPPER&backgroundColor=B87333',
  'ZC': 'https://api.dicebear.com/7.x/shapes/svg?seed=CORN&backgroundColor=FFD700',
  'ZW': 'https://api.dicebear.com/7.x/shapes/svg?seed=WHEAT&backgroundColor=DEB887',
  'ZS': 'https://api.dicebear.com/7.x/shapes/svg?seed=SOYBEAN&backgroundColor=228B22',
  'LE': 'https://api.dicebear.com/7.x/shapes/svg?seed=CATTLE&backgroundColor=D2691E',
  'HE': 'https://api.dicebear.com/7.x/shapes/svg?seed=HOGS&backgroundColor=CD853F',
  'ES': 'https://api.dicebear.com/7.x/shapes/svg?seed=SP500&backgroundColor=0047AB',
  'NQ': 'https://api.dicebear.com/7.x/shapes/svg?seed=NASDAQ&backgroundColor=00BFFF',
  'YM': 'https://api.dicebear.com/7.x/shapes/svg?seed=DOW&backgroundColor=003366',
}

export function FuturesTradingPage() {
  const [selectedContract, setSelectedContract] = useState('GC')
  const [searchQuery, setSearchQuery] = useState('')
  const [priceType, setPriceType] = useState<'market' | 'limit'>('market')
  const [price, setPrice] = useState('')
  const [amount, setAmount] = useState('')
  const [stopLossEnabled, setStopLossEnabled] = useState(false)

  // 期货合约列表
  const futuresContracts: FuturesContract[] = [
    { symbol: 'GC', name: '黄金期货', price: 2045.50, change: 12.30, changePercent: 0.60, logo: FUTURES_LOGOS['GC'], expiry: '2025-02' },
    { symbol: 'SI', name: '白银期货', price: 24.85, change: -0.15, changePercent: -0.60, logo: FUTURES_LOGOS['SI'], expiry: '2025-03' },
    { symbol: 'CL', name: '原油期货', price: 82.45, change: 1.25, changePercent: 1.54, logo: FUTURES_LOGOS['CL'], expiry: '2025-01' },
    { symbol: 'NG', name: '天然气期货', price: 3.125, change: -0.042, changePercent: -1.33, logo: FUTURES_LOGOS['NG'], expiry: '2025-02' },
    { symbol: 'HG', name: '铜期货', price: 3.825, change: 0.035, changePercent: 0.92, logo: FUTURES_LOGOS['HG'], expiry: '2025-03' },
    { symbol: 'ZC', name: '玉米期货', price: 478.25, change: -2.50, changePercent: -0.52, logo: FUTURES_LOGOS['ZC'], expiry: '2025-03' },
    { symbol: 'ZW', name: '小麦期货', price: 612.50, change: 5.25, changePercent: 0.86, logo: FUTURES_LOGOS['ZW'], expiry: '2025-03' },
    { symbol: 'ZS', name: '大豆期货', price: 1345.75, change: -8.50, changePercent: -0.63, logo: FUTURES_LOGOS['ZS'], expiry: '2025-03' },
    { symbol: 'LE', name: '活牛期货', price: 182.50, change: 1.25, changePercent: 0.69, logo: FUTURES_LOGOS['LE'], expiry: '2025-02' },
    { symbol: 'HE', name: '瘦猪期货', price: 78.45, change: -0.85, changePercent: -1.07, logo: FUTURES_LOGOS['HE'], expiry: '2025-02' },
    { symbol: 'ES', name: 'E-mini标普500', price: 4785.25, change: 15.50, changePercent: 0.32, logo: FUTURES_LOGOS['ES'], expiry: '2025-03' },
    { symbol: 'NQ', name: 'E-mini纳斯达克', price: 16845.50, change: 42.25, changePercent: 0.25, logo: FUTURES_LOGOS['NQ'], expiry: '2025-03' },
    { symbol: 'YM', name: 'E-mini道琼斯', price: 37425.00, change: -85.00, changePercent: -0.23, logo: FUTURES_LOGOS['YM'], expiry: '2025-03' },
  ]

  const currentContract = futuresContracts.find(c => c.symbol === selectedContract) || futuresContracts[0]

  const filteredContracts = futuresContracts.filter(contract =>
    contract.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
    contract.name.includes(searchQuery)
  )

  return (
    <div className="min-h-screen bg-black text-white">
      {/* 顶部导航栏 */}
      <Navbar />

      {/* 主要内容区域 */}
      <div className="flex flex-col min-h-[calc(100vh-56px)] lg:h-[calc(100vh-56px)] overflow-hidden">
        {/* 顶部：期货合约信息栏（标题区域 - 横跨全宽） */}
        <div className="border-b border-white/10 bg-black px-4 lg:px-6 py-3 lg:py-4 flex-shrink-0">
          <div className="flex flex-col lg:flex-row lg:items-center gap-3 lg:gap-8">
            <div>
              <div className="flex items-center gap-2 mb-1">
                {currentContract.logo && (
                  <ImageWithFallback 
                    src={currentContract.logo} 
                    alt={selectedContract}
                    className="w-8 h-8 rounded-full"
                  />
                )}
                <h2 className="text-xl font-bold">{selectedContract}</h2>
                <span className="text-xs text-white/50">
                  {currentContract.name}
                </span>
                {currentContract.expiry && (
                  <span className="text-xs px-2 py-0.5 bg-white/10 rounded">
                    {currentContract.expiry}
                  </span>
                )}
              </div>
            </div>
            
            <div className="flex flex-wrap items-center gap-3 lg:gap-6 text-sm">
              <div>
                <div className="text-white/50 text-xs mb-0.5">最新价</div>
                <div className={`text-lg ${currentContract.change >= 0 ? 'text-[#00C087]' : 'text-[#FF4D4F]'}`}>
                  ${currentContract.price.toFixed(2)}
                </div>
              </div>
              
              <div>
                <div className="text-white/50 text-xs mb-0.5">24h涨跌</div>
                <div className={currentContract.change >= 0 ? 'text-[#00C087]' : 'text-[#FF4D4F]'}>
                  {currentContract.change >= 0 ? '+' : ''}{currentContract.change.toFixed(2)}
                </div>
              </div>
              
              <div>
                <div className="text-white/50 text-xs mb-0.5">24h涨幅</div>
                <div className={currentContract.changePercent >= 0 ? 'text-[#00C087]' : 'text-[#FF4D4F]'}>
                  {currentContract.changePercent >= 0 ? '+' : ''}{currentContract.changePercent.toFixed(2)}%
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 下方：三栏布局（左中右） */}
        <div className="flex flex-1 overflow-hidden">
          {/* 左侧：合约列表 */}
          <div className="hidden lg:block w-80 border-r border-white/10 flex-shrink-0 bg-black overflow-hidden flex flex-col">
            <div className="p-4 border-b border-white/10 flex-shrink-0">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                <Input
                  placeholder="搜索期货合约"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-white/40 focus-visible:ring-[#A3F030]"
                />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto">
              {filteredContracts.map((contract) => (
                <div
                  key={contract.symbol}
                  onClick={() => setSelectedContract(contract.symbol)}
                  className={`p-3 border-b border-white/5 cursor-pointer transition-colors hover:bg-white/5 ${
                    selectedContract === contract.symbol ? 'bg-white/10' : ''
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 flex-1">
                      {contract.logo && (
                        <ImageWithFallback 
                          src={contract.logo} 
                          alt={contract.symbol}
                          className="w-10 h-10 rounded-full"
                        />
                      )}
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-white">{contract.symbol}</span>
                          {contract.expiry && (
                            <span className="text-xs px-1.5 py-0.5 bg-white/5 rounded text-white/50">
                              {contract.expiry}
                            </span>
                          )}
                        </div>
                        <div className="text-xs text-white/50">{contract.name}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-white text-sm">${contract.price.toFixed(2)}</div>
                      <div className={`text-xs ${contract.changePercent >= 0 ? 'text-[#00C087]' : 'text-[#FF4D4F]'}`}>
                        {contract.changePercent >= 0 ? '+' : ''}{contract.changePercent.toFixed(2)}%
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
                src={`https://www.tradingview.com/widgetembed/?frameElementId=tradingview_futures&symbol=${currentContract.symbol}&interval=D&hidesidetoolbar=0&symboledit=1&saveimage=0&toolbarbg=000000&studies=[]&theme=dark&style=1&timezone=America/New_York&studies_overrides={}&overrides={}&enabled_features=[]&disabled_features=[]&locale=zh_CN&utm_source=localhost&utm_medium=widget&utm_campaign=chart&utm_term=${currentContract.symbol}`}
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
                  买入/做多
                </TabsTrigger>
                <TabsTrigger 
                  value="sell"
                  className="data-[state=active]:bg-[#FF4D4F] data-[state=active]:text-white"
                >
                  卖出/做空
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
                        <label className="text-xs text-white/50 mb-1.5 block">价格</label>
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
                      <label className="text-xs text-white/50 mb-1.5 block">合约数量</label>
                      <Input
                        type="number"
                        placeholder="请输入合约数量"
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
                        <span>可用保证金</span>
                        <span className="text-white">$10,000.00</span>
                      </div>
                      <div className="flex justify-between text-white/50">
                        <span>所需保证金</span>
                        <span className="text-white">
                          ${amount ? (parseFloat(amount) * currentContract.price * 0.1).toFixed(2) : '0.00'}
                        </span>
                      </div>
                    </div>

                    {/* 买入按钮 */}
                    <Button 
                      className="w-full bg-[#A3F030] hover:bg-[#A3F030]/90 text-black"
                    >
                      买入做多
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
                        <label className="text-xs text-white/50 mb-1.5 block">价格</label>
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
                      <label className="text-xs text-white/50 mb-1.5 block">合约数量</label>
                      <Input
                        type="number"
                        placeholder="请输入合约数量"
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
                        <span>可用保证金</span>
                        <span className="text-white">$10,000.00</span>
                      </div>
                      <div className="flex justify-between text-white/50">
                        <span>所需保证金</span>
                        <span className="text-white">
                          ${amount ? (parseFloat(amount) * currentContract.price * 0.1).toFixed(2) : '0.00'}
                        </span>
                      </div>
                    </div>

                    {/* 卖出按钮 */}
                    <Button 
                      className="w-full bg-[#FF4D4F] hover:bg-[#FF4D4F]/90 text-white"
                    >
                      卖出做空
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
