import React, { useEffect, useState } from 'react';
import { validateTaskForm } from '../utils/validators.js';

const emptyForm = { title: '', description: '', priority: 'medium', dueDate: '' };

const TaskFormModal = ({ isOpen, onClose, onSubmit, initialData, submitting }) => {
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setForm({
          title: initialData.title || '',
          description: initialData.description || '',
          priority: initialData.priority || 'medium',
          dueDate: initialData.dueDate ? initialData.dueDate.slice(0, 10) : '',
        });
      } else {
        setForm(emptyForm);
      }
      setErrors({});
    }
  }, [isOpen, initialData]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: undefined });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validateTaskForm(form);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    onSubmit({ ...form, dueDate: form.dueDate || null });
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-20 px-4">
      <div className="card w-full max-w-md p-6">
        <h2 className="text-lg font-bold mb-4">{initialData ? 'Edit Task' : 'New Task'}</h2>
        <form onSubmit={handleSubmit} noValidate>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
            <input
              className={`input ${errors.title ? 'border-red-400 focus:ring-red-400' : ''}`}
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="e.g. Finish project report"
            />
            {errors.title && <p className="mt-1 text-xs text-red-600">{errors.title}</p>}
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              className="input"
              name="description"
              rows={3}
              value={form.description}
              onChange={handleChange}
              placeholder="Optional details..."
            />
          </div>

          <div className="grid grid-cols-2 gap-3 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
              <select className="input" name="priority" value={form.priority} onChange={handleChange}>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
              <input className="input" type="date" name="dueDate" value={form.dueDate} onChange={handleChange} />
            </div>
          </div>

          <div className="flex justify-end gap-3 mt-2">
            <button type="button" className="btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-primary" disabled={submitting}>
              {submitting ? 'Saving...' : initialData ? 'Save Changes' : 'Create Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskFormModal;
