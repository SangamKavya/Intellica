const express = require("express");
const router = express.Router();

const uploadController = require("../controllers/uploadController");
const authMiddleware = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");
const normalizeCategory = require("../middleware/normalizeCategory");
/* =========================================
   CREATE UPLOAD
========================================= */

router.post(
"/create/:category",
authMiddleware,
upload.any(),
uploadController.createUpload
);

/* =========================================
   GET MY UPLOADS
========================================= */

router.get(
"/mine",     // <-- FIXED (frontend uses /mine)
authMiddleware,
uploadController.getMyUploads
);

/* =========================================
   UPDATE UPLOAD
========================================= */

router.put(
"/update/:id/:category",
authMiddleware,
upload.any(),
uploadController.updateUpload
);

/* =========================================
   HOD VIEW FACULTY UPLOADS
========================================= */

router.get(
"/hod/pending",
authMiddleware,
uploadController.getPendingUploadsForHOD
);

/* =========================================
   HOD APPROVE FACULTY UPLOAD
========================================= */

router.put(
"/hod/approve/:id",
authMiddleware,
uploadController.approveUploadByHOD
);

/* =========================================
   ADMIN VIEW HOD UPLOADS
========================================= */

router.get(
"/admin/pending",
authMiddleware,
uploadController.getPendingUploadsForAdmin
);

/* =========================================
   ADMIN APPROVE
========================================= */

router.put(
"/admin/approve/:id",
authMiddleware,
uploadController.approveUploadByAdmin
);

/* =========================================
   COMMENT / DISCUSSION
========================================= */

router.put(
"/discussion/:id",
authMiddleware,
uploadController.callForDiscussion
);

/* =========================================
   FILTER BY CATEGORY
========================================= */

router.get(
"/category",
authMiddleware,
uploadController.getUploadsByCategory
);

/* =========================================
   GET FACULTY UPLOADS
========================================= */

router.get(
"/faculty/:facultyId",
authMiddleware,
uploadController.getFacultyUploads
);
router.post(
  "/create",
  authMiddleware,
  normalizeCategory,
  uploadController.createUpload
);

module.exports = router;