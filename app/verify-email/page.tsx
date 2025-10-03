"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"

const VerifyEmail = () => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [message, setMessage] = useState('')
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  useEffect(() => {
    if (!isClient) return

    const token = searchParams.get('token')
    
    if (!token) {
      setStatus('error')
      setMessage('ไม่พบโทเค็นยืนยัน')
      return
    }

    verifyEmail(token)
  }, [isClient, searchParams])

  const verifyEmail = async (token: string) => {
    try {
      const res = await fetch('/api/verify-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token })
      })

      const data = await res.json()

      if (res.ok) {
        setStatus('success')
        setMessage(data.message || 'ยืนยันอีเมลเรียบร้อยแล้ว')
        setTimeout(() => {
          router.push('/login')
        }, 3000)
      } else {
        setStatus('error')
        setMessage(data.error || 'เกิดข้อผิดพลาดในการยืนยันอีเมล')
      }
    } catch (error) {
      setStatus('error')
      setMessage('เกิดข้อผิดพลาดในการเชื่อมต่อ')
    }
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background gradients */}
      <div className="absolute inset-0 bg-gradient-to-br from-sky-900 via-blue-900 to-indigo-900">
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-gradient-to-r from-sky-400 to-blue-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute bottom-1/4 left-1/4 w-80 h-80 bg-gradient-to-r from-blue-400 to-indigo-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-1000"></div>
      </div>

      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl p-8 shadow-2xl text-center">
            {status === 'loading' && (
              <div>
                <div className="mb-6">
                  <div className="w-16 h-16 border-4 border-sky-400 border-t-transparent rounded-full animate-spin mx-auto"></div>
                </div>
                <h1 className="text-2xl font-bold text-white mb-4">กำลังยืนยันอีเมล...</h1>
                <p className="text-white/70">กรุณารอสักครู่</p>
              </div>
            )}

            {status === 'success' && (
              <div>
                <div className="mb-6">
                  <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                </div>
                <h1 className="text-2xl font-bold text-white mb-4">ยืนยันสำเร็จ!</h1>
                <p className="text-white/70 mb-6">{message}</p>
                <p className="text-white/60 text-sm">กำลังนำคุณไปหน้าเข้าสู่ระบบ...</p>
              </div>
            )}

            {status === 'error' && (
              <div>
                <div className="mb-6">
                  <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center mx-auto">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </div>
                </div>
                <h1 className="text-2xl font-bold text-white mb-4">เกิดข้อผิดพลาด</h1>
                <p className="text-white/70 mb-6">{message}</p>
                <button
                  onClick={() => router.push('/login')}
                  className="px-6 py-3 bg-gradient-to-r from-sky-500 to-blue-500 hover:from-sky-600 hover:to-blue-600 text-white font-semibold rounded-2xl transition-all duration-300"
                >
                  ไปหน้าเข้าสู่ระบบ
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default VerifyEmail