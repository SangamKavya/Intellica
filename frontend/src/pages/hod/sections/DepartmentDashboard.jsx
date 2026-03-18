import { useMemo, useState, useRef } from "react";

function DepartmentDashboard({ uploads }) {

const [selectedCategory,setSelectedCategory] = useState(null);

/* ================= FILTER STATES ================= */

const [searchName,setSearchName] = useState("");
const [searchEmpId,setSearchEmpId] = useState("");
const [yearFilter,setYearFilter] = useState("");
const [categoryFilter,setCategoryFilter] = useState("");

const tableRef = useRef(null);

/* ================= TOTAL CREDITS ================= */

const totalCredits = useMemo(()=>{

return uploads.reduce((sum,u)=>sum+(u.credits || 0),0);

},[uploads]);

/* ================= CATEGORY CREDIT ================= */

const byCategory = (category) => {

return uploads
.filter(u => (u.category || "").toLowerCase() === category.toLowerCase())
.reduce((sum,u)=>sum+(u.credits || 0),0);

};

/* ================= CATEGORY MAP ================= */

const categoryCredits = {

publication:byCategory("publication"),
conference:byCategory("conference"),
workshop:byCategory("workshop"),
fdp:byCategory("fdp"),
book:byCategory("book"),
nptel:byCategory("nptel"),
seminar:byCategory("seminar"),
webinar:byCategory("webinar"),
guestlecture:byCategory("guestlecture"),
honorsawards:byCategory("honorsawards"),
certification:byCategory("certification"),
researchpolicy:byCategory("researchpolicy"),
membership:byCategory("membership"),
ipr:byCategory("ipr"),
consultancy:byCategory("consultancy"),
incubation:byCategory("incubation"),
researchprojects:byCategory("researchprojects"),
doctoralthesis:byCategory("doctoralthesis"),
mous:byCategory("mous")

};

/* ================= UNIQUE YEARS ================= */

const years = useMemo(() => {

const ys = uploads
.map(u => new Date(u.createdAt).getFullYear())
.filter(Boolean);

return [...new Set(ys)];

},[uploads]);

/* ================= CARD CLICK ================= */

const openCategory = (category) => {

setSelectedCategory(category);

setTimeout(()=>{
tableRef.current?.scrollIntoView({
behavior:"smooth",
block:"start"
});
},100);

};

/* ================= FILTER TABLE ================= */

const categoryUploads = uploads.filter(u => {

if(!selectedCategory) return false;

if(selectedCategory !== "all" && (u.category || "").toLowerCase() !== selectedCategory)
return false;

/* EMPLOYEE FILTER */

if(searchEmpId &&
!(u.faculty?.employeeId || u.employeeId || "")
.toLowerCase()
.includes(searchEmpId.toLowerCase()))
return false;

/* NAME FILTER */

if(searchName &&
!(u.faculty?.name || u.name || "")
.toLowerCase()
.includes(searchName.toLowerCase()))
return false;

/* YEAR FILTER */

if(yearFilter){

const year = new Date(u.createdAt).getFullYear();

if(year.toString() !== yearFilter) return false;

}

/* CATEGORY FILTER */

if(categoryFilter &&
(u.category || "").toLowerCase() !== categoryFilter.toLowerCase())
return false;

return true;

});

/* ================= TITLE ================= */

const getTitle = (item) => {

return (

item.metadata?.courseName ||
item.metadata?.policyName ||
item.metadata?.awardName ||
item.metadata?.paperTitle ||
item.metadata?.conferenceTitle ||
item.metadata?.conferenceName ||
item.metadata?.title ||
item.metadata?.bookTitle ||
item.metadata?.startupName ||
item.title ||
"-"

);

};

/* ================= CSV DOWNLOAD ================= */

const downloadCSV = (data) => {

if(!data.length) return;

const rows = data.map(item=>({

employeeId:item.faculty?.employeeId || item.employeeId || "",
name:item.faculty?.name || item.name || "",
category:item.category,
title:getTitle(item),
credits:item.credits,
year:new Date(item.createdAt).getFullYear()

}));

const header = Object.keys(rows[0]).join(",");

const csv = [
header,
...rows.map(r=>Object.values(r).join(","))
].join("\n");

const blob = new Blob([csv],{type:"text/csv"});
const url = URL.createObjectURL(blob);

const a = document.createElement("a");
a.href = url;
a.download = "department_activities.csv";
a.click();

};

/* ================= UI ================= */

return (

<div>

<h2>Department Academic Performance</h2>

{/* ================= SUMMARY ================= */}

<div style={summaryRow}>

<SummaryCard title="Total Department Credits" value={totalCredits} />

<SummaryCard
title="Total Activities"
value={uploads.length}
onClick={()=>openCategory("all")}
/>

<SummaryCard title="Department Rank" value="—" />

</div>

{/* ================= CATEGORY CARDS ================= */}

<div style={cardGrid}>

<CategoryCard title="Publications" value={categoryCredits.publication} onClick={()=>openCategory("publication")} />
<CategoryCard title="Conferences" value={categoryCredits.conference} onClick={()=>openCategory("conference")} />
<CategoryCard title="Workshops" value={categoryCredits.workshop} onClick={()=>openCategory("workshop")} />
<CategoryCard title="FDP" value={categoryCredits.fdp} onClick={()=>openCategory("fdp")} />
<CategoryCard title="Books" value={categoryCredits.book} onClick={()=>openCategory("book")} />
<CategoryCard title="NPTEL" value={categoryCredits.nptel} onClick={()=>openCategory("nptel")} />
<CategoryCard title="Seminars" value={categoryCredits.seminar} onClick={()=>openCategory("seminar")} />
<CategoryCard title="Webinars" value={categoryCredits.webinar} onClick={()=>openCategory("webinar")} />
<CategoryCard title="Guest Lectures" value={categoryCredits.guestlecture} onClick={()=>openCategory("guestlecture")} />
<CategoryCard title="Awards" value={categoryCredits.honorsawards} onClick={()=>openCategory("honorsawards")} />
<CategoryCard title="Certifications" value={categoryCredits.certification} onClick={()=>openCategory("certification")} />
<CategoryCard title="Research Policy" value={categoryCredits.researchpolicy} onClick={()=>openCategory("researchpolicy")} />
<CategoryCard title="Memberships" value={categoryCredits.membership} onClick={()=>openCategory("membership")} />
<CategoryCard title="IPR" value={categoryCredits.ipr} onClick={()=>openCategory("ipr")} />
<CategoryCard title="Consultancy" value={categoryCredits.consultancy} onClick={()=>openCategory("consultancy")} />
<CategoryCard title="Incubation" value={categoryCredits.incubation} onClick={()=>openCategory("incubation")} />
<CategoryCard title="Projects" value={categoryCredits.researchprojects} onClick={()=>openCategory("researchprojects")} />
<CategoryCard title="Doctoral Thesis" value={categoryCredits.doctoralthesis} onClick={()=>openCategory("doctoralthesis")} />
<CategoryCard title="MOUs" value={categoryCredits.mous} onClick={()=>openCategory("mous")} />

</div>

{/* ================= TABLE ================= */}

{selectedCategory && (

<div ref={tableRef} style={{marginTop:50}}>

<h3>{selectedCategory.toUpperCase()} Activities</h3>

{/* ================= FILTER BAR ================= */}

<div style={filterBar}>

<input
placeholder="Search Name"
value={searchName}
onChange={e=>setSearchName(e.target.value)}
style={filterInput}
/>

<input
placeholder="Employee ID"
value={searchEmpId}
onChange={e=>setSearchEmpId(e.target.value)}
style={filterInput}
/>

<select
value={yearFilter}
onChange={e=>setYearFilter(e.target.value)}
style={filterInput}
>
<option value="">All Years</option>
{years.map(y=>(
<option key={y} value={y}>{y}</option>
))}
</select>

<select
value={categoryFilter}
onChange={e=>setCategoryFilter(e.target.value)}
style={filterInput}
>
<option value="">All Categories</option>
{Object.keys(categoryCredits).map(cat=>(
<option key={cat} value={cat}>{cat}</option>
))}
</select>

<button style={downloadBtn} onClick={()=>downloadCSV(categoryUploads)}>
Download CSV
</button>

</div>

<table style={table}>

<thead>

<tr>
<th style={th}>Employee ID</th>
<th style={th}>Name</th>
<th style={th}>Category</th>
<th style={th}>Title</th>
<th style={th}>Credits</th>
</tr>

</thead>

<tbody>

{categoryUploads.map(item=>(

<tr key={item._id}>
<td style={td}>{item.faculty?.employeeId || item.employeeId || "-"}</td>
<td style={td}>{item.faculty?.name || item.name || "-"}</td>
<td style={td}>{item.category}</td>
<td style={td}>{getTitle(item)}</td>
<td style={td}>{item.credits}</td>
</tr>

))}

</tbody>

</table>

</div>

)}

</div>

);

}

export default DepartmentDashboard;

/* ================= COMPONENTS ================= */

function SummaryCard({title,value,onClick}){

const [hover,setHover] = useState(false);

return(

<div
style={{
...summaryCard,
cursor:"pointer",
...(hover?summaryHover:{})
}}
onMouseEnter={()=>setHover(true)}
onMouseLeave={()=>setHover(false)}
onClick={onClick}
>

<h2>{value}</h2>
<p>{title}</p>

</div>

);

}

function CategoryCard({title,value,onClick}){

const [hover,setHover] = useState(false);

return(

<div
style={{
...categoryCard,
...(hover?categoryHover:{})
}}
onMouseEnter={()=>setHover(true)}
onMouseLeave={()=>setHover(false)}
onClick={onClick}
>

<h3>{title}</h3>
<p>Credits Earned</p>
<h2>{value}</h2>

</div>

);

}

/* ================= STYLES ================= */

const summaryRow={
display:"flex",
gap:20,
marginTop:20
};

const summaryCard={
width:220,
height:110,
background:"white",
borderRadius:12,
display:"flex",
flexDirection:"column",
justifyContent:"center",
alignItems:"center",
boxShadow:"0 4px 12px rgba(0,0,0,0.08)"
};

const cardGrid={
display:"flex",
flexWrap:"wrap",
gap:20,
marginTop:30
};

const categoryCard={
width:220,
height:120,
background:"white",
borderRadius:12,
padding:20,
cursor:"pointer",
transition:"all 0.2s ease",
boxShadow:"0 4px 12px rgba(0,0,0,0.08)"
};

const categoryHover={
transform:"translateY(-6px)",
boxShadow:"0 8px 20px rgba(0,0,0,0.15)"
};

const filterBar={
display:"flex",
gap:12,
marginBottom:15,
flexWrap:"wrap"
};

const filterInput={
padding:8,
borderRadius:6,
border:"1px solid #ccc"
};

const downloadBtn={
background:"#2563eb",
color:"white",
border:"none",
padding:"8px 14px",
borderRadius:6,
cursor:"pointer"
};

const table={
width:"100%",
borderCollapse:"collapse",
marginTop:20
};

const th={
border:"1px solid #ddd",
padding:10,
background:"#f3f4f6"
};

const td={
border:"1px solid #ddd",
padding:10
};

const summaryHover={
transform:"translateY(-5px)",
boxShadow:"0 8px 18px rgba(0,0,0,0.15)"
};