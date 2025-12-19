# Web3 钱包数据库设置说明

## ✅ 已创建的数据表

### wallet_addresses 表

用于存储用户的 Web3 钱包地址和连接信息。

#### 表结构

| 字段名 | 类型 | 说明 |
|--------|------|------|
| `id` | UUID | 主键 |
| `user_id` | UUID | 关联的用户 ID (auth.users) |
| `address` | TEXT | 钱包地址 |
| `wallet_type` | TEXT | 钱包类型：MetaMask, WalletConnect, Coinbase Wallet, Trust Wallet, Rainbow, Other |
| `network` | TEXT | 网络类型：ethereum, arbitrum, polygon, base, optimism, bsc, other |
| `chain_id` | INTEGER | 链 ID |
| `is_primary` | BOOLEAN | 是否为主钱包地址 |
| `is_verified` | BOOLEAN | 是否已验证 |
| `verified_at` | TIMESTAMP | 验证时间 |
| `last_used_at` | TIMESTAMP | 最后使用时间 |
| `created_at` | TIMESTAMP | 创建时间 |
| `updated_at` | TIMESTAMP | 更新时间 |

#### 约束

- **唯一约束**：`(user_id, address, network)` - 同一用户在同一网络下不能重复添加相同地址
- **外键约束**：`user_id` 关联到 `auth.users.id`，级联删除
- **检查约束**：
  - `wallet_type` 必须是预定义的类型之一
  - `network` 必须是预定义的网络之一

#### 索引

- `idx_wallet_addresses_user_id` - 用户 ID 索引
- `idx_wallet_addresses_address` - 钱包地址索引
- `idx_wallet_addresses_user_primary` - 主钱包地址索引（部分索引）

#### Row Level Security (RLS)

已启用 RLS，策略如下：
- ✅ 用户只能查看自己的钱包地址
- ✅ 用户只能插入自己的钱包地址
- ✅ 用户只能更新自己的钱包地址
- ✅ 用户只能删除自己的钱包地址

## 🔧 辅助函数

### 1. set_primary_wallet(user_id, wallet_id)

设置用户的主钱包地址。

```sql
SELECT set_primary_wallet('user-uuid', 'wallet-uuid');
```

**功能**：
- 自动将用户的其他钱包设置为非主钱包
- 将指定的钱包设置为主钱包

### 2. get_primary_wallet(user_id)

获取用户的主钱包地址。

```sql
SELECT * FROM get_primary_wallet('user-uuid');
```

**返回字段**：
- `id` - 钱包 ID
- `address` - 钱包地址
- `wallet_type` - 钱包类型
- `network` - 网络类型
- `chain_id` - 链 ID
- `is_verified` - 是否已验证

### 3. verify_wallet_address(user_id, wallet_id)

验证钱包地址（需要签名验证）。

```sql
SELECT verify_wallet_address('user-uuid', 'wallet-uuid');
```

**功能**：
- 将钱包地址标记为已验证
- 记录验证时间

### 4. update_wallet_last_used(user_id, address, network)

更新钱包最后使用时间。

```sql
SELECT update_wallet_last_used('user-uuid', '0x...', 'ethereum');
```

## 📝 使用示例

### 在前端代码中使用

#### 1. 保存钱包地址

```typescript
import { supabase } from './utils/supabase/client';

// 用户连接钱包后，保存钱包地址
async function saveWalletAddress(userId: string, address: string, walletType: string, network: string, chainId: number) {
  const { data, error } = await supabase
    .from('wallet_addresses')
    .insert({
      user_id: userId,
      address: address.toLowerCase(), // 统一转换为小写
      wallet_type: walletType,
      network: network,
      chain_id: chainId,
      is_primary: false, // 默认非主钱包
      is_verified: false,
    })
    .select()
    .single();

  if (error) {
    console.error('保存钱包地址失败:', error);
    throw error;
  }

  return data;
}
```

#### 2. 获取用户的所有钱包地址

```typescript
async function getUserWallets(userId: string) {
  const { data, error } = await supabase
    .from('wallet_addresses')
    .select('*')
    .eq('user_id', userId)
    .order('is_primary', { ascending: false })
    .order('last_used_at', { ascending: false });

  if (error) {
    console.error('获取钱包地址失败:', error);
    throw error;
  }

  return data;
}
```

#### 3. 设置主钱包

```typescript
async function setPrimaryWallet(userId: string, walletId: string) {
  const { data, error } = await supabase.rpc('set_primary_wallet', {
    p_user_id: userId,
    p_wallet_id: walletId,
  });

  if (error) {
    console.error('设置主钱包失败:', error);
    throw error;
  }

  return data;
}
```

#### 4. 获取主钱包

```typescript
async function getPrimaryWallet(userId: string) {
  const { data, error } = await supabase.rpc('get_primary_wallet', {
    p_user_id: userId,
  });

  if (error) {
    console.error('获取主钱包失败:', error);
    throw error;
  }

  return data?.[0] || null;
}
```

#### 5. 验证钱包地址

```typescript
async function verifyWallet(userId: string, walletId: string) {
  const { data, error } = await supabase.rpc('verify_wallet_address', {
    p_user_id: userId,
    p_wallet_id: walletId,
  });

  if (error) {
    console.error('验证钱包失败:', error);
    throw error;
  }

  return data;
}
```

#### 6. 更新最后使用时间

```typescript
async function updateLastUsed(userId: string, address: string, network: string) {
  const { data, error } = await supabase.rpc('update_wallet_last_used', {
    p_user_id: userId,
    p_address: address.toLowerCase(),
    p_network: network,
  });

  if (error) {
    console.error('更新最后使用时间失败:', error);
    throw error;
  }

  return data;
}
```

## 🔗 与 Web3 集成

### 在钱包连接后保存地址

```typescript
import { useAccount } from 'wagmi';
import { useAuth } from './hooks/useAuth';

function WalletConnectionHandler() {
  const { address, chainId, connector } = useAccount();
  const { user } = useAuth();

  useEffect(() => {
    if (address && user) {
      // 获取网络名称
      const networkMap: Record<number, string> = {
        1: 'ethereum',
        42161: 'arbitrum',
        137: 'polygon',
        8453: 'base',
        10: 'optimism',
        56: 'bsc',
      };

      const network = networkMap[chainId || 1] || 'other';
      const walletType = connector?.name || 'Other';

      // 保存钱包地址
      saveWalletAddress(user.id, address, walletType, network, chainId || 1)
        .then(() => {
          console.log('钱包地址已保存');
        })
        .catch((error) => {
          console.error('保存钱包地址失败:', error);
        });
    }
  }, [address, chainId, connector, user]);

  return null;
}
```

## 📊 数据查询示例

### 查询用户的所有钱包

```sql
SELECT 
  id,
  address,
  wallet_type,
  network,
  chain_id,
  is_primary,
  is_verified,
  last_used_at,
  created_at
FROM wallet_addresses
WHERE user_id = 'user-uuid'
ORDER BY is_primary DESC, last_used_at DESC;
```

### 查询主钱包

```sql
SELECT * FROM get_primary_wallet('user-uuid');
```

### 统计用户钱包数量

```sql
SELECT 
  user_id,
  COUNT(*) as wallet_count,
  COUNT(*) FILTER (WHERE is_primary = true) as primary_count,
  COUNT(*) FILTER (WHERE is_verified = true) as verified_count
FROM wallet_addresses
GROUP BY user_id;
```

## 🔐 安全注意事项

1. **地址验证**：建议在保存前验证地址格式
2. **签名验证**：验证钱包所有权时，要求用户签名
3. **地址标准化**：统一将地址转换为小写存储
4. **RLS 策略**：已启用 RLS，确保用户只能访问自己的数据

## 🚀 后续优化建议

1. **钱包余额查询**：可以添加定期查询钱包余额的功能
2. **交易历史**：关联交易记录表，记录钱包的交易历史
3. **多链支持**：扩展支持更多区块链网络
4. **钱包标签**：允许用户为钱包添加自定义标签
5. **钱包分组**：支持将钱包分组管理

## 📚 相关文件

- 数据库迁移：已通过 Supabase MCP 创建
- 项目 ID：`bxeubvjivqbbbhzngycf`
- Web3 配置：`src/config/index.tsx`
- Web3 上下文：`src/context/Web3Context.tsx`





