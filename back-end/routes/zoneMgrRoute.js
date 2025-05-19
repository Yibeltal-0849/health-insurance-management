const express = require("express");
const router = express.Router();

const { register } = require("../controllers/authController");
const { updateUser, deleteUser } = require("../controllers/userController");

const {
  authenticate,
  canUpdateWoredaManager,

  canDeleteWoredaManager,
} = require("../middlewares/authMiddleware");
const healthFacilityController = require("../controllers/healthFacilityController");
const {
  canRegisterHealthCenter,
  canRegisterHospital,
} = require("../middlewares/authMiddleware");
const { createKebele } = require("../controllers/locationController");

// Update user
router.put("/:id", authenticate, canUpdateWoredaManager, updateUser);

// Delete user
router.delete("/:id", authenticate, canDeleteWoredaManager, deleteUser);

//register zone's health center
router.post(
  "/zone-health-center/register",
  authenticate,
  // canRegisterHealthCenter,
  healthFacilityController.createHealthCenter
);

//register health center officer
router.post("/zone-health-center-officer/register", authenticate, register);

//register zone's hospital
router.post(
  "/zone-hospital/register",
  authenticate,
  healthFacilityController.createHospital
);
//register zone's health officer for each hospital found in zone
router.post(
  "/zone-hospital-health-center-officer/register",
  authenticate,
  register
);

router.post("/zone-kebele/register", authenticate, createKebele);

router.post("/zone-kebele-health-officer/register", authenticate, register);

module.exports = router;
