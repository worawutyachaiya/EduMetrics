// components/AdminHeader.tsx
import React from 'react';

interface AdminHeaderProps {
  user: {
    firstName?: string;
    lastName?: string;
    email?: string;
  } | null;
  title: string;
  onLogout: () => void;
}

const AdminHeader: React.FC<AdminHeaderProps> = ({ user, title, onLogout }) => {
  return (
    <header className="bg-white shadow-lg border-b border-gray-100 sticky top-0 z-50">
      <div className="px-8 py-4">
        <div className="flex items-center justify-between">
          {/* Left side - Title */}
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-bold text-gray-800">{title}</h1>
            <div className="hidden md:block">
              <div className="bg-blue-50 border border-blue-200 px-3 py-1 rounded-full">
                <span className="text-blue-700 text-sm font-medium">Admin Dashboard</span>
              </div>
            </div>
          </div>

          {/* Right side - User info and logout */}
          <div className="flex items-center space-x-4">
            {/* User Profile */}
            <div className="hidden md:flex items-center space-x-3 bg-gray-50 rounded-xl px-4 py-2">
              <div className="bg-blue-500 text-white w-10 h-10 rounded-full flex items-center justify-center font-semibold">
                {user?.firstName?.[0]?.toUpperCase() || 'A'}
              </div>
              <div className="text-left">
                <p className="text-sm font-semibold text-gray-800">
                  {user?.firstName} {user?.lastName}
                </p>
                <p className="text-xs text-gray-500">ผู้ดูแลระบบ</p>
              </div>
            </div>

            {/* Logout Button */}
            <button
              onClick={onLogout}
              className="flex items-center space-x-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              <span className="hidden sm:block">ออกจากระบบ</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;
