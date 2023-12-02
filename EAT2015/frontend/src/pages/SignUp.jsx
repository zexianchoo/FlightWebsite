import React from "react"
import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";

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

      // Add user data to database

      navigate("/");
    }
      
    return (
        <form onSubmit={submit}>
          <p>Username</p>
          <input
              type="text"
              placeholder="Username"
              required
              id="username"
              value={username}
              onChange={onChange}
            />
            <p>Email</p>
          <input
              type="email"
              placeholder="Email"
              required
              id="email"
              value={email}
              onChange={onChange}
            />
            <p>Password</p>
          <input
              type="password"
              placeholder="Password"
              required
              id="password"
              value={password}
              onChange={onChange}
            />
            <button type="submit">
              Sign Up
            </button>
        </form>
      )
}

export default SignUp;