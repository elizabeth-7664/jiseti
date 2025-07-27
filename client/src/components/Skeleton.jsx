export const Skeleton = ({ count = 3 }) => (
  <div className="space-y-4">
    {Array(count).fill(0).map((_, i) => (
      <div key={i} className="animate-pulse h-24 bg-gray-200 rounded-xl" />
    ))}
  </div>
);
