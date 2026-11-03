import { useState, useEffect, useCallback, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAppContext } from '../../context/AppContext';
import type { CareerNode } from '../../types';
import careersData from '../../data/careers.json';

export default function ResultsPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { } = useAppContext();
  const [scores, setScores] = useState<Record<string, number>>({});
  const [recommendedCareers, setRecommendedCareers] = useState<CareerNode[]>([]);
  const [topDomains, setTopDomains] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'results' | 'recommendations' | 'analysis'>('results');

  // Récupérer les données du quiz depuis la navigation
  useEffect(() => {
    const state = location.state as {
      scores?: Record<string, number>;
      answers?: Record<string, string | string[]>;
      format?: string;
      questions?: any[];
    } | null;

    if (state?.scores) {
      setScores(state.scores);
      
      // Trouver les domaines principaux
      const sortedDomains = Object.entries(state.scores)
        .sort(([, a], [, b]) => b - a)
        .map(([domain]) => domain);
      setTopDomains(sortedDomains);

      // Trouver les métiers recommandés
      const recommendations: CareerNode[] = [];
      
      // Fonction pour trouver un nœud par son domaine ou nom
      const findNodesByDomain = (nodes: CareerNode[], domain: string): CareerNode[] => {
        const results: CareerNode[] = [];
        for (const node of nodes) {
          if (node.domain?.toLowerCase().includes(domain.toLowerCase()) ||
              node.name?.toLowerCase().includes(domain.toLowerCase())) {
            results.push(node);
          }
          if (node.children) {
            results.push(...findNodesByDomain(node.children, domain));
          }
        }
        return results;
      };

      // Trouver les métiers pour chaque domaine
      const data = careersData as unknown as CareerNode[];
      for (const domain of sortedDomains.slice(0, 3)) {
        const found = findNodesByDomain(data, domain);
        recommendations.push(...found.slice(0, 2));
      }

      // Supprimer les doublons
      const uniqueRecommendations = Array.from(new Map(recommendations.map(n => [n.id, n])).values());
      setRecommendedCareers(uniqueRecommendations.slice(0, 6));
      
    } else {
      // Si pas de scores, prendre quelques métiers aléatoires
      const flatCareers: CareerNode[] = [];
      const data = careersData as unknown as CareerNode[];
      const flattenTree = (nodes: CareerNode[]) => {
        for (const node of nodes) {
          if (!node.children || node.children.length === 0) {
            flatCareers.push(node);
          }
          if (node.children) {
            flattenTree(node.children);
          }
        }
      };
      flattenTree(data);
      setRecommendedCareers(flatCareers.slice(0, 6));
    }

    setIsLoading(false);
  }, [location.state]);

  // Calculer le total des scores
  const totalScore = useMemo(() => (
    Object.values(scores).reduce((sum, score) => sum + score, 0)
  ), [scores]);

  // Calculer le pourcentage pour chaque domaine
  const domainPercentages = useMemo(() => {
    if (totalScore === 0) return {};
    const percentages: Record<string, number> = {};
    Object.entries(scores).forEach(([domain, score]) => {
      percentages[domain] = (score / totalScore) * 100;
    });
    return percentages;
  }, [scores, totalScore]);

  // Déterminer le domaine principal
  const primaryDomain = useMemo(() => {
    if (topDomains.length === 0) return null;
    return topDomains[0];
  }, [topDomains]);

  // Formater le nom du domaine
  const formatDomainName = useCallback((domain: string) => {
    const domainNames: Record<string, string> = {
      'development': 'Développement',
      'web': 'Web',
      'mobile': 'Mobile',
      'backend': 'Backend',
      'frontend': 'Frontend',
      'fullstack': 'Full Stack',
      'data': 'Données',
      'ai': 'Intelligence Artificielle',
      'cybersecurity': 'Cybersécurité',
      'devops': 'DevOps',
      'cloud': 'Cloud',
      'network': 'Réseaux',
      'system': 'Systèmes',
      'game': 'Jeux Vidéo',
      'design': 'Design',
      'product': 'Produit',
      'management': 'Management',
      'it': 'Informatique Générale',
      'database': 'Bases de Données',
      'general': 'Général'
    };
    return domainNames[domain.toLowerCase()] || domain;
  }, []);

  // Rendu du graphique des scores
  const renderScoreChart = useCallback(() => {
    if (Object.keys(scores).length === 0) {
      return (
        <div className="text-center py-12">
          <p className="text-text-secondary">Aucun score disponible</p>
        </div>
      );
    }

    return (
      <div className="space-y-4">
        <h3 className="text-xl font-semibold text-white mb-6">Répartition de vos affinités</h3>
        <div className="space-y-3">
          {Object.entries(scores)
            .sort(([, a], [, b]) => b - a)
            .map(([domain, score]) => {
              const percentage = domainPercentages[domain] || 0;
              const domainName = formatDomainName(domain);
              
              return (
                <div key={domain} className="space-y-2">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-white font-medium">{domainName}</span>
                    <span className="text-text-secondary text-sm">{score} pts ({Math.round(percentage)}%)</span>
                  </div>
                  <div className="h-4 bg-primary-700/50 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-accent-gold via-accent-ice to-accent-emerald rounded-full transition-all duration-1000"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
        </div>
      </div>
    );
  }, [scores, domainPercentages, formatDomainName]);

  // Rendu des métiers recommandés
  const renderRecommendations = useCallback(() => (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold text-white mb-4">
        Métiers recommandés pour vous
      </h3>
      
      {primaryDomain && (
        <div className="bg-gradient-to-r from-accent-ice/10 to-accent-gold/10 rounded-2xl p-6 mb-6">
          <div className="text-center">
            <span className="text-4xl mb-2 block">🎯</span>
            <h4 className="text-2xl font-bold text-white mb-2">
              Domaine principal: {formatDomainName(primaryDomain)}
            </h4>
            <p className="text-text-secondary">
              Vos réponses montrent une forte affinité avec le domaine du {formatDomainName(primaryDomain).toLowerCase()}.
            </p>
          </div>
        </div>
      )}

      {recommendedCareers.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {recommendedCareers.map((career) => (
            <button
              key={career.id}
              onClick={() => navigate(`/career/${career.id}`)}
              className="bg-primary-800/30 rounded-2xl p-5 text-left hover:bg-primary-800/50 transition-all duration-200 border border-primary-700/20 group"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-start space-x-3">
                  <span className="text-2xl text-text-secondary group-hover:text-accent-ice">
                    {career.icon || career.emoji || '⭐'}
                  </span>
                  <div>
                    <h4 className="text-white font-semibold group-hover:text-accent-ice">{career.name}</h4>
                    <p className="text-text-secondary text-sm">{career.domain}</p>
                  </div>
                </div>
                <span className="text-text-tertiary text-xl group-hover:text-accent-ice">→</span>
              </div>
              {career.shortDescription && (
                <p className="text-text-secondary text-sm line-clamp-2">{career.shortDescription}</p>
              )}
            </button>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-text-secondary text-lg">
            Aucun métier recommandé trouvé basé sur vos réponses.
          </p>
          <p className="text-text-tertiary text-sm mt-2">
            Explorez l'arbre des métiers pour découvrir toutes les possibilités.
          </p>
        </div>
      )}
    </div>
  ), [recommendedCareers, primaryDomain, formatDomainName, navigate]);

  // Analyse détaillée
  const renderAnalysis = useCallback(() => (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold text-white mb-6">Analyse détaillée</h3>

      {topDomains.length > 0 && (
        <div className="bg-primary-800/30 rounded-2xl p-6">
          <h4 className="text-lg font-semibold text-white mb-4">Top 3 de vos domaines</h4>
          <div className="space-y-4">
            {topDomains.slice(0, 3).map((domain, index) => {
              const domainName = formatDomainName(domain);
              const percentage = domainPercentages[domain] || 0;
              const medal = index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉';
              
              return (
                <div 
                  key={domain}
                  className={`p-4 rounded-xl ${
                    index === 0 ? 'bg-gradient-to-r from-accent-gold/20 to-accent-gold/10 border border-accent-gold/30' :
                    index === 1 ? 'bg-gradient-to-r from-accent-ice/20 to-accent-ice/10 border border-accent-ice/30' :
                    'bg-gradient-to-r from-accent-emerald/20 to-accent-emerald/10 border border-accent-emerald/30'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">{medal}</span>
                      <span className="text-white font-semibold">{domainName}</span>
                    </div>
                    <span className="text-white font-bold">{Math.round(percentage)}%</span>
                  </div>
                  <div className="mt-2 h-2 bg-white/10 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-white rounded-full transition-all duration-500"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Suggestions basées sur les combinaisons de domaines */}
      {topDomains.length >= 2 && (
        <div className="bg-primary-800/30 rounded-2xl p-6">
          <h4 className="text-lg font-semibold text-white mb-4">Combinaisons intéressantes</h4>
          <p className="text-text-secondary text-sm mb-4">
            Vos intérêts combinent plusieurs domaines, ce qui ouvre des opportunités uniques :
          </p>
          <div className="flex flex-wrap gap-2">
            {topDomains.slice(0, 3).map(domain => (
              <span 
                key={domain}
                className="px-3 py-1 bg-accent-ice/10 text-accent-ice rounded-full text-sm font-medium"
              >
                {formatDomainName(domain)}
              </span>
            ))}
          </div>
          <p className="text-text-tertiary text-xs mt-3">
            Exemple : {formatDomainName(topDomains[0])} + {formatDomainName(topDomains[1])} pourrait correspondre à un rôle hybride comme "DevOps" ou "Full Stack Developer"
          </p>
        </div>
      )}

      <div className="bg-primary-800/30 rounded-2xl p-6">
        <h4 className="text-lg font-semibold text-white mb-4">Prochaines étapes</h4>
        <div className="space-y-3">
          <button
            onClick={() => {
              navigate('/quiz');
              window.location.reload();
            }}
            className="w-full p-4 bg-accent-ice/10 text-accent-ice rounded-xl hover:bg-accent-ice/20 transition-all duration-200 text-left"
          >
            <span className="mr-2">🔄</span> Recommencer le quiz
          </button>
          <button
            onClick={() => navigate('/schools')}
            className="w-full p-4 bg-accent-emerald/10 text-accent-emerald rounded-xl hover:bg-accent-emerald/20 transition-all duration-200 text-left"
          >
            <span className="mr-2">🎓</span> Trouver des formations
          </button>
          <button
            onClick={() => navigate('/')}
            className="w-full p-4 bg-accent-gold/10 text-accent-gold rounded-xl hover:bg-accent-gold/20 transition-all duration-200 text-left"
          >
            <span className="mr-2">🌳</span> Explorer tous les métiers
          </button>
        </div>
      </div>
    </div>
  ), [topDomains, domainPercentages, formatDomainName, navigate]);

  // Rendu des onglets
  const renderTabs = useCallback(() => (
    <div className="flex flex-wrap justify-center gap-2 mb-8">
      {[
        { id: 'results' as const, label: 'Résultats', icon: '📊' },
        { id: 'recommendations' as const, label: 'Recommandations', icon: '🎯' },
        { id: 'analysis' as const, label: 'Analyse', icon: '🔍' }
      ].map((tab) => (
        <button
          key={tab.id}
          onClick={() => setActiveTab(tab.id)}
          className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 flex items-center space-x-2 ${
            activeTab === tab.id
              ? 'bg-accent-ice/10 text-accent-ice border border-accent-ice/30'
              : 'bg-primary-800/50 text-text-secondary hover:bg-primary-800/80'
          }`}
        >
          <span>{tab.icon}</span>
          <span>{tab.label}</span>
        </button>
      ))}
    </div>
  ), [activeTab]);

  // Rendu du contenu principal
  const renderContent = useCallback(() => {
    switch (activeTab) {
      case 'recommendations':
        return renderRecommendations();
      case 'analysis':
        return renderAnalysis();
      case 'results':
      default:
        return renderScoreChart();
    }
  }, [activeTab, renderScoreChart, renderRecommendations, renderAnalysis]);

  // Vue principale
  if (isLoading) {
    return (
      <div className="min-h-screen bg-primary-950 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin text-6xl mb-4">🌀</div>
          <p className="text-white text-xl">Calcul de vos résultats...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-primary-950">
      <div className="max-w-4xl mx-auto px-4 py-20">
        {/* Animation de fond */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden -z-10">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-accent-ice/5 rounded-full blur-3xl animate-pulse-slow"></div>
          <div className="absolute top-1/2 right-1/4 w-96 h-96 bg-accent-gold/5 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '2s' }}></div>
          <div className="absolute bottom-1/4 left-1/2 w-80 h-80 bg-accent-emerald/5 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '4s' }}></div>
        </div>

        {/* En-tête */}
        <div className="text-center mb-12">
          <div className="animate-bounce mb-4">
            <span className="text-6xl">🎉</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Voici vos résultats !
          </h1>
          <p className="text-text-secondary text-lg max-w-2xl mx-auto">
            Basé sur vos réponses, nous avons identifié les domaines et métiers qui correspondent le mieux à votre profil.
          </p>
        </div>

        {/* Onglets */}
        {renderTabs()}

        {/* Contenu */}
        {renderContent()}

        {/* Bouton de retour */}
        <div className="mt-12 text-center">
          <button
            onClick={() => navigate('/')}
            className="px-8 py-4 btn-skyrim-ice"
          >
            ← Retour à l'accueil
          </button>
        </div>
      </div>
    </div>
  );
}
