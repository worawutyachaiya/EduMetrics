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
        <div className="relative min-h-[70vh] bg-gradient-to-br from-emerald-800 via-teal-800 to-cyan-800">
          {/* Animated background shapes */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -top-40 -right-40 w-80 h-80 bg-emerald-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
            <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-teal-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-2000"></div>
            <div className="absolute top-40 left-1/2 w-60 h-60 bg-cyan-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-4000"></div>
          </div>
          
          {/* Main content */}
          <div className="relative z-10 container mx-auto px-4 py-20 flex flex-col lg:flex-row items-center justify-between">
            {/* Left content */}
            <div className="lg:w-1/2 text-white mb-12 lg:mb-0">
              <h1 className="text-5xl lg:text-7xl font-bold mb-6 leading-tight">
                <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                  เรียนรู้
                </span>
                <br />
                <span className="text-white">พัฒนาเว็บไซต์</span>
              </h1>
              <p className="text-xl lg:text-2xl mb-8 text-emerald-100 leading-relaxed">
                เริ่มต้นสร้างเว็บไซต์ด้วยตัวเอง<br />
                จาก HTML, CSS ไปจนถึง JavaScript
              </p>
              
              {/* แสดงปุ่มเฉพาะเมื่อยังไม่ได้ login */}
              {!isLoading && !isLoggedIn && (
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link href="/register">
                    <button className="bg-emerald-500 text-white px-8 py-4 rounded-xl text-lg font-semibold
                                     hover:bg-emerald-600 transform hover:scale-105 transition-all duration-300 
                                     shadow-2xl hover:shadow-emerald-500/25 cursor-pointer">
                      เริ่มเรียนฟรี
                    </button>
                  </Link>
                  <Link href="/couse">
                    <button className="border-2 border-white text-white px-8 py-4 rounded-xl text-lg font-semibold
                                     hover:bg-white hover:text-emerald-800 transform hover:scale-105 transition-all duration-300 cursor-pointer">
                      ดูคอร์สทั้งหมด
                    </button>
                  </Link>
                </div>
              )}
              
              {/* แสดงปุ่มเมื่อ login แล้ว */}
              {!isLoading && isLoggedIn && (
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link href="/couse">
                    <button className="bg-emerald-500 text-white px-8 py-4 rounded-xl text-lg font-semibold
                                     hover:bg-emerald-600 transform hover:scale-105 transition-all duration-300 
                                     shadow-2xl hover:shadow-emerald-500/25 cursor-pointer">
                      เข้าสู่คอร์สเรียน
                    </button>
                  </Link>
                  <Link href="/profile">
                    <button className="border-2 border-white text-white px-8 py-4 rounded-xl text-lg font-semibold
                                     hover:bg-white hover:text-emerald-800 transform hover:scale-105 transition-all duration-300 cursor-pointer">
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
          <div className="absolute bottom-2 md:bottom-8 left-1/2 transform -translate-x-1/2 text-white animate-bounce">
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
      <section className="relative py-24 bg-gradient-to-b from-gray-50 via-white to-emerald-50 overflow-hidden">
        {/* Enhanced background decorative elements */}
        <div className="absolute inset-0">
          <div className="absolute top-10 left-10 w-40 h-40 bg-gradient-to-br from-emerald-100 to-teal-100 
                         rounded-full opacity-30 animate-float"></div>
          <div className="absolute bottom-10 right-10 w-32 h-32 bg-gradient-to-br from-teal-100 to-cyan-100 
                         rounded-full opacity-30 animate-float-delayed"></div>
          <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-gradient-to-br from-emerald-50 to-teal-50 
                         rounded-full opacity-40 animate-pulse transform -translate-x-1/2 -translate-y-1/2"></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-20">
            
            
            <h2 className="text-5xl lg:text-7xl font-bold mb-8 leading-tight animate-scale-in">
              <span className="bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 
                             bg-clip-text text-transparent drop-shadow-sm">
                คอร์สเรียน
              </span>
            </h2>
            <p className="text-xl lg:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed animate-slide-up">
              เลือกเรียนคอร์สที่คุณสนใจ เริ่มต้นสร้างเว็บไซต์ด้วยตัวเอง<br />
              พร้อมด้วยเครื่องมือและความรู้ที่ทันสมัย
            </p>
          </div>
          
          <Card/>
          
          <div className="text-center mt-20">
            <Link href="/couse">
              <button className="group relative bg-gradient-to-r from-emerald-500 to-teal-500 text-white 
                               px-16 py-5 rounded-3xl text-xl font-semibold shadow-2xl 
                               hover:shadow-emerald-500/30 transform hover:scale-110 hover:-translate-y-2
                               transition-all duration-500 cursor-pointer border-2 border-transparent
                               hover:border-emerald-300/50 overflow-hidden
                               before:absolute before:inset-0 before:bg-gradient-to-r 
                               before:from-emerald-400 before:to-teal-400 before:opacity-0
                               hover:before:opacity-100 before:transition-opacity before:duration-300">
                <span className="relative z-10 flex items-center gap-3">
                  <span>ดูคอร์สทั้งหมด</span>
                  <svg className="w-6 h-6 transform group-hover:translate-x-1 transition-transform duration-300" 
                       fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                          d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </span>
              </button>
            </Link>
          </div>
        </div>
      </section>
      
      {/* News Section */}
      <News/>
      
      {/* Footer CTA Section */}
      <section className="relative py-20 bg-gradient-to-r from-emerald-800 via-teal-800 to-cyan-800 overflow-hidden">
        {/* Background elements */}
        <div className="absolute inset-0">
          <div className="absolute top-10 left-10 w-64 h-64 bg-emerald-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse"></div>
          <div className="absolute bottom-10 right-10 w-48 h-48 bg-teal-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse animation-delay-2000"></div>
        </div>
        
        <div className="container mx-auto px-4 text-center relative z-10">
          <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
            พร้อมเริ่มต้นเรียนรู้แล้วหรือยัง?
          </h2>
          <p className="text-xl text-emerald-100 mb-8 max-w-2xl mx-auto">
            เข้าร่วมกับนักเรียนหลายพันคนและเริ่มสร้างอนาคตในวงการเทคโนโลยี
          </p>
          
          {/* แสดงปุ่มเฉพาะเมื่อยังไม่ได้ login */}
          {!isLoading && !isLoggedIn && (
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/register">
                <button className="bg-white text-emerald-800 px-8 py-4 rounded-2xl text-lg font-semibold
                                 hover:bg-gray-100 transform hover:scale-105 transition-all duration-300 shadow-2xl cursor-pointer">
                  สมัครสมาชิกฟรี
                </button>
              </Link>
              <Link href="/couse">
                <button className="border-2 border-white text-white px-8 py-4 rounded-2xl text-lg font-semibold
                                 hover:bg-white hover:text-emerald-800 transform hover:scale-105 transition-all duration-300 cursor-pointer">
                  ดูคอร์สทั้งหมด
                </button>
              </Link>
            </div>
          )}
          
          {/* แสดงปุ่มเมื่อ login แล้ว */}
          {!isLoading && isLoggedIn && (
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/couse">
                <button className="bg-white text-emerald-800 px-8 py-4 rounded-2xl text-lg font-semibold
                                 hover:bg-gray-100 transform hover:scale-105 transition-all duration-300 shadow-2xl cursor-pointer">
                  เข้าสู่คอร์สเรียน
                </button>
              </Link>
              <Link href="/profile">
                <button className="border-2 border-white text-white px-8 py-4 rounded-2xl text-lg font-semibold
                                 hover:bg-white hover:text-emerald-800 transform hover:scale-105 transition-all duration-300 cursor-pointer">
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