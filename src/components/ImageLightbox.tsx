import React, { useState } from 'react';
import { ZoomIn, ZoomOut, X, FileText, Maximize2 } from 'lucide-react';
import { PDFImageRef } from '../types/biology';

interface OriginalFigureCardProps {
  image: PDFImageRef;
  compact?: boolean;
}

export const OriginalFigureCard: React.FC<OriginalFigureCardProps> = ({ image, compact = false }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [zoom, setZoom] = useState(1);

  const docLabel =
    image.sourceDoc === 'ilovepdf_merged' ? 'ilovepdf_merged.pdf' : 'ĐỀ ÔN TẬP 12 HS(1).pdf';

  return (
    <>
      <figure
        className={`my-3 rounded-xl border border-slate-200 bg-white shadow-xs overflow-hidden ${
          compact ? 'max-w-xl' : 'w-full'
        }`}
      >
        <div className="flex flex-wrap items-center justify-between gap-2 px-3.5 py-2 bg-slate-50 border-b border-slate-200 text-xs text-slate-600">
          <div className="flex items-center gap-2 font-medium text-teal-800">
            <FileText className="w-3.5 h-3.5 text-teal-600 shrink-0" />
            <span>
              Hình gốc từ tài liệu: <strong>{docLabel}</strong> (Trang {image.pageNumber})
            </span>
          </div>
          <button
            type="button"
            onClick={() => {
              setZoom(1);
              setIsOpen(true);
            }}
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-teal-50 text-teal-700 hover:bg-teal-100 font-semibold transition-colors cursor-pointer"
            aria-label={`Phóng to ${image.caption}`}
          >
            <Maximize2 className="w-3.5 h-3.5" />
            <span>Phóng to hình gốc</span>
          </button>
        </div>

        <div
          onClick={() => {
            setZoom(1);
            setIsOpen(true);
          }}
          className="p-4 flex justify-center items-center bg-white cursor-zoom-in group relative"
        >
          <img
            src={image.url}
            alt={image.caption}
            className="max-h-80 w-auto object-contain rounded transition-transform duration-200 group-hover:scale-[1.01]"
            loading="lazy"
          />
        </div>

        <figcaption className="px-4 py-2.5 bg-slate-50/80 border-t border-slate-100 text-xs sm:text-sm text-slate-700 font-medium text-center">
          {image.caption}
          {image.note && (
            <span className="block mt-0.5 text-xs text-slate-500 font-normal">{image.note}</span>
          )}
        </figcaption>
      </figure>

      {isOpen && (
        <div
          className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-xs flex flex-col items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-label={image.caption}
        >
          <div className="w-full max-w-5xl bg-slate-900 border border-slate-700 rounded-2xl overflow-hidden shadow-2xl flex flex-col max-h-[92vh]">
            <div className="flex flex-wrap items-center justify-between gap-2 px-4 py-3 bg-slate-800 border-b border-slate-700 text-slate-100">
              <div className="text-sm font-semibold truncate max-w-xl">
                {image.caption} — <span className="text-teal-300">{docLabel} (Trang {image.pageNumber})</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setZoom((z) => Math.max(0.75, z - 0.25))}
                  className="p-1.5 rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-200 cursor-pointer"
                  aria-label="Thu nhỏ hình"
                >
                  <ZoomOut className="w-4 h-4" />
                </button>
                <span className="text-xs font-mono px-2 py-1 rounded bg-slate-950 text-teal-300">
                  {Math.round(zoom * 100)}%
                </span>
                <button
                  type="button"
                  onClick={() => setZoom((z) => Math.min(2.5, z + 0.25))}
                  className="p-1.5 rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-200 cursor-pointer"
                  aria-label="Phóng to hình"
                >
                  <ZoomIn className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="ml-2 inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold cursor-pointer"
                  aria-label="Đóng cửa sổ phóng to"
                >
                  <X className="w-4 h-4" />
                  <span>Đóng</span>
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-auto p-6 bg-white flex items-center justify-center">
              <img
                src={image.url}
                alt={image.caption}
                style={{ transform: `scale(${zoom})`, transformOrigin: 'center center' }}
                className="max-w-full max-h-[72vh] object-contain transition-transform duration-150"
              />
            </div>

            <div className="px-4 py-2.5 bg-slate-900 border-t border-slate-800 text-xs text-slate-300 flex items-center justify-between">
              <span>Nguyên tắc bảo toàn: Hình ảnh trích xuất trực tiếp từ XObject PDF gốc (không qua vẽ lại bằng AI).</span>
              <span className="font-mono text-teal-400">Mã hình: {image.id}</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
