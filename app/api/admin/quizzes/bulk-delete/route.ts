// app/api/admin/quizzes/bulk-delete/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json()
    const { lesson } = body

    // Validate lesson number
    if (!lesson || lesson < 1 || lesson > 10) {
      return NextResponse.json(
        { error: 'กรุณาระบุบทเรียนที่ถูกต้อง (1-10)' },
        { status: 400 }
      )
    }

    // Delete all quizzes in the lesson
    const deleteResult = await prisma.quiz.deleteMany({
      where: {
        lesson: parseInt(lesson)
      }
    })

    return NextResponse.json({
      message: `ลบข้อสอบในบทเรียนที่ ${lesson} สำเร็จ`,
      deletedCount: deleteResult.count,
      lesson: parseInt(lesson)
    })
  } catch (error) {
    console.error('Error deleting quizzes by lesson:', error)
    return NextResponse.json(
      { error: 'เกิดข้อผิดพลาดในการลบข้อมูล' },
      { status: 500 }
    )
  }
}
