import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * ScrollToTop Component
 * 在路由变化时自动滚动到页面顶部，防止页面跳动
 */
export function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    // 平滑滚动到顶部
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'instant' // 使用 instant 避免动画延迟
    });
  }, [pathname]);

  return null;
}
