const { Complaint, CATEGORIES, PRIORITIES, STATUSES } = require('../models/Complaint');
const Department = require('../models/Department');

// @desc    Get dashboard statistics and metrics
// @route   GET /api/stats
// @access  Private (Admin or summary for student)
const getStats = async (req, res, next) => {
  try {
    const filter = req.user.role === 'student' ? { student: req.user._id } : {};

    const total = await Complaint.countDocuments(filter);
    const submitted = await Complaint.countDocuments({ ...filter, status: 'Submitted' });
    const underReview = await Complaint.countDocuments({ ...filter, status: 'Under Review' });
    const assigned = await Complaint.countDocuments({ ...filter, status: 'Assigned' });
    const inProgress = await Complaint.countDocuments({ ...filter, status: 'In Progress' });
    const resolved = await Complaint.countDocuments({ ...filter, status: 'Resolved' });
    const closed = await Complaint.countDocuments({ ...filter, status: 'Closed' });

    const pending = submitted + underReview + assigned + inProgress;

    // Counts by category
    const categoryCounts = {};
    for (const cat of CATEGORIES) {
      categoryCounts[cat] = await Complaint.countDocuments({ ...filter, category: cat });
    }

    // Counts by priority
    const priorityCounts = {};
    for (const prio of PRIORITIES) {
      priorityCounts[prio] = await Complaint.countDocuments({ ...filter, priority: prio });
    }

    // Average resolution time (hours)
    const resolvedComplaints = await Complaint.find({
      ...filter,
      resolvedAt: { $ne: null },
    }).select('createdAt resolvedAt');

    let avgResolutionHours = 0;
    if (resolvedComplaints.length > 0) {
      const totalHours = resolvedComplaints.reduce((acc, curr) => {
        const diffMs = new Date(curr.resolvedAt) - new Date(curr.createdAt);
        return acc + Math.max(0, diffMs / (1000 * 60 * 60));
      }, 0);
      avgResolutionHours = (totalHours / resolvedComplaints.length).toFixed(1);
    }

    // Recent 5 complaints
    const recent = await Complaint.find(filter)
      .populate('student', 'name email')
      .sort({ createdAt: -1 })
      .limit(5);

    res.json({
      success: true,
      stats: {
        total,
        pending,
        resolved,
        closed,
        byStatus: {
          Submitted: submitted,
          'Under Review': underReview,
          Assigned: assigned,
          'In Progress': inProgress,
          Resolved: resolved,
          Closed: closed,
        },
        byCategory: categoryCounts,
        byPriority: priorityCounts,
        avgResolutionHours: Number(avgResolutionHours),
      },
      recent,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get system categories
// @route   GET /api/categories
// @access  Public
const getCategories = (req, res) => {
  res.json({
    success: true,
    categories: CATEGORIES,
    priorities: PRIORITIES,
    statuses: STATUSES,
  });
};

// @desc    Get departments list
// @route   GET /api/departments
// @access  Public
const getDepartments = async (req, res, next) => {
  try {
    let departments = await Department.find().sort({ name: 1 });
    if (departments.length === 0) {
      const defaultDepartments = [
        { name: 'Hostel Administration', description: 'Hostel maintenance, rooms, mess' },
        { name: 'IT & Wi-Fi Support', description: 'Campus networks, lab computers, portals' },
        { name: 'Estate & Infrastructure', description: 'Classrooms, plumbing, electrical, civil' },
        { name: 'Transport Wing', description: 'College buses and commute services' },
        { name: 'Campus Sanitation & Housekeeping', description: 'Cleanliness, washrooms, waste management' },
        { name: 'Academic Affairs', description: 'Lecture halls, library, departmental facilities' },
      ];
      departments = await Department.insertMany(defaultDepartments);
    }
    res.json({
      success: true,
      departments,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getStats,
  getCategories,
  getDepartments,
};
