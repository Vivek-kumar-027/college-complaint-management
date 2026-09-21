const express = require('express');
const router = express.Router();
const {
  getStats,
  getCategories,
  getDepartments,
} = require('../controllers/statsController');
const { protect } = require('../middleware/auth');

router.get('/stats', protect, getStats);
router.get('/categories', getCategories);
router.get('/departments', getDepartments);

module.exports = router;
