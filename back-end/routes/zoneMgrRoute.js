const express = require("express");
const router = express.Router();
const { updateUser, deleteUser } = require("../controllers/userController");
const {
  authenticate,
  canUpdateWoredaManager,

  canDeleteWoredaManager,
} = require("../middlewares/authMiddleware");

// Update user
router.put("/:id", authenticate, canUpdateWoredaManager, updateUser);

// Delete user
router.delete("/:id", authenticate, canDeleteWoredaManager, deleteUser);

module.exports = router;
