import React from "react"
import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import axios from "axios";

function ChangeEmail() {

    const account = localStorage.getItem("token")

    const [formData, setFormData] = useState({
      email: "",
    })

    const {email} = formData

    const onChange = (e) => {
      setFormData((prevState) => ({
        ...prevState,
        [e.target.id]: e.target.value,
      }));
    };

    const navigate = useNavigate();

    const submit = (e) => {

      // check database for user
      e.preventDefault();

      axios.put("http://127.0.0.1:5000/update_email/", null, {
      params: {
        user_id: account,
        email: email,
      }})
        .then(function (response) {
          console.log(response.data)
          navigate("/");
        })
    }
      
    return (

      <main className='sm:relative flex-col h-screen'>
      <h1 className='py-20'>Welcome to EAT2015!</h1>
      <div className='flex-col space-y-4 items-center h-full text-center '>
      <form className="flex-col space-y-8 border-2 border-indigo-500/100 justify-center items-center" onSubmit={submit}>
        <div className="flex align-middle justify-center items-center space-x-20 m-7">
          <div>
            <p className="text-2xl">Username</p>
              <input
                  type="email"
                  placeholder="New Email"
                  required
                  id="email"
                  value={email}
                  onChange={onChange}
                />
          </div>

        </div>
        
        <button className="text-xl pb-5" type="submit">
                Change Email
        </button>
        </form>
      </div>
    </main>



      )
}

export default ChangeEmail;