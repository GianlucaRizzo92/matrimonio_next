// pages/api/form.js

import { Pool } from 'pg';
import cors from 'cors';

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
  console.log('Received request with method:', req.method);
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
  console.log(req)
  if (req.method === 'POST') {
    try {
      const { name, email, people, note } = req.body;

      const result = await pool.query(
        'INSERT INTO your_table (name, email, people, note) VALUES ($1, $2, $3, $4)',
        [name, email, people, note]
      );

      console.log('Form submission saved successfully');
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
       console.log(data);
     } catch (error) {
       console.error('Error executing query', error);
       res.status(500).json({ status: 'error', message: 'Error retrieving data' });
     }
  } else {
    res.status(405).json({ status: 'error', message: 'pippo' });
  }
}
