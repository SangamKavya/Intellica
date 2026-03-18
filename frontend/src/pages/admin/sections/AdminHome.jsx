import { useEffect, useState } from "react";

export default function AdminHome({ setView }) {

const [stats,setStats] = useState({
departments:0,
faculties:0,
pendingUploads:0
});

const [topDepartments,setTopDepartments] = useState([]);
const [activityStats,setActivityStats] = useState([]);

const token = localStorage.getItem("token");

/* ================= FETCH DASHBOARD DATA ================= */

useEffect(()=>{

const fetchStats = async()=>{

try{

/* FETCH DEPARTMENTS */

const depRes = await fetch(
"http://localhost:5000/api/admin/departments",
{
headers:{ Authorization:`Bearer ${token}` }
}
);

const depData = await depRes.json();

/* FETCH TOP DEPARTMENTS */

const depRankRes = await fetch(
"http://localhost:5000/api/admin/top-departments",
{
headers:{ Authorization:`Bearer ${token}` }
}
);

const depRankData = await depRankRes.json();
setTopDepartments(depRankData);

/* FETCH ACTIVITY STATS */

const actRes = await fetch(
"http://localhost:5000/api/admin/activity-stats",
{
headers:{ Authorization:`Bearer ${token}` }
}
);

const actData = await actRes.json();
setActivityStats(actData);

/* FETCH PENDING UPLOADS */

const uploadRes = await fetch(
"http://localhost:5000/api/admin/pending-uploads",
{
headers:{ Authorization:`Bearer ${token}` }
}
);

const uploadData = await uploadRes.json();

/* ✅ FIXED FACULTY COUNT (removed wrong + depData.length) */

const facultyCount = Array.isArray(depData)
? depData.reduce((sum,d)=>sum + (d.facultyCount || 0),0)
: 0;

/* ✅ SAFER PENDING COUNT */

const pendingCount = Array.isArray(uploadData)
? uploadData.filter(u => u.status !== "ADMIN_APPROVED").length
: 0;

/* SET DASHBOARD STATS */

setStats({
departments: Array.isArray(depData) ? depData.length : 0,
faculties: facultyCount + (Array.isArray(depData) ? depData.length : 0),
pendingUploads: pendingCount
});

}catch(err){

console.error(err);

}

};

fetchStats();

},[token]);   // ✅ FIXED dependency

/* ================= UI ================= */

return(

<div>

<h2 style={{fontSize:28,marginBottom:5}}>
Welcome, Admin 👋
</h2>

<p style={{opacity:0.7}}>
System overview at a glance
</p>

{/* ================= STATS CARDS ================= */}

<div style={{display:"flex",gap:20,marginTop:30}}>

<StatCard
title="Departments"
value={stats.departments}
onClick={()=>setView("analytics")}
/>

<StatCard
title="Faculty & HOD"
value={stats.faculties}
onClick={()=>setView("faculty")}
/>

<StatCard
title="Pending Approvals"
value={stats.pendingUploads}
onClick={()=>setView("approve")}
/>

</div>

{/* ================= TOP DEPARTMENTS ================= */}

<h3 style={{marginTop:50}}>Top Departments (Credits)</h3>

<div style={{marginTop:15}}>

{topDepartments.map((d,i)=>(

<div key={i} style={deptRow}>

<span>
{i===0?"🥇":i===1?"🥈":i===2?"🥉":`${i+1}.`} {d.department}
</span>

<span style={{marginLeft:8}}>—</span>

<span style={{marginLeft:8,color:"#000000",fontWeight:600}}>
{d.credits} Credits
</span>

</div>

))}

</div>

{/* ================= MOST POPULAR ACTIVITIES ================= */}

<h3 style={{marginTop:40}}>Most Popular Activities</h3>

<div style={{marginTop:15}}>

{activityStats.map((a,i)=>{

const max = Math.max(...activityStats.map(x => x.count),1);

return(

<div key={i} style={activityRow}>

<span style={{width:140,textTransform:"capitalize"}}>
{a.category}
</span>

<div style={barContainer}>

<div
style={{
...barFill,
width:`${(a.count / max) * 220}px`   // ✅ FIXED scaling
}}
></div>

</div>

</div>

);

})}

</div>

</div>

);

}

/* ================= STAT CARD ================= */

function StatCard({title,value,onClick}){

const [hover,setHover] = useState(false);

return(

<div
style={{
...cardStyle,
...(hover?hoverStyle:{})
}}
onClick={onClick}
onMouseEnter={()=>setHover(true)}
onMouseLeave={()=>setHover(false)}
>

<p style={{fontSize:14,color:"#555"}}>
{title}
</p>

<h2 style={{fontSize:28,marginTop:10}}>
{value}
</h2>

</div>

);

}

/* ================= STYLES ================= */

const cardStyle={
padding:20,
borderRadius:15,
minWidth:220,
cursor:"pointer",
transition:"all 0.3s ease",
background:"#ffffff",
boxShadow:"0 4px 15px rgba(0,0,0,0.1)"
};

const hoverStyle={
transform:"translateY(-6px)",
boxShadow:"0 10px 25px rgba(37,99,235,0.4)"
};

const deptRow={
display:"flex",
alignItems:"center",
gap:10,
padding:"8px 0",
fontWeight:500
};

const activityRow={
display:"flex",
alignItems:"center",
gap:10,
marginBottom:10
};

const barContainer={
width:220,
height:10,
background:"#e5e7eb",
borderRadius:6
};

const barFill={
height:"100%",
background:"#2563eb",
borderRadius:6
};