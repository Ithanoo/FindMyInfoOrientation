import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import type { CareerNode, ThemeType, ViewType } from '../types';

// Type pour le contexte
interface AppContextType {
  theme: ThemeType;
  setTheme: (theme: ThemeType) => void;
  currentView: ViewType;
  setCurrentView: (view: ViewType) => void;
  selectedCareer: CareerNode | null;
  setSelectedCareer: (career: CareerNode | null) => void;
  zoomLevel: number;
  setZoomLevel: (level: number) => void;
  toggleTheme: () => void;
}

// Contexte par défaut
const AppContext = createContext<AppContextType | undefined>(undefined);

// Props pour le provider
interface AppProviderProps {
  children: ReactNode;
}

// Composant Provider
export function AppProvider({ children }: AppProviderProps) {
  const [theme, setTheme] = useState<ThemeType>('dark');
  const [currentView, setCurrentView] = useState<ViewType>('tree');
  const [selectedCareer, setSelectedCareer] = useState<CareerNode | null>(null);
  const [zoomLevel, setZoomLevel] = useState<number>(1);

  // Charger le thème depuis localStorage au montage
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as ThemeType | null;
    if (savedTheme) {
      setTheme(savedTheme);
    }
  }, []);

  // Sauvegarder le thème dans localStorage
  useEffect(() => {
    localStorage.setItem('theme', theme);
    // Appliquer le thème au document
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  // Basculer entre les thèmes
  const toggleTheme = useCallback(() => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  }, []);

  // Valeur du contexte
  const contextValue: AppContextType = {
    theme,
    setTheme,
    currentView,
    setCurrentView,
    selectedCareer,
    setSelectedCareer,
    zoomLevel,
    setZoomLevel,
    toggleTheme
  };

  return (
    <AppContext.Provider value={contextValue}>
      {children}
    </AppContext.Provider>
  );
}

// Hook personnalisé pour utiliser le contexte
export function useAppContext() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
}
