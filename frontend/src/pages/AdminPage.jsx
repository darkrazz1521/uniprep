import React, { useState, useEffect } from "react";
import { UploadCloud, CheckCircle, AlertTriangle } from "lucide-react";

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState("semester");
  const [semesters, setSemesters] = useState([]);
  const [selectedSemester, setSelectedSemester] = useState("");
  const [subjects, setSubjects] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);

  const [semesterName, setSemesterName] = useState("");
  const [semesterNumber, setSemesterNumber] = useState("");
  const [subjectName, setSubjectName] = useState("");
  const [subjectCode, setSubjectCode] = useState("");
  const [status, setStatus] = useState({ state: "idle", message: "" });

  // Fetch all semesters
  const fetchSemesters = async () => {
    try {
      const res = await fetch("/api/semesters");
      const data = await res.json();
      setSemesters(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchSemesters();
  }, []);

  // Fetch subjects when semester changes
  useEffect(() => {
    if (!selectedSemester) {
      setSubjects([]);
      setSelectedSubject("");
      return;
    }
    const loadSubjects = async () => {
      try {
        const res = await fetch(`/api/subjects/${selectedSemester}`);
        const data = await res.json();
        setSubjects(data);
      } catch (err) {
        console.error("Error loading subjects:", err);
      }
    };
    loadSubjects();
  }, [selectedSemester]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type === "application/json") {
      setSelectedFile(file);
      setStatus({ state: "idle", message: "" });
    } else {
      setSelectedFile(null);
      setStatus({ state: "error", message: "Select a valid JSON file" });
    }
  };

  // Add semester
  const handleAddSemester = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/semesters", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: semesterName, number: semesterNumber }),
      });
      if (!res.ok) throw new Error("Failed to add semester");
      setSemesterName("");
      setSemesterNumber("");
      await fetchSemesters();
      setStatus({ state: "success", message: "Semester added successfully!" });
    } catch (err) {
      setStatus({ state: "error", message: err.message });
    }
  };

  // Add subject
  const handleAddSubject = async (e) => {
    e.preventDefault();
    if (!selectedSemester) {
      setStatus({ state: "error", message: "Select a semester first" });
      return;
    }
    try {
      const res = await fetch("/api/subjects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: subjectName,
          code: subjectCode,
          semester: selectedSemester,
        }),
      });
      if (!res.ok) throw new Error("Failed to add subject");
      setSubjectName("");
      setSubjectCode("");
      // Reload subjects
      const updatedSubjects = await fetch(`/api/subjects/${selectedSemester}`).then((r) => r.json());
      setSubjects(updatedSubjects);
      setStatus({ state: "success", message: "Subject added successfully!" });
    } catch (err) {
      setStatus({ state: "error", message: err.message });
    }
  };

  // Upload questions (JSON format)
  const handleUploadQuestions = async (e) => {
    e.preventDefault();
    if (!selectedSemester || !selectedSubject || !selectedFile) {
      setStatus({ state: "error", message: "Select semester, subject, and JSON file" });
      return;
    }
    setStatus({ state: "uploading", message: "Uploading questions..." });

    const formData = new FormData();
    formData.append("questionsFile", selectedFile);

    try {
      const res = await fetch(`/api/subjects/${selectedSubject}/upload`, {
        method: "POST",
        body: formData,
      });
      if (!res.ok) throw new Error("Failed to upload questions");

      setSelectedFile(null);
      setSelectedSubject("");
      setSelectedSemester("");
      setSubjects([]);
      setStatus({ state: "success", message: "Questions uploaded successfully!" });
    } catch (err) {
      setStatus({ state: "error", message: err.message });
    }
  };

  const getStatusIcon = () => {
    switch (status.state) {
      case "success":
        return <CheckCircle className="w-5 h-5 text-emerald-500" />;
      case "error":
        return <AlertTriangle className="w-5 h-5 text-red-500" />;
      default:
        return null;
    }
  };

  const getStatusColor = () => {
    switch (status.state) {
      case "success":
        return "text-emerald-700 bg-emerald-100";
      case "error":
        return "text-red-700 bg-red-100";
      case "uploading":
        return "text-sky-700 bg-sky-100";
      default:
        return "hidden";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-cyan-50 flex justify-center items-start py-10">
      <div className="w-full max-w-4xl bg-white rounded-3xl shadow-2xl p-8 space-y-8">
        <h2 className="text-3xl font-bold text-sky-700 text-center">Admin Panel</h2>

        {/* Tabs */}
        <div className="flex justify-center space-x-6 border-b border-sky-200 mb-8">
          {["semester", "subject", "upload"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-3 font-semibold rounded-t-lg transition ${
                activeTab === tab
                  ? "bg-sky-100 text-sky-700 shadow"
                  : "text-slate-500 hover:text-sky-600"
              }`}
            >
              {tab === "semester" ? "Semesters" : tab === "subject" ? "Subjects" : "Upload Questions"}
            </button>
          ))}
        </div>

        {/* Tab Contents */}
        {activeTab === "semester" && (
          <form onSubmit={handleAddSemester} className="grid gap-4">
            <input
              type="text"
              placeholder="Semester Name"
              value={semesterName}
              onChange={(e) => setSemesterName(e.target.value)}
              className="w-full px-4 py-3 border border-sky-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-400"
              required
            />
            <input
              type="number"
              placeholder="Semester Number"
              value={semesterNumber}
              onChange={(e) => setSemesterNumber(e.target.value)}
              className="w-full px-4 py-3 border border-sky-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-400"
              required
            />
            <button className="w-full bg-sky-600 text-white py-3 rounded-lg hover:bg-sky-700 transition">
              Add Semester
            </button>
          </form>
        )}

        {activeTab === "subject" && (
          <form onSubmit={handleAddSubject} className="grid gap-4">
            <select
              value={selectedSemester}
              onChange={(e) => setSelectedSemester(e.target.value)}
              className="w-full px-4 py-3 border border-sky-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-400"
              required
            >
              <option value="">-- Select Semester --</option>
              {semesters.map((sem) => (
                <option key={sem._id} value={sem._id}>
                  {sem.name}
                </option>
              ))}
            </select>
            <input
              type="text"
              placeholder="Subject Name"
              value={subjectName}
              onChange={(e) => setSubjectName(e.target.value)}
              className="w-full px-4 py-3 border border-sky-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-400"
              required
            />
            <input
              type="text"
              placeholder="Subject Code"
              value={subjectCode}
              onChange={(e) => setSubjectCode(e.target.value)}
              className="w-full px-4 py-3 border border-sky-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-400"
              required
            />
            <button className="w-full bg-sky-600 text-white py-3 rounded-lg hover:bg-sky-700 transition">
              Add Subject
            </button>
          </form>
        )}

        {activeTab === "upload" && (
          <form onSubmit={handleUploadQuestions} className="grid gap-4">
            <select
              value={selectedSemester}
              onChange={(e) => setSelectedSemester(e.target.value)}
              className="w-full px-4 py-3 border border-sky-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-400"
            >
              <option value="">-- Select Semester --</option>
              {semesters.map((sem) => (
                <option key={sem._id} value={sem._id}>
                  {sem.name}
                </option>
              ))}
            </select>

            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              disabled={!selectedSemester}
              className="w-full px-4 py-3 border border-sky-200 rounded-lg disabled:bg-slate-100 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-sky-400"
            >
              <option value="">-- Select Subject --</option>
              {subjects.map((sub) => (
                <option key={sub._id} value={sub._id}>
                  {sub.name}
                </option>
              ))}
            </select>

            <label className="flex flex-col items-center px-4 py-6 border-2 border-dashed border-sky-300 rounded-lg cursor-pointer bg-sky-50 hover:bg-sky-100 transition">
              <UploadCloud className="w-10 h-10 text-sky-400 mb-2" />
              <span className="text-slate-600 font-medium">Select JSON file</span>
              <input type="file" accept=".json" className="hidden" onChange={handleFileChange} />
              {selectedFile && <span className="mt-2 text-emerald-600 font-semibold">{selectedFile.name}</span>}
            </label>

            <button
              type="submit"
              disabled={!selectedFile || !selectedSubject}
              className="w-full bg-sky-600 text-white py-3 rounded-lg hover:bg-sky-700 transition disabled:bg-sky-300"
            >
              Upload Questions
            </button>
          </form>
        )}

        {/* Status Message */}
        {status.message && (
          <div className={`flex items-center gap-2 p-3 rounded-lg text-sm font-medium ${getStatusColor()}`}>
            {getStatusIcon()} <span>{status.message}</span>
          </div>
        )}
      </div>
    </div>
  );
}
