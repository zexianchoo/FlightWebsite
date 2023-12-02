import React from "react"
import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";

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
              Login
            </button>
        </form>
      )
}

export default Login;