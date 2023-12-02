import React, { useState } from 'react';

export const Home = () => {
  const [startDate, setStartDate] = useState('2015-01-01');
  const [endDate, setEndDate] = useState('2015-12-31');

  const handleSearch = () => {
    console.log('Start Date:', startDate);
    console.log('End Date:', endDate);
    // make a request to the backend with the startDate and endDate after api written 
  };

  return (
    <main>
      <h1>Search for Data in 2015</h1>
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <div>
          <label htmlFor="start-date">Start Date:</label>
          <input 
            id="start-date"
            type="date" 
            value={startDate} 
            onChange={(e) => setStartDate(e.target.value)}
            min="2015-01-01"
            max="2015-12-31"
            style={{ marginRight: '10px' }} 
          />
        </div>
        <div>
          <label htmlFor="end-date">End Date:</label>
          <input 
            id="end-date"
            type="date" 
            value={endDate} 
            onChange={(e) => setEndDate(e.target.value)}
            min="2015-01-01"
            max="2015-12-31"
          />
        </div>
      </div>
      <button onClick={handleSearch}>Search</button>
    </main>
  );
}

export default Home;
