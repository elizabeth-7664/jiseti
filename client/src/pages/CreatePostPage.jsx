import React from "react"
import AddPost from "../components/post/AddPost"
import { useNavigate } from "react-router-dom"

export default function CreatePostPage() {
  const navigate = useNavigate()

  const handleClose = () => {
    navigate(-1) // Go back when user cancels
  }

  const handlePostAdded = (newPost) => {
    navigate(`/posts/${newPost.id}`) // Navigate to detail view after submission
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 px-4 py-8 text-gray-900 dark:text-white">
      <div className="max-w-2xl mx-auto">
        <h2 className="text-2xl font-bold mb-6">Create a New Report</h2>
        <AddPost isOpen={true} onClose={handleClose} onPostAdded={handlePostAdded} />
      </div>
    </div>
  )
}
