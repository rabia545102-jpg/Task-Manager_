import React from 'react';

const StatCard = ({ label, value, colorClass }) => (
  <div className="card p-4 flex flex-col items-center">
    <span className={`text-2xl font-bold ${colorClass}`}>{value}</span>
    <span className="text-xs text-gray-500 mt-1">{label}</span>
  </div>
);

const StatsBar = ({ stats }) => {
  if (!stats) return null;
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
      <StatCard label="Total" value={stats.total} colorClass="text-gray-800" />
      <StatCard label="Completed" value={stats.completed} colorClass="text-green-600" />
      <StatCard label="Pending" value={stats.pending} colorClass="text-amber-600" />
      <StatCard label="Overdue" value={stats.overdue} colorClass="text-red-600" />
    </div>
  );
};

export default StatsBar;
