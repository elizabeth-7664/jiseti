import React, { useEffect, useState } from "react"
import PostList from "../components/post/PostList"
import Loader from "../components/shared/Loader"
import { getReports } from "../utils/api"
import Button from "../components/ui/Button"
import { useNavigate } from "react-router-dom"

export default function PostListPage() {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    const loadPosts = async () => {
      try {
        const res = await getReports()
        setPosts(res.data)
      } catch (err) {
        console.error(err)
        setError("Failed to load posts.")
      } finally {
        setLoading(false)
      }
    }
    loadPosts()
  }, [])

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 px-4 py-8 text-gray-900 dark:text-white">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold">All Reports</h1>
          <Button onClick={() => navigate("/create")} className="bg-red-600 hover:bg-red-700 text-white">
            + Add New Report
          </Button>
        </div>

        {loading ? (
          <Loader />
        ) : error ? (
          <div className="text-red-600 font-medium">{error}</div>
        ) : posts.length === 0 ? (
          <p className="text-gray-500">No reports found.</p>
        ) : (
          <PostList posts={posts} />
        )}
      </div>
    </div>
  )
}
