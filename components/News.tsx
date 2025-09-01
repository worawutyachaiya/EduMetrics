//components\News.tsx
'use client'
import { useEffect, useRef } from 'react'
import Image from 'next/image'

const news = [
    {
        title: 'รออัปเดต: การเปลี่ยนแปลงครั้งสำคัญในหลักสูตร',
        date: '7 กรกฎาคม 2568',
        description: 'เรากำลังปรับปรุงและเพิ่มหลักสูตรใหม่ๆ เพื่อตอบสนองความต้องการของผู้เรียนในปัจจุบัน เตรียมพบกับประสบการณ์การเรียนรู้ที่เข้มข้นยิ่งขึ้น!',
        image: '/img/news.jpg',
    },
    {
        title: 'สัมมนาออนไลน์: เจาะลึกเทคโนโลยี AI ล่าสุด',
        date: '10 กรกฎาคม 2568',
        description: 'เข้าร่วมสัมมนาฟรีเพื่อเรียนรู้เกี่ยวกับความก้าวหน้าล่าสุดในปัญญาประดิษฐ์ และวิธีนำไปประยุกต์ใช้ในการทำงานของคุณ',
        image: '/img/news.jpg',

    },
    {
        title: 'โปรโมชั่นพิเศษ: ส่วนลดคอร์สเรียนช่วงฤดูร้อน',
        date: '15 กรกฎาคม 2568',
        description: 'อย่าพลาดโอกาสพิเศษ! รับส่วนลดสูงสุด 30% สำหรับคอร์สเรียนยอดนิยมของเรา เฉพาะช่วงฤดูร้อนนี้เท่านั้น',
        image: '/img/news.jpg',
    },
    {
        title: 'เคล็ดลับสู่ความสำเร็จ: การสร้างพอร์ตโฟลิโอออนไลน์',
        date: '20 กรกฎาคม 2568',
        description: 'เรียนรู้วิธีสร้างพอร์ตโฟลิโอที่น่าประทับใจเพื่อดึงดูดผู้จ้างและแสดงผลงานของคุณอย่างมืออาชีพ',
        image: '/img/news.jpg',

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

            if (el.scrollLeft >= maxScrollLeft - 20) { // ปรับค่า 10 เป็น 20 เพื่อความแม่นยำ
                el.scrollTo({ left: 0, behavior: 'smooth' })
            } else {
                el.scrollBy({ left: 350, behavior: 'smooth' })
            }
        }
    }

    useEffect(() => {
        // ตรวจสอบว่ามีข่าวมากกว่า 1 รายการก่อนตั้ง Interval
        if (news.length > 1) {
            const interval = setInterval(() => {
                scrollWithLoop()
            }, 3000)
            return () => clearInterval(interval)
        }
    }, [])

    return (
        <section id="news-section" className="relative py-20 bg-gradient-to-br from-slate-50 to-blue-50 overflow-hidden">
            {/* Background decorative elements */}
            <div className="absolute top-20 right-20 w-40 h-40 bg-purple-100 rounded-full opacity-30"></div>
            <div className="absolute bottom-20 left-20 w-32 h-32 bg-blue-100 rounded-full opacity-30"></div>
            
            <div className="container mx-auto px-4 relative z-10">
                {/* Section Header */}
                <div className="text-center mb-16">
                    <h2 className="text-5xl lg:text-6xl font-bold mb-6">
                        <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                            ข่าวสารและบทความ
                        </span>
                    </h2>
                    <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                        ติดตามเรื่องราวอัปเดตล่าสุดและเคล็ดลับดีๆ จากทีมของเรา
                    </p>
                </div>

                {/* News Cards */}
                <div className="relative">
                    <div
                        ref={scrollRef}
                        className="flex space-x-8 overflow-x-auto scroll-smooth no-scrollbar pb-4"
                    >
                        {news.map((item, index) => (
                            <div
                                key={index}
                                className="min-w-[320px] md:min-w-[380px] max-w-[380px] flex-shrink-0 group"
                            >
                                <div className="bg-white rounded-3xl overflow-hidden shadow-xl border border-gray-100
                                              hover:shadow-2xl hover:shadow-blue-500/20 transform hover:-translate-y-2 
                                              transition-all duration-500 ease-out">
                                    {/* Image */}
                                    <div className="w-full h-[220px] relative overflow-hidden">
                                        <Image
                                            src={item.image}
                                            alt={item.title}
                                            fill
                                            className="object-cover group-hover:scale-110 transition-transform duration-500"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                                    </div>
                                    
                                    {/* Content */}
                                    <div className="p-6">
                                        <div className="flex items-center mb-3">
                                            <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                                            <p className="text-blue-600 text-sm font-medium">{item.date}</p>
                                        </div>
                                        <h3 className="font-bold text-gray-800 text-xl mb-3 leading-tight group-hover:text-blue-600 transition-colors duration-300">
                                            {item.title}
                                        </h3>
                                        <p className="text-gray-600 text-sm leading-relaxed">
                                            {item.description}
                                        </p>
                                        
                                        {/* Read more button */}
                                        <div className="mt-4">
                                            <button className="text-blue-600 font-semibold text-sm hover:text-blue-700 
                                                             flex items-center group-hover:translate-x-1 transition-transform duration-300 cursor-pointer">
                                                อ่านต่อ
                                                <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                                </svg>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Navigation Buttons */}
                    <div className="flex justify-center gap-4 mt-12">
                        <button
                            onClick={() => scrollRef.current?.scrollBy({ left: -380, behavior: 'smooth' })}
                            className="w-14 h-14 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-2xl 
                                     hover:from-blue-600 hover:to-purple-600 shadow-lg hover:shadow-blue-500/25
                                     flex items-center justify-center transform hover:scale-110 transition-all duration-300 cursor-pointer"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                        </button>
                        <button
                            onClick={scrollWithLoop}
                            className="w-14 h-14 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-2xl 
                                     hover:from-blue-600 hover:to-purple-600 shadow-lg hover:shadow-blue-500/25
                                     flex items-center justify-center transform hover:scale-110 transition-all duration-300 cursor-pointer"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        </section>
    )
}