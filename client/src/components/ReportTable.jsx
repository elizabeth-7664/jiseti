// src/components/ReportTable.jsx
export default function ReportTable({ reports, users = [], isAdmin = false }) {
  const userMap = Object.fromEntries(users.map((u) => [u.id, u.name]));

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
        {reports.map((r) => (
          <tr key={r.id}>
            <td className="border p-2">{r.title}</td>
            <td className="border p-2 capitalize">{r.type}</td>
            <td className="border p-2 capitalize">{r.urgency}</td>
            <td className="border p-2 capitalize">{r.status}</td>
            <td className="border p-2">{new Date(r.created_at).toLocaleString()}</td>
            {isAdmin && <td className="border p-2">{userMap[r.user_id] || "Unknown"}</td>}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
