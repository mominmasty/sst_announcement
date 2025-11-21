import React, { useState } from 'react';

import { Button } from '../ui/button';
import type { AnalyticsStats } from '../../types';

interface AnalyticsModalProps {
  isOpen: boolean;
  onClose: () => void;
  stats: AnalyticsStats | null;
  loading?: boolean;
}

const AnalyticsModal: React.FC<AnalyticsModalProps> = ({
  isOpen,
  onClose,
  stats,
  loading = false,
}) => {
  if (!isOpen) return null;

  const [search, setSearch] = useState<string>('');
  const [sortOrder, setSortOrder] = useState<'desc' | 'asc'>('desc');

  const filteredAnnouncements = (stats?.top_announcements ?? []).filter((announcement) => {
    const matchesTitle = announcement.title.toLowerCase().includes(search.toLowerCase());
    return matchesTitle;
  }).sort((a, b) => sortOrder === 'desc' ? b.views - a.views : a.views - b.views);

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-black rounded-2xl border border-gray-900 shadow-2xl w-full max-w-2xl max-h-[80vh] overflow-y-auto custom-scrollbar-analytics m-4 animate-in zoom-in-95 slide-in-from-bottom-4 duration-300">
        <div className="p-6 border-b border-gray-900 bg-black flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center shadow-lg ring-2 ring-white/10">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-white">Analytics Dashboard</h2>
          </div>
          <Button
            variant="ghost"
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors p-2 hover:bg-gray-900 rounded-lg"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </Button>
        </div>

        <div className="p-6">
          {loading ? (
            <div className="py-10 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="h-24 rounded-xl bg-white/5 animate-pulse" />
                <div className="h-24 rounded-xl bg-white/5 animate-pulse" />
                <div className="h-24 rounded-xl bg-white/5 animate-pulse" />
              </div>
              <div className="space-y-2">
                <div className="h-4 w-40 bg-white/5 rounded animate-pulse" />
                <div className="h-16 rounded-xl bg-white/5 animate-pulse" />
                <div className="h-16 rounded-xl bg-white/5 animate-pulse" />
              </div>
            </div>
          ) : stats ? (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="bg-black/70 rounded-xl p-6 border border-gray-800 ring-1 ring-white/5 shadow-sm hover:border-gray-700 hover:bg-gray-900/40 transition-colors">
                  <div className="text-4xl font-extrabold tracking-tight text-blue-400 mb-2">
                    {stats.total_announcements}
                  </div>
                  <div className="text-sm text-gray-400">Total Announcements</div>
                </div>
                <div className="bg-black/70 rounded-xl p-6 border border-gray-800 ring-1 ring-white/5 shadow-sm hover:border-gray-700 hover:bg-gray-900/40 transition-colors">
                  <div className="text-4xl font-extrabold tracking-tight text-emerald-400 mb-2">
                    {stats.total_users}
                  </div>
                  <div className="text-sm text-gray-400">Total Users</div>
                </div>
                <div className="bg-black/70 rounded-xl p-6 border border-gray-800 ring-1 ring-white/5 shadow-sm hover:border-gray-700 hover:bg-gray-900/40 transition-colors">
                  <div className="text-4xl font-extrabold tracking-tight text-cyan-400 mb-2">
                    {stats.active_users}
                  </div>
                  <div className="text-sm text-gray-400">Active Users</div>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-bold text-white mb-2">Top Announcements</h3>
                <p className="text-sm text-gray-500 mb-4">Search and sort by views to explore performance.</p>
                <div className="flex flex-col md:flex-row gap-3 mb-4">
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search by title..."
                    className="w-full md:flex-1 px-4 py-2.5 bg-black/70 border border-gray-800 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-600/40 focus:border-blue-600/40"
                  />
                
                  <select
                    value={sortOrder}
                    onChange={(e) => setSortOrder(e.target.value as 'desc' | 'asc')}
                    className="w-full md:w-40 px-4 py-2.5 bg-black/70 border border-gray-800 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-600/40 focus:border-purple-600/40"
                  >
                    <option value="desc" className="bg-black">DESC</option>
                    <option value="asc" className="bg-black">ASC</option>
                  </select>
                </div>
                <div className="space-y-2">
                  {filteredAnnouncements.length > 0 ? (
                    filteredAnnouncements.map((announcement, index) => (
                      <div
                        key={announcement.id}
                        className="bg-black/70 rounded-lg p-4 border border-gray-800 flex items-center justify-between hover:bg-gray-900/40 hover:border-gray-700 transition-colors"
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold shadow">
                            {index + 1}
                          </div>
                          <div>
                            <div className="text-white font-medium">{announcement.title}</div>
                            <div className="text-sm text-gray-400">{announcement.views} views</div>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-gray-400 text-center py-4">No results</div>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center py-12">
              <div className="text-gray-400">No analytics data available</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AnalyticsModal;
