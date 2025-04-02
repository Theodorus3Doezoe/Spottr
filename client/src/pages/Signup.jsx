import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom'; // Voor redirect na succes

function Signup() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    password2: '' // Voor bevestiging
  });
  const [error, setError] = useState(''); // Foutmeldingen van backend/validatie
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const { name, email, password, password2 } = formData;

  const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async e => {
    e.preventDefault();
    setError(''); // Reset error
    if (password !== password2) {
      setError('Wachtwoorden komen niet overeen');
      return;
    }
    if (password.length < 6) {
      setError('Wachtwoord moet minimaal 6 tekens lang zijn');
      return;
    }

    setLoading(true);
    try {
      // Pas URL aan naar je backend endpoint
      const res = await axios.post('http://localhost:5000/api/auth/register', {
        name,
        email,
        password
      });

      console.log('Registratie succesvol:', res.data);
      // Optioneel: Sla token op en log direct in, of stuur naar login pagina
      localStorage.setItem('token', res.data.token); // Sla token op
      // Hier kun je de gebruiker naar een dashboard of login sturen
      // navigate('/dashboard'); // Voorbeeld: stuur naar dashboard
      alert('Registratie succesvol! Je wordt ingelogd.'); // Of een betere UX
      // Je zou hier de app state kunnen updaten om aan te geven dat de gebruiker is ingelogd
      window.location.reload(); // Simpele manier om app state te updaten (beter is state management)


    } catch (err) {
      console.error('Registratiefout:', err.response?.data);
      // Probeer specifieke foutmelding van backend te tonen
      if (err.response?.data?.errors) {
         setError(err.response.data.errors.map(e => e.msg).join(', '));
      } else {
         setError('Registratie mislukt. Probeer het opnieuw.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Registreren</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={onSubmit}>
        <div>
          <input
            type="text"
            placeholder="Naam"
            name="name"
            value={name}
            onChange={onChange}
            required
          />
        </div>
        <div>
          <input
            type="email"
            placeholder="E-mailadres"
            name="email"
            value={email}
            onChange={onChange}
            required
          />
        </div>
        <div>
          <input
            type="password"
            placeholder="Wachtwoord (min. 6 tekens)"
            name="password"
            value={password}
            onChange={onChange}
            required
          />
        </div>
        <div>
          <input
            type="password"
            placeholder="Bevestig Wachtwoord"
            name="password2"
            value={password2}
            onChange={onChange}
            required
          />
        </div>
        <button type="submit" disabled={loading}>
          {loading ? 'Registreren...' : 'Registreer'}
        </button>
      </form>
      <Link to={"/login"}>
        <p>Heb je al een account? inloggen.</p>
      </Link>
    </div>
  );
}

export default Signup;