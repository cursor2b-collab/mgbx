# 📱 移动端交易抽屉完整指南

## 🎯 功能概述

参考专业交易APP的设计，为移动端用户提供了从底部展开的全屏交易抽屉界面，包含实时图表、价格信息和交易表单。

---

## ✨ 主要特性

### 1. **底部抽屉展开**
- 点击底部导航栏的"交易"按钮，从底部平滑展开
- 占据90%视口高度，提供沉浸式交易体验
- 支持下拉手势关闭

### 2. **完整交易信息**
- 实时价格更新（每3秒）
- 涨跌幅显示（荧光绿/红色）
- 24h数据：最高、最低、成交量、成交额
- 今开、昨收价格

### 3. **TradingView 集成**
- 完整的K线图表
- 时间周期选择：1m、1h、1D、1W、1M
- 深色主题适配
- 技术指标支持

### 4. **交易表单**
- 三种交易模式：普通交易、融资融券、盘前
- 市价/限价切换
- 百分比快速选择（0%, 25%, 50%, 75%, 100%）
- 荧光绿买入按钮

### 5. **多交易对支持**
- 下拉菜单快速切换
- 热门币种：BTC、ETH、BNB、SOL、XRP
- 点击切换时自动更新图表和数据

---

## 📂 文件结构

### 新增文件
```
/components/
  ├── MobileTradingDrawer.tsx    # 交易抽屉主组件
  └── MobileBottomNav.tsx         # 更新：添加抽屉触发
```

### 修改文件
```
/components/MobileBottomNav.tsx
  - 导入 Drawer 和 MobileTradingDrawer
  - 添加 tradingDrawerOpen 状态
  - 交易按钮改为 button，点击打开抽屉
  - 添加 Drawer 组件包裹
```

---

## 🎨 设计规范

### 颜色系统
```css
背景色：#1a1a1a (主容器)
         #0a0a0a (图表区域)
         
强调色：#A3F030 (荧光绿 - 买入/涨幅)
        #ef4444 (红色 - 卖出/跌幅)
        
文字色：#ffffff (主文字)
        rgba(255,255,255,0.5) (次要文字)
        rgba(255,255,255,0.2) (分割线)
```

### 间距规范
```css
容器padding: 16px
元素间距: 12px - 16px
拖动条: w-12 h-1 (宽48px 高4px)
```

### 字体大小
```css
交易对名称: text-xl (20px)
价格: text-3xl (30px)
涨跌幅: text-lg (18px)
统计数据: text-sm (14px)
按钮文字: text-base (16px)
```

---

## 🔧 核心代码

### 1. MobileBottomNav 集成

```tsx
import { Drawer, DrawerContent } from './ui/drawer';
import { MobileTradingDrawer } from './MobileTradingDrawer';

export function MobileBottomNav() {
  const [tradingDrawerOpen, setTradingDrawerOpen] = useState(false);

  return (
    <div className="aiz-mobile-bottom-nav">
      {/* 交易按钮 */}
      <button 
        onClick={() => {
          if (window.innerWidth < 992) {
            setTradingDrawerOpen(true)  // 移动端打开抽屉
          } else {
            navigate('/trading')  // 桌面端跳转页面
          }
        }}
        className="nav-button-mobile"
      >
        <svg>...</svg>
        <p>交易</p>
      </button>

      {/* 抽屉 */}
      <Drawer open={tradingDrawerOpen} onOpenChange={setTradingDrawerOpen}>
        <DrawerContent className="h-[90vh] max-h-[90vh] bg-transparent border-0">
          <MobileTradingDrawer 
            symbol="BTCUSDT"
            onClose={() => setTradingDrawerOpen(false)}
          />
        </DrawerContent>
      </Drawer>
    </div>
  )
}
```

### 2. 实时数据获取

```tsx
useEffect(() => {
  const fetchTickerData = async () => {
    try {
      const response = await fetch(
        `https://api.binance.com/api/v3/ticker/24hr?symbol=${symbol}`
      )
      const data = await response.json()
      setTicker(data)
    } catch (error) {
      console.error('获取行情数据失败:', error)
    }
  }

  fetchTickerData()
  const interval = setInterval(fetchTickerData, 3000)  // 每3秒更新
  return () => clearInterval(interval)
}, [symbol])
```

### 3. TradingView 嵌入

```tsx
<iframe
  src={`https://www.tradingview.com/widgetembed/?
    frameElementId=tradingview_chart&
    symbol=BINANCE:${symbol}&
    interval=60&
    hidesidetoolbar=1&
    symboledit=0&
    saveimage=0&
    toolbarbg=0a0a0a&
    theme=dark&
    style=1&
    timezone=Asia/Shanghai&
    withdateranges=1&
    locale=zh_CN
  `}
  className="w-full h-full border-0"
/>
```

### 4. 交易对切换

```tsx
<DropdownMenu>
  <DropdownMenuTrigger className="flex items-center gap-2">
    <h2 className="text-xl font-bold">{displaySymbol}</h2>
    <ChevronDown className="w-5 h-5" />
  </DropdownMenuTrigger>
  <DropdownMenuContent className="bg-[#1a1a1a] border-white/10">
    {popularPairs.map((pair) => (
      <DropdownMenuItem
        key={pair.symbol}
        onClick={() => setSymbol(pair.symbol)}
      >
        {pair.symbol.replace('USDT', '')}
      </DropdownMenuItem>
    ))}
  </DropdownMenuContent>
</DropdownMenu>
```

---

## 📊 布局结构

```
┌─────────────────────────────────────┐
│  ━━━━ (拖动条)                      │
├─────────────────────────────────────┤
│  BTCUSDT ▼    📊  ⭐  ✕             │ ← 顶部栏
│  574.28                              │
│  +43.54 +7%                          │
│  今开   最高   最低                  │
│  昨收   成交额 成交量                │
├─────────────────────────────────────┤
│  Time  1m  [1h]  1D  1W  1M         │ ← 时间选择
├─────────────────────────────────────┤
│  ┌─────────────────────────────┐   │
│  │                              │   │
│  │   📈 TradingView 图表        │   │ ← 图表区
│  │                              │   │
│  │                              │   │
│  └─────────────────────────────┘   │
├─────────────────────────────────────┤
│  普通交易 | 融资融券 | 盘前         │ ← 交易模式
│  ┌───────┐  ┌───────┐             │
│  │ 市价  │  │ 限价  │             │
│  └───────┘  └───────┘             │
│  ┌─────────────────────────────┐   │
│  │ 数量                         │   │
│  └─────────────────────────────┘   │
│  ● 0%  25%  50%  75%  100%          │
│  ┌─────────────────────────────┐   │
│  │        买入                  │   │ ← 荧光绿按钮
│  └─────────────────────────────┘   │
├─────────────────────────────────────┤
│  当前委托 | 历史订单                │ ← 底部Tab
└─────────────────────────────────────┘
                                    🔴 ← 悬浮按钮
```

---

## 🚀 使用方法

### 基础用法
```tsx
<MobileTradingDrawer 
  symbol="BTCUSDT"
  onClose={() => console.log('关闭抽屉')}
/>
```

### 自定义交易对
```tsx
<MobileTradingDrawer 
  symbol="ETHUSDT"
  onClose={handleClose}
/>
```

---

## 🎯 交互流程

### 1. 打开抽屉
```
用户操作: 点击底部导航"交易"按钮
  ↓
检测设备: window.innerWidth < 992
  ↓
移动端: setTradingDrawerOpen(true)
桌面端: navigate('/trading')
  ↓
抽屉展开: 从底部滑入，高度90vh
```

### 2. 切换交易对
```
用户操作: 点击交易对名称
  ↓
显示下拉菜单: 5个热门币种
  ↓
选择新币种: setSymbol('ETHUSDT')
  ↓
自动更新:
  - 重新获取价格数据
  - 更新图表 iframe src
  - 清空输入框
```

### 3. 下单流程
```
选择模式: 普通交易/融资融券/盘前
  ↓
选择类型: 市价/限价
  ↓
输入数量: 手动输入或点击百分比
  ↓
点击买入: 触发交易逻辑（待实现）
```

---

## 🔌 API 集成

### Binance API
```typescript
// 24小时行情数据
GET https://api.binance.com/api/v3/ticker/24hr?symbol=BTCUSDT

Response:
{
  "symbol": "BTCUSDT",
  "lastPrice": "43521.50",
  "priceChange": "1234.50",
  "priceChangePercent": "2.92",
  "highPrice": "44000.00",
  "lowPrice": "42000.00",
  "volume": "12345.67",
  "quoteVolume": "534123456.78",
  "openPrice": "42287.00"
}
```

### TradingView Widget
```
Base URL: https://www.tradingview.com/widgetembed/

参数:
- symbol: BINANCE:BTCUSDT
- interval: 60 (分钟)
- theme: dark
- style: 1 (K线图)
- locale: zh_CN
```

---

## 🎨 视觉特效

### 1. 拖动条
```tsx
<div className="w-12 h-1 bg-white/20 rounded-full"></div>
```
- 宽度: 48px
- 高度: 4px
- 颜色: 白色20%透明度
- 居中显示

### 2. 价格颜色动态
```tsx
className={`text-3xl font-bold ${
  isPositive ? 'text-[#A3F030]' : 'text-red-500'
}`}
```
- 上涨: 荧光绿 #A3F030
- 下跌: 红色 #ef4444

### 3. 按钮状态
```tsx
// 激活状态
className="bg-[#A3F030] text-black"

// 未激活状态
className="bg-white/10 text-white/70"

// 悬停状态
className="hover:bg-white/20"
```

### 4. 悬浮按钮
```tsx
<button className="
  fixed right-4 bottom-24 
  w-14 h-14 rounded-full 
  bg-gradient-to-br from-pink-500 to-pink-600 
  shadow-lg shadow-pink-500/50 
  hover:scale-110 transition-transform
">
```
- 位置: 右下角
- 渐变: 粉红色
- 阴影: 粉红色光晕
- 交互: 悬停放大

---

## 📱 响应式设计

### 移动端 (< 992px)
- 抽屉高度: 90vh
- 图表最小高度: 无限制
- 布局: 垂直堆叠
- 交互: 触摸优化

### 桌面端 (≥ 992px)
- 不显示抽屉
- 跳转到 /trading 完整页面
- 保持三栏布局

---

## 🔧 配置选项

### MobileTradingDrawerProps
```typescript
interface MobileTradingDrawerProps {
  symbol?: string        // 默认交易对 (BTCUSDT)
  onClose?: () => void   // 关闭回调
}
```

### 热门交易对配置
```typescript
const popularPairs = [
  { symbol: 'BTCUSDT', name: 'Bitcoin' },
  { symbol: 'ETHUSDT', name: 'Ethereum' },
  { symbol: 'BNBUSDT', name: 'BNB' },
  { symbol: 'SOLUSDT', name: 'Solana' },
  { symbol: 'XRPUSDT', name: 'Ripple' },
]
```

### 时间周期选项
```typescript
const timeframes = ['1m', '1h', '1D', '1W', '1M']
```

---

## 🐛 已知问题

### 1. TradingView 加载
- **问题**: iframe可能加载较慢
- **解决**: 添加加载骨架屏（待实现）

### 2. 数据更新频率
- **当前**: 3秒一次
- **优化**: 使用WebSocket实时推送

### 3. 交易功能
- **状态**: UI完成，后端待集成
- **计划**: 连接Binance API或后端服务

---

## 🎯 未来优化

### 短期 (v1.1)
- [ ] 添加收藏交易对功能
- [ ] 订单簿实时数据
- [ ] 最近成交记录
- [ ] 深度图表

### 中期 (v1.2)
- [ ] K线图表本地实现（替代iframe）
- [ ] 技术指标选择
- [ ] 价格预警设置
- [ ] 资金费率显示

### 长期 (v2.0)
- [ ] WebSocket实时推送
- [ ] 一键复制跟单
- [ ] 止盈止损设置
- [ ] 交易历史分析

---

## 📝 开发注意事项

### 1. 性能优化
```typescript
// 使用 useCallback 避免重复创建函数
const handleSymbolChange = useCallback((newSymbol: string) => {
  setSymbol(newSymbol)
}, [])

// 清理定时器
useEffect(() => {
  const interval = setInterval(fetchData, 3000)
  return () => clearInterval(interval)
}, [symbol])
```

### 2. 错误处理
```typescript
try {
  const response = await fetch(url)
  const data = await response.json()
  setTicker(data)
} catch (error) {
  console.error('获取数据失败:', error)
  // TODO: 显示错误提示
}
```

### 3. 类型安全
```typescript
interface TickerData {
  lastPrice: string
  priceChange: string
  priceChangePercent: string
  // ... 其他字段
}
```

---

## 🔗 相关文件

### 组件
- `/components/MobileTradingDrawer.tsx` - 抽屉主组件
- `/components/MobileBottomNav.tsx` - 底部导航栏
- `/components/ui/drawer.tsx` - Drawer基础组件

### 样式
- `/styles/MobileBottomNav.css` - 底部导航样式
- `/styles/globals.css` - 全局样式

### 工具
- `/hooks/useAuth.ts` - 认证hook

---

## 📚 参考资料

- [Binance API 文档](https://binance-docs.github.io/apidocs/)
- [TradingView Widget](https://www.tradingview.com/widget/)
- [Vaul Drawer](https://github.com/emilkowalski/vaul)

---

**最后更新**: 2025-11-05  
**版本**: v1.0  
**状态**: ✅ 基础功能完成
