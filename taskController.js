const Task = require('../models/Task');

// @route   POST /api/tasks
const createTask = async (req, res, next) => {
  try {
    const { title, description, priority, dueDate, completed } = req.body;
    const task = await Task.create({
      user: req.user._id,
      title,
      description,
      priority,
      dueDate: dueDate || null,
      completed: completed || false,
    });
    res.status(201).json({ success: true, message: 'Task created', data: { task } });
  } catch (error) {
    next(error);
  }
};

// @route   GET /api/tasks
// Supports: ?status=all|pending|completed  &search=text
//           &sortBy=newest|oldest|priority|dueDate
const getTasks = async (req, res, next) => {
  try {
    const { status = 'all', search = '', sortBy = 'newest' } = req.query;

    const query = { user: req.user._id };

    if (status === 'pending') query.completed = false;
    if (status === 'completed') query.completed = true;

    if (search && search.trim()) {
      const regex = new RegExp(search.trim(), 'i');
      query.$or = [{ title: regex }, { description: regex }];
    }

    let sort = { createdAt: -1 }; // newest first (default)
    if (sortBy === 'oldest') sort = { createdAt: 1 };
    if (sortBy === 'priority') sort = { priority: -1, createdAt: -1 }; // note: string sort, see caveat below
    if (sortBy === 'dueDate') sort = { dueDate: 1, createdAt: -1 };

    let tasks = await Task.find(query).sort(sort).lean();

    // Priority is stored as a string (low/medium/high) so Mongo's default
    // string sort would be alphabetical, not severity order. Re-sort in
    // memory using an explicit rank when the user asked for priority sort.
    if (sortBy === 'priority') {
      const rank = { high: 3, medium: 2, low: 1 };
      tasks = tasks.sort((a, b) => rank[b.priority] - rank[a.priority]);
    }

    res.status(200).json({ success: true, count: tasks.length, data: { tasks } });
  } catch (error) {
    next(error);
  }
};

// @route   GET /api/tasks/stats
const getStats = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const now = new Date();

    const [total, completed, pending, overdue] = await Promise.all([
      Task.countDocuments({ user: userId }),
      Task.countDocuments({ user: userId, completed: true }),
      Task.countDocuments({ user: userId, completed: false }),
      Task.countDocuments({
        user: userId,
        completed: false,
        dueDate: { $ne: null, $lt: now },
      }),
    ]);

    res.status(200).json({ success: true, data: { total, completed, pending, overdue } });
  } catch (error) {
    next(error);
  }
};

// @route   GET /api/tasks/:id
const getTaskById = async (req, res, next) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, user: req.user._id });
    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found' });
    }
    res.status(200).json({ success: true, data: { task } });
  } catch (error) {
    next(error);
  }
};

// @route   PUT /api/tasks/:id
const updateTask = async (req, res, next) => {
  try {
    const { title, description, priority, dueDate, completed } = req.body;

    const task = await Task.findOne({ _id: req.params.id, user: req.user._id });
    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found' });
    }

    if (title !== undefined) task.title = title;
    if (description !== undefined) task.description = description;
    if (priority !== undefined) task.priority = priority;
    if (dueDate !== undefined) task.dueDate = dueDate || null;
    if (completed !== undefined) task.completed = completed;

    await task.save();

    res.status(200).json({ success: true, message: 'Task updated', data: { task } });
  } catch (error) {
    next(error);
  }
};

// @route   PATCH /api/tasks/:id/toggle
const toggleTask = async (req, res, next) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, user: req.user._id });
    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found' });
    }
    task.completed = !task.completed;
    await task.save();
    res.status(200).json({ success: true, message: 'Task status toggled', data: { task } });
  } catch (error) {
    next(error);
  }
};

// @route   DELETE /api/tasks/:id
const deleteTask = async (req, res, next) => {
  try {
    const task = await Task.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found' });
    }
    res.status(200).json({ success: true, message: 'Task deleted', data: { task } });
  } catch (error) {
    next(error);
  }
};

// @route   DELETE /api/tasks/completed/all
const deleteCompletedTasks = async (req, res, next) => {
  try {
    const result = await Task.deleteMany({ user: req.user._id, completed: true });
    res.status(200).json({
      success: true,
      message: `${result.deletedCount} completed task(s) deleted`,
      data: { deletedCount: result.deletedCount },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createTask,
  getTasks,
  getStats,
  getTaskById,
  updateTask,
  toggleTask,
  deleteTask,
  deleteCompletedTasks,
};
