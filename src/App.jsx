import React from 'react';
import {
    BrowserRouter as Router,
    Route,
    Routes,
    Navigate,
    useLocation,
} from "react-router-dom";
import Login from './components/login.jsx';
import Dashboard from './components/dashboard.jsx';
import Navbar from './components/navbar.jsx';
import ChangePassword from './components/changePassword.jsx';
import Register from './components/register.jsx';
import BookAppointment from './components/bookAppointment.jsx';
import ViewAppointment from './components/viewAppoinments.jsx';
import Users from './components/users.jsx';

const Layout = ({ children }) => {
    const location = useLocation();
    return (
        <>
            {location.pathname !== '/login' && <Navbar />}
            {children}
        </>
    );
};

const App = () => {
    const userData = localStorage.getItem('userData');

    return (
        <Router>
            <Layout>
                <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/change-password" element={<ChangePassword />} />
                    <Route path="/register-employee" element={<Register />} />
                    <Route path="/register-doctor" element={<Register />} />
                    <Route path="/book-appointment" element={<BookAppointment />} />
                    <Route path="/view-appointments" element={<ViewAppointment />} />
                    <Route path="/users" element={<Users />} />
                    <Route path="/" element={userData ? <Navigate to="/dashboard" /> : <Navigate to="/login" />} />
                </Routes>
            </Layout>
        </Router>
    );
};

export default App;