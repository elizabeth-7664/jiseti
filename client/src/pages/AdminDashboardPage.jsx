// src/pages/AdminDashboardPage.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import AdminPostTable from "../components/admin/AdminPostTable";
import ReportTable from "../components/admin/ReportTable";
import Loader from "../components/shared/Loader";
// --- CRITICAL CHANGE HERE ---
// Now we only need getReports and getUsers (assuming allUsers are separate)
import { getReports, getUsers } from "../utils/api"; // <--- Updated imports
// --- END CRITICAL CHANGE ---

export default function AdminDashboardPage() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  const [allReportsForPostsTable, setAllReportsForPostsTable] = useState([]); // Renamed for clarity
  const [flaggedReports, setFlaggedReports] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [dataLoading, setDataLoading] = useState(true);
  const [dataError, setDataError] = useState(null);

  useEffect(() => {
    if (!authLoading) {
      if (!user || !user.is_admin) {
        navigate("/unauthorized");
      } else {
        const fetchDashboardData = async () => {
          setDataLoading(true);
          setDataError(null);
          try {
            // Fetch all reports for the "All Posts" table (since posts are reports)
            const allReportsRes = await getReports(); // <--- Call getReports for posts data
            setAllReportsForPostsTable(allReportsRes.data);

            // Fetch flagged reports (assuming getReports fetches all, and you filter for flagged)
            // If your getReports API can filter, you might pass a parameter here.
            // For now, let's assume getReports gets everything, and ReportTable gets the same data.
            // If you need *only* flagged reports, your backend's getReports might need a query param.
            setFlaggedReports(allReportsRes.data.filter(report => report.status !== 'resolved' && report.status !== 'rejected')); // Example filter for flagged reports

            // Fetch all users for the ReportTable
            const usersRes = await getUsers();
            setAllUsers(usersRes.data);

          } catch (err) {
            console.error("Failed to fetch admin dashboard data:", err);
            setDataError("Failed to load dashboard data. Please try again.");
          } finally {
            setDataLoading(false);
          }
        };

        fetchDashboardData();
      }
    }
  }, [user, navigate, authLoading]);

  if (authLoading || dataLoading) {
    return <Loader />;
  }

  if (dataError) {
    return <div className="text-red-500 p-4 text-center">{dataError}</div>;
  }

  return (
    <div className="min-h-screen px-4 py-10 bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>

        <section className="mb-10">
          <h2 className="text-xl font-semibold mb-4">All Posts (All Reports)</h2>
          <AdminPostTable
            posts={allReportsForPostsTable} // Pass all reports here
            onView={(report) => navigate(`/admin/reports/${report.id}`)} // Navigate to report review page
          />
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4">Flagged Reports</h2>
          <ReportTable
            reports={flaggedReports} // Pass filtered or specific flagged reports
            users={allUsers}
            isAdmin={user?.is_admin}
          />
        </section>
      </div>
    </div>
  );
}