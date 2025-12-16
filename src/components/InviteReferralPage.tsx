import { useState } from 'react'
import { Button } from './ui/button'
import { Card } from './ui/card'
import { Input } from './ui/input'
import { Navbar } from './Navbar'
import { MobileBottomNav } from './MobileBottomNav'
import { CheckCircle2, Copy } from 'lucide-react'
import { useLanguage } from '../contexts/LanguageContext'

export function InviteReferralPage() {
  const [copied, setCopied] = useState(false)
  const { t } = useLanguage()

  const referralCode = 'CRYPTONX-2025'
  const referralLink = `${typeof window !== 'undefined' ? window.location.origin : ''}/auth?ref=${referralCode}`

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(referralLink)
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    } catch (error) {
      console.error('复制邀请链接失败:', error)
    }
  }

  return (
    <div className="min-h-screen bg-black text-white pb-24">
      <Navbar />

      <main className="max-w-3xl mx-auto px-4 py-12 space-y-8">
        <header className="space-y-2 text-center">
          <h1 className="text-3xl font-semibold">邀请返佣计划</h1>
          <p className="text-white/60 text-sm">
            邀请好友注册并完成交易，您可永久获得交易手续费返佣，好友也能享受手续费优惠。
          </p>
        </header>

        <Card className="bg-white/5 border-white/10 p-6 space-y-5">
          <div className="space-y-3">
            <h2 className="text-lg font-semibold">专属邀请链接</h2>
            <div className="flex flex-col sm:flex-row gap-3">
              <Input
                readOnly
                value={referralLink}
                className="bg-white/5 border-white/10 text-white"
              />
              <Button
                onClick={handleCopy}
                className="bg-[#A3F030] hover:bg-[#8FD622] text-black flex items-center justify-center gap-2"
              >
                {copied ? (
                  <>
                    <CheckCircle2 className="w-4 h-4" /> 已复制
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" /> 复制链接
                  </>
                )}
              </Button>
            </div>
          </div>

          <div className="grid sm:grid-cols-3 gap-4">
            <div className="bg-[#A3F030]/10 border border-[#A3F030]/20 rounded-lg p-4 space-y-1">
              <p className="text-sm text-white/60">返佣比例</p>
              <p className="text-2xl font-bold text-[#A3F030]">30%</p>
              <p className="text-xs text-white/50">实时发放到账</p>
            </div>
            <div className="bg-white/5 border-white/10 rounded-lg p-4 space-y-1">
              <p className="text-sm text-white/60">好友奖励</p>
              <p className="text-2xl font-bold text-white">20%</p>
              <p className="text-xs text-white/50">享受手续费折扣</p>
            </div>
            <div className="bg-white/5 border-white/10 rounded-lg p-4 space-y-1">
              <p className="text-sm text-white/60">活动时间</p>
              <p className="text-2xl font-bold text-white">长期有效</p>
              <p className="text-xs text-white/50">随时邀请好友加入</p>
            </div>
          </div>

          <div className="space-y-2 text-sm text-white/70 leading-relaxed">
            <p>1. 邀请好友通过上述链接注册并完成首次交易，即可触发返佣。</p>
            <p>
              2. 返佣将以 USDT 记录，可在「资产 {'>'} 返佣账户」中查看。
            </p>
            <p>3. 如需更多推广素材，请联系官方客服，获取专属投放资源。</p>
          </div>
        </Card>
      </main>

      <MobileBottomNav />
    </div>
  )
}
