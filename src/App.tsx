import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'sonner'
import { AuthCallback } from './components/AuthCallback'
import { Dashboard } from './components/Dashboard'
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
import { UserManagement } from './components/admin/UserManagement'
import { TradeManagement } from './components/admin/TradeManagement'
import { KYCManagement } from './components/admin/KYCManagement'
import { OrderManagement } from './components/admin/OrderManagement'
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
                <Dashboard />
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
          
          {/* 管理后台路由 */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="users" element={<UserManagement />} />
            <Route path="trades" element={<TradeManagement />} />
            <Route path="kyc" element={<KYCManagement />} />
            <Route path="orders" element={<OrderManagement />} />
            <Route path="analytics" element={<div className="text-white">数据统计 - 开发中</div>} />
            <Route path="content" element={<div className="text-white">内容管理 - 开发中</div>} />
            <Route path="messages" element={<div className="text-white">客服消息 - 开发中</div>} />
            <Route path="permissions" element={<div className="text-white">权限管理 - 开发中</div>} />
            <Route path="settings" element={<div className="text-white">系统设置 - 开发中</div>} />
          </Route>
          
          {/* 404 重定向 */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </LanguageProvider>
  )
}