//app/page.tsx
"use client"
import Card from "@/components/Carditem"
import News from "@/components/News"
import Link from "next/link"
import Image from "next/image"
import { useState, useEffect } from "react"

const page = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  // ตรวจสอบสถานะการล็อคอิน
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const response = await fetch('/api/auth/check', {
          method: 'GET',
          credentials: 'include',
        });
        
        if (response.ok) {
          setIsLoggedIn(true)
        } else {
          setIsLoggedIn(false)
        }
      } catch (error) {
        console.error('Error checking auth status:', error)
        setIsLoggedIn(false)
      } finally {
        setIsLoading(false)
      }
    };

    checkAuthStatus()
  }, [])

  return (
    <div>
      <header className="relative overflow-hidden">
        {/* Background with gradient overlay */}
        <div className="relative min-h-[70vh] bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900">
          {/* Animated background shapes */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
            <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-2000"></div>
            <div className="absolute top-40 left-1/2 w-60 h-60 bg-indigo-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-4000"></div>
          </div>
          
          {/* Main content */}
          <div className="relative z-10 container mx-auto px-4 py-20 flex flex-col lg:flex-row items-center justify-between">
            {/* Left content */}
            <div className="lg:w-1/2 text-white mb-12 lg:mb-0">
              <h1 className="text-5xl lg:text-7xl font-bold mb-6 leading-tight">
                <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  เรียนรู้
                </span>
                <br />
                <span className="text-white">พัฒนาเว็บไซต์</span>
              </h1>
              <p className="text-xl lg:text-2xl mb-8 text-blue-100 leading-relaxed">
                เริ่มต้นสร้างเว็บไซต์ด้วยตัวเอง<br />
                จาก HTML, CSS ไปจนถึง JavaScript
              </p>
              
              {/* แสดงปุ่มเฉพาะเมื่อยังไม่ได้ login */}
              {!isLoading && !isLoggedIn && (
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link href="/register">
                    <button className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-4 rounded-xl text-lg font-semibold
                                     hover:from-blue-600 hover:to-purple-700 transform hover:scale-105 transition-all duration-300 
                                     shadow-2xl hover:shadow-blue-500/25">
                      เริ่มเรียนฟรี
                    </button>
                  </Link>
                  <Link href="/couse">
                    <button className="border-2 border-white text-white px-8 py-4 rounded-xl text-lg font-semibold
                                     hover:bg-white hover:text-purple-900 transform hover:scale-105 transition-all duration-300">
                      ดูคอร์สทั้งหมด
                    </button>
                  </Link>
                </div>
              )}
              
              {/* แสดงปุ่มเมื่อ login แล้ว */}
              {!isLoading && isLoggedIn && (
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link href="/couse">
                    <button className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-4 rounded-xl text-lg font-semibold
                                     hover:from-blue-600 hover:to-purple-700 transform hover:scale-105 transition-all duration-300 
                                     shadow-2xl hover:shadow-blue-500/25">
                      เข้าสู่คอร์สเรียน
                    </button>
                  </Link>
                  <Link href="/profile">
                    <button className="border-2 border-white text-white px-8 py-4 rounded-xl text-lg font-semibold
                                     hover:bg-white hover:text-purple-900 transform hover:scale-105 transition-all duration-300">
                      ดูโปรไฟล์
                    </button>
                  </Link>
                </div>
              )}
            </div>
            
            {/* Right content - Hero Image */}
            <div className="lg:w-1/2 relative">
              <div className="relative z-10">
                <Image 
                  src="/img/banner.png" 
                  alt="Learning Web Development" 
                  width={600}
                  height={400}
                  priority
                  className="w-full h-auto rounded-2xl shadow-2xl transform hover:scale-105 transition-transform duration-500"
                />
              </div>
              {/* Floating elements */}
              <div className="absolute -top-4 -left-4 w-20 h-20 bg-yellow-400 rounded-xl rotate-12 animate-bounce"></div>
              <div className="absolute -bottom-4 -right-4 w-16 h-16 bg-pink-400 rounded-full animate-pulse"></div>
              <div className="absolute top-1/2 -right-8 w-12 h-12 bg-green-400 rounded-lg rotate-45 animate-spin-slow"></div>
            </div>
          </div>
          
          {/* Scroll indicator */}
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white animate-bounce">
            <div className="flex flex-col items-center">
              <span className="text-sm mb-2">เลื่อนลงเพื่อดูคอร์ส</span>
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            </div>
          </div>
        </div>
      </header>
      
      {/* Course Section */}
      <section className="relative py-20 bg-gradient-to-b from-gray-50 to-white overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute top-10 left-10 w-32 h-32 bg-blue-100 rounded-full opacity-50"></div>
        <div className="absolute bottom-10 right-10 w-24 h-24 bg-purple-100 rounded-full opacity-50"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-5xl lg:text-6xl font-bold mb-6">
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                คอร์สเรียน
              </span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              เลือกเรียนคอร์สที่คุณสนใจ เริ่มต้นสร้างเว็บไซต์ด้วยตัวเอง
            </p>
          </div>
          
          <Card/>
          
          <div className="text-center mt-16">
            <Link href="/couse">
              <button className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-12 py-4 rounded-2xl text-xl font-semibold
                               hover:from-blue-600 hover:to-purple-700 transform hover:scale-105 transition-all duration-300 
                               shadow-2xl hover:shadow-blue-500/25">
                ดูคอร์สทั้งหมด
              </button>
            </Link>
          </div>
        </div>
      </section>
      
      {/* News Section */}
      <News/>
      
      {/* Footer CTA Section */}
      <section className="relative py-20 bg-gradient-to-r from-blue-900 via-purple-900 to-indigo-900 overflow-hidden">
        {/* Background elements */}
        <div className="absolute inset-0">
          <div className="absolute top-10 left-10 w-64 h-64 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse"></div>
          <div className="absolute bottom-10 right-10 w-48 h-48 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse animation-delay-2000"></div>
        </div>
        
        <div className="container mx-auto px-4 text-center relative z-10">
          <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
            พร้อมเริ่มต้นเรียนรู้แล้วหรือยัง?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            เข้าร่วมกับนักเรียนหลายพันคนและเริ่มสร้างอนาคตในวงการเทคโนโลยี
          </p>
          
          {/* แสดงปุ่มเฉพาะเมื่อยังไม่ได้ login */}
          {!isLoading && !isLoggedIn && (
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/register">
                <button className="bg-white text-purple-900 px-8 py-4 rounded-2xl text-lg font-semibold
                                 hover:bg-gray-100 transform hover:scale-105 transition-all duration-300 shadow-2xl">
                  สมัครสมาชิกฟรี
                </button>
              </Link>
              <Link href="/couse">
                <button className="border-2 border-white text-white px-8 py-4 rounded-2xl text-lg font-semibold
                                 hover:bg-white hover:text-purple-900 transform hover:scale-105 transition-all duration-300">
                  ดูคอร์สทั้งหมด
                </button>
              </Link>
            </div>
          )}
          
          {/* แสดงปุ่มเมื่อ login แล้ว */}
          {!isLoading && isLoggedIn && (
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/couse">
                <button className="bg-white text-purple-900 px-8 py-4 rounded-2xl text-lg font-semibold
                                 hover:bg-gray-100 transform hover:scale-105 transition-all duration-300 shadow-2xl">
                  เข้าสู่คอร์สเรียน
                </button>
              </Link>
              <Link href="/profile">
                <button className="border-2 border-white text-white px-8 py-4 rounded-2xl text-lg font-semibold
                                 hover:bg-white hover:text-purple-900 transform hover:scale-105 transition-all duration-300">
                  จัดการโปรไฟล์
                </button>
              </Link>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}

export default page