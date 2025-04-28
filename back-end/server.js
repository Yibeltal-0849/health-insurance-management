const app = require("./app");
const db = require("./config/db");
const dotenv = require("dotenv");

dotenv.config();

const PORT = process.env.PORT || 6000;

// Test database connection
db.getConnection()
  .then((connection) => {
    console.log("Connected to MySQL database");
    connection.release();

    // Start server
    app.listen(PORT, () => {
      console.log(`Server running on port http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Database connection failed:", err);
    process.exit(1);
  });
