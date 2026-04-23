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
    const confirmed = window.confirm("Are you sure?");
    if (!confirmed) return;

    const updatedJobs = jobs.filter((job) => job.id !== id);
    saveJobsToStorage(updatedJobs);
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
    await navigator.clipboard.writeText(coverLetter);
    setCopySuccess("Copied!");
    setTimeout(() => setCopySuccess(""), 2000);
  };

  return (
    <div className="app">

      {/* HERO SECTION */}
      <div className="hero-layout">
        <div className="hero-panel">
          <div className="hero-badge">AI-powered job search</div>

          <h1>Track jobs and generate cover letters instantly.</h1>

          <p className="subtitle">
            Keep your job applications organized and generate tailored cover letters
            with one click — all privately in your browser.
          </p>

          <div className="hero-metrics">
            <div className="metric-card">
              <span className="metric-value">{jobs.length}</span>
              <span className="metric-label">Jobs tracked</span>
            </div>

            <div className="metric-card">
              <span className="metric-value">AI</span>
              <span className="metric-label">Cover letter generation</span>
            </div>
          </div>
        </div>

        {/* FORM */}
        <form className="job-form" onSubmit={handleSubmit}>
          <h2>Add New Job</h2>

          <input name="company" placeholder="Company" value={formData.company} onChange={handleChange} required />
          <input name="title" placeholder="Job Title" value={formData.title} onChange={handleChange} required />

          <select name="status" value={formData.status} onChange={handleChange}>
            <option value="Applied">Applied</option>
            <option value="Assessment">Assessment</option>
            <option value="Phone Screen">Phone Screen</option>
            <option value="Interview">Interview</option>
            <option value="Offer">Offer</option>
            <option value="Rejected">Rejected</option>
          </select>

          <input name="location" placeholder="Location" value={formData.location} onChange={handleChange} />
          <input name="link" placeholder="Job Link" value={formData.link} onChange={handleChange} />
          <input type="date" name="date_applied" value={formData.date_applied} onChange={handleChange} />

          <textarea name="notes" placeholder="Notes" value={formData.notes} onChange={handleChange} rows="4" />

          <button type="submit">Add Job</button>
        </form>
      </div>

      {/* JOB LIST SECTION */}
      <div className="content-section">
        <div className="jobs-header">
          <div>
            <h2 className="section-title">Your job pipeline</h2>
            <p>Everything stays private to your browser.</p>
          </div>
        </div>

        {jobs.length === 0 ? (
          <div className="empty-state">No jobs yet. Add one above.</div>
        ) : (
          <div className="job-list">
            {jobs.map((job) => (
              <div key={job.id} className="job-card">
                <h2>{job.company}</h2>

                <div className={`status-pill status-${job.status.toLowerCase().replace(/\s+/g, "-")}`}>
                  {job.status}
                </div>

                <p><strong>{job.title}</strong></p>
                <p>{job.location}</p>
                <p>{job.date_applied}</p>
                <p>{job.notes}</p>

                <div className="job-actions">
                  {job.link && <a href={job.link} target="_blank" rel="noreferrer">View Job</a>}

                  <button onClick={() => generateCoverLetter(job)}>
                    {loadingId === job.id ? "Generating..." : "Generate"}
                  </button>

                  <button className="delete-button" onClick={() => handleDeleteJob(job.id)}>
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* COVER LETTER */}
      {coverLetter && (
        <div className="cover-letter-box">
          <div className="cover-letter-header">
            <h2>Generated Cover Letter</h2>
            <button className="copy-button" onClick={copyCoverLetter}>
              Copy
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