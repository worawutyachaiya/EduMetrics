// app/api/profile/avatar/route.ts
import { NextRequest, NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'
import { prisma } from '@/lib/prisma'
import { uploadImage, deleteFromCloudinary } from '@/lib/cloudinary'

const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp']

function getUserIdFromToken(req: NextRequest): number | null {
  const token = req.cookies.get('token')?.value
  if (!token) return null
  if (!process.env.JWT_SECRET) return null
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET) as { userId: number }
    return decoded.userId
  } catch {
    return null
  }
}

export async function POST(request: NextRequest) {
  try {
    const userId = getUserIdFromToken(request)
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const form = await request.formData()
    const file = form.get('file') as File | null
    if (!file) {
      return NextResponse.json({ error: 'ไม่พบไฟล์รูปภาพ' }, { status: 400 })
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json({ error: 'รองรับเฉพาะไฟล์ JPG, PNG, WEBP' }, { status: 400 })
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json({ error: 'ขนาดไฟล์ต้องไม่เกิน 5MB' }, { status: 400 })
    }

    // Read to buffer
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Fetch old avatar to delete later if exists
    const existing = await prisma.user.findUnique({
      where: { id: userId },
      select: { avatarPublicId: true }
    })

    const filename = `avatar-${userId}`
    const result: any = await uploadImage(buffer, filename)

    // Update user with new avatar
  const updated = await prisma.user.update({
      where: { id: userId },
      data: {
        avatarUrl: result.secure_url ?? result.url ?? null,
        avatarPublicId: result.public_id ?? null,
        updatedAt: new Date(),
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        studentId: true,
        role: true,
        avatarUrl: true,
      }
    })

    // Best-effort delete old avatar
    if (existing?.avatarPublicId && existing.avatarPublicId !== result.public_id) {
      try { await deleteFromCloudinary(existing.avatarPublicId, 'image') } catch {}
    }

    return NextResponse.json({ message: 'อัปโหลดรูปโปรไฟล์สำเร็จ', user: updated })
  } catch (error) {
    console.error('Avatar upload error:', error)
    return NextResponse.json({ error: 'เกิดข้อผิดพลาดในการอัปโหลดรูป' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const userId = getUserIdFromToken(request)
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { avatarPublicId: true }
    })

    if (user?.avatarPublicId) {
      try { await deleteFromCloudinary(user.avatarPublicId, 'image') } catch (e) { console.warn('Delete cloudinary failed', e) }
    }

    const updated = await prisma.user.update({
      where: { id: userId },
      data: { avatarUrl: null, avatarPublicId: null, updatedAt: new Date() },
      select: { id: true, firstName: true, lastName: true, email: true, studentId: true, role: true, avatarUrl: true }
    })

    return NextResponse.json({ message: 'ลบรูปโปรไฟล์แล้ว', user: updated })
  } catch (error) {
    console.error('Avatar delete error:', error)
    return NextResponse.json({ error: 'เกิดข้อผิดพลาดในการลบรูป' }, { status: 500 })
  }
}
