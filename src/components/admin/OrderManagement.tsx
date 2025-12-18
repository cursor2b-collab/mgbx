import { useState } from 'react';
import { Search, Filter, Clock, CheckCircle, XCircle, AlertTriangle, Eye, RefreshCw } from 'lucide-react';

interface Order {
  id: string;
  user: string;
  type: 'limit' | 'market' | 'stop';
  side: 'buy' | 'sell';
  pair: string;
  amount: string;
  price: string;
  filled: string;
  total: string;
  status: 'pending' | 'partial' | 'filled' | 'cancelled' | 'expired';
  createdAt: string;
  updatedAt: string;
}

export function OrderManagement() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'limit' | 'market' | 'stop'>('all');
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'partial' | 'filled' | 'cancelled'>('all');

  const orders: Order[] = [
    {
      id: 'ORD001234',
      user: 'john***@gmail.com',
      type: 'limit',
      side: 'buy',
      pair: 'BTC/USDT',
      amount: '0.5 BTC',
      price: '$45,000',
      filled: '0.3 BTC',
      total: '$22,500',
      status: 'partial',
      createdAt: '2024-06-10 14:30:00',
      updatedAt: '2024-06-10 14:35:00'
    },
    {
      id: 'ORD001235',
      user: 'alice***@gmail.com',
      type: 'market',
      side: 'sell',
      pair: 'ETH/USDT',
      amount: '5 ETH',
      price: 'Market',
      filled: '5 ETH',
      total: '$9,250',
      status: 'filled',
      createdAt: '2024-06-10 14:25:00',
      updatedAt: '2024-06-10 14:25:15'
    },
    {
      id: 'ORD001236',
      user: 'bob***@gmail.com',
      type: 'stop',
      side: 'buy',
      pair: 'BNB/USDT',
      amount: '50 BNB',
      price: '$250',
      filled: '0 BNB',
      total: '$12,500',
      status: 'pending',
      createdAt: '2024-06-10 14:20:00',
      updatedAt: '2024-06-10 14:20:00'
    },
    {
      id: 'ORD001237',
      user: 'carol***@gmail.com',
      type: 'limit',
      side: 'buy',
      pair: 'SOL/USDT',
      amount: '100 SOL',
      price: '$84',
      filled: '0 SOL',
      total: '$8,400',
      status: 'cancelled',
      createdAt: '2024-06-10 14:15:00',
      updatedAt: '2024-06-10 14:18:00'
    },
    {
      id: 'ORD001238',
      user: 'david***@gmail.com',
      type: 'market',
      side: 'sell',
      pair: 'ADA/USDT',
      amount: '5000 ADA',
      price: 'Market',
      filled: '5000 ADA',
      total: '$2,150',
      status: 'filled',
      createdAt: '2024-06-10 14:10:00',
      updatedAt: '2024-06-10 14:10:05'
    },
  ];

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         order.user.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         order.pair.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = filterType === 'all' || order.type === filterType;
    const matchesStatus = filterStatus === 'all' || order.status === filterStatus;
    return matchesSearch && matchesType && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    const styles = {
      pending: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
      partial: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
      filled: 'bg-[#A3F030]/10 text-[#A3F030] border-[#A3F030]/20',
      cancelled: 'bg-gray-500/10 text-gray-400 border-gray-500/20',
      expired: 'bg-red-500/10 text-red-400 border-red-500/20'
    };
    const labels = {
      pending: '待成交',
      partial: '部分成交',
      filled: '已完成',
      cancelled: '已取消',
      expired: '已过期'
    };
    const icons = {
      pending: Clock,
      partial: RefreshCw,
      filled: CheckCircle,
      cancelled: XCircle,
      expired: AlertTriangle
    };
    const Icon = icons[status as keyof typeof icons];
    return (
      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium border ${styles[status as keyof typeof styles]}`}>
        <Icon className="w-3 h-3" />
        {labels[status as keyof typeof labels]}
      </span>
    );
  };

  const getTypeBadge = (type: string) => {
    const styles = {
      limit: 'bg-purple-500/10 text-purple-400',
      market: 'bg-cyan-500/10 text-cyan-400',
      stop: 'bg-orange-500/10 text-orange-400'
    };
    const labels = {
      limit: '限价单',
      market: '市价单',
      stop: '止损单'
    };
    return (
      <span className={`px-2 py-1 rounded text-xs font-medium ${styles[type as keyof typeof styles]}`}>
        {labels[type as keyof typeof labels]}
      </span>
    );
  };

  // 统计
  const totalOrders = orders.length;
  const pendingOrders = orders.filter(o => o.status === 'pending' || o.status === 'partial').length;
  const filledOrders = orders.filter(o => o.status === 'filled').length;
  const cancelledOrders = orders.filter(o => o.status === 'cancelled').length;

  return (
    <div className="space-y-6">
      {/* 页面标题 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">订单管理</h1>
          <p className="text-gray-400 mt-1">管理所有交易订单</p>
        </div>
        <button className="px-4 py-2 bg-[#A3F030] text-black rounded-lg font-medium hover:bg-[#A3F030]/90 transition-colors">
          导出订单数据
        </button>
      </div>

      {/* 统计卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-4 shadow-lg shadow-black/20">
          <p className="text-gray-400 text-sm">总订单数</p>
          <p className="text-2xl font-bold text-white mt-1">{totalOrders}</p>
          <p className="text-gray-500 text-xs mt-1">所有订单</p>
        </div>
        <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-4 shadow-lg shadow-black/20">
          <p className="text-gray-400 text-sm">待处理</p>
          <p className="text-2xl font-bold text-white mt-1">{pendingOrders}</p>
          <p className="text-yellow-400 text-xs mt-1">需要关注</p>
        </div>
        <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-4 shadow-lg shadow-black/20">
          <p className="text-gray-400 text-sm">已完成</p>
          <p className="text-2xl font-bold text-white mt-1">{filledOrders}</p>
          <p className="text-[#A3F030] text-xs mt-1">{((filledOrders/totalOrders)*100).toFixed(1)}% 完成率</p>
        </div>
        <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-4 shadow-lg shadow-black/20">
          <p className="text-gray-400 text-sm">已取消</p>
          <p className="text-2xl font-bold text-white mt-1">{cancelledOrders}</p>
          <p className="text-gray-500 text-xs mt-1">{((cancelledOrders/totalOrders)*100).toFixed(1)}% 取消率</p>
        </div>
      </div>

      {/* 搜索和筛选 */}
      <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-6 shadow-lg shadow-black/20">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="搜索订单ID、用户或交易对..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#A3F030]/50"
            />
          </div>

          <div className="flex gap-2 flex-wrap">
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value as any)}
              className="px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-[#A3F030]/50"
            >
              <option value="all">所有类型</option>
              <option value="limit">限价单</option>
              <option value="market">市价单</option>
              <option value="stop">止损单</option>
            </select>

            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as any)}
              className="px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-[#A3F030]/50"
            >
              <option value="all">所有状态</option>
              <option value="pending">待成交</option>
              <option value="partial">部分成交</option>
              <option value="filled">已完成</option>
              <option value="cancelled">已取消</option>
            </select>
          </div>
        </div>
      </div>

      {/* 订单列表 */}
      <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl overflow-hidden shadow-lg shadow-black/20">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-800/50">
                <th className="text-left px-6 py-4 text-gray-400 text-sm font-medium">订单ID</th>
                <th className="text-left px-6 py-4 text-gray-400 text-sm font-medium">用户</th>
                <th className="text-left px-6 py-4 text-gray-400 text-sm font-medium">类型</th>
                <th className="text-left px-6 py-4 text-gray-400 text-sm font-medium">方向</th>
                <th className="text-left px-6 py-4 text-gray-400 text-sm font-medium">交易对</th>
                <th className="text-right px-6 py-4 text-gray-400 text-sm font-medium">数量</th>
                <th className="text-right px-6 py-4 text-gray-400 text-sm font-medium">价格</th>
                <th className="text-right px-6 py-4 text-gray-400 text-sm font-medium">已成交</th>
                <th className="text-left px-6 py-4 text-gray-400 text-sm font-medium">状态</th>
                <th className="text-left px-6 py-4 text-gray-400 text-sm font-medium">创建时间</th>
                <th className="text-center px-6 py-4 text-gray-400 text-sm font-medium">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {filteredOrders.map((order) => (
                <tr key={order.id} className="hover:bg-white/5 transition-colors">
                  <td className="px-6 py-4 text-white font-mono text-sm">{order.id}</td>
                  <td className="px-6 py-4 text-gray-300 text-sm">{order.user}</td>
                  <td className="px-6 py-4">{getTypeBadge(order.type)}</td>
                  <td className="px-6 py-4">
                    <span className={`text-sm font-medium ${order.side === 'buy' ? 'text-[#A3F030]' : 'text-red-400'}`}>
                      {order.side === 'buy' ? '买入' : '卖出'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-white font-medium">{order.pair}</td>
                  <td className="px-6 py-4 text-right text-gray-300">{order.amount}</td>
                  <td className="px-6 py-4 text-right text-white font-medium">{order.price}</td>
                  <td className="px-6 py-4 text-right text-gray-300">{order.filled}</td>
                  <td className="px-6 py-4">{getStatusBadge(order.status)}</td>
                  <td className="px-6 py-4 text-gray-300 text-xs">{order.createdAt}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center gap-2">
                      <button className="p-1 text-gray-400 hover:text-[#A3F030] transition-colors" title="查看详情">
                        <Eye className="w-4 h-4" />
                      </button>
                      {order.status === 'pending' && (
                        <button className="p-1 text-gray-400 hover:text-red-400 transition-colors" title="取消订单">
                          <XCircle className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* 分页 */}
        <div className="px-6 py-4 border-t border-slate-800 flex items-center justify-between">
          <p className="text-gray-400 text-sm">显示 1-{filteredOrders.length} of {filteredOrders.length} 订单</p>
          <div className="flex gap-2">
            <button className="px-3 py-1 bg-slate-800 text-gray-300 rounded hover:bg-slate-700 transition-colors">
              上一页
            </button>
            <button className="px-3 py-1 bg-[#A3F030] text-black rounded font-medium">1</button>
            <button className="px-3 py-1 bg-slate-800 text-gray-300 rounded hover:bg-slate-700 transition-colors">
              下一页
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
