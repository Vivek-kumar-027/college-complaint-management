const jwt = require('jsonwebtoken');
const User = require('../models/User');

const generateToken = (id) => {
  return jwt.sign(
    { id },
    process.env.JWT_SECRET || 'campus_resolve_jwt_super_secret_key_2026',
    { expiresIn: '30d' }
  );
};

// @desc    Register a new user (Disabled: accounts are strictly provisioned by admin)
// @route   POST /api/auth/register
// @access  Restricted
const register = async (req, res, next) => {
  return res.status(403).json({
    success: false,
    message: 'Public student registration is disabled. Student accounts must be provisioned directly by the campus administrator.',
  });
};

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
// @access  Public
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password',
      });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    const token = generateToken(user._id);

    res.json({
      success: true,
      message: 'Login successful',
      token,
      user,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get current user profile
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res) => {
  res.json({
    success: true,
    user: req.user,
  });
};

// @desc    Admin create new student or staff account
// @route   POST /api/auth/admin/create-user
// @access  Private (Admin only)
const createStudentByAdmin = async (req, res, next) => {
  try {
    const { name, email, password, studentId, department, role = 'student' } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Name, email, and password are required',
      });
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'A user with this email address already exists',
      });
    }

    const user = await User.create({
      name,
      email: email.toLowerCase(),
      passwordHash: password,
      studentId: studentId || '',
      department: department || '',
      role: role === 'admin' ? 'admin' : 'student',
    });

    res.status(201).json({
      success: true,
      message: `${user.role === 'admin' ? 'Admin' : 'Student'} account for "${user.name}" created successfully!`,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        studentId: user.studentId,
        department: user.department,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all registered students
// @route   GET /api/auth/admin/students
// @access  Private (Admin only)
const getAllStudents = async (req, res, next) => {
  try {
    const students = await User.find({ role: 'student' })
      .select('-passwordHash')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: students.length,
      students,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a student account
// @route   DELETE /api/auth/admin/students/:id
// @access  Private (Admin only)
const deleteStudent = async (req, res, next) => {
  try {
    const student = await User.findOne({ _id: req.params.id, role: 'student' });
    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student account not found',
      });
    }

    await User.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: `Student account for "${student.name}" has been removed`,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  login,
  getMe,
  createStudentByAdmin,
  getAllStudents,
  deleteStudent,
};
