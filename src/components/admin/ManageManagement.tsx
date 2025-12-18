import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { 
  UserCog, 
  Shield, 
  FileText,
  Plus, 
  Edit, 
  Trash2,
  Search
} from 'lucide-react';
import { toast } from 'sonner';

interface AdminUser {
  id: string;
  username: string;
  name: string;
  role: string;
  status: number;
  lastLoginTime?: string;
  addtime: string;
}

interface AdminLog {
  id: string;
  adminName: string;
  action: string;
  ip: string;
  addtime: string;
}

export function ManageManagement() {
  const location = useLocation();
  const getInitialTab = () => {
    if (location.pathname.includes('rules')) return 'permissions';
    if (location.pathname.includes('logs')) return 'logs';
    return 'admins';
  };
  const [activeTab, setActiveTab] = useState(getInitialTab());
  const navigate = useNavigate();
  
  useEffect(() => {
    setActiveTab(getInitialTab());
  }, [location.pathname]);
  
  const handleTabChange = (value: string) => {
    setActiveTab(value);
    if (value === 'permissions') {
      navigate('/admin/manage/rules');
    } else if (value === 'logs') {
      navigate('/admin/manage/logs');
    } else {
      navigate('/admin/manage');
    }
  };
  const [adminList, setAdminList] = useState<AdminUser[]>([]);
  const [logList, setLogList] = useState<AdminLog[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadData();
  }, [activeTab]);

  const loadData = async () => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      if (activeTab === 'admins') {
        setAdminList([]);
      } else {
        setLogList([]);
      }
    } catch (error) {
      toast.error('加载数据失败');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('确定要删除吗？')) return;
    try {
      toast.success('删除成功');
      loadData();
    } catch (error) {
      toast.error('删除失败');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">管理员管理</h1>
          <p className="text-gray-400 mt-1">管理系统管理员和权限</p>
        </div>
        {activeTab === 'admins' && (
          <button className="px-4 py-2 bg-[#A3F030] text-black rounded-lg font-medium hover:bg-[#A3F030]/90 flex items-center gap-2">
            <Plus className="w-4 h-4" />
            添加管理员
          </button>
        )}
      </div>

      <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
        <TabsList className="bg-slate-900 border border-slate-800">
          <TabsTrigger value="admins" className="data-[state=active]:bg-[#A3F030] data-[state=active]:text-black">
            管理员列表
          </TabsTrigger>
          <TabsTrigger value="permissions" className="data-[state=active]:bg-[#A3F030] data-[state=active]:text-black">
            权限管理
          </TabsTrigger>
          <TabsTrigger value="logs" className="data-[state=active]:bg-[#A3F030] data-[state=active]:text-black">
            操作日志
          </TabsTrigger>
        </TabsList>

        {/* 管理员列表 */}
        <TabsContent value="admins" className="mt-6">
          <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-6 shadow-lg shadow-black/20">
            <div className="flex gap-4 mb-6">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="搜索管理员..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#A3F030]"
                />
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-800">
                    <th className="text-left text-gray-400 text-sm font-medium pb-3">ID</th>
                    <th className="text-left text-gray-400 text-sm font-medium pb-3">用户名</th>
                    <th className="text-left text-gray-400 text-sm font-medium pb-3">姓名</th>
                    <th className="text-left text-gray-400 text-sm font-medium pb-3">角色</th>
                    <th className="text-left text-gray-400 text-sm font-medium pb-3">状态</th>
                    <th className="text-left text-gray-400 text-sm font-medium pb-3">最后登录</th>
                    <th className="text-right text-gray-400 text-sm font-medium pb-3">操作</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {loading ? (
                    <tr>
                      <td colSpan={7} className="py-8 text-center text-gray-400">
                        加载中...
                      </td>
                    </tr>
                  ) : adminList.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-8 text-center text-gray-400">
                        暂无数据
                      </td>
                    </tr>
                  ) : (
                    adminList.map((admin) => (
                      <tr key={admin.id} className="hover:bg-white/5 transition-colors">
                        <td className="py-3 text-gray-300 text-sm">{admin.id}</td>
                        <td className="py-3 text-white text-sm">{admin.username}</td>
                        <td className="py-3 text-gray-300 text-sm">{admin.name}</td>
                        <td className="py-3 text-gray-300 text-sm">{admin.role}</td>
                        <td className="py-3">
                          <span className={`px-2 py-1 text-xs rounded ${
                            admin.status === 1 
                              ? 'bg-[#A3F030]/10 text-[#A3F030]' 
                              : 'bg-gray-500/10 text-gray-400'
                          }`}>
                            {admin.status === 1 ? '启用' : '禁用'}
                          </span>
                        </td>
                        <td className="py-3 text-gray-400 text-sm">{admin.lastLoginTime || '-'}</td>
                        <td className="py-3 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button className="p-2 text-gray-400 hover:text-[#A3F030] transition-colors">
                              <Edit className="w-4 h-4" />
                            </button>
                            <button 
                              onClick={() => handleDelete(admin.id)}
                              className="p-2 text-gray-400 hover:text-red-400 transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </TabsContent>

        {/* 权限管理 */}
        <TabsContent value="permissions" className="mt-6">
          <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-6 shadow-lg shadow-black/20">
            <div className="text-center text-gray-400 py-8">
              权限管理功能开发中...
            </div>
          </div>
        </TabsContent>

        {/* 操作日志 */}
        <TabsContent value="logs" className="mt-6">
          <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-6 shadow-lg shadow-black/20">
            <div className="flex gap-4 mb-6">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="搜索操作日志..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#A3F030]"
                />
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-800">
                    <th className="text-left text-gray-400 text-sm font-medium pb-3">ID</th>
                    <th className="text-left text-gray-400 text-sm font-medium pb-3">管理员</th>
                    <th className="text-left text-gray-400 text-sm font-medium pb-3">操作</th>
                    <th className="text-left text-gray-400 text-sm font-medium pb-3">IP地址</th>
                    <th className="text-left text-gray-400 text-sm font-medium pb-3">操作时间</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {loading ? (
                    <tr>
                      <td colSpan={5} className="py-8 text-center text-gray-400">
                        加载中...
                      </td>
                    </tr>
                  ) : logList.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-8 text-center text-gray-400">
                        暂无数据
                      </td>
                    </tr>
                  ) : (
                    logList.map((log) => (
                      <tr key={log.id} className="hover:bg-white/5 transition-colors">
                        <td className="py-3 text-gray-300 text-sm">{log.id}</td>
                        <td className="py-3 text-white text-sm">{log.adminName}</td>
                        <td className="py-3 text-gray-300 text-sm">{log.action}</td>
                        <td className="py-3 text-gray-400 text-sm font-mono">{log.ip}</td>
                        <td className="py-3 text-gray-400 text-sm">{log.addtime}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

