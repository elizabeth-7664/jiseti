// src/pages/AdminDashboardPage.jsx
import React, { useState, useEffect, useCallback, useMemo } from "react";
import { Users, FileText, Activity, CheckCircle, TrendingUp } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { getUsers, getReports, updateReportStatus, deleteUser, deleteReport } from "../utils/api";
import Spinner from "../components/ui/Spinner";
import Alert from "../components/ui/Alert";
import { useNavigate } from "react-router-dom";
import { AdminActions } from "../components/admin/AdminActions";
import AdminPostTable from "../components/admin/AdminPostTable";
import PostReviewPanel from "../components/admin/PostReviewPanel";
import PostStatusTimeline from "../components/admin/PostStatusTimeline";
import ReportTable from "../components/admin/ReportTable";

const AdminDashboardPage = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [users, setUsers] = useState([]);
  const [reports, setReports] = useState([]);
  const [posts, setPosts] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [loadingReports, setLoadingReports] = useState(true);
  const [loadingPosts, setLoadingPosts] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  // Selected post for review
  const [selectedPost, setSelectedPost] = useState(null);

  const fetchUsers = useCallback(async () => {
    setLoadingUsers(true);
    setError(null);
    try {
      const response = await getUsers();
      setUsers(response.data);
    } catch (err) {
      console.error("Failed to fetch users:", err);
      setError("Failed to fetch users.");
    } finally {
      setLoadingUsers(false);
    }
  }, []);

  const fetchReports = useCallback(async () => {
    setLoadingReports(true);
    setError(null);
    try {
      const response = await getReports();
      setReports(response.data);
    } catch (err) {
      console.error("Failed to fetch reports:", err);
      setError("Failed to fetch reports.");
    } finally {
      setLoadingReports(false);
    }
  }, []);

  const fetchPosts = useCallback(async () => {
    setLoadingPosts(true);
    setError(null);
    try {
      const response = await getReports(); // Reverted to original
      setPosts(response.data);
    } catch (err) {
      console.error("Failed to fetch posts:", err);
      setError("Failed to fetch posts.");
    } finally {
      setLoadingPosts(false);
    }
  }, []);

  useEffect(() => {
    if (!isAuthenticated || !user?.is_admin) {
      navigate("/");
      return;
    }
    fetchUsers();
    fetchReports();
    fetchPosts();
  }, [isAuthenticated, user, navigate, fetchUsers, fetchReports, fetchPosts]);

  const handleDeleteUser = async (userId) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      await deleteUser(userId);
      setSuccessMessage("User deleted successfully!");
      fetchUsers();
    } catch (err) {
      setError("Failed to delete user.");
    }
  };

  const handleDeleteReport = async (reportId) => {
    if (!window.confirm("Are you sure you want to delete this report?")) return;
    try {
      await deleteReport(reportId);
      setSuccessMessage("Report deleted successfully!");
      fetchReports();
    } catch (err) {
      setError("Failed to delete report.");
    }
  };

  const handleStatusChange = async (reportId, newStatus) => {
    if (!window.confirm(`Change status to "${newStatus}"?`)) return;
    try {
      const response = await updateReportStatus(reportId, { status: newStatus });
      setSuccessMessage(`Status updated to "${response.data.status}"!`);
      setReports(reports.map(r => r.id === reportId ? { ...r, status: response.data.status } : r));
    } catch (err) {
      setError("Failed to update status.");
    }
  };

  const handleActionSubmit = async ({ reportId, status, comment }) => {
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
    setSuccessMessage(`Post ${status} with comment: ${comment}`);
    setSelectedPost(null);
  };

  const handleViewPost = (post) => setSelectedPost(post);

  // Derived Statistics
  const totalReports = reports.length;
  
  const statusCounts = useMemo(() => {
    return reports.reduce((acc, report) => {
      const status = report.status === 'under_investigation' ? 'Investigating' : (report.status || 'Draft');
      acc[status] = (acc[status] || 0) + 1;
      return acc;
    }, {});
  }, [reports]);

  const categoryCounts = useMemo(() => {
    return reports.reduce((acc, report) => {
      const category = report.category || 'Other';
      acc[category] = (acc[category] || 0) + 1;
      return acc;
    }, {});
  }, [reports]);

  const resolvedReports = statusCounts['Resolved'] || 0;
  const underInvestigationReports = statusCounts['Investigating'] || 0;

  if (!isAuthenticated || !user?.is_admin) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-100 to-white dark:from-gray-900 dark:to-gray-950">
        <div className="text-center py-6 px-4 bg-white/80 dark:bg-gray-800/80 rounded-xl shadow-lg text-gray-900 dark:text-white">
          Redirecting...
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 min-h-screen">
      <div className="py-8">
        <h1 className="text-4xl sm:text-5xl font-extrabold text-center bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-10 tracking-tight font-serif">
          Admin Dashboard
        </h1>

        {successMessage && (
          <Alert
            type="success"
            message={successMessage}
            onDismiss={() => setSuccessMessage(null)}
            className="mb-6 p-4 rounded-xl shadow-md animate-fade-in bg-green-50 dark:bg-green-900/50 text-green-700 dark:text-green-200 border-l-4 border-green-500"
          />
        )}
        {error && (
          <Alert
            type="error"
            message={error}
            onDismiss={() => setError(null)}
            className="mb-6 p-4 rounded-xl shadow-md animate-fade-in bg-red-50 dark:bg-red-900/50 text-red-700 dark:text-red-200 border-l-4 border-red-500"
          />
        )}

        {/* Analytics Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 flex items-center space-x-4 border border-gray-100 dark:border-gray-700 transition-transform hover:scale-105 duration-200">
            <div className="p-3 bg-blue-100 dark:bg-blue-900/50 rounded-lg">
              <FileText className="w-8 h-8 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Reports</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{totalReports}</p>
              <div className="flex items-center text-xs text-green-600 dark:text-green-400 mt-1">
                <TrendingUp className="w-3 h-3 mr-1" />
                <span>+12% this week</span>
              </div>
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 flex items-center space-x-4 border border-gray-100 dark:border-gray-700 transition-transform hover:scale-105 duration-200">
            <div className="p-3 bg-amber-100 dark:bg-amber-900/50 rounded-lg">
              <Activity className="w-8 h-8 text-amber-600 dark:text-amber-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Investigating</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{underInvestigationReports}</p>
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 flex items-center space-x-4 border border-gray-100 dark:border-gray-700 transition-transform hover:scale-105 duration-200">
            <div className="p-3 bg-green-100 dark:bg-green-900/50 rounded-lg">
              <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Resolved</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{resolvedReports}</p>
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 flex items-center space-x-4 border border-gray-100 dark:border-gray-700 transition-transform hover:scale-105 duration-200">
            <div className="p-3 bg-purple-100 dark:bg-purple-900/50 rounded-lg">
              <Users className="w-8 h-8 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Users</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{users.length}</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-100 dark:border-gray-700">
            <h3 className="text-lg font-bold text-gray-800 dark:text-gray-200 mb-6">Reports by Status</h3>
            <div className="space-y-4">
              {['Draft', 'Investigating', 'Resolved', 'Rejected'].map(status => {
                const count = statusCounts[status] || 0;
                const percentage = totalReports > 0 ? (count / totalReports) * 100 : 0;
                return (
                  <div key={status}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="font-medium text-gray-700 dark:text-gray-300">{status}</span>
                      <span className="text-gray-500 dark:text-gray-400">{count}</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                      <div 
                        className={`h-2.5 rounded-full ${
                          status === 'Resolved' ? 'bg-green-500' :
                          status === 'Investigating' ? 'bg-amber-500' :
                          status === 'Rejected' ? 'bg-red-500' : 'bg-blue-500'
                        } transition-all duration-1000 ease-out`}
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-100 dark:border-gray-700">
            <h3 className="text-lg font-bold text-gray-800 dark:text-gray-200 mb-6">Reports by Category</h3>
            <div className="space-y-4">
              {Object.entries(categoryCounts).length > 0 ? Object.entries(categoryCounts).map(([category, count], idx) => {
                const percentage = totalReports > 0 ? (count / totalReports) * 100 : 0;
                const colors = ['bg-indigo-500', 'bg-pink-500', 'bg-teal-500', 'bg-orange-500'];
                const color = colors[idx % colors.length];
                return (
                  <div key={category} className="flex items-center p-3 bg-gray-50 dark:bg-gray-700/30 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors">
                    <div className={`w-3 h-3 rounded-full ${color} mr-3`}></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-800 dark:text-gray-200">{category}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-gray-900 dark:text-white">{count}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{percentage.toFixed(1)}%</p>
                    </div>
                  </div>
                )
              }) : (
                <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">No categories found.</p>
              )}
            </div>
          </div>
        </div>

        <section className="mb-10" aria-labelledby="posts-heading">
          <h2 id="posts-heading" className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-gray-200 mb-6 border-b-2 border-blue-200 dark:border-blue-800 pb-2">
            Manage Posts
          </h2>
          {loadingPosts ? (
            <div className="flex justify-center items-center h-32 bg-white/50 dark:bg-gray-800/50 rounded-xl shadow-inner">
              <Spinner className="h-10 w-10 text-blue-600 dark:text-blue-400" />
            </div>
          ) : (
            <div className="space-y-6">
              <AdminPostTable posts={posts} onView={handleViewPost} className="bg-white dark:bg-gray-800 rounded-xl shadow-lg" />
              {selectedPost && (
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200/50 dark:border-gray-700/50 p-6 space-y-6">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">Review Post: {selectedPost.title}</h3>
                  <PostStatusTimeline currentStatus={selectedPost.status} className="border-b border-gray-200 dark:border-gray-700 pb-4" />
                  <PostReviewPanel
                    postId={selectedPost.id}
                    initialStatus={selectedPost.status}
                    onStatusUpdated={(updated) => setPosts(posts.map(p => p.id === updated.id ? updated : p))}
                    className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg"
                  />
                  <AdminActions
                    reportId={selectedPost.id}
                    currentStatus={selectedPost.status}
                    onActionSubmit={handleActionSubmit}
                    className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg"
                  />
                </div>
              )}
            </div>
          )}
        </section>

        <section className="mb-10" aria-labelledby="reports-heading">
          <h2 id="reports-heading" className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-gray-200 mb-6 border-b-2 border-blue-200 dark:border-blue-800 pb-2">
            Manage Reports
          </h2>
          {loadingReports ? (
            <div className="flex justify-center items-center h-32 bg-white/50 dark:bg-gray-800/50 rounded-xl shadow-inner">
              <Spinner className="h-10 w-10 text-blue-600 dark:text-blue-400" />
            </div>
          ) : (
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200/50 dark:border-gray-700/50 p-6 overflow-hidden">
              <ReportTable reports={reports} users={users} isAdmin={true} className="w-full" />
            </div>
          )}
        </section>

        <section className="mb-10" aria-labelledby="users-heading">
          <h2 id="users-heading" className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-gray-200 mb-6 border-b-2 border-blue-200 dark:border-blue-800 pb-2">
            Manage Users
          </h2>
          {loadingUsers ? (
            <div className="flex justify-center items-center h-32 bg-white/50 dark:bg-gray-800/50 rounded-xl shadow-inner">
              <Spinner className="h-10 w-10 text-blue-600 dark:text-blue-400" />
            </div>
          ) : users.length === 0 ? (
            <div className="text-center text-gray-600 dark:text-gray-400 py-6 bg-white/50 dark:bg-gray-800/50 rounded-xl shadow-md">
              No users found.
            </div>
          ) : (
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200/50 dark:border-gray-700/50 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-gray-100 dark:bg-gray-700">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">ID</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Username</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Email</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Admin</th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                    {users.map((u) => (
                      <tr key={u.id} className="hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors duration-200">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">{u.id.substring(0, 8)}...</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">{u.username}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">{u.email}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">{u.is_admin ? "Yes" : "No"}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          {u.id !== user.id && (
                            <button
                              onClick={() => handleDeleteUser(u.id)}
                              className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 transition-colors duration-200 px-3 py-1 rounded-md"
                              aria-label={`Delete user ${u.username}`}
                            >
                              Delete
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default AdminDashboardPage;