import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { UserProvider, useUser } from './contexts/UserContext';
import { LanguageProvider } from './contexts/useTranslation';
import { Entry } from './pages/Entry';
import { Onboarding } from './pages/Onboarding';
import { ProtectedLayout } from './components/ProtectedLayout';
import { Dashboard } from './pages/Dashboard';
import { WorkoutView } from './pages/WorkoutView';
import { AdminShell } from './pages/admin/AdminShell';
import { ExerciseBrowser } from './pages/ExerciseBrowser';
import { Settings } from './pages/Settings';
import { WorkoutHistory } from './pages/WorkoutHistory';
import { AdventureSession } from './pages/AdventureSession';

const AppRoutes = () => {
    const { loading, isAdmin } = useUser();
    if (loading) return <div className="h-screen w-screen bg-background flex items-center justify-center text-foreground">Loading Protocol...</div>;

    return (
        <Routes>
            <Route path="/" element={<Entry />} />
            <Route path="/onboarding" element={<Onboarding />} />
            <Route path="/app" element={<ProtectedLayout />}>
                <Route path="dashboard" element={<Dashboard />} />
                <Route path="workout/:week/:day" element={<WorkoutView />} />
                <Route path="adventure" element={<AdventureSession />} />
                <Route path="adventure/:logId" element={<AdventureSession />} />
                <Route path="settings" element={<Settings />} />
                <Route path="history" element={<WorkoutHistory />} />
                <Route path="exercises" element={<ExerciseBrowser />} />
                <Route index element={<Navigate to="dashboard" replace />} />
            </Route>
            <Route path="/admin" element={isAdmin ? <AdminShell /> : <Navigate to="/" replace />} />
        </Routes>
    );
};

function App() {
    return (
        <LanguageProvider>
            <UserProvider>
                <Router>
                    <AppRoutes />
                </Router>
            </UserProvider>
        </LanguageProvider>
    );
}

export default App;
