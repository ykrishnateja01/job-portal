import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../Component/auth.jsx';

const PostJob = () => {
  const { user, loading: authLoading } = useAuth();
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Redirect non-admin users (after auth finishes loading)
  useEffect(() => {
    if (!authLoading && (!user || user.role !== 'admin')) {
      navigate('/');
    }
  }, [user, authLoading, navigate]);

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      // Gather and shape payload
      const payload = {
        title: data.title,
        company: data.company,
        location: data.location,
        type: data.type,
        requiredSkills: data.requiredSkills
          .split(',')
          .map(skill => ({ name: skill.trim() })),
        description: data.description,
        status: "active"
      };
      // Only add salary if at least one entry was given
      if (data.salaryMin || data.salaryMax) {
        payload.salary = {};
        if (data.salaryMin) payload.salary.min = Number(data.salaryMin);
        if (data.salaryMax) payload.salary.max = Number(data.salaryMax);
      }

      await axios.post('http://localhost:3000/api/jobs', payload);

      alert('Job posted successfully!');
      navigate('/jobs');
    } catch (error) {
      // Show main error message from backend if present
      const backendMsg =
        error.response?.data?.errors?.[0]?.msg ||
        error.response?.data?.message ||
        'Failed to post job.';
      alert(backendMsg);
    }
    setLoading(false);
  };

  if (authLoading || !user) return null;
  if (user.role !== 'admin') return null;

  return (
    <div className="max-w-3xl mx-auto p-8 bg-white rounded shadow-lg mt-10">
      <h1 className="text-3xl font-semibold mb-6">Post a Job (Admins Only)</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <label className="block mb-1 font-medium">Job Title</label>
          <input
            type="text"
            {...register('title', { required: "Job title is required", minLength: 3 })}
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>}
        </div>
        <div>
          <label className="block mb-1 font-medium">Company</label>
          <input
            type="text"
            {...register('company', { required: "Company is required", minLength: 2 })}
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.company && <p className="text-red-500 text-sm mt-1">{errors.company.message}</p>}
        </div>
        <div>
          <label className="block mb-1 font-medium">Location</label>
          <input
            type="text"
            {...register('location', { required: "Location is required", minLength: 2 })}
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.location && <p className="text-red-500 text-sm mt-1">{errors.location.message}</p>}
        </div>
        <div>
          <label className="block mb-1 font-medium">Job Type</label>
          <select
            {...register('type', { required: "Job type is required" })}
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select type</option>
            <option value="full-time">Full Time</option>
            <option value="part-time">Part Time</option>
            <option value="contract">Contract</option>
            <option value="freelance">Freelance</option>
            <option value="internship">Internship</option>
          </select>
          {errors.type && <p className="text-red-500 text-sm mt-1">{errors.type.message}</p>}
        </div>
        <div>
          <label className="block mb-1 font-medium">Salary Range (optional)</label>
          <div className="flex space-x-2">
            <input
              type="number"
              {...register('salaryMin')}
              placeholder="Min"
              className="flex-1 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="number"
              {...register('salaryMax')}
              placeholder="Max"
              className="flex-1 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
        <div>
          <label className="block mb-1 font-medium">Required Skills (comma separated)</label>
          <input
            type="text"
            {...register('requiredSkills', { required: "At least one skill is required" })}
            placeholder="JavaScript, React, Node.js"
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.requiredSkills && <p className="text-red-500 text-sm mt-1">{errors.requiredSkills.message}</p>}
        </div>
        <div>
          <label className="block mb-1 font-medium">Job Description</label>
          <textarea
            {...register('description', { required: "Description is required", minLength: 10 })}
            rows={6}
            className="w-full border border-gray-300 rounded px-3 py-2 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>}
        </div>
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? 'Posting...' : 'Post Job'}
        </button>
      </form>
    </div>
  );
};

export default PostJob;