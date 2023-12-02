import React, { useState, useEffect } from 'react'
import axios from 'axios';

export const Test = () => {
  const [delays, setDelays] = useState([]);

  useEffect(() => {
    getDelays().then(data => {
      setDelays(data);
    });
  }, []);

  const getDelays = async () => {
    const response = await axios.get("http://127.0.0.1:5000/get_delays");
    return response.data; // Assuming the response is the data you want to display
  };

  return (
    <div>
      <h2>Delays Data</h2>
      <ul>
        {delays.map((delay, index) => (
          <li key={index}>{JSON.stringify(delay)}</li> // Modify this line to format your data as needed
        ))}
      </ul>
    </div>
  )
}
