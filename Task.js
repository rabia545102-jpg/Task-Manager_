const mongoose = require('mongoose');

const TaskSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      maxlength: [120, 'Title cannot exceed 120 characters'],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [1000, 'Description cannot exceed 1000 characters'],
      default: '',
    },
    priority: {
      type: String,
      enum: ['low', 'medium', 'high'],
      default: 'medium',
    },
    dueDate: {
      type: Date,
      default: null,
    },
    completed: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// Helpful compound index for the common "my tasks, newest first" query
TaskSchema.index({ user: 1, createdAt: -1 });

module.exports = mongoose.model('Task', TaskSchema);
