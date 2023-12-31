// pages/api/form.js

import { Pool } from 'pg';
import cors from 'cors';
import nodemailer from 'nodemailer';

// const corsMiddleware = cors({
//   origin: '*',
//   methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
//   credentials: true,
// });

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgres://default:E1g7HuMAkcRn@ep-billowing-boat-04198773.eu-central-1.postgres.vercel-storage.com:5432/verceldb',
  ssl: {
    rejectUnauthorized: false, // For testing purposes only. In production, set to true.
  },
});

export default async function handler(req, res) {
  // corsMiddleware(req, res);
  // Set CORS headers for all routes
  res.setHeader('Access-Control-Allow-Origin', '*');

   res.setHeader('Access-Control-Allow-Credentials', true);
   res.setHeader('Access-Control-Allow-Origin', '*');
   res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
   res.setHeader(
     'Access-Control-Allow-Headers',
     'Origin, X-Requested-With, Content-Type, Accept, Authorization'
   );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }
  if (req.method === 'POST') {
    try {
      const { name, email, people, note } = req.body;

      const result = await pool.query(
        'INSERT INTO your_table (name, email, people, note) VALUES ($1, $2, $3, $4)',
        [name, email, people, note]
      );

      await sendConfirmationEmail(name, email);

      res.status(200).json({ status: 'success', message: 'Form submission saved' });
    } catch (error) {
      console.error('Error executing query', error);
      res.status(500).json({ status: 'error', message: 'Error saving form submission' });
    }
   } else if (req.method === 'GET') {
     try {
       const result = await pool.query('SELECT * FROM your_table');
       const data = result.rows;
       res.status(200).json({ status: 'success', data });
     } catch (error) {
       console.error('Error executing query', error);
       res.status(500).json({ status: 'error', message: 'Error retrieving data' });
     }
  } else {
    res.status(405).json({ status: 'error', message: 'pippo' });
  }
  async function sendConfirmationEmail(name, email) {
    const transporter = nodemailer.createTransport({
      host: 'smtp.zoho.eu',
      port: 465,
      secure: true, //ssl
      auth: {
        user:process.env.EMAIL_USER,
        pass:process.env.EMAIL_PASS
    }
    });

    const mailOptions = {
      from: 'gianlucaeannasposi@zohomail.eu',
      to: email,
      subject: 'Conferma di partecipazione',
      text: `Ciao,\n\ngrazie per aver confermato la partecipazione alle nozze di Gianluca e Anna.\nTi ricordiamo che la data dell'evento è il 13 luglio 2024 e si svolgerà a Rieti. La cerimonia sarà presso il Santuario di Poggio Bustone, mentre la cena sarà a Colle Aluffi.Per ulteriori info consulta il sito www.gianlucaeannasposi.it.\nNon vediamo l'ora di vederti\n\nGianluca e Anna`,
    };

    // Send the email
    await transporter.sendMail(mailOptions);
  }
}
