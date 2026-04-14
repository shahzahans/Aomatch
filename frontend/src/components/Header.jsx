import React, { useState } from 'react';

function Header({
  fileName,
  totalFields,
  onUpload,
  onExportCSV,
  onExportJSON,
}) {
  const [exportOpen, setExportOpen] = useState(false);

  return (
    <header className="bg-[#142033] text-white border-b border-slate-700 px-6 py-4">
      <div className="flex items-center justify-between gap-6">
        <div className="flex items-center gap-4 min-w-0">
          <button className="text-xl text-slate-300 hover:text-white">←</button>

          <div className="text-3xl font-bold tracking-tight">AoMatch</div>

          <div className="w-px h-8 bg-slate-600" />

          <div className="min-w-0">
            <div className="text-[10px] uppercase tracking-widest text-slate-400">Document</div>
            <div className="text-sm text-slate-100 truncate max-w-[280px]">{fileName}</div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-4 py-2 rounded-full bg-amber-400 text-slate-900 text-xs font-bold uppercase tracking-widest">
            {totalFields} Fields Extracted
          </div>

          <button
            onClick={onUpload}
            className="px-4 py-2 rounded-lg border border-slate-500 text-white hover:bg-slate-800"
          >
            Upload Document
          </button>

          <div className="relative">
            <button
              onClick={() => setExportOpen((prev) => !prev)}
              className="px-4 py-2 rounded-lg bg-white text-slate-900 font-medium hover:bg-slate-100"
            >
              Export Data ▾
            </button>

            {exportOpen && (
              <div className="absolute right-0 mt-2 w-44 bg-white text-slate-900 rounded-xl shadow-lg border border-slate-200 z-50">
                <button
                  onClick={() => {
                    onExportCSV();
                    setExportOpen(false);
                  }}
                  className="w-full text-left px-4 py-3 hover:bg-slate-50 rounded-t-xl"
                >
                  Export CSV
                </button>
                <button
                  onClick={() => {
                    onExportJSON();
                    setExportOpen(false);
                  }}
                  className="w-full text-left px-4 py-3 hover:bg-slate-50 rounded-b-xl"
                >
                  Export JSON
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;