import React, { useEffect, useState } from 'react';
import {
  AlertTriangle,
  Bookmark,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock,
  FileText,
  Filter,
  Flag,
  HelpCircle,
  Lock,
  Play,
  Send,
  ShieldAlert,
  Sparkles,
  XCircle,
} from 'lucide-react';
import {
  ExamResultSummary,
  ExamSetId,
  LessonId,
  Question,
  QuestionGradeResult,
  QuestionType,
  UserAnswerState,
  UserProgress,
} from '../types/biology';
import { EXAM_SETS_METADATA } from '../data/auditData';
import { calculateExamResult, gradeQuestion, LESSON_TITLES } from '../utils/scoring';
import { OriginalFigureCard } from './ImageLightbox';
import { playSound } from '../utils/sound';

export interface ActiveSessionConfig {
  title: string;
  mode: 'exam_A' | 'practice_B';
  questions: Question[];
  timeLimitMinutes: number; // 0 = unlimited
}

interface ExamAndPracticeViewProps {
  defaultTabType: 'practice' | 'exam';
  allQuestions: Question[];
  progress: UserProgress;
  externalSession: ActiveSessionConfig | null;
  onClearExternalSession: () => void;
  onToggleBookmark: (questionId: string) => void;
  onRecordSingleQuestionResult: (
    questionId: string,
    answer: UserAnswerState,
    grade: QuestionGradeResult
  ) => void;
  onFinishSession: (summary: ExamResultSummary) => void;
  onOpenTheoryLesson: (lessonId: LessonId) => void;
}

export const ExamAndPracticeView: React.FC<ExamAndPracticeViewProps> = ({
  defaultTabType,
  allQuestions,
  progress,
  externalSession,
  onClearExternalSession,
  onToggleBookmark,
  onRecordSingleQuestionResult,
  onFinishSession,
  onOpenTheoryLesson,
}) => {
  // Configuration filter states
  const [selectedSetId, setSelectedSetId] = useState<ExamSetId | 'all'>(
    defaultTabType === 'exam' ? 'de_so_1' : 'all'
  );
  const [selectedLessonId, setSelectedLessonId] = useState<LessonId | 'all'>('all');
  const [selectedType, setSelectedType] = useState<QuestionType | 'all'>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'wrong' | 'bookmarked' | 'unattempted'>('all');
  const [questionLimit, setQuestionLimit] = useState<number>(0); // 0 = all matching
  const [selectedMode, setSelectedMode] = useState<'exam_A' | 'practice_B'>(
    defaultTabType === 'exam' ? 'exam_A' : 'practice_B'
  );
  const [timeLimitMinutes, setTimeLimitMinutes] = useState<number>(
    defaultTabType === 'exam' ? 50 : 0
  );

  // Active running session state
  const [session, setSession] = useState<ActiveSessionConfig | null>(null);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<string, UserAnswerState>>({});
  const [lockedQuestions, setLockedQuestions] = useState<Record<string, QuestionGradeResult>>({});
  const [showHintIds, setShowHintIds] = useState<Record<string, boolean>>({});
  const [startedAtIso, setStartedAtIso] = useState<string>('');
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [showSubmitConfirm, setShowSubmitConfirm] = useState(false);

  // Sync mode when user switches top nav between 'practice' and 'exam'
  useEffect(() => {
    if (!session && !externalSession) {
      if (defaultTabType === 'exam') {
        setSelectedMode('exam_A');
        setSelectedSetId('de_so_1');
        setTimeLimitMinutes(50);
      } else {
        setSelectedMode('practice_B');
        setSelectedSetId('all');
        setTimeLimitMinutes(0);
      }
    }
  }, [defaultTabType]);

  // Launch external session if passed from HomeView / TheoryView / ResultsView
  useEffect(() => {
    if (externalSession) {
      startNewSession(externalSession);
      onClearExternalSession();
    }
  }, [externalSession]);

  const startNewSession = (cfg: ActiveSessionConfig) => {
    setSession(cfg);
    setCurrentIdx(0);
    setUserAnswers({});
    setLockedQuestions({});
    setShowHintIds({});
    setStartedAtIso(new Date().toISOString());
    setElapsedSeconds(0);
    setShowSubmitConfirm(false);
  };

  // Timer effect
  useEffect(() => {
    if (!session) return;
    const timer = window.setInterval(() => {
      setElapsedSeconds((prev) => {
        const next = prev + 1;
        if (session.timeLimitMinutes > 0 && next >= session.timeLimitMinutes * 60) {
          window.clearInterval(timer);
        }
        return next;
      });
    }, 1000);
    return () => window.clearInterval(timer);
  }, [session]);

  // Auto-submit if countdown reaches 0 in Exam Mode A
  useEffect(() => {
    if (
      session &&
      session.mode === 'exam_A' &&
      session.timeLimitMinutes > 0 &&
      elapsedSeconds >= session.timeLimitMinutes * 60
    ) {
      handleFinalizeSubmission();
    }
  }, [elapsedSeconds, session]);

  // Compute filtered questions for builder preview
  const matchingQuestions = allQuestions.filter((q) => {
    if (selectedSetId !== 'all' && q.sourceSetId !== selectedSetId) return false;
    if (selectedLessonId !== 'all' && q.lessonId !== selectedLessonId) return false;
    if (selectedType !== 'all' && q.type !== selectedType) return false;
    if (statusFilter === 'wrong' && !progress.wrongQuestionIds.includes(q.id)) return false;
    if (statusFilter === 'bookmarked' && !progress.bookmarkedQuestions.includes(q.id)) return false;
    if (statusFilter === 'unattempted' && progress.attemptedQuestionIds.includes(q.id)) return false;
    return true;
  });

  const finalBuilderQuestions =
    questionLimit > 0 ? matchingQuestions.slice(0, questionLimit) : matchingQuestions;

  const handleStartFromBuilder = () => {
    if (finalBuilderQuestions.length === 0) return;
    const setMeta = EXAM_SETS_METADATA.find((s) => s.id === selectedSetId);
    const title = setMeta
      ? setMeta.title
      : selectedLessonId !== 'all'
      ? `Luyện tập ${LESSON_TITLES[selectedLessonId]}`
      : `Phiên luyện tập tổng hợp (${finalBuilderQuestions.length} câu)`;

    startNewSession({
      title,
      mode: selectedMode,
      questions: finalBuilderQuestions,
      timeLimitMinutes: selectedMode === 'exam_A' ? timeLimitMinutes : 0,
    });
  };

  const isQuestionAnswered = (q: Question, ans?: UserAnswerState): boolean => {
    if (!ans) return false;
    if (q.type === 'mcq') return Boolean(ans.mcqChoice);
    if (q.type === 'true_false') {
      const tf = ans.tfChoices || {};
      return (
        typeof tf.a === 'boolean' ||
        typeof tf.b === 'boolean' ||
        typeof tf.c === 'boolean' ||
        typeof tf.d === 'boolean'
      );
    }
    if (q.type === 'short_answer') return Boolean(ans.shortText && ans.shortText.trim().length > 0);
    return false;
  };

  const applyImmediateGradeInModeB = (q: Question, nextAns: UserAnswerState) => {
    const grade = gradeQuestion(q, nextAns);
    setLockedQuestions((prev) => ({ ...prev, [q.id]: grade }));
    onRecordSingleQuestionResult(q.id, nextAns, grade);

    if (grade.feedbackStatus === 'correct' || grade.feedbackStatus === 'needs_review') {
      playSound('correct', progress.soundEnabled);
      if (session && currentIdx < session.questions.length - 1) {
        setCurrentIdx((i) => Math.min(session.questions.length - 1, i + 1));
      }
    } else {
      playSound('wrong', progress.soundEnabled);
    }
  };

  const handleSelectMCQ = (q: Question, key: 'A' | 'B' | 'C' | 'D') => {
    if (session?.mode === 'practice_B' && lockedQuestions[q.id]) return;
    const nextAns: UserAnswerState = { ...userAnswers[q.id], mcqChoice: key };
    setUserAnswers((prev) => ({
      ...prev,
      [q.id]: nextAns,
    }));

    if (session?.mode === 'practice_B') {
      applyImmediateGradeInModeB(q, nextAns);
    }
  };

  const handleSelectTF = (q: Question, stKey: 'a' | 'b' | 'c' | 'd', val: boolean) => {
    if (session?.mode === 'practice_B' && lockedQuestions[q.id]) return;
    const prevTf = userAnswers[q.id]?.tfChoices || {};
    if (session?.mode === 'practice_B' && typeof prevTf[stKey] === 'boolean') return;

    const nextTf = { ...prevTf, [stKey]: val };
    const nextAns: UserAnswerState = {
      ...userAnswers[q.id],
      tfChoices: nextTf,
    };

    setUserAnswers((prev) => ({
      ...prev,
      [q.id]: nextAns,
    }));

    if (session?.mode === 'practice_B') {
      const statements = q.statements || [];
      const stObj = statements.find((s) => s.key === stKey);
      const allAnswered = statements.every((s) => typeof nextTf[s.key] === 'boolean');

      if (allAnswered) {
        applyImmediateGradeInModeB(q, nextAns);
      } else if (stObj) {
        playSound(val === stObj.isTrue ? 'correct' : 'wrong', progress.soundEnabled);
      }
    }
  };

  const handleShortTextChange = (qId: string, text: string) => {
    if (session?.mode === 'practice_B' && lockedQuestions[qId]) return;
    setUserAnswers((prev) => ({
      ...prev,
      [qId]: { ...prev[qId], shortText: text },
    }));
  };

  const handleCommitShortAnswer = (q: Question) => {
    if (session?.mode !== 'practice_B' || lockedQuestions[q.id]) return;
    const ans = userAnswers[q.id];
    if (!ans?.shortText || ans.shortText.trim().length === 0) return;
    applyImmediateGradeInModeB(q, ans);
  };

  const handleFinalizeSubmission = () => {
    if (!session) return;
    playSound('complete', progress.soundEnabled);
    const summary = calculateExamResult({
      attemptId: `att-${Date.now()}`,
      title: session.title,
      mode: session.mode,
      startedAt: startedAtIso || new Date().toISOString(),
      completedAt: new Date().toISOString(),
      durationSeconds: elapsedSeconds,
      questions: session.questions,
      userAnswers,
    });
    setShowSubmitConfirm(false);
    setSession(null);
    onFinishSession(summary);
  };

  const formatTimer = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  // ============================================================================
  // RENDER CONFIGURATION / BUILDER SCREEN WHEN NO SESSION IS RUNNING
  // ============================================================================
  if (!session) {
    return (
      <div className="space-y-8 pb-14">
        {/* Quick Select Official Source Exam Sets */}
        <section className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-4">
            <div>
              <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900">
                {defaultTabType === 'exam'
                  ? '📝 KHU VỰC KIỂM TRA – PHÒNG THI MÔ PHỎNG'
                  : '🧠 KHU VỰC LUYỆN TẬP – PHẢN HỒI TỨC THÌ'}
              </h1>
              <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
                Giữ nguyên 100% nội dung câu hỏi, mệnh đề a-b-c-d, trình tự nucleotide, bảng biểu và hình ảnh gốc từ 2 file PDF nguồn
              </p>
            </div>
          </div>

          {/* Mode Selection Cards (Mandatory Section VI) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button
              type="button"
              onClick={() => {
                setSelectedMode('exam_A');
                if (timeLimitMinutes === 0) setTimeLimitMinutes(50);
              }}
              className={`text-left p-5 rounded-2xl border-2 transition-all cursor-pointer ${
                selectedMode === 'exam_A'
                  ? 'border-teal-600 bg-teal-50/60 shadow-xs'
                  : 'border-slate-200 bg-white hover:border-slate-300'
              }`}
            >
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="px-2.5 py-0.5 rounded bg-teal-700 text-white text-xs font-mono font-bold">
                  CHẾ ĐỘ A (MÔ PHỎNG THI THẬT)
                </span>
                {selectedMode === 'exam_A' && (
                  <CheckCircle2 className="w-5 h-5 text-teal-600 shrink-0" />
                )}
              </div>
              <h2 className="text-base font-extrabold text-slate-900">
                LÀM HẾT ĐỀ – XEM KẾT QUẢ CUỐI CÙNG
              </h2>
              <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                Có đồng hồ đếm ngược và bảng chuyển câu hỏi. <strong>Tuyệt đối không hiển thị đúng/sai, không đổi màu gợi ý và không lộ lời giải</strong> cho đến khi bạn bấm “NỘP BÀI”.
              </p>
            </button>

            <button
              type="button"
              onClick={() => {
                setSelectedMode('practice_B');
                setTimeLimitMinutes(0);
              }}
              className={`text-left p-5 rounded-2xl border-2 transition-all cursor-pointer ${
                selectedMode === 'practice_B'
                  ? 'border-blue-600 bg-blue-50/60 shadow-xs'
                  : 'border-slate-200 bg-white hover:border-slate-300'
              }`}
            >
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="px-2.5 py-0.5 rounded bg-blue-700 text-white text-xs font-mono font-bold">
                  CHẾ ĐỘ B (LUYỆN TẬP SÂU)
                </span>
                {selectedMode === 'practice_B' && (
                  <CheckCircle2 className="w-5 h-5 text-blue-600 shrink-0" />
                )}
              </div>
              <h2 className="text-base font-extrabold text-slate-900">
                LÀM TỪNG CÂU – BIẾT ĐÁP ÁN NGAY
              </h2>
              <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                Làm từng câu một. <strong>Ngay khi chọn đáp án</strong> (hoặc nhấn Enter ở câu trả lời ngắn), hệ thống tự động khóa câu trả lời, chấm điểm và hiển thị ngay giải thích chi tiết.
              </p>
            </button>
          </div>

          {/* 7 Original Exam Sets Grid */}
          <div className="space-y-3 pt-2">
            <h2 className="text-sm font-extrabold text-slate-800 uppercase tracking-wider">
              1. Chọn nhanh Bộ đề gốc nguyên bản từ 2 file PDF
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
              {EXAM_SETS_METADATA.map((exam) => (
                <div
                  key={exam.id}
                  className="rounded-xl border border-slate-200 bg-slate-50/60 p-4 flex flex-col justify-between gap-3 hover:border-teal-500 transition-colors"
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between gap-2 text-[11px] font-mono text-teal-800">
                      <span className="font-bold">{exam.sourceDocName}</span>
                      <span>{exam.pageRange}</span>
                    </div>
                    <h3 className="text-sm font-extrabold text-slate-900">{exam.title}</h3>
                    <p className="text-xs text-slate-600 leading-relaxed">{exam.description}</p>
                  </div>

                  <div className="pt-2 border-t border-slate-200/80 flex items-center justify-between gap-2">
                    <span className="text-xs font-mono font-semibold text-slate-700">
                      {exam.totalQuestions} câu · {exam.recommendedMinutes} phút
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        const qs = allQuestions.filter((q) => q.sourceSetId === exam.id);
                        startNewSession({
                          title: exam.title,
                          mode: selectedMode,
                          questions: qs,
                          timeLimitMinutes:
                            selectedMode === 'exam_A' ? exam.recommendedMinutes : 0,
                        });
                      }}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold cursor-pointer"
                    >
                      <Play className="w-3.5 h-3.5 fill-current" />
                      <span>Làm đề này</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Custom Filter Builder */}
          <div className="pt-4 border-t border-slate-200 space-y-4">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-teal-600" />
              <h2 className="text-sm font-extrabold text-slate-800 uppercase tracking-wider">
                2. Hoặc tùy chỉnh bộ lọc câu hỏi theo nhu cầu ôn tập
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label
                  htmlFor="filter-set"
                  className="block text-xs font-bold text-slate-700 mb-1"
                >
                  Đề nguồn / Tài liệu gốc
                </label>
                <select
                  id="filter-set"
                  value={selectedSetId}
                  onChange={(e) => setSelectedSetId(e.target.value as ExamSetId | 'all')}
                  className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs sm:text-sm font-medium text-slate-900"
                >
                  <option value="all">Tất cả 2 tài liệu PDF (253 câu)</option>
                  {EXAM_SETS_METADATA.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.title} ({s.totalQuestions} câu)
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label
                  htmlFor="filter-lesson"
                  className="block text-xs font-bold text-slate-700 mb-1"
                >
                  Bài học / Chuyên đề lý thuyết
                </label>
                <select
                  id="filter-lesson"
                  value={selectedLessonId}
                  onChange={(e) => setSelectedLessonId(e.target.value as LessonId | 'all')}
                  className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs sm:text-sm font-medium text-slate-900"
                >
                  <option value="all">Tất cả bài học & chuyên đề</option>
                  {Object.entries(LESSON_TITLES).map(([id, title]) => (
                    <option key={id} value={id}>
                      {title}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label
                  htmlFor="filter-type"
                  className="block text-xs font-bold text-slate-700 mb-1"
                >
                  Dạng câu hỏi
                </label>
                <select
                  id="filter-type"
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value as QuestionType | 'all')}
                  className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs sm:text-sm font-medium text-slate-900"
                >
                  <option value="all">Tất cả 3 dạng câu hỏi</option>
                  <option value="mcq">Phần I – Trắc nghiệm 4 phương án (166 câu)</option>
                  <option value="true_false">Phần II – Trắc nghiệm Đúng/Sai a, b, c, d (41 câu)</option>
                  <option value="short_answer">Phần III – Trả lời ngắn (46 câu)</option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="filter-status"
                  className="block text-xs font-bold text-slate-700 mb-1"
                >
                  Trạng thái câu hỏi
                </label>
                <select
                  id="filter-status"
                  value={statusFilter}
                  onChange={(e) =>
                    setStatusFilter(
                      e.target.value as 'all' | 'wrong' | 'bookmarked' | 'unattempted'
                    )
                  }
                  className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs sm:text-sm font-medium text-slate-900"
                >
                  <option value="all">Tất cả câu hỏi</option>
                  <option value="unattempted">
                    Câu chưa làm ({allQuestions.length - progress.attemptedQuestionIds.length})
                  </option>
                  <option value="wrong">
                    Câu đã làm sai cần ôn lại ({progress.wrongQuestionIds.length})
                  </option>
                  <option value="bookmarked">
                    Câu đã đánh dấu xem lại ({progress.bookmarkedQuestions.length})
                  </option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="filter-limit"
                  className="block text-xs font-bold text-slate-700 mb-1"
                >
                  Số lượng câu hỏi muốn làm
                </label>
                <select
                  id="filter-limit"
                  value={questionLimit}
                  onChange={(e) => setQuestionLimit(Number(e.target.value))}
                  className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs sm:text-sm font-medium text-slate-900"
                >
                  <option value={0}>Toàn bộ câu khớp bộ lọc ({matchingQuestions.length} câu)</option>
                  <option value={10}>10 câu</option>
                  <option value={20}>20 câu</option>
                  <option value={28}>28 câu (Chuẩn 1 đề thi)</option>
                  <option value={40}>40 câu</option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="filter-time"
                  className="block text-xs font-bold text-slate-700 mb-1"
                >
                  Thời gian làm bài (Chế độ A)
                </label>
                <select
                  id="filter-time"
                  value={timeLimitMinutes}
                  onChange={(e) => setTimeLimitMinutes(Number(e.target.value))}
                  className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs sm:text-sm font-medium text-slate-900"
                >
                  <option value={0}>Không giới hạn thời gian</option>
                  <option value={15}>15 phút</option>
                  <option value={30}>30 phút</option>
                  <option value={45}>45 phút</option>
                  <option value={50}>50 phút (Chuẩn đề THPT)</option>
                  <option value={60}>60 phút</option>
                </select>
              </div>
            </div>

            <div className="pt-2 flex flex-wrap items-center justify-between gap-4 bg-slate-100 rounded-xl p-4">
              <div className="text-xs sm:text-sm text-slate-700">
                Số câu hỏi khớp bộ lọc:{' '}
                <strong className="font-mono text-teal-800 text-base">
                  {finalBuilderQuestions.length} câu
                </strong>{' '}
                · Chế độ đã chọn:{' '}
                <strong className="text-slate-900">
                  {selectedMode === 'exam_A'
                    ? 'LÀM HẾT ĐỀ – XEM KẾT QUẢ CUỐI CÙNG'
                    : 'LÀM TỪNG CÂU – BIẾT ĐÁP ÁN NGAY'}
                </strong>
              </div>

              <button
                type="button"
                disabled={finalBuilderQuestions.length === 0}
                onClick={handleStartFromBuilder}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-teal-600 hover:bg-teal-700 disabled:bg-slate-300 text-white font-extrabold text-sm shadow-sm cursor-pointer"
              >
                <Play className="w-4 h-4 fill-current" />
                <span>BẮT ĐẦU LÀM BÀI ({finalBuilderQuestions.length} CÂU)</span>
              </button>
            </div>
          </div>
        </section>
      </div>
    );
  }

  // ============================================================================
  // RENDER ACTIVE EXAM / PRACTICE RUNNER
  // ============================================================================
  const activeQuestion = session.questions[currentIdx] || session.questions[0];
  const currentAnswer = userAnswers[activeQuestion.id] || {};
  const lockedGrade = lockedQuestions[activeQuestion.id];
  const isBookmarked = progress.bookmarkedQuestions.includes(activeQuestion.id);

  const answeredTotalCount = session.questions.filter((q) =>
    isQuestionAnswered(q, userAnswers[q.id])
  ).length;

  const remainingSeconds =
    session.timeLimitMinutes > 0
      ? Math.max(0, session.timeLimitMinutes * 60 - elapsedSeconds)
      : elapsedSeconds;

  return (
    <div className="space-y-6 pb-16">
      {/* Top Runner Status Header */}
      <div className="bg-slate-900 text-white rounded-2xl p-4 sm:p-5 border border-slate-800 shadow-md flex flex-wrap items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex flex-wrap items-center gap-2">
            <span
              className={`px-2.5 py-0.5 rounded text-[11px] font-mono font-bold ${
                session.mode === 'exam_A'
                  ? 'bg-amber-400 text-slate-950'
                  : 'bg-blue-500 text-white'
              }`}
            >
              {session.mode === 'exam_A'
                ? 'CHẾ ĐỘ A: LÀM HẾT ĐỀ – ẨN ĐÁP ÁN TRƯỚC KHI NỘP'
                : 'CHẾ ĐỘ B: LÀM TỪNG CÂU – BIẾT ĐÁP ÁN NGAY'}
            </span>
            <span className="text-xs text-slate-300 font-mono">
              Đã làm: <strong>{answeredTotalCount}</strong>/{session.questions.length} câu
            </span>
          </div>
          <h1 className="text-base sm:text-lg font-extrabold text-white">{session.title}</h1>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-800 border border-slate-700 font-mono text-sm text-teal-300">
            <Clock className="w-4 h-4 text-teal-400" />
            <span>
              {session.timeLimitMinutes > 0
                ? `Còn lại: ${formatTimer(remainingSeconds)}`
                : `Thời gian: ${formatTimer(elapsedSeconds)}`}
            </span>
          </div>

          <button
            type="button"
            onClick={() => setShowSubmitConfirm(true)}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-extrabold text-xs sm:text-sm shadow-sm cursor-pointer"
          >
            <Send className="w-4 h-4" />
            <span>NỘP BÀI</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Main Question Card */}
        <div className="lg:col-span-8 space-y-5">
          <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-xs space-y-5">
            {/* Question Metadata Bar */}
            <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-100">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-3 py-1 rounded-lg bg-slate-900 text-white font-mono font-bold text-xs sm:text-sm">
                  Câu {currentIdx + 1}/{session.questions.length} ({activeQuestion.originalNumber})
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-teal-50 text-teal-800 border border-teal-200 text-xs font-semibold">
                  {activeQuestion.type === 'mcq'
                    ? 'Trắc nghiệm 4 lựa chọn (0,25đ)'
                    : activeQuestion.type === 'true_false'
                    ? 'Đúng / Sai a, b, c, d (Tối đa 1,0đ)'
                    : 'Trả lời ngắn (0,25đ)'}
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-600 text-xs font-mono">
                  {activeQuestion.sourceDoc === 'ilovepdf_merged'
                    ? 'ilovepdf_merged.pdf'
                    : 'ĐỀ ÔN TẬP 12 HS(1).pdf'}{' '}
                  · Trang {activeQuestion.pageNumber}
                </span>
              </div>

              <button
                type="button"
                onClick={() => onToggleBookmark(activeQuestion.id)}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold border transition-colors cursor-pointer ${
                  isBookmarked
                    ? 'bg-amber-100 text-amber-900 border-amber-400'
                    : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                }`}
              >
                <Bookmark className="w-3.5 h-3.5" />
                <span>{isBookmarked ? 'Đã đánh dấu xem lại' : 'Đánh dấu xem lại'}</span>
              </button>
            </div>

            {/* Source Verification Warning if Question is Flagged */}
            {activeQuestion.needsSourceVerification && (
              <div className="p-4 rounded-xl bg-amber-50 border border-amber-300 text-amber-950 text-xs sm:text-sm flex items-start gap-3">
                <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <div className="font-bold">Cần kiểm tra tài liệu gốc</div>
                  <p>{activeQuestion.verificationNote}</p>
                </div>
              </div>
            )}

            {/* Question Stem */}
            <div className="space-y-3">
              <div className="text-base sm:text-lg font-bold text-slate-900 leading-relaxed whitespace-pre-line">
                {activeQuestion.stem}
              </div>

              {activeQuestion.subItems && activeQuestion.subItems.length > 0 && (
                <div className="space-y-1.5 pl-3 border-l-2 border-teal-500 bg-slate-50/70 p-3 rounded-r-xl text-xs sm:text-sm text-slate-800 font-medium">
                  {activeQuestion.subItems.map((line, i) => (
                    <div key={i}>{line}</div>
                  ))}
                </div>
              )}
            </div>

            {/* Reconstructed Table if Question Has Table Data */}
            {activeQuestion.table && (
              <div className="overflow-x-auto rounded-xl border border-slate-200 my-2">
                {activeQuestion.table.caption && (
                  <div className="px-4 py-2 bg-slate-100 border-b border-slate-200 text-xs font-bold text-slate-700">
                    {activeQuestion.table.caption}
                  </div>
                )}
                <table className="w-full text-left border-collapse text-xs sm:text-sm">
                  <thead>
                    <tr className="bg-slate-800 text-white">
                      {activeQuestion.table.headers.map((h, i) => (
                        <th key={i} className="p-2.5 font-bold border-r border-slate-700 last:border-r-0">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {activeQuestion.table.rows.map((row, rIdx) => (
                      <tr key={rIdx} className="odd:bg-white even:bg-slate-50">
                        {row.map((cell, cIdx) => (
                          <td
                            key={cIdx}
                            className="p-2.5 border-r border-slate-200 last:border-r-0 font-mono text-slate-800"
                          >
                            {cell}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Original PDF Image Reference */}
            {activeQuestion.image && <OriginalFigureCard image={activeQuestion.image} />}

            {/* ==============================================================
                QUESTION TYPE 1: MULTIPLE CHOICE (4 OPTIONS A, B, C, D)
               ============================================================== */}
            {activeQuestion.type === 'mcq' && activeQuestion.options && (
              <div className="grid grid-cols-1 gap-3 pt-2">
                {activeQuestion.options.map((opt) => {
                  const isSelected = currentAnswer.mcqChoice === opt.key;
                  const showFeedback = session.mode === 'practice_B' && Boolean(lockedGrade);
                  const isCorrectOption = opt.key === activeQuestion.correctOption;

                  let cardStyle =
                    'border-slate-200 bg-white hover:border-teal-500 text-slate-800';
                  let badgeStyle = 'bg-slate-100 text-slate-700 border-slate-300';

                  if (!showFeedback) {
                    // In Exam Mode A (or before checking in Mode B): ONLY neutral selection highlight, ZERO answer leak!
                    if (isSelected) {
                      cardStyle = 'border-teal-600 bg-teal-50/70 text-slate-950 ring-1 ring-teal-600';
                      badgeStyle = 'bg-teal-600 text-white border-teal-600';
                    }
                  } else {
                    // After locking answer in Practice Mode B
                    if (isCorrectOption) {
                      cardStyle = 'border-emerald-600 bg-emerald-50 text-emerald-950';
                      badgeStyle = 'bg-emerald-600 text-white border-emerald-600';
                    } else if (isSelected && !isCorrectOption) {
                      cardStyle = 'border-rose-500 bg-rose-50 text-rose-950';
                      badgeStyle = 'bg-rose-600 text-white border-rose-600';
                    } else {
                      cardStyle = 'border-slate-200 bg-slate-50/60 text-slate-500';
                    }
                  }

                  return (
                    <button
                      key={opt.key}
                      type="button"
                      disabled={showFeedback}
                      onClick={() => handleSelectMCQ(activeQuestion, opt.key)}
                      className={`w-full text-left p-4 rounded-xl border-2 transition-all flex items-start gap-3.5 cursor-pointer disabled:cursor-default ${cardStyle}`}
                    >
                      <span
                        className={`w-8 h-8 rounded-lg border font-mono font-extrabold text-sm flex items-center justify-center shrink-0 ${badgeStyle}`}
                      >
                        {opt.key}
                      </span>
                      <span className="text-sm sm:text-base font-medium leading-relaxed pt-0.5">
                        {opt.text}
                      </span>
                    </button>
                  );
                })}
              </div>
            )}

            {/* ==============================================================
                QUESTION TYPE 2: TRUE / FALSE (STATEMENTS a, b, c, d)
               ============================================================== */}
            {activeQuestion.type === 'true_false' && activeQuestion.statements && (
              <div className="space-y-3 pt-2">
                <div className="text-xs font-semibold text-slate-500 bg-slate-50 px-3.5 py-2 rounded-lg border border-slate-200">
                  Hãy chọn <strong>ĐÚNG</strong> hoặc <strong>SAI</strong> cho từng mệnh đề a), b), c), d) dưới đây:
                </div>

                {activeQuestion.statements.map((st) => {
                  const userVal = currentAnswer.tfChoices?.[st.key];
                  const isStatementAnswered = typeof userVal === 'boolean';
                  const showStatementFeedback =
                    session.mode === 'practice_B' && (Boolean(lockedGrade) || isStatementAnswered);
                  const isStatementCorrect = isStatementAnswered && userVal === st.isTrue;

                  return (
                    <div
                      key={st.key}
                      className={`p-4 rounded-xl border-2 transition-all space-y-3 ${
                        !showStatementFeedback
                          ? isStatementAnswered
                            ? 'border-teal-600/60 bg-teal-50/20'
                            : 'border-slate-200 bg-white'
                          : isStatementCorrect
                          ? 'border-emerald-500 bg-emerald-50/50'
                          : 'border-rose-400 bg-rose-50/50'
                      }`}
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div className="text-sm sm:text-base font-medium text-slate-900 leading-relaxed">
                          <strong className="font-mono text-teal-800 mr-1.5">{st.key})</strong>
                          {st.text}
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          <button
                            type="button"
                            disabled={showStatementFeedback}
                            onClick={() => handleSelectTF(activeQuestion, st.key, true)}
                            className={`px-4 py-2 rounded-lg font-bold text-xs border transition-colors cursor-pointer disabled:cursor-default ${
                              userVal === true
                                ? 'bg-teal-600 text-white border-teal-600 shadow-xs'
                                : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
                            }`}
                          >
                            ĐÚNG
                          </button>
                          <button
                            type="button"
                            disabled={showStatementFeedback}
                            onClick={() => handleSelectTF(activeQuestion, st.key, false)}
                            className={`px-4 py-2 rounded-lg font-bold text-xs border transition-colors cursor-pointer disabled:cursor-default ${
                              userVal === false
                                ? 'bg-slate-800 text-white border-slate-800 shadow-xs'
                                : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
                            }`}
                          >
                            SAI
                          </button>
                        </div>
                      </div>

                      {showStatementFeedback && (
                        <div className="pt-2 border-t border-slate-200/80 text-xs space-y-1">
                          <div className="font-bold flex items-center gap-1.5">
                            {isStatementCorrect ? (
                              <span className="text-emerald-800">
                                ✓ Bạn chọn {userVal === true ? 'ĐÚNG' : 'SAI'} — Chính xác!
                              </span>
                            ) : (
                              <span className="text-rose-800">
                                ✗ Đáp án đúng của mệnh đề {st.key}) là:{' '}
                                <strong>{st.isTrue ? 'ĐÚNG' : 'SAI'}</strong>
                              </span>
                            )}
                          </div>
                          {!isStatementCorrect && (
                            <p className="text-slate-700">{st.explanation}</p>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}

            {/* ==============================================================
                QUESTION TYPE 3: SHORT ANSWER (TRẢ LỜI NGẮN)
               ============================================================== */}
            {activeQuestion.type === 'short_answer' && (
              <div className="space-y-3 pt-2">
                <label
                  htmlFor={`sa-input-${activeQuestion.id}`}
                  className="block text-xs font-bold uppercase tracking-wider text-slate-600"
                >
                  {session.mode === 'practice_B'
                    ? 'Nhập câu trả lời ngắn và nhấn Enter (hoặc chạm ra ngoài ô nhập) để xem kết quả ngay:'
                    : 'Nhập câu trả lời ngắn của bạn (số, tỉ lệ %, trình tự hoặc thuật ngữ):'}
                </label>

                <div className="flex flex-wrap items-center gap-3">
                  <input
                    id={`sa-input-${activeQuestion.id}`}
                    type="text"
                    disabled={session.mode === 'practice_B' && Boolean(lockedGrade)}
                    value={currentAnswer.shortText || ''}
                    onChange={(e) => handleShortTextChange(activeQuestion.id, e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleCommitShortAnswer(activeQuestion);
                      }
                    }}
                    onBlur={() => handleCommitShortAnswer(activeQuestion)}
                    placeholder="Ví dụ: 240 hoặc 0,19 hoặc 3214..."
                    className="flex-1 min-w-[220px] rounded-xl border-2 border-slate-300 focus:border-teal-600 focus:outline-none px-4 py-3 text-base font-mono font-bold text-slate-900 disabled:bg-slate-100"
                  />

                  {session.mode === 'practice_B' && activeQuestion.shortAnswer?.hint && (
                    <button
                      type="button"
                      onClick={() =>
                        setShowHintIds((prev) => ({
                          ...prev,
                          [activeQuestion.id]: !prev[activeQuestion.id],
                        }))
                      }
                      className="inline-flex items-center gap-1.5 px-3.5 py-3 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 text-xs font-bold cursor-pointer"
                    >
                      <HelpCircle className="w-4 h-4 text-amber-600" />
                      <span>Gợi ý công thức</span>
                    </button>
                  )}
                </div>

                {showHintIds[activeQuestion.id] && activeQuestion.shortAnswer?.hint && (
                  <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-950">
                    <strong>💡 Gợi ý:</strong> {activeQuestion.shortAnswer.hint}
                  </div>
                )}
              </div>
            )}

            {/* ==============================================================
                MODE B: DETAILED EXPLANATION PANEL (ONLY SHOWN WHEN WRONG / PARTIAL)
               ============================================================== */}
            {session.mode === 'practice_B' &&
              lockedGrade &&
              lockedGrade.feedbackStatus !== 'correct' && (
                <div className="pt-4 border-t border-slate-100 space-y-4">
                  <div
                    className={`rounded-2xl border-2 p-5 space-y-3 ${
                      lockedGrade.feedbackStatus === 'partial'
                        ? 'bg-amber-50/80 border-amber-500 text-amber-950'
                        : lockedGrade.feedbackStatus === 'needs_review'
                        ? 'bg-slate-100 border-slate-400 text-slate-900'
                        : 'bg-rose-50/80 border-rose-500 text-rose-950'
                    }`}
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2 font-extrabold text-sm sm:text-base">
                        <XCircle className="w-5 h-5 text-rose-600 shrink-0" />
                        <span>{lockedGrade.feedbackMessage}</span>
                      </div>
                      <span className="inline-flex items-center gap-1 text-xs font-mono px-2.5 py-1 rounded bg-white/80 border border-current/20">
                        <Lock className="w-3 h-3" />
                        Đã khóa đáp án (+{lockedGrade.earnedPoints}/{lockedGrade.maxPoints}đ)
                      </span>
                    </div>

                    {activeQuestion.type === 'short_answer' && activeQuestion.shortAnswer && (
                      <div className="p-3 rounded-xl bg-white/90 border border-slate-200 text-xs sm:text-sm space-y-1 text-slate-800">
                        <div>
                          <strong>Đáp án chuẩn tham chiếu:</strong>{' '}
                          <span className="font-mono font-bold text-teal-800">
                            {activeQuestion.shortAnswer.primaryAnswer}{' '}
                            {activeQuestion.shortAnswer.unit || ''}
                          </span>
                        </div>
                        <div>
                          <strong>Tiêu chí / Biểu điểm:</strong> {activeQuestion.shortAnswer.rubric}
                        </div>
                      </div>
                    )}

                    <div className="p-3.5 rounded-xl bg-white/90 border border-slate-200 text-xs sm:text-sm text-slate-800 space-y-1.5 leading-relaxed">
                      <div className="font-bold text-slate-900 flex items-center gap-1.5">
                        <Sparkles className="w-4 h-4 text-teal-600" />
                        <span>Giải thích chi tiết & Căn cứ sinh học:</span>
                      </div>
                      <p className="whitespace-pre-line">{activeQuestion.explanation}</p>
                    </div>

                    <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                      <button
                        type="button"
                        onClick={() => onOpenTheoryLesson(activeQuestion.lessonId)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white hover:bg-slate-100 text-teal-800 border border-teal-300 text-xs font-bold cursor-pointer"
                      >
                        <FileText className="w-3.5 h-3.5" />
                        <span>Mở bài lý thuyết: {LESSON_TITLES[activeQuestion.lessonId]}</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}

            {/* Previous / Next Navigation Bar */}
            <div className="pt-4 border-t border-slate-200 flex items-center justify-between gap-3">
              <button
                type="button"
                disabled={currentIdx === 0}
                onClick={() => setCurrentIdx((i) => Math.max(0, i - 1))}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 disabled:opacity-40 text-slate-800 text-xs sm:text-sm font-bold cursor-pointer disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Câu trước</span>
              </button>

              {currentIdx < session.questions.length - 1 ? (
                <button
                  type="button"
                  onClick={() =>
                    setCurrentIdx((i) => Math.min(session.questions.length - 1, i + 1))
                  }
                  className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs sm:text-sm font-bold cursor-pointer"
                >
                  <span>Câu tiếp theo</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => setShowSubmitConfirm(true)}
                  className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs sm:text-sm font-extrabold cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  <span>Hoàn thành & Xem thống kê</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Question Navigator Sidebar */}
        <aside className="lg:col-span-4 space-y-4 lg:sticky lg:top-20">
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-extrabold text-slate-900">
                Bảng chuyển nhanh câu hỏi
              </h2>
              <span className="text-xs font-mono text-slate-500">
                {answeredTotalCount}/{session.questions.length} đã điền
              </span>
            </div>

            <div className="grid grid-cols-5 sm:grid-cols-7 gap-2">
              {session.questions.map((q, idx) => {
                const isCurrent = idx === currentIdx;
                const answered = isQuestionAnswered(q, userAnswers[q.id]);
                const marked = progress.bookmarkedQuestions.includes(q.id);
                const locked = lockedQuestions[q.id];

                let btnClass = 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200';

                if (session.mode === 'exam_A' || !locked) {
                  // Neutral colors in Exam Mode A (Zero answer leak!)
                  if (answered) {
                    btnClass = 'bg-teal-600 text-white border-teal-600';
                  }
                } else {
                  if (locked.feedbackStatus === 'correct') {
                    btnClass = 'bg-emerald-600 text-white border-emerald-600';
                  } else if (locked.feedbackStatus === 'partial') {
                    btnClass = 'bg-amber-500 text-slate-950 border-amber-500';
                  } else {
                    btnClass = 'bg-rose-600 text-white border-rose-600';
                  }
                }

                return (
                  <button
                    key={q.id}
                    type="button"
                    onClick={() => setCurrentIdx(idx)}
                    className={`relative h-9 rounded-lg border font-mono text-xs font-bold flex items-center justify-center transition-all cursor-pointer ${btnClass} ${
                      isCurrent ? 'ring-2 ring-offset-1 ring-slate-900 scale-105' : ''
                    }`}
                    aria-label={`Chuyển tới câu ${idx + 1}`}
                  >
                    {idx + 1}
                    {marked && (
                      <span
                        className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-amber-400 border border-slate-900"
                        title="Đã đánh dấu xem lại"
                      />
                    )}
                  </button>
                );
              })}
            </div>

            <div className="pt-3 border-t border-slate-100 grid grid-cols-2 gap-2 text-[11px] text-slate-600">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded bg-teal-600 inline-block" />
                <span>Đã trả lời</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded bg-slate-200 inline-block" />
                <span>Chưa trả lời</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-amber-400 inline-block" />
                <span>Đánh dấu xem lại</span>
              </div>
              {session.mode === 'exam_A' && (
                <div className="flex items-center gap-1.5 text-teal-800 font-semibold">
                  <Flag className="w-3 h-3" />
                  <span>Bảo mật đáp án</span>
                </div>
              )}
            </div>

            <button
              type="button"
              onClick={() => setShowSubmitConfirm(true)}
              className="w-full py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs sm:text-sm cursor-pointer"
            >
              NỘP BÀI & XEM KẾT QUẢ CHI TIẾT
            </button>
          </div>
        </aside>
      </div>

      {/* Accessible Confirmation Modal for Submitting Exam */}
      {showSubmitConfirm && (
        <div
          className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="submit-modal-title"
        >
          <div className="bg-white rounded-2xl max-w-md w-full p-6 border border-slate-200 shadow-2xl space-y-4">
            <div className="flex items-center gap-3 text-slate-900">
              <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h2 id="submit-modal-title" className="text-base font-extrabold">
                  Xác nhận nộp bài và chấm điểm?
                </h2>
                <p className="text-xs text-slate-500">{session.title}</p>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-700 space-y-1">
              <div>
                • Số câu đã trả lời:{' '}
                <strong className="text-teal-700 font-mono">
                  {answeredTotalCount}/{session.questions.length} câu
                </strong>
              </div>
              {answeredTotalCount < session.questions.length && (
                <div className="text-rose-600 font-semibold">
                  • Còn {session.questions.length - answeredTotalCount} câu chưa hoàn thành!
                </div>
              )}
              <div>
                • Thời gian làm bài:{' '}
                <strong className="font-mono">{formatTimer(elapsedSeconds)}</strong>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setShowSubmitConfirm(false)}
                className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold cursor-pointer"
              >
                Quay lại làm tiếp
              </button>
              <button
                type="button"
                onClick={handleFinalizeSubmission}
                className="px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-extrabold shadow-xs cursor-pointer"
              >
                XÁC NHẬN NỘP BÀI
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
