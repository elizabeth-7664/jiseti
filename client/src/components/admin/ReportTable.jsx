// src/components/ReportTable.jsx
import React from "react";
// Assuming these imports are correct based on your project structure
// import PostStatusBadge from "./PostStatusBadge"; // If needed here
// import Button from "./Button"; // If needed here
// import { Eye } from "lucide-react"; // If needed here

export default function ReportTable({ reports, users = [], isAdmin = false }) {
  // Defensive programming: Ensure reports is an array or default to empty array
  const reportsToDisplay = reports || [];

  // userMap should also be handled defensively, though 'users = []' already helps.
  // If users is truly an array of objects with 'id' and 'name' this is fine.
  const userMap = Object.fromEntries((users || []).map((u) => [u.id, u.name]));

  return (
    <table className="w-full border-collapse border text-sm">
      <thead className="bg-green-100 text-green-900">
        <tr>
          <th className="border p-2">Title</th>
          <th className="border p-2">Type</th>
          <th className="border p-2">Urgency</th>
          <th className="border p-2">Status</th>
          <th className="border p-2">Date</th>
          {isAdmin && <th className="border p-2">User</th>}
        </tr>
      </thead>
      <tbody>
        {reportsToDisplay.length === 0 ? ( // Optional: Add a message if no reports
          <tr>
            <td colSpan={isAdmin ? "6" : "5"} className="border p-2 text-center text-gray-500">
              No reports available.
            </td>
          </tr>
        ) : (
          // Use reportsToDisplay instead of reports directly
          reportsToDisplay.map((r) => (
            <tr key={r.id}>
              <td className="border p-2">{r.title}</td>
              <td className="border p-2 capitalize">{r.type}</td>
              <td className="border p-2 capitalize">{r.urgency}</td>
              <td className="border p-2 capitalize">{r.status}</td>
              <td className="border p-2">
                {new Date(r.created_at).toLocaleString()}
              </td>
              {isAdmin && (
                <td className="border p-2">{userMap[r.user_id] || "Unknown"}</td>
              )}
            </tr>
          ))
        )}
      </tbody>
    </table>
  );
}