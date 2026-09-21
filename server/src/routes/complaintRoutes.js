const express = require('express');
const router = express.Router();
const {
  getComplaints,
  getComplaintById,
  createComplaint,
  updateComplaint,
  rateComplaint,
  deleteComplaint,
} = require('../controllers/complaintController');
const { getComments, addComment } = require('../controllers/commentController');
const { protect, requireRole } = require('../middleware/auth');
const upload = require('../middleware/upload');

router.use(protect); // All complaint routes require login

router.route('/')
  .get(getComplaints)
  .post(upload.single('attachment'), createComplaint);

router.route('/:id')
  .get(getComplaintById)
  .patch(requireRole('admin'), updateComplaint)
  .delete(deleteComplaint);

router.post('/:id/feedback', rateComplaint);

// Comments subroutes
router.route('/:id/comments')
  .get(getComments)
  .post(addComment);

module.exports = router;
