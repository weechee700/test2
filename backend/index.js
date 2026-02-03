
        import express from 'express';
        import cors from 'cors';
        import pkg from 'pg';
        import nodemailer from 'nodemailer';
        import dotenv from 'dotenv';

        dotenv.config();
        const { Pool } = pkg;

        const PORT = process.env.PORT || 5000
        app.listen(PORT, () => console.log(`Server running on ${PORT}`))


        const app = express();
        app.use(cors());
        app.use(express.json());

        const pool = new Pool({
          connectionString: process.env.DATABASE_URL,
        });

        const path = require('path')
        app.use(express.static(path.join(__dirname, '../frontend/dist')))

        app.get('*', (req, res) => {
          res.sendFile(path.join(__dirname, '../frontend/dist/index.html'))
        })

        app.post('/api/orders', async (req, res) => {
          const {
            petType,
            petCount,
            startDate,
            endDate,
            dailyTime,
            description,
            email,
            phone,
            estimatedCost
          } = req.body;

          await pool.query(`
            CREATE TABLE IF NOT EXISTS orders (
              id SERIAL PRIMARY KEY,
              pet_type TEXT,
              pet_count INT,
              start_date DATE,
              end_date DATE,
              daily_time TEXT,
              description TEXT,
              email TEXT,
              phone TEXT,
              estimated_cost NUMERIC,
              created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
          `);

          await pool.query(
            `INSERT INTO orders 
            (pet_type, pet_count, start_date, end_date, daily_time, description, email, phone, estimated_cost)
            VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)`,
            [petType, petCount, startDate, endDate, dailyTime, description, email, phone, estimatedCost]
          );

          const transporter = nodemailer.createTransport({
            host: process.env.EMAIL_HOST,
            port: process.env.EMAIL_PORT,
            secure: false,
            auth: {
              user: process.env.EMAIL_USER,
              pass: process.env.EMAIL_PASS,
            },
          });

          await transporter.sendMail({
            from: `"Pet Care Orders" <${process.env.EMAIL_USER}>`,
            to: process.env.EMAIL_TO,
            subject: "New Pet Care Order",
            text: `New order received:
Pet: ${petType}
Count: ${petCount}
Dates: ${startDate} to ${endDate}
Time: ${dailyTime}
Estimated Cost: $${estimatedCost}
Contact: ${email}, ${phone}
Notes: ${description}`
          });

          res.json({ success: true });
        });

        app.listen(process.env.PORT || 5000, () =>
          console.log('Backend running')
        );
