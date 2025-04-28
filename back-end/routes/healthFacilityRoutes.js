const express = require("express");
const router = express.Router();
const healthFacilityController = require("../controllers/healthFacilityController");
const {
  authenticate,
  canRegisterHealthCenter,
  canRegisterHospital,
} = require("../middlewares/authMiddleware");

router.post(
  "/health-center/register",
  authenticate,
  canRegisterHealthCenter,
  healthFacilityController.createHealthCenter
);
router.post(
  "/hospital",
  authenticate,
  canRegisterHospital,
  healthFacilityController.createHospital
);

module.exports = router;
