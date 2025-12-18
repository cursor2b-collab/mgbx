import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { 
  Settings, 
  Users, 
  TrendingUp,
  FileText,
  MessageSquare,
  Save
} from 'lucide-react';
import { toast } from 'sonner';

export function SettingsManagement() {
  const location = useLocation();
  const getInitialTab = () => {
    if (location.pathname.includes('level')) return 'level';
    if (location.pathname.includes('trade')) return 'trade';
    if (location.pathname.includes('protocol')) return 'protocol';
    if (location.pathname.includes('kefucode')) return 'kefu';
    return 'system';
  };
  const [activeTab, setActiveTab] = useState(getInitialTab());
  const navigate = useNavigate();
  
  useEffect(() => {
    setActiveTab(getInitialTab());
  }, [location.pathname]);
  
  const handleTabChange = (value: string) => {
    setActiveTab(value);
    if (value === 'level') {
      navigate('/admin/settings/level');
    } else if (value === 'trade') {
      navigate('/admin/settings/trade');
    } else if (value === 'protocol') {
      navigate('/admin/settings/protocol');
    } else if (value === 'kefu') {
      navigate('/admin/settings/kefucode');
    } else {
      navigate('/admin/settings');
    }
  };
  const [loading, setLoading] = useState(false);
  const [systemSettings, setSystemSettings] = useState({
    siteName: '',
    siteTitle: '',
    siteDescription: '',
    logo: '',
    // ... 其他系统设置
  });
  const [levelSettings, setLevelSettings] = useState([]);
  const [tradeSettings, setTradeSettings] = useState({
    minTradeAmount: 0,
    maxTradeAmount: 0,
    feeRate: 0,
    // ... 其他交易设置
  });
  const [protocolSettings, setProtocolSettings] = useState({
    userAgreement: '',
    privacyPolicy: '',
    // ... 其他协议设置
  });
  const [kefuSettings, setKefuSettings] = useState({
    kfcode01: '',
    kfcode02: '',
    kfcode03: '',
  });

  useEffect(() => {
    loadSettings();
  }, [activeTab]);

  const loadSettings = async () => {
    setLoading(true);
    try {
      // 这里应该调用实际的 API
      await new Promise(resolve => setTimeout(resolve, 500));
    } catch (error) {
      toast.error('加载设置失败');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      // 这里应该调用实际的 API
      toast.success('保存成功');
    } catch (error) {
      toast.error('保存失败');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white">系统设置</h1>
        <p className="text-gray-400 mt-1">管理系统各项配置参数</p>
      </div>

      <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
        <TabsList className="bg-slate-900 border border-slate-800">
          <TabsTrigger value="system" className="data-[state=active]:bg-[#A3F030] data-[state=active]:text-black">
            系统设置
          </TabsTrigger>
          <TabsTrigger value="level" className="data-[state=active]:bg-[#A3F030] data-[state=active]:text-black">
            等级设置
          </TabsTrigger>
          <TabsTrigger value="trade" className="data-[state=active]:bg-[#A3F030] data-[state=active]:text-black">
            交易设置
          </TabsTrigger>
          <TabsTrigger value="protocol" className="data-[state=active]:bg-[#A3F030] data-[state=active]:text-black">
            协议设置
          </TabsTrigger>
          <TabsTrigger value="kefu" className="data-[state=active]:bg-[#A3F030] data-[state=active]:text-black">
            客服设置
          </TabsTrigger>
        </TabsList>

        {/* 系统设置 */}
        <TabsContent value="system" className="mt-6">
          <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-6 shadow-lg shadow-black/20">
            <div className="space-y-6">
              <div>
                <label className="block text-gray-300 text-sm mb-2">网站名称</label>
                <input
                  type="text"
                  value={systemSettings.siteName}
                  onChange={(e) => setSystemSettings({...systemSettings, siteName: e.target.value})}
                  className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-[#A3F030]"
                />
              </div>
              <div>
                <label className="block text-gray-300 text-sm mb-2">网站标题</label>
                <input
                  type="text"
                  value={systemSettings.siteTitle}
                  onChange={(e) => setSystemSettings({...systemSettings, siteTitle: e.target.value})}
                  className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-[#A3F030]"
                />
              </div>
              <div>
                <label className="block text-gray-300 text-sm mb-2">网站描述</label>
                <textarea
                  value={systemSettings.siteDescription}
                  onChange={(e) => setSystemSettings({...systemSettings, siteDescription: e.target.value})}
                  rows={4}
                  className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-[#A3F030]"
                />
              </div>
              <button
                onClick={handleSave}
                className="px-6 py-2 bg-[#A3F030] text-black rounded-lg font-medium hover:bg-[#A3F030]/90 flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                保存设置
              </button>
            </div>
          </div>
        </TabsContent>

        {/* 等级设置 */}
        <TabsContent value="level" className="mt-6">
          <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-6 shadow-lg shadow-black/20">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-white">VIP等级管理</h3>
              <button className="px-4 py-2 bg-[#A3F030] text-black rounded-lg font-medium hover:bg-[#A3F030]/90">
                添加等级
              </button>
            </div>
            <div className="text-center text-gray-400 py-8">
              等级列表功能开发中...
            </div>
          </div>
        </TabsContent>

        {/* 交易设置 */}
        <TabsContent value="trade" className="mt-6">
          <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-6 shadow-lg shadow-black/20">
            <div className="space-y-6">
              <div>
                <label className="block text-gray-300 text-sm mb-2">最小交易金额</label>
                <input
                  type="number"
                  value={tradeSettings.minTradeAmount}
                  onChange={(e) => setTradeSettings({...tradeSettings, minTradeAmount: parseFloat(e.target.value)})}
                  className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-[#A3F030]"
                />
              </div>
              <div>
                <label className="block text-gray-300 text-sm mb-2">最大交易金额</label>
                <input
                  type="number"
                  value={tradeSettings.maxTradeAmount}
                  onChange={(e) => setTradeSettings({...tradeSettings, maxTradeAmount: parseFloat(e.target.value)})}
                  className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-[#A3F030]"
                />
              </div>
              <div>
                <label className="block text-gray-300 text-sm mb-2">手续费率 (%)</label>
                <input
                  type="number"
                  step="0.01"
                  value={tradeSettings.feeRate}
                  onChange={(e) => setTradeSettings({...tradeSettings, feeRate: parseFloat(e.target.value)})}
                  className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-[#A3F030]"
                />
              </div>
              <button
                onClick={handleSave}
                className="px-6 py-2 bg-[#A3F030] text-black rounded-lg font-medium hover:bg-[#A3F030]/90 flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                保存设置
              </button>
            </div>
          </div>
        </TabsContent>

        {/* 协议设置 */}
        <TabsContent value="protocol" className="mt-6">
          <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-6 shadow-lg shadow-black/20">
            <div className="space-y-6">
              <div>
                <label className="block text-gray-300 text-sm mb-2">用户协议</label>
                <textarea
                  value={protocolSettings.userAgreement}
                  onChange={(e) => setProtocolSettings({...protocolSettings, userAgreement: e.target.value})}
                  rows={10}
                  className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-[#A3F030] font-mono text-sm"
                />
              </div>
              <div>
                <label className="block text-gray-300 text-sm mb-2">隐私政策</label>
                <textarea
                  value={protocolSettings.privacyPolicy}
                  onChange={(e) => setProtocolSettings({...protocolSettings, privacyPolicy: e.target.value})}
                  rows={10}
                  className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-[#A3F030] font-mono text-sm"
                />
              </div>
              <button
                onClick={handleSave}
                className="px-6 py-2 bg-[#A3F030] text-black rounded-lg font-medium hover:bg-[#A3F030]/90 flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                保存设置
              </button>
            </div>
          </div>
        </TabsContent>

        {/* 客服设置 */}
        <TabsContent value="kefu" className="mt-6">
          <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-6 shadow-lg shadow-black/20">
            <div className="space-y-6">
              <div>
                <label className="block text-gray-300 text-sm mb-2">客服代码 01</label>
                <textarea
                  value={kefuSettings.kfcode01}
                  onChange={(e) => setKefuSettings({...kefuSettings, kfcode01: e.target.value})}
                  rows={6}
                  className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-[#A3F030] font-mono text-sm"
                  placeholder="请输入客服代码（HTML/JavaScript）"
                />
              </div>
              <div>
                <label className="block text-gray-300 text-sm mb-2">客服代码 02</label>
                <textarea
                  value={kefuSettings.kfcode02}
                  onChange={(e) => setKefuSettings({...kefuSettings, kfcode02: e.target.value})}
                  rows={6}
                  className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-[#A3F030] font-mono text-sm"
                  placeholder="请输入客服代码（HTML/JavaScript）"
                />
              </div>
              <div>
                <label className="block text-gray-300 text-sm mb-2">客服代码 03</label>
                <textarea
                  value={kefuSettings.kfcode03}
                  onChange={(e) => setKefuSettings({...kefuSettings, kfcode03: e.target.value})}
                  rows={6}
                  className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-[#A3F030] font-mono text-sm"
                  placeholder="请输入客服代码（HTML/JavaScript）"
                />
              </div>
              <button
                onClick={handleSave}
                className="px-6 py-2 bg-[#A3F030] text-black rounded-lg font-medium hover:bg-[#A3F030]/90 flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                保存设置
              </button>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

