const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);

const projectSchema = new mongoose.Schema({
    project_id: { type: Number, unique: true }, // Unique project ID
    project_name: { type: String, required: true },
    project_description: { type: String, required: true },
    owner_id: { type: Number, ref: 'User', required: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

// Add auto-incrementing project_id
projectSchema.plugin(AutoIncrement, { inc_field: 'project_id', start_seq: 1 });

module.exports = mongoose.model('Project', projectSchema);
