import { ExamSetId, Question } from '../types/biology';
import { EXAM_SETS_METADATA, PDF_IMAGE_AUDIT_LIST, SOURCE_DOCUMENT_AUDIT } from './auditData';
import { QUESTIONS_BAI_1 } from './questionsBai1';
import { QUESTIONS_BAI_2 } from './questionsBai2';
import { QUESTIONS_DE_1_TO_3 } from './questionsDe1To3';
import { QUESTIONS_DE_4_TO_5 } from './questionsDe4To5';
import { FLASHCARDS, THEORY_LESSONS } from './theoryData';

const RAW_QUESTIONS: Question[] = [
  ...QUESTIONS_BAI_1,
  ...QUESTIONS_BAI_2,
  ...QUESTIONS_DE_1_TO_3,
  ...QUESTIONS_DE_4_TO_5,
];

// Automatically detect and link cross-source/cross-exam duplicate questions while preserving every question in its original exam set (Principle 4 & 5)
const DUPLICATE_LINKS: Record<string, string> = {
  'de2-p2-c19': 'de1-p2-c21', // Hồng cầu hình liềm HbA / HbS
  'de2-p3-c24': 'b1-p3-c6',   // Vi khuẩn E. coli nuôi cấy N15 chuyển sang N14
  'de3-p1-c1': 'b1-p1-c15',   // Cấu trúc DNA xoắn kép
  'de4-p1-c1': 'b1-p1-c2',    // Nguyên tắc bổ sung tái bản DNA
  'de5-p1-c1': 'b1-p1-c9',    // Đơn phân nucleotide của DNA
  'de5-p2-c22': 'de1-p2-c19', // Sơ đồ tái bản DNA / phiên mã
};

export const ALL_QUESTIONS: Question[] = RAW_QUESTIONS.map((q) =>
  DUPLICATE_LINKS[q.id] ? { ...q, duplicateOfId: DUPLICATE_LINKS[q.id] } : q
);

export const QUESTIONS_BY_ID: Record<string, Question> = Object.fromEntries(
  ALL_QUESTIONS.map((q) => [q.id, q])
);

export function getQuestionsByExamSet(setId: ExamSetId): Question[] {
  return ALL_QUESTIONS.filter((q) => q.sourceSetId === setId);
}

export {
  THEORY_LESSONS,
  FLASHCARDS,
  QUESTIONS_BAI_1,
  QUESTIONS_BAI_2,
  QUESTIONS_DE_1_TO_3,
  QUESTIONS_DE_4_TO_5,
  EXAM_SETS_METADATA,
  PDF_IMAGE_AUDIT_LIST,
  SOURCE_DOCUMENT_AUDIT,
};
