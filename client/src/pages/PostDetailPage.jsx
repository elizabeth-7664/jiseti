import React, { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import PostDetail from "../components/post/PostDetail"
import Loader from "../components/shared/Loader"
import { getReport } from "../utils/api"
import Button from "../components/ui/Button"

export default function PostDetailPage() {
  const { reportId } = useParams()
  const navigate = useNavigate()
  const [post, setPost] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const loadPost = async () => {
      try {
        const res = await getReport(reportId)
        setPost(res.data)
      } catch (err) {
        console.error(err)
        setError("Failed to load post.")
      } finally {
        setLoading(false)
      }
    }

    loadPost()
  }, [reportId])

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 px-4 py-8 text-gray-900 dark:text-white">
      <div className="max-w-4xl mx-auto">
        <Button variant="outline" onClick={() => navigate(-1)} className="mb-4">
          ← Back
        </Button>

        {loading ? (
          <Loader />
        ) : error ? (
          <div className="text-red-600 font-medium">{error}</div>
        ) : post ? (
          <PostDetail post={post} />
        ) : (
          <p className="text-gray-500">Post not found.</p>
        )}
      </div>
    </div>
  )
}