import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { 
  ShoppingCart, 
  Package, 
  Plus, 
  Edit, 
  Trash2,
  Search,
  Download
} from 'lucide-react';
import { toast } from 'sonner';

interface ShopGoods {
  id: string;
  goods_name: string;
  shop_name: string;
  goods_price: number;
  goods_pic?: string;
  status: number;
  addtime: string;
}

interface ShopOrder {
  id: string;
  account: string;
  goods_name: string;
  goods_price: number;
  quantity: number;
  total_amount: number;
  state: number; // 0:待支付, 1:已支付, 2:已完成, 3:已取消
  addtime: string;
}

export function ShopManagement() {
  const location = useLocation();
  const getInitialTab = () => {
    return location.pathname.includes('orderlist') ? 'orders' : 'goods';
  };
  const [activeTab, setActiveTab] = useState(getInitialTab());
  const navigate = useNavigate();
  
  useEffect(() => {
    setActiveTab(getInitialTab());
  }, [location.pathname]);
  
  const handleTabChange = (value: string) => {
    setActiveTab(value);
    if (value === 'orders') {
      navigate('/admin/shop/orderlist');
    } else {
      navigate('/admin/shop/index');
    }
  };
  const [goodsList, setGoodsList] = useState<ShopGoods[]>([]);
  const [orderList, setOrderList] = useState<ShopOrder[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadData();
  }, [activeTab]);

  const loadData = async () => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      if (activeTab === 'goods') {
        setGoodsList([]);
      } else {
        setOrderList([]);
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
          <h1 className="text-3xl font-bold text-white">商城管理</h1>
          <p className="text-gray-400 mt-1">管理商城商品和订单</p>
        </div>
        {activeTab === 'goods' && (
          <button className="px-4 py-2 bg-[#A3F030] text-black rounded-lg font-medium hover:bg-[#A3F030]/90 flex items-center gap-2">
            <Plus className="w-4 h-4" />
            添加商品
          </button>
        )}
      </div>

      <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
        <TabsList className="bg-slate-900 border border-slate-800">
          <TabsTrigger value="goods" className="data-[state=active]:bg-[#A3F030] data-[state=active]:text-black">
            商品列表
          </TabsTrigger>
          <TabsTrigger value="orders" className="data-[state=active]:bg-[#A3F030] data-[state=active]:text-black">
            订单列表
          </TabsTrigger>
        </TabsList>

        {/* 商品列表 */}
        <TabsContent value="goods" className="mt-6">
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
                    <th className="text-left text-gray-400 text-sm font-medium pb-3">商品图片</th>
                    <th className="text-left text-gray-400 text-sm font-medium pb-3">商品名称</th>
                    <th className="text-left text-gray-400 text-sm font-medium pb-3">店铺名称</th>
                    <th className="text-right text-gray-400 text-sm font-medium pb-3">价格</th>
                    <th className="text-left text-gray-400 text-sm font-medium pb-3">状态</th>
                    <th className="text-left text-gray-400 text-sm font-medium pb-3">创建时间</th>
                    <th className="text-right text-gray-400 text-sm font-medium pb-3">操作</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {loading ? (
                    <tr>
                      <td colSpan={8} className="py-8 text-center text-gray-400">
                        加载中...
                      </td>
                    </tr>
                  ) : goodsList.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="py-8 text-center text-gray-400">
                        暂无数据
                      </td>
                    </tr>
                  ) : (
                    goodsList.map((item) => (
                      <tr key={item.id} className="hover:bg-white/5 transition-colors">
                        <td className="py-3 text-gray-300 text-sm">{item.id}</td>
                        <td className="py-3">
                          {item.goods_pic ? (
                            <img src={item.goods_pic} alt={item.goods_name} className="w-12 h-12 rounded object-cover" />
                          ) : (
                            <div className="w-12 h-12 rounded bg-slate-700 flex items-center justify-center">
                              <Package className="w-6 h-6 text-gray-400" />
                            </div>
                          )}
                        </td>
                        <td className="py-3 text-white text-sm">{item.goods_name}</td>
                        <td className="py-3 text-gray-300 text-sm">{item.shop_name}</td>
                        <td className="py-3 text-right text-white text-sm font-medium">{item.goods_price}</td>
                        <td className="py-3">
                          <span className={`px-2 py-1 text-xs rounded ${
                            item.status === 1 
                              ? 'bg-[#A3F030]/10 text-[#A3F030]' 
                              : 'bg-gray-500/10 text-gray-400'
                          }`}>
                            {item.status === 1 ? '上架' : '下架'}
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

        {/* 订单列表 */}
        <TabsContent value="orders" className="mt-6">
          <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-6 shadow-lg shadow-black/20">
            <div className="flex gap-4 mb-6">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="搜索账户或订单ID..."
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
                    <th className="text-left text-gray-400 text-sm font-medium pb-3">订单ID</th>
                    <th className="text-left text-gray-400 text-sm font-medium pb-3">账户</th>
                    <th className="text-left text-gray-400 text-sm font-medium pb-3">商品名称</th>
                    <th className="text-right text-gray-400 text-sm font-medium pb-3">单价</th>
                    <th className="text-right text-gray-400 text-sm font-medium pb-3">数量</th>
                    <th className="text-right text-gray-400 text-sm font-medium pb-3">总金额</th>
                    <th className="text-left text-gray-400 text-sm font-medium pb-3">状态</th>
                    <th className="text-left text-gray-400 text-sm font-medium pb-3">下单时间</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {loading ? (
                    <tr>
                      <td colSpan={8} className="py-8 text-center text-gray-400">
                        加载中...
                      </td>
                    </tr>
                  ) : orderList.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="py-8 text-center text-gray-400">
                        暂无数据
                      </td>
                    </tr>
                  ) : (
                    orderList.map((order) => (
                      <tr key={order.id} className="hover:bg-white/5 transition-colors">
                        <td className="py-3 text-gray-300 text-sm">{order.id}</td>
                        <td className="py-3 text-white text-sm">{order.account}</td>
                        <td className="py-3 text-gray-300 text-sm">{order.goods_name}</td>
                        <td className="py-3 text-right text-gray-300 text-sm">{order.goods_price}</td>
                        <td className="py-3 text-right text-gray-300 text-sm">{order.quantity}</td>
                        <td className="py-3 text-right text-white text-sm font-medium">{order.total_amount}</td>
                        <td className="py-3">
                          <span className={`px-2 py-1 text-xs rounded ${
                            order.state === 1 
                              ? 'bg-[#A3F030]/10 text-[#A3F030]' 
                              : order.state === 0
                              ? 'bg-yellow-500/10 text-yellow-400'
                              : 'bg-gray-500/10 text-gray-400'
                          }`}>
                            {order.state === 0 ? '待支付' : order.state === 1 ? '已支付' : order.state === 2 ? '已完成' : '已取消'}
                          </span>
                        </td>
                        <td className="py-3 text-gray-400 text-sm">{order.addtime}</td>
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

