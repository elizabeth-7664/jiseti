// src/pages/AdminDashboard.jsx
import { useEffect, useState } from "react";
import { fetchAllUsers } from "../utils/api";

export default function AdminDashboard({ user }) {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (user?.isAdmin) {
      fetchAllUsers()
        .then((response) => setUsers(response.data || []))
        .catch((err) => {
          if (err.response?.status === 404) setError("User list unavailable.");
          else setError("Failed to fetch users");
          console.error("Error fetching users:", err);
        });
    }
  }, [user]);

  if (!user) return <div>Please sign in.</div>;
  if (!user.isAdmin) return <div>Access denied. Admins only.</div>;
  if (error) return <div style={{ color: "red" }}>{error}</div>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Admin Dashboard</h2>
      <ul>
        {users.length > 0 ? (
          users.map((u) => <li key={u.id}>{u.username || u.email}</li>)
        ) : (
          <li>No users found.</li>
        )}
      </ul>
    </div>
  );
}