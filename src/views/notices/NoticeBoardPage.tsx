'use client';
import React, { useState } from 'react';
import { 
  Bell, 
  Plus, 
  Calendar, 
  User, 
  Tag, 
  AlertCircle,
  FileText,
  CheckCircle2
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Announcement, EducationalTier } from '../../types';

export const NoticeBoardPage: React.FC = () => {
  const { announcements, addAnnouncement, activeTier } = useApp();
  const [showAddModal, setShowAddModal] = useState(false);

  // New Notice Form
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [targetTier, setTargetTier] = useState<EducationalTier | 'all' | 'parents'>('all');
  const [priority, setPriority] = useState<'normal' | 'important' | 'urgent'>('important');
  const [author, setAuthor] = useState('Office of the Principal');

  const filtered = announcements.filter(ann => {
    if (activeTier === 'all') return true;
    return ann.targetTier === 'all' || ann.targetTier === activeTier;
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    addAnnouncement({
      title,
      content,
      targetTier,
      priority,
      author,
      date: new Date().toISOString().split('T')[0]
    });

    setShowAddModal(false);
    setTitle('');
    setContent('');
  };

  return (
    <div className="space-y-6 font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="p-2 rounded-xl bg-amber-100 text-amber-700">
              <Bell className="w-5 h-5" />
            </span>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              Notice Board & Institutional Circulars
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Targeted announcements dispatched to parents, students, and academic departments.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-xs flex items-center space-x-2 shadow-md shadow-emerald-700/20"
        >
          <Plus className="w-4 h-4" />
          <span>Publish New Notice</span>
        </button>
      </div>

      {/* Notices Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((ann) => {
          const priorityBadges: Record<string, string> = {
            normal: 'bg-slate-100 text-slate-700',
            important: 'bg-amber-100 text-amber-800 border-amber-200',
            urgent: 'bg-rose-100 text-rose-800 border-rose-200'
          };

          return (
            <div 
              key={ann.id} 
              className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className={`text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full border ${priorityBadges[ann.priority]}`}>
                    {ann.priority} Notice
                  </span>
                  <span className="text-xs text-slate-400 flex items-center space-x-1">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{ann.date}</span>
                  </span>
                </div>

                <h3 className="text-base font-bold text-slate-900 leading-snug">{ann.title}</h3>
                <p className="text-xs text-slate-600 mt-2 leading-relaxed whitespace-pre-line">{ann.content}</p>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <div className="flex items-center space-x-1.5">
                  <User className="w-3.5 h-3.5 text-slate-400" />
                  <span className="font-semibold text-slate-700">{ann.author}</span>
                </div>

                <span className="text-[10px] font-bold uppercase bg-slate-100 text-slate-600 px-2 py-0.5 rounded">
                  Target: {ann.targetTier}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* CREATE NOTICE MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95">
            <div className="px-6 py-4 bg-emerald-50 border-b border-emerald-100 flex items-center justify-between">
              <div className="flex items-center space-x-2 text-emerald-800">
                <FileText className="w-5 h-5" />
                <h3 className="font-bold text-slate-900">Broadcast Official Notice</h3>
              </div>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 p-1">✕</button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Circular Title
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Schedule for Mid-Term Break & BECE Mock Exams"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-emerald-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Target Audience / Tier
                  </label>
                  <select
                    value={targetTier}
                    onChange={(e) => setTargetTier(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-emerald-600"
                  >
                    <option value="all">All Tiers & General Public</option>
                    <option value="parents">Parents & Guardians Only</option>
                    <option value="primary">Primary School Only</option>
                    <option value="junior_sec">Junior Secondary (JSS)</option>
                    <option value="senior_sec">Senior Secondary (SSS)</option>
                    <option value="tertiary">Tertiary Students</option>
                    <option value="sub_program">Sub-Programs (IJMB/Dipl)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Priority Level
                  </label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-emerald-600"
                  >
                    <option value="normal">Normal</option>
                    <option value="important">Important</option>
                    <option value="urgent">Urgent</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Issuing Authority
                </label>
                <input
                  type="text"
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  placeholder="e.g. Registrar / Head of School"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-emerald-600"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Notice Body & Instructions
                </label>
                <textarea
                  rows={4}
                  required
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Full text of the circular..."
                  className="w-full p-3 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-emerald-600"
                />
              </div>

              <div className="pt-3 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-semibold shadow-md shadow-emerald-700/20"
                >
                  Publish Notice
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
