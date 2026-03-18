const express = require("express");
const router = express.Router();
const CreditConfig = require("../models/CreditConfig");

/* GET */
router.get("/:type", async (req, res) => {

  const { type } = req.params;

  const config = await CreditConfig.findOne({ type });

  res.json(config || { config: {} });

});

/* POST */
router.post("/:type", async (req, res) => {
  try {

    const { type } = req.params;

    console.log("TYPE:", type);
    console.log("BODY:", req.body);

    const configData = req.body.config;

    // ❗ CRITICAL FIX
    if (!configData || Object.keys(configData).length === 0) {
      return res.status(400).json({ message: "Config is empty" });
    }

    let existing = await CreditConfig.findOne({ type });

    if (existing) {
      existing.config = configData;
      await existing.save();
    } else {
      await CreditConfig.create({
        type,
        config: configData
      });
    }

    res.json({ message: "Saved successfully" });

  } catch (err) {
    console.error("SAVE ERROR:", err);
    res.status(500).json({ message: "Error saving config" });
  }
});
module.exports = router;   // ✅ THIS LINE FIXES YOUR ERROR