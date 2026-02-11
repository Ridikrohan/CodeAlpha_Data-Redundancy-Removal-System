
import React from 'react';
import { DataEntry, EntryStatus } from '../types';

interface Props {
  entries: DataEntry[];
}

const StatusBadge: React.FC<{ status: EntryStatus }> = ({ status }) => {
  const styles = {
    [EntryStatus.VERIFIED]: 'bg-emerald-100 text-emerald-700 border-emerald-200',
    [EntryStatus.REDUNDANT]: 'bg-amber-100 text-amber-700 border-amber-200',
    [EntryStatus.FALSE_POSITIVE]: 'bg-rose-100 text-rose-700 border-rose-200',
    [EntryStatus.PENDING]: 'bg-slate-100 text-slate-700 border-slate-200',
  };

  return (
    <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${styles[status]}`}>
      {status}
    </span>
  );
};

export const DataLogTable: React.FC<Props> = ({ entries }) => {
  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
        <h2 className="font-semibold text-slate-800">Processing Activity Log</h2>
        <span className="text-xs text-slate-500 font-medium">{entries.length} items logged</span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 text-slate-500 text-xs font-bold uppercase tracking-wider">
              <th className="px-6 py-3">Timestamp</th>
              <th className="px-6 py-3">Content Preview</th>
              <th className="px-6 py-3">Status</th>
              <th className="px-6 py-3">Source</th>
              <th className="px-6 py-3">Reason / Insight</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {entries.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-10 text-center text-slate-400 italic">
                  No data entries processed yet.
                </td>
              </tr>
            ) : (
              [...entries].reverse().map((entry) => (
                <tr key={entry.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4 text-xs text-slate-500 whitespace-nowrap">
                    {new Date(entry.timestamp).toLocaleTimeString()}
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-slate-900 max-w-xs truncate" title={entry.content}>
                      {entry.content}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <StatusBadge status={entry.status} />
                  </td>
                  <td className="px-6 py-4 text-xs text-slate-500">
                    {entry.source}
                  </td>
                  <td className="px-6 py-4 text-xs text-slate-600 italic">
                    {entry.reason || '-'}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
