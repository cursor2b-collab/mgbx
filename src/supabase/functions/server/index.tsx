import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import { createClient } from "npm:@supabase/supabase-js@2";
import * as kv from "./kv_store.tsx";
const app = new Hono();

// Enable logger
app.use('*', logger(console.log));

// Enable CORS for all routes and methods
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

// Health check endpoint
app.get("/make-server-2d551b3c/health", (c) => {
  return c.json({ status: "ok" });
});

// ==================== 资产管理 API ====================

// 获取用户资产列表
app.get("/make-server-2d551b3c/assets", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    
    if (!accessToken) {
      return c.json({ error: 'Unauthorized: No token provided' }, 401);
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    );
    
    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);
    
    if (authError || !user) {
      console.error('Authorization error while getting user assets:', authError);
      return c.json({ error: 'Unauthorized: Invalid token' }, 401);
    }

    // 从KV存储获取用户资产
    const assetsKey = `user_assets:${user.id}`;
    const assets = await kv.get(assetsKey);

    // 如果用户没有资产，返回默认资产
    if (!assets) {
      const defaultAssets = [
        {
          id: '1',
          symbol: 'USDT',
          name: 'Tether',
          icon: 'https://assets.coingecko.com/coins/images/325/small/Tether.png',
          balance: 0,
          availableBalance: 0,
          frozenBalance: 0,
          usdValue: 0,
          price: 1,
          change24h: 0.01,
          avgBuyPrice: 1,
          profit: 0,
          profitPercent: 0
        }
      ];
      
      // 保存默认资产
      await kv.set(assetsKey, defaultAssets);
      return c.json({ assets: defaultAssets });
    }

    return c.json({ assets });
  } catch (error: any) {
    console.error('Error fetching user assets:', error);
    return c.json({ error: error.message || 'Failed to fetch assets' }, 500);
  }
});

// 更新用户资产
app.post("/make-server-2d551b3c/assets", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    
    if (!accessToken) {
      return c.json({ error: 'Unauthorized: No token provided' }, 401);
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    );
    
    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);
    
    if (authError || !user) {
      console.error('Authorization error while updating user assets:', authError);
      return c.json({ error: 'Unauthorized: Invalid token' }, 401);
    }

    const body = await c.req.json();
    const { assets } = body;

    if (!assets || !Array.isArray(assets)) {
      return c.json({ error: 'Invalid assets data' }, 400);
    }

    // 保存资产到KV存储
    const assetsKey = `user_assets:${user.id}`;
    await kv.set(assetsKey, assets);

    return c.json({ success: true, assets });
  } catch (error: any) {
    console.error('Error updating user assets:', error);
    return c.json({ error: error.message || 'Failed to update assets' }, 500);
  }
});

// 获取用户交易记录
app.get("/make-server-2d551b3c/transactions", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    
    if (!accessToken) {
      return c.json({ error: 'Unauthorized: No token provided' }, 401);
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    );
    
    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);
    
    if (authError || !user) {
      console.error('Authorization error while getting transactions:', authError);
      return c.json({ error: 'Unauthorized: Invalid token' }, 401);
    }

    // 从KV存储获取交易记录
    const txKey = `user_transactions:${user.id}`;
    const transactions = await kv.get(txKey);

    // 如果没有交易记录，返回空数组
    if (!transactions) {
      return c.json({ transactions: [] });
    }

    return c.json({ transactions });
  } catch (error: any) {
    console.error('Error fetching transactions:', error);
    return c.json({ error: error.message || 'Failed to fetch transactions' }, 500);
  }
});

// 添加交易记录
app.post("/make-server-2d551b3c/transactions", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    
    if (!accessToken) {
      return c.json({ error: 'Unauthorized: No token provided' }, 401);
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    );
    
    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);
    
    if (authError || !user) {
      console.error('Authorization error while adding transaction:', authError);
      return c.json({ error: 'Unauthorized: Invalid token' }, 401);
    }

    const body = await c.req.json();
    const { transaction } = body;

    if (!transaction) {
      return c.json({ error: 'Invalid transaction data' }, 400);
    }

    // 获取现有交易记录
    const txKey = `user_transactions:${user.id}`;
    const existingTransactions = await kv.get(txKey) || [];

    // 添加新交易记录（添加ID和时间戳）
    const newTransaction = {
      ...transaction,
      id: `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      time: new Date().toISOString(),
    };

    const updatedTransactions = [newTransaction, ...existingTransactions];

    // 保存更新后的交易记录（保留最近1000条）
    await kv.set(txKey, updatedTransactions.slice(0, 1000));

    return c.json({ success: true, transaction: newTransaction });
  } catch (error: any) {
    console.error('Error adding transaction:', error);
    return c.json({ error: error.message || 'Failed to add transaction' }, 500);
  }
});

// 初始化用户默认资产
app.post("/make-server-2d551b3c/assets/init", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    
    if (!accessToken) {
      return c.json({ error: 'Unauthorized: No token provided' }, 401);
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    );
    
    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);
    
    if (authError || !user) {
      console.error('Authorization error while initializing assets:', authError);
      return c.json({ error: 'Unauthorized: Invalid token' }, 401);
    }

    // 创建默认资产
    const defaultAssets = [
      {
        id: '1',
        symbol: 'USDT',
        name: 'Tether',
        icon: 'https://assets.coingecko.com/coins/images/325/small/Tether.png',
        balance: 10000,
        availableBalance: 10000,
        frozenBalance: 0,
        usdValue: 10000,
        price: 1,
        change24h: 0.01,
        avgBuyPrice: 1,
        profit: 0,
        profitPercent: 0
      },
      {
        id: '2',
        symbol: 'BTC',
        name: 'Bitcoin',
        icon: 'https://assets.coingecko.com/coins/images/1/small/bitcoin.png',
        balance: 0.1,
        availableBalance: 0.1,
        frozenBalance: 0,
        usdValue: 8700,
        price: 87000,
        change24h: 2.45,
        avgBuyPrice: 75000,
        profit: 1200,
        profitPercent: 16
      },
      {
        id: '3',
        symbol: 'ETH',
        name: 'Ethereum',
        icon: 'https://assets.coingecko.com/coins/images/279/small/ethereum.png',
        balance: 2,
        availableBalance: 2,
        frozenBalance: 0,
        usdValue: 6600,
        price: 3300,
        change24h: 1.85,
        avgBuyPrice: 3000,
        profit: 600,
        profitPercent: 10
      }
    ];

    // 保存默认资产
    const assetsKey = `user_assets:${user.id}`;
    await kv.set(assetsKey, defaultAssets);

    // 创建初始交易记录
    const defaultTransactions = [
      {
        id: `${Date.now()}_1`,
        type: 'deposit',
        asset: 'USDT',
        amount: 10000,
        status: 'completed',
        time: new Date().toISOString(),
        txHash: `0x${Math.random().toString(16).substr(2, 40)}`
      }
    ];

    const txKey = `user_transactions:${user.id}`;
    await kv.set(txKey, defaultTransactions);

    return c.json({ 
      success: true, 
      assets: defaultAssets,
      transactions: defaultTransactions
    });
  } catch (error: any) {
    console.error('Error initializing user assets:', error);
    return c.json({ error: error.message || 'Failed to initialize assets' }, 500);
  }
});

Deno.serve(app.fetch);