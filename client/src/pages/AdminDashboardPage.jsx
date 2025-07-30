import React, { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import AdminPostTable from "../components/admin/AdminPostTable"
import ReportTable from "../components/admin/ReportTable"
import Loader from "../components/shared/Loader"

export default function AdminDashboardPage() {
  const { user } = useAuth()
  const navigate = useNavigate()

  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user || !user.is_admin) {
      navigate("/unauthorized")
    } else {
      setLoading(false)
    }
  }, [user, navigate])

  if (loading) return <Loader />

  return (
    <div className="min-h-screen px-4 py-10 bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>

        <section className="mb-10">
          <h2 className="text-xl font-semibold mb-4">All Posts</h2>
          <AdminPostTable />
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4">Flagged Reports</h2>
          <ReportTable />
        </section>
      </div>
    </div>
  )
}
