//components\News.tsx
'use client'
import { useEffect, useRef } from 'react'
import Image from 'next/image'

const news = [
    {
        title: 'รออัปเดต: การเปลี่ยนแปลงครั้งสำคัญในหลักสูตร',
        date: '7 กรกฎาคม 2568',
        description: 'เรากำลังปรับปรุงและเพิ่มหลักสูตรใหม่ๆ เพื่อตอบสนองความต้องการของผู้เรียนในปัจจุบัน เตรียมพบกับประสบการณ์การเรียนรู้ที่เข้มข้นยิ่งขึ้น!',
        image: '/img/bgbook.jpg',
    },
    {
        title: 'สัมมนาออนไลน์: เจาะลึกเทคโนโลยี AI ล่าสุด',
        date: '10 กรกฎาคม 2568',
        description: 'เข้าร่วมสัมมนาฟรีเพื่อเรียนรู้เกี่ยวกับความก้าวหน้าล่าสุดในปัญญาประดิษฐ์ และวิธีนำไปประยุกต์ใช้ในการทำงานของคุณ',
        image: '/img/bgbook.jpg',
    },
    {
        title: 'โปรโมชั่นพิเศษ: ส่วนลดคอร์สเรียนช่วงฤดูร้อน',
        date: '15 กรกฎาคม 2568',
        description: 'อย่าพลาดโอกาสพิเศษ! รับส่วนลดสูงสุด 30% สำหรับคอร์สเรียนยอดนิยมของเรา เฉพาะช่วงฤดูร้อนนี้เท่านั้น',
        image: '/img/bgbook.jpg',
    },
    {
        title: 'เคล็ดลับสู่ความสำเร็จ: การสร้างพอร์ตโฟลิโอออนไลน์',
        date: '20 กรกฎาคม 2568',
        description: 'เรียนรู้วิธีสร้างพอร์ตโฟลิโอที่น่าประทับใจเพื่อดึงดูดผู้จ้างและแสดงผลงานของคุณอย่างมืออาชีพ',
        image: '/img/bgbook.jpg',
    }
]

export default function NewsSection() {
    const scrollRef = useRef<HTMLDivElement>(null)

    const scrollWithLoop = () => {
        if (scrollRef.current) {
            const el = scrollRef.current
            const maxScrollLeft = el.scrollWidth - el.clientWidth

            // ตรวจสอบว่ามีเนื้อหาให้เลื่อนหรือไม่
            if (maxScrollLeft <= 0) return;

            if (el.scrollLeft >= maxScrollLeft - 20) {
                el.scrollTo({ left: 0, behavior: 'smooth' })
            } else {
                el.scrollBy({ left: 420, behavior: 'smooth' })
            }
        }
    }

    useEffect(() => {
        // ตรวจสอบว่ามีข่าวมากกว่า 1 รายการก่อนตั้ง Interval
        if (news.length > 1) {
            const interval = setInterval(() => {
                scrollWithLoop()
            }, 4000)
            return () => clearInterval(interval)
        }
    }, [])

    return (
        <section id="news-section" className="relative py-24 bg-gradient-to-br from-slate-50 via-white to-emerald-50 overflow-hidden">
            {/* Enhanced background decorative elements */}
            <div className="absolute inset-0">
                {/* Floating geometric shapes */}
                <div className="absolute top-20 right-20 w-40 h-40 bg-gradient-to-br from-emerald-100 to-teal-100 
                               rounded-full opacity-30 animate-pulse"></div>
                <div className="absolute bottom-20 left-20 w-32 h-32 bg-gradient-to-br from-blue-100 to-emerald-100 
                               rounded-full opacity-30 animate-pulse animation-delay-2000"></div>
                <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-gradient-to-br from-teal-100 to-cyan-100 
                               rounded-full opacity-20 animate-pulse animation-delay-4000"></div>
                
                {/* Gradient orbs */}
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-emerald-200 rounded-full mix-blend-multiply 
                               filter blur-xl opacity-20 animate-pulse"></div>
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-teal-200 rounded-full mix-blend-multiply 
                               filter blur-xl opacity-20 animate-pulse animation-delay-4000"></div>
            </div>
            
            <div className="container mx-auto px-4 relative z-10">
                {/* Enhanced Section Header */}
                <div className="text-center mb-20">
                    <h2 className="text-5xl lg:text-7xl font-bold mb-8 leading-tight">
                        <span className="bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 
                                       bg-clip-text text-transparent drop-shadow-sm">
                            ข่าวสารและบทความ
                        </span>
                    </h2>
                    <p className="text-xl lg:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                        ติดตามเรื่องราวอัปเดตล่าสุด เคล็ดลับดีๆ และความรู้ใหม่ๆ <br />
                        จากทีมผู้เชียวชาญของเรา
                    </p>
                </div>

                {/* Enhanced News Cards */}
                <div className="relative">
                    <div
                        ref={scrollRef}
                        className="flex space-x-10 overflow-x-auto scroll-smooth no-scrollbar pb-6"
                        style={{scrollbarWidth: 'none', msOverflowStyle: 'none'}}
                    >
                        {news.map((item, index) => (
                            <div
                                key={index}
                                className="min-w-[360px] md:min-w-[420px] max-w-[420px] flex-shrink-0 group cursor-pointer"
                            >
                                <div className="relative bg-white rounded-3xl overflow-hidden border border-gray-100/50
                                              hover:shadow-2xl hover:shadow-emerald-500/20 transform hover:-translate-y-6 
                                              hover:rotate-1 transition-all duration-700 ease-out
                                              before:absolute before:inset-0 before:bg-gradient-to-br 
                                              before:from-emerald-50/50 before:to-teal-50/50 before:opacity-0
                                              before:transition-opacity before:duration-500 hover:before:opacity-100">
                                    
                                    {/* Glowing effect */}
                                    <div className="absolute -inset-0.5 bg-gradient-to-r from-emerald-400 to-teal-400 
                                                   rounded-3xl opacity-0 group-hover:opacity-100 blur-xl 
                                                   transition-opacity duration-500"></div>
                                    
                                    {/* Image Container */}
                                    <div className="relative z-10 w-full h-[240px] overflow-hidden bg-gradient-to-br 
                                                   from-gray-50 to-emerald-50">
                                        {/* Date badge */}
                                        <div className="absolute top-4 right-4 z-20 bg-white/90 backdrop-blur-sm 
                                                       px-4 py-2 rounded-full shadow-lg border border-emerald-200/50">
                                            <div className="flex items-center gap-2">
                                                <span className="text-sm font-medium text-emerald-700">{item.date}</span>
                                            </div>
                                        </div>
                                        
                                        {/* Background pattern overlay */}
                                        <div className="absolute inset-0 opacity-5">
                                            <div className="absolute top-4 left-4 w-16 h-16 border-2 border-emerald-300 rounded-full"></div>
                                            <div className="absolute bottom-4 right-4 w-12 h-12 border-2 border-teal-300 rounded-lg rotate-45"></div>
                                            <div className="absolute top-1/2 left-1/2 w-24 h-24 border border-emerald-200 rounded-full 
                                                           transform -translate-x-1/2 -translate-y-1/2"></div>
                                        </div>
                                        
                                        <Image
                                            src={item.image}
                                            alt={item.title}
                                            width={420}
                                            height={240}
                                            className="w-full h-full object-cover group-hover:scale-110 
                                                     transition-transform duration-700 relative z-10"
                                        />
                                        
                                        {/* Overlay gradient */}
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent 
                                                       to-transparent opacity-0 group-hover:opacity-100 
                                                       transition-opacity duration-500 z-10"></div>
                                    </div>

                                    {/* Content */}
                                    <div className="relative z-10 p-8">
                                        {/* Category badge */}
                                        <div className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-100 to-teal-100 
                                                       px-4 py-2 rounded-full mb-4">
                                            <svg className="w-4 h-4 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                                                      d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                                            </svg>
                                            <span className="text-sm text-emerald-700 font-semibold">ข่าวสาร</span>
                                        </div>
                                        
                                        <h3 className="text-2xl font-bold mb-4 text-gray-800 group-hover:text-emerald-600 
                                                      transition-colors duration-500 leading-tight">
                                            {item.title}
                                        </h3>
                                        
                                        <p className="text-gray-600 mb-6 text-base leading-relaxed line-clamp-3">
                                            {item.description}
                                        </p>
                                        
                                        {/* Read more button */}
                                        <div className="flex items-center justify-between">
                                            <button className="inline-flex items-center gap-2 text-emerald-600 font-semibold 
                                                             hover:text-emerald-700 transition-colors duration-300 group/btn">
                                                <span>อ่านเพิ่มเติม</span>
                                                <svg className="w-5 h-5 transform group-hover/btn:translate-x-1 transition-transform duration-300" 
                                                     fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                                                          d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                                </svg>
                                            </button>
                                            
                                            {/* Reading time estimate */}
                                            <div className="flex items-center gap-2 text-gray-400">
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                                                          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                                <span className="text-sm">5 นาที</span>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    {/* Hover glow effect */}
                                    <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-emerald-200/10 
                                                   to-teal-200/10 opacity-0 group-hover:opacity-100 transition-opacity 
                                                   duration-500 pointer-events-none"></div>
                                </div>
                            </div>
                        ))}
                    </div>
                    
                    {/* Navigation dots */}
                    <div className="flex justify-center gap-3 mt-12">
                        {news.map((_, index) => (
                            <button
                                key={index}
                                className="w-3 h-3 bg-gray-300 rounded-full cursor-pointer 
                                          hover:bg-emerald-500 transition-all duration-300 transform hover:scale-125
                                          focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
                                onClick={() => {
                                    if (scrollRef.current) {
                                        scrollRef.current.scrollTo({
                                            left: index * 420,
                                            behavior: 'smooth'
                                        });
                                    }
                                }}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </section>
    )
}