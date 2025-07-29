import React, { useEffect, useState } from "react"
import { useAuth } from "../context/AuthContext"
import { getReports } from "../utils/api"
import PostItem from "../components/post/PostItem"
import Loader from "../components/shared/Loader"

export default function ProfilePage() {
  const { user } = useAuth()
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await getReports()
        // Filter posts by current user
        const userPosts = res.data.filter((post) => post.user === user.id)
        setPosts(userPosts)
      } catch (error) {
        console.error("Error fetching user posts", error)
      } finally {
        setLoading(false)
      }
    }

    if (user?.id) {
      fetchPosts()
    }
  }, [user])

  if (loading) return <Loader />

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 px-4 py-10 text-gray-900 dark:text-white">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-2xl font-bold mb-4">Your Profile</h2>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow">
          <p className="mb-2"><strong>Username:</strong> {user.username}</p>
          <p className="mb-4"><strong>Email:</strong> {user.email}</p>
        </div>

        <h3 className="text-xl font-semibold mt-10 mb-4">Your Posts</h3>
        <div className="space-y-4">
          {posts.length > 0 ? (
            posts.map((post) => <PostItem key={post.id} post={post} />)
          ) : (
            <p>You haven't submitted any reports yet.</p>
          )}
        </div>
      </div>
    </div>
  )
}
