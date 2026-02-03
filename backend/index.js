// index.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { Pool } from "pg";
import nodemailer from "nodemailer";

// Load environment variables
dotenv.config();

// Initialize Express
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// PostgreSQL connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Nodemailer transporter
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: parseInt(process.env.EMAIL_PORT),
  secure: false, // true if port 465
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Test email transporter
transporter.verify((error, success) => {
  if (error) console.error("Email transporter error:", error);
  else console.log("Email transporter ready");
});

// Routes
app.get("/api/test", (req, res) => {
  res.json({ message: "API is working!" });
});

// Create order
app.post("/api/orders", async (req, res) => {
  try {
    const { name, email, phone, pets, petCount, startDate, endDate, time, description } = req.body;

    // Insert order into PostgreSQL
    const query = `
      INSERT INTO orders(name, email, phone, pets, pet_count, start_date, end_date, time, description)
      VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9)
      RETURNING id
    `;
    const values = [name, email, phone, pets, petCount, startDate, endDate, time, description];
    const result = await pool.query(query, values);

    // Send email notification
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_TO,
      subject: `New Pet Care Order #${result.rows[0].id}`,
      html: `
        <h2>New Order Received</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone}</p>
        <p><strong>Pets:</strong> ${pets}</p>
        <p><strong>Number of Pets:</strong> ${petCount}</p>
        <p><strong>Start Date:</strong> ${startDate}</p>
        <p><strong>End Date:</strong> ${endDate}</p>
        <p><strong>Time:</strong> ${time}</p>
        <p><strong>Description:</strong> ${description}</p>
      `,
    };

    transporter.sendMail(mailOptions, (err, info) => {
      if (err) console.error("Error sending email:", err);
      else console.log("Email sent:", info.response);
    });

    // Respond to client
    res.json({ success: true, orderId: result.rows[0].id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// Dynamic port
const PORT = process.env.PORT || 5000;

// Start server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
