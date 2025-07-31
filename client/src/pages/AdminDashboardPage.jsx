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
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-100 dark:bg-gray-950">
        <div className="text-center py-8 text-gray-900 dark:text-white">
          Redirecting...
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8 bg-gray-100 dark:bg-gray-950">
      <h1 className="text-3xl sm:text-4xl font-extrabold text-center text-gray-900 dark:text-white mb-10 tracking-tight font-serif">
        Admin Dashboard
      </h1>

      {successMessage && (
        <Alert
          type="success"
          message={successMessage}
          onDismiss={() => setSuccessMessage(null)}
          className="mb-6 p-3 rounded-lg bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400"
        />
      )}
      {error && (
        <Alert
          type="error"
          message={error}
          onDismiss={() => setError(null)}
          className="mb-6 p-3 rounded-lg bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400"
        />
      )}

      <section className="mb-12" aria-labelledby="users-heading">
        <h2
          id="users-heading"
          className="text-2xl sm:text-3xl font-semibold text-gray-800 dark:text-gray-200 mb-6 font-serif"
        >
          All Users
        </h2>
        {loadingUsers ? (
          <div className="flex justify-center">
            <Spinner className="h-8 w-8 text-blue-500" />
          </div>
        ) : users.length === 0 ? (
          <p className="text-center text-gray-600 dark:text-gray-400">
            No users found.
          </p>
        ) : (
          <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-2xl border border-gray-200/50 dark:border-gray-800/50 overflow-hidden transition-all duration-300">
            <div className="overflow-x-auto">
              <table
                className="min-w-full divide-y divide-gray-200 dark:divide-gray-700"
                aria-describedby="users-heading"
              >
                <thead className="bg-gray-50 dark:bg-gray-800">
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                    >
                      ID
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                    >
                      Username
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                    >
                      Email
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                    >
                      Admin
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-4 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                    >
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                  {users.map((u) => (
                    <tr
                      key={u.id}
                      className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-200"
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                        {u.id.substring(0, 8)}...
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                        {u.username}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                        {u.email}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                        {u.is_admin ? "Yes" : "No"}
                      </td>
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

      <section aria-labelledby="reports-heading">
        <h2
          id="reports-heading"
          className="text-2xl sm:text-3xl font-semibold text-gray-800 dark:text-gray-200 mb-6 font-serif"
        >
          All Reports
        </h2>
        {loadingReports ? (
          <div className="flex justify-center">
            <Spinner className="h-8 w-8 text-blue-500" />
          </div>
        ) : reports.length === 0 ? (
          <p className="text-center text-gray-600 dark:text-gray-400">
            No reports found.
          </p>
        ) : (
          <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-2xl border border-gray-200/50 dark:border-gray-800/50 overflow-hidden transition-all duration-300">
            <div className="overflow-x-auto">
              <table
                className="min-w-full divide-y divide-gray-200 dark:divide-gray-700"
                aria-describedby="reports-heading"
              >
                <thead className="bg-gray-50 dark:bg-gray-800">
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                    >
                      ID
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                    >
                      Title
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                    >
                      Author
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                    >
                      Category
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                    >
                      Location
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                    >
                      Status
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                    >
                      Created At
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-4 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                    >
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                  {reports.map((report) => (
                    <tr
                      key={report.id}
                      className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-200"
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                        {report.id.substring(0, 8)}...
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">
                        {report.title}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                        {report.author ? report.author.username : "N/A"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                        {report.category}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                        {report.location || "N/A"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                        <select
                          value={report.status}
                          onChange={(e) => handleStatusChange(report.id, e.target.value)}
                          className="block w-full px-4 py-2 text-base border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-gray-900 transition-colors duration-200"
                          aria-label={`Change status for report ${report.title}`}
                        >
                          {allowedStatuses.map((statusOption) => (
                            <option key={statusOption} value={statusOption}>
                              {statusOption.replace(/-/g, " ").replace(/\b\w/g, (s) => s.toUpperCase())}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                        {new Date(report.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => handleDeleteReport(report.id)}
                          className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 transition-colors duration-200"
                          aria-label={`Delete report ${report.title}`}
                        >
                          Delete
                        </button>
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
  );
};

export default AdminDashboardPage;