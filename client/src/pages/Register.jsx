import { useState } from 'react'

export default function Register() {
    const [data, setData] = useState({
        name: '',
        email: '',
        password: '',
    })

    const registerUser = (e) => {
        e.preventDefault()
    }

  return (
    <div>
        <form action="" onSubmit={registerUser}>
            <label htmlFor="">Name</label>
            <input type="text" placeholder='enter name' value={data.name} onChange={(e) => setData({...data, name: e.target.value})}/>
            <label htmlFor="">Email</label>
            <input type="email" placeholder='your@email' value={data.email} onChange={(e) => setData({...data, email: e.target.value})}/>
            <label htmlFor="">Password</label>
            <input type="password" placeholder='enter password' value={data.password} onChange={(e) => setData({...data, password: e.target.value})}/>
            <button type='submit'>Submit</button>
        </form>
    </div>
  )
}
