import React, { useEffect, useRef } from 'react';
import { FileText, Eye } from 'lucide-react';
import { invoiceDocPages, grantDocPages } from '../data/mockData';

const DocumentViewer = ({ mode, selectedField, selectedFieldId }) => {
  const viewerRef = useRef(null);
  const pages = mode === 'invoice' ? invoiceDocPages : grantDocPages;

  useEffect(() => {
    if (!viewerRef.current) return;

    // Remove active class from all highlight spans
    viewerRef.current.querySelectorAll('.highlight-text').forEach(el => {
      el.classList.remove('active');
    });

    if (selectedFieldId) {
      const target = viewerRef.current.querySelector(`[data-field-id="${selectedFieldId}"]`);
      if (target) {
        void target.offsetWidth; // force reflow to restart animation
        target.classList.add('active');
        setTimeout(() => {
          target.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 60);
      }
    }
  }, [selectedFieldId]);

  const renderParts = (parts) =>
    parts.map((part, i) =>
      part.fieldId ? (
        <span
          key={i}
          data-field-id={part.fieldId}
          className={`highlight-text ${part.fieldId === selectedFieldId ? 'active' : ''}`}
        >
          {part.text}
        </span>
      ) : (
        <span key={i}>{part.text}</span>
      )
    );

  const renderBlock = (block, idx) => {
    switch (block.type) {
      case 'company-name':
        return (
          <div key={idx} className="text-base font-bold text-slate-900 tracking-tight">
            {block.text}
          </div>
        );
      case 'company-detail':
        return (
          <div key={idx} className="text-xs text-slate-500 mt-0.5 leading-relaxed">
            {block.text}
          </div>
        );
      case 'gov-header':
        return (
          <div key={idx} className="text-[10px] font-bold uppercase tracking-widest text-slate-400 text-center">
            {block.text}
          </div>
        );
      case 'doc-title':
        return (
          <div key={idx} className="text-sm font-bold text-slate-900 text-center leading-snug py-2 px-2">
            {renderParts(block.parts)}
          </div>
        );
      case 'agency':
        return (
          <div key={idx} className="text-sm font-semibold text-slate-700 text-center">
            {renderParts(block.parts)}
          </div>
        );
      case 'divider':
        return <hr key={idx} className="border-slate-200 my-3" />;
      case 'spacer':
        return <div key={idx} className="h-3" />;
      case 'section-label':
        return (
          <div key={idx} className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mt-3 mb-1.5">
            {block.text}
          </div>
        );
      case 'mixed-para':
        return (
          <p key={idx} className="text-xs text-slate-700 leading-relaxed">
            {renderParts(block.parts)}
          </p>
        );
      case 'note-block':
        return (
          <div key={idx} className="bg-amber-50 border-l-2 border-amber-300 pl-3 py-2 pr-2 mt-1 rounded-r-sm">
            <p className="text-xs text-slate-600 leading-relaxed italic">
              {renderParts(block.parts)}
            </p>
          </div>
        );
      case 'article-header':
        return (
          <div key={idx} className="text-[10px] font-bold uppercase tracking-wide text-slate-600 mt-4 mb-1.5 pb-1 border-b border-slate-100">
            {block.text}
          </div>
        );
      case 'items-table':
        return (
          <div key={idx} className="mt-1.5 mb-2">
            <table className="w-full text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="text-left py-1.5 px-2 text-slate-500 font-semibold">Description</th>
                  <th className="text-center py-1.5 px-2 text-slate-500 font-semibold">Qty</th>
                  <th className="text-center py-1.5 px-2 text-slate-500 font-semibold">Unit</th>
                  <th className="text-right py-1.5 px-2 text-slate-500 font-semibold">Amount</th>
                </tr>
              </thead>
              <tbody>
                {block.items.map((item, ii) => (
                  <tr key={ii} className="border-b border-slate-100">
                    <td className="py-1.5 px-2 text-slate-700">{item.description}</td>
                    <td className="py-1.5 px-2 text-center text-slate-700">{item.qty}</td>
                    <td className="py-1.5 px-2 text-center text-slate-700">{item.unit}</td>
                    <td className="py-1.5 px-2 text-right text-slate-700 font-medium">{item.amount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      case 'total-line':
        return (
          <div key={idx} className="text-sm font-bold text-slate-900 pt-2">
            {renderParts(block.parts)}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="h-full flex flex-col" data-testid="document-viewer">
      {/* Viewer header */}
      <div className="flex-shrink-0 bg-white border-b border-slate-200 px-5 py-3">
        <div className="flex items-center gap-2 flex-wrap">
          <FileText className="w-4 h-4 text-slate-400 flex-shrink-0" />
          <span className="text-sm font-semibold text-slate-700">Original Document</span>
          {selectedField && (
            <>
              <span className="text-slate-300 mx-0.5">·</span>
              <span
                className="text-xs font-bold uppercase tracking-wider text-amber-600"
                data-testid="viewer-field-label"
              >
                {selectedField.fieldLabel}
              </span>
              <span className="text-slate-300 mx-0.5">·</span>
              <span className="text-xs text-slate-400 font-medium">
                Page {selectedField.page}
              </span>
            </>
          )}
        </div>

        {selectedField ? (
          <div className="mt-1 text-xs text-slate-500 flex items-baseline gap-1 flex-wrap">
            <span>Matched text:</span>
            <span
              className="font-mono text-slate-700 bg-slate-100 px-1.5 py-0.5 rounded text-[11px]"
              data-testid="viewer-matched-text"
            >
              "{selectedField.matchedText}"
            </span>
          </div>
        ) : (
          <div className="mt-1 text-xs text-slate-400 flex items-center gap-1">
            <Eye className="w-3 h-3 flex-shrink-0" />
            Click "View" on any row to highlight the source in this document
          </div>
        )}
      </div>

      {/* Document pages */}
      <div
        ref={viewerRef}
        className="flex-1 overflow-y-auto p-5 bg-slate-50"
        data-testid="document-content"
      >
        {pages.map((page, pageIdx) => {
          const prevPage = pages[pageIdx - 1];
          const hasGap = prevPage && page.pageNumber - prevPage.pageNumber > 1;
          return (
            <React.Fragment key={page.pageNumber}>
              {hasGap && (
                <div className="flex items-center gap-3 my-3 opacity-60">
                  <div className="h-px flex-1 bg-slate-300" />
                  <span className="text-[10px] text-slate-400">
                    pages {prevPage.pageNumber + 1}–{page.pageNumber - 1} omitted
                  </span>
                  <div className="h-px flex-1 bg-slate-300" />
                </div>
              )}

              <div className="mb-7">
                {/* Page label */}
                <div className="flex items-center gap-3 mb-2.5">
                  <div className="h-px flex-1 bg-slate-300" />
                  <span className="text-[10px] text-slate-400 font-semibold bg-slate-50 px-2.5 py-0.5 rounded-full border border-slate-200 uppercase tracking-wider">
                    Page {page.pageNumber}
                  </span>
                  <div className="h-px flex-1 bg-slate-300" />
                </div>

                {/* Paper document */}
                <div className="bg-white shadow-md border border-slate-200 rounded p-8 max-w-lg mx-auto font-serif text-slate-800">
                  {page.blocks.map((block, bIdx) => renderBlock(block, bIdx))}
                </div>
              </div>
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};

export default DocumentViewer;
