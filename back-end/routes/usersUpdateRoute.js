const express = require("express");
const router = express.Router();
const { updateUser } = require("../controllers/userController");

// PUT /api/users/:id
router.put("/:id", updateUser);

module.exports = router;
