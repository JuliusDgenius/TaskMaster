// Define User Model
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
	username: { type: String, required: true, unique: true },
	email: {type: String, required: true, unique: true},
	password: {type: String, required: true},
	profilePicture: { type: String, default: 'assets/profile_pics/default.jpg' }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);