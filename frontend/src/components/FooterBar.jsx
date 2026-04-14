import React, { useState, useEffect } from 'react';

const FooterBar = ({ totalFields, avgConfidence, status, lastUpdated }) => {
  const [timeStr, setTimeStr] = useState('');

  useEffect(() => {
    const fmt = (d) => {
      const h = d.getHours() % 12 || 12;
      const m = String(d.getMinutes()).padStart(2, '0');
      const s = String(d.getSeconds()).padStart(2, '0');
      const ampm = d.getHours() >= 12 ? 'PM' : 'AM';
      return `${h}:${m}:${s} ${ampm}`;
    };
    setTimeStr(fmt(lastUpdated));
  }, [lastUpdated]);

  return (
    <footer
      className="h-10 bg-white border-t border-slate-200 flex items-center justify-between px-6 flex-shrink-0"
      data-testid="footer"
    >
      <div className="flex items-center gap-7">
        <div className="flex items-center gap-2" data-testid="footer-total-fields">
          <span className="text-[11px] text-slate-400">Total Fields</span>
          <span className="text-[11px] font-bold text-slate-700">{totalFields}</span>
        </div>
        <div className="flex items-center gap-2" data-testid="footer-avg-confidence">
          <span className="text-[11px] text-slate-400">Avg Confidence</span>
          <span className="text-[11px] font-bold text-slate-700">{avgConfidence}%</span>
        </div>
        <div className="flex items-center gap-2" data-testid="footer-status">
          <span className="text-[11px] text-slate-400">Status</span>
          <span className="text-[11px] font-bold text-emerald-500">{status}</span>
        </div>
      </div>
      <div className="text-[11px] text-slate-400" data-testid="footer-last-updated">
        Last updated: {timeStr}
      </div>
    </footer>
  );
};

export default FooterBar;
