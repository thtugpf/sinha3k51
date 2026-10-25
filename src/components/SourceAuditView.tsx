import React, { useState } from 'react';
import {
  AlertTriangle,
  CheckCircle2,
  Database,
  FileCheck2,
  Image as ImageIcon,
  Layers,
  ShieldCheck,
} from 'lucide-react';
import { PDF_IMAGE_AUDIT_LIST, SOURCE_DOCUMENT_AUDIT } from '../data/auditData';
import { ALL_QUESTIONS, THEORY_LESSONS } from '../data/index';
import { OriginalFigureCard } from './ImageLightbox';

export const SourceAuditView: React.FC = () => {
  const [docFilter, setDocFilter] = useState<'all' | 'ilovepdf_merged' | 'de_on_tap_12'>('all');

  const mcqCount = ALL_QUESTIONS.filter((q) => q.type === 'mcq').length;
  const tfCount = ALL_QUESTIONS.filter((q) => q.type === 'true_false').length;
  const saCount = ALL_QUESTIONS.filter((q) => q.type === 'short_answer').length;
  const unverifiedQuestions = ALL_QUESTIONS.filter((q) => q.needsSourceVerification);
  const duplicateLinkedQuestions = ALL_QUESTIONS.filter((q) => q.duplicateOfId);

  const filteredImages =
    docFilter === 'all'
      ? PDF_IMAGE_AUDIT_LIST
      : PDF_IMAGE_AUDIT_LIST.filter((item) => item.sourceDoc === docFilter);

  return (
    <div className="space-y-8 pb-16">
      {/* Header Banner */}
      <section className="bg-slate-900 text-white rounded-2xl p-6 sm:p-8 border border-slate-800 shadow-md space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-teal-500/20 border border-teal-400/30 text-teal-300 text-xs font-mono font-bold">
          <ShieldCheck className="w-4 h-4" />
          <span>BÁO CÁO ĐỐI CHIẾU & KIỂM KÊ DỮ LIỆU NGUỒN (100% TRÍCH XUẤT THỰC TẾ)</span>
        </div>

        <h1 className="text-xl sm:text-3xl font-extrabold">
          Quản lý Dữ liệu nguồn & Kiểm kê Hình ảnh PDF gốc
        </h1>

        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-3xl">
          Toàn bộ 32/32 trang của hai tài liệu <strong>ilovepdf_merged.pdf</strong> (17 trang) và{' '}
          <strong>ĐỀ ÔN TẬP 12 HS(1).pdf</strong> (15 trang) đã được đọc, trích xuất nguyên văn câu hỏi, bảng biểu và tách trực tiếp 28 hình XObject gốc từ luồng PDF mà không thay thế bằng hình AI.
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
          <div className="p-4 rounded-xl bg-slate-800 border border-slate-700">
            <span className="text-xs text-slate-400 block">Tổng số trang PDF đã đọc</span>
            <strong className="text-2xl font-mono font-extrabold text-teal-300">
              {SOURCE_DOCUMENT_AUDIT.totalPagesRead} / 32 trang
            </strong>
          </div>
          <div className="p-4 rounded-xl bg-slate-800 border border-slate-700">
            <span className="text-xs text-slate-400 block">Tổng câu hỏi đã đối chiếu</span>
            <strong className="text-2xl font-mono font-extrabold text-white">
              {ALL_QUESTIONS.length} / 253 câu
            </strong>
          </div>
          <div className="p-4 rounded-xl bg-slate-800 border border-slate-700">
            <span className="text-xs text-slate-400 block">Hình gốc trích từ PDF</span>
            <strong className="text-2xl font-mono font-extrabold text-emerald-400">
              28 hình + 2 bảng
            </strong>
          </div>
          <div className="p-4 rounded-xl bg-slate-800 border border-slate-700">
            <span className="text-xs text-slate-400 block">Câu trùng liên kết 2 nguồn</span>
            <strong className="text-2xl font-mono font-extrabold text-amber-300">
              {duplicateLinkedQuestions.length} câu
            </strong>
          </div>
        </div>
      </section>

      {/* Two Official Source PDFs Breakdown */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {SOURCE_DOCUMENT_AUDIT.documents.map((doc) => (
          <div
            key={doc.id}
            className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4"
          >
            <div className="flex items-center justify-between gap-2 border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2.5">
                <FileCheck2 className="w-5 h-5 text-teal-600" />
                <h2 className="text-base sm:text-lg font-extrabold text-slate-900">
                  {doc.fileName}
                </h2>
              </div>
              <span className="px-2.5 py-1 rounded bg-emerald-100 text-emerald-800 font-mono text-xs font-bold">
                Đã đọc {doc.pagesRead}/{doc.totalPages} trang (100%)
              </span>
            </div>

            <div className="grid grid-cols-4 gap-2 text-center">
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[11px] text-slate-500 block">Tổng số câu</span>
                <strong className="font-mono text-base font-extrabold text-slate-900">
                  {doc.totalQuestions}
                </strong>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[11px] text-slate-500 block">4 lựa chọn</span>
                <strong className="font-mono text-base font-extrabold text-teal-700">
                  {doc.mcqCount}
                </strong>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[11px] text-slate-500 block">Đúng/Sai</span>
                <strong className="font-mono text-base font-extrabold text-blue-700">
                  {doc.tfCount}
                </strong>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[11px] text-slate-500 block">Trả lời ngắn</span>
                <strong className="font-mono text-base font-extrabold text-amber-700">
                  {doc.saCount}
                </strong>
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Danh mục các phần / đề đã trích xuất:
              </div>
              <ul className="space-y-1 text-xs sm:text-sm text-slate-700">
                {doc.lessonsExtracted.map((item, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-3.5 rounded-xl bg-amber-50/70 border border-amber-200 space-y-1.5">
              <div className="text-xs font-bold text-amber-950 flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                <span>Ghi chú đối chiếu bản in PDF gốc:</span>
              </div>
              {doc.notes.map((n, i) => (
                <p key={i} className="text-xs text-amber-900 leading-relaxed">
                  • {n}
                </p>
              ))}
            </div>
          </div>
        ))}
      </section>

      {/* Flagged / Special Source Verification Notes */}
      <section className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
        <h2 className="text-base sm:text-lg font-extrabold text-slate-900 flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-amber-500" />
          <span>
            Danh sách câu hỏi có lưu ý ở tài liệu gốc ({unverifiedQuestions.length} câu gắn cờ bảo vệ điểm)
          </span>
        </h2>

        <div className="space-y-3">
          {unverifiedQuestions.map((q) => (
            <div
              key={q.id}
              className="p-4 rounded-xl bg-amber-50/80 border border-amber-300 space-y-1.5 text-xs sm:text-sm"
            >
              <div className="font-bold text-amber-950">
                {q.sourceSetLabel} – {q.originalNumber} (Trang {q.pageNumber})
              </div>
              <div className="text-slate-800 font-medium">Nội dung gốc: “{q.stem}”</div>
              <div className="text-amber-900">
                <strong>Trạng thái xử lý:</strong> {q.verificationNote}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Complete Image Inventory Table & Visual Gallery */}
      <section className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div>
            <h2 className="text-base sm:text-lg font-extrabold text-slate-900 flex items-center gap-2">
              <ImageIcon className="w-5 h-5 text-teal-600" />
              <span>
                Bảng kiểm kê toàn bộ hình ảnh & bảng biểu trích xuất từ 2 file PDF ({PDF_IMAGE_AUDIT_LIST.length} mục)
              </span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Giữ nguyên 100% hình vẽ gốc từ tài liệu, hiển thị đúng vị trí trong Lý thuyết, Luyện tập và Kiểm tra
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setDocFilter('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer ${
                docFilter === 'all'
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              Tất cả ({PDF_IMAGE_AUDIT_LIST.length})
            </button>
            <button
              type="button"
              onClick={() => setDocFilter('ilovepdf_merged')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer ${
                docFilter === 'ilovepdf_merged'
                  ? 'bg-teal-600 text-white'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              ilovepdf_merged.pdf (23 hình)
            </button>
            <button
              type="button"
              onClick={() => setDocFilter('de_on_tap_12')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer ${
                docFilter === 'de_on_tap_12'
                  ? 'bg-teal-600 text-white'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              ĐỀ ÔN TẬP 12 HS(1).pdf (5 hình + 2 bảng)
            </button>
          </div>
        </div>

        <div className="overflow-x-auto rounded-xl border border-slate-200">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-800 text-white">
                <th className="p-3 font-bold">Mã / Tên file</th>
                <th className="p-3 font-bold">Tài liệu nguồn & Trang</th>
                <th className="p-3 font-bold">Thuộc bài học / Câu hỏi</th>
                <th className="p-3 font-bold">Vị trí hiển thị trong App</th>
                <th className="p-3 font-bold">Trạng thái</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filteredImages.map((item) => (
                <tr key={item.id} className="odd:bg-white even:bg-slate-50/70">
                  <td className="p-3 font-mono font-bold text-slate-900">
                    {item.id}
                    <span className="block text-[10px] font-normal text-slate-500">
                      {item.dimensions}
                    </span>
                  </td>
                  <td className="p-3 text-slate-700">
                    <strong>{item.sourceDocLabel}</strong>
                    <span className="block text-slate-500">Trang {item.pageNumber}</span>
                  </td>
                  <td className="p-3 font-semibold text-teal-900">{item.targetCode}</td>
                  <td className="p-3 text-slate-700">
                    {item.appLocation}
                    <span className="block text-[11px] text-slate-500 mt-0.5">{item.note}</span>
                  </td>
                  <td className="p-3">
                    {item.status === 'extracted_verified' ? (
                      <span className="inline-block px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold">
                        ✓ Đã trích xuất hình gốc
                      </span>
                    ) : item.status === 'table_reconstructed' ? (
                      <span className="inline-block px-2 py-0.5 rounded bg-blue-100 text-blue-800 font-bold">
                        ✓ Bảng dữ liệu chuẩn
                      </span>
                    ) : (
                      <span className="inline-block px-2 py-0.5 rounded bg-amber-100 text-amber-900 font-bold">
                        ⚠ Khuyết trong PDF gốc
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Visual Preview Grid of Extracted Original PDF Figures */}
        <div className="pt-4 space-y-3">
          <h3 className="text-sm font-extrabold text-slate-800 uppercase tracking-wider">
            Thư viện đối chiếu trực quan 28 hình ảnh gốc trích xuất từ PDF (Nhấn để phóng to)
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredImages
              .filter((item) => item.status === 'extracted_verified')
              .map((item) => (
                <OriginalFigureCard
                  key={item.id}
                  image={{
                    id: item.id,
                    url: item.fileName,
                    caption: `${item.targetCode}: ${item.note}`,
                    sourceDoc: item.sourceDoc,
                    pageNumber: item.pageNumber,
                  }}
                />
              ))}
          </div>
        </div>
      </section>
    </div>
  );
};
