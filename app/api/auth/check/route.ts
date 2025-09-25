// app/api/auth/check/route.ts
import { NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'
import { cookies } from 'next/headers'
import { prisma } from '@/lib/prisma'

// Type for JWT payload
interface JWTPayload {
  userId: number
  studentId: string
  firstName: string
  lastName: string
  role: string
  iat?: number
  exp?: number
}

export async function GET() {
  try {
  const cookieStore = cookies()
  const token = (await cookieStore).get('token')

    if (!token) {
      return NextResponse.json(
        { error: 'ไม่พบ token' },
        { status: 401 }
      )
    }

    if (!process.env.JWT_SECRET) {
      return NextResponse.json({ error: 'Server misconfiguration' }, { status: 500 })
    }

    const decoded = jwt.verify(token.value, process.env.JWT_SECRET) as JWTPayload

    // Load fresh user info to include email and avatarUrl
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        studentId: true,
        firstName: true,
        lastName: true,
        email: true,
        role: true,
        avatarUrl: true,
      },
    })

    if (!user) {
      return NextResponse.json({ error: 'ไม่พบผู้ใช้' }, { status: 401 })
    }

    return NextResponse.json({ user, isAuthenticated: true })

  } catch (error) {
    console.error('Token verification failed:', error)
    
    // Create response with appropriate error handling
    let errorMessage = 'Token ไม่ถูกต้อง'
    let shouldClearCookie = false

    // Check if it's a token expired error
    if (error instanceof jwt.TokenExpiredError) {
      errorMessage = 'Token หมดอายุ กรุณาเข้าสู่ระบบใหม่'
      shouldClearCookie = true
    } else if (error instanceof jwt.JsonWebTokenError) {
      errorMessage = 'Token ไม่ถูกต้อง'
      shouldClearCookie = true
    }

    const response = NextResponse.json(
      { 
        error: errorMessage,
        expired: error instanceof jwt.TokenExpiredError
      },
      { status: 401 }
    )

    // Clear the invalid/expired token cookie
    if (shouldClearCookie) {
      response.cookies.set('token', '', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 0
      })
    }

    return response
  }
}