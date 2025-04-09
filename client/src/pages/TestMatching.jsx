// src/pages/MatchScreen.jsx

import React, { useState, useEffect, useCallback, useContext } from 'react';
import axios from 'axios'; // Zorg dat axios correct is geconfigureerd
import toast from 'react-hot-toast';
import { UserContext } from '../../context/UserContext'; // <<< PAS DIT PAD AAN!

// --- Configuratie Constanten ---
const MATCH_BATCH_SIZE = 10; // Aantal profielen per keer ophalen
const FETCH_MORE_THRESHOLD = 5; // Haal meer als er minder dan dit aantal over is

export default function MatchScreen() {
  // --- State voor deze Component ---
  const [potentialMatches, setPotentialMatches] = useState([]); // Lijst met profielen
  const [currentIndex, setCurrentIndex] = useState(0);       // Index van huidig profiel
  const [isLoadingMatches, setIsLoadingMatches] = useState(true); // Start true voor initiële lading
  const [error, setError] = useState(null);                   // Foutmelding bij ophalen

  // --- Globale State uit Context ---
  const { user: currentUser, loading: isAuthLoading } = useContext(UserContext); // Haal beschikbare data op

  // Afgeleide authenticatie status (check na laden en of user bestaat)
  const isAuthenticated = !isAuthLoading && !!currentUser;

  // --- Functie om Matches op te Halen ---
  const fetchMatches = useCallback(async (isInitialFetch = false) => {
    const token = localStorage.getItem('token');

    // Stop als authenticatie nog bezig is of geen token aanwezig is
    if (isAuthLoading || !token) {
      if (!token && !isAuthLoading) setIsLoadingMatches(false); // Zekerheid: stop laden
      return;
    }

    // Voorkom dubbele fetches (alleen als het NIET de initiële fetch is)
    if (isLoadingMatches && !isInitialFetch) {
      console.log("fetchMatches: Skip, andere fetch al bezig.");
      return;
    }

    console.log("MatchScreen: Fetching potential matches...");
    setIsLoadingMatches(true); // Zet laden AAN
    setError(null);

    try {
      // Roep backend aan (Pas endpoint aan!)
      const response = await axios.get('/matches/potential', {
        headers: { 'Authorization': `Bearer ${token}` },
        params: {
          limit: MATCH_BATCH_SIZE,
          skip: isInitialFetch ? 0 : potentialMatches.length // Paginering: sla over wat we al hebben (behalve bij eerste fetch)
        }
      });

      const newMatches = response.data?.matches || response.data || []; // Haal array op (flexibel)
      console.log(`MatchScreen: Received ${newMatches.length} matches.`);

      if (newMatches.length > 0) {
        setPotentialMatches(prevMatches => {
          const existingIds = new Set(prevMatches.map(m => m._id));
          const filteredNew = newMatches.filter(m => !existingIds.has(m._id));
          console.log(`MatchScreen: Adding ${filteredNew.length} new unique matches.`);
          // Bij eerste fetch: vervang lijst. Bij latere: voeg toe.
          return isInitialFetch ? filteredNew : [...prevMatches, ...filteredNew];
        });
        // Reset index alleen bij allereerste fetch
        if (isInitialFetch) {
          setCurrentIndex(0);
        }
      } else {
        console.log("MatchScreen: No new matches received from backend.");
         if (isInitialFetch) { // Als we bij de eerste fetch niets krijgen
             setPotentialMatches([]);
             setCurrentIndex(0);
         }
         // Als we later niets meer krijgen, hoeven we niets te doen, de gebruiker ziet vanzelf de "geen profielen" melding.
      }

    } catch (err) {
      console.error("Error fetching matches:", err);
      const message = err.response?.data?.message || 'Kon geen matches ophalen.';
      setError(message); // Sla error op
    } finally {
      setIsLoadingMatches(false); // Zet laden UIT
    }
  // Dependencies: auth laden status. De rest wordt intern gelezen of getriggerd.
  }, [isAuthLoading, potentialMatches.length]); // potentialMatches.length toegevoegd voor 'skip' param


  // --- Functie om Like/Dislike Actie te Verwerken ---
  const handleAction = useCallback(async (action) => {
    if (currentIndex >= potentialMatches.length) return; // Geen match om op te reageren
    const currentMatch = potentialMatches[currentIndex];
    const token = localStorage.getItem('token');

    // Voorkom actie als er geen match/token is, of als we nieuwe matches laden
    if (!currentMatch || !token || isLoadingMatches) {
         console.warn("handleAction: Action prevented (no match/token, or loading)");
         return;
    }

    console.log(`MatchScreen: Action '${action}' on user ${currentMatch._id}`);
    // Optioneel: zet een tijdelijke 'isActing' state om knoppen te disablen

    try {
      // Stuur actie naar backend (Pas endpoint aan!)
      const response = await axios.post('/matches/action', {
        targetUserId: currentMatch._id,
        action: action
      }, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      // Verwerk mutual match
      if (action === 'like' && response.data.mutualMatch) {
        toast.success(`🎉 It's a Match met ${currentMatch.name}!`);
      }

      // Ga naar de volgende index (doe dit *na* de API call)
      const nextIndex = currentIndex + 1;
      setCurrentIndex(nextIndex);

      // Check of we nieuwe matches moeten laden
      if (potentialMatches.length - nextIndex < FETCH_MORE_THRESHOLD) {
        console.log("MatchScreen handleAction: Fetching more matches...");
        fetchMatches(); // Vraag volgende batch
      }

    } catch (err) {
      console.error(`Error processing ${action}:`, err);
      toast.error(`Kon ${action} niet verwerken.`);
    } finally {
       // Zet 'isActing' state terug naar false indien gebruikt
    }
  }, [currentIndex, potentialMatches, fetchMatches, isLoadingMatches]); // Afhankelijk van huidige staat en fetch functie


  // --- Effect Hook: Haal initieel matches op ---
  useEffect(() => {
    console.log("MatchScreen useEffect Check: Auth Loading:", isAuthLoading, "User:", !!currentUser);
    // Wacht tot auth klaar is
    if (!isAuthLoading) {
      if (currentUser) {
        // Gebruiker ingelogd: start eerste fetch als lijst leeg is
        if (potentialMatches.length === 0) {
           console.log("MatchScreen useEffect: Triggering initial fetch...");
           fetchMatches(true); // Geef true mee
        }
      } else {
         // Niet ingelogd, stop met laden
         console.log("MatchScreen useEffect: Not authenticated.");
         setIsLoadingMatches(false);
      }
    }
    // Deze dependencies zorgen ervoor dat de check opnieuw draait als de auth status verandert.
  }, [isAuthLoading, currentUser, fetchMatches]); // fetchMatches is nu stabiel door useCallback


  // --- Rendering Logic ---

  // 1. Wacht op authenticatie check
  if (isAuthLoading) {
    return <div>Authenticatie checken...</div>;
  }

  // 2. Gebruiker niet ingelogd
  if (!currentUser) {
    return <div>Je moet ingelogd zijn om te matchen. Login a.u.b.</div>;
  }

  // 3. Eerste keer matches laden
  if (isLoadingMatches && potentialMatches.length === 0) {
    return <div>Matches aan het laden...</div>;
  }

  // 4. Fout bij laden
  if (error) {
    return <div>Er ging iets mis: {error} <button onClick={() => fetchMatches(true)}>Opnieuw proberen</button></div>;
  }

  // 5. Geen matches (meer) gevonden
  if (!isLoadingMatches && currentIndex >= potentialMatches.length) {
    return <div>Geen nieuwe profielen gevonden! <button onClick={() => fetchMatches(true)}>Check opnieuw</button></div>;
  }

  // 6. Huidige match ophalen (met check)
  const currentMatch = potentialMatches[currentIndex];
  if (!currentMatch) {
     return <div>Profiel data niet beschikbaar (index: {currentIndex})...</div>;
  }

  // 7. Toon profiel en knoppen
  return (
    <div className="match-screen-container"> {/* Geef een class mee voor styling */}
      <h2>Match Tijd!</h2>

      {/* Subtiele loading indicator als we op achtergrond laden */}
      {isLoadingMatches && <p style={{ textAlign: 'center', color: 'grey' }}>Meer matches laden...</p>}

      {/* Profielkaart (basis weergave) */}
      <div style={{ border: '1px solid #ccc', borderRadius: '8px', padding: '15px', margin: '15px auto', maxWidth: '350px', minHeight: '200px' }}>
        <h3>{currentMatch.name ?? 'Onbekende'}, {currentMatch.age ?? '?'}</h3>
        {/* Voeg hier later foto toe */}
        {/* <img src={currentMatch.photos?.[0] || '/placeholder.jpg'} alt={currentMatch.name} style={{ width: '100%', height: '200px', objectFit: 'cover', borderRadius: '4px' }} /> */}
        <p style={{ marginTop: '10px' }}>{currentMatch.bio ?? 'Geen bio beschikbaar.'}</p>
        {/* Toon eventueel andere details zoals labels */}
         <div style={{ fontSize: 'smaller', color: '#555', marginTop: '10px' }}>
           ID: {currentMatch._id} {/* Alleen voor debuggen! */}
         </div>
      </div>

      {/* Actieknoppen */}
      <div style={{ marginTop: '20px', textAlign: 'center' }}>
        <button
          onClick={() => handleAction('dislike')}
          disabled={isLoadingMatches} // Disable tijdens laden
          style={{ marginRight: '20px', padding: '15px 25px', fontSize: '1.2em', background: 'lightcoral', border: 'none', borderRadius: '50px', cursor: 'pointer' }}
        >
          Nope ❌
        </button>
        <button
          onClick={() => handleAction('like')}
          disabled={isLoadingMatches} // Disable tijdens laden
          style={{ padding: '15px 25px', fontSize: '1.2em', background: 'lightgreen', border: 'none', borderRadius: '50px', cursor: 'pointer' }}
        >
          Like ❤️
        </button>
      </div>

    </div>
  );
}