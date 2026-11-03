import { type ReactNode, useState, useEffect } from 'react';
import { useAppContext } from '../../context/AppContext';
import Header from './Header';
import Sidebar from './Sidebar';

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const { theme } = useAppContext();
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

  return (
    <div className={`min-h-screen ${
      theme === 'dark' 
        ? 'bg-primary-950 text-text-primary' 
        : 'bg-gray-50 text-gray-900'
    }`}>
      {/* Header pour mobile */}
      {isMobile && <Header />}

      {/* Header pour desktop */}
      {!isMobile && <Header />}

      {/* Sidebar pour desktop */}
      {!isMobile && <Sidebar />}

      {/* Sidebar pour mobile */}
      {isMobile && <Sidebar />}

      {/* Contenu principal */}
      <main
        className={`transition-all duration-300 ${
          isMobile ? 'pt-16' : 'ml-0 md:ml-64 pt-20'
        }`}
      >
        {children}
      </main>

      {/* Notifications/Toasts */}
      <div id="toast-container" className="fixed bottom-4 right-4 space-y-2 z-50"></div>
    </div>
  );
}
