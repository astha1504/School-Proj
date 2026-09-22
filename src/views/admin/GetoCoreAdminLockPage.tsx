'use client';

import React, { useState } from 'react';
import { 
  Lock, 
  Unlock, 
  ShieldCheck, 
  Building2, 
  Sparkles, 
  CheckCircle2, 
  AlertTriangle, 
  Key, 
  Layers, 
  Save, 
  RefreshCw,
  Cpu,
  GraduationCap,
  BookOpen,
  School,
  FileCheck2,
  SlidersHorizontal,
  ExternalLink
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { EducationalTier } from '../../types';

export const GetoCoreAdminLockPage: React.FC = () => {
  const { licenseConfig, updateLicenseConfig, settings, currentUser } = useApp();

  const [unlockedTiers, setUnlockedTiers] = useState<EducationalTier[]>(licenseConfig.unlockedTiers);
  const [unlockedServices, setUnlockedServices] = useState(licenseConfig.unlockedServices);
  const [schoolTierMode, setSchoolTierMode] = useState(licenseConfig.schoolTierMode);
  const [passkey, setPasskey] = useState('');
  const [passkeyError, setPasskeyError] = useState(false);
  const [successMsg, setSuccessMsg] = useState(false);

  // Quick Preset Handlers
  const handleApplyPreset = (mode: 'basic_secondary' | 'k12_tertiary' | 'primary_only') => {
    setSchoolTierMode(mode);
    if (mode === 'basic_secondary') {
      // NURSERY, PRIMARY, JUNIOR SEC, SENIOR SEC ONLY
      setUnlockedTiers(['primary', 'junior_sec', 'senior_sec']);
    } else if (mode === 'k12_tertiary') {
      // ALL TIERS UNLOCKED
      setUnlockedTiers(['primary', 'junior_sec', 'senior_sec', 'tertiary', 'sub_program']);
    } else if (mode === 'primary_only') {
      // NURSERY & PRIMARY ONLY
      setUnlockedTiers(['primary']);
    }
  };

  const toggleTier = (tier: EducationalTier) => {
    setSchoolTierMode('custom');
    if (unlockedTiers.includes(tier)) {
      if (unlockedTiers.length === 1) {
        alert('At least one educational tier must remain unlocked for the school to function.');
        return;
      }
      setUnlockedTiers(prev => prev.filter(t => t !== tier));
    } else {
      setUnlockedTiers(prev => [...prev, tier]);
    }
  };

  const toggleService = (service: keyof typeof unlockedServices) => {
    setUnlockedServices(prev => ({ ...prev, [service]: !prev[service] }));
  };

  const handleSaveLicense = (e: React.FormEvent) => {
    e.preventDefault();

    // Verify Master Key if not GetoCore Lead
    if ((currentUser?.role as string) !== 'getocore_admin' && passkey.trim() !== 'GETO-2026-HQ' && passkey.trim() !== 'GETO-ADMIN') {
      setPasskeyError(true);
      return;
    }

    setPasskeyError(false);

    let desc = "Custom Institutional Provisioning";
    if (schoolTierMode === 'basic_secondary' || (unlockedTiers.includes('primary') && unlockedTiers.includes('junior_sec') && unlockedTiers.includes('senior_sec') && !unlockedTiers.includes('tertiary'))) {
      desc = "Basic & Secondary Enterprise License (Nursery, Primary, JSS 1-3, SSS 1-3)";
    } else if (schoolTierMode === 'k12_tertiary' || unlockedTiers.length === 5) {
      desc = "Comprehensive K-12 + Tertiary Enterprise Suite (Nursery through 500L University)";
    } else if (schoolTierMode === 'primary_only' || (unlockedTiers.length === 1 && unlockedTiers[0] === 'primary')) {
      desc = "Early Childhood & Primary Foundation License (Nursery 1-2 & Basic 1-6)";
    }

    updateLicenseConfig({
      schoolTierMode,
      unlockedTiers,
      unlockedServices,
      tenantTierDescription: desc
    });

    setSuccessMsg(true);
    setTimeout(() => setSuccessMsg(false), 3500);
  };

  const tierMetadata: { 
    id: EducationalTier; 
    name: string; 
    coverage: string; 
    examStandard: string; 
    icon: any; 
    accentColor: string; 
  }[] = [
    {
      id: 'primary',
      name: 'Primary & Nursery Wing',
      coverage: 'Nursery 1 - 2 & Basic 1 - 6',
      examStandard: 'Formative Continuous Assessment & Psychomotor Metrics',
      icon: School,
      accentColor: 'border-amber-500 bg-amber-500/10 text-amber-400'
    },
    {
      id: 'junior_sec',
      name: 'Junior Secondary School',
      coverage: 'JSS 1 - 3 (Grade 7 to 9)',
      examStandard: 'Basic Education Certificate Examination (BECE)',
      icon: BookOpen,
      accentColor: 'border-cyan-500 bg-cyan-500/10 text-cyan-400'
    },
    {
      id: 'senior_sec',
      name: 'Senior Secondary School',
      coverage: 'SSS 1 - 3 (Science, Commercial, Arts)',
      examStandard: 'WAEC / NECO Senior School Certificate (A1 - F9)',
      icon: Layers,
      accentColor: 'border-indigo-500 bg-indigo-500/10 text-indigo-400'
    },
    {
      id: 'tertiary',
      name: 'Tertiary Institution',
      coverage: 'Colleges, Polytechnics & 100L - 500L University',
      examStandard: 'NUC 5.0 CGPA Scale & Semester Credit Units',
      icon: GraduationCap,
      accentColor: 'border-blue-500 bg-blue-500/10 text-blue-400'
    },
    {
      id: 'sub_program',
      name: 'Sub-Programs & Remedial',
      coverage: 'IJMB / JUPEB A-Level & Executive Diplomas',
      examStandard: 'Direct Entry Remedial Point System',
      icon: Sparkles,
      accentColor: 'border-emerald-500 bg-emerald-500/10 text-emerald-400'
    }
  ];

  return (
    <div className="space-y-6 font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Header Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-slate-950 via-slate-900 to-emerald-950 text-white border border-slate-800 shadow-xl relative overflow-hidden">
        <div className="absolute -right-10 -bottom-10 opacity-10 pointer-events-none">
          <Cpu className="w-80 h-80 text-emerald-400" />
        </div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center space-x-2.5">
              <span className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                <Lock className="w-5 h-5" />
              </span>
              <span className="text-[11px] font-bold uppercase tracking-widest text-emerald-400 font-mono">
                GetoCore Central Command
              </span>
            </div>
            <h1 className="text-2xl font-black tracking-tight text-white">
              Institutional Tier & Service Lock Engine
            </h1>
            <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
              Provision and enforce educational wings for tenant institutions. If a school runs only 
              <strong> Nursery, Primary, and Secondary</strong>, the central admin can lock the Tertiary and 
              Sub-Program modules so the institution only has access to their authorized services.
            </p>
          </div>

          <div className="bg-slate-900/90 border border-emerald-500/40 p-4 rounded-2xl shrink-0 text-center md:text-right">
            <span className="text-[10px] text-emerald-400 font-mono block uppercase">Active Provisioning</span>
            <div className="text-sm font-extrabold text-white mt-0.5">
              {unlockedTiers.length === 3 && unlockedTiers.includes('primary') && unlockedTiers.includes('junior_sec') && unlockedTiers.includes('senior_sec')
                ? 'Nursery, Primary & Secondary'
                : unlockedTiers.length === 5
                  ? 'All 5 Tiers Unlocked'
                  : `${unlockedTiers.length} Active Tiers`}
            </div>
            <span className="text-[10px] bg-emerald-950 text-emerald-300 px-2 py-0.5 rounded-md border border-emerald-700/50 inline-block mt-1 font-semibold">
              Tenant ID: GETO-TENANT-ABUJA-042
            </span>
          </div>
        </div>
      </div>

      {successMsg && (
        <div className="p-4 bg-emerald-50 border border-emerald-300 rounded-2xl text-xs font-bold text-emerald-900 flex items-center space-x-2.5 shadow-sm animate-in fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <div>
            <strong>Institutional Provisioning Applied Successfully!</strong> Educational tier locks have been updated 
            across the navigation bars, admission pipelines, academic registers, and bursary schedules.
          </div>
        </div>
      )}

      {/* 1-Click Institutional Presets */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center space-x-2 text-slate-900">
            <SlidersHorizontal className="w-4 h-4 text-emerald-600" />
            <h3 className="text-sm font-bold">1-Click Institutional Licensing Presets</h3>
          </div>
          <span className="text-[11px] text-slate-400">Select standard configuration pattern</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          {/* Preset 1: Basic & Secondary Only (User Requirement) */}
          <div 
            onClick={() => handleApplyPreset('basic_secondary')}
            className={`p-4 rounded-2xl border-2 transition-all cursor-pointer relative ${
              schoolTierMode === 'basic_secondary'
                ? 'border-emerald-600 bg-emerald-50/50 shadow-md ring-2 ring-emerald-600/20'
                : 'border-slate-200 hover:border-slate-300 bg-white'
            }`}
          >
            {schoolTierMode === 'basic_secondary' && (
              <span className="absolute top-3 right-3 text-[10px] bg-emerald-600 text-white font-bold px-2 py-0.5 rounded-full">
                Active Setup
              </span>
            )}
            <div className="font-bold text-slate-900 text-sm flex items-center space-x-1.5">
              <span>🏫 Basic & Secondary School</span>
            </div>
            <div className="text-[11px] text-slate-500 mt-1 font-semibold">
              Runs Nursery, Primary, JSS 1-3 & SSS 1-3
            </div>
            <p className="text-[11px] text-slate-600 mt-2 leading-relaxed">
              Locks Tertiary (100L-500L) and Sub-Programs completely. Only Nursery, Primary, Junior Sec, and Senior Sec are unlocked.
            </p>
            <div className="mt-3 flex items-center space-x-1.5 text-[10px] text-emerald-700 font-bold">
              <span>✓ Primary</span>
              <span>•</span>
              <span>✓ JSS (BECE)</span>
              <span>•</span>
              <span>✓ SSS (WAEC)</span>
              <span>•</span>
              <span className="text-rose-600">✕ Tertiary Locked</span>
            </div>
          </div>

          {/* Preset 2: K-12 + Tertiary Comprehensive */}
          <div 
            onClick={() => handleApplyPreset('k12_tertiary')}
            className={`p-4 rounded-2xl border-2 transition-all cursor-pointer relative ${
              schoolTierMode === 'k12_tertiary'
                ? 'border-blue-600 bg-blue-50/50 shadow-md ring-2 ring-blue-600/20'
                : 'border-slate-200 hover:border-slate-300 bg-white'
            }`}
          >
            {schoolTierMode === 'k12_tertiary' && (
              <span className="absolute top-3 right-3 text-[10px] bg-blue-600 text-white font-bold px-2 py-0.5 rounded-full">
                Active Setup
              </span>
            )}
            <div className="font-bold text-slate-900 text-sm flex items-center space-x-1.5">
              <span>🎓 K-12 + University / College</span>
            </div>
            <div className="text-[11px] text-slate-500 mt-1 font-semibold">
              All 5 Educational Wings Unlocked
            </div>
            <p className="text-[11px] text-slate-600 mt-2 leading-relaxed">
              Comprehensive institutional license including Nursery, Primary, JSS, SSS, Tertiary (5.0 CGPA transcript), and IJMB/remedials.
            </p>
            <div className="mt-3 flex items-center space-x-1.5 text-[10px] text-blue-700 font-bold">
              <span>✓ All 5 Wings Active</span>
              <span>•</span>
              <span>Full Access</span>
            </div>
          </div>

          {/* Preset 3: Early Childhood & Primary Only */}
          <div 
            onClick={() => handleApplyPreset('primary_only')}
            className={`p-4 rounded-2xl border-2 transition-all cursor-pointer relative ${
              schoolTierMode === 'primary_only'
                ? 'border-amber-600 bg-amber-50/50 shadow-md ring-2 ring-amber-600/20'
                : 'border-slate-200 hover:border-slate-300 bg-white'
            }`}
          >
            {schoolTierMode === 'primary_only' && (
              <span className="absolute top-3 right-3 text-[10px] bg-amber-600 text-white font-bold px-2 py-0.5 rounded-full">
                Active Setup
              </span>
            )}
            <div className="font-bold text-slate-900 text-sm flex items-center space-x-1.5">
              <span>🎒 Nursery & Primary Only</span>
            </div>
            <div className="text-[11px] text-slate-500 mt-1 font-semibold">
              Early Years & Basic 1 - 6
            </div>
            <p className="text-[11px] text-slate-600 mt-2 leading-relaxed">
              Pure primary academy with psychomotor ratings, phonics, and formative assessments. Secondary & Tertiary locked.
            </p>
            <div className="mt-3 flex items-center space-x-1.5 text-[10px] text-amber-700 font-bold">
              <span>✓ Primary Only</span>
              <span>•</span>
              <span className="text-rose-600">✕ Secondary & Higher Ed Locked</span>
            </div>
          </div>
        </div>
      </div>

      {/* Granular Tier Lock Switches */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center space-x-2 text-slate-900">
            <Lock className="w-4 h-4 text-emerald-600" />
            <h3 className="text-sm font-bold">Granular Educational Tier Provisioning</h3>
          </div>
          <span className="text-[11px] text-slate-500 font-medium">Click to lock or unlock individual sections</span>
        </div>

        <div className="space-y-3">
          {tierMetadata.map((t) => {
            const isUnlocked = unlockedTiers.includes(t.id);
            const Icon = t.icon;
            return (
              <div
                key={t.id}
                className={`p-4 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                  isUnlocked 
                    ? 'bg-white border-slate-200 hover:border-slate-300' 
                    : 'bg-slate-50 border-dashed border-slate-300 opacity-70'
                }`}
              >
                <div className="flex items-start space-x-3.5">
                  <div className={`p-3 rounded-2xl border shrink-0 ${isUnlocked ? t.accentColor : 'bg-slate-200 text-slate-500 border-slate-300'}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="space-y-0.5">
                    <div className="flex items-center space-x-2">
                      <h4 className="font-bold text-sm text-slate-900">{t.name}</h4>
                      {isUnlocked ? (
                        <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full flex items-center space-x-1">
                          <Unlock className="w-3 h-3" />
                          <span>UNLOCKED</span>
                        </span>
                      ) : (
                        <span className="text-[10px] bg-rose-100 text-rose-800 font-bold px-2 py-0.5 rounded-full flex items-center space-x-1">
                          <Lock className="w-3 h-3" />
                          <span>LOCKED BY GETOCORE</span>
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-slate-600 font-medium">{t.coverage}</div>
                    <div className="text-[11px] text-slate-400">Academic Standard: {t.examStandard}</div>
                  </div>
                </div>

                <div className="flex items-center space-x-3 shrink-0 self-end sm:self-center">
                  <button
                    type="button"
                    onClick={() => toggleTier(t.id)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-2 ${
                      isUnlocked
                        ? 'bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200'
                        : 'bg-emerald-700 text-white hover:bg-emerald-800 shadow-md shadow-emerald-700/20'
                    }`}
                  >
                    {isUnlocked ? (
                      <>
                        <Lock className="w-3.5 h-3.5" />
                        <span>Lock This Tier</span>
                      </>
                    ) : (
                      <>
                        <Unlock className="w-3.5 h-3.5" />
                        <span>Unlock For School</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Add-On Services Lock Panel */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center space-x-2 text-slate-900">
            <Sparkles className="w-4 h-4 text-emerald-600" />
            <h3 className="text-sm font-bold">Add-on Software Modules & Features</h3>
          </div>
          <span className="text-[11px] text-slate-500 font-medium">Control tenant feature enablement</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 text-xs">
          {[
            { key: 'cbt', title: 'CBT Exam Engine', desc: 'Timed tests, live question matrix & instant auto-grading' },
            { key: 'alumniCommunity', title: 'EduSphere Connect', desc: 'Lifelong alumni network, sets & SIWES job postings' },
            { key: 'digitalIdStudio', title: 'Smart ID Card Studio', desc: 'PVC card generator, alumni card & QR verification' },
            { key: 'parentPortal', title: 'Parent Monitoring', desc: 'Ward switcher, live CA marks, fee clearance & messaging' },
            { key: 'bursaryGateways', title: 'Paystack & Gateways', desc: 'Nigerian Naira billing, card/transfer/USSD/POS checkout' }
          ].map((srv) => {
            const active = (unlockedServices as any)[srv.key];
            return (
              <div 
                key={srv.key}
                onClick={() => toggleService(srv.key as any)}
                className={`p-3.5 rounded-2xl border cursor-pointer transition-all ${
                  active 
                    ? 'border-emerald-300 bg-emerald-50/40 text-slate-900' 
                    : 'border-slate-200 bg-slate-50 text-slate-400'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold">{srv.title}</span>
                  <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                    active ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-500'
                  }`}>
                    {active ? 'ENABLED' : 'DISABLED'}
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 leading-tight">{srv.desc}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Save & Authorization Bar */}
      <form onSubmit={handleSaveLicense} className="p-6 rounded-3xl bg-slate-900 text-white border border-slate-800 shadow-xl flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="space-y-1 w-full md:w-auto">
          <div className="flex items-center space-x-2 text-xs font-bold text-emerald-400">
            <Key className="w-4 h-4" />
            <span>Master Central Admin Authorization</span>
          </div>
          <p className="text-[11px] text-slate-400">
            Demo Master Key: <code className="text-emerald-300 font-bold bg-slate-800 px-1.5 py-0.5 rounded">GETO-2026-HQ</code> (Auto-verified for GetoCore Lead)
          </p>
          {passkeyError && (
            <p className="text-[11px] text-rose-400 font-semibold">
              Invalid Central Admin passkey. Enter GETO-2026-HQ to authorize license changes.
            </p>
          )}
        </div>

        <div className="flex items-center space-x-3 w-full md:w-auto justify-end">
          {(currentUser?.role as string) !== 'getocore_admin' && (
            <input 
              type="password"
              placeholder="Enter Master Passkey..."
              value={passkey}
              onChange={(e) => setPasskey(e.target.value)}
              className="px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 w-44"
            />
          )}

          <button
            type="submit"
            className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center space-x-2 shadow-lg shadow-emerald-600/30 transition-all shrink-0"
          >
            <Save className="w-4 h-4" />
            <span>Deploy Provisioning Changes</span>
          </button>
        </div>
      </form>
    </div>
  );
};
