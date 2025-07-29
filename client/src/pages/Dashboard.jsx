// src/pages/Dashboard.jsx
import { useEffect, useState } from "react";
import { fetchCurrentUser, fetchReports } from "../utils/api"; // Corrected import
import AdminDashboard from "./AdminDashboard";
import UserDashboard from "./UserDashboard";
import { Skeleton } from "../components/Skeleton";
import { AddPost } from "../components/AddPost";

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const getData = async () => {
      try {
        const profileRes = await fetchCurrentUser();
        setUser(profileRes.data);

        const reportsRes = await fetchReports();
        setReports(reportsRes.data || []);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };
    getData();
  }, []);

  const handlePostAdded = (newPost) => {
    setReports([newPost, ...reports]);
    setIsModalOpen(false);
  };

  if (loading) {
    return (
      <div className="p-4 md:p-6 max-w-4xl mx-auto">
        <Skeleton className="w-40 h-6 mb-6" />
        <Skeleton className="w-10 h-10 rounded-full mb-6" />
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="w-full h-24" />
          ))}
        </div>
      </div>
    );
  }

  if (!user) {
    return <div className="text-center mt-10">Loading...</div>;
  }

  return user.role === "admin" ? (
    <AdminDashboard user={user} />
  ) : (
    <div className="p-4 md:p-6 max-w-4xl mx-auto">
      <div className="flex flex-col md:flex-row items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">
          Welcome, {user.full_name || "User"}
        </h1>
        <img
          src={user.profile_picture || "/default-avatar.png"}
          alt="Profile"
          className="w-10 h-10 rounded-full"
        />
      </div>

      <button
        onClick={() => setIsModalOpen(true)}
        className="bg-blue-600 text-white px-4 py-2 rounded-md mb-4"
      >
        + Add Post
      </button>

      {reports.length === 0 ? (
        <p>No posts yet. Be the first to post!</p>
      ) : (
        <div className="space-y-4">
          {reports.map((report) => (
            <div
              key={report.id}
              className="bg-white shadow p-4 rounded-md border border-gray-200"
            >
              <h2 className="text-lg font-bold">{report.title}</h2>
              <p className="text-sm text-gray-600">{report.description}</p>
              <p className="text-xs text-gray-400">
                {report.location && `Location: ${report.location} `}
                {(report.latitude || report.longitude) &&
                  `Coords: (${report.latitude || "N/A"}, ${report.longitude || "N/A"}) `}
                Category: {report.category}
              </p>
              <p className="text-xs text-gray-400 mt-2">
                Posted on: {new Date(report.created_at).toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>
      )}

      <AddPost
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onPostAdded={handlePostAdded}
      />
    </div>
  );
}