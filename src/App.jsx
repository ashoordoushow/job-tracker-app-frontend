import { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [jobs, setJobs] = useState([]);
  const [formData, setFormData] = useState({
    company: "",
    title: "",
    status: "Applied",
    location: "",
    link: "",
    date_applied: "",
    notes: ""
  });

  const fetchJobs = () => {
    axios.get("http://localhost:3000/jobs")
      .then((response) => {
        setJobs(response.data);
      })
      .catch((error) => {
        console.error("Error fetching jobs:", error);
      });
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const handleChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    axios.post("http://localhost:3000/jobs", {
      job: formData
    })
      .then(() => {
        fetchJobs();
        setFormData({
          company: "",
          title: "",
          status: "Applied",
          location: "",
          link: "",
          date_applied: "",
          notes: ""
        });
      })
      .catch((error) => {
        console.error("Error creating job:", error);
      });
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
          <option value="Interview">Interview</option>
          <option value="Rejected">Rejected</option>
          <option value="Offer">Offer</option>
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

            {job.link && (
              <a href={job.link} target="_blank" rel="noreferrer">
                View Job Posting
              </a>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;