import axios from 'axios';
import React, { useState } from 'react';
import { Navigate, useNavigate } from "react-router-dom";

export const Home = () => {
  const [startDate, setStartDate] = useState('2015-01-01');
  const [endDate, setEndDate] = useState('2015-12-31');
  const [dayOfWeek, setDayOfWeek] = useState('NA');

  const handleSearch = () => {
    console.log('Start Date:', startDate);
    console.log('End Date:', endDate);
    console.log('Day of Week:', dayOfWeek);
    // make a request to the backend with the startDate, endDate, and dayOfWeek after API is written
  };

  const account = localStorage.getItem("token")
  const navigate = useNavigate();

  const SignOut = (e) => {
    console.log(account)
    localStorage.removeItem("token")
    console.log(localStorage.getItem("token"))
    navigate("/")
  }

  const Deletion = (e) => {
    axios.delete("http://127.0.0.1:5000/del_user/", {
      params: {
        user_id: account,
      }}).then(function (response) {
        SignOut()
      })
    
  }

  function Buttons() {
    if (account) {
      return ( <>
        <button onClick = {SignOut}>Sign Out</button>
        <button onClick = {Deletion}>Delete Account</button>
      </>)
    } else {
      return <></>
    }
  }

  return (
    <main className='sm:relative flex-col h-screen'>   
      <Buttons></Buttons> 
      <h1 className='py-20'>Search for Flight Data in 2015</h1>
      <div className='flex-col space-y-4 items-center h-full text-center'>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '10px' }}>
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
        <div style={{ textAlign: 'center', margin: '10px' }}>
          OR
        </div>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '10px' }}>
          <div>
            <label htmlFor="day-of-week">Day of Week:</label>
            <select 
              id="day-of-week" 
              value={dayOfWeek} 
              onChange={(e) => setDayOfWeek(e.target.value)}
            >
              <option value="NA">N/A</option>
              <option value="Sunday">Sunday</option>
              <option value="Monday">Monday</option>
              <option value="Tuesday">Tuesday</option>
              <option value="Wednesday">Wednesday</option>
              <option value="Thursday">Thursday</option>
              <option value="Friday">Friday</option>
              <option value="Saturday">Saturday</option>
            </select>
          </div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <button onClick={handleSearch}>Search</button>
        </div>
      </div>
    </main>
  );
}

export default Home;
