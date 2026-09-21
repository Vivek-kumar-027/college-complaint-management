require('dotenv').config({ path: require('path').join(__dirname, '../../.env') });
const mongoose = require('mongoose');
const User = require('../models/User');
const { Complaint } = require('../models/Complaint');
const Comment = require('../models/Comment');
const Department = require('../models/Department');

const seedData = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/college_complaint_db';
    console.log(`Connecting to MongoDB at: ${mongoUri}`);
    await mongoose.connect(mongoUri);

    console.log('Clearing existing data...');
    await User.deleteMany({});
    await Complaint.deleteMany({});
    await Comment.deleteMany({});
    await Department.deleteMany({});

    console.log('Seeding Departments...');
    const departments = await Department.insertMany([
      { name: 'Hostel Administration', description: 'Hostel rooms, mess, plumbing, electricity in hostels', headEmail: 'hostel.admin@college.edu' },
      { name: 'IT & Wi-Fi Support', description: 'Campus Wi-Fi, computer labs, server access, portal bugs', headEmail: 'it.support@college.edu' },
      { name: 'Estate & Infrastructure', description: 'Civil repairs, classroom furniture, campus electricals, water supply', headEmail: 'estate@college.edu' },
      { name: 'Transport Wing', description: 'College buses, routes, parking, transit schedules', headEmail: 'transport@college.edu' },
      { name: 'Campus Sanitation & Housekeeping', description: 'Washrooms, campus hygiene, waste management', headEmail: 'sanitation@college.edu' },
      { name: 'Academic Facilities', description: 'Lecture hall projectors, smartboards, departmental laboratories', headEmail: 'academics@college.edu' },
    ]);

    console.log('Seeding Users...');
    // Create users individually so the pre-save bcrypt hook fires
    const admin = await User.create({
      name: 'Campus Administrator',
      email: 'admin@college.edu',
      passwordHash: 'Admin@123',
      role: 'admin',
      department: 'Central Administration',
    });

    const student1 = await User.create({
      name: 'Aarav Sharma',
      email: 'student@college.edu',
      passwordHash: 'Student@123',
      role: 'student',
      studentId: 'CS-2024-042',
      department: 'Computer Science',
    });

    const student2 = await User.create({
      name: 'Priya Patel',
      email: 'priya@college.edu',
      passwordHash: 'Student@123',
      role: 'student',
      studentId: 'EC-2024-108',
      department: 'Electronics & Communication',
    });

    const student3 = await User.create({
      name: 'Rohit Verma',
      email: 'rohit@college.edu',
      passwordHash: 'Student@123',
      role: 'student',
      studentId: 'ME-2024-019',
      department: 'Mechanical Engineering',
    });

    console.log('Seeding Complaints & Activity Logs...');

    // 1. Submitted
    const c1 = await Complaint.create({
      student: student1._id,
      title: 'High-speed Wi-Fi dropping frequently in Academic Block C',
      category: 'Wi-Fi',
      description: 'The Wi-Fi access point in 3rd floor Block C loses internet connectivity every 10-15 minutes, affecting students during coding labs.',
      location: 'Block C, 3rd Floor, Room 304 corridor',
      priority: 'High',
      status: 'Submitted',
    });
    await Comment.create({
      complaint: c1._id,
      author: student1._id,
      message: 'Complaint submitted by student',
      statusChange: 'Submitted',
    });

    // 2. Under Review
    const c2 = await Complaint.create({
      student: student2._id,
      title: 'Projector display flickering intermittently in LH-204',
      category: 'Classroom',
      description: 'The overhead HDMI projector turns pinkish and shuts off during afternoon lectures. Needs bulb replacement or cable check.',
      location: 'Lecture Hall Complex, LH-204',
      priority: 'Medium',
      status: 'Under Review',
    });
    await Comment.create({
      complaint: c2._id,
      author: student2._id,
      message: 'Complaint submitted by student',
      statusChange: 'Submitted',
    });
    await Comment.create({
      complaint: c2._id,
      author: admin._id,
      message: 'Admin acknowledged the issue and is reviewing technician availability for Lecture Hall complex.',
      statusChange: 'Under Review',
    });

    // 3. Assigned
    const c3 = await Complaint.create({
      student: student1._id,
      title: 'Geyser / Water heater not heating in Hostel Block B',
      category: 'Hostel',
      description: 'The common bathroom geyser on 2nd floor East wing is tripping the circuit breaker immediately upon turning on.',
      location: 'Boys Hostel B, 2nd Floor Washroom East Wing',
      priority: 'High',
      status: 'Assigned',
      assignedDepartment: 'Hostel Administration',
      assignedStaff: 'Mr. Rajesh Kumar (Hostel Maintenance)',
    });
    await Comment.create({
      complaint: c3._id,
      author: student1._id,
      message: 'Complaint submitted by student',
      statusChange: 'Submitted',
    });
    await Comment.create({
      complaint: c3._id,
      author: admin._id,
      message: 'Assigned complaint to Hostel Administration maintenance team.',
      statusChange: 'Assigned',
    });

    // 4. In Progress
    const c4 = await Complaint.create({
      student: student3._id,
      title: 'Power spike damaging test equipment in Digital Electronics Lab 3',
      category: 'Laboratory',
      description: 'Multiple benches in Lab 3 experienced voltage spikes this morning, causing digital oscilloscopes to reset unexpectedly.',
      location: 'Department of Electrical Engineering, Lab 3',
      priority: 'Critical',
      status: 'In Progress',
      assignedDepartment: 'Estate & Infrastructure',
      assignedStaff: 'Electrical Engineering Tech Unit',
    });
    await Comment.create({
      complaint: c4._id,
      author: student3._id,
      message: 'Complaint submitted by student with Critical urgency.',
      statusChange: 'Submitted',
    });
    await Comment.create({
      complaint: c4._id,
      author: admin._id,
      message: 'Escalated to Estate Electrical unit immediately. Replacement stabilizer dispatch ordered.',
      statusChange: 'In Progress',
    });
    await Comment.create({
      complaint: c4._id,
      author: admin._id,
      message: 'Technicians on site inspecting main MCB panel and installing line conditioner.',
    });

    // 5. Resolved
    const now = new Date();
    const c5 = await Complaint.create({
      student: student1._id,
      title: 'Water stagnation and clogged drainage near Cafeteria backyard',
      category: 'Cleanliness',
      description: 'Rainwater drain near the outdoor cafeteria seating is overflowing and creating foul odors.',
      location: 'Central Cafeteria, North Entrance',
      priority: 'Medium',
      status: 'Resolved',
      assignedDepartment: 'Campus Sanitation & Housekeeping',
      assignedStaff: 'Mr. Suresh (Sanitation Supervisor)',
      resolutionDetails: 'Drain pipe desilted and cleared of debris. Disinfectant spray applied across north entrance perimeter.',
      resolvedAt: new Date(now.getTime() - 2 * 60 * 60 * 1000), // 2 hours ago
    });
    await Comment.create({
      complaint: c5._id,
      author: student1._id,
      message: 'Complaint submitted by student',
      statusChange: 'Submitted',
    });
    await Comment.create({
      complaint: c5._id,
      author: admin._id,
      message: 'Assigned to Campus Sanitation team.',
      statusChange: 'Assigned',
    });
    await Comment.create({
      complaint: c5._id,
      author: admin._id,
      message: 'Issue resolved: Drain line completely cleared and sanitized.',
      statusChange: 'Resolved',
    });

    // 6. Closed
    const c6 = await Complaint.create({
      student: student2._id,
      title: 'Route 4 Morning Shuttle arriving 25 minutes late repeatedly',
      category: 'Transportation',
      description: 'Morning bus Route 4 (Indiranagar via Ring Road) has missed the 8:45 AM bell for three consecutive days.',
      location: 'College Bus Route #4',
      priority: 'Medium',
      status: 'Closed',
      assignedDepartment: 'Transport Wing',
      assignedStaff: 'Chief Transport Officer',
      resolutionDetails: 'Route departure shifted 15 minutes earlier from origin depot and alternate bypass road assigned during peak traffic.',
      rating: 5,
      feedback: 'The shuttle arrived right on schedule at 8:35 AM this week. Appreciate the swift fix!',
      resolvedAt: new Date(now.getTime() - 24 * 60 * 60 * 1000),
      closedAt: new Date(now.getTime() - 12 * 60 * 60 * 1000),
    });
    await Comment.create({
      complaint: c6._id,
      author: student2._id,
      message: 'Complaint submitted by student',
      statusChange: 'Submitted',
    });
    await Comment.create({
      complaint: c6._id,
      author: admin._id,
      message: 'Bus schedule adjusted with the fleet supervisor.',
      statusChange: 'Resolved',
    });
    await Comment.create({
      complaint: c6._id,
      author: student2._id,
      message: 'Student marked closed with 5-star rating: "The shuttle arrived right on schedule at 8:35 AM this week."',
      statusChange: 'Closed',
    });

    console.log('Seed completed successfully!');
    console.log('\n--- DEMO CREDENTIALS ---');
    console.log('Admin:   admin@college.edu   / Admin@123');
    console.log('Student: student@college.edu / Student@123');
    console.log('Student: priya@college.edu   / Student@123');
    console.log('Student: rohit@college.edu   / Student@123');
    console.log('------------------------\n');

    process.exit(0);
  } catch (error) {
    console.error('Seed error:', error);
    process.exit(1);
  }
};

seedData();
