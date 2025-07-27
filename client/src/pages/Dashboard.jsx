// src/pages/Dashboard.jsx
import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { fetchReports, fetchCurrentUser } from '../utils/api';
import { Skeleton } from '../components/Skeleton';
import { AddPost } from '../components/AddPost';

const Dashboard = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const getData = async () => {
      try {
        const profileRes = await fetchCurrentUser();
        setProfile(profileRes.data);

        const reportsRes = await fetchReports();
        setReports(reportsRes.data);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
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

  return (
    <div className="p-4 md:p-6 max-w-4xl mx-auto">
      <div className="flex flex-col md:flex-row items-center justify-between mb-6">
        {loading ? (
          <Skeleton className="w-40 h-6" />
        ) : (
          <h1 className="text-2xl font-semibold">
            Welcome, {profile?.full_name || 'User'}
          </h1>
        )}

        {loading ? (
          <Skeleton className="w-10 h-10 rounded-full" />
        ) : (
          <img
            src={profile?.profile_picture || '/default-avatar.png'}
            alt="Profile"
            className="w-10 h-10 rounded-full"
          />
        )}
      </div>

      <button
        onClick={() => setIsModalOpen(true)}
        className="bg-blue-600 text-white px-4 py-2 rounded-md mb-4"
      >
        + Add Post
      </button>

      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="w-full h-24" />
          ))}
        </div>
      ) : reports.length === 0 ? (
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
              <p className="text-xs text-gray-400 mt-2">
                Posted on: {new Date(report.created_at).toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>
      )}

      <AddPost isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onPostAdded={handlePostAdded} />
    </div>
  );
};

export default Dashboard;
