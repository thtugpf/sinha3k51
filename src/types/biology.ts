export type QuestionType = 'mcq' | 'true_false' | 'short_answer';

export type SourceDocId = 'ilovepdf_merged' | 'de_on_tap_12';

export type LessonId =
  | 'bai-1-gen-va-tai-ban-dna'
  | 'bai-2-bieu-hien-thong-tin-di-truyen'
  | 'chuyen-de-dieu-hoa-hoat-dong-gene'
  | 'chuyen-de-dot-bien-gene-va-nst'
  | 'chuyen-de-cong-nghe-gene-va-thuc-hanh';

export type ExamSetId =
  | 'bai1_full'
  | 'bai2_full'
  | 'de_so_1'
  | 'de_so_2'
  | 'de_so_3'
  | 'de_so_4'
  | 'de_so_5';

export interface PDFImageRef {
  id: string;
  url: string;
  caption: string;
  sourceDoc: SourceDocId;
  pageNumber: number;
  width?: number;
  height?: number;
  note?: string;
}

export interface QuestionTableData {
  caption?: string;
  headers: string[];
  rows: (string | number)[][];
}

export interface MCQOption {
  key: 'A' | 'B' | 'C' | 'D';
  text: string;
}

export interface TrueFalseStatement {
  key: 'a' | 'b' | 'c' | 'd';
  text: string;
  isTrue: boolean;
  explanation: string;
}

export interface ShortAnswerCriteria {
  primaryAnswer: string;
  acceptedAnswers: string[];
  unit?: string;
  numericTolerance?: number;
  rubric: string;
  hint?: string;
}

export interface Question {
  id: string;
  originalNumber: string; // e.g. "Câu 1", "Câu 48", "Câu 19"
  type: QuestionType;
  sourceDoc: SourceDocId;
  sourceSetId: ExamSetId;
  sourceSetLabel: string; // e.g., "Bài 1 - Gen và sự tái bản DNA" or "Đề ôn tập số 1"
  pageNumber: number;
  lessonId: LessonId;
  topic: string;
  stem: string;
  subItems?: string[]; // Additional lines in stem (like (1), (2), (3) or (a), (b), (c))
  image?: PDFImageRef;
  table?: QuestionTableData;
  // For MCQ
  options?: MCQOption[];
  correctOption?: 'A' | 'B' | 'C' | 'D';
  // For True/False
  statements?: TrueFalseStatement[];
  // For Short Answer
  shortAnswer?: ShortAnswerCriteria;
  // General explanation & verification
  explanation: string;
  relatedTheorySectionId?: string;
  duplicateOfId?: string; // If linked across both files or exams
  needsSourceVerification?: boolean;
  verificationNote?: string;
}

export interface ProcessStep {
  stepNumber: number;
  title: string;
  description: string;
}

export interface ComparisonTable {
  title: string;
  headers: string[];
  rows: string[][];
}

export interface TheorySection {
  id: string;
  title: string;
  content: string[];
  keyTerms?: { term: string; definition: string }[];
  processSteps?: ProcessStep[];
  comparisonTable?: ComparisonTable;
  figures?: PDFImageRef[];
  misconceptions?: { myth: string; truth: string }[];
}

export interface SelfCheckItem {
  id: string;
  question: string;
  answer: string;
}

export interface TheoryLesson {
  id: LessonId;
  code: string;
  title: string;
  subtitle: string;
  sourceInfo: string;
  isDirectFromPdf1Heading: boolean;
  summary: string;
  keywords: string[];
  sections: TheorySection[];
  selfCheck: SelfCheckItem[];
}

export interface Flashcard {
  id: string;
  lessonId: LessonId;
  front: string;
  back: string;
  sourceRef: string;
}

export interface UserAnswerState {
  mcqChoice?: 'A' | 'B' | 'C' | 'D';
  tfChoices?: Partial<Record<'a' | 'b' | 'c' | 'd', boolean>>;
  shortText?: string;
}

export interface QuestionGradeResult {
  questionId: string;
  type: QuestionType;
  isAnswered: boolean;
  isFullyCorrect: boolean;
  isUnverified: boolean;
  earnedPoints: number;
  maxPoints: number;
  correctCount: number; // 1 for MCQ/SA, 0..4 for TF
  totalSubItems: number; // 1 for MCQ/SA, 4 for TF
  tfBreakdown?: Record<'a' | 'b' | 'c' | 'd', { userVal?: boolean; correctVal: boolean; isCorrect: boolean }>;
  feedbackStatus: 'correct' | 'partial' | 'incorrect' | 'unanswered' | 'needs_review';
  feedbackMessage: string;
}

export interface ExamResultSummary {
  attemptId: string;
  title: string;
  mode: 'exam_A' | 'practice_B';
  startedAt: string;
  completedAt: string;
  durationSeconds: number;
  totalQuestions: number;
  answeredQuestions: number;
  unansweredQuestions: number;
  correctQuestions: number;
  partialQuestions: number;
  incorrectQuestions: number;
  unverifiedQuestions: number;
  totalEarnedPoints: number;
  totalMaxPoints: number;
  scaledScore10: number;
  accuracyPercent: number;
  byType: Record<
    QuestionType,
    {
      total: number;
      correct: number;
      earnedPoints: number;
      maxPoints: number;
    }
  >;
  byLesson: Record<
    LessonId,
    {
      lessonTitle: string;
      total: number;
      correct: number;
      earnedPoints: number;
      maxPoints: number;
    }
  >;
  questionResults: Record<string, QuestionGradeResult>;
  userAnswers: Record<string, UserAnswerState>;
  questionIds: string[];
}

export interface UserProgress {
  completedLessons: LessonId[];
  reviewLessons: LessonId[];
  rememberedFlashcards: string[];
  reviewFlashcards: string[];
  bookmarkedQuestions: string[];
  wrongQuestionIds: string[];
  attemptedQuestionIds: string[];
  correctQuestionIds: string[];
  savedAnswers: Record<string, UserAnswerState>;
  examHistory: ExamResultSummary[];
  soundEnabled: boolean;
  lastActiveLessonId?: LessonId;
}

export interface PDFImageAuditItem {
  id: string;
  fileName: string;
  sourceDoc: SourceDocId;
  sourceDocLabel: string;
  pageNumber: number;
  targetCode: string; // e.g., "Bài 1 - Hình 1.1" or "Đề 1 - Câu 6"
  usageType: 'theory' | 'question' | 'both';
  appLocation: string;
  dimensions: string;
  status: 'extracted_verified' | 'table_reconstructed' | 'missing_in_source_pdf';
  note: string;
}
