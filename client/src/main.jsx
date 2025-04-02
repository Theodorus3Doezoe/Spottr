import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider, Link, Navigate, useNavigate } from 'react-router-dom'

//css
import './main.css'

//Components
// import Header from './components/header/Header'
// import Nav from './components/nav/Nav'
// import Profile_card from './components/profilecard/Profile_card'
// import Post from './components/post/Post'
// import Match_circle from './components/match_circle/Match_circle'
// import Match_message from './components/match_message/Match_message'
// import Settings from './pages/Settings'
// import Profile from './pages/Profile'
// import Update_password from './pages/Update_password'
// import Login from './components/login/Login'
// import Signup from './pages/Signup'
import Feed from './pages/Feed'
import Matching from './pages/Matching'
import Messages from './pages/Messages'
import Settings from './pages/Settings'
import Profile from './pages/Profile'

const isAuthenticated = () => {
    const token = localStorage.getItem('token');
    // Je zou hier ook token validatie/vervaldatum kunnen checken
    return !!token;
};

// --- Protected Route Wrapper ---
// Deze component beschermt routes die alleen toegankelijk zijn voor ingelogde gebruikers.
const ProtectedRoute = ({ children }) => {
    if (!isAuthenticated()) {
        // Gebruiker is niet ingelogd, stuur naar /login
        // 'replace' zorgt ervoor dat de login pagina de huidige pagina in de history vervangt.
        return <Navigate to="/login" replace />;
    }
    // Gebruiker is ingelogd, toon de gevraagde component
    return children;
};

// --- Public Only Route Wrapper ---
// Deze component beschermt routes zoals login/signup, die alleen zichtbaar mogen zijn
// als de gebruiker *niet* is ingelogd.
const PublicOnlyRoute = ({ children }) => {
    if (isAuthenticated()) {
        // Gebruiker is al ingelogd, stuur naar de homepagina
        return <Navigate to="/" replace />;
    }
    // Gebruiker is niet ingelogd, toon de login/signup pagina
    return children;
};

const router = createBrowserRouter([
  {path: "/", element: 
    <Feed/>
  },
  
  {path: "/matching", element: 
    <Matching/>
  },

  {path: "/messages", element: 
    <Messages/>
  },

  {path: '/settings', element:
      <Settings/>
  },

  {path: '/profile', element:
    <Profile/>
  },


// {path: '/profile', element:
//     <>

//       <Profile/>
//     </>
// },

// {path: '/update_password', element:
//   <ProtectedRoute>
//     <>
//       <Update_password/>
//     </>
//   </ProtectedRoute>
// },
// {path: '/login', element:
//   <PublicOnlyRoute>
//     <>
//       <Login/>
//     </>
//   </PublicOnlyRoute>
// },

// {path: '/signup', element:
//   <PublicOnlyRoute>
//     <>
//       <Signup/>
//     </>
//   </PublicOnlyRoute>
// },


])

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router}/>
  </StrictMode>,
)
