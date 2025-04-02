import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom'; // Voor redirect na succes
import axios from 'axios';
import {toast} from 'react-hot-toast'
import '../css/register.css'

export default function Login() {

  const navigate = useNavigate()
  const [data, setData] = useState({
    email: '',
    password: '',
  })

  const loginUser = async (e) => {
    e.preventDefault()
    const {email, password,} = data
    try {
      const {data} = await axios.post('/login', {
        email, 
        password,
      })
      if(data.error) {
        toast.error(data.error)
      } else {
        setData({
          email: '',
          password: '',
        })

        if (data.token) {
          console.log("Token found in response data. Saving to localStorage...");
          localStorage.setItem('token', data.token);
          console.log("Token should be saved now. Navigating...");
          toast.success('Login Succesful, welcome');
          navigate('/'); // Navigeer pas hier
        } else {
          // Als data.token leeg is, log dit en stop
          console.error("Token NOT found in backend response data!");
          toast.error("Login failed: Could not retrieve session token.");
          // Niet navigeren als er geen token is!
        }
      }
    } catch (error) {
      console.log(error)
    }
  }
  return (
    <div className="register_container">
      <form onSubmit={loginUser}>
      <label>Email</label>
      <input type='text' placeholder='Enter email' value={data.email} onChange={(e) => setData({...data, email: e.target.value})} />
      <label>Password</label>
      <input type='text' placeholder='Enter password' value={data.password} onChange={(e) => setData({...data, password: e.target.value})} />
      <button type="submit">Login</button>
      <Link to={"/register"}>
        <p>Heb je nog geen account? Registreer hier.</p>
      </Link>
      </form>
    </div>
  );
}
