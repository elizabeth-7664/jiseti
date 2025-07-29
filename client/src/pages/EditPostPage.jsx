import React, { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import EditPost from "../components/post/EditPost"
import Loader from "../components/shared/Loader"
import { getReport } from "../utils/api"

export default function EditPostPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [post, setPost] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await getReport(id)
        setPost(res.data)
      } catch (error) {
        console.error("Failed to load post", error)
        navigate("/404") // fallback if not found
      } finally {
        setLoading(false)
      }
    }

    fetchPost()
  }, [id, navigate])

  if (loading) return <Loader />

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 px-4 py-8 text-gray-900 dark:text-white">
      <div className="max-w-2xl mx-auto">
        <h2 className="text-2xl font-bold mb-6">Edit Report</h2>
        <EditPost post={post} />
      </div>
    </div>
  )
}
