'use client';

import React, { useState } from 'react';
import { 
  LogOut, 
  Layers, 
  Bell, 
  Building2, 
  User as UserIcon,
  ChevronDown,
  Lock,
  Globe,
  Check,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { EducationalTier } from '../../types';

export const Navbar: React.FC<{ onToggleSidebar: () => void }> = ({ onToggleSidebar }) => {
  const { 
    currentUser, 
    logout, 
    activeTier, 
    setActiveTier, 
    settings,
    licenseConfig,
    announcements,
    tenantSchools,
    currentTenantId,
    currentTenant,
    switchTenant,
    setActivePage
  } = useApp();

  const [showSchoolSwitcher, setShowSchoolSwitcher] = useState(false);

  const allTiers: { key: EducationalTier | 'all'; label: string; badge: string }[] = [
    { key: 'all', label: 'All Tiers', badge: 'Global' },
    { key: 'primary', label: 'Primary', badge: 'Basic 1-6' },
    { key: 'junior_sec', label: 'Junior Sec', badge: 'JSS 1-3' },
    { key: 'senior_sec', label: 'Senior Sec', badge: 'SSS 1-3' },
    { key: 'tertiary', label: 'Tertiary', badge: '100L-500L' },
    { key: 'sub_program', label: 'Sub-Programs', badge: 'IJMB/Dipl.' },
  ];

  const availableTiers = allTiers.filter(t => t.key === 'all' || licenseConfig.unlockedTiers.includes(t.key));

  return (
    <header className="bg-white border-b border-[#E5E7EB] sticky top-0 z-30 shadow-xs">
      <div className="px-4 sm:px-6 py-2.5 flex items-center justify-between">
        {/* Left: Mobile hamburger & Global School Switcher */}
        <div className="flex items-center space-x-3">
          <button
            onClick={onToggleSidebar}
            className="lg:hidden p-2 rounded-xl text-[#1F2937] hover:bg-[#F5F7FA] focus:outline-none"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          {/* Global School Switcher Trigger Button */}
          <div className="relative">
            <button
              onClick={() => setShowSchoolSwitcher(!showSchoolSwitcher)}
              className="flex items-center space-x-2 bg-[#123B63] text-white hover:bg-[#0B2D4D] px-3 py-1.5 rounded-xl font-poppins font-medium text-[14px] transition-all shadow-xs border border-[#0B2D4D] group"
              title="Click to switch between subscriber schools worldwide"
            >
              <span className="text-sm">{currentTenant?.flagEmoji || '🇳🇬'}</span>
              <span className="max-w-[130px] sm:max-w-[180px] truncate">
                {currentTenant?.name || settings.schoolName}
              </span>
              <span className="font-inter font-semibold text-[10px] text-[#F59E0B] px-1 rounded bg-[#0B2D4D]">
                {currentTenant?.currencySymbol || settings.currencySymbol}
              </span>
              <ChevronDown className={`w-3.5 h-3.5 text-white/70 group-hover:text-white transition-transform ${showSchoolSwitcher ? 'rotate-180' : ''}`} />
            </button>

            {/* School Switcher Dropdown Modal */}
            {showSchoolSwitcher && (
              <>
                <div 
                  onClick={() => setShowSchoolSwitcher(false)} 
                  className="fixed inset-0 z-40"
                />
                <div className="absolute left-0 top-full mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-[#E5E7EB] z-50 p-3 space-y-2">
                  <div className="flex items-center justify-between pb-2 border-b border-[#E5E7EB] px-2">
                    <div className="flex items-center space-x-1.5 font-poppins font-semibold text-[14px] text-[#123B63]">
                      <Globe className="w-4 h-4 text-[#1E5A8A]" />
                      <span>GetoCore Global Network</span>
                    </div>
                    <span className="font-inter font-normal text-[12px] text-[#6B7280]">
                      {tenantSchools.length} Subscriber Schools
                    </span>
                  </div>

                  <div className="max-h-72 overflow-y-auto space-y-1 py-1">
                    {tenantSchools.map((s) => {
                      const isSelected = s.id === currentTenantId;
                      return (
                        <button
                          key={s.id}
                          onClick={() => {
                            switchTenant(s.id);
                            setShowSchoolSwitcher(false);
                          }}
                          className={`w-full text-left p-2.5 rounded-xl transition-all flex items-center justify-between ${
                            isSelected
                              ? 'bg-[#123B63]/10 text-[#123B63] border border-[#123B63]/30 font-poppins font-semibold text-[14px]'
                              : 'hover:bg-[#F5F7FA] text-[#1F2937] font-inter font-normal text-[14px]'
                          }`}
                        >
                          <div className="flex items-center space-x-2.5 min-w-0">
                            <span className="text-base shrink-0">{s.flagEmoji}</span>
                            <div className="min-w-0">
                              <div className="truncate font-poppins font-medium text-[14px]">{s.name}</div>
                              <div className="font-inter font-normal text-[12px] text-[#6B7280] flex items-center gap-1.5">
                                <span>{s.city}, {s.country}</span>
                                <span>•</span>
                                <span className="font-inter font-semibold text-[#1E5A8A]">{s.currencyCode} ({s.currencySymbol})</span>
                              </div>
                            </div>
                          </div>

                          {isSelected ? (
                            <Check className="w-4 h-4 text-[#1E5A8A] shrink-0 ml-2" />
                          ) : (
                            <span className="font-inter font-normal text-[12px] px-1.5 py-0.5 rounded bg-[#F5F7FA] text-[#6B7280] shrink-0 ml-2">
                              {s.stats.totalStudents} std
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>

                  <div className="pt-2 border-t border-[#E5E7EB] flex items-center justify-between px-1">
                    <button
                      onClick={() => {
                        setActivePage('getocore_global_hq');
                        setShowSchoolSwitcher(false);
                      }}
                      className="w-full py-2.5 rounded-xl bg-[#123B63] hover:bg-[#0B2D4D] text-white font-poppins font-medium text-[14px] flex items-center justify-center space-x-1.5 transition-colors"
                    >
                      <Sparkles className="w-4 h-4 text-[#F59E0B]" />
                      <span>Open GetoCore Command Center</span>
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>

          <div className="hidden sm:flex items-center space-x-2 bg-[#F5F7FA] px-3 py-1.5 rounded-xl text-[14px] text-[#1F2937] border border-[#E5E7EB]">
            <Building2 className="w-4 h-4 text-[#1E5A8A]" />
            <span className="font-poppins font-medium">{settings.currentSession}</span>
            <span className="text-[#6B7280]">•</span>
            <span className="font-inter font-normal text-[#6B7280]">{settings.currentTermOrSemester}</span>
          </div>
        </div>

        {/* Center: Educational Tier Switcher Pills */}
        <div className="hidden md:flex items-center bg-[#F5F7FA] p-1 rounded-2xl border border-[#E5E7EB] overflow-x-auto max-w-xl">
          {availableTiers.map((t) => {
            const isActive = activeTier === t.key;
            return (
              <button
                key={t.key}
                onClick={() => setActiveTier(t.key)}
                className={`px-3 py-1.5 rounded-xl font-poppins font-medium text-[14px] transition-all flex items-center space-x-1.5 whitespace-nowrap ${
                  isActive
                    ? 'bg-[#1E5A8A] text-white shadow-sm'
                    : 'text-[#6B7280] hover:text-[#1F2937] hover:bg-white'
                }`}
              >
                <span>{t.label}</span>
                <span className={`font-inter font-normal text-[12px] px-1.5 py-0.2 rounded-full ${
                  isActive ? 'bg-[#123B63] text-white' : 'bg-[#E5E7EB] text-[#6B7280]'
                }`}>
                  {t.badge}
                </span>
              </button>
            );
          })}
        </div>

        {/* Right: GetoCore Command Shortcut + Notifications + Profile */}
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setActivePage('getocore_global_hq')}
            className="hidden sm:flex items-center space-x-1.5 bg-[#1E5A8A] hover:bg-[#123B63] text-white px-3 py-1.5 rounded-xl font-poppins font-medium text-[14px] shadow-sm transition-all"
            title="Open GetoCore Global Command Center"
          >
            <Globe className="w-4 h-4" />
            <span>GetoCore HQ</span>
          </button>

          {/* Notifications */}
          <div className="relative">
            <button className="p-2 rounded-xl text-[#6B7280] hover:text-[#1F2937] hover:bg-[#F5F7FA] relative">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#C62828] rounded-full ring-2 ring-white"></span>
            </button>
          </div>

          <div className="h-6 w-px bg-[#E5E7EB] hidden sm:block"></div>

          {/* User Profile Card */}
          <div className="flex items-center space-x-3">
            <div className="hidden sm:block text-right">
              <div className="font-poppins font-semibold text-[14px] text-[#1F2937] leading-tight">
                {currentUser?.name || 'Authorized User'}
              </div>
              <div className="font-inter font-normal text-[12px] text-[#1E5A8A] capitalize">
                {currentUser?.role.replace('_', ' ')}
              </div>
            </div>

            <div className="w-9 h-9 rounded-xl overflow-hidden bg-[#F5F7FA] ring-2 ring-[#1E5A8A]/30 shrink-0">
              {currentUser?.avatar ? (
                <img src={currentUser.avatar} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center font-poppins font-semibold text-[14px] text-[#123B63]">
                  <UserIcon className="w-4 h-4 text-[#1E5A8A]" />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
