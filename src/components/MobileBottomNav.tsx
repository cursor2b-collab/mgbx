import React, { useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import '../styles/MobileBottomNav.css';

export function MobileBottomNav() {
  const location = useLocation();
  const { isAuthenticated } = useAuth();
  const navRef = useRef<HTMLDivElement>(null);
  const [gliderStyle, setGliderStyle] = useState({ width: 0, left: 0 });
  const [isInitialized, setIsInitialized] = useState(false);

  const getActiveIndex = () => {
    const pathname = location.pathname;
    
    // 首页精确匹配
    if (pathname === '/') return 0;
    // 行情页
    if (pathname.startsWith('/markets')) return 1;
    // 交易页
    if (pathname.startsWith('/trading') || 
        pathname.startsWith('/forex') || 
        pathname.startsWith('/stock') || 
        pathname.startsWith('/futures')) return 2;
    // 资产页
    if (pathname.startsWith('/profile') || pathname.startsWith('/login')) return 3;
    
    return 0; // 默认首页
  };

  const updateGliderPosition = () => {
    const activeIndex = getActiveIndex();
    if (navRef.current) {
      const buttons = navRef.current.querySelectorAll('.nav-button-mobile');
      if (buttons[activeIndex]) {
        const button = buttons[activeIndex] as HTMLElement;
        const width = button.offsetWidth;
        const left = button.offsetLeft;
        
        console.log(`🎯 滑块移动: 索引=${activeIndex}, 宽度=${width}px, 位置=${left}px`);
        
        setGliderStyle({ width, left });
      }
    }
  };

  // 初始化滑块位置（组件挂载时）
  useEffect(() => {
    // 立即更新位置（无动画）
    updateGliderPosition();
    
    // 延迟启用过渡动画
    const timer = setTimeout(() => {
      setIsInitialized(true);
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);

  // 路由变化时更新滑块位置
  useEffect(() => {
    updateGliderPosition();
  }, [location.pathname, isAuthenticated]);

  const isActive = (path: string, exact: boolean = false) => {
    if (exact) {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };

  const activeIndex = getActiveIndex();

  return (
    <div className="aiz-mobile-bottom-nav">
      {/* 左侧：主导航横向长条容器 */}
      <div className="main-nav-glass-mobile">
        {/* 玻璃扭曲层 */}
        <div className="glass-distortion-layer-mobile"></div>
        
        {/* 主玻璃表面 */}
        <div className="main-glass-surface-mobile"></div>
        
        {/* 全息渐变叠加 */}
        <div className="holographic-overlay-mobile"></div>

        {/* 玻璃内容 */}
        <div className="glass-content-mobile" ref={navRef}>
          {/* 动态滑块 */}
          {gliderStyle.width > 0 && (
            <span 
              className={`glider-mobile ${isInitialized ? 'glider-animated' : ''}`}
              style={{
                '--glider-width': `${gliderStyle.width}px`,
                '--glider-x': `${gliderStyle.left}px`
              } as React.CSSProperties}
            ></span>
          )}

          {/* 首页按钮 */}
          <Link 
            to="/" 
            className={`nav-button-mobile ${isActive('/', true) ? 'active' : ''}`}
          >
            <svg className="nav-icon-mobile" width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M19.6292 12.6938C19.3632 14.0638 18.5712 15.2191 17.4876 15.9673C17.5106 15.8782 17.5315 15.7881 17.5492 15.6968L18.2494 12.0845C19.0864 7.76466 15.7775 3.75342 11.3773 3.75342L7.57944 3.75342C8.46493 3.06044 9.57645 2.65283 10.7689 2.65283L21.5785 2.65283L19.6292 12.6938Z" fill="currentColor" />
              <path d="M2.48597 8.90722C2.94929 6.49428 5.06037 4.75 7.51738 4.75L11.5302 4.75C15.1462 4.75 17.8676 8.0436 17.1857 11.5948L16.4182 15.5919C16.0105 17.7151 14.1529 19.25 11.9908 19.25L0.5 19.25L2.48597 8.90722Z" fill="currentColor" />
            </svg>
            <p className="nav-label-mobile">首頁</p>
          </Link>

          {/* 行情按钮 */}
          <Link 
            to="/markets" 
            className={`nav-button-mobile ${isActive('/markets') ? 'active' : ''}`}
          >
            <svg className="nav-icon-mobile" width="22" height="23" viewBox="0 0 22 23" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M15.9995 2.25001C18.2086 2.25001 19.9997 4.04113 19.9997 6.25027L20.0004 16.2499C20.0004 18.459 18.2092 20.2501 16.0002 20.2502H2.00027V15.9039L6.2878 11.8236L9.11622 14.652L13.5356 10.2326L15.1266 11.8236L15.4802 7.22738L10.884 7.58093L12.475 9.17192L9.11622 12.5307L6.2878 9.70225L2.00027 13.8185L2.00027 6.25027C2.00027 4.04113 3.7914 2.25001 6.00053 2.25001H15.9995Z" fill="currentColor" />
            </svg>
            <p className="nav-label-mobile">行情</p>
          </Link>

          {/* 交易按钮 - 直接跳转到交易页面 */}
          <Link 
            to="/trading"
            className={`nav-button-mobile ${isActive('/trading') || isActive('/forex') || isActive('/stock') || isActive('/futures') ? 'active' : ''}`}
          >
            <svg className="nav-icon-mobile" width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M20.5 16C20.5 18.2091 18.7091 20 16.5 20H15.2979L16.46 19.6885C19.1271 18.9738 20.7105 16.2326 19.9961 13.5654L16.8965 2H20.5V16Z" fill="currentColor" />
              <path d="M19.03 13.8238C19.6018 15.9576 18.3354 18.151 16.2016 18.7227L5.09344 21.6992L1.46997 8.1762C0.898201 6.04234 2.16453 3.84899 4.2984 3.27722L15.4065 0.300805L19.03 13.8238ZM5.59714 11.9879L5.98537 13.4368L10.815 12.1427L10.4268 10.6938L5.59714 11.9879ZM4.56186 8.12419L4.95009 9.57308L14.1264 7.1143L13.7382 5.66541L4.56186 8.12419Z" fill="currentColor" />
            </svg>
            <p className="nav-label-mobile">交易</p>
          </Link>

          {/* 资产按钮 */}
          <Link 
            to="/profile"
            className={`nav-button-mobile ${isActive('/profile') || isActive('/login') ? 'active' : ''}`}
          >
            <svg className="nav-icon-mobile" width="22" height="23" viewBox="0 0 22 23" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M17.5 3.75C19.1569 3.75 20.5 5.09315 20.5 6.75V8H16.75C14.817 8 13.25 9.567 13.25 11.5C13.25 13.433 14.817 15 16.75 15H20.5V16.25C20.5 17.9069 19.1569 19.25 17.5 19.25H2V6.75C2 5.09315 3.34315 3.75 5 3.75H17.5ZM20.5 13.75H16.75C15.5074 13.75 14.5 12.7426 14.5 11.5C14.5 10.2574 15.5074 9.25 16.75 9.25H20.5V13.75ZM16.75 10.75C16.3358 10.75 16 11.0858 16 11.5C16 11.9142 16.3358 12.25 16.75 12.25C17.1642 12.25 17.5 11.9142 17.5 11.5C17.5 11.0858 17.1642 10.75 16.75 10.75Z" fill="currentColor" />
            </svg>
            <p className="nav-label-mobile">資產</p>
          </Link>
        </div>
      </div>

      {/* 右侧：独立圆形搜索按钮 */}
      <div className="search-button-container-mobile">
        {/* 玻璃扭曲层 */}
        <div className="glass-distortion-layer-mobile"></div>
        
        {/* 玻璃表面 */}
        <div className="search-glass-surface-mobile"></div>
        
        {/* 全息叠加 */}
        <div className="search-holographic-overlay-mobile"></div>

        {/* 搜索按钮 */}
        <a
          href="https://t.me/Haixinx"
          className="search-button-mobile"
          target="_blank"
          rel="noopener noreferrer"
        >
          {/* 左移扫光效果 */}
          <div className="search-sweep-light-mobile"></div>
          
          <div className="search-shine-main-mobile"></div>
          <div className="search-shine-secondary-mobile"></div>
          <div className="search-glow-pulse-mobile"></div>
          <video
            src="/IMG_7907.MP4"
            className="w-full h-full object-cover rounded-full"
            autoPlay
            loop
            muted
            playsInline
          />
        </a>
      </div>

    </div>
  );
}