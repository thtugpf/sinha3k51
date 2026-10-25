import React, { useEffect, useState } from 'react';
import {
  ALL_QUESTIONS,
  EXAM_SETS_METADATA,
  FLASHCARDS,
  QUESTIONS_BY_ID,
  THEORY_LESSONS,
} from './data/index';
import {
  ExamResultSummary,
  ExamSetId,
  LessonId,
  Question,
  QuestionGradeResult,
  UserAnswerState,
  UserProgress,
} from './types/biology';
import { AppView, Header } from './components/Header';
import { HomeView } from './components/HomeView';
import { TheoryView } from './components/TheoryView';
import { ActiveSessionConfig, ExamAndPracticeView } from './components/ExamAndPracticeView';
import { ResultsView } from './components/ResultsView';
import { QuestionBankAndProgressView } from './components/QuestionBankAndProgressView';
import { SourceAuditView } from './components/SourceAuditView';
import { LESSON_TITLES } from './utils/scoring';

const STORAGE_KEY = 'biology_master_12_progress_v1';

const DEFAULT_PROGRESS: UserProgress = {
  completedLessons: [],
  reviewLessons: [],
  rememberedFlashcards: [],
  reviewFlashcards: [],
  bookmarkedQuestions: [],
  wrongQuestionIds: [],
  attemptedQuestionIds: [],
  correctQuestionIds: [],
  savedAnswers: {},
  examHistory: [],
  soundEnabled: true,
  lastActiveLessonId: 'bai-1-gen-va-tai-ban-dna',
};

export default function App() {
  const [activeView, setActiveView] = useState<AppView>('home');
  const [selectedLessonId, setSelectedLessonId] = useState<LessonId>('bai-1-gen-va-tai-ban-dna');
  const [externalSession, setExternalSession] = useState<ActiveSessionConfig | null>(null);
  const [latestExamResult, setLatestExamResult] = useState<ExamResultSummary | null>(null);

  const [progress, setProgress] = useState<UserProgress>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        return { ...DEFAULT_PROGRESS, ...JSON.parse(raw) };
      }
    } catch {
      // ignore storage errors
    }
    return DEFAULT_PROGRESS;
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
    } catch {
      // ignore storage quota errors
    }
  }, [progress]);

  const handleToggleSound = () => {
    setProgress((prev) => ({ ...prev, soundEnabled: !prev.soundEnabled }));
  };

  const handleSelectLesson = (lessonId: LessonId) => {
    setSelectedLessonId(lessonId);
    setProgress((prev) => ({ ...prev, lastActiveLessonId: lessonId }));
    setActiveView('theory');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleToggleLessonCompleted = (lessonId: LessonId) => {
    setProgress((prev) => {
      const exists = prev.completedLessons.includes(lessonId);
      const completedLessons = exists
        ? prev.completedLessons.filter((id) => id !== lessonId)
        : [...prev.completedLessons, lessonId];
      const reviewLessons = exists
        ? prev.reviewLessons
        : prev.reviewLessons.filter((id) => id !== lessonId);
      return { ...prev, completedLessons, reviewLessons };
    });
  };

  const handleToggleLessonReview = (lessonId: LessonId) => {
    setProgress((prev) => {
      const exists = prev.reviewLessons.includes(lessonId);
      const reviewLessons = exists
        ? prev.reviewLessons.filter((id) => id !== lessonId)
        : [...prev.reviewLessons, lessonId];
      return { ...prev, reviewLessons };
    });
  };

  const handleMarkFlashcard = (cardId: string, status: 'remembered' | 'review') => {
    setProgress((prev) => {
      if (status === 'remembered') {
        const rememberedFlashcards = prev.rememberedFlashcards.includes(cardId)
          ? prev.rememberedFlashcards
          : [...prev.rememberedFlashcards, cardId];
        const reviewFlashcards = prev.reviewFlashcards.filter((id) => id !== cardId);
        return { ...prev, rememberedFlashcards, reviewFlashcards };
      } else {
        const reviewFlashcards = prev.reviewFlashcards.includes(cardId)
          ? prev.reviewFlashcards
          : [...prev.reviewFlashcards, cardId];
        const rememberedFlashcards = prev.rememberedFlashcards.filter((id) => id !== cardId);
        return { ...prev, rememberedFlashcards, reviewFlashcards };
      }
    });
  };

  const handleToggleBookmark = (questionId: string) => {
    setProgress((prev) => {
      const exists = prev.bookmarkedQuestions.includes(questionId);
      const bookmarkedQuestions = exists
        ? prev.bookmarkedQuestions.filter((id) => id !== questionId)
        : [...prev.bookmarkedQuestions, questionId];
      return { ...prev, bookmarkedQuestions };
    });
  };

  const handleRecordSingleQuestionResult = (
    questionId: string,
    answer: UserAnswerState,
    grade: QuestionGradeResult
  ) => {
    setProgress((prev) => {
      const attemptedQuestionIds = prev.attemptedQuestionIds.includes(questionId)
        ? prev.attemptedQuestionIds
        : [...prev.attemptedQuestionIds, questionId];

      let correctQuestionIds = [...prev.correctQuestionIds];
      let wrongQuestionIds = [...prev.wrongQuestionIds];

      if (grade.feedbackStatus === 'correct' || grade.feedbackStatus === 'needs_review') {
        if (!correctQuestionIds.includes(questionId)) {
          correctQuestionIds.push(questionId);
        }
        wrongQuestionIds = wrongQuestionIds.filter((id) => id !== questionId);
      } else {
        if (!wrongQuestionIds.includes(questionId)) {
          wrongQuestionIds.push(questionId);
        }
        correctQuestionIds = correctQuestionIds.filter((id) => id !== questionId);
      }

      return {
        ...prev,
        attemptedQuestionIds,
        correctQuestionIds,
        wrongQuestionIds,
        savedAnswers: {
          ...prev.savedAnswers,
          [questionId]: answer,
        },
      };
    });
  };

  const handleFinishSession = (summary: ExamResultSummary) => {
    setLatestExamResult(summary);

    setProgress((prev) => {
      const attemptedSet = new Set(prev.attemptedQuestionIds);
      const correctSet = new Set(prev.correctQuestionIds);
      const wrongSet = new Set(prev.wrongQuestionIds);
      const nextSavedAnswers = { ...prev.savedAnswers };

      for (const qId of summary.questionIds) {
        const res = summary.questionResults[qId];
        const ans = summary.userAnswers[qId];
        if (ans) {
          nextSavedAnswers[qId] = ans;
        }
        if (res && res.isAnswered) {
          attemptedSet.add(qId);
          if (res.feedbackStatus === 'correct' || res.feedbackStatus === 'needs_review') {
            correctSet.add(qId);
            wrongSet.delete(qId);
          } else {
            wrongSet.add(qId);
            correctSet.delete(qId);
          }
        }
      }

      return {
        ...prev,
        attemptedQuestionIds: Array.from(attemptedSet),
        correctQuestionIds: Array.from(correctSet),
        wrongQuestionIds: Array.from(wrongSet),
        savedAnswers: nextSavedAnswers,
        examHistory: [summary, ...prev.examHistory].slice(0, 30),
      };
    });

    setActiveView('results');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleStartExamSet = (setId: ExamSetId, mode: 'exam_A' | 'practice_B') => {
    const meta = EXAM_SETS_METADATA.find((s) => s.id === setId);
    const qs = ALL_QUESTIONS.filter((q) => q.sourceSetId === setId);
    setExternalSession({
      title: meta ? meta.title : `Bộ đề ${setId}`,
      mode,
      questions: qs,
      timeLimitMinutes: mode === 'exam_A' ? (meta?.recommendedMinutes ?? 50) : 0,
    });
    setActiveView(mode === 'exam_A' ? 'exam' : 'practice');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePracticeLesson = (lessonId: LessonId) => {
    const lessonQuestions = ALL_QUESTIONS.filter((q) => q.lessonId === lessonId);
    const wrongInLesson = lessonQuestions.filter((q) =>
      progress.wrongQuestionIds.includes(q.id)
    );
    const targetQuestions = wrongInLesson.length > 0 ? wrongInLesson : lessonQuestions;

    setExternalSession({
      title: `Luyện tập: ${LESSON_TITLES[lessonId]}`,
      mode: 'practice_B',
      questions: targetQuestions,
      timeLimitMinutes: 0,
    });
    setActiveView('practice');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePracticeSubset = (qs: Question[], title: string) => {
    setExternalSession({
      title,
      mode: 'practice_B',
      questions: qs,
      timeLimitMinutes: 0,
    });
    setActiveView('practice');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleRetryQuestions = (
    questionIds: string[],
    title: string,
    mode: 'exam_A' | 'practice_B'
  ) => {
    const qs = questionIds.map((id) => QUESTIONS_BY_ID[id]).filter(Boolean);
    setExternalSession({
      title,
      mode,
      questions: qs,
      timeLimitMinutes: mode === 'exam_A' ? 50 : 0,
    });
    setActiveView(mode === 'exam_A' ? 'exam' : 'practice');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleResetProgress = () => {
    setProgress(DEFAULT_PROGRESS);
    localStorage.removeItem(STORAGE_KEY);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-100 text-slate-900">
      <Header
        activeView={activeView}
        onNavigate={(v) => {
          setActiveView(v);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        soundEnabled={progress.soundEnabled}
        onToggleSound={handleToggleSound}
        completedCount={progress.attemptedQuestionIds.length}
        totalQuestions={ALL_QUESTIONS.length}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 pt-6">
        {activeView === 'home' && (
          <HomeView
            lessons={THEORY_LESSONS}
            questions={ALL_QUESTIONS}
            progress={progress}
            onNavigate={(v) => {
              setActiveView(v);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onSelectLesson={handleSelectLesson}
            onStartExamSet={handleStartExamSet}
            onPracticeLesson={handlePracticeLesson}
          />
        )}

        {activeView === 'theory' && (
          <TheoryView
            lessons={THEORY_LESSONS}
            flashcards={FLASHCARDS}
            selectedLessonId={selectedLessonId}
            onSelectLesson={(id) => {
              setSelectedLessonId(id);
              setProgress((prev) => ({ ...prev, lastActiveLessonId: id }));
            }}
            progress={progress}
            onToggleLessonCompleted={handleToggleLessonCompleted}
            onToggleLessonReview={handleToggleLessonReview}
            onMarkFlashcard={handleMarkFlashcard}
            onPracticeLesson={handlePracticeLesson}
          />
        )}

        {(activeView === 'practice' || activeView === 'exam') && (
          <ExamAndPracticeView
            defaultTabType={activeView}
            allQuestions={ALL_QUESTIONS}
            progress={progress}
            externalSession={externalSession}
            onClearExternalSession={() => setExternalSession(null)}
            onToggleBookmark={handleToggleBookmark}
            onRecordSingleQuestionResult={handleRecordSingleQuestionResult}
            onFinishSession={handleFinishSession}
            onOpenTheoryLesson={handleSelectLesson}
          />
        )}

        {activeView === 'results' && latestExamResult && (
          <ResultsView
            result={latestExamResult}
            onRetryAll={(qIds, title, mode) => handleRetryQuestions(qIds, title, mode)}
            onRetryWrong={(wrongIds, title) =>
              handleRetryQuestions(wrongIds, title, 'practice_B')
            }
            onOpenTheoryLesson={handleSelectLesson}
            onGoHome={() => {
              setActiveView('home');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}

        {activeView === 'progress' && (
          <QuestionBankAndProgressView
            questions={ALL_QUESTIONS}
            progress={progress}
            onToggleBookmark={handleToggleBookmark}
            onOpenExamResult={(summary) => {
              setLatestExamResult(summary);
              setActiveView('results');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onPracticeQuestionSubset={handlePracticeSubset}
            onResetProgress={handleResetProgress}
          />
        )}

        {activeView === 'audit' && <SourceAuditView />}
      </main>
    </div>
  );
}
