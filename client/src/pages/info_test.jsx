import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

export function UserProfile() {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Definieer en roep de async functie meteen aan (IIFE)
    (async () => { // Begin van de anonieme async functie expressie
      setLoading(true);
      const token = localStorage.getItem('token');

      if (!token) {
        toast.error('Geen token gevonden. Log opnieuw in.');
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get('/settings', { // Zorg dat pad klopt (/api/auth/settings bv)
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        setUserData(response.data.user || response.data); // Pas aan o.b.v. backend response structuur
      } catch (err) {
        console.error("Fout bij ophalen gebruikersdata:", err);
        let errorMessage = 'Er is iets misgegaan bij het ophalen van de gegevens.';
        if (err.response) {
          // ... (je bestaande error handling logica) ...
          errorMessage = err.response.data?.message || `Server error: ${err.response.status}`;
          if (err.response.status === 401) {
            localStorage.removeItem('token');
            errorMessage += " Token ongeldig of verlopen. Log opnieuw in.";
          }
        } else if (err.request) {
          errorMessage = 'Geen response ontvangen van de server.';
        } else {
          errorMessage = err.message;
        }
        toast.error(errorMessage);
      } finally {
        setLoading(false);
      }
    })(); // <-- Roep de functie direct aan met ();

  }, []); // Lege dependency array

  // ... (je rendering JSX blijft hetzelfde) ...

  if (loading) {
    return <p>Gegevens laden...</p>;
  }

  if (!userData && !loading) {
   return <p>Geen gebruikersgegevens beschikbaar.</p>;
  }

  // Rendering voor loading state blijft
  if (loading) {
    return <p>Gegevens laden...</p>;
  }

  // De error check is niet meer nodig als de state weg is
  // if (error) {
  //   return <p style={{ color: 'red' }}>Fout: {error}</p>;
  // }

  // Als er geen data is na het laden (en er was geen error toast), toon een bericht
  // Of misschien wil je hier anders mee omgaan, afhankelijk van je UI flow
  if (!userData && !loading) {
     // Dit gebeurt nu alleen als fetchUserData klaar is (loading=false)
     // en er geen error was (want die gaf een toast) maar userData nog steeds null is.
     // Dit zou kunnen gebeuren bij een lege response, of als de error handling niet goed alle gevallen afdekt.
     // Je kunt hier een specifieke melding tonen of null renderen.
    return <p>Geen gebruikersgegevens beschikbaar.</p>;
  }


  // Display de gebruikersdata (alleen als loading klaar is en userData bestaat)
  return userData ? (
    <div>
      <h1>Hallo, {userData.name}!</h1>
      <p>Email: {userData.email}</p>
      {/* Andere gegevens */}
    </div>
  ) : null; // Render niets als userData nog niet beschikbaar is (en niet aan het laden)
}

export default UserProfile;