import { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppContext } from '../../context/AppContext';
import type { CareerNode, School } from '../../types';
import careersData from '../../data/careers.json';
import schoolsData from '../../data/schools.json';

export default function CareerDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { } = useAppContext();
  const [career, setCareer] = useState<CareerNode | null>(null);
  const [relatedSchools, setRelatedSchools] = useState<School[]>([]);
  const [relatedCareers, setRelatedCareers] = useState<CareerNode[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'description' | 'schools' | 'resources' | 'related'>('description');

  // Trouver le métier dans la structure de données
  useEffect(() => {
    const findNodeById = (nodes: CareerNode[], targetId: string): CareerNode | null => {
      for (const node of nodes) {
        if (node.id === targetId) {
          return node;
        }
        if (node.children) {
          const found = findNodeById(node.children, targetId);
          if (found) return found;
        }
      }
      return null;
    };

    const foundCareer = findNodeById(careersData as unknown as CareerNode[], id || '');
    if (foundCareer) {
      setCareer(foundCareer);
      
      // Trouver les écoles associées
      const schools: School[] = [];
      if (foundCareer.relatedSchools) {
        const schoolsArray = schoolsData as unknown as School[];
        foundCareer.relatedSchools.forEach(schoolId => {
          const school = schoolsArray.find((s: School) => s.id === schoolId);
          if (school) schools.push(school);
        });
      }
      setRelatedSchools(schools);

      // Trouver les métiers associés
      if (foundCareer.relatedCareers) {
        const related: CareerNode[] = [];
        foundCareer.relatedCareers.forEach(relatedId => {
          const relatedNode = findNodeById(careersData as unknown as CareerNode[], relatedId);
          if (relatedNode) related.push(relatedNode);
        });
        setRelatedCareers(related);
      }
    }

    setIsLoading(false);
  }, [id]);

  const formatSalary = useCallback((salary?: { min?: number; max?: number; currency?: string }) => {
    if (!salary) return 'Non spécifié';
    const min = salary.min || 0;
    const max = salary.max || 0;
    const currency = salary.currency || '€';
    
    if (min === max) {
      return `${min.toLocaleString()} ${currency}/an`;
    }
    return `${min.toLocaleString()} - ${max.toLocaleString()} ${currency}/an`;
  }, []);

  const formatTag = useCallback((tag: string) => {
    const tagConfig: Record<string, { label: string; color: string }> = {
      'beginner': { label: 'Débutant', color: 'emerald' },
      'intermediate': { label: 'Intermédiaire', color: 'ice' },
      'advanced': { label: 'Avancé', color: 'gold' },
      'high_demand': { label: 'Forte demande', color: 'gold' },
      'remote': { label: 'Télétravail', color: 'emerald' },
      'freelance': { label: 'Freelance', color: 'purple' },
      'team': { label: 'Équipe', color: 'ice' },
      'creative': { label: 'Créatif', color: 'purple' },
      'technical': { label: 'Technique', color: 'gold' },
      'managerial': { label: 'Management', color: 'ice' }
    };
    
    const config = tagConfig[tag];
    return config || { label: tag, color: 'ice' };
  }, []);

  const renderDescription = useCallback(() => (
    <div className="space-y-6">
      {career?.description && (
        <div className="bg-primary-800/30 rounded-2xl p-6">
          <h3 className="text-xl font-semibold text-white mb-4">Description</h3>
          <p className="text-text-secondary whitespace-pre-line">{career.description}</p>
        </div>
      )}

      {career?.responsibilities && career.responsibilities.length > 0 && (
        <div className="bg-primary-800/30 rounded-2xl p-6">
          <h3 className="text-xl font-semibold text-white mb-4">Responsabilités principales</h3>
          <ul className="space-y-3">
            {career.responsibilities.map((responsibility: string, index: number) => (
              <li key={index} className="flex items-start space-x-3">
                <span className="text-accent-ice mt-1">✓</span>
                <span className="text-text-secondary">{responsibility}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {career?.skills && career.skills.length > 0 && (
        <div className="bg-primary-800/30 rounded-2xl p-6">
          <h3 className="text-xl font-semibold text-white mb-4">Compétences clés</h3>
          <div className="flex flex-wrap gap-3">
            {career.skills.map((skill: string, index: number) => (
              <span key={index} className="px-4 py-2 bg-accent-gold/10 text-accent-gold rounded-full text-sm font-medium">
                {skill}
              </span>
            ))}
          </div>
        </div>
      )}

      {(career?.salary || career?.experienceLevel) && (
        <div className="bg-primary-800/30 rounded-2xl p-6">
          <h3 className="text-xl font-semibold text-white mb-4">Informations pratiques</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {career.salary && (
              <div>
                <p className="text-text-secondary text-sm mb-1">Salaire moyen</p>
                <p className="text-white font-semibold">{formatSalary(career.salary)}</p>
              </div>
            )}
            {career.experienceLevel && (
              <div>
                <p className="text-text-secondary text-sm mb-1">Niveau d'expérience</p>
                <p className="text-white font-semibold">{formatTag(career.experienceLevel).label}</p>
              </div>
            )}
            {career.workEnvironment && (
              <div>
                <p className="text-text-secondary text-sm mb-1">Environnement</p>
                <p className="text-white font-semibold">{career.workEnvironment}</p>
              </div>
            )}
          </div>
        </div>
      )}

      {career?.tags && career.tags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {career.tags.map((tag: string, index: number) => {
            const { label, color } = formatTag(tag);
            return (
              <span 
                key={index} 
                className={`px-3 py-1 text-xs font-medium rounded-full bg-accent-${color}/10 text-accent-${color}`}
              >
                {label}
              </span>
            );
          })}
        </div>
      )}
    </div>
  ), [career, formatSalary, formatTag]);

  const renderSchools = useCallback(() => (
    <div className="space-y-4">
      {relatedSchools.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {relatedSchools.map((school: School) => (
            <div 
              key={school.id}
              className="bg-primary-800/30 rounded-2xl p-5 hover:bg-primary-800/50 transition-all duration-200 border border-primary-700/20"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-start space-x-3">
                  <div className={`px-2 py-1 rounded text-xs font-bold ${
                    school.type === 'university' 
                      ? 'bg-accent-emerald/20 text-accent-emerald'
                      : school.type === 'private' 
                      ? 'bg-accent-gold/20 text-accent-gold'
                      : 'bg-accent-ice/20 text-accent-ice'
                  }`}>
                    {school.type === 'university' ? '🎓' : school.type === 'private' ? '🏢' : '🏫'}
                  </div>
                  <div>
                    <h4 className="text-white font-semibold">{school.name}</h4>
                    <p className="text-text-secondary text-sm">{school.location}</p>
                  </div>
                </div>
                {school.ranking && (
                  <span className="px-2 py-1 bg-accent-gold/20 text-accent-gold rounded-full text-xs font-medium">
                    #{school.ranking}
                  </span>
                )}
              </div>
              
              <div className="mb-3">
                {school.degrees && school.degrees.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-2">
                    {school.degrees.slice(0, 3).map((degree: string, index: number) => (
                      <span key={index} className="px-2 py-1 bg-primary-700/50 text-text-secondary rounded-full text-xs">
                        {degree}
                      </span>
                    ))}
                  </div>
                )}
                {school.specialties && school.specialties.length > 0 && (
                  <p className="text-text-tertiary text-xs">
                    Spécialités: {school.specialties.join(', ')}
                  </p>
                )}
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-primary-700/20">
                {school.website && (
                  <a 
                    href={school.website} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-accent-ice hover:text-accent-ice/80 text-sm flex items-center space-x-1"
                  >
                    <span>🔗</span>
                    <span>Site web</span>
                  </a>
                )}
                {school.tuition && (
                  <p className="text-text-secondary text-sm">
                    Frais: {school.tuition}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-text-secondary text-lg">
            Aucune école spécifique associée à ce métier.
          </p>
          <p className="text-text-tertiary text-sm mt-2">
            Consultez notre liste complète d'écoles pour trouver votre formation.
          </p>
          <button 
            onClick={() => navigate('/schools')}
            className="mt-4 px-6 py-3 btn-skyrim-ice"
          >
            Voir toutes les écoles
          </button>
        </div>
      )}
    </div>
  ), [relatedSchools, navigate]);

  const renderResources = useCallback(() => (
    <div className="space-y-6">
      {career?.resources && career.resources.length > 0 && (
        <div className="bg-primary-800/30 rounded-2xl p-6">
          <h3 className="text-xl font-semibold text-white mb-4">Ressources recommandées</h3>
          <div className="space-y-3">
            {career.resources.map((resource: any, index: number) => (
              <a
                key={index}
                href={resource.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-3 p-4 bg-primary-700/20 rounded-lg hover:bg-primary-700/40 transition-all duration-200 group"
              >
                <span className="text-2xl text-text-secondary group-hover:text-accent-ice">
                  {resource.type === 'course' ? '📚' : resource.type === 'book' ? '📖' : resource.type === 'video' ? '🎥' : '🔗'}
                </span>
                <div className="flex-1">
                  <p className="text-white font-medium group-hover:text-accent-ice">{resource.title}</p>
                  <p className="text-text-secondary text-sm">{resource.description}</p>
                </div>
                <span className="text-text-tertiary text-xs">→</span>
              </a>
            ))}
          </div>
        </div>
      )}

      {career?.tools && career.tools.length > 0 && (
        <div className="bg-primary-800/30 rounded-2xl p-6">
          <h3 className="text-xl font-semibold text-white mb-4">Outils utilisés</h3>
          <div className="flex flex-wrap gap-3">
            {career.tools.map((tool: string, index: number) => (
              <span key={index} className="px-4 py-2 bg-accent-purple/10 text-accent-purple rounded-full text-sm font-medium">
                {tool}
              </span>
            ))}
          </div>
        </div>
      )}

      {career?.certifications && career.certifications.length > 0 && (
        <div className="bg-primary-800/30 rounded-2xl p-6">
          <h3 className="text-xl font-semibold text-white mb-4">Certifications utiles</h3>
          <div className="space-y-2">
            {career.certifications.map((cert: string, index: number) => (
              <div key={index} className="flex items-center space-x-3 p-3 bg-primary-700/20 rounded-lg">
                <span className="text-xl">🏆</span>
                <span className="text-white font-medium">{cert}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  ), [career]);

  const renderRelated = useCallback(() => (
    <div className="space-y-6">
      {relatedCareers.length > 0 ? (
        <>
          <h3 className="text-xl font-semibold text-white mb-6">Métiers associés</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {relatedCareers.map((related: CareerNode) => (
              <button
                key={related.id}
                onClick={() => navigate(`/career/${related.id}`)}
                className="bg-primary-800/30 rounded-2xl p-5 text-left hover:bg-primary-800/50 transition-all duration-200 border border-primary-700/20 group"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-start space-x-3">
                    <span className="text-2xl text-text-secondary group-hover:text-accent-ice">
                      {related.icon || related.emoji || '⭐'}
                    </span>
                    <div>
                      <h4 className="text-white font-semibold group-hover:text-accent-ice">{related.name}</h4>
                      <p className="text-text-secondary text-sm">{related.domain}</p>
                    </div>
                  </div>
                  <span className="text-text-tertiary text-xl group-hover:text-accent-ice">→</span>
                </div>
                {related.description && (
                  <p className="text-text-secondary text-sm line-clamp-2">{related.description}</p>
                )}
              </button>
            ))}
          </div>
        </>
      ) : (
        <div className="text-center py-12">
          <p className="text-text-secondary text-lg">
            Aucun métier associé trouvé.
          </p>
        </div>
      )}

      {career?.parentId && (
        <div className="mt-8">
          <h3 className="text-xl font-semibold text-white mb-4">Domaine parent</h3>
          <button
            onClick={() => navigate(`/career/${career.parentId}`)}
            className="w-full bg-primary-800/30 rounded-2xl p-5 text-left hover:bg-primary-800/50 transition-all duration-200 border border-primary-700/20 group"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <span className="text-2xl">⬆️</span>
                <span className="text-white font-semibold group-hover:text-accent-ice">
                  Retour au domaine parent
                </span>
              </div>
              <span className="text-accent-ice">→</span>
            </div>
          </button>
        </div>
      )}
    </div>
  ), [relatedCareers, career, navigate]);

  // Rendu de l'en-tête
  const renderHeader = useCallback(() => {
    if (!career) return null;
    
    return (
      <div className="relative overflow-hidden rounded-3xl mb-8">
        {/* Gradient de fond */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary-800 via-primary-900 to-primary-950"></div>
        
        {/* Effet de brillance */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-accent-gold via-accent-ice to-accent-emerald opacity-30"></div>
        
        {/* Contenu */}
        <div className="relative p-8 md:p-12">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center space-x-4 mb-4">
                <span className="text-4xl md:text-5xl">{career.icon || career.emoji || '⭐'}</span>
                <div>
                  <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white">
                    {career.name}
                  </h1>
                  <p className="text-lg text-text-secondary mt-1">{career.domain}</p>
                </div>
              </div>
              
              {career.shortDescription && (
                <p className="text-xl text-text-secondary max-w-2xl">
                  {career.shortDescription}
                </p>
              )}

              <div className="mt-6 flex flex-wrap gap-3">
                {career.tags?.map((tag: string, index: number) => {
                  const { label, color } = formatTag(tag);
                  return (
                    <span 
                      key={index} 
                      className={`px-4 py-2 text-sm font-medium rounded-full bg-accent-${color}/10 text-accent-${color}`}
                    >
                      {label}
                    </span>
                  );
                })}
              </div>
            </div>

            <div className="hidden lg:flex flex-col space-y-3">
              {career.salary && (
                <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 text-center">
                  <p className="text-text-secondary text-sm">Salaire</p>
                  <p className="text-2xl font-bold text-accent-gold">{formatSalary(career.salary)}</p>
                </div>
              )}
              {career.experienceLevel && (
                <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 text-center">
                  <p className="text-text-secondary text-sm">Niveau</p>
                  <p className="text-xl font-semibold text-accent-ice">
                    {formatTag(career.experienceLevel).label}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }, [career, formatTag, formatSalary]);

  // Rendu des onglets
  const renderTabs = useCallback(() => (
    <div className="flex flex-wrap justify-center gap-2 mb-8">
      {[
        { id: 'description' as const, label: 'Description', icon: '📋' },
        { id: 'schools' as const, label: 'Formations', icon: '🎓' },
        { id: 'resources' as const, label: 'Ressources', icon: '📚' },
        { id: 'related' as const, label: 'Associés', icon: '🔗' }
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
      case 'description':
        return renderDescription();
      case 'schools':
        return renderSchools();
      case 'resources':
        return renderResources();
      case 'related':
        return renderRelated();
      default:
        return renderDescription();
    }
  }, [activeTab, renderDescription, renderSchools, renderResources, renderRelated]);

  // Vue principale
  if (isLoading) {
    return (
      <div className="min-h-screen bg-primary-950 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin text-6xl mb-4">🌀</div>
          <p className="text-white text-xl">Chargement...</p>
        </div>
      </div>
    );
  }

  if (!career) {
    return (
      <div className="min-h-screen bg-primary-950 flex items-center justify-center">
        <div className="text-center max-w-md">
          <h2 className="text-3xl font-bold text-white mb-4">Métier non trouvé</h2>
          <p className="text-text-secondary mb-6">
            Le métier que vous cherchez n'existe pas ou a été supprimé.
          </p>
          <button onClick={() => navigate('/')} className="px-8 py-4 btn-skyrim-gold">
            Retour à l'accueil
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-primary-950">
      <div className="max-w-6xl mx-auto px-4 py-20">
        {/* Animation de fond */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden -z-10">
          <div className="absolute top-1/2 left-1/2 w-[800px] h-[800px] bg-gradient-to-r from-accent-ice/5 via-accent-gold/5 to-accent-emerald/5 rounded-full blur-3xl animate-pulse-slow"></div>
        </div>

        {/* En-tête */}
        {renderHeader()}

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
            ← Retour à l'arbre
          </button>
        </div>
      </div>
    </div>
  );
}
