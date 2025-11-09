const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, trim: true },
  email: { type: String, required: true, lowercase: true, trim: true },
  password: { type: String, required: true },
  organization: { type: String, required: true },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
}, { timestamps: true });

// ✅ Composite index: unique for (email + organization)
userSchema.index({ email: 1, organization: 1 }, { unique: true });

module.exports = mongoose.model('User', userSchema);
