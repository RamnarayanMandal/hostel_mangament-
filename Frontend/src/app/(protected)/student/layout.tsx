import StudentLayout from '@/components/layouts/StudentLayout'
import ProtectedRoute from '@/components/auth/ProtectedRoute'

export default function StudentLayoutWrapper({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ProtectedRoute allowedRoles={['student']}>
      <StudentLayout>{children}</StudentLayout>
    </ProtectedRoute>
  )
}
