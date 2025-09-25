// App.jsx
// Configures application routes and renders the persistent navigation shell.
import { Navigate, Route, Routes } from 'react-router-dom';
import NavBar from './components/layout/NavBar.jsx';
import SearchPage from './routes/SearchPage.jsx';
import UniversityDetailPage from './routes/UniversityDetailPage.jsx';
import ComparePage from './routes/ComparePage.jsx';
import DashboardPage from './routes/DashboardPage.jsx';
import ProfileOnboarding from './routes/ProfileOnboarding.jsx';
import ProfilePage from './routes/ProfilePage.jsx';

const App = () => (
  <div className="min-h-screen bg-slate-50">
    <NavBar />
    <div className="pt-24 pb-16">
      <Routes>
        <Route path="/" element={<Navigate to="/search" replace />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/university/:id" element={<UniversityDetailPage />} />
        <Route path="/compare" element={<ComparePage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/onboarding" element={<ProfileOnboarding />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="*" element={<Navigate to="/search" replace />} />
      </Routes>
    </div>
  </div>
);

export default App;
