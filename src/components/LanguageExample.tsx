import { useLanguage } from '../contexts/LanguageContext';
import { Button } from './ui/button';

/**
 * 多语言使用示例组件
 * 
 * 这个组件展示了如何在应用中使用多语言功能
 */
export function LanguageExample() {
  const { t, language } = useLanguage();

  return (
    <div className="max-w-2xl mx-auto p-8 space-y-6 bg-slate-900 rounded-xl">
      <h2 className="text-2xl font-bold text-white">
        {t('common.info')}: {t('nav.language')}
      </h2>
      
      <div className="space-y-4">
        {/* 示例 1: 导航文本 */}
        <div className="p-4 bg-slate-800 rounded-lg">
          <h3 className="text-lg font-semibold text-white mb-2">导航菜单示例</h3>
          <div className="flex gap-2 flex-wrap">
            <span className="px-3 py-1 bg-[#A3F030]/10 text-[#A3F030] rounded">{t('nav.markets')}</span>
            <span className="px-3 py-1 bg-[#A3F030]/10 text-[#A3F030] rounded">{t('nav.trading')}</span>
            <span className="px-3 py-1 bg-[#A3F030]/10 text-[#A3F030] rounded">{t('nav.assets')}</span>
            <span className="px-3 py-1 bg-[#A3F030]/10 text-[#A3F030] rounded">{t('nav.deposit')}</span>
          </div>
        </div>

        {/* 示例 2: 交易文本 */}
        <div className="p-4 bg-slate-800 rounded-lg">
          <h3 className="text-lg font-semibold text-white mb-2">交易界面示例</h3>
          <div className="grid grid-cols-2 gap-2">
            <Button className="bg-[#A3F030] text-black hover:bg-[#A3F030]/90">
              {t('trading.buy')}
            </Button>
            <Button className="bg-red-500 text-white hover:bg-red-600">
              {t('trading.sell')}
            </Button>
          </div>
          <div className="mt-3 space-y-2">
            <p className="text-gray-300 text-sm">{t('trading.price')}: $45,000</p>
            <p className="text-gray-300 text-sm">{t('trading.amount')}: 0.5 BTC</p>
            <p className="text-gray-300 text-sm">{t('trading.total')}: $22,500</p>
          </div>
        </div>

        {/* 示例 3: 通用文本 */}
        <div className="p-4 bg-slate-800 rounded-lg">
          <h3 className="text-lg font-semibold text-white mb-2">通用文本示例</h3>
          <div className="flex gap-2 flex-wrap">
            <Button variant="outline" className="border-gray-600 text-gray-300">
              {t('common.search')}
            </Button>
            <Button variant="outline" className="border-gray-600 text-gray-300">
              {t('common.filter')}
            </Button>
            <Button variant="outline" className="border-gray-600 text-gray-300">
              {t('common.confirm')}
            </Button>
            <Button variant="outline" className="border-gray-600 text-gray-300">
              {t('common.cancel')}
            </Button>
          </div>
        </div>

        {/* 当前语言信息 */}
        <div className="p-4 bg-slate-800 rounded-lg">
          <p className="text-gray-300">
            当前语言 / Current Language: <span className="text-[#A3F030] font-bold">{language.toUpperCase()}</span>
          </p>
        </div>
      </div>

      {/* 使用说明 */}
      <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
        <h4 className="text-blue-400 font-semibold mb-2">💡 如何使用多语言功能</h4>
        <pre className="text-xs text-gray-300 bg-slate-800 p-3 rounded overflow-x-auto">
{`// 1. 导入 useLanguage hook
import { useLanguage } from '../contexts/LanguageContext';

// 2. 在组件中使用
function MyComponent() {
  const { t, language, setLanguage } = useLanguage();
  
  return (
    <div>
      <h1>{t('hero.title')}</h1>
      <button onClick={() => setLanguage('en')}>
        {t('nav.login')}
      </button>
    </div>
  );
}`}
        </pre>
      </div>
    </div>
  );
}
