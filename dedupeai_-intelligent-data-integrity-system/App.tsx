
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { DataEntry, EntryStatus, Stats } from './types';
import { StatsCards } from './components/StatsCards';
import { DataInputForm } from './components/DataInputForm';
import { DataLogTable } from './components/DataLogTable';
import { classifyData } from './services/geminiService';

const INITIAL_DATA: DataEntry[] = [
  {
    id: '1',
    content: 'User login attempt from IP 192.168.1.1',
    source: 'Auth-System',
    timestamp: Date.now() - 3600000,
    status: EntryStatus.VERIFIED,
    reason: 'Initial baseline record.'
  },
  {
    id: '2',
    content: 'Database backup completed successfully at 02:00 AM',
    source: 'Cron-Service',
    timestamp: Date.now() - 7200000,
    status: EntryStatus.VERIFIED,
    reason: 'Initial baseline record.'
  },
  {
    id: '3',
    content: 'asdfasdfasdf 123456 !!!',
    source: 'Log-Aggregator',
    timestamp: Date.now() - 10800000,
    status: EntryStatus.FALSE_POSITIVE,
    reason: 'Classified as noise/gibberish during ingest.'
  }
];

const App: React.FC = () => {
  const [entries, setEntries] = useState<DataEntry[]>(INITIAL_DATA);
  const [loading, setLoading] = useState(false);

  // Derived stats
  const stats = useMemo<Stats>(() => {
    return entries.reduce((acc, entry) => {
      acc.total++;
      if (entry.status === EntryStatus.VERIFIED) acc.verified++;
      if (entry.status === EntryStatus.REDUNDANT) acc.redundant++;
      if (entry.status === EntryStatus.FALSE_POSITIVE) acc.falsePositives++;
      return acc;
    }, { total: 0, verified: 0, redundant: 0, falsePositives: 0 });
  }, [entries]);

  const handleAddData = useCallback(async (content: string, source: string) => {
    setLoading(true);
    try {
      // 1. Check for exact matches locally first (Optimization)
      const exactMatch = entries.find(e => e.content.trim().toLowerCase() === content.trim().toLowerCase());
      
      let finalStatus: EntryStatus;
      let reason: string;

      if (exactMatch) {
        finalStatus = EntryStatus.REDUNDANT;
        reason = 'Exact string match found in existing records.';
      } else {
        // 2. Use Gemini for Semantic and False Positive detection
        const classification = await classifyData(content, entries);
        finalStatus = classification.status;
        reason = classification.reason;
      }

      const newEntry: DataEntry = {
        id: crypto.randomUUID(),
        content,
        source,
        timestamp: Date.now(),
        status: finalStatus,
        reason
      };

      setEntries(prev => [...prev, newEntry]);
    } catch (error) {
      console.error("Processing failed", error);
    } finally {
      setLoading(false);
    }
  }, [entries]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-20">
      {/* Navigation / Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">D</div>
              <h1 className="text-xl font-bold text-slate-900">DedupeAI <span className="text-blue-600 text-sm font-medium px-2 py-0.5 bg-blue-50 rounded-full ml-1">v1.0</span></h1>
            </div>
            <div className="flex items-center gap-4">
              <span className="hidden sm:inline text-sm text-slate-500">Intelligent Data Integrity Engine</span>
              <div className="w-8 h-8 rounded-full bg-slate-200 border border-slate-300"></div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        <div className="flex flex-col gap-8">
          {/* Welcome Section */}
          <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-1">Database Health Overview</h2>
            <p className="text-slate-500 mb-6">Real-time monitoring of unique entries vs. filtered redundancy.</p>
            <StatsCards stats={stats} />
          </section>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Input Form Area */}
            <div className="lg:col-span-4 space-y-6">
              <DataInputForm onAdd={handleAddData} isLoading={loading} />
              <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4">System Capability</h3>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3 text-sm text-slate-600">
                    <span className="w-5 h-5 bg-blue-100 text-blue-600 rounded-full flex-shrink-0 flex items-center justify-center text-[10px]">1</span>
                    <span><strong>Semantic Detection:</strong> Identifies records that mean the same thing but use different words.</span>
                  </li>
                  <li className="flex items-start gap-3 text-sm text-slate-600">
                    <span className="w-5 h-5 bg-blue-100 text-blue-600 rounded-full flex-shrink-0 flex items-center justify-center text-[10px]">2</span>
                    <span><strong>Noise Filtering:</strong> Automatically blocks gibberish or non-sensical data streams.</span>
                  </li>
                  <li className="flex items-start gap-3 text-sm text-slate-600">
                    <span className="w-5 h-5 bg-blue-100 text-blue-600 rounded-full flex-shrink-0 flex items-center justify-center text-[10px]">3</span>
                    <span><strong>Integrity Check:</strong> Only appends "Verified" unique entries to the production database.</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Logs Area */}
            <div className="lg:col-span-8">
              <DataLogTable entries={entries} />
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 py-3 px-8 flex justify-between items-center z-10">
        <div className="text-xs text-slate-500 font-medium flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
          System Live & Synchronized
        </div>
        <div className="text-xs text-slate-400">
          Powered by Gemini 3 Flash Preview
        </div>
      </footer>
    </div>
  );
};

export default App;
