import { useNavigate } from 'react-router-dom'
import { useRef, useState, useEffect } from 'react'
import { Button } from './ui/button'
import { Card, CardContent } from './ui/card'
import { 
  Shield, 
  Zap, 
  Users, 
  DollarSign,
  ArrowRight,
  Lock,
  Smartphone,
  Globe
} from 'lucide-react'
import { useAuth } from '../hooks/useAuth'
import { useLanguage } from '../contexts/LanguageContext'
import { Navbar } from './Navbar'
import { PriceTickerBanner } from './PriceTickerBanner'
import { TradingViewWidget } from './TradingViewWidget'
import { FlickeringFooter } from './ui/flickering-footer'
import { HeroScrollSection } from './HeroScrollSection'
import { ModernHero } from './ModernHero'
import { StatsSection } from './StatsSection'
import { ActivityCarousel } from './ActivityCarousel'
import { WhyChooseUs } from './WhyChooseUs'
import { MarketTrends } from './MarketTrends'
import { MobileBottomNav } from './MobileBottomNav'
import { MobileHomepage } from './MobileHomepage'
import { ImageWithFallback } from './figma/ImageWithFallback'
import { motion, useInView } from 'motion/react'

const FEATURES = [
  {
    icon: Shield,
    title: '银行级安全',
    description: '冷热钱包分离，多重签名技术，资产安全无忧'
  },
  {
    icon: Zap,
    title: '极速交易',
    description: '撮合引擎处理速度达100万笔/秒'
  },
  {
    icon: DollarSign,
    title: '低手续费',
    description: 'Maker 0.08%, Taker 0.1%，VIP 更优惠'
  },
  {
    icon: Users,
    title: '全球服务',
    description: '支持100+国家和地区，24/7客户服务'
  },
  {
    icon: Smartphone,
    title: '移动优先',
    description: 'iOS、Android 应用，随时随地交易'
  },
  {
    icon: Globe,
    title: '多语言支持',
    description: '支持20+语言，全球用户友好'
  }
]

const STATS = [
  { label: '注册用户', value: '5000万+' },
  { label: '24h交易量', value: '$120亿+' },
  { label: '上线币种', value: '350+' },
  { label: '国家覆盖', value: '180+' }
]

export function CryptoExchangeHomepage() {
  const navigate = useNavigate()
  const { user, isAuthenticated } = useAuth()
  const { t } = useLanguage()
  const ctaRef = useRef(null)
  const isInView = useInView(ctaRef, { once: true, amount: 0.3 })
  const [isMobile, setIsMobile] = useState(false)

  // 检测是否为移动设备
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 992)
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // 如果是移动设备，显示移动端布局
  if (isMobile) {
    return (
      <>
        <Navbar />
        <MobileHomepage />
        <MobileBottomNav />
      </>
    )
  }

  // 桌面端布局
  return (
    <div className="min-h-screen bg-black">
      {/* 新的导航栏 */}
      <Navbar />

      {/* Price Ticker Banner */}
      <PriceTickerBanner />

      {/* Modern Hero Section */}
      <ModernHero />

      {/* Stats Section */}
      <StatsSection />

      {/* Activity Carousel */}
      <ActivityCarousel />

      {/* Why Choose Us */}
      <WhyChooseUs />

      {/* Market Trends - New Design */}
      <MarketTrends />

      {/* Hero Scroll Section - Trading Chart */}
      <HeroScrollSection />

      {/* Pre-Footer CTA Section */}
      <section ref={ctaRef} className="w-full bg-black mt-20 md:mt-32 lg:mt-40 relative">
        {/* Background Image */}
        <ImageWithFallback 
          src="https://cy-747263170.imgix.net/QQ20251104-222001.png"
          alt="Crypto Platform"
          className="w-full h-auto block"
        />
        
        {/* Overlay Content */}
        <div className="absolute inset-0 flex items-center justify-start px-6 md:px-12 lg:px-20">
          <div className="flex flex-col items-start max-w-2xl">
            <motion.h2 
              initial={{ opacity: 0, y: 50 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl text-white mb-4 md:mb-6 leading-tight"
              style={{ lineHeight: '1.3' }}
            >
              {t('homepage.cta.title')}
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0, y: 50 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-base md:text-lg lg:text-xl text-gray-200 mb-6 md:mb-8"
            >
              {t('homepage.cta.description')}
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              <Button 
                onClick={() => navigate('/trading')}
                className="bg-[#A3F030] hover:bg-[#8FD622] text-black px-8 md:px-12 py-4 md:py-6 text-base md:text-lg rounded-full transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                {t('homepage.cta.button')}
              </Button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <FlickeringFooter />
      
      {/* Mobile Bottom Navigation */}
      <MobileBottomNav />
    </div>
  )
}