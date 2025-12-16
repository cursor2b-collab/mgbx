import { SignInPage } from './ui/sign-in-flow-1';
import { LanguageSelector } from './LanguageSelector';

export function Modern3DAuth() {
  return (
    <div className="relative">
      {/* 语言选择器 - 固定在右上角 */}
      <div className="fixed top-4 right-4 z-50">
        <LanguageSelector />
      </div>
      <SignInPage className="text-right text-justify" />
    </div>
  );
}