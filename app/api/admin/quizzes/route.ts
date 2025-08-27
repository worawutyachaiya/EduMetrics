// app/api/admin/quizzes/route.ts - Updated version with lesson support
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '100');
    const lesson = searchParams.get('lesson');
    const phase = searchParams.get('phase');
    const questionType = searchParams.get('questionType');

    // Build where clause for filtering
    const where: any = {};
    if (lesson && lesson !== 'all') {
      where.lesson = parseInt(lesson);
    }
    if (phase && phase !== 'all') {
      where.phase = phase;
    }
    if (questionType && questionType !== 'all') {
      where.questionType = questionType;
    }

    // Calculate skip for pagination
    const skip = (page - 1) * limit;

    // Get total count for pagination
    const totalCount = await prisma.quiz.count({ where });

    // Get paginated quizzes
    const quizzes = await prisma.quiz.findMany({
      where,
      orderBy: [
        { questionType: 'asc' },
        { phase: 'asc' },
        { lesson: 'asc' },
        { createdAt: 'desc' }
      ],
      skip,
      take: limit
    });
    
    return NextResponse.json({
      quizzes,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalCount / limit),
        totalItems: totalCount,
        itemsPerPage: limit
      }
    });
  } catch (error) {
    console.error('Error fetching quizzes:', error);
    return NextResponse.json(
      { error: 'เกิดข้อผิดพลาดในการโหลดข้อมูล' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { questionType, question, choices, correct, score, phase, lesson } = body

    // Validate required fields
    if (!questionType || !question || !choices || !correct || !score || !phase || !lesson) {
      return NextResponse.json(
        { error: 'กรุณากรอกข้อมูลให้ครบถ้วน' },
        { status: 400 }
      )
    }

    // Validate choices array
    if (!Array.isArray(choices) || choices.length !== 4 || choices.some(c => !c.trim())) {
      return NextResponse.json(
        { error: 'ตัวเลือกคำตอบต้องมี 4 ข้อและไม่ว่างเปล่า' },
        { status: 400 }
      )
    }

    // Validate lesson number
    if (lesson < 1 || lesson > 10) {
      return NextResponse.json(
        { error: 'บทเรียนต้องอยู่ระหว่าง 1-10' },
        { status: 400 }
      )
    }

    const quiz = await prisma.quiz.create({
      data: {
        questionType,
        question: question.trim(),
        choices: choices.map((c: string) => c.trim()),
        correct,
        score: score.trim(),
        phase,
        lesson: parseInt(lesson),
      }
    })

    return NextResponse.json(quiz)
  } catch (error) {
    console.error('Error creating quiz:', error)
    return NextResponse.json(
      { error: 'เกิดข้อผิดพลาดในการบันทึกข้อมูล' },
      { status: 500 }
    )
  }
}