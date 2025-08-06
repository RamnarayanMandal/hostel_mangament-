import TeacherLayout from '@/components/layouts/TeacherLayout'

export default function TeacherRootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <TeacherLayout>{children}</TeacherLayout>
} 