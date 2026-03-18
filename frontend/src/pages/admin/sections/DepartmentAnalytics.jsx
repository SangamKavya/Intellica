import { useState } from "react";
import * as XLSX from "xlsx";
import {
  Chart as ChartJS,
  ArcElement,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";
import { Doughnut, Bar } from "react-chartjs-2";

ChartJS.register(
  ArcElement,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
);

export default function DepartmentAnalytics() {
  // ✅ ANALYTICS DATA
  const analyticsData = {
    2025: {
      "Paper Publications": [
        { department: "CSE", credits: 55 },
        { department: "ECE", credits: 40 },
        { department: "EEE", credits: 35 },
      ],
      Conferences: [
        { department: "CSE", credits: 30 },
        { department: "ECE", credits: 25 },
        { department: "EEE", credits: 20 },
      ],
      FDPs: [
        { department: "CSE", credits: 20 },
        { department: "ECE", credits: 15 },
        { department: "EEE", credits: 10 },
      ],
      Workshops: [
        { department: "CSE", credits: 25 },
        { department: "ECE", credits: 20 },
        { department: "EEE", credits: 18 },
      ],
      "Guest Lectures": [
        { department: "CSE", credits: 12 },
        { department: "ECE", credits: 10 },
        { department: "EEE", credits: 6 },
      ],
      Books: [
        { department: "CSE", credits: 8 },
        { department: "ECE", credits: 5 },
        { department: "EEE", credits: 4 },
      ],
      "NPTEL Certifications": [
        { department: "CSE", credits: 18 },
        { department: "ECE", credits: 12 },
        { department: "EEE", credits: 10 },
      ],
      Seminars: [
        { department: "CSE", credits: 14 },
        { department: "ECE", credits: 10 },
        { department: "EEE", credits: 8 },
      ],
      Webinars: [
        { department: "CSE", credits: 16 },
        { department: "ECE", credits: 12 },
        { department: "EEE", credits: 10 },
      ],

      // 🔬 R&D
      "Research Policy & RND Committee": [
        { department: "CSE", credits: 10 },
        { department: "ECE", credits: 8 },
        { department: "EEE", credits: 6 },
      ],
      "SEED Money": [
        { department: "CSE", credits: 12 },
        { department: "ECE", credits: 10 },
        { department: "EEE", credits: 8 },
      ],
      "Fellowships / Financial Support": [
        { department: "CSE", credits: 14 },
        { department: "ECE", credits: 10 },
        { department: "EEE", credits: 8 },
      ],
      "Research Grants": [
        { department: "CSE", credits: 20 },
        { department: "ECE", credits: 15 },
        { department: "EEE", credits: 12 },
      ],
      "Research Guides": [
        { department: "CSE", credits: 18 },
        { department: "ECE", credits: 14 },
        { department: "EEE", credits: 10 },
      ],
      IPRs: [
        { department: "CSE", credits: 10 },
        { department: "ECE", credits: 8 },
        { department: "EEE", credits: 6 },
      ],
      "Incubation Centre": [
        { department: "CSE", credits: 8 },
        { department: "ECE", credits: 6 },
        { department: "EEE", credits: 5 },
      ],
      Consultancy: [
        { department: "CSE", credits: 15 },
        { department: "ECE", credits: 12 },
        { department: "EEE", credits: 10 },
      ],
      MOUs: [
        { department: "CSE", credits: 12 },
        { department: "ECE", credits: 10 },
        { department: "EEE", credits: 8 },
      ],
      Patents: [
        { department: "CSE", credits: 22 },
        { department: "ECE", credits: 18 },
        { department: "EEE", credits: 14 },
      ],
    },
  };

  const [selectedYear, setSelectedYear] = useState("2025");
  const [selectedCategory, setSelectedCategory] = useState("All");

  // ✅ DATA PROCESSING
  const departments =
    selectedCategory === "All"
      ? ["CSE", "ECE", "EEE"].map((dept) => {
          let total = 0;
          Object.values(analyticsData[selectedYear]).forEach((cat) => {
            const found = cat.find((d) => d.department === dept);
            if (found) total += found.credits;
          });
          return { department: dept, credits: total };
        })
      : analyticsData[selectedYear][selectedCategory];

  const sortedDepartments = [...departments].sort(
    (a, b) => b.credits - a.credits
  );

  // 🔵 DOUGHNUT (HOD VIEW – SHARE)
  const totalCredits = sortedDepartments.reduce(
    (sum, d) => sum + d.credits,
    0
  );

  const doughnutData = {
    labels: sortedDepartments.map((d) => d.department),
    datasets: [
      {
        data: sortedDepartments.map((d) =>
          ((d.credits / totalCredits) * 100).toFixed(1)
        ),
        backgroundColor: ["#2563eb", "#16a34a", "#f97316"],
      },
    ],
  };

  // 🔽 EXCEL DOWNLOAD
  const downloadExcel = () => {
    const excelData = sortedDepartments.map((d, i) => ({
      Rank: i + 1,
      Department: d.department,
      Credits: d.credits,
      Year: selectedYear,
      Category: selectedCategory,
    }));

    const ws = XLSX.utils.json_to_sheet(excelData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Department Analytics");
    XLSX.writeFile(
      wb,
      `Department_Analytics_${selectedYear}_${selectedCategory}.xlsx`
    );
  };

  return (
    <div>
      {/* HEADER */}
      <div style={headerRow}>
        <div>
          <h2>Department Contribution Analytics</h2>
          <p>Overall contribution share across departments</p>
        </div>
        <button style={downloadBtn} onClick={downloadExcel}>
          ⬇ Download Report
        </button>
      </div>

      {/* FILTERS */}
      <div style={filters}>
        <div>
          <b>Year</b><br />
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
          >
            <option value="2025">2025</option>
          </select>
        </div>

        <div>
          <b>Category</b><br />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="All">All</option>
            {Object.keys(analyticsData[2025]).map((cat) => (
              <option key={cat}>{cat}</option>
            ))}
          </select>
        </div>
      </div>

      {/* CHART */}
      <div style={{ width: 420, marginBottom: 30 }}>
        <Doughnut data={doughnutData} />
      </div>

      {/* TABLE */}
      <table border="1" cellPadding="10" width="60%">
        <thead>
          <tr>
            <th>Rank</th>
            <th>Department</th>
            <th>Total Credits</th>
          </tr>
        </thead>
        <tbody>
          {sortedDepartments.map((d, i) => (
            <tr key={d.department}>
              <td><b>{i + 1}</b></td>
              <td>{d.department}</td>
              <td>{d.credits}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/* ================= STYLES ================= */

const headerRow = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
};

const downloadBtn = {
  padding: "10px 16px",
  backgroundColor: "#2563eb",
  color: "white",
  border: "none",
  borderRadius: 8,
  cursor: "pointer",
};

const filters = {
  display: "flex",
  gap: 20,
  marginBottom: 20,
  background: "#f1f5f9",
  padding: 10,
  borderRadius: 6,
  width: "fit-content",
};
