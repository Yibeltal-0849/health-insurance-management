const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const helmet = require("helmet");
const app = express();

//routes
const authRoutes = require("./routes/authRoutes");
const locationRoutes = require("./routes/locationRoutes");
const healthFacilityRoutes = require("./routes/healthFacilityRoutes");
const customerFullInfoRoutes = require("./routes/customerRoutes");
const familyRoutes = require("./routes/familyRoutes");
const membershipRoutes = require("./routes/membershipRoute");
const adminUserRoutes = require("./routes/adminUserRoutes");
const regionalMgrRoutes = require("./routes/regionalMgrRoute");
const zoneMgrRoutes = require("./routes/zoneMgrRoute");
const woredaMgrRoutes = require("./routes/woredaMgrRoute");
const membershipPaymentRoute = require("./routes/membershipPaymentRoute");
const usersUpdateRoute = require("./routes/usersUpdateRoute");
const kebelePaidForFreeUserRoute = require("./routes/kebeleMgrRoute");
// Middlewares
app.use(helmet());
app.use(cors());
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// middleware for regular user
app.use("/api/auth", authRoutes);

// middleware for location route
app.use("/api/location", locationRoutes);

//middleware for health facility
app.use("/api", healthFacilityRoutes);

//middleware for customer with full information
app.use("/api/customer", customerFullInfoRoutes);

//middleware for family
app.use("/api/customer", familyRoutes);

//  pay for Membership
app.use("/api", membershipRoutes);

//middleware for admin user controller
app.use("/api/admin/users", adminUserRoutes);

//middleware for user information
app.use("/api/admin", adminUserRoutes);

//middleware for regional health officer
app.use("/api/regional-health-officer/users", regionalMgrRoutes);

//middleware for zone health officer
app.use("/api/zone-health-officer/users", zoneMgrRoutes);

//middleware for woreda health officer to manage user
app.use("/api/woreda-health-officer/users", woredaMgrRoutes);

//middleware for pay money to be membership on health insurance management system
app.use("/api/payment", membershipPaymentRoute);

//kebele pay for free user
app.use("/api/payment", kebelePaidForFreeUserRoute);

//middleware for update user
app.use("/api/users", usersUpdateRoute);

// Health check endpoint
app.get("/health", (req, res) => {
  res.status(200).json({ status: "OK" });
});

// 404 handler
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: "Not Found",
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: "Internal Server Error",
    error: process.env.NODE_ENV === "development" ? err.message : undefined,
  });
});

module.exports = app;
