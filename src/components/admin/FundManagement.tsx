import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { 
  CreditCard, 
  ArrowDownCircle, 
  ArrowUpCircle,
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  Clock,
  Download,
  Trash2
} from 'lucide-react';
import { toast } from 'sonner';
import { 
  hzRechargeService, 
  hzWithdrawService, 
  hzWithdrawBankService,
  type HzRecharge,
  type HzWithdraw,
  type HzWithdrawBank
} from '../../services/hzDatabase';

export function FundManagement() {
  const location = useLocation();
  const navigate = useNavigate();
  // 根据路径自动设置活动标签
  const getInitialTab = () => {
    if (location.pathname.includes('withdrawalbank')) return 'bank-withdraw';
    if (location.pathname.includes('withdrawal')) return 'withdraw';
    return 'recharge';
  };
  const [activeTab, setActiveTab] = useState(getInitialTab());
  
  const handleTabChange = (value: string) => {
    setActiveTab(value);
    // 根据标签切换路由
    if (value === 'recharge') {
      navigate('/admin/fund/recharge');
    } else if (value === 'withdraw') {
      navigate('/admin/fund/withdrawal');
    } else if (value === 'bank-withdraw') {
      navigate('/admin/fund/withdrawalbank');
    }
  };
  const [rechargeRecords, setRechargeRecords] = useState<HzRecharge[]>([]);
  const [withdrawRecords, setWithdrawRecords] = useState<HzWithdraw[]>([]);
  const [bankWithdrawRecords, setBankWithdrawRecords] = useState<HzWithdrawBank[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterState, setFilterState] = useState<string>('all');

  // 当路径变化时更新活动标签
  useEffect(() => {
    setActiveTab(getInitialTab());
  }, [location.pathname]);

  // 统计数据
  const [stats, setStats] = useState({
    rechargeTotal: 0,
    rechargePending: 0,
    withdrawTotal: 0,
    withdrawPending: 0,
    bankWithdrawTotal: 0,
    bankWithdrawPending: 0,
  });

  useEffect(() => {
    loadData();
    loadStats();
  }, [activeTab, filterState, searchTerm]);

  const loadData = async () => {
    setLoading(true);
    try {
      const filters: any = {};
      if (filterState !== 'all') {
        filters.state = parseInt(filterState);
      }

      if (activeTab === 'recharge') {
        const records = await hzRechargeService.getAllRecharges(filters, 100, 0);
        let filtered = records;
        if (searchTerm) {
          filtered = records.filter(r => 
            r.account?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            r.coinname?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            String(r.id).includes(searchTerm)
          );
        }
        setRechargeRecords(filtered);
      } else if (activeTab === 'withdraw') {
        const records = await hzWithdrawService.getAllWithdraws(filters, 100, 0);
        let filtered = records;
        if (searchTerm) {
          filtered = records.filter(r => 
            r.account?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            r.coinname?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            String(r.id).includes(searchTerm)
          );
        }
        setWithdrawRecords(filtered);
      } else if (activeTab === 'bank-withdraw') {
        const records = await hzWithdrawBankService.getAllWithdrawBanks(filters, 100, 0);
        let filtered = records;
        if (searchTerm) {
          filtered = records.filter(r => 
            r.account?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            r.coinname?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            String(r.id).includes(searchTerm)
          );
        }
        setBankWithdrawRecords(filtered);
      }
    } catch (error) {
      console.error('加载数据失败:', error);
      toast.error('加载数据失败');
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const [rechargeTotal, rechargePending, withdrawTotal, withdrawPending, bankWithdrawTotal, bankWithdrawPending] = await Promise.all([
        hzRechargeService.getRechargeTotal('USDT', 2).catch(() => 0),
        hzRechargeService.getAllRecharges({ state: 0 }, 1, 0).then(data => data.length).catch(() => 0),
        hzWithdrawService.getWithdrawTotal('USDT', 1).catch(() => 0),
        hzWithdrawService.getAllWithdraws({ state: 0 }, 1, 0).then(data => data.length).catch(() => 0),
        hzWithdrawBankService.getAllWithdrawBanks().then(data => 
          data.reduce((sum, w) => sum + Number(w.num || 0), 0)
        ).catch(() => 0),
        hzWithdrawBankService.getAllWithdrawBanks({ state: 0 }, 1, 0).then(data => data.length).catch(() => 0),
      ]);

      setStats({
        rechargeTotal,
        rechargePending,
        withdrawTotal,
        withdrawPending,
        bankWithdrawTotal,
        bankWithdrawPending,
      });
    } catch (error) {
      console.error('加载统计数据失败:', error);
    }
  };

  const handleApprove = async (id: number, type: 'recharge' | 'withdraw' | 'bank-withdraw') => {
    if (!confirm('确定要通过此申请吗？')) return;
    try {
      if (type === 'recharge') {
        await hzRechargeService.updateRechargeStatus(id, 2); // 2: 已完成
      } else if (type === 'withdraw') {
        await hzWithdrawService.updateWithdrawStatus(id, 1); // 1: 已完成
      } else if (type === 'bank-withdraw') {
        await hzWithdrawBankService.updateWithdrawBankStatus(id, 1); // 1: 已完成
      }
      toast.success('操作成功');
      loadData();
      loadStats();
    } catch (error) {
      toast.error('操作失败');
      console.error('Error approving:', error);
    }
  };

  const handleReject = async (id: number, type: 'recharge' | 'withdraw' | 'bank-withdraw') => {
    const reason = prompt('请输入驳回原因：');
    if (!reason) {
      toast.info('已取消驳回');
      return;
    }
    try {
      if (type === 'recharge') {
        // Recharge doesn't have a direct 'rejected' state, usually it's just not completed.
        toast.info('充值驳回逻辑待实现，已记录原因。');
        console.log(`Recharge ID ${id} rejected with reason: ${reason}`);
      } else if (type === 'withdraw') {
        await hzWithdrawService.updateWithdrawStatus(id, 2, reason); // 2: 已驳回
      } else if (type === 'bank-withdraw') {
        await hzWithdrawBankService.updateWithdrawBankStatus(id, 2, reason); // 2: 已驳回
      }
      toast.success('操作成功');
      loadData();
      loadStats();
    } catch (error) {
      toast.error('操作失败');
      console.error('Error rejecting:', error);
    }
  };

  const handleDelete = async (id: number, type: 'recharge' | 'withdraw' | 'bank-withdraw') => {
    if (!confirm('确定要删除此记录吗？')) return;
    try {
      if (type === 'recharge') {
        await hzRechargeService.deleteRecharge(id);
      } else if (type === 'withdraw') {
        await hzWithdrawService.deleteWithdraw(id);
      } else if (type === 'bank-withdraw') {
        await hzWithdrawBankService.deleteWithdrawBank(id);
      }
      toast.success('删除成功');
      loadData();
      loadStats();
    } catch (error) {
      toast.error('删除失败');
      console.error('Error deleting record:', error);
    }
  };

  const getStateBadge = (state: number, type: 'recharge' | 'withdraw' | 'bank-withdraw') => {
    if (type === 'recharge') {
      switch (state) {
        case 0: return <span className="px-2 py-1 text-xs rounded bg-yellow-500/10 text-yellow-400">待处理</span>;
        case 1: return <span className="px-2 py-1 text-xs rounded bg-blue-500/10 text-blue-400">处理中</span>;
        case 2: return <span className="px-2 py-1 text-xs rounded bg-[#A3F030]/10 text-[#A3F030]">已完成</span>;
        default: return <span className="px-2 py-1 text-xs rounded bg-gray-500/10 text-gray-400">未知</span>;
      }
    } else {
      switch (state) {
        case 0: return <span className="px-2 py-1 text-xs rounded bg-yellow-500/10 text-yellow-400">待处理</span>;
        case 1: return <span className="px-2 py-1 text-xs rounded bg-[#A3F030]/10 text-[#A3F030]">已完成</span>;
        case 2: return <span className="px-2 py-1 text-xs rounded bg-red-500/10 text-red-400">已驳回</span>;
        default: return <span className="px-2 py-1 text-xs rounded bg-gray-500/10 text-gray-400">未知</span>;
      }
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white">资金管理</h1>
        <p className="text-gray-400 mt-1">管理用户充值和提现记录</p>
      </div>

      {/* 统计卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-6 shadow-lg shadow-black/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">充值记录</p>
              <p className="text-2xl font-bold text-white mt-2">
                总金额: <span className="text-[#A3F030]">${stats.rechargeTotal.toFixed(2)}</span>
              </p>
              <p className="text-sm text-yellow-400 mt-1">
                待处理: {stats.rechargePending} 笔
              </p>
            </div>
            <ArrowDownCircle className="w-12 h-12 text-[#A3F030]" />
          </div>
        </div>

        <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-6 shadow-lg shadow-black/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">提现记录 (加密货币)</p>
              <p className="text-2xl font-bold text-white mt-2">
                总金额: <span className="text-[#A3F030]">${stats.withdrawTotal.toFixed(2)}</span>
              </p>
              <p className="text-sm text-yellow-400 mt-1">
                待处理: {stats.withdrawPending} 笔
              </p>
            </div>
            <ArrowUpCircle className="w-12 h-12 text-red-400" />
          </div>
        </div>

        <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-6 shadow-lg shadow-black/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">银行卡提现</p>
              <p className="text-2xl font-bold text-white mt-2">
                总金额: <span className="text-[#A3F030]">${stats.bankWithdrawTotal.toFixed(2)}</span>
              </p>
              <p className="text-sm text-yellow-400 mt-1">
                待处理: {stats.bankWithdrawPending} 笔
              </p>
            </div>
            <CreditCard className="w-12 h-12 text-blue-400" />
          </div>
        </div>
      </div>

      {/* 标签页 */}
      <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
        <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-6 mb-6 shadow-lg shadow-black/20">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <TabsList className="grid w-full md:w-auto grid-cols-3 h-auto bg-slate-800 p-1 rounded-lg">
              <TabsTrigger value="recharge" className="data-[state=active]:bg-[#A3F030] data-[state=active]:text-black rounded-md px-4 py-2 text-sm font-medium text-gray-300 transition-colors">
                充值记录
              </TabsTrigger>
              <TabsTrigger value="withdraw" className="data-[state=active]:bg-[#A3F030] data-[state=active]:text-black rounded-md px-4 py-2 text-sm font-medium text-gray-300 transition-colors">
                提现记录 (加密货币)
              </TabsTrigger>
              <TabsTrigger value="bank-withdraw" className="data-[state=active]:bg-[#A3F030] data-[state=active]:text-black rounded-md px-4 py-2 text-sm font-medium text-gray-300 transition-colors">
                提现记录 (银行卡)
              </TabsTrigger>
            </TabsList>
            <div className="flex gap-4 w-full md:w-auto">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="搜索账号或币种..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#A3F030]/50"
                />
              </div>
              <select
                value={filterState}
                onChange={(e) => setFilterState(e.target.value)}
                className="bg-slate-800 border border-slate-700 text-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-[#A3F030]/50"
              >
                <option value="all">所有状态</option>
                <option value="0">待处理</option>
                <option value="1">已完成</option>
                {activeTab !== 'recharge' && <option value="2">已驳回</option>}
              </select>
            </div>
          </div>
        </div>

        {/* 充值记录 */}
        <TabsContent value="recharge" className="mt-6">
          <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl overflow-hidden shadow-lg shadow-black/20">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-800 bg-slate-800/50">
                    <th className="text-left px-6 py-4 text-gray-400 text-sm font-medium">ID</th>
                    <th className="text-left px-6 py-4 text-gray-400 text-sm font-medium">用户账号</th>
                    <th className="text-left px-6 py-4 text-gray-400 text-sm font-medium">币种</th>
                    <th className="text-right px-6 py-4 text-gray-400 text-sm font-medium">金额</th>
                    <th className="text-left px-6 py-4 text-gray-400 text-sm font-medium">状态</th>
                    <th className="text-left px-6 py-4 text-gray-400 text-sm font-medium">充值地址/TxID</th>
                    <th className="text-left px-6 py-4 text-gray-400 text-sm font-medium">申请时间</th>
                    <th className="text-left px-6 py-4 text-gray-400 text-sm font-medium">完成时间</th>
                    <th className="text-center px-6 py-4 text-gray-400 text-sm font-medium">操作</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {loading ? (
                    <tr>
                      <td colSpan={9} className="py-8 text-center text-gray-400">
                        加载中...
                      </td>
                    </tr>
                  ) : rechargeRecords.length === 0 ? (
                    <tr>
                      <td colSpan={9} className="py-8 text-center text-gray-400">
                        暂无充值记录
                      </td>
                    </tr>
                  ) : (
                    rechargeRecords.map((record) => (
                      <tr key={record.id} className="hover:bg-white/5 transition-colors">
                        <td className="px-6 py-4 text-gray-300 text-sm">{record.id}</td>
                        <td className="px-6 py-4 text-white font-medium">{record.account}</td>
                        <td className="px-6 py-4 text-gray-300 text-sm">{record.coinname}</td>
                        <td className="px-6 py-4 text-right text-white font-medium">{Number(record.num).toFixed(2)}</td>
                        <td className="px-6 py-4">
                          {getStateBadge(record.state, 'recharge')}
                        </td>
                        <td className="px-6 py-4 text-gray-300 text-sm">
                          {record.txid ? (
                            <a href={`#`} className="text-[#A3F030] hover:underline" target="_blank" rel="noopener noreferrer">
                              {record.txid.substring(0, 6)}...{record.txid.substring(record.txid.length - 4)}
                            </a>
                          ) : record.address ? (
                            <span className="text-gray-400">{record.address.substring(0, 6)}...{record.address.substring(record.address.length - 4)}</span>
                          ) : 'N/A'}
                        </td>
                        <td className="px-6 py-4 text-gray-300 text-sm">{new Date(record.addtime).toLocaleString('zh-CN')}</td>
                        <td className="px-6 py-4 text-gray-300 text-sm">{record.finishtime ? new Date(record.finishtime).toLocaleString('zh-CN') : 'N/A'}</td>
                        <td className="px-6 py-4 text-center">
                          <div className="flex items-center justify-center gap-2">
                            {record.state === 0 && (
                              <>
                                <button
                                  onClick={() => handleApprove(record.id, 'recharge')}
                                  className="p-2 text-gray-400 hover:text-[#A3F030] transition-colors"
                                  title="通过"
                                >
                                  <CheckCircle2 className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => handleReject(record.id, 'recharge')}
                                  className="p-2 text-gray-400 hover:text-red-400 transition-colors"
                                  title="驳回"
                                >
                                  <XCircle className="w-4 h-4" />
                                </button>
                              </>
                            )}
                            <button
                              onClick={() => handleDelete(record.id, 'recharge')}
                              className="p-2 text-gray-400 hover:text-red-400 transition-colors"
                              title="删除"
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

        {/* 提现记录 */}
        <TabsContent value="withdraw" className="mt-6">
          <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl overflow-hidden shadow-lg shadow-black/20">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-800 bg-slate-800/50">
                    <th className="text-left px-6 py-4 text-gray-400 text-sm font-medium">ID</th>
                    <th className="text-left px-6 py-4 text-gray-400 text-sm font-medium">用户账号</th>
                    <th className="text-left px-6 py-4 text-gray-400 text-sm font-medium">币种</th>
                    <th className="text-right px-6 py-4 text-gray-400 text-sm font-medium">金额</th>
                    <th className="text-right px-6 py-4 text-gray-400 text-sm font-medium">手续费</th>
                    <th className="text-left px-6 py-4 text-gray-400 text-sm font-medium">状态</th>
                    <th className="text-left px-6 py-4 text-gray-400 text-sm font-medium">提现地址/TxID</th>
                    <th className="text-left px-6 py-4 text-gray-400 text-sm font-medium">申请时间</th>
                    <th className="text-left px-6 py-4 text-gray-400 text-sm font-medium">完成时间</th>
                    <th className="text-center px-6 py-4 text-gray-400 text-sm font-medium">操作</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {loading ? (
                    <tr>
                      <td colSpan={10} className="py-8 text-center text-gray-400">
                        加载中...
                      </td>
                    </tr>
                  ) : withdrawRecords.length === 0 ? (
                    <tr>
                      <td colSpan={10} className="py-8 text-center text-gray-400">
                        暂无提现记录
                      </td>
                    </tr>
                  ) : (
                    withdrawRecords.map((record) => (
                      <tr key={record.id} className="hover:bg-white/5 transition-colors">
                        <td className="px-6 py-4 text-gray-300 text-sm">{record.id}</td>
                        <td className="px-6 py-4 text-white font-medium">{record.account}</td>
                        <td className="px-6 py-4 text-gray-300 text-sm">{record.coinname}</td>
                        <td className="px-6 py-4 text-right text-white font-medium">{Number(record.num).toFixed(2)}</td>
                        <td className="px-6 py-4 text-right text-gray-300 text-sm">{Number(record.fee || 0).toFixed(2)}</td>
                        <td className="px-6 py-4">
                          {getStateBadge(record.state, 'withdraw')}
                        </td>
                        <td className="px-6 py-4 text-gray-300 text-sm">
                          {record.txid ? (
                            <a href={`#`} className="text-[#A3F030] hover:underline" target="_blank" rel="noopener noreferrer">
                              {record.txid.substring(0, 6)}...{record.txid.substring(record.txid.length - 4)}
                            </a>
                          ) : record.address ? (
                            <span className="text-gray-400">{record.address.substring(0, 6)}...{record.address.substring(record.address.length - 4)}</span>
                          ) : 'N/A'}
                        </td>
                        <td className="px-6 py-4 text-gray-300 text-sm">{new Date(record.addtime).toLocaleString('zh-CN')}</td>
                        <td className="px-6 py-4 text-gray-300 text-sm">{record.finishtime ? new Date(record.finishtime).toLocaleString('zh-CN') : 'N/A'}</td>
                        <td className="px-6 py-4 text-center">
                          <div className="flex items-center justify-center gap-2">
                            {record.state === 0 && (
                              <>
                                <button
                                  onClick={() => handleApprove(record.id, 'withdraw')}
                                  className="p-2 text-gray-400 hover:text-[#A3F030] transition-colors"
                                  title="通过"
                                >
                                  <CheckCircle2 className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => handleReject(record.id, 'withdraw')}
                                  className="p-2 text-gray-400 hover:text-red-400 transition-colors"
                                  title="驳回"
                                >
                                  <XCircle className="w-4 h-4" />
                                </button>
                              </>
                            )}
                            <button
                              onClick={() => handleDelete(record.id, 'withdraw')}
                              className="p-2 text-gray-400 hover:text-red-400 transition-colors"
                              title="删除"
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

        {/* 银行卡提现 */}
        <TabsContent value="bank-withdraw" className="mt-6">
          <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl overflow-hidden shadow-lg shadow-black/20">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-800 bg-slate-800/50">
                    <th className="text-left px-6 py-4 text-gray-400 text-sm font-medium">ID</th>
                    <th className="text-left px-6 py-4 text-gray-400 text-sm font-medium">用户账号</th>
                    <th className="text-left px-6 py-4 text-gray-400 text-sm font-medium">币种</th>
                    <th className="text-right px-6 py-4 text-gray-400 text-sm font-medium">金额</th>
                    <th className="text-left px-6 py-4 text-gray-400 text-sm font-medium">银行名称</th>
                    <th className="text-left px-6 py-4 text-gray-400 text-sm font-medium">银行卡号</th>
                    <th className="text-left px-6 py-4 text-gray-400 text-sm font-medium">持卡人姓名</th>
                    <th className="text-left px-6 py-4 text-gray-400 text-sm font-medium">状态</th>
                    <th className="text-left px-6 py-4 text-gray-400 text-sm font-medium">申请时间</th>
                    <th className="text-left px-6 py-4 text-gray-400 text-sm font-medium">完成时间</th>
                    <th className="text-center px-6 py-4 text-gray-400 text-sm font-medium">操作</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {loading ? (
                    <tr>
                      <td colSpan={11} className="py-8 text-center text-gray-400">
                        加载中...
                      </td>
                    </tr>
                  ) : bankWithdrawRecords.length === 0 ? (
                    <tr>
                      <td colSpan={11} className="py-8 text-center text-gray-400">
                        暂无银行卡提现记录
                      </td>
                    </tr>
                  ) : (
                    bankWithdrawRecords.map((record) => (
                      <tr key={record.id} className="hover:bg-white/5 transition-colors">
                        <td className="px-6 py-4 text-gray-300 text-sm">{record.id}</td>
                        <td className="px-6 py-4 text-white font-medium">{record.account}</td>
                        <td className="px-6 py-4 text-gray-300 text-sm">{record.coinname}</td>
                        <td className="px-6 py-4 text-right text-white font-medium">{Number(record.num).toFixed(2)}</td>
                        <td className="px-6 py-4 text-gray-300 text-sm">{record.bankname || 'N/A'}</td>
                        <td className="px-6 py-4 text-gray-300 text-sm">{record.bankaccount || 'N/A'}</td>
                        <td className="px-6 py-4 text-gray-300 text-sm">{record.realname || 'N/A'}</td>
                        <td className="px-6 py-4">
                          {getStateBadge(record.state, 'bank-withdraw')}
                        </td>
                        <td className="px-6 py-4 text-gray-300 text-sm">{new Date(record.addtime).toLocaleString('zh-CN')}</td>
                        <td className="px-6 py-4 text-gray-300 text-sm">{record.finishtime ? new Date(record.finishtime).toLocaleString('zh-CN') : 'N/A'}</td>
                        <td className="px-6 py-4 text-center">
                          <div className="flex items-center justify-center gap-2">
                            {record.state === 0 && (
                              <>
                                <button
                                  onClick={() => handleApprove(record.id, 'bank-withdraw')}
                                  className="p-2 text-gray-400 hover:text-[#A3F030] transition-colors"
                                  title="通过"
                                >
                                  <CheckCircle2 className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => handleReject(record.id, 'bank-withdraw')}
                                  className="p-2 text-gray-400 hover:text-red-400 transition-colors"
                                  title="驳回"
                                >
                                  <XCircle className="w-4 h-4" />
                                </button>
                              </>
                            )}
                            <button
                              onClick={() => handleDelete(record.id, 'bank-withdraw')}
                              className="p-2 text-gray-400 hover:text-red-400 transition-colors"
                              title="删除"
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
