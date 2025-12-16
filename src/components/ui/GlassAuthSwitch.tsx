import { useState } from 'react';
import { cn } from '../../lib/utils';

interface GlassAuthSwitchProps {
  onModeChange?: (mode: 'login' | 'signup') => void;
  className?: string;
}

export function GlassAuthSwitch({ onModeChange, className }: GlassAuthSwitchProps) {
  const [isSignup, setIsSignup] = useState(false);

  const handleToggle = () => {
    const newMode = !isSignup;
    setIsSignup(newMode);
    onModeChange?.(newMode ? 'signup' : 'login');
  };

  return (
    <label 
      htmlFor="auth-mode-switch" 
      className={cn(
        "switch-container inline-grid grid-cols-2 w-fit relative rounded-full cursor-pointer isolate",
        "bg-white/10 backdrop-blur-[10px] border border-white/20",
        "shadow-[0_8px_32px_0_rgba(31,38,135,0.37)] shadow-[inset_0_1px_0_0_rgba(255,255,255,0.3)]",
        className
      )}
      aria-label="Toggle Auth Mode"
    >
      <input 
        type="checkbox" 
        id="auth-mode-switch"
        checked={isSignup}
        onChange={handleToggle}
        className="absolute w-px h-px p-0 -m-px overflow-hidden whitespace-nowrap border-0"
        style={{ clip: 'rect(0, 0, 0, 0)' }}
      />
      
      {/* Login 标签 */}
      <span className={cn(
        "grid place-content-center transition-opacity duration-300 ease-in-out delay-150",
        "px-8 py-2 relative z-10 font-medium",
        "text-shadow-[0_2px_4px_rgba(0,0,0,0.1)]",
        isSignup ? "opacity-60" : "opacity-100"
      )}>
        Login
      </span>
      
      {/* Signup 标签 */}
      <span className={cn(
        "grid place-content-center transition-opacity duration-300 ease-in-out delay-150",
        "px-8 py-2 relative z-10 font-medium",
        "text-shadow-[0_2px_4px_rgba(0,0,0,0.1)]",
        isSignup ? "opacity-100" : "opacity-60"
      )}>
        Signup
      </span>

      {/* 滑块 - 液态玻璃效果 */}
      <div
        className={cn(
          "absolute rounded-full transition-all duration-500 z-0",
          "bg-white/25 backdrop-blur-[5px] border border-white/30",
          "shadow-[inset_0_2px_4px_rgba(255,255,255,0.3)]",
          "shadow-[0_4px_16px_rgba(0,0,0,0.2)]",
          "shadow-[0_8px_32px_rgba(255,255,255,0.1)]"
        )}
        style={{
          inset: isSignup 
            ? '4px 4px 4px 50%'  // 右侧
            : '4px 50% 4px 4px',  // 左侧
          transitionTimingFunction: 'cubic-bezier(0.47, 1.64, 0.41, 0.8)'
        }}
      />

      {/* 背景层 - 增强玻璃效果 */}
      <div 
        className="absolute inset-0 rounded-full -z-10 transition-all duration-150"
        style={{
          background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%)'
        }}
      />

      <style jsx>{`
        .switch-container:has(input:checked):hover .slider {
          inset: 4px 4px 4px 45%;
          background: rgba(255, 255, 255, 0.3);
        }
        
        .switch-container:has(input:not(:checked)):hover .slider {
          inset: 4px 45% 4px 4px;
          background: rgba(255, 255, 255, 0.3);
        }
      `}</style>
    </label>
  );
}
