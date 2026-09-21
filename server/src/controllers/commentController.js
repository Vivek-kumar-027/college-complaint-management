const Comment = require('../models/Comment');
const { Complaint } = require('../models/Complaint');

// @desc    Get all comments for a complaint
// @route   GET /api/complaints/:id/comments
// @access  Private
const getComments = async (req, res, next) => {
  try {
    const complaint = await Complaint.findById(req.params.id);
    if (!complaint) {
      return res.status(404).json({
        success: false,
        message: 'Complaint not found',
      });
    }

    if (
      req.user.role === 'student' &&
      complaint.student.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view comments for this complaint',
      });
    }

    const comments = await Comment.find({ complaint: req.params.id })
      .populate('author', 'name email role')
      .sort({ createdAt: 1 });

    res.json({
      success: true,
      comments,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Add a comment to a complaint
// @route   POST /api/complaints/:id/comments
// @access  Private
const addComment = async (req, res, next) => {
  try {
    const { message, statusChange } = req.body;

    if (!message) {
      return res.status(400).json({
        success: false,
        message: 'Please provide comment text',
      });
    }

    const complaint = await Complaint.findById(req.params.id);
    if (!complaint) {
      return res.status(404).json({
        success: false,
        message: 'Complaint not found',
      });
    }

    // Role check: student can only comment on own complaint
    if (
      req.user.role === 'student' &&
      complaint.student.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to comment on this complaint',
      });
    }

    // If admin provided statusChange along with comment
    if (statusChange && req.user.role === 'admin') {
      complaint.status = statusChange;
      if (statusChange === 'Resolved' && !complaint.resolvedAt) {
        complaint.resolvedAt = new Date();
      }
      if (statusChange === 'Closed' && !complaint.closedAt) {
        complaint.closedAt = new Date();
      }
      await complaint.save();
    }

    const comment = await Comment.create({
      complaint: complaint._id,
      author: req.user._id,
      message,
      statusChange: statusChange || null,
    });

    const populatedComment = await Comment.findById(comment._id).populate(
      'author',
      'name email role'
    );

    res.status(201).json({
      success: true,
      comment: populatedComment,
      currentStatus: complaint.status,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getComments,
  addComment,
};
