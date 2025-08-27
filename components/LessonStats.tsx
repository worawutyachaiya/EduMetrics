// components/LessonStats.tsx
import React, { useState, useEffect } from 'react';

interface LessonStatsProps {
  currentFilters: {
    phase: 'all' | 'pre' | 'post';
    type: 'all' | 'HTML' | 'CSS';
  };
  onDeleteLesson: (lesson: number) => void;
  submitting: boolean;
}

interface LessonStat {
  lesson: number;
  totalQuizzes: number;
  htmlQuizzes: number;
  cssQuizzes: number;
  preQuizzes: number;
  postQuizzes: number;
}

const LessonStats: React.FC<LessonStatsProps> = ({ 
  currentFilters, 
  onDeleteLesson, 
  submitting 
}) => {
  const [stats, setStats] = useState<LessonStat[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = async () => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams({
        page: '1',
        limit: '1000', // ดึงข้อมูลทั้งหมด
      });

      if (currentFilters.phase !== 'all') {
        params.append('phase', currentFilters.phase);
      }
      if (currentFilters.type !== 'all') {
        params.append('questionType', currentFilters.type);
      }

      const response = await fetch(`/api/admin/quizzes?${params}`);
      if (!response.ok) {
        throw new Error("Failed to fetch quiz statistics");
      }

      const data = await response.json();
      const quizzes = data.quizzes;

      // คำนวณสถิติแต่ละบทเรียน
      const lessonStats: Record<number, LessonStat> = {};

      // Initialize all lessons (1-10)
      for (let i = 1; i <= 10; i++) {
        lessonStats[i] = {
          lesson: i,
          totalQuizzes: 0,
          htmlQuizzes: 0,
          cssQuizzes: 0,
          preQuizzes: 0,
          postQuizzes: 0,
        };
      }

      // นับข้อสอบแต่ละประเภท
      quizzes.forEach((quiz: any) => {
        const lesson = quiz.lesson;
        if (lessonStats[lesson]) {
          lessonStats[lesson].totalQuizzes++;
          
          if (quiz.questionType === 'HTML') {
            lessonStats[lesson].htmlQuizzes++;
          } else if (quiz.questionType === 'CSS') {
            lessonStats[lesson].cssQuizzes++;
          }
          
          if (quiz.phase === 'pre') {
            lessonStats[lesson].preQuizzes++;
          } else if (quiz.phase === 'post') {
            lessonStats[lesson].postQuizzes++;
          }
        }
      });

      setStats(Object.values(lessonStats));
    } catch (err) {
      setError(err instanceof Error ? err.message : "เกิดข้อผิดพลาดในการโหลดสถิติ");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, [currentFilters]);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {Array.from({ length: 10 }).map((_, index) => (
          <div key={index} className="bg-gray-100 p-4 rounded-lg animate-pulse">
            <div className="h-4 bg-gray-200 rounded mb-2"></div>
            <div className="h-6 bg-gray-200 rounded mb-2"></div>
            <div className="h-3 bg-gray-200 rounded"></div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-600 p-4 bg-red-50 rounded-lg">
        เกิดข้อผิดพลาด: {error}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
      {stats.map((stat) => (
        <div 
          key={stat.lesson}
          className={`group relative overflow-hidden rounded-2xl border-2 transition-all duration-300 hover:scale-105 hover:shadow-xl ${
            stat.totalQuizzes > 0 
              ? 'bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200 hover:border-blue-300' 
              : 'bg-gradient-to-br from-gray-50 to-gray-100 border-gray-200 hover:border-gray-300'
          }`}
        >
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-5">
            <svg className="w-full h-full" viewBox="0 0 100 100">
              <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
                <path d="M 10 0 L 0 0 0 10" fill="none" stroke="currentColor" strokeWidth="1"/>
              </pattern>
              <rect width="100" height="100" fill="url(#grid)" />
            </svg>
          </div>

          <div className="relative p-6">
            {/* Header */}
            <div className="flex justify-between items-start mb-4">
              <div className={`inline-flex items-center justify-center w-10 h-10 rounded-xl font-bold text-lg ${
                stat.totalQuizzes > 0 
                  ? 'bg-blue-500 text-white shadow-lg' 
                  : 'bg-gray-300 text-gray-500'
              }`}>
                {stat.lesson}
              </div>
              {stat.totalQuizzes > 0 && (
                <button
                  onClick={() => onDeleteLesson(stat.lesson)}
                  disabled={submitting}
                  className="opacity-0 group-hover:opacity-100 transition-all duration-200 text-red-500 hover:text-red-700 disabled:text-gray-400 bg-white/80 rounded-full p-2 shadow-md hover:shadow-lg"
                  title="ลบข้อสอบทั้งบท"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              )}
            </div>
            
            {/* Main Count */}
            <div className="mb-4">
              <div className={`text-3xl font-bold mb-1 ${
                stat.totalQuizzes > 0 ? 'text-blue-600' : 'text-gray-400'
              }`}>
                {stat.totalQuizzes}
              </div>
              <p className="text-sm text-gray-600 font-medium">ข้อสอบทั้งหมด</p>
            </div>
            
            {/* Statistics Grid */}
            {stat.totalQuizzes > 0 ? (
              <div className="space-y-2">
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="bg-white/60 rounded-lg p-2 text-center border border-orange-200">
                    <div className="font-bold text-orange-600">{stat.htmlQuizzes}</div>
                    <div className="text-orange-500">HTML</div>
                  </div>
                  <div className="bg-white/60 rounded-lg p-2 text-center border border-blue-200">
                    <div className="font-bold text-blue-600">{stat.cssQuizzes}</div>
                    <div className="text-blue-500">CSS</div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="bg-white/60 rounded-lg p-2 text-center border border-green-200">
                    <div className="font-bold text-green-600">{stat.preQuizzes}</div>
                    <div className="text-green-500">ก่อนเรียน</div>
                  </div>
                  <div className="bg-white/60 rounded-lg p-2 text-center border border-purple-200">
                    <div className="font-bold text-purple-600">{stat.postQuizzes}</div>
                    <div className="text-purple-500">หลังเรียน</div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-4">
                <div className="text-gray-400 mb-2">
                  <svg className="w-8 h-8 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <p className="text-xs text-gray-400 font-medium">ยังไม่มีข้อสอบ</p>
              </div>
            )}

            {/* Progress Bar */}
            {stat.totalQuizzes > 0 && (
              <div className="mt-4 pt-4 border-t border-white/50">
                <div className="text-xs text-gray-500 mb-1">ความครบถ้วน</div>
                <div className="bg-white/60 rounded-full h-2 overflow-hidden">
                  <div 
                    className="bg-gradient-to-r from-blue-500 to-indigo-500 h-full transition-all duration-500"
                    style={{ width: `${Math.min((stat.totalQuizzes / 20) * 100, 100)}%` }}
                  ></div>
                </div>
                <div className="text-xs text-gray-500 mt-1 text-right">
                  {stat.totalQuizzes}/20
                </div>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default LessonStats;
