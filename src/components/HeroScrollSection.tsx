import React, { useState, useEffect } from "react";
import { ContainerScroll } from "./ui/container-scroll-animation";
import { TrendingUp, TrendingDown, BarChart3, Activity } from "lucide-react";

export function HeroScrollSection() {
  const [ticker, setTicker] = useState<any>(null);
  const [orderBook, setOrderBook] = useState<any>({ bids: [], asks: [] });

  // 获取实时行情数据
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('https://api.binance.com/api/v3/ticker/24hr?symbol=BTCUSDT');
        
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        
        const data = await response.json();
        setTicker(data);
      } catch (error) {
        // API调用失败，使用模拟数据（静默失败）
        // 使用模拟数据
        setTicker({
          symbol: 'BTCUSDT',
          lastPrice: '67234.50',
          priceChange: '1542.30',
          priceChangePercent: '2.34',
          highPrice: '68500.00',
          lowPrice: '65000.00',
          volume: '28543.25',
          quoteVolume: '1923456789.50'
        });
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 3000);
    return () => clearInterval(interval);
  }, []);

  // 获取订单簿数据
  useEffect(() => {
    const fetchOrderBook = async () => {
      try {
        const response = await fetch('https://api.binance.com/api/v3/depth?symbol=BTCUSDT&limit=10');
        
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        
        const data = await response.json();
        setOrderBook(data);
      } catch (error) {
        // API调用失败，使用模拟数据（静默失败）
        // 使用模拟数据
        const mockOrderBook = {
          bids: Array.from({ length: 10 }, (_, i) => [
            (67000 - i * 10).toString(),
            (Math.random() * 5).toFixed(4)
          ]),
          asks: Array.from({ length: 10 }, (_, i) => [
            (67000 + i * 10).toString(),
            (Math.random() * 5).toFixed(4)
          ])
        };
        setOrderBook(mockOrderBook);
      }
    };

    fetchOrderBook();
    const interval = setInterval(fetchOrderBook, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col overflow-hidden bg-black">
      <ContainerScroll
        titleComponent={
          <>
            <h1 className="text-4xl font-semibold text-white mb-4">
              专业级交易体验 <br />
              <span className="text-4xl md:text-[6rem] font-bold mt-1 leading-none" style={{ color: '#A3F030' }}>
                实时交易终端
              </span>
            </h1>
          </>
        }
      >
        {/* 主交易界面 - 3栏布局 */}
        <div className="h-full w-full bg-zinc-950 rounded-lg overflow-hidden grid grid-cols-1 lg:grid-cols-12 gap-0 border border-zinc-800/50">
          
          {/* 左侧：市场数据和订单簿 */}
          <div className="lg:col-span-3 border-r border-zinc-800/50 bg-black/40 backdrop-blur-xl flex flex-col">
            {/* 行情概览 */}
            <div className="p-4 border-b border-zinc-800/50">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-500 to-yellow-500 flex items-center justify-center">
                  <span className="text-white text-sm font-bold">₿</span>
                </div>
                <div>
                  <p className="text-white font-semibold">BTC/USDT</p>
                  <p className="text-xs text-gray-500">Bitcoin</p>
                </div>
              </div>
              
              {ticker && (
                <>
                  <div className="mb-2">
                    <p className="text-3xl font-bold text-white font-mono">
                      ${parseFloat(ticker.lastPrice).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      {parseFloat(ticker.priceChangePercent) >= 0 ? (
                        <TrendingUp className="w-4 h-4 text-green-500" />
                      ) : (
                        <TrendingDown className="w-4 h-4 text-red-500" />
                      )}
                      <span className={`text-sm font-semibold ${
                        parseFloat(ticker.priceChangePercent) >= 0 ? 'text-green-500' : 'text-red-500'
                      }`}>
                        {parseFloat(ticker.priceChangePercent) >= 0 ? '+' : ''}
                        {parseFloat(ticker.priceChangePercent).toFixed(2)}%
                      </span>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <p className="text-gray-500">24h最高</p>
                      <p className="text-white font-mono">${parseFloat(ticker.highPrice).toLocaleString('en-US', { minimumFractionDigits: 2 })}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">24h最低</p>
                      <p className="text-white font-mono">${parseFloat(ticker.lowPrice).toLocaleString('en-US', { minimumFractionDigits: 2 })}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">24h成交量</p>
                      <p className="text-white font-mono">{(parseFloat(ticker.volume) / 1000).toFixed(2)}K</p>
                    </div>
                    <div>
                      <p className="text-gray-500">24h成交额</p>
                      <p className="text-white font-mono">${(parseFloat(ticker.quoteVolume) / 1000000).toFixed(2)}M</p>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* 订单簿 */}
            <div className="flex-1 overflow-hidden flex flex-col">
              <div className="px-4 py-2 border-b border-zinc-800/50">
                <p className="text-white text-sm font-semibold flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-blue-500" />
                  订单簿
                </p>
              </div>
              
              <div className="flex-1 overflow-y-auto">
                {/* 卖单 */}
                <div className="px-4 py-2">
                  <p className="text-xs text-gray-500 mb-2">卖单</p>
                  {orderBook.asks.slice(0, 5).reverse().map((ask: any, index: number) => (
                    <div key={index} className="flex justify-between text-xs mb-1 hover:bg-red-500/10 px-1 rounded">
                      <span className="text-red-500 font-mono">{parseFloat(ask[0]).toFixed(2)}</span>
                      <span className="text-gray-400 font-mono">{parseFloat(ask[1]).toFixed(4)}</span>
                    </div>
                  ))}
                </div>

                {/* 当前价格 */}
                {ticker && (
                  <div className="px-4 py-2 bg-zinc-900/50 border-y border-zinc-800/50">
                    <p className={`text-lg font-bold font-mono text-center ${
                      parseFloat(ticker.priceChangePercent) >= 0 ? 'text-green-500' : 'text-red-500'
                    }`}>
                      {parseFloat(ticker.lastPrice).toFixed(2)}
                    </p>
                  </div>
                )}

                {/* 买单 */}
                <div className="px-4 py-2">
                  <p className="text-xs text-gray-500 mb-2">买单</p>
                  {orderBook.bids.slice(0, 5).map((bid: any, index: number) => (
                    <div key={index} className="flex justify-between text-xs mb-1 hover:bg-green-500/10 px-1 rounded">
                      <span className="text-green-500 font-mono">{parseFloat(bid[0]).toFixed(2)}</span>
                      <span className="text-gray-400 font-mono">{parseFloat(bid[1]).toFixed(4)}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* 中间：TradingView 图表 */}
          <div className="lg:col-span-6 bg-black/60 backdrop-blur-xl border-r border-zinc-800/50 flex flex-col">
            {/* 图表工具栏 */}
            <div className="h-12 border-b border-zinc-800/50 flex items-center px-4 gap-4 bg-zinc-900/50">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-blue-500" />
                <span className="text-white text-sm font-semibold">K线图</span>
              </div>
              <div className="flex gap-2 ml-auto">
                {['1分', '5分', '15分', '1小时', '1日'].map((time) => (
                  <button
                    key={time}
                    className="px-2 py-1 text-xs text-gray-400 hover:text-white hover:bg-white/5 rounded transition-colors"
                  >
                    {time}
                  </button>
                ))}
              </div>
            </div>

            {/* TradingView 图表 */}
            <div className="flex-1 relative bg-black">
              <iframe
                src="https://www.tradingview.com/widgetembed/?frameElementId=tradingview_chart&symbol=BINANCE:BTCUSDT&interval=D&hidesidetoolbar=0&symboledit=1&saveimage=1&toolbarbg=000000&studies=[]&theme=dark&style=1&timezone=Asia/Shanghai&locale=zh_CN"
                className="w-full h-full border-0"
                title="TradingView Chart"
              />
            </div>
          </div>

          {/* 右侧：交易面板 */}
          <div className="lg:col-span-3 bg-black/40 backdrop-blur-xl flex flex-col">
            {/* 交易类型切换 */}
            <div className="h-12 border-b border-zinc-800/50 flex items-center px-4 bg-zinc-900/50">
              <div className="flex gap-1 w-full">
                <button className="flex-1 px-3 py-1.5 text-xs font-semibold text-white bg-blue-600 rounded">
                  现货
                </button>
                <button className="flex-1 px-3 py-1.5 text-xs font-semibold text-gray-400 hover:text-white hover:bg-white/5 rounded transition-colors">
                  杠杆
                </button>
                <button className="flex-1 px-3 py-1.5 text-xs font-semibold text-gray-400 hover:text-white hover:bg-white/5 rounded transition-colors">
                  合约
                </button>
              </div>
            </div>

            {/* 买入面板 */}
            <div className="flex-1 p-4 border-b border-zinc-800/50">
              <div className="mb-3">
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs text-gray-400">价格</label>
                  <span className="text-xs text-gray-500">USDT</span>
                </div>
                <input
                  type="text"
                  placeholder={ticker ? parseFloat(ticker.lastPrice).toFixed(2) : '0.00'}
                  className="w-full px-3 py-2 bg-zinc-900/50 border border-zinc-800 rounded text-white text-sm font-mono focus:outline-none focus:border-blue-500 transition-colors"
                />
              </div>

              <div className="mb-3">
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs text-gray-400">数量</label>
                  <span className="text-xs text-gray-500">BTC</span>
                </div>
                <input
                  type="text"
                  placeholder="0.00"
                  className="w-full px-3 py-2 bg-zinc-900/50 border border-zinc-800 rounded text-white text-sm font-mono focus:outline-none focus:border-blue-500 transition-colors"
                />
              </div>

              <div className="flex gap-1 mb-3">
                {['25%', '50%', '75%', '100%'].map((percent) => (
                  <button
                    key={percent}
                    className="flex-1 px-2 py-1 text-xs text-gray-400 bg-zinc-900/50 border border-zinc-800 rounded hover:border-green-500/50 hover:text-green-500 transition-colors"
                  >
                    {percent}
                  </button>
                ))}
              </div>

              <button className="w-full py-2.5 bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 text-white font-semibold rounded transition-all transform hover:scale-[1.02] text-center">
                买入 BTC
              </button>

              <div className="mt-3 text-xs text-gray-500">
                可用: 0.00 USDT
              </div>
            </div>

            {/* 卖出面板 */}
            <div className="flex-1 p-4">
              <div className="mb-3">
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs text-gray-400">价格</label>
                  <span className="text-xs text-gray-500">USDT</span>
                </div>
                <input
                  type="text"
                  placeholder={ticker ? parseFloat(ticker.lastPrice).toFixed(2) : '0.00'}
                  className="w-full px-3 py-2 bg-zinc-900/50 border border-zinc-800 rounded text-white text-sm font-mono focus:outline-none focus:border-red-500 transition-colors"
                />
              </div>

              <div className="mb-3">
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs text-gray-400">数量</label>
                  <span className="text-xs text-gray-500">BTC</span>
                </div>
                <input
                  type="text"
                  placeholder="0.00"
                  className="w-full px-3 py-2 bg-zinc-900/50 border border-zinc-800 rounded text-white text-sm font-mono focus:outline-none focus:border-red-500 transition-colors"
                />
              </div>

              <div className="flex gap-1 mb-3">
                {['25%', '50%', '75%', '100%'].map((percent) => (
                  <button
                    key={percent}
                    className="flex-1 px-2 py-1 text-xs text-gray-400 bg-zinc-900/50 border border-zinc-800 rounded hover:border-red-500/50 hover:text-red-500 transition-colors"
                  >
                    {percent}
                  </button>
                ))}
              </div>

              <button className="w-full py-2.5 bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600 text-white font-semibold rounded transition-all transform hover:scale-[1.02] text-center">
                卖出 BTC
              </button>

              <div className="mt-3 text-xs text-gray-500">
                可用: 0.00 BTC
              </div>
            </div>
          </div>
        </div>
      </ContainerScroll>
    </div>
  );
}
