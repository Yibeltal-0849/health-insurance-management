const express = require("express");
const router = express.Router();
const { updateUser, deleteUser } = require("../controllers/userController");
const {
  authenticate,
  canUpdateKebeleOfficer,

  canDeleteKebeleOfficer,
} = require("../middlewares/authMiddleware");

// Update user
router.put("/:id", authenticate, canUpdateKebeleOfficer, updateUser);

// Delete user
router.delete("/:id", authenticate, canDeleteKebeleOfficer, deleteUser);

module.exports = router;
