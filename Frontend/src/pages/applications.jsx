import React from 'react';
import axios from 'axios';
import { useQuery } from 'react-query';

const fetchApplications = async () => {
  const { data } = await axios.get('http://localhost:3000/api/jobs/user/applications');
  return data;
};

const statusStyles = {
  accepted: "bg-green-100 text-green-700",
  rejected: "bg-red-100 text-red-600",
  hired:   "bg-green-100 text-green-700",
  pending: "bg-yellow-100 text-yellow-700",
  shortlisted: "bg-blue-100 text-blue-600",
  reviewed: "bg-blue-100 text-blue-600",
  default: "bg-gray-200 text-gray-700",
};

function formatStatus(status) {
  if (!status) return 'Pending';
  return status.charAt(0).toUpperCase() + status.slice(1);
}

const Applications = () => {
  const { data, isLoading, error } = useQuery('applications', fetchApplications);

  if (isLoading) return <p className="text-center mt-20">Loading applications...</p>;
  if (error) return <p className="text-center mt-20 text-red-600">Failed to load applications.</p>;
  if (!data.length) return <p className="text-center mt-20">You have no applications yet.</p>;

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-semibold mb-6">Your Applications</h1>
      <ul className="space-y-6">
        {data.map(({ job, application }) => (
          <li key={job._id} className="p-6 bg-white rounded shadow hover:shadow-lg transition">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-2">
              <div>
                <h2 className="text-xl font-semibold">{job.title}</h2>
                <p className="text-gray-600">
                  {job.company} &bull; {job.location}
                </p>
                <p className="text-gray-500 text-sm">
                  {job.type && job.type.charAt(0).toUpperCase() + job.type.slice(1)}
                  {job.employer && job.employer.name && (
                    <> &bull; Posted by: {job.employer.name}</>
                  )}
                </p>
              </div>
              <span
                className={
                  "mt-3 md:mt-0 px-3 py-1 rounded-full text-sm font-semibold " +
                  (statusStyles[application.status] || statusStyles.default)
                }
              >
                {formatStatus(application.status)}
              </span>
            </div>
            {application.coverLetter && (
              <div className="mb-2">
                <p className="text-gray-700"><span className="font-medium">Your Cover Letter:</span> {application.coverLetter}</p>
              </div>
            )}
            <div className="text-gray-700 mb-2">
              {job.description}
            </div>
            {application.appliedAt && (
              <div className="text-gray-500 text-xs mt-2">
                Applied on {new Date(application.appliedAt).toLocaleDateString()}
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Applications;
