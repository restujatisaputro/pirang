import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import authRoutes from "./routes/auth.js";
import usersRoutes from "./routes/users.js";
import bookingsRoutes from "./routes/bookings.js";
import borrowingsRoutes from "./routes/borrowings.js";
import crudRoutes from "./routes/crud.js";
import dbdumpRoutes from "./routes/dbdump.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// health
app.get("/", (req, res) => res.json({ ok: true, service: "pija-backend" }));

// mount routes
app.use("/api/auth", authRoutes);
app.use("/api/users", usersRoutes);
app.use("/api/bookings", bookingsRoutes);
app.use("/api/borrowings", borrowingsRoutes);
app.use("/api/crud", crudRoutes);
app.use("/api/dbdump", dbdumpRoutes);

// 404 handler (biar jelas)
app.use((req, res) => res.status(404).json({ message: "Not Found", path: req.path }));

const PORT = Number(process.env.PORT || 3001);
app.listen(PORT, "0.0.0.0", () => console.log(`Backend running on port ${PORT}`));
