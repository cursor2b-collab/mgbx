import { useState, useEffect } from 'react';
import { 
  Coins, 
  Plus, 
  Edit, 
  Trash2,
  Search,
  Download,
  X,
  Upload,
  Image as ImageIcon,
  QrCode
} from 'lucide-react';
import { toast } from 'sonner';
import { hzCoinsCogsService, type HzCoinsCogs } from '../../services/hzDatabase';
import { supabase } from '../../utils/supabase/client';

interface CoinFormData {
  coinname: string;
  coinfullname: string;
  coinlogo: string;
  online: string;
  address: string;
  addressqr: string;
  in_state: number;
  out_state: number;
  state: number;
  tx_num: number;
  sort: number;
}

export function CoinsManagement() {
  const [coinsList, setCoinsList] = useState<HzCoinsCogs[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingCoin, setEditingCoin] = useState<HzCoinsCogs | null>(null);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [formData, setFormData] = useState<CoinFormData>({
    coinname: '',
    coinfullname: '',
    coinlogo: '',
    online: '',
    address: '',
    addressqr: '',
    in_state: 1,
    out_state: 1,
    state: 1,
    tx_num: 0,
    sort: 0
  });
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [uploadingQr, setUploadingQr] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const coins = await hzCoinsCogsService.getAllCoins(
        searchTerm ? { search: searchTerm } : undefined
      );
      setCoinsList(coins);
    } catch (error) {
      console.error('加载币种数据失败:', error);
      toast.error('加载数据失败');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    loadData();
  };

  const handleOpenModal = (coin?: HzCoinsCogs) => {
    if (coin) {
      setEditingCoin(coin);
      setFormData({
        coinname: coin.coinname || '',
        coinfullname: coin.coinfullname || '',
        coinlogo: coin.coinlogo || '',
        online: coin.online || '',
        address: coin.address || '',
        addressqr: coin.addressqr || '',
        in_state: coin.in_state ?? 1,
        out_state: coin.out_state ?? 1,
        state: coin.state ?? 1,
        tx_num: coin.tx_num ?? 0,
        sort: coin.sort ?? 0
      });
    } else {
      setEditingCoin(null);
      setFormData({
        coinname: '',
        coinfullname: '',
        coinlogo: '',
        online: '',
        address: '',
        addressqr: '',
        in_state: 1,
        out_state: 1,
        state: 1,
        tx_num: 0,
        sort: 0
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingCoin(null);
  };

  const uploadImage = async (file: File, type: 'logo' | 'qr'): Promise<string> => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${type}_${Date.now()}.${fileExt}`;
    const filePath = `coins/${fileName}`;

    try {
      const { error: uploadError } = await supabase.storage
        .from('public')
        .upload(filePath, file);

      if (uploadError) {
        // 如果 public bucket 不存在，尝试使用 URL 直接存储
        console.warn('上传到 storage 失败，使用 base64:', uploadError);
        return new Promise((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => {
            resolve(reader.result as string);
          };
          reader.readAsDataURL(file);
        });
      }

      const { data } = supabase.storage.from('public').getPublicUrl(filePath);
      return data.publicUrl;
    } catch (error) {
      console.error('上传图片失败:', error);
      // 如果上传失败，使用 base64
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          resolve(reader.result as string);
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('请上传图片文件');
      return;
    }

    setUploadingLogo(true);
    try {
      const url = await uploadImage(file, 'logo');
      setFormData({ ...formData, coinlogo: url });
      toast.success('LOGO 上传成功');
    } catch (error) {
      console.error('上传 LOGO 失败:', error);
      toast.error('上传失败');
    } finally {
      setUploadingLogo(false);
    }
  };

  const handleQrUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('请上传图片文件');
      return;
    }

    setUploadingQr(true);
    try {
      const url = await uploadImage(file, 'qr');
      setFormData({ ...formData, addressqr: url });
      toast.success('二维码上传成功');
    } catch (error) {
      console.error('上传二维码失败:', error);
      toast.error('上传失败');
    } finally {
      setUploadingQr(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.coinname.trim()) {
      toast.error('请输入币种名称');
      return;
    }

    try {
      if (editingCoin) {
        await hzCoinsCogsService.updateCoin(editingCoin.id, formData);
        toast.success('更新成功');
      } else {
        await hzCoinsCogsService.createCoin(formData);
        toast.success('创建成功');
      }
      handleCloseModal();
      loadData();
    } catch (error: any) {
      console.error('保存币种失败:', error);
      toast.error(error.message || '保存失败');
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('确定要删除这个币种吗？')) return;
    try {
      await hzCoinsCogsService.deleteCoin(id);
      toast.success('删除成功');
      loadData();
    } catch (error) {
      console.error('删除币种失败:', error);
      toast.error('删除失败');
    }
  };

  const handleBatchDelete = async () => {
    if (selectedIds.length === 0) {
      toast.error('请选择要删除的币种');
      return;
    }
    if (!confirm(`确定要删除选中的 ${selectedIds.length} 个币种吗？`)) return;
    
    try {
      await Promise.all(selectedIds.map(id => hzCoinsCogsService.deleteCoin(id)));
      toast.success('批量删除成功');
      setSelectedIds([]);
      loadData();
    } catch (error) {
      console.error('批量删除失败:', error);
      toast.error('批量删除失败');
    }
  };

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedIds(coinsList.map(coin => coin.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectOne = (id: number) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter(i => i !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const filteredCoins = coinsList.filter(coin =>
    !searchTerm || 
    coin.coinname?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    coin.coinfullname?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">平台币种</h1>
          <p className="text-gray-400 mt-1">管理平台支持的加密货币币种</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={handleBatchDelete}
            disabled={selectedIds.length === 0}
            className="px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            <Trash2 className="w-4 h-4" />
            批量删除
          </button>
          <button
            onClick={() => handleOpenModal()}
            className="px-4 py-2 bg-[#A3F030] text-black rounded-lg font-medium hover:bg-[#A3F030]/90 flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            新增
          </button>
        </div>
      </div>

      <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-6 shadow-lg shadow-black/20">
        <div className="flex gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="币名称 请输入币种别名"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              className="w-full pl-10 pr-4 py-2 bg-white/5 backdrop-blur-md border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-[#A3F030] focus:bg-white/10"
            />
          </div>
          <button
            onClick={handleSearch}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 flex items-center gap-2"
          >
            <Search className="w-4 h-4" />
            查询
          </button>
          <button
            onClick={loadData}
            className="px-4 py-2 bg-[#A3F030] text-black rounded-lg font-medium hover:bg-[#A3F030]/90"
          >
            初始化
          </button>
          <button className="px-4 py-2 bg-slate-700 text-white rounded-lg font-medium hover:bg-slate-600 flex items-center gap-2">
            <Download className="w-4 h-4" />
            导出
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-800">
                <th className="text-left text-gray-400 text-sm font-medium pb-3 w-12">
                  <input
                    type="checkbox"
                    checked={selectedIds.length === coinsList.length && coinsList.length > 0}
                    onChange={handleSelectAll}
                    className="rounded"
                  />
                </th>
                <th className="text-left text-gray-400 text-sm font-medium pb-3">ID</th>
                <th className="text-left text-gray-400 text-sm font-medium pb-3">币种(别名)</th>
                <th className="text-left text-gray-400 text-sm font-medium pb-3">币种(全名)</th>
                <th className="text-left text-gray-400 text-sm font-medium pb-3">LOGO图片</th>
                <th className="text-left text-gray-400 text-sm font-medium pb-3">充值网络</th>
                <th className="text-left text-gray-400 text-sm font-medium pb-3">充值地址</th>
                <th className="text-left text-gray-400 text-sm font-medium pb-3">收款码</th>
                <th className="text-left text-gray-400 text-sm font-medium pb-3">充值/提现</th>
                <th className="text-left text-gray-400 text-sm font-medium pb-3">提现手续费</th>
                <th className="text-left text-gray-400 text-sm font-medium pb-3">显示</th>
                <th className="text-right text-gray-400 text-sm font-medium pb-3">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {loading ? (
                <tr>
                  <td colSpan={12} className="py-8 text-center text-gray-400">
                    加载中...
                  </td>
                </tr>
              ) : filteredCoins.length === 0 ? (
                <tr>
                  <td colSpan={12} className="py-8 text-center text-gray-400">
                    暂无数据
                  </td>
                </tr>
              ) : (
                filteredCoins.map((coin) => (
                  <tr key={coin.id} className="hover:bg-white/5 transition-colors">
                    <td className="py-3">
                      <input
                        type="checkbox"
                        checked={selectedIds.includes(coin.id)}
                        onChange={() => handleSelectOne(coin.id)}
                        className="rounded"
                      />
                    </td>
                    <td className="py-3 text-gray-300 text-sm">{coin.id}</td>
                    <td className="py-3 text-white text-sm font-medium">{coin.coinname}</td>
                    <td className="py-3 text-gray-300 text-sm">{coin.coinfullname || '-'}</td>
                    <td className="py-3">
                      {coin.coinlogo ? (
                        <img src={coin.coinlogo} alt={coin.coinname} className="w-10 h-10 rounded-full object-cover" />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center">
                          <Coins className="w-5 h-5 text-gray-400" />
                        </div>
                      )}
                    </td>
                    <td className="py-3 text-gray-300 text-sm">{coin.online || '-'}</td>
                    <td className="py-3 text-gray-300 text-sm font-mono text-xs max-w-xs truncate">
                      {coin.address || '-'}
                    </td>
                    <td className="py-3">
                      {coin.addressqr ? (
                        <img src={coin.addressqr} alt="QR Code" className="w-10 h-10 object-cover rounded" />
                      ) : (
                        <QrCode className="w-5 h-5 text-gray-400" />
                      )}
                    </td>
                    <td className="py-3 text-gray-300 text-sm">
                      <span className={`px-2 py-1 text-xs rounded ${
                        coin.in_state === 1 ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                      }`}>
                        {coin.in_state === 1 ? '开启' : '关闭'}
                      </span>
                      {' / '}
                      <span className={`px-2 py-1 text-xs rounded ${
                        coin.out_state === 1 ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                      }`}>
                        {coin.out_state === 1 ? '开启' : '关闭'}
                      </span>
                    </td>
                    <td className="py-3 text-gray-300 text-sm">{coin.tx_num || 0}</td>
                    <td className="py-3">
                      <span className={`px-2 py-1 text-xs rounded ${
                        coin.state === 1 
                          ? 'bg-[#A3F030]/10 text-[#A3F030]' 
                          : 'bg-gray-500/10 text-gray-400'
                      }`}>
                        {coin.state === 1 ? '显示' : '隐藏'}
                      </span>
                    </td>
                    <td className="py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleOpenModal(coin)}
                          className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                        >
                          编辑
                        </button>
                        <button
                          onClick={() => handleDelete(coin.id)}
                          className="px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                        >
                          删除
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="mt-4 flex items-center justify-between text-sm text-gray-400">
          <span>共计: {filteredCoins.length}条数据</span>
        </div>
      </div>

      {/* 新增/编辑模态框 */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl shadow-black/50">
            <div className="sticky top-0 bg-white/10 backdrop-blur-xl border-b border-white/20 px-6 py-4 flex items-center justify-between">
              <h2 className="text-xl font-bold text-white">
                {editingCoin ? '编辑平台币种' : '新增平台币种'}
              </h2>
              <button
                onClick={handleCloseModal}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  币名称(别名) <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  value={formData.coinname}
                  onChange={(e) => setFormData({ ...formData, coinname: e.target.value })}
                  placeholder="请输入币名称(别名)"
                  required
                  className="w-full px-4 py-2 bg-white/5 backdrop-blur-md border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-[#A3F030] focus:bg-white/10"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  币名称(全名)
                </label>
                <input
                  type="text"
                  value={formData.coinfullname}
                  onChange={(e) => setFormData({ ...formData, coinfullname: e.target.value })}
                  placeholder="请输入币名称(全名)"
                  className="w-full px-4 py-2 bg-white/5 backdrop-blur-md border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-[#A3F030] focus:bg-white/10"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  币图标(LOGO)
                </label>
                <div className="flex items-center gap-4">
                  {formData.coinlogo && (
                    <img src={formData.coinlogo} alt="Logo" className="w-16 h-16 rounded-full object-cover" />
                  )}
                  <label className="px-4 py-2 bg-white/5 backdrop-blur-md border border-white/10 rounded-lg text-white cursor-pointer hover:bg-white/10 transition-colors flex items-center gap-2">
                    <Upload className="w-4 h-4" />
                    {uploadingLogo ? '上传中...' : '点击上传'}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleLogoUpload}
                      className="hidden"
                      disabled={uploadingLogo}
                    />
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  充币网络
                </label>
                <input
                  type="text"
                  value={formData.online}
                  onChange={(e) => setFormData({ ...formData, online: e.target.value })}
                  placeholder="请输入充币网络"
                  className="w-full px-4 py-2 bg-white/5 backdrop-blur-md border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-[#A3F030] focus:bg-white/10"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  充值地址
                </label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder="请输入充值地址"
                  className="w-full px-4 py-2 bg-white/5 backdrop-blur-md border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-[#A3F030] focus:bg-white/10"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  充值地址二维码
                </label>
                <div className="flex items-center gap-4">
                  {formData.addressqr && (
                    <img src={formData.addressqr} alt="QR Code" className="w-16 h-16 object-cover rounded" />
                  )}
                  <label className="px-4 py-2 bg-white/5 backdrop-blur-md border border-white/10 rounded-lg text-white cursor-pointer hover:bg-white/10 transition-colors flex items-center gap-2">
                    <Upload className="w-4 h-4" />
                    {uploadingQr ? '上传中...' : '点击上传'}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleQrUpload}
                      className="hidden"
                      disabled={uploadingQr}
                    />
                  </label>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    充值开关
                  </label>
                  <select
                    value={formData.in_state}
                    onChange={(e) => setFormData({ ...formData, in_state: Number(e.target.value) })}
                    className="w-full px-4 py-2 bg-white/5 backdrop-blur-md border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#A3F030] focus:bg-white/10"
                  >
                    <option value={1}>开启</option>
                    <option value={0}>关闭</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    提现开关
                  </label>
                  <select
                    value={formData.out_state}
                    onChange={(e) => setFormData({ ...formData, out_state: Number(e.target.value) })}
                    className="w-full px-4 py-2 bg-white/5 backdrop-blur-md border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#A3F030] focus:bg-white/10"
                  >
                    <option value={1}>开启</option>
                    <option value={0}>关闭</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  显示状态
                </label>
                <select
                  value={formData.state}
                  onChange={(e) => setFormData({ ...formData, state: Number(e.target.value) })}
                  className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-[#A3F030]"
                >
                  <option value={1}>显示</option>
                  <option value={0}>隐藏</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  提现手续费(固定值)
                </label>
                <input
                  type="number"
                  step="0.0001"
                  value={formData.tx_num}
                  onChange={(e) => setFormData({ ...formData, tx_num: Number(e.target.value) })}
                  placeholder="请输入提现手续费(固定值)"
                  className="w-full px-4 py-2 bg-white/5 backdrop-blur-md border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-[#A3F030] focus:bg-white/10"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  排序
                </label>
                <input
                  type="number"
                  value={formData.sort}
                  onChange={(e) => setFormData({ ...formData, sort: Number(e.target.value) })}
                  placeholder="请输入排序序号"
                  className="w-full px-4 py-2 bg-white/5 backdrop-blur-md border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-[#A3F030] focus:bg-white/10"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="px-6 py-2 bg-white/10 backdrop-blur-md text-white rounded-lg hover:bg-white/20 transition-colors border border-white/10"
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                >
                  提交
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
