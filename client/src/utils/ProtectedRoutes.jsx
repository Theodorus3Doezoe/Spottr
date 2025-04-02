import { Outlet, Navigate } from 'react-router-dom';

const ProtectedRoutes = () => {
    // Controleer of de token bestaat in localStorage
    const token = localStorage.getItem('token');

    // Bepaal of de gebruiker geauthenticeerd is
    // !!token zet de waarde om naar true als er een token is, anders false
    const isAuthenticated = !!token;

    // Gebruik de uitkomst van de check
    return isAuthenticated ? <Outlet/> : <Navigate to='/login'/>;

    // Of korter geschreven:
    // return token ? <Outlet/> : <Navigate to='/login'/>;
}

export default ProtectedRoutes;