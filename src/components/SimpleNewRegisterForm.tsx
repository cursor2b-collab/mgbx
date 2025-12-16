import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { auth } from "../utils/supabase/client";
import { toast } from "sonner";
import { useNavigate, Link } from "react-router-dom";
import { useLanguage } from "../contexts/LanguageContext";
import { LanguageSwitcher } from "./LanguageSwitcher";

export function SimpleNewRegisterForm() {
  const [step, setStep] = useState<"info" | "code" | "success">("info");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const [isLoading, setIsLoading] = useState(false);
  const codeInputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const navigate = useNavigate();
  const { t } = useLanguage();

  const handleInfoSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // 验证密码
    if (password !== confirmPassword) {
      toast.error(t('auth.passwordMismatch'));
      return;
    }
    
    if (password.length < 8) {
      toast.error(t('auth.passwordTooShort'));
      return;
    }
    
    if (!agreeToTerms) {
      toast.error(t('auth.agreeTerms') || '请同意服务条款和隐私政策');
      return;
    }

    setIsLoading(true);
    try {
      // 直接注册（验证码功能可选）
      // 如果需要验证码，取消下面的注释并启用验证码步骤
      // toast.info(t('auth.verificationCodeSent'));
      // setStep("code");
      
      // 直接注册
      await auth.signUpWithEmail(email, password, {
        phone: phone || undefined,
      });
      toast.success(t('auth.registerSuccess'));
      setStep("success");
      setTimeout(() => {
        navigate("/dashboard");
      }, 2000);
    } catch (error: any) {
      toast.error(error.message || t('auth.registerFailed'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async () => {
    setIsLoading(true);
    try {
      await auth.signUpWithEmail(email, password, {
        phone: phone || undefined,
      });
      toast.success(t('auth.registerSuccess'));
      setStep("success");
      setTimeout(() => {
        navigate("/dashboard");
      }, 2000);
    } catch (error: any) {
      toast.error(error.message || t('auth.registerFailed'));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (step === "code") {
      setTimeout(() => {
        codeInputRefs.current[0]?.focus();
      }, 500);
    }
  }, [step]);

  const handleCodeChange = (index: number, value: string) => {
    if (value.length <= 1) {
      const newCode = [...code];
      newCode[index] = value;
      setCode(newCode);
      
      if (value && index < 5) {
        codeInputRefs.current[index + 1]?.focus();
      }
      
      if (index === 5 && value) {
        const isComplete = newCode.every(digit => digit.length === 1);
        if (isComplete) {
          // 验证码输入完成，执行注册
          setTimeout(() => {
            handleRegister();
          }, 500);
        }
      }
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      codeInputRefs.current[index - 1]?.focus();
    }
  };

  const handleBackClick = () => {
    setStep("info");
    setCode(["", "", "", "", "", ""]);
  };

  const handleGoogleSignUp = async () => {
    setIsLoading(true);
    try {
      await auth.signInWithGoogle('https://cryptonxs.netlify.app/auth/callback');
      // OAuth 注册会自动重定向
    } catch (error: any) {
      toast.error(error.message || t('auth.googleLoginFailed'));
      setIsLoading(false);
    }
  };

  return (
    <div className="flex w-full flex-col min-h-screen bg-black relative overflow-hidden">
      {/* 语言切换器 */}
      <div className="absolute top-6 right-6 z-30">
        <LanguageSwitcher />
      </div>

      {/* 动画背景 */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(163,240,48,0.15),transparent_50%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />
        <div className="absolute top-0 left-0 right-0 h-1/3 bg-gradient-to-b from-black to-transparent" />
      </div>
      
      <div className="relative z-10 flex flex-col flex-1">
        <div className="flex flex-1 flex-col lg:flex-row">
          <div className="flex-1 flex flex-col justify-center items-center p-4">
            <div className="w-full mt-[100px] max-w-sm">
              <AnimatePresence mode="wait">
                {step === "info" ? (
                  <motion.div 
                    key="info-step"
                    initial={{ opacity: 0, x: -100 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -100 }}
                    transition={{ duration: 0.4, ease: "easeOut" }}
                    className="space-y-6 text-center"
                  >
                    <div className="space-y-2">
                      <h1 className="text-4xl md:text-5xl font-bold leading-tight tracking-tight text-white">
                        {t('auth.createAccount')}
                      </h1>
                      <p className="text-xl md:text-2xl text-white/70">
                        {t('auth.startTrading')}
                      </p>
                    </div>
                    
                    <div className="space-y-4">
                      <button 
                        onClick={handleGoogleSignUp}
                        disabled={isLoading}
                        className="w-full flex items-center justify-center gap-3 bg-white/5 hover:bg-white/10 text-white border border-white/10 rounded-full py-3 px-4 transition-all disabled:opacity-50 backdrop-blur-sm"
                      >
                        <svg className="w-5 h-5" viewBox="0 0 24 24">
                          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                        </svg>
                        <span>{t('auth.signInWithGoogle')}</span>
                      </button>
                      
                      <div className="flex items-center gap-4">
                        <div className="h-px bg-white/10 flex-1" />
                        <span className="text-white/40 text-sm">{t('auth.or')}</span>
                        <div className="h-px bg-white/10 flex-1" />
                      </div>
                      
                      <form onSubmit={handleInfoSubmit} className="space-y-4">
                        <div className="relative">
                          <input 
                            type="email" 
                            placeholder={t('auth.enterEmail')}
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full bg-white/5 backdrop-blur-sm text-white border border-white/10 rounded-full py-3 px-4 focus:outline-none focus:border-[#A3F030] focus:ring-1 focus:ring-[#A3F030] text-center transition-all"
                            required
                            disabled={isLoading}
                          />
                        </div>

                        <div className="relative">
                          <input 
                            type="tel" 
                            placeholder={t('auth.enterPhone')}
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            className="w-full bg-white/5 backdrop-blur-sm text-white border border-white/10 rounded-full py-3 px-4 focus:outline-none focus:border-[#A3F030] focus:ring-1 focus:ring-[#A3F030] text-center transition-all"
                            disabled={isLoading}
                          />
                        </div>

                        <div className="relative">
                          <input 
                            type="password" 
                            placeholder={t('auth.password')}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full bg-white/5 backdrop-blur-sm text-white border border-white/10 rounded-full py-3 px-4 focus:outline-none focus:border-[#A3F030] focus:ring-1 focus:ring-[#A3F030] text-center transition-all"
                            required
                            disabled={isLoading}
                          />
                        </div>

                        <div className="relative">
                          <input 
                            type="password" 
                            placeholder={t('auth.confirmPassword')}
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="w-full bg-white/5 backdrop-blur-sm text-white border border-white/10 rounded-full py-3 px-4 focus:outline-none focus:border-[#A3F030] focus:ring-1 focus:ring-[#A3F030] text-center transition-all"
                            required
                            disabled={isLoading}
                          />
                        </div>

                        <div className="flex items-start space-x-2 pt-2">
                          <input
                            type="checkbox"
                            id="agree-terms"
                            checked={agreeToTerms}
                            onChange={(e) => setAgreeToTerms(e.target.checked)}
                            className="mt-1 w-4 h-4 rounded border-white/20 bg-white/5 text-[#A3F030] focus:ring-[#A3F030] focus:ring-offset-0 focus:ring-2"
                            required
                          />
                          <label htmlFor="agree-terms" className="text-xs text-white/60 leading-relaxed cursor-pointer">
                            {t('auth.agreeTerms')}
                          </label>
                        </div>

                        <button 
                          type="submit"
                          disabled={isLoading || !agreeToTerms}
                          className="w-full bg-[#A3F030] text-black font-medium rounded-full py-3 px-4 hover:bg-[#8fd028] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {isLoading ? t('auth.sending') : t('auth.registerNow')}
                        </button>
                      </form>
                    </div>

                    <div className="pt-4">
                      <p className="text-sm text-white/50">
                        {t('auth.hasAccount')}{" "}
                        <Link to="/login" className="text-[#A3F030] hover:text-[#8fd028] underline transition-colors">
                          {t('auth.loginNow')}
                        </Link>
                      </p>
                    </div>
                    
                    <p className="text-xs text-white/40 pt-4">
                      {t('auth.termsAndPrivacy')}{" "}
                      <a href="#" className="underline text-white/40 hover:text-white/60 transition-colors">
                        {t('auth.terms')}
                      </a>{" "}
                      {t('auth.and')}{" "}
                      <a href="#" className="underline text-white/40 hover:text-white/60 transition-colors">
                        {t('auth.privacy')}
                      </a>
                    </p>
                  </motion.div>
                ) : step === "code" ? (
                  <motion.div 
                    key="code-step"
                    initial={{ opacity: 0, x: 100 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 100 }}
                    transition={{ duration: 0.4, ease: "easeOut" }}
                    className="space-y-6 text-center"
                  >
                    <div className="space-y-2">
                      <h1 className="text-4xl md:text-5xl font-bold leading-tight tracking-tight text-white">
                        {t('auth.codeSent')}
                      </h1>
                      <p className="text-xl text-white/50">
                        {t('auth.enterCodeHere')}
                      </p>
                    </div>
                    
                    <div className="w-full">
                      <div className="relative rounded-full py-4 px-5 border border-white/10 bg-white/5 backdrop-blur-sm">
                        <div className="flex items-center justify-center gap-2">
                          {code.map((digit, i) => (
                            <div key={i} className="flex items-center">
                              <div className="relative">
                                <input
                                  ref={(el) => {
                                    codeInputRefs.current[i] = el;
                                  }}
                                  type="text"
                                  inputMode="numeric"
                                  pattern="[0-9]*"
                                  maxLength={1}
                                  value={digit}
                                  onChange={e => handleCodeChange(i, e.target.value)}
                                  onKeyDown={e => handleKeyDown(i, e)}
                                  className="w-10 text-center text-2xl bg-transparent text-white border-none focus:outline-none focus:ring-0 appearance-none"
                                  style={{ caretColor: 'transparent' }}
                                  disabled={isLoading}
                                />
                                {!digit && (
                                  <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center pointer-events-none">
                                    <span className="text-2xl text-white/20">0</span>
                                  </div>
                                )}
                              </div>
                              {i < 5 && <span className="text-white/20 text-2xl mx-1">|</span>}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <motion.p 
                        className="text-white/50 hover:text-white/70 transition-colors cursor-pointer text-sm"
                        whileHover={{ scale: 1.02 }}
                        transition={{ duration: 0.2 }}
                      >
                        {t('auth.resendVerificationCode')}
                      </motion.p>
                    </div>
                    
                    <div className="flex w-full gap-3">
                      <motion.button 
                        onClick={handleBackClick}
                        className="rounded-full bg-white/10 backdrop-blur-sm text-white border border-white/20 font-medium px-8 py-3 hover:bg-white/20 transition-colors"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        transition={{ duration: 0.2 }}
                        disabled={isLoading}
                      >
                        {t('auth.back')}
                      </motion.button>
                      <motion.button 
                        onClick={handleRegister}
                        className={`flex-1 rounded-full font-medium py-3 border transition-all duration-300 ${
                          code.every(d => d !== "") && !isLoading
                          ? "bg-[#A3F030] text-black border-transparent hover:bg-[#8fd028] cursor-pointer" 
                          : "bg-white/5 text-white/50 border-white/10 cursor-not-allowed"
                        }`}
                        disabled={!code.every(d => d !== "") || isLoading}
                      >
                        {isLoading ? t('auth.verifying') : t('auth.continue')}
                      </motion.button>
                    </div>
                    
                    <div className="pt-16">
                      <p className="text-xs text-white/40">
                        {t('auth.termsAndPrivacy')}{" "}
                        <a href="#" className="underline text-white/40 hover:text-white/60 transition-colors">
                          {t('auth.terms')}
                        </a>{" "}
                        {t('auth.and')}{" "}
                        <a href="#" className="underline text-white/40 hover:text-white/60 transition-colors">
                          {t('auth.privacy')}
                        </a>
                      </p>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div 
                    key="success-step"
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, ease: "easeOut", delay: 0.3 }}
                    className="space-y-6 text-center"
                  >
                    <div className="space-y-2">
                      <h1 className="text-4xl md:text-5xl font-bold leading-tight tracking-tight text-white">
                        {t('auth.registerSuccess')}
                      </h1>
                      <p className="text-xl text-white/50">
                        {t('auth.welcomeBack')}
                      </p>
                    </div>
                    
                    <motion.div 
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ duration: 0.5, delay: 0.5 }}
                      className="py-10"
                    >
                      <div className="mx-auto w-20 h-20 rounded-full bg-gradient-to-br from-[#A3F030] to-[#8fd028] flex items-center justify-center shadow-lg shadow-[#A3F030]/50">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-black" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                    </motion.div>
                    
                    <motion.button 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 1 }}
                      className="w-full rounded-full bg-[#A3F030] text-black font-medium py-3 hover:bg-[#8fd028] transition-colors shadow-lg shadow-[#A3F030]/30"
                      onClick={() => navigate("/dashboard")}
                    >
                      {t('auth.enterDashboard')}
                    </motion.button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
