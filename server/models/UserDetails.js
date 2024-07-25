const mongoose = require('mongoose');
const { Schema } = mongoose;
const AutoIncrement = require('mongoose-sequence')(mongoose);

const taskDescriptionSchema = new Schema({
  task_id: {
    type: Number,
    ref: 'Task',
    required: true
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
});

const projectDescriptionSchema = new Schema({
  project_id: {
    type: Number,
    ref: 'Project',
    required: true
  },
  project_name: {
    type: String,
    required: true
  },
  project_description: {
    type: String,
    required: true
  },
  owner_id: {
    type: Number,
    ref: 'User',
    required: true
  },
  TaskDescription: [taskDescriptionSchema]
});

const userDetailSchema = new Schema({
  user_detail_id: {
    type: Number,
    unique: true
  },
  user_id: {
    type: Number,
    ref: 'User',
    required: true
  },
  user_name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  role: {
    type: String,
    required: true
  },
  ProjectDescription: [projectDescriptionSchema]
});

userDetailSchema.plugin(AutoIncrement, { inc_field: 'user_detail_id', start_seq: 1 });

const UserDetails = mongoose.model('UserDetails', userDetailSchema);

module.exports = UserDetails;
