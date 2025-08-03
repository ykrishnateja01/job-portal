import React from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { useQuery } from 'react-query';

const fetchJob = async ({ queryKey }) => {
  const [_key, id] = queryKey;
  const { data } = await axios.get(`https://job-portal-backend-dkt3.onrender.com/api/jobs/${id}`);
  return data;
};

const parseTextField = (text, label, fallback = "") => {
  // Extract a line that starts with label, e.g. "Email: ...", "Name: ..."
  const match = text.match(new RegExp(`${label}[:\\s]+(.+)`, "i"));
  return match ? match[1].trim() : fallback;
};

const extractSkills = (text) => {
  // Try to extract comma-separated skills from a "Skills" line
  const match = text.match(/Skills[:\s]+([a-z0-9 ,._+-]+)/i);
  if (match) {
    return match[1].split(",").map(skill => skill.trim()).join(", ");
  }
  return "";
};

const JobDetail = () => {
  const { id } = useParams();
  const { data: job, isLoading, error } = useQuery(['job', id], fetchJob);
  const [coverLetter, setCoverLetter] = React.useState("");
  const [resume, setResume] = React.useState(null);
  const [autoFillLoading, setAutoFillLoading] = React.useState(false);
  const [autoFillError, setAutoFillError] = React.useState("");
  const [autoFilled, setAutoFilled] = React.useState(false);

  const [applied, setApplied] = React.useState(false);
  const [applyMode, setApplyMode] = React.useState(""); // "manual" or "pdf"
  const [formFields, setFormFields] = React.useState({
    name: "",
    email: "",
    batch: "",
    dob: "",
    skills: "",
    experience: "",
    coverLetter: ""
  });

  if (isLoading) return <p className="text-center mt-20">Loading job details...</p>;
  if (error) return <p className="text-center mt-20 text-red-600">Error loading job details.</p>;
  if (!job) return <p className="text-center mt-20">Job not found.</p>;

  // Resume upload and parsing logic
  const handleResumeUpload = async (e) => {
    const file = e.target.files[0];
    setResume(file);
    setAutoFillError("");
    setAutoFilled(false);
    if (!file) return;
    if (file.type !== "application/pdf") {
      setAutoFillError("Please upload a valid PDF file.");
      return;
    }
    setAutoFillLoading(true);

    try {
      const formData = new FormData();
      formData.append("resume", file);

      const res = await axios.post(`https://job-portal-backend-dkt3.onrender.com/api/ai/parse-resume`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      if (res.data && res.data.text && res.data.text.length > 0) {
        const text = res.data.text;
        setFormFields(fields => ({
          ...fields,
          name: parseTextField(text, 'Name', fields.name),
          email: parseTextField(text, 'Email', fields.email),
          batch: parseTextField(text, 'Batch', fields.batch),
          dob: parseTextField(text, 'DOB', fields.dob),
          skills: res.data.skills?.join(", ") || extractSkills(text) || fields.skills,
          experience: parseTextField(text, 'Experience', fields.experience),
          coverLetter: res.data.coverLetter || fields.coverLetter
        }));
        setAutoFilled(true);
        setAutoFillLoading(false);
      } else {
        setAutoFillError("Could not extract text from PDF. Please check your file or try another resume.");
        setAutoFillLoading(false);
      }
    } catch (err) {
      let msg = "Failed to parse resume. Please fill the form manually.";
      if (err.response && err.response.data && err.response.data.message) {
        msg = err.response.data.message;
      }
      setAutoFillError(msg);
      setAutoFillLoading(false);
    }
  };

  const handleApply = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    Object.entries(formFields).forEach(([key, value]) => {
      if (key !== "coverLetter") formData.append(key, value);
    });
    formData.append("coverLetter", coverLetter || formFields.coverLetter);
    if (resume) formData.append("resume", resume);
    try {
      await axios.post(`https://job-portal-backend-dkt3.onrender.com/api/jobs/${id}/apply`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setApplied(true);
      alert("Application submitted successfully!");
    } catch (err) {
      alert("Failed to apply for job.");
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 bg-white rounded shadow">
      <h1 className="text-3xl font-bold mb-2">{job.title}</h1>
      <p className="text-gray-700 mb-4">{job.company} &bull; {job.location}</p>
      <div className="prose max-w-none mb-6" dangerouslySetInnerHTML={{ __html: job.description }}></div>

      <h2 className="text-xl font-semibold mb-1">Required Skills</h2>
      <ul className="list-disc pl-6 mb-6">
        {job.requiredSkills?.map((skill, i) => (
          <li key={i}>{skill.name} {skill.level && `(${skill.level})`}</li>
        ))}
      </ul>

      <div className="mt-10">
        <h2 className="text-xl font-semibold mb-4">Apply for this job</h2>
        {applied ? (
          <p className="text-green-600 font-semibold">You have applied for this job.</p>
        ) : (
          <div className="space-y-6">
            <div className="flex gap-4 mb-4">
              <button
                type="button"
                className={`px-4 py-2 rounded border font-semibold transition-colors ${applyMode === "manual" ? "bg-blue-600 text-white" : "bg-gray-100"}`}
                onClick={() => setApplyMode("manual")}
              >
                Fill Manually
              </button>
              <button
                type="button"
                className={`px-4 py-2 rounded border font-semibold transition-colors ${applyMode === "pdf" ? "bg-blue-600 text-white" : "bg-gray-100"}`}
                onClick={() => setApplyMode("pdf")}
              >
                Upload Resume (PDF)
              </button>
            </div>

            {applyMode === "manual" && (
              <form onSubmit={handleApply} className="space-y-4 animate-fade-in">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block mb-1 font-medium">Name</label>
                    <input type="text" className="w-full border rounded px-3 py-2" required value={formFields.name} onChange={e => setFormFields(f => ({ ...f, name: e.target.value }))} />
                  </div>
                  <div>
                    <label className="block mb-1 font-medium">Email</label>
                    <input type="email" className="w-full border rounded px-3 py-2" required value={formFields.email} onChange={e => setFormFields(f => ({ ...f, email: e.target.value }))} />
                  </div>
                  <div>
                    <label className="block mb-1 font-medium">Batch</label>
                    <input type="text" className="w-full border rounded px-3 py-2" value={formFields.batch} onChange={e => setFormFields(f => ({ ...f, batch: e.target.value }))} />
                  </div>
                  <div>
                    <label className="block mb-1 font-medium">Date of Birth</label>
                    <input type="date" className="w-full border rounded px-3 py-2" value={formFields.dob} onChange={e => setFormFields(f => ({ ...f, dob: e.target.value }))} />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block mb-1 font-medium">Skills</label>
                    <input type="text" className="w-full border rounded px-3 py-2" placeholder="e.g. JavaScript, React, Node.js" value={formFields.skills} onChange={e => setFormFields(f => ({ ...f, skills: e.target.value }))} />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block mb-1 font-medium">Experience</label>
                    <textarea className="w-full border rounded px-3 py-2" rows={3} value={formFields.experience} onChange={e => setFormFields(f => ({ ...f, experience: e.target.value }))} />
                  </div>
                </div>
                {/*<div>
                  <label className="block mb-1 font-medium">Upload Cover Letter or Resume (PDF)</label>
                  <input type="file" accept=".pdf" onChange={e => setResume(e.target.files[0])} className="block" />
                </div>*/}
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 w-full"
                >
                  Apply
                </button>
              </form>
            )}

            {applyMode === "pdf" && (
              <form onSubmit={handleApply} className="space-y-4 animate-fade-in">
                <div>
                  <label className="block mb-1 font-medium">Upload Resume (PDF)</label>
                  <input type="file" accept=".pdf" onChange={handleResumeUpload} className="block" />
                  {autoFillLoading && <p className="text-blue-600">Parsing and auto-filling your details...</p>}
                  {autoFillError && <p className="text-red-600">{autoFillError}</p>}
                  {autoFilled && <p className="text-green-600">Autofilled details from your resume. Please review before submitting!</p>}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block mb-1 font-medium">Name</label>
                    <input type="text" className={`w-full border rounded px-3 py-2 ${autoFilled && formFields.name ? "bg-blue-50" : ""}`} required value={formFields.name} onChange={e => setFormFields(f => ({ ...f, name: e.target.value }))} />
                  </div>
                  <div>
                    <label className="block mb-1 font-medium">Email</label>
                    <input type="email" className={`w-full border rounded px-3 py-2 ${autoFilled && formFields.email ? "bg-blue-50" : ""}`} required value={formFields.email} onChange={e => setFormFields(f => ({ ...f, email: e.target.value }))} />
                  </div>
                  <div>
                    <label className="block mb-1 font-medium">Batch</label>
                    <input type="text" className="w-full border rounded px-3 py-2" value={formFields.batch} onChange={e => setFormFields(f => ({ ...f, batch: e.target.value }))} />
                  </div>
                  <div>
                    <label className="block mb-1 font-medium">Date of Birth</label>
                    <input type="date" className="w-full border rounded px-3 py-2" value={formFields.dob} onChange={e => setFormFields(f => ({ ...f, dob: e.target.value }))} />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block mb-1 font-medium">Skills</label>
                    <input type="text" className="w-full border rounded px-3 py-2" placeholder="e.g. JavaScript, React, Node.js" value={formFields.skills} onChange={e => setFormFields(f => ({ ...f, skills: e.target.value }))} />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block mb-1 font-medium">Experience</label>
                    <textarea className="w-full border rounded px-3 py-2" rows={3} value={formFields.experience} onChange={e => setFormFields(f => ({ ...f, experience: e.target.value }))} />
                  </div>
                </div>
                {/*<div>
                  <label className="block mb-1 font-medium">Cover Letter</label>
                  <textarea
                    value={coverLetter || formFields.coverLetter}
                    onChange={e => setCoverLetter(e.target.value)}
                    rows={6}
                    className="w-full border border-gray-300 rounded px-3 py-2 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Write your cover letter or let us autofill from your resume."
                    required
                  />
                </div>*/}
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 w-full"
                >
                  Apply
                </button>
              </form>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default JobDetail;
