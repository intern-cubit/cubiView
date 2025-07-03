import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useSelector } from 'react-redux';

import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegistrationPage from './pages/RegistrationPage';
import ResetPassword from './pages/ResetPassword';
import ForgotPassword from './pages/ForgotPassword';
import { Navigate } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import AddDevicePage from './pages/AddDevicePage';
import DeviceDetails from './pages/DeviceDetails';
import SuperAdminDashboard from './pages/superAdminDashboard';
import UploadReport from './pages/UploadReport';

const App = () => {
    const isAuth = useSelector((s) => s.auth.isAuthenticated);
    const isAdmin = useSelector((s) => s.auth.isAdmin);
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route
                    path="/login"
                    // element={!isAuth ? <LoginPage /> : isAdmin ? <Navigate to={"/admin/dashboard"} /> : <Navigate to={"/dashboard"} />}
                    element={<LoginPage />}
                />
                <Route
                    path="/register"
                    // element={!isAuth ? <RegistrationPage /> : isAdmin ? <Navigate to={"/admin/dashboard"} /> : <Navigate to={"/dashboard"} />}
                    element={<RegistrationPage />}
                />
                <Route
                    path="/reset-password/:token"
                    // element={!isAuth ? <ResetPassword /> : isAdmin ? <Navigate to={"/admin/dashboard"} /> : <Navigate to={"/dashboard"} />}
                    element={<ResetPassword />}
                />
                <Route
                    path="forgot-password"
                    // element={!isAuth ? <ForgotPassword /> : isAdmin ? <Navigate to={"/admin/dashboard"} /> : <Navigate to={"/dashboard"} />}
                    element={<ForgotPassword />}
                />
                <Route 
                    path="/dashboard"
                    // element={isAuth ? <Dashboard /> : <Navigate to={"/login"} />}
                    element={<Dashboard />}
                />
                <Route
                    path='/add-device'
                    // element={isAuth ? <AddDeviceForm /> : <Navigate to={"/login"} />}
                    element={<AddDevicePage />}
                />
                <Route
                    path="/device/:systemId"
                    // element={isAuth ? <DeviceDetails /> : <Navigate to={"/login"} />}
                    element={<DeviceDetails />}
                />
                <Route
                    path="/admin/dashboard"
                    // element={isAuth && isAdmin ? <AdminDashboard /> : <Navigate to={"/login"} />}
                    element={<SuperAdminDashboard />}
                />
                <Route
                    path='/upload-report'
                    // element={isAuth ? <UploadReport /> : <Navigate to={"/login"} />}
                    element={<UploadReport />}
                />
            </Routes>
        </BrowserRouter>
    )
}

export default App