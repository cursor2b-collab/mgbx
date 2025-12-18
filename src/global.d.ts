// global.d.ts
import 'react';

declare global {
  namespace JSX {
    interface IntrinsicElements {
      /**
       * AppKit 按钮 Web 组件。由 AppKit 全局注册。
       */
      'appkit-button': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
    }
  }
}

// Vite 环境变量类型声明
interface ImportMetaEnv {
  readonly VITE_PROJECT_ID?: string;
  readonly NEXT_PUBLIC_PROJECT_ID?: string;
  readonly VITE_SUPABASE_URL?: string;
  readonly VITE_SUPABASE_ANON_KEY?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

// 确保文件被视为模块
export {};

