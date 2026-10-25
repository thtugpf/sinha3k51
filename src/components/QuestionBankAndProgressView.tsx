import React, { useState } from 'react';
import {
  AlertTriangle,
  Bookmark,
  CheckCircle2,
  Eye,
  History,
  Play,
  RotateCcw,
  Search,
  Trash2,
} from 'lucide-react';
import {
  ExamResultSummary,
  ExamSetId,
  LessonId,
  Question,
  QuestionType,
  UserProgress,
} from '../types/biology';
import { EXAM_SETS_METADATA } from '../data/auditData';
import { LESSON_TITLES } from '../utils/scoring';
import { OriginalFigureCard } from './ImageLightbox';

interface QuestionBankAndProgressViewProps {
  questions: Question[];
  progress: UserProgress;
  onToggleBookmark: (qId: string) => void;
  onOpenExamResult: (summary: ExamResultSummary) => void;
  onPracticeQuestionSubset: (qs: Question[], title: string) => void;
  onResetProgress: () => void;
}

export const QuestionBankAndProgressView: React.FC<QuestionBankAndProgressViewProps> = ({
  questions,
  progress,
  onToggleBookmark,
  onOpenExamResult,
  onPracticeQuestionSubset,
  onResetProgress,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [setFilter, setSetFilter] = useState<ExamSetId | 'all'>('all');
  const [lessonFilter, setLessonFilter] = useState<LessonId | 'all'>('all');
  const [typeFilter, setTypeFilter] = useState<QuestionType | 'all'>('all');
  const [statusFilter, setStatusFilter] = useState<
    'all' | 'attempted' | 'correct' | 'wrong' | 'bookmarked'
  >('all');
  const [expandedQuestionId, setExpandedQuestionId] = useState<string | null>(null);
  const [showResetModal, setShowResetModal] = useState(false);

  const filteredQuestions = questions.filter((q) => {
    if (setFilter !== 'all' && q.sourceSetId !== setFilter) return false;
    if (lessonFilter !== 'all' && q.lessonId !== lessonFilter) return false;
    if (typeFilter !== 'all' && q.type !== typeFilter) return false;
    if (statusFilter === 'attempted' && !progress.attemptedQuestionIds.includes(q.id))
      return false;
    if (statusFilter === 'correct' && !progress.correctQuestionIds.includes(q.id)) return false;
    if (statusFilter === 'wrong' && !progress.wrongQuestionIds.includes(q.id)) return false;
    if (statusFilter === 'bookmarked' && !progress.bookmarkedQuestions.includes(q.id))
      return false;

    if (searchQuery.trim()) {
      const kw = searchQuery.trim().toLowerCase();
      const inStem = q.stem.toLowerCase().includes(kw);
      const inTopic = q.topic.toLowerCase().includes(kw);
      const inNum = q.originalNumber.toLowerCase().includes(kw);
      return inStem || inTopic || inNum;
    }
    return true;
  });

  return (
    <div className="space-y-8 pb-16">
      {/* Personal Progress Overview & Reset Control */}
      <section className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900">
              📊 TIẾN ĐỘ CỦA TÔI & NGÂN HÀNG 253 CÂU HỎI
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              Quản lý toàn bộ tiến độ học lý thuyết, lịch sử làm đề, câu trả lời sai và tra cứu ngân hàng câu hỏi gốc
            </p>
          </div>

          <button
            type="button"
            onClick={() => setShowResetModal(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-bold cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Đặt lại tiến độ học tập</span>
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
            <span className="text-xs text-slate-500 block">Bài lý thuyết đã học</span>
            <strong className="text-xl font-mono font-extrabold text-teal-700">
              {progress.completedLessons.length}/5
            </strong>
          </div>
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
            <span className="text-xs text-slate-500 block">Flashcard đã nhớ</span>
            <strong className="text-xl font-mono font-extrabold text-blue-700">
              {progress.rememberedFlashcards.length}/14
            </strong>
          </div>
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
            <span className="text-xs text-slate-500 block">Câu hỏi đã làm</span>
            <strong className="text-xl font-mono font-extrabold text-slate-900">
              {progress.attemptedQuestionIds.length}/{questions.length}
            </strong>
          </div>
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
            <span className="text-xs text-slate-500 block">Câu trả lời đúng</span>
            <strong className="text-xl font-mono font-extrabold text-emerald-700">
              {progress.correctQuestionIds.length}
            </strong>
          </div>
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
            <span className="text-xs text-slate-500 block">Câu làm sai cần ôn</span>
            <strong className="text-xl font-mono font-extrabold text-rose-600">
              {progress.wrongQuestionIds.length}
            </strong>
          </div>
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
            <span className="text-xs text-slate-500 block">Câu đã đánh dấu</span>
            <strong className="text-xl font-mono font-extrabold text-amber-600">
              {progress.bookmarkedQuestions.length}
            </strong>
          </div>
        </div>

        {/* Exam History List */}
        {progress.examHistory.length > 0 && (
          <div className="pt-2 space-y-2.5">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
              <History className="w-3.5 h-3.5 text-teal-600" />
              <span>Lịch sử các lượt nộp bài gần đây ({progress.examHistory.length})</span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
              {progress.examHistory.slice(0, 6).map((item) => (
                <div
                  key={item.attemptId}
                  className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-3"
                >
                  <div className="min-w-0">
                    <div className="text-xs sm:text-sm font-bold text-slate-900 truncate">
                      {item.title}
                    </div>
                    <div className="text-[11px] font-mono text-slate-500">
                      Điểm: <strong className="text-teal-700">{item.scaledScore10}/10</strong> (
                      {item.totalEarnedPoints}/{item.totalMaxPoints}đ) · Đúng{' '}
                      {item.correctQuestions}/{item.totalQuestions} câu
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => onOpenExamResult(item)}
                    className="px-3 py-1.5 rounded-lg bg-white border border-slate-300 hover:bg-teal-50 text-xs font-bold text-teal-800 shrink-0 cursor-pointer"
                  >
                    Xem lại
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* Searchable 253 Question Bank */}
      <section className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-extrabold text-slate-900">
              Tra cứu Ngân hàng 253 câu hỏi chính thức
            </h2>
            <p className="text-xs text-slate-500">
              Lọc theo đề nguồn, bài học, dạng câu hỏi hoặc từ khóa nội dung
            </p>
          </div>

          {filteredQuestions.length > 0 && (
            <button
              type="button"
              onClick={() =>
                onPracticeQuestionSubset(
                  filteredQuestions,
                  `Luyện tập danh sách đang lọc (${filteredQuestions.length} câu)`
                )
              }
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-extrabold cursor-pointer"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Luyện ngay {filteredQuestions.length} câu đang lọc</span>
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          <div className="relative lg:col-span-2">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm theo từ khóa (VD: Okazaki, Operon Lac, 3’AGCT...)"
              aria-label="Tìm kiếm câu hỏi trong ngân hàng"
              className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-300 text-xs sm:text-sm"
            />
          </div>

          <select
            aria-label="Lọc theo đề nguồn"
            value={setFilter}
            onChange={(e) => setSetFilter(e.target.value as ExamSetId | 'all')}
            className="rounded-xl border border-slate-300 px-3 py-2 text-xs sm:text-sm bg-white"
          >
            <option value="all">Tất cả 7 bộ đề nguồn</option>
            {EXAM_SETS_METADATA.map((s) => (
              <option key={s.id} value={s.id}>
                {s.title}
              </option>
            ))}
          </select>

          <select
            aria-label="Lọc theo dạng câu hỏi"
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value as QuestionType | 'all')}
            className="rounded-xl border border-slate-300 px-3 py-2 text-xs sm:text-sm bg-white"
          >
            <option value="all">Tất cả dạng câu hỏi</option>
            <option value="mcq">Trắc nghiệm 4 lựa chọn (166)</option>
            <option value="true_false">Đúng / Sai a, b, c, d (41)</option>
            <option value="short_answer">Trả lời ngắn (46)</option>
          </select>

          <select
            aria-label="Lọc theo trạng thái làm bài"
            value={statusFilter}
            onChange={(e) =>
              setStatusFilter(
                e.target.value as 'all' | 'attempted' | 'correct' | 'wrong' | 'bookmarked'
              )
            }
            className="rounded-xl border border-slate-300 px-3 py-2 text-xs sm:text-sm bg-white"
          >
            <option value="all">Mọi trạng thái ({questions.length})</option>
            <option value="attempted">Đã làm ({progress.attemptedQuestionIds.length})</option>
            <option value="correct">Đã làm đúng ({progress.correctQuestionIds.length})</option>
            <option value="wrong">Làm sai ({progress.wrongQuestionIds.length})</option>
            <option value="bookmarked">Đã đánh dấu ({progress.bookmarkedQuestions.length})</option>
          </select>
        </div>

        {/* Question List */}
        <div className="space-y-3 pt-2">
          {filteredQuestions.slice(0, 60).map((q) => {
            const isExpanded = expandedQuestionId === q.id;
            const isBookmarked = progress.bookmarkedQuestions.includes(q.id);
            const isWrong = progress.wrongQuestionIds.includes(q.id);
            const isCorrect = progress.correctQuestionIds.includes(q.id);

            return (
              <div
                key={q.id}
                className="rounded-xl border border-slate-200 bg-slate-50/50 p-4 space-y-3"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded bg-slate-900 text-white font-mono text-xs font-bold">
                      {q.sourceSetLabel} · {q.originalNumber}
                    </span>
                    <span className="px-2 py-0.5 rounded bg-teal-50 text-teal-800 border border-teal-200 text-[11px] font-semibold">
                      {q.type === 'mcq'
                        ? '4 lựa chọn'
                        : q.type === 'true_false'
                        ? 'Đúng/Sai a-b-c-d'
                        : 'Trả lời ngắn'}
                    </span>
                    <span className="text-xs text-slate-500 font-mono">
                      Trang {q.pageNumber}
                    </span>
                    {isCorrect && (
                      <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[11px] font-bold">
                        ✓ Đã làm đúng
                      </span>
                    )}
                    {isWrong && (
                      <span className="px-2 py-0.5 rounded bg-rose-100 text-rose-800 text-[11px] font-bold">
                        ✗ Cần ôn lại
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => onToggleBookmark(q.id)}
                      className={`p-1.5 rounded-lg border text-xs cursor-pointer ${
                        isBookmarked
                          ? 'bg-amber-100 border-amber-400 text-amber-900'
                          : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-100'
                      }`}
                      aria-label={`Đánh dấu ${q.originalNumber}`}
                    >
                      <Bookmark className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setExpandedQuestionId(isExpanded ? null : q.id)}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white border border-slate-300 hover:bg-slate-100 text-xs font-bold text-slate-700 cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>{isExpanded ? 'Thu gọn' : 'Xem đáp án'}</span>
                    </button>
                  </div>
                </div>

                <div className="text-sm font-semibold text-slate-900 whitespace-pre-line">
                  {q.stem}
                </div>

                {isExpanded && (
                  <div className="pt-3 border-t border-slate-200 space-y-3 text-xs sm:text-sm">
                    {q.image && <OriginalFigureCard image={q.image} compact />}

                    {q.type === 'mcq' && q.options && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {q.options.map((opt) => (
                          <div
                            key={opt.key}
                            className={`p-2.5 rounded-lg border ${
                              opt.key === q.correctOption
                                ? 'bg-emerald-50 border-emerald-500 font-bold text-emerald-950'
                                : 'bg-white border-slate-200 text-slate-700'
                            }`}
                          >
                            <span className="font-mono mr-1.5">{opt.key}.</span>
                            {opt.text}
                          </div>
                        ))}
                      </div>
                    )}

                    {q.type === 'true_false' && q.statements && (
                      <div className="space-y-1.5">
                        {q.statements.map((st) => (
                          <div key={st.key} className="p-2.5 rounded-lg bg-white border border-slate-200">
                            <strong>
                              {st.key}) [{st.isTrue ? 'ĐÚNG' : 'SAI'}]:
                            </strong>{' '}
                            {st.text}
                            <div className="text-xs text-slate-600 mt-0.5">→ {st.explanation}</div>
                          </div>
                        ))}
                      </div>
                    )}

                    {q.type === 'short_answer' && q.shortAnswer && (
                      <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-950">
                        <strong>Đáp án chuẩn:</strong> {q.shortAnswer.primaryAnswer}{' '}
                        {q.shortAnswer.unit || ''} — {q.shortAnswer.rubric}
                      </div>
                    )}

                    <div className="p-3 rounded-lg bg-teal-50 border border-teal-200 text-slate-800">
                      <strong>Giải thích:</strong> {q.explanation}
                    </div>
                  </div>
                )}
              </div>
            );
          })}

          {filteredQuestions.length > 60 && (
            <div className="text-center text-xs text-slate-500 py-2">
              Đang hiển thị 60/{filteredQuestions.length} câu hỏi đầu tiên. Hãy sử dụng ô tìm kiếm hoặc bộ lọc đề nguồn để xem chi tiết từng phần.
            </div>
          )}
        </div>
      </section>

      {/* Accessible Confirmation Modal for Resetting Progress */}
      {showResetModal && (
        <div
          className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="reset-modal-title"
        >
          <div className="bg-white rounded-2xl max-w-md w-full p-6 border border-slate-200 shadow-2xl space-y-4">
            <div className="flex items-center gap-3 text-rose-700">
              <AlertTriangle className="w-6 h-6 shrink-0" />
              <h2 id="reset-modal-title" className="text-base font-extrabold">
                Xác nhận đặt lại toàn bộ tiến độ học tập?
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Thao tác này sẽ xóa lịch sử làm đề, danh sách câu làm sai, đánh dấu bài học và thẻ Flashcard đã nhớ trên trình duyệt của bạn. Ngân hàng 253 câu hỏi và lý thuyết gốc vẫn được giữ nguyên.
            </p>
            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setShowResetModal(false)}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold cursor-pointer"
              >
                Hủy bỏ
              </button>
              <button
                type="button"
                onClick={() => {
                  onResetProgress();
                  setShowResetModal(false);
                }}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-extrabold cursor-pointer"
              >
                Xác nhận đặt lại
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
