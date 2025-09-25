//app/couse/page.tsx
"use client"

import Carditem from "@/components/Carditem"

const course = () => {
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-emerald-50 px-4 py-12 relative overflow-hidden">
            {/* Background decorative elements */}
            <div className="absolute inset-0">
                <div className="absolute top-20 right-20 w-64 h-64 bg-emerald-100 rounded-full opacity-20"></div>
                <div className="absolute bottom-20 left-20 w-48 h-48 bg-teal-100 rounded-full opacity-20"></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-cyan-100 rounded-full opacity-20"></div>
            </div>
            
            <div className="max-w-7xl mx-auto relative z-10">
                <div className="text-center mb-16">
                    <h1 className="text-5xl lg:text-6xl font-bold mb-6">
                        <span className="text-emerald-600">
                            คอร์สเรียน
                        </span>
                    </h1>
                    <div className="w-32 h-1 bg-emerald-500 mx-auto mb-8 rounded-full" />
                    <p className="text-gray-600 text-xl lg:text-2xl max-w-3xl mx-auto leading-relaxed">
                        เรียนรู้ทักษะการพัฒนาเว็บไซต์จากพื้นฐานไปจนถึงขั้นสูง ด้วยคอร์สที่ออกแบบมาเพื่อผู้เริ่มต้น
                    </p>
                </div>
                
                <Carditem/>
            </div>
        </div>
    )
}
export default course