import React from 'react';

const priorityStyles = {
  high: 'bg-red-100 text-red-700 border-red-200',
  medium: 'bg-amber-100 text-amber-700 border-amber-200',
  low: 'bg-green-100 text-green-700 border-green-200',
};

const formatDate = (dateStr) => {
  if (!dateStr) return null;
  return new Date(dateStr).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
};

const isOverdue = (task) => {
  if (task.completed || !task.dueDate) return false;
  return new Date(task.dueDate) < new Date();
};

const TaskCard = ({ task, onToggle, onEdit, onDelete }) => {
  const overdue = isOverdue(task);

  return (
    <div className={`card p-4 flex flex-col gap-2 border-l-4 ${overdue ? 'border-l-red-500' : 'border-l-brand-500'}`}>
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-start gap-3 flex-1 min-w-0">
          <input
            type="checkbox"
            checked={task.completed}
            onChange={() => onToggle(task._id)}
            className="mt-1 h-4 w-4 accent-brand-600 shrink-0"
          />
          <div className="min-w-0">
            <h3 className={`font-semibold break-words ${task.completed ? 'line-through text-gray-400' : 'text-gray-900'}`}>
              {task.title}
            </h3>
            {task.description && (
              <p className={`text-sm mt-1 break-words ${task.completed ? 'text-gray-400' : 'text-gray-600'}`}>
                {task.description}
              </p>
            )}
          </div>
        </div>
        <span className={`text-xs font-medium px-2 py-0.5 rounded-full border capitalize shrink-0 ${priorityStyles[task.priority]}`}>
          {task.priority}
        </span>
      </div>

      <div className="flex items-center justify-between mt-1">
        <div className="text-xs text-gray-500">
          {task.dueDate && (
            <span className={overdue ? 'text-red-600 font-medium' : ''}>
              Due {formatDate(task.dueDate)}{overdue ? ' · Overdue' : ''}
            </span>
          )}
        </div>
        <div className="flex gap-3">
          <button onClick={() => onEdit(task)} className="text-xs text-brand-600 hover:underline">
            Edit
          </button>
          <button onClick={() => onDelete(task._id)} className="text-xs text-red-600 hover:underline">
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaskCard;
