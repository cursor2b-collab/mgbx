import { useState } from 'react';
import { Search, FileText, CheckCircle, XCircle, Clock, Eye, Download, AlertTriangle } from 'lucide-react';

interface KYCApplication {
  id: string;
  user: string;
  email: string;
  fullName: string;
  idType: 'passport' | 'id_card' | 'driver_license';
  idNumber: string;
  country: string;
  status: 'pending' | 'approved' | 'rejected' | 'review';
  submittedDate: string;
  reviewedDate?: string;
  documents: {
    front: string;
    back: string;
    selfie: string;
  };
  notes?: string;
}

export function KYCManagement() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'approved' | 'rejected' | 'review'>('all');
  const [selectedApplication, setSelectedApplication] = useState<KYCApplication | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  const applications: KYCApplication[] = [
    {
      id: 'KYC001',
      user: 'user001',
      email: 'john.doe@example.com',
      fullName: 'John Doe',
      idType: 'passport',
      idNumber: 'P12345678',
      country: 'United States',
      status: 'pending',
      submittedDate: '2024-06-10 10:30:00',
      documents: {
        front: '/uploads/kyc/001_front.jpg',
        back: '/uploads/kyc/001_back.jpg',
        selfie: '/uploads/kyc/001_selfie.jpg'
      }
    },
    {
      id: 'KYC002',
      user: 'user002',
      email: 'alice.smith@example.com',
      fullName: 'Alice Smith',
      idType: 'id_card',
      idNumber: 'ID987654321',
      country: 'United Kingdom',
      status: 'review',
      submittedDate: '2024-06-10 09:15:00',
      documents: {
        front: '/uploads/kyc/002_front.jpg',
        back: '/uploads/kyc/002_back.jpg',
        selfie: '/uploads/kyc/002_selfie.jpg'
      }
    },
    {
      id: 'KYC003',
      user: 'user003',
      email: 'bob.johnson@example.com',
      fullName: 'Bob Johnson',
      idType: 'driver_license',
      idNumber: 'DL456789123',
      country: 'Canada',
      status: 'approved',
      submittedDate: '2024-06-09 14:20:00',
      reviewedDate: '2024-06-09 16:45:00',
      documents: {
        front: '/uploads/kyc/003_front.jpg',
        back: '/uploads/kyc/003_back.jpg',
        selfie: '/uploads/kyc/003_selfie.jpg'
      }
    },
    {
      id: 'KYC004',
      user: 'user004',
      email: 'carol.white@example.com',
      fullName: 'Carol White',
      idType: 'passport',
      idNumber: 'P87654321',
      country: 'Australia',
      status: 'rejected',
      submittedDate: '2024-06-08 11:30:00',
      reviewedDate: '2024-06-08 15:20:00',
      documents: {
        front: '/uploads/kyc/004_front.jpg',
        back: '/uploads/kyc/004_back.jpg',
        selfie: '/uploads/kyc/004_selfie.jpg'
      },
      notes: '照片模糊，无法验证身份'
    },
  ];

  const filteredApplications = applications.filter(app => {
    const matchesSearch = app.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         app.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         app.fullName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterStatus === 'all' || app.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const getStatusBadge = (status: string) => {
    const styles = {
      pending: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
      approved: 'bg-[#A3F030]/10 text-[#A3F030] border-[#A3F030]/20',
      rejected: 'bg-red-500/10 text-red-400 border-red-500/20',
      review: 'bg-blue-500/10 text-blue-400 border-blue-500/20'
    };
    const labels = {
      pending: '待审核',
      approved: '已通过',
      rejected: '已拒绝',
      review: '审核中'
    };
    const icons = {
      pending: Clock,
      approved: CheckCircle,
      rejected: XCircle,
      review: AlertTriangle
    };
    const Icon = icons[status as keyof typeof icons];
    return (
      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium border ${styles[status as keyof typeof styles]}`}>
        <Icon className="w-3 h-3" />
        {labels[status as keyof typeof labels]}
      </span>
    );
  };

  const getIdTypeName = (type: string) => {
    const types = {
      passport: '护照',
      id_card: '身份证',
      driver_license: '驾驶证'
    };
    return types[type as keyof typeof types];
  };

  const handleApprove = (application: KYCApplication) => {
    console.log('Approve', application.id);
    // 实际项目中这里会调用API
  };

  const handleReject = (application: KYCApplication) => {
    console.log('Reject', application.id);
    // 实际项目中这里会调用API
  };

  // 统计数据
  const pendingCount = applications.filter(a => a.status === 'pending').length;
  const approvedCount = applications.filter(a => a.status === 'approved').length;
  const rejectedCount = applications.filter(a => a.status === 'rejected').length;
  const reviewCount = applications.filter(a => a.status === 'review').length;

  return (
    <div className="space-y-6">
      {/* 页面标题 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">KYC审核管理</h1>
          <p className="text-gray-400 mt-1">审核用户身份验证申请</p>
        </div>
      </div>

      {/* 统计卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-4 shadow-lg shadow-black/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">待审核</p>
              <p className="text-2xl font-bold text-white mt-1">{pendingCount}</p>
            </div>
            <div className="p-3 bg-yellow-500/10 rounded-lg">
              <Clock className="w-6 h-6 text-yellow-400" />
            </div>
          </div>
        </div>
        <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-4 shadow-lg shadow-black/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">已通过</p>
              <p className="text-2xl font-bold text-white mt-1">{approvedCount}</p>
            </div>
            <div className="p-3 bg-[#A3F030]/10 rounded-lg">
              <CheckCircle className="w-6 h-6 text-[#A3F030]" />
            </div>
          </div>
        </div>
        <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-4 shadow-lg shadow-black/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">已拒绝</p>
              <p className="text-2xl font-bold text-white mt-1">{rejectedCount}</p>
            </div>
            <div className="p-3 bg-red-500/10 rounded-lg">
              <XCircle className="w-6 h-6 text-red-400" />
            </div>
          </div>
        </div>
        <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-4 shadow-lg shadow-black/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">审核中</p>
              <p className="text-2xl font-bold text-white mt-1">{reviewCount}</p>
            </div>
            <div className="p-3 bg-blue-500/10 rounded-lg">
              <AlertTriangle className="w-6 h-6 text-blue-400" />
            </div>
          </div>
        </div>
      </div>

      {/* 搜索和筛选 */}
      <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-6 shadow-lg shadow-black/20">
        <div className="flex flex-col md:flex-row gap-4">
          {/* 搜索框 */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="搜索申请ID、用户邮箱或姓名..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#A3F030]/50"
            />
          </div>

          {/* 状态筛选 */}
          <div className="flex gap-2 flex-wrap">
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
              onClick={() => setFilterStatus('pending')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                filterStatus === 'pending'
                  ? 'bg-[#A3F030] text-black'
                  : 'bg-slate-800 text-gray-300 hover:bg-slate-700'
              }`}
            >
              待审核 {pendingCount > 0 && `(${pendingCount})`}
            </button>
            <button
              onClick={() => setFilterStatus('review')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                filterStatus === 'review'
                  ? 'bg-[#A3F030] text-black'
                  : 'bg-slate-800 text-gray-300 hover:bg-slate-700'
              }`}
            >
              审核中
            </button>
            <button
              onClick={() => setFilterStatus('approved')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                filterStatus === 'approved'
                  ? 'bg-[#A3F030] text-black'
                  : 'bg-slate-800 text-gray-300 hover:bg-slate-700'
              }`}
            >
              已通过
            </button>
            <button
              onClick={() => setFilterStatus('rejected')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                filterStatus === 'rejected'
                  ? 'bg-[#A3F030] text-black'
                  : 'bg-slate-800 text-gray-300 hover:bg-slate-700'
              }`}
            >
              已拒绝
            </button>
          </div>
        </div>
      </div>

      {/* KYC申请列表 */}
      <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl overflow-hidden shadow-lg shadow-black/20">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-800/50">
                <th className="text-left px-6 py-4 text-gray-400 text-sm font-medium">申请ID</th>
                <th className="text-left px-6 py-4 text-gray-400 text-sm font-medium">用户信息</th>
                <th className="text-left px-6 py-4 text-gray-400 text-sm font-medium">证件类型</th>
                <th className="text-left px-6 py-4 text-gray-400 text-sm font-medium">证件号码</th>
                <th className="text-left px-6 py-4 text-gray-400 text-sm font-medium">国家</th>
                <th className="text-left px-6 py-4 text-gray-400 text-sm font-medium">状态</th>
                <th className="text-left px-6 py-4 text-gray-400 text-sm font-medium">提交时间</th>
                <th className="text-center px-6 py-4 text-gray-400 text-sm font-medium">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {filteredApplications.map((app) => (
                <tr key={app.id} className="hover:bg-white/5 transition-colors">
                  <td className="px-6 py-4 text-white font-mono text-sm">
                    {app.id}
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <p className="text-white font-medium">{app.fullName}</p>
                      <p className="text-gray-400 text-sm">{app.email}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-300">
                    {getIdTypeName(app.idType)}
                  </td>
                  <td className="px-6 py-4 text-gray-300 font-mono text-sm">
                    {app.idNumber}
                  </td>
                  <td className="px-6 py-4 text-gray-300">
                    {app.country}
                  </td>
                  <td className="px-6 py-4">
                    {getStatusBadge(app.status)}
                  </td>
                  <td className="px-6 py-4 text-gray-300 text-sm">
                    {app.submittedDate}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center gap-2">
                      <button 
                        onClick={() => {
                          setSelectedApplication(app);
                          setShowDetailModal(true);
                        }}
                        className="p-2 text-gray-400 hover:text-[#A3F030] transition-colors" 
                        title="查看详情"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      {(app.status === 'pending' || app.status === 'review') && (
                        <>
                          <button 
                            onClick={() => handleApprove(app)}
                            className="p-2 text-gray-400 hover:text-[#A3F030] transition-colors" 
                            title="通过"
                          >
                            <CheckCircle className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => handleReject(app)}
                            className="p-2 text-gray-400 hover:text-red-400 transition-colors" 
                            title="拒绝"
                          >
                            <XCircle className="w-4 h-4" />
                          </button>
                        </>
                      )}
                      <button className="p-2 text-gray-400 hover:text-blue-400 transition-colors" title="下载文件">
                        <Download className="w-4 h-4" />
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
          <p className="text-gray-400 text-sm">显示 1-{filteredApplications.length} of {filteredApplications.length} 申请</p>
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
