// components/QuizTable.tsx
import React, { memo } from 'react';

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

interface QuizTableProps {
  quizzes: QuizItem[];
  onEdit: (quiz: QuizItem) => void;
  onDelete: (id: number) => void;
  startIndex?: number;
}

const QuizTable = memo(({ quizzes, onEdit, onDelete, startIndex = 0 }: QuizTableProps) => {
  if (quizzes.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="bg-gray-50 rounded-lg p-8">
          <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <h3 className="text-lg font-medium text-gray-900 mb-1">ไม่มีข้อสอบ</h3>
          <p className="text-gray-500">ยังไม่มีข้อสอบในหมวดหมู่นี้</p>
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-hidden shadow-lg rounded-xl border border-gray-200">
      <div className="overflow-x-auto">
        <table className="w-full divide-y divide-gray-200">
          <thead className="bg-gradient-to-r from-blue-50 to-indigo-50">
            <tr>
              <th className="px-4 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                ลำดับ
              </th>
              <th className="px-4 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                ประเภท
              </th>
              <th className="px-4 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                ช่วงเวลา
              </th>
              <th className="px-4 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                บทเรียน
              </th>
              <th className="px-4 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                คำถาม
              </th>
              <th className="px-4 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                คำตอบที่ถูก
              </th>
              <th className="px-4 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                คะแนน
              </th>
              <th className="px-4 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                จัดการ
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100">
            {quizzes.map((quiz, idx) => (
              <QuizRow
                key={quiz.id}
                quiz={quiz}
                index={startIndex + idx + 1}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
});

interface QuizRowProps {
  quiz: QuizItem;
  index: number;
  onEdit: (quiz: QuizItem) => void;
  onDelete: (id: number) => void;
}

const QuizRow = memo(({ quiz, index, onEdit, onDelete }: QuizRowProps) => {
  const handleEdit = () => onEdit(quiz);
  const handleDelete = () => onDelete(quiz.id);

  const getTypeColor = (type: string) => {
    return type === 'HTML' 
      ? 'bg-orange-100 text-orange-800 border-orange-200' 
      : 'bg-blue-100 text-blue-800 border-blue-200';
  };

  const getPhaseColor = (phase: string) => {
    return phase === 'pre' 
      ? 'bg-green-100 text-green-800 border-green-200' 
      : 'bg-purple-100 text-purple-800 border-purple-200';
  };

  return (
    <tr className="hover:bg-gray-50 transition-colors duration-150">
      <td className="px-4 py-4 whitespace-nowrap">
        <div className="flex items-center justify-center w-8 h-8 bg-gray-100 rounded-full text-sm font-medium text-gray-600">
          {index}
        </div>
      </td>
      <td className="px-4 py-4 whitespace-nowrap">
        <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full border ${getTypeColor(quiz.questionType)}`}>
          {quiz.questionType}
        </span>
      </td>
      <td className="px-4 py-4 whitespace-nowrap">
        <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full border ${getPhaseColor(quiz.phase)}`}>
          {quiz.phase === "pre" ? "ก่อนเรียน" : "หลังเรียน"}
        </span>
      </td>
      <td className="px-4 py-4 whitespace-nowrap">
        <div className="flex items-center">
          <div className="bg-indigo-100 text-indigo-800 px-2 py-1 rounded-md text-sm font-medium">
            บทที่ {quiz.lesson}
          </div>
        </div>
      </td>
      <td className="px-4 py-4">
        <div className="max-w-xs">
          <p className="text-sm text-gray-900 truncate" title={quiz.question}>
            {quiz.question}
          </p>
        </div>
      </td>
      <td className="px-4 py-4 whitespace-nowrap">
        <div className="text-sm text-gray-900 max-w-xs truncate" title={quiz.choices[parseInt(quiz.correct) - 1]}>
          {quiz.choices[parseInt(quiz.correct) - 1]}
        </div>
      </td>
      <td className="px-4 py-4 whitespace-nowrap">
        <div className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-md text-sm font-medium inline-block">
          {quiz.score} คะแนน
        </div>
      </td>
      <td className="px-4 py-4 whitespace-nowrap text-center">
        <div className="flex items-center justify-center space-x-2">
          <button
            onClick={handleEdit}
            className="bg-yellow-500 hover:bg-yellow-600 text-white p-2 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg group"
            title="แก้ไข"
          >
            <svg className="w-4 h-4 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>
          <button
            onClick={handleDelete}
            className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg group"
            title="ลบ"
          >
            <svg className="w-4 h-4 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </td>
    </tr>
  );
});

QuizTable.displayName = 'QuizTable';
QuizRow.displayName = 'QuizRow';

export default QuizTable;
