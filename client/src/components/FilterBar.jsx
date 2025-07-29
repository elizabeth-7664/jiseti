// src/components/FilterBar.jsx
export default function FilterBar({ setFilters }) {
  const handleChange = (e) => {
    setFilters((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <div className="mb-4 flex flex-wrap gap-4">
      <input
        name="date"
        type="date"
        className="border p-2 rounded"
        onChange={handleChange}
      />
      <select name="urgency" className="border p-2 rounded" onChange={handleChange}>
        <option value="">All Urgencies</option>
        <option value="high">High</option>
        <option value="medium">Medium</option>
        <option value="low">Low</option>
      </select>
    </div>
  );
}
