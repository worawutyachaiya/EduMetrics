//components/Navbar.tsx
"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import "./BurgerMenu.css";

interface UserData {
  firstName: string;
  lastName: string;
  studentId: string;
  email: string;
  avatarUrl?: string | null;
}

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const router = useRouter();

  // ตรวจสอบสถานะการล็อคอินและดึงข้อมูลผู้ใช้
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const response = await fetch('/api/auth/check', {
          method: 'GET',
          credentials: 'include',
        });
        
        if (response.ok) {
          const data = await response.json();
          setIsLoggedIn(true);
          setUserData(data.user);
        } else {
          setIsLoggedIn(false);
          setUserData(null);
        }
      } catch (error) {
        console.error('Error checking auth status:', error);
        setIsLoggedIn(false);
        setUserData(null);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  // ฟังก์ชันสำหรับออกจากระบบ
  const handleLogout = async () => {
    try {
      const response = await fetch('/api/logout', {
        method: 'POST',
        credentials: 'include',
      });

      if (response.ok) {
        setIsLoggedIn(false);
        setUserData(null);
        setShowUserMenu(false);
        router.push('/');
        router.refresh();
        window.location.reload();
      } else {
        console.error('Logout failed');
      }
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  return (
    <nav className="bg-white/95 backdrop-blur-xl border-b border-gray-100/50 sticky top-0 z-50 
                   shadow-lg shadow-gray-900/5 transition-all duration-300">
      <div className="container mx-auto flex justify-between items-center flex-wrap xl:px-6 lg:px-4 px-6 py-4 
                     relative before:absolute before:inset-0 before:bg-gradient-to-r 
                     before:from-emerald-50/30 before:via-transparent before:to-teal-50/30 
                     before:opacity-0 before:transition-opacity before:duration-500 
                     hover:before:opacity-100 before:pointer-events-none">
        {/* Logo */}
        <div className="relative z-20">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-500 
                        bg-clip-text text-transparent hover:scale-105 transition-transform duration-300 
                        cursor-pointer drop-shadow-sm">
            RUSLearning
          </h1>
        </div>

        {/* Hamburger Icon สำหรับมือถือ */}
        <div className="block lg:hidden relative z-20">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="group relative flex items-center px-4 py-3 border-2 rounded-2xl text-gray-600 
                      border-gray-200 hover:text-emerald-600 hover:border-emerald-300 
                      transition-all duration-300 cursor-pointer bg-white/80 backdrop-blur-sm
                      hover:bg-emerald-50/50 hover:shadow-lg hover:shadow-emerald-500/10
                      transform hover:scale-105 active:scale-95"
          >
            <svg
              className={`fill-current h-6 w-6 transition-transform duration-300 ${
                isOpen ? 'rotate-180' : 'rotate-0'
              }`}
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <title>Menu</title>
              <path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z" />
            </svg>
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-emerald-400/0 
                          via-emerald-400/10 to-teal-400/0 opacity-0 group-hover:opacity-100 
                          transition-opacity duration-300"></div>
          </button>
        </div>

        {/* เมนูนำทางและช่องค้นหา/ปุ่ม Login-Logout */}
        <div
          className={`w-full lg:flex lg:items-center lg:w-auto mobile-menu${isOpen ? " open" : ""}`}
        >
          <ul className="lg:flex flex-grow justify-center xl:space-x-6 lg:space-x-2 mt-6 lg:mt-0 space-y-2 lg:space-y-0 relative z-10">
            <li>
              <Link
                href="/"
                className="group relative block py-4 xl:px-6 lg:px-3 px-4 text-gray-700 hover:text-emerald-600 
                          transition-all duration-300 font-medium"
              >
                <span className="relative z-10 flex items-center gap-2">
                  <svg className="w-5 h-5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" 
                       fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                          d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                  หน้าแรก
                </span>
              </Link>
            </li>
            <li>
              <Link
                href="/couse"
                className="group relative block py-4 xl:px-6 lg:px-3 px-4 text-gray-700 hover:text-emerald-600 
                          transition-all duration-300 font-medium"
              >
                <span className="relative z-10 flex items-center gap-2">
                  <svg className="w-5 h-5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" 
                       fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                          d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                  คอร์สเรียน
                </span>
              </Link>
            </li>
            <li>
              <Link
                href="/"
                className="group relative block py-4 xl:px-6 lg:px-3 px-4 text-gray-700 hover:text-emerald-600 
                          transition-all duration-300 font-medium"
              >
                <span className="relative z-10 flex items-center gap-2">
                  <svg className="w-5 h-5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" 
                       fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                          d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                  </svg>
                  ข่าวสาร
                </span>
              </Link>
            </li>
            <li>
              <Link
                href="/about"
                className="group relative block py-4 xl:px-6 lg:px-3 px-4 text-gray-700 hover:text-emerald-600 
                          transition-all duration-300 font-medium"
              >
                <span className="relative z-10 flex items-center gap-2">
                  <svg className="w-5 h-5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" 
                       fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                          d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  เกี่ยวกับเรา
                </span>
              </Link>
            </li>
            
            {/* เมนูโปรไฟล์สำหรับมือถือ - แสดงเฉพาะเมื่อ login แล้ว */}
            {isLoggedIn && userData && (
              <>
                <li className="lg:hidden border-t border-emerald-200 pt-6 mt-6">
                  <div className="flex items-center space-x-4 px-4 py-4 bg-emerald-50/80 
                                rounded-2xl border border-emerald-100/50 backdrop-blur-sm shadow-sm">
                    <div className="flex items-center justify-center w-12 h-12 rounded-xl overflow-hidden 
                                  bg-emerald-500 shadow-lg">
                      {userData.avatarUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={userData.avatarUrl}
                          alt="avatar"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                        </svg>
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="text-base font-bold text-emerald-700">
                        {userData.firstName} {userData.lastName}
                      </div>
                      <div className="text-sm text-gray-600 font-medium">
                        รหัส: {userData.studentId}
                      </div>
                    </div>
                    <div className="w-2 h-2 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full shadow-sm animate-pulse"></div>
                  </div>
                </li>
                <li className="lg:hidden">
                  <Link
                    href="/profile"
                    className="group flex items-center space-x-4 py-4 px-6 rounded-2xl text-gray-700 
                             hover:text-emerald-600 hover:bg-emerald-50 
                             transition-all duration-300 font-medium border border-transparent 
                             hover:border-emerald-200/50 hover:shadow-md cursor-pointer"
                    onClick={() => setIsOpen(false)}
                  >
                    <div className="w-5 h-5 text-gray-400 group-hover:text-emerald-500 transition-colors duration-300">
                      <svg fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <span>จัดการโปรไฟล์</span>
                  </Link>
                </li>
                <li className="lg:hidden">
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsOpen(false);
                    }}
                    className="group flex items-center space-x-4 w-full text-left py-4 px-6 rounded-2xl 
                             text-red-600 hover:text-red-700 hover:bg-gradient-to-r hover:from-red-50 hover:to-pink-50 
                             transition-all duration-300 font-medium border border-transparent 
                             hover:border-red-200/50 hover:shadow-md cursor-pointer"
                  >
                    <div className="w-5 h-5 text-red-400 group-hover:text-red-600 transition-colors duration-300">
                      <svg fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <span>ออกจากระบบ</span>
                  </button>
                </li>
              </>
            )}
          </ul>

          {/* ส่วนผู้ใช้ */}
          <div className="flex items-center xl:space-x-6 lg:space-x-4 space-x-6 mt-4 lg:mt-0 flex-col lg:flex-row w-full lg:w-auto">
            {/* ส่วนผู้ใช้ */}
            <div className="flex items-center">
              {isLoading ? (
                // แสดง loading state
                <div className="bg-emerald-500 text-white font-semibold py-3 px-6 rounded-2xl animate-pulse">
                  กำลังโหลด...
                </div>
              ) : isLoggedIn && userData ? (
                // แสดงข้อมูลผู้ใช้เมื่อล็อคอินแล้ว - ซ่อนในมือถือ
                <div className="relative hidden lg:block">
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center space-x-3 bg-emerald-50 hover:bg-emerald-100 
                             border border-emerald-200 text-emerald-700 px-4 py-3 rounded-2xl transition-all duration-300 shadow-lg hover:shadow-xl group cursor-pointer"
                  >
                    {/* User Avatar */}
                    <div className="flex items-center justify-center w-10 h-10 rounded-xl overflow-hidden bg-emerald-500">
                      {userData.avatarUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={userData.avatarUrl}
                          alt="avatar"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                        </svg>
                      )}
                    </div>
                    
                    {/* User info */}
                    <div className="text-left">
                      <div className="text-sm font-semibold text-gray-800">
                        {userData.firstName} {userData.lastName}
                      </div>
                      <div className="text-xs text-gray-600">
                        {userData.studentId}
                      </div>
                    </div>
                    
                    {/* Dropdown arrow */}
                    <svg
                      className={`w-4 h-4 transition-transform duration-300 ${
                        showUserMenu ? 'rotate-180' : ''
                      } group-hover:text-emerald-600`}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>

                  {/* Dropdown Menu - เฉพาะ desktop */}
                  {showUserMenu && (
                    <div className="absolute right-0 mt-3 w-80 bg-white rounded-3xl shadow-2xl border border-gray-100 py-4 z-50 
                                  animate-in slide-in-from-top-2 duration-300 backdrop-blur-xl">
                      {/* User Header */}
                      <div className="px-6 py-4 border-b border-gray-100">
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center justify-center w-14 h-14 rounded-2xl overflow-hidden bg-emerald-500">
                            {userData.avatarUrl ? (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img
                                src={userData.avatarUrl}
                                alt="avatar"
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                              </svg>
                            )}
                          </div>
                          <div className="flex-1">
                            <div className="font-bold text-gray-900 text-lg">
                              {userData.firstName} {userData.lastName}
                            </div>
                            <div className="text-sm text-gray-600">
                              รหัสนักศึกษา: {userData.studentId}
                            </div>
                            <div className="text-sm text-gray-500">
                              {userData.email}
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      {/* Menu items */}
                      <div className="py-2">
                        <Link
                          href="/profile"
                          className="flex items-center space-x-4 px-6 py-4 text-gray-700 hover:bg-gray-50 transition-all duration-300 rounded-2xl mx-2"
                          onClick={() => setShowUserMenu(false)}
                        >
                          <div className="w-6 h-6 text-gray-400">
                            <svg fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                            </svg>
                          </div>
                          <span className="font-medium">จัดการโปรไฟล์</span>
                        </Link>
                      </div>
                      
                      {/* Logout section */}
                      <div className="border-t border-gray-100 pt-2">
                        <button
                          onClick={handleLogout}
                          className="flex items-center space-x-4 w-full px-6 py-4 text-red-600 hover:bg-red-50 transition-all duration-300 rounded-2xl mx-2"
                        >
                          <div className="w-6 h-6">
                            <svg fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" clipRule="evenodd" />
                            </svg>
                          </div>
                          <span className="font-medium">ออกจากระบบ</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                // แสดงปุ่ม Login และ Register เมื่อยังไม่ได้ล็อคอิน
                <>
                  {/* ปุ่ม Login/Register สำหรับ Desktop */}
                  <div className="hidden lg:flex items-center space-x-3 relative z-50">
                    <button
                      onClick={() => {
                        console.log('Register clicked!');
                        router.push('/register');
                      }}
                      className="bg-gray-50 hover:bg-gray-100 text-gray-700 font-semibold py-3 px-6 rounded-2xl 
                               border border-gray-200 transition-all duration-300 hover:shadow-lg cursor-pointer
                               relative z-50 pointer-events-auto"
                      style={{ pointerEvents: 'auto' }}
                    >
                      สมัครสมาชิก
                    </button>
                    <button
                      onClick={() => {
                        console.log('Login clicked!');
                        router.push('/login');
                      }}
                      className="bg-emerald-500 hover:bg-emerald-600 
                               text-white font-semibold py-3 px-6 rounded-2xl transition-all duration-300 shadow-lg 
                               hover:shadow-xl transform hover:scale-105 cursor-pointer
                               relative z-50 pointer-events-auto"
                      style={{ pointerEvents: 'auto' }}
                    >
                      เข้าสู่ระบบ
                    </button>
                  </div>
                  
                  {/* ปุ่ม Login/Register สำหรับ Mobile ใน hamburger menu */}
                  <div className="lg:hidden mt-6 pt-6 border-t border-gradient-to-r from-gray-200 to-gray-300 space-y-4 flex flex-col w-72 mx-auto">
                    <div className="text-center text-sm text-gray-500 font-medium mb-4">
                      เข้าสู่ระบบเพื่อเรียนรู้
                    </div>
                    <Link 
                      href="/register" 
                      onClick={() => setIsOpen(false)}
                      className="group relative w-full bg-gradient-to-r from-gray-50 to-gray-100 
                               hover:from-gray-100 hover:to-gray-200 text-gray-700 font-semibold 
                               py-4 px-6 rounded-2xl border-2 border-gray-200 hover:border-gray-300 
                               transition-all duration-300 shadow-sm hover:shadow-md overflow-hidden cursor-pointer
                               flex items-center justify-center space-x-2"
                    >
                      <div className="absolute inset-0 bg-emerald-50/0 
                                    group-hover:bg-emerald-50/50 transition-all duration-300"></div>
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M8 9a3 3 0 100-6 3 3 0 000 6zM8 11a6 6 0 016 6H2a6 6 0 016-6zM16 7a1 1 0 10-2 0v1h-1a1 1 0 100 2h1v1a1 1 0 102 0v-1h1a1 1 0 100-2h-1V7z" />
                      </svg>
                      <span>สมัครสมาชิก</span>
                    </Link>
                    <Link 
                      href="/login" 
                      onClick={() => setIsOpen(false)}
                      className="group relative w-full bg-emerald-500 
                               hover:bg-emerald-600 text-white font-semibold 
                               py-4 px-6 rounded-2xl transition-all duration-300 shadow-lg 
                               hover:shadow-xl transform hover:scale-[1.02] overflow-hidden cursor-pointer
                               flex items-center justify-center space-x-2"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-white/0 to-white/0 
                                    group-hover:from-white/10 group-hover:to-white/5 transition-all duration-300"></div>
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M3 3a1 1 0 011 1v12a1 1 0 11-2 0V4a1 1 0 011-1zm7.707 3.293a1 1 0 010 1.414L9.414 9H17a1 1 0 110 2H9.414l1.293 1.293a1 1 0 01-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      <span>เข้าสู่ระบบ</span>
                    </Link>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;