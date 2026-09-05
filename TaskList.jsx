import React from 'react';
import TaskCard from './TaskCard.jsx';

const SkeletonCard = () => (
  <div className="card p-4 animate-pulse">
    <div className="h-4 bg-gray-200 rounded w-2/3 mb-2" />
    <div className="h-3 bg-gray-200 rounded w-1/2" />
  </div>
);

const TaskList = ({ tasks, loading, onToggle, onEdit, onDelete }) => {
  if (loading) {
    return (
      <div className="flex flex-col gap-3">
        {[...Array(4)].map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    );
  }

  if (!tasks || tasks.length === 0) {
    return (
      <div className="card p-10 text-center text-gray-500">
        <p className="text-lg font-medium mb-1">No tasks here</p>
        <p className="text-sm">Create a new task to get started.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {tasks.map((task) => (
        <TaskCard key={task._id} task={task} onToggle={onToggle} onEdit={onEdit} onDelete={onDelete} />
      ))}
    </div>
  );
};

export default TaskList;
