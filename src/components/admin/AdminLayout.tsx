import { useState, useEffect } from 'react';
import { Link, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  TrendingUp, 
  FileText, 
  Settings, 
  Bell, 
  LogOut,
  Menu,
  X,
  BarChart3,
  Shield,
  Wallet,
  FileCheck,
  MessageSquare
} from 'lucide-react';
import { auth } from '../../utils/supabase/client';
import { toast } from 'sonner@2.0.3';

interface MenuItem {
  icon: any;
  label: string;
  path: string;
  badge?: number;
}

export function AdminLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const user = await auth.getUser();
      if (!user) {
        navigate('/login');
        return;
      }
      setCurrentUser(user);
      
      // 检查是否是管理员（这里可以根据实际需求修改）
      // 比如检查 user.user_metadata.role === 'admin'
    } catch (error) {
      navigate('/login');
    }
  };

  const handleLogout = async () => {
    try {
      await auth.signOut();
      toast.success('已退出登录');
      navigate('/login');
    } catch (error: any) {
      toast.error('退出失败');
    }
  };

  const menuItems: MenuItem[] = [
    { icon: LayoutDashboard, label: '仪表盘', path: '/admin' },
    { icon: Users, label: '用户管理', path: '/admin/users' },
    { icon: TrendingUp, label: '交易管理', path: '/admin/trades' },
    { icon: Wallet, label: '订单管理', path: '/admin/orders', badge: 5 },
    { icon: FileCheck, label: 'KYC审核', path: '/admin/kyc', badge: 3 },
    { icon: BarChart3, label: '数据统计', path: '/admin/analytics' },
    { icon: FileText, label: '内容管理', path: '/admin/content' },
    { icon: MessageSquare, label: '客服消息', path: '/admin/messages', badge: 12 },
    { icon: Shield, label: '权限管理', path: '/admin/permissions' },
    { icon: Settings, label: '系统设置', path: '/admin/settings' },
  ];

  const isActive = (path: string) => {
    if (path === '/admin') {
      return location.pathname === '/admin';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div className="min-h-screen bg-black">
      {/* 顶部导航栏 */}
      <header className="fixed top-0 left-0 right-0 h-16 bg-slate-900 border-b border-slate-800 z-30">
        <div className="flex items-center justify-between h-full px-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="text-gray-300 hover:text-white transition-colors lg:hidden"
            >
              {isSidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
            <h1 className="text-xl font-bold text-white">CRYPTONX 管理后台</h1>
          </div>

          <div className="flex items-center gap-4">
            {/* 通知 */}
            <button className="relative text-gray-300 hover:text-white transition-colors">
              <Bell className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-xs flex items-center justify-center text-white">
                3
              </span>
            </button>

            {/* 用户信息 */}
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-[#A3F030] flex items-center justify-center">
                <span className="text-black font-semibold text-sm">
                  {currentUser?.email?.[0]?.toUpperCase() || 'A'}
                </span>
              </div>
              <span className="text-gray-300 text-sm hidden md:block">
                {currentUser?.email || '管理员'}
              </span>
            </div>

            {/* 退出登录 */}
            <button
              onClick={handleLogout}
              className="text-gray-300 hover:text-red-400 transition-colors"
              title="退出登录"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      {/* 侧边栏 */}
      <aside
        className={`fixed top-16 left-0 bottom-0 w-64 bg-slate-900 border-r border-slate-800 transition-transform duration-300 z-20 ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0`}
      >
        <nav className="p-4 space-y-1 overflow-y-auto h-full">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);
            
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center justify-between gap-3 px-4 py-3 rounded-lg transition-colors ${
                  active
                    ? 'bg-[#A3F030]/10 text-[#A3F030] border border-[#A3F030]/20'
                    : 'text-gray-300 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-5 h-5" />
                  <span className="text-sm font-medium">{item.label}</span>
                </div>
                {item.badge && (
                  <span className="px-2 py-0.5 text-xs bg-red-500 text-white rounded-full">
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* 主内容区域 */}
      <main
        className={`pt-16 transition-all duration-300 ${
          isSidebarOpen ? 'lg:pl-64' : 'pl-0'
        }`}
      >
        <div className="p-6 min-h-screen">
          <Outlet />
        </div>
      </main>

      {/* 移动端遮罩 */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-10 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
    </div>
  );
}
