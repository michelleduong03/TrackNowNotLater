import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import Register from './components/Register';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import LandingPage from './components/LandingPage';
import PrivacyPolicy from './components/PrivacyPolicy';
import TermsOfUse from './components/TermsOfUse'

function LandingWrapper() {
  const navigate = useNavigate();

  return (
    <LandingPage
      onLogin={() => navigate('/login')}
      onRegister={() => navigate('/register')}
    />
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingWrapper />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/privacy" element={<PrivacyPolicy />} />
        <Route path="/terms" element={<TermsOfUse />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
