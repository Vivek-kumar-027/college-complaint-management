require('dotenv').config({ path: require('path').join(__dirname, '../../.env') });
const mongoose = require('mongoose');
const User = require('../models/User');

const viewUsers = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/college_complaint_db';
    await mongoose.connect(mongoUri);

    const users = await User.find({}, '-passwordHash').sort({ createdAt: 1 });

    console.log('\n================ REGISTERED USERS ================\n');
    console.table(
      users.map((u) => ({
        ID: u._id.toString(),
        Name: u.name,
        Email: u.email,
        Role: u.role.toUpperCase(),
        StudentID: u.studentId || 'N/A',
        Department: u.department || 'N/A',
      }))
    );
    console.log('==================================================\n');

    process.exit(0);
  } catch (error) {
    console.error('Error fetching users:', error.message);
    process.exit(1);
  }
};

viewUsers();
