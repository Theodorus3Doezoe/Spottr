import React, { useContext } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { UserContext } from '../../context/userContext'; // <-- Pas het pad aan naar jouw UserContext bestand

const ProtectedRoute = () => {
  const { user, loading } = useContext(UserContext); // Haal user én de loading state op
  const location = useLocation(); // Om te onthouden waar de gebruiker heen wilde

  // 1. Wacht als de gebruikersstatus nog wordt geladen
  //    (Voeg 'loading' state toe aan je UserContext zoals hieronder beschreven)
  if (loading) {
    // Toon een simpele laadindicator of null
    return <div>Authenticatie controleren...</div>;
    // Of return null; als je liever niets toont
  }

  // 2. Als het laden klaar is en er is GEEN gebruiker, stuur naar login
  if (!user) {
    // Redirect component van react-router-dom
    // 'state={{ from: location }}' is optioneel: onthoudt de vorige locatie
    // 'replace' voorkomt dat de beschermde route in de browsergeschiedenis komt
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (user.profileSetup === false) {
    // 3a. Is de gebruiker al op/onderweg naar de setup pagina? Laat toe.
    if (location.pathname === '/setup') {
      // console.log('User needs setup, already on /setup. Allowing.');
      // De <Outlet /> hier zal de <SetupPage /> renderen (zie Router Config)
      return <Outlet />;
    } else {
      // 3b. Gebruiker is op een ANDERE beschermde pagina maar moet setup doen? Stuur naar /setup.
      // console.log('User needs setup, redirecting from', location.pathname, 'to /setup.');
      return <Navigate to="/setup" replace />;
    }
  }

  // 3. Als het laden klaar is en er IS een gebruiker, toon de gevraagde pagina
  //    <Outlet /> rendert het geneste element van de route (bv. <Settings /> of <Feed />)
  return <Outlet />;
};

export default ProtectedRoute;