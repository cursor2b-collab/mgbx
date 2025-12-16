import { useState } from 'react';
import { Search, TrendingUp, TrendingDown, Clock, CheckCircle, XCircle, Eye } from 'lucide-react';

interface Trade {
  id: string;
  user: string;
  pair: string;
  type: 'buy' | 'sell';
  amount: string;
  price: string;
  total: string;
  fee: string;
  status: 'completed' | 'pending' | 'failed' | 'cancelled';
  timestamp: string;
}

export function TradeManagement() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'buy' | 'sell'>('all');
  const [filterStatus, setFilterStatus] = useState<'all' | 'completed' | 'pending' | 'failed'>('all');

  const trades: Trade[] = [
    {
      id: 'TRX001234',
      user: 'john***@gmail.com',
      pair: 'BTC/USDT',
      type: 'buy',
      amount: '0.5 BTC',
      price: '$45,000.00',
      total: '$22,500.00',
      fee: '$22.50',
      status: 'completed',
      timestamp: '2024-06-10 14:23:45'
    },
    {
      id: 'TRX001235',
      user: 'alice***@gmail.com',
      pair: 'ETH/USDT',
      type: 'sell',
      amount: '5 ETH',
      price: '$1,850.00',
      total: '$9,250.00',
      fee: '$9.25',
      status: 'completed',
      timestamp: '2024-06-10 14:20:12'
    },
    {
      id: 'TRX001236',
      user: 'bob***@gmail.com',
      pair: 'BNB/USDT',
      type: 'buy',
      amount: '50 BNB',
      price: '$250.00',
      total: '$12,500.00',
      fee: '$12.50',
      status: 'pending',
      timestamp: '2024-06-10 14:18:33'
    },
    {
      id: 'TRX001237',
      user: 'carol***@gmail.com',
      pair: 'SOL/USDT',
      type: 'buy',
      amount: '100 SOL',
      price: '$84.00',
      total: '$8,400.00',
      fee: '$8.40',
      status: 'completed',
      timestamp: '2024-06-10 14:15:28'
    },
    {
      id: 'TRX001238',
      user: 'david***@gmail.com',
      pair: 'ADA/USDT',
      type: 'sell',
      amount: '5000 ADA',
      price: '$0.43',
      total: '$2,150.00',
      fee: '$2.15',
      status: 'failed',
      timestamp: '2024-06-10 14:12:54'
    },
    {
      id: 'TRX001239',
      user: 'eve***@gmail.com',
      pair: 'DOT/USDT',
      type: 'buy',
      amount: '200 DOT',
      price: '$6.50',
      total: '$1,300.00',
      fee: '$1.30',
      status: 'completed',
      timestamp: '2024-06-10 14:10:17'
    },
  ];

  const filteredTrades = trades.filter(trade => {
    const matchesSearch = trade.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         trade.user.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         trade.pair.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = filterType === 'all' || trade.type === filterType;
    const matchesStatus = filterStatus === 'all' || trade.status === filterStatus;
    return matchesSearch && matchesType && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    const styles = {
      completed: 'bg-[#A3F030]/10 text-[#A3F030]',
      pending: 'bg-yellow-500/10 text-yellow-400',
      failed: 'bg-red-500/10 text-red-400',
      cancelled: 'bg-gray-500/10 text-gray-400'
    };
    const labels = {
      completed: '已完成',
      pending: '处理中',
      failed: '失败',
      cancelled: '已取消'
    };
    const icons = {
      completed: CheckCircle,
      pending: Clock,
      failed: XCircle,
      cancelled: XCircle
    };
    const Icon = icons[status as keyof typeof icons];
    return (
      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium ${styles[status as keyof typeof styles]}`}>
        <Icon className="w-3 h-3" />
        {labels[status as keyof typeof labels]}
      </span>
    );
  };

  const getTypeIcon = (type: string) => {
    return type === 'buy' ? (
      <TrendingUp className="w-4 h-4 text-[#A3F030]" />
    ) : (
      <TrendingDown className="w-4 h-4 text-red-400" />
    );
  };

  // 统计数据
  const totalTrades = trades.length;
  const completedTrades = trades.filter(t => t.status === 'completed').length;
  const totalVolume = trades
    .filter(t => t.status === 'completed')
    .reduce((sum, t) => sum + parseFloat(t.total.replace(/[$,]/g, '')), 0);
  const totalFees = trades
    .filter(t => t.status === 'completed')
    .reduce((sum, t) => sum + parseFloat(t.fee.replace(/[$,]/g, '')), 0);

  return (
    <div className="space-y-6">
      {/* 页面标题 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">交易管理</h1>
          <p className="text-gray-400 mt-1">实时监控和管理所有交易订单</p>
        </div>
        <button className="px-4 py-2 bg-[#A3F030] text-black rounded-lg font-medium hover:bg-[#A3F030]/90 transition-colors">
          导出交易数据
        </button>
      </div>

      {/* 统计卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <p className="text-gray-400 text-sm">总交易数</p>
          <p className="text-2xl font-bold text-white mt-1">{totalTrades}</p>
          <p className="text-[#A3F030] text-xs mt-1">今日数据</p>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <p className="text-gray-400 text-sm">成功交易</p>
          <p className="text-2xl font-bold text-white mt-1">{completedTrades}</p>
          <p className="text-[#A3F030] text-xs mt-1">{((completedTrades/totalTrades)*100).toFixed(1)}% 成功率</p>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <p className="text-gray-400 text-sm">交易总额</p>
          <p className="text-2xl font-bold text-white mt-1">${totalVolume.toLocaleString()}</p>
          <p className="text-[#A3F030] text-xs mt-1">+12.5% vs 昨日</p>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <p className="text-gray-400 text-sm">手续费收入</p>
          <p className="text-2xl font-bold text-white mt-1">${totalFees.toFixed(2)}</p>
          <p className="text-[#A3F030] text-xs mt-1">0.1% 费率</p>
        </div>
      </div>

      {/* 搜索和筛选 */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* 搜索框 */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="搜索交易ID、用户或交易对..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#A3F030]/50"
            />
          </div>

          {/* 类型筛选 */}
          <div className="flex gap-2">
            <button
              onClick={() => setFilterType('all')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                filterType === 'all'
                  ? 'bg-[#A3F030] text-black'
                  : 'bg-slate-800 text-gray-300 hover:bg-slate-700'
              }`}
            >
              全部
            </button>
            <button
              onClick={() => setFilterType('buy')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                filterType === 'buy'
                  ? 'bg-[#A3F030] text-black'
                  : 'bg-slate-800 text-gray-300 hover:bg-slate-700'
              }`}
            >
              买入
            </button>
            <button
              onClick={() => setFilterType('sell')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                filterType === 'sell'
                  ? 'bg-[#A3F030] text-black'
                  : 'bg-slate-800 text-gray-300 hover:bg-slate-700'
              }`}
            >
              卖出
            </button>
          </div>

          {/* 状态筛选 */}
          <div className="flex gap-2">
            <button
              onClick={() => setFilterStatus('all')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                filterStatus === 'all'
                  ? 'bg-[#A3F030] text-black'
                  : 'bg-slate-800 text-gray-300 hover:bg-slate-700'
              }`}
            >
              全部
            </button>
            <button
              onClick={() => setFilterStatus('completed')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                filterStatus === 'completed'
                  ? 'bg-[#A3F030] text-black'
                  : 'bg-slate-800 text-gray-300 hover:bg-slate-700'
              }`}
            >
              已完成
            </button>
            <button
              onClick={() => setFilterStatus('pending')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                filterStatus === 'pending'
                  ? 'bg-[#A3F030] text-black'
                  : 'bg-slate-800 text-gray-300 hover:bg-slate-700'
              }`}
            >
              处理中
            </button>
          </div>
        </div>
      </div>

      {/* 交易列表 */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-800/50">
                <th className="text-left px-6 py-4 text-gray-400 text-sm font-medium">交易ID</th>
                <th className="text-left px-6 py-4 text-gray-400 text-sm font-medium">用户</th>
                <th className="text-left px-6 py-4 text-gray-400 text-sm font-medium">交易对</th>
                <th className="text-left px-6 py-4 text-gray-400 text-sm font-medium">类型</th>
                <th className="text-right px-6 py-4 text-gray-400 text-sm font-medium">数量</th>
                <th className="text-right px-6 py-4 text-gray-400 text-sm font-medium">价格</th>
                <th className="text-right px-6 py-4 text-gray-400 text-sm font-medium">总额</th>
                <th className="text-right px-6 py-4 text-gray-400 text-sm font-medium">手续费</th>
                <th className="text-left px-6 py-4 text-gray-400 text-sm font-medium">状态</th>
                <th className="text-left px-6 py-4 text-gray-400 text-sm font-medium">时间</th>
                <th className="text-center px-6 py-4 text-gray-400 text-sm font-medium">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {filteredTrades.map((trade) => (
                <tr key={trade.id} className="hover:bg-slate-800/50 transition-colors">
                  <td className="px-6 py-4 text-white font-mono text-sm">
                    {trade.id}
                  </td>
                  <td className="px-6 py-4 text-gray-300 text-sm">
                    {trade.user}
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-white font-medium">{trade.pair}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      {getTypeIcon(trade.type)}
                      <span className={`text-sm font-medium ${
                        trade.type === 'buy' ? 'text-[#A3F030]' : 'text-red-400'
                      }`}>
                        {trade.type === 'buy' ? '买入' : '卖出'}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right text-white font-medium text-sm">
                    {trade.amount}
                  </td>
                  <td className="px-6 py-4 text-right text-gray-300 text-sm">
                    {trade.price}
                  </td>
                  <td className="px-6 py-4 text-right text-white font-medium">
                    {trade.total}
                  </td>
                  <td className="px-6 py-4 text-right text-gray-400 text-sm">
                    {trade.fee}
                  </td>
                  <td className="px-6 py-4">
                    {getStatusBadge(trade.status)}
                  </td>
                  <td className="px-6 py-4 text-gray-300 text-xs">
                    {trade.timestamp}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center">
                      <button className="p-1 text-gray-400 hover:text-[#A3F030] transition-colors" title="查看详情">
                        <Eye className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* 分页 */}
        <div className="px-6 py-4 border-t border-slate-800 flex items-center justify-between">
          <p className="text-gray-400 text-sm">显示 1-{filteredTrades.length} of {filteredTrades.length} 交易</p>
          <div className="flex gap-2">
            <button className="px-3 py-1 bg-slate-800 text-gray-300 rounded hover:bg-slate-700 transition-colors">
              上一页
            </button>
            <button className="px-3 py-1 bg-[#A3F030] text-black rounded font-medium">
              1
            </button>
            <button className="px-3 py-1 bg-slate-800 text-gray-300 rounded hover:bg-slate-700 transition-colors">
              下一页
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
