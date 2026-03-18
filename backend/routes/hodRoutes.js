const router = require("express").Router();
const authMiddleware = require("../middleware/authMiddleware");
const hodController = require("../controllers/hodController");
const uploadController = require("../controllers/uploadController");

/* =====================================================
   HOD PROFILE
===================================================== */

router.get(
  "/profile",
  authMiddleware,
  hodController.getHodProfile
);

/* =====================================================
   FACULTY MANAGEMENT
===================================================== */

// GET PENDING FACULTY
router.get(
  "/pending-faculty",
  authMiddleware,
  hodController.getPendingFaculty
);

// GET APPROVED FACULTY (FOR VIEW DASHBOARD)
router.get(
  "/faculty-list",
  authMiddleware,
  hodController.getApprovedFaculty
);

// APPROVE FACULTY
router.put(
  "/approve-faculty/:id",
  authMiddleware,
  hodController.approveFaculty
);

// CALL FACULTY FOR DISCUSSION
router.put(
  "/discussion-faculty/:id",
  authMiddleware,
  hodController.discussionFaculty
);


/* =====================================================
   RESEARCH UPLOAD MANAGEMENT
===================================================== */

// GET PENDING UPLOADS FOR HOD
router.get(
  "/pending-uploads",
  authMiddleware,
  uploadController.getPendingUploadsForHOD
);

// APPROVE UPLOAD
router.put(
  "/approve-upload/:id",
  authMiddleware,
  uploadController.approveUploadByHOD
);

// CALL FOR DISCUSSION (UPLOAD)
router.put(
  "/discussion/:id",
  authMiddleware,
  uploadController.callForDiscussion
);

/* =====================================================
   GET FACULTY DASHBOARD DATA
===================================================== */

router.get(
  "/faculty-uploads/:facultyId",
  authMiddleware,
  hodController.getFacultyUploads
);
router.get(
  "/department-uploads",
  authMiddleware,
  uploadController.getDepartmentUploads
);

module.exports = router;