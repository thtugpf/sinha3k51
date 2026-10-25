import React from 'react';
import {
  ArrowRight,
  AlertTriangle,
  Award,
  CheckCircle2,
  Database,
  Dna,
  FileCheck2,
  Layers,
  Play,
  Sparkles,
} from 'lucide-react';
import { ExamSetId, LessonId, Question, TheoryLesson, UserProgress } from '../types/biology';
import { EXAM_SETS_METADATA } from '../data/auditData';
import { LESSON_TITLES } from '../utils/scoring';
import { AppView } from './Header';

interface HomeViewProps {
  lessons: TheoryLesson[];
  questions: Question[];
  progress: UserProgress;
  onNavigate: (view: AppView) => void;
  onSelectLesson: (lessonId: LessonId) => void;
  onStartExamSet: (setId: ExamSetId, mode: 'exam_A' | 'practice_B') => void;
  onPracticeLesson: (lessonId: LessonId) => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  lessons,
  questions,
  progress,
  onNavigate,
  onSelectLesson,
  onStartExamSet,
  onPracticeLesson,
}) => {
  const totalQuestions = questions.length;
  const completedCount = progress.attemptedQuestionIds.length;
  const correctCount = progress.correctQuestionIds.length;
  const accuracyRate =
    completedCount > 0 ? Math.round((correctCount / completedCount) * 100) : 0;

  // Identify weak topics / lessons needing review
  const weakLessons: { id: LessonId; title: string; reason: string }[] = [];
  for (const lesson of lessons) {
    if (progress.reviewLessons.includes(lesson.id)) {
      weakLessons.push({
        id: lesson.id,
        title: LESSON_TITLES[lesson.id],
        reason: 'Đã đánh dấu “Cần ôn lại” trong phần Lý thuyết',
      });
      continue;
    }
    const lessonQuestions = questions.filter((q) => q.lessonId === lesson.id);
    const wrongInLesson = lessonQuestions.filter((q) =>
      progress.wrongQuestionIds.includes(q.id)
    );
    if (wrongInLesson.length > 0) {
      weakLessons.push({
        id: lesson.id,
        title: LESSON_TITLES[lesson.id],
        reason: `Có ${wrongInLesson.length} câu trả lời sai cần khắc phục`,
      });
    }
  }

  return (
    <div className="space-y-8 pb-12">
      {/* Hero Banner with DNA Mascot */}
      <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-slate-800 to-teal-950 text-white border border-slate-700/80 shadow-lg p-6 sm:p-8 lg:p-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-8 space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-teal-500/20 border border-teal-400/30 text-teal-200 text-xs font-semibold">
              <FileCheck2 className="w-4 h-4 text-teal-300" />
              <span>100% DỮ LIỆU CHÍNH THỨC TỪ 2 TÀI LIỆU PDF GỐC (32 TRANG · 253 CÂU HỎI)</span>
            </div>

            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight text-white">
              BIOLOGY MASTER 12
            </h1>

            <p className="text-base sm:text-xl font-semibold text-teal-300">
              Học chắc lý thuyết – Luyện đúng trọng tâm – Tự tin chinh phục kỳ thi
            </p>

            <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-2xl">
              Hệ thống ôn luyện Sinh học lớp 12 tích hợp trọn vẹn ngân hàng lý thuyết, sơ đồ hình
              gốc trích xuất trực tiếp từ tài liệu PDF, flashcard ghi nhớ thuật ngữ và phòng thi
              mô phỏng chuẩn cấu trúc THPT (Trắc nghiệm 4 lựa chọn · Đúng/Sai a, b, c, d · Trả lời
              ngắn).
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => {
                  if (progress.lastActiveLessonId) {
                    onSelectLesson(progress.lastActiveLessonId);
                  } else {
                    onNavigate('theory');
                  }
                }}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-extrabold text-sm sm:text-base shadow-md transition-all cursor-pointer"
              >
                <Play className="w-4 h-4 fill-current" />
                <span>TIẾP TỤC HỌC</span>
              </button>

              <button
                type="button"
                onClick={() => onNavigate('exam')}
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white border border-slate-600 font-bold text-sm sm:text-base transition-colors cursor-pointer"
              >
                <span>Làm đề ôn tập ngay</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => onNavigate('audit')}
                className="inline-flex items-center gap-2 px-4 py-3 rounded-xl bg-slate-900/70 hover:bg-slate-800 text-teal-300 border border-teal-500/30 font-semibold text-xs sm:text-sm transition-colors cursor-pointer"
              >
                <Database className="w-4 h-4" />
                <span>Kiểm kê dữ liệu & 28 hình gốc PDF</span>
              </button>
            </div>
          </div>

          {/* Animated DNA Mascot Assistant Card */}
          <div className="lg:col-span-4">
            <div className="rounded-2xl bg-slate-900/90 border border-teal-500/30 p-5 shadow-inner space-y-3">
              <div className="flex items-center gap-3.5">
                <div className="relative w-14 h-14 rounded-2xl bg-gradient-to-tr from-teal-500 to-emerald-400 flex items-center justify-center shrink-0 shadow-md">
                  <Dna className="w-8 h-8 text-slate-950 animate-spin" style={{ animationDuration: '10s' }} />
                  <span className="absolute -bottom-1 -right-1 px-1.5 py-0.5 text-[10px] font-mono font-bold bg-amber-400 text-slate-950 rounded">
                    5’→3’
                  </span>
                </div>
                <div>
                  <div className="text-xs font-mono uppercase tracking-wider text-teal-400">
                    Trợ lý DNA Helicase
                  </div>
                  <h2 className="text-base font-bold text-white">Gợi ý lộ trình hôm nay</h2>
                </div>
              </div>

              <div className="text-xs sm:text-sm text-slate-200 bg-slate-800/90 rounded-xl p-3.5 border border-slate-700 leading-relaxed">
                {completedCount === 0 ? (
                  <>
                    Chào bạn! Hãy bắt đầu với <strong>📚 HỌC LÝ THUYẾT Bài 1 (Gen và tái bản DNA)</strong>, quan sát kỹ 3 hình gốc (Hình 1.1, 1.2, 1.3), sau đó thử sức với <strong>Đề ôn tập số 1</strong> nhé!
                  </>
                ) : weakLessons.length > 0 ? (
                  <>
                    Bạn đã hoàn thành <strong>{completedCount}/{totalQuestions}</strong> câu hỏi. Hãy ưu tiên ôn lại <strong>{weakLessons[0].title}</strong> ({weakLessons[0].reason.toLowerCase()}).
                  </>
                ) : (
                  <>
                    Tuyệt vời! Bạn đã làm <strong>{completedCount}/{totalQuestions}</strong> câu với độ chính xác <strong>{accuracyRate}%</strong>. Hãy tiếp tục chinh phục các đề ôn tập còn lại!
                  </>
                )}
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="rounded-lg bg-slate-800/70 px-3 py-2 border border-slate-700/70">
                  <span className="text-slate-400 block">Flashcard đã nhớ</span>
                  <strong className="text-teal-300 font-mono text-sm">
                    {progress.rememberedFlashcards.length}/14 thẻ
                  </strong>
                </div>
                <div className="rounded-lg bg-slate-800/70 px-3 py-2 border border-slate-700/70">
                  <span className="text-slate-400 block">Đề thi đã nộp</span>
                  <strong className="text-amber-300 font-mono text-sm">
                    {progress.examHistory.length} lượt
                  </strong>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Four Featured Function Cards (Mandatory Section III) */}
      <section aria-labelledby="main-features-heading">
        <div className="flex items-center justify-between mb-4">
          <h2 id="main-features-heading" className="text-lg sm:text-xl font-bold text-slate-900">
            Bốn phân khu chức năng trọng tâm
          </h2>
          <span className="text-xs text-slate-500 font-medium">
            Chọn chế độ học tập phù hợp với mục tiêu của bạn
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <button
            type="button"
            onClick={() => onNavigate('theory')}
            className="group text-left rounded-2xl bg-white p-5 border-2 border-slate-200 hover:border-teal-600 shadow-xs hover:shadow-md transition-all flex flex-col justify-between cursor-pointer"
          >
            <div className="space-y-3">
              <div className="inline-flex items-center justify-between w-full">
                <span className="text-2xl" role="img" aria-label="Sách lý thuyết">
                  📚
                </span>
                <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded bg-teal-50 text-teal-700 border border-teal-200">
                  5 Chuyên đề + Flashcard
                </span>
              </div>
              <h3 className="text-lg font-extrabold text-slate-900 group-hover:text-teal-700 transition-colors">
                📚 HỌC LÝ THUYẾT
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Hệ thống hóa toàn bộ lý thuyết Bài 1, Bài 2 và các chuyên đề Operon Lac, Đột biến, Công nghệ DNA kèm hình gốc PDF & Flashcard.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-teal-700">
              <span>Vào học lý thuyết</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </button>

          <button
            type="button"
            onClick={() => onNavigate('practice')}
            className="group text-left rounded-2xl bg-white p-5 border-2 border-slate-200 hover:border-blue-600 shadow-xs hover:shadow-md transition-all flex flex-col justify-between cursor-pointer"
          >
            <div className="space-y-3">
              <div className="inline-flex items-center justify-between w-full">
                <span className="text-2xl" role="img" aria-label="Luyện tập">
                  🧠
                </span>
                <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
                  Phản hồi tức thì
                </span>
              </div>
              <h3 className="text-lg font-extrabold text-slate-900 group-hover:text-blue-700 transition-colors">
                🧠 LUYỆN TẬP
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Luyện từng câu theo bài học, dạng câu hỏi (4 lựa chọn, Đúng/Sai a-b-c-d, Trả lời ngắn), chấm điểm và giải thích chi tiết ngay lập tức.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-blue-700">
              <span>Bắt đầu luyện tập</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </button>

          <button
            type="button"
            onClick={() => onNavigate('exam')}
            className="group text-left rounded-2xl bg-white p-5 border-2 border-slate-200 hover:border-amber-600 shadow-xs hover:shadow-md transition-all flex flex-col justify-between cursor-pointer"
          >
            <div className="space-y-3">
              <div className="inline-flex items-center justify-between w-full">
                <span className="text-2xl" role="img" aria-label="Kiểm tra">
                  📝
                </span>
                <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-200">
                  Chế độ A & B
                </span>
              </div>
              <h3 className="text-lg font-extrabold text-slate-900 group-hover:text-amber-700 transition-colors">
                📝 KIỂM TRA
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Làm nguyên vẹn Đề số 1–5 hoặc Bộ đề Bài 1, Bài 2. Hỗ trợ Chế độ thi thật (ẩn hoàn toàn đáp án trước khi nộp) và Chế độ làm từng câu.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-amber-700">
              <span>Vào phòng kiểm tra</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </button>

          <button
            type="button"
            onClick={() => onNavigate('progress')}
            className="group text-left rounded-2xl bg-white p-5 border-2 border-slate-200 hover:border-emerald-600 shadow-xs hover:shadow-md transition-all flex flex-col justify-between cursor-pointer"
          >
            <div className="space-y-3">
              <div className="inline-flex items-center justify-between w-full">
                <span className="text-2xl" role="img" aria-label="Tiến độ của tôi">
                  📊
                </span>
                <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                  253 Câu hỏi
                </span>
              </div>
              <h3 className="text-lg font-extrabold text-slate-900 group-hover:text-emerald-700 transition-colors">
                📊 TIẾN ĐỘ CỦA TÔI
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Tra cứu toàn bộ ngân hàng 253 câu hỏi, xem lịch sử làm đề, lọc riêng các câu làm sai hoặc câu đã đánh dấu để ôn tập sâu.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-emerald-700">
              <span>Xem tiến độ & ngân hàng</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </button>
        </div>
      </section>

      {/* Dashboard Statistics & Weak Topics (Mandatory Section III) */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Tổng quan dữ liệu học tập & Tiến độ cá nhân
              </h2>
              <p className="text-xs text-slate-500">
                Tự động lưu trữ trên trình duyệt (LocalStorage) và cập nhật theo thời gian thực
              </p>
            </div>
            <button
              type="button"
              onClick={() => onNavigate('theory')}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold cursor-pointer"
            >
              <span>TIẾP TỤC HỌC</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
            <div className="rounded-xl bg-slate-50 border border-slate-200/80 p-4">
              <span className="text-xs font-medium text-slate-500 block">
                Số bài lý thuyết đã nhập
              </span>
              <div className="mt-1.5 flex items-baseline gap-1.5">
                <strong className="text-2xl font-extrabold font-mono text-slate-900">
                  {lessons.length}
                </strong>
                <span className="text-xs text-teal-700 font-semibold">chuyên đề</span>
              </div>
              <span className="mt-1 block text-[11px] text-slate-500">
                Đã hoàn thành: {progress.completedLessons.length}/{lessons.length}
              </span>
            </div>

            <div className="rounded-xl bg-slate-50 border border-slate-200/80 p-4">
              <span className="text-xs font-medium text-slate-500 block">
                Tổng số câu trong ngân hàng
              </span>
              <div className="mt-1.5 flex items-baseline gap-1.5">
                <strong className="text-2xl font-extrabold font-mono text-teal-700">
                  {totalQuestions}
                </strong>
                <span className="text-xs text-slate-600 font-semibold">câu hỏi</span>
              </div>
              <span className="mt-1 block text-[11px] text-slate-500">
                166 MCQ · 41 Đ/S · 46 TLN
              </span>
            </div>

            <div className="rounded-xl bg-slate-50 border border-slate-200/80 p-4">
              <span className="text-xs font-medium text-slate-500 block">
                Số câu đã hoàn thành
              </span>
              <div className="mt-1.5 flex items-baseline gap-1.5">
                <strong className="text-2xl font-extrabold font-mono text-blue-700">
                  {completedCount}
                </strong>
                <span className="text-xs text-slate-500 font-mono">/{totalQuestions}</span>
              </div>
              <span className="mt-1 block text-[11px] text-slate-500">
                Đạt {Math.round((completedCount / totalQuestions) * 100)}% ngân hàng
              </span>
            </div>

            <div className="rounded-xl bg-slate-50 border border-slate-200/80 p-4">
              <span className="text-xs font-medium text-slate-500 block">
                Tỷ lệ trả lời đúng
              </span>
              <div className="mt-1.5 flex items-baseline gap-1.5">
                <strong className="text-2xl font-extrabold font-mono text-emerald-700">
                  {accuracyRate}%
                </strong>
              </div>
              <span className="mt-1 block text-[11px] text-slate-500">
                Đúng {correctCount} câu · Sai {progress.wrongQuestionIds.length} câu
              </span>
            </div>
          </div>

          {/* Quick Jump to Original Exam Sets */}
          <div className="pt-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3 flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-teal-600" />
              <span>7 Bộ đề gốc nguyên bản từ 2 tài liệu PDF (Giữ nguyên thứ tự câu)</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {EXAM_SETS_METADATA.map((exam) => (
                <div
                  key={exam.id}
                  className="flex items-center justify-between gap-2 p-3 rounded-xl border border-slate-200 hover:border-teal-500/60 bg-slate-50/60 transition-colors"
                >
                  <div className="min-w-0">
                    <div className="text-xs font-bold text-slate-900 truncate">{exam.title}</div>
                    <div className="text-[11px] text-slate-500 font-mono">
                      {exam.sourceDocName} ({exam.pageRange}) · {exam.totalQuestions} câu
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      type="button"
                      onClick={() => onStartExamSet(exam.id, 'practice_B')}
                      className="px-2.5 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-bold cursor-pointer"
                      title="Làm từng câu - Biết đáp án ngay"
                    >
                      Luyện
                    </button>
                    <button
                      type="button"
                      onClick={() => onStartExamSet(exam.id, 'exam_A')}
                      className="px-2.5 py-1.5 rounded-lg bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold cursor-pointer"
                      title="Làm hết đề - Xem kết quả cuối cùng"
                    >
                      Thi thử
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Weak Topics & Needs Review Panel */}
        <div className="lg:col-span-4 bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col justify-between space-y-4">
          <div className="space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
              <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0" />
              <h2 className="text-base font-bold text-slate-900">Các chủ đề cần ôn lại</h2>
            </div>

            {weakLessons.length > 0 ? (
              <div className="space-y-2.5">
                {weakLessons.map((item) => (
                  <div
                    key={item.id}
                    className="p-3.5 rounded-xl bg-amber-50/80 border border-amber-200 space-y-2"
                  >
                    <div className="text-xs font-bold text-amber-950">{item.title}</div>
                    <p className="text-xs text-amber-800">{item.reason}</p>
                    <div className="flex items-center gap-2 pt-1">
                      <button
                        type="button"
                        onClick={() => onSelectLesson(item.id)}
                        className="px-2.5 py-1 rounded bg-white border border-amber-300 text-amber-900 text-xs font-semibold hover:bg-amber-100 cursor-pointer"
                      >
                        Xem lý thuyết
                      </button>
                      <button
                        type="button"
                        onClick={() => onPracticeLesson(item.id)}
                        className="px-2.5 py-1 rounded bg-amber-600 text-white text-xs font-semibold hover:bg-amber-700 cursor-pointer"
                      >
                        Luyện lại câu sai
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="rounded-xl bg-emerald-50/70 border border-emerald-200 p-4 space-y-2">
                <div className="flex items-center gap-2 text-emerald-800 font-bold text-sm">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Chưa phát hiện lỗ hổng kiến thức!</span>
                </div>
                <p className="text-xs text-emerald-700 leading-relaxed">
                  Khi bạn đánh dấu “Cần ôn lại” trong bài lý thuyết hoặc trả lời sai câu hỏi trong lúc luyện tập/kiểm tra, hệ thống sẽ tự động tổng hợp các chủ đề yếu tại đây.
                </p>
              </div>
            )}

            <div className="pt-2 space-y-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Danh mục 5 bài / chuyên đề lý thuyết
              </h3>
              <div className="space-y-1.5">
                {lessons.map((lesson) => {
                  const isDone = progress.completedLessons.includes(lesson.id);
                  const isReview = progress.reviewLessons.includes(lesson.id);
                  return (
                    <button
                      key={lesson.id}
                      type="button"
                      onClick={() => onSelectLesson(lesson.id)}
                      className="w-full text-left px-3 py-2 rounded-lg border border-slate-200 hover:border-teal-500 bg-slate-50/50 flex items-center justify-between gap-2 text-xs transition-colors cursor-pointer"
                    >
                      <span className="font-semibold text-slate-800 truncate">
                        {lesson.code}: {lesson.title}
                      </span>
                      {isDone ? (
                        <span className="px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 font-mono text-[10px] shrink-0">
                          Đã học
                        </span>
                      ) : isReview ? (
                        <span className="px-1.5 py-0.5 rounded bg-amber-100 text-amber-800 font-mono text-[10px] shrink-0">
                          Cần ôn
                        </span>
                      ) : (
                        <span className="text-teal-600 font-semibold shrink-0">Học ngay →</span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span className="inline-flex items-center gap-1">
              <Award className="w-4 h-4 text-teal-600" />
              Chuẩn chương trình Sinh học 12
            </span>
            <span className="inline-flex items-center gap-1 text-teal-700 font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              28 hình gốc PDF
            </span>
          </div>
        </div>
      </section>
    </div>
  );
};
