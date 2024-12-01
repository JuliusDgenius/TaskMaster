// MongoDB Database Module
const mongoose = require('mongoose')

const connectDB = async () => {
	try {
		await mongoose.connect(process.env.MONGODB_URI, {
			useNewURLParser: true,
			useUnifiedTopology: true,
		});
		console.log('MongoDB connected');
	} catch (error) {
		console.log(`MongoDB connection error: ${error}`);
		process.exit(1);
	}
}

module.exports = connectDB;
