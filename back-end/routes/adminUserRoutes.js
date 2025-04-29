const express = require("express");
const router = express.Router();
const { updateUser, deleteUser } = require("../controllers/userController");
const {
  authenticate,
  canUpdateRegionalManager,
  canDeleteRegionalManager,
} = require("../middlewares/authMiddleware");

// Update user
router.put("/:id", authenticate, canUpdateRegionalManager, updateUser);

// Delete user
router.delete("/:id", authenticate, canDeleteRegionalManager, deleteUser);

module.exports = router;
