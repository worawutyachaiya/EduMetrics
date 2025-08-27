// app/admin/quiz/page.tsx
"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { useAuth } from '@/lib/auth-context';
import { useRouter } from 'next/navigation';
import RouteGuard from '@/components/routeGuard';
import QuizTable from '@/components/QuizTable';
import Pagination from '@/components/Pagination';
import LoadingSkeleton from '@/components/LoadingSkeleton';
import LessonStats from '@/components/LessonStats';
import AdminSidebar from '@/components/AdminSidebar';
import AdminHeader from '@/components/AdminHeader';

type QuizItem = {
  id: number;
  questionType: "HTML" | "CSS";
  question: string;
  choices: string[];
  correct: string;
  score: string;
  phase: "pre" | "post";
  lesson: number;
  createdAt?: string;
  updatedAt?: string;
};

function AdminQuizContent() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [quizzes, setQuizzes] = useState<QuizItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editingQuiz, setEditingQuiz] = useState<QuizItem | null>(null);
  
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [itemsPerPage] = useState(20); // แสดง 20 รายการต่อหน้า
  
  // Filter states
  const [selectedLesson, setSelectedLesson] = useState<number | 'all'>('all');
  const [selectedPhase, setSelectedPhase] = useState<'all' | 'pre' | 'post'>('all');
  const [selectedType, setSelectedType] = useState<'all' | 'HTML' | 'CSS'>('all');

  const [form, setForm] = useState<QuizItem>({
    id: 0,
    questionType: "HTML",
    question: "",
    choices: ["", "", "", ""],
    correct: "1",
    score: "10",
    phase: "pre",
    lesson: 1,
  });

  // Fetch quizzes with filters and pagination
  const fetchQuizzes = useCallback(async (page = currentPage, retryCount = 0) => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams({
        page: page.toString(),
        limit: itemsPerPage.toString(),
      });

      if (selectedLesson !== 'all') {
        params.append('lesson', selectedLesson.toString());
      }
      if (selectedPhase !== 'all') {
        params.append('phase', selectedPhase);
      }
      if (selectedType !== 'all') {
        params.append('questionType', selectedType);
      }

      const response = await fetch(`/api/admin/quizzes?${params}`);
      if (!response.ok) {
        throw new Error("Failed to fetch quizzes");
      }

      const data = await response.json();
      setQuizzes(data.quizzes);
      setTotalPages(data.pagination.totalPages);
      setTotalItems(data.pagination.totalItems);
      setCurrentPage(data.pagination.currentPage);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "เกิดข้อผิดพลาดในการโหลดข้อมูล";
      
      // Retry mechanism สำหรับ network errors
      if (retryCount < 2 && errorMessage.includes("Failed to fetch")) {
        setTimeout(() => {
          fetchQuizzes(page, retryCount + 1);
        }, 1000 * (retryCount + 1)); // Exponential backoff
        return;
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [currentPage, itemsPerPage, selectedLesson, selectedPhase, selectedType]);

  // Fetch quizzes on component mount and when filters change
  useEffect(() => {
    fetchQuizzes(1);
  }, [selectedLesson, selectedPhase, selectedType, itemsPerPage]);

  // Remove old filter-related useMemo hooks since we're using server-side filtering now
  const availableLessons = useMemo(() => {
    // This should be fetched from server if needed, or kept as static array
    return [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
    index?: number
  ) => {
    const { name, value } = e.target;

    if (name === "choice" && index !== undefined) {
      const updatedChoices = [...form.choices];
      updatedChoices[index] = value;
      setForm({ ...form, choices: updatedChoices });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const resetForm = () => {
    setForm({
      id: 0,
      questionType: "HTML",
      question: "",
      choices: ["", "", "", ""],
      correct: "1",
      score: "10",
      phase: "pre",
      lesson: 1,
    });
    setEditingQuiz(null);
  };

  const handleSubmit = async () => {
    if (
      !form.questionType ||
      !form.question ||
      form.choices.some((c) => !c.trim()) ||
      !form.correct ||
      !form.score ||
      !form.phase ||
      !form.lesson
    ) {
      alert("กรุณากรอกข้อมูลให้ครบถ้วน");
      return;
    }

    if (form.lesson < 1 || form.lesson > 10) {
      alert("บทเรียนต้องอยู่ระหว่าง 1-10");
      return;
    }

    try {
      setSubmitting(true);
      setError(null);

      const url = editingQuiz ? `/api/admin/quizzes/${form.id}` : "/api/admin/quizzes";
      const method = editingQuiz ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          questionType: form.questionType,
          question: form.question,
          choices: form.choices,
          correct: form.correct,
          score: form.score,
          phase: form.phase,
          lesson: parseInt(form.lesson.toString()),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "เกิดข้อผิดพลาดในการบันทึกข้อมูล");
      }

      if (editingQuiz) {
        setQuizzes((prev) => prev.map((q) => (q.id === form.id ? data : q)));
        alert("แก้ไขข้อสอบสำเร็จ");
      } else {
        // เมื่อเพิ่มข้อสอบใหม่ ให้ reload ข้อมูลเพื่อแสดงผลที่ถูกต้อง
        await fetchQuizzes(1);
        alert("เพิ่มข้อสอบสำเร็จ");
      }

      resetForm();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "เกิดข้อผิดพลาดในการบันทึกข้อมูล"
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = useCallback((quiz: QuizItem) => {
    setEditingQuiz(quiz);
    setForm(quiz);
  }, []);

  const handleDelete = useCallback(async (id: number) => {
    if (!confirm("คุณต้องการลบข้อสอบนี้หรือไม่?")) return;

    try {
      setError(null);

      const response = await fetch(`/api/admin/quizzes/${id}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "เกิดข้อผิดพลาดในการลบข้อมูล");
      }

      // Reload ข้อมูลหลังลบ
      await fetchQuizzes();
      alert("ลบข้อสอบสำเร็จ");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "เกิดข้อผิดพลาดในการลบข้อมูล"
      );
    }
  }, [fetchQuizzes]);

  const handleDeleteByLesson = useCallback(async (lesson: number) => {
    // ถ้าเลือกบทเรียนทั้งหมด ไม่อนุญาตให้ลบ
    if (selectedLesson === 'all') {
      alert("กรุณาเลือกบทเรียนที่ต้องการลบก่อน");
      return;
    }

    // ดึงข้อมูลข้อสอบในบทเรียนนั้นทั้งหมด
    try {
      const params = new URLSearchParams({
        lesson: lesson.toString(),
        page: '1',
        limit: '1000' // ดึงข้อมูลทั้งหมดในบทเรียนนั้น
      });

      const response = await fetch(`/api/admin/quizzes?${params}`);
      if (!response.ok) {
        throw new Error("ไม่สามารถดึงข้อมูลข้อสอบได้");
      }

      const data = await response.json();
      const quizzesInLesson = data.quizzes;

      if (quizzesInLesson.length === 0) {
        alert("ไม่มีข้อสอบในบทเรียนนี้");
        return;
      }

      const confirmMessage = `คุณต้องการลบข้อสอบทั้งหมดในบทเรียนที่ ${lesson} จำนวน ${quizzesInLesson.length} ข้อหรือไม่?\n\nการดำเนินการนี้ไม่สามารถยกเลิกได้`;
      
      if (!confirm(confirmMessage)) return;

      setSubmitting(true);
      setError(null);

      // สร้าง API endpoint สำหรับลบทั้งบทเรียน
      const deleteResponse = await fetch(`/api/admin/quizzes/bulk-delete`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          lesson: lesson,
        }),
      });

      const deleteData = await deleteResponse.json();

      if (!deleteResponse.ok) {
        throw new Error(deleteData.error || "เกิดข้อผิดพลาดในการลบข้อมูล");
      }

      // Reload ข้อมูลหลังลบ
      await fetchQuizzes(1);
      alert(`ลบข้อสอบทั้งหมดในบทเรียนที่ ${lesson} สำเร็จ (${deleteData.deletedCount} ข้อ)`);
      
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "เกิดข้อผิดพลาดในการลบข้อมูล"
      );
    } finally {
      setSubmitting(false);
    }
  }, [selectedLesson, fetchQuizzes]);

  const handleLogout = async () => {
    if (confirm("คุณต้องการออกจากระบบหรือไม่?")) {
      await logout();
      router.push('/login');
    }
  };

  // Debounced filter handlers
  const handleFilterChange = useCallback((filterType: string, value: any) => {
    switch (filterType) {
      case 'lesson':
        setSelectedLesson(value);
        break;
      case 'phase':
        setSelectedPhase(value);
        break;
      case 'type':
        setSelectedType(value);
        break;
    }
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <AdminSidebar currentPage="quiz" />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <AdminHeader 
          user={user} 
          title="จัดการข้อสอบ" 
          onLogout={handleLogout} 
        />

        {/* Main Content Area */}
        <main className="flex-1 overflow-auto">
          <div className="max-w-7xl mx-auto px-6 py-8">
            
            {/* Error Message */}
            {error && (
              <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl flex justify-between items-center shadow-sm">
                <div className="flex items-center space-x-2">
                  <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>{error}</span>
                </div>
                <button
                  onClick={() => fetchQuizzes(currentPage)}
                  className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-lg text-sm transition-colors"
                >
                  ลองใหม่
                </button>
              </div>
            )}

            {/* Add/Edit Quiz Form */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 mb-8">
              <div className="flex items-center space-x-3 mb-6">
                <div className="bg-blue-500 p-2 rounded-lg">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-gray-800">
                  {editingQuiz ? "แก้ไขข้อสอบ" : "เพิ่มข้อสอบใหม่"}
                </h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                {/* ประเภทคำถาม */}
                <div>
                  <label className="block mb-2 font-semibold text-sm text-gray-700">
                    ประเภทคำถาม
                  </label>
                  <select
                    name="questionType"
                    value={form.questionType}
                    onChange={handleChange}
                    disabled={submitting}
                    className="w-full border border-gray-300 px-4 py-3 rounded-lg text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 transition-colors"
                  >
                    <option value="HTML">HTML</option>
                    <option value="CSS">CSS</option>
                  </select>
                </div>

                {/* ก่อนเรียน/หลังเรียน */}
                <div>
                  <label className="block mb-2 font-semibold text-sm text-gray-700">
                    แบบทดสอบสำหรับ
                  </label>
                  <select
                    name="phase"
                    value={form.phase}
                    onChange={handleChange}
                    disabled={submitting}
                    className="w-full border border-gray-300 px-4 py-3 rounded-lg text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 transition-colors"
                  >
                    <option value="pre">ก่อนเรียน</option>
                    <option value="post">หลังเรียน</option>
                  </select>
                </div>

                {/* บทเรียน */}
                <div>
                  <label className="block mb-2 font-semibold text-sm text-gray-700">
                    บทเรียนที่
                  </label>
                  <select
                    name="lesson"
                    value={form.lesson}
                    onChange={handleChange}
                    disabled={submitting}
                    className="w-full border border-gray-300 px-4 py-3 rounded-lg text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 transition-colors"
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => (
                      <option key={num} value={num}>บทเรียนที่ {num}</option>
                    ))}
                  </select>
                </div>

                {/* คะแนน */}
                <div>
                  <label className="block mb-2 font-semibold text-sm text-gray-700">
                    คะแนนข้อสอบ
                  </label>
                  <input
                    name="score"
                    value={form.score}
                    onChange={handleChange}
                    disabled={submitting}
                    placeholder="กรอกคะแนน"
                    className="w-full border border-gray-300 px-4 py-3 rounded-lg text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 transition-colors"
                  />
                </div>
              </div>

              {/* คำถาม */}
              <div className="mb-6">
                <label className="block mb-2 font-semibold text-sm text-gray-700">
                  คำถาม
                </label>
                <textarea
                  name="question"
                  value={form.question}
                  onChange={handleChange}
                  disabled={submitting}
                  placeholder="กรอกคำถาม..."
                  rows={3}
                  className="w-full border border-gray-300 px-4 py-3 rounded-lg text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 transition-colors resize-none"
                />
              </div>

              {/* ตัวเลือกคำตอบ */}
              <div className="mb-6">
                <label className="block font-semibold mb-3 text-sm text-gray-700">
                  ตัวเลือกคำตอบ
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {form.choices.map((choice, idx) => (
                    <div key={idx} className="relative">
                      <input
                        name="choice"
                        value={choice}
                        placeholder={`ตัวเลือก ${idx + 1}`}
                        onChange={(e) => handleChange(e, idx)}
                        disabled={submitting}
                        className="w-full border border-gray-300 px-10 py-3 rounded-lg text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 transition-colors"
                      />
                      <span className="absolute left-3 top-1/2 transform -translate-y-1/2 bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
                        {idx + 1}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* คำตอบที่ถูก */}
              <div className="mb-6">
                <label className="block mb-2 font-semibold text-sm text-gray-700">
                  คำตอบที่ถูกต้อง
                </label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {[1, 2, 3, 4].map((num) => (
                    <label key={num} className="relative cursor-pointer">
                      <input
                        type="radio"
                        name="correct"
                        value={num.toString()}
                        checked={form.correct === num.toString()}
                        onChange={handleChange}
                        disabled={submitting}
                        className="sr-only"
                      />
                      <div className={`border-2 rounded-lg p-3 text-center transition-all ${
                        form.correct === num.toString()
                          ? 'border-blue-500 bg-blue-50 text-blue-700'
                          : 'border-gray-300 bg-white text-gray-700 hover:border-blue-300'
                      }`}>
                        <span className="font-semibold">ตัวเลือก {num}</span>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="flex gap-4">
                <button
                  onClick={handleSubmit}
                  disabled={submitting}
                  className="flex-1 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-200 shadow-md hover:shadow-lg flex items-center justify-center space-x-2"
                >
                  {submitting ? (
                    <>
                      <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <span>กำลังบันทึก...</span>
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span>{editingQuiz ? "อัปเดตข้อสอบ" : "เพิ่มข้อสอบ"}</span>
                    </>
                  )}
                </button>
                {editingQuiz && (
                  <button
                    onClick={resetForm}
                    disabled={submitting}
                    className="px-6 py-3 bg-gray-500 hover:bg-gray-600 disabled:bg-gray-300 text-white rounded-lg font-semibold transition-all duration-200 shadow-md hover:shadow-lg"
                  >
                    ยกเลิก
                  </button>
                )}
              </div>
            </div>

            {/* Filters Section */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mb-8">
              <div className="flex items-center space-x-3 mb-6">
                <div className="bg-indigo-500 p-2 rounded-lg">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.207A1 1 0 013 6.5V4z" />
                  </svg>
                </div>
                <h2 className="text-xl font-bold text-gray-800">ตัวกรองข้อมูล</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-4">
                {/* Filter by Lesson */}
                <div>
                  <label className="block mb-2 text-sm font-semibold text-gray-700">บทเรียน</label>
                  <select
                    value={selectedLesson}
                    onChange={(e) => handleFilterChange('lesson', e.target.value === 'all' ? 'all' : parseInt(e.target.value))}
                    className="w-full border border-gray-300 px-4 py-3 rounded-lg text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  >
                    <option value="all">ทุกบทเรียน</option>
                    {availableLessons.map(lesson => (
                      <option key={lesson} value={lesson}>บทเรียนที่ {lesson}</option>
                    ))}
                  </select>
                </div>

                {/* Filter by Phase */}
                <div>
                  <label className="block mb-2 text-sm font-semibold text-gray-700">ช่วงเวลา</label>
                  <select
                    value={selectedPhase}
                    onChange={(e) => handleFilterChange('phase', e.target.value as 'all' | 'pre' | 'post')}
                    className="w-full border border-gray-300 px-4 py-3 rounded-lg text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  >
                    <option value="all">ทุกช่วง</option>
                    <option value="pre">ก่อนเรียน</option>
                    <option value="post">หลังเรียน</option>
                  </select>
                </div>

                {/* Filter by Type */}
                <div>
                  <label className="block mb-2 text-sm font-semibold text-gray-700">ประเภท</label>
                  <select
                    value={selectedType}
                    onChange={(e) => handleFilterChange('type', e.target.value as 'all' | 'HTML' | 'CSS')}
                    className="w-full border border-gray-300 px-4 py-3 rounded-lg text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  >
                    <option value="all">ทุกประเภท</option>
                    <option value="HTML">HTML</option>
                    <option value="CSS">CSS</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-between items-center">
                <div className="text-sm text-gray-600 bg-gray-50 px-3 py-2 rounded-lg">
                  <span className="font-semibold">แสดงผล:</span> {quizzes.length} ข้อในหน้านี้ จากทั้งหมด {totalItems} ข้อ
                </div>
                
                {/* ปุ่มลบทั้งบทเรียน */}
                {selectedLesson !== 'all' && (
                  <button
                    onClick={() => handleDeleteByLesson(selectedLesson as number)}
                    disabled={submitting || loading}
                    className="bg-red-500 hover:bg-red-600 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg transition-all duration-200 flex items-center gap-2 shadow-md hover:shadow-lg"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    {submitting ? 'กำลังลบ...' : `ลบทั้งบทเรียนที่ ${selectedLesson}`}
                  </button>
                )}
              </div>
            </div>

            {loading ? (
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
                <div className="flex justify-between items-center mb-4">
                  <div className="h-6 bg-gray-200 rounded animate-pulse w-48"></div>
                </div>
                <LoadingSkeleton rows={10} columns={8} />
              </div>
            ) : quizzes.length === 0 ? (
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-12 text-center">
                <div className="text-gray-400 mb-4">
                  <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-700 mb-2">ไม่มีข้อมูลข้อสอบ</h3>
                <p className="text-gray-500">ไม่พบข้อสอบตามเงื่อนไขที่เลือก ลองเปลี่ยนตัวกรองหรือเพิ่มข้อสอบใหม่</p>
              </div>
            ) : (
              <div className="space-y-8">
                {/* สถิติข้อสอบแต่ละบทเรียน - แสดงเฉพาะเมื่อดูทุกบทเรียน */}
                {selectedLesson === 'all' && (
                  <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
                    <div className="flex items-center space-x-3 mb-6">
                      <div className="bg-green-500 p-2 rounded-lg">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
                      </div>
                      <h3 className="text-xl font-bold text-gray-800">สถิติข้อสอบแต่ละบทเรียน</h3>
                    </div>
                    <LessonStats 
                      currentFilters={{ 
                        phase: selectedPhase, 
                        type: selectedType 
                      }}
                      onDeleteLesson={handleDeleteByLesson}
                      submitting={submitting}
                    />
                  </div>
                )}

                {/* Quiz Table */}
                <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
                  <div className="flex justify-between items-center mb-6">
                    <div className="flex items-center space-x-3">
                      <div className="bg-purple-500 p-2 rounded-lg">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                      </div>
                      <h3 className="text-xl font-bold text-gray-800">
                        {selectedLesson === 'all' 
                          ? 'รายการข้อสอบทั้งหมด'
                          : `ข้อสอบบทเรียนที่ ${selectedLesson}`
                        }
                      </h3>
                    </div>
                    <div className="text-sm text-gray-500">
                      หน้า {currentPage} จาก {totalPages}
                    </div>
                  </div>
                  
                  <QuizTable
                    quizzes={quizzes}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    startIndex={(currentPage - 1) * itemsPerPage}
                  />
                </div>

                {/* Pagination */}
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  totalItems={totalItems}
                  itemsPerPage={itemsPerPage}
                  onPageChange={(page) => {
                    setCurrentPage(page);
                    fetchQuizzes(page);
                  }}
                />
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

export default function AdminQuizPage() {
  return (
    <RouteGuard requireAuth={true} requireAdmin={true}>
      <AdminQuizContent />
    </RouteGuard>
  );
}
