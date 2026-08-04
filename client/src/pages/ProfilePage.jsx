import React, { useEffect, useState } from "react"
import { useAuth } from "../context/AuthContext"
import { getReports } from "../utils/api"
import PostItem from "../components/post/PostItem"
import Loader from "../components/shared/Loader"
import { FileText, CheckCircle, Award, Calendar, Mail, User } from "lucide-react"

export default function ProfilePage() {
  const { user } = useAuth()
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await getReports()
        // Filter posts by current user. Safe check for different possible backend properties
        const userPosts = res.data.filter((post) => 
          post.user_id === user.id || post.author_id === user.id || post.author?.id === user.id || post.userId === user.id || post.user === user.id
        )
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

  // Derived / Mocked Stats
  const reportsFiled = posts.length;
  const resolvedCases = posts.filter(p => p.status === 'resolved').length;
  const impactScore = reportsFiled * 10 + resolvedCases * 25;
  const joinedDate = user.created_at ? new Date(user.created_at).toLocaleDateString() : "Jan 2024";

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* Header Section */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
          <div className="h-32 bg-gradient-to-r from-emerald-500 to-teal-600"></div>
          <div className="px-6 sm:px-10 pb-8">
            <div className="relative flex justify-between items-end -mt-12 mb-6">
              <div className="flex items-end space-x-5">
                <img 
                  src={`https://ui-avatars.com/api/?name=${encodeURIComponent(user.username || 'User')}&background=059669&color=fff&size=128`} 
                  alt="Avatar" 
                  className="w-24 h-24 rounded-full border-4 border-white dark:border-gray-800 bg-white shadow-md object-cover"
                />
                <div className="pb-2">
                  <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                    {user.username || 'User'}
                  </h1>
                </div>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-y-3 gap-x-6 text-sm text-gray-600 dark:text-gray-300">
              <div className="flex items-center">
                <Mail className="w-4 h-4 mr-2 text-gray-400" />
                {user.email || 'No email provided'}
              </div>
              <div className="flex items-center">
                <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                Joined {joinedDate}
              </div>
            </div>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 flex items-center space-x-4">
            <div className="p-3 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-xl">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Reports Filed</p>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{reportsFiled}</h3>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 flex items-center space-x-4">
            <div className="p-3 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-xl">
              <CheckCircle className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Resolved Cases</p>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{resolvedCases}</h3>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 flex items-center space-x-4">
            <div className="p-3 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-xl">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Community Impact</p>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{impactScore}</h3>
            </div>
          </div>
        </div>

        {/* Activity Feed */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 sm:p-8">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 border-b border-gray-100 dark:border-gray-700 pb-4">
            Activity Feed
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
            {posts.length > 0 ? (
              posts.map((post) => <PostItem key={post.id} post={post} />)
            ) : (
              <div className="col-span-full py-12 text-center text-gray-500 dark:text-gray-400">
                <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p className="text-lg">You haven't submitted any reports yet.</p>
                <p className="text-sm mt-1">Your reports will appear here once you create them.</p>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  )
}
