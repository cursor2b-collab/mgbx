import { useNavigate } from 'react-router-dom'
import { Button } from './ui/button'
import { ShootingStars } from './ui/shooting-stars'

export function ModernHero() {
  const navigate = useNavigate()

  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-black">
      {/* 纯黑色背景 */}
      <div className="absolute inset-0 bg-black" />
      
      {/* 星星背景 */}
      <div className="absolute inset-0">
        <div className="stars absolute inset-0" />
      </div>

      {/* 流星动画层 - 多层不同颜色和速度 */}
      <ShootingStars
        starColor="#A3F030"
        trailColor="#00ff88"
        minSpeed={15}
        maxSpeed={35}
        minDelay={1000}
        maxDelay={3000}
      />
      <ShootingStars
        starColor="#00B8FF"
        trailColor="#2EB9DF"
        minSpeed={10}
        maxSpeed={25}
        minDelay={2000}
        maxDelay={4000}
      />
      <ShootingStars
        starColor="#9E00FF"
        trailColor="#FF0099"
        minSpeed={20}
        maxSpeed={40}
        minDelay={1500}
        maxDelay={3500}
      />

      {/* 渐变光晕效果 */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(163,240,48,0.05)_0%,rgba(0,0,0,0)_60%)]" />

      {/* 内容区域 */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid lg:grid-cols-2 gap-12 xl:gap-20 items-center">
          {/* 左侧：文字内容 */}
          <div className="text-center lg:text-left">
            {/* 顶部标签 */}
            <div className="hero-fade-in text-white mb-8 lg:mb-14">
              <span className="text-lg sm:text-xl lg:text-[30px]" style={{ fontWeight: 400, lineHeight: '1.2' }}>
                安全 | 便捷 | 严格
              </span>
            </div>

            {/* 主标题 */}
            <h1 className="hero-fade-in-up text-white mb-4 lg:mb-7">
              <span 
                className="block text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-[70px]" 
                style={{ fontWeight: 900, lineHeight: '1.1', maxWidth: '850px' }}
              >
                智能交易 全资产覆盖
              </span>
            </h1>

            {/* 副标题 */}
            <p className="hero-fade-in-up hero-delay-200 text-white mb-8 lg:mb-12">
              <span 
                className="block text-xl sm:text-2xl md:text-3xl lg:text-[40px]" 
                style={{ fontWeight: 400, maxWidth: '850px' }}
              >
                让投资更自由
              </span>
            </p>

            {/* CTA 按钮 */}
            <div className="hero-fade-in-up hero-delay-300">
              <Button
                onClick={() => navigate('/trading')}
                size="lg"
                className="text-black text-lg px-12 py-7 rounded-full transition-all transform hover:scale-105 hover:shadow-[0_0_40px_rgba(163,240,48,0.6)]"
                style={{ fontWeight: 600, backgroundColor: '#A3F030' }}
              >
                去交易
              </Button>
            </div>
          </div>

          {/* 右侧：图片展示 */}
          <div className="hero-fade-in-up hero-delay-400 hidden lg:block">
            <img 
              src="https://cy-747263170.imgix.net/img1.png"
              alt="Trading Platform Preview"
              className="w-full h-auto"
            />
          </div>
        </div>
      </div>

      {/* 滚动提示 */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce z-20">
        <div className="w-6 h-10 rounded-full border-2 border-white/30 flex items-start justify-center p-2">
          <div className="w-1.5 h-3 rounded-full bg-[#A3F030]/70 animate-pulse" />
        </div>
      </div>

      <style>{`
        /* 动画 */
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .hero-fade-in {
          animation: fadeIn 1s ease-out forwards;
        }

        .hero-fade-in-up {
          animation: fadeInUp 1s ease-out forwards;
          opacity: 0;
        }

        .hero-delay-200 {
          animation-delay: 0.2s;
        }

        .hero-delay-300 {
          animation-delay: 0.3s;
        }

        .hero-delay-400 {
          animation-delay: 0.4s;
        }

        /* 星星背景 */
        .stars {
          background-image: 
            radial-gradient(1px 1px at 20px 30px, #fff, rgba(0,0,0,0)),
            radial-gradient(1px 1px at 40px 70px, #fff, rgba(0,0,0,0)),
            radial-gradient(1px 1px at 50px 160px, #ddd, rgba(0,0,0,0)),
            radial-gradient(1px 1px at 90px 40px, #fff, rgba(0,0,0,0)),
            radial-gradient(1px 1px at 130px 80px, #fff, rgba(0,0,0,0)),
            radial-gradient(1px 1px at 160px 120px, #ddd, rgba(0,0,0,0)),
            radial-gradient(1.5px 1.5px at 200px 50px, #A3F030, rgba(0,0,0,0)),
            radial-gradient(1.5px 1.5px at 250px 150px, #00B8FF, rgba(0,0,0,0)),
            radial-gradient(1px 1px at 300px 90px, #fff, rgba(0,0,0,0));
          background-repeat: repeat;
          background-size: 350px 250px;
          animation: twinkle 6s ease-in-out infinite;
          opacity: 0.4;
        }

        @keyframes twinkle {
          0%, 100% { 
            opacity: 0.3; 
          }
          50% { 
            opacity: 0.6; 
          }
        }
      `}</style>
    </section>
  )
}
