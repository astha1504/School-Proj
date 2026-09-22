'use client';
import React, { useState } from 'react';
import { Sidebar } from './Sidebar';
import { Navbar } from './Navbar';
import { useApp } from '../../context/AppContext';

export const AppLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { activeTier } = useApp();

  const getTierBanner = () => {
    switch (activeTier) {
      case 'primary':
        return {
          title: 'Primary School Portal Active',
          sub: 'Nursery 1-2 & Basic 1-6 Classes • Terminal Report Cards • Psychomotor Domain Ratings',
          bg: 'bg-amber-500 text-amber-950 border-amber-600'
        };
      case 'junior_sec':
        return {
          title: 'Junior Secondary School (JSS 1 - 3) Active',
          sub: 'NERDC Basic Education Curriculum • Continuous Assessment • BECE Certification Tracking',
          bg: 'bg-cyan-600 text-white border-cyan-700'
        };
      case 'senior_sec':
        return {
          title: 'Senior Secondary School (SSS 1 - 3) Active',
          sub: 'Science, Arts, & Commercial Streams • WAEC & NECO Standard Grading (A1 - F9) • Mock CBT',
          bg: 'bg-indigo-700 text-white border-indigo-800'
        };
      case 'tertiary':
        return {
          title: 'Tertiary Collegiate / University Section Active',
          sub: 'Faculties & Departments • 100L - 500L • Semester Credit Units • 5.0 CGPA Transcript Engine',
          bg: 'bg-blue-800 text-white border-blue-900'
        };
      case 'sub_program':
        return {
          title: 'Sub-Programs & Special Academic Wings Active',
          sub: 'IJMB / JUPEB Remedial A-Levels • Executive Professional Diplomas • Vocational Cohorts',
          bg: 'bg-emerald-700 text-white border-emerald-800'
        };
      default:
        return null;
    }
  };

  const banner = getTierBanner();

  return (
    <div className="min-h-screen flex bg-slate-50 text-slate-900 font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Dynamic Sidebar */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main Content Shell */}
      <div className="flex-1 flex flex-col min-w-0">
        <Navbar onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

        {/* Informative Tier Switcher Banner if specific tier selected */}
        {banner && (
          <div className={`px-4 py-2 text-xs flex items-center justify-between shadow-xs border-b ${banner.bg}`}>
            <div className="flex items-center space-x-2">
              <span className="font-bold tracking-wide">{banner.title}</span>
              <span className="opacity-80 hidden sm:inline">• {banner.sub}</span>
            </div>
            <span className="text-[10px] font-mono uppercase bg-black/15 px-2 py-0.5 rounded">
              Active Scope
            </span>
          </div>
        )}

        {/* Page Content Viewport */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
};
