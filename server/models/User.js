const mongoose = require('mongoose');
const { Schema } = mongoose;
const AutoIncrement = require('mongoose-sequence')(mongoose); // Make sure to install mongoose-sequence

const userSchema = new Schema({
    user_id: {
        type: Number, // Ensure user_id is of type Number
        unique: true
    },
    user_name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
      type: String,
      default: 'admin',
      enum: ['admin', 'user']
    }
});

// Add auto-incrementing user_id
userSchema.plugin(AutoIncrement, { inc_field: 'user_id' });

module.exports = mongoose.model('User', userSchema);
