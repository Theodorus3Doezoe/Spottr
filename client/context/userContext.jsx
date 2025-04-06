// src/context/userContext.jsx
import axios from "axios";
import { createContext, useState, useEffect } from "react";

export const UserContext = createContext({});

export function UserContextProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // <-- State om laadstatus bij te houden

  useEffect(() => {
    // Geen 'if(!user)' check meer hier, we willen altijd proberen bij het laden vd app
    setLoading(true); // Start het laden
    axios.get('/profile') // Zorg dat token meesturen hier werkt (interceptor/cookies)!
      .then(({ data }) => {
        if (data) { // Zorg dat je niet null zet als data null is
           setUser(data);
        } else {
           setUser(null); // Expliciet null zetten als er geen data is
        }
      })
      .catch(error => {
        console.error("Profiel ophalen mislukt:", error);
        setUser(null); // Zet user op null bij een fout
      })
      .finally(() => {
        setLoading(false); // Klaar met laden (succes of fout)
      });
  }, []); // Lege dependency array: alleen uitvoeren bij de eerste keer laden

  // Geef user, setUser, én loading door via de context
  return (
    <UserContext.Provider value={{ user, setUser, loading }}>
      {children}
    </UserContext.Provider>
  );
}