//components/Navbar.tsx
"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

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
    <nav className="bg-white/80 backdrop-blur-xl border-b border-gray-200/50 sticky top-0 z-50 shadow-lg">
      <div className="container mx-auto flex justify-between items-center flex-wrap px-6 py-4">
        {/* Logo */}
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            RUSLearning
          </h1>
        </div>

        {/* Hamburger Icon สำหรับมือถือ */}
        <div className="block lg:hidden">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="flex items-center px-3 py-2 border rounded-xl text-gray-700 border-gray-300 hover:text-blue-600 hover:border-blue-500 transition-all duration-300"
          >
            <svg
              className="fill-current h-5 w-5"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <title>Menu</title>
              <path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z" />
            </svg>
          </button>
        </div>

        {/* เมนูนำทางและช่องค้นหา/ปุ่ม Login-Logout */}
        <div
          className={`w-full lg:flex lg:items-center lg:w-auto transition-all duration-500 ease-in-out ${
            isOpen ? "block animate-in slide-in-from-top-3 duration-300" : "hidden"
          }`}
        >
          <ul className="lg:flex flex-grow justify-center lg:space-x-2 mt-6 lg:mt-0 space-y-2 lg:space-y-0">
            <li>
              <Link
                href="/"
                className="group relative block py-3 px-6 rounded-2xl text-gray-700 hover:text-blue-600 
                          hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 transition-all duration-300 font-medium
                          border border-transparent hover:border-blue-200/50 hover:shadow-md"
              >
                <span className="relative z-10">หน้าแรก</span>
                <div className="absolute inset-0 bg-gradient-to-r from-blue-400/0 to-purple-400/0 
                              group-hover:from-blue-400/10 group-hover:to-purple-400/10 rounded-2xl transition-all duration-300"></div>
              </Link>
            </li>
            <li>
              <Link
                href="/couse"
                className="group relative block py-3 px-6 rounded-2xl text-gray-700 hover:text-blue-600 
                          hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 transition-all duration-300 font-medium
                          border border-transparent hover:border-blue-200/50 hover:shadow-md"
              >
                <span className="relative z-10">คอร์สเรียน</span>
                <div className="absolute inset-0 bg-gradient-to-r from-blue-400/0 to-purple-400/0 
                              group-hover:from-blue-400/10 group-hover:to-purple-400/10 rounded-2xl transition-all duration-300"></div>
              </Link>
            </li>
            <li>
              <Link
                href="/"
                className="group relative block py-3 px-6 rounded-2xl text-gray-700 hover:text-blue-600 
                          hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 transition-all duration-300 font-medium
                          border border-transparent hover:border-blue-200/50 hover:shadow-md"
              >
                <span className="relative z-10">ข่าวสาร</span>
                <div className="absolute inset-0 bg-gradient-to-r from-blue-400/0 to-purple-400/0 
                              group-hover:from-blue-400/10 group-hover:to-purple-400/10 rounded-2xl transition-all duration-300"></div>
              </Link>
            </li>
            <li>
              <Link
                href="/about"
                className="group relative block py-3 px-6 rounded-2xl text-gray-700 hover:text-blue-600 
                          hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 transition-all duration-300 font-medium
                          border border-transparent hover:border-blue-200/50 hover:shadow-md"
              >
                <span className="relative z-10">เกี่ยวกับเรา</span>
                <div className="absolute inset-0 bg-gradient-to-r from-blue-400/0 to-purple-400/0 
                              group-hover:from-blue-400/10 group-hover:to-purple-400/10 rounded-2xl transition-all duration-300"></div>
              </Link>
            </li>
            
            {/* เมนูโปรไฟล์สำหรับมือถือ - แสดงเฉพาะเมื่อ login แล้ว */}
            {isLoggedIn && userData && (
              <>
                <li className="lg:hidden border-t border-gradient-to-r from-blue-200 to-purple-200 pt-6 mt-6">
                  <div className="flex items-center space-x-4 px-4 py-4 bg-gradient-to-r from-blue-50/80 to-purple-50/80 
                                rounded-2xl border border-blue-100/50 backdrop-blur-sm shadow-sm">
                    <div className="flex items-center justify-center w-12 h-12 rounded-xl overflow-hidden 
                                  bg-gradient-to-br from-blue-500 to-purple-600 shadow-lg">
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
                      <div className="text-base font-bold text-gray-800 bg-gradient-to-r from-blue-700 to-purple-700 bg-clip-text text-transparent">
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
                             hover:text-blue-600 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 
                             transition-all duration-300 font-medium border border-transparent 
                             hover:border-blue-200/50 hover:shadow-md"
                    onClick={() => setIsOpen(false)}
                  >
                    <div className="w-5 h-5 text-gray-400 group-hover:text-blue-500 transition-colors duration-300">
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
                             hover:border-red-200/50 hover:shadow-md"
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
          <div className="flex items-center space-x-6 mt-4 lg:mt-0 flex-col lg:flex-row w-full lg:w-auto">
            {/* ส่วนผู้ใช้ */}
            <div className="flex items-center">
              {isLoading ? (
                // แสดง loading state
                <div className="bg-gradient-to-r from-blue-400 to-purple-400 text-white font-semibold py-3 px-6 rounded-2xl animate-pulse">
                  กำลังโหลด...
                </div>
              ) : isLoggedIn && userData ? (
                // แสดงข้อมูลผู้ใช้เมื่อล็อคอินแล้ว - ซ่อนในมือถือ
                <div className="relative hidden lg:block">
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center space-x-3 bg-gradient-to-r from-blue-50 to-purple-50 hover:from-blue-100 hover:to-purple-100 
                             border border-blue-200 text-blue-700 px-4 py-3 rounded-2xl transition-all duration-300 shadow-lg hover:shadow-xl group"
                  >
                    {/* User Avatar */}
                    <div className="flex items-center justify-center w-10 h-10 rounded-xl overflow-hidden bg-gradient-to-r from-blue-500 to-purple-500">
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
                      } group-hover:text-blue-600`}
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
                          <div className="flex items-center justify-center w-14 h-14 rounded-2xl overflow-hidden bg-gradient-to-br from-blue-500 to-purple-600">
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
                  <div className="hidden lg:flex items-center space-x-3">
                    <Link href="/register">
                      <button className="bg-gray-50 hover:bg-gray-100 text-gray-700 font-semibold py-3 px-6 rounded-2xl 
                                       border border-gray-200 transition-all duration-300 hover:shadow-lg">
                        สมัครสมาชิก
                      </button>
                    </Link>
                    <Link href="/login">
                      <button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 
                                       text-white font-semibold py-3 px-6 rounded-2xl transition-all duration-300 shadow-lg 
                                       hover:shadow-xl transform hover:scale-105">
                        เข้าสู่ระบบ
                      </button>
                    </Link>
                  </div>
                  
                  {/* ปุ่ม Login/Register สำหรับ Mobile ใน hamburger menu */}
                  <div className="lg:hidden mt-6 pt-6 border-t border-gradient-to-r from-gray-200 to-gray-300 space-y-4">
                    <div className="text-center text-sm text-gray-500 font-medium mb-4">
                      เข้าสู่ระบบเพื่อเรียนรู้
                    </div>
                    <Link href="/register" onClick={() => setIsOpen(false)}>
                      <button className="group relative w-full bg-gradient-to-r from-gray-50 to-gray-100 
                                       hover:from-gray-100 hover:to-gray-200 text-gray-700 font-semibold 
                                       py-4 px-6 rounded-2xl border-2 border-gray-200 hover:border-gray-300 
                                       transition-all duration-300 shadow-sm hover:shadow-md overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-400/0 to-purple-400/0 
                                      group-hover:from-blue-400/5 group-hover:to-purple-400/5 transition-all duration-300"></div>
                        <span className="relative flex items-center justify-center space-x-2">
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M8 9a3 3 0 100-6 3 3 0 000 6zM8 11a6 6 0 016 6H2a6 6 0 016-6zM16 7a1 1 0 10-2 0v1h-1a1 1 0 100 2h1v1a1 1 0 102 0v-1h1a1 1 0 100-2h-1V7z" />
                          </svg>
                          <span>สมัครสมาชิก</span>
                        </span>
                      </button>
                    </Link>
                    <Link href="/login" onClick={() => setIsOpen(false)}>
                      <button className="group relative w-full bg-gradient-to-r from-blue-500 to-purple-600 
                                       hover:from-blue-600 hover:to-purple-700 text-white font-semibold 
                                       py-4 px-6 rounded-2xl transition-all duration-300 shadow-lg 
                                       hover:shadow-xl transform hover:scale-[1.02] overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-r from-white/0 to-white/0 
                                      group-hover:from-white/10 group-hover:to-white/5 transition-all duration-300"></div>
                        <span className="relative flex items-center justify-center space-x-2">
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M3 3a1 1 0 011 1v12a1 1 0 11-2 0V4a1 1 0 011-1zm7.707 3.293a1 1 0 010 1.414L9.414 9H17a1 1 0 110 2H9.414l1.293 1.293a1 1 0 01-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                          <span>เข้าสู่ระบบ</span>
                        </span>
                      </button>
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