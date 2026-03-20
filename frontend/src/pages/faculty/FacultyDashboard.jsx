import { useState, useMemo, useEffect, useRef } from "react";

import FacultyHeader from "./FacultyHeader";
import Sidebar from "../../components/Sidebar";
import ProfessionalDevelopment from "./ProfessionalDevelopment";
import RnD from "./RnD";

import Conferences from "./categories/Conferences";
import Workshops from "./categories/Workshops";
import FDP from "./categories/FDP";
import Books from "./categories/Books";
import NPTEL from "./categories/NPTEL";
import Seminars from "./categories/Seminars";
import Webinars from "./categories/Webinars";
import GuestLectures from "./categories/GuestLectures";
import HonorsAwards from "./categories/HonorsAwards";
import Certifications from "./categories/Certifications";

import Publications from "./categories/Publications";
import ResearchPolicy from "./categories/ResearchPolicy";
import DoctoralThesis from "./categories/DoctoralThesis";
import ResearchProjects from "./categories/ResearchProjects";
import ProfessionalMemberships from "./categories/ProfessionalMemberships";
import IPRs from "./categories/IPRs";
import Incubation from "./categories/Incubation";
import Consultancy from "./categories/Consultancy";

import ProfileInfo from "../common/ProfileInfo";
import API_BASE from "../../api";

function FacultyDashboard({ setPage, readOnly = false, facultyId = null }) {
  const [view, setView] = useState("dashboard");
  const [uploads, setUploads] = useState([]);
  const [user, setUser] = useState(null);
  const [categoryMode, setCategoryMode] = useState("upload");

  const fileInputRef = useRef(null);
  const token = localStorage.getItem("token");

  const menuItems = [
    { key: "dashboard", label: "Dashboard" },
    { key: "pdc", label: "Professional Development" },
    { key: "rnd", label: "Research & Development" },
  ];

  useEffect(() => {
    const url = facultyId ? `${API_BASE}/faculty/${facultyId}` : `${API_BASE}/faculty/profile`;
    fetch(url, { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => res.json())
      .then((data) => setUser(data))
      .catch(console.error);
  }, [token, facultyId]);

  useEffect(() => {
    const url = facultyId ? `${API_BASE}/uploads/faculty/${facultyId}` : `${API_BASE}/uploads/mine`;
    fetch(url, { headers: { Authorization: `Bearer ${token}` } })
      .then(async (res) => {
        if (!res.ok) {
          console.error("Upload fetch failed", res.status);
          setUploads([]);
          return;
        }
        const data = await res.json();
        if (Array.isArray(data)) setUploads(data);
        else setUploads([]);
      })
      .catch((err) => {
        console.error("UPLOAD FETCH ERROR", err);
        setUploads([]);
      });
  }, [token, facultyId]);

  const handleImageClick = () => fileInputRef.current?.click();

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("profileImage", file);

    try {
      const res = await fetch(`${API_BASE}/auth/update-profile-image`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      const data = await res.json();
      if (res.ok) setUser((prev) => ({ ...prev, profileImage: data.profileImage }));
    } catch (err) {
      console.error(err);
    }
  };

  const approvedUploads = useMemo(
    () => uploads.filter((u) => ["HOD_APPROVED", "ADMIN_APPROVED"].includes(u.status)),
    [uploads]
  );

  const totalCredits = approvedUploads.reduce((sum, u) => sum + (u.credits || 0), 0);

  const byCategory = (category) =>
    approvedUploads.filter((u) => (u.category || "").toLowerCase() === category.toLowerCase()).reduce((sum, u) => sum + (u.credits || 0), 0);

  const pendingUploads = uploads.filter((u) => u.status === "PENDING");

  const approvedCount = approvedUploads.length;
  const pendingCount = pendingUploads.length;

  const openCategory = (key) => {
    setCategoryMode("approved");
    setView(key);
  };

  const handleDownload = async (type) => {
    let url = `${API_BASE}/reports/faculty-excel`;
    if (type === "category") {
      const category = prompt("Enter category name (example: publication)");
      if (!category) return;
      url += `?category=${category}`;
    }
    if (type === "year") {
      const year = prompt("Enter year (example: 2026)");
      if (!year) return;
      url += `?year=${year}`;
    }

    const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
    const blob = await res.blob();
    const link = document.createElement("a");
    link.href = window.URL.createObjectURL(blob);
    link.download = "faculty_activities.xlsx";
    link.click();
  };

  return (
    <div style={wrapper}>
      <FacultyHeader user={user} readOnly={readOnly} />

      <div style={layout}>
        <Sidebar
          menu={menuItems}
          onSelect={(key) => {
            setView(key);
          }}
          profile={(
            <div style={profileSection}>
              <img
                src={user?.profileImage ? `http://localhost:5000/uploads/${user.profileImage}` : "https://via.placeholder.com/260x220"}
                alt="Profile"
                style={profileImageStyle}
                onClick={!readOnly ? handleImageClick : undefined}
              />

              <input type="file" ref={fileInputRef} style={{ display: "none" }} onChange={handleImageChange} />

              {!readOnly && (
                <div style={changeText} onClick={handleImageClick}>
                  Click to change image
                </div>
              )}

              <ProfileInfo user={user} />
            </div>
          )}
          bottom={(!readOnly && (
            <div style={{ padding: 8 }}>
              <button onClick={() => { localStorage.clear(); window.location.href = "/" }} style={{ padding: "8px 14px", background: "#ef4444", color: "white", border: "none", borderRadius: 8, cursor: "pointer", fontWeight: 600 }}>
                Logout
              </button>
            </div>
          ))}
        />

        <div style={content}>
          {view === "dashboard" && (
            <>
              <div style={dashboardHeader}>
                <h2>Academic Performance Overview</h2>

                <div style={{ display: "flex", gap: 10 }}>
                  <button style={downloadBtn} onClick={() => handleDownload("all")}>Download All</button>
                  <button style={downloadBtn} onClick={() => handleDownload("category")}>Category</button>
                  <button style={downloadBtn} onClick={() => handleDownload("year")}>Year</button>
                </div>
              </div>

              <div style={{ display: "flex", gap: 20, marginTop: 30 }}>
                <SummaryCard title="Total Credits" value={totalCredits} />
                <SummaryCard title="Your Rank" value="—" />
              </div>

              <div style={cardGrid}>
                <CategoryCard title="Publications" value={byCategory("publication")} onClick={() => openCategory("rnd-publications")} />
                <CategoryCard title="Conferences" value={byCategory("conference")} onClick={() => openCategory("conferences")} />
                <CategoryCard title="Workshops" value={byCategory("workshop")} onClick={() => openCategory("workshops")} />
                <CategoryCard title="FDP" value={byCategory("fdp")} onClick={() => openCategory("fdp")} />
                <CategoryCard title="Books" value={byCategory("book")} onClick={() => openCategory("books")} />
                <CategoryCard title="NPTEL" value={byCategory("nptel")} onClick={() => openCategory("nptel")} />
                <CategoryCard title="Seminars" value={byCategory("seminar")} onClick={() => openCategory("seminars")} />
                <CategoryCard title="Webinars" value={byCategory("webinar")} onClick={() => openCategory("webinars")} />
                <CategoryCard title="Guest Lectures" value={byCategory("guestlecture")} onClick={() => openCategory("guest-lectures")} />
                <CategoryCard title="Awards" value={byCategory("honorsawards")} onClick={() => openCategory("honors-awards")} />
                <CategoryCard title="Certifications" value={byCategory("certification")} onClick={() => openCategory("certifications")} />
                <CategoryCard title="Research Policy" value={byCategory("researchpolicy")} onClick={() => openCategory("rnd-policy")} />
                <CategoryCard title="Memberships" value={byCategory("membership")} onClick={() => openCategory("rnd-memberships")} />
                <CategoryCard title="IPR" value={byCategory("ipr")} onClick={() => openCategory("rnd-iprs")} />
                <CategoryCard title="Consultancy" value={byCategory("consultancy")} onClick={() => openCategory("rnd-consultancy")} />
                <CategoryCard title="Incubation" value={byCategory("incubation")} onClick={() => openCategory("rnd-incubation")} />
                <CategoryCard title="Projects" value={byCategory("researchProjects")} onClick={() => openCategory("rnd-projects")} />
                <CategoryCard title="Doctoral Thesis" value={byCategory("doctoralThesis")} onClick={() => openCategory("rnd-doctoral-thesis")} />
              </div>
            </>
          )}

          {view === "pdc" && <ProfessionalDevelopment onSelectCategory={setView} />}
          {view === "rnd" && <RnD onSelectCategory={setView} />}

          {/* Category views will render the respective components based on view keys (existing imports) */}
        </div>
      </div>
    </div>
  );
}

export default FacultyDashboard;

/* COMPONENTS */

function SummaryCard({ title, value }) {
  const [hover, setHover] = useState(false);
  return (
    <div style={{ ...summaryCard, ...(hover ? summaryHover : {}) }} onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}>
      <h2>{value}</h2>
      <p>{title}</p>
    </div>
  );
}

function CategoryCard({ title, value, onClick }) {
  const [hover, setHover] = useState(false);
  return (
    <div style={{ ...categoryCard, ...(hover ? categoryHover : {}) }} onClick={onClick} onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}>
      <h3>{title}</h3>
      <p>Credits Earned</p>
      <h2>{value}</h2>
    </div>
  );
}

/* STYLES */

const wrapper = { minHeight: "100vh", background: "linear-gradient(180deg,#c7d2fe 0%,#e9d5ff 100%)" };
const layout = { display: "flex" };
const profileSection = { marginBottom: 30, display: "flex", flexDirection: "column", alignItems: "center" };
const profileImageStyle = { width: "100%", maxHeight: 220, borderRadius: "18px", objectFit: "cover", cursor: "pointer", border: "3px solid #4f46e5" };
const changeText = { fontSize: 13, marginTop: 12, cursor: "pointer" };
const sidebarTitle = { fontWeight: 700, marginBottom: 15 };
const menuItem = { marginBottom: 10, padding: "8px 10px", cursor: "pointer", borderRadius: 6, transition: "all 0.2s ease" };
const activeItem = { background: "rgba(255,255,255,0.5)", borderLeft: "4px solid #4f46e5" };
const content = { flex: 1, padding: 40 };
const cardGrid = { display: "flex", gap: 20, flexWrap: "wrap" };
const summaryCard = { flex: "0 1 200px", maxWidth: 260, height: 100, background: "white", borderRadius: 12, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", transition: "all 0.25s ease", boxShadow: "0 4px 10px rgba(0,0,0,0.08)" };
const categoryCard = { flex: "0 1 220px", maxWidth: 300, minWidth: 180, height: 120, background: "white", borderRadius: 12, padding: 20, marginTop: 20, cursor: "pointer", boxShadow: "0 4px 10px rgba(0,0,0,0.08)", transition: "all 0.25s ease" };
const dashboardHeader = { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 };
const downloadBtn = { padding: "8px 14px", background: "#2563eb", color: "white", border: "none", borderRadius: 6, cursor: "pointer", fontSize: 13, fontWeight: 500 };
const summaryHover = { transform: "translateY(-6px)", boxShadow: "0 12px 24px rgba(0,0,0,0.15)" };
const categoryHover = { transform: "translateY(-8px)", boxShadow: "0 16px 28px rgba(0,0,0,0.18)" };
