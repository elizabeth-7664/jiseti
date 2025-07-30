import React, { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { getReport } from "../utils/api"
import { useAuth } from "../context/AuthContext"
import Loader from "../components/shared/Loader"
import PostStatusTimeline from "../components/admin/PostStatusTimeline"
import {AdminActions} from "../components/admin/AdminActions"

export default function ReviewReportPage() {
  const { id } = useParams()
  const { user } = useAuth()
  const navigate = useNavigate()

  const [report, setReport] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    if (!user || !user.is_admin) {
      navigate("/unauthorized")
    } else {
      getReport(id)
        .then((res) => setReport(res.data))
        .catch(() => setError("Failed to load report"))
        .finally(() => setLoading(false))
    }
  }, [id, user, navigate])

  if (loading) return <Loader />
  if (error) return <div className="text-red-500 p-4">{error}</div>
  if (!report) return <div className="p-4">No report found.</div>

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-white px-4 py-10">
      <div className="max-w-5xl mx-auto space-y-8">
        <h1 className="text-3xl font-bold">Review Report</h1>

        <section className="p-6 border rounded-lg shadow bg-gray-50 dark:bg-gray-800">
          <h2 className="text-xl font-semibold mb-2">{report.title}</h2>
          <p className="mb-4">{report.description}</p>

          {report.media_url && (
            <div className="mb-4">
              <img
                src={report.media_url}
                alt="report media"
                className="rounded max-h-80 object-contain"
              />
            </div>
          )}

          {report.location && (
            <p className="text-sm text-gray-600 dark:text-gray-400">
              📍 Location: {report.location}
            </p>
          )}
        </section>

        <PostStatusTimeline statusHistory={report.status_history} />

        <AdminActions reportId={report.id} currentStatus={report.status} />
      </div>
    </div>
  )
}
