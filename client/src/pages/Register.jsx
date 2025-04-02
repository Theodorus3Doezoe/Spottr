import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom'; // Voor redirect na succes
import axios from 'axios';
import {toast} from 'react-hot-toast'
import '../css/register.css'

export default function Register() {

  const navigate = useNavigate()
  const [data, setData] = useState({
    name: '',
    email: '',
    password: '',

  })

  const registerUser = async (e) => {
    e.preventDefault()
    const {name, email, password,} = data
    try {
      const {data} = await axios.post('/register', {
        name, email, password,
      })
      if(data.error) {
        toast.error(data.error)
      } else {
        setData({
          name: '',
          email: '',
          password: '',

        })
        toast.success('Login Succesful, welcome')
        navigate('/login')
      }
    } catch (error) {
      console.log(error)
    }
  }
  return (
    <div className="register_container">
      <form onSubmit={registerUser}>
      <label>Name</label>
      <input type='text' placeholder='Enter name' value={data.name} onChange={(e) => setData({...data, name: e.target.value})} />
      <label>Email</label>
      <input type='text' placeholder='Enter email' value={data.email} onChange={(e) => setData({...data, email: e.target.value})} />
      <label>Password</label>
      <input type='text' placeholder='Enter password' value={data.password} onChange={(e) => setData({...data, password: e.target.value})} />
      <button type="submit">Register</button>
      <Link to={"/login"}>
        <p>Heb je al een account? inloggen.</p>
      </Link>
      </form>
    </div>
  );
}
