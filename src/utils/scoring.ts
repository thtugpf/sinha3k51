import {
  ExamResultSummary,
  LessonId,
  Question,
  QuestionGradeResult,
  QuestionType,
  UserAnswerState,
} from '../types/biology';

export const LESSON_TITLES: Record<LessonId, string> = {
  'bai-1-gen-va-tai-ban-dna': 'Bài 1: Gen và sự tái bản DNA',
  'bai-2-bieu-hien-thong-tin-di-truyen': 'Bài 2: Sự biểu hiện thông tin di truyền',
  'chuyen-de-dieu-hoa-hoat-dong-gene': 'Chuyên đề 3: Điều hòa biểu hiện gene (Operon Lac)',
  'chuyen-de-dot-bien-gene-va-nst': 'Chuyên đề 4: Đột biến gene và Nhiễm sắc thể',
  'chuyen-de-cong-nghe-gene-va-thuc-hanh': 'Chuyên đề 5: Công nghệ DNA, Tách chiết & Điện di DNA',
};

/**
 * Normalizes a short answer string for deterministic comparison:
 * - Trims and collapses whitespace
 * - Converts to lowercase
 * - Normalizes Vietnamese decimal comma to dot (e.g. "0,19" -> "0.19")
 * - Strips common trailing units like "%", "nm", "aa", "amino acid", "liên kết", "phân tử", "tế bào"
 */
export function normalizeShortAnswer(raw: string): string {
  if (!raw) return '';
  let s = raw.trim().toLowerCase();
  // Replace comma between digits with dot
  s = s.replace(/(\d),(\d)/g, '$1.$2');
  // Remove trailing punctuation
  s = s.replace(/[.;!]+$/g, '').trim();
  // Remove common optional units if preceded by a number
  s = s
    .replace(
      /^([+-]?\d+(?:\.\d+)?)\s*(%|phần trăm|nm|å|angstron|ăngstron|bp|cặp nucleotide|nucleotide|nu|amino acid|axit amin|aa|liên kết hydrogen|liên kết|phân tử|tế bào|lần|đợt|bộ ba|codon|cơ chế|thành phần|mạch)$/i,
      '$1'
    )
    .trim();
  // Collapse multiple spaces
  s = s.replace(/\s+/g, ' ');
  return s;
}

export function gradeMCQ(question: Question, answer?: UserAnswerState): QuestionGradeResult {
  const maxPoints = 0.25;
  const choice = answer?.mcqChoice;

  if (question.needsSourceVerification) {
    return {
      questionId: question.id,
      type: 'mcq',
      isAnswered: Boolean(choice),
      isFullyCorrect: true,
      isUnverified: true,
      earnedPoints: choice ? maxPoints : 0,
      maxPoints,
      correctCount: choice ? 1 : 0,
      totalSubItems: 1,
      feedbackStatus: 'needs_review',
      feedbackMessage:
        question.verificationNote ||
        'Cần kiểm tra tài liệu gốc: Câu hỏi này có dữ kiện hoặc hình tham chiếu chưa đầy đủ trong bản PDF gốc.',
    };
  }

  if (!choice) {
    return {
      questionId: question.id,
      type: 'mcq',
      isAnswered: false,
      isFullyCorrect: false,
      isUnverified: false,
      earnedPoints: 0,
      maxPoints,
      correctCount: 0,
      totalSubItems: 1,
      feedbackStatus: 'unanswered',
      feedbackMessage: 'Chưa chọn phương án trả lời.',
    };
  }

  const isCorrect = choice === question.correctOption;
  return {
    questionId: question.id,
    type: 'mcq',
    isAnswered: true,
    isFullyCorrect: isCorrect,
    isUnverified: false,
    earnedPoints: isCorrect ? maxPoints : 0,
    maxPoints,
    correctCount: isCorrect ? 1 : 0,
    totalSubItems: 1,
    feedbackStatus: isCorrect ? 'correct' : 'incorrect',
    feedbackMessage: isCorrect
      ? 'CHÍNH XÁC! Bạn đã chọn đúng phương án.'
      : `CHƯA CHÍNH XÁC. Đáp án đúng là phương án ${question.correctOption}.`,
  };
}

/**
 * Official THPT 2025 scoring for True/False (4 statements a, b, c, d):
 * - 1 correct statement: 0.10 points
 * - 2 correct statements: 0.25 points
 * - 3 correct statements: 0.50 points
 * - 4 correct statements: 1.00 points
 */
export function calculateTFPoints(correctCount: number): number {
  switch (correctCount) {
    case 1:
      return 0.1;
    case 2:
      return 0.25;
    case 3:
      return 0.5;
    case 4:
      return 1.0;
    default:
      return 0;
  }
}

export function gradeTrueFalse(question: Question, answer?: UserAnswerState): QuestionGradeResult {
  const maxPoints = 1.0;
  const statements = question.statements || [];
  const tfChoices = answer?.tfChoices || {};

  const tfBreakdown: Record<'a' | 'b' | 'c' | 'd', { userVal?: boolean; correctVal: boolean; isCorrect: boolean }> = {
    a: { userVal: undefined, correctVal: false, isCorrect: false },
    b: { userVal: undefined, correctVal: false, isCorrect: false },
    c: { userVal: undefined, correctVal: false, isCorrect: false },
    d: { userVal: undefined, correctVal: false, isCorrect: false },
  };

  let answeredCount = 0;
  let correctCount = 0;

  for (const st of statements) {
    const userVal = tfChoices[st.key];
    if (typeof userVal === 'boolean') {
      answeredCount++;
    }
    const isCorrect = typeof userVal === 'boolean' && userVal === st.isTrue;
    if (isCorrect) {
      correctCount++;
    }
    tfBreakdown[st.key] = {
      userVal,
      correctVal: st.isTrue,
      isCorrect,
    };
  }

  if (question.needsSourceVerification) {
    return {
      questionId: question.id,
      type: 'true_false',
      isAnswered: answeredCount > 0,
      isFullyCorrect: true,
      isUnverified: true,
      earnedPoints: calculateTFPoints(correctCount),
      maxPoints,
      correctCount,
      totalSubItems: statements.length || 4,
      tfBreakdown,
      feedbackStatus: 'needs_review',
      feedbackMessage:
        question.verificationNote ||
        'Cần kiểm tra tài liệu gốc: Câu hỏi tham chiếu sơ đồ chưa có trong trang PDF gốc.',
    };
  }

  if (answeredCount === 0) {
    return {
      questionId: question.id,
      type: 'true_false',
      isAnswered: false,
      isFullyCorrect: false,
      isUnverified: false,
      earnedPoints: 0,
      maxPoints,
      correctCount: 0,
      totalSubItems: statements.length || 4,
      tfBreakdown,
      feedbackStatus: 'unanswered',
      feedbackMessage: 'Chưa chọn Đúng/Sai cho các mệnh đề a, b, c, d.',
    };
  }

  const earnedPoints = calculateTFPoints(correctCount);
  const isFullyCorrect = correctCount === statements.length;

  let feedbackStatus: QuestionGradeResult['feedbackStatus'] = 'incorrect';
  let feedbackMessage = `CHƯA CHÍNH XÁC. Bạn trả lời đúng ${correctCount}/${statements.length} mệnh đề (+${earnedPoints} điểm).`;

  if (isFullyCorrect) {
    feedbackStatus = 'correct';
    feedbackMessage = `CHÍNH XÁC! Bạn đã đánh giá đúng cả ${statements.length}/${statements.length} mệnh đề (+1,00 điểm).`;
  } else if (correctCount > 0) {
    feedbackStatus = 'partial';
  }

  return {
    questionId: question.id,
    type: 'true_false',
    isAnswered: true,
    isFullyCorrect,
    isUnverified: false,
    earnedPoints,
    maxPoints,
    correctCount,
    totalSubItems: statements.length || 4,
    tfBreakdown,
    feedbackStatus,
    feedbackMessage,
  };
}

export function gradeShortAnswer(question: Question, answer?: UserAnswerState): QuestionGradeResult {
  const maxPoints = 0.25;
  const rawInput = answer?.shortText ?? '';
  const normalizedInput = normalizeShortAnswer(rawInput);
  const criteria = question.shortAnswer;

  if (question.needsSourceVerification) {
    return {
      questionId: question.id,
      type: 'short_answer',
      isAnswered: normalizedInput.length > 0,
      isFullyCorrect: true,
      isUnverified: true,
      earnedPoints: 0,
      maxPoints: 0, // Do not penalize unverified question
      correctCount: 0,
      totalSubItems: 1,
      feedbackStatus: 'needs_review',
      feedbackMessage:
        question.verificationNote ||
        'Câu trả lời cần được xem xét thêm: Tài liệu PDF gốc bị khuyết hình sơ đồ tham chiếu cho câu này.',
    };
  }

  if (!normalizedInput) {
    return {
      questionId: question.id,
      type: 'short_answer',
      isAnswered: false,
      isFullyCorrect: false,
      isUnverified: false,
      earnedPoints: 0,
      maxPoints,
      correctCount: 0,
      totalSubItems: 1,
      feedbackStatus: 'unanswered',
      feedbackMessage: 'Chưa nhập câu trả lời ngắn.',
    };
  }

  if (!criteria) {
    return {
      questionId: question.id,
      type: 'short_answer',
      isAnswered: true,
      isFullyCorrect: false,
      isUnverified: true,
      earnedPoints: 0,
      maxPoints: 0,
      correctCount: 0,
      totalSubItems: 1,
      feedbackStatus: 'needs_review',
      feedbackMessage: 'Câu trả lời cần được xem xét thêm.',
    };
  }

  const normalizedAccepted = [
    criteria.primaryAnswer,
    ...(criteria.acceptedAnswers || []),
  ].map((a) => normalizeShortAnswer(a));

  let isMatch = normalizedAccepted.includes(normalizedInput);

  // Also check numeric tolerance if both are numeric
  if (!isMatch && typeof criteria.numericTolerance === 'number') {
    const userNum = Number(normalizedInput);
    const targetNum = Number(normalizeShortAnswer(criteria.primaryAnswer));
    if (!Number.isNaN(userNum) && !Number.isNaN(targetNum)) {
      if (Math.abs(userNum - targetNum) <= criteria.numericTolerance) {
        isMatch = true;
      }
    }
  }

  return {
    questionId: question.id,
    type: 'short_answer',
    isAnswered: true,
    isFullyCorrect: isMatch,
    isUnverified: false,
    earnedPoints: isMatch ? maxPoints : 0,
    maxPoints,
    correctCount: isMatch ? 1 : 0,
    totalSubItems: 1,
    feedbackStatus: isMatch ? 'correct' : 'incorrect',
    feedbackMessage: isMatch
      ? `CHÍNH XÁC! Đáp án chuẩn: ${criteria.primaryAnswer}${criteria.unit ? ' ' + criteria.unit : ''}.`
      : `CHƯA CHÍNH XÁC. Đáp án tham chiếu: ${criteria.primaryAnswer}${criteria.unit ? ' ' + criteria.unit : ''}.`,
  };
}

export function gradeQuestion(question: Question, answer?: UserAnswerState): QuestionGradeResult {
  switch (question.type) {
    case 'mcq':
      return gradeMCQ(question, answer);
    case 'true_false':
      return gradeTrueFalse(question, answer);
    case 'short_answer':
      return gradeShortAnswer(question, answer);
  }
}

export function calculateExamResult(params: {
  attemptId: string;
  title: string;
  mode: 'exam_A' | 'practice_B';
  startedAt: string;
  completedAt: string;
  durationSeconds: number;
  questions: Question[];
  userAnswers: Record<string, UserAnswerState>;
}): ExamResultSummary {
  const {
    attemptId,
    title,
    mode,
    startedAt,
    completedAt,
    durationSeconds,
    questions,
    userAnswers,
  } = params;

  const byType: ExamResultSummary['byType'] = {
    mcq: { total: 0, correct: 0, earnedPoints: 0, maxPoints: 0 },
    true_false: { total: 0, correct: 0, earnedPoints: 0, maxPoints: 0 },
    short_answer: { total: 0, correct: 0, earnedPoints: 0, maxPoints: 0 },
  };

  const byLesson: ExamResultSummary['byLesson'] = {
    'bai-1-gen-va-tai-ban-dna': {
      lessonTitle: LESSON_TITLES['bai-1-gen-va-tai-ban-dna'],
      total: 0,
      correct: 0,
      earnedPoints: 0,
      maxPoints: 0,
    },
    'bai-2-bieu-hien-thong-tin-di-truyen': {
      lessonTitle: LESSON_TITLES['bai-2-bieu-hien-thong-tin-di-truyen'],
      total: 0,
      correct: 0,
      earnedPoints: 0,
      maxPoints: 0,
    },
    'chuyen-de-dieu-hoa-hoat-dong-gene': {
      lessonTitle: LESSON_TITLES['chuyen-de-dieu-hoa-hoat-dong-gene'],
      total: 0,
      correct: 0,
      earnedPoints: 0,
      maxPoints: 0,
    },
    'chuyen-de-dot-bien-gene-va-nst': {
      lessonTitle: LESSON_TITLES['chuyen-de-dot-bien-gene-va-nst'],
      total: 0,
      correct: 0,
      earnedPoints: 0,
      maxPoints: 0,
    },
    'chuyen-de-cong-nghe-gene-va-thuc-hanh': {
      lessonTitle: LESSON_TITLES['chuyen-de-cong-nghe-gene-va-thuc-hanh'],
      total: 0,
      correct: 0,
      earnedPoints: 0,
      maxPoints: 0,
    },
  };

  const questionResults: Record<string, QuestionGradeResult> = {};
  let answeredQuestions = 0;
  let unansweredQuestions = 0;
  let correctQuestions = 0;
  let partialQuestions = 0;
  let incorrectQuestions = 0;
  let unverifiedQuestions = 0;
  let totalEarnedPoints = 0;
  let totalMaxPoints = 0;

  for (const q of questions) {
    const ans = userAnswers[q.id];
    const res = gradeQuestion(q, ans);
    questionResults[q.id] = res;

    byType[q.type].total += 1;
    byLesson[q.lessonId].total += 1;

    if (res.isUnverified) {
      unverifiedQuestions += 1;
      if (res.isAnswered) answeredQuestions += 1;
      else unansweredQuestions += 1;
      continue;
    }

    totalEarnedPoints += res.earnedPoints;
    totalMaxPoints += res.maxPoints;
    byType[q.type].earnedPoints += res.earnedPoints;
    byType[q.type].maxPoints += res.maxPoints;
    byLesson[q.lessonId].earnedPoints += res.earnedPoints;
    byLesson[q.lessonId].maxPoints += res.maxPoints;

    if (!res.isAnswered) {
      unansweredQuestions += 1;
    } else {
      answeredQuestions += 1;
      if (res.feedbackStatus === 'correct') {
        correctQuestions += 1;
        byType[q.type].correct += 1;
        byLesson[q.lessonId].correct += 1;
      } else if (res.feedbackStatus === 'partial') {
        partialQuestions += 1;
      } else {
        incorrectQuestions += 1;
      }
    }
  }

  totalEarnedPoints = Math.round(totalEarnedPoints * 100) / 100;
  totalMaxPoints = Math.round(totalMaxPoints * 100) / 100;

  const scaledScore10 =
    totalMaxPoints > 0
      ? Math.round((totalEarnedPoints / totalMaxPoints) * 10 * 100) / 100
      : 0;

  const verifiableCount = questions.length - unverifiedQuestions;
  const accuracyPercent =
    verifiableCount > 0
      ? Math.round(((correctQuestions + partialQuestions * 0.5) / verifiableCount) * 100)
      : 100;

  return {
    attemptId,
    title,
    mode,
    startedAt,
    completedAt,
    durationSeconds,
    totalQuestions: questions.length,
    answeredQuestions,
    unansweredQuestions,
    correctQuestions,
    partialQuestions,
    incorrectQuestions,
    unverifiedQuestions,
    totalEarnedPoints,
    totalMaxPoints,
    scaledScore10,
    accuracyPercent,
    byType,
    byLesson,
    questionResults,
    userAnswers,
    questionIds: questions.map((q) => q.id),
  };
}
