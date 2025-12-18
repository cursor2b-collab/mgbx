import { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  Users, 
  DollarSign, 
  Activity,
  ArrowUpRight,
  ArrowDownRight,
  UserPlus,
  Wallet,
  LogIn,
  UserCheck,
  Gift
} from 'lucide-react';
import { LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { hzStatsService } from '../../services/hzDatabase';
import { toast } from 'sonner';

interface StatCard {
  title: string;
  value: string;
  change?: string;
  isPositive?: boolean;
  icon: any;
}

export function AdminDashboard() {
  const [stats, setStats] = useState<StatCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [monthlyRecharge, setMonthlyRecharge] = useState<number[]>(Array(12).fill(0));
  const [monthlyWithdrawal, setMonthlyWithdrawal] = useState<number[]>(Array(12).fill(0));

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const dashboardStats = await hzStatsService.getDashboardStats();
      const monthlyData = await hzStatsService.getMonthlyRechargeWithdraw();

      setStats([
        {
          title: '总用户数',
          value: dashboardStats.totalUsers.toLocaleString(),
          icon: Users
        },
        {
          title: '今日注册',
          value: dashboardStats.todayRegistrations.toLocaleString(),
          icon: UserPlus
        },
        {
          title: 'USDT总充值',
          value: `$${dashboardStats.rechargeTotal.toFixed(2)}`,
          icon: Wallet
        },
        {
          title: '总提现量',
          value: `$${dashboardStats.withdrawTotal.toFixed(2)}`,
          icon: TrendingDown
        },
        {
          title: '今日登录人数',
          value: dashboardStats.todayLogins.toLocaleString(),
          icon: LogIn
        },
        {
          title: '充值人数',
          value: dashboardStats.rechargeUserCount.toLocaleString(),
          icon: UserCheck
        },
        {
          title: '提现人数',
          value: dashboardStats.withdrawUserCount.toLocaleString(),
          icon: UserCheck
        },
        {
          title: '彩金总量',
          value: `$${dashboardStats.bonusTotal.toFixed(2)}`,
          icon: Gift
        }
      ]);

      setMonthlyRecharge(monthlyData.monthlyRecharge || Array(12).fill(0));
      setMonthlyWithdrawal(monthlyData.monthlyWithdrawal || Array(12).fill(0));
    } catch (error) {
      console.error('加载仪表盘数据失败:', error);
      toast.error('加载数据失败');
    } finally {
      setLoading(false);
    }
  };

  // 月度充值提现数据
  const monthlyData = Array.from({ length: 12 }, (_, i) => {
    const monthNames = ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'];
    return {
      month: monthNames[i],
      充值: monthlyRecharge[i] || 0,
      提现: monthlyWithdrawal[i] || 0,
    };
  });

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
        {loading && (
          <div className="col-span-4 text-center text-gray-400 py-8">
            加载中...
          </div>
        )}
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-6 hover:border-[#A3F030]/30 hover:bg-white/10 transition-all shadow-lg shadow-black/20">
                  <div className="flex items-start justify-between">
                <div>
                  <p className="text-gray-400 text-sm">{stat.title}</p>
                  <h3 className="text-3xl font-bold text-white mt-2">{stat.value}</h3>
                  {stat.change && (
                    <div className={`flex items-center gap-1 mt-2 ${stat.isPositive ? 'text-[#A3F030]' : 'text-red-400'}`}>
                      {stat.isPositive ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                      <span className="text-sm font-medium">{stat.change}</span>
                      <span className="text-gray-500 text-xs">vs 上周</span>
                    </div>
                  )}
                </div>
                <div className={`p-3 rounded-lg ${stat.isPositive === true ? 'bg-[#A3F030]/10' : stat.isPositive === false ? 'bg-red-500/10' : 'bg-gray-700/10'}`}>
                  <Icon className={`w-6 h-6 ${stat.isPositive === true ? 'text-[#A3F030]' : stat.isPositive === false ? 'text-red-400' : 'text-gray-400'}`} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* 图表区域 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 月度充值提现趋势 */}
        <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-6 shadow-lg shadow-black/20">
          <h3 className="text-xl font-bold text-white mb-4">月度充值提现趋势 (USDT)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="month" stroke="#64748b" />
              <YAxis stroke="#64748b" />
              <Tooltip 
                contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px' }}
                labelStyle={{ color: '#e2e8f0' }}
              />
              <Legend />
              <Line type="monotone" dataKey="充值" stroke="#A3F030" activeDot={{ r: 8 }} />
              <Line type="monotone" dataKey="提现" stroke="#FF4D4D" activeDot={{ r: 8 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* 用户增长（月度） */}
        <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-6 shadow-lg shadow-black/20">
          <h3 className="text-xl font-bold text-white mb-4">用户增长 (月度)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={monthlyData.map(d => ({ month: d.month, users: d.充值 - d.提现 + 1000 }))}>
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
        <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-6 shadow-lg shadow-black/20">
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
        <div className="lg:col-span-2 bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-6 shadow-lg shadow-black/20">
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
                  <tr key={trade.id} className="hover:bg-white/5 transition-colors">
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
