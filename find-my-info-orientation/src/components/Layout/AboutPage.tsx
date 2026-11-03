import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../../context/AppContext';

export default function AboutPage() {
  const navigate = useNavigate();
  const { } = useAppContext();
  const [activeSection, setActiveSection] = useState<string>('about');

  // Sections de contenu
  const sections: Record<string, { title: string; icon: string; content: React.JSX.Element }> = {
    about: {
      title: 'À propos de FindMyInfo',
      icon: 'ℹ️',
      content: (
        <div className="space-y-6">
          <p className="text-lg text-text-secondary">
            FindMyInfo est une application web conçue pour vous aider à mieux comprendre 
            le vaste domaine de l'informatique et à trouver votre voie professionnelle.
          </p>
          
          <p className="text-text-secondary">
            L'informatique est partout aujourd'hui, mais ses nombreux domaines et spécialisations 
            peuvent être déroutants pour quelqu'un qui souhaite s'orienter vers ce secteur. 
            C'est pourquoi nous avons créé cette plateforme interactive.
          </p>

          <div className="bg-primary-800/30 rounded-2xl p-6">
            <h3 className="text-xl font-semibold text-white mb-4">Notre mission</h3>
            <ul className="space-y-3">
              <li className="flex items-start space-x-3">
                <span className="text-accent-ice mt-1">✓</span>
                <span className="text-text-secondary">Aider les étudiants et professionnels à comprendre les différents métiers de l'informatique</span>
              </li>
              <li className="flex items-start space-x-3">
                <span className="text-accent-gold mt-1">✓</span>
                <span className="text-text-secondary">Fournir un outil d'orientation basé sur vos intérêts et compétences</span>
              </li>
              <li className="flex items-start space-x-3">
                <span className="text-accent-emerald mt-1">✓</span>
                <span className="text-text-secondary">Mettre en relation les métiers avec les formations disponibles en France</span>
              </li>
              <li className="flex items-start space-x-3">
                <span className="text-accent-purple mt-1">✓</span>
                <span className="text-text-secondary">Offrir une vision claire et structurée de l'écosystème informatique</span>
              </li>
            </ul>
          </div>

          <p className="text-text-secondary">
            Que vous soyez un étudiant qui réfléchit à son orientation, un professionnel 
            en reconversion, ou simplement curieux de découvrir les opportunités dans 
            l'informatique, FindMyInfo est là pour vous guider.
          </p>
        </div>
      )
    },
    features: {
      title: 'Fonctionnalités principales',
      icon: '✨',
      content: (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-primary-800/30 rounded-2xl p-6">
              <div className="text-4xl mb-4">🌳</div>
              <h3 className="text-xl font-semibold text-white mb-2">Arbre interactif</h3>
              <p className="text-text-secondary">
                Explorez une représentation visuelle et interactive de tous les domaines 
                de l'informatique. Cliquez sur les nœuds pour découvrir les sous-domaines 
                et les métiers spécifiques.
              </p>
            </div>

            <div className="bg-primary-800/30 rounded-2xl p-6">
              <div className="text-4xl mb-4">📝</div>
              <h3 className="text-xl font-semibold text-white mb-2">Quiz d'orientation</h3>
              <p className="text-text-secondary">
                Répondez à des questions personnalisées pour découvrir quels domaines 
                de l'informatique correspondent le mieux à votre profil, vos intérêts et 
                vos compétences.
              </p>
            </div>

            <div className="bg-primary-800/30 rounded-2xl p-6">
              <div className="text-4xl mb-4">🎓</div>
              <h3 className="text-xl font-semibold text-white mb-2">Base de données des écoles</h3>
              <p className="text-text-secondary">
                Accédez à une base de données complète des écoles, universités et 
                formations en informatique en France, avec des informations sur les 
                diplômes, spécialités et classements.
              </p>
            </div>

            <div className="bg-primary-800/30 rounded-2xl p-6">
              <div className="text-4xl mb-4">📚</div>
              <h3 className="text-xl font-semibold text-white mb-2">Fiches métiers détaillées</h3>
              <p className="text-text-secondary">
                Consultez des fiches détaillées pour chaque métier, incluant les 
                responsabilités, compétences requises, salaires, perspectives d'emploi 
                et ressources pour apprendre.
              </p>
            </div>
          </div>

          <div className="bg-primary-800/30 rounded-2xl p-6">
            <h3 className="text-xl font-semibold text-white mb-4">Fonctionnalités à venir</h3>
            <ul className="space-y-2">
              <li className="flex items-center space-x-2 text-text-secondary">
                <span className="text-accent-ice">📈</span>
                <span>Statistiques et tendances du marché</span>
              </li>
              <li className="flex items-center space-x-2 text-text-secondary">
                <span className="text-accent-gold">👥</span>
                <span>Communauté et partage d'expériences</span>
              </li>
              <li className="flex items-center space-x-2 text-text-secondary">
                <span className="text-accent-emerald">📅</span>
                <span>Calendrier des événements et salons</span>
              </li>
              <li className="flex items-center space-x-2 text-text-secondary">
                <span className="text-accent-purple">🎯</span>
                <span>Recommandations personnalisées avancées</span>
              </li>
            </ul>
          </div>
        </div>
      )
    },
    domains: {
      title: 'Domaines de l\'informatique',
      icon: '🗺️',
      content: (
        <div className="space-y-6">
          <p className="text-lg text-text-secondary">
            L'informatique regroupe de nombreux domaines et spécialisations. 
            Voici une vue d'ensemble des principaux domaines couverts par FindMyInfo :
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { name: 'Développement Web', description: 'Création de sites et applications web, front-end et back-end', icon: '🌐', color: 'ice' },
              { name: 'Développement Mobile', description: 'Création d\'applications pour smartphones et tablettes', icon: '📱', color: 'gold' },
              { name: 'Data Science', description: 'Analyse de données, machine learning, intelligence artificielle', icon: '📊', color: 'emerald' },
              { name: 'Cybersécurité', description: 'Protection des systèmes informatiques contre les cyberattaques', icon: '🔒', color: 'purple' },
              { name: 'DevOps', description: 'Automatisation des processus de développement et déploiement', icon: '⚙️', color: 'ice' },
              { name: 'Cloud Computing', description: 'Gestion des infrastructures et services cloud', icon: '☁️', color: 'gold' },
              { name: 'Réseaux', description: 'Conception et gestion des réseaux informatiques', icon: '🌍', color: 'emerald' },
              { name: 'Bases de Données', description: 'Conception et optimisation des bases de données', icon: '🗃️', color: 'purple' },
              { name: 'Jeux Vidéo', description: 'Développement de jeux vidéo et moteurs de jeu', icon: '🎮', color: 'ice' },
              { name: 'Design UX/UI', description: 'Conception d\'expériences utilisateur et interfaces', icon: '🎨', color: 'gold' },
              { name: 'Blockchain', description: 'Technologies de blockchain et cryptomonnaies', icon: '⛓️', color: 'emerald' },
              { name: 'IoT', description: 'Internet des objets et systèmes embarqués', icon: '📡', color: 'purple' }
            ].map((domain, index) => (
              <div 
                key={index}
                className={`bg-gradient-to-br from-accent-${domain.color}/10 to-accent-${domain.color}/5 rounded-2xl p-5 border border-accent-${domain.color}/20`}
              >
                <div className="text-3xl mb-3">{domain.icon}</div>
                <h4 className={`text-lg font-semibold text-accent-${domain.color} mb-2`}>
                  {domain.name}
                </h4>
                <p className="text-text-secondary text-sm">{domain.description}</p>
              </div>
            ))}
          </div>

          <div className="bg-primary-800/30 rounded-2xl p-6">
            <h3 className="text-xl font-semibold text-white mb-4">Et bien plus encore...</h3>
            <p className="text-text-secondary">
              L'informatique évolue constamment et de nouveaux domaines émergent régulièrement. 
              Notre arbre interactif vous permet d'explorer toutes ces possibilités et de 
              découvrir des métiers que vous ne connaissiez peut-être pas.
            </p>
            <button
              onClick={() => navigate('/')}
              className="mt-4 px-6 py-3 btn-skyrim-gold text-sm"
            >
              Explorer l'arbre des métiers
            </button>
          </div>
        </div>
      )
    },
    technologies: {
      title: 'Technologies utilisées',
      icon: '💻',
      content: (
        <div className="space-y-6">
          <p className="text-lg text-text-secondary">
            FindMyInfo a été développé avec des technologies modernes pour offrir 
            une expérience utilisateur fluide, intuitive et esthétique.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-primary-800/30 rounded-2xl p-6">
              <h3 className="text-xl font-semibold text-white mb-4 flex items-center space-x-2">
                <span>⚛️</span>
                <span>Frontend</span>
              </h3>
              <ul className="space-y-2">
                <li className="flex items-center space-x-2 text-text-secondary">
                  <span className="text-accent-ice">•</span>
                  <span>React + TypeScript</span>
                </li>
                <li className="flex items-center space-x-2 text-text-secondary">
                  <span className="text-accent-gold">•</span>
                  <span>Vite (build tool)</span>
                </li>
                <li className="flex items-center space-x-2 text-text-secondary">
                  <span className="text-accent-emerald">•</span>
                  <span>Tailwind CSS</span>
                </li>
                <li className="flex items-center space-x-2 text-text-secondary">
                  <span className="text-accent-purple">•</span>
                  <span>D3.js (visualisations)</span>
                </li>
              </ul>
            </div>

            <div className="bg-primary-800/30 rounded-2xl p-6">
              <h3 className="text-xl font-semibold text-white mb-4 flex items-center space-x-2">
                <span>📊</span>
                <span>Backend & Data</span>
              </h3>
              <ul className="space-y-2">
                <li className="flex items-center space-x-2 text-text-secondary">
                  <span className="text-accent-ice">•</span>
                  <span>JSON (stockage des données)</span>
                </li>
                <li className="flex items-center space-x-2 text-text-secondary">
                  <span className="text-accent-gold">•</span>
                  <span>Structures de données optimisées</span>
                </li>
                <li className="flex items-center space-x-2 text-text-secondary">
                  <span className="text-accent-emerald">•</span>
                  <span>Algorithmes de recherche</span>
                </li>
              </ul>
            </div>

            <div className="bg-primary-800/30 rounded-2xl p-6">
              <h3 className="text-xl font-semibold text-white mb-4 flex items-center space-x-2">
                <span>🎨</span>
                <span>Design</span>
              </h3>
              <ul className="space-y-2">
                <li className="flex items-center space-x-2 text-text-secondary">
                  <span className="text-accent-ice">•</span>
                  <span>Inspiration Skyrim</span>
                </li>
                <li className="flex items-center space-x-2 text-text-secondary">
                  <span className="text-accent-gold">•</span>
                  <span>Thème sombre (Sommeil/Nocturne)</span>
                </li>
                <li className="flex items-center space-x-2 text-text-secondary">
                  <span className="text-accent-emerald">•</span>
                  <span>Animations fluides</span>
                </li>
                <li className="flex items-center space-x-2 text-text-secondary">
                  <span className="text-accent-purple">•</span>
                  <span>Responsive design</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="bg-primary-800/30 rounded-2xl p-6">
            <h3 className="text-xl font-semibold text-white mb-4">Pourquoi ces choix technologiques ?</h3>
            <p className="text-text-secondary mb-4">
              Nous avons opté pour une stack technique moderne et performante :
            </p>
            <ul className="space-y-3">
              <li className="flex items-start space-x-3">
                <span className="text-accent-ice mt-1">✓</span>
                <span className="text-text-secondary">
                  <strong>React + TypeScript</strong> : Pour une interface dynamique et typée, 
                  garantissant une meilleure maintenabilité du code.
                </span>
              </li>
              <li className="flex items-start space-x-3">
                <span className="text-accent-gold mt-1">✓</span>
                <span className="text-text-secondary">
                  <strong>Vite</strong> : Pour des temps de compilation ultra-rapides et une 
                  expérience de développement optimale.
                </span>
              </li>
              <li className="flex items-start space-x-3">
                <span className="text-accent-emerald mt-1">✓</span>
                <span className="text-text-secondary">
                  <strong>Tailwind CSS</strong> : Pour un styling rapide et cohérent, avec un 
                  design personnalisable.
                </span>
              </li>
              <li className="flex items-start space-x-3">
                <span className="text-accent-purple mt-1">✓</span>
                <span className="text-text-secondary">
                  <strong>D3.js</strong> : Pour des visualisations de données puissantes et 
                  interactives, notamment pour l'arbre des métiers.
                </span>
              </li>
            </ul>
          </div>
        </div>
      )
    },
    contact: {
      title: 'Contact et Contribution',
      icon: '📧',
      content: (
        <div className="space-y-6">
          <p className="text-lg text-text-secondary">
            Vous avez des questions, des suggestions ou vous souhaitez contribuer au projet ? 
            N'hésitez pas à nous contacter !
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-primary-800/30 rounded-2xl p-6">
              <h3 className="text-xl font-semibold text-white mb-4">Contact</h3>
              <ul className="space-y-3">
                <li className="flex items-center space-x-3">
                  <span className="text-2xl">✉️</span>
                  <span className="text-text-secondary">Email : contact@findmyinfo.fr</span>
                </li>
                <li className="flex items-center space-x-3">
                  <span className="text-2xl">💼</span>
                  <span className="text-text-secondary">LinkedIn : FindMyInfo Orientation</span>
                </li>
                <li className="flex items-center space-x-3">
                  <span className="text-2xl">🐙</span>
                  <span className="text-text-secondary">GitHub : findmyinfo/orientation</span>
                </li>
              </ul>
            </div>

            <div className="bg-primary-800/30 rounded-2xl p-6">
              <h3 className="text-xl font-semibold text-white mb-4">Contribution</h3>
              <p className="text-text-secondary mb-4">
                FindMyInfo est un projet open source. Vous pouvez contribuer de plusieurs manières :
              </p>
              <ul className="space-y-3">
                <li className="flex items-start space-x-3">
                  <span className="text-accent-ice mt-1">✓</span>
                  <span className="text-text-secondary">Signaler des bugs ou suggérer des améliorations</span>
                </li>
                <li className="flex items-start space-x-3">
                  <span className="text-accent-gold mt-1">✓</span>
                  <span className="text-text-secondary">Proposer de nouveaux métiers ou domaines</span>
                </li>
                <li className="flex items-start space-x-3">
                  <span className="text-accent-emerald mt-1">✓</span>
                  <span className="text-text-secondary">Ajouter de nouvelles écoles ou formations</span>
                </li>
                <li className="flex items-start space-x-3">
                  <span className="text-accent-purple mt-1">✓</span>
                  <span className="text-text-secondary">Contribuer au code source</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="bg-primary-800/30 rounded-2xl p-6">
            <h3 className="text-xl font-semibold text-white mb-4">Licence</h3>
            <p className="text-text-secondary">
              Ce projet est distribué sous licence MIT. Vous êtes libre de l'utiliser, 
              de le modifier et de le distribuer conformément aux termes de cette licence.
            </p>
          </div>

          <div className="text-center">
            <button
              onClick={() => navigate('/')}
              className="px-8 py-4 btn-skyrim-gold text-lg"
            >
              ← Retour à l'accueil
            </button>
          </div>
        </div>
      )
    }
  };

  // Rendu de la navigation des sections
  const renderNavigation = () => (
    <div className="flex flex-wrap justify-center gap-2 mb-8">
      {Object.entries(sections).map(([key, section]) => (
        <button
          key={key}
          onClick={() => setActiveSection(key)}
          className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 flex items-center space-x-2 ${
            activeSection === key
              ? 'bg-accent-ice/10 text-accent-ice border border-accent-ice/30'
              : 'bg-primary-800/50 text-text-secondary hover:bg-primary-800/80'
          }`}
        >
          <span>{section.icon}</span>
          <span>{section.title}</span>
        </button>
      ))}
    </div>
  );

  // Section active
  const activeSectionData = sections[activeSection as keyof typeof sections];

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
          <div className="mb-4">
            <span className="text-6xl">ℹ️</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            À propos
          </h1>
          <p className="text-text-secondary text-lg">
            Tout savoir sur FindMyInfo, ses fonctionnalités et son fonctionnement.
          </p>
        </div>

        {/* Navigation des sections */}
        {renderNavigation()}

        {/* Contenu de la section active */}
        <div className="bg-primary-800/30 rounded-3xl p-8 mb-12 border border-primary-700/30 animate-fadeIn">
          <h2 className="text-3xl font-bold text-white mb-6 flex items-center space-x-3">
            <span>{activeSectionData.icon}</span>
            <span>{activeSectionData.title}</span>
          </h2>
          {activeSectionData.content}
        </div>

        {/* Bouton de retour */}
        <div className="text-center">
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
