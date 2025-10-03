// app/layout.tsx
'use client'
import { AuthProvider } from '@/lib/auth-context'
import Navbar from "@/components/Navber";
import Footer from "@/components/Footer";
import "./globals.css";
import { ReactNode } from "react";
import { usePathname } from 'next/navigation';

const RootLayout = ({ children }: { children: ReactNode }) => {
  const pathname = usePathname();
  
  // กำหนด routes ที่ไม่ต้องการ nav และ footer
  const hideNavFooter = ['/login', '/register','/admin/quiz','/admin/video','/admin/students','/reset-password','/forgot-password','/resend-verification','/verify-email'].includes(pathname);

  return (
    <html>
      <body className="antialiased">
        {!hideNavFooter && <Navbar />}
        <AuthProvider>
          <main className="min-h-screen">
            {children}
          </main>
        </AuthProvider>
        {!hideNavFooter && <Footer />}
      </body>
    </html>
  )
}

export default RootLayout;