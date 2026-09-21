const express = require('express');
const router = express.Router();
const {
  register,
  login,
  getMe,
  createStudentByAdmin,
  getAllStudents,
  deleteStudent,
} = require('../controllers/authController');
const { protect, requireRole } = require('../middleware/auth');

router.post('/register', register);
router.post('/login', login);
router.get('/me', protect, getMe);

// Admin-only student management
router.get('/admin/students', protect, requireRole('admin'), getAllStudents);
router.post('/admin/create-user', protect, requireRole('admin'), createStudentByAdmin);
router.delete('/admin/students/:id', protect, requireRole('admin'), deleteStudent);

module.exports = router;
