// app/api/videos/[id]/route.ts - Update cover image handling to Cloudinary
import { NextResponse } from 'next/server';
import { deleteFromCloudinary, uploadImage } from '@/lib/cloudinary';
import { prisma } from '@/lib/prisma';

// Types
type RouteParams = { params: Promise<{ id: string }> };

interface UpdateData {
  title: string;
  description: string;
  youtubeUrl: string;
  courseType?: string;
  lesson?: number;
  image?: string;
}

// PUT - อัพเดทวิดีโอ
export async function PUT(request: Request, { params }: RouteParams) {
  try {
  const { id } = await params;
    const formData = await request.formData();
    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const youtubeUrl = formData.get('youtubeUrl') as string;
    const courseType = formData.get('courseType') as string;
    const lesson = formData.get('lesson') as string;
    const image = formData.get('image') as File | null;

    const updateData: UpdateData = {
      title,
      description,
      youtubeUrl,
    };

    // เพิ่ม courseType และ lesson ถ้ามี
    if (courseType) {
      updateData.courseType = courseType;
    }
    if (lesson) {
      updateData.lesson = parseInt(lesson);
    }

    // อัพโหลดรูปภาพใหม่ไป Cloudinary (ถ้ามี)
    if (image && image.size > 0) {
      const existing = await prisma.video.findUnique({ where: { id: parseInt(id) }, select: { id: true, imagePublicId: true } });
      const bytes = await image.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const filename = `video-cover-${id}`;
      try {
        const result: any = await uploadImage(buffer, filename);
        updateData.image = result.secure_url ?? result.url ?? null;
        (updateData as any).imagePublicId = result.public_id ?? null;

        // ลบรูปเดิมใน Cloudinary แบบ best-effort ถ้ามีและไม่ใช่ไฟล์เดียวกัน
        if (existing?.imagePublicId && existing.imagePublicId !== result.public_id) {
          try { await deleteFromCloudinary(existing.imagePublicId, 'image') } catch {}
        }
      } catch (e) {
        console.error('Cloudinary upload failed for video update:', e);
      }
    }

    const video = await prisma.video.update({
      where: { id: parseInt(id) },
      data: updateData
    });

    return NextResponse.json(video);
  } catch (error) {
    console.error('Error updating video:', error);
    return NextResponse.json({ error: 'Failed to update video' }, { status: 500 });
  }
}

// DELETE - ลบวิดีโอ
export async function DELETE(request: Request, { params }: RouteParams) {
  try {
    const { id } = await params;

    // ลบรูปภาพใน Cloudinary ถ้ามี public_id
    const video = await prisma.video.findUnique({ where: { id: parseInt(id) }, select: { imagePublicId: true } });
    if (video?.imagePublicId) {
      try { await deleteFromCloudinary(video.imagePublicId, 'image') } catch {}
    }

    await prisma.video.delete({
      where: { id: parseInt(id) }
    });

    return NextResponse.json({ message: 'Video deleted successfully' });
  } catch (error) {
    console.error('Error deleting video:', error);
    return NextResponse.json({ error: 'Failed to delete video' }, { status: 500 });
  }
}