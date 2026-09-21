const mongoose = require('mongoose');

const CATEGORIES = [
  'Classroom',
  'Laboratory',
  'Hostel',
  'Wi-Fi',
  'Infrastructure',
  'Transportation',
  'Cleanliness',
  'Other',
];

const PRIORITIES = ['Low', 'Medium', 'High', 'Critical'];

const STATUSES = [
  'Submitted',
  'Under Review',
  'Assigned',
  'In Progress',
  'Resolved',
  'Closed',
];

const complaintSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    title: {
      type: String,
      required: [true, 'Complaint title is required'],
      trim: true,
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: CATEGORIES,
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true,
    },
    location: {
      type: String,
      required: [true, 'Location is required'],
      trim: true,
    },
    attachmentUrl: {
      type: String,
      default: '',
    },
    priority: {
      type: String,
      enum: PRIORITIES,
      default: 'Medium',
    },
    status: {
      type: String,
      enum: STATUSES,
      default: 'Submitted',
    },
    assignedDepartment: {
      type: String,
      default: '',
    },
    assignedStaff: {
      type: String,
      default: '',
    },
    resolutionDetails: {
      type: String,
      default: '',
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
      default: null,
    },
    feedback: {
      type: String,
      default: '',
    },
    resolvedAt: {
      type: Date,
      default: null,
    },
    closedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

complaintSchema.index({ student: 1, createdAt: -1 });
complaintSchema.index({ status: 1 });
complaintSchema.index({ category: 1 });
complaintSchema.index({ priority: 1 });

module.exports = {
  Complaint: mongoose.model('Complaint', complaintSchema),
  CATEGORIES,
  PRIORITIES,
  STATUSES,
};
