import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { 
  Package, 
  Plus, 
  Edit, 
  Trash2,
  Search,
  Filter,
  Download
} from 'lucide-react';
import { toast } from 'sonner';

interface GoodsItem {
  id: string;
  name: string;
  type: string;
  price: number;
  status: number;
  addtime: string;
}

export function GoodsManagement() {
  const location = useLocation();
  // 根据路径自动设置活动标签
  const getInitialTab = () => {
    const path = location.pathname;
    if (path.includes('option')) return 'option';
    if (path.includes('borrow')) return 'borrow';
    if (path.includes('pledge')) return 'pledge';
    if (path.includes('encrypt')) return 'encrypt';
    if (path.includes('foreign')) return 'foreign';
    if (path.includes('shares')) return 'shares';
    if (path.includes('kline')) return 'kline';
    return 'forward'; // 默认期货
  };
  const [activeTab, setActiveTab] = useState(getInitialTab());
  const [goodsList, setGoodsList] = useState<GoodsItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  // 当路径变化时更新活动标签
  useEffect(() => {
    setActiveTab(getInitialTab());
  }, [location.pathname]);
  
  const handleTabChange = (value: string) => {
    setActiveTab(value);
    // 根据标签切换路由
    navigate(`/admin/goods/${value}`);
  };

  useEffect(() => {
    loadData();
  }, [activeTab]);

  const loadData = async () => {
    setLoading(true);
    try {
      // 这里应该调用实际的 API
      await new Promise(resolve => setTimeout(resolve, 500));
      setGoodsList([]);
    } catch (error) {
      toast.error('加载数据失败');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('确定要删除这个商品吗？')) return;
    try {
      // 这里应该调用实际的 API
      toast.success('删除成功');
      loadData();
    } catch (error) {
      toast.error('删除失败');
    }
  };

  const goodsTypes = [
    { value: 'forward', label: '期货产品' },
    { value: 'option', label: '期权产品' },
    { value: 'borrow', label: '借贷产品' },
    { value: 'pledge', label: '质押产品' },
    { value: 'encrypt', label: '加密产品' },
    { value: 'foreign', label: '外汇产品' },
    { value: 'shares', label: '股票产品' },
    { value: 'kline', label: 'K线产品' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">商品管理</h1>
          <p className="text-gray-400 mt-1">管理平台各类交易商品</p>
        </div>
        <button className="px-4 py-2 bg-[#A3F030] text-black rounded-lg font-medium hover:bg-[#A3F030]/90 flex items-center gap-2">
          <Plus className="w-4 h-4" />
          新增商品
        </button>
      </div>

      <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
        <TabsList className="bg-slate-900 border border-slate-800 grid grid-cols-4 lg:grid-cols-8">
          {goodsTypes.map((type) => (
            <TabsTrigger 
              key={type.value} 
              value={type.value}
              className="data-[state=active]:bg-[#A3F030] data-[state=active]:text-black text-xs"
            >
              {type.label}
            </TabsTrigger>
          ))}
        </TabsList>

        {goodsTypes.map((type) => (
          <TabsContent key={type.value} value={type.value} className="mt-6">
            <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-6 shadow-lg shadow-black/20">
              <div className="flex gap-4 mb-6">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="搜索商品名称..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#A3F030]"
                  />
                </div>
                <button className="px-4 py-2 bg-[#A3F030] text-black rounded-lg font-medium hover:bg-[#A3F030]/90 flex items-center gap-2">
                  <Download className="w-4 h-4" />
                  导出
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-800">
                      <th className="text-left text-gray-400 text-sm font-medium pb-3">ID</th>
                      <th className="text-left text-gray-400 text-sm font-medium pb-3">商品名称</th>
                      <th className="text-left text-gray-400 text-sm font-medium pb-3">类型</th>
                      <th className="text-right text-gray-400 text-sm font-medium pb-3">价格</th>
                      <th className="text-left text-gray-400 text-sm font-medium pb-3">状态</th>
                      <th className="text-left text-gray-400 text-sm font-medium pb-3">创建时间</th>
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
                    ) : goodsList.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="py-8 text-center text-gray-400">
                          暂无数据
                        </td>
                      </tr>
                    ) : (
                      goodsList.map((item) => (
                        <tr key={item.id} className="hover:bg-white/5 transition-colors">
                          <td className="py-3 text-gray-300 text-sm">{item.id}</td>
                          <td className="py-3 text-white text-sm">{item.name}</td>
                          <td className="py-3 text-gray-300 text-sm">{item.type}</td>
                          <td className="py-3 text-right text-white text-sm font-medium">{item.price}</td>
                          <td className="py-3">
                            <span className={`px-2 py-1 text-xs rounded ${
                              item.status === 1 
                                ? 'bg-[#A3F030]/10 text-[#A3F030]' 
                                : 'bg-gray-500/10 text-gray-400'
                            }`}>
                              {item.status === 1 ? '启用' : '禁用'}
                            </span>
                          </td>
                          <td className="py-3 text-gray-400 text-sm">{item.addtime}</td>
                          <td className="py-3 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <button className="p-2 text-gray-400 hover:text-[#A3F030] transition-colors">
                                <Edit className="w-4 h-4" />
                              </button>
                              <button 
                                onClick={() => handleDelete(item.id)}
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
        ))}
      </Tabs>
    </div>
  );
}

