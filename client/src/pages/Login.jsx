import React, { useState} from 'react';
import { useNavigate, Link } from 'react-router-dom'; // Voor redirect na succes
import axios from 'axios';
import {toast} from 'react-hot-toast'
import '../css/register.css'



export default function Login() {
  // const { setUser } = useContext(UserContext)
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
        // setUser(data.user)
        setData({
          email: '',
          password: '',
        })

        if (data.token) {
          localStorage.setItem('token', data.token);
          toast.success('Login Succesful, welcome');
          window.location.href = '/'
        } else {
          // Als data.token leeg is, log dit en stop
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
      <input type='password' placeholder='Enter password' value={data.password} onChange={(e) => setData({...data, password: e.target.value})} />
      <button type="submit">Login</button>
      <Link to={"/register"}>
        <p>Heb je nog geen account? Registreer hier.</p>
      </Link>
      </form>
    </div>
  );
}
