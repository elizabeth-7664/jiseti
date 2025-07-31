// src/pages/AdminDashboardPage.jsx
import React, { useState, useEffect, useCallback } from "react";
import { useAuth } from "../context/AuthContext";
import { getUsers, getReports, updateReportStatus, deleteUser, deleteReport } from "../utils/api";
import Spinner from "../components/ui/Spinner";
import Alert from "../components/ui/Alert";
import { useNavigate } from "react-router-dom";
import {AdminActions } from "../components/admin/AdminActions";
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
      const response = await getReports();
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
    // Placeholder: Replace with actual API call for post status update
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
    setSuccessMessage(`Post ${status} with comment: ${comment}`);
    setSelectedPost(null); // Reset selected post after action
  };

  const handleViewPost = (post) => setSelectedPost(post);

  if (!isAuthenticated || !user?.is_admin) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-100 dark:bg-gray-950">
        <div className="text-center py-6 text-gray-900 dark:text-white">Redirecting...</div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 bg-gray-100 dark:bg-gray-950">
      <div className="py-6">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-center text-gray-900 dark:text-white mb-8 tracking-tight font-serif">
          Admin Dashboard
        </h1>

        {successMessage && (
          <Alert type="success" message={successMessage} onDismiss={() => setSuccessMessage(null)} className="mb-6 p-3 rounded-lg bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400" />
        )}
        {error && (
          <Alert type="error" message={error} onDismiss={() => setError(null)} className="mb-6 p-3 rounded-lg bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400" />
        )}

        <section className="mb-8" aria-labelledby="posts-heading">
          <h2 id="posts-heading" className="text-2xl sm:text-3xl font-semibold text-gray-800 dark:text-gray-200 mb-6 font-serif">
            Manage Posts
          </h2>
          {loadingPosts ? (
            <div className="flex justify-center">
              <Spinner className="h-8 w-8 text-blue-500" />
            </div>
          ) : (
            <div className="space-y-4">
              <AdminPostTable posts={posts} onView={handleViewPost} />
              {selectedPost && (
                <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-2xl border border-gray-200/50 dark:border-gray-800/50 p-6">
                  <h3 className="text-xl font-semibold mb-4">Review Post: {selectedPost.title}</h3>
                  <PostStatusTimeline currentStatus={selectedPost.status} />
                  <PostReviewPanel
                    postId={selectedPost.id}
                    initialStatus={selectedPost.status}
                    onStatusUpdated={(updated) => setPosts(posts.map(p => p.id === updated.id ? updated : p))}
                  />
                  <AdminActions
                    reportId={selectedPost.id}
                    currentStatus={selectedPost.status}
                    onActionSubmit={handleActionSubmit}
                  />
                </div>
              )}
            </div>
          )}
        </section>

        <section className="mb-8" aria-labelledby="reports-heading">
          <h2 id="reports-heading" className="text-2xl sm:text-3xl font-semibold text-gray-800 dark:text-gray-200 mb-6 font-serif">
            Manage Reports
          </h2>
          {loadingReports ? (
            <div className="flex justify-center">
              <Spinner className="h-8 w-8 text-blue-500" />
            </div>
          ) : (
            <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-2xl border border-gray-200/50 dark:border-gray-800/50 p-6 overflow-hidden">
              <ReportTable reports={reports} users={users} isAdmin={true} />
            </div>
          )}
        </section>

        <section className="mb-8" aria-labelledby="users-heading">
          <h2 id="users-heading" className="text-2xl sm:text-3xl font-semibold text-gray-800 dark:text-gray-200 mb-6 font-serif">
            Manage Users
          </h2>
          {loadingUsers ? (
            <div className="flex justify-center">
              <Spinner className="h-8 w-8 text-blue-500" />
            </div>
          ) : users.length === 0 ? (
            <p className="text-center text-gray-600 dark:text-gray-400">No users found.</p>
          ) : (
            <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-2xl border border-gray-200/50 dark:border-gray-800/50 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-gray-50 dark:bg-gray-800">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">ID</th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Username</th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Email</th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Admin</th>
                      <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                    {users.map((u) => (
                      <tr key={u.id} className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-200">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">{u.id.substring(0, 8)}...</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">{u.username}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">{u.email}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">{u.is_admin ? "Yes" : "No"}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          {u.id !== user.id && (
                            <button
                              onClick={() => handleDeleteUser(u.id)}
                              className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 transition-colors duration-200"
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