import AdminLayout from '@/components/layouts/AdminLayout'
import ProtectedRoute from '@/components/auth/ProtectedRoute'

export default function AdminLayoutWrapper({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ProtectedRoute allowedRoles={['admin']}>
      <AdminLayout>{children}</AdminLayout>
    </ProtectedRoute>
  )
}
