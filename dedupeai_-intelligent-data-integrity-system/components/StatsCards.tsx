
import React from 'react';
import { Stats } from '../types';
import { CheckCircle, Copy, AlertTriangle, Database } from 'lucide-react';

// Lucide React doesn't exist in this env, using SVG versions
const VerifiedIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-emerald-500"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>;
const RedundantIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-amber-500"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"></rect><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"></path></svg>;
const FalsePositiveIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-rose-500"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>;
const TotalIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-500"><ellipse cx="12" cy="5" rx="9" ry="3"></ellipse><path d="M3 5V19A9 3 0 0 0 21 19V5"></path><path d="M3 12A9 3 0 0 0 21 12"></path></svg>;

interface Props {
  stats: Stats;
}

export const StatsCards: React.FC<Props> = ({ stats }) => {
  const cards = [
    { title: 'Total Processed', value: stats.total, icon: <TotalIcon />, color: 'bg-blue-50' },
    { title: 'Verified Entries', value: stats.verified, icon: <VerifiedIcon />, color: 'bg-emerald-50' },
    { title: 'Redundant Blocked', value: stats.redundant, icon: <RedundantIcon />, color: 'bg-amber-50' },
    { title: 'False Positives', value: stats.falsePositives, icon: <FalsePositiveIcon />, color: 'bg-rose-50' },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {cards.map((card, idx) => (
        <div key={idx} className={`${card.color} p-6 rounded-xl border border-white shadow-sm flex items-center space-x-4`}>
          <div className="p-3 bg-white rounded-lg shadow-sm">
            {card.icon}
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">{card.title}</p>
            <p className="text-2xl font-bold text-slate-900">{card.value}</p>
          </div>
        </div>
      ))}
    </div>
  );
};
