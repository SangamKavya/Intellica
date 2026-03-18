const ExcelJS = require("exceljs");
const Upload = require("../models/Upload");

/* ================= DOWNLOAD EXCEL ================= */

exports.downloadFacultyReport = async (req, res) => {

try {

const facultyId = req.user.id;

const { category, year } = req.query;

/* BASE FILTER */

let filter = {
facultyId,
status: { $in: ["HOD_APPROVED", "ADMIN_APPROVED"] }
};

/* CATEGORY FILTER */

if (category) {
filter.category = category;
}

/* FETCH DATA */

let uploads = await Upload.find(filter).sort({ createdAt: -1 });

/* YEAR FILTER */

if (year) {
uploads = uploads.filter(u => {

const uploadYear = new Date(u.createdAt).getFullYear();

return uploadYear === Number(year);

});
}

/* CREATE EXCEL */

const workbook = new ExcelJS.Workbook();
const sheet = workbook.addWorksheet("Faculty Activities");

/* HEADER */

sheet.columns = [

{ header: "Category", key: "category", width: 20 },
{ header: "Title", key: "title", width: 40 },
{ header: "Credits", key: "credits", width: 10 },
{ header: "Status", key: "status", width: 15 },
{ header: "Date", key: "date", width: 20 }

];

/* ROWS */

uploads.forEach(upload => {

sheet.addRow({

category: upload.category,
title: upload.title,
credits: upload.credits,
status: upload.status,
date: new Date(upload.createdAt).toLocaleDateString()

});

});

/* RESPONSE */

res.setHeader(
"Content-Type",
"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
);

res.setHeader(
"Content-Disposition",
"attachment; filename=faculty_activities.xlsx"
);

await workbook.xlsx.write(res);

res.end();

} catch (error) {

console.error(error);

res.status(500).json({
message: "Excel download failed"
});

}

};