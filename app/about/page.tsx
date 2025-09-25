//app/about/page.tsx
"use client"

import Image from 'next/image'
import { 
  Code, 
  Server, 
  Database, 
  Palette, 
  Mail, 
  Phone 
} from 'lucide-react'

const About = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-emerald-50 px-4 py-12 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 right-20 w-64 h-64 bg-emerald-100 rounded-full opacity-20"></div>
        <div className="absolute bottom-20 left-20 w-48 h-48 bg-teal-100 rounded-full opacity-20"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-cyan-100 rounded-full opacity-20"></div>
      </div>
      
      <div className="max-w-6xl mx-auto text-center relative z-10">
        <h1 className="text-5xl lg:text-6xl font-bold mb-6">
          <span className="text-emerald-600">
            เกี่ยวกับเรา
          </span>
        </h1>
        <div className="w-32 h-1 bg-emerald-500 mx-auto mb-12 rounded-full" />

        <p className="text-gray-600 text-xl lg:text-2xl mb-16 max-w-3xl mx-auto leading-relaxed">
          เว็บไซต์นี้พัฒนาโดยทีมนักเรียนจำนวน 2 คน ที่มีความตั้งใจในการสร้างระบบที่ใช้งานง่าย ปลอดภัย และทันสมัย
        </p>

        {/* ส่วนของผู้พัฒนา */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* ผู้พัฒนาคนที่ 1 */}
          <div className="group bg-white/90 rounded-3xl shadow-xl border border-gray-200/50 p-8 flex flex-col items-center hover:shadow-2xl transform transition-transform duration-300 hover:-translate-y-1">
            <div className="relative mb-6">
              <div className="absolute inset-0 bg-emerald-500 rounded-full opacity-20"></div>
              <Image
                src="/img/get.jpg"
                alt="Developer 1"
                width={160}
                height={160}
                className="w-40 h-40 rounded-full object-cover border-4 border-white shadow-lg relative z-10"
                priority
              />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-3">วรวุฒิ ยาชัยยะ</h2>
            <div className="w-16 h-1 bg-emerald-500 rounded-full mb-4"></div>
            <p className="text-gray-600 text-center leading-relaxed">
              ผู้พัฒนา Full Stack ด้วย React, Next.js และการออกแบบระบบฐานข้อมูล
            </p>
          </div>

          {/* ผู้พัฒนาคนที่ 2 */}
          <div className="group bg-white/90 rounded-3xl shadow-xl border border-gray-200/50 p-8 flex flex-col items-center hover:shadow-2xl transform transition-transform duration-300 hover:-translate-y-1">
            <div className="relative mb-6">
              <div className="absolute inset-0 bg-teal-500 rounded-full opacity-20"></div>
              <Image
                src="/img/fuse.jpg"
                alt="Developer 2"
                width={160}
                height={160}
                className="w-40 h-40 rounded-full object-cover border-4 border-white shadow-lg relative z-10"
                priority
              />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-3">ปรเมศวร์ สุขรอด</h2>
            <div className="w-16 h-1 bg-teal-500 rounded-full mb-4"></div>
            <p className="text-gray-600 text-center leading-relaxed">
              ผู้พัฒนา UI/UX และการจัดการระบบ Backend ด้วย Prisma และ PostgreSQL
            </p>
          </div>
        </div>

        {/* ส่วนเทคโนโลยีที่ใช้ */}
        <div className="mt-20">
          <h2 className="text-4xl font-bold mb-8">
            <span className="text-emerald-600">
              เทคโนโลยีที่ใช้
            </span>
          </h2>
          <div className="w-24 h-1 bg-emerald-500 mx-auto mb-12 rounded-full" />

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {/* Frontend */}
            <div className="group bg-white/90 rounded-2xl p-6 text-center shadow-lg border border-gray-200/50 hover:shadow-xl transform transition-transform duration-300 hover:-translate-y-1">
              <div className="w-16 h-16 mx-auto mb-4 bg-emerald-500 rounded-xl flex items-center justify-center">
                <Code className="w-8 h-8 text-white" />
              </div>
              <h3 className="font-semibold text-gray-800 mb-2">Frontend</h3>
              <p className="text-sm text-gray-600">Next.js, React, TypeScript</p>
            </div>

            {/* Backend */}
            <div className="group bg-white/90 rounded-2xl p-6 text-center shadow-lg border border-gray-200/50 hover:shadow-xl transform transition-transform duration-300 hover:-translate-y-1">
              <div className="w-16 h-16 mx-auto mb-4 bg-teal-500 rounded-xl flex items-center justify-center">
                <Server className="w-8 h-8 text-white" />
              </div>
              <h3 className="font-semibold text-gray-800 mb-2">Backend</h3>
              <p className="text-sm text-gray-600">Node.js, Prisma ORM</p>
            </div>

            {/* Database */}
            <div className="group bg-white/90 rounded-2xl p-6 text-center shadow-lg border border-gray-200/50 hover:shadow-xl transform transition-transform duration-300 hover:-translate-y-1">
              <div className="w-16 h-16 mx-auto mb-4 bg-cyan-500 rounded-xl flex items-center justify-center">
                <Database className="w-8 h-8 text-white" />
              </div>
              <h3 className="font-semibold text-gray-800 mb-2">Database</h3>
              <p className="text-sm text-gray-600">PostgreSQL</p>
            </div>

            {/* Styling */}
            <div className="group bg-white/90 rounded-2xl p-6 text-center shadow-lg border border-gray-200/50 hover:shadow-xl transform transition-transform duration-300 hover:-translate-y-1">
              <div className="w-16 h-16 mx-auto mb-4 bg-emerald-600 rounded-xl flex items-center justify-center">
                <Palette className="w-8 h-8 text-white" />
              </div>
              <h3 className="font-semibold text-gray-800 mb-2">Styling</h3>
              <p className="text-sm text-gray-600">Tailwind CSS</p>
            </div>
          </div>
        </div>

        {/* ส่วนติดต่อเรา */}
        <div className="mt-20">
          <h2 className="text-4xl font-bold mb-8">
            <span className="text-emerald-600">
              ติดต่อเรา
            </span>
          </h2>
          <div className="w-24 h-1 bg-emerald-500 mx-auto mb-12 rounded-full" />

          <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-gray-200/50 p-8 max-w-2xl mx-auto">
            <p className="text-gray-600 text-lg mb-6 leading-relaxed">
              หากคุณมีคำถาม ข้อเสนอแนะ หรือต้องการความช่วยเหลือในการใช้งานระบบ สามารถติดต่อเราได้ผ่านช่องทางต่าง ๆ
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
              <div className="flex items-center p-4 bg-emerald-50 rounded-2xl">
                <div className="w-12 h-12 bg-emerald-500 rounded-full flex items-center justify-center mr-4">
                  <Mail className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="font-semibold text-gray-800">อีเมล</p>
                  <p className="text-gray-600 text-sm">worawut.ycy@gmail.com</p>
                </div>
              </div>
              
              <div className="flex items-center p-4 bg-teal-50 rounded-2xl">
                <div className="w-12 h-12 bg-teal-500 rounded-full flex items-center justify-center mr-4">
                  <Phone className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="font-semibold text-gray-800">โทร</p>
                  <p className="text-gray-600 text-sm">092-725-5199</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default About