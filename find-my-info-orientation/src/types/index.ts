// Types pour les thèmes
export type ThemeType = 'dark' | 'light';

// Types pour les vues
export type ViewType = 'tree' | 'quiz' | 'schools' | 'career' | 'about';

// Type pour les réponses du quiz
export type QuizAnswers = Record<number, string | string[]>;

// Type pour les scores du quiz
export type QuizScore = Record<string, number>;

// Types pour les questions du quiz
export interface QuizOption {
  value: string;
  label: string;
  description?: string;
  weight?: number;
}

export interface QuizVisual {
  type: 'scale' | 'slider' | 'matrix';
  scale?: number[];
  labels?: string[];
  min?: number;
  max?: number;
  step?: number;
}

export interface QuizCompetency {
  value: string;
  label: string;
  icon?: string;
  category?: string;
}

// Type pour une question de quiz
export interface QuizQuestion {
  id: string;
  type?: 'multiple_choice' | 'single_choice' | 'visual' | 'competency' | 'text';
  text: string;
  description?: string;
  question?: string; // Alias pour text
  domain?: string;
  multiple?: boolean;
  options?: QuizOption[];
  visual?: QuizVisual;
  competencies?: QuizCompetency[];
  correctAnswer?: string | string[];
  explanation?: string;
  weight?: number;
}

// Type pour les formats de quiz
export type QuizFormat = 'standard' | 'visual' | 'competency';

// Interface pour les formats de quiz
export interface QuizFormatData {
  id: string;
  name: string;
  description: string;
  questions: QuizQuestion[];
}

// Type pour l'ensemble du quiz
export interface QuizData {
  formats: Record<QuizFormat, QuizFormatData>;
}

// Type pour les salaires
export interface SalaryInfo {
  min?: number;
  max?: number;
  average?: number;
  currency?: string;
  byExperience?: Record<string, { min: number; max: number }>;
}

// Type pour les ressources
export interface Resource {
  type: 'course' | 'book' | 'video' | 'article' | 'tool' | 'website';
  title: string;
  url: string;
  description?: string;
  author?: string;
  duration?: string;
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
}

// Type pour les écoles
export interface School {
  id: string;
  name: string;
  type: 'university' | 'private' | 'public' | 'online';
  location: string;
  region?: string;
  degrees?: string[];
  specialties?: string[];
  description?: string;
  ranking?: number;
  tuition?: string;
  website?: string;
  linkedin?: string;
  contactEmail?: string;
  phone?: string;
  address?: string;
  establishedYear?: number;
  studentCount?: number;
  facultyCount?: number;
  stats?: {
    admissionRate?: number;
    employmentRate?: number;
    averageSalary?: number;
    graduationRate?: number;
    studentSatisfaction?: number;
  };
  accreditations?: string[];
  partnerships?: string[];
  notableAlumni?: string[];
}

// Type pour les statues de compétences
export type ExperienceLevel = 'beginner' | 'intermediate' | 'advanced' | 'expert';

// Type pour les tags
export type Tag = 
  | 'beginner'
  | 'intermediate'
  | 'advanced'
  | 'high_demand'
  | 'remote'
  | 'freelance'
  | 'team'
  | 'creative'
  | 'technical'
  | 'managerial'
  | 'research'
  | 'teaching';

// Type pour les conseils
export interface Advice {
  type: 'general' | 'career' | 'education' | 'skill';
  title: string;
  content: string;
  category?: string;
  priority?: number;
}

// Interface pour un nœud de carrière (métier/domaine)
export interface CareerNode {
  id: string;
  name: string;
  domain?: string;
  description?: string;
  shortDescription?: string;
  icon?: string;
  emoji?: string;
  color?: string;
  tags?: Tag[];
  children?: CareerNode[];
  parentId?: string;
  
  // Informations pour les métiers
  responsibilities?: string[];
  skills?: string[];
  tools?: string[];
  certifications?: string[];
  
  // Classifications
  type?: 'domain' | 'subdomain' | 'career' | 'specialization';
  category?: string;
  experienceLevel?: ExperienceLevel;
  workEnvironment?: string;
  
  // Informations pratiques
  salary?: SalaryInfo;
  jobOutlook?: string;
  demand?: 'low' | 'medium' | 'high' | 'very_high';
  
  // Ressources
  resources?: Resource[];
  
  // Liens avec les écoles
  relatedSchools?: string[];
  
  // Liens avec d'autres métiers
  relatedCareers?: string[];
  
  // Métadonnées
  popularity?: number;
  difficulty?: number;
  growthRate?: number;
  
  // Domaines connectés (pour les métiers interdisciplinaires)
  connectedDomains?: string[];
}

// Type pour les statistiques
export interface Statistic {
  label: string;
  value: number;
  unit?: string;
  trend?: 'up' | 'down' | 'stable';
  percentage?: number;
}

// Type pour le feedback utilisateur
export interface UserFeedback {
  userId?: string;
  rating: number;
  comment?: string;
  quizResults?: QuizScore;
  recommendedCareers?: string[];
  timestamp: Date;
}

// Type pour l'historique de l'utilisateur
export interface UserHistory {
  userId: string;
  quizHistory: Array<{
    quizFormat: QuizFormat;
    answers: QuizAnswers;
    scores: QuizScore;
    timestamp: Date;
  }>;
  viewedCareers: string[];
  savedCareers: string[];
  savedSchools: string[];
}

// Type pour les paramètres de l'utilisateur
export interface UserSettings {
  userId: string;
  theme: ThemeType;
  language: string;
  region: string;
  notifications: boolean;
  preferredFormats: QuizFormat[];
}

// Types pour les animations
export interface AnimationConfig {
  duration: number;
  delay?: number;
  easing?: string;
  type: 'fade' | 'slide' | 'scale' | 'bounce' | 'custom';
}

// Types pour les événements
export interface AppEvent {
  type: 'career_selected' | 'quiz_completed' | 'school_viewed' | 'feedback_submitted';
  data: any;
  timestamp: Date;
}

// Type pour le contexte de filtrage
export interface FilterContext {
  searchQuery: string;
  selectedDomains: string[];
  selectedTags: Tag[];
  experienceLevel: ExperienceLevel | '';
  salaryRange: [number, number];
  remoteOnly: boolean;
  freelanceOnly: boolean;
}

// Type pour les résultats de recherche
export interface SearchResult {
  type: 'career' | 'school' | 'resource';
  item: CareerNode | School | Resource;
  score: number;
  matches: Array<{ field: string; value: string }>;
}

// Utilitaire pour vérifier si un nœud est un domaine
export function isDomainNode(node: CareerNode): boolean {
  return node.type === 'domain' || (node.children !== undefined && node.children.length > 0);
}

// Utilitaire pour vérifier si un nœud est un métier
export function isCareerNode(node: CareerNode): boolean {
  return node.type === 'career' || node.children === undefined || node.children.length === 0;
}

// Type pour les comparaisons de métiers
export interface CareerComparison {
  career1: CareerNode;
  career2: CareerNode;
  comparison: Record<string, { value1: any; value2: any; difference: number }>;
}

// Type pour les recommandations
export interface Recommendation {
  career: CareerNode;
  score: number;
  reasons: string[];
  matchingSkills: string[];
  missingSkills: string[];
}
