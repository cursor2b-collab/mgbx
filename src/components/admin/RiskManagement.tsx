import { useState, useEffect } from 'react';
import { 
  AlertTriangle, 
  Plus, 
  Edit, 
  Trash2,
  Search
} from 'lucide-react';
import { toast } from 'sonner';

interface RiskRule {
  id: string;
  name: string;
  type: string;
  condition: string;
  action: string;
  status: number;
  addtime: string;
}

export function RiskManagement() {
  const [riskRules, setRiskRules] = useState<RiskRule[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      setRiskRules([]);
    } catch (error) {
      toast.error('加载数据失败');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('确定要删除这个风控规则吗？')) return;
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
          <h1 className="text-3xl font-bold text-white">风控管理</h1>
          <p className="text-gray-400 mt-1">管理系统风控规则</p>
        </div>
        <button className="px-4 py-2 bg-[#A3F030] text-black rounded-lg font-medium hover:bg-[#A3F030]/90 flex items-center gap-2">
          <Plus className="w-4 h-4" />
          添加规则
        </button>
      </div>

      <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-6 shadow-lg shadow-black/20">
        <div className="flex gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="搜索规则名称..."
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
                <th className="text-left text-gray-400 text-sm font-medium pb-3">规则名称</th>
                <th className="text-left text-gray-400 text-sm font-medium pb-3">类型</th>
                <th className="text-left text-gray-400 text-sm font-medium pb-3">条件</th>
                <th className="text-left text-gray-400 text-sm font-medium pb-3">操作</th>
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
              ) : riskRules.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-gray-400">
                    暂无数据
                  </td>
                </tr>
              ) : (
                riskRules.map((rule) => (
                  <tr key={rule.id} className="hover:bg-white/5 transition-colors">
                    <td className="py-3 text-gray-300 text-sm">{rule.id}</td>
                    <td className="py-3 text-white text-sm">{rule.name}</td>
                    <td className="py-3 text-gray-300 text-sm">{rule.type}</td>
                    <td className="py-3 text-gray-300 text-sm">{rule.condition}</td>
                    <td className="py-3 text-gray-300 text-sm">{rule.action}</td>
                    <td className="py-3">
                      <span className={`px-2 py-1 text-xs rounded ${
                        rule.status === 1 
                          ? 'bg-[#A3F030]/10 text-[#A3F030]' 
                          : 'bg-gray-500/10 text-gray-400'
                      }`}>
                        {rule.status === 1 ? '启用' : '禁用'}
                      </span>
                    </td>
                    <td className="py-3 text-gray-400 text-sm">{rule.addtime}</td>
                    <td className="py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button className="p-2 text-gray-400 hover:text-[#A3F030] transition-colors">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleDelete(rule.id)}
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
    </div>
  );
}


