'use client';
import React, { useState } from 'react';
import { 
  Settings as SettingsIcon, 
  Building2, 
  ShieldCheck, 
  Coins, 
  Award, 
  Save, 
  CheckCircle2,
  Lock,
  Globe
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const SettingsPage: React.FC = () => {
  const { settings, updateSettings, resetDatabaseToCleanState, currentUser } = useApp();

  const [schoolName, setSchoolName] = useState(settings.schoolName);
  const [motto, setMotto] = useState(settings.motto);
  const [address, setAddress] = useState(settings.address);
  const [phone, setPhone] = useState(settings.phone);
  const [email, setEmail] = useState(settings.email);
  const [currentSession, setCurrentSession] = useState(settings.currentSession);
  const [currentTermOrSemester, setCurrentTermOrSemester] = useState(settings.currentTermOrSemester);
  const [tertiaryGradingSystem, setTertiaryGradingSystem] = useState(settings.tertiaryGradingSystem);
  const [saved, setSaved] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings({
      schoolName,
      motto,
      address,
      phone,
      email,
      currentSession,
      currentTermOrSemester,
      tertiaryGradingSystem
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="space-y-6 font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="p-2 rounded-xl bg-slate-100 text-slate-700">
              <SettingsIcon className="w-5 h-5" />
            </span>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              Institutional Settings & System Configuration
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Configure Nigerian academic calendars, official branding, and grading parameters.
          </p>
        </div>
      </div>

      {saved && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs font-bold text-emerald-800 flex items-center space-x-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4" />
          <span>Institutional configurations updated successfully across all school modules.</span>
        </div>
      )}

      {/* Settings Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* General Identity & Branding */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center space-x-2 border-b border-slate-100 pb-3">
            <Building2 className="w-4 h-4 text-emerald-700" />
            <h3 className="text-sm font-bold text-slate-900">Institutional Identity & Official Branding</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Official Registered School Name
              </label>
              <input
                type="text"
                required
                value={schoolName}
                onChange={(e) => setSchoolName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-emerald-600 font-semibold"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 uppercase tracking-wider mb-1">
                School Motto / Slogan
              </label>
              <input
                type="text"
                required
                value={motto}
                onChange={(e) => setMotto(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-emerald-600"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Physical Campus Address
              </label>
              <input
                type="text"
                required
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-emerald-600"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Official Registrar Phone Numbers
              </label>
              <input
                type="text"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-emerald-600"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Official Contact Email
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-emerald-600"
              />
            </div>
          </div>
        </div>

        {/* Academic Calendar & Nigerian Session */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center space-x-2 border-b border-slate-100 pb-3">
            <Globe className="w-4 h-4 text-emerald-700" />
            <h3 className="text-sm font-bold text-slate-900">Academic Session & Terms</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Active Academic Session
              </label>
              <input
                type="text"
                required
                value={currentSession}
                onChange={(e) => setCurrentSession(e.target.value)}
                placeholder="2026/2027"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-mono font-bold focus:ring-2 focus:ring-emerald-600"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Active Term / Semester
              </label>
              <input
                type="text"
                required
                value={currentTermOrSemester}
                onChange={(e) => setCurrentTermOrSemester(e.target.value)}
                placeholder="First Term / Harmattan Semester"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:ring-2 focus:ring-emerald-600"
              />
            </div>
          </div>
        </div>

        {/* Currency & Grading Systems */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center space-x-2 border-b border-slate-100 pb-3">
            <Coins className="w-4 h-4 text-teal-700" />
            <h3 className="text-sm font-bold text-slate-900">Currency & Standards Benchmark</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
              <span className="font-bold text-slate-800 block mb-1">Bursary Currency:</span>
              <div className="flex items-center space-x-2 text-emerald-800 font-extrabold text-sm">
                <span className="text-lg">₦</span>
                <span>Nigerian Naira (NGN) - Fixed Standard</span>
              </div>
              <p className="text-[11px] text-slate-500 mt-1">All invoices, ledgers, and receipts are computed in Naira.</p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
              <span className="font-bold text-slate-800 block mb-1">Tertiary Grading Standard:</span>
              <select
                value={tertiaryGradingSystem}
                onChange={(e) => setTertiaryGradingSystem(e.target.value as any)}
                className="w-full mt-1 p-2 rounded-lg border border-slate-200 text-xs font-bold focus:ring-2 focus:ring-emerald-600"
              >
                <option value="5.0_scale">5.0 Scale (NUC Benchmark: First Class ≥ 4.50)</option>
                <option value="4.0_scale">4.0 Scale (Collegiate Standard)</option>
              </select>
              <p className="text-[11px] text-slate-500 mt-1">Controls CGPA, Quality Point weighting, and official transcripts.</p>
            </div>
          </div>
        </div>

        {/* Save Changes Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="px-6 py-3 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-xs flex items-center space-x-2 shadow-md shadow-emerald-700/20 transition-all"
          >
            <Save className="w-4 h-4" />
            <span>Save Institutional Configuration</span>
          </button>
        </div>
      </form>

      {/* Role & Access Security Matrix */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div className="flex items-center space-x-2 mb-3">
          <ShieldCheck className="w-4 h-4 text-emerald-700" />
          <h3 className="text-sm font-bold text-slate-900">Configured Role-Based Access Control (RBAC)</h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 text-xs">
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
            <strong className="text-slate-800 block">GetoCore Central Admin</strong>
            <span className="text-slate-500 text-[11px]">Worldwide institutional onboarding, license keys, and tier lock provisioning.</span>
          </div>
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
            <strong className="text-slate-800 block">School Super Admin</strong>
            <span className="text-slate-500 text-[11px]">Unrestricted school setup, creates logins for teachers, bursars, and enrolled students.</span>
          </div>
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
            <strong className="text-slate-800 block">Faculty & Teachers</strong>
            <span className="text-slate-500 text-[11px]">Curriculum delivery, CA1/CA2/Exam scores entry, and psychomotor rating.</span>
          </div>
        </div>
      </div>

      {/* Clean Production State Manager */}
      {((currentUser?.role as string) === 'admin' || (currentUser?.role as string) === 'super_admin' || (currentUser?.role as string) === 'getocore_admin') && (
        <div className="bg-rose-50/60 p-6 rounded-2xl border border-rose-200 shadow-xs">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h3 className="text-sm font-bold text-rose-950 flex items-center">
                <Lock className="w-4 h-4 text-rose-700 mr-2" />
                Production Clean State & Database Reset
              </h3>
              <p className="text-xs text-rose-800 mt-1 max-w-xl">
                Purge all temporary student rosters, fee invoices, grades, and test submissions from this device's local database cache to ensure a completely clean slate for school onboarding.
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                if (confirm("Are you sure you want to reset the database to a completely clean state for school onboarding? All local demo records will be purged.")) {
                  resetDatabaseToCleanState();
                  alert("Database successfully reset to clean production state!");
                }
              }}
              className="px-4 py-2.5 bg-rose-700 hover:bg-rose-800 text-white rounded-xl text-xs font-semibold shrink-0 shadow-sm transition-all"
            >
              Reset to Clean State
            </button>
          </div>
        </div>
      )}

      {/* Infrastructure & Software Attribution */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-950 to-emerald-950 p-6 rounded-2xl text-white shadow-md flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-400">
            System Architecture &amp; Engineering
          </span>
          <h4 className="text-base font-bold text-white mt-0.5">
            Powered by GetoCore Digital Innovation
          </h4>
          <p className="text-xs text-slate-300 mt-1">
            Enterprise cloud architecture, biometric credential security, and CBT examination engine.
          </p>
        </div>

        <div className="bg-emerald-900/40 border border-emerald-500/30 px-4 py-2 rounded-xl text-center shrink-0">
          <span className="text-[10px] text-emerald-300 block uppercase font-mono">Build Release</span>
          <span className="text-xs font-bold text-white">GetoCore v2026.4 Enterprise</span>
        </div>
      </div>
    </div>
  );
};
