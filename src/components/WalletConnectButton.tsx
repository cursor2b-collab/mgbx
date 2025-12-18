import React, { useState } from 'react';
import { useAccount } from 'wagmi';

// 钱包图标组件
const WalletIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#C5FF30" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M19 7V4a1 1 0 0 0-1-1H5a2 2 0 0 0 0 4h15a1 1 0 0 1 1 1v4h-3a2 2 0 0 0 0 4h3a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1" />
    <path d="M3 5h14a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2z" />
  </svg>
);

interface WalletConnectButtonProps {
  disabled?: boolean;
  isLoading?: boolean;
  fullWidth?: boolean; // 是否全宽显示（用于注册页面）
}

export function WalletConnectButton({ disabled = false, isLoading = false, fullWidth = false }: WalletConnectButtonProps) {
  const { address, isConnected } = useAccount();
  const [buttonId] = useState(() => `wallet-button-${Math.random().toString(36).substr(2, 9)}`);

  const handleClick = () => {
    // 查找对应的隐藏 appkit-button 并触发点击
    const hiddenButton = document.getElementById(buttonId) as HTMLElement;
    if (hiddenButton) {
      hiddenButton.click();
    } else {
      // 如果找不到，尝试查找页面上的任何 appkit-button
      const appkitButton = document.querySelector('appkit-button') as HTMLElement;
      if (appkitButton) {
        appkitButton.click();
      }
    }
  };

  // 格式化地址显示
  const formatAddress = (addr: string) => {
    if (!addr) return '';
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  return (
    <>
      {/* 隐藏的 appkit-button，用于触发连接模态框 */}
      <appkit-button 
        id={buttonId}
        style={{ 
          position: 'absolute',
          opacity: 0,
          pointerEvents: 'none',
          width: '1px',
          height: '1px',
          overflow: 'hidden',
          zIndex: -1
        }} 
      />
      
      {/* 自定义样式的按钮 */}
      <button
        onClick={handleClick}
        disabled={disabled || isLoading}
        style={{
          ...(fullWidth ? { width: '100%' } : { flex: 1 }),
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '12px',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: '16px',
          padding: '16px',
          backgroundColor: 'transparent',
          color: '#fff',
          fontSize: '14px',
          cursor: (disabled || isLoading) ? 'not-allowed' : 'pointer',
          opacity: (disabled || isLoading) ? 0.5 : 1,
          transition: 'background-color 0.2s',
          fontFamily: 'inherit',
        }}
        onMouseEnter={(e) => {
          if (!disabled && !isLoading) {
            e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.05)';
          }
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = 'transparent';
        }}
      >
        <WalletIcon />
        <span>{isConnected && address ? formatAddress(address) : '钱包'}</span>
      </button>
    </>
  );
}

