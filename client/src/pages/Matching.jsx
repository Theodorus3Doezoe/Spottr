import React, { useState, useEffect, useCallback, useContext } from 'react';
import '../css/matching.css'
import '../css/profile_card.css'
import { UserContext } from '../../context/UserContext';
import axios from 'axios'; 
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom'

const MATCH_BATCH_SIZE = 10; // Aantal profielen per keer ophalen
const FETCH_MORE_THRESHOLD = 5; // Haal meer als er minder dan dit aantal over is


export default function Matching() {
    const [potentialMatches, setPotentialMatches] = useState([]); // Lijst met profielen
    const [currentIndex, setCurrentIndex] = useState(0);       // Index van huidig profiel
    const [isLoadingMatches, setIsLoadingMatches] = useState(true); // Start true voor initiële lading
    const [error, setError] = useState(null);                   // Foutmelding bij ophalen
  
    // Globale State uit Context
    const { user: currentUser, loading: isAuthLoading } = useContext(UserContext); // Haal beschikbare data op
  
    // Afgeleide authenticatie status (check na laden en of user bestaat)
    const isAuthenticated = !isAuthLoading && !!currentUser;
  
    // Functie om Matches op te Halen
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
  
        // ai
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
        // tot hier
      } catch (err) {
        console.error("Error fetching matches:", err);
        const message = err.response?.data?.message || 'Kon geen matches ophalen.';
        setError(message); // Sla error op
      } finally {
        setIsLoadingMatches(false); // Zet laden UIT
      }
    // Dependencies: auth laden status. De rest wordt intern gelezen of getriggerd.
    }, [isAuthLoading, potentialMatches.length]); // potentialMatches.length toegevoegd voor 'skip' param
  
  
    // Functie om Like/Dislike Actie te Verwerken
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


      // ai
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
    // tot hier
  
    // Effect Hook: Haal initieel matches op
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
  
  
    // Rendering Logic
  
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
      return (
        <div className='no-matches'>
          Geen nieuwe profielen gevonden! 
          <button onClick={() => fetchMatches(true)}>Check opnieuw</button>
          <Link to={'/'}>
            <button >Go back</button>
          </Link>
        </div>
      )
    }
  
    // 6. Huidige match ophalen (met check)
    const currentMatch = potentialMatches[currentIndex];
    if (!currentMatch) {
       return <div>Profiel data niet beschikbaar (index: {currentIndex})...</div>;
    }
  return (
    <div className='matching_container'>
    <Link to={'/'}>
      <button className='back_btn'><img src="src\assets\arrow_left.png" alt="" /></button>
    </Link>

    <Link to={''}>
      <button className="settings_btn">
        <img src="src/assets/profile_card/panel.png" alt="" />
      </button>
    </Link>
    <div className="profile_card_container">
      <div className='profile_card'>
        <div className="profile_card_image_container">
          <img src="src/assets/placeholder.jpg" alt="" className='profile_card_image'/>
          <h1 className="profile_card_name_age">{currentMatch.name}, {currentMatch.age}</h1>
          <div className="summary_container">
            <div className="tags_container">
              <div className="looking_container">
                <img src="src/assets/profile_card/magnifying_glass.png" alt="" />
                <p>Looking for {currentMatch.lookingFor}</p>
              </div>
              <div className="location_container">
                <img src="src/assets/gps.png" alt="" />
                <p>Within ....km</p>
              </div>
            </div>
            <div className="label_container">
  {/* Render de lijst ALLEEN als sportLabels bestaat en niet leeg is */}
  {currentMatch.sportLabels && currentMatch.sportLabels.length > 0 && (
    currentMatch.sportLabels.map((sport, index) => (
      <div key={index} className={`labels label_${index}`}>
        {sport}
      </div>
    ))
  )}

</div>
          </div>
        </div>
        <div className="profile_card_bio_container">
            <p>{currentMatch.bio}</p>
            <div className="bio_tags_container">
        {/* Eerst controleren of personalLabels bestaat en items bevat */}
        {currentMatch.personalLabels && currentMatch.personalLabels.length > 0 && (
  currentMatch.personalLabels.map((item, index) => (
    <p key={index}>
      {item.label}: {item.value}
    </p>
  ))
)}
              
            </div>
              <p className="bio_more_info">More info</p>
            <div className="reject_match_btns">
              <button onClick={() => handleAction('dislike')} disabled={isLoadingMatches}>
                <img src="src/assets/profile_card/reject.png" alt="" />
              </button>
              <button onClick={() => handleAction('like')} disabled={isLoadingMatches}>
                <img src="src/assets/profile_card/love.png" alt="" />
              </button>
            </div>
        </div>
      </div>
    </div>
    </div>
  )
}
