// pages/form.js

import React, { useEffect, useState } from 'react';

const TablePage = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/form');
        const result = await response.json();

        if (response.ok) {
          setData(result.data);
        } else {
          console.error('Error fetching data:', result.message);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      <h1>Form Data</h1>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>People</th>
            <th>Note</th>
          </tr>
        </thead>
        <tbody>
          {data.map((entry) => (
            <tr key={entry.id}>
              <td>{entry.name}</td>
              <td>{entry.email}</td>
              <td>{entry.people}</td>
              <td>{entry.note}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TablePage;
