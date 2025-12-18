import { useLanguage } from '../contexts/LanguageContext';
import { useState, useRef, useEffect } from 'react';

export function LanguageSelector() {
  const { language, setLanguage, t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const languages = [
    { code: 'zh' as const, name: '中文', flag: '🇨🇳' },
    { code: 'en' as const, name: 'English', flag: '🇺🇸' },
    { code: 'ja' as const, name: '日本語', flag: '🇯🇵' },
    { code: 'ko' as const, name: '한국어', flag: '🇰🇷' },
    { code: 'es' as const, name: 'Español', flag: '🇪🇸' },
    { code: 'fr' as const, name: 'Français', flag: '🇫🇷' },
    { code: 'de' as const, name: 'Deutsch', flag: '🇩🇪' },
    { code: 'ru' as const, name: 'Русский', flag: '🇷🇺' },
  ];

  const currentLanguage = languages.find(lang => lang.code === language);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 transition-colors text-white"
      >
        <svg 
          className="w-5 h-5" 
          viewBox="0 0 1024 1024" 
          version="1.1" 
          xmlns="http://www.w3.org/2000/svg"
          fill="currentColor"
        >
          <path d="M298.15296 714.53696c9.216 64 23.04 122.88 40.448 172.544 17.408 49.152 38.912 92.16 65.024 124.416l-3.584-5.12c-158.72-35.84-288.768-145.92-352.768-291.84h250.88z m328.192 291.328l-2.048 0.512c24.576-31.232 45.056-72.704 61.44-119.296 17.408-49.664 31.232-108.032 40.448-172.544h250.88c-64 145.408-193.024 254.976-350.72 291.328z m-3.072-290.816c-8.192 52.736-19.968 99.328-33.792 138.752-14.848 43.008-31.744 73.728-47.616 93.184-16.384 19.456-26.624 21.504-30.208 21.504-3.584 0-13.824-2.048-30.208-21.504-15.872-19.456-32.768-50.176-47.616-93.184-13.824-39.424-25.088-86.528-33.792-138.752h223.232z m-335.872-304.64c-2.048 32.768-3.584 67.072-3.584 101.376s1.024 68.608 3.584 101.376h-271.872c-6.656-32.768-10.24-66.56-10.24-101.376s3.584-68.608 10.24-101.376h271.872z m347.648 0c2.56 32.768 3.584 66.56 3.584 101.376 0 34.816-1.024 68.608-3.584 101.376h-246.272c-2.56-32.768-3.584-66.56-3.584-101.376s1.024-68.608 3.584-101.376h246.272z m384 101.376c0 34.816-3.584 68.608-10.24 101.376h-271.872c2.048-32.768 3.584-67.072 3.584-101.376s-1.024-68.608-3.584-101.376h271.872c6.656 32.768 10.24 67.072 10.24 101.376z m-619.008-494.592c-24.576 31.232-45.056 72.704-61.44 119.296-17.408 49.664-31.232 108.032-40.448 172.544h-250.88c63.488-144.896 193.024-254.464 350.72-290.816l2.048-1.024z m112.128 38.4c3.584 0 13.824 2.048 30.208 21.504 15.872 19.456 32.768 50.176 47.616 93.184 13.824 39.424 25.088 86.528 33.792 138.752h-223.232c8.192-52.736 19.968-99.328 33.792-138.752 14.848-43.008 31.744-73.728 47.616-93.184 16.384-19.456 26.624-21.504 30.208-21.504z m464.384 253.44h-250.88c-9.216-64-23.04-122.88-40.448-172.544-17.408-49.152-38.912-92.16-65.024-124.416l3.584 5.12c158.72 35.84 289.28 145.92 352.768 291.84z" />
        </svg>
        <span className="text-sm">{currentLanguage?.flag} {currentLanguage?.name}</span>
      </button>

      {isOpen && (
        <div className="absolute top-full mt-2 right-0 w-48 bg-[#1A1A1A] border border-white/10 rounded-lg shadow-xl overflow-hidden z-50">
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => {
                setLanguage(lang.code);
                setIsOpen(false);
              }}
              className={`w-full px-4 py-2.5 text-left hover:bg-white/5 transition-colors flex items-center gap-3 ${
                language === lang.code ? 'bg-[#A3F030]/10 text-[#A3F030]' : 'text-white'
              }`}
            >
              <span className="text-lg">{lang.flag}</span>
              <span className="text-sm">{lang.name}</span>
              {language === lang.code && (
                <span className="ml-auto text-[#A3F030]">✓</span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
