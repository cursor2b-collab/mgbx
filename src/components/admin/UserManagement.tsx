import { useState } from 'react';
import { Search, Filter, MoreVertical, Mail, Ban, CheckCircle, XCircle, Eye, Edit, Trash2 } from 'lucide-react';

interface User {
  id: string;
  email: string;
  name: string;
  status: 'active' | 'suspended' | 'pending';
  kycStatus: 'verified' | 'pending' | 'rejected' | 'none';
  balance: string;
  tradingVolume: string;
  joinDate: string;
  lastActive: string;
}

export function UserManagement() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'suspended' | 'pending'>('all');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showUserModal, setShowUserModal] = useState(false);

  const users: User[] = [
    {
      id: '1',
      email: 'john.doe@example.com',
      name: 'John Doe',
      status: 'active',
      kycStatus: 'verified',
      balance: '$12,458.50',
      tradingVolume: '$245,890',
      joinDate: '2024-01-15',
      lastActive: '2分钟前'
    },
    {
      id: '2',
      email: 'alice.smith@example.com',
      name: 'Alice Smith',
      status: 'active',
      kycStatus: 'pending',
      balance: '$8,234.20',
      tradingVolume: '$156,420',
      joinDate: '2024-02-03',
      lastActive: '1小时前'
    },
    {
      id: '3',
      email: 'bob.johnson@example.com',
      name: 'Bob Johnson',
      status: 'suspended',
      kycStatus: 'rejected',
      balance: '$3,456.80',
      tradingVolume: '$45,230',
      joinDate: '2024-03-12',
      lastActive: '3天前'
    },
    {
      id: '4',
      email: 'carol.white@example.com',
      name: 'Carol White',
      status: 'active',
      kycStatus: 'verified',
      balance: '$25,789.40',
      tradingVolume: '$567,890',
      joinDate: '2023-12-08',
      lastActive: '30分钟前'
    },
    {
      id: '5',
      email: 'david.brown@example.com',
      name: 'David Brown',
      status: 'pending',
      kycStatus: 'none',
      balance: '$0.00',
      tradingVolume: '$0',
      joinDate: '2024-06-20',
      lastActive: '刚刚'
    },
  ];

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         user.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterStatus === 'all' || user.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const getStatusBadge = (status: string) => {
    const styles = {
      active: 'bg-[#A3F030]/10 text-[#A3F030]',
      suspended: 'bg-red-500/10 text-red-400',
      pending: 'bg-yellow-500/10 text-yellow-400'
    };
    const labels = {
      active: '活跃',
      suspended: '已停用',
      pending: '待审核'
    };
    return (
      <span className={`px-2 py-1 rounded text-xs font-medium ${styles[status as keyof typeof styles]}`}>
        {labels[status as keyof typeof labels]}
      </span>
    );
  };

  const getKYCBadge = (kycStatus: string) => {
    const styles = {
      verified: 'bg-[#A3F030]/10 text-[#A3F030]',
      pending: 'bg-yellow-500/10 text-yellow-400',
      rejected: 'bg-red-500/10 text-red-400',
      none: 'bg-gray-500/10 text-gray-400'
    };
    const labels = {
      verified: '已认证',
      pending: '待审核',
      rejected: '已拒绝',
      none: '未提交'
    };
    return (
      <span className={`px-2 py-1 rounded text-xs font-medium ${styles[kycStatus as keyof typeof styles]}`}>
        {labels[kycStatus as keyof typeof labels]}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {/* 页面标题 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">用户管理</h1>
          <p className="text-gray-400 mt-1">管理平台所有用户账户</p>
        </div>
        <button className="px-4 py-2 bg-[#A3F030] text-black rounded-lg font-medium hover:bg-[#A3F030]/90 transition-colors">
          导出用户数据
        </button>
      </div>

      {/* 统计卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <p className="text-gray-400 text-sm">总用户数</p>
          <p className="text-2xl font-bold text-white mt-1">12,458</p>
          <p className="text-[#A3F030] text-xs mt-1">+245 本月</p>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <p className="text-gray-400 text-sm">活跃用户</p>
          <p className="text-2xl font-bold text-white mt-1">8,234</p>
          <p className="text-[#A3F030] text-xs mt-1">66% 活跃率</p>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <p className="text-gray-400 text-sm">已认证用户</p>
          <p className="text-2xl font-bold text-white mt-1">6,789</p>
          <p className="text-[#A3F030] text-xs mt-1">54.5% 认证率</p>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <p className="text-gray-400 text-sm">停用账户</p>
          <p className="text-2xl font-bold text-white mt-1">156</p>
          <p className="text-red-400 text-xs mt-1">1.3% 停用率</p>
        </div>
      </div>

      {/* 搜索和筛选 */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
        <div className="flex flex-col md:flex-row gap-4">
          {/* 搜索框 */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="搜索用户邮箱或姓名..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#A3F030]/50"
            />
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
              onClick={() => setFilterStatus('active')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                filterStatus === 'active'
                  ? 'bg-[#A3F030] text-black'
                  : 'bg-slate-800 text-gray-300 hover:bg-slate-700'
              }`}
            >
              活跃
            </button>
            <button
              onClick={() => setFilterStatus('suspended')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                filterStatus === 'suspended'
                  ? 'bg-[#A3F030] text-black'
                  : 'bg-slate-800 text-gray-300 hover:bg-slate-700'
              }`}
            >
              停用
            </button>
            <button
              onClick={() => setFilterStatus('pending')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                filterStatus === 'pending'
                  ? 'bg-[#A3F030] text-black'
                  : 'bg-slate-800 text-gray-300 hover:bg-slate-700'
              }`}
            >
              待审核
            </button>
          </div>
        </div>
      </div>

      {/* 用户列表 */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-800/50">
                <th className="text-left px-6 py-4 text-gray-400 text-sm font-medium">用户信息</th>
                <th className="text-left px-6 py-4 text-gray-400 text-sm font-medium">状态</th>
                <th className="text-left px-6 py-4 text-gray-400 text-sm font-medium">KYC状态</th>
                <th className="text-right px-6 py-4 text-gray-400 text-sm font-medium">余额</th>
                <th className="text-right px-6 py-4 text-gray-400 text-sm font-medium">交易量</th>
                <th className="text-left px-6 py-4 text-gray-400 text-sm font-medium">注册时间</th>
                <th className="text-left px-6 py-4 text-gray-400 text-sm font-medium">最后活跃</th>
                <th className="text-center px-6 py-4 text-gray-400 text-sm font-medium">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-slate-800/50 transition-colors">
                  <td className="px-6 py-4">
                    <div>
                      <p className="text-white font-medium">{user.name}</p>
                      <p className="text-gray-400 text-sm">{user.email}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {getStatusBadge(user.status)}
                  </td>
                  <td className="px-6 py-4">
                    {getKYCBadge(user.kycStatus)}
                  </td>
                  <td className="px-6 py-4 text-right text-white font-medium">
                    {user.balance}
                  </td>
                  <td className="px-6 py-4 text-right text-gray-300">
                    {user.tradingVolume}
                  </td>
                  <td className="px-6 py-4 text-gray-300 text-sm">
                    {user.joinDate}
                  </td>
                  <td className="px-6 py-4 text-gray-300 text-sm">
                    {user.lastActive}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center gap-2">
                      <button className="p-1 text-gray-400 hover:text-[#A3F030] transition-colors" title="查看详情">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="p-1 text-gray-400 hover:text-blue-400 transition-colors" title="编辑">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button className="p-1 text-gray-400 hover:text-red-400 transition-colors" title="删除">
                        <Trash2 className="w-4 h-4" />
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
          <p className="text-gray-400 text-sm">显示 1-5 of {filteredUsers.length} 用户</p>
          <div className="flex gap-2">
            <button className="px-3 py-1 bg-slate-800 text-gray-300 rounded hover:bg-slate-700 transition-colors">
              上一页
            </button>
            <button className="px-3 py-1 bg-[#A3F030] text-black rounded font-medium">
              1
            </button>
            <button className="px-3 py-1 bg-slate-800 text-gray-300 rounded hover:bg-slate-700 transition-colors">
              2
            </button>
            <button className="px-3 py-1 bg-slate-800 text-gray-300 rounded hover:bg-slate-700 transition-colors">
              3
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
