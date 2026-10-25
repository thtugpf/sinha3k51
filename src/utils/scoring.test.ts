import test from 'node:test';
import assert from 'node:assert/strict';
import {
  normalizeShortAnswer,
  calculateTFPoints,
  gradeMCQ,
  gradeTrueFalse,
  gradeShortAnswer,
  calculateExamResult,
} from './scoring';
import { Question } from '../types/biology';

test('normalizeShortAnswer handles commas, spaces, case, and units', () => {
  assert.equal(normalizeShortAnswer('  10 % '), '10');
  assert.equal(normalizeShortAnswer('0,19'), '0.19');
  assert.equal(normalizeShortAnswer('3450 liên kết'), '3450');
  assert.equal(normalizeShortAnswer('498 amino acid.'), '498');
  assert.equal(normalizeShortAnswer('Giảm 1 amino acid'), 'giảm 1 amino acid');
});

test('calculateTFPoints follows official THPT 2025 progressive scale', () => {
  assert.equal(calculateTFPoints(0), 0);
  assert.equal(calculateTFPoints(1), 0.1);
  assert.equal(calculateTFPoints(2), 0.25);
  assert.equal(calculateTFPoints(3), 0.5);
  assert.equal(calculateTFPoints(4), 1.0);
});

test('gradeMCQ scores correct, wrong, and unanswered states', () => {
  const sampleMCQ: Question = {
    id: 'test-mcq-1',
    originalNumber: 'Câu 1',
    type: 'mcq',
    sourceDoc: 'ilovepdf_merged',
    sourceSetId: 'bai1_full',
    sourceSetLabel: 'Bài 1',
    pageNumber: 2,
    lessonId: 'bai-1-gen-va-tai-ban-dna',
    topic: 'Cấu trúc DNA',
    stem: 'Đơn phân cấu tạo nên DNA là',
    options: [
      { key: 'A', text: 'Nucleotide' },
      { key: 'B', text: 'Amino acid' },
      { key: 'C', text: 'Monosaccharide' },
      { key: 'D', text: 'Glicerol' },
    ],
    correctOption: 'A',
    explanation: 'Đơn phân của DNA là nucleotide.',
  };

  const resCorrect = gradeMCQ(sampleMCQ, { mcqChoice: 'A' });
  assert.equal(resCorrect.isFullyCorrect, true);
  assert.equal(resCorrect.earnedPoints, 0.25);
  assert.equal(resCorrect.feedbackStatus, 'correct');

  const resWrong = gradeMCQ(sampleMCQ, { mcqChoice: 'B' });
  assert.equal(resWrong.isFullyCorrect, false);
  assert.equal(resWrong.earnedPoints, 0);
  assert.equal(resWrong.feedbackStatus, 'incorrect');

  const resEmpty = gradeMCQ(sampleMCQ, {});
  assert.equal(resEmpty.isAnswered, false);
  assert.equal(resEmpty.earnedPoints, 0);
  assert.equal(resEmpty.feedbackStatus, 'unanswered');
});

test('gradeTrueFalse evaluates each proposition independently and applies progressive points', () => {
  const sampleTF: Question = {
    id: 'test-tf-1',
    originalNumber: 'Câu 1',
    type: 'true_false',
    sourceDoc: 'ilovepdf_merged',
    sourceSetId: 'bai1_full',
    sourceSetLabel: 'Bài 1',
    pageNumber: 6,
    lessonId: 'bai-1-gen-va-tai-ban-dna',
    topic: 'Cấu trúc DNA',
    stem: 'Các nhận định sau đúng hay sai?',
    statements: [
      { key: 'a', text: 'Mệnh đề a', isTrue: true, explanation: 'a đúng' },
      { key: 'b', text: 'Mệnh đề b', isTrue: true, explanation: 'b đúng' },
      { key: 'c', text: 'Mệnh đề c', isTrue: false, explanation: 'c sai' },
      { key: 'd', text: 'Mệnh đề d', isTrue: false, explanation: 'd sai' },
    ],
    explanation: 'Giải thích chung',
  };

  const res3Right = gradeTrueFalse(sampleTF, {
    tfChoices: { a: true, b: true, c: false, d: true },
  });
  assert.equal(res3Right.correctCount, 3);
  assert.equal(res3Right.earnedPoints, 0.5);
  assert.equal(res3Right.feedbackStatus, 'partial');
  assert.equal(res3Right.tfBreakdown?.d.isCorrect, false);

  const res4Right = gradeTrueFalse(sampleTF, {
    tfChoices: { a: true, b: true, c: false, d: false },
  });
  assert.equal(res4Right.correctCount, 4);
  assert.equal(res4Right.earnedPoints, 1.0);
  assert.equal(res4Right.isFullyCorrect, true);
  assert.equal(res4Right.feedbackStatus, 'correct');
});

test('gradeShortAnswer accepts equivalent answers and respects needsSourceVerification', () => {
  const sampleSA: Question = {
    id: 'test-sa-1',
    originalNumber: 'Câu 3',
    type: 'short_answer',
    sourceDoc: 'ilovepdf_merged',
    sourceSetId: 'bai2_full',
    sourceSetLabel: 'Bài 2',
    pageNumber: 17,
    lessonId: 'bai-2-bieu-hien-thong-tin-di-truyen',
    topic: 'Mã di truyền',
    stem: 'Xác suất xuất hiện bộ ba kết thúc?',
    shortAnswer: {
      primaryAnswer: '0,19',
      acceptedAnswers: ['0.19', '0,19', '3/16', '18,75%', '18.75%'],
      numericTolerance: 0.005,
      rubric: 'P(UAA)+P(UAG)+P(UGA) = 3/16 = 0,1875 ≈ 0,19.',
    },
    explanation: '3/16 = 0,1875 làm tròn 2 chữ số là 0,19.',
  };

  assert.equal(gradeShortAnswer(sampleSA, { shortText: '0,19' }).isFullyCorrect, true);
  assert.equal(gradeShortAnswer(sampleSA, { shortText: '0.188' }).isFullyCorrect, true);
  assert.equal(gradeShortAnswer(sampleSA, { shortText: '0.50' }).isFullyCorrect, false);

  const unverifiedSA: Question = {
    ...sampleSA,
    id: 'test-sa-unverified',
    needsSourceVerification: true,
    verificationNote: 'Tài liệu gốc thiếu hình sơ đồ bước tách chiết.',
  };
  const unvRes = gradeShortAnswer(unverifiedSA, { shortText: '2' });
  assert.equal(unvRes.isUnverified, true);
  assert.equal(unvRes.feedbackStatus, 'needs_review');
  assert.equal(unvRes.maxPoints, 0);
});

test('calculateExamResult aggregates total points without penalizing unverified questions', () => {
  const q1: Question = {
    id: 'q1',
    originalNumber: 'Câu 1',
    type: 'mcq',
    sourceDoc: 'de_on_tap_12',
    sourceSetId: 'de_so_1',
    sourceSetLabel: 'Đề số 1',
    pageNumber: 1,
    lessonId: 'bai-1-gen-va-tai-ban-dna',
    topic: 'DNA',
    stem: 'Câu 1',
    options: [
      { key: 'A', text: 'A' },
      { key: 'B', text: 'B' },
      { key: 'C', text: 'C' },
      { key: 'D', text: 'D' },
    ],
    correctOption: 'B',
    explanation: 'B đúng',
  };
  const q2: Question = {
    id: 'q2',
    originalNumber: 'Câu 26',
    type: 'short_answer',
    sourceDoc: 'de_on_tap_12',
    sourceSetId: 'de_so_1',
    sourceSetLabel: 'Đề số 1',
    pageNumber: 3,
    lessonId: 'chuyen-de-cong-nghe-gene-va-thuc-hanh',
    topic: 'Tách chiết DNA',
    stem: 'Bước mấy?',
    needsSourceVerification: true,
    verificationNote: 'Thiếu sơ đồ trong PDF gốc',
    explanation: 'Cần kiểm tra sơ đồ gốc',
  };

  const summary = calculateExamResult({
    attemptId: 'att-1',
    title: 'Test Exam',
    mode: 'exam_A',
    startedAt: new Date().toISOString(),
    completedAt: new Date().toISOString(),
    durationSeconds: 120,
    questions: [q1, q2],
    userAnswers: {
      q1: { mcqChoice: 'B' },
      q2: { shortText: '2' },
    },
  });

  assert.equal(summary.totalEarnedPoints, 0.25);
  assert.equal(summary.totalMaxPoints, 0.25);
  assert.equal(summary.scaledScore10, 10);
  assert.equal(summary.unverifiedQuestions, 1);
});

import fs from 'node:fs';
import path from 'node:path';
import {
  ALL_QUESTIONS,
  QUESTIONS_BAI_1,
  QUESTIONS_BAI_2,
  QUESTIONS_DE_1_TO_3,
  QUESTIONS_DE_4_TO_5,
  THEORY_LESSONS,
  PDF_IMAGE_AUDIT_LIST,
} from '../data/index';

test('dataset integrity: 253 total questions across both official PDFs with valid structure and images', () => {
  assert.equal(QUESTIONS_BAI_1.length, 56, 'Bài 1 must have 56 questions (35 MCQ + 8 TF + 13 SA)');
  assert.equal(QUESTIONS_BAI_2.length, 57, 'Bài 2 must have 57 questions (41 MCQ + 8 TF + 8 SA)');
  assert.equal(QUESTIONS_DE_1_TO_3.length, 84, 'Đề 1-3 must have 84 questions (3 * 28)');
  assert.equal(QUESTIONS_DE_4_TO_5.length, 56, 'Đề 4-5 must have 56 questions (2 * 28)');
  assert.equal(ALL_QUESTIONS.length, 253, 'Total question bank must be 253 questions');

  const ids = new Set<string>();
  let mcqCount = 0;
  let tfCount = 0;
  let saCount = 0;

  for (const q of ALL_QUESTIONS) {
    assert.equal(ids.has(q.id), false, `Duplicate question id: ${q.id}`);
    ids.add(q.id);

    if (q.type === 'mcq') {
      mcqCount++;
      assert.equal(q.options?.length, 4, `MCQ ${q.id} must have 4 options`);
      assert.ok(q.correctOption, `MCQ ${q.id} must have correctOption`);
    } else if (q.type === 'true_false') {
      tfCount++;
      assert.equal(q.statements?.length, 4, `TF ${q.id} must have 4 statements a,b,c,d`);
    } else if (q.type === 'short_answer') {
      saCount++;
      assert.ok(q.shortAnswer, `SA ${q.id} must have shortAnswer criteria`);
    }

    if (q.image?.url) {
      const diskPath = path.join(process.cwd(), 'public', q.image.url);
      assert.equal(fs.existsSync(diskPath), true, `Missing question image file: ${diskPath}`);
    }
  }

  assert.equal(mcqCount, 166);
  assert.equal(tfCount, 41);
  assert.equal(saCount, 46);
  assert.equal(THEORY_LESSONS.length, 5);
  assert.ok(PDF_IMAGE_AUDIT_LIST.length >= 28);
});

