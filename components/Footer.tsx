//components/Footer.tsx
const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <footer className="relative bg-gradient-to-br from-slate-900 via-emerald-900 to-teal-900 text-white overflow-hidden">
      {/* Enhanced background decorative elements */}
      <div className="absolute inset-0">
        {/* Gradient mesh background */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900/90 via-emerald-900/95 to-teal-900/90"></div>
        
        {/* Floating orbs */}
        <div className="absolute top-10 left-10 w-40 h-40 bg-gradient-to-br from-emerald-500/20 to-teal-500/20 
                       rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
        <div className="absolute bottom-10 right-10 w-32 h-32 bg-gradient-to-br from-teal-500/20 to-cyan-500/20 
                       rounded-full mix-blend-multiply filter blur-xl animate-pulse animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 w-60 h-60 bg-gradient-to-br from-emerald-400/10 to-teal-400/10 
                       rounded-full mix-blend-multiply filter blur-2xl animate-pulse animation-delay-4000 
                       transform -translate-x-1/2 -translate-y-1/2"></div>
        
        {/* Geometric patterns */}
        <div className="absolute top-20 right-1/4 w-20 h-20 border border-emerald-400/20 rounded-lg rotate-45 animate-spin-slow"></div>
        <div className="absolute bottom-32 left-1/3 w-16 h-16 border-2 border-teal-400/20 rounded-full animate-pulse"></div>
      </div>
      
      <div className="relative z-10 max-w-7xl mx-auto px-6 py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Brand Section */}
          <div className="col-span-1 lg:col-span-2">
            <div className="group">
              <h3 className="text-4xl font-bold mb-6 bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 
                           bg-clip-text text-transparent drop-shadow-sm group-hover:scale-105 
                           transition-transform duration-300 cursor-default">
                RUSLearning
              </h3>
              <p className="text-emerald-100/90 text-lg leading-relaxed mb-8 max-w-lg">
                เรียนรู้การพัฒนาเว็บไซต์อย่างมืออาชีพ ด้วยคอร์สเรียนคุณภาพสูง 
                เริ่มต้นง่าย พร้อมใช้งานจริง สร้างอนาคตในวงการเทคโนโลยี
              </p>
              
              {/* Social Media */}
              <div className="flex space-x-4">
                <a
                  href="#"
                  className="group/social w-14 h-14 bg-gradient-to-br from-emerald-600 to-emerald-700 
                           hover:from-emerald-500 hover:to-emerald-600 rounded-2xl flex items-center justify-center 
                           transition-all duration-300 transform hover:scale-110 hover:-translate-y-1
                           shadow-lg hover:shadow-2xl hover:shadow-emerald-500/30 cursor-pointer
                           border border-emerald-500/20 hover:border-emerald-400/40"
                >
                  <svg className="w-7 h-7 transition-transform duration-300 group-hover/social:scale-110" 
                       fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                  </svg>
                </a>
                <a
                  href="#"
                  className="group/social w-14 h-14 bg-gradient-to-br from-teal-600 to-teal-700 
                           hover:from-teal-500 hover:to-teal-600 rounded-2xl flex items-center justify-center 
                           transition-all duration-300 transform hover:scale-110 hover:-translate-y-1
                           shadow-lg hover:shadow-2xl hover:shadow-teal-500/30 cursor-pointer
                           border border-teal-500/20 hover:border-teal-400/40"
                >
                  <svg className="w-7 h-7 transition-transform duration-300 group-hover/social:scale-110" 
                       fill="currentColor" viewBox="0 0 24 24">
                    <path d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z"/>
                  </svg>
                </a>
                <a
                  href="#"
                  className="group/social w-14 h-14 bg-gradient-to-br from-cyan-600 to-cyan-700 
                           hover:from-cyan-500 hover:to-cyan-600 rounded-2xl flex items-center justify-center 
                           transition-all duration-300 transform hover:scale-110 hover:-translate-y-1
                           shadow-lg hover:shadow-2xl hover:shadow-cyan-500/30 cursor-pointer
                           border border-cyan-500/20 hover:border-cyan-400/40"
                >
                  <svg className="w-7 h-7 transition-transform duration-300 group-hover/social:scale-110" 
                       fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.403.041-3.439.219-.937 1.219-5.192 1.219-5.192s-.31-.623-.31-1.545c0-1.448.84-2.529 1.887-2.529.89 0 1.319.668 1.319 1.468 0 .896-.571 2.237-.866 3.48-.246 1.04.522 1.888 1.549 1.888 1.858 0 3.283-1.96 3.283-4.787 0-2.503-1.799-4.253-4.370-4.253-2.977 0-4.727 2.234-4.727 4.546 0 .9.347 1.863.781 2.391.086.103.098.194.072.299-.079.33-.254 1.037-.289 1.183-.046.189-.151.229-.348.138-1.298-.604-2.107-2.502-2.107-4.026 0-3.297 2.397-6.325 6.918-6.325 3.634 0 6.456 2.58 6.456 6.034 0 3.6-2.269 6.494-5.42 6.494-1.058 0-2.055-.549-2.394-1.275 0 0-.524 1.994-.651 2.48-.236.908-.872 2.042-1.297 2.734.976.302 2.006.461 3.075.461 6.624 0 11.99-5.367 11.99-11.987C24.007 5.367 18.641.001 12.017.001z"/>
                  </svg>
                </a>
              </div>
            </div>
          </div>

          {/* Navigation Section */}
          <div className="col-span-1">
            <div className="group">
              <div className="flex items-center gap-2 mb-6">
                <h4 className="text-xl font-bold text-emerald-300">เมนูหลัก</h4>
              </div>
              <ul className="space-y-4">
                <li>
                  <a
                    href="/"
                    className="group/link text-emerald-100/80 hover:text-white transition-all duration-300 
                             font-medium hover:translate-x-2 transform inline-block cursor-pointer
                             relative before:absolute before:left-0 before:top-1/2 before:w-0 before:h-0.5 
                             before:bg-emerald-400 before:transition-all before:duration-300 
                             hover:before:w-6 before:transform before:-translate-y-1/2 hover:pl-8"
                  >
                    หน้าแรก
                  </a>
                </li>
                <li>
                  <a
                    href="/couse"
                    className="group/link text-emerald-100/80 hover:text-white transition-all duration-300 
                             font-medium hover:translate-x-2 transform inline-block cursor-pointer
                             relative before:absolute before:left-0 before:top-1/2 before:w-0 before:h-0.5 
                             before:bg-emerald-400 before:transition-all before:duration-300 
                             hover:before:w-6 before:transform before:-translate-y-1/2 hover:pl-8"
                  >
                    คอร์สเรียน
                  </a>
                </li>
                <li>
                  <a
                    href="/"
                    className="group/link text-emerald-100/80 hover:text-white transition-all duration-300 
                             font-medium hover:translate-x-2 transform inline-block cursor-pointer
                             relative before:absolute before:left-0 before:top-1/2 before:w-0 before:h-0.5 
                             before:bg-emerald-400 before:transition-all before:duration-300 
                             hover:before:w-6 before:transform before:-translate-y-1/2 hover:pl-8"
                  >
                    ข่าวสาร
                  </a>
                </li>
                <li>
                  <a
                    href="/about"
                    className="group/link text-emerald-100/80 hover:text-white transition-all duration-300 
                             font-medium hover:translate-x-2 transform inline-block cursor-pointer
                             relative before:absolute before:left-0 before:top-1/2 before:w-0 before:h-0.5 
                             before:bg-emerald-400 before:transition-all before:duration-300 
                             hover:before:w-6 before:transform before:-translate-y-1/2 hover:pl-8"
                  >
                    เกี่ยวกับเรา
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Links Section */}
          <div className="col-span-1">
            <div className="group">
              <div className="flex items-center gap-2 mb-6">
                <h4 className="text-xl font-bold text-teal-300">ลิงก์ที่เป็นประโยชน์</h4>
              </div>
              <ul className="space-y-4">
                <li>
                  <a
                    href="#"
                    className="group/link text-emerald-100/80 hover:text-white transition-all duration-300 
                             font-medium hover:translate-x-2 transform inline-block cursor-pointer
                             relative before:absolute before:left-0 before:top-1/2 before:w-0 before:h-0.5 
                             before:bg-teal-400 before:transition-all before:duration-300 
                             hover:before:w-6 before:transform before:-translate-y-1/2 hover:pl-8"
                  >
                    นโยบายความเป็นส่วนตัว
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="group/link text-emerald-100/80 hover:text-white transition-all duration-300 
                             font-medium hover:translate-x-2 transform inline-block cursor-pointer
                             relative before:absolute before:left-0 before:top-1/2 before:w-0 before:h-0.5 
                             before:bg-teal-400 before:transition-all before:duration-300 
                             hover:before:w-6 before:transform before:-translate-y-1/2 hover:pl-8"
                  >
                    ข้อตกลงการใช้งาน
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="group/link text-emerald-100/80 hover:text-white transition-all duration-300 
                             font-medium hover:translate-x-2 transform inline-block cursor-pointer
                             relative before:absolute before:left-0 before:top-1/2 before:w-0 before:h-0.5 
                             before:bg-teal-400 before:transition-all before:duration-300 
                             hover:before:w-6 before:transform before:-translate-y-1/2 hover:pl-8"
                  >
                    ช่วยเหลือ
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="group/link text-emerald-100/80 hover:text-white transition-all duration-300 
                             font-medium hover:translate-x-2 transform inline-block cursor-pointer
                             relative before:absolute before:left-0 before:top-1/2 before:w-0 before:h-0.5 
                             before:bg-teal-400 before:transition-all before:duration-300 
                             hover:before:w-6 before:transform before:-translate-y-1/2 hover:pl-8"
                  >
                    ติดต่อเรา
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-emerald-800/30 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            {/* Copyright */}
            <div className="text-center md:text-left">
              <p className="text-emerald-100/70 text-sm">
                © 2024 RUSLearning. สงวนลิขสิทธิ์ทุกประการ
              </p>
            </div>

            {/* Quick Actions */}
            <div className="flex items-center gap-4">
              <button 
                onClick={scrollToTop}
                className="group inline-flex items-center gap-2 text-white 
                           font-semibold text-sm transition-all duration-300 transform hover:scale-105 
                           cursor-pointer"
              >
                <svg className="w-4 h-4 transition-transform duration-300 group-hover:-translate-y-0.5" 
                     fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                        d="M7 11l5-5m0 0l5 5m-5-5v12" />
                </svg>
                กลับด้านบน
              </button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;