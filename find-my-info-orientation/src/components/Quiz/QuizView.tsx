import { useState, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import type { QuizQuestion, QuizFormat, QuizAnswers, QuizData } from '../../types';
import quizData from '../../data/quiz.json';

interface QuizOption {
  value: string;
  label: string;
  description?: string;
  weight?: number;
}

interface QuizVisual {
  type: 'scale' | 'slider' | 'matrix';
  scale?: number[];
  labels?: string[];
  min?: number;
  max?: number;
  step?: number;
}

interface QuizCompetency {
  value: string;
  label: string;
  icon?: string;
  category?: string;
}

interface ExtendedQuizQuestion extends QuizQuestion {
  domain?: string;
  multiple?: boolean;
  options?: QuizOption[];
  visual?: QuizVisual;
  competencies?: QuizCompetency[];
}

export default function QuizView() {
  const navigate = useNavigate();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<QuizAnswers>({});
  const [quizFormat, setQuizFormat] = useState<QuizFormat>('standard');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Charger les questions depuis les données
  const questions: ExtendedQuizQuestion[] = useMemo(() => {
    const data = quizData as unknown as QuizData;
    const formatData = data?.formats?.[quizFormat];
    return formatData?.questions || [];
  }, [quizFormat]);

  // Position actuelle
  const currentQuestion = questions[currentQuestionIndex];
  const totalQuestions = questions.length;
  const progressPercentage = useMemo(() =>
    ((currentQuestionIndex) / Math.max(totalQuestions - 1, 1)) * 100
  , [currentQuestionIndex, totalQuestions]);

  // Gérer la sélection de réponse
  const handleSelectAnswer = useCallback((answerValue: string | string[]) => {
    setSelectedAnswers(prev => ({
      ...prev,
      [currentQuestionIndex]: answerValue
    }));
  }, [currentQuestionIndex]);

  // Navigation entre questions
  const goToNextQuestion = useCallback(() => {
    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  }, [currentQuestionIndex, totalQuestions]);

  const goToPreviousQuestion = useCallback(() => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  }, [currentQuestionIndex]);

  // Soumission du quiz
  const handleSubmitQuiz = useCallback(() => {
    setIsSubmitting(true);
    // Calcul des scores (simplifié - à améliorer)
    const scores: Record<string, number> = {};
    
    Object.entries(selectedAnswers).forEach(([indexStr, answer]) => {
      const index = parseInt(indexStr);
      const question = questions[index];
      if (question && answer) {
        const domain = question.domain || 'general';
        const answerArray = Array.isArray(answer) ? answer : [answer];
        answerArray.forEach(() => {
          // Calcul simplifié basé sur les domaines
          scores[domain] = (scores[domain] || 0) + 1;
        });
      }
    });

    // Naviguer vers les résultats
    setTimeout(() => {
      setIsSubmitting(false);
      navigate('/quiz/results', {
        state: {
          scores,
          answers: selectedAnswers,
          format: quizFormat,
          questions: questions
        }
      });
    }, 1000);
  }, [selectedAnswers, questions, quizFormat, navigate]);

  // Vérifier si on peut passer à la question suivante
  const canProceed = useCallback(() => {
    const answer = selectedAnswers[currentQuestionIndex];
    if (!currentQuestion) return false;
    
    if (currentQuestion.multiple) {
      return answer && Array.isArray(answer) && answer.length > 0;
    }
    return answer !== undefined && answer !== null && answer !== '';
  }, [selectedAnswers, currentQuestionIndex, currentQuestion]);

  // Composant de réponse pour QCM
  const renderMultipleChoice = useCallback(() => {
    if (!currentQuestion) return null;
    
    return (
      <div className="space-y-3">
        {currentQuestion.options?.map((option: QuizOption, index: number) => {
          const isSelected = selectedAnswers[currentQuestionIndex] === option.value ||
                            (Array.isArray(selectedAnswers[currentQuestionIndex]) && 
                             (selectedAnswers[currentQuestionIndex] as string[]).includes(option.value));
          
          return (
            <button
              key={index}
              onClick={() => {
                if (currentQuestion.multiple) {
                  const current = (selectedAnswers[currentQuestionIndex] as string[]) || [];
                  if (current.includes(option.value)) {
                    handleSelectAnswer(current.filter(v => v !== option.value));
                  } else {
                    handleSelectAnswer([...current, option.value]);
                  }
                } else {
                  handleSelectAnswer(option.value);
                }
              }}
              className={`w-full p-4 rounded-xl text-left transition-all duration-200 ${
                isSelected
                  ? 'bg-accent-ice/20 border-2 border-accent-ice ring-2 ring-accent-ice/30'
                  : 'bg-primary-800/50 border border-primary-700/30 hover:bg-primary-800/80 hover:border-primary-600/50'
              }`}
            >
              <div className="flex items-start space-x-3">
                <span className={`text-xl ${isSelected ? 'text-accent-ice' : 'text-text-secondary'}`}>
                  {currentQuestion.multiple ? (isSelected ? '✓' : '⬜') : '•'}
                </span>
                <div>
                  <p className="font-medium text-white">{option.label}</p>
                  {option.description && (
                    <p className="text-sm text-text-secondary mt-1">{option.description}</p>
                  )}
                </div>
              </div>
            </button>
          );
        })}
      </div>
    );
  }, [currentQuestion, currentQuestionIndex, selectedAnswers, handleSelectAnswer]);

  // Composant de réponse visuelle (échelles)
  const renderVisualQuestion = useCallback(() => {
    if (!currentQuestion || !currentQuestion.visual) return null;
    
    const { scale, labels } = currentQuestion.visual;
    
    return (
      <div className="space-y-6">
        <div className="flex justify-between text-sm text-text-secondary">
          {labels?.map((label: string, index: number) => (
            <span key={index}>{label}</span>
          ))}
        </div>
        <div className="relative h-2 bg-primary-700/50 rounded-full overflow-hidden">
          <div 
            className="absolute h-full bg-gradient-to-r from-accent-emerald via-accent-ice to-accent-gold rounded-full transition-all duration-300"
            style={{ width: `${(typeof selectedAnswers[currentQuestionIndex] === 'number' ? selectedAnswers[currentQuestionIndex] : 50) * 2}%` }}
          />
          <input
            type="range"
            min={0}
            max={100}
            value={typeof selectedAnswers[currentQuestionIndex] === 'number' ? selectedAnswers[currentQuestionIndex] : 50}
            onChange={(e) => handleSelectAnswer(parseInt(e.target.value).toString())}
            className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer"
          />
          {scale?.map((value: number, index: number) => (
            <div 
              key={index}
              className="absolute top-0 w-0.5 h-full bg-white/20"
              style={{ left: `${(value / 100) * 100}%` }}
            />
          ))}
        </div>
        <div className="flex justify-between text-xs text-text-tertiary">
          {scale?.map((value: number, index: number) => (
            <span key={index}>{value}</span>
          ))}
        </div>
      </div>
    );
  }, [currentQuestion, currentQuestionIndex, selectedAnswers, handleSelectAnswer]);

  // Composant de réponse par compétences
  const renderCompetencyQuestion = useCallback(() => {
    if (!currentQuestion || !currentQuestion.competencies) return null;
    
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {currentQuestion.competencies.map((comp: QuizCompetency, index: number) => {
          const isSelected = selectedAnswers[currentQuestionIndex] === comp.value ||
                            (Array.isArray(selectedAnswers[currentQuestionIndex]) && 
                             (selectedAnswers[currentQuestionIndex] as string[]).includes(comp.value));
          
          return (
            <button
              key={index}
              onClick={() => {
                if (currentQuestion.multiple) {
                  const current = (selectedAnswers[currentQuestionIndex] as string[]) || [];
                  if (current.includes(comp.value)) {
                    handleSelectAnswer(current.filter(v => v !== comp.value));
                  } else {
                    handleSelectAnswer([...current, comp.value]);
                  }
                } else {
                  handleSelectAnswer(comp.value);
                }
              }}
              className={`p-4 rounded-xl text-center transition-all duration-200 ${
                isSelected
                  ? 'bg-accent-gold/20 border-2 border-accent-gold ring-2 ring-accent-gold/30'
                  : 'bg-primary-800/50 border border-primary-700/30 hover:bg-primary-800/80'
              }`}
            >
              <span className={`text-2xl block mb-2 ${isSelected ? 'text-accent-gold' : 'text-text-secondary'}`}>
                {comp.icon || '⭐'}
              </span>
              <span className={`text-sm font-medium ${isSelected ? 'text-accent-gold' : 'text-text-primary'}`}>
                {comp.label}
              </span>
            </button>
          );
        })}
      </div>
    );
  }, [currentQuestion, currentQuestionIndex, selectedAnswers, handleSelectAnswer]);

  // Rendu de la question actuelle
  const renderCurrentQuestion = useCallback(() => {
    if (!currentQuestion) return null;
    
    return (
      <div className="animate-fadeIn">
        {/* En-tête de la question */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-2xl md:text-3xl font-bold text-white">
              Question {currentQuestionIndex + 1}
            </h2>
            <span className="px-3 py-1 bg-primary-800/50 rounded-full text-sm text-text-secondary">
              {currentQuestionIndex + 1}/{totalQuestions}
            </span>
          </div>
          
          {/* Barre de progression */}
          <div className="h-1 bg-primary-700/50 rounded-full overflow-hidden mb-4">
            <div 
              className="h-full bg-gradient-to-r from-accent-emerald via-accent-ice to-accent-gold rounded-full transition-all duration-500"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
          
          {/* Domaine de la question */}
          {currentQuestion.domain && (
            <span className="inline-block px-3 py-1 bg-accent-ice/10 text-accent-ice rounded-full text-xs font-medium">
              {currentQuestion.domain}
            </span>
          )}
        </div>

        {/* Contenu de la question */}
        <div className="bg-primary-800/30 rounded-2xl p-6 mb-6">
          <h3 className="text-xl font-semibold text-white mb-4">
            {currentQuestion.text}
          </h3>
          {currentQuestion.description && (
            <p className="text-text-secondary text-lg">{currentQuestion.description}</p>
          )}
        </div>

        {/* Réponses */}
        <div className="space-y-4">
          {currentQuestion.type === 'visual' && renderVisualQuestion()}
          {currentQuestion.competencies && renderCompetencyQuestion()}
          {(!currentQuestion.type || currentQuestion.type === 'multiple_choice') && renderMultipleChoice()}
        </div>

        {/* Boutons de navigation */}
        <div className="flex justify-between items-center mt-8 pt-6 border-t border-primary-700/30">
          <button
            onClick={goToPreviousQuestion}
            disabled={currentQuestionIndex === 0}
            className="px-6 py-3 btn-skyrim-ice disabled:opacity-30 disabled:cursor-not-allowed"
          >
            Précédent
          </button>
          
          {currentQuestionIndex < totalQuestions - 1 ? (
            <button
              onClick={goToNextQuestion}
              disabled={!canProceed()}
              className="px-8 py-3 btn-skyrim-gold disabled:opacity-30 disabled:cursor-not-allowed"
            >
              Suivant
            </button>
          ) : (
            <button
              onClick={handleSubmitQuiz}
              disabled={!canProceed() || isSubmitting}
              className="px-8 py-3 btn-skyrim-emerald disabled:opacity-30 disabled:cursor-not-allowed flex items-center space-x-2"
            >
              {isSubmitting ? (
                <>
                  <span className="animate-spin">🌀</span>
                  <span>Calcul en cours...</span>
                </>
              ) : (
                <>
                  <span>✅</span>
                  <span>Terminer le quiz</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>
    );
  }, [currentQuestion, currentQuestionIndex, totalQuestions, progressPercentage, renderVisualQuestion, renderCompetencyQuestion, renderMultipleChoice, goToPreviousQuestion, goToNextQuestion, canProceed, handleSubmitQuiz, isSubmitting]);

  // Sélection du format de quiz
  const renderFormatSelection = useCallback(() => (
    <div className="max-w-2xl mx-auto">
      <h2 className="text-3xl font-bold text-white mb-6 text-center">
        Choisissez votre format de quiz
      </h2>
      <p className="text-text-secondary text-center mb-8">
        Sélectionnez le format qui vous correspond le mieux pour découvrir votre voie en informatique
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {(['standard', 'visual', 'competency'] as QuizFormat[]).map((format) => {
          const formatInfo = {
            standard: {
              title: 'Quiz Standard',
              description: 'Questions à choix multiples sur vos préférences',
              icon: '📝',
              color: 'ice'
            },
            visual: {
              title: 'Quiz Visuel',
              description: 'Échelles visuelles pour évaluer vos compétences',
              icon: '🎨',
              color: 'gold'
            },
            competency: {
              title: 'Quiz par Compétences',
              description: 'Sélectionnez les compétences qui vous intéressent',
              icon: '⭐',
              color: 'emerald'
            }
          };
          
          const info = formatInfo[format];
          const isSelected = quizFormat === format;
          
          return (
            <button
              key={format}
              onClick={() => setQuizFormat(format)}
              className={`p-6 rounded-2xl transition-all duration-300 border-2 ${
                isSelected
                  ? `bg-gradient-to-br from-accent-${info.color}/20 to-accent-${info.color}/10 border-accent-${info.color} ring-4 ring-accent-${info.color}/20`
                  : `bg-primary-800/30 border-primary-700/30 hover:bg-primary-800/50`
              }`}
            >
              <div className="text-center">
                <span className="text-4xl mb-4 block">{info.icon}</span>
                <h3 className={`text-xl font-bold mb-2 ${isSelected ? `text-accent-${info.color}` : 'text-white'}`}>
                  {info.title}
                </h3>
                <p className="text-text-secondary text-sm">{info.description}</p>
              </div>
            </button>
          );
        })}
      </div>

      <div className="mt-8 text-center">
        <button
          onClick={() => setCurrentQuestionIndex(0)}
          disabled={!quizFormat}
          className="px-8 py-4 btn-skyrim-gold disabled:opacity-30 text-lg"
        >
          Commencer le quiz
        </button>
      </div>
    </div>
  ), [quizFormat]);

  // Vue principale
  return (
    <div className="min-h-screen bg-primary-950">
      <div className="max-w-4xl mx-auto px-4 py-24">
        {/* Animation de fond */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden -z-10">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-accent-ice/5 rounded-full blur-3xl animate-pulse-slow"></div>
          <div className="absolute top-1/2 right-1/4 w-96 h-96 bg-accent-gold/5 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '2s' }}></div>
          <div className="absolute bottom-1/4 left-1/2 w-80 h-80 bg-accent-emerald/5 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '4s' }}></div>
        </div>

        {totalQuestions === 0 ? (
          renderFormatSelection()
        ) : (
          renderCurrentQuestion()
        )}
      </div>
    </div>
  );
}
