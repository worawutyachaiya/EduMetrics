// app/profile/page.tsx
"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface UserData {
  id: number;
  firstName: string;
  lastName: string;
  studentId: string;
  email: string;
  academicYear: number;
  role: string;
  createdAt: string;
  avatarUrl?: string | null;
}

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

const ProfilePage = () => {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [originalData, setOriginalData] = useState<Partial<UserData>>({});
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    email: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [uploading, setUploading] = useState(false);
  const [deletingAvatar, setDeletingAvatar] = useState(false);
  
  const router = useRouter();

  // ดึงข้อมูลผู้ใช้
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch('/api/auth/check', {
          credentials: 'include',
        });

        if (response.ok) {
          const data = await response.json();
          setUserData(data.user);
          
          // เก็บข้อมูลเดิมไว้สำหรับการเปรียบเทียบ
          const originalUserData = {
            firstName: data.user.firstName,
            lastName: data.user.lastName,
            email: data.user.email,
          };
          setOriginalData(originalUserData);
          
          setFormData({
            firstName: data.user.firstName,
            lastName: data.user.lastName,
            email: data.user.email,
            currentPassword: '',
            newPassword: '',
            confirmPassword: ''
          });
        } else {
          router.push('/login');
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        router.push('/login');
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, [router]);

  // อัพเดทข้อมูลโปรไฟล์ (เฉพาะฟิลด์ที่เปลี่ยนแปลง)
  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage({ type: '', text: '' });

    try {
      // สร้างอ็อบเจ็กต์ที่มีเฉพาะฟิลด์ที่เปลี่ยนแปลง
      const updateData: Partial<{ firstName: string; lastName: string; email: string }> = {};
      
      if (formData.firstName !== originalData.firstName && formData.firstName.trim() !== '') {
        updateData.firstName = formData.firstName.trim();
      }
      
      if (formData.lastName !== originalData.lastName && formData.lastName.trim() !== '') {
        updateData.lastName = formData.lastName.trim();
      }
      
      if (formData.email !== originalData.email && formData.email.trim() !== '') {
        updateData.email = formData.email.trim();
      }

      // ถ้าไม่มีการเปลี่ยนแปลงใดๆ
      if (Object.keys(updateData).length === 0) {
        setMessage({ type: 'error', text: 'ไม่มีการเปลี่ยนแปลงข้อมูล' });
        setIsSubmitting(false);
        return;
      }

      const response = await fetch('/api/profile/update', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(updateData),
      });

      const result = await response.json();

      if (response.ok) {
        setUserData(result.user);
        
        // อัพเดทข้อมูลเดิมใหม่
        setOriginalData({
          firstName: result.user.firstName,
          lastName: result.user.lastName,
          email: result.user.email,
        });
        
        setIsEditing(false);
        setMessage({ type: 'success', text: 'อัพเดทข้อมูลสำเร็จ!' });
      } else {
        setMessage({ type: 'error', text: result.error || 'เกิดข้อผิดพลาด' });
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      setMessage({ type: 'error', text: 'เกิดข้อผิดพลาดในการเชื่อมต่อ' });
    } finally {
      setIsSubmitting(false);
    }
  };

  // อัปโหลดรูปโปรไฟล์
  const handleUploadAvatar = async (file: File) => {
    if (!file) return;
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      setMessage({ type: 'error', text: 'รองรับเฉพาะไฟล์ JPG, PNG, WEBP' });
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setMessage({ type: 'error', text: 'ขนาดไฟล์ต้องไม่เกิน 5MB' });
      return;
    }
    setUploading(true);
    setMessage({ type: '', text: '' });
    try {
      const formData = new FormData();
      formData.append('file', file);
      const res = await fetch('/api/profile/avatar', {
        method: 'POST',
        body: formData,
        credentials: 'include',
      });
      const result = await res.json();
      if (res.ok) {
        setUserData((prev) => (prev ? { ...prev, avatarUrl: result.user.avatarUrl } : prev));
        setMessage({ type: 'success', text: 'อัปโหลดรูปโปรไฟล์สำเร็จ' });
      } else {
        setMessage({ type: 'error', text: result.error || 'อัปโหลดไม่สำเร็จ' });
      }
    } catch (e) {
      setMessage({ type: 'error', text: 'เกิดข้อผิดพลาดในการอัปโหลด' });
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteAvatar = async () => {
    setDeletingAvatar(true);
    setMessage({ type: '', text: '' });
    try {
      const res = await fetch('/api/profile/avatar', { method: 'DELETE', credentials: 'include' });
      const result = await res.json();
      if (res.ok) {
        setUserData((prev) => (prev ? { ...prev, avatarUrl: null } : prev));
        setMessage({ type: 'success', text: 'ลบรูปโปรไฟล์แล้ว' });
      } else {
        setMessage({ type: 'error', text: result.error || 'ลบรูปไม่สำเร็จ' });
      }
    } catch (e) {
      setMessage({ type: 'error', text: 'เกิดข้อผิดพลาดในการลบรูป' });
    } finally {
      setDeletingAvatar(false);
    }
  };

  // เปลี่ยนรหัสผ่าน
  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.newPassword !== formData.confirmPassword) {
      setMessage({ type: 'error', text: 'รหัสผ่านใหม่ไม่ตรงกัน' });
      return;
    }

    if (formData.newPassword.length < 6) {
      setMessage({ type: 'error', text: 'รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร' });
      return;
    }

    setIsSubmitting(true);
    setMessage({ type: '', text: '' });

    try {
      const response = await fetch('/api/profile/change-password', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          currentPassword: formData.currentPassword,
          newPassword: formData.newPassword,
        }),
      });

      const result = await response.json();

      if (response.ok) {
        setFormData({
          ...formData,
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
        setMessage({ type: 'success', text: 'เปลี่ยนรหัสผ่านสำเร็จ!' });
      } else {
        setMessage({ type: 'error', text: result.error || 'เกิดข้อผิดพลาด' });
      }
    } catch (error) {
      console.error('Error changing password:', error);
      setMessage({ type: 'error', text: 'เกิดข้อผิดพลาดในการเชื่อมต่อ' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCancelEdit = () => {
    // รีเซ็ตข้อมูลกลับเป็นค่าเดิม
    setFormData({
      firstName: originalData.firstName || '',
      lastName: originalData.lastName || '',
      email: originalData.email || '',
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });
    setIsEditing(false);
    setMessage({ type: '', text: '' });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-emerald-50 flex items-center justify-center relative overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute inset-0">
          <div className="absolute top-20 right-20 w-40 h-40 bg-emerald-100 rounded-full opacity-30"></div>
          <div className="absolute bottom-20 left-20 w-32 h-32 bg-teal-100 rounded-full opacity-30"></div>
        </div>
        
        <div className="text-center text-gray-600 relative z-10">
          <div className="animate-spin rounded-full h-32 w-32 border-b-4 border-emerald-500 mx-auto mb-4"></div>
          <p className="text-xl font-medium">กำลังโหลด...</p>
        </div>
      </div>
    );
  }

  if (!userData) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-emerald-50 py-8 px-4 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0">
        <div className="absolute top-40 right-40 w-64 h-64 bg-emerald-100 rounded-full opacity-20"></div>
        <div className="absolute bottom-40 left-40 w-48 h-48 bg-teal-100 rounded-full opacity-20"></div>
      </div>
      
      <div className="max-w-4xl mx-auto relative z-10">
        {/* Header */}
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-gray-200/50 p-8 mb-8">
          <div className="flex items-center space-x-6">
            <div className="relative">
              <div className="w-24 h-24 rounded-2xl overflow-hidden bg-emerald-500 flex items-center justify-center">
                {userData.avatarUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={userData.avatarUrl} alt="avatar" className="w-full h-full object-cover" />
                ) : (
                  <svg className="w-12 h-12 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                  </svg>
                )}
              </div>
              <div className="flex items-center gap-2 mt-3">
                <label className="px-3 py-2 text-xs text-black bg-white border border-black rounded-lg cursor-pointer hover:bg-gray-50">
                  เปลี่ยนรูป
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const f = e.target.files?.[0]
                      if (f) handleUploadAvatar(f)
                    }}
                    disabled={uploading}
                  />
                </label>
                {userData.avatarUrl && (
                  <button
                    type="button"
                    onClick={handleDeleteAvatar}
                    disabled={deletingAvatar}
                    className="px-3 py-2 text-xs text-red-600 border border-red-300 rounded-lg hover:bg-red-50"
                  >
                    ลบรูป
                  </button>
                )}
              </div>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-emerald-600">
                {userData.firstName} {userData.lastName}
              </h1>
              <p className="text-gray-600">รหัสนักศึกษา: {userData.studentId}</p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-gray-200/50 overflow-hidden">
          <div className="border-b border-gray-200/50">
            <nav className="flex space-x-8 px-8">
              <button
                onClick={() => setActiveTab('profile')}
                className={`py-6 px-2 border-b-2 font-semibold text-sm transition-all duration-300 ${
                  activeTab === 'profile'
                    ? 'border-emerald-500 text-emerald-600 bg-emerald-50/50'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                ข้อมูลส่วนตัว
              </button>
              <button
                onClick={() => setActiveTab('security')}
                className={`py-6 px-2 border-b-2 font-semibold text-sm transition-all duration-300 ${
                  activeTab === 'security'
                    ? 'border-teal-500 text-teal-600 bg-teal-50/50'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                ความปลอดภัย
              </button>
            </nav>
          </div>

          {/* Message Alert */}
          {message.text && (
            <div className={`mx-6 mt-6 p-4 rounded-lg ${
              message.type === 'success' 
                ? 'bg-green-50 text-green-800 border border-green-200' 
                : 'bg-red-50 text-red-800 border border-red-200'
            }`}>
              {message.text}
            </div>
          )}

          {/* Profile Tab */}
          {activeTab === 'profile' && (
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-semibold text-gray-900">ข้อมูลส่วนตัว</h2>
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors duration-200"
                >
                  <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                  </svg>
                  {isEditing ? 'ยกเลิก' : 'แก้ไข'}
                </button>
              </div>

              <form onSubmit={handleUpdateProfile} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      ชื่อ
                    </label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      placeholder={isEditing ? "ใส่ชื่อใหม่ หรือเว้นว่างไว้เพื่อไม่เปลี่ยนแปลง" : ""}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-900 text-gray-900"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      นามสกุล
                    </label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      placeholder={isEditing ? "ใส่นามสกุลใหม่ หรือเว้นว่างไว้เพื่อไม่เปลี่ยนแปลง" : ""}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-900 text-gray-900"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      รหัสนักศึกษา
                    </label>
                    <input
                      type="text"
                      value={userData.studentId}
                      disabled
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-900"
                    />
                    <p className="text-xs text-gray-500 mt-1">ไม่สามารถแก้ไขได้</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      อีเมล
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      placeholder={isEditing ? "ใส่อีเมลใหม่ หรือเว้นว่างไว้เพื่อไม่เปลี่ยนแปลง" : ""}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-900 text-gray-900"
                    />
                  </div>
                </div>

                {isEditing && (
                  <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4 mb-4">
                    <p className="text-sm text-emerald-800">
                      <strong>คำแนะนำ:</strong> คุณสามารถแก้ไขเฉพาะฟิลด์ที่ต้องการเปลี่ยนแปลง 
                      ฟิลด์ที่ไม่ต้องการเปลี่ยนสามารถเว้นว่างไว้ได้
                    </p>
                  </div>
                )}

                {isEditing && (
                  <div className="flex justify-end space-x-3">
                    <button
                      type="button"
                      onClick={handleCancelEdit}
                      className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                    >
                      ยกเลิก
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="px-6 py-3 bg-emerald-500 text-white rounded-2xl hover:bg-emerald-600 disabled:opacity-50 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
                    >
                      {isSubmitting ? 'กำลังบันทึก...' : 'บันทึกการเปลี่ยนแปลง'}
                    </button>
                  </div>
                )}
              </form>
            </div>
          )}

          {/* Security Tab */}
          {activeTab === 'security' && (
            <div className="p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-6">เปลี่ยนรหัสผ่าน</h2>

              <form onSubmit={handleChangePassword} className="space-y-6 max-w-md">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    รหัสผ่านปัจจุบัน
                  </label>
                  <input
                    type="password"
                    name="currentPassword"
                    value={formData.currentPassword}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent text-gray-900"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    รหัสผ่านใหม่
                  </label>
                  <input
                    type="password"
                    name="newPassword"
                    value={formData.newPassword}
                    onChange={handleInputChange}
                    required
                    minLength={6}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent text-gray-900"
                  />
                  <p className="text-xs text-gray-500 mt-1">อย่างน้อย 6 ตัวอักษร</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    ยืนยันรหัสผ่านใหม่
                  </label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent text-gray-900"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full px-6 py-3 bg-emerald-500 text-white rounded-2xl hover:bg-emerald-600 disabled:opacity-50 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  {isSubmitting ? 'กำลังเปลี่ยน...' : 'เปลี่ยนรหัสผ่าน'}
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;