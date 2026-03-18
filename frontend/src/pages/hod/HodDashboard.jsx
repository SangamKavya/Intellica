/* ================= PDC CATEGORIES ================= */

import Conferences from "../faculty/categories/Conferences";
import Workshops from "../faculty/categories/Workshops";
import FDP from "../faculty/categories/FDP";
import Books from "../faculty/categories/Books";
import NPTEL from "../faculty/categories/NPTEL";
import Seminars from "../faculty/categories/Seminars";
import Webinars from "../faculty/categories/Webinars";
import GuestLectures from "../faculty/categories/GuestLectures";
import HonorsAwards from "../faculty/categories/HonorsAwards";
import Certifications from "../faculty/categories/Certifications";

/* ================= RND CATEGORIES ================= */

import Publications from "../faculty/categories/Publications";
import ResearchPolicy from "../faculty/categories/ResearchPolicy";
import DoctoralThesis from "../faculty/categories/DoctoralThesis";
import ResearchProjects from "../faculty/categories/ResearchProjects";
import ProfessionalMemberships from "../faculty/categories/ProfessionalMemberships";
import IPRs from "../faculty/categories/IPRs";
import Incubation from "../faculty/categories/Incubation";
import Consultancy from "../faculty/categories/Consultancy";
import MOUs from "../faculty/categories/MOUs";

import { useState, useEffect, useMemo, useRef } from "react";
import HodHeader from "./HodHeader";
import API_BASE from "../../api";

/* ================= PROFILE INFO ================= */

import ProfileInfo from "../common/ProfileInfo";

/* ================= MODULES ================= */

import ProfessionalDevelopment from "../faculty/ProfessionalDevelopment";
import RnD from "../faculty/RnD";

/* ================= HOD SECTIONS ================= */

import ApproveUploads from "./sections/ApproveUploads";
import ApproveFaculty from "./sections/ApproveFaculty";
import FacultyProfiles from "./sections/FacultyProfiles";
import DepartmentDashboard from "./sections/DepartmentDashboard";
import HodPersonalDashboard from "./sections/HodPersonalDashboard";
import DepartmentAnalytics from "./sections/DepartmentAnalytics";

function HodDashboard({ setPage = () => {}, readOnly = false, hodUser = null }){

  const [view, setView] = useState("dept-dashboard");
  const [uploads, setUploads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [profileImage, setProfileImage] = useState("");
  const [user, setUser] = useState(null);

  const fileInputRef = useRef(null);
  const menuItems = readOnly
  ? [
      { key: "dept-dashboard", label: "Department Academic Report" },
      { key: "my-dashboard", label: "Personal Academic Summary" },
      { key: "pdc", label: "Faculty Professional Activities" },
      { key: "rnd", label: "Research & Development" },
      { key: "dept-analytics", label: "Department Analytics" },
    ]
  : [
      { key: "dept-dashboard", label: "Department Academic Report" },
      { key: "my-dashboard", label: "Personal Academic Summary" },
      { key: "pdc", label: "Faculty Professional Activities" },
      { key: "rnd", label: "Research & Development" },
      { key: "approve-uploads", label: "Approve Faculty Submissions" },
      { key: "approve-faculty", label: "Approve Faculty Accounts" },
      { key: "faculty-profiles", label: "Faculty Profiles" },
      { key: "dept-analytics", label: "Department Analytics" },
    ];

  const department = localStorage.getItem("user_department");
  const token = localStorage.getItem("token");

 const handleLogout = () => {
  localStorage.clear();
  window.location.href = "/";
};

  /* ================= PROFILE ================= */

  useEffect(() => {

  const fetchProfile = async () => {

    try {

      if (readOnly && hodUser) {
        setUser(hodUser);
        return;
      }

      const res = await fetch(`${API_BASE}/hod/profile`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      const data = await res.json();
      setUser(data);

    } catch (err) {
      console.error(err);
    }

  };

  fetchProfile();

}, [token, readOnly, hodUser]);

  /* ================= CHANGE IMAGE ================= */

  const handleImageClick = () => fileInputRef.current.click();

  const handleImageChange = async (e) => {

    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("profileImage", file);

    try {

      const res = await fetch(`${API_BASE}/auth/update-profile-image`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
        body: formData
      });

      const data = await res.json();

      if (res.ok) {
        setProfileImage(data.profileImage);
      }

    } catch (err) {
      console.error(err);
    }

  };


  /* ================= FETCH UPLOADS ================= */

  useEffect(() => {

  const fetchUploads = async () => {

    try {

      const res = await fetch(`${API_BASE}/hod/department-uploads`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      const data = await res.json();

      if (res.ok) setUploads(data);

    } catch (err) {
      console.error(err);
    }

    setLoading(false);

  };

  fetchUploads();

}, [token]);


  /* ================= APPROVED FILTER ================= */

const departmentApprovedUploads = uploads.filter(
  (u) =>
    u.status === "HOD_APPROVED" ||
    u.status === "ADMIN_APPROVED"
);

const hodUploads = uploads.filter((u) => {
  if (!user) return false;

  return u.faculty?.employeeId === user.employeeId;
});
const hodId = hodUser?._id || user?._id;

  if (loading) return <div style={{ padding: 50 }}>Loading...</div>;


  return (

    <div style={wrapper}>

      {/* FIXED HERE */}
      <HodHeader user={user} />

      <div style={layout}>

        {/* ================= SIDEBAR ================= */}

        <div style={sidebar}>

  {/* TOP SECTION */}

  <div>

    <div style={profileSection}>

      <img
        src={
          profileImage
            ? `http://localhost:5000/uploads/${profileImage}`
            : "https://via.placeholder.com/240x200"
        }
        alt="Profile"
        style={profileImageStyle}
        onClick={handleImageClick}
      />

      <input
        type="file"
        ref={fileInputRef}
        style={{ display: "none" }}
        onChange={handleImageChange}
      />

      <div style={changeText} onClick={handleImageClick}>
        Click to change image
      </div>

      <ProfileInfo user={user} />

    </div>

    <div style={sidebarTitle}>Intellica</div>

    {menuItems.map(item => (

      <div
        key={item.key}
        onClick={() => setView(item.key)}
        style={{
          ...menuItem,
          ...(view === item.key ? activeItem : {})
        }}
      >
        {item.label}
      </div>

    ))}

  </div>


  {/* BOTTOM SECTION */}

  <button style={logoutBtn} onClick={handleLogout}>
    Logout
  </button>

</div>


        {/* ================= CONTENT ================= */}

        <div style={content}>

          {view === "dept-dashboard" &&
            <DepartmentDashboard
              uploads={departmentApprovedUploads}
              department={department}
            />
          }

         {view === "my-dashboard" &&
        <HodPersonalDashboard
          uploads={hodUploads}
          hodId={hodUser?._id}
        />
      }
          {view === "pdc" &&
            <ProfessionalDevelopment onSelectCategory={setView} />
          }

          {view === "rnd" &&
            <RnD onSelectCategory={setView} />
          }

          {view === "approve-uploads" &&
            <ApproveUploads />
          }

          {view === "approve-faculty" &&
            <ApproveFaculty />
          }

          {view === "faculty-profiles" &&
            <FacultyProfiles uploads={departmentApprovedUploads} />
          }

          {view === "dept-analytics" &&
            <DepartmentAnalytics uploads={departmentApprovedUploads} />
          }
        {/* ================= PDC CATEGORY VIEWS ================= */}

{/* ================= PDC CATEGORY VIEWS ================= */}

{view === "conferences" &&
  <Conferences mode="approved" facultyId={hodId} onBack={() => setView("pdc")} />
}

{view === "workshops" &&
  <Workshops mode="approved" facultyId={hodId} onBack={() => setView("pdc")} />
}

{view === "fdp" &&
  <FDP mode="approved" facultyId={hodId} onBack={() => setView("pdc")} />
}

{view === "books" &&
  <Books mode="approved" facultyId={hodId} onBack={() => setView("pdc")} />
}

{view === "nptel" &&
  <NPTEL mode="approved" facultyId={hodId} onBack={() => setView("pdc")} />
}

{view === "seminars" &&
  <Seminars mode="approved" facultyId={hodId} onBack={() => setView("pdc")} />
}

{view === "webinars" &&
  <Webinars mode="approved" facultyId={hodId} onBack={() => setView("pdc")} />
}

{view === "guest-lectures" &&
  <GuestLectures mode="approved" facultyId={hodId} onBack={() => setView("pdc")} />
}

{view === "honors-awards" &&
  <HonorsAwards mode="approved" facultyId={hodId} onBack={() => setView("pdc")} />
}

{view === "certifications" &&
  <Certifications mode="approved" facultyId={hodId} onBack={() => setView("pdc")} />
}

{/* ================= RND CATEGORY VIEWS ================= */}

{view === "rnd-publications" &&
  <Publications mode="approved" facultyId={hodId} onBack={() => setView("rnd")} />
}

{view === "rnd-policy" &&
  <ResearchPolicy mode="approved" facultyId={hodId} onBack={() => setView("rnd")} />
}

{view === "rnd-doctoral-thesis" &&
  <DoctoralThesis mode="approved" facultyId={hodId} onBack={() => setView("rnd")} />
}

{view === "rnd-projects" &&
  <ResearchProjects mode="approved" facultyId={hodId} onBack={() => setView("rnd")} />
}

{view === "rnd-memberships" &&
  <ProfessionalMemberships mode="approved" facultyId={hodId} onBack={() => setView("rnd")} />
}

{view === "rnd-iprs" &&
  <IPRs mode="approved" facultyId={hodId} onBack={() => setView("rnd")} />
}

{view === "rnd-incubation" &&
  <Incubation mode="approved" facultyId={hodId} onBack={() => setView("rnd")} />
}

{view === "rnd-consultancy" &&
  <Consultancy mode="approved" facultyId={hodId} onBack={() => setView("rnd")} />
}

{view === "rnd-mous" &&
  <MOUs mode="approved" facultyId={hodId} onBack={() => setView("rnd")} />
}
        </div>

      </div>

    </div>

  );

}

export default HodDashboard;


/* ================= STYLES ================= */

const wrapper = {
  minHeight: "100vh",
  background: "linear-gradient(180deg,#c7d2fe 0%,#e9d5ff 100%)"
};

const layout = {
  display: "flex"
};

const sidebar = {
  width: 240,
  padding: "30px 20px",
  borderRight: "1px solid rgba(0,0,0,0.08)"
};

const profileSection = {
  marginBottom: 25,
  display: "flex",
  flexDirection: "column",
  alignItems: "center"
};

const profileImageStyle = {
  width: "100%",
  height: 200,
  borderRadius: 18,
  objectFit: "cover",
  cursor: "pointer",
  border: "3px solid #4f46e5"
};

const changeText = {
  fontSize: 13,
  marginTop: 10,
  cursor: "pointer"
};

const logoutBtn = {
  marginTop: 12,
  padding: "8px 18px",
  background: "#ef4444",
  color: "white",
  border: "none",
  borderRadius: 8,
  cursor: "pointer",
  fontWeight: 600,
  width: "70%"
};

const sidebarTitle = {
  fontSize: 18,
  fontWeight: 700,
  marginBottom: 20
};

const content = {
  flex: 1,
  padding: "60px 40px",
  overflowX: "auto"
};

const menuItem = {
  marginBottom: 10,
  padding: "8px 10px",
  cursor: "pointer"
};

const activeItem = {
  background: "rgba(255,255,255,0.4)",
  borderLeft: "3px solid #4f46e5",
  fontWeight: 600
};