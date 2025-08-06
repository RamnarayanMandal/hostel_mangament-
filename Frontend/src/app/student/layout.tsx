import StudentLayout from '@/components/layouts/StudentLayout'

export default function StudentRootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <StudentLayout>{children}</StudentLayout>
} 