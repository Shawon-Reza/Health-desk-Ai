import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ children }) => {
    // Check if user is logged in by looking for auth token in localStorage
    const auth = localStorage.getItem('auth');
    const isLoggedIn = auth ? JSON.parse(auth)?.access : null;

    // If user is logged in, render the component, otherwise redirect to login
    return isLoggedIn ? children : <Navigate to="/login" replace />;

    

    
};

export default PrivateRoute;
