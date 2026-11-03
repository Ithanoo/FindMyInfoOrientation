import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import TreeView from '../Tree/TreeView';
import type { CareerNode } from '../../types';

export default function HomePage() {
  const navigate = useNavigate();
  const [highlightedCareers, setHighlightedCareers] = useState<Partial<CareerNode>[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Partial<CareerNode>[]>([]);
  const [showSearch, setShowSearch] = useState(false);

  // Métiers mis en avant
  useEffect(() => {
    // Sélectionner quelques métiers populaires à mettre en avant
    const popularCareers: Partial<CareerNode>[] = [
      { id: 'web-developer', name: 'Développeur Web', domain: 'Web', icon: '🌐' },
      { id: 'data-scientist', name: 'Data Scientist', domain: 'Data', icon: '📊' },
      { id: 'cybersecurity-expert', name: 'Expert en Cybersécurité', domain: 'Cybersecurity', icon: '🔒' },
      { id: 'devops-engineer', name: 'Ingénieur DevOps', domain: 'DevOps', icon: '⚙️' },
      { id: 'ai-engineer', name: 'Ingénieur IA', domain: 'AI', icon: '🤖' },
      { id: 'mobile-developer', name: 'Développeur Mobile', domain: 'Mobile', icon: '📱' }
    ];
    setHighlightedCareers(popularCareers);
  }, []);

  // Recherche dans les métiers
  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
    
    if (query.length < 2) {
      setSearchResults([]);
      return;
    }

    // Ici, on devrait rechercher dans la structure de données complète
    // Pour l'instant, on simule avec les métiers mis en avant
    const results = highlightedCareers.filter(career =>
      career.name?.toLowerCase().includes(query.toLowerCase()) ||
      career.domain?.toLowerCase().includes(query.toLowerCase()) ||
      career.id?.toLowerCase().includes(query.toLowerCase())
    );
    
    setSearchResults(results);
  }, [highlightedCareers]);

  // Navigation rapide vers un métier
  const navigateToCareer = useCallback((careerId: string) => {
    navigate(`/career/${careerId}`);
    setShowSearch(false);
    setSearchQuery('');
    setSearchResults([]);
  }, [navigate]);

  // Rendu de la section de recherche
  const renderSearch = () => (
    <div className="relative mb-8">
      <div className="max-w-2xl mx-auto">
        <div className="relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl text-text-secondary">
            🔍
          </span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="Recherchez un métier, un domaine..."
            className="w-full pl-12 pr-12 py-4 bg-primary-800/50 border border-primary-700/30 rounded-2xl text-white placeholder-text-tertiary focus:outline-none focus:ring-2 focus:ring-accent-ice/50 focus:border-accent-ice/30 text-lg"
          />
          {searchQuery && (
            <button
              onClick={() => {
                setSearchQuery('');
                setSearchResults([]);
              }}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-text-secondary hover:text-white text-xl"
            >
              ✕
            </button>
          )}
        </div>

        {/* Résultats de recherche */}
        {searchQuery && searchResults.length > 0 && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-primary-800/80 backdrop-blur-lg rounded-2xl border border-primary-700/30 p-4 z-50">
            <div className="space-y-2 max-h-80 overflow-y-auto">
              {searchResults.map((career, index) => (
                <button
                  key={index}
                  onClick={() => career.id && navigateToCareer(career.id)}
                  className="w-full p-3 rounded-xl hover:bg-primary-700/50 transition-colors text-left flex items-center space-x-3 group"
                >
                  <span className="text-2xl text-text-secondary group-hover:text-accent-ice">
                    {career.icon || '⭐'}
                  </span>
                  <div>
                    <p className="text-white font-semibold group-hover:text-accent-ice">{career.name}</p>
                    {career.domain && (
                      <p className="text-text-secondary text-sm">{career.domain}</p>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {searchQuery && searchResults.length === 0 && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-primary-800/80 backdrop-blur-lg rounded-2xl border border-primary-700/30 p-4 z-50">
            <p className="text-text-secondary text-center">
              Aucun résultat trouvé pour "{searchQuery}"
            </p>
          </div>
        )}
      </div>
    </div>
  );

  // Rendu des métiers mis en avant
  const renderHighlightedCareers = () => (
    <div className="bg-primary-800/30 rounded-3xl p-6 mb-12 border border-primary-700/30">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-white">
          Métiers populaires
        </h2>
        <button
          onClick={() => navigate('/schools')}
          className="px-4 py-2 bg-accent-emerald/10 text-accent-emerald rounded-xl hover:bg-accent-emerald/20 transition-colors text-sm"
        >
          Voir toutes les formations
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {highlightedCareers.map((career, index) => (
          <button
            key={index}
            onClick={() => career.id && navigateToCareer(career.id)}
            className="bg-primary-700/20 rounded-xl p-4 text-center hover:bg-primary-700/40 transition-all duration-200 group border border-primary-600/20"
          >
            <span className="text-3xl mb-2 block text-text-secondary group-hover:text-accent-ice">
              {career.icon}
            </span>
            <p className="text-white font-medium group-hover:text-accent-ice text-sm line-clamp-2">
              {career.name}
            </p>
          </button>
        ))}
      </div>
    </div>
  );

  // Rendu de l'introduction
  const renderIntroduction = () => (
    <div className="text-center mb-12 animate-fadeIn">
      <div className="mb-6">
        <span className="text-6xl md:text-7xl">🌳</span>
      </div>
      <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
        Découvrez l'informatique
      </h1>
      <p className="text-xl text-text-secondary max-w-3xl mx-auto mb-8">
        Explorez les différents domaines de l'informatique à travers un arbre interactif, 
        trouvez votre voie avec notre quiz d'orientation, et découvrez les formations qui vous correspondent.
      </p>
      
      <div className="flex flex-wrap justify-center gap-4">
        <button
          onClick={() => setShowSearch(true)}
          className="px-8 py-4 btn-skyrim-ice text-lg"
        >
          🔍 Rechercher un métier
        </button>
        <button
          onClick={() => navigate('/quiz')}
          className="px-8 py-4 btn-skyrim-gold text-lg"
        >
          ✨ Faire le quiz
        </button>
        <button
          onClick={() => navigate('/schools')}
          className="px-8 py-4 btn-skyrim-emerald text-lg"
        >
          🎓 Voir les écoles
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-primary-950">
      <div className="max-w-7xl mx-auto px-4 py-20">
        {/* Animation de fond */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden -z-10">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-accent-ice/5 to-accent-gold/5 rounded-full blur-3xl animate-pulse-slow"></div>
          <div className="absolute top-1/2 right-1/4 w-[600px] h-[600px] bg-gradient-to-r from-accent-gold/5 to-accent-emerald/5 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '2s' }}></div>
          <div className="absolute bottom-1/4 left-1/2 w-80 h-80 bg-gradient-to-r from-accent-emerald/5 to-accent-ice/5 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '4s' }}></div>
        </div>

        {/* Introduction */}
        {renderIntroduction()}

        {/* Recherche */}
        {showSearch && renderSearch()}

        {/* Arbre interactif */}
        <div className="bg-primary-800/30 rounded-3xl p-6 mb-12 border border-primary-700/30">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white">
              Arbre des métiers de l'informatique
            </h2>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => navigate('/about')}
                className="px-4 py-2 bg-white/5 text-white rounded-xl hover:bg-white/10 transition-colors text-sm"
                title="À propos"
              >
                ℹ️
              </button>
            </div>
          </div>
          
          <div className="h-[600px] md:h-[800px] w-full overflow-hidden">
            <TreeView />
          </div>

          <div className="mt-6 text-center text-text-secondary text-sm">
            <p>💡 Cliquez sur les nœuds pour explorer les différents domaines et métiers</p>
            <p className="mt-2">Survolez pour voir les détails, cliquez pour développer les sous-domaines</p>
          </div>
        </div>

        {/* Métiers mis en avant */}
        {renderHighlightedCareers()}

        {/* Sections d'information */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-primary-800/30 rounded-2xl p-6 border border-primary-700/30">
            <div className="text-4xl mb-4">✨</div>
            <h3 className="text-xl font-semibold text-white mb-2">Quiz d'orientation</h3>
            <p className="text-text-secondary text-sm mb-4">
              Découvrez quel domaine de l'informatique vous correspond le mieux en répondant à quelques questions.
            </p>
            <button
              onClick={() => navigate('/quiz')}
              className="px-6 py-3 btn-skyrim-gold text-sm"
            >
              Commencer le quiz
            </button>
          </div>

          <div className="bg-primary-800/30 rounded-2xl p-6 border border-primary-700/30">
            <div className="text-4xl mb-4">🎓</div>
            <h3 className="text-xl font-semibold text-white mb-2">Formations</h3>
            <p className="text-text-secondary text-sm mb-4">
              Trouvez les meilleures écoles, universités et formations en informatique en France.
            </p>
            <button
              onClick={() => navigate('/schools')}
              className="px-6 py-3 btn-skyrim-ice text-sm"
            >
              Explorer les formations
            </button>
          </div>

          <div className="bg-primary-800/30 rounded-2xl p-6 border border-primary-700/30">
            <div className="text-4xl mb-4">📚</div>
            <h3 className="text-xl font-semibold text-white mb-2">Ressources</h3>
            <p className="text-text-secondary text-sm mb-4">
              Accédez à des ressources, conseils et informations pour vous orienter vers la bonne voie.
            </p>
            <button
              onClick={() => navigate('/about')}
              className="px-6 py-3 btn-skyrim-emerald text-sm"
            >
              En savoir plus
            </button>
          </div>
        </div>

        {/* Pied de page */}
        <div className="text-center text-text-tertiary text-sm">
          <p>© {new Date().getFullYear()} - FindMyInfo Orientation</p>
          <p className="mt-1">Une application pour vous aider à trouver votre voie en informatique</p>
        </div>
      </div>
    </div>
  );
}
