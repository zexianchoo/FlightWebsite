import React from "react"
import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import axios from "axios";

function SignUp() {

    const [formData, setFormData] = useState({
      username: "",
      email: "",
      password: "",
    })

    const {username, email, password} = formData

    const onChange = (e) => {
      setFormData((prevState) => ({
        ...prevState,
        [e.target.id]: e.target.value,
      }));
    };

    const navigate = useNavigate();

    const submit = (e) => {

      e.preventDefault();
      

      // var data = JSON.stringify({
      //   name: username,
      //   email: email,
      //   password: password,
      // });

      // var config = {
      //   method: "PUT",
      //   url: "http://127.0.0.1:5000/put_user/",
      //   headers: {
      //     "Content-Type": "application/json",
      //   },
      //   data: data,
      // };
  
      axios.put("http://127.0.0.1:5000/put_user/", null, {
      params: {
        username: username,
        email: email,
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
      <div className='w-full flex-col space-y-4 items-center h-full text-center '>
      <form className="flex-col space-y-8 border-2 border-indigo-500/100 justify-center items-center" onSubmit={submit}>
        <div className="flex-col align-middle justify-center items-center space-y-10 m-7">
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
          <div>
              <p className="text-2xl">Email</p>
              <input
                type="email"
                placeholder="Email"
                id="email"
                value={email}
                onChange={onChange}
              />
            
          </div>

        </div>
        
        <button className="text-xl pb-5" type="submit">
                Sign Up Now!
        </button>
        </form>
      </div>
    </main>


        // <form onSubmit={submit}>
        //   <p>Username</p>
        //   <input
        //       type="text"
        //       placeholder="Username"
        //       required
        //       id="username"
        //       value={username}
        //       onChange={onChange}
        //     />
        //     <p>Email</p>
        //   <input
        //       type="email"
        //       placeholder="Email"
        //       required
        //       id="email"
        //       value={email}
        //       onChange={onChange}
        //     />
        //     <p>Password</p>
        //   <input
        //       type="password"
        //       placeholder="Password"
        //       required
        //       id="password"
        //       value={password}
        //       onChange={onChange}
        //     />
        //     <button type="submit">
        //       Sign Up
        //     </button>
        // </form>
      )
}

export default SignUp;