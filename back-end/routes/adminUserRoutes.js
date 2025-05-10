const express = require("express");
const router = express.Router();
const {
  updateUser,
  deleteUser,
  updateUserStatus,
  getUsersByRoleAndStatus,
  getUserStatus,
  getPaymentReport,
  getTotalIncomeByCustomerType,
} = require("../controllers/userController");
const {
  authenticate,
  canUpdateRegionalManager,
  canDeleteRegionalManager,
  canUpdateUserStatus,
  canGetUsersByRoleAndStatus,
  canGetTotalUsers,
  canGetPaymentReport,
} = require("../middlewares/authMiddleware");

// Update user
router.put("/:id", authenticate, canUpdateRegionalManager, updateUser);

// Delete user
router.delete("/:id", authenticate, canDeleteRegionalManager, deleteUser);

// Route for updating user status
router.put("/:id/status", authenticate, canUpdateUserStatus, updateUserStatus);

//select users
router.get(
  "/",
  authenticate,
  canGetUsersByRoleAndStatus,
  getUsersByRoleAndStatus
);
//report total user
router.get(
  "/reports/total-users",
  authenticate,
  canGetTotalUsers,
  getUserStatus
);

//payment report
router.get("/payments", authenticate, canGetPaymentReport, getPaymentReport);

// total income from paid and free user
router.get("/payment/total-income", authenticate, getTotalIncomeByCustomerType);
module.exports = router;
