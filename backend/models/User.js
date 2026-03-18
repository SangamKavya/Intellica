const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    regId: {
      type: String,
      required: true,
      unique: true
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true
    },
    password: {
      type: String,
      required: false,
      default: null,
    },
    role: {
      type: String,
      enum: ["ADMIN"],
      default: "ADMIN"
    },
    isApproved: {
      type: Boolean,
      default: true
    },

    otp: {
      type: String,
      default: null,
    },

    otpExpires: {
      type: Date,
      default: null,
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
