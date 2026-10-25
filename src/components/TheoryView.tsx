import React, { useState } from 'react';
import {
  AlertCircle,
  ArrowRight,
  BookMarked,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Eye,
  EyeOff,
  HelpCircle,
  Layers,
  RotateCcw,
  Sparkles,
  Tag,
} from 'lucide-react';
import { Flashcard, LessonId, TheoryLesson, UserProgress } from '../types/biology';
import { OriginalFigureCard } from './ImageLightbox';
import { playSound } from '../utils/sound';

interface TheoryViewProps {
  lessons: TheoryLesson[];
  flashcards: Flashcard[];
  selectedLessonId: LessonId;
  onSelectLesson: (id: LessonId) => void;
  progress: UserProgress;
  onToggleLessonCompleted: (id: LessonId) => void;
  onToggleLessonReview: (id: LessonId) => void;
  onMarkFlashcard: (cardId: string, status: 'remembered' | 'review') => void;
  onPracticeLesson: (id: LessonId) => void;
}

export const TheoryView: React.FC<TheoryViewProps> = ({
  lessons,
  flashcards,
  selectedLessonId,
  onSelectLesson,
  progress,
  onToggleLessonCompleted,
  onToggleLessonReview,
  onMarkFlashcard,
  onPracticeLesson,
}) => {
  const [subTab, setSubTab] = useState<'theory' | 'flashcards'>('theory');
  const [focusMode, setFocusMode] = useState(false);
  const [collapsedSections, setCollapsedSections] = useState<Record<string, boolean>>({});
  const [revealedSelfCheck, setRevealedSelfCheck] = useState<Record<string, boolean>>({});

  // Flashcard state
  const [fcLessonFilter, setFcLessonFilter] = useState<LessonId | 'all'>('all');
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  const activeLesson = lessons.find((l) => l.id === selectedLessonId) || lessons[0];
  const isCompleted = progress.completedLessons.includes(activeLesson.id);
  const isReview = progress.reviewLessons.includes(activeLesson.id);

  const filteredFlashcards =
    fcLessonFilter === 'all'
      ? flashcards
      : flashcards.filter((f) => f.lessonId === fcLessonFilter);

  const activeFlashcard =
    filteredFlashcards[currentCardIndex] || filteredFlashcards[0] || flashcards[0];

  const toggleSection = (secId: string) => {
    setCollapsedSections((prev) => ({ ...prev, [secId]: !prev[secId] }));
  };

  const expandAll = () => setCollapsedSections({});
  const collapseAll = () => {
    const map: Record<string, boolean> = {};
    activeLesson.sections.forEach((s) => {
      map[s.id] = true;
    });
    setCollapsedSections(map);
  };

  return (
    <div className="space-y-6 pb-14">
      {/* Top Bar: Switch between Theory Reading & Biology Flashcards */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setSubTab('theory')}
            className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-colors cursor-pointer ${
              subTab === 'theory'
                ? 'bg-teal-600 text-white shadow-xs'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <BookMarked className="w-4 h-4" />
            <span>Hệ thống bài học lý thuyết ({lessons.length})</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setSubTab('flashcards');
              setCurrentCardIndex(0);
              setIsFlipped(false);
            }}
            className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-colors cursor-pointer ${
              subTab === 'flashcards'
                ? 'bg-teal-600 text-white shadow-xs'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Flashcard Sinh học ({flashcards.length} thẻ)</span>
          </button>
        </div>

        {subTab === 'theory' && (
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setFocusMode((f) => !f)}
              className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border transition-colors cursor-pointer ${
                focusMode
                  ? 'bg-slate-900 text-white border-slate-900'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
              }`}
            >
              {focusMode ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              <span>{focusMode ? 'Thoát chế độ đọc tập trung' : 'Chế độ đọc tập trung'}</span>
            </button>

            <button
              type="button"
              onClick={expandAll}
              className="px-3 py-2 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 cursor-pointer"
            >
              Mở rộng tất cả
            </button>
            <button
              type="button"
              onClick={collapseAll}
              className="px-3 py-2 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 cursor-pointer"
            >
              Thu gọn tất cả
            </button>
          </div>
        )}
      </div>

      {subTab === 'theory' ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Sidebar Lesson Catalog (Hidden in Focus Mode) */}
          {!focusMode && (
            <aside className="lg:col-span-4 space-y-3 lg:sticky lg:top-20">
              <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs space-y-3">
                <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 px-1">
                  Danh mục bài học trích xuất từ tài liệu
                </h2>

                <div className="space-y-2">
                  {lessons.map((lesson) => {
                    const active = lesson.id === activeLesson.id;
                    const done = progress.completedLessons.includes(lesson.id);
                    const rev = progress.reviewLessons.includes(lesson.id);
                    return (
                      <button
                        key={lesson.id}
                        type="button"
                        onClick={() => {
                          onSelectLesson(lesson.id);
                          setCollapsedSections({});
                        }}
                        className={`w-full text-left p-3.5 rounded-xl border transition-all cursor-pointer ${
                          active
                            ? 'bg-teal-50/90 border-teal-600 shadow-xs'
                            : 'bg-white border-slate-200 hover:border-teal-400 hover:bg-slate-50'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-2 mb-1">
                          <span
                            className={`text-[11px] font-mono font-bold px-2 py-0.5 rounded ${
                              lesson.isDirectFromPdf1Heading
                                ? 'bg-teal-700 text-white'
                                : 'bg-slate-200 text-slate-800'
                            }`}
                          >
                            {lesson.code}
                          </span>
                          <div className="flex items-center gap-1">
                            {done && (
                              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800">
                                ĐÃ HỌC XONG
                              </span>
                            )}
                            {rev && (
                              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-100 text-amber-800">
                                CẦN ÔN LẠI
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="text-sm font-bold text-slate-900 leading-snug">
                          {lesson.title}
                        </div>
                        <div className="text-xs text-slate-500 mt-1 line-clamp-2">
                          {lesson.subtitle}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </aside>
          )}

          {/* Main Lesson Content Area */}
          <div className={focusMode ? 'lg:col-span-12 max-w-4xl mx-auto w-full space-y-6' : 'lg:col-span-8 space-y-6'}>
            {/* Lesson Header Card */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-md bg-teal-100 text-teal-900">
                  {activeLesson.code} · {activeLesson.sourceInfo}
                </span>

                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      onToggleLessonCompleted(activeLesson.id);
                      playSound('complete', progress.soundEnabled);
                    }}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold border transition-colors cursor-pointer ${
                      isCompleted
                        ? 'bg-emerald-600 text-white border-emerald-600'
                        : 'bg-white text-slate-700 border-slate-300 hover:bg-emerald-50 hover:border-emerald-400'
                    }`}
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>{isCompleted ? 'ĐÃ HỌC XONG' : 'Đánh dấu: ĐÃ HỌC XONG'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      onToggleLessonReview(activeLesson.id);
                      playSound('click', progress.soundEnabled);
                    }}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold border transition-colors cursor-pointer ${
                      isReview
                        ? 'bg-amber-500 text-slate-950 border-amber-500'
                        : 'bg-white text-slate-700 border-slate-300 hover:bg-amber-50 hover:border-amber-400'
                    }`}
                  >
                    <AlertCircle className="w-3.5 h-3.5" />
                    <span>{isReview ? 'CẦN ÔN LẠI' : 'Đánh dấu: CẦN ÔN LẠI'}</span>
                  </button>
                </div>
              </div>

              <div>
                <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900">
                  {activeLesson.code}: {activeLesson.title}
                </h1>
                <p className="text-sm text-slate-600 mt-1">{activeLesson.subtitle}</p>
              </div>

              {/* Executive Summary */}
              <div className="rounded-xl bg-teal-50/70 border border-teal-200 p-4 space-y-1.5">
                <div className="text-xs font-bold uppercase tracking-wider text-teal-800 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-teal-600" />
                  <span>Tóm tắt nội dung trọng tâm</span>
                </div>
                <p className="text-sm text-slate-800 leading-relaxed">{activeLesson.summary}</p>
              </div>

              {/* Highlighted Keywords */}
              <div className="space-y-2">
                <div className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                  <Tag className="w-3.5 h-3.5 text-teal-600" />
                  <span>Từ khóa sinh học nổi bật</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {activeLesson.keywords.map((kw, i) => (
                    <span
                      key={i}
                      className="px-2.5 py-1 rounded-md bg-slate-100 border border-slate-200 text-xs font-medium text-slate-800"
                    >
                      {kw}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
                <span className="text-xs text-slate-500">
                  Học xong lý thuyết? Áp dụng ngay vào bộ câu hỏi của bài học này:
                </span>
                <button
                  type="button"
                  onClick={() => onPracticeLesson(activeLesson.id)}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs sm:text-sm font-bold shadow-xs cursor-pointer"
                >
                  <span>Luyện bài tập {activeLesson.code} ngay</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Detailed Sections */}
            <div className="space-y-4">
              {activeLesson.sections.map((section) => {
                const isCollapsed = Boolean(collapsedSections[section.id]);
                return (
                  <article
                    key={section.id}
                    className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden"
                  >
                    <button
                      type="button"
                      onClick={() => toggleSection(section.id)}
                      aria-expanded={!isCollapsed}
                      className="w-full px-6 py-4 bg-slate-50 hover:bg-slate-100/80 border-b border-slate-200 flex items-center justify-between gap-4 text-left cursor-pointer"
                    >
                      <h2 className="text-base sm:text-lg font-extrabold text-slate-900">
                        {section.title}
                      </h2>
                      <span className="p-1 rounded-lg bg-white border border-slate-200 text-slate-600">
                        {isCollapsed ? (
                          <ChevronDown className="w-4 h-4" />
                        ) : (
                          <ChevronUp className="w-4 h-4" />
                        )}
                      </span>
                    </button>

                    {!isCollapsed && (
                      <div className="p-6 space-y-6">
                        {/* Core Content Paragraphs */}
                        <div className="space-y-2.5 text-sm sm:text-base text-slate-800 leading-relaxed">
                          {section.content.map((para, idx) => (
                            <p key={idx} className=" whitespace-pre-line">
                              {para}
                            </p>
                          ))}
                        </div>

                        {/* Original PDF Figures */}
                        {section.figures && section.figures.length > 0 && (
                          <div className="space-y-4">
                            <h3 className="text-xs font-bold uppercase tracking-wider text-teal-800">
                              Sơ đồ & Hình minh họa gốc từ tài liệu PDF
                            </h3>
                            <div className="grid grid-cols-1 gap-4">
                              {section.figures.map((fig) => (
                                <OriginalFigureCard key={fig.id} image={fig} />
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Step-by-step Biological Process */}
                        {section.processSteps && section.processSteps.length > 0 && (
                          <div className="space-y-3">
                            <h3 className="text-xs font-bold uppercase tracking-wider text-blue-800">
                              Quy trình / Cơ chế sinh học theo trình tự các bước
                            </h3>
                            <div className="grid grid-cols-1 gap-3">
                              {section.processSteps.map((step) => (
                                <div
                                  key={step.stepNumber}
                                  className="flex items-start gap-3.5 p-4 rounded-xl bg-blue-50/50 border border-blue-200/80"
                                >
                                  <div className="w-7 h-7 rounded-lg bg-blue-600 text-white font-mono font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                                    B{step.stepNumber}
                                  </div>
                                  <div className="space-y-1">
                                    <div className="text-sm font-bold text-slate-900">
                                      {step.title}
                                    </div>
                                    <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                                      {step.description}
                                    </p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Key Definitions & Terminology */}
                        {section.keyTerms && section.keyTerms.length > 0 && (
                          <div className="space-y-3">
                            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-600">
                              Định nghĩa & Thuật ngữ quan trọng
                            </h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                              {section.keyTerms.map((kt, idx) => (
                                <div
                                  key={idx}
                                  className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1"
                                >
                                  <div className="text-xs sm:text-sm font-bold text-teal-900">
                                    {kt.term}
                                  </div>
                                  <p className="text-xs text-slate-700 leading-relaxed">
                                    {kt.definition}
                                  </p>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Comparison Table */}
                        {section.comparisonTable && (
                          <div className="space-y-2.5">
                            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-600">
                              {section.comparisonTable.title}
                            </h3>
                            <div className="overflow-x-auto rounded-xl border border-slate-200">
                              <table className="w-full text-left border-collapse text-xs sm:text-sm">
                                <thead>
                                  <tr className="bg-slate-800 text-white">
                                    {section.comparisonTable.headers.map((h, i) => (
                                      <th key={i} className="p-3 font-bold border-r border-slate-700 last:border-r-0">
                                        {h}
                                      </th>
                                    ))}
                                  </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-200">
                                  {section.comparisonTable.rows.map((row, rIdx) => (
                                    <tr key={rIdx} className="odd:bg-white even:bg-slate-50/70">
                                      {row.map((cell, cIdx) => (
                                        <td
                                          key={cIdx}
                                          className={`p-3 border-r border-slate-200 last:border-r-0 ${
                                            cIdx === 0 ? 'font-bold text-slate-900' : 'text-slate-700'
                                          }`}
                                        >
                                          {cell}
                                        </td>
                                      ))}
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          </div>
                        )}

                        {/* Common Exam Misconceptions */}
                        {section.misconceptions && section.misconceptions.length > 0 && (
                          <div className="space-y-3">
                            <h3 className="text-xs font-bold uppercase tracking-wider text-rose-700 flex items-center gap-1.5">
                              <AlertCircle className="w-4 h-4" />
                              <span>Điểm dễ nhầm lẫn thường gặp trong đề kiểm tra</span>
                            </h3>
                            <div className="space-y-2.5">
                              {section.misconceptions.map((mc, idx) => (
                                <div
                                  key={idx}
                                  className="p-4 rounded-xl bg-amber-50/70 border border-amber-200 space-y-1.5 text-xs sm:text-sm"
                                >
                                  <div className="text-rose-800 font-semibold">
                                    ❌ Nhận định dễ nhầm: “{mc.myth}”
                                  </div>
                                  <div className="text-emerald-900 font-medium">
                                    ✅ Kiến thức chuẩn: {mc.truth}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </article>
                );
              })}
            </div>

            {/* Quick Self-Check Questions at End of Lesson */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between gap-2">
                <h2 className="text-base sm:text-lg font-extrabold text-slate-900 flex items-center gap-2">
                  <HelpCircle className="w-5 h-5 text-teal-600" />
                  <span>Câu hỏi tự kiểm tra nhanh cuối bài ({activeLesson.selfCheck.length} câu)</span>
                </h2>
                <span className="text-xs text-slate-500">Nhấn vào từng câu để đối chiếu đáp án</span>
              </div>

              <div className="space-y-3">
                {activeLesson.selfCheck.map((item, idx) => {
                  const isShown = Boolean(revealedSelfCheck[item.id]);
                  return (
                    <div
                      key={item.id}
                      className="rounded-xl border border-slate-200 bg-slate-50/70 p-4 space-y-2"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="text-sm font-bold text-slate-900">
                          Câu tự kiểm tra {idx + 1}: {item.question}
                        </div>
                        <button
                          type="button"
                          onClick={() =>
                            setRevealedSelfCheck((prev) => ({
                              ...prev,
                              [item.id]: !prev[item.id],
                            }))
                          }
                          className="px-3 py-1 rounded-lg bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold shrink-0 cursor-pointer"
                        >
                          {isShown ? 'Ẩn đáp án' : 'Xem đáp án'}
                        </button>
                      </div>
                      {isShown && (
                        <div className="pt-2 border-t border-slate-200 text-xs sm:text-sm text-teal-950 bg-teal-50/80 p-3 rounded-lg font-medium">
                          <strong>Đáp án chuẩn:</strong> {item.answer}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Flashcard Sinh học Sub-View (Section 4.4) */
        <div className="max-w-3xl mx-auto space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="text-lg font-extrabold text-slate-900">
                  Flashcard Sinh học 12 – Ghi nhớ thuật ngữ, công thức & cơ chế
                </h2>
                <p className="text-xs text-slate-500">
                  Nhấn vào thẻ để lật mặt trước / mặt sau, sau đó đánh dấu mức độ ghi nhớ của bạn
                </p>
              </div>
              <div className="text-xs font-mono bg-slate-100 px-3 py-1.5 rounded-lg text-slate-700">
                Đã nhớ: <strong className="text-emerald-700">{progress.rememberedFlashcards.length}</strong> · Cần xem lại:{' '}
                <strong className="text-amber-700">{progress.reviewFlashcards.length}</strong>
              </div>
            </div>

            <div className="flex flex-wrap gap-1.5">
              <button
                type="button"
                onClick={() => {
                  setFcLessonFilter('all');
                  setCurrentCardIndex(0);
                  setIsFlipped(false);
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer ${
                  fcLessonFilter === 'all'
                    ? 'bg-slate-900 text-white'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                Tất cả ({flashcards.length})
              </button>
              {lessons.map((l) => (
                <button
                  key={l.id}
                  type="button"
                  onClick={() => {
                    setFcLessonFilter(l.id);
                    setCurrentCardIndex(0);
                    setIsFlipped(false);
                  }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer ${
                    fcLessonFilter === l.id
                      ? 'bg-teal-600 text-white'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {l.code}
                </button>
              ))}
            </div>
          </div>

          {activeFlashcard && (
            <div className="space-y-4">
              <div
                onClick={() => {
                  setIsFlipped((f) => !f);
                  playSound('click', progress.soundEnabled);
                }}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    setIsFlipped((f) => !f);
                  }
                }}
                className={`min-h-72 rounded-2xl p-8 border-2 shadow-sm flex flex-col justify-between transition-all cursor-pointer select-none ${
                  isFlipped
                    ? 'bg-teal-950 text-white border-teal-500'
                    : 'bg-white text-slate-900 border-slate-300 hover:border-teal-500'
                }`}
              >
                <div className="flex items-center justify-between text-xs font-mono">
                  <span
                    className={`px-2.5 py-1 rounded ${
                      isFlipped ? 'bg-teal-800 text-teal-200' : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    Thẻ {currentCardIndex + 1}/{filteredFlashcards.length} ·{' '}
                    {isFlipped ? 'MẶT SAU (ĐỊNH NGHĨA / GIẢI THÍCH)' : 'MẶT TRƯỚC (THUẬT NGỮ / CÂU HỎI)'}
                  </span>
                  <span className={isFlipped ? 'text-teal-300' : 'text-slate-400'}>
                    {activeFlashcard.sourceRef}
                  </span>
                </div>

                <div className="my-8 text-center">
                  <p
                    className={`leading-relaxed ${
                      isFlipped
                        ? 'text-base sm:text-lg font-medium text-teal-50'
                        : 'text-lg sm:text-2xl font-extrabold text-slate-900'
                    }`}
                  >
                    {isFlipped ? activeFlashcard.back : activeFlashcard.front}
                  </p>
                </div>

                <div className="text-center text-xs font-semibold opacity-75 flex items-center justify-center gap-1.5">
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Nhấn vào thẻ để lật {isFlipped ? 'mặt trước' : 'xem đáp án mặt sau'}</span>
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setIsFlipped(false);
                      setCurrentCardIndex((i) =>
                        i > 0 ? i - 1 : filteredFlashcards.length - 1
                      );
                    }}
                    className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold cursor-pointer"
                  >
                    ← Thẻ trước
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIsFlipped(false);
                      setCurrentCardIndex((i) =>
                        i < filteredFlashcards.length - 1 ? i + 1 : 0
                      );
                    }}
                    className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold cursor-pointer"
                  >
                    Thẻ tiếp theo →
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      onMarkFlashcard(activeFlashcard.id, 'review');
                      playSound('click', progress.soundEnabled);
                    }}
                    className={`px-4 py-2 rounded-xl text-xs font-bold border cursor-pointer ${
                      progress.reviewFlashcards.includes(activeFlashcard.id)
                        ? 'bg-amber-500 text-slate-950 border-amber-500'
                        : 'bg-amber-50 text-amber-900 border-amber-300 hover:bg-amber-100'
                    }`}
                  >
                    CẦN XEM LẠI
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      onMarkFlashcard(activeFlashcard.id, 'remembered');
                      playSound('correct', progress.soundEnabled);
                    }}
                    className={`px-4 py-2 rounded-xl text-xs font-bold border cursor-pointer ${
                      progress.rememberedFlashcards.includes(activeFlashcard.id)
                        ? 'bg-emerald-600 text-white border-emerald-600'
                        : 'bg-emerald-50 text-emerald-900 border-emerald-300 hover:bg-emerald-100'
                    }`}
                  >
                    ĐÃ NHỚ
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
