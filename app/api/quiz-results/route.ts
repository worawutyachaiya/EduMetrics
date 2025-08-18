  // app/api/quiz-results/route.ts - (Final, Robust Version)
  import { NextRequest, NextResponse } from 'next/server';
  import { prisma } from '@/lib/prisma';

  // Define interfaces for type safety
  interface QuizResultData {
    userId?: string;
    studentId?: string;
    quizType?: string;
    phase?: string;
    lesson?: string;
    score?: string;
    totalScore?: string;
    percentage?: string;
    passed?: boolean;
    answers?: unknown;
  }

  interface WhereClause {
    userId?: number;
    studentId?: string;
    quizType?: string;
    phase?: string;
    lesson?: number;
  }

  // Main function to handle POST requests (saving quiz results)
  export async function POST(request: NextRequest) {
    try {
      const body: QuizResultData = await request.json();
      const {
        userId,
        studentId,
        quizType,
        phase,
        lesson,
        score,
        totalScore,
        percentage,
        passed,
        answers,
      } = body;

      // --- 🛡️ **NEW & IMPROVED VALIDATION** 🛡️ ---
      // This block checks if any required data is missing before proceeding.
      if (
        !userId ||
        !studentId ||
        !quizType ||
        !phase ||
        lesson === undefined ||
        score === undefined ||
        totalScore === undefined ||
        percentage === undefined ||
        passed === undefined
      ) {
        console.error('Validation Failed: Incomplete data received.', body);
        return NextResponse.json(
          { error: 'ข้อมูลที่ส่งมาไม่ครบถ้วน ไม่สามารถบันทึกผลได้ กรุณาลองใหม่อีกครั้ง' },
          { status: 400 }
        );
      }

      // Prepare the data for saving, ensuring correct types
      const dataToSave = {
        userId: parseInt(userId),
        studentId: studentId,
        quizType: quizType,
        phase: phase,
        lesson: parseInt(lesson),
        score: parseInt(score),
        totalScore: parseInt(totalScore),
        percentage: parseFloat(percentage),
        passed: passed,
        // Ensure 'answers' is always a valid JSON string, even if empty
        answers: JSON.stringify(answers || {}),
      };

      // For pre-tests, update the existing result or create a new one
      if (phase === 'pre') {
        const existingResult = await prisma.quizResult.findFirst({
          where: {
            userId: dataToSave.userId,
            quizType: dataToSave.quizType,
            phase: 'pre',
            lesson: dataToSave.lesson,
          },
        });

        if (existingResult) {
          const updatedResult = await prisma.quizResult.update({
            where: { id: existingResult.id },
            data: { ...dataToSave, completedAt: new Date() }, // Update timestamp
          });
          return NextResponse.json({ message: 'อัพเดทผลสอบก่อนเรียนสำเร็จ', result: updatedResult });
        } else {
          const newResult = await prisma.quizResult.create({
            data: dataToSave,
          });
          return NextResponse.json({ message: 'บันทึกผลสอบก่อนเรียนสำเร็จ', result: newResult });
        }
      } 
      // For post-tests, always create a new result to track all attempts
      else {
        const newResult = await prisma.quizResult.create({
          data: dataToSave,
        });

        const attemptCount = await prisma.quizResult.count({
          where: {
            userId: dataToSave.userId,
            quizType: dataToSave.quizType,
            phase: 'post',
            lesson: dataToSave.lesson,
          },
        });

        return NextResponse.json({
          message: 'บันทึกผลสอบหลังเรียนสำเร็จ',
          attempt: attemptCount,
          result: newResult,
        });
      }
    } catch (error) {
      console.error('Fatal Error in POST /api/quiz-results:', error);
      return NextResponse.json(
        { error: 'เกิดข้อผิดพลาดร้ายแรงในระบบขณะบันทึกผลสอบ' },
        { status: 500 }
      );
    }
  }

  // GET and DELETE functions remain unchanged.
  // You can keep your existing GET and DELETE functions here.
  // ...
  export async function GET(request: NextRequest) {
    try {
      const { searchParams } = new URL(request.url)
      const userId = searchParams.get('userId')
      const studentId = searchParams.get('studentId')
      const quizType = searchParams.get('quizType')
      const phase = searchParams.get('phase')
      const lesson = searchParams.get('lesson')
      const latest = searchParams.get('latest') // ดึงเฉพาะครั้งล่าสุด

      const whereClause: WhereClause = {}
      
      if (userId) whereClause.userId = parseInt(userId)
      if (studentId) whereClause.studentId = studentId
      if (quizType) whereClause.quizType = quizType
      if (phase) whereClause.phase = phase
      if (lesson) whereClause.lesson = parseInt(lesson)

      // ถ้าต้องการเฉพาะครั้งล่าสุดของแต่ละบทเรียน
      if (latest === 'true') {
        const results = await prisma.quizResult.findMany({
          where: whereClause,
          orderBy: [
            { lesson: 'asc' },
            { completedAt: 'desc' }
          ],
          select: {
            id: true,
            lesson: true,
            score: true,
            totalScore: true,
            percentage: true,
            passed: true,
            completedAt: true,
            phase: true,
            quizType: true,
            userId: true,
            studentId: true
          }
        })

        // Group by lesson และเอาเฉพาะครั้งล่าสุด
        const latestResults = results.reduce((acc: typeof results, current) => {
          const existing = acc.find(item => item.lesson === current.lesson)
          if (!existing) {
            acc.push(current)
          }
          return acc
        }, [])

        return NextResponse.json(latestResults)
      }

      // ดึงผลทั้งหมด
      const results = await prisma.quizResult.findMany({
        where: whereClause,
        orderBy: [
          { lesson: 'asc' },
          { completedAt: 'desc' }
        ],
        select: {
          id: true,
          lesson: true,
          score: true,
          totalScore: true,
          percentage: true,
          passed: true,
          completedAt: true,
          phase: true,
          quizType: true,
          userId: true,
          studentId: true,
          answers: true
        }
      })

      // เพิ่ม attempt number สำหรับ posttest
      const resultsWithAttempt: any[] = []
      for (let i = 0; i < results.length; i++) {
        const result = results[i]
        let attempt = 1
        
        if (result.phase === 'post') {
          // หา attempt number โดยนับจากผลที่มี completedAt >= ผลปัจจุบัน
          const sameOrNewerResults = results.filter(r => 
            r.lesson === result.lesson && 
            r.phase === 'post' && 
            r.userId === result.userId &&
            r.quizType === result.quizType &&
            r.completedAt >= result.completedAt
          )
          attempt = sameOrNewerResults.length
        }
        
        resultsWithAttempt.push({
          ...result,
          attempt
        })
      }

      return NextResponse.json(resultsWithAttempt)
    } catch (error) {
      console.error('Error fetching quiz results:', error)
      return NextResponse.json(
        { error: 'เกิดข้อผิดพลาดในการดึงผลสอบ' },
        { status: 500 }
      )
    }
  }

  export async function DELETE(request: NextRequest) {
    try {
      const { searchParams } = new URL(request.url)
      const id = searchParams.get('id')
      const userId = searchParams.get('userId')

      if (!id || !userId) {
        return NextResponse.json(
          { error: 'กรุณาระบุ id และ userId' },
          { status: 400 }
        )
      }

      // ตรวจสอบว่าผลสอบนี้เป็นของ user นี้
      const quizResult = await prisma.quizResult.findFirst({
        where: {
          id: parseInt(id),
          userId: parseInt(userId)
        }
      })

      if (!quizResult) {
        return NextResponse.json(
          { error: 'ไม่พบผลสอบหรือไม่มีสิทธิ์ลบ' },
          { status: 404 }
        )
      }

      // ลบได้เฉพาะ posttest (ป้องกันการลบ pretest)
      if (quizResult.phase === 'pre') {
        return NextResponse.json(
          { error: 'ไม่สามารถลบผลสอบก่อนเรียนได้' },
          { status: 403 }
        )
      }

      await prisma.quizResult.delete({
        where: { id: parseInt(id) }
      })

      return NextResponse.json({
        message: 'ลบผลสอบสำเร็จ'
      })
    } catch (error) {
      console.error('Error deleting quiz result:', error)
      return NextResponse.json(
        { error: 'เกิดข้อผิดพลาดในการลบผลสอบ' },
        { status: 500 }
      )
    }
  }