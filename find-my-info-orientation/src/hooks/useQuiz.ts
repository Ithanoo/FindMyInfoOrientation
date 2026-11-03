import { useState, useEffect, useCallback, useMemo } from 'react';
import type { QuizQuestion, QuizFormat, QuizAnswers, QuizScore, QuizData } from '../types';
import quizData from '../data/quiz.json';

// Interface pour l'état du quiz
interface QuizState {
  questions: QuizQuestion[];
  currentQuestionIndex: number;
  answers: QuizAnswers;
  score: QuizScore;
  isComplete: boolean;
  isSubmitting: boolean;
  format: QuizFormat;
}

// Interface pour les actions du quiz
interface QuizActions {
  goToNext: () => void;
  goToPrevious: () => void;
  goToQuestion: (index: number) => void;
  selectAnswer: (questionIndex: number, answer: string | string[]) => void;
  submitQuiz: () => Promise<QuizScore>;
  resetQuiz: () => void;
  setFormat: (format: QuizFormat) => void;
  calculateScore: () => QuizScore;
}

// Résultat du hook
interface QuizComputed {
  currentQuestion: QuizQuestion | undefined;
  progress: number;
  canProceed: () => boolean;
  allAnswered: boolean;
  topDomains: string[];
}

export interface UseQuizResult extends QuizState, QuizActions, QuizComputed {}

// Hook personnalisé pour gérer le quiz
export function useQuiz(format: QuizFormat = 'standard'): UseQuizResult {
  const [quizState, setQuizState] = useState<QuizState>({
    questions: [],
    currentQuestionIndex: 0,
    answers: {},
    score: {},
    isComplete: false,
    isSubmitting: false,
    format: format
  });

  // Charger les questions au montage ou quand le format change
  useEffect(() => {
    const data = quizData as unknown as QuizData;
    const formatData = data.formats?.[quizState.format];
    if (formatData?.questions) {
      setQuizState(prev => ({
        ...prev,
        questions: formatData.questions,
        currentQuestionIndex: 0,
        answers: {},
        score: {},
        isComplete: false
      }));
    }
  }, [quizState.format]);

  // Aller à la question suivante
  const goToNext = useCallback(() => {
    setQuizState(prev => ({
      ...prev,
      currentQuestionIndex: Math.min(prev.currentQuestionIndex + 1, prev.questions.length - 1)
    }));
  }, []);

  // Aller à la question précédente
  const goToPrevious = useCallback(() => {
    setQuizState(prev => ({
      ...prev,
      currentQuestionIndex: Math.max(prev.currentQuestionIndex - 1, 0)
    }));
  }, []);

  // Aller à une question spécifique
  const goToQuestion = useCallback((index: number) => {
    setQuizState(prev => ({
      ...prev,
      currentQuestionIndex: Math.max(0, Math.min(index, prev.questions.length - 1))
    }));
  }, []);

  // Sélectionner une réponse
  const selectAnswer = useCallback((questionIndex: number, answer: string | string[]) => {
    setQuizState(prev => ({
      ...prev,
      answers: {
        ...prev.answers,
        [questionIndex]: answer
      }
    }));
  }, []);

  // Calculer le score
  const calculateScore = useCallback((): QuizScore => {
    const scores: QuizScore = {};
    
    Object.entries(quizState.answers).forEach(([indexStr, answer]) => {
      const index = parseInt(indexStr);
      const question = quizState.questions[index];
      
      if (question && answer) {
        const domain = question.domain || 'general';
        const answerArray = Array.isArray(answer) ? answer : [answer];
        
        // Calculer le score basé sur les réponses
        answerArray.forEach(a => {
          // Pour chaque réponse, attribuer des points au domaine
          scores[domain] = (scores[domain] || 0) + 1;
          
          // Si la réponse correspond à des options spécifiques, attribuer plus de points
          if (question.options) {
            const option = question.options.find(opt => opt.value === a);
            if (option && option.weight) {
              scores[domain] = (scores[domain] || 0) + (option.weight - 1);
            }
          }
        });
      }
    });

    return scores;
  }, [quizState.questions, quizState.answers]);

  // Soumettre le quiz
  const submitQuiz = useCallback(async (): Promise<QuizScore> => {
    setQuizState(prev => ({ ...prev, isSubmitting: true }));

    // Simuler un délai de traitement
    await new Promise(resolve => setTimeout(resolve, 500));

    const score = calculateScore();
    
    setQuizState(prev => ({
      ...prev,
      score,
      isComplete: true,
      isSubmitting: false
    }));

    return score;
  }, [calculateScore]);

  // Réinitialiser le quiz
  const resetQuiz = useCallback(() => {
    setQuizState({
      questions: quizState.questions,
      currentQuestionIndex: 0,
      answers: {},
      score: {},
      isComplete: false,
      isSubmitting: false,
      format: quizState.format
    });
  }, [quizState.questions, quizState.format]);

  // Changer le format du quiz
  const setFormat = useCallback((format: QuizFormat) => {
    setQuizState(prev => ({
      ...prev,
      format
    }));
  }, []);

  // Obtenir la question actuelle
  const currentQuestion = useMemo(() => {
    return quizState.questions[quizState.currentQuestionIndex];
  }, [quizState.questions, quizState.currentQuestionIndex]);

  // Vérifier si on peut passer à la question suivante
  const canProceed = useCallback(() => {
    const currentAnswer = quizState.answers[quizState.currentQuestionIndex];
    const currentQ = quizState.questions[quizState.currentQuestionIndex];
    
    if (!currentQ) return false;
    
    if (currentQ.multiple) {
      return currentAnswer !== undefined && Array.isArray(currentAnswer) && currentAnswer.length > 0;
    }
    return currentAnswer !== undefined && currentAnswer !== null && currentAnswer !== '';
  }, [quizState.answers, quizState.currentQuestionIndex, quizState.questions]);

  // Obtenir la progression en pourcentage
  const progress = useMemo(() => {
    return ((quizState.currentQuestionIndex) / Math.max(quizState.questions.length - 1, 1)) * 100;
  }, [quizState.currentQuestionIndex, quizState.questions.length]);

  // Vérifier si toutes les questions ont été répondues
  const allAnswered = useMemo(() => {
    return Object.keys(quizState.answers).length === quizState.questions.length;
  }, [quizState.answers, quizState.questions.length]);

  // Obtenir les domaines avec les meilleurs scores
  const topDomains = useMemo(() => {
    return Object.entries(quizState.score)
      .sort(([, a], [, b]) => b - a)
      .map(([domain]) => domain);
  }, [quizState.score]);

  return {
    // État
    questions: quizState.questions,
    currentQuestionIndex: quizState.currentQuestionIndex,
    answers: quizState.answers,
    score: quizState.score,
    isComplete: quizState.isComplete,
    isSubmitting: quizState.isSubmitting,
    format: quizState.format,

    // État calculé
    currentQuestion,
    progress,
    canProceed,
    allAnswered,
    topDomains,

    // Actions
    goToNext,
    goToPrevious,
    goToQuestion,
    selectAnswer,
    submitQuiz,
    resetQuiz,
    setFormat,
    calculateScore
  };
}

export default useQuiz;
