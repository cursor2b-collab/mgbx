import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Link } from "react-router-dom";
import { cn } from "../../lib/utils";
import { auth } from "../../utils/supabase/client";
import { toast } from "sonner@2.0.3";
import { TestAccountSelector } from "../TestAccountSelector";

interface SignInPageProps {
  className?: string;
  onSuccess?: () => void;
}

// 优化的背景动画组件 - 不使用 Three.js
const AnimatedBackground = () => {
  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* 渐变背景 */}
      <div className="absolute inset-0 bg-gradient-to-br from-black via-slate-900 to-black" />
      
      {/* 动画圆点网格 */}
      <div className="absolute inset-0 opacity-30">
        {Array.from({ length: 50 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-[#A3F030] rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              opacity: [0.1, 0.6, 0.1],
              scale: [1, 1.5, 1],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      {/* 渐变光晕 */}
      <motion.div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full"
        style={{
          background: "radial-gradient(circle, rgba(163, 240, 48, 0.1) 0%, transparent 70%)",
        }}
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
    </div>
  );
};

const AnimatedNavLink = ({ to, children }: { to: string; children: React.ReactNode }) => {
  return (
    <Link
      to={to}
      className="group relative inline-block overflow-hidden h-5 flex items-center text-sm"
    >
      <div className="flex flex-col transition-transform duration-400 ease-out transform group-hover:-translate-y-1/2">
        <span className="text-gray-300">{children}</span>
        <span className="text-white">{children}</span>
      </div>
    </Link>
  );
};

function MiniNavbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [headerShapeClass, setHeaderShapeClass] = useState("rounded-full");
  const shapeTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    if (shapeTimeoutRef.current) {
      clearTimeout(shapeTimeoutRef.current);
    }

    if (isOpen) {
      setHeaderShapeClass("rounded-xl");
    } else {
      shapeTimeoutRef.current = setTimeout(() => {
        setHeaderShapeClass("rounded-full");
      }, 300);
    }

    return () => {
      if (shapeTimeoutRef.current) {
        clearTimeout(shapeTimeoutRef.current);
      }
    };
  }, [isOpen]);

  return (
    <div className="w-full max-w-2xl mx-auto px-4 py-4 relative z-50">
      <motion.div
        className={cn(
          "relative overflow-hidden backdrop-blur-md transition-all duration-300",
          headerShapeClass,
          "bg-white/5 border border-white/10"
        )}
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex justify-between items-center p-4">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-[#A3F030] rounded-lg flex items-center justify-center">
              <span className="text-black font-bold text-lg">C</span>
            </div>
            <span className="text-white font-bold text-xl">CRYPTONX</span>
          </Link>

          <nav className="hidden md:flex items-center gap-6">
            <AnimatedNavLink to="/">首页</AnimatedNavLink>
            <AnimatedNavLink to="/markets">市场</AnimatedNavLink>
            <AnimatedNavLink to="/trading">交易</AnimatedNavLink>
            <AnimatedNavLink to="/about">关于</AnimatedNavLink>
          </nav>

          <div className="flex items-center gap-3">
            <Link
              to="/login"
              className="hidden md:block px-4 py-2 text-gray-300 hover:text-white transition-colors text-sm"
            >
              登录
            </Link>
            <Link
              to="/login"
              className="px-4 py-2 bg-[#A3F030] text-black rounded-lg hover:bg-[#92D928] transition-colors text-sm font-medium"
            >
              注册
            </Link>
            <button
              onClick={toggleMenu}
              className="md:hidden text-white p-2"
              aria-label="Toggle menu"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                {isOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="md:hidden overflow-hidden border-t border-white/10"
            >
              <div className="flex flex-col p-4 gap-3">
                <Link to="/" className="text-gray-300 hover:text-white py-2 transition-colors">
                  首页
                </Link>
                <Link to="/markets" className="text-gray-300 hover:text-white py-2 transition-colors">
                  市场
                </Link>
                <Link to="/trading" className="text-gray-300 hover:text-white py-2 transition-colors">
                  交易
                </Link>
                <Link to="/about" className="text-gray-300 hover:text-white py-2 transition-colors">
                  关于
                </Link>
                <Link to="/login" className="text-gray-300 hover:text-white py-2 transition-colors">
                  登录
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}

export function SignInPage({ className, onSuccess }: SignInPageProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (isSignUp) {
        await auth.signUpWithEmail(email, password, { name });
        toast.success("注册成功！请检查您的邮箱以验证账户。");
      } else {
        await auth.signInWithEmail(email, password);
        toast.success("登录成功！");
        onSuccess?.();
      }
    } catch (error: any) {
      toast.error(error.message || (isSignUp ? "注册失败" : "登录失��"));
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      await auth.signInWithGoogle();
    } catch (error: any) {
      toast.error(error.message || "Google 登录失败");
    }
  };

  return (
    <div className={cn("min-h-screen w-full relative overflow-hidden bg-black", className)}>
      <AnimatedBackground />

      <div className="relative z-10 min-h-screen flex flex-col">
        <MiniNavbar />

        <div className="flex-1 flex items-center justify-center px-4 py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="w-full max-w-md"
          >
            <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-8 shadow-2xl">
              <div className="text-center mb-8">
                <h1 className="text-3xl font-bold text-white mb-2">
                  {isSignUp ? "创建账户" : "欢迎回来"}
                </h1>
                <p className="text-gray-400">
                  {isSignUp ? "开始您的加密货币交易之旅" : "登录到您的账户"}
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {isSignUp && (
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      姓名
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#A3F030] focus:border-transparent transition-all"
                      placeholder="请输入您的姓名"
                      required
                    />
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    邮箱地址
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#A3F030] focus:border-transparent transition-all"
                    placeholder="your@email.com"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    密码
                  </label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#A3F030] focus:border-transparent transition-all"
                    placeholder="••••••••"
                    required
                  />
                </div>

                {!isSignUp && (
                  <div className="flex items-center justify-between">
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        className="w-4 h-4 rounded border-white/10 bg-white/5 text-[#A3F030] focus:ring-[#A3F030]"
                      />
                      <span className="text-sm text-gray-400">记住我</span>
                    </label>
                    <Link to="/forgot-password" className="text-sm text-[#A3F030] hover:underline">
                      忘记密码？
                    </Link>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 bg-[#A3F030] text-black font-semibold rounded-lg hover:bg-[#92D928] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? "处理中..." : isSignUp ? "注册" : "登录"}
                </button>
              </form>

              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-white/10"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-transparent text-gray-400">或</span>
                </div>
              </div>

              {/* 测试账号快速登录 */}
              {!isSignUp && (
                <div className="mb-4 relative">
                  <TestAccountSelector onLoginSuccess={onSuccess} />
                </div>
              )}

              <button
                onClick={handleGoogleSignIn}
                className="w-full py-3 bg-white/5 border border-white/10 text-white font-medium rounded-lg hover:bg-white/10 transition-all flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="currentColor"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                使用 Google 继续
              </button>

              <div className="mt-6 text-center">
                <p className="text-gray-400">
                  {isSignUp ? "已有账户？" : "还没有账户？"}
                  <button
                    onClick={() => setIsSignUp(!isSignUp)}
                    className="ml-2 text-[#A3F030] hover:underline font-medium"
                  >
                    {isSignUp ? "立即登录" : "立即注册"}
                  </button>
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}