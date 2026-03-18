const Upload = require("../models/Upload");
const calculateCredits = require("../services/creditCalculator");
const path = require("path");

/* =====================================================
   CREATE UPLOAD
===================================================== */

exports.createUpload = async (req, res) => {

try {

if (!["FACULTY","HOD","ADMIN"].includes(req.user.role)) {
return res.status(403).json({ message: "Not allowed to upload" });
}

const body = { ...req.body };

Object.keys(body).forEach(key => {
  if (Array.isArray(body[key])) {
    body[key] = body[key][0];
  }
});

/* ensure category is read correctly */

/* CATEGORY FROM ROUTE */

const category = req.params.category?.trim();

const title = body.title || "";

const metadata = { ...body };
delete metadata.title;
delete metadata.category;
delete metadata.faculty;
delete metadata.credits;

/* FILE */

let relativePath="";

if(req.files && req.files.length>0){

const mainFile = req.files.find(f=>f.fieldname==="file");

if(mainFile){

relativePath = path.relative(
path.join(__dirname,".."),
mainFile.path
).replace(/\\/g,"/");

}

}


/* CREDITS */

/* CREDITS */

const credits = await calculateCredits({
category,
metadata
});


/* STATUS FLOW */

let status;

if(req.user.role === "FACULTY"){
status = "FACULTY_SUBMITTED";
}

if(req.user.role === "HOD"){
status = "HOD_SUBMITTED";
}

if(req.user.role === "ADMIN"){
status = "ADMIN_APPROVED";
}


/* CREATE DOCUMENT */

const upload = await Upload.create({

faculty: req.user.id,

createdByRole: req.user.role,

department: req.user.department || "",

category,

title,

credits,

metadata,

filePath: relativePath,

status

});

res.status(201).json({
message:"Upload submitted successfully",
upload
});

}catch(err){

console.error(err);

res.status(500).json({
message:"Upload failed"
});

}

};



/* =====================================================
   GET MY UPLOADS
===================================================== */

exports.getMyUploads = async(req,res)=>{

try{

const userId = req.user.id;

const uploads = await Upload.find({
faculty:userId
}).sort({createdAt:-1});

res.json(uploads);

}catch(err){

console.error(err);

res.status(500).json({
message:"Fetch failed"
});

}

};



/* =====================================================
   UPDATE & RESUBMIT
===================================================== */
/* =====================================================
   UPDATE & RESUBMIT
===================================================== */

exports.updateUpload = async (req, res) => {

try {

const uploadDoc = await Upload.findById(req.params.id);

if(!uploadDoc){
return res.status(404).json({message:"Upload not found"});
}

const userId = req.user.id;

if(uploadDoc.faculty.toString() !== userId){
return res.status(403).json({message:"Not allowed"});
}

const body = { ...req.body };

Object.keys(body).forEach(key => {
if (Array.isArray(body[key])) {
body[key] = body[key][0];
}
});

/* CATEGORY FROM ROUTE */

const category = req.params.category;

/* TITLE */

const title = body.title || "";


/* METADATA (MERGE OLD + NEW TO PREVENT DATA LOSS) */

const metadata = { ...(uploadDoc.metadata || {}) };

Object.keys(body).forEach(key => {

  if(key === "title") return;

  const value = body[key];

  if(value !== "" && value !== null && value !== undefined){
    metadata[key] = value;
  }

});

/* ================= DETECT CHANGED FIELDS ================= */

const changedFields = [];

const oldMetadata = uploadDoc.metadata || {};

/* CHECK METADATA FIELDS */

const allKeys = new Set([
...Object.keys(oldMetadata),
...Object.keys(metadata)
]);

allKeys.forEach(key => {

const oldValue = (oldMetadata[key] ?? "").toString().trim();
const newValue = (metadata[key] ?? "").toString().trim();

if(oldValue !== newValue){
changedFields.push(key);
}

});

/* CHECK TITLE CHANGE */

if((uploadDoc.title || "").toString().trim() !== title.toString().trim()){
changedFields.push("title");
}

/* STORE CHANGE HISTORY */

uploadDoc.previousMetadata = { ...oldMetadata };
uploadDoc.metadata = metadata;
uploadDoc.changedFields = changedFields;

/* RECALCULATE CREDITS */

uploadDoc.credits = await calculateCredits({
category,
metadata
});

/* UPDATE BASIC FIELDS */

uploadDoc.category = category;
uploadDoc.title = title;

/* STATUS RESET */

if(req.user.role === "FACULTY"){
uploadDoc.status = "FACULTY_SUBMITTED";
}

if(req.user.role === "HOD"){
uploadDoc.status = "HOD_SUBMITTED";
}

/* FILE UPDATE */

if(req.files && req.files.length>0){

let mainFile = req.files.find(f=>f.fieldname==="file");

if(!mainFile){
mainFile = req.files[0];
}

if(mainFile){

const relativePath = path.relative(
path.join(__dirname,".."),
mainFile.path
).replace(/\\/g,"/");

uploadDoc.filePath = relativePath;

}

}

await uploadDoc.save();

res.json({
message:"Upload updated successfully"
});

}catch(err){

console.error(err);

res.status(500).json({
message:"Update failed"
});

}

};


/* =====================================================
   HOD VIEW FACULTY UPLOADS
===================================================== */

exports.getPendingUploadsForHOD = async(req,res)=>{

try{

if(req.user.role!=="HOD"){
return res.status(403).json({message:"Access denied"});
}

const uploads = await Upload.find({
department:req.user.department,
status:"FACULTY_SUBMITTED"
})
.populate("faculty","name employeeId department role")
.sort({createdAt:-1});

res.json(uploads);

}catch(err){

console.error(err);

res.status(500).json({
message:"Error fetching uploads"
});

}

};



/* =====================================================
   HOD APPROVE FACULTY UPLOAD
===================================================== */

exports.approveUploadByHOD = async(req,res)=>{

try{

if(req.user.role!=="HOD"){
return res.status(403).json({message:"Access denied"});
}

const uploadDoc = await Upload.findById(req.params.id);

if(!uploadDoc){
return res.status(404).json({message:"Upload not found"});
}

uploadDoc.status="HOD_APPROVED";

await uploadDoc.save();

res.json({
message:"Approved by HOD"
});

}catch(err){

console.error(err);

res.status(500).json({
message:"Approval failed"
});

}

};



/* =====================================================
   ADMIN VIEW HOD UPLOADS
===================================================== */

exports.getPendingUploadsForAdmin = async(req,res)=>{

try{

if(req.user.role!=="ADMIN"){
return res.status(403).json({message:"Access denied"});
}

const uploads = await Upload.find({
status:{$in:["HOD_SUBMITTED","ADMIN_COMMENT"]}
})
.populate("faculty","name employeeId department role")
.sort({createdAt:-1});

res.json(uploads);

}catch(err){

console.error(err);

res.status(500).json({
message:"Error fetching uploads"
});

}

};



/* =====================================================
   ADMIN APPROVE
===================================================== */

exports.approveUploadByAdmin = async(req,res)=>{

try{

if(req.user.role!=="ADMIN"){
return res.status(403).json({message:"Access denied"});
}

const uploadDoc = await Upload.findById(req.params.id);

if(!uploadDoc){
return res.status(404).json({message:"Upload not found"});
}

uploadDoc.status="ADMIN_APPROVED";

await uploadDoc.save();

res.json({
message:"Upload approved by admin"
});

}catch(err){

console.error(err);

res.status(500).json({
message:"Admin approval failed"
});

}

};



/* =====================================================
   DISCUSSION / COMMENT
===================================================== */

exports.callForDiscussion = async(req,res)=>{

try{

if(!["HOD","ADMIN"].includes(req.user.role)){
return res.status(403).json({message:"Not allowed"});
}

const uploadDoc = await Upload.findById(req.params.id);

if(!uploadDoc){
return res.status(404).json({message:"Upload not found"});
}

if(req.user.role === "HOD"){

uploadDoc.hodComment = req.body.comment || "";
uploadDoc.status = "HOD_COMMENT";

}

if(req.user.role === "ADMIN"){

uploadDoc.adminComment = req.body.comment || "";
uploadDoc.status = "ADMIN_COMMENT";

}

await uploadDoc.save();

res.json({
message:"Comment added",
upload:uploadDoc
});

}catch(err){

console.error(err);

res.status(500).json({
message:"Discussion failed"
});

}

};



/* =====================================================
   GET UPLOADS BY CATEGORY
===================================================== */

exports.getUploadsByCategory = async (req, res) => {

try {

const { category, facultyId } = req.query;

/* determine whose uploads to fetch */

let targetUser;

if (facultyId) {
  targetUser = facultyId;      // Admin viewing someone
} else {
  targetUser = req.user.id;    // Logged-in user
}

const uploads = await Upload.find({
  category,
  faculty: targetUser
}).sort({ createdAt: -1 });

res.json(uploads);

} catch (err) {

console.error(err);

res.status(500).json({
message: "Fetch failed"
});

}

};

/* =====================================================
   GET FACULTY UPLOADS
===================================================== */
exports.getFacultyUploads = async (req, res) => {

try {

const facultyId = req.params.facultyId;

const uploads = await Upload.find({
  faculty: facultyId,
  createdByRole: { $in: ["FACULTY", "HOD"] }
}).sort({ createdAt: -1 });

res.json(uploads);

} catch (error) {

console.error(error);

res.status(500).json({
message: "Server error"
});

}

};

exports.getDepartmentUploads = async (req, res) => {

  try {

    if (!["HOD","ADMIN"].includes(req.user.role)) {
      return res.status(403).json({ message: "Access denied" });
    }

    /* QUERY LOGIC */

    let query = {
      status: {
        $in: [
          "FACULTY_SUBMITTED",
          "HOD_SUBMITTED",
          "HOD_APPROVED",
          "ADMIN_APPROVED"
        ]
      }
    };

    /* HOD sees only their department */

    if (req.user.role === "HOD") {
      query.department = req.user.department;
    }

    const uploads = await Upload.find(query).sort({ createdAt: -1 });

    const Faculty = require("../models/Faculty");
    const HOD = require("../models/HOD");

    const formattedUploads = await Promise.all(

      uploads.map(async (upload) => {

        let user;

        if (upload.createdByRole === "FACULTY") {
          user = await Faculty.findById(upload.faculty)
            .select("name employeeId");
        }

        if (upload.createdByRole === "HOD") {
          user = await HOD.findById(upload.faculty)
            .select("name employeeId");
        }

        return {
          ...upload.toObject(),
          faculty: user
        };

      })

    );

    res.json(formattedUploads);

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message: "Server error"
    });

  }

};