import { useState, useMemo } from "react";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Doughnut } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend);

function DepartmentAnalytics({ uploads = [] }) {
  /* ================= MASTER CATEGORIES ================= */

  const MASTER_CATEGORIES = [
    "Publications",
    "Conferences",
    "FDPs",
    "Workshops",
    "Guest Lectures",
    "Books",
    "NPTEL Certifications",
    "Seminars",
    "Webinars",
    "Research Policy & RND Committee",
    "SEED Money",
    "Fellowships / Financial Support",
    "Research Grants",
    "Research Guides",
    "IPRs",
    "Incubation Centre",
    "Consultancy",
    "MOUs",
    "Patents",
  ];

  /* ================= EXTRACT YEARS SAFELY ================= */

  const years = useMemo(() => {
    const uniqueYears = Array.from(
      new Set(
        uploads
          .map((u) => {
            if (u.year) return String(u.year);
            if (u.monthYear) return u.monthYear.split("-")[0];
            return null;
          })
          .filter(Boolean)
      )
    ).sort();

    return ["All", ...uniqueYears];
  }, [uploads]);

  const [selectedYear, setSelectedYear] = useState("All");
  const [selectedCategory, setSelectedCategory] = useState("All");

  /* ================= FILTER BY YEAR ================= */

  const filteredUploads = useMemo(() => {
    if (selectedYear === "All") return uploads;

    return uploads.filter((u) => {
      const year = u.year
        ? String(u.year)
        : u.monthYear
        ? u.monthYear.split("-")[0]
        : null;

      return year === selectedYear;
    });
  }, [uploads, selectedYear]);

  /* ================= CATEGORY TOTALS ================= */

  const categoryTotals = useMemo(() => {
    const totals = {};
    MASTER_CATEGORIES.forEach((cat) => {
      totals[cat] = filteredUploads
        .filter((u) => u.category === cat)
        .reduce((sum, u) => sum + (u.credits || 0), 0);
    });
    return totals;
  }, [filteredUploads]);

  const totalCredits = Object.values(categoryTotals).reduce(
    (sum, v) => sum + v,
    0
  );

  /* ================= CHART DATA ================= */

  const chartData =
    selectedCategory === "All"
      ? {
          labels: MASTER_CATEGORIES,
          datasets: [
            {
              data: MASTER_CATEGORIES.map(
                (cat) => categoryTotals[cat]
              ),
              backgroundColor: generateProfessionalColors(
                MASTER_CATEGORIES.length
              ),
              borderWidth: 1,
              cutout: "70%",
            },
          ],
        }
      : {
          labels: [selectedCategory, "Other Categories"],
          datasets: [
            {
              data: [
                categoryTotals[selectedCategory] || 0,
                totalCredits -
                  (categoryTotals[selectedCategory] || 0),
              ],
              backgroundColor: ["#4f46e5", "#e5e7eb"],
              cutout: "70%",
            },
          ],
        };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          font: { size: 12 },
          boxWidth: 12,
        },
      },
      tooltip: {
        callbacks: {
          label: (ctx) => {
            const value = ctx.raw;
            const percent = totalCredits
              ? ((value / totalCredits) * 100).toFixed(1)
              : 0;
            return `${ctx.label}: ${value} credits (${percent}%)`;
          },
        },
      },
    },
  };

  /* ================= UI ================= */

  return (
    <div style={pageContainer}>
      <div style={headerSection}>
        <h1 style={title}>Department Analytics</h1>
        <p style={subtitle}>
          Academic contribution overview by year and category
        </p>
      </div>

      {/* FILTER CARD */}
      <div style={filterCard}>
        <div style={filterGroup}>
          <label style={label}>Academic Year</label>
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
            style={select}
          >
            {years.map((y) => (
              <option key={y}>{y}</option>
            ))}
          </select>
        </div>

        <div style={filterGroup}>
          <label style={label}>Category</label>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            style={select}
          >
            <option value="All">All</option>
            {MASTER_CATEGORIES.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
        </div>

        <div style={totalBox}>
          <div style={totalLabel}>Total Credits</div>
          <div style={totalValue}>{totalCredits}</div>
        </div>
      </div>

      {/* CHART CARD */}
      <div style={chartCard}>
        <h3 style={chartTitle}>
          {selectedCategory === "All"
            ? `Category-wise Contribution (${selectedYear})`
            : `${selectedCategory} Contribution (${selectedYear})`}
        </h3>

        <div style={{ width: 420, height: 420, margin: "0 auto" }}>
          <Doughnut data={chartData} options={options} />
        </div>
      </div>
    </div>
  );
}

export default DepartmentAnalytics;

/* ================= COLOR PALETTE ================= */

function generateProfessionalColors(count) {
  const palette = [
    "#4f46e5",
    "#6366f1",
    "#3b82f6",
    "#0ea5e9",
    "#8b5cf6",
    "#a855f7",
    "#2563eb",
    "#9333ea",
    "#7c3aed",
    "#1d4ed8",
  ];
  return Array.from({ length: count }, (_, i) =>
    palette[i % palette.length]
  );
}

/* ================= STYLES ================= */

const pageContainer = {
  width: "100%",
};

const headerSection = {
  marginBottom: 30,
};

const title = {
  fontSize: 26,
  fontWeight: 700,
  color: "#0F172A",
};

const subtitle = {
  fontSize: 14,
  color: "#475569",
  marginTop: 6,
};

const filterCard = {
  background: "white",
  padding: 25,
  borderRadius: 14,
  boxShadow: "0 6px 18px rgba(0,0,0,0.06)",
  display: "flex",
  gap: 30,
  flexWrap: "wrap",
  alignItems: "flex-end",
  marginBottom: 40,
};

const filterGroup = {
  display: "flex",
  flexDirection: "column",
};

const label = {
  fontSize: 13,
  fontWeight: 600,
  marginBottom: 6,
  color: "#334155",
};

const select = {
  padding: "8px 12px",
  borderRadius: 8,
  border: "1px solid #cbd5e1",
  fontSize: 14,
};

const totalBox = {
  marginLeft: "auto",
  textAlign: "right",
};

const totalLabel = {
  fontSize: 13,
  color: "#475569",
};

const totalValue = {
  fontSize: 22,
  fontWeight: 700,
  color: "#4f46e5",
};

const chartCard = {
  background: "white",
  padding: 30,
  borderRadius: 14,
  boxShadow: "0 6px 18px rgba(0,0,0,0.06)",
  maxWidth: 750,
};

const chartTitle = {
  marginBottom: 20,
  fontSize: 16,
  fontWeight: 600,
  color: "#1e293b",
};
