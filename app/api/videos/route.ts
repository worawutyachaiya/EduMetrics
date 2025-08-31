// app/api/videos/route.ts - Updated to store cover images in Cloudinary
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { uploadImage } from '@/lib/cloudinary';

export async function GET() {
  try {
    const videos = await prisma.video.findMany({
      orderBy: [
        { courseType: 'asc' },
        { lesson: 'asc' },
        { createdAt: 'desc' }
      ]
    });
    
    return NextResponse.json(videos);
  } catch (error) {
    console.error('Error fetching videos:', error);
    return NextResponse.json(
      { error: 'เกิดข้อผิดพลาดในการโหลดข้อมูล' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const youtubeUrl = formData.get('youtubeUrl') as string;
    const courseType = formData.get('courseType') as string;
    const lesson = parseInt(formData.get('lesson') as string);
    const image = formData.get('image') as File | null;

    // Validation
    if (!title || !description || !youtubeUrl || !courseType || !lesson) {
      return NextResponse.json(
        { error: 'กรุณากรอกข้อมูลให้ครบถ้วน' },
        { status: 400 }
      );
    }

    if (lesson < 1 || lesson > 10) {
      return NextResponse.json(
        { error: 'บทเรียนต้องอยู่ระหว่าง 1-10' },
        { status: 400 }
      );
    }

    // Step 1: create the video first (without image) to get an ID
    let video = await prisma.video.create({
      data: {
        title,
        description,
        youtubeUrl,
        courseType,
        lesson,
        image: null,
      },
    });

    // Step 2: if cover image provided, upload to Cloudinary, then update the video with secure_url and public_id
    if (image && image.size > 0) {
      const bytes = await image.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const filename = `video-cover-${video.id}`; // deterministic public_id per video
      try {
        const result: any = await uploadImage(buffer, filename);
        video = await prisma.video.update({
          where: { id: video.id },
          data: {
            image: result.secure_url ?? result.url ?? null,
            imagePublicId: result.public_id ?? null,
          },
        });
      } catch (e) {
        console.error('Cloudinary upload failed for video cover:', e);
        // keep the video without image; optionally return warning
      }
    }

    return NextResponse.json(video);
  } catch (error) {
    console.error('Error creating video:', error);
    return NextResponse.json(
      { error: 'เกิดข้อผิดพลาดในการบันทึกข้อมูล' },
      { status: 500 }
    );
  }
}