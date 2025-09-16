// app/admin/students/page.tsx
"use client";

import { useState, useEffect, useCallback } from "react";
import { useAuth } from '@/lib/auth-context';
import { useRouter } from 'next/navigation';
import RouteGuard from '@/components/routeGuard';
import AdminSidebar from '@/components/AdminSidebar';
import AdminHeader from '@/components/AdminHeader';

interface Student {
  id: number;
  firstName: string;
  lastName: string;
  studentId: string;
  academicYear: number;
  createdAt: string;
  stats: {
    html: CourseStats;
    css: CourseStats;
  };
}

interface CourseStats {
  totalLessons: number;
  completedPosttests: number;
  avgPretest: number;
  avgPosttest: number;
  improvement: number;
  posttestAttempts: number;
}

interface QuizResult {
  score: number;
  totalScore: number;
  percentage: number;
  completedAt: string;
}

interface DetailedResult {
  quizType: string;
  lesson: number;
  pretest: QuizResult | null;
  posttests: QuizResult[];
}

interface StudentDetail {
  id: number;
  firstName: string;
  lastName: string;
  studentId: string;
  academicYear: number;
  detailedResults: DetailedResult[];
}

function AdminStudentsContent() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [students, setStudents] = useState<Student[]>([]);
  const [academicYears, setAcademicYears] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Filters
  const [selectedYear, setSelectedYear] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCourse, setSelectedCourse] = useState<string>('all');
  
  // Detail modal
  const [showDetail, setShowDetail] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<StudentDetail | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);
  // สำหรับค้นหาใน modal รายละเอียด
  const [selectedLessonFilter, setSelectedLessonFilter] = useState("");
  
  // สร้างตัวเลือกบทเรียนจากข้อมูลที่มี
  const getLessonOptions = () => {
    if (!selectedStudent?.detailedResults) return [];
    
    const lessons = new Set<string>();
    selectedStudent.detailedResults.forEach(result => {
      lessons.add(`${result.quizType.toUpperCase()}-${result.lesson}`);
    });
    
    return Array.from(lessons).sort((a, b) => {
      const [aType, aNum] = a.split('-');
      const [bType, bNum] = b.split('-');
      
      // เรียงตาม HTML ก่อน แล้ว CSS
      if (aType !== bType) {
        if (aType === 'HTML' && bType === 'CSS') return -1;
        if (aType === 'CSS' && bType === 'HTML') return 1;
        return aType.localeCompare(bType);
      }
      
      // ถ้าเป็นประเภทเดียวกัน เรียงตามเลขบทเรียน
      return parseInt(aNum) - parseInt(bNum);
    });
  };
  
  // ฟังก์ชันกรอง detailedResults ตาม selectedLessonFilter
  const filteredDetailedResults = selectedStudent?.detailedResults.filter(result => {
    if (!selectedLessonFilter) return true;
    
    const [filterType, filterLesson] = selectedLessonFilter.split('-');
    return result.quizType.toUpperCase() === filterType && result.lesson.toString() === filterLesson;
  }) || [];

  const fetchStudents = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams();
      if (selectedYear !== 'all') params.append('academicYear', selectedYear);
      if (searchTerm) params.append('search', searchTerm);
      if (selectedCourse !== 'all') params.append('courseType', selectedCourse);

      const response = await fetch(`/api/admin/students?${params.toString()}`);
      if (!response.ok) throw new Error('Failed to fetch students');

      const data = await response.json();
      setStudents(data.students);
      setAcademicYears(data.academicYears);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'เกิดข้อผิดพลาดในการโหลดข้อมูล');
    } finally {
      setLoading(false);
    }
  }, [selectedYear, searchTerm, selectedCourse]);

  useEffect(() => {
    fetchStudents();
  }, [fetchStudents]);

  const fetchStudentDetail = async (studentId: string) => {
    try {
      setDetailLoading(true);
      
      const response = await fetch('/api/admin/students', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          studentId,
          courseType: selectedCourse === 'all' ? null : selectedCourse
        })
      });

      if (!response.ok) throw new Error('Failed to fetch student details');

      const data = await response.json();
      setSelectedStudent(data);
      setSelectedLessonFilter(""); // รีเซ็ตตัวกรองเมื่อเปิด modal ใหม่
      setShowDetail(true);
    } catch (error) {
      console.error('Error fetching student details:', error);
      alert('เกิดข้อผิดพลาดในการโหลดรายละเอียด');
    } finally {
      setDetailLoading(false);
    }
  };

  const handleLogout = async () => {
    if (confirm("คุณต้องการออกจากระบบหรือไม่?")) {
      await logout();
      router.push('/login');
    }
  };

  const getCompletionRate = (stats: CourseStats) => {
    if (stats.totalLessons === 0) return 0;
    return Math.round((stats.completedPosttests / stats.totalLessons) * 100);
  };

  const getImprovementColor = (improvement: number) => {
    if (improvement > 10) return 'text-green-600 bg-green-100';
    if (improvement > 0) return 'text-green-600 bg-green-100';
    if (improvement === 0) return 'text-gray-600 bg-gray-100';
    return 'text-red-600 bg-red-100';
  };

  const getImprovementIcon = (improvement: number) => {
    if (improvement > 0) return '↗';
    if (improvement === 0) return '→';
    return '↘';
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <AdminHeader 
        user={user}
        title="ข้อมูลนักเรียน"
        onLogout={handleLogout}
      />
      
      <div className="flex flex-1">
        <AdminSidebar currentPage="students" />
        
        <main className="flex-1 p-8">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">ข้อมูลนักเรียนและผลการเรียน</h1>
              <p className="text-gray-600">จัดการและตรวจสอบผลการเรียนของนักเรียน</p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mb-6 bg-red-50 border-l-4 border-red-400 p-4">
                <div className="flex">
                  <div className="ml-3">
                    <p className="text-sm text-red-700">{error}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Filters */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">ตัวกรองข้อมูล</h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {/* Academic Year Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">ปีการศึกษา</label>
                  <select
                    value={selectedYear}
                    onChange={(e) => setSelectedYear(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="all">ทุกปีการศึกษา</option>
                    {academicYears.map(year => (
                      <option key={year} value={year.toString()}>{year + 543}</option>
                    ))}
                  </select>
                </div>

                {/* Course Type Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">ประเภทคอร์ส</label>
                  <select
                    value={selectedCourse}
                    onChange={(e) => setSelectedCourse(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="all">ทั้งหมด</option>
                    <option value="HTML">HTML</option>
                    <option value="CSS">CSS</option>
                  </select>
                </div>

                {/* Search */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">ค้นหา (ชื่อ หรือรหัสนักเรียน)</label>
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="กรอกชื่อหรือรหัสนักเรียน..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between">
                <span className="text-sm text-gray-600">
                  แสดงผล: <span className="font-semibold text-gray-900">{students.length}</span> คน
                </span>
              </div>
            </div>

            {/* Students Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              {loading ? (
                <div className="flex items-center justify-center py-16">
                  <div className="flex items-center space-x-2">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    <span className="text-gray-600">กำลังโหลดข้อมูล...</span>
                  </div>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">รหัสนักเรียน</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ชื่อ-สกุล</th>
                        <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">ปีการศึกษา</th>
                        <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">HTML เฉลี่ย</th>
                        <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">CSS เฉลี่ย</th>
                        <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">การพัฒนา HTML</th>
                        <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">การพัฒนา CSS</th>
                        <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">ความสมบูรณ์</th>
                        <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">จัดการ</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {students.length === 0 ? (
                        <tr>
                          <td colSpan={9} className="px-6 py-12 text-center text-gray-500">
                            <div className="flex flex-col items-center">
                              <div className="text-4xl mb-2">📋</div>
                              <p className="text-lg font-medium">ไม่มีข้อมูลนักเรียน</p>
                              <p className="text-sm">ไม่พบข้อมูลนักเรียนที่ตรงตามเงื่อนไข</p>
                            </div>
                          </td>
                        </tr>
                      ) : (
                        students.map((student) => (
                          <tr key={student.id} className="hover:bg-gray-50 transition-colors">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className="text-sm font-mono text-gray-900">{student.studentId}</span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className="text-sm font-medium text-gray-900">
                                {student.firstName} {student.lastName}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-center">
                              <span className="text-sm text-gray-900">{student.academicYear + 543}</span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-center">
                              <div className="text-sm">
                                <div className="text-gray-600">ก่อน: {student.stats.html.avgPretest}%</div>
                                <div className="font-semibold text-gray-900">หลัง: {student.stats.html.avgPosttest}%</div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-center">
                              <div className="text-sm">
                                <div className="text-gray-600">ก่อน: {student.stats.css.avgPretest}%</div>
                                <div className="font-semibold text-gray-900">หลัง: {student.stats.css.avgPosttest}%</div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-center">
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getImprovementColor(student.stats.html.improvement)}`}>
                                {getImprovementIcon(student.stats.html.improvement)}
                                {Math.abs(student.stats.html.improvement)}%
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-center">
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getImprovementColor(student.stats.css.improvement)}`}>
                                {getImprovementIcon(student.stats.css.improvement)}
                                {Math.abs(student.stats.css.improvement)}%
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-center">
                              <div className="text-xs space-y-1">
                                <div className="text-gray-600">HTML: {getCompletionRate(student.stats.html)}%</div>
                                <div className="text-gray-600">CSS: {getCompletionRate(student.stats.css)}%</div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-center">
                              <button
                                onClick={() => fetchStudentDetail(student.studentId)}
                                disabled={detailLoading}
                                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                              >
                                รายละเอียด
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>

      {/* Student Detail Modal */}
      {showDetail && selectedStudent && (
        <div 
          className="fixed inset-0 flex items-center justify-center z-50 p-4"
          style={{
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(8px)',
            WebkitBackdropFilter: 'blur(8px)'
          }}
        >
          <div className="bg-white rounded-xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden border border-gray-200">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-gray-900">
                  รายละเอียดการเรียน - {selectedStudent.firstName} {selectedStudent.lastName}
                </h2>
                <button
                  onClick={() => {
                    setShowDetail(false);
                    setSelectedLessonFilter(""); // รีเซ็ตตัวกรองเมื่อปิด modal
                  }}
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
              {/* Student Info */}
              <div className="mb-6 p-4 bg-blue-50 rounded-lg">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <span className="text-sm font-medium text-gray-600">รหัสนักเรียน:</span>
                    <span className="ml-2 text-sm font-mono text-gray-900">{selectedStudent.studentId}</span>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-600">ปีการศึกษา:</span>
                    <span className="ml-2 text-sm text-gray-900">{selectedStudent.academicYear + 543}</span>
                  </div>
                </div>
              </div>

              {/* Filter by lesson dropdown */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-black mb-2">
                  เลือกบทเรียน
                </label>
                <select
                  value={selectedLessonFilter}
                  onChange={e => setSelectedLessonFilter(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black bg-white cursor-pointer"
                >
                  <option value="">แสดงทั้งหมด</option>
                  {getLessonOptions().map(option => {
                    const [type, lesson] = option.split('-');
                    return (
                      <option key={option} value={option}>
                        {type} - บทเรียนที่ {lesson}
                      </option>
                    );
                  })}
                </select>
              </div>

              {/* Results */}
              <div className="space-y-6">
                {filteredDetailedResults.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <div className="text-4xl mb-2">🔍</div>
                    <p className="text-lg font-medium">ไม่พบข้อมูลที่ค้นหา</p>
                  </div>
                ) : (
                  filteredDetailedResults.map((result, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-6 bg-gray-50">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">
                        {result.quizType} - บทเรียนที่ {result.lesson}
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Pretest */}
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                          <h4 className="font-semibold text-blue-800 mb-3 flex items-center">
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            ก่อนเรียน
                          </h4>
                          {result.pretest ? (
                            <div className="space-y-2">
                              <div className="flex justify-between">
                                <span className="text-sm text-gray-600">คะแนน:</span>
                                <span className="text-sm font-medium text-black">{result.pretest.score}/{result.pretest.totalScore}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-sm text-gray-600">เปอร์เซ็นต์:</span>
                                <span className="text-sm font-medium text-black">{result.pretest.percentage}%</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-sm text-gray-600">วันที่:</span>
                                <span className="text-sm text-black">{new Date(result.pretest.completedAt).toLocaleDateString('th-TH')}</span>
                              </div>
                            </div>
                          ) : (
                            <p className="text-gray-500 text-sm">ยังไม่ได้ทำข้อสอบ</p>
                          )}
                        </div>

                        {/* Posttests */}
                        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                          <h4 className="font-semibold text-green-800 mb-3 flex items-center">
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                            </svg>
                            หลังเรียน ({result.posttests.length} ครั้ง)
                          </h4>
                          {result.posttests.length > 0 ? (
                            <div className="space-y-3">
                              {result.posttests.slice(0, 3).map((posttest: QuizResult, idx: number) => (
                                <div key={idx} className="bg-white rounded p-3 border border-green-200">
                                  <div className="flex justify-between items-center mb-1">
                                    <span className="text-xs font-medium text-gray-600">ครั้งที่ {result.posttests.length - idx}</span>
                                    <span className="text-sm font-semibold text-black">{posttest.score}/{posttest.totalScore} ({posttest.percentage}%)</span>
                                  </div>
                                  <p className="text-xs text-black">
                                    {new Date(posttest.completedAt).toLocaleDateString('th-TH')}
                                  </p>
                                </div>
                              ))}
                              {result.posttests.length > 3 && (
                                <p className="text-xs text-gray-500 text-center">
                                  และอีก {result.posttests.length - 3} ครั้ง...
                                </p>
                              )}
                            </div>
                          ) : (
                            <p className="text-gray-500 text-sm">ยังไม่ได้ทำข้อสอบ</p>
                          )}
                        </div>
                      </div>

                      {/* Improvement indicator */}
                      {result.pretest && result.posttests.length > 0 && (
                        <div className="mt-4 p-4 bg-white border border-gray-200 rounded-lg">
                          <div className="flex justify-between items-center">
                            <span className="font-medium text-gray-700">การพัฒนา:</span>
                            <span className={`font-bold text-lg ${getImprovementColor(result.posttests[0].percentage - result.pretest.percentage)}`}>
                              {getImprovementIcon(result.posttests[0].percentage - result.pretest.percentage)}
                              {Math.abs(result.posttests[0].percentage - result.pretest.percentage).toFixed(1)}%
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function AdminStudentsPage() {
  return (
    <RouteGuard requireAuth={true} requireAdmin={true}>
      <AdminStudentsContent />
    </RouteGuard>
  );
}