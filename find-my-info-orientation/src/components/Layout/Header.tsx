import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAppContext } from '../../context/AppContext';

export default function Header() {
  const { currentView, setCurrentView, theme, setTheme } = useAppContext();
  const navigate = useNavigate();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);

  // Détecter le scroll pour l'effet de fond
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Synchroniser avec la route
  useEffect(() => {
    const path = location.pathname;
    if (path === '/') {
      setCurrentView('tree');
    } else if (path.startsWith('/quiz')) {
      setCurrentView('quiz');
    } else if (path.startsWith('/schools')) {
      setCurrentView('schools');
    } else if (path.startsWith('/career')) {
      setCurrentView('career');
    } else if (path.startsWith('/about')) {
      setCurrentView('about');
    }
  }, [location.pathname, setCurrentView]);

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-primary-900/90 backdrop-blur-lg shadow-lg shadow-black/30'
          : 'bg-primary-900/50 backdrop-blur-sm'
      } border-b border-primary-700/30`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="relative">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-accent-gold to-accent-ice flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
                <span className="text-xl font-bold text-primary-900">FMI</span>
              </div>
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-accent-ice rounded-full animate-pulse"></div>
            </div>
            <div className="hidden sm:block">
              <h1 className="text-xl font-bold text-white tracking-tight">FindMyInfo</h1>
              <p className="text-xs text-text-secondary -mt-1">Découvrez votre voie en informatique</p>
            </div>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            <Link
              to="/"
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                currentView === 'tree'
                  ? 'bg-accent-ice/10 text-accent-ice border border-accent-ice/30'
                  : 'text-text-secondary hover:text-text-primary hover:bg-primary-800/50'
              }`}
            >
              <span className="mr-1">🌳</span> Arbre
            </Link>
            <Link
              to="/quiz"
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                currentView === 'quiz'
                  ? 'bg-accent-gold/10 text-accent-gold border border-accent-gold/30'
                  : 'text-text-secondary hover:text-text-primary hover:bg-primary-800/50'
              }`}
            >
              <span className="mr-1">✨</span> Quiz
            </Link>
            <Link
              to="/schools"
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                currentView === 'schools'
                  ? 'bg-accent-emerald/10 text-accent-emerald border border-accent-emerald/30'
                  : 'text-text-secondary hover:text-text-primary hover:bg-primary-800/50'
              }`}
            >
              <span className="mr-1">🎓</span> Écoles
            </Link>
            <Link
              to="/about"
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                currentView === 'about'
                  ? 'bg-accent-purple/10 text-accent-purple border border-accent-purple/30'
                  : 'text-text-secondary hover:text-text-primary hover:bg-primary-800/50'
              }`}
            >
              <span className="mr-1">ℹ️</span> À propos
            </Link>
          </nav>

          {/* Actions */}
          <div className="flex items-center space-x-2">
            {/* Bouton pour le quiz (mobile) */}
            <button
              onClick={() => navigate('/quiz')}
              className="md:hidden px-4 py-2 btn-skyrim-gold text-sm"
            >
              Quiz
            </button>

            {/* Toggle thème */}
            <button
              onClick={toggleTheme}
              className={`p-2 rounded-lg transition-all duration-200 ${
                theme === 'dark'
                  ? 'bg-accent-gold/10 text-accent-gold hover:bg-accent-gold/20'
                  : 'bg-accent-ice/10 text-accent-ice hover:bg-accent-ice/20'
              }`}
              title={`Passer en mode ${theme === 'dark' ? 'clair' : 'sombre'}`}
            >
              {theme === 'dark' ? '☀️' : '🌙'}
            </button>

            {/* Bouton de retour si on est sur une vue détaillée */}
            {(currentView === 'career' || location.pathname.startsWith('/career')) && (
              <button
                onClick={() => navigate('/')}
                className="p-2 rounded-lg bg-primary-800/50 hover:bg-primary-800 text-text-primary transition-colors duration-200"
                title="Retour à l'accueil"
              >
                ←
              </button>
            )}

            {/* Menu mobile */}
            <button className="md:hidden p-2 rounded-lg hover:bg-primary-800/50 transition-colors duration-200">
              <span className="text-xl">☰</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
