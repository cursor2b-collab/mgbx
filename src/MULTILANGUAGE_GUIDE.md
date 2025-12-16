# 🌍 多语言功能使用指南

## 概述

CRYPTONX 交易平台已集成完整的多语言（i18n）系统，支持 **8 种语言**：

- 🇨🇳 **中文** (zh)
- 🇺🇸 **English** (en)
- 🇯🇵 **日本語** (ja)
- 🇰🇷 **한국어** (ko)
- 🇪🇸 **Español** (es)
- 🇫🇷 **Français** (fr)
- 🇩🇪 **Deutsch** (de)
- 🇷🇺 **Русский** (ru)

---

## 🎯 功能特性

✅ **自动检测浏览器语言** - 首次访问自动匹配用户浏览器语言  
✅ **持久化存储** - 语言选择保存在 localStorage，刷新后保持  
✅ **实时切换** - 无需刷新页面，点击即刻切换  
✅ **全局可用** - 通过 Context API 在任何组件中使用  
✅ **类型安全** - TypeScript 完整类型支持  
✅ **易于扩展** - 简单添加新语言和翻译文本  

---

## 📁 文件结构

```
/contexts/LanguageContext.tsx       # 多语言 Context 和翻译数据
/components/LanguageSwitcher.tsx    # 语言切换组件
/components/LanguageExample.tsx     # 使用示例组件
```

---

## 🚀 快速开始

### 1. 在组件中使用多语言

```tsx
import { useLanguage } from '../contexts/LanguageContext';

function MyComponent() {
  const { t, language, setLanguage } = useLanguage();
  
  return (
    <div>
      {/* 使用 t() 函数翻译文本 */}
      <h1>{t('hero.title')}</h1>
      <p>{t('hero.subtitle')}</p>
      
      {/* 按钮文本 */}
      <button>{t('nav.login')}</button>
      
      {/* 切换语言 */}
      <button onClick={() => setLanguage('en')}>
        Switch to English
      </button>
      
      {/* 显示当前语言 */}
      <p>Current: {language}</p>
    </div>
  );
}
```

### 2. 在导航栏添加语言切换器

语言切换器已集成到 `Navbar.tsx` 中：

```tsx
import { LanguageSwitcher } from './LanguageSwitcher';

// 在导航栏中添加
<LanguageSwitcher />
```

### 3. 访问示例页面

访问 `http://localhost:5173/language-demo` 查看完整的使用示例和效果演示。

---

## 📖 翻译键（Translation Keys）

### 导航相关 (nav)
- `nav.markets` - 行情
- `nav.trading` - 交易
- `nav.stocks` - 股票
- `nav.forex` - 外汇
- `nav.ipo` - IPO
- `nav.assets` - 资产
- `nav.deposit` - 充值
- `nav.withdraw` - 提现
- `nav.login` - 登录
- `nav.register` - 注册
- `nav.logout` - 退出
- `nav.profile` - 个人中心
- `nav.language` - 语言

### 首页相关 (hero)
- `hero.title` - 标题
- `hero.subtitle` - 副标题
- `hero.startTrading` - 开始交易
- `hero.learnMore` - 了解更多
- `hero.trustUsers` - 信任用户
- `hero.dailyVolume` - 24小时交易量
- `hero.countries` - 支持国家
- `hero.coins` - 上线币种

### 功能特性 (features)
- `features.title` - 为什么选择我们
- `features.security` - 银行级安全
- `features.securityDesc` - 安全描述
- `features.speed` - 极速交易
- `features.speedDesc` - 速度描述
- `features.lowFee` - 低手续费
- `features.lowFeeDesc` - 费率描述
- `features.global` - 全球服务
- `features.globalDesc` - 服务描述

### 市场行情 (market)
- `market.title` - 热门交易对
- `market.pair` - 交易对
- `market.price` - 最新价
- `market.change` - 24h涨跌
- `market.volume` - 24h成交量
- `market.high` - 24h最高
- `market.low` - 24h最低
- `market.action` - 交易

### 交易相关 (trading)
- `trading.buy` - 买入
- `trading.sell` - 卖出
- `trading.limit` - 限价
- `trading.market` - 市价
- `trading.stop` - 止损
- `trading.amount` - 数量
- `trading.price` - 价格
- `trading.total` - 总额
- `trading.available` - 可用
- `trading.orderBook` - 订单簿
- `trading.recentTrades` - 最近成交
- `trading.myOrders` - 我的订单
- `trading.placeOrder` - 下单
- `trading.cancel` - 取消
- `trading.filled` - 已成交
- `trading.pending` - 待成交
- `trading.cancelled` - 已取消

### 资产相关 (assets)
- `assets.title` - 我的资产
- `assets.totalAssets` - 总资产
- `assets.available` - 可用余额
- `assets.frozen` - 冻结资产
- `assets.coin` - 币种
- `assets.balance` - 余额
- `assets.value` - 估值
- `assets.deposit` - 充值
- `assets.withdraw` - 提现
- `assets.transfer` - 划转
- `assets.history` - 历史记录

### 认证相关 (auth)
- `auth.login` - 登录
- `auth.register` - 注册
- `auth.email` - 邮箱
- `auth.password` - 密码
- `auth.confirmPassword` - 确认密码
- `auth.forgotPassword` - 忘记密码？
- `auth.noAccount` - 还没有账户？
- `auth.hasAccount` - 已有账户？
- `auth.loginNow` - 立即登录
- `auth.registerNow` - 立即注册
- `auth.googleLogin` - 使用 Google 登录
- `auth.welcome` - 欢迎回来
- `auth.createAccount` - 创建账户
- `auth.enterEmail` - 输入您的邮箱
- `auth.enterPassword` - 输入您的密码
- `auth.enterCode` - 输入验证码
- `auth.sendCode` - 发送验证码
- `auth.verify` - 验证
- `auth.success` - 成功！
- `auth.loginSuccess` - 登录成功
- `auth.registerSuccess` - 注册成功

### 页脚相关 (footer)
- `footer.about` - 关于我们
- `footer.terms` - 服务条款
- `footer.privacy` - 隐私政策
- `footer.support` - 帮助中心
- `footer.api` - API文档
- `footer.fees` - 费率说明
- `footer.announcement` - 公告中心
- `footer.careers` - 加入我们
- `footer.copyright` - 版权信息

### 通用文本 (common)
- `common.search` - 搜索
- `common.filter` - 筛选
- `common.all` - 全部
- `common.confirm` - 确认
- `common.cancel` - 取消
- `common.submit` - 提交
- `common.save` - 保存
- `common.delete` - 删除
- `common.edit` - 编辑
- `common.view` - 查看
- `common.download` - 下载
- `common.upload` - 上传
- `common.loading` - 加载中...
- `common.noData` - 暂无数据
- `common.error` - 错误
- `common.success` - 成功
- `common.warning` - 警告
- `common.info` - 信息
- `common.more` - 更多
- `common.less` - 收起
- `common.expand` - 展开
- `common.collapse` - 折叠

---

## 🔧 添加新语言

### 步骤 1: 在 `LanguageContext.tsx` 添加语言代码

```tsx
type Language = 'zh' | 'en' | 'ja' | 'ko' | 'es' | 'fr' | 'de' | 'ru' | 'pt'; // 添加 'pt'
```

### 步骤 2: 添加翻译数据

```tsx
const translations: Record<Language, any> = {
  // ... 现有语言
  pt: {
    nav: {
      markets: 'Mercados',
      trading: 'Negociação',
      // ... 其他翻译
    },
    // ... 其他分类
  }
};
```

### 步骤 3: 在 `LanguageSwitcher.tsx` 添加语言选项

```tsx
const languages = [
  // ... 现有语言
  { code: 'pt', name: 'Português', flag: '🇵🇹' },
] as const;
```

---

## 🎨 语言切换器样式

语言切换器采用下拉菜单形式，样式已完美适配黑色主题：

- **未激活**: 灰色文本，黑色背景
- **激活状态**: 荧光绿色 (#A3F030) 背景 + 对勾标记
- **Hover**: 黑色背景加深
- **移动端**: 仅显示旗帜图标，节省空间

---

## 💡 最佳实践

### 1. 使用嵌套键名
```tsx
// ✅ 好的做法
t('trading.buy')
t('market.price')

// ❌ 避免
t('buy')
t('price')
```

### 2. 提供默认值
```tsx
// 如果翻译不存在，会返回键名本身
{t('未定义的键')} // 输出: "未定义的键"
```

### 3. 动态内容
```tsx
// 对于需要插入变量的文本，暂时使用模板字符串
{`${t('trading.price')}: $45,000`}
```

### 4. 条件渲染
```tsx
{language === 'zh' ? '中文内容' : 'English Content'}
```

---

## 🧪 测试多语言

### 方法 1: 使用语言切换器
1. 访问任何页面
2. 点击右上角的语言切换按钮（地球图标）
3. 选择目标语言
4. 页面文本立即切换

### 方法 2: 访问示例页面
访问 `http://localhost:5173/language-demo` 查看所有翻译效果

### 方法 3: 编程方式切换
```tsx
const { setLanguage } = useLanguage();
setLanguage('ja'); // 切换到日语
```

---

## 🐛 常见问题

### Q: 翻译不显示怎么办？
**A**: 检查是否：
1. 在 App.tsx 中包裹了 `<LanguageProvider>`
2. 正确导入了 `useLanguage` hook
3. 翻译键名拼写正确

### Q: 如何清除语言设置？
**A**: 打开浏览器控制台执行：
```js
localStorage.removeItem('language')
```

### Q: 如何修改默认语言？
**A**: 在 `LanguageContext.tsx` 中修改：
```tsx
const getInitialLanguage = (): Language => {
  // ... 
  return 'en'; // 改为你想要的默认语言
};
```

---

## 📊 支持的语言统计

| 语言 | 代码 | 翻译完成度 | 说明 |
|------|------|-----------|------|
| 中文 | zh | ✅ 100% | 完整支持 |
| English | en | ✅ 100% | 完整支持 |
| 日本語 | ja | ✅ 100% | 完整支持 |
| 한국어 | ko | ✅ 100% | 完整支持 |
| Español | es | ✅ 100% | 完整支持 |
| Français | fr | ✅ 100% | 完整支持 |
| Deutsch | de | ✅ 100% | 完整支持 |
| Русский | ru | ✅ 100% | 完整支持 |

---

## 🎉 完成！

多语言功能已完全集成到 CRYPTONX 平台！现在您可以：

✅ 在导航栏切换语言  
✅ 在任何组件中使用翻译  
✅ 添加新的语言支持  
✅ 自定义翻译文本  

如需帮助，请访问示例页面：`/language-demo` 📚
