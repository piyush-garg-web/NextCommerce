import { redirect } from 'next/navigation'
import { ADMIN_DASHBOARD } from '@/routes/adminpanel'

export default function AdminPage() {
  redirect(ADMIN_DASHBOARD)
}
