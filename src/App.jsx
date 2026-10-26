import { useEffect, useState } from 'react';
import Home from './pages/Home';
import Products from './pages/Products';
import AdminDashboard from './pages/AdminDashboard';
import LoginPage from './pages/LoginPage';
import CreateAccount from './pages/CreateAccount';

function pageFromLocation() {
  const route = window.location.hash.replace(/^#\/?/, '').split('?')[0].split('/')[0];
  return ['products', 'admin', 'login', 'create-account'].includes(route) ? route : 'home';
}

function App() {
  const [currentPage, setCurrentPage] = useState(pageFromLocation);

  useEffect(() => {
    const syncRoute = () => setCurrentPage(pageFromLocation());
    window.addEventListener('hashchange', syncRoute);
    window.addEventListener('popstate', syncRoute);
    return () => {
      window.removeEventListener('hashchange', syncRoute);
      window.removeEventListener('popstate', syncRoute);
    };
  }, []);

  const navigate = (page, category) => {
    const suffix = page === 'home' ? '/' : '/' + page + (page === 'products' && category ? '?category=' + encodeURIComponent(category) : '');
    const next = '#' + suffix;
    if (window.location.hash !== next) window.history.pushState({}, '', next);
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (currentPage === 'products') return <Products onNavigate={navigate} />;
  if (currentPage === 'admin') return <AdminDashboard onNavigate={navigate} />;
  if (currentPage === 'login') return <LoginPage onNavigate={navigate} />;
  if (currentPage === 'create-account') return <CreateAccount onNavigate={navigate} />;
  return <Home onNavigate={navigate} />;
}
export default App;
