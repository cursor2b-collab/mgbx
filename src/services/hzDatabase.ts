import { supabase } from '../utils/supabase/client';

// ==================== 类型定义 ====================

// 用户表
export interface HzUser {
  id: number;
  account: string;
  password?: string;
  address?: string;
  usdtbalance: number;
  btcbalance: number;
  ethbalance: number;
  usdtbalance_dj: number;
  usdt_zs: number;
  Invite?: string;
  regtime: string;
  lasttime?: string;
  state: number;
  created_at: string;
  updated_at: string;
}

// 充值记录表
export interface HzRecharge {
  id: number;
  uid: number;
  account: string;
  coinname: string;
  num: number;
  state: number; // 0待处理 1处理中 2已完成
  addtime: string;
  finishtime?: string;
  txid?: string;
  address?: string;
  created_at: string;
  updated_at: string;
}

// 提现记录表
export interface HzWithdraw {
  id: number;
  uid: number;
  account: string;
  coinname: string;
  num: number;
  fee: number;
  state: number; // 0待处理 1已完成 2已驳回
  addtime: string;
  finishtime?: string;
  re_contents?: string;
  address?: string;
  txid?: string;
  created_at: string;
  updated_at: string;
}

// 银行卡提现记录表
export interface HzWithdrawBank {
  id: number;
  uid: number;
  account: string;
  coinname: string;
  num: number;
  state: number;
  addtime: string;
  finishtime?: string;
  re_contents?: string;
  bankname?: string;
  bankaccount?: string;
  realname?: string;
  created_at: string;
  updated_at: string;
}

// 资金记录表
export interface HzBill {
  id: number;
  uid: number;
  account: string;
  type: string;
  acttype: number;
  state: number;
  symbol: number; // 1增加 -1减少
  original: number;
  num: number;
  afternum: number;
  addtime: string;
  remarks?: string;
  created_at: string;
  updated_at: string;
}

// 认证数据表
export interface HzAuthData {
  id: number;
  uid: number;
  account: string;
  firstname?: string;
  lastname?: string;
  idcard?: string;
  idcard_front?: string;
  idcard_back?: string;
  selfie?: string;
  state: number; // 1待审核 2已驳回 3已通过
  addtime: string;
  updatetime?: string;
  re_contents?: string;
  created_at: string;
  updated_at: string;
}

// 平台币种配置表
export interface HzCoinsCogs {
  id: number;
  coinname: string;
  coinfullname?: string;
  coinlogo?: string;
  online?: string;
  address?: string;
  addressqr?: string;
  in_state: number;
  out_state: number;
  state: number;
  tx_num: number;
  sort: number;
  created_at: string;
  updated_at: string;
}

// 合约订单表
export interface HzLeverOrder {
  id: number;
  uid: number;
  account: string;
  coinname: string;
  price: number;
  pc_price?: number;
  direction: number; // 1做多 2做空
  ggan: number;
  earnestmoney: number;
  status: number; // 1持仓中 2持仓中 3已平仓
  yk_status: number; // 1盈利 2亏损
  ylmoney: number;
  addtime: string;
  endtime?: string;
  created_at: string;
  updated_at: string;
}

// 期权订单表
export interface HzOptionOrder {
  id: number;
  uid: number;
  account: string;
  coinname: string;
  price: number;
  amount: number;
  option_type: number; // 1看涨 2看跌
  status: number;
  profit: number;
  addtime: string;
  endtime?: string;
  created_at: string;
  updated_at: string;
}

// 借贷订单表
export interface HzBorrowOrder {
  id: number;
  uid: number;
  account: string;
  goods_id: number;
  amount: number;
  rate: number;
  days: number;
  status: number;
  addtime: string;
  endtime?: string;
  created_at: string;
  updated_at: string;
}

// 质押订单表
export interface HzStillOrder {
  id: number;
  uid: number;
  account: string;
  goods_id: number;
  amount: number;
  rate: number;
  days: number;
  status: number;
  addtime: string;
  endtime?: string;
  created_at: string;
  updated_at: string;
}

// 委托订单表
export interface HzArrangeOrder {
  id: number;
  uid: number;
  account: string;
  coinname: string;
  price: number;
  amount: number;
  order_type: number; // 1买入 2卖出
  status: number;
  addtime: string;
  finishtime?: string;
  created_at: string;
  updated_at: string;
}

// 商品列表表
export interface HzGoodsList {
  id: number;
  name: string;
  gcode: string;
  gclass: number; // 1外汇 2加密货币 3美股 4期货
  price: number;
  is_open: number;
  sort: number;
  created_at: string;
  updated_at: string;
}

// 商城商品表
export interface HzShopGoods {
  id: number;
  name: string;
  price: number;
  stock: number;
  image?: string;
  description?: string;
  state: number;
  sort: number;
  created_at: string;
  updated_at: string;
}

// 商城订单表
export interface HzGoodsOrder {
  id: number;
  uid: number;
  account: string;
  goods_id: number;
  goods_name: string;
  price: number;
  quantity: number;
  total_amount: number;
  status: number; // 0待处理 1已完成 2已取消
  addtime: string;
  finishtime?: string;
  created_at: string;
  updated_at: string;
}

// 文章表
export interface HzArticle {
  id: number;
  title: string;
  content?: string;
  image?: string;
  view_count: number;
  state: number;
  sort: number;
  addtime: string;
  created_at: string;
  updated_at: string;
}

// 公告表
export interface HzNotice {
  id: number;
  title: string;
  content?: string;
  view_count: number;
  state: number;
  sort: number;
  addtime: string;
  created_at: string;
  updated_at: string;
}

// 问答表
export interface HzAnswers {
  id: number;
  question: string;
  answer?: string;
  view_count: number;
  state: number;
  sort: number;
  addtime: string;
  created_at: string;
  updated_at: string;
}

// 管理员表
export interface HzAdmin {
  id: number;
  account: string;
  password?: string;
  adminpower: number;
  state: number;
  lasttime?: string;
  created_at: string;
  updated_at: string;
}

// ==================== 用户服务 ====================

export const hzUserService = {
  // 获取所有用户
  async getAllUsers(filters?: { search?: string; state?: number }, limit = 100, offset = 0): Promise<HzUser[]> {
    let query = supabase
      .from('hz_users')
      .select('*')
      .order('id', { ascending: false })
      .range(offset, offset + limit - 1);

    if (filters?.search) {
      query = query.ilike('account', `%${filters.search}%`);
    }
    if (filters?.state !== undefined) {
      query = query.eq('state', filters.state);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data || [];
  },

  // 获取用户总数
  async getUserCount(filters?: { state?: number }): Promise<number> {
    let query = supabase.from('hz_users').select('id', { count: 'exact', head: true });

    if (filters?.state !== undefined) {
      query = query.eq('state', filters.state);
    }

    const { count, error } = await query;
    if (error) throw error;
    return count || 0;
  },

  // 获取今日注册用户数
  async getTodayRegistrations(): Promise<number> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayStr = today.toISOString().split('T')[0];

    const { count, error } = await supabase
      .from('hz_users')
      .select('id', { count: 'exact', head: true })
      .gte('regtime', todayStr);

    if (error) throw error;
    return count || 0;
  },

  // 获取今日登录用户数
  async getTodayLogins(): Promise<number> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayStr = today.toISOString().split('T')[0];

    const { count, error } = await supabase
      .from('hz_users')
      .select('id', { count: 'exact', head: true })
      .gte('lasttime', todayStr);

    if (error) throw error;
    return count || 0;
  },

  // 获取单个用户
  async getUserById(id: number): Promise<HzUser | null> {
    const { data, error } = await supabase
      .from('hz_users')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null;
      throw error;
    }
    return data;
  },

  // 更新用户
  async updateUser(id: number, updates: Partial<HzUser>): Promise<HzUser> {
    const { data, error } = await supabase
      .from('hz_users')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // 创建用户（从 Supabase auth.users 同步）
  async createUserFromAuth(authUserId: string, account: string): Promise<HzUser> {
    const { data, error } = await supabase
      .from('hz_users')
      .insert({
        account,
        password: '', // 密码存储在 auth.users 中
        state: 1,
        regtime: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // 通过账号获取用户（用于用户端）
  async getUserByAccount(account: string): Promise<HzUser | null> {
    const { data, error } = await supabase
      .from('hz_users')
      .select('*')
      .eq('account', account)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null;
      throw error;
    }
    return data;
  },

  // 获取或创建用户（从 Supabase auth user）
  // 如果用户不存在，则创建；如果存在，则更新最后登录时间
  async getOrCreateUserFromAuth(authUserEmail: string): Promise<HzUser> {
    // 先尝试查找用户
    let user = await this.getUserByAccount(authUserEmail);
    
    if (!user) {
      // 用户不存在，尝试创建新用户
      try {
        user = await this.createUserFromAuth('', authUserEmail);
      } catch (error: any) {
        // 如果创建失败（可能是唯一约束错误），再次尝试查找
        if (error.code === '23505' || error.message?.includes('unique constraint')) {
          console.log('用户可能已存在，重新查找:', authUserEmail);
          user = await this.getUserByAccount(authUserEmail);
          if (!user) {
            throw new Error('无法创建或查找用户');
          }
        } else {
          throw error;
        }
      }
    } else {
      // 用户存在，更新最后登录时间
      user = await this.updateUser(user.id, {
        lasttime: new Date().toISOString(),
      });
    }
    
    return user;
  },
};

// ==================== 充值服务 ====================

export const hzRechargeService = {
  // 获取所有充值记录
  async getAllRecharges(filters?: { 
    uid?: number; 
    coinname?: string; 
    state?: number;
    startDate?: string;
    endDate?: string;
  }, limit = 100, offset = 0): Promise<HzRecharge[]> {
    let query = supabase
      .from('hz_recharge')
      .select('*')
      .order('id', { ascending: false })
      .range(offset, offset + limit - 1);

    if (filters?.uid) query = query.eq('uid', filters.uid);
    if (filters?.coinname) query = query.eq('coinname', filters.coinname);
    if (filters?.state !== undefined) query = query.eq('state', filters.state);
    if (filters?.startDate) query = query.gte('addtime', filters.startDate);
    if (filters?.endDate) query = query.lte('addtime', filters.endDate);

    const { data, error } = await query;
    if (error) throw error;
    return data || [];
  },

  // 获取充值总数（按币种和状态）
  async getRechargeTotal(coinname: string, state: number = 2): Promise<number> {
    const { data, error } = await supabase
      .from('hz_recharge')
      .select('num')
      .eq('coinname', coinname)
      .eq('state', state);

    if (error) throw error;
    return data?.reduce((sum, r) => sum + Number(r.num || 0), 0) || 0;
  },

  // 获取充值人数
  async getRechargeUserCount(): Promise<number> {
    const { data, error } = await supabase
      .from('hz_recharge')
      .select('uid');

    if (error) throw error;
    const uniqueUsers = new Set(data?.map(r => r.uid) || []);
    return uniqueUsers.size;
  },

  // 更新充值状态
  async updateRechargeStatus(id: number, state: number, txid?: string): Promise<HzRecharge> {
    const updates: any = {
      state,
      updated_at: new Date().toISOString(),
    };
    if (state === 2) {
      updates.finishtime = new Date().toISOString();
    }
    if (txid) {
      updates.txid = txid;
    }

    const { data, error } = await supabase
      .from('hz_recharge')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },
};

// ==================== 提现服务 ====================

export const hzWithdrawService = {
  // 获取所有提现记录
  async getAllWithdraws(filters?: { 
    uid?: number; 
    coinname?: string; 
    state?: number;
  }, limit = 100, offset = 0): Promise<HzWithdraw[]> {
    let query = supabase
      .from('hz_withdraw')
      .select('*')
      .order('id', { ascending: false })
      .range(offset, offset + limit - 1);

    if (filters?.uid) query = query.eq('uid', filters.uid);
    if (filters?.coinname) query = query.eq('coinname', filters.coinname);
    if (filters?.state !== undefined) query = query.eq('state', filters.state);

    const { data, error } = await query;
    if (error) throw error;
    return data || [];
  },

  // 获取提现总数
  async getWithdrawTotal(coinname?: string, state: number = 1): Promise<number> {
    let query = supabase
      .from('hz_withdraw')
      .select('num')
      .eq('state', state);

    if (coinname) query = query.eq('coinname', coinname);

    const { data, error } = await query;
    if (error) throw error;
    return data?.reduce((sum, w) => sum + Number(w.num || 0), 0) || 0;
  },

  // 获取提现人数
  async getWithdrawUserCount(): Promise<number> {
    const { data, error } = await supabase
      .from('hz_withdraw')
      .select('uid');

    if (error) throw error;
    const uniqueUsers = new Set(data?.map(w => w.uid) || []);
    return uniqueUsers.size;
  },

  // 更新提现状态
  async updateWithdrawStatus(id: number, state: number, re_contents?: string, txid?: string): Promise<HzWithdraw> {
    const updates: any = {
      state,
      updated_at: new Date().toISOString(),
    };
    if (state === 1 || state === 2) {
      updates.finishtime = new Date().toISOString();
    }
    if (re_contents) {
      updates.re_contents = re_contents;
    }
    if (txid) {
      updates.txid = txid;
    }

    const { data, error } = await supabase
      .from('hz_withdraw')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },
};

// ==================== 银行卡提现服务 ====================

export const hzWithdrawBankService = {
  // 获取所有银行卡提现记录
  async getAllWithdrawBanks(filters?: { 
    uid?: number; 
    state?: number;
  }, limit = 100, offset = 0): Promise<HzWithdrawBank[]> {
    let query = supabase
      .from('hz_withdrawbank')
      .select('*')
      .order('id', { ascending: false })
      .range(offset, offset + limit - 1);

    if (filters?.uid) query = query.eq('uid', filters.uid);
    if (filters?.state !== undefined) query = query.eq('state', filters.state);

    const { data, error } = await query;
    if (error) throw error;
    return data || [];
  },

  // 更新银行卡提现状态
  async updateWithdrawBankStatus(id: number, state: number, re_contents?: string): Promise<HzWithdrawBank> {
    const updates: any = {
      state,
      updated_at: new Date().toISOString(),
    };
    if (state === 1 || state === 2) {
      updates.finishtime = new Date().toISOString();
    }
    if (re_contents) {
      updates.re_contents = re_contents;
    }

    const { data, error } = await supabase
      .from('hz_withdrawbank')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },
};

// ==================== 资金记录服务 ====================

export const hzBillService = {
  // 获取用户资金记录
  async getUserBills(uid: number, limit = 100, offset = 0): Promise<HzBill[]> {
    const { data, error } = await supabase
      .from('hz_bill')
      .select('*')
      .eq('uid', uid)
      .order('id', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) throw error;
    return data || [];
  },

  // 获取所有资金记录
  async getAllBills(filters?: { 
    uid?: number; 
    acttype?: number;
    type?: string;
  }, limit = 100, offset = 0): Promise<HzBill[]> {
    let query = supabase
      .from('hz_bill')
      .select('*')
      .order('id', { ascending: false })
      .range(offset, offset + limit - 1);

    if (filters?.uid) query = query.eq('uid', filters.uid);
    if (filters?.acttype !== undefined) query = query.eq('acttype', filters.acttype);
    if (filters?.type) query = query.eq('type', filters.type);

    const { data, error } = await query;
    if (error) throw error;
    return data || [];
  },
};

// ==================== 认证数据服务 ====================

export const hzAuthDataService = {
  // 获取所有认证数据
  async getAllAuthData(filters?: { 
    uid?: number; 
    state?: number;
  }, limit = 100, offset = 0): Promise<HzAuthData[]> {
    let query = supabase
      .from('hz_authdata')
      .select('*')
      .order('id', { ascending: false })
      .range(offset, offset + limit - 1);

    if (filters?.uid) query = query.eq('uid', filters.uid);
    if (filters?.state !== undefined) query = query.eq('state', filters.state);

    const { data, error } = await query;
    if (error) throw error;
    return data || [];
  },

  // 更新认证状态
  async updateAuthStatus(id: number, state: number, re_contents?: string): Promise<HzAuthData> {
    const updates: any = {
      state,
      updatetime: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    if (re_contents) {
      updates.re_contents = re_contents;
    }

    const { data, error } = await supabase
      .from('hz_authdata')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },
};

// ==================== 币种配置服务 ====================

export const hzCoinsCogsService = {
  // 获取所有币种配置
  async getAllCoins(filters?: { search?: string }): Promise<HzCoinsCogs[]> {
    let query = supabase
      .from('hz_coinscogs')
      .select('*');
    
    if (filters?.search) {
      query = query.or(`coinname.ilike.%${filters.search}%,coinfullname.ilike.%${filters.search}%`);
    }
    
    query = query.order('sort', { ascending: true })
      .order('id', { ascending: false });

    const { data, error } = await query;

    if (error) throw error;
    return data || [];
  },

  // 获取单个币种
  async getCoinById(id: number): Promise<HzCoinsCogs | null> {
    const { data, error } = await supabase
      .from('hz_coinscogs')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null;
      throw error;
    }
    return data;
  },

  // 创建币种
  async createCoin(coin: Omit<HzCoinsCogs, 'id' | 'created_at' | 'updated_at'>): Promise<HzCoinsCogs> {
    const { data, error } = await supabase
      .from('hz_coinscogs')
      .insert(coin)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // 更新币种
  async updateCoin(id: number, updates: Partial<HzCoinsCogs>): Promise<HzCoinsCogs> {
    const { data, error } = await supabase
      .from('hz_coinscogs')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // 删除币种
  async deleteCoin(id: number): Promise<void> {
    const { error } = await supabase
      .from('hz_coinscogs')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },
};

// ==================== 订单服务 ====================

export const hzOrderService = {
  // 获取所有合约订单
  async getAllLeverOrders(filters?: { 
    uid?: number; 
    status?: number;
  }, limit = 100, offset = 0): Promise<HzLeverOrder[]> {
    let query = supabase
      .from('hz_leverorder')
      .select('*')
      .order('id', { ascending: false })
      .range(offset, offset + limit - 1);

    if (filters?.uid) query = query.eq('uid', filters.uid);
    if (filters?.status !== undefined) query = query.eq('status', filters.status);

    const { data, error } = await query;
    if (error) throw error;
    return data || [];
  },

  // 获取所有期权订单
  async getAllOptionOrders(filters?: { 
    uid?: number; 
    status?: number;
  }, limit = 100, offset = 0): Promise<HzOptionOrder[]> {
    let query = supabase
      .from('hz_optionorder')
      .select('*')
      .order('id', { ascending: false })
      .range(offset, offset + limit - 1);

    if (filters?.uid) query = query.eq('uid', filters.uid);
    if (filters?.status !== undefined) query = query.eq('status', filters.status);

    const { data, error } = await query;
    if (error) throw error;
    return data || [];
  },

  // 获取所有借贷订单
  async getAllBorrowOrders(filters?: { 
    uid?: number; 
    status?: number;
  }, limit = 100, offset = 0): Promise<HzBorrowOrder[]> {
    let query = supabase
      .from('hz_borroworder')
      .select('*')
      .order('id', { ascending: false })
      .range(offset, offset + limit - 1);

    if (filters?.uid) query = query.eq('uid', filters.uid);
    if (filters?.status !== undefined) query = query.eq('status', filters.status);

    const { data, error } = await query;
    if (error) throw error;
    return data || [];
  },

  // 获取所有质押订单
  async getAllStillOrders(filters?: { 
    uid?: number; 
    status?: number;
  }, limit = 100, offset = 0): Promise<HzStillOrder[]> {
    let query = supabase
      .from('hz_stillorder')
      .select('*')
      .order('id', { ascending: false })
      .range(offset, offset + limit - 1);

    if (filters?.uid) query = query.eq('uid', filters.uid);
    if (filters?.status !== undefined) query = query.eq('status', filters.status);

    const { data, error } = await query;
    if (error) throw error;
    return data || [];
  },

  // 获取所有委托订单
  async getAllArrangeOrders(filters?: { 
    uid?: number; 
    status?: number;
  }, limit = 100, offset = 0): Promise<HzArrangeOrder[]> {
    let query = supabase
      .from('hz_arrangeorder')
      .select('*')
      .order('id', { ascending: false })
      .range(offset, offset + limit - 1);

    if (filters?.uid) query = query.eq('uid', filters.uid);
    if (filters?.status !== undefined) query = query.eq('status', filters.status);

    const { data, error } = await query;
    if (error) throw error;
    return data || [];
  },
};

// ==================== 商品服务 ====================

export const hzGoodsService = {
  // 获取所有商品
  async getAllGoods(filters?: { 
    gclass?: number; 
    is_open?: number;
  }): Promise<HzGoodsList[]> {
    let query = supabase
      .from('hz_goodslist')
      .select('*')
      .order('sort', { ascending: true });

    if (filters?.gclass !== undefined) query = query.eq('gclass', filters.gclass);
    if (filters?.is_open !== undefined) query = query.eq('is_open', filters.is_open);

    const { data, error } = await query;
    if (error) throw error;
    return data || [];
  },
};

// ==================== 商城服务 ====================

export const hzShopService = {
  // 获取所有商城商品
  async getAllShopGoods(filters?: { state?: number }): Promise<HzShopGoods[]> {
    let query = supabase
      .from('hz_shopgoods')
      .select('*')
      .order('sort', { ascending: true });

    if (filters?.state !== undefined) query = query.eq('state', filters.state);

    const { data, error } = await query;
    if (error) throw error;
    return data || [];
  },

  // 获取所有商城订单
  async getAllGoodsOrders(filters?: { 
    uid?: number; 
    status?: number;
  }, limit = 100, offset = 0): Promise<HzGoodsOrder[]> {
    let query = supabase
      .from('hz_goodsorder')
      .select('*')
      .order('id', { ascending: false })
      .range(offset, offset + limit - 1);

    if (filters?.uid) query = query.eq('uid', filters.uid);
    if (filters?.status !== undefined) query = query.eq('status', filters.status);

    const { data, error } = await query;
    if (error) throw error;
    return data || [];
  },
};

// ==================== 内容服务 ====================

export const hzContentService = {
  // 获取所有文章
  async getAllArticles(filters?: { state?: number }): Promise<HzArticle[]> {
    let query = supabase
      .from('hz_article')
      .select('*')
      .order('sort', { ascending: true })
      .order('id', { ascending: false });

    if (filters?.state !== undefined) query = query.eq('state', filters.state);

    const { data, error } = await query;
    if (error) throw error;
    return data || [];
  },

  // 获取所有公告
  async getAllNotices(filters?: { state?: number }): Promise<HzNotice[]> {
    let query = supabase
      .from('hz_notice')
      .select('*')
      .order('sort', { ascending: true })
      .order('id', { ascending: false });

    if (filters?.state !== undefined) query = query.eq('state', filters.state);

    const { data, error } = await query;
    if (error) throw error;
    return data || [];
  },

  // 获取所有问答
  async getAllAnswers(filters?: { state?: number }): Promise<HzAnswers[]> {
    let query = supabase
      .from('hz_answers')
      .select('*')
      .order('sort', { ascending: true })
      .order('id', { ascending: false });

    if (filters?.state !== undefined) query = query.eq('state', filters.state);

    const { data, error } = await query;
    if (error) throw error;
    return data || [];
  },
};

// ==================== 统计服务 ====================

export const hzStatsService = {
  // 获取仪表盘统计数据
  async getDashboardStats() {
    const [
      totalUsers,
      todayRegistrations,
      todayLogins,
      rechargeTotal,
      withdrawTotal,
      rechargeUserCount,
      withdrawUserCount,
      bonusTotal,
    ] = await Promise.all([
      hzUserService.getUserCount(),
      hzUserService.getTodayRegistrations(),
      hzUserService.getTodayLogins(),
      hzRechargeService.getRechargeTotal('USDT', 2),
      hzWithdrawService.getWithdrawTotal('USDT', 1),
      hzRechargeService.getRechargeUserCount(),
      hzWithdrawService.getWithdrawUserCount(),
      supabase.from('hz_users').select('usdt_zs').then(({ data }) => 
        data?.reduce((sum, u) => sum + Number(u.usdt_zs || 0), 0) || 0
      ),
    ]);

    return {
      totalUsers,
      todayRegistrations,
      todayLogins,
      rechargeTotal,
      withdrawTotal,
      rechargeUserCount,
      withdrawUserCount,
      bonusTotal,
    };
  },

  // 获取月度充值提现数据
  async getMonthlyRechargeWithdraw(year?: number) {
    const targetYear = year || new Date().getFullYear();
    const startDate = `${targetYear}-01-01`;
    const endDate = `${targetYear}-12-31`;

    const [rechargeData, withdrawData] = await Promise.all([
      supabase
        .from('hz_recharge')
        .select('num, addtime')
        .eq('coinname', 'USDT')
        .eq('state', 2)
        .gte('addtime', startDate)
        .lte('addtime', endDate),
      supabase
        .from('hz_withdraw')
        .select('num, addtime')
        .eq('coinname', 'USDT')
        .eq('state', 1)
        .gte('addtime', startDate)
        .lte('addtime', endDate),
    ]);

    // 按月份分组
    const monthlyRecharge = Array(12).fill(0);
    const monthlyWithdraw = Array(12).fill(0);

    rechargeData.data?.forEach(r => {
      const month = new Date(r.addtime).getMonth();
      monthlyRecharge[month] += Number(r.num || 0);
    });

    withdrawData.data?.forEach(w => {
      const month = new Date(w.addtime).getMonth();
      monthlyWithdraw[month] += Number(w.num || 0);
    });

    return {
      monthlyRecharge,
      monthlyWithdraw,
    };
  },
};

