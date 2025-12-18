import { useState, useEffect } from 'react';
import { 
  FormInput, 
  Plus, 
  Edit, 
  Trash2,
  Search
} from 'lucide-react';
import { toast } from 'sonner';

interface FormItem {
  id: string;
  name: string;
  type: string;
  fields: any[];
  status: number;
  addtime: string;
}

export function FormsManagement() {
  const [formsList, setFormsList] = useState<FormItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      setFormsList([]);
    } catch (error) {
      toast.error('加载数据失败');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('确定要删除这个表单吗？')) return;
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
          <h1 className="text-3xl font-bold text-white">表单管理</h1>
          <p className="text-gray-400 mt-1">管理系统表单配置</p>
        </div>
        <button className="px-4 py-2 bg-[#A3F030] text-black rounded-lg font-medium hover:bg-[#A3F030]/90 flex items-center gap-2">
          <Plus className="w-4 h-4" />
          添加表单
        </button>
      </div>

      <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-6 shadow-lg shadow-black/20">
        <div className="flex gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="搜索表单名称..."
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
                <th className="text-left text-gray-400 text-sm font-medium pb-3">表单名称</th>
                <th className="text-left text-gray-400 text-sm font-medium pb-3">类型</th>
                <th className="text-left text-gray-400 text-sm font-medium pb-3">字段数</th>
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
              ) : formsList.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-gray-400">
                    暂无数据
                  </td>
                </tr>
              ) : (
                formsList.map((form) => (
                  <tr key={form.id} className="hover:bg-white/5 transition-colors">
                    <td className="py-3 text-gray-300 text-sm">{form.id}</td>
                    <td className="py-3 text-white text-sm">{form.name}</td>
                    <td className="py-3 text-gray-300 text-sm">{form.type}</td>
                    <td className="py-3 text-gray-300 text-sm">{form.fields?.length || 0}</td>
                    <td className="py-3">
                      <span className={`px-2 py-1 text-xs rounded ${
                        form.status === 1 
                          ? 'bg-[#A3F030]/10 text-[#A3F030]' 
                          : 'bg-gray-500/10 text-gray-400'
                      }`}>
                        {form.status === 1 ? '启用' : '禁用'}
                      </span>
                    </td>
                    <td className="py-3 text-gray-400 text-sm">{form.addtime}</td>
                    <td className="py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button className="p-2 text-gray-400 hover:text-[#A3F030] transition-colors">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleDelete(form.id)}
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


