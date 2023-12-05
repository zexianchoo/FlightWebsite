import React from "react"
import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import axios from "axios";

function Login() {

    const [formData, setFormData] = useState({
      username: "",
      password: "",
    })

    const {username, password} = formData

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

      axios.get("http://127.0.0.1:5000/get_user/", {
      params: {
        username: username,
        password: password,
      }})
        .then(function (response) {
          localStorage.setItem("token", response.data);
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
                  type="text"
                  placeholder="Username"
                  required
                  id="username"
                  value={username}
                  onChange={onChange}
                />
          </div>
          <div>
            <p className="text-2xl">Password</p>
              <input
                  type="password"
                  placeholder="Password"
                  required
                  id="password"
                  value={password}
                  onChange={onChange}
                />
          </div>

        </div>
        
        <button className="text-xl pb-5" type="submit">
                Login
        </button>
        </form>
      </div>
    </main>



      )
}

export default Login;