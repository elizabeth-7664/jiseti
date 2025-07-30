// src/pages/AdminDashboardPage.jsx

import React, { useState, useEffect, useCallback } from "react";
import { useAuth } from "../context/AuthContext";
import { getUsers, getReports, updateReportStatus, deleteUser, deleteReport } from "../utils/api";
import Spinner from "../components/ui/Spinner";
import Alert from "../components/ui/Alert";
import { useNavigate } from "react-router-dom";

const AdminDashboardPage = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const [users, setUsers] = useState([]);
  const [reports, setReports] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [loadingReports, setLoadingReports] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  const allowedStatuses = ["pending", "under-investigation", "rejected", "resolved"];

  const fetchUsers = useCallback(async () => {
    setLoadingUsers(true);
    setError(null);
    try {
      const response = await getUsers();
      setUsers(response.data);
    } catch (err) {
      console.error("Failed to fetch users:", err);
      setError("Failed to fetch users. " + (err.response?.data?.detail || err.message));
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
      setError("Failed to fetch reports. " + (err.response?.data?.detail || err.message));
    } finally {
      setLoadingReports(false);
    }
  }, []);

  useEffect(() => {
    if (!isAuthenticated || !user?.is_admin) {
      navigate("/");
      return;
    }
    fetchUsers();
    fetchReports();
  }, [isAuthenticated, user, navigate, fetchUsers, fetchReports]);


  const handleDeleteUser = async (userId) => {
    if (!window.confirm("Are you sure you want to delete this user?")) {
      return;
    }
    try {
      await deleteUser(userId);
      setSuccessMessage("User deleted successfully!");
      fetchUsers();
    } catch (err) {
      console.error("Failed to delete user:", err);
      setError("Failed to delete user. " + (err.response?.data?.detail || err.message));
    }
  };

  const handleDeleteReport = async (reportId) => {
    if (!window.confirm("Are you sure you want to delete this report?")) {
      return;
    }
    try {
      await deleteReport(reportId);
      setSuccessMessage("Report deleted successfully!");
      fetchReports();
    } catch (err) {
      console.error("Failed to delete report:", err);
      setError("Failed to delete report. " + (err.response?.data?.detail || err.message));
    }
  };


  const handleStatusChange = async (reportId, newStatus) => {
    if (!window.confirm(`Are you sure you want to change this report's status to "${newStatus}"?`)) {
      return;
    }
    try {
      const response = await updateReportStatus(reportId, { status: newStatus });
      setSuccessMessage(`Report status updated to "${response.data.status}" successfully!`);
      setReports((prevReports) =>
        prevReports.map((report) =>
          report.id === reportId ? { ...report, status: response.data.status } : report
        )
      );
    } catch (err) {
      console.error("Failed to update report status:", err);
      setError("Failed to update report status. " + (err.response?.data?.detail || err.message));
    }
  };

  if (!isAuthenticated || !user?.is_admin) {
    return <div className="text-center py-8">Redirecting...</div>;
  }

  return (
    <div className="container mx-auto p-4 max-w-7xl">
      <h1 className="text-3xl font-bold mb-6 text-center">Admin Dashboard</h1>

      {successMessage && <Alert type="success" message={successMessage} onDismiss={() => setSuccessMessage(null)} />}
      {error && <Alert type="error" message={error} onDismiss={() => setError(null)} />}

      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-4">All Users</h2>
        {loadingUsers ? (
          <Spinner />
        ) : users.length === 0 ? (
          <p>No users found.</p>
        ) : (
          <div className="overflow-x-auto bg-white shadow rounded-lg">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Username</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Admin</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {users.map((u) => (
                  <tr key={u.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{u.id.substring(0, 8)}...</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{u.username}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{u.email}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{u.is_admin ? "Yes" : "No"}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      {u.id !== user.id && (
                        <button
                          onClick={() => handleDeleteUser(u.id)}
                          className="text-red-600 hover:text-red-900 ml-4"
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
        )} {/* <--- Corrected: Removed the extra semicolon and parenthesis */}
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-4">All Reports</h2>
        {loadingReports ? (
          <Spinner />
        ) : reports.length === 0 ? (
          <p>No reports found.</p>
        ) : (
          <div className="overflow-x-auto bg-white shadow rounded-lg">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Author</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created At</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {reports.map((report) => (
                  <tr key={report.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{report.id.substring(0, 8)}...</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{report.title}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {report.author ? report.author.username : 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{report.category}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{report.location}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <select
                        value={report.status}
                        onChange={(e) => handleStatusChange(report.id, e.target.value)}
                        className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                      >
                        {allowedStatuses.map((statusOption) => (
                          <option key={statusOption} value={statusOption}>
                            {statusOption.replace(/-/g, ' ').replace(/\b\w/g, s => s.toUpperCase())}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Date(report.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => handleDeleteReport(report.id)}
                          className="text-red-600 hover:text-red-900 ml-4"
                        >
                          Delete
                        </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
};

export default AdminDashboardPage;