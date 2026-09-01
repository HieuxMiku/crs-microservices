import {
    BrowserRouter,
    Routes,
    Route,
    Navigate
} from 'react-router-dom';

import {
    AuthProvider
} from './context/AuthContext';

import ProtectedRoute
    from './components/ProtectedRoute';

import LoginPage
    from './pages/LoginPage';

import CoursesPage
    from './pages/CoursesPage';

import AdminCoursesPage
    from './pages/AdminCoursesPage';

import Navbar
    from './components/Navbar';
import RegisterCoursePage from "./pages/RegisterCoursesPage.tsx";

import MyRegistrationsPage from './pages/MyRegistrationsPage.tsx';

function App() {

    return (
        <BrowserRouter>

            <AuthProvider>

                <Navbar />

                <Routes>

                    <Route
                        path="/"
                        element={
                            <Navigate
                                to="/courses"
                                replace
                            />
                        }
                    />

                    <Route
                        path="/login"
                        element={<LoginPage />}
                    />

                    <Route
                        path="/courses"
                        element={<CoursesPage />}
                    />

                    <Route
                        path="/admin/courses"
                        element={
                            <ProtectedRoute
                                requiredRole="ADMIN"
                            >
                                <AdminCoursesPage />
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="/register-course"
                        element={
                            <ProtectedRoute
                                requiredRole="STUDENT"
                            >
                                <RegisterCoursePage />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/my-registrations"
                        element={
                            <ProtectedRoute
                                requiredRole="STUDENT"
                            >
                                <MyRegistrationsPage />
                            </ProtectedRoute>
                        }
                    />

                </Routes>

            </AuthProvider>

        </BrowserRouter>
    );
}

export default App;