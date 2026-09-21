import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/client';
import {
  ArrowLeft,
  Upload,
  AlertCircle,
  FileText,
  MapPin,
  Tag,
  Check,
  X,
  Image as ImageIcon,
} from 'lucide-react';

export default function SubmitComplaint() {
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);
  const [priorities, setPriorities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    title: '',
    category: 'Classroom',
    location: '',
    priority: 'Medium',
    description: '',
  });

  const [file, setFile] = useState(null);
  const [filePreview, setFilePreview] = useState(null);

  useEffect(() => {
    const fetchMetadata = async () => {
      try {
        const res = await api.get('/categories');
        setCategories(res.data.categories || []);
        setPriorities(res.data.priorities || ['Low', 'Medium', 'High', 'Critical']);
        if (res.data.categories?.length > 0) {
          setFormData((prev) => ({ ...prev, category: res.data.categories[0] }));
        }
      } catch (err) {
        console.error('Failed to load categories', err);
      }
    };
    fetchMetadata();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      if (selectedFile.size > 5 * 1024 * 1024) {
        setError('Attachment size exceeds 5MB limit.');
        return;
      }
      setFile(selectedFile);
      if (selectedFile.type.startsWith('image/')) {
        setFilePreview(URL.createObjectURL(selectedFile));
      } else {
        setFilePreview(null);
      }
    }
  };

  const removeFile = () => {
    setFile(null);
    setFilePreview(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const data = new FormData();
      data.append('title', formData.title);
      data.append('category', formData.category);
      data.append('location', formData.location);
      data.append('priority', formData.priority);
      data.append('description', formData.description);
      if (file) {
        data.append('attachment', file);
      }

      const res = await api.post('/complaints', data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      navigate(`/complaints/${res.data.complaint._id}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit complaint. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      <Link
        to="/"
        className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-slate-800 transition-colors uppercase tracking-wider"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Dashboard
      </Link>

      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-6">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Submit a Campus Complaint
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Provide comprehensive information so our facility administrators can route and fix the issue promptly.
          </p>
        </div>

        {error && (
          <div className="flex items-center gap-2 p-3 text-xs font-semibold text-rose-700 bg-rose-50 border border-rose-200 rounded-xl">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Complaint Title */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Complaint Title *
            </label>
            <div className="relative">
              <FileText className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                required
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="e.g., Wi-Fi network down in Block C 3rd Floor"
                className="w-full pl-10 pr-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 font-medium"
              />
            </div>
          </div>

          {/* Category & Priority */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Category *
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full px-3 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 font-medium text-slate-700"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Urgency / Priority
              </label>
              <select
                name="priority"
                value={formData.priority}
                onChange={handleChange}
                className="w-full px-3 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 font-medium text-slate-700"
              >
                {priorities.map((prio) => (
                  <option key={prio} value={prio}>
                    {prio} {prio === 'Critical' ? '(High Urgency / Safety Hazard)' : ''}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Specific Location */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Exact Location *
            </label>
            <div className="relative">
              <MapPin className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                required
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="e.g., Boys Hostel Block B, 2nd Floor, Room 204 or Main Library 1st Floor"
                className="w-full pl-10 pr-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 font-medium"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Detailed Description *
            </label>
            <textarea
              required
              rows={4}
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe the issue clearly, when it started happening, and how it impacts classes or students..."
              className="w-full p-3.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 font-medium leading-relaxed"
            />
          </div>

          {/* File Attachment Upload */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Attachment / Image (Optional, max 5MB)
            </label>

            {!file ? (
              <label className="border-2 border-dashed border-slate-200 hover:border-sky-400 rounded-2xl p-6 flex flex-col items-center justify-center cursor-pointer transition-colors bg-slate-50/50 hover:bg-sky-50/30">
                <Upload className="w-7 h-7 text-sky-600 mb-2" />
                <span className="text-sm font-semibold text-slate-700">
                  Click to upload photo or document
                </span>
                <span className="text-xs text-slate-400 mt-0.5">
                  Supports PNG, JPG, WEBP, or PDF
                </span>
                <input
                  type="file"
                  onChange={handleFileChange}
                  accept="image/*,.pdf"
                  className="hidden"
                />
              </label>
            ) : (
              <div className="flex items-center justify-between p-3 bg-sky-50/60 border border-sky-200 rounded-2xl">
                <div className="flex items-center gap-3">
                  {filePreview ? (
                    <img
                      src={filePreview}
                      alt="Preview"
                      className="w-12 h-12 object-cover rounded-xl border border-sky-200"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-xl bg-sky-100 flex items-center justify-center text-sky-700">
                      <FileText className="w-6 h-6" />
                    </div>
                  )}
                  <div>
                    <p className="text-xs font-bold text-slate-800 truncate max-w-[240px]">
                      {file.name}
                    </p>
                    <p className="text-[11px] text-slate-500">
                      {(file.size / (1024 * 1024)).toFixed(2)} MB
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={removeFile}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-4 rounded-2xl text-sm font-bold text-white bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-700 hover:to-indigo-700 shadow-md shadow-sky-500/20 transition-all disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Submitting Complaint...
                </>
              ) : (
                'Submit Complaint'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
