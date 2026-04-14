import React from 'react';

const ExtractionRow = ({ field, editedValue, onEdit, onView, isSelected }) => {
  return (
    <div
      className={`grid items-center px-4 py-3.5 hover:bg-slate-50/70 transition-all duration-150 ${
        isSelected
          ? 'bg-amber-50 border-l-[3px] border-amber-500'
          : 'border-l-[3px] border-transparent'
      }`}
      style={{ gridTemplateColumns: '1fr 110px 1fr' }}
      data-testid={`extraction-row-${field.id}`}
    >
      {/* Left: Source sentence */}
      <div className="pr-5">
        <p className="text-xs text-slate-500 italic border-l-2 border-slate-200 pl-2.5 leading-relaxed line-clamp-3">
          {field.sourceSentence}
        </p>
      </div>

      {/* Center: View button */}
      <div className="flex items-center justify-center px-2">
        <button
          onClick={onView}
          data-testid={`view-btn-${field.id}`}
          className={`border px-3 py-1.5 rounded text-xs font-medium transition-all duration-150 whitespace-nowrap ${
            isSelected
              ? 'border-amber-500 text-amber-600 bg-amber-50'
              : 'border-slate-300 text-slate-600 hover:border-amber-500 hover:text-amber-600 hover:bg-amber-50'
          }`}
          aria-label={`View source for ${field.fieldLabel}`}
        >
          View
        </button>
      </div>

      {/* Right: Field label + editable input */}
      <div className="pl-4 border-l border-slate-100">
        <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-0.5">
          {field.fieldLabel}
        </p>
        <p className="text-[10px] text-slate-400 mb-1.5">Identified Text:</p>
        <input
          type="text"
          value={editedValue}
          onChange={e => onEdit(e.target.value)}
          data-testid={`input-${field.id}`}
          aria-label={`Extracted value for ${field.fieldLabel}`}
          className="w-full bg-white border border-slate-200 rounded px-2 py-1.5 text-sm font-semibold text-slate-900 font-mono focus:border-amber-500 focus:ring-1 focus:ring-amber-500/30 outline-none transition-all hover:border-slate-300"
        />
      </div>
    </div>
  );
};

export default ExtractionRow;
