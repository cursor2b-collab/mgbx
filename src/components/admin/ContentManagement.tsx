import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { 
  FileText, 
  Bell, 
  MessageSquare,
  Plus, 
  Edit, 
  Trash2,
  Search
} from 'lucide-react';
import { toast } from 'sonner';

interface Article {
  id: string;
  title: string;
  content: string;
  status: number;
  addtime: string;
}

interface Notice {
  id: string;
  title: string;
  content: string;
  status: number;
  addtime: string;
}

interface Answer {
  id: string;
  question: string;
  answer: string;
  status: number;
  addtime: string;
}

export function ContentManagement() {
  const location = useLocation();
  const getInitialTab = () => {
    if (location.pathname.includes('notice')) return 'notice';
    if (location.pathname.includes('answers')) return 'answer';
    return 'article';
  };
  const [activeTab, setActiveTab] = useState(getInitialTab());
  const navigate = useNavigate();
  
  useEffect(() => {
    setActiveTab(getInitialTab());
  }, [location.pathname]);
  
  const handleTabChange = (value: string) => {
    setActiveTab(value);
    if (value === 'notice') {
      navigate('/admin/notice');
    } else if (value === 'answer') {
      navigate('/admin/answers');
    } else {
      navigate('/admin/article');
    }
  };
  const [articles, setArticles] = useState<Article[]>([]);
  const [notices, setNotices] = useState<Notice[]>([]);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadData();
  }, [activeTab]);

  const loadData = async () => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      if (activeTab === 'article') {
        setArticles([]);
      } else if (activeTab === 'notice') {
        setNotices([]);
      } else {
        setAnswers([]);
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
          <h1 className="text-3xl font-bold text-white">内容管理</h1>
          <p className="text-gray-400 mt-1">管理文章、公告和问答内容</p>
        </div>
        <button className="px-4 py-2 bg-[#A3F030] text-black rounded-lg font-medium hover:bg-[#A3F030]/90 flex items-center gap-2">
          <Plus className="w-4 h-4" />
          新增内容
        </button>
      </div>

      <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
        <TabsList className="bg-slate-900 border border-slate-800">
          <TabsTrigger value="article" className="data-[state=active]:bg-[#A3F030] data-[state=active]:text-black">
            文章管理
          </TabsTrigger>
          <TabsTrigger value="notice" className="data-[state=active]:bg-[#A3F030] data-[state=active]:text-black">
            公告管理
          </TabsTrigger>
          <TabsTrigger value="answer" className="data-[state=active]:bg-[#A3F030] data-[state=active]:text-black">
            问答管理
          </TabsTrigger>
        </TabsList>

        {/* 文章管理 */}
        <TabsContent value="article" className="mt-6">
          <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-6 shadow-lg shadow-black/20">
            <div className="flex gap-4 mb-6">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="搜索文章标题..."
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
                    <th className="text-left text-gray-400 text-sm font-medium pb-3">标题</th>
                    <th className="text-left text-gray-400 text-sm font-medium pb-3">状态</th>
                    <th className="text-left text-gray-400 text-sm font-medium pb-3">创建时间</th>
                    <th className="text-right text-gray-400 text-sm font-medium pb-3">操作</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {loading ? (
                    <tr>
                      <td colSpan={5} className="py-8 text-center text-gray-400">
                        加载中...
                      </td>
                    </tr>
                  ) : articles.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-8 text-center text-gray-400">
                        暂无数据
                      </td>
                    </tr>
                  ) : (
                    articles.map((item) => (
                      <tr key={item.id} className="hover:bg-white/5 transition-colors">
                        <td className="py-3 text-gray-300 text-sm">{item.id}</td>
                        <td className="py-3 text-white text-sm">{item.title}</td>
                        <td className="py-3">
                          <span className={`px-2 py-1 text-xs rounded ${
                            item.status === 1 
                              ? 'bg-[#A3F030]/10 text-[#A3F030]' 
                              : 'bg-gray-500/10 text-gray-400'
                          }`}>
                            {item.status === 1 ? '发布' : '草稿'}
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

        {/* 公告管理 */}
        <TabsContent value="notice" className="mt-6">
          <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-6 shadow-lg shadow-black/20">
            <div className="flex gap-4 mb-6">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="搜索公告标题..."
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
                    <th className="text-left text-gray-400 text-sm font-medium pb-3">标题</th>
                    <th className="text-left text-gray-400 text-sm font-medium pb-3">状态</th>
                    <th className="text-left text-gray-400 text-sm font-medium pb-3">创建时间</th>
                    <th className="text-right text-gray-400 text-sm font-medium pb-3">操作</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {loading ? (
                    <tr>
                      <td colSpan={5} className="py-8 text-center text-gray-400">
                        加载中...
                      </td>
                    </tr>
                  ) : notices.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-8 text-center text-gray-400">
                        暂无数据
                      </td>
                    </tr>
                  ) : (
                    notices.map((item) => (
                      <tr key={item.id} className="hover:bg-white/5 transition-colors">
                        <td className="py-3 text-gray-300 text-sm">{item.id}</td>
                        <td className="py-3 text-white text-sm">{item.title}</td>
                        <td className="py-3">
                          <span className={`px-2 py-1 text-xs rounded ${
                            item.status === 1 
                              ? 'bg-[#A3F030]/10 text-[#A3F030]' 
                              : 'bg-gray-500/10 text-gray-400'
                          }`}>
                            {item.status === 1 ? '发布' : '草稿'}
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

        {/* 问答管理 */}
        <TabsContent value="answer" className="mt-6">
          <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-6 shadow-lg shadow-black/20">
            <div className="flex gap-4 mb-6">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="搜索问题..."
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
                    <th className="text-left text-gray-400 text-sm font-medium pb-3">问题</th>
                    <th className="text-left text-gray-400 text-sm font-medium pb-3">答案</th>
                    <th className="text-left text-gray-400 text-sm font-medium pb-3">状态</th>
                    <th className="text-left text-gray-400 text-sm font-medium pb-3">创建时间</th>
                    <th className="text-right text-gray-400 text-sm font-medium pb-3">操作</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {loading ? (
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-gray-400">
                        加载中...
                      </td>
                    </tr>
                  ) : answers.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-gray-400">
                        暂无数据
                      </td>
                    </tr>
                  ) : (
                    answers.map((item) => (
                      <tr key={item.id} className="hover:bg-white/5 transition-colors">
                        <td className="py-3 text-gray-300 text-sm">{item.id}</td>
                        <td className="py-3 text-white text-sm">{item.question}</td>
                        <td className="py-3 text-gray-300 text-sm max-w-xs truncate">{item.answer}</td>
                        <td className="py-3">
                          <span className={`px-2 py-1 text-xs rounded ${
                            item.status === 1 
                              ? 'bg-[#A3F030]/10 text-[#A3F030]' 
                              : 'bg-gray-500/10 text-gray-400'
                          }`}>
                            {item.status === 1 ? '显示' : '隐藏'}
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
      </Tabs>
    </div>
  );
}

