const { Complaint, CATEGORIES, PRIORITIES, STATUSES } = require('../models/Complaint');
const Comment = require('../models/Comment');

// @desc    Get all complaints (filtered by role)
// @route   GET /api/complaints
// @access  Private
const getComplaints = async (req, res, next) => {
  try {
    const { status, category, priority, department, search, sortBy, sortOrder } = req.query;

    const query = {};

    // Role-based filtering
    if (req.user.role === 'student') {
      query.student = req.user._id;
    }

    // Optional filters
    if (status && status !== 'all') {
      query.status = status;
    }
    if (category && category !== 'all') {
      query.category = category;
    }
    if (priority && priority !== 'all') {
      query.priority = priority;
    }
    if (department && department !== 'all') {
      query.assignedDepartment = department;
    }

    // Keyword search
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { location: { $regex: search, $options: 'i' } },
      ];
    }

    const sortField = sortBy || 'createdAt';
    const order = sortOrder === 'asc' ? 1 : -1;

    const complaints = await Complaint.find(query)
      .populate('student', 'name email studentId department')
      .sort({ [sortField]: order });

    res.json({
      success: true,
      count: complaints.length,
      complaints,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single complaint by ID
// @route   GET /api/complaints/:id
// @access  Private
const getComplaintById = async (req, res, next) => {
  try {
    const complaint = await Complaint.findById(req.params.id).populate(
      'student',
      'name email studentId department'
    );

    if (!complaint) {
      return res.status(404).json({
        success: false,
        message: 'Complaint not found',
      });
    }

    // Role protection: student can only view their own
    if (
      req.user.role === 'student' &&
      complaint.student._id.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to view this complaint',
      });
    }

    // Fetch comments log
    const comments = await Comment.find({ complaint: complaint._id })
      .populate('author', 'name email role')
      .sort({ createdAt: 1 });

    res.json({
      success: true,
      complaint,
      comments,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Submit a new complaint
// @route   POST /api/complaints
// @access  Private (Student)
const createComplaint = async (req, res, next) => {
  try {
    const { title, category, description, location, priority } = req.body;

    if (!title || !category || !description || !location) {
      return res.status(400).json({
        success: false,
        message: 'Please provide title, category, description, and location',
      });
    }

    let attachmentUrl = '';
    if (req.file) {
      attachmentUrl = `/uploads/${req.file.filename}`;
    }

    const complaint = await Complaint.create({
      student: req.user._id,
      title,
      category,
      description,
      location,
      attachmentUrl,
      priority: priority || 'Medium',
      status: 'Submitted',
    });

    // Auto-create initial lifecycle comment log
    await Comment.create({
      complaint: complaint._id,
      author: req.user._id,
      message: 'Complaint submitted by student',
      statusChange: 'Submitted',
    });

    const populatedComplaint = await Complaint.findById(complaint._id).populate(
      'student',
      'name email studentId department'
    );

    res.status(201).json({
      success: true,
      message: 'Complaint submitted successfully',
      complaint: populatedComplaint,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update complaint (status, priority, assignment, resolution)
// @route   PATCH /api/complaints/:id
// @access  Private (Admin)
const updateComplaint = async (req, res, next) => {
  try {
    const {
      status,
      priority,
      assignedDepartment,
      assignedStaff,
      resolutionDetails,
      commentMessage,
    } = req.body;

    const complaint = await Complaint.findById(req.params.id);
    if (!complaint) {
      return res.status(404).json({
        success: false,
        message: 'Complaint not found',
      });
    }

    let previousStatus = complaint.status;
    let statusChanged = false;

    if (status && status !== complaint.status) {
      if (!STATUSES.includes(status)) {
        return res.status(400).json({
          success: false,
          message: `Invalid status: ${status}. Must be one of ${STATUSES.join(', ')}`,
        });
      }
      complaint.status = status;
      statusChanged = true;

      if (status === 'Resolved' && !complaint.resolvedAt) {
        complaint.resolvedAt = new Date();
      }
      if (status === 'Closed' && !complaint.closedAt) {
        complaint.closedAt = new Date();
      }
    }

    if (priority) {
      if (!PRIORITIES.includes(priority)) {
        return res.status(400).json({
          success: false,
          message: `Invalid priority: ${priority}`,
        });
      }
      complaint.priority = priority;
    }

    if (assignedDepartment !== undefined) {
      complaint.assignedDepartment = assignedDepartment;
    }

    if (assignedStaff !== undefined) {
      complaint.assignedStaff = assignedStaff;
    }

    if (resolutionDetails !== undefined) {
      complaint.resolutionDetails = resolutionDetails;
    }

    await complaint.save();

    // Create comment log if status changed or comment provided
    if (statusChanged || commentMessage) {
      const logMessage =
        commentMessage ||
        (statusChanged
          ? `Status updated from "${previousStatus}" to "${complaint.status}"`
          : 'Complaint updated by administrator');

      await Comment.create({
        complaint: complaint._id,
        author: req.user._id,
        message: logMessage,
        statusChange: statusChanged ? complaint.status : null,
      });
    }

    const updated = await Complaint.findById(complaint._id).populate(
      'student',
      'name email studentId department'
    );

    res.json({
      success: true,
      message: 'Complaint updated successfully',
      complaint: updated,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Student rate and review resolved complaint
// @route   POST /api/complaints/:id/feedback
// @access  Private (Student)
const rateComplaint = async (req, res, next) => {
  try {
    const { rating, feedback } = req.body;

    const complaint = await Complaint.findById(req.params.id);
    if (!complaint) {
      return res.status(404).json({
        success: false,
        message: 'Complaint not found',
      });
    }

    if (complaint.student.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'You can only rate your own complaints',
      });
    }

    if (complaint.status !== 'Resolved' && complaint.status !== 'Closed') {
      return res.status(400).json({
        success: false,
        message: 'You can only rate a complaint that is Resolved or Closed',
      });
    }

    complaint.rating = Number(rating);
    complaint.feedback = feedback || '';
    complaint.status = 'Closed'; // Student feedback automatically marks closed
    if (!complaint.closedAt) {
      complaint.closedAt = new Date();
    }

    await complaint.save();

    await Comment.create({
      complaint: complaint._id,
      author: req.user._id,
      message: `Student provided rating: ${rating}/5 stars. Feedback: "${feedback || 'No additional comment'}"`,
      statusChange: 'Closed',
    });

    res.json({
      success: true,
      message: 'Thank you for your feedback! The complaint is now closed.',
      complaint,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete complaint
// @route   DELETE /api/complaints/:id
// @access  Private (Admin or Owning Student if Submitted)
const deleteComplaint = async (req, res, next) => {
  try {
    const complaint = await Complaint.findById(req.params.id);
    if (!complaint) {
      return res.status(404).json({
        success: false,
        message: 'Complaint not found',
      });
    }

    if (
      req.user.role !== 'admin' &&
      (complaint.student.toString() !== req.user._id.toString() ||
        complaint.status !== 'Submitted')
    ) {
      return res.status(403).json({
        success: false,
        message:
          'Students can only delete their own complaints while still in Submitted status',
      });
    }

    await Comment.deleteMany({ complaint: complaint._id });
    await complaint.deleteOne();

    res.json({
      success: true,
      message: 'Complaint removed successfully',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getComplaints,
  getComplaintById,
  createComplaint,
  updateComplaint,
  rateComplaint,
  deleteComplaint,
};
