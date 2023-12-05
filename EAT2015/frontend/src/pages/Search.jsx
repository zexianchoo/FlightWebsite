import React, { useEffect, useState } from "react";
import axios from 'axios';

const Search = () => {

    const [user, setUser] = useState()
    const [token, setToken] = useState()
    const [searches, setSearches] = useState()
    useEffect(() => {
        const loggedInUser = localStorage.getItem("username");
        if (loggedInUser) {
          setUser(loggedInUser);
        }
        const tokenUser= localStorage.getItem("token");
        setToken(tokenUser);
      }, []);

    console.log("token", token)
    console.log("user", user)

    
    const handleSearch = async (token) => {
        try {
            const response = await axios.get("http://127.0.0.1:5000/get_user_search", {
                params: { token }
            });
           
            const data = response.data;
  
            console.log("Data:", data);
            return data;
          } catch (error) {
            console.error("Error fetching user:", error);
          }
        };

        useEffect(() => {
            if (token !== undefined) {
                handleSearch(token).then(data => {
                  setSearches(data);
                  console.log(data);
                });
              }
              
          }, [token]);
      
  return (
    <main className='sm:relative flex-col h-screen space-y-10'>
        <h1 className='py-20 font-bold'>Here's your search history, {user} </h1>
        <div className='flex-col space-y-20'></div>
        {Array.isArray(searches) && searches.length > 0 && (
            <table className="table-auto w-full">
                <thead>
                    <tr>
                    <th className="px-4 py-2">Date of Search</th>
                    <th className="px-4 py-2">Search Start Date</th>
                    <th className="px-4 py-2">Search End Date</th>
                    <th className="px-4 py-2">Search Airline</th>
                    </tr>
                </thead>
                <tbody>
                    {Array.isArray(searches) &&
                    searches.map((row, rowIndex) => (
                        <tr key={rowIndex}>
                        {Array.isArray(row) &&
                            row.map((cell, cellIndex) => (
                            cellIndex !== 0 &&
                            cellIndex !== 5 && (
                                <td key={cellIndex} className="border px-4 py-2">
                                {cell}
                                </td>
                            )
                            ))}
                        </tr>
                    ))}
                </tbody>
                </table>
      )}
    <div className="">
        <a href="/" className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"> Back </a>
    </div>

    </main>
  )
}

export default Search