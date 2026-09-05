const express = require('express');
const router = express.Router();
const {
  createTask,
  getTasks,
  getStats,
  getTaskById,
  updateTask,
  toggleTask,
  deleteTask,
  deleteCompletedTasks,
} = require('../controllers/taskController');
const { protect } = require('../middleware/auth');
const { taskValidation } = require('../middleware/validate');

// All task routes require a valid JWT
router.use(protect);

// Specific/static routes must be declared BEFORE the "/:id" dynamic route,
// otherwise Express would try to match "stats" or "completed" as an :id.
router.get('/stats', getStats);
router.delete('/completed/all', deleteCompletedTasks);

router.route('/')
  .get(getTasks)
  .post(taskValidation, createTask);

router.route('/:id')
  .get(getTaskById)
  .put(taskValidation, updateTask)
  .delete(deleteTask);

router.patch('/:id/toggle', toggleTask);

module.exports = router;
