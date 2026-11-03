import { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../../context/AppContext';
import type { School, CareerNode } from '../../types';
import schoolsData from '../../data/schools.json';
import careersData from '../../data/careers.json';

export default function SchoolsView() {
  const navigate = useNavigate();
  const { } = useAppContext();
  const [schools, setSchools] = useState<School[]>([]);
  const [filteredSchools, setFilteredSchools] = useState<School[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    type: '' as string | '',
    location: '' as string | '',
    degree: '' as string | '',
    domain: '' as string | ''
  });
  const [sortBy, setSortBy] = useState<'name' | 'ranking' | 'tuition'>('ranking');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [selectedSchool, setSelectedSchool] = useState<School | null>(null);
  const [careerDomains, setCareerDomains] = useState<string[]>([]);

  // Charger les données au montage
  useEffect(() => {
    // Charger les écoles
    const schoolsArray = schoolsData as unknown as School[];
    setSchools(schoolsArray);
    setFilteredSchools(schoolsArray);

    // Extraire les domaines des métiers
    const domains: Set<string> = new Set();
    const extractDomains = (nodes: CareerNode[]) => {
      for (const node of nodes) {
        if (node.domain) {
          domains.add(node.domain);
        }
        if (node.children) {
          extractDomains(node.children);
        }
      }
    };
    const careersArray = careersData as unknown as CareerNode[];
    extractDomains(careersArray);
    setCareerDomains(Array.from(domains).sort());

    setIsLoading(false);
  }, []);

  // Filtrer les écoles
  useEffect(() => {
    let results = [...schools];

    // Filtre par recherche
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      results = results.filter(school =>
        school.name.toLowerCase().includes(query) ||
        school.location.toLowerCase().includes(query) ||
        (school.description && school.description.toLowerCase().includes(query)) ||
        (school.degrees && school.degrees.some((d: string) => d.toLowerCase().includes(query))) ||
        (school.specialties && school.specialties.some((s: string) => s.toLowerCase().includes(query)))
      );
    }

    // Filtre par type
    if (filters.type) {
      results = results.filter(school => school.type === filters.type);
    }

    // Filtre par localisation
    if (filters.location) {
      results = results.filter(school => 
        school.location.toLowerCase().includes(filters.location!.toLowerCase())
      );
    }

    // Filtre par diplôme
    if (filters.degree) {
      results = results.filter(school => 
        school.degrees && school.degrees.includes(filters.degree!)
      );
    }

    // Filtre par domaine
    if (filters.domain) {
      results = results.filter(school => 
        school.specialties && school.specialties.some((s: string) => 
          s.toLowerCase().includes(filters.domain!.toLowerCase())
        )
      );
    }

    // Tri
    results.sort((a, b) => {
      let comparison = 0;
      
      switch (sortBy) {
        case 'name':
          comparison = a.name.localeCompare(b.name);
          break;
        case 'ranking':
          const aRank = a.ranking || Infinity;
          const bRank = b.ranking || Infinity;
          comparison = aRank - bRank;
          break;
        case 'tuition':
          const aTuition = parseTuition(a.tuition);
          const bTuition = parseTuition(b.tuition);
          comparison = aTuition - bTuition;
          break;
      }

      return sortOrder === 'asc' ? comparison : -comparison;
    });

    setFilteredSchools(results);
  }, [schools, searchQuery, filters, sortBy, sortOrder]);

  // Helper pour parser les frais de scolarité
  const parseTuition = useCallback((tuition?: string): number => {
    if (!tuition) return Infinity;
    const match = tuition.match(/[\d,]+/);
    if (!match) return Infinity;
    const amount = match[0].replace(',', '');
    return parseInt(amount) || Infinity;
  }, []);

  // Obtenir les valeurs uniques pour les filtres
  const getUniqueValues = useCallback((field: keyof School): (string | undefined)[] => {
    const values: Set<string | undefined> = new Set();
    schools.forEach(school => {
      const value = school[field];
      if (value) {
        if (Array.isArray(value)) {
          value.forEach((v: string) => values.add(v));
        } else {
          values.add(value as string | undefined);
        }
      }
    });
    return Array.from(values).filter((v): v is string => v !== undefined).sort();
  }, [schools]);

  // Obtenir les types d'écoles uniques
  const schoolTypes = useMemo(() => getUniqueValues('type'), [getUniqueValues]);

  // Obtenir les localisations uniques
  const locations = useMemo(() => {
    const uniqueLocations: Set<string> = new Set();
    schools.forEach(school => {
      if (school.location) {
        // Extraire juste la ville (avant la virgule ou le code postal)
        const city = school.location.split(',')[0].trim();
        uniqueLocations.add(city);
      }
    });
    return Array.from(uniqueLocations).sort();
  }, [schools]);

  // Obtenir les diplômes uniques
  const allDegrees = useMemo(() => {
    const degreesSet: Set<string> = new Set();
    schools.forEach(school => {
      if (school.degrees) {
        school.degrees.forEach((d: string) => degreesSet.add(d));
      }
    });
    return Array.from(degreesSet).sort();
  }, [schools]);

  // Gérer la sélection d'une école
  const handleSchoolSelect = useCallback((school: School) => {
    setSelectedSchool(school);
    // Faire défiler vers le haut
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // Fermer la fiche détaillée
  const handleCloseDetail = useCallback(() => {
    setSelectedSchool(null);
  }, []);

  // Rendu du filtre
  const renderFilters = () => (
    <div className="bg-primary-800/30 rounded-2xl p-6 mb-8">
      <h3 className="text-xl font-semibold text-white mb-6">Filtres</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Recherche */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-text-secondary">Recherche</label>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Nom, ville, diplôme..."
            className="w-full px-4 py-2 bg-primary-700/50 border border-primary-600/30 rounded-lg text-white placeholder-text-tertiary focus:outline-none focus:ring-2 focus:ring-accent-ice/50 focus:border-accent-ice/30"
          />
        </div>

        {/* Type d'école */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-text-secondary">Type</label>
          <select
            value={filters.type}
            onChange={(e) => setFilters({ ...filters, type: e.target.value })}
            className="w-full px-4 py-2 bg-primary-700/50 border border-primary-600/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-accent-ice/50"
          >
            <option value="">Tous les types</option>
            {schoolTypes.filter((t): t is string => t !== undefined).map((type: string) => (
              <option key={type} value={type}>
                {type === 'university' ? 'Université' : type === 'private' ? 'École privée' : type}
              </option>
            ))}
          </select>
        </div>

        {/* Localisation */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-text-secondary">Ville</label>
          <select
            value={filters.location}
            onChange={(e) => setFilters({ ...filters, location: e.target.value })}
            className="w-full px-4 py-2 bg-primary-700/50 border border-primary-600/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-accent-ice/50"
          >
            <option value="">Toutes les villes</option>
            {locations.slice(0, 20).map((location: string) => (
              <option key={location} value={location}>{location}</option>
            ))}
          </select>
        </div>

        {/* Diplôme */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-text-secondary">Diplôme</label>
          <select
            value={filters.degree}
            onChange={(e) => setFilters({ ...filters, degree: e.target.value })}
            className="w-full px-4 py-2 bg-primary-700/50 border border-primary-600/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-accent-ice/50"
          >
            <option value="">Tous les diplômes</option>
            {allDegrees.slice(0, 10).map((degree: string) => (
              <option key={degree} value={degree}>{degree}</option>
            ))}
          </select>
        </div>

        {/* Domaine */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-text-secondary">Domaine</label>
          <select
            value={filters.domain}
            onChange={(e) => setFilters({ ...filters, domain: e.target.value })}
            className="w-full px-4 py-2 bg-primary-700/50 border border-primary-600/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-accent-ice/50"
          >
            <option value="">Tous les domaines</option>
            {careerDomains.slice(0, 10).map(domain => (
              <option key={domain} value={domain}>{domain}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Tri */}
      <div className="mt-6 pt-4 border-t border-primary-700/30 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center space-x-2">
          <span className="text-sm text-text-secondary">Trier par</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as 'name' | 'ranking' | 'tuition')}
            className="px-3 py-1 bg-primary-700/50 border border-primary-600/30 rounded text-white text-sm"
          >
            <option value="name">Nom</option>
            <option value="ranking">Classement</option>
            <option value="tuition">Frais de scolarité</option>
          </select>
          <button
            onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
            className="px-3 py-1 bg-primary-700/50 border border-primary-600/30 rounded text-white text-sm"
          >
            {sortOrder === 'asc' ? '⬆️' : '⬇️'}
          </button>
        </div>

        <button
          onClick={() => {
            setSearchQuery('');
            setFilters({ type: '', location: '', degree: '', domain: '' });
            setSortBy('ranking');
            setSortOrder('asc');
          }}
          className="px-4 py-2 bg-accent-ice/10 text-accent-ice rounded-lg hover:bg-accent-ice/20 transition-colors text-sm"
        >
          Réinitialiser
        </button>
      </div>
    </div>
  );

  // Rendu de la liste des écoles
  const renderSchoolList = () => (
    <div className="space-y-4">
      {filteredSchools.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredSchools.map((school: School) => (
            <button
              key={school.id}
              onClick={() => handleSchoolSelect(school)}
              className="bg-primary-800/30 rounded-2xl p-5 text-left hover:bg-primary-800/50 transition-all duration-200 border border-primary-700/20 group w-full"
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
                    <h4 className="text-white font-semibold group-hover:text-accent-ice">{school.name}</h4>
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
                  <p className="text-text-tertiary text-xs line-clamp-1">
                    {school.specialties.join(', ')}
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
                    onClick={(e) => e.stopPropagation()}
                  >
                    <span>🔗</span>
                    <span>Site</span>
                  </a>
                )}
                {school.tuition && (
                  <p className="text-text-secondary text-sm">
                    {school.tuition}
                  </p>
                )}
              </div>
            </button>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🔍</div>
          <h3 className="text-xl font-semibold text-white mb-2">Aucune école trouvée</h3>
          <p className="text-text-secondary">
            Aucun résultat ne correspond à vos critères de recherche.
          </p>
          <p className="text-text-tertiary text-sm mt-2">
            Essayez d'ajuster vos filtres.
          </p>
        </div>
      )}
    </div>
  );

  // Rendu de la fiche détaillée d'une école
  const renderSchoolDetail = () => {
    if (!selectedSchool) return null;

    return (
      <div className="bg-primary-800/30 rounded-3xl p-6 mb-8 border border-primary-700/30">
        {/* En-tête */}
        <div className="flex items-start justify-between mb-6">
          <div className="flex-1">
            <div className="flex items-center space-x-4 mb-4">
              <div className={`px-3 py-2 rounded-2xl text-2xl ${
                selectedSchool.type === 'university'
                  ? 'bg-accent-emerald/20 text-accent-emerald'
                  : selectedSchool.type === 'private'
                  ? 'bg-accent-gold/20 text-accent-gold'
                  : 'bg-accent-ice/20 text-accent-ice'
              }`}>
                {selectedSchool.type === 'university' ? '🎓' : selectedSchool.type === 'private' ? '🏢' : '🏫'}
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">{selectedSchool.name}</h2>
                <p className="text-text-secondary text-lg">{selectedSchool.location}</p>
              </div>
            </div>

            {selectedSchool.description && (
              <p className="text-text-secondary text-lg">{selectedSchool.description}</p>
            )}
          </div>

          <button
            onClick={handleCloseDetail}
            className="text-2xl text-text-secondary hover:text-white transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Informations principales */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-primary-700/20 rounded-xl p-4">
            <h4 className="text-sm font-medium text-text-secondary mb-2">Type</h4>
            <p className="text-white font-semibold">
              {selectedSchool.type === 'university' ? 'Université publique' : 
               selectedSchool.type === 'private' ? 'École privée' : 'Autre'}
            </p>
          </div>
          
          {selectedSchool.ranking && (
            <div className="bg-primary-700/20 rounded-xl p-4">
              <h4 className="text-sm font-medium text-text-secondary mb-2">Classement</h4>
              <p className="text-white font-bold text-xl text-accent-gold">#{selectedSchool.ranking}</p>
            </div>
          )}
          
          {selectedSchool.tuition && (
            <div className="bg-primary-700/20 rounded-xl p-4">
              <h4 className="text-sm font-medium text-text-secondary mb-2">Frais de scolarité</h4>
              <p className="text-white font-semibold">{selectedSchool.tuition}</p>
            </div>
          )}
        </div>

        {/* Diplômes proposés */}
        {selectedSchool.degrees && selectedSchool.degrees.length > 0 && (
          <div className="mb-8">
            <h4 className="text-lg font-semibold text-white mb-4">Diplômes proposés</h4>
            <div className="flex flex-wrap gap-3">
              {selectedSchool.degrees.map((degree: string, index: number) => (
                <span 
                  key={index} 
                  className="px-4 py-2 bg-accent-ice/10 text-accent-ice rounded-full text-sm font-medium"
                >
                  {degree}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Spécialités */}
        {selectedSchool.specialties && selectedSchool.specialties.length > 0 && (
          <div className="mb-8">
            <h4 className="text-lg font-semibold text-white mb-4">Spécialités</h4>
            <div className="flex flex-wrap gap-3">
              {selectedSchool.specialties.map((specialty: string, index: number) => (
                <span 
                  key={index} 
                  className="px-4 py-2 bg-accent-emerald/10 text-accent-emerald rounded-full text-sm font-medium"
                >
                  {specialty}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Statistiques */}
        {selectedSchool.stats && (
          <div className="mb-8">
            <h4 className="text-lg font-semibold text-white mb-4">Statistiques</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {selectedSchool.stats.admissionRate && (
                <div className="bg-primary-700/20 rounded-xl p-4 text-center">
                  <p className="text-2xl font-bold text-accent-ice">{selectedSchool.stats.admissionRate}%</p>
                  <p className="text-text-secondary text-sm">Taux d'admission</p>
                </div>
              )}
              {selectedSchool.stats.employmentRate && (
                <div className="bg-primary-700/20 rounded-xl p-4 text-center">
                  <p className="text-2xl font-bold text-accent-gold">{selectedSchool.stats.employmentRate}%</p>
                  <p className="text-text-secondary text-sm">Taux d'emploi</p>
                </div>
              )}
              {selectedSchool.stats.averageSalary && (
                <div className="bg-primary-700/20 rounded-xl p-4 text-center">
                  <p className="text-2xl font-bold text-accent-emerald">{selectedSchool.stats.averageSalary}€</p>
                  <p className="text-text-secondary text-sm">Salaire moyen</p>
                </div>
              )}
              {selectedSchool.stats?.admissionRate && (
                <div className="bg-primary-700/20 rounded-xl p-4 text-center">
                  <p className="text-2xl font-bold text-white">{selectedSchool.stats.admissionRate}%</p>
                  <p className="text-text-secondary text-sm">Taux d'admission</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Liens */}
        <div className="flex flex-wrap gap-4 pt-6 border-t border-primary-700/30">
          {selectedSchool.website && (
            <a 
              href={selectedSchool.website} 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center space-x-2 px-4 py-2 bg-accent-ice/10 text-accent-ice rounded-xl hover:bg-accent-ice/20 transition-colors"
            >
              <span>🔗</span>
              <span>Site web officiel</span>
            </a>
          )}
          {selectedSchool.linkedin && (
            <a 
              href={selectedSchool.linkedin} 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center space-x-2 px-4 py-2 bg-accent-gold/10 text-accent-gold rounded-xl hover:bg-accent-gold/20 transition-colors"
            >
              <span>💼</span>
              <span>LinkedIn</span>
            </a>
          )}
          {selectedSchool.contactEmail && (
            <a 
              href={`mailto:${selectedSchool.contactEmail}`} 
              className="flex items-center space-x-2 px-4 py-2 bg-accent-emerald/10 text-accent-emerald rounded-xl hover:bg-accent-emerald/20 transition-colors"
            >
              <span>✉️</span>
              <span>Contact</span>
            </a>
          )}
        </div>
      </div>
    );
  };

  // Vue principale
  if (isLoading) {
    return (
      <div className="min-h-screen bg-primary-950 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin text-6xl mb-4">🌀</div>
          <p className="text-white text-xl">Chargement des écoles...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-primary-950">
      <div className="max-w-6xl mx-auto px-4 py-20">
        {/* Animation de fond */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden -z-10">
          <div className="absolute top-1/2 left-1/2 w-[1000px] h-[1000px] bg-gradient-to-r from-accent-ice/5 via-accent-gold/5 to-accent-emerald/5 rounded-full blur-3xl animate-pulse-slow"></div>
        </div>

        {/* En-tête */}
        <div className="text-center mb-12">
          <div className="mb-4">
            <span className="text-6xl">🎓</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Écoles et Formations
          </h1>
          <p className="text-text-secondary text-lg max-w-2xl mx-auto">
            Découvrez les meilleures écoles, universités et formations en informatique en France.
          </p>
        </div>

        {/* Fiche détaillée si sélectionnée */}
        {selectedSchool && renderSchoolDetail()}

        {/* Filtres */}
        {renderFilters()}

        {/* Résultats */}
        <div className="bg-primary-800/30 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold text-white">
              Résultats ({filteredSchools.length} {filteredSchools.length === 1 ? 'école' : 'écoles'})
            </h3>
          </div>
          {renderSchoolList()}
        </div>

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
