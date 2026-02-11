import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import BeachMap from './pages/BeachMap';
import Services from './pages/Services';
import Settings from './pages/Settings';
import POS from './pages/POS';
import Transactions from './pages/Transactions';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Dashboard />} />
        <Route path="pos" element={<POS />} />
        <Route path="map" element={<BeachMap />} />
        <Route path="services" element={<Services />} />
        <Route path="transactions" element={<Transactions />} />
        <Route path="settings" element={<Settings />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}

export default App;
