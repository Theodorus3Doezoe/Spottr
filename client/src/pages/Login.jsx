import { useState } from 'react'

export default function Login() {
    const [data, setData] = useState({
        email: '',
        password: '',
    })

    const loginUser = (e) => {
        e.preventDefault()
    }

  return (
    <div>
        <form action="" onSubmit={loginUser}>
            <label htmlFor="">Email</label>
            <input type="email" placeholder='your@email' value={data.email} onChange={(e) => setData({...data, email: e.target.value})}/>
            <label htmlFor="">Password</label>
            <input type="password" placeholder='enter password' value={data.password} onChange={(e) => setData({...data, password: e.target.value})}/>
            <button type='submit'>Submit</button>
        </form>
    </div>
  )
}
