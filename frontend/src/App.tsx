import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import React, { useEffect, useState, Suspense, lazy } from 'react';
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { useAuth } from './hooks/useAuth';
import useServerStatus from './hooks/useServerStatus';
import ErrorBoundary from "./pages/Error/ErrorBoundary.tsx";
import LoadingSpinner from "./components/Menu/LoadingSpinner.tsx";


import LoginPage from './pages/Auth/LoginPage';
import NoAccessPage from './pages/Error/NoAccesPage';
import NotConnectionPage from './pages/Error/NotConnectionPage';
import NotAuthPage from './pages/Error/NotAuthPage';
import NotFoundPage from './pages/Error/NotFoundPage';
import BuildingPage from "./pages/Objects/BuildingPage.tsx";

import UsersPage from "./pages/Admin/UsersPage.tsx";
import UserPage from "./pages/User/UserPage.tsx";
import ProtectedRoute from './store/routes/protectedRoute';

const App = () => {
    const { refresh, user } = useAuth();
    const [loading, setLoading] = useState(true);
    const { serverConnected, checkServerConnection } = useServerStatus();

    const handleInteraction = () => {
        checkServerConnection();
    };

    useEffect(() => {
        const initializeAuth = async () => {
            const token = localStorage.getItem('token');
            if (token) {
                await refresh();
            }
            setLoading(false);
        };

        initializeAuth();

        const tokenRefreshInterval = setInterval(() => {
            const token = localStorage.getItem('token');
            if (token) {
                refresh();
            }
        }, 60 * 1000);

        return () => clearInterval(tokenRefreshInterval);
    }, [refresh]);

    if (!serverConnected) {
        return <NotConnectionPage />;
    }

    return (
        <Router>
            <ErrorBoundary>
                <ToastContainer />
                <Suspense fallback={<LoadingSpinner />}>
                    <Routes>
                        <Route path="/" element={<LoginPage onClick={handleInteraction} />} />
                        <Route path="/no-access" element={<NoAccessPage onClick={handleInteraction} />} />
                        <Route path="/no-connection" element={<NotConnectionPage />} />
                        <Route path="/no-auth" element={<NotAuthPage onClick={handleInteraction} />} />

                        <Route element={<ProtectedRoute allowedRoles={[2, 3]} />}>
                            <Route path="/building" element={<BuildingPage onClick={handleInteraction} />} />
                            <Route path="/building/users" element={<UsersPage onClick={handleInteraction} />} />

                        </Route>



                        <Route path="*" element={<NotFoundPage />} />
                    </Routes>
                </Suspense>
            </ErrorBoundary>
        </Router>
    );
};

export default App;
