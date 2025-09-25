//components\Carditem.tsx
import Image from 'next/image'
import Link from 'next/link'

type Course = {
    title: string
    description: string
    image: string
    price: string
    link: string
    buttonText: string
}

const courses: Course[] = [
    {
        title: 'HTML5 พื้นฐาน',
        description: 'เรียนรู้ HTML5 อย่างเข้าใจ เหมาะสำหรับผู้เริ่มต้นสร้างเว็บไซต์',
        image: '/img/html5.png',
        price: 'ฟรี',
        link: '/htmlvideo',
        buttonText: 'เรียนเลย',
    },
    {
        title: 'CSS สำหรับผู้เริ่มต้น',
        description: 'ปูพื้นฐาน CSS สําหรับผู้เริ่มต้น เพื่อการออกแบบเว็บให้สวยงาม',
        image: '/img/css.png',
        price: 'ฟรี',
        link: '/cssvideo',
        buttonText: 'เรียนเลย',
    },
    {
        title: 'JavaScript เบื้องต้น',
        description: 'เริ่มต้นเรียน JavaScript ด้วยภาษาง่าย ๆ เข้าใจได้เร็ว',
        image: '/img/javascript.png',
        price: 'ฟรี',
        link: '#',
        buttonText: 'เร็วๆนี้...',
    },
]

export default function CourseCardList() {
    return (
        <div className="container mx-auto p-4 md:p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* HTML5 Course Card */}
            <div className="group relative bg-white rounded-3xl overflow-hidden border border-gray-100
                            hover:shadow-2xl hover:shadow-orange-500/20 transform hover:-translate-y-6 hover:rotate-1
                            transition-all duration-700 ease-out cursor-pointer
                            before:absolute before:inset-0 before:bg-gradient-to-br before:from-orange-50/80 
                            before:to-red-50/80 before:opacity-0 before:transition-opacity before:duration-500
                            hover:before:opacity-100">
                
                {/* Floating badge */}
                <div className="absolute top-4 right-4 z-20 bg-gradient-to-r from-orange-500 to-red-500 
                               text-white px-3 py-1 rounded-full text-sm font-semibold shadow-lg
                               transform rotate-12 group-hover:rotate-0 transition-transform duration-500">
                    FREE
                </div>
                
                {/* Glowing effect */}
                <div className="absolute -inset-0.5 bg-gradient-to-r from-orange-400 to-red-400 rounded-3xl 
                               opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-500"></div>
                
                <div className="relative z-10 w-full h-[220px] bg-gradient-to-br from-orange-50 to-red-50 
                               flex items-center justify-center p-6 overflow-hidden">
                    {/* Background pattern */}
                    <div className="absolute inset-0 opacity-5">
                        <div className="absolute top-4 left-4 w-20 h-20 border-2 border-orange-300 rounded-full"></div>
                        <div className="absolute bottom-4 right-4 w-16 h-16 border-2 border-red-300 rounded-full"></div>
                        <div className="absolute top-1/2 left-1/2 w-32 h-32 border border-orange-200 rounded-full 
                                       transform -translate-x-1/2 -translate-y-1/2"></div>
                    </div>
                    
                    <Image
                        src={courses[0].image}
                        alt={courses[0].title}
                        width={200}
                        height={200}
                        className="object-contain group-hover:scale-110 transition-transform duration-700 
                                 drop-shadow-2xl relative z-10"
                    />
                    
                    {/* Floating particles */}
                    <div className="absolute top-6 left-6 w-3 h-3 bg-orange-300 rounded-full animate-ping
                                   opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    <div className="absolute bottom-8 right-8 w-2 h-2 bg-red-400 rounded-full animate-pulse
                                   opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                </div>

                <div className="relative z-10 p-8">
                    <div className="flex items-center gap-2 mb-4">
                        <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                        <span className="text-sm text-orange-600 font-semibold uppercase tracking-wide">Frontend</span>
                    </div>
                    
                    <h3 className="text-2xl font-bold mb-4 text-gray-800 group-hover:text-orange-600 
                                  transition-colors duration-500">
                        {courses[0].title}
                    </h3>
                    
                    <p className="text-gray-600 mb-8 text-base leading-relaxed">
                        {courses[0].description}
                    </p>
                    
                    <div className="flex justify-between items-center">
                        <div className="flex flex-col">
                            <span className="text-3xl font-bold bg-gradient-to-r from-orange-500 to-red-500 
                                           bg-clip-text text-transparent drop-shadow-sm">
                                {courses[0].price}
                            </span>
                            <span className="text-sm text-gray-500 mt-1">ไม่มีค่าใช้จ่าย</span>
                        </div>
                        
                        <Link href={courses[0].link}>
                            <button className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-8 py-4 
                                             rounded-2xl font-semibold text-lg shadow-lg hover:shadow-2xl
                                             hover:shadow-orange-500/40 transform hover:scale-110 hover:-translate-y-1
                                             transition-all duration-500 cursor-pointer border-2 border-transparent
                                             hover:border-orange-300 relative overflow-hidden group/btn
                                             before:absolute before:inset-0 before:bg-gradient-to-r 
                                             before:from-orange-400 before:to-red-400 before:opacity-0
                                             hover:before:opacity-100 before:transition-opacity before:duration-300">
                                <span className="relative z-10">{courses[0].buttonText}</span>
                            </button>
                        </Link>
                    </div>
                    
                    {/* Progress bar */}
                    <div className="mt-6 bg-gray-100 rounded-full h-2 overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-orange-400 to-red-400 rounded-full w-0 
                                       group-hover:w-1/3 transition-all duration-1000"></div>
                    </div>
                </div>
            </div>

            {/* CSS Course Card */}
            <div className="group relative bg-white rounded-3xl overflow-hidden border border-gray-100
                            hover:shadow-2xl hover:shadow-blue-500/20 transform hover:-translate-y-6 hover:-rotate-1
                            transition-all duration-700 ease-out cursor-pointer
                            before:absolute before:inset-0 before:bg-gradient-to-br before:from-blue-50/80 
                            before:to-teal-50/80 before:opacity-0 before:transition-opacity before:duration-500
                            hover:before:opacity-100">
                
                {/* Floating badge */}
                <div className="absolute top-4 right-4 z-20 bg-gradient-to-r from-blue-500 to-teal-500 
                               text-white px-3 py-1 rounded-full text-sm font-semibold shadow-lg
                               transform -rotate-12 group-hover:rotate-0 transition-transform duration-500">
                    POPULAR
                </div>
                
                {/* Glowing effect */}
                <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-400 to-teal-400 rounded-3xl 
                               opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-500"></div>
                
                <div className="relative z-10 w-full h-[220px] bg-gradient-to-br from-blue-50 to-teal-50 
                               flex items-center justify-center p-6 overflow-hidden">
                    {/* Background pattern */}
                    <div className="absolute inset-0 opacity-5">
                        <div className="absolute top-4 left-4 w-20 h-20 border-2 border-blue-300 rounded-lg rotate-45"></div>
                        <div className="absolute bottom-4 right-4 w-16 h-16 border-2 border-teal-300 rounded-lg rotate-12"></div>
                        <div className="absolute top-1/2 left-1/2 w-32 h-32 border border-blue-200 rounded-lg 
                                       transform -translate-x-1/2 -translate-y-1/2 rotate-45"></div>
                    </div>
                    
                    <Image
                        src={courses[1].image}
                        alt={courses[1].title}
                        width={200}
                        height={200}
                        className="object-contain group-hover:scale-110 transition-transform duration-700 
                                 drop-shadow-2xl relative z-10"
                    />
                    
                    {/* Floating particles */}
                    <div className="absolute top-6 right-6 w-3 h-3 bg-blue-400 rounded-full animate-bounce
                                   opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    <div className="absolute bottom-8 left-8 w-2 h-2 bg-teal-400 rounded-full animate-pulse
                                   opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                </div>

                <div className="relative z-10 p-8">
                    <div className="flex items-center gap-2 mb-4">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        <span className="text-sm text-blue-600 font-semibold uppercase tracking-wide">Styling</span>
                    </div>
                    
                    <h3 className="text-2xl font-bold mb-4 text-gray-800 group-hover:text-blue-600 
                                  transition-colors duration-500">
                        {courses[1].title}
                    </h3>
                    
                    <p className="text-gray-600 mb-8 text-base leading-relaxed">
                        {courses[1].description}
                    </p>
                    
                    <div className="flex justify-between items-center">
                        <div className="flex flex-col">
                            <span className="text-3xl font-bold bg-gradient-to-r from-blue-500 to-teal-500 
                                           bg-clip-text text-transparent drop-shadow-sm">
                                {courses[1].price}
                            </span>
                            <span className="text-sm text-gray-500 mt-1">ไม่มีค่าใช้จ่าย</span>
                        </div>
                        
                        <Link href={courses[1].link}>
                            <button className="bg-gradient-to-r from-blue-500 to-teal-500 text-white px-8 py-4 
                                             rounded-2xl font-semibold text-lg shadow-lg hover:shadow-2xl
                                             hover:shadow-blue-500/40 transform hover:scale-110 hover:-translate-y-1
                                             transition-all duration-500 cursor-pointer border-2 border-transparent
                                             hover:border-blue-300 relative overflow-hidden group/btn
                                             before:absolute before:inset-0 before:bg-gradient-to-r 
                                             before:from-blue-400 before:to-teal-400 before:opacity-0
                                             hover:before:opacity-100 before:transition-opacity before:duration-300">
                                <span className="relative z-10">{courses[1].buttonText}</span>
                            </button>
                        </Link>
                    </div>
                    
                    {/* Progress bar */}
                    <div className="mt-6 bg-gray-100 rounded-full h-2 overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-blue-400 to-teal-400 rounded-full w-0 
                                       group-hover:w-2/3 transition-all duration-1000"></div>
                    </div>
                </div>
            </div>

            {/* JavaScript Course Card */}
            <div className="group relative bg-white rounded-3xl overflow-hidden border border-gray-100
                            hover:shadow-2xl hover:shadow-yellow-500/20 transform hover:-translate-y-6 hover:rotate-1
                            transition-all duration-700 ease-out cursor-pointer
                            before:absolute before:inset-0 before:bg-gradient-to-br before:from-yellow-50/80 
                            before:to-amber-50/80 before:opacity-0 before:transition-opacity before:duration-500
                            hover:before:opacity-100">
                
                {/* Floating badge */}
                <div className="absolute top-4 right-4 z-20 bg-gradient-to-r from-yellow-500 to-amber-500 
                               text-white px-3 py-1 rounded-full text-sm font-semibold shadow-lg
                               transform rotate-12 group-hover:rotate-0 transition-transform duration-500">
                    SOON
                </div>
                
                {/* Glowing effect */}
                <div className="absolute -inset-0.5 bg-gradient-to-r from-yellow-400 to-amber-400 rounded-3xl 
                               opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-500"></div>
                
                <div className="relative z-10 w-full h-[220px] bg-gradient-to-br from-yellow-50 to-amber-50 
                               flex items-center justify-center p-6 overflow-hidden">
                    {/* Background pattern */}
                    <div className="absolute inset-0 opacity-5">
                        <div className="absolute top-4 left-4 w-20 h-20 border-2 border-yellow-300 rounded-full"></div>
                        <div className="absolute bottom-4 right-4 w-16 h-16 border-2 border-amber-300 rounded-full"></div>
                        <div className="absolute top-1/2 left-1/2 w-32 h-32 border border-yellow-200 rounded-full 
                                       transform -translate-x-1/2 -translate-y-1/2"></div>
                    </div>
                    
                    <Image
                        src={courses[2].image}
                        alt={courses[2].title}
                        width={200}
                        height={200}
                        className="object-contain group-hover:scale-110 transition-transform duration-700 
                                 drop-shadow-2xl relative z-10 opacity-60 group-hover:opacity-100"
                    />
                    
                    {/* Floating particles */}
                    <div className="absolute top-6 left-6 w-3 h-3 bg-yellow-300 rounded-full animate-ping
                                   opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    <div className="absolute bottom-8 right-8 w-2 h-2 bg-amber-400 rounded-full animate-pulse
                                   opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                </div>

                <div className="relative z-10 p-8">
                    <div className="flex items-center gap-2 mb-4">
                        <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                        <span className="text-sm text-yellow-600 font-semibold uppercase tracking-wide">Programming</span>
                    </div>
                    
                    <h3 className="text-2xl font-bold mb-4 text-gray-800 group-hover:text-yellow-600 
                                  transition-colors duration-500">
                        {courses[2].title}
                    </h3>
                    
                    <p className="text-gray-600 mb-8 text-base leading-relaxed">
                        {courses[2].description}
                    </p>
                    
                    <div className="flex justify-between items-center">
                        <div className="flex flex-col">
                            <span className="text-3xl font-bold bg-gradient-to-r from-yellow-500 to-amber-500 
                                           bg-clip-text text-transparent drop-shadow-sm">
                                {courses[2].price}
                            </span>
                            <span className="text-sm text-gray-500 mt-1">กำลังเตรียม</span>
                        </div>
                        
                        <button className="bg-gradient-to-r from-gray-400 to-gray-500 text-white px-8 py-4 
                                         rounded-2xl font-semibold text-lg shadow-lg cursor-not-allowed
                                         opacity-60 relative overflow-hidden">
                            <span className="relative z-10">{courses[2].buttonText}</span>
                        </button>
                    </div>
                    
                    {/* Progress bar */}
                    <div className="mt-6 bg-gray-100 rounded-full h-2 overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-gray-300 to-gray-400 rounded-full w-0 
                                       group-hover:w-1/4 transition-all duration-1000"></div>
                    </div>
                </div>
            </div>
        </div>
    )
}