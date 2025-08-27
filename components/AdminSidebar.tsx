// components/AdminSidebar.tsx
import React from 'react';
import { useRouter } from 'next/navigation';

interface AdminSidebarProps {
  currentPage: 'quiz' | 'video' | 'students';
}

const AdminSidebar: React.FC<AdminSidebarProps> = ({ currentPage }) => {
  const router = useRouter();

  const menuItems = [
    {
      id: 'quiz',
      label: 'จัดการข้อสอบ',
      href: '/admin/quiz',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    },
    {
      id: 'video',
      label: 'จัดการวิดีโอ',
      href: '/admin/video',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
        </svg>
      )
    },
    {
      id: 'students',
      label: 'ข้อมูลนักเรียน',
      href: '/admin/students',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
        </svg>
      )
    }
  ];

  return (
    <aside className="w-72 bg-gradient-to-b from-blue-900 via-blue-800 to-blue-900 text-white shadow-2xl flex flex-col">
      {/* Sidebar Header */}
      <div className="p-6 border-b border-blue-700/50">
        <div className="flex items-center space-x-3">
          <div className="bg-white/10 p-2 rounded-lg">
            <svg className="w-8 h-8 text-blue-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          </div>
          <div>
            <h2 className="text-xl font-bold">Admin Panel</h2>
            <p className="text-blue-200 text-sm">ระบบจัดการเนื้อหา</p>
          </div>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 p-6">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const isActive = currentPage === item.id;
            return (
              <li key={item.id}>
                <button
                  onClick={() => router.push(item.href)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 text-left ${
                    isActive
                      ? 'bg-white/20 text-white shadow-lg border-l-4 border-blue-300'
                      : 'text-blue-100 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <span className={isActive ? 'text-blue-200' : 'text-blue-300'}>
                    {item.icon}
                  </span>
                  <span className="font-medium">{item.label}</span>
                  {isActive && (
                    <span className="ml-auto">
                      <svg className="w-4 h-4 text-blue-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </span>
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Footer */}
      <div className="p-6 border-t border-blue-700/50">
        <div className="bg-white/5 rounded-lg p-4">
          <div className="flex items-center space-x-3">
            <div className="bg-green-500 w-3 h-3 rounded-full"></div>
            <div>
              <p className="text-sm font-medium">ระบบออนไลน์</p>
              <p className="text-xs text-blue-200">เชื่อมต่อแล้ว</p>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default AdminSidebar;
