// pages/api/form.js
const express = require('express');
const next = require('next');
const cors = require('cors');
import { Pool } from 'pg';
const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();
app.prepare().then(() => {
  const server = express();

  // Use the cors middleware
  server.use(cors());

  // Define your API routes or other server logic here
  server.get('/api/data', (req, res) => {
    // Your API logic here
    res.json({ data: 'Hello from the API!' });
  });

  // Default Next.js handler
  server.all('*', (req, res) => {
    return handle(req, res);
  });

  const PORT = process.env.PORT || 3000;

  server.listen(PORT, (err) => {
    if (err) throw err;
    console.log(`> Ready on http://localhost:${PORT}`);
  });
});

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgres://default:E1g7HuMAkcRn@ep-billowing-boat-04198773.eu-central-1.postgres.vercel-storage.com:5432/verceldb',
  ssl: {
    rejectUnauthorized: false, // For testing purposes only. In production, set to true.
  },
});

export default async function handler(req, res) {
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
    res.status(405).json({ status: 'error', message: 'Method Not Allowed' });
  }
}
