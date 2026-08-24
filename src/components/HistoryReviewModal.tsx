import React, { useState } from 'react';
import { ScriptStep, ResponseHistoryItem } from '../types';
import { X, Download, RotateCcw, Edit3, Save, Check } from 'lucide-react';

interface HistoryReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  steps: ScriptStep[];
  history: ResponseHistoryItem[];
  onUpdateHistoryItem: (stepId: string, text: string) => void;
  onResetHistory: () => void;
}

export const HistoryReviewModal: React.FC<HistoryReviewModalProps> = ({
  isOpen,
  onClose,
  steps,
  history,
  onUpdateHistoryItem,
  onResetHistory,
}) => {
  const [editingStepId, setEditingStepId] = useState<string | null>(null);
  const [editText, setEditText] = useState<string>('');

  if (!isOpen) return null;

  const handleStartEdit = (stepId: string, currentText: string) => {
    setEditingStepId(stepId);
    setEditText(currentText);
  };

  const handleSaveEdit = (stepId: string) => {
    if (editText.trim()) {
      onUpdateHistoryItem(stepId, editText.trim());
      setEditingStepId(null);
      setEditText('');
    }
  };

  const handleExportJSON = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(history, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `clio_respuestas_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleExportCSV = () => {
    let csvContent = 'data:text/csv;charset=utf-8,Paso,Pregunta,Respuesta,Fecha\n';
    history.forEach((item) => {
      const step = steps.find((s) => s.id === item.stepId);
      const promptClean = (step?.prompt || item.stepId).replace(/"/g, '""');
      const responseClean = item.transcript.replace(/"/g, '""');
      const date = item.timestamp ? new Date(item.timestamp).toLocaleString() : '';
      csvContent += `"${item.stepId}","${promptClean}","${responseClean}","${date}"\n`;
    });

    const encodedUri = encodeURI(csvContent);
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', encodedUri);
    downloadAnchor.setAttribute('download', `clio_respuestas_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[85vh] flex flex-col overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="bg-slate-900 text-white p-4 sm:p-5 flex items-center justify-between">
          <div>
            <h2 className="text-base sm:text-lg font-bold">Historial de Respuestas</h2>
            <p className="text-xs text-slate-300">Revisa y edita tus respuestas de la lección actual</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 overflow-y-auto space-y-4 flex-1">
          {history.length === 0 ? (
            <div className="text-center py-8 text-slate-500">
              <p className="text-sm">Aún no has respondido ninguna pregunta.</p>
            </div>
          ) : (
            history.map((item, index) => {
              const step = steps.find((s) => s.id === item.stepId);
              const isEditing = editingStepId === item.stepId;

              return (
                <div key={item.stepId} className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-xs sm:text-sm">
                  <div className="flex justify-between items-start mb-2">
                    <span className="font-bold text-slate-900">
                      #{index + 1}. {item.stepId}
                    </span>
                    {!isEditing && (
                      <button
                        onClick={() => handleStartEdit(item.stepId, item.transcript)}
                        className="text-amber-700 hover:text-amber-800 font-medium flex items-center space-x-1"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        <span className="text-xs">Editar</span>
                      </button>
                    )}
                  </div>

                  <p className="text-slate-600 mb-2 italic">
                    &quot;{step?.prompt || item.stepId}&quot;
                  </p>

                  {isEditing ? (
                    <div className="space-y-2 mt-2">
                      <textarea
                        value={editText}
                        onChange={(e) => setEditText(e.target.value)}
                        className="w-full text-xs p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 font-normal"
                        rows={3}
                      />
                      <div className="flex justify-end space-x-2">
                        <button
                          onClick={() => setEditingStepId(null)}
                          className="px-2.5 py-1 text-xs text-slate-600 hover:text-slate-800"
                        >
                          Cancelar
                        </button>
                        <button
                          onClick={() => handleSaveEdit(item.stepId)}
                          className="px-3 py-1 bg-amber-600 text-white rounded text-xs font-semibold flex items-center gap-1"
                        >
                          <Save className="w-3.5 h-3.5" />
                          <span>Guardar</span>
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-white p-3 border border-slate-200 rounded-lg text-slate-800 font-medium">
                      {item.transcript}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="bg-slate-50 border-t border-slate-200 p-4 flex flex-wrap justify-between items-center gap-2">
          <button
            onClick={onResetHistory}
            disabled={history.length === 0}
            className="text-xs text-red-600 hover:text-red-700 disabled:opacity-40 font-medium flex items-center space-x-1 px-2 py-1"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reiniciar Lección</span>
          </button>

          <div className="flex items-center space-x-2">
            <button
              onClick={handleExportCSV}
              disabled={history.length === 0}
              className="bg-slate-200 hover:bg-slate-300 disabled:opacity-40 text-slate-800 text-xs font-semibold px-3 py-2 rounded-lg flex items-center space-x-1"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Exportar CSV</span>
            </button>
            <button
              onClick={handleExportJSON}
              disabled={history.length === 0}
              className="bg-amber-600 hover:bg-amber-700 disabled:opacity-40 text-white text-xs font-semibold px-3 py-2 rounded-lg flex items-center space-x-1 shadow-sm"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Exportar JSON</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
