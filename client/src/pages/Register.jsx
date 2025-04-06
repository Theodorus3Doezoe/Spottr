import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom'; // Voor redirect na succes
import axios from 'axios';
import {toast} from 'react-hot-toast'
import '../css/register.css'


export default function Register() {
  // const MINIMUM_AGE = 18
  const navigate = useNavigate()
  const [data, setData] = useState({
    name: '',
    surname: '',
    email: '',
    password: '',
    passwordConfirm: '',
    birthdate: '',
  })

  const onChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  // --- EINDE LEEFTIJD VALIDATIE ---


  const registerUser = async (e) => {
    e.preventDefault()
    const {name, surname, email, password, passwordConfirm, birthdate} = data

    try {
      const {data} = await axios.post('/register', {
        name, surname, email, password, passwordConfirm, birthdate,
      })
      if(data.error) {
        toast.error(data.error)
      } else {
        setData({
          name: '',
          surname: '',
          email: '',
          password: '',
          passwordConfirm: '',
          birthdate: '',
        })
        toast.success('Register Succesful, welcome')
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
      <input type='text' placeholder='Enter name' name='name' value={data.name} onChange={onChange} />
      <label>Surname</label>
      <input type='text' placeholder='Enter surname' name='surname' value={data.surname} onChange={onChange} />
      <label>Email</label>
      <input type='text' placeholder='Enter email' name='email' value={data.email} onChange={onChange} />
      <label>Password</label>
      <input type='password' placeholder='Enter password' name='password' value={data.password} onChange={onChange} />
      <label>Confirm password</label>
      <input type='password' placeholder='Enter password' name='passwordConfirm' value={data.passwordConfirm} onChange={onChange} />
      <label>Enter birthdate</label>
      <input
          type="date" // Gebruik type="date"
          id="birthdate"
          name="birthdate" // Koppel aan de 'birthdate' key in formData state
          value={data.birthdate} // Bind aan de state
          onChange={onChange} // Gebruik dezelfde generieke onChange handler
           // Maak het veld verplicht indien nodig
          // Optioneel: stel max in op vandaag om toekomstige data te voorkomen
          max={new Date().toISOString().split("T")[0]}
        />

      <button type="submit">Register</button>
      <Link to={"/login"}>
        <p>Heb je al een account? inloggen.</p>
      </Link>
      </form>
    </div>
  );
}
