import React, { useCallback, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import StatsBar from '../components/StatsBar.jsx';
import TaskToolbar from '../components/TaskToolbar.jsx';
import TaskList from '../components/TaskList.jsx';
import TaskFormModal from '../components/TaskFormModal.jsx';
import {
  getTasks,
  getStats,
  createTask,
  updateTask,
  toggleTask,
  deleteTask,
  deleteCompletedTasks,
} from '../services/taskService.js';
import { getErrorMessage } from '../utils/validators.js';

const Dashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [status, setStatus] = useState('all');
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('newest');

  const [modalOpen, setModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [taskList, statsData] = await Promise.all([
        getTasks({ status, search, sortBy }),
        getStats(),
      ]);
      setTasks(taskList);
      setStats(statsData);
    } catch (error) {
      toast.error(getErrorMessage(error, 'Failed to load tasks'));
    } finally {
      setLoading(false);
    }
  }, [status, search, sortBy]);

  useEffect(() => {
    // Debounce search so we don't fire a request on every keystroke
    const timeout = setTimeout(() => {
      loadData();
    }, 300);
    return () => clearTimeout(timeout);
  }, [loadData]);

  const refreshStats = async () => {
    try {
      setStats(await getStats());
    } catch {
      // stats refresh failing silently is acceptable; main list still updates
    }
  };

  const handleNewTask = () => {
    setEditingTask(null);
    setModalOpen(true);
  };

  const handleEditTask = (task) => {
    setEditingTask(task);
    setModalOpen(true);
  };

  const handleSubmitTask = async (formData) => {
    setSubmitting(true);
    try {
      if (editingTask) {
        await updateTask(editingTask._id, formData);
        toast.success('Task updated');
      } else {
        await createTask(formData);
        toast.success('Task created');
      }
      setModalOpen(false);
      await loadData();
    } catch (error) {
      toast.error(getErrorMessage(error, 'Failed to save task'));
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggle = async (id) => {
    // Optimistic update for a snappier feel
    setTasks((prev) => prev.map((t) => (t._id === id ? { ...t, completed: !t.completed } : t)));
    try {
      await toggleTask(id);
      await refreshStats();
    } catch (error) {
      toast.error(getErrorMessage(error, 'Failed to update task'));
      loadData();
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this task? This cannot be undone.')) return;
    try {
      await deleteTask(id);
      toast.success('Task deleted');
      setTasks((prev) => prev.filter((t) => t._id !== id));
      await refreshStats();
    } catch (error) {
      toast.error(getErrorMessage(error, 'Failed to delete task'));
    }
  };

  const handleDeleteCompleted = async () => {
    if (!window.confirm('Delete all completed tasks?')) return;
    try {
      const count = await deleteCompletedTasks();
      toast.success(`${count} completed task(s) deleted`);
      await loadData();
    } catch (error) {
      toast.error(getErrorMessage(error, 'Failed to delete completed tasks'));
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold mb-6">My Tasks</h1>

      <StatsBar stats={stats} />

      <TaskToolbar
        status={status}
        setStatus={setStatus}
        search={search}
        setSearch={setSearch}
        sortBy={sortBy}
        setSortBy={setSortBy}
        onNewTask={handleNewTask}
        onDeleteCompleted={handleDeleteCompleted}
      />

      <TaskList
        tasks={tasks}
        loading={loading}
        onToggle={handleToggle}
        onEdit={handleEditTask}
        onDelete={handleDelete}
      />

      <TaskFormModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleSubmitTask}
        initialData={editingTask}
        submitting={submitting}
      />
    </div>
  );
};

export default Dashboard;
