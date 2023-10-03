// pages/api/form.js

import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'your_database_connection_string',
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
