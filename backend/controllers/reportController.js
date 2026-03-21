const ExcelJS = require("exceljs");
const Upload = require("../models/Upload");

exports.downloadFacultyReport = async (req, res) => {
  try {

    const facultyId = req.user.id;
    const { category, year } = req.query;

    let filter = {
  faculty: facultyId,   // ✅ FIXED FIELD NAME
  status: { $in: ["HOD_APPROVED", "ADMIN_APPROVED"] }
};

    // ✅ CATEGORY FIX
    if (category && category.trim() !== "") {
  filter.category = new RegExp(category.trim(), "i");
}

    // ✅ YEAR FIX
    if (year && !isNaN(year)) {
      const start = new Date(Number(year), 0, 1);
      const end = new Date(Number(year), 11, 31, 23, 59, 59);

      filter.createdAt = {
        $gte: start,
        $lte: end
      };
    }

    console.log("FINAL FILTER:", filter);

    const uploads = await Upload.find(filter).sort({ createdAt: -1 });

    console.log("FOUND:", uploads.length);

    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet("Faculty Activities");

    sheet.columns = [
      { header: "Category", key: "category", width: 20 },
      { header: "Title", key: "title", width: 40 },
      { header: "Credits", key: "credits", width: 10 },
      { header: "Status", key: "status", width: 15 },
      { header: "Date", key: "date", width: 20 }
    ];

    uploads.forEach(upload => {
      sheet.addRow({
        category: upload.category,
        title: upload.title,
        credits: upload.credits,
        status: upload.status,
        date: new Date(upload.createdAt).toLocaleDateString()
      });
    });

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