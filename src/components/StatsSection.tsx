export function StatsSection() {
  return (
    <section className="relative h-[180px] lg:h-[220px] overflow-hidden flex items-center justify-center">
      <div className="absolute inset-0 flex items-center justify-center">
        <video
          className="w-full h-full object-contain opacity-100"
          autoPlay
          loop
          muted
          playsInline
          poster="https://www.okx.com/cdn/assets/imgs/2210/2763D233C494439D.jpg?x-oss-process=image/format,webp/ignore-error,1"
          style={{ 
            mixBlendMode: 'normal',
            filter: 'contrast(1.15) brightness(1.05)'
          }}
        >
          <source 
            src="https://www.okx.com/cdn/assets/files/2210/1F383F502741A3F160C6.mp4" 
            type="video/mp4" 
          />
          <source 
            src="https://www.okx.com/cdn/assets/files/2210/D47D930F643E7A00.webm" 
            type="video/webm" 
          />
        </video>
      </div>
    </section>
  )
}
