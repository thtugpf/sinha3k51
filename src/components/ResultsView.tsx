import React, { useState } from 'react';
import {
  AlertTriangle,
  Award,
  BookOpen,
  CheckCircle2,
  Home,
  RefreshCw,
  RotateCcw,
  Sparkles,
  XCircle,
} from 'lucide-react';
import { ExamResultSummary, LessonId, Question } from '../types/biology';
import { QUESTIONS_BY_ID } from '../data/index';
import { OriginalFigureCard } from './ImageLightbox';
import { LESSON_TITLES } from '../utils/scoring';

interface ResultsViewProps {
  result: ExamResultSummary;
  onRetryAll: (questionIds: string[], title: string, mode: 'exam_A' | 'practice_B') => void;
  onRetryWrong: (wrongQuestionIds: string[], title: string) => void;
  onOpenTheoryLesson: (lessonId: LessonId) => void;
  onGoHome: () => void;
}

export const ResultsView: React.FC<ResultsViewProps> = ({
  result,
  onRetryAll,
  onRetryWrong,
  onOpenTheoryLesson,
  onGoHome,
}) => {
  const [filterMode, setFilterMode] = useState<'all' | 'wrong_only'>('all');

  const questions: Question[] = result.questionIds
    .map((id) => QUESTIONS_BY_ID[id])
    .filter(Boolean);

  const wrongOrPartialIds = questions
    .filter((q) => {
      const r = result.questionResults[q.id];
      return r && r.feedbackStatus !== 'correct' && r.feedbackStatus !== 'needs_review';
    })
    .map((q) => q.id);

  const displayedQuestions =
    filterMode === 'wrong_only'
      ? questions.filter((q) => wrongOrPartialIds.includes(q.id))
      : questions;

  // Find lesson with lowest accuracy to jump to related theory
  const weakestLessonEntry = (Object.entries(result.byLesson) as [
    LessonId,
    ExamResultSummary['byLesson'][LessonId]
  ][])
    .filter(([, stats]) => stats.total > 0)
    .sort((a, b) => a[1].correct / a[1].total - b[1].correct / b[1].total)[0];

  const primaryLessonId: LessonId = weakestLessonEntry
    ? weakestLessonEntry[0]
    : 'bai-1-gen-va-tai-ban-dna';

  return (
    <div className="space-y-8 pb-16">
      {/* Main Score Summary Banner */}
      <section className="bg-gradient-to-br from-slate-900 via-slate-800 to-teal-950 text-white rounded-2xl p-6 sm:p-8 border border-slate-700 shadow-lg space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-700/80 pb-4">
          <div>
            <span className="text-xs font-mono uppercase tracking-wider px-2.5 py-1 rounded bg-teal-500/20 text-teal-300 border border-teal-400/30">
              BÁO CÁO KẾT QUẢ & PHÂN TÍCH BÀI LÀM
            </span>
            <h1 className="text-xl sm:text-3xl font-extrabold mt-2">{result.title}</h1>
          </div>

          <div className="flex items-center gap-3 bg-slate-950/70 px-5 py-3 rounded-2xl border border-teal-500/40">
            <Award className="w-8 h-8 text-amber-400 shrink-0" />
            <div>
              <span className="text-xs text-slate-400 block">Điểm quy đổi thang 10</span>
              <strong className="text-2xl sm:text-3xl font-mono font-extrabold text-teal-300">
                {result.scaledScore10} / 10
              </strong>
            </div>
          </div>
        </div>

        {/* Core Metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          <div className="rounded-xl bg-slate-800/80 border border-slate-700 p-3.5">
            <span className="text-xs text-slate-400 block">Tổng điểm chuẩn</span>
            <strong className="text-lg sm:text-xl font-mono font-extrabold text-white">
              {result.totalEarnedPoints} / {result.totalMaxPoints}đ
            </strong>
          </div>
          <div className="rounded-xl bg-slate-800/80 border border-slate-700 p-3.5">
            <span className="text-xs text-slate-400 block">Tỷ lệ chính xác</span>
            <strong className="text-lg sm:text-xl font-mono font-extrabold text-teal-300">
              {result.accuracyPercent}%
            </strong>
          </div>
          <div className="rounded-xl bg-slate-800/80 border border-slate-700 p-3.5">
            <span className="text-xs text-slate-400 block">Số câu đúng hoàn toàn</span>
            <strong className="text-lg sm:text-xl font-mono font-extrabold text-emerald-400">
              {result.correctQuestions} câu
            </strong>
          </div>
          <div className="rounded-xl bg-slate-800/80 border border-slate-700 p-3.5">
            <span className="text-xs text-slate-400 block">Đúng 1 phần / Sai</span>
            <strong className="text-lg sm:text-xl font-mono font-extrabold text-rose-400">
              {result.partialQuestions + result.incorrectQuestions} câu
            </strong>
          </div>
          <div className="rounded-xl bg-slate-800/80 border border-slate-700 p-3.5">
            <span className="text-xs text-slate-400 block">Chưa trả lời</span>
            <strong className="text-lg sm:text-xl font-mono font-extrabold text-amber-300">
              {result.unansweredQuestions} câu
            </strong>
          </div>
        </div>

        {/* Five Mandatory Action Buttons (Section VII) */}
        <div className="flex flex-wrap items-center gap-3 pt-2">
          <button
            type="button"
            onClick={() => setFilterMode('all')}
            className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-extrabold cursor-pointer ${
              filterMode === 'all'
                ? 'bg-teal-500 text-slate-950'
                : 'bg-slate-800 text-white hover:bg-slate-700 border border-slate-600'
            }`}
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>XEM LẠI BÀI LÀM ({questions.length})</span>
          </button>

          <button
            type="button"
            disabled={wrongOrPartialIds.length === 0}
            onClick={() => onRetryWrong(wrongOrPartialIds, `Ôn lại câu sai – ${result.title}`)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 disabled:opacity-40 text-white text-xs sm:text-sm font-extrabold cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            <span>ÔN LẠI CÂU SAI ({wrongOrPartialIds.length})</span>
          </button>

          <button
            type="button"
            onClick={() => onOpenTheoryLesson(primaryLessonId)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs sm:text-sm font-extrabold cursor-pointer"
          >
            <BookOpen className="w-4 h-4" />
            <span>HỌC LÝ THUYẾT LIÊN QUAN</span>
          </button>

          <button
            type="button"
            onClick={() => onRetryAll(result.questionIds, result.title, result.mode)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs sm:text-sm font-extrabold cursor-pointer"
          >
            <RefreshCw className="w-4 h-4" />
            <span>LÀM LẠI ĐỀ</span>
          </button>

          <button
            type="button"
            onClick={onGoHome}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-600 text-xs sm:text-sm font-bold cursor-pointer"
          >
            <Home className="w-4 h-4" />
            <span>QUAY VỀ TRANG CHỦ</span>
          </button>
        </div>
      </section>

      {/* Breakdown by Question Type & By Lesson */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
          <h2 className="text-base font-extrabold text-slate-900">
            Kết quả theo từng dạng câu hỏi
          </h2>
          <div className="space-y-3">
            {[
              {
                key: 'mcq' as const,
                label: 'Phần I: Trắc nghiệm 4 lựa chọn (0,25đ/câu)',
              },
              {
                key: 'true_false' as const,
                label: 'Phần II: Trắc nghiệm Đúng/Sai a, b, c, d (1,0đ/câu)',
              },
              {
                key: 'short_answer' as const,
                label: 'Phần III: Trả lời ngắn (0,25đ/câu)',
              },
            ].map((item) => {
              const st = result.byType[item.key];
              return (
                <div
                  key={item.key}
                  className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-3"
                >
                  <div>
                    <div className="text-xs sm:text-sm font-bold text-slate-900">{item.label}</div>
                    <div className="text-xs text-slate-500">
                      Đúng tối đa: {st.correct}/{st.total} câu
                    </div>
                  </div>
                  <div className="text-right font-mono">
                    <strong className="text-sm font-extrabold text-teal-800">
                      {Math.round(st.earnedPoints * 100) / 100} / {Math.round(st.maxPoints * 100) / 100}đ
                    </strong>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
          <h2 className="text-base font-extrabold text-slate-900">
            Phân tích theo bài học / chuyên đề
          </h2>
          <div className="space-y-2.5">
            {(Object.entries(result.byLesson) as [
              LessonId,
              ExamResultSummary['byLesson'][LessonId]
            ][])
              .filter(([, st]) => st.total > 0)
              .map(([lessonId, st]) => (
                <div
                  key={lessonId}
                  className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-3"
                >
                  <div className="min-w-0">
                    <div className="text-xs sm:text-sm font-bold text-slate-900 truncate">
                      {st.lessonTitle}
                    </div>
                    <div className="text-xs text-slate-500">
                      Đúng hoàn toàn: {st.correct}/{st.total} câu
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => onOpenTheoryLesson(lessonId)}
                    className="px-3 py-1.5 rounded-lg bg-teal-50 hover:bg-teal-100 text-teal-800 text-xs font-bold shrink-0 cursor-pointer"
                  >
                    Ôn lý thuyết →
                  </button>
                </div>
              ))}
          </div>
        </div>
      </section>

      {/* Detailed Question-by-Question Review & Error Analysis */}
      <section className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200">
          <h2 className="text-base sm:text-lg font-extrabold text-slate-900">
            Chi tiết từng câu hỏi, đáp án chuẩn & giải thích
          </h2>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setFilterMode('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer ${
                filterMode === 'all'
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              Tất cả ({questions.length})
            </button>
            <button
              type="button"
              onClick={() => setFilterMode('wrong_only')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer ${
                filterMode === 'wrong_only'
                  ? 'bg-rose-600 text-white'
                  : 'bg-rose-50 text-rose-800 hover:bg-rose-100'
              }`}
            >
              Chỉ hiện câu sai / chưa làm ({wrongOrPartialIds.length})
            </button>
          </div>
        </div>

        <div className="space-y-4">
          {displayedQuestions.map((q, idx) => {
            const grade = result.questionResults[q.id];
            const ans = result.userAnswers[q.id];

            return (
              <div
                key={q.id}
                className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-xs space-y-4"
              >
                <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-1 rounded bg-slate-900 text-white font-mono text-xs font-bold">
                      Câu {idx + 1} ({q.originalNumber})
                    </span>
                    <span className="text-xs text-slate-500 font-mono">
                      {q.sourceSetLabel} · Trang {q.pageNumber}
                    </span>
                  </div>

                  <span
                    className={`px-3 py-1 rounded-lg text-xs font-extrabold ${
                      grade?.feedbackStatus === 'correct'
                        ? 'bg-emerald-100 text-emerald-900'
                        : grade?.feedbackStatus === 'partial'
                        ? 'bg-amber-100 text-amber-900'
                        : grade?.feedbackStatus === 'needs_review'
                        ? 'bg-slate-200 text-slate-800'
                        : 'bg-rose-100 text-rose-900'
                    }`}
                  >
                    {grade?.feedbackMessage} (+{grade?.earnedPoints}/{grade?.maxPoints}đ)
                  </span>
                </div>

                <div className="text-sm sm:text-base font-bold text-slate-900 whitespace-pre-line">
                  {q.stem}
                </div>

                {q.image && <OriginalFigureCard image={q.image} compact />}

                {q.type === 'mcq' && q.options && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs sm:text-sm">
                    {q.options.map((opt) => {
                      const isCorrect = opt.key === q.correctOption;
                      const isUser = ans?.mcqChoice === opt.key;
                      return (
                        <div
                          key={opt.key}
                          className={`p-3 rounded-xl border font-medium ${
                            isCorrect
                              ? 'bg-emerald-50 border-emerald-500 text-emerald-950 font-bold'
                              : isUser
                              ? 'bg-rose-50 border-rose-400 text-rose-900'
                              : 'bg-slate-50 border-slate-200 text-slate-700'
                          }`}
                        >
                          <span className="font-mono font-extrabold mr-1.5">{opt.key}.</span>
                          {opt.text}
                          {isCorrect && <span className="ml-2 text-emerald-700">(Đáp án đúng)</span>}
                          {isUser && !isCorrect && (
                            <span className="ml-2 text-rose-700">(Bạn đã chọn)</span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}

                {q.type === 'true_false' && q.statements && (
                  <div className="space-y-2 text-xs sm:text-sm">
                    {q.statements.map((st) => {
                      const userVal = ans?.tfChoices?.[st.key];
                      const isCorrect = userVal === st.isTrue;
                      return (
                        <div
                          key={st.key}
                          className={`p-3 rounded-xl border space-y-1 ${
                            isCorrect
                              ? 'bg-emerald-50/70 border-emerald-300'
                              : 'bg-rose-50/70 border-rose-300'
                          }`}
                        >
                          <div className="flex flex-wrap items-center justify-between gap-2 font-medium text-slate-900">
                            <span>
                              <strong className="font-mono">{st.key})</strong> {st.text}
                            </span>
                            <span className="font-mono text-xs font-bold">
                              Bạn chọn:{' '}
                              {typeof userVal === 'boolean'
                                ? userVal
                                  ? 'ĐÚNG'
                                  : 'SAI'
                                : 'Chưa chọn'}{' '}
                              | Đáp án chuẩn: <strong>{st.isTrue ? 'ĐÚNG' : 'SAI'}</strong>
                            </span>
                          </div>
                          <p className="text-xs text-slate-700">{st.explanation}</p>
                        </div>
                      );
                    })}
                  </div>
                )}

                {q.type === 'short_answer' && q.shortAnswer && (
                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm space-y-1">
                    <div>
                      Câu trả lời của bạn:{' '}
                      <strong className="font-mono text-slate-900">
                        {ans?.shortText || '(Chưa nhập)'}
                      </strong>
                    </div>
                    <div>
                      Đáp án tham chiếu chuẩn:{' '}
                      <strong className="font-mono text-emerald-800">
                        {q.shortAnswer.primaryAnswer} {q.shortAnswer.unit || ''}
                      </strong>
                    </div>
                    <div className="text-slate-600">
                      <strong>Biểu điểm / Tiêu chí:</strong> {q.shortAnswer.rubric}
                    </div>
                  </div>
                )}

                <div className="p-4 rounded-xl bg-teal-50/70 border border-teal-200 text-xs sm:text-sm text-slate-800 space-y-1.5">
                  <div className="font-bold text-teal-950 flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-teal-600" />
                    <span>Giải thích chi tiết:</span>
                  </div>
                  <p className="whitespace-pre-line">{q.explanation}</p>
                  <div className="pt-1">
                    <button
                      type="button"
                      onClick={() => onOpenTheoryLesson(q.lessonId)}
                      className="text-xs font-bold text-teal-800 underline hover:text-teal-600 cursor-pointer"
                    >
                      Xem lại lý thuyết: {LESSON_TITLES[q.lessonId]} →
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};
