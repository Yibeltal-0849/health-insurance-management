const express = require("express");
const router = express.Router();
const registerFamilyMember = require("../controllers/familyController");
const upload = require("../helpers/upload");
const {
  authenticate,
  canRegisterFamilyMember,
} = require("../middlewares/authMiddleware");

router.post(
  "/family-members/register",
  authenticate,
  canRegisterFamilyMember,
  upload.single("photo"),
  registerFamilyMember
);

module.exports = router;
