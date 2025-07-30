// src/pages/PostDetailPage.jsx
import React, { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import PostDetail from "../components/post/PostDetail"
import Loader from "../components/shared/Loader"
import { getReport } from "../utils/api"
import Button from "../components/ui/Button"

export default function PostDetailPage() {
  const { reportId } = useParams() // <--- CHANGE THIS LINE: Match your route parameter name
  const navigate = useNavigate()
  const [post, setPost] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const loadPost = async () => {
      try {
        if (!reportId) { // Add a check to ensure reportId exists before fetching
          setError("No report ID found in URL.");
          setLoading(false);
          return;
        }
        const res = await getReport(reportId) // <--- Use reportId here
        setPost(res.data)
      } catch (err) {
        console.error("Error loading post:", err) // More descriptive error log
        setError("Failed to load post. Please try again.")
      } finally {
        setLoading(false)
      }
    }

    loadPost()
  }, [reportId]) // <--- Dependency array: depend on reportId

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