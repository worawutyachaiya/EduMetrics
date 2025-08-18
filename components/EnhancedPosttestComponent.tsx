// components/EnhancedPosttestComponent.tsx - (ฉบับแก้ไขกลับเป็นเหมือนเดิม + แก้ไขการตรวจคำตอบ)
"use client";
import { useState, useEffect, useCallback } from "react";
import { useAuth } from '@/lib/auth-context';
import { useRouter } from 'next/navigation';
import { 
  LineChart, 
  Line, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Legend,
  ReferenceLine
} from 'recharts';

type QuizItem = {
  id: number;
  question: string;
  choices: string[];
  correct: string; // "1", "2", "3", "4"
  score: string;
  lesson: number;
};

type QuizResult = {
  id: number;
  lesson: number;
  score: number;
  totalScore: number;
  percentage: number;
  completedAt: string;
  attempt: number;
};

type PosttestProps = {
  type: 'HTML' | 'CSS';
  title: string;
};

interface ChartDataPoint {
  lesson: string;
  'ก่อนเรียน': number;
  'หลังเรียน (ดีที่สุด)': number;
  improvement: number;
}

interface ProgressDataPoint {
  lesson: string;
  phase: string;
  percentage: number;
  type: string;
}

interface TooltipProps {
  active?: boolean;
  payload?: Array<{
    value: number;
    name: string;
    payload: any;
  }>;
  label?: string;
}

export default function EnhancedPosttestComponent({ type, title }: PosttestProps) {
  const { user } = useAuth();
  const router = useRouter();
  const [mode, setMode] = useState<'menu' | 'quiz' | 'history' | 'comparison'>('menu');
  const [selectedLesson, setSelectedLesson] = useState<number | null>(null);
  const [quizzes, setQuizzes] = useState<QuizItem[]>([]);

  // ✨ **[แก้ไข 1/4]** เปลี่ยน State ให้เก็บคำตอบเป็นตัวเลข (ลำดับของคำตอบ)
  const [answers, setAnswers] = useState<{ [key: number]: number }>({});
  
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<QuizResult[]>([]);
  const [pretestResults, setPretestResults] = useState<QuizResult[]>([]);
  const [availableLessons, setAvailableLessons] = useState<number[]>([]);

  const fetchAvailableLessons = useCallback(async () => {
    setLoading(true);
    try {
      // ✨ **[แก้ไข]** กลับไปดึงข้อมูลบทเรียนจาก pre-test เหมือนเดิม
      const response = await fetch(`/api/available-lessons?type=${type}&phase=pre`);
      if (response.ok) {
        setAvailableLessons(await response.json());
      }
    } catch (error) {
      console.error('Error fetching available lessons:', error);
    } finally {
      setLoading(false);
    }
  }, [type]);

  const fetchResults = useCallback(async () => {
    if (!user?.id) return;
    try {
      const response = await fetch(`/api/quiz-results?userId=${user.id}&quizType=${type}&phase=post`);
      if (response.ok) setResults(await response.json());
    } catch (error) {
      console.error('Error fetching post-test results:', error);
    }
  }, [user?.id, type]);

  const fetchPretestResults = useCallback(async () => {
    if (!user?.id) return;
    try {
      const response = await fetch(`/api/quiz-results?userId=${user.id}&quizType=${type}&phase=pre`);
      if (response.ok) setPretestResults(await response.json());
    } catch (error) {
      console.error('Error fetching pre-test results:', error);
    }
  }, [user?.id, type]);

  useEffect(() => {
    if (user) {
      fetchAvailableLessons();
      fetchResults();
      fetchPretestResults();
    }
  }, [user, fetchAvailableLessons, fetchResults, fetchPretestResults]);

  const fetchQuizzes = async (lesson: number) => {
    try {
      setLoading(true);
      setError(null);
      setAnswers({});
      // ✨ **[แก้ไข]** กลับไปดึงข้อสอบจาก pre-test เหมือนเดิม
      const response = await fetch(`/api/quizzes/by-lesson?type=${type}&phase=pre&lesson=${lesson}`);
      if (!response.ok) throw new Error('Failed to fetch quizzes');
      setQuizzes(await response.json());
    } catch (err) {
      setError(err instanceof Error ? err.message : 'เกิดข้อผิดพลาดในการโหลดข้อมูล');
    } finally {
      setLoading(false);
    }
  };

  const handleLessonSelect = (lesson: number) => {
    setSelectedLesson(lesson);
    fetchQuizzes(lesson);
    setMode('quiz');
  };

  // ✨ **[แก้ไข 2/4]** อัปเดตฟังก์ชันให้รับและเก็บ "ลำดับของตัวเลือก"
  const handleChange = (questionIndex: number, choiceIndex: number) => {
    setAnswers(prev => ({ ...prev, [questionIndex]: choiceIndex + 1 })); // เก็บเป็น 1, 2, 3, 4
  };

  const calculateScore = () => {
    let totalScore = 0;
    quizzes.forEach((quiz, index) => {
      // ✨ **[แก้ไข 3/4]** เปรียบเทียบ "ตัวเลข" กับ "ตัวเลข"
      const userAnswer = answers[index];
      const correctAnswer = parseInt(quiz.correct);
      
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
      passed: percentage >= 60,
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
          phase: 'post',
          lesson: selectedLesson,
          ...scoreResult,
          answers: JSON.stringify(answers)
        })
      });

      if (!response.ok) throw new Error('Failed to save quiz result');
      const data = await response.json();

      alert(`ทำข้อสอบสำเร็จ!\nคะแนน: ${scoreResult.score}/${scoreResult.totalScore} (${scoreResult.percentage}%)\nครั้งที่: ${data.attempt}`);
      await fetchResults();
      setMode('menu');
    } catch (error) {
      console.error('Error submitting quiz:', error);
      alert('เกิดข้อผิดพลาดในการส่งคำตอบ');
    } finally {
      setSubmitting(false);
    }
  };

  // ... (ส่วน UI และฟังก์ชันอื่นๆ ไม่มีการเปลี่ยนแปลง) ...

  const getResultsForLesson = (lesson: number) => {
    return results.filter(r => r.lesson === lesson).sort((a, b) => 
      new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime()
    );
  };

  const getPretestResult = (lesson: number) => {
    return pretestResults.find(r => r.lesson === lesson);
  };

  const getImprovementData = () => {
    return availableLessons.map(lesson => {
      const pretest = getPretestResult(lesson);
      const posttests = getResultsForLesson(lesson);
      const latestPosttest = posttests[0];
      const bestPosttest = posttests.reduce((best, current) => 
        current.percentage > best.percentage ? current : best, { percentage: 0 });

      return {
        lesson,
        pretest: pretest?.percentage || 0,
        latestPosttest: latestPosttest?.percentage || 0,
        bestPosttest: bestPosttest?.percentage || 0,
        attempts: posttests.length,
        improvement: latestPosttest ? latestPosttest.percentage - (pretest?.percentage || 0) : 0
      };
    });
  };

  const getComparisonChartData = (): ChartDataPoint[] => {
    return availableLessons.map(lesson => {
      const pretest = getPretestResult(lesson);
      const posttests = getResultsForLesson(lesson);
      const bestPosttest = posttests.reduce((best, current) => 
        current.percentage > best.percentage ? current : best, { percentage: 0 });

      return {
        lesson: `บทที่ ${lesson}`,
        'ก่อนเรียน': pretest?.percentage || 0,
        'หลังเรียน (ดีที่สุด)': bestPosttest?.percentage || 0,
        improvement: (bestPosttest?.percentage || 0) - (pretest?.percentage || 0)
      };
    });
  };

  const getProgressChartData = (): ProgressDataPoint[] => {
    const chartData: ProgressDataPoint[] = [];
    
    availableLessons.forEach(lesson => {
      const pretest = getPretestResult(lesson);
      const posttests = getResultsForLesson(lesson).reverse();
      
      if (pretest) {
        chartData.push({
          lesson: `บทที่ ${lesson}`,
          phase: 'ก่อนเรียน',
          percentage: pretest.percentage,
          type: 'pretest'
        });
      }
      
      posttests.forEach((result, index) => {
        chartData.push({
          lesson: `บทที่ ${lesson}`,
          phase: `หลังเรียน ครั้งที่ ${index + 1}`,
          percentage: result.percentage,
          type: 'posttest'
        });
      });
    });
    
    return chartData;
  };

  const CustomTooltip = ({ active, payload, label }: TooltipProps) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border rounded shadow">
          <p className="font-medium">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} style={{ color: entry.name === 'ก่อนเรียน' ? '#8884d8' : '#82ca9d' }}>
              {entry.name}: {entry.value}%
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  const ProgressTooltip = ({ active, payload }: TooltipProps) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border rounded shadow">
          <p className="font-medium">{payload[0]?.payload?.phase}: {payload[0].value}%</p>
        </div>
      );
    }
    return null;
  };

  if (loading && mode === 'menu') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-xl text-gray-800">กำลังโหลดข้อมูล...</div>
      </div>
    );
  }

  if (mode === 'menu') {
    return (
        <div className="min-h-screen flex flex-col items-center p-8 bg-gray-100">
          <div className="w-full max-w-4xl bg-white p-8 rounded-xl shadow-lg">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-800 mb-4">{title}</h1>
              <p className="text-gray-700">เลือกรูปแบบการทำข้อสอบหลังเรียน</p>
            </div>
  
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-blue-50 p-6 rounded-xl border border-blue-200">
                <h2 className="text-xl font-semibold text-blue-800 mb-4">📝 ทำข้อสอบ</h2>
                <p className="text-blue-700 text-sm mb-4">เลือกบทเรียนที่ต้องการทำข้อสอบ</p>
                <div className="space-y-2">
                  {availableLessons.length > 0 ? availableLessons.map(lesson => (
                    <button
                      key={lesson}
                      onClick={() => handleLessonSelect(lesson)}
                      className="w-full text-left p-3 bg-white rounded-lg border hover:bg-blue-50 transition-colors"
                    >
                      <div className="flex justify-between items-center">
                        <span className="font-medium text-gray-800">บทเรียนที่ {lesson}</span>
                        <span className="text-xs text-gray-600">
                          {getResultsForLesson(lesson).length > 0 ? `ทำแล้ว ${getResultsForLesson(lesson).length} ครั้ง` : 'ยังไม่ได้ทำ'}
                        </span>
                      </div>
                    </button>
                  )) : <p className="text-sm text-gray-500">ไม่มีบทเรียนให้ทำข้อสอบ</p>}
                </div>
              </div>
  
              <div className="bg-green-50 p-6 rounded-xl border border-green-200">
                <h2 className="text-xl font-semibold text-green-800 mb-4">📊 ประวัติคะแนน</h2>
                <p className="text-green-700 text-sm mb-4">ดูผลคะแนนของแต่ละครั้งที่ทำ</p>
                <button
                  onClick={() => setMode('history')}
                  className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition-colors"
                >
                  ดูประวัติทั้งหมด
                </button>
              </div>
  
              <div className="bg-purple-50 p-6 rounded-xl border border-purple-200">
                <h2 className="text-xl font-semibold text-purple-800 mb-4">📈 การพัฒนา</h2>
                <p className="text-purple-700 text-sm mb-4">เปรียบเทียบผลก่อนเรียนและหลังเรียน</p>
                <button
                  onClick={() => setMode('comparison')}
                  className="w-full bg-purple-600 text-white py-3 rounded-lg hover:bg-purple-700 transition-colors"
                >
                  ดูการพัฒนา
                </button>
              </div>
            </div>
  
            <div className="text-center">
              <button
                onClick={() => router.push('/')}
                className="bg-gray-500 text-white px-6 py-3 rounded-lg hover:bg-gray-600 transition-colors"
              >
                กลับหน้าหลัก
              </button>
            </div>
          </div>
        </div>
      );
  }

  if (mode === 'quiz') {
    if (loading) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
          <div className="text-xl text-gray-800">กำลังโหลดข้อสอบ...</div>
        </div>
      );
    }

    if (error) {
      return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
          <div className="text-xl text-red-600 mb-4">เกิดข้อผิดพลาด: {error}</div>
          <button
            onClick={() => setMode('menu')}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            กลับไปเมนู
          </button>
        </div>
      );
    }

    return (
      <div className="min-h-screen flex flex-col items-center p-8 bg-gray-100">
        <div className="w-full max-w-3xl bg-white p-8 rounded-xl shadow-lg">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-xl font-semibold text-gray-800">{title} - บทเรียนที่ {selectedLesson}</h2>
              <p className="text-gray-700 text-sm">
                ครั้งที่ {getResultsForLesson(selectedLesson!).length + 1} | 
                จำนวนข้อสอบ: {quizzes.length} ข้อ
              </p>
            </div>
            <button
              onClick={() => setMode('menu')}
              className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
            >
              ยกเลิก
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {quizzes.map((quiz, index) => (
              <div key={quiz.id} className="border-b border-gray-200 pb-6">
                <p className="mb-4 font-medium text-gray-800">
                  {index + 1}) {quiz.question}
                </p>
                <div className="space-y-2 pl-4">
                  {quiz.choices.map((choice, i) => (
                    <label key={i} className="flex items-center cursor-pointer">
                       {/* ✨ **[แก้ไข 4/4]** อัปเดต UI ให้ส่งและตรวจสอบกับ "ลำดับ" */}
                      <input
                        type="radio"
                        name={`question-${index}`}
                        value={i + 1}
                        checked={answers[index] === i + 1}
                        onChange={() => handleChange(index, i)}
                        className="mr-3"
                        disabled={submitting}
                      />
                      <span className="text-gray-700">{choice}</span>
                    </label>
                  ))}
                </div>
              </div>
            ))}

            <div className="text-center pt-6">
              <button
                type="submit"
                disabled={submitting || Object.keys(answers).length !== quizzes.length}
                className="bg-blue-500 text-white px-8 py-3 rounded-full hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
              >
                {submitting ? 'กำลังส่งคำตอบ...' : 'ส่งคำตอบ'}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  // ... (ส่วน History และ Comparison ไม่มีการเปลี่ยนแปลง) ...
  if (mode === 'history') {
    return (
      <div className="min-h-screen flex flex-col items-center p-8 bg-gray-100">
        <div className="w-full max-w-6xl bg-white p-8 rounded-xl shadow-lg">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">ประวัติคะแนน {type}</h2>
            <button
              onClick={() => setMode('menu')}
              className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
            >
              กลับ
            </button>
          </div>

          {availableLessons.map(lesson => {
            const lessonResults = getResultsForLesson(lesson);
            const pretestResult = getPretestResult(lesson);

            return (
              <div key={lesson} className="mb-8 border rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-4 text-blue-600">
                  บทเรียนที่ {lesson}
                  {pretestResult && (
                    <span className="ml-4 text-sm text-gray-600">
                      (ก่อนเรียน: {pretestResult.percentage}%)
                    </span>
                  )}
                </h3>

                {lessonResults.length === 0 ? (
                  <p className="text-gray-600">ยังไม่ได้ทำข้อสอบหลังเรียนบทนี้</p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead className="bg-gray-100">
                        <tr>
                          <th className="px-4 py-2 text-left text-gray-800">ครั้งที่</th>
                          <th className="px-4 py-2 text-center text-gray-800">คะแนน</th>
                          <th className="px-4 py-2 text-center text-gray-800">เปอร์เซ็นต์</th>
                          <th className="px-4 py-2 text-center text-gray-800">วันที่ทำ</th>
                          <th className="px-4 py-2 text-center text-gray-800">การพัฒนา</th>
                        </tr>
                      </thead>
                      <tbody>
                        {lessonResults.map((result, index) => (
                          <tr key={result.id} className="border-t">
                            <td className="px-4 py-2 text-gray-800">{lessonResults.length - index}</td>
                            <td className="px-4 py-2 text-center text-gray-800">
                              {result.score}/{result.totalScore}
                            </td>
                            <td className="px-4 py-2 text-center">
                              <span className={`font-semibold ${
                                result.percentage >= 80 ? 'text-green-600' : 
                                result.percentage >= 60 ? 'text-yellow-600' : 'text-red-600'
                              }`}>
                                {result.percentage}%
                              </span>
                            </td>
                            <td className="px-4 py-2 text-center text-gray-800">
                              {new Date(result.completedAt).toLocaleDateString('th-TH')}
                            </td>
                            <td className="px-4 py-2 text-center">
                              {pretestResult && (
                                <span className={`font-semibold ${
                                  result.percentage > pretestResult.percentage ? 'text-green-600' :
                                  result.percentage === pretestResult.percentage ? 'text-gray-600' : 'text-red-600'
                                }`}>
                                  {result.percentage > pretestResult.percentage ? '↗' :
                                   result.percentage === pretestResult.percentage ? '→' : '↘'}
                                  {Math.abs(result.percentage - pretestResult.percentage).toFixed(1)}%
                                </span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  if (mode === 'comparison') {
    const improvementData = getImprovementData();
    const comparisonChartData = getComparisonChartData();
    const progressChartData = getProgressChartData();

    return (
      <div className="min-h-screen flex flex-col items-center p-8 bg-gray-100">
        <div className="w-full max-w-7xl bg-white p-8 rounded-xl shadow-lg">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">การพัฒนาการเรียนรู้ {type}</h2>
            <button
              onClick={() => setMode('menu')}
              className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
            >
              กลับ
            </button>
          </div>

          <div className="mb-8">
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold mb-4 text-gray-800">สรุปภาพรวม</h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-white p-4 rounded-lg text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    {(improvementData.reduce((sum, data) => sum + data.pretest, 0) / (improvementData.length || 1)).toFixed(1)}%
                  </div>
                  <div className="text-sm text-gray-700">คะแนนเฉลี่ยก่อนเรียน</div>
                </div>
                <div className="bg-white p-4 rounded-lg text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {(improvementData.reduce((sum, data) => sum + data.latestPosttest, 0) / (improvementData.length || 1)).toFixed(1)}%
                  </div>
                  <div className="text-sm text-gray-700">คะแนนเฉลี่ยหลังเรียน</div>
                </div>
                <div className="bg-white p-4 rounded-lg text-center">
                  <div className="text-2xl font-bold text-purple-600">
                    {(improvementData.reduce((sum, data) => sum + data.bestPosttest, 0) / (improvementData.length || 1)).toFixed(1)}%
                  </div>
                  <div className="text-sm text-gray-700">คะแนนเฉลี่ยสูงสุด</div>
                </div>
                <div className="bg-white p-4 rounded-lg text-center">
                  <div className="text-2xl font-bold text-orange-600">
                    +{(improvementData.reduce((sum, data) => sum + Math.max(0, data.improvement), 0) / (improvementData.length || 1)).toFixed(1)}%
                  </div>
                  <div className="text-sm text-gray-700">การพัฒนาเฉลี่ย</div>
                </div>
              </div>
            </div>
          </div>

          <div className="mb-8">
            <h3 className="text-xl font-semibold mb-4 text-gray-800">📊 เปรียบเทียบคะแนนก่อนและหลังเรียน</h3>
            <div className="bg-white p-6 rounded-lg border">
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={comparisonChartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="lesson" />
                  <YAxis domain={[0, 100]} />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <ReferenceLine y={60} stroke="#ff6b6b" strokeDasharray="5 5" label="เกณฑ์ผ่าน 60%" />
                  <ReferenceLine y={80} stroke="#51cf66" strokeDasharray="5 5" label="เกณฑ์ดี 80%" />
                  <Bar dataKey="ก่อนเรียน" fill="#8884d8" name="ก่อนเรียน" />
                  <Bar dataKey="หลังเรียน (ดีที่สุด)" fill="#82ca9d" name="หลังเรียน (ดีที่สุด)" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {progressChartData.length > 0 && (
            <div className="mb-8">
              <h3 className="text-xl font-semibold mb-4 text-gray-800">📈 ความก้าวหน้าตลอดการเรียน</h3>
              <div className="bg-white p-6 rounded-lg border">
                <ResponsiveContainer width="100%" height={400}>
                  <LineChart data={progressChartData} margin={{ top: 20, right: 30, left: 20, bottom: 100 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="phase" angle={-60} textAnchor="end" interval={0} />
                    <YAxis domain={[0, 100]} />
                    <Tooltip content={<ProgressTooltip />} />
                    <Legend />
                    <ReferenceLine y={60} stroke="#ff6b6b" strokeDasharray="5 5" label="เกณฑ์ผ่าน" />
                    <ReferenceLine y={80} stroke="#51cf66" strokeDasharray="5 5" label="เกณฑ์ดี" />
                    <Line 
                      type="monotone" 
                      dataKey="percentage" 
                      name="คะแนน"
                      stroke="#8884d8" 
                      strokeWidth={3}
                      dot={{ fill: '#8884d8', strokeWidth: 2, r: 6 }}
                      activeDot={{ r: 8, stroke: '#8884d8', strokeWidth: 2 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  return null;
}