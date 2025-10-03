// app/api/register/route.ts - Fixed version
import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/prisma'
import { sendEmail, generateEmailVerificationEmail } from '@/lib/email'
import crypto from 'crypto'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { firstName, lastName, studentId, email, password, academicYear } = body

    console.log('🔍 === Registration API Debug ===')
    console.log('📥 Request body:', JSON.stringify(body, null, 2))

    // Validate required fields
    if (!firstName || !lastName || !studentId || !email || !password) {
      return NextResponse.json(
        { error: 'กรุณากรอกข้อมูลให้ครบถ้วน' },
        { status: 400 }
      )
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'กรุณากรอกอีเมลให้ถูกต้อง' },
        { status: 400 }
      )
    }

    // Validate student ID
    if (studentId.length < 12 || !/^\d+$/.test(studentId)) {
      return NextResponse.json(
        { error: 'รหัสนักศึกษาต้องเป็นตัวเลข 12 หลัก' },
        { status: 400 }
      )
    }

    // Validate password
    if (password.length < 6) {
      return NextResponse.json(
        { error: 'รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร' },
        { status: 400 }
      )
    }

    // Academic year processing - IMPROVED VERSION
    const currentYearAD = new Date().getFullYear()
    const currentYearBE = currentYearAD + 543
    
    console.log('📅 Year processing:')
    console.log('- Current AD:', currentYearAD)
    console.log('- Current BE:', currentYearBE)
    console.log('- Received academicYear:', academicYear, typeof academicYear)

    let userAcademicYearAD: number

    if (academicYear) {
      const yearNum = parseInt(academicYear.toString())
      console.log('- Parsed academicYear:', yearNum)
      
      // Improved detection logic
      if (yearNum >= 2500) {
        // Definitely Buddhist Era (BE) - convert to AD
        console.log('- Detected: Buddhist Era (BE) format')
        userAcademicYearAD = yearNum - 543
      } else if (yearNum >= 1900 && yearNum <= 2100) {
        // Definitely Christian Era (AD) - use as is
        console.log('- Detected: Christian Era (AD) format')
        userAcademicYearAD = yearNum
      } else {
        // Invalid year
        console.log('- Invalid year format detected')
        return NextResponse.json(
          { 
            error: `ปีการศึกษาไม่ถูกต้อง (${yearNum}) กรุณาระบุปี พ.ศ. เช่น ${currentYearBE}`,
            debug: {
              received: academicYear,
              parsed: yearNum,
              currentBE: currentYearBE,
              validBERange: `${currentYearBE - 1} - ${currentYearBE + 1}`
            }
          },
          { status: 400 }
        )
      }
    } else {
      console.log('- No academicYear provided, using current AD year')
      userAcademicYearAD = currentYearAD
    }

    console.log('- Final AD year for storage:', userAcademicYearAD)

    // Validate academic year range (in AD)
    const validYearsAD = [currentYearAD - 1, currentYearAD, currentYearAD + 1]
    console.log('- Valid AD years:', validYearsAD)

    if (!validYearsAD.includes(userAcademicYearAD)) {
      const validYearsBE = validYearsAD.map(y => y + 543)
      console.log('❌ Academic year validation failed')
      console.log('- Received:', academicYear)
      console.log('- Converted to AD:', userAcademicYearAD)
      console.log('- Valid AD range:', validYearsAD)
      console.log('- Valid BE range:', validYearsBE)
      
      return NextResponse.json(
        { 
          error: `ปีการศึกษาต้องอยู่ในช่วง ${validYearsBE.join(' - ')} (พ.ศ.)`,
          debug: {
            received: academicYear,
            convertedToAD: userAcademicYearAD,
            validADYears: validYearsAD,
            validBEYears: validYearsBE,
            currentYear: `${currentYearAD} (AD) / ${currentYearBE} (BE)`
          }
        },
        { status: 400 }
      )
    }

    console.log('✅ Academic year validation passed')

    // Check if student ID or email already exists
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { studentId },
          { email }
        ]
      }
    })

    if (existingUser) {
      if (existingUser.studentId === studentId) {
        return NextResponse.json(
          { error: 'รหัสนักศึกษานี้มีอยู่ในระบบแล้ว' },
          { status: 400 }
        )
      } else {
        return NextResponse.json(
          { error: 'อีเมลนี้มีอยู่ในระบบแล้ว' },
          { status: 400 }
        )
      }
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12)

    // Generate verification token first
    const verificationToken = crypto.randomBytes(32).toString('hex');
    const verificationExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    // Create user as INACTIVE until email verification
    const userData = {
      firstName,
      lastName,
      studentId,
      email,
      password: hashedPassword,
      academicYear: userAcademicYearAD, // Store as AD in database
      role: 'student',
      isActive: false, // Set to false initially
      resetToken: verificationToken, // Store verification token
      resetTokenExpiry: verificationExpiry
    }

    console.log('💾 Creating INACTIVE user with data:', {
      ...userData,
      password: '[HIDDEN]',
      resetToken: '[HIDDEN]'
    })

    const user = await prisma.user.create({
      data: userData,
      select: {
        id: true,
        firstName: true,
        lastName: true,
        studentId: true,
        email: true,
        academicYear: true,
        role: true,
        isActive: true,
        createdAt: true
      }
    })

    console.log('✅ Inactive user created successfully:', user)

    // Create verification URL
    const verificationUrl = `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/verify-email?token=${verificationToken}`;

    // Send verification email
    try {
      await sendEmail({
        to: email,
        subject: '📧 ยืนยันอีเมลสำหรับระบบเรียนรู้ออนไลน์',
        html: generateEmailVerificationEmail(`${firstName} ${lastName}`, verificationUrl)
      });
      console.log('✅ Verification email sent successfully');
    } catch (emailError) {
      console.error('⚠️ Failed to send verification email:', emailError);
      // If email fails, delete the user record
      await prisma.user.delete({ where: { id: user.id } });
      return NextResponse.json(
        { error: 'ไม่สามารถส่งอีเมลยืนยันได้ กรุณาลองลงทะเบียนใหม่อีกครั้ง' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      message: 'ส่งอีเมลยืนยันเรียบร้อยแล้ว กรุณาตรวจสอบอีเมลและคลิกลิงก์เพื่อยืนยันบัญชีของคุณ',
      requiresVerification: true
    })

  } catch (error) {
    console.error('❌ Registration error:', error)
    
    if (error instanceof Error) {
      console.error('Error details:', {
        name: error.name,
        message: error.message,
        stack: error.stack
      })
    }

    return NextResponse.json(
      { 
        error: 'เกิดข้อผิดพลาดในการลงทะเบียน',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}