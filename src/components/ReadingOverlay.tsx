import React from 'react';
import { LectureContent } from '../types';
import { X, BookOpen, VolumeX } from 'lucide-react';

interface ReadingOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  lecture?: LectureContent;
}

export const ReadingOverlay: React.FC<ReadingOverlayProps> = ({
  isOpen,
  onClose,
  lecture,
}) => {
  if (!isOpen || !lecture) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[85vh] flex flex-col overflow-hidden border border-amber-200/80 animate-in fade-in zoom-in-95 duration-200">
        {/* Modal Header */}
        <div className="bg-amber-500 text-white p-4 sm:p-5 flex items-center justify-between shadow-sm">
          <div className="flex items-center space-x-2.5">
            <BookOpen className="w-5 h-5 text-amber-100" />
            <div>
              <h2 className="text-base sm:text-lg font-bold leading-tight">{lecture.title}</h2>
              <p className="text-[11px] text-amber-100 flex items-center gap-1 mt-0.5">
                <VolumeX className="w-3 h-3" />
                <span>La interacción por voz se pausó mientras lees</span>
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-amber-600/80 hover:bg-amber-700 text-white transition-colors"
            title="Cerrar lectura"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-4 text-slate-800 text-sm leading-relaxed">
          {lecture.content.split('\n\n').map((paragraph, idx) => {
            if (paragraph.startsWith('# ')) {
              return (
                <h1 key={idx} className="text-xl font-extrabold text-amber-900 border-b border-amber-200 pb-2 mt-2">
                  {paragraph.replace('# ', '')}
                </h1>
              );
            }
            if (paragraph.startsWith('## ')) {
              return (
                <h2 key={idx} className="text-base font-bold text-slate-900 mt-4 mb-1">
                  {paragraph.replace('## ', '')}
                </h2>
              );
            }
            if (paragraph.startsWith('- ')) {
              return (
                <ul key={idx} className="list-disc list-inside space-y-1 bg-amber-50/50 p-3 rounded-xl border border-amber-200/50 text-xs sm:text-sm">
                  {paragraph.split('\n').map((item, itemIdx) => (
                    <li key={itemIdx} className="text-slate-700">
                      {item.replace('- ', '')}
                    </li>
                  ))}
                </ul>
              );
            }
            return (
              <p key={idx} className="text-slate-700 text-sm">
                {paragraph}
              </p>
            );
          })}
        </div>

        {/* Modal Footer */}
        <div className="bg-slate-50 border-t border-slate-200 p-4 flex justify-end">
          <button
            onClick={onClose}
            className="bg-amber-600 hover:bg-amber-700 text-white font-semibold text-xs px-5 py-2.5 rounded-xl transition-all shadow-sm"
          >
            Entendido, volver a la lección
          </button>
        </div>
      </div>
    </div>
  );
};
