import { useNavigate } from 'react-router-dom'
import { Button } from './ui/button'
import { ArrowLeft, Construction } from 'lucide-react'

interface PlaceholderPageProps {
  title: string
  description?: string
}

export function PlaceholderPage({ title, description }: PlaceholderPageProps) {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="text-center max-w-2xl">
        <div className="mb-8">
          <Construction className="w-24 h-24 mx-auto text-[#A3F030] mb-6 animate-pulse" />
          <h1 className="text-4xl md:text-5xl text-white mb-4">{title}</h1>
          <p className="text-xl text-white/70 mb-2">正在开发中...</p>
          {description && (
            <p className="text-white/50">{description}</p>
          )}
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            onClick={() => navigate(-1)}
            variant="outline"
            className="border-white/20 text-white hover:bg-white/10"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            返回上一页
          </Button>
          <Button
            onClick={() => navigate('/')}
            className="bg-[#A3F030] hover:bg-[#8FD622] text-black"
          >
            返回首页
          </Button>
        </div>

        <div className="mt-12 pt-8 border-t border-white/10">
          <h3 className="text-white/70 mb-4">快速访问</h3>
          <div className="flex flex-wrap gap-3 justify-center">
            <Button
              onClick={() => navigate('/trading')}
              variant="ghost"
              className="text-white/60 hover:text-white hover:bg-white/5"
            >
              加密货币交易
            </Button>
            <Button
              onClick={() => navigate('/stocks')}
              variant="ghost"
              className="text-white/60 hover:text-white hover:bg-white/5"
            >
              股票交易
            </Button>
            <Button
              onClick={() => navigate('/forex')}
              variant="ghost"
              className="text-white/60 hover:text-white hover:bg-white/5"
            >
              外汇交易
            </Button>
            <Button
              onClick={() => navigate('/mobile')}
              variant="ghost"
              className="text-white/60 hover:text-white hover:bg-white/5"
            >
              移动交易
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
