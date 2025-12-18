import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'sonner'
import { AuthCallback } from './components/AuthCallback'
import { ProfilePage } from './components/ProfilePage'
import { ProtectedRoute } from './components/ProtectedRoute'
import { CryptoExchangeHomepage } from './components/CryptoExchangeHomepage'
import { AuthForm } from './components/AuthForm'
import { Modern3DAuth } from './components/Modern3DAuth'
import { AuthPage } from './components/AuthPage'
import { SimpleNewAuthForm } from './components/SimpleNewAuthForm'
import { SimpleNewRegisterForm } from './components/SimpleNewRegisterForm'
import { CanvasAuthForm } from './components/CanvasAuthForm'
import { SignInDemo } from './components/SignInDemo'
import { TradingPage } from './components/TradingPage'
import { StockTradingPage } from './components/StockTradingPage'
import { ForexTradingPage } from './components/ForexTradingPage'
import { MobileTradingPage } from './components/MobileTradingPage'
import { MarketsPage } from './components/MarketsPage'
import { AssetsPage } from './components/AssetsPage'
import { DepositPage } from './components/DepositPage'
import { WithdrawPage } from './components/WithdrawPage'
import { AssetDetailPage } from './components/AssetDetailPage'
import { TransactionDetailPage } from './components/TransactionDetailPage'
import { TestAccountsManagement } from './components/TestAccountsManagement'
import { SmartTradingPage } from './components/SmartTradingPage'
import { LendingPage } from './components/LendingPage'
import { PlaceholderPage } from './components/PlaceholderPage'
import { AdminLayout } from './components/admin/AdminLayout'
import { AdminDashboard } from './components/admin/AdminDashboard'
import { AdminLogin } from './components/admin/AdminLogin'
import { AdminProtectedRoute } from './components/admin/AdminProtectedRoute'
import { UserManagement } from './components/admin/UserManagement'
import { TradeManagement } from './components/admin/TradeManagement'
import { KYCManagement } from './components/admin/KYCManagement'
import { OrderManagement } from './components/admin/OrderManagement'
import { FundManagement } from './components/admin/FundManagement'
import { GoodsManagement } from './components/admin/GoodsManagement'
import { CoinsManagement } from './components/admin/CoinsManagement'
import { ShopManagement } from './components/admin/ShopManagement'
import { ContentManagement } from './components/admin/ContentManagement'
import { SettingsManagement } from './components/admin/SettingsManagement'
import { ManageManagement } from './components/admin/ManageManagement'
import { RiskManagement } from './components/admin/RiskManagement'
import { ConfigManagement } from './components/admin/ConfigManagement'
import { FormsManagement } from './components/admin/FormsManagement'
import { ScrollToTop } from './components/ScrollToTop'
import { DevHelper } from './components/DevHelper'
import { LanguageProvider } from './contexts/LanguageContext'
import { LanguageExample } from './components/LanguageExample'
import { KYCVerificationPage } from './components/KYCVerificationPage'
import { InviteReferralPage } from './components/InviteReferralPage'

export default function App() {
  return (
    <LanguageProvider>
      <BrowserRouter>
        <ScrollToTop />
        <Toaster position="top-center" richColors />
        <DevHelper />
        <Routes>
          {/* 首页 - 加密货币交易所首页 */}
          <Route path="/" element={<CryptoExchangeHomepage />} />
          
          {/* 登录页 - 使用新样式登录组件 */}
          <Route path="/login" element={<AuthPage />} />
          
          {/* 注册/登录页 - 统一入口 */}
          <Route path="/auth" element={<AuthPage />} />
          
          {/* 新注册页 */}
          <Route path="/register" element={<AuthPage />} />
          <Route path="/signup" element={<AuthPage />} />
          
          {/* 备用登录页 - 标准登录表单 */}
          <Route path="/login-classic" element={<AuthForm />} />
          
          {/* 新登录页 - 简化版（推荐使用）*/}
          <Route path="/login-new" element={<SimpleNewAuthForm />} />
          
          {/* 新登录页 - 画布动画版（推荐使用）*/}
          <Route path="/login-canvas" element={<CanvasAuthForm />} />
          
          {/* 原版演示 - SignInPage 组件 */}
          <Route path="/demo-signin" element={<SignInDemo />} />
          
          {/* OAuth 回调页 */}
          <Route path="/auth/callback" element={<AuthCallback />} />
          
          {/* 受保护的仪表盘页 */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <AssetsPage />
              </ProtectedRoute>
            }
          />
          
          {/* 交易页 - 实时交易界面 */}
          <Route path="/trading" element={<TradingPage />} />
          
          {/* 股票交易页 - 股票交易界面 */}
          <Route path="/stocks" element={<StockTradingPage />} />
          
          {/* 外汇交易页 - 外汇交易界面 */}
          <Route path="/forex" element={<ForexTradingPage />} />
          
          {/* 移动交易页 - 移动交易界面 */}
          <Route path="/mobile" element={<MobileTradingPage />} />

          <Route 
            path="/kyc" 
            element={
              <ProtectedRoute>
                <KYCVerificationPage />
              </ProtectedRoute>
            } 
          />

          <Route 
            path="/invite" 
            element={
              <ProtectedRoute>
                <InviteReferralPage />
              </ProtectedRoute>
            } 
          />
          
          {/* 行情页面 - 重定向到首页的行情区域 */}
          <Route path="/markets" element={<MarketsPage />} />
          
          {/* 资产管理页 - 资产管理界面 */}
          <Route 
            path="/assets" 
            element={
              <ProtectedRoute>
                <AssetsPage />
              </ProtectedRoute>
            } 
          />
          
          {/* 个人资产页 - 资产管理界面 */}
          <Route 
            path="/profile" 
            element={
              <ProtectedRoute>
                <AssetsPage />
              </ProtectedRoute>
            } 
          />
          
          {/* 存款页 - 存款界面 */}
          <Route 
            path="/deposit" 
            element={
              <ProtectedRoute>
                <DepositPage />
              </ProtectedRoute>
            } 
          />
          
          {/* 提现页 - 提现界面 */}
          <Route 
            path="/withdraw" 
            element={
              <ProtectedRoute>
                <WithdrawPage />
              </ProtectedRoute>
            } 
          />
          
          {/* 资产详情页 - 资产详情界面 */}
          <Route 
            path="/asset/:id" 
            element={
              <ProtectedRoute>
                <AssetDetailPage />
              </ProtectedRoute>
            } 
          />
          
          {/* 交易详情页 - 交易详情界面 */}
          <Route 
            path="/transaction/:id" 
            element={
              <ProtectedRoute>
                <TransactionDetailPage />
              </ProtectedRoute>
            } 
          />
          
          {/* 测试账户管理页 - 测试账户管理界面 */}
          <Route path="/test-accounts" element={<TestAccountsManagement />} />
          
          {/* 占位页面 - 待开发功能 */}
          <Route path="/smart-trading" element={<SmartTradingPage />} />
          <Route path="/lending" element={<LendingPage />} />
          
          {/* 多语言示例页 */}
          <Route path="/language-demo" element={<LanguageExample />} />
          
          {/* 管理后台登录页 */}
          <Route path="/admin/login" element={<AdminLogin />} />
          
          {/* 管理后台路由 */}
          <Route 
            path="/admin" 
            element={
              <AdminProtectedRoute>
                <AdminLayout />
              </AdminProtectedRoute>
            }
          >
            <Route index element={<AdminDashboard />} />
            
            {/* 基础设置 */}
            <Route path="coins" element={<CoinsManagement />} />
            
            {/* 用户中心 */}
            <Route path="users" element={<UserManagement />} />
            <Route path="users/auth" element={<div className="text-white p-6">认证数据 - 开发中</div>} />
            <Route path="users/account" element={<div className="text-white p-6">账户管理 - 开发中</div>} />
            <Route path="users/bill" element={<div className="text-white p-6">资金记录 - 开发中</div>} />
            
            {/* 充值提现 */}
            <Route path="fund/recharge" element={<FundManagement />} />
            <Route path="fund/withdrawal" element={<FundManagement />} />
            <Route path="fund/withdrawalbank" element={<FundManagement />} />
            
            {/* 订单管理 */}
            <Route path="orders/contract" element={<OrderManagement />} />
            <Route path="orders/option" element={<div className="text-white p-6">期权订单 - 开发中</div>} />
            <Route path="orders/borrow" element={<div className="text-white p-6">借贷订单 - 开发中</div>} />
            <Route path="orders/still" element={<div className="text-white p-6">质押订单 - 开发中</div>} />
            <Route path="orders/arrange" element={<div className="text-white p-6">委托订单 - 开发中</div>} />
            
            {/* 产品管理 */}
            <Route path="goods/forward" element={<GoodsManagement />} />
            <Route path="goods/option" element={<GoodsManagement />} />
            <Route path="goods/borrow" element={<GoodsManagement />} />
            <Route path="goods/pledge" element={<GoodsManagement />} />
            <Route path="goods/encrypt" element={<GoodsManagement />} />
            <Route path="goods/foreign" element={<GoodsManagement />} />
            <Route path="goods/shares" element={<GoodsManagement />} />
            <Route path="goods/kline" element={<GoodsManagement />} />
            
            {/* 交易管理 */}
            <Route path="trades/entrust" element={<TradeManagement />} />
            <Route path="trades/index" element={<TradeManagement />} />
            
            {/* 商城管理 */}
            <Route path="shop/index" element={<ShopManagement />} />
            <Route path="shop/orderlist" element={<ShopManagement />} />
            
            {/* 风控管理 */}
            <Route path="risk" element={<RiskManagement />} />
            
            {/* 文章公告 */}
            <Route path="article" element={<ContentManagement />} />
            <Route path="notice" element={<ContentManagement />} />
            <Route path="answers" element={<ContentManagement />} />
            
            {/* 系统管理 */}
            <Route path="settings" element={<SettingsManagement />} />
            <Route path="settings/level" element={<SettingsManagement />} />
            <Route path="settings/trade" element={<SettingsManagement />} />
            <Route path="settings/protocol" element={<SettingsManagement />} />
            <Route path="settings/kefucode" element={<SettingsManagement />} />
            
            {/* 管理员管理 */}
            <Route path="manage" element={<ManageManagement />} />
            <Route path="manage/rules" element={<ManageManagement />} />
            <Route path="manage/logs" element={<ManageManagement />} />
            
            {/* 配置管理 */}
            <Route path="config/params" element={<ConfigManagement />} />
            <Route path="config/logs" element={<ConfigManagement />} />
            
            {/* 表单管理 */}
            <Route path="forms" element={<FormsManagement />} />
          </Route>
          
          {/* 404 重定向 */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </LanguageProvider>
  )
}