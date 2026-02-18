require("dotenv").config();
const express = require("express");
const cors = require("cors");

const healthRoutes = require("./routes/health.routes");
const databaseRoutes = require("./routes/database.routes");
const authRoutes = require("./routes/auth.routes");

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api", healthRoutes);
app.use("/api", databaseRoutes);
app.use("/api", authRoutes);

app.listen(process.env.PORT || 3001, () => {
  console.log(`Backend running on port ${process.env.PORT || 3001}`);
});
