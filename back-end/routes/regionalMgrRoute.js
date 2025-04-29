const express = require("express");
const router = express.Router();
const { updateUser, deleteUser } = require("../controllers/userController");
const {
  authenticate,
  canUpdateZoneManager,
  canDeleteZoneManager,
} = require("../middlewares/authMiddleware");

// Update user
router.put("/:id", authenticate, canUpdateZoneManager, updateUser);

// Delete user
router.delete("/:id", authenticate, canDeleteZoneManager, deleteUser);

module.exports = router;
