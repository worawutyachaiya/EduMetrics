import { NextRequest, NextResponse } from 'next/server';
import { sendEmail, generateEmailVerificationEmail } from '@/lib/email';
import { prisma } from '@/lib/prisma';
import crypto from 'crypto';

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { error: 'กรุณาระบุอีเมล' },
        { status: 400 }
      );
    }

    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user) {
      return NextResponse.json(
        { error: 'ไม่พบผู้ใช้งานด้วยอีเมลนี้' },
        { status: 404 }
      );
    }

    // Generate verification token (reuse resetToken field)
    const verificationToken = crypto.randomBytes(32).toString('hex');
    const verificationExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    // Update user with verification token (using existing resetToken fields)
    await prisma.user.update({
      where: { id: user.id },
      data: {
        resetToken: verificationToken,
        resetTokenExpiry: verificationExpiry
      }
    });

    // Create verification URL
    const verificationUrl = `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/verify-email?token=${verificationToken}`;

    // Send verification email
    const emailSent = await sendEmail({
      to: email,
      subject: '📧 ยืนยันอีเมลสำหรับระบบเรียนรู้ออนไลน์',
      html: generateEmailVerificationEmail(`${user.firstName} ${user.lastName}`, verificationUrl)
    });

    if (!emailSent) {
      return NextResponse.json(
        { error: 'ไม่สามารถส่งอีเมลยืนยันได้ กรุณาลองใหม่อีกครั้ง' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      message: 'ส่งอีเมลยืนยันเรียบร้อยแล้ว กรุณาตรวจสอบอีเมลของคุณ'
    });

  } catch (error) {
    console.error('Email verification send error:', error);
    return NextResponse.json(
      { error: 'เกิดข้อผิดพลาดในการส่งอีเมลยืนยัน' },
      { status: 500 }
    );
  }
}