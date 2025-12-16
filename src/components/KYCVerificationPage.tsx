import { useNavigate } from 'react-router-dom'
import { Button } from './ui/button'
import { Card } from './ui/card'
import { Navbar } from './Navbar'
import { MobileBottomNav } from './MobileBottomNav'

const steps = [
  {
    title: '提交基本信息',
    description: '填写您的姓名、身份证件照片以及居住地址，以便完成身份识别。',
  },
  {
    title: '上传验证材料',
    description: '支持身份证、护照或驾驶证，请确保照片清晰、无遮挡。',
  },
  {
    title: '审核结果通知',
    description: '我们将在 24 小时内完成审核，并通过站内信与邮箱通知您结果。',
  },
]

export function KYCVerificationPage() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-black text-white pb-24">
      <Navbar />

      <main className="max-w-3xl mx-auto px-4 py-12 space-y-8">
        <div className="space-y-3 text-center">
          <h1 className="text-3xl font-semibold">KYC 实名认证</h1>
          <p className="text-white/60 text-sm">
            根据监管要求，我们需要对您的身份进行验证，以保障账户与资产安全。
          </p>
        </div>

        <Card className="bg-white/5 border-white/10 p-6 space-y-6">
          <div>
            <h2 className="text-xl font-semibold mb-4">认证步骤</h2>
            <div className="space-y-4">
              {steps.map((step, index) => (
                <div key={step.title} className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-[#A3F030]/10 flex items-center justify-center text-[#A3F030] font-semibold">
                    {index + 1}
                  </div>
                  <div>
                    <h3 className="text-white text-base font-medium">{step.title}</h3>
                    <p className="text-white/60 text-sm leading-relaxed">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-[#A3F030]/10 border border-[#A3F030]/20 rounded-xl p-4 text-sm text-white/80">
            <p>
              如果您在提交材料过程中遇到问题，可随时通过 Telegram <span className="text-[#A3F030]">@support</span>{' '}
              或邮件 <span className="text-[#A3F030]">support@cryptonx.com</span> 联系客服。
            </p>
          </div>

          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
            <Button
              onClick={() => navigate('/profile')}
              className="bg-[#A3F030] hover:bg-[#8FD622] text-black w-full sm:w-auto"
            >
              前往个人中心上传资料
            </Button>
            <Button
              variant="outline"
              onClick={() => window.open('https://t.me/Haixinx', '_blank')}
              className="border-white/20 text-white hover:bg-white/10 w-full sm:w-auto"
            >
              联系客服获取帮助
            </Button>
          </div>
        </Card>
      </main>

      <MobileBottomNav />
    </div>
  )
}
