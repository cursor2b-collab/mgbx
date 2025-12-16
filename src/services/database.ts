import { supabase } from '../utils/supabase/client';

// 资产相关接口
export interface Asset {
  id: string;
  user_id: string;
  symbol: string;
  name: string;
  icon?: string;
  balance: number;
  available_balance: number;
  frozen_balance: number;
  usd_value: number;
  price: number;
  change_24h: number;
  avg_buy_price?: number;
  profit: number;
  profit_percent: number;
  created_at: string;
  updated_at: string;
}

export interface Transaction {
  id: string;
  user_id: string;
  type: 'deposit' | 'withdraw' | 'buy' | 'sell' | 'transfer';
  asset: string;
  amount: number;
  status: 'completed' | 'pending' | 'failed';
  tx_hash?: string;
  created_at: string;
  updated_at: string;
}

export interface Order {
  id: string;
  user_id: string;
  pair: string;
  side: 'buy' | 'sell';
  type: 'limit' | 'market' | 'stop';
  amount: number;
  price?: number;
  filled_amount: number;
  status: 'pending' | 'filled' | 'partially_filled' | 'cancelled' | 'failed';
  fee: number;
  fee_asset: string;
  created_at: string;
  updated_at: string;
}

export interface Trade {
  id: string;
  user_id: string;
  order_id?: string;
  pair: string;
  side: 'buy' | 'sell';
  amount: number;
  price: number;
  total: number;
  fee: number;
  fee_asset: string;
  status: 'completed' | 'pending' | 'failed' | 'cancelled';
  created_at: string;
}

export interface Deposit {
  id: string;
  user_id: string;
  asset: string;
  network: string;
  amount: number;
  status: 'pending' | 'confirming' | 'completed' | 'failed';
  tx_hash?: string;
  address?: string;
  confirmations: number;
  required_confirmations: number;
  created_at: string;
  updated_at: string;
}

export interface Withdraw {
  id: string;
  user_id: string;
  asset: string;
  network: string;
  amount: number;
  fee: number;
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled';
  tx_hash?: string;
  address: string;
  confirmations: number;
  required_confirmations: number;
  created_at: string;
  updated_at: string;
}

// 资产服务
export const assetService = {
  // 获取用户所有资产
  async getUserAssets(userId: string): Promise<Asset[]> {
    const { data, error } = await supabase
      .from('user_assets')
      .select('*')
      .eq('user_id', userId)
      .order('usd_value', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  // 获取单个资产
  async getAsset(userId: string, symbol: string): Promise<Asset | null> {
    const { data, error } = await supabase
      .from('user_assets')
      .select('*')
      .eq('user_id', userId)
      .eq('symbol', symbol)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null;
      throw error;
    }
    return data;
  },

  // 更新资产
  async updateAsset(
    userId: string,
    symbol: string,
    updates: Partial<Asset>
  ): Promise<Asset> {
    const { data, error } = await supabase
      .from('user_assets')
      .update(updates)
      .eq('user_id', userId)
      .eq('symbol', symbol)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // 初始化用户资产
  async initializeAssets(userId: string): Promise<any> {
    try {
      const { data, error } = await supabase.rpc('initialize_user_assets', {
        p_user_id: userId,
      });

      if (error) {
        console.error('RPC Error:', error);
        throw error;
      }
      return data;
    } catch (error) {
      console.error('初始化资产失败:', error);
      // 如果 RPC 失败，手动创建默认资产
      const defaultAssets = [
        { symbol: 'USDT', name: 'Tether', balance: 10000, available_balance: 10000, frozen_balance: 0, price: 1, icon: 'https://assets.coingecko.com/coins/images/325/small/Tether.png' },
        { symbol: 'BTC', name: 'Bitcoin', balance: 0, available_balance: 0, frozen_balance: 0, price: 87000, icon: 'https://assets.coingecko.com/coins/images/1/small/bitcoin.png' },
        { symbol: 'ETH', name: 'Ethereum', balance: 0, available_balance: 0, frozen_balance: 0, price: 3300, icon: 'https://assets.coingecko.com/coins/images/279/small/ethereum.png' },
      ];

      const assets = [];
      for (const asset of defaultAssets) {
        const { data, error } = await supabase
          .from('user_assets')
          .insert({
            user_id: userId,
            symbol: asset.symbol,
            name: asset.name,
            balance: asset.balance,
            available_balance: asset.available_balance,
            frozen_balance: asset.frozen_balance,
            price: asset.price,
            usd_value: asset.balance * asset.price,
            icon: asset.icon,
          })
          .select()
          .single();

        if (!error && data) {
          assets.push(data);
        }
      }

      // 创建初始交易记录
      await transactionService.createTransaction(userId, {
        type: 'deposit',
        asset: 'USDT',
        amount: 10000,
        status: 'completed',
      });

      return { assets, transactions: [] };
    }
  },
};

// 交易记录服务
export const transactionService = {
  // 获取用户交易记录
  async getUserTransactions(
    userId: string,
    limit: number = 50
  ): Promise<Transaction[]> {
    const { data, error } = await supabase
      .from('transactions')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data || [];
  },

  // 创建交易记录
  async createTransaction(
    userId: string,
    transaction: Omit<Transaction, 'id' | 'user_id' | 'created_at' | 'updated_at'>
  ): Promise<Transaction> {
    const { data, error } = await supabase
      .from('transactions')
      .insert({
        ...transaction,
        user_id: userId,
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },
};

// 订单服务
export const orderService = {
  // 获取用户订单
  async getUserOrders(userId: string, limit: number = 50): Promise<Order[]> {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data || [];
  },

  // 创建订单
  async createOrder(
    userId: string,
    order: Omit<Order, 'id' | 'user_id' | 'created_at' | 'updated_at' | 'filled_amount'>
  ): Promise<Order> {
    const { data, error } = await supabase
      .from('orders')
      .insert({
        ...order,
        user_id: userId,
        filled_amount: 0,
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // 更新订单
  async updateOrder(
    orderId: string,
    updates: Partial<Order>
  ): Promise<Order> {
    const { data, error } = await supabase
      .from('orders')
      .update(updates)
      .eq('id', orderId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },
};

// 交易服务
export const tradeService = {
  // 获取用户交易
  async getUserTrades(userId: string, limit: number = 50): Promise<Trade[]> {
    const { data, error } = await supabase
      .from('trades')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data || [];
  },

  // 创建交易
  async createTrade(
    userId: string,
    trade: Omit<Trade, 'id' | 'user_id' | 'created_at'>
  ): Promise<Trade> {
    const { data, error } = await supabase
      .from('trades')
      .insert({
        ...trade,
        user_id: userId,
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },
};

// 充值服务
export const depositService = {
  // 获取用户充值记录
  async getUserDeposits(userId: string): Promise<Deposit[]> {
    const { data, error } = await supabase
      .from('deposits')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  // 创建充值记录
  async createDeposit(
    userId: string,
    deposit: Omit<Deposit, 'id' | 'user_id' | 'created_at' | 'updated_at' | 'confirmations'>
  ): Promise<Deposit> {
    const { data, error } = await supabase
      .from('deposits')
      .insert({
        ...deposit,
        user_id: userId,
        confirmations: 0,
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },
};

// 提现服务
export const withdrawService = {
  // 获取用户提现记录
  async getUserWithdraws(userId: string): Promise<Withdraw[]> {
    const { data, error } = await supabase
      .from('withdraws')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  // 创建提现记录
  async createWithdraw(
    userId: string,
    withdraw: Omit<Withdraw, 'id' | 'user_id' | 'created_at' | 'updated_at' | 'confirmations'>
  ): Promise<Withdraw> {
    const { data, error } = await supabase
      .from('withdraws')
      .insert({
        ...withdraw,
        user_id: userId,
        confirmations: 0,
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // 更新提现状态（管理员用）
  async updateWithdrawStatus(
    withdrawId: string,
    status: Withdraw['status'],
    txHash?: string
  ): Promise<Withdraw> {
    const { data, error } = await supabase
      .from('withdraws')
      .update({
        status,
        tx_hash: txHash || null,
        updated_at: new Date().toISOString(),
      })
      .eq('id', withdrawId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },
};

// KYC 申请服务
export interface KYCApplication {
  id: string;
  user_id: string;
  email: string;
  full_name: string;
  id_type: 'passport' | 'id_card' | 'driver_license';
  id_number: string;
  country: string;
  status: 'pending' | 'approved' | 'rejected' | 'review';
  documents?: any;
  notes?: string;
  submitted_at: string;
  reviewed_at?: string;
  reviewed_by?: string;
}

export const kycService = {
  // 获取所有 KYC 申请
  async getAllApplications(): Promise<KYCApplication[]> {
    const { data, error } = await supabase
      .from('kyc_applications')
      .select('*')
      .order('submitted_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  // 获取用户 KYC 申请
  async getUserApplication(userId: string): Promise<KYCApplication | null> {
    const { data, error } = await supabase
      .from('kyc_applications')
      .select('*')
      .eq('user_id', userId)
      .order('submitted_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error) throw error;
    return data;
  },

  // 创建 KYC 申请
  async createApplication(
    userId: string,
    application: Omit<KYCApplication, 'id' | 'user_id' | 'submitted_at' | 'status'>
  ): Promise<KYCApplication> {
    const { data, error } = await supabase
      .from('kyc_applications')
      .insert({
        ...application,
        user_id: userId,
        status: 'pending',
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // 更新 KYC 申请状态
  async updateApplicationStatus(
    applicationId: string,
    status: 'approved' | 'rejected' | 'review',
    reviewedBy: string,
    notes?: string
  ): Promise<KYCApplication> {
    const { data, error } = await supabase
      .from('kyc_applications')
      .update({
        status,
        reviewed_at: new Date().toISOString(),
        reviewed_by: reviewedBy,
        notes: notes || null,
      })
      .eq('id', applicationId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },
};

// 管理员服务
export interface AdminUser {
  id: string;
  user_id: string;
  role: string;
  permissions: any;
  created_at: string;
  updated_at: string;
}

export const adminService = {
  // 检查用户是否是管理员
  async isAdmin(userId: string): Promise<boolean> {
    const { data, error } = await supabase
      .from('admin_users')
      .select('id')
      .eq('user_id', userId)
      .maybeSingle();

    if (error) {
      console.error('检查管理员权限失败:', error);
      return false;
    }
    return !!data;
  },

  // 获取所有管理员
  async getAllAdmins(): Promise<AdminUser[]> {
    const { data, error } = await supabase
      .from('admin_users')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },
};

// 统计服务
export const statsService = {
  // 获取总用户数（通过 user_assets 表统计唯一用户）
  async getTotalUsers(): Promise<number> {
    const { data, error } = await supabase
      .rpc('get_total_users_count');

    if (error) {
      // 如果 RPC 不存在，使用查询方式
      const { data: assets, error: assetsError } = await supabase
        .from('user_assets')
        .select('user_id');

      if (assetsError) return 0;
      const uniqueUsers = new Set(assets?.map(a => a.user_id) || []);
      return uniqueUsers.size;
    }
    return data || 0;
  },

  // 获取今日交易量
  async getTodayVolume(): Promise<number> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const { data, error } = await supabase
      .from('trades')
      .select('total')
      .eq('status', 'completed')
      .gte('created_at', today.toISOString());

    if (error) {
      console.error('获取今日交易量失败:', error);
      return 0;
    }
    return data?.reduce((sum, trade) => sum + Number(trade.total || 0), 0) || 0;
  },

  // 获取平台总资产
  async getTotalAssets(): Promise<number> {
    const { data, error } = await supabase
      .from('user_assets')
      .select('usd_value');

    if (error) {
      console.error('获取平台总资产失败:', error);
      return 0;
    }
    return data?.reduce((sum, asset) => sum + Number(asset.usd_value || 0), 0) || 0;
  },

  // 获取今日收益（手续费）
  async getTodayRevenue(): Promise<number> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const { data, error } = await supabase
      .from('trades')
      .select('fee')
      .eq('status', 'completed')
      .gte('created_at', today.toISOString());

    if (error) {
      console.error('获取今日收益失败:', error);
      return 0;
    }
    return data?.reduce((sum, trade) => sum + Number(trade.fee || 0), 0) || 0;
  },

  // 获取活跃用户数（最近30天有交易的用户）
  async getActiveUsers(): Promise<number> {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const { data, error } = await supabase
      .from('trades')
      .select('user_id')
      .gte('created_at', thirtyDaysAgo.toISOString());

    if (error) {
      console.error('获取活跃用户数失败:', error);
      return 0;
    }
    const uniqueUsers = new Set(data?.map(trade => trade.user_id) || []);
    return uniqueUsers.size;
  },

  // 获取所有用户列表（用于管理后台）
  async getAllUsers(limit: number = 100, offset: number = 0) {
    // 从 user_assets 获取唯一用户ID
    const { data: assets, error } = await supabase
      .from('user_assets')
      .select('user_id')
      .limit(limit * 10) // 获取更多以确保有足够的唯一用户
      .range(offset, offset + limit * 10 - 1);

    if (error) {
      console.error('获取用户列表失败:', error);
      return [];
    }

    // 获取唯一用户ID
    const uniqueUserIds = [...new Set(assets?.map(a => a.user_id) || [])].slice(0, limit);
    
    // 获取每个用户的详细信息
    const users = await Promise.all(
      uniqueUserIds.map(async (userId) => {
        const [assetsData, kycData, tradesData] = await Promise.all([
          supabase.from('user_assets').select('*').eq('user_id', userId),
          supabase.from('kyc_applications').select('*').eq('user_id', userId).order('submitted_at', { ascending: false }).limit(1).maybeSingle(),
          supabase.from('trades').select('total').eq('user_id', userId).eq('status', 'completed'),
        ]);

        const userAssets = assetsData.data || [];
        const totalBalance = userAssets.reduce((sum, asset) => sum + Number(asset.usd_value || 0), 0);
        const tradingVolume = tradesData.data?.reduce((sum, trade) => sum + Number(trade.total || 0), 0) || 0;
        
        // 尝试获取用户基本信息
        let userEmail = userId.substring(0, 8) + '...';
        let userName = '用户';
        try {
          const { data: { user: authUser } } = await supabase.auth.getUser();
          if (authUser && authUser.id === userId) {
            userEmail = authUser.email || userEmail;
            userName = authUser.user_metadata?.full_name || authUser.user_metadata?.name || userEmail.split('@')[0];
          }
        } catch (e) {
          // 如果无法获取，使用默认值
        }

        // 获取用户注册时间和最后活跃时间
        const firstAsset = userAssets.length > 0 ? userAssets[0] : null;
        const lastTrade = tradesData.data && tradesData.data.length > 0 
          ? await supabase.from('trades').select('created_at').eq('user_id', userId).order('created_at', { ascending: false }).limit(1).single()
          : null;

        return {
          id: userId,
          email: userEmail,
          name: userName,
          totalBalance,
          tradingVolume,
          kycStatus: kycData.data?.status || 'none',
          assetCount: userAssets.length,
          joinDate: firstAsset?.created_at ? new Date(firstAsset.created_at).toLocaleDateString() : 'N/A',
          lastActive: lastTrade?.data?.created_at 
            ? new Date(lastTrade.data.created_at).toLocaleDateString() 
            : firstAsset?.created_at 
              ? new Date(firstAsset.created_at).toLocaleDateString() 
              : 'N/A',
        };
      })
    );

    return users;
  },

  // 获取所有交易（用于管理后台）
  async getAllTrades(limit: number = 100, offset: number = 0) {
    const { data, error } = await supabase
      .from('trades')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit)
      .range(offset, offset + limit - 1);

    if (error) {
      console.error('获取交易列表失败:', error);
      return [];
    }
    return data || [];
  },

  // 获取所有订单（用于管理后台）
  async getAllOrders(limit: number = 100, offset: number = 0) {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit)
      .range(offset, offset + limit - 1);

    if (error) {
      console.error('获取订单列表失败:', error);
      return [];
    }
    return data || [];
  },

  // 获取交易量趋势数据
  async getVolumeTrend(days: number = 7) {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    startDate.setHours(0, 0, 0, 0);
    
    const { data, error } = await supabase
      .from('trades')
      .select('total, created_at')
      .eq('status', 'completed')
      .gte('created_at', startDate.toISOString())
      .order('created_at', { ascending: true });

    if (error) {
      console.error('获取交易量趋势失败:', error);
      return [];
    }
    
    // 按日期分组
    const grouped: { [key: string]: { volume: number; count: number } } = {};
    data?.forEach(trade => {
      const date = new Date(trade.created_at).toLocaleDateString('zh-CN', { month: '2-digit', day: '2-digit' });
      if (!grouped[date]) {
        grouped[date] = { volume: 0, count: 0 };
      }
      grouped[date].volume += Number(trade.total || 0);
      grouped[date].count += 1;
    });

    return Object.entries(grouped).map(([date, data]) => ({
      date,
      volume: Math.round(data.volume),
      trades: data.count,
    }));
  },

  // 获取用户增长趋势数据
  async getUserGrowthTrend(months: number = 6) {
    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() - months);
    
    const { data, error } = await supabase
      .from('user_assets')
      .select('user_id, created_at')
      .gte('created_at', startDate.toISOString())
      .order('created_at', { ascending: true });

    if (error) {
      console.error('获取用户增长趋势失败:', error);
      return [];
    }

    // 按月份分组
    const grouped: { [key: string]: Set<string> } = {};
    data?.forEach(asset => {
      const date = new Date(asset.created_at);
      const monthKey = date.toLocaleDateString('en-US', { month: 'short' });
      if (!grouped[monthKey]) {
        grouped[monthKey] = new Set();
      }
      grouped[monthKey].add(asset.user_id);
    });

    // 计算累计用户数
    let cumulativeUsers = 0;
    return Object.entries(grouped).map(([month, users]) => {
      cumulativeUsers += users.size;
      return {
        month,
        users: cumulativeUsers,
      };
    });
  },
};

