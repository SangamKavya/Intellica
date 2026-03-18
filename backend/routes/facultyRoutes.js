const router = require("express").Router();

const { getProfile, getFacultyById } = require("../controllers/facultyController");

const authMiddleware = require("../middleware/authMiddleware");

/* Faculty viewing own profile */

router.get("/profile", authMiddleware, getProfile);

/* HOD viewing faculty profile */

router.get("/:id", authMiddleware, getFacultyById);

module.exports = router;