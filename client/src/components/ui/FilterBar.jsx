// src/components/ui/FilterBar.jsx
import React from "react";

export default function FilterBar({ filters, onChange }) {
  return (
    <div className="flex gap-4 flex-wrap p-4">
      <select
        value={filters.type}
        onChange={(e) => onChange({ ...filters, type: e.target.value })}
        className="border px-3 py-2 rounded-md"
      >
        <option value="">All Types</option>
        <option value="red-flag">Red Flag</option>
        <option value="intervention">Intervention</option>
      </select>

      <select
        value={filters.status}
        onChange={(e) => onChange({ ...filters, status: e.target.value })}
        className="border px-3 py-2 rounded-md"
      >
        <option value="">All Status</option>
        <option value="draft">Draft</option>
        <option value="under investigation">Under Investigation</option>
        <option value="resolved">Resolved</option>
        <option value="rejected">Rejected</option>
      </select>

      <input
        type="text"
        placeholder="Search"
        value={filters.query}
        onChange={(e) => onChange({ ...filters, query: e.target.value })}
        className="border px-3 py-2 rounded-md w-64"
      />
    </div>
  );
}
