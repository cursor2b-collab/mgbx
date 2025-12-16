import { useState } from "react";
import { SignInPage } from "./ui/sign-in-flow-1";
import { auth } from "../utils/supabase/client";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

export function NewAuthForm() {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleEmailSubmit = async (email: string) => {
    setIsLoading(true);
    
    try {
      // 这里可以发送验证码到邮箱
      // 目前先直接使用密码登录
      toast.info("验证码功能开发中，请使用 Google 登录");
    } catch (error: any) {
      toast.error(error.message || "发送验证码失败");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCodeSubmit = async (code: string[]) => {
    setIsLoading(true);
    
    try {
      const codeString = code.join("");
      // 这里可以验证验证码
      // 目前先模拟成功
      toast.success("验证成功！");
      
      // 跳转到控制台
      setTimeout(() => {
        navigate("/dashboard");
      }, 1000);
    } catch (error: any) {
      toast.error(error.message || "验证失败");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    
    try {
      await auth.signInWithGoogle();
      // OAuth 登录会自动重定向，无需手动处理
    } catch (error: any) {
      toast.error(error.message || "Google 登录失败");
      setIsLoading(false);
    }
  };

  return (
    <SignInPage
      onEmailSubmit={handleEmailSubmit}
      onCodeSubmit={handleCodeSubmit}
      onGoogleLogin={handleGoogleLogin}
      isLoading={isLoading}
    />
  );
}
