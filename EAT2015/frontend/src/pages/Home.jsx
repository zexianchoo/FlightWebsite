import React, { useEffect, useState } from "react";
import AsyncSelect from 'react-select/async';
import axios from 'axios';
import { Navigate, useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

export const Home = () => {
  const [startDate, setStartDate] = useState('2015-01-01');
  const [endDate, setEndDate] = useState('2015-12-31');
  const [dayOfWeek, setDayOfWeek] = useState('NA');
  const [selectedAirline, setSelectedAirline] = useState({});
  const [airlineData, setAirlineData] = useState({});

  const handleSearch = () => {
    console.log('Start Date:', startDate);
    console.log('End Date:', endDate);
    console.log('Day of Week:', dayOfWeek);
    axios.put("http://127.0.0.1:5000/get_advanced/", null, {
      params: {
        startDate: startDate,
        endDate: endDate,
        dayOfWeek: dayOfWeek,
        user_id: account,
      }}).then(function (response) {
        console.log(response.data)

        document.getElementById("data").innerHTML = JSON.stringify(response.data)
      })

  };


  const customStyles = {
    option: (provided, state) => ({
      ...provided,
      borderBottom: '1px dotted pink',
      color: state.isSelected ? 'red' : 'blue',
      padding: 20,
    }),
    control: () => ({
      width: 200,
    }),
    singleValue: (provided, state) => {
      const opacity = state.isDisabled ? 0.5 : 1;
      const transition = 'opacity 300ms';
  
      return { ...provided, opacity, transition };
    }
  }

  const handleAirlineChange = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:5000/get_all_airlines", {
      });
       
      const data = response.data;

      const options = data.map((route) => ({
        label: route.AIRLINE,
        value: route.IATA_CODE,
      }));
      console.log('Options:', options);
      return options;
    } catch (error) {
      console.error('Error fetching options:', error.message);
      return [];
    }
  };


  useEffect(() => {
    console.log("Selected Airline changed:", selectedAirline);

    const getAirline = async (airline_name) => {
      try {
        const response = await axios.get("http://127.0.0.1:5000/get_airline", {
          params: { airline_name }
        });
  
        const data = response.data;
  
        console.log("Data:", data);
        return data;
      } catch (error) {
        console.error("Error fetching airline data:", error);
      }
    };
  
    if (selectedAirline !== undefined) {
      getAirline(selectedAirline.value).then(data => {
        setAirlineData(data);
      });
    }
  
  }, [selectedAirline]);


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
        <Link to="/ChangeEmail">Change Email</Link>
      </>)
    } else {
      return <></>
    }
  }
  
  return (
    <main className='sm:relative flex-col h-screen'>
      <Buttons></Buttons> 
      <h1 className='py-20 font-bold'>Evaluation of Airlines Tool 2015 (EAT 2015)</h1>
      <div className='flex-col space-y-20'>
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
        <div id="data"></div>

        </div>
        <div>
          <h1 className='font-light'>Search for your favorite airline below!</h1>
          <h2 className="py-2 text-xl"> Choose Airline: </h2> 
          <AsyncSelect 
              value={selectedAirline}
              onChange={(newInputValue) => setSelectedAirline(newInputValue)}
              className="select-airline bg-slate-900 font-extrabold font-blue" 
              loadOptions={handleAirlineChange}
              styles={customStyles}
          />
        </div>
        {Array.isArray(airlineData) && airlineData.length > 0 && (
        <table>
        <thead>
          <tr>
            <th>Date of Flight</th>
            <th>Origin Airport IATA</th>
            <th>Destination Airport IATA</th>
            <th>Scheduled Departure</th>
            <th>Departure Time</th>
            <th>Scheduled Time</th>
            <th>Scheduled Arrival</th>
            <th>Arrival Time</th>
          </tr>
        </thead>
        <tbody>
          {Array.isArray(airlineData) && airlineData.slice(1).map((row, rowIndex) => (
            <tr key={rowIndex}>
              {Array.isArray(row) && row.map((cell, cellIndex) => (
                cellIndex !== 0 && cellIndex !==2 && cellIndex !== 8 && cellIndex !== 9 && (
                  <td key={cellIndex}>{cell}</td>
                )
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      )}
      </div>
      
    </main>
  );q
}

export default Home;
