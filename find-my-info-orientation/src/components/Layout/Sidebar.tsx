import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAppContext } from '../../context/AppContext';
import type { ViewType } from '../../types';

export default function Sidebar() {
  const { currentView, setCurrentView } = useAppContext();
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Détecter si on est sur mobile
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Synchroniser avec la route
  useEffect(() => {
    const path = location.pathname;
    const viewMap: Record<string, ViewType> = {
      '/': 'tree',
      '/quiz': 'quiz',
      '/quiz/results': 'quiz',
      '/schools': 'schools',
      '/career': 'career',
      '/about': 'about'
    };
    
    for (const [pathPrefix, view] of Object.entries(viewMap)) {
      if (path.startsWith(pathPrefix)) {
        setCurrentView(view);
        break;
      }
    }
  }, [location.pathname, setCurrentView]);

  // Toggle sidebar sur mobile
  useEffect(() => {
    if (isMobile) {
      setIsOpen(false);
    }
  }, [isMobile, location.pathname]);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const navItems = [
    { 
      id: 'tree' as const,
      path: '/', 
      label: 'Arbre', 
      icon: '🌳',
      color: 'ice' 
    },
    { 
      id: 'quiz' as const, 
      path: '/quiz', 
      label: 'Quiz', 
      icon: '✨',
      color: 'gold' 
    },
    { 
      id: 'schools' as const, 
      path: '/schools', 
      label: 'Écoles', 
      icon: '🎓',
      color: 'emerald' 
    },
    { 
      id: 'about' as const, 
      path: '/about', 
      label: 'À propos', 
      icon: 'ℹ️', 
      color: 'purple'
    }
  ];

  // Rendu de la sidebar
  return (
    <>
      {/* Bouton de toggle pour mobile */}
      {isMobile && (
        <button
          onClick={toggleSidebar}
          className="fixed top-4 left-4 z-50 p-3 rounded-xl bg-primary-800/50 border border-primary-700/30 text-white hover:bg-primary-800/80 transition-colors"
        >
          <span className="text-xl">☰</span>
        </button>
      )}

      {/* Overlay pour mobile */}
      {isMobile && isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 bottom-0 w-64 bg-primary-900/95 backdrop-blur-lg border-r border-primary-700/30 z-50 transition-transform duration-300 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } ${isMobile ? 'md:translate-x-0' : ''}`}
      >
        {/* Logo */}
        <div className="p-6 border-b border-primary-700/30">
          <Link to="/" className="flex items-center space-x-3" onClick={() => isMobile && setIsOpen(false)}>
            <div className="relative">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-accent-gold to-accent-ice flex items-center justify-center">
                <span className="text-lg font-bold text-primary-900">FMI</span>
              </div>
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-accent-ice rounded-full animate-pulse"></div>
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">FindMyInfo</h2>
            </div>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="p-4">
          <ul className="space-y-2">
            {navItems.map((item) => (
              <li key={item.id}>
                <Link
                  to={item.path}
                  onClick={() => {
                    setCurrentView(item.id);
                    if (isMobile) setIsOpen(false);
                  }}
                  className={`flex items-center space-x-3 p-4 rounded-xl transition-all duration-200 ${
                    currentView === item.id
                      ? `bg-accent-${item.color}/10 text-accent-${item.color} border border-accent-${item.color}/30`
                      : 'text-text-secondary hover:text-text-primary hover:bg-primary-800/50'
                  }`}
                >
                  <span className="text-xl">{item.icon}</span>
                  <span className="font-medium">{item.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Section inférieure */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-primary-700/30">
          {/* Toggle thème */}
          <button
            onClick={() => navigate('/')}
            className="w-full p-3 rounded-xl text-left flex items-center space-x-3 hover:bg-primary-800/50 transition-colors text-text-secondary"
          >
            <span className="text-xl">🏠</span>
            <span>Accueil</span>
          </button>
        </div>
      </aside>
    </>
  );
}
