import { useState } from 'react'

export function ActivityCarousel() {
  const [isPaused, setIsPaused] = useState(false)

  // 5张完整的活动图片
  const images = [
    'https://cy-747263170.imgix.net/aaasda.png',
    'https://cy-747263170.imgix.net/ss.png',
    'https://cy-747263170.imgix.net/ee.png',
    'https://cy-747263170.imgix.net/dd.png',
    'https://cy-747263170.imgix.net/ff.png'
  ]

  // 复制3次以确保无缝循环
  const duplicatedImages = [...images, ...images, ...images]

  return (
    <section className="relative py-12 lg:py-16 bg-black overflow-hidden">
      <style>{`
        @keyframes scroll-left-smooth {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-33.333%);
          }
        }

        .smooth-scroll-container {
          animation: scroll-left-smooth 30s linear infinite;
        }

        .smooth-scroll-container.paused {
          animation-play-state: paused;
        }

        .activity-image {
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }

        .activity-image:hover {
          transform: scale(1.05);
          box-shadow: 0 20px 60px rgba(163, 240, 48, 0.2);
        }

        /* 渐变遮罩 */
        .scroll-mask {
          mask-image: linear-gradient(
            to right,
            transparent 0%,
            black 10%,
            black 90%,
            transparent 100%
          );
          -webkit-mask-image: linear-gradient(
            to right,
            transparent 0%,
            black 10%,
            black 90%,
            transparent 100%
          );
        }
      `}</style>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* 滚动容器 */}
        <div 
          className="scroll-mask relative"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          <div className={`smooth-scroll-container flex gap-6 ${isPaused ? 'paused' : ''}`}>
            {duplicatedImages.map((image, index) => (
              <img
                key={`activity-${index}`}
                src={image}
                alt={`活动 ${(index % images.length) + 1}`}
                className="activity-image flex-shrink-0 h-40 md:h-48 lg:h-56 w-auto rounded-3xl object-contain cursor-pointer"
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
