import { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  Users, 
  DollarSign, 
  Activity,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import { LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

interface StatCard {
  title: string;
  value: string;
  change: string;
  isPositive: boolean;
  icon: any;
}

export function AdminDashboard() {
  const [stats, setStats] = useState<StatCard[]>([
    {
      title: '总用户数',
      value: '12,458',
      change: '+12.5%',
      isPositive: true,
      icon: Users
    },
    {
      title: '24h交易量',
      value: '$2.4M',
      change: '+8.2%',
      isPositive: true,
      icon: TrendingUp
    },
    {
      title: '活跃交易者',
      value: '3,284',
      change: '-2.3%',
      isPositive: false,
      icon: Activity
    },
    {
      title: '总资产',
      value: '$52.8M',
      change: '+15.7%',
      isPositive: true,
      icon: DollarSign
    }
  ]);

  // 交易量数据
  const volumeData = [
    { date: '01/01', volume: 2400, trades: 340 },
    { date: '01/02', volume: 2100, trades: 310 },
    { date: '01/03', volume: 2800, trades: 420 },
    { date: '01/04', volume: 3200, trades: 480 },
    { date: '01/05', volume: 2900, trades: 390 },
    { date: '01/06', volume: 3400, trades: 520 },
    { date: '01/07', volume: 3800, trades: 580 },
  ];

  // 用户增长数据
  const userGrowthData = [
    { month: 'Jan', users: 4000 },
    { month: 'Feb', users: 5200 },
    { month: 'Mar', users: 6800 },
    { month: 'Apr', users: 8200 },
    { month: 'May', users: 10200 },
    { month: 'Jun', users: 12458 },
  ];

  // 币种分布数据
  const assetDistribution = [
    { name: 'BTC', value: 35, color: '#F7931A' },
    { name: 'ETH', value: 25, color: '#627EEA' },
    { name: 'USDT', value: 20, color: '#26A17B' },
    { name: 'BNB', value: 12, color: '#F3BA2F' },
    { name: '其他', value: 8, color: '#A3F030' },
  ];

  // 最近交易
  const recentTrades = [
    { id: 1, user: 'user***@gmail.com', pair: 'BTC/USDT', type: 'buy', amount: '0.5 BTC', value: '$22,500', time: '2分钟前', status: 'completed' },
    { id: 2, user: 'john***@gmail.com', pair: 'ETH/USDT', type: 'sell', amount: '5 ETH', value: '$9,250', time: '5分钟前', status: 'completed' },
    { id: 3, user: 'alice***@gmail.com', pair: 'BNB/USDT', type: 'buy', amount: '50 BNB', value: '$12,500', time: '8分钟前', status: 'pending' },
    { id: 4, user: 'bob***@gmail.com', pair: 'SOL/USDT', type: 'buy', amount: '100 SOL', value: '$8,400', time: '12分钟前', status: 'completed' },
    { id: 5, user: 'carol***@gmail.com', pair: 'ADA/USDT', type: 'sell', amount: '5000 ADA', value: '$2,150', time: '15分钟前', status: 'completed' },
  ];

  return (
    <div className="space-y-6">
      {/* 页面标题 */}
      <div>
        <h1 className="text-3xl font-bold text-white">仪表盘</h1>
        <p className="text-gray-400 mt-1">欢迎回到 CRYPTONX 管理后台</p>
      </div>

      {/* 统计卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-slate-900 border border-slate-800 rounded-xl p-6 hover:border-[#A3F030]/30 transition-colors">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-gray-400 text-sm">{stat.title}</p>
                  <h3 className="text-3xl font-bold text-white mt-2">{stat.value}</h3>
                  <div className={`flex items-center gap-1 mt-2 ${stat.isPositive ? 'text-[#A3F030]' : 'text-red-400'}`}>
                    {stat.isPositive ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                    <span className="text-sm font-medium">{stat.change}</span>
                    <span className="text-gray-500 text-xs">vs 上周</span>
                  </div>
                </div>
                <div className={`p-3 rounded-lg ${stat.isPositive ? 'bg-[#A3F030]/10' : 'bg-red-500/10'}`}>
                  <Icon className={`w-6 h-6 ${stat.isPositive ? 'text-[#A3F030]' : 'text-red-400'}`} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* 图表区域 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 交易量趋势 */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
          <h3 className="text-xl font-bold text-white mb-4">交易量趋势</h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={volumeData}>
              <defs>
                <linearGradient id="volumeGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#A3F030" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#A3F030" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="date" stroke="#64748b" />
              <YAxis stroke="#64748b" />
              <Tooltip 
                contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px' }}
                labelStyle={{ color: '#e2e8f0' }}
              />
              <Area type="monotone" dataKey="volume" stroke="#A3F030" fillOpacity={1} fill="url(#volumeGradient)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* 用户增长 */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
          <h3 className="text-xl font-bold text-white mb-4">用户增长</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={userGrowthData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="month" stroke="#64748b" />
              <YAxis stroke="#64748b" />
              <Tooltip 
                contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px' }}
                labelStyle={{ color: '#e2e8f0' }}
              />
              <Bar dataKey="users" fill="#A3F030" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 资产分布和最近交易 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 资产分布 */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
          <h3 className="text-xl font-bold text-white mb-4">资产分布</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={assetDistribution}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={5}
                dataKey="value"
              >
                {assetDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px' }}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-4 space-y-2">
            {assetDistribution.map((asset) => (
              <div key={asset.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: asset.color }} />
                  <span className="text-gray-300 text-sm">{asset.name}</span>
                </div>
                <span className="text-white font-medium">{asset.value}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* 最近交易 */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-xl p-6">
          <h3 className="text-xl font-bold text-white mb-4">最近交易</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-800">
                  <th className="text-left text-gray-400 text-sm font-medium pb-3">用户</th>
                  <th className="text-left text-gray-400 text-sm font-medium pb-3">交易对</th>
                  <th className="text-left text-gray-400 text-sm font-medium pb-3">类型</th>
                  <th className="text-right text-gray-400 text-sm font-medium pb-3">数量</th>
                  <th className="text-right text-gray-400 text-sm font-medium pb-3">价值</th>
                  <th className="text-right text-gray-400 text-sm font-medium pb-3">状态</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {recentTrades.map((trade) => (
                  <tr key={trade.id} className="hover:bg-slate-800/50 transition-colors">
                    <td className="py-3 text-gray-300 text-sm">{trade.user}</td>
                    <td className="py-3 text-white text-sm font-medium">{trade.pair}</td>
                    <td className="py-3">
                      <span className={`text-xs px-2 py-1 rounded ${
                        trade.type === 'buy' ? 'bg-[#A3F030]/10 text-[#A3F030]' : 'bg-red-500/10 text-red-400'
                      }`}>
                        {trade.type === 'buy' ? '买入' : '卖出'}
                      </span>
                    </td>
                    <td className="py-3 text-right text-gray-300 text-sm">{trade.amount}</td>
                    <td className="py-3 text-right text-white text-sm font-medium">{trade.value}</td>
                    <td className="py-3 text-right">
                      <span className={`text-xs px-2 py-1 rounded ${
                        trade.status === 'completed' ? 'bg-[#A3F030]/10 text-[#A3F030]' : 'bg-yellow-500/10 text-yellow-400'
                      }`}>
                        {trade.status === 'completed' ? '已完成' : '处理中'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
