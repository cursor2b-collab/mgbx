import React, { useState } from 'react';

export function CryptoGallerySlider() {
  const [isPaused, setIsPaused] = useState(false)

  // Cryptocurrency and trading themed images
  const images = [
    "https://images.unsplash.com/photo-1621761191319-c6fb62004040?q=80&w=2000&auto=format&fit=crop", // Crypto coins
    "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?q=80&w=2000&auto=format&fit=crop", // Bitcoin
    "https://images.unsplash.com/photo-1518546305927-5a555bb7020d?q=80&w=2000&auto=format&fit=crop", // Crypto trading
    "https://images.unsplash.com/photo-1642104704074-907c0698cbd9?q=80&w=2000&auto=format&fit=crop", // Digital currency
    "https://images.unsplash.com/photo-1640340434855-6084b1f4901c?q=80&w=2000&auto=format&fit=crop", // Cryptocurrency
    "https://images.unsplash.com/photo-1644361566696-3d442b5b482a?q=80&w=2000&auto=format&fit=crop", // Blockchain
    "https://images.unsplash.com/photo-1622630998477-20aa696ecb05?q=80&w=2000&auto=format&fit=crop", // Trading charts
    "https://images.unsplash.com/photo-1643916861364-02e63ce3e52f?q=80&w=2000&auto=format&fit=crop", // Crypto wallet
  ];

  // 复制3次以确保无缝循环
  const duplicatedImages = [...images, ...images, ...images];

  return (
    <section className="relative py-16 lg:py-20 bg-black overflow-hidden">
      <style>{`
        @keyframes scroll-left-continuous {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-33.333%);
          }
        }

        .continuous-scroll {
          animation: scroll-left-continuous 40s linear infinite;
        }

        .continuous-scroll.paused {
          animation-play-state: paused;
        }

        .crypto-image-item {
          transition: transform 0.4s ease, filter 0.4s ease, box-shadow 0.4s ease;
        }

        .crypto-image-item:hover {
          transform: scale(1.08) translateY(-8px);
          filter: brightness(1.15);
          box-shadow: 0 20px 60px rgba(163, 240, 48, 0.3);
        }

        .gallery-mask {
          mask-image: linear-gradient(
            to right,
            transparent 0%,
            black 5%,
            black 95%,
            transparent 100%
          );
          -webkit-mask-image: linear-gradient(
            to right,
            transparent 0%,
            black 5%,
            black 95%,
            transparent 100%
          );
        }
      `}</style>
      
      {/* Background decorative elements */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,#000_70%,transparent_110%)]" />
      
      {/* Section Title */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
        <div className="text-center">
          <h2 className="text-3xl lg:text-4xl text-white mb-4">
            探索加密世界
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            加入全球数百万用户，体验安全、快捷的加密货币交易
          </p>
        </div>
      </div>
      
      {/* Scrolling images container */}
      <div 
        className="gallery-mask relative z-10 w-full"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        <div className={`continuous-scroll flex gap-6 ${isPaused ? 'paused' : ''}`}>
          {duplicatedImages.map((image, index) => (
            <img
              key={`crypto-${index}`}
              src={image}
              alt={`Crypto gallery ${(index % images.length) + 1}`}
              className="crypto-image-item flex-shrink-0 w-56 h-56 md:w-72 md:h-72 lg:w-80 lg:h-80 rounded-3xl object-cover shadow-2xl"
              loading="lazy"
            />
          ))}
        </div>
      </div>
      
      {/* Bottom gradient overlay */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black via-black/50 to-transparent z-20 pointer-events-none" />
      
      {/* Top gradient overlay */}
      <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-black via-black/50 to-transparent z-20 pointer-events-none" />
    </section>
  );
}
