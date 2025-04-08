import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import {UserContext} from '../../context/userContext'

export default function MatchScreen() {
  const { token, isLoading: isAuthLoading } = useUserContext(); // Token nodig voor API calls
  const [potentialMatches, setPotentialMatches] = useState([]); // Array voor profielen
  const [currentIndex, setCurrentIndex] = useState(0);       // Index van huidig profiel
  const [isLoadingMatches, setIsLoadingMatches] = useState(true); // Laden van matches
  const [error, setError] = useState(null);
  const [matchNotification, setMatchNotification] = useState(null); // Voor "It's a Match!"

  // ... (rest van de code volgt) ...
  // ... (binnen MatchScreen component) ...

  const fetchMatches = useCallback(async () => {
    if (!token || isAuthLoading) return; // Wacht op token en auth check
    setIsLoadingMatches(true);
    setError(null);
    try {
      // Roep je backend endpoint aan
      const response = await axios.get('/api/matches/potential', { // Juiste pad gebruiken!
        headers: { 'Authorization': `Bearer ${token}` }
        // Voeg evt. 'params' toe voor paginering als je backend dat ondersteunt
      });
      const newMatches = response.data.matches || response.data || []; // Haal array op
      // Voeg alleen nieuwe matches toe (voorkom duplicaten na refresh/refetch)
      setPotentialMatches(prev => {
           const currentIds = new Set(prev.map(m => m._id));
           return [...prev, ...newMatches.filter(m => !currentIds.has(m._id))];
       });
    } catch (err) {
      console.error("Error fetching matches:", err);
      setError('Kon geen matches ophalen.');
      toast.error('Kon geen matches ophalen.');
    } finally {
      setIsLoadingMatches(false);
    }
  }, [token, isAuthLoading]); // Dependencies voor useCallback

  // Haal matches op bij het laden van de component (als gebruiker ingelogd is)
  useEffect(() => {
    // Alleen fetchen als we niet al aan het laden zijn EN er geen matches zijn (of index 0)
    // Dit voorkomt onnodig fetchen als de component opnieuw rendert maar er al matches zijn.
    if (token && !isAuthLoading && potentialMatches.length === 0 && currentIndex === 0) {
        fetchMatches();
    }
     // Als er geen token is na het laden, stop ook het laden van matches
     if (!token && !isAuthLoading) {
         setIsLoadingMatches(false);
     }
  }, [token, isAuthLoading, fetchMatches, potentialMatches.length, currentIndex]); // Effect opnieuw runnen als token/auth verandert

  // ... (binnen MatchScreen component) ...

  const handleAction = async (action) => { // action is 'like' of 'dislike'
    const currentMatch = potentialMatches[currentIndex];
    if (!currentMatch || !token) return; // Veiligheidscheck

    try {
      // Stuur actie naar backend
      const response = await axios.post('/api/matches/action', {
        targetUserId: currentMatch._id,
        action: action
      }, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      // Optioneel: Toon match notificatie
      if (response.data.mutualMatch) {
        setMatchNotification(`It's a Match met ${currentMatch.name}!`);
        setTimeout(() => setMatchNotification(null), 4000);
      }

      // --- BELANGRIJK: Ga naar de volgende persoon ---
      const nextIndex = currentIndex + 1;
      setCurrentIndex(nextIndex);
      // --------------------------------------------

      // --- Optioneel: Haal nieuwe matches als lijst bijna leeg is ---
      // (Dit is een simpele check, kan slimmer met paginering)
      if (potentialMatches.length > 0 && potentialMatches.length - nextIndex < 5) {
          console.log("Fetching more matches as list is short...");
          fetchMatches();
      }
      // ---------------------------------------------------------

    } catch (err) {
      console.error(`Error processing ${action}:`, err);
      toast.error(`Kon ${action} niet verwerken.`);
      // Overweeg of je hier toch naar de volgende wilt gaan om niet vast te lopen
      // setCurrentIndex(prev => prev + 1);
    }
  };

  // ... (binnen MatchScreen component, na alle logica) ...

  // --- Rendering Logic ---
  if (isAuthLoading) return <div>Authenticatie checken...</div>;
  if (!token) return <div>Log in om te matchen.</div>;

  // Gebruik isLoadingMatches voor feedback tijdens het ophalen
  if (isLoadingMatches && potentialMatches.length === 0) {
      return <div>Matches laden...</div>;
  }

  if (error) return <div>{error}</div>;

  // Check of er nog matches zijn in de huidige lijst
  if (currentIndex >= potentialMatches.length) {
      // Als we niet meer aan het laden zijn -> echt geen matches meer
      return isLoadingMatches ? <div>Meer matches laden...</div> : <div>Geen profielen meer gevonden!</div>;
  }

  // Haal het huidige profiel op
  const currentMatch = potentialMatches[currentIndex];

  return (
    <div>
      {/* Toon eventuele match notificatie */}
      {matchNotification && (
          <div className="match-popup"> {/* Style deze pop-up */}
              <h2>{matchNotification}</h2>
          </div>
      )}

      <h2>Match!</h2>

      {/* Toon profielkaart (maak hier idealiter een aparte component voor) */}
      <div className="profile-display">
         {/* Veilig toegang met optional chaining */}
         <h3>{currentMatch?.name}, {currentMatch?.age ?? '?'}</h3>
         {/* <img src={currentMatch?.photos?.[0]} alt={currentMatch?.name} /> */}
         <p>{currentMatch?.bio ?? 'Geen bio'}</p>
         {/* Toon andere details zoals labels, afstand etc. */}
      </div>

      {/* Actie knoppen */}
      <div className="actions">
        <button onClick={() => handleAction('dislike')}>Nope</button>
        <button onClick={() => handleAction('like')}>Like</button>
      </div>
    </div>
  );
}
