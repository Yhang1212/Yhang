import { useState } from 'react';
import Home from './pages/Home';
import Products from './pages/Products';
import AdminDashboard from './pages/AdminDashboard';
import LoginPage from './pages/LoginPage';

function App() {
  const [currentPage, setCurrentPage] = useState('home');

  if (currentPage === 'products') {
    return <Products onNavigate={setCurrentPage} />;
  }

  if (currentPage === 'admin') {
    return <AdminDashboard />;
  }

  if (currentPage === 'login') {
    return <LoginPage onNavigate={setCurrentPage} />;
  }

  return <Home onNavigate={setCurrentPage} />;
}

export default App;
