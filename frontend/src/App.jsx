import React, { useState, useEffect, useRef } from 'react';
import { Navbar } from './components/Navbar';
import { ExamConfigurator } from './components/ExamConfigurator';
import { ActiveExamHUD } from './components/ActiveExamHUD';
import { QuestionCard } from './components/QuestionCard';
import { ExamResultsDashboard } from './components/ExamResultsDashboard';
import { ApiKeyModal } from './components/ApiKeyModal';
import { ExamHistoryModal } from './components/ExamHistoryModal';
import { api } from './services/api';
import { AlertCircle } from 'lucide-react';

export function App() {
  // Navigation & Screen State: 'config' | 'testing' | 'results'
  const [currentScreen, setCurrentScreen] = useState('config');

  // Modals
  const [isApiKeyModalOpen, setIsApiKeyModalOpen] = useState(false);
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);

  // System & API Configuration
  const [systemStatus, setSystemStatus] = useState(null);
  const [customApiKey, setCustomApiKey] = useState(() => {
    return localStorage.getItem('skillforge_gemini_api_key') || '';
  });

  // Active Exam Session State
  const [sessionId, setSessionId] = useState(null);
  const [topicName, setTopicName] = useState('');
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(1);
  const [totalQuestions, setTotalQuestions] = useState(6);
  const [currentTheta, setCurrentTheta] = useState(0.0);
  const [sem, setSem] = useState(1.0);
  const [masteryLevel, setMasteryLevel] = useState('Competent');
  const [badgeColor, setBadgeColor] = useState('text-emerald-400');
  
  // Interactive Question State
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [evaluationResult, setEvaluationResult] = useState(null);
  const [nextQuestionCache, setNextQuestionCache] = useState(null);
  const [finalResultsCache, setFinalResultsCache] = useState(null);
  
  // Timers & Options
  const [timedMode, setTimedMode] = useState(true);
  const [immediateFeedback, setImmediateFeedback] = useState(true);
  const [timeLeft, setTimeLeft] = useState(null);
  const questionStartTimeRef = useRef(Date.now());
  const timerIntervalRef = useRef(null);

  // Final Results
  const [resultsData, setResultsData] = useState(null);

  // Loading & Error States
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  // Load initial system status
  useEffect(() => {
    api.getStatus()
      .then(res => setSystemStatus(res))
      .catch(err => {
        console.warn("Backend status check failed:", err.message);
      });
  }, []);

  // Save API key to localStorage when updated
  const handleSaveApiKey = (key) => {
    setCustomApiKey(key);
    if (key) {
      localStorage.setItem('skillforge_gemini_api_key', key);
    } else {
      localStorage.removeItem('skillforge_gemini_api_key');
    }
  };

  // Timer countdown logic
  useEffect(() => {
    if (currentScreen === 'testing' && timedMode && !isSubmitted) {
      setTimeLeft(60);
      questionStartTimeRef.current = Date.now();

      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);

      timerIntervalRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timerIntervalRef.current);
            // Auto submit when time runs out
            handleAutoSubmitOnTimeout();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => {
        if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
      };
    } else {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
      if (!timedMode) setTimeLeft(null);
    }
  }, [currentScreen, currentQuestionIndex, timedMode, isSubmitted]);

  // Handle timeout auto-submission
  const handleAutoSubmitOnTimeout = () => {
    // If user has chosen something, submit that; otherwise submit null
    handleSubmitAnswer(selectedAnswer || "No answer provided (timed out)");
  };

  // Start exam flow
  const handleStartExam = async ({ topic, customTopic, targetQuestions, initialDifficulty, timedMode, immediateFeedback }) => {
    setLoading(true);
    setErrorMessage(null);
    setTimedMode(timedMode);
    setImmediateFeedback(immediateFeedback);

    try {
      const res = await api.startExam({
        topic,
        customTopic,
        targetQuestions,
        initialDifficulty,
        apiKey: customApiKey || null
      });

      setSessionId(res.sessionId);
      setTopicName(res.topic);
      setTotalQuestions(res.targetQuestions);
      setCurrentQuestionIndex(res.currentQuestionIndex);
      setCurrentTheta(res.currentTheta);
      setSem(res.sem);
      setMasteryLevel(res.masteryLevel);
      setBadgeColor(res.badgeColor);
      setCurrentQuestion(res.question);
      
      // Reset interaction state
      setSelectedAnswer(null);
      setIsSubmitted(false);
      setEvaluationResult(null);
      setNextQuestionCache(null);
      setFinalResultsCache(null);

      setCurrentScreen('testing');
    } catch (err) {
      console.error(err);
      setErrorMessage(err.message || 'Failed to initialize adaptive exam. Please check backend connection.');
    } finally {
      setLoading(false);
    }
  };

  // Submit answer for active question
  const handleSubmitAnswer = async (answerToSubmit = selectedAnswer) => {
    if (!sessionId || loading || isSubmitted) return;

    setLoading(true);
    setErrorMessage(null);

    const timeSpentSeconds = Math.max(1, Math.round((Date.now() - questionStartTimeRef.current) / 1000));

    try {
      const res = await api.submitAnswer({
        sessionId,
        answer: answerToSubmit,
        timeSpentSeconds,
        apiKey: customApiKey || null
      });

      setEvaluationResult(res);
      setIsSubmitted(true);
      setCurrentTheta(res.newTheta);
      setSem(res.sem);

      if (res.isFinished) {
        setFinalResultsCache(res.results);
      } else {
        setNextQuestionCache(res.nextQuestion);
      }

      // If immediate feedback is disabled, advance right away
      if (!immediateFeedback) {
        if (res.isFinished) {
          setResultsData(res.results);
          setCurrentScreen('results');
        } else {
          advanceToNextQuestion(res.nextQuestion, res.nextQuestionIndex);
        }
      }

    } catch (err) {
      console.error(err);
      setErrorMessage(err.message || 'Failed to grade answer. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Advance to next question after reviewing feedback
  const handleProceedAfterReview = () => {
    if (finalResultsCache) {
      setResultsData(finalResultsCache);
      setCurrentScreen('results');
    } else if (nextQuestionCache) {
      advanceToNextQuestion(nextQuestionCache, currentQuestionIndex + 1);
    }
  };

  const advanceToNextQuestion = (nextQ, nextIdx) => {
    setCurrentQuestion(nextQ);
    setCurrentQuestionIndex(nextIdx);
    setSelectedAnswer(null);
    setIsSubmitted(false);
    setEvaluationResult(null);
    setNextQuestionCache(null);
  };

  // View past result from history modal
  const handleViewPastResult = async (pastSessionId) => {
    setLoading(true);
    try {
      const res = await api.getResults(pastSessionId);
      setResultsData(res.results);
      setCurrentScreen('results');
    } catch (err) {
      setErrorMessage("Could not load past exam report.");
    } finally {
      setLoading(false);
    }
  };

  // Reset to configurator
  const handleResetToHome = () => {
    if (currentScreen === 'testing') {
      if (!window.confirm("Are you sure you want to quit the current exam? Progress will not be finalized.")) {
        return;
      }
    }
    setCurrentScreen('config');
    setSessionId(null);
    setCurrentQuestion(null);
    setResultsData(null);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-indigo-500 selection:text-white">
      
      {/* Top Navigation */}
      <Navbar
        systemStatus={systemStatus}
        hasCustomApiKey={Boolean(customApiKey)}
        onOpenApiKeyModal={() => setIsApiKeyModalOpen(true)}
        onOpenHistoryModal={() => setIsHistoryModalOpen(true)}
        onResetExam={handleResetToHome}
        isExamActive={currentScreen === 'testing'}
      />

      {/* Global Error Alert Banner */}
      {errorMessage && (
        <div className="max-w-4xl mx-auto px-4 mt-4 w-full">
          <div className="p-3.5 rounded-2xl bg-rose-950/70 border border-rose-500/40 text-rose-200 text-xs flex items-center justify-between gap-3 shadow-lg">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
              <span>{errorMessage}</span>
            </div>
            <button
              onClick={() => setErrorMessage(null)}
              className="text-slate-400 hover:text-white text-xs underline font-medium"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}

      {/* Main Screen Views */}
      <main className="flex-1 pb-16">
        {currentScreen === 'config' && (
          <ExamConfigurator
            onStartExam={handleStartExam}
            loading={loading}
          />
        )}

        {currentScreen === 'testing' && currentQuestion && (
          <>
            <ActiveExamHUD
              currentTheta={currentTheta}
              sem={sem}
              masteryLevel={masteryLevel}
              badgeColor={badgeColor}
              currentQuestionIndex={currentQuestionIndex}
              totalQuestions={totalQuestions}
              bloomLevel={currentQuestion.bloomLevel}
              difficulty={currentQuestion.difficulty}
              timeLeft={timeLeft}
              topic={topicName}
            />

            <QuestionCard
              question={currentQuestion}
              selectedAnswer={selectedAnswer}
              onSelectAnswer={(ans) => setSelectedAnswer(ans)}
              onSubmitAnswer={() => handleSubmitAnswer()}
              onNextQuestion={handleProceedAfterReview}
              isSubmitted={isSubmitted}
              evaluationResult={evaluationResult}
              loading={loading}
              isLastQuestion={currentQuestionIndex >= totalQuestions}
            />
          </>
        )}

        {currentScreen === 'results' && resultsData && (
          <ExamResultsDashboard
            results={resultsData}
            onRetake={handleResetToHome}
          />
        )}
      </main>

      {/* Modals */}
      <ApiKeyModal
        isOpen={isApiKeyModalOpen}
        onClose={() => setIsApiKeyModalOpen(false)}
        apiKey={customApiKey}
        onSaveApiKey={handleSaveApiKey}
      />

      <ExamHistoryModal
        isOpen={isHistoryModalOpen}
        onClose={() => setIsHistoryModalOpen(false)}
        onViewPastResult={handleViewPastResult}
      />

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-400">SkillForge AI</span>
            <span>•</span>
            <span>Item Response Theory (2PL) Psychometric Testing</span>
          </div>
          <div className="text-slate-600 font-mono text-[11px]">
            Google DeepMind Antigravity Pair-Programming
          </div>
        </div>
      </footer>

    </div>
  );
}
export default App;
