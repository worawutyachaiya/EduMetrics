"use client"

import { useState, useEffect, useMemo } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"

interface FormData {
  firstName: string;
  lastName: string;
  studentId: string;
  email: string;
  password: string;
  confirmPassword: string;
  academicYear: number;
}

interface InputFieldProps {
  label: string;
  name: string;
  type?: string;
  value: string | number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  isLoading: boolean;
  minLength?: number;
  placeholder?: string;
}

const Register = () => {
  const router = useRouter()
  const { login, user } = useAuth()

  // Generate academic years in Buddhist Era (current year - 1, current year, current year + 1)
  const currentYearAD = new Date().getFullYear()
  const currentYearBE = currentYearAD + 543 // Convert to Buddhist Era
  const academicYears = [currentYearBE - 1, currentYearBE, currentYearBE + 1]

  const [form, setForm] = useState<FormData>({
    firstName: '',
    lastName: '',
    studentId: '',
    email: '',  // เพิ่มฟิลด์อีเมล
    password: '',
    confirmPassword: '',
    academicYear: currentYearBE // Default to current year in BE
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [studentIdError, setStudentIdError] = useState('')
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  // redirect ถ้ามีผู้ใช้อยู่แล้ว
  useEffect(() => {
    if (user) {
      router.push(user.role === 'admin' ? '/admin/quiz' : '/')
    }
  }, [user, router])

  const particles = useMemo(() => {
    return Array.from({ length: 40 }).map(() => ({
      left: Math.random() * 100,
      top: Math.random() * 100,
      duration: 3 + Math.random() * 4,
      delay: Math.random() * 3,
    }))
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setForm({ ...form, [name]: name === 'academicYear' ? parseInt(value) : value })
    setError('')
    // clear field-specific errors
    if (name === 'studentId') setStudentIdError('')
  }

  // เพิ่ม debug ในหน้า register - ใส่ในฟังก์ชัน handleSubmit

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault()
  setIsLoading(true)
  setError('')

  // เพิ่ม debug logs
  console.log('🔍 === Frontend Registration Debug ===')
  console.log('📝 Form values:', form)
  
  // ตรวจสอบปีการศึกษาเป็นพิเศษ
  console.log('📅 Academic Year Debug:')
  console.log('- Value from form:', form.academicYear)
  console.log('- Type:', typeof form.academicYear)
  console.log('- Is BE format?:', form.academicYear > 2100)
  console.log('- Current year BE:', new Date().getFullYear() + 543)

  // Validation เดิม...
  if (!form.firstName || !form.lastName || !form.studentId || !form.email || !form.password || !form.confirmPassword || !form.academicYear) {
    console.log('❌ Missing required fields')
    setError("กรุณากรอกข้อมูลให้ครบ")
    setIsLoading(false)
    return
  }

  // เพิ่มการตรวจสอบปีการศึกษา
  const currentYearBE = new Date().getFullYear() + 543
  const validYearsBE = [currentYearBE - 1, currentYearBE, currentYearBE + 1]
  
  console.log('📅 Year validation:')
  console.log('- Valid BE years:', validYearsBE)
  console.log('- Selected year:', form.academicYear)
  console.log('- Is valid?:', validYearsBE.includes(form.academicYear))

  if (!validYearsBE.includes(form.academicYear)) {
    console.log('❌ Invalid academic year on frontend')
    setError(`ปีการศึกษาต้องเป็น ${validYearsBE.join(' หรือ ')}`)
    setIsLoading(false)
    return
  }

  // Validation อื่นๆ เดิม...
  // Student ID validation:
  // - must be exactly 12 digits
  // - must start with '4'
  // - characters 2-3 (index 1-2) represent the admission year offset (e.g. '65' -> 2565 BE)
  const studentId = form.studentId.trim()
  if (!/^\d{12}$/.test(studentId)) {
    setError("รหัสนักศึกษาไม่ถูกต้อง")
    setIsLoading(false)
    return
  }

  if (!studentId.startsWith('4')) {
    setError("รหัสนักศึกษาไม่ถูกต้อง")
    setIsLoading(false)
    return
  }

  // ตรวจสอบปีที่เข้าศึกษา: หลักที่ 2-3 ของรหัสเป็นปีพ.ศ.ย่อ เช่น '65' -> พ.ศ.2565
  // ขยายช่วงที่รับได้ให้ครอบคลุมผู้เข้าศึกษาภายในช่วงปีที่ผ่านมาจนถึงปีหน้า (ตัวอย่าง: last 6 years..next year)
  const yearTwoDigits = studentId.substring(1, 3) // e.g. '65'
  const enteredYearTwoDigits = parseInt(yearTwoDigits, 10)
  if (Number.isNaN(enteredYearTwoDigits)) {
    setError(`รหัสนักศึกษาไม่ถูกต้อง`)
    setIsLoading(false)
    return
  }

  const enteredYearBE = 2500 + enteredYearTwoDigits // convert '65' -> 2565
  const recentYearsWindow = 6 // how many past years we accept
  const allowedYears = [] as number[]
  for (let i = 0; i <= recentYearsWindow; i++) {
    allowedYears.push(currentYearBE - i)
  }
  // also allow next year (in case of early registrations)
  allowedYears.push(currentYearBE + 1)

  if (!allowedYears.includes(enteredYearBE)) {
    setError(`รหัสนักศึกษาไม่ถูกต้อง: ปีที่เข้าศึกษาต้องเป็นหนึ่งใน ${allowedYears.join(', ')}`)
    setIsLoading(false)
    return
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(form.email)) {
    setError("กรุณากรอกอีเมลให้ถูกต้อง")
    setIsLoading(false)
    return
  }

  // Password complexity validation
  const password = form.password
  const passwordErrors: string[] = []
  if (password.length < 6) passwordErrors.push('ความยาวอย่างน้อย 6 ตัวอักษร')
  if (!/[A-Z]/.test(password)) passwordErrors.push('มีตัวพิมพ์ใหญ่ (A-Z) อย่างน้อย 1 ตัว')
  if (!/[a-z]/.test(password)) passwordErrors.push('มีตัวพิมพ์เล็ก (a-z) อย่างน้อย 1 ตัว')
  if (!/[0-9]/.test(password)) passwordErrors.push('มีตัวเลข (0-9) อย่างน้อย 1 ตัว')
  if (!/[.!@#\$%\^&\*(),?"':;{}|<>\[\]\\/\\\\+=_-]/.test(password)) passwordErrors.push('มีอักขระพิเศษ เช่น . & @ # หรืออื่นๆ')

  if (passwordErrors.length > 0) {
    setError('รูปแบบรหัสผ่านไม่ถูกต้อง: ' + passwordErrors.join(' ; '))
    setIsLoading(false)
    return
  }

  if (form.password !== form.confirmPassword) {
    setError("รหัสผ่านไม่ตรงกัน")
    setIsLoading(false)
    return
  }

  console.log('✅ Frontend validation passed')

  // Prepare data for API
  const requestData = {
    firstName: form.firstName,
    lastName: form.lastName,
    studentId: form.studentId,
    email: form.email,
    password: form.password,
    academicYear: form.academicYear // ส่งเป็นปี พ.ศ.
  }

  console.log('📤 Sending to API:', {
    ...requestData,
    password: '[HIDDEN]'
  })

  try {
    console.log('🌐 Making API request...')
    const res = await fetch('/api/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(requestData)
    })

    console.log('📨 Response status:', res.status)
    const data = await res.json()
    console.log('📨 Response data:', data)

    if (!res.ok) {
      console.log('❌ API returned error:', data.error)
      if (data.debug) {
        console.log('🔍 Debug info:', data.debug)
      }
        // If the API indicates the studentId is already used, show inline studentId error
        if (data.error && data.error.includes('รหัสนักศึกษ')) {
          setStudentIdError(data.error)
          setError('')
        } else {
          setError(data.error || "เกิดข้อผิดพลาด")
        }
    } else {
      console.log('✅ Registration successful!')
      // Show success message instead of auto-login
      setError('')
      // Show success alert with instruction
      const confirmGoToVerification = confirm(
        'ลงทะเบียนสำเร็จ!\n\nเราได้ส่งอีเมลยืนยันไปยังอีเมลของคุณแล้ว กรุณาตรวจสอบอีเมลและคลิกลิงก์เพื่อยืนยันบัญชี\n\nต้องการไปหน้าขออีเมลยืนยันใหม่หรือไม่?'
      )
      
      if (confirmGoToVerification) {
        router.push('/resend-verification')
      } else {
        router.push('/login')
      }
    }
  } catch (error) {
    console.error('❌ Network error:', error)
    setError("เกิดข้อผิดพลาดในการลงทะเบียน")
  } finally {
    setIsLoading(false)
  }
}

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background gradients - เปลี่ยนเป็นโทนฟ้าอ่อน */}
      <div className="absolute inset-0 bg-gradient-to-br from-sky-900 via-blue-900 to-indigo-900">
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-gradient-to-r from-sky-400 to-blue-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute bottom-1/4 left-1/4 w-80 h-80 bg-gradient-to-r from-blue-400 to-indigo-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-1000"></div>
        <div className="absolute top-3/4 right-1/3 w-72 h-72 bg-gradient-to-r from-indigo-400 to-purple-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-2000"></div>
      </div>

      {/* Particle animation */}
      {isClient && (
        <div className="absolute inset-0">
          {particles.map((p, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-white rounded-full opacity-30"
              style={{
                left: `${p.left}%`,
                top: `${p.top}%`,
                animation: `float ${p.duration}s ease-in-out infinite`,
                animationDelay: `${p.delay}s`
              }}
            />
          ))}
        </div>
      )}

      {/* Register card */}
      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl p-8 shadow-2xl">
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent mb-2">
                Join Us
              </h1>
              <p className="text-white/70 text-sm">สร้างบัญชีเพื่อเริ่มต้นการเรียนรู้</p>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-red-500/20 border border-red-500/30 text-red-100 rounded-2xl backdrop-blur-sm">
                <div className="flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  {error}
                </div>
              </div>
            )}

            <form className="space-y-5" onSubmit={handleSubmit}>
              <div className="grid grid-cols-2 gap-4">
                <InputField label="ชื่อจริง" name="firstName" value={form.firstName} onChange={handleChange} isLoading={isLoading} />
                <InputField label="นามสกุล" name="lastName" value={form.lastName} onChange={handleChange} isLoading={isLoading} />
              </div>

              <InputField 
                label="รหัสนักศึกษา (12 หลัก)" 
                name="studentId" 
                value={form.studentId} 
                onChange={handleChange} 
                isLoading={isLoading}
                minLength={12}
              />
              {studentIdError && (
                <div role="alert" className="mt-2 text-sm text-red-200 bg-red-500/10 p-2 rounded-2xl border border-red-500/20">
                  {studentIdError}
                </div>
              )}

              <InputField 
                label="อีเมล" 
                name="email" 
                type="email"
                value={form.email} 
                onChange={handleChange} 
                isLoading={isLoading}
                placeholder="example@email.com"
              />

              {/* Academic Year Dropdown */}
              <div className="group">
                <label className="block text-sm font-medium text-white/90 mb-2">ปีการศึกษา</label>
                <div className="relative">
                  <select
                    name="academicYear"
                    value={form.academicYear}
                    onChange={handleChange}
                    disabled={isLoading}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-2xl text-white focus:outline-none focus:ring-2 focus:ring-sky-400/50 focus:border-sky-400/50 transition-all duration-300 backdrop-blur-sm appearance-none"
                  >
                    {academicYears.map(year => (
                      <option key={year} value={year} className="bg-slate-800 text-white">
                        {year} {year === currentYearBE && '(ปัจจุบัน)'}
                      </option>
                    ))}
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <svg className="w-5 h-5 text-white/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>

              <InputField 
                label="รหัสผ่าน (6 หลัก)" 
                name="password" 
                type="password" 
                value={form.password} 
                onChange={handleChange} 
                isLoading={isLoading}
                minLength={6}
              />
              <InputField 
                label="ยืนยันรหัสผ่าน" 
                name="confirmPassword" 
                type="password" 
                value={form.confirmPassword} 
                onChange={handleChange} 
                isLoading={isLoading}
                minLength={6}
              />

              <button
                type="submit"
                disabled={isLoading}
                className="w-full relative py-3 px-6 bg-gradient-to-r from-sky-500 to-blue-500 hover:from-sky-600 hover:to-blue-600 text-white font-semibold rounded-2xl transition-all duration-300 transform hover:scale-[1.02] hover:shadow-lg hover:shadow-sky-500/25 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    กำลังลงทะเบียน...
                  </div>
                ) : (
                  'ลงทะเบียน'
                )}
              </button>
            </form>

            <div className="mt-8 text-center">
              <p className="text-white/70 text-sm">
                มีบัญชีอยู่แล้ว?{' '}
                <a 
                  href="/login" 
                  className="text-sky-400 hover:text-sky-300 font-medium transition-colors duration-200 hover:underline"
                >
                  เข้าสู่ระบบ
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
      `}</style>
    </div>
  )
}

const InputField = ({ label, name, type = "text", value, onChange, isLoading, minLength, placeholder }: InputFieldProps) => (
  <div className="group">
    <label className="block text-sm font-medium text-white/90 mb-2">{label}</label>
    <div className="relative">
      <input
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        minLength={minLength}
        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-2xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-sky-400/50 focus:border-sky-400/50 transition-all duration-300 backdrop-blur-sm"
        placeholder={placeholder || label}
        disabled={isLoading}
      />
    </div>
  </div>
)

export default Register