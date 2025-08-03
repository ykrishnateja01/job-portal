// src/pages/Jobs.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useQuery } from 'react-query';

const fetchJobs = async ({ queryKey }) => {
  const [_key, params] = queryKey;
  const { data } = await axios.get('http://localhost:3000/api/jobs', { params });
  return data;
};

const Jobs = () => {
  const [filters, setFilters] = useState({ search: '', location: '', type: '' });
  const [page, setPage] = useState(1);

  const { data, isLoading, error } = useQuery(['jobs', { ...filters, page }], fetchJobs, {
    keepPreviousData: true
  });

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-semibold mb-6">Job Listings</h1>

      <div className="mb-6 flex flex-col md:flex-row gap-4">
        <input
          type="text"
          placeholder="Search jobs..."
          value={filters.search}
          onChange={e => setFilters(prev => ({ ...prev, search: e.target.value }))}
          className="flex-1 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="text"
          placeholder="Location"
          value={filters.location}
          onChange={e => setFilters(prev => ({ ...prev, location: e.target.value }))}
          className="px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <select
          value={filters.type}
          onChange={e => setFilters(prev => ({ ...prev, type: e.target.value }))}
          className="px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">All Types</option>
          <option value="full-time">Full Time</option>
          <option value="part-time">Part Time</option>
          <option value="contract">Contract</option>
          <option value="freelance">Freelance</option>
          <option value="internship">Internship</option>
        </select>
      </div>

      {isLoading ? (
        <p>Loading jobs...</p>
      ) : error ? (
        <p>Error loading jobs.</p>
      ) : data?.jobs?.length === 0 ? (
        <p>No jobs found matching your criteria.</p>
      ) : (
        <ul className="space-y-4">
          {data.jobs.map(job => (
            <li key={job._id} className="p-4 bg-white rounded shadow hover:shadow-lg transition">
              <Link to={`/jobs/${job._id}`} className="block">
                <h2 className="text-xl font-semibold">{job.title}</h2>
                <p className="text-gray-600">{job.company} &bull; {job.location}</p>
                <p className="mt-2 text-gray-700 line-clamp-3">{job.description}</p>
              </Link>
            </li>
          ))}
        </ul>
      )}

      {data && data.totalPages > 1 && (
        <div className="flex justify-center mt-8 space-x-4">
          <button
            disabled={page <= 1}
            onClick={() => setPage(p => Math.max(1, p - 1))}
            className="px-4 py-2 border rounded disabled:opacity-50"
          >
            Previous
          </button>
          <span className="px-4 py-2">
            Page {page} of {data.totalPages}
          </span>
          <button
            disabled={page >= data.totalPages}
            onClick={() => setPage(p => Math.min(data.totalPages, p + 1))}
            className="px-4 py-2 border rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default Jobs;

