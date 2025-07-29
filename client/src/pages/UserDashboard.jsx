// src/pages/UserDashboard.jsx
import { useEffect, useState } from "react";
import { getUserRecords } from "../utils/api"; // Corrected
import ReportTable from "../components/ReportTable";
import RecordForm from "../components/RecordForm";

export default function UserDashboard({ user }) {
  const [records, setRecords] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (user?.id) {
      getUserRecords(user.id)
        .then((response) => setRecords(response.data || []))
        .catch((err) => {
          if (err.response?.status === 404) {
            setError("User records endpoint unavailable.");
          } else {
            setError("Failed to fetch user records");
          }
          console.error("Error fetching user records:", err);
        });
    }
  }, [user]);

  if (!user) return <div>Please sign in to view this page.</div>;
  if (error) return <div style={{ color: "red" }}>{error}</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-green-700 mb-4">Welcome, {user.name}</h1>
      <RecordForm
        onRecordAdded={() =>
          user?.id &&
          getUserRecords(user.id)
            .then((response) => setRecords(response.data || []))
            .catch((err) => console.error("Error refreshing records:", err))
        }
      />
      <ReportTable reports={records} />
    </div>
  );
}