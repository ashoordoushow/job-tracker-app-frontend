import { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [jobs, setJobs] = useState([]);
  const [coverLetter, setCoverLetter] = useState("");
  const [loadingId, setLoadingId] = useState(null);
  const [copySuccess, setCopySuccess] = useState("");
  const [formData, setFormData] = useState({
    company: "",
    title: "",
    status: "Applied",
    location: "",
    link: "",
    date_applied: "",
    notes: ""
  });

  useEffect(() => {
    const savedJobs = localStorage.getItem("jobs");
    if (savedJobs) {
      setJobs(JSON.parse(savedJobs));
    }
  }, []);

  const saveJobsToStorage = (updatedJobs) => {
    setJobs(updatedJobs);
    localStorage.setItem("jobs", JSON.stringify(updatedJobs));
  };

  const handleChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const newJob = {
      id: Date.now(),
      ...formData
    };

    const updatedJobs = [newJob, ...jobs];
    saveJobsToStorage(updatedJobs);

    setFormData({
      company: "",
      title: "",
      status: "Applied",
      location: "",
      link: "",
      date_applied: "",
      notes: ""
    });
  };

  const handleDeleteJob = (id) => {
    const confirmed = window.confirm("Are you sure you want to delete this job?");
    if (!confirmed) return;

    const updatedJobs = jobs.filter((job) => job.id !== id);
    saveJobsToStorage(updatedJobs);

    if (loadingId === id) {
      setLoadingId(null);
    }
  };

  const generateCoverLetter = async (job) => {
    try {
      setLoadingId(job.id);
      setCopySuccess("");

      const res = await axios.post(
        "https://jobtrackerappbackend-production.up.railway.app/jobs/generate_cover_letter_from_data",
        { job }
      );

      setCoverLetter(res.data.cover_letter);
    } catch (err) {
      console.error(err);
      alert("Failed to generate cover letter");
    } finally {
      setLoadingId(null);
    }
  };

  const copyCoverLetter = async () => {
    try {
      await navigator.clipboard.writeText(coverLetter);
      setCopySuccess("Copied!");
      setTimeout(() => setCopySuccess(""), 2000);
    } catch (err) {
      console.error("Copy failed:", err);
      setCopySuccess("Copy failed");
      setTimeout(() => setCopySuccess(""), 2000);
    }
  };

  return (
    <div className="app">
      <h1>Job Tracker</h1>
      <p className="subtitle">Track your applications, interviews, and rejections.</p>

      <form className="job-form" onSubmit={handleSubmit}>
        <h2>Add New Job</h2>

        <input
          type="text"
          name="company"
          placeholder="Company"
          value={formData.company}
          onChange={handleChange}
          required
        />

        <input
          type="text"
          name="title"
          placeholder="Job Title"
          value={formData.title}
          onChange={handleChange}
          required
        />

        <select
          name="status"
          value={formData.status}
          onChange={handleChange}
        >
          <option value="Applied">Applied</option>
          <option value="Assessment">Assessment</option>
          <option value="Phone Screen">Phone Screen</option>
          <option value="Interview">Interview</option>
          <option value="Offer">Offer</option>
          <option value="Rejected">Rejected</option>
        </select>

        <input
          type="text"
          name="location"
          placeholder="Location"
          value={formData.location}
          onChange={handleChange}
        />

        <input
          type="text"
          name="link"
          placeholder="Job Link"
          value={formData.link}
          onChange={handleChange}
        />

        <input
          type="date"
          name="date_applied"
          value={formData.date_applied}
          onChange={handleChange}
        />

        <textarea
          name="notes"
          placeholder="Notes"
          value={formData.notes}
          onChange={handleChange}
          rows="4"
        />

        <button type="submit">Add Job</button>
      </form>

      <div className="job-list">
        {jobs.map((job) => (
          <div key={job.id} className="job-card">
            <h2>{job.company}</h2>
            <p><strong>Title:</strong> {job.title}</p>
            <p><strong>Status:</strong> {job.status}</p>
            <p><strong>Location:</strong> {job.location}</p>
            <p><strong>Date Applied:</strong> {job.date_applied}</p>
            <p><strong>Notes:</strong> {job.notes}</p>

            <div className="job-actions">
              {job.link && (
                <a href={job.link} target="_blank" rel="noreferrer">
                  View Job Posting
                </a>
              )}

              <button onClick={() => generateCoverLetter(job)}>
                {loadingId === job.id ? "Generating..." : "Generate Cover Letter"}
              </button>

              <button
                type="button"
                className="delete-button"
                onClick={() => handleDeleteJob(job.id)}
              >
                Delete Job
              </button>
            </div>
          </div>
        ))}
      </div>

      {coverLetter && (
        <div className="cover-letter-box">
          <div className="cover-letter-header">
            <h2>Generated Cover Letter</h2>
            <button className="copy-button" onClick={copyCoverLetter}>
              Copy Cover Letter
            </button>
          </div>

          {copySuccess && <p className="copy-success">{copySuccess}</p>}

          <pre>{coverLetter}</pre>
        </div>
      )}
    </div>
  );
}

export default App;