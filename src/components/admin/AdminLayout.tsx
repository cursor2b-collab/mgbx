import { useState, useEffect } from 'react';
import { Link, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  TrendingUp, 
  TrendingDown,
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
  MessageSquare,
  Coins,
  ShoppingCart,
  Package,
  CreditCard,
  Receipt,
  BookOpen,
  AlertTriangle,
  UserCog,
  Database,
  FormInput,
  ChevronDown,
  ChevronRight,
  Star,
  UserCircle,
  List,
  BarChart,
  Gauge,
  FileCheck2,
  HelpCircle,
  ClipboardList
} from 'lucide-react';
import { auth } from '../../utils/supabase/client';
import { toast } from 'sonner@2.0.3';
import { ShaderBackground } from '../ui/shader-background';

interface SubMenuItem {
  icon: any;
  label: string;
  path: string;
  badge?: number;
}

interface MenuItem {
  icon: any;
  label: string;
  path?: string;
  badge?: number;
  children?: SubMenuItem[];
}

export function AdminLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [expandedMenus, setExpandedMenus] = useState<Set<string>>(new Set());
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    checkAuth();
  }, []);

  // 根据当前路径自动展开对应的菜单
  useEffect(() => {
    const path = location.pathname;
    const newExpanded = new Set<string>();
    
    // 检查路径并展开对应的父菜单
    if (path.startsWith('/admin/coins')) {
      newExpanded.add('基础设置');
    }
    if (path.startsWith('/admin/users')) {
      newExpanded.add('用户中心');
    }
    if (path.startsWith('/admin/fund')) {
      newExpanded.add('充值提现');
    }
    if (path.startsWith('/admin/orders')) {
      newExpanded.add('订单管理');
    }
    if (path.startsWith('/admin/goods')) {
      newExpanded.add('产品管理');
    }
    if (path.startsWith('/admin/trades')) {
      newExpanded.add('交易管理');
    }
    if (path.startsWith('/admin/shop')) {
      newExpanded.add('商城管理');
    }
    if (path.startsWith('/admin/article') || path.startsWith('/admin/notice') || path.startsWith('/admin/answers')) {
      newExpanded.add('文章公告');
    }
    if (path.startsWith('/admin/settings')) {
      newExpanded.add('系统管理');
    }
    if (path.startsWith('/admin/manage')) {
      newExpanded.add('管理员管理');
    }
    if (path.startsWith('/admin/config')) {
      newExpanded.add('配置管理');
    }
    
    setExpandedMenus(newExpanded);
  }, [location.pathname]);

  const checkAuth = async () => {
    try {
      // auth.getUser() 直接返回 user，不是 { data: { user } }
      const user = await auth.getUser();
      if (!user) {
        console.log('AdminLayout: 未找到用户，但由 AdminProtectedRoute 处理重定向');
        return;
      }
      setCurrentUser(user);
      
      // 检查是否是管理员（这里可以根据实际需求修改）
      // 比如检查 user.user_metadata.role === 'admin'
    } catch (error) {
      console.error('AdminLayout: 获取用户失败', error);
      // 不在这里导航，让 AdminProtectedRoute 处理
    }
  };

  const handleLogout = async () => {
    try {
      await auth.signOut();
      toast.success('已退出登录');
      navigate('/admin/login');
    } catch (error: any) {
      toast.error('退出失败');
    }
  };

  const menuItems: MenuItem[] = [
    { icon: LayoutDashboard, label: '后台首页', path: '/admin' },
    { 
      icon: Star, 
      label: '基础设置', 
      children: [
        { icon: Coins, label: '平台币种', path: '/admin/coins' },
      ]
    },
    { 
      icon: Users, 
      label: '用户中心', 
      children: [
        { icon: List, label: '会员数据', path: '/admin/users' },
        { icon: FileCheck2, label: '认证数据', path: '/admin/users/auth' },
        { icon: UserCircle, label: '账户管理', path: '/admin/users/account' },
        { icon: ClipboardList, label: '资金记录', path: '/admin/users/bill' },
      ]
    },
    { 
      icon: CreditCard, 
      label: '充值提现', 
      children: [
        { icon: TrendingDown, label: '充值记录', path: '/admin/fund/recharge' },
        { icon: TrendingUp, label: '提现记录', path: '/admin/fund/withdrawal' },
        { icon: Wallet, label: '银行卡提现', path: '/admin/fund/withdrawalbank' },
      ]
    },
    { 
      icon: Receipt, 
      label: '订单管理', 
      children: [
        { icon: FileText, label: '合约订单', path: '/admin/orders/contract' },
        { icon: FileText, label: '期权订单', path: '/admin/orders/option' },
        { icon: FileText, label: '借贷订单', path: '/admin/orders/borrow' },
        { icon: FileText, label: '质押订单', path: '/admin/orders/still' },
        { icon: FileText, label: '委托订单', path: '/admin/orders/arrange' },
      ]
    },
    { 
      icon: Package, 
      label: '产品管理', 
      children: [
        { icon: Package, label: '期货产品', path: '/admin/goods/forward' },
        { icon: Package, label: '期权产品', path: '/admin/goods/option' },
        { icon: Package, label: '借贷产品', path: '/admin/goods/borrow' },
        { icon: Package, label: '质押产品', path: '/admin/goods/pledge' },
        { icon: Package, label: '加密产品', path: '/admin/goods/encrypt' },
        { icon: Package, label: '外汇产品', path: '/admin/goods/foreign' },
        { icon: Package, label: '股票产品', path: '/admin/goods/shares' },
        { icon: Package, label: 'K线产品', path: '/admin/goods/kline' },
      ]
    },
    { 
      icon: TrendingUp, 
      label: '交易管理', 
      children: [
        { icon: List, label: '委托订单', path: '/admin/trades/entrust' },
        { icon: BarChart, label: '交易记录', path: '/admin/trades/index' },
      ]
    },
    { 
      icon: ShoppingCart, 
      label: '商城管理', 
      children: [
        { icon: Package, label: '商品列表', path: '/admin/shop/index' },
        { icon: Receipt, label: '订单列表', path: '/admin/shop/orderlist' },
      ]
    },
    { icon: AlertTriangle, label: '风控管理', path: '/admin/risk' },
    { 
      icon: FileText, 
      label: '文章公告', 
      children: [
        { icon: FileText, label: '文章内容', path: '/admin/article' },
        { icon: Bell, label: '公告管理', path: '/admin/notice' },
        { icon: HelpCircle, label: '问答管理', path: '/admin/answers' },
      ]
    },
    { 
      icon: Settings, 
      label: '系统管理', 
      children: [
        { icon: Settings, label: '网站基础设置', path: '/admin/settings' },
        { icon: Gauge, label: '等级设置', path: '/admin/settings/level' },
        { icon: TrendingUp, label: '交易设置', path: '/admin/settings/trade' },
        { icon: FileText, label: '协议设置', path: '/admin/settings/protocol' },
        { icon: MessageSquare, label: '客服设置', path: '/admin/settings/kefucode' },
      ]
    },
    { 
      icon: UserCog, 
      label: '管理员管理', 
      children: [
        { icon: Users, label: '管理员列表', path: '/admin/manage' },
        { icon: Shield, label: '权限管理', path: '/admin/manage/rules' },
        { icon: FileText, label: '操作日志', path: '/admin/manage/logs' },
      ]
    },
    { 
      icon: Database, 
      label: '配置管理', 
      children: [
        { icon: Settings, label: '参数配置', path: '/admin/config/params' },
        { icon: FileText, label: '系统日志', path: '/admin/config/logs' },
      ]
    },
    { icon: FormInput, label: '表单管理', path: '/admin/forms' },
  ];

  const isActive = (path?: string) => {
    if (!path) return false;
    if (path === '/admin') {
      return location.pathname === '/admin';
    }
    return location.pathname.startsWith(path);
  };

  const toggleMenu = (label: string) => {
    setExpandedMenus(prev => {
      const newSet = new Set(prev);
      if (newSet.has(label)) {
        newSet.delete(label);
      } else {
        newSet.add(label);
      }
      return newSet;
    });
  };

  const isMenuExpanded = (label: string) => {
    return expandedMenus.has(label);
  };

  const hasActiveChild = (children?: SubMenuItem[]) => {
    if (!children) return false;
    return children.some(child => isActive(child.path));
  };

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Shader 背景 */}
      <div className="fixed inset-0 z-0 opacity-30">
        <ShaderBackground className="w-full h-full" />
      </div>
      
      {/* 渐变遮罩 */}
      <div className="fixed inset-0 z-0 pointer-events-none [background:radial-gradient(120%_80%_at_50%_50%,_transparent_40%,_rgba(0,0,0,0.8)_100%)]" />
      
      {/* 内容层 */}
      <div className="relative z-10">
      {/* 顶部导航栏 */}
      <header className="fixed top-0 left-0 right-0 h-16 bg-slate-900/80 backdrop-blur-md border-b border-slate-800/50 z-30">
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
        className={`fixed top-16 left-0 bottom-0 w-64 bg-slate-900/80 backdrop-blur-md border-r border-slate-800/50 transition-transform duration-300 z-20 ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0`}
      >
        <nav className="p-4 space-y-1 overflow-y-auto h-full">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const hasChildren = item.children && item.children.length > 0;
            const active = isActive(item.path);
            const hasActive = hasActiveChild(item.children);
            const isExpanded = isMenuExpanded(item.label);
            
            if (hasChildren) {
              return (
                <div key={item.label}>
                  <button
                    onClick={() => toggleMenu(item.label)}
                    className={`w-full flex items-center justify-between gap-3 px-4 py-3 rounded-lg transition-colors ${
                      hasActive
                        ? 'bg-[#A3F030]/10 text-[#A3F030] border border-[#A3F030]/20'
                        : 'text-gray-300 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className="w-5 h-5" />
                      <span className="text-sm font-medium">{item.label}</span>
                    </div>
                    {isExpanded ? (
                      <ChevronDown className="w-4 h-4" />
                    ) : (
                      <ChevronRight className="w-4 h-4" />
                    )}
                  </button>
                  {isExpanded && item.children && (
                    <div className="ml-4 mt-1 space-y-1">
                      {item.children.map((child) => {
                        const ChildIcon = child.icon;
                        const childActive = isActive(child.path);
                        return (
                          <Link
                            key={child.path}
                            to={child.path}
                            className={`flex items-center justify-between gap-3 px-4 py-3 rounded-lg transition-colors ${
                              childActive
                                ? 'bg-[#A3F030]/10 text-[#A3F030] border border-[#A3F030]/20'
                                : 'text-gray-300 hover:bg-white/10 hover:text-white'
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <ChildIcon className="w-4 h-4" />
                              <span className="text-sm font-medium">{child.label}</span>
                            </div>
                            {child.badge && (
                              <span className="px-2 py-0.5 text-xs bg-red-500 text-white rounded-full">
                                {child.badge}
                              </span>
                            )}
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            }
            
            return (
              <Link
                key={item.path || item.label}
                to={item.path || '#'}
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
    </div>
  );
}
