import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const { token } = await request.json();

    if (!token) {
      return NextResponse.json(
        { error: 'ไม่พบโทเค็นยืนยัน' },
        { status: 400 }
      );
    }

    // Find user by verification token (using resetToken field)
    const user = await prisma.user.findFirst({
      where: {
        resetToken: token,
        resetTokenExpiry: {
          gt: new Date() // Token must not be expired
        }
      }
    });

    if (!user) {
      return NextResponse.json(
        { error: 'โทเค็นยืนยันไม่ถูกต้องหรือหมดอายุแล้ว' },
        { status: 400 }
      );
    }

    // Clear the verification token AND activate the account
    await prisma.user.update({
      where: { id: user.id },
      data: {
        isActive: true, // Activate the account
        resetToken: null,
        resetTokenExpiry: null
      }
    });

    return NextResponse.json({
      message: 'ยืนยันอีเมลเรียบร้อยแล้ว! บัญชีของคุณได้รับการเปิดใช้งานแล้ว คุณสามารถเข้าสู่ระบบได้แล้ว'
    });

  } catch (error) {
    console.error('Email verification error:', error);
    return NextResponse.json(
      { error: 'เกิดข้อผิดพลาดในการยืนยันอีเมล' },
      { status: 500 }
    );
  }
}