import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { 
  Database, 
  Settings,
  FileText,
  Search,
  Edit,
  Save
} from 'lucide-react';
import { toast } from 'sonner';

interface ConfigItem {
  id: string;
  key: string;
  value: string;
  description?: string;
  addtime: string;
}

export function ConfigManagement() {
  const location = useLocation();
  const getInitialTab = () => {
    return location.pathname.includes('logs') ? 'logs' : 'params';
  };
  const [activeTab, setActiveTab] = useState(getInitialTab());
  const navigate = useNavigate();
  
  useEffect(() => {
    setActiveTab(getInitialTab());
  }, [location.pathname]);
  
  const handleTabChange = (value: string) => {
    setActiveTab(value);
    if (value === 'logs') {
      navigate('/admin/config/logs');
    } else {
      navigate('/admin/config/params');
    }
  };
  const [configList, setConfigList] = useState<ConfigItem[]>([]);
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadData();
  }, [activeTab]);

  const loadData = async () => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      if (activeTab === 'params') {
        setConfigList([]);
      } else {
        setLogs([]);
      }
    } catch (error) {
      toast.error('加载数据失败');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (id: string, value: string) => {
    try {
      toast.success('保存成功');
      loadData();
    } catch (error) {
      toast.error('保存失败');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white">配置管理</h1>
        <p className="text-gray-400 mt-1">管理系统参数和日志</p>
      </div>

      <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
        <TabsList className="bg-slate-900 border border-slate-800">
          <TabsTrigger value="params" className="data-[state=active]:bg-[#A3F030] data-[state=active]:text-black">
            参数配置
          </TabsTrigger>
          <TabsTrigger value="logs" className="data-[state=active]:bg-[#A3F030] data-[state=active]:text-black">
            系统日志
          </TabsTrigger>
        </TabsList>

        {/* 参数配置 */}
        <TabsContent value="params" className="mt-6">
          <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-6 shadow-lg shadow-black/20">
            <div className="flex gap-4 mb-6">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="搜索配置项..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#A3F030]"
                />
              </div>
            </div>

            <div className="space-y-4">
              {loading ? (
                <div className="text-center text-gray-400 py-8">加载中...</div>
              ) : configList.length === 0 ? (
                <div className="text-center text-gray-400 py-8">暂无数据</div>
              ) : (
                configList.map((item) => (
                  <div key={item.id} className="bg-slate-800 border border-slate-700 rounded-lg p-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-white font-medium">{item.key}</span>
                          {item.description && (
                            <span className="text-gray-400 text-xs">({item.description})</span>
                          )}
                        </div>
                        <input
                          type="text"
                          value={item.value}
                          onChange={(e) => {
                            const updated = configList.map(c => 
                              c.id === item.id ? {...c, value: e.target.value} : c
                            );
                            setConfigList(updated);
                          }}
                          className="w-full px-3 py-2 bg-slate-900 border border-slate-600 rounded text-white text-sm focus:outline-none focus:border-[#A3F030]"
                        />
                      </div>
                      <button
                        onClick={() => handleSave(item.id, item.value)}
                        className="px-3 py-2 bg-[#A3F030] text-black rounded text-sm font-medium hover:bg-[#A3F030]/90 flex items-center gap-1"
                      >
                        <Save className="w-4 h-4" />
                        保存
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </TabsContent>

        {/* 系统日志 */}
        <TabsContent value="logs" className="mt-6">
          <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-6 shadow-lg shadow-black/20">
            <div className="text-center text-gray-400 py-8">
              系统日志功能开发中...
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

