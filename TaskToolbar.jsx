import React from 'react';

const TaskToolbar = ({ status, setStatus, search, setSearch, sortBy, setSortBy, onNewTask, onDeleteCompleted }) => {
  return (
    <div className="card p-4 mb-6 flex flex-col gap-3">
      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
        <input
          type="text"
          className="input sm:flex-1"
          placeholder="Search by title or description..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select className="input sm:w-40" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
          <option value="newest">Newest</option>
          <option value="oldest">Oldest</option>
          <option value="priority">Priority</option>
          <option value="dueDate">Due Date</option>
        </select>
        <button className="btn-primary whitespace-nowrap" onClick={onNewTask}>
          + New Task
        </button>
      </div>

      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex gap-2">
          {['all', 'pending', 'completed'].map((s) => (
            <button
              key={s}
              onClick={() => setStatus(s)}
              className={`px-3 py-1.5 rounded-full text-sm font-medium capitalize transition-colors ${
                status === s ? 'bg-brand-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
        <button onClick={onDeleteCompleted} className="text-sm text-red-600 hover:underline">
          Clear completed
        </button>
      </div>
    </div>
  );
};

export default TaskToolbar;
