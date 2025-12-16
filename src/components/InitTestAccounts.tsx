import { useState } from 'react'
import { Button } from './ui/button'
import { toast } from 'sonner'
import { Loader2, CheckCircle, XCircle, AlertCircle } from 'lucide-react'
import { projectId, publicAnonKey } from '../utils/supabase/info'

export function InitTestAccounts() {
  const [isInitializing, setIsInitializing] = useState(false)
  const [initResult, setInitResult] = useState<any>(null)

  const handleInitialize = async () => {
    setIsInitializing(true)
    setInitResult(null)

    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-2d551b3c/init-test-accounts`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${publicAnonKey}`
          }
        }
      )

      const data = await response.json()

      if (data.success) {
        setInitResult(data)
        toast.success('测试账号初始化完成！', {
          description: `创建: ${data.created} | 已存在: ${data.existing} | 失败: ${data.failed}`
        })
      } else {
        throw new Error(data.error || '初始化失败')
      }
    } catch (error: any) {
      console.error('初始化测试账号错误:', error)
      toast.error('初始化失败', {
        description: error.message
      })
    } finally {
      setIsInitializing(false)
    }
  }

  return (
    <div className="space-y-4">
      <Button
        onClick={handleInitialize}
        disabled={isInitializing}
        className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
      >
        {isInitializing ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            初始化中...
          </>
        ) : (
          '初始化测试账号'
        )}
      </Button>

      {initResult && (
        <div className="bg-[#1A1A1A] border border-white/10 rounded-xl p-4 space-y-3">
          <div className="flex items-center gap-2 pb-2 border-b border-white/10">
            <CheckCircle className="w-5 h-5 text-green-400" />
            <span className="text-white">初始化结果</span>
          </div>

          <div className="grid grid-cols-3 gap-3 text-sm">
            <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-2 text-center">
              <div className="text-2xl text-green-400">{initResult.created}</div>
              <div className="text-green-300/70 text-xs">已创建</div>
            </div>
            <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-2 text-center">
              <div className="text-2xl text-blue-400">{initResult.existing}</div>
              <div className="text-blue-300/70 text-xs">已存在</div>
            </div>
            <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-2 text-center">
              <div className="text-2xl text-red-400">{initResult.failed}</div>
              <div className="text-red-300/70 text-xs">失败</div>
            </div>
          </div>

          {initResult.results && initResult.results.length > 0 && (
            <div className="space-y-2">
              {initResult.results.map((result: any, index: number) => (
                <div
                  key={index}
                  className="flex items-center justify-between text-xs bg-white/5 rounded px-3 py-2"
                >
                  <span className="text-white/70">{result.email}</span>
                  {result.status === 'created' ? (
                    <span className="flex items-center gap-1 text-green-400">
                      <CheckCircle className="w-3 h-3" />
                      已创建
                    </span>
                  ) : result.status === 'already_exists' ? (
                    <span className="flex items-center gap-1 text-blue-400">
                      <AlertCircle className="w-3 h-3" />
                      已存在
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-red-400">
                      <XCircle className="w-3 h-3" />
                      失败
                    </span>
                  )}
                </div>
              ))}
            </div>
          )}

          {initResult.errors && initResult.errors.length > 0 && (
            <div className="space-y-2 pt-2 border-t border-white/10">
              <div className="text-sm text-red-400">错误信息：</div>
              {initResult.errors.map((error: any, index: number) => (
                <div key={index} className="text-xs text-red-300/70 bg-red-500/10 rounded px-3 py-2">
                  <div className="font-medium">{error.email}</div>
                  <div>{error.error}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
