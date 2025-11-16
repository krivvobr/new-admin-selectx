import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout/Layout';
import Dashboard from './pages/Dashboard';
import Properties from './pages/Properties';
import Leads from './pages/Leads';
import Cities from './pages/Cities';
import Neighborhoods from './pages/Neighborhoods';
import Profiles from './pages/Profiles';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="properties" element={<Properties />} />
          <Route path="leads" element={<Leads />} />
          <Route path="cities" element={<Cities />} />
          <Route path="neighborhoods" element={<Neighborhoods />} />
          <Route path="profiles" element={<Profiles />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
