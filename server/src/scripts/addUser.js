require('dotenv').config({ path: require('path').join(__dirname, '../../.env') });
const mongoose = require('mongoose');
const readline = require('readline');
const User = require('../models/User');

const askQuestion = (query) => {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  return new Promise((resolve) =>
    rl.question(query, (ans) => {
      rl.close();
      resolve(ans.trim());
    })
  );
};

const run = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/college_complaint_db';
    console.log(`\nConnecting to: ${mongoUri.replace(/:([^:@]{3})[^:@]*@/, ':$1***@')}`);
    await mongoose.connect(mongoUri);

    const args = process.argv.slice(2);
    let name, email, password, role, studentId, department;

    if (args.length >= 3) {
      // Direct command-line argument mode
      [name, email, password, role = 'student', studentId = '', department = ''] = args;
    } else {
      // Interactive wizard mode
      console.log('\n================ CREATE NEW USER ================');
      name = await askQuestion('1. Enter Full Name: ');
      email = await askQuestion('2. Enter Email Address: ');
      password = await askQuestion('3. Enter Password: ');
      const roleInput = await askQuestion('4. Role (student/admin) [default: student]: ');
      role = roleInput.toLowerCase() === 'admin' ? 'admin' : 'student';

      if (role === 'student') {
        studentId = await askQuestion('5. Enter Student Roll / ID (e.g., CS-2024-050): ');
        department = await askQuestion('6. Enter Department (e.g., Computer Science): ');
      } else {
        department = await askQuestion('5. Enter Admin Department [default: Central Administration]: ');
        department = department || 'Central Administration';
        studentId = '';
      }
    }

    if (!name || !email || !password) {
      console.error('\n❌ Error: Name, email, and password are required.');
      process.exit(1);
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      console.error(`\n❌ Error: A user with email "${email}" already exists in the database.`);
      process.exit(1);
    }

    // Create user (User.create invokes the bcrypt pre-save hashing hook)
    const newUser = await User.create({
      name,
      email: email.toLowerCase(),
      passwordHash: password,
      role,
      studentId: studentId || '',
      department: department || '',
    });

    console.log('\n================ USER CREATED SUCCESSFULLY ================');
    console.log(`ID:         ${newUser._id}`);
    console.log(`Name:       ${newUser.name}`);
    console.log(`Email:      ${newUser.email}`);
    console.log(`Role:       ${newUser.role.toUpperCase()}`);
    if (newUser.studentId) console.log(`StudentID:  ${newUser.studentId}`);
    if (newUser.department) console.log(`Department: ${newUser.department}`);
    console.log('===========================================================\n');

    process.exit(0);
  } catch (error) {
    console.error('\n❌ Error creating user:', error.message);
    process.exit(1);
  }
};

run();
