// components/PretestQuizComponent.tsx - (ฉบับแก้ไข)
"use client";
import { useState, useEffect, useCallback } from "react";
import { useAuth } from '@/lib/auth-context';
import { useRouter } from 'next/navigation';
import { FileText, Star, Rocket } from 'lucide-react';

type QuizItem = {
  id: number;
  question: string;
  choices: string[];
  correct: string; // "1", "2", "3", "4"
  score: string;
  lesson: number;
};

type PretestQuizProps = {
  type: 'HTML' | 'CSS';
  title: string;
};

export default function PretestQuizComponent({ type, title }: PretestQuizProps) {
  const { user } = useAuth();
  const router = useRouter();
  const [currentLesson, setCurrentLesson] = useState(1);
  const [quizzes, setQuizzes] = useState<QuizItem[]>([]);
  
  // ✨ **[แก้ไข 1/3]** เปลี่ยน State ให้เก็บคำตอบเป็นตัวเลข (ลำดับของคำตอบ)
  const [answers, setAnswers] = useState<{ [key: number]: number }>({});
  
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [completedLessons, setCompletedLessons] = useState<number[]>([]);

  const fetchCompletedLessons = useCallback(async () => {
    if (!user?.id) return;

    try {
      const response = await fetch(`/api/pretest-status?courseType=${type}&userId=${user.id}`);
      if (response.ok) {
        const data = await response.json();
        setCompletedLessons(data.completedLessons || []);
        
        const nextLesson = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].find(
          lesson => !data.completedLessons.includes(lesson)
        );
        
        if (nextLesson) {
          setCurrentLesson(nextLesson);
        } else {
          alert('คุณทำข้อสอบก่อนเรียนครบทุกบทแล้ว!');
          router.push(type === 'HTML' ? '/htmlvideo' : '/cssvideo');
        }
      }
    } catch (error) {
      console.error('Error fetching completed lessons:', error);
    }
  }, [type, user?.id, router]);

  const fetchQuizzes = useCallback(async () => {
    if (!currentLesson) return;
    try {
      setLoading(true);
      setError(null);
      setAnswers({});

      const response = await fetch(`/api/quizzes/by-lesson?type=${type}&phase=pre&lesson=${currentLesson}`);
      if (!response.ok) {
        throw new Error('Failed to fetch quizzes for the lesson');
      }

      const data = await response.json();
      setQuizzes(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'เกิดข้อผิดพลาดในการโหลดข้อมูล');
    } finally {
      setLoading(false);
    }
  }, [type, currentLesson]);

  useEffect(() => {
    if (user) {
      fetchCompletedLessons();
    }
  }, [user, fetchCompletedLessons]);

  useEffect(() => {
    if (currentLesson) {
      fetchQuizzes();
    }
  }, [currentLesson, fetchQuizzes]);

  // ✨ **[แก้ไข 2/3]** อัปเดตฟังก์ชันให้รับและเก็บ "ลำดับของตัวเลือก"
  const handleChange = (questionIndex: number, choiceIndex: number) => {
    // เก็บเป็น 1, 2, 3, 4
    setAnswers(prev => ({ ...prev, [questionIndex]: choiceIndex + 1 }));
  };

  const calculateScore = () => {
    let totalScore = 0;

    quizzes.forEach((quiz, index) => {
      // ✨ **[แก้ไข 3/3]** เปรียบเทียบ "ตัวเลข" กับ "ตัวเลข"
      const userAnswer = answers[index]; // e.g., 1
      const correctAnswer = parseInt(quiz.correct); // e.g., 1
      
      if (userAnswer === correctAnswer) {
        totalScore += parseFloat(quiz.score);
      }
    });

    const maxScore = quizzes.reduce((sum, quiz) => sum + parseFloat(quiz.score), 0);
    const percentage = maxScore > 0 ? (totalScore / maxScore) * 100 : 0;

    return {
      score: totalScore,
      totalScore: maxScore,
      percentage: Math.round(percentage * 100) / 100,
      passed: percentage >= 80
    };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (Object.keys(answers).length !== quizzes.length) {
      alert('กรุณาตอบให้ครบทุกข้อ');
      return;
    }

    setSubmitting(true);
    
    try {
      const scoreResult = calculateScore();
      
      const response = await fetch('/api/quiz-results', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user?.id,
          studentId: user?.studentId,
          quizType: type,
          phase: 'pre',
          lesson: currentLesson,
          score: scoreResult.score,
          totalScore: scoreResult.totalScore,
          percentage: scoreResult.percentage,
          passed: scoreResult.passed,
          answers: JSON.stringify(answers) 
        })
      });

      if (!response.ok) {
        throw new Error('Failed to save quiz result');
      }

      if (scoreResult.passed) {
        await fetch('/api/user-progress', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId: user?.id,
            courseType: type,
            lesson: currentLesson,
            skipped: true
          })
        });
      }

      const nextLesson = currentLesson + 1;
      if (nextLesson <= 10) {
        setCompletedLessons(prev => [...prev, currentLesson]);
        setCurrentLesson(nextLesson);
      } else {
        alert('ทำข้อสอบก่อนเรียนครบทุกบทแล้ว!');
        router.push(type === 'HTML' ? '/htmlvideo' : '/cssvideo');
      }
      
    } catch (error) {
      console.error('Error submitting quiz:', error);
      alert('เกิดข้อผิดพลาดในการส่งคำตอบ');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-300 border-t-blue-600 mx-auto mb-6"></div>
          <div className="text-2xl font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            กำลังโหลดข้อสอบ...
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-gray-200/50 p-8 text-center max-w-md mx-auto">
          <div className="text-red-500 text-xl font-semibold mb-4">เกิดข้อผิดพลาด: {error}</div>
          <button
            onClick={fetchQuizzes}
            className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 py-3 rounded-2xl font-semibold hover:from-blue-600 hover:to-purple-600 transform hover:scale-105 transition-all duration-300 shadow-lg"
          >
            ลองใหม่
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 px-4 py-12 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 right-20 w-64 h-64 bg-purple-100 rounded-full opacity-20"></div>
        <div className="absolute bottom-20 left-20 w-48 h-48 bg-blue-100 rounded-full opacity-20"></div>
      </div>
      
      <div className="w-full max-w-4xl mx-auto relative z-10">
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-gray-200/50 p-8 mb-8">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              {title}
            </h1>
            <span className="text-lg font-semibold text-gray-700 bg-gradient-to-r from-blue-50 to-purple-50 px-4 py-2 rounded-2xl">
              บทเรียนที่ {currentLesson} / 10
            </span>
          </div>
        
        <div className="w-full bg-gradient-to-r from-blue-200 to-purple-200 rounded-full h-3 mb-4">
          <div
            className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full transition-all duration-300"
            style={{ width: `${(completedLessons.length / 10) * 100}%` }}
          />
        </div>
        
        <p className="text-gray-600 font-medium">
          ความคืบหน้า: {completedLessons.length}/10 บทเรียน
        </p>
      </div>

      <main className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-gray-200/50 p-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            ข้อสอบก่อนเรียน {type} - บทเรียนที่ {currentLesson}
          </h2>
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-4">
            <p className="text-gray-700 font-medium flex items-center gap-2">
              <FileText className="w-5 h-5 text-blue-600" />
              จำนวนข้อสอบ: {quizzes.length} ข้อ
              <Star className="w-5 h-5 text-yellow-500 ml-2" />
              เกณฑ์ผ่าน: 80%
              <Rocket className="w-5 h-5 text-purple-500 ml-2" />
              ผ่านแล้วจะข้ามบทเรียนนี้
            </p>
          </div>
        </div>

        {quizzes.length === 0 ? (
          <div className="text-center text-gray-500">
            ไม่มีข้อสอบสำหรับบทเรียนนี้
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-8">
            {quizzes.map((quiz, index) => (
              <div key={quiz.id} className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-2xl border border-gray-200/50">
                <p className="text-xl font-semibold text-gray-800 mb-4 leading-relaxed">
                  {index + 1}. {quiz.question}
                </p>
                <div className="space-y-3 pl-4">
                  {quiz.choices.map((choice, i) => (
                    <label key={i} className="flex items-center cursor-pointer p-3 rounded-xl hover:bg-white/50 transition-colors">
                      <input
                        type="radio"
                        name={`question-${index}`}
                        value={i + 1}
                        checked={answers[index] === (i + 1)}
                        onChange={() => handleChange(index, i)}
                        className="mr-4 w-5 h-5 text-blue-600"
                        disabled={submitting}
                      />
                      <span className="text-gray-700 text-lg">{choice}</span>
                    </label>
                  ))}
                </div>
              </div>
            ))}

            <div className="text-center pt-8">
              <button
                type="submit"
                disabled={submitting || Object.keys(answers).length !== quizzes.length}
                className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-12 py-4 rounded-2xl font-semibold text-lg hover:from-blue-600 hover:to-purple-600 disabled:from-gray-400 disabled:to-gray-400 disabled:cursor-not-allowed transform hover:scale-105 transition-all duration-300 shadow-lg"
              >
                {submitting ? 'กำลังส่งคำตอบ...' : 'ส่งคำตอบ'}
              </button>
            </div>
          </form>
        )}
      </main>
      </div>
    </div>
  );
}
