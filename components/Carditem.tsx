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
            <div className="group relative bg-white rounded-3xl overflow-hidden shadow-xl border border-gray-100
                            hover:shadow-2xl hover:shadow-blue-500/20 transform hover:-translate-y-3 transition-all duration-500 ease-out">
                {/* Gradient overlay on hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/0 to-purple-500/0 group-hover:from-blue-500/5 group-hover:to-purple-500/5 transition-all duration-500"></div>
                
                <div className="relative w-full h-[200px] bg-gradient-to-br from-orange-50 to-red-50 flex items-center justify-center p-4">
                    <Image
                        src={courses[0].image}
                        alt={courses[0].title}
                        width={200}
                        height={200}
                        className="object-contain group-hover:scale-110 transition-transform duration-500"
                    />
                </div>

                <div className="relative p-6">
                    <h3 className="text-2xl font-bold mb-3 bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                        {courses[0].title}
                    </h3>
                    <p className="text-gray-600 mb-6 text-base leading-relaxed">
                        {courses[0].description}
                    </p>
                    <div className="flex justify-between items-center">
                        <span className="text-2xl font-bold bg-gradient-to-r from-green-500 to-emerald-500 bg-clip-text text-transparent">
                            {courses[0].price}
                        </span>
                        <Link href={courses[0].link}>
                            <button className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-6 py-3 rounded-2xl font-semibold
                                            hover:from-orange-600 hover:to-red-600 transform hover:scale-105 transition-all duration-300
                                            shadow-lg hover:shadow-orange-500/25">
                                {courses[0].buttonText}
                            </button>
                        </Link>
                    </div>
                </div>
            </div>

            {/* CSS Course Card */}
            <div className="group relative bg-white rounded-3xl overflow-hidden shadow-xl border border-gray-100
                            hover:shadow-2xl hover:shadow-blue-500/20 transform hover:-translate-y-3 transition-all duration-500 ease-out">
                {/* Gradient overlay on hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/0 to-purple-500/0 group-hover:from-blue-500/5 group-hover:to-purple-500/5 transition-all duration-500"></div>
                
                <div className="relative w-full h-[200px] bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center p-4">
                    <Image
                        src={courses[1].image}
                        alt={courses[1].title}
                        width={200}
                        height={200}
                        className="object-contain group-hover:scale-110 transition-transform duration-500"
                    />
                </div>

                <div className="relative p-6">
                    <h3 className="text-2xl font-bold mb-3 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                        {courses[1].title}
                    </h3>
                    <p className="text-gray-600 mb-6 text-base leading-relaxed">
                        {courses[1].description}
                    </p>
                    <div className="flex justify-between items-center">
                        <span className="text-2xl font-bold bg-gradient-to-r from-green-500 to-emerald-500 bg-clip-text text-transparent">
                            {courses[1].price}
                        </span>
                        <Link href={courses[1].link}>
                            <button className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white px-6 py-3 rounded-2xl font-semibold
                                            hover:from-blue-600 hover:to-indigo-600 transform hover:scale-105 transition-all duration-300
                                            shadow-lg hover:shadow-blue-500/25">
                                {courses[1].buttonText}
                            </button>
                        </Link>
                    </div>
                </div>
            </div>

            {/* JavaScript Course Card */}
            <div className="group relative bg-white rounded-3xl overflow-hidden shadow-xl border border-gray-100
                            hover:shadow-2xl hover:shadow-blue-500/20 transform hover:-translate-y-3 transition-all duration-500 ease-out">
                {/* Gradient overlay on hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/0 to-purple-500/0 group-hover:from-blue-500/5 group-hover:to-purple-500/5 transition-all duration-500"></div>
                
                <div className="relative w-full h-[200px] bg-gradient-to-br from-yellow-50 to-amber-50 flex items-center justify-center p-4">
                    <Image
                        src={courses[2].image}
                        alt={courses[2].title}
                        width={200}
                        height={200}
                        className="object-contain group-hover:scale-110 transition-transform duration-500"
                    />
                </div>

                <div className="relative p-6">
                    <h3 className="text-2xl font-bold mb-3 bg-gradient-to-r from-yellow-600 to-amber-600 bg-clip-text text-transparent">
                        {courses[2].title}
                    </h3>
                    <p className="text-gray-600 mb-6 text-base leading-relaxed">
                        {courses[2].description}
                    </p>
                    <div className="flex justify-between items-center">
                        <span className="text-2xl font-bold bg-gradient-to-r from-green-500 to-emerald-500 bg-clip-text text-transparent">
                            {courses[2].price}
                        </span>
                        <span className="text-gray-400 px-6 py-3 rounded-2xl bg-gray-100 font-semibold cursor-not-allowed">
                            {courses[2].buttonText}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    )
}