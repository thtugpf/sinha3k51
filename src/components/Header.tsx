import React from 'react';
import {
  BookOpen,
  Brain,
  ClipboardCheck,
  BarChart3,
  Database,
  Home,
  Volume2,
  VolumeX,
  Dna,
} from 'lucide-react';

export type AppView =
  | 'home'
  | 'theory'
  | 'practice'
  | 'exam'
  | 'results'
  | 'progress'
  | 'audit';

interface HeaderProps {
  activeView: AppView;
  onNavigate: (view: AppView) => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
  completedCount: number;
  totalQuestions: number;
}

export const Header: React.FC<HeaderProps> = ({
  activeView,
  onNavigate,
  soundEnabled,
  onToggleSound,
  completedCount,
  totalQuestions,
}) => {
  const navItems: { id: AppView; label: string; icon: React.ReactNode }[] = [
    { id: 'home', label: 'Trang chủ', icon: <Home className="w-4 h-4" /> },
    { id: 'theory', label: 'Học lý thuyết', icon: <BookOpen className="w-4 h-4" /> },
    { id: 'practice', label: 'Luyện tập', icon: <Brain className="w-4 h-4" /> },
    { id: 'exam', label: 'Kiểm tra', icon: <ClipboardCheck className="w-4 h-4" /> },
    { id: 'progress', label: 'Tiến độ & Ngân hàng', icon: <BarChart3 className="w-4 h-4" /> },
    { id: 'audit', label: 'Dữ liệu nguồn PDF', icon: <Database className="w-4 h-4" /> },
  ];

  return (
    <header className="sticky top-0 z-40 bg-slate-900 text-white border-b border-slate-800 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16 gap-3">
          <button
            type="button"
            onClick={() => onNavigate('home')}
            className="flex items-center gap-2.5 text-left group cursor-pointer focus:outline-none"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-500 to-emerald-600 flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform">
              <Dna className="w-6 h-6 text-white animate-pulse" />
            </div>
            <div>
              <div className="font-extrabold tracking-tight text-sm sm:text-base text-white flex items-center gap-1.5">
                <span>BIOLOGY MASTER 12</span>
                <span className="hidden md:inline-block text-[11px] font-mono uppercase px-1.5 py-0.5 rounded bg-teal-500/20 text-teal-300 border border-teal-500/30">
                  THPT 2025
                </span>
              </div>
              <p className="text-[11px] text-slate-300 hidden sm:block">
                Chinh phục kỳ thi Sinh học · 100% Dữ liệu & Hình gốc PDF
              </p>
            </div>
          </button>

          <nav className="hidden lg:flex items-center gap-1" aria-label="Điều hướng chính">
            {navItems.map((item) => {
              const isActive =
                activeView === item.id || (activeView === 'results' && item.id === 'exam');
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => onNavigate(item.id)}
                  className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                    isActive
                      ? 'bg-teal-600 text-white shadow-xs'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          <div className="flex items-center gap-2">
            <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-800 border border-slate-700 text-xs font-mono text-teal-300">
              <span>Đã làm:</span>
              <strong>
                {completedCount}/{totalQuestions}
              </strong>
            </div>

            <button
              type="button"
              onClick={onToggleSound}
              className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-colors cursor-pointer ${
                soundEnabled
                  ? 'bg-slate-800 border-teal-500/40 text-teal-300 hover:bg-slate-700'
                  : 'bg-slate-800/60 border-slate-700 text-slate-400 hover:bg-slate-800'
              }`}
              aria-label={soundEnabled ? 'Tắt âm thanh phản hồi' : 'Bật âm thanh phản hồi'}
              title={soundEnabled ? 'Âm thanh đang BẬT' : 'Âm thanh đang TẮT'}
            >
              {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
              <span className="hidden md:inline">{soundEnabled ? 'Âm thanh: Bật' : 'Âm thanh: Tắt'}</span>
            </button>
          </div>
        </div>

        {/* Mobile navigation bar */}
        <nav
          className="flex lg:hidden items-center gap-1 overflow-x-auto py-2 border-t border-slate-800/80 no-scrollbar"
          aria-label="Điều hướng di động"
        >
          {navItems.map((item) => {
            const isActive =
              activeView === item.id || (activeView === 'results' && item.id === 'exam');
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onNavigate(item.id)}
                className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                  isActive
                    ? 'bg-teal-600 text-white'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800'
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
};
