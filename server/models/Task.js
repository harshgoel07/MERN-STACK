const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);

const taskSchema = new mongoose.Schema({
  task_id: {
    type: Number,
    unique: true
  },
  task_description: {
    type: String,
    required: true
  },
  task_dueDate: {
    type: Date,
    default: Date.now
  },
  task_status: {
    type: String,
    enum: ['new', 'in-progress', 'blocked', 'completed', 'not started'],
    default: 'not started'
  },
  owner_id: {
    type: Number,
    ref: 'User',
    required: true
  },
  project_id: {
    type: Number,
    ref: 'Project',
    required: true
  }
}, {
  timestamps: true
});

taskSchema.plugin(AutoIncrement, { inc_field: 'task_id', start_seq: 1 });

const Task = mongoose.model('Task', taskSchema);

module.exports = Task;
