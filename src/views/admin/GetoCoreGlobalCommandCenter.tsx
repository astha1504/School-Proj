'use client';

import React, { useState } from 'react';
import { 
  Globe, 
  ShieldCheck, 
  Server, 
  Plus, 
  Search, 
  Filter, 
  ArrowUpRight, 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  Building2, 
  Users, 
  Coins, 
  Wifi, 
  Radio, 
  Send, 
  RefreshCw, 
  Layers, 
  ExternalLink, 
  Settings, 
  Lock, 
  Unlock, 
  Sparkles, 
  Check, 
  ChevronRight, 
  BarChart3, 
  GraduationCap,
  Calendar,
  DollarSign,
  Briefcase,
  Mail,
  Phone,
  Clock,
  FileText
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { EducationalTier, TenantSchool, GlobalBroadcastNotice } from '../../types';
import { SchoolOnboardingKitTab } from './SchoolOnboardingKitTab';

export const GetoCoreGlobalCommandCenter: React.FC = () => {
  const { 
    tenantSchools, 
    currentTenantId, 
    switchTenant, 
    onboardTenantSchool, 
    updateTenantStatus, 
    updateTenantServices, 
    globalBroadcasts, 
    addGlobalBroadcast, 
    globalMetrics,
    setActivePage
  } = useApp();

  // Tab State
  const [activeTab, setActiveTab] = useState<'directory' | 'onboard' | 'intake_kit' | 'clusters' | 'broadcasts'>('directory');

  // Directory Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [countryFilter, setCountryFilter] = useState('all');
  const [planFilter, setPlanFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  // Modal for Wing & Service Provisioning
  const [selectedSchoolToEdit, setSelectedSchoolToEdit] = useState<TenantSchool | null>(null);
  const [editTiers, setEditTiers] = useState<EducationalTier[]>([]);
  const [editServices, setEditServices] = useState<TenantSchool['unlockedServices']>({
    cbt: true,
    alumniCommunity: true,
    digitalIdStudio: true,
    parentPortal: true,
    bursaryGateways: true
  });

  // Onboarding Wizard Form State
  const [onboardStep, setOnboardStep] = useState(1);
  const [newSchool, setNewSchool] = useState({
    name: '',
    slug: '',
    motto: 'Excellence, Integrity and Innovation',
    country: 'Nigeria',
    countryCode: 'NG',
    flagEmoji: '🇳🇬',
    city: '',
    stateOrRegion: '',
    currencySymbol: '₦',
    currencyCode: 'NGN',
    primaryEmail: '',
    phone: '',
    subdomain: '',
    subscriptionPlan: 'enterprise_global' as TenantSchool['subscriptionPlan'],
    billingCycle: 'annual' as TenantSchool['billingCycle'],
    annualPriceFormatted: '₦3,500,000 / yr',
    subscriptionStatus: 'active' as TenantSchool['subscriptionStatus'],
    subscriptionExpiry: '2027-09-30',
    schoolTierMode: 'basic_secondary' as TenantSchool['schoolTierMode'],
    unlockedTiers: ['primary', 'junior_sec', 'senior_sec'] as EducationalTier[],
    unlockedServices: {
      cbt: true,
      alumniCommunity: true,
      digitalIdStudio: true,
      parentPortal: true,
      bursaryGateways: true
    }
  });
  const [onboardSuccessMsg, setOnboardSuccessMsg] = useState(false);

  // Broadcast Dispatch Form State
  const [broadcastForm, setBroadcastForm] = useState({
    title: '',
    content: '',
    priority: 'info' as GlobalBroadcastNotice['priority'],
    targetRegion: 'Worldwide (All Subscriber Schools)'
  });
  const [broadcastSuccess, setBroadcastSuccess] = useState(false);

  // Filtering Directory
  const filteredSchools = tenantSchools.filter(school => {
    const matchesSearch = school.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          school.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          school.subdomain.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          school.country.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCountry = countryFilter === 'all' || school.country === countryFilter;
    const matchesPlan = planFilter === 'all' || school.subscriptionPlan === planFilter;
    const matchesStatus = statusFilter === 'all' || school.subscriptionStatus === statusFilter;
    return matchesSearch && matchesCountry && matchesPlan && matchesStatus;
  });

  // Country presets for onboarding
  const countryPresets: Record<string, { code: string; flag: string; symbol: string; currCode: string; defaultPrice: string }> = {
    Nigeria: { code: 'NG', flag: '🇳🇬', symbol: '₦', currCode: 'NGN', defaultPrice: '₦3,500,000 / yr' },
    Ghana: { code: 'GH', flag: '🇬🇭', symbol: 'GH₵', currCode: 'GHS', defaultPrice: 'GH₵45,000 / yr' },
    'United Kingdom': { code: 'GB', flag: '🇬🇧', symbol: '£', currCode: 'GBP', defaultPrice: '£8,500 / yr' },
    'United States': { code: 'US', flag: '🇺🇸', symbol: '$', currCode: 'USD', defaultPrice: '$12,000 / yr' },
    Kenya: { code: 'KE', flag: '🇰🇪', symbol: 'KSh', currCode: 'KES', defaultPrice: 'KSh 280,000 / yr' },
    'United Arab Emirates': { code: 'AE', flag: '🇦🇪', symbol: '$', currCode: 'USD', defaultPrice: '$14,000 / yr' },
    Canada: { code: 'CA', flag: '🇨🇦', symbol: '$', currCode: 'CAD', defaultPrice: '$11,500 / yr' },
    SouthAfrica: { code: 'ZA', flag: '🇿🇦', symbol: 'R', currCode: 'ZAR', defaultPrice: 'R 120,000 / yr' }
  };

  const handleCountryChangeInOnboarding = (countryName: string) => {
    const preset = countryPresets[countryName] || { code: 'XX', flag: '🌐', symbol: '$', currCode: 'USD', defaultPrice: '$10,000 / yr' };
    setNewSchool(prev => ({
      ...prev,
      country: countryName,
      countryCode: preset.code,
      flagEmoji: preset.flag,
      currencySymbol: preset.symbol,
      currencyCode: preset.currCode,
      annualPriceFormatted: preset.defaultPrice
    }));
  };

  const handleSchoolNameChangeInOnboarding = (val: string) => {
    const slug = val.toLowerCase().replace(/[^a-z0-9]/g, '').slice(0, 16);
    setNewSchool(prev => ({
      ...prev,
      name: val,
      slug: slug || 'school',
      subdomain: slug ? `${slug}.getocore.edu` : 'school.getocore.edu'
    }));
  };

  const toggleTierInOnboarding = (tier: EducationalTier) => {
    setNewSchool(prev => {
      const exists = prev.unlockedTiers.includes(tier);
      const updated = exists 
        ? prev.unlockedTiers.filter(t => t !== tier)
        : [...prev.unlockedTiers, tier];
      return { ...prev, unlockedTiers: updated };
    });
  };

  const handleFinishOnboarding = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSchool.name.trim() || !newSchool.city.trim() || !newSchool.primaryEmail.trim()) {
      alert('Please fill out the essential institution details.');
      return;
    }

    onboardTenantSchool({
      slug: newSchool.slug,
      name: newSchool.name,
      motto: newSchool.motto,
      country: newSchool.country,
      countryCode: newSchool.countryCode,
      flagEmoji: newSchool.flagEmoji,
      city: newSchool.city,
      stateOrRegion: newSchool.stateOrRegion,
      currencySymbol: newSchool.currencySymbol,
      currencyCode: newSchool.currencyCode,
      primaryEmail: newSchool.primaryEmail,
      phone: newSchool.phone || '+1 234 567 8900',
      subdomain: newSchool.subdomain,
      subscriptionPlan: newSchool.subscriptionPlan,
      billingCycle: newSchool.billingCycle,
      annualPriceFormatted: newSchool.annualPriceFormatted,
      subscriptionStatus: newSchool.subscriptionStatus,
      subscriptionExpiry: newSchool.subscriptionExpiry,
      schoolTierMode: newSchool.schoolTierMode,
      unlockedTiers: newSchool.unlockedTiers.length > 0 ? newSchool.unlockedTiers : ['primary'],
      unlockedServices: newSchool.unlockedServices
    });

    setOnboardSuccessMsg(true);
    setTimeout(() => {
      setOnboardSuccessMsg(false);
      setActiveTab('directory');
      setOnboardStep(1);
    }, 2000);
  };

  const openEditModal = (school: TenantSchool) => {
    setSelectedSchoolToEdit(school);
    setEditTiers([...school.unlockedTiers]);
    setEditServices({ ...school.unlockedServices });
  };

  const saveEditedServices = () => {
    if (!selectedSchoolToEdit) return;
    updateTenantServices(selectedSchoolToEdit.id, editTiers, editServices);
    setSelectedSchoolToEdit(null);
  };

  const handleDispatchBroadcast = (e: React.FormEvent) => {
    e.preventDefault();
    if (!broadcastForm.title.trim() || !broadcastForm.content.trim()) return;

    addGlobalBroadcast({
      title: broadcastForm.title,
      content: broadcastForm.content,
      priority: broadcastForm.priority,
      sender: 'GetoCore Global Command HQ',
      targetRegion: broadcastForm.targetRegion
    });

    setBroadcastSuccess(true);
    setBroadcastForm({
      title: '',
      content: '',
      priority: 'info',
      targetRegion: 'Worldwide (All Subscriber Schools)'
    });
    setTimeout(() => setBroadcastSuccess(false), 3000);
  };

  return (
    <div className="space-y-8 font-['Plus_Jakarta_Sans',sans-serif]">
      {/* SaaS Executive Command Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-950 via-slate-900 to-emerald-950 text-white p-8 border border-emerald-900/40 shadow-xl">
        {/* Subtle background tech matrix */}
        <div className="absolute inset-0 bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:24px_24px] opacity-15 pointer-events-none"></div>

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-500/30">
              <Globe className="w-3.5 h-3.5 animate-spin-slow" />
              <span>GetoCore Global SaaS Hub</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>100% Multi-Tenant Architecture</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white flex items-center gap-3">
              GetoCore Command Center
              <span className="text-xs font-mono font-normal px-2.5 py-1 rounded-lg bg-emerald-900/70 text-emerald-200 border border-emerald-700/50">
                v3.4.0 SaaS
              </span>
            </h1>
            <p className="text-slate-300 text-sm max-w-2xl leading-relaxed">
              Global multi-functional administration center for schools subscribed worldwide. 
              Manage subscriber institutions across Nigeria 🇳🇬, Ghana 🇬🇭, United Kingdom 🇬🇧, UAE 🇦🇪, Kenya 🇰🇪, and North America 🇺🇸 with localized currencies, tier provisioning, and live portal switching.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              onClick={() => setActiveTab('onboard')}
              className="px-5 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-bold shadow-lg shadow-emerald-900/40 flex items-center space-x-2 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <Plus className="w-4 h-4" />
              <span>Onboard New School</span>
            </button>

            <button
              onClick={() => setActiveTab('intake_kit')}
              className="px-4 py-3 rounded-2xl bg-slate-800/80 hover:bg-slate-700 text-slate-200 text-sm font-semibold border border-slate-700 flex items-center space-x-2 transition-colors"
            >
              <FileText className="w-4 h-4 text-amber-400" />
              <span>Intake Form Kit</span>
            </button>

            <button
              onClick={() => setActivePage('getocore_admin')}
              className="px-4 py-3 rounded-2xl bg-slate-800/80 hover:bg-slate-700 text-slate-200 text-sm font-semibold border border-slate-700 flex items-center space-x-2 transition-colors"
            >
              <Lock className="w-4 h-4 text-emerald-400" />
              <span>Central Tier Lock</span>
            </button>
          </div>
        </div>

        {/* Executive SaaS KPI Metric Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8 pt-6 border-t border-slate-800/80">
          <div className="bg-slate-900/70 backdrop-blur-xs p-4 rounded-2xl border border-slate-800">
            <div className="flex items-center justify-between text-slate-400 text-xs font-medium mb-1">
              <span>Total Subscriber Schools</span>
              <Building2 className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-2xl sm:text-3xl font-black text-white">
              {tenantSchools.length}
            </div>
            <div className="text-[11px] text-emerald-400 font-semibold mt-1 flex items-center gap-1">
              <span>+{tenantSchools.filter(s => s.subscriptionStatus === 'active').length} Active</span>
              <span className="text-slate-400">• Across 7 Countries</span>
            </div>
          </div>

          <div className="bg-slate-900/70 backdrop-blur-xs p-4 rounded-2xl border border-slate-800">
            <div className="flex items-center justify-between text-slate-400 text-xs font-medium mb-1">
              <span>Global Student Population</span>
              <Users className="w-4 h-4 text-cyan-400" />
            </div>
            <div className="text-2xl sm:text-3xl font-black text-white">
              {tenantSchools.reduce((acc, s) => acc + s.stats.totalStudents, 0).toLocaleString()}
            </div>
            <div className="text-[11px] text-cyan-400 font-semibold mt-1">
              Across Basic, Secondary & Tertiary
            </div>
          </div>

          <div className="bg-slate-900/70 backdrop-blur-xs p-4 rounded-2xl border border-slate-800">
            <div className="flex items-center justify-between text-slate-400 text-xs font-medium mb-1">
              <span>Global Annual ARR</span>
              <Coins className="w-4 h-4 text-amber-400" />
            </div>
            <div className="text-2xl sm:text-3xl font-black text-white">
              $2.45M <span className="text-xs text-amber-400 font-normal">/ ₦3.67B</span>
            </div>
            <div className="text-[11px] text-amber-300 font-semibold mt-1">
              Multi-Currency Subscriptions
            </div>
          </div>

          <div className="bg-slate-900/70 backdrop-blur-xs p-4 rounded-2xl border border-slate-800">
            <div className="flex items-center justify-between text-slate-400 text-xs font-medium mb-1">
              <span>Cloud Edge Health</span>
              <Wifi className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-2xl sm:text-3xl font-black text-emerald-400 flex items-center gap-2">
              99.98%
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
            </div>
            <div className="text-[11px] text-slate-400 font-medium mt-1">
              5 Edge Nodes (Lagos, London, Dubai...)
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setActiveTab('directory')}
          className={`px-4 py-2.5 rounded-xl font-bold text-sm flex items-center space-x-2 transition-all ${
            activeTab === 'directory'
              ? 'bg-slate-900 text-white shadow-md'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Building2 className="w-4 h-4" />
          <span>Subscriber Schools Directory ({tenantSchools.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('onboard')}
          className={`px-4 py-2.5 rounded-xl font-bold text-sm flex items-center space-x-2 transition-all ${
            activeTab === 'onboard'
              ? 'bg-slate-900 text-white shadow-md'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Plus className="w-4 h-4 text-emerald-500" />
          <span>Onboard New Institution</span>
        </button>

        <button
          onClick={() => setActiveTab('intake_kit')}
          className={`px-4 py-2.5 rounded-xl font-bold text-sm flex items-center space-x-2 transition-all ${
            activeTab === 'intake_kit'
              ? 'bg-slate-900 text-white shadow-md'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <FileText className="w-4 h-4 text-amber-500" />
          <span>Onboarding Intake Kit & Form</span>
        </button>

        <button
          onClick={() => setActiveTab('clusters')}
          className={`px-4 py-2.5 rounded-xl font-bold text-sm flex items-center space-x-2 transition-all ${
            activeTab === 'clusters'
              ? 'bg-slate-900 text-white shadow-md'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Server className="w-4 h-4 text-blue-500" />
          <span>Global Edge Infrastructure ({globalMetrics.serverClusters.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('broadcasts')}
          className={`px-4 py-2.5 rounded-xl font-bold text-sm flex items-center space-x-2 transition-all ${
            activeTab === 'broadcasts'
              ? 'bg-slate-900 text-white shadow-md'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Radio className="w-4 h-4 text-rose-500" />
          <span>Global Network Broadcasts ({globalBroadcasts.length})</span>
        </button>
      </div>

      {/* TAB 1: SUBSCRIBER SCHOOLS DIRECTORY */}
      {activeTab === 'directory' && (
        <div className="space-y-6">
          {/* Filters Bar */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search subscriber school by name, city, or subdomain..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600/30"
              />
            </div>

            <div className="flex flex-wrap items-center gap-3">
              {/* Country Filter */}
              <div className="flex items-center space-x-2">
                <Filter className="w-3.5 h-3.5 text-slate-400" />
                <select
                  value={countryFilter}
                  onChange={e => setCountryFilter(e.target.value)}
                  className="px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 bg-white focus:outline-none"
                >
                  <option value="all">🌍 All Countries</option>
                  <option value="Nigeria">🇳🇬 Nigeria</option>
                  <option value="Ghana">🇬🇭 Ghana</option>
                  <option value="United Kingdom">🇬🇧 United Kingdom</option>
                  <option value="United Arab Emirates">🇦🇪 UAE</option>
                  <option value="Kenya">🇰🇪 Kenya</option>
                  <option value="United States">🇺🇸 United States</option>
                </select>
              </div>

              {/* Plan Filter */}
              <select
                value={planFilter}
                onChange={e => setPlanFilter(e.target.value)}
                className="px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 bg-white focus:outline-none"
              >
                <option value="all">⭐ All Subscription Plans</option>
                <option value="starter">Starter</option>
                <option value="professional">Professional</option>
                <option value="enterprise_global">Enterprise Global</option>
              </select>

              {/* Status Filter */}
              <select
                value={statusFilter}
                onChange={e => setStatusFilter(e.target.value)}
                className="px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 bg-white focus:outline-none"
              >
                <option value="all">Status: All</option>
                <option value="active">Active</option>
                <option value="trial">Trial</option>
                <option value="suspended">Suspended</option>
              </select>
            </div>
          </div>

          {/* School Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredSchools.map((school) => {
              const isCurrent = school.id === currentTenantId;
              const isSuspended = school.subscriptionStatus === 'suspended';

              return (
                <div 
                  key={school.id}
                  className={`bg-white rounded-2xl border transition-all flex flex-col justify-between overflow-hidden shadow-xs hover:shadow-md ${
                    isCurrent 
                      ? 'border-emerald-600 ring-2 ring-emerald-600/30' 
                      : isSuspended 
                        ? 'border-rose-300 opacity-80' 
                        : 'border-slate-200'
                  }`}
                >
                  {/* Card Header */}
                  <div className="p-5 border-b border-slate-100">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center space-x-3 min-w-0">
                        <div className="w-12 h-12 rounded-xl overflow-hidden bg-slate-100 border border-slate-200 shrink-0 flex items-center justify-center text-xl">
                          {school.flagEmoji}
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center space-x-1.5">
                            <span className="text-xs font-bold text-slate-500">
                              {school.country}
                            </span>
                            {isCurrent && (
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
                                Active Context
                              </span>
                            )}
                          </div>
                          <h3 className="font-extrabold text-base text-slate-900 truncate leading-tight">
                            {school.name}
                          </h3>
                          <div className="text-[11px] font-mono text-emerald-700 font-semibold truncate">
                            {school.subdomain}
                          </div>
                        </div>
                      </div>

                      <span className={`text-[10px] px-2.5 py-1 rounded-full font-bold uppercase tracking-wider shrink-0 ${
                        school.subscriptionStatus === 'active'
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                          : school.subscriptionStatus === 'trial'
                            ? 'bg-blue-100 text-blue-800 border border-blue-300'
                            : 'bg-rose-100 text-rose-800 border border-rose-300'
                      }`}>
                        {school.subscriptionStatus}
                      </span>
                    </div>

                    <p className="text-xs text-slate-500 italic mt-2.5 truncate">
                      "{school.motto}"
                    </p>
                  </div>

                  {/* Card Body: Provisioning Details */}
                  <div className="p-5 space-y-4 flex-1">
                    {/* Unlocked Educational Wings */}
                    <div>
                      <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1.5 flex items-center justify-between">
                        <span>Provisioned Wings</span>
                        <span className="font-mono text-emerald-700">{school.currencyCode} ({school.currencySymbol})</span>
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {school.unlockedTiers.map(tier => {
                          const labels: Record<string, string> = {
                            primary: 'Basic 1-6',
                            junior_sec: 'JSS 1-3',
                            senior_sec: 'SSS 1-3',
                            tertiary: 'Tertiary',
                            sub_program: 'Remedial'
                          };
                          return (
                            <span 
                              key={tier}
                              className="text-[11px] px-2 py-0.5 rounded-md font-semibold bg-slate-100 text-slate-700 border border-slate-200"
                            >
                              {labels[tier] || tier}
                            </span>
                          );
                        })}
                      </div>
                    </div>

                    {/* Stats & Subscription */}
                    <div className="grid grid-cols-3 gap-2 bg-slate-50 p-3 rounded-xl border border-slate-100 text-center">
                      <div>
                        <div className="text-[10px] text-slate-400 font-semibold">Students</div>
                        <div className="text-sm font-extrabold text-slate-800">
                          {school.stats.totalStudents.toLocaleString()}
                        </div>
                      </div>
                      <div>
                        <div className="text-[10px] text-slate-400 font-semibold">Staff</div>
                        <div className="text-sm font-extrabold text-slate-800">
                          {school.stats.totalStaff}
                        </div>
                      </div>
                      <div>
                        <div className="text-[10px] text-slate-400 font-semibold">Plan</div>
                        <div className="text-xs font-extrabold text-emerald-800 truncate capitalize">
                          {school.subscriptionPlan.replace('_', ' ')}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-xs text-slate-600 pt-1">
                      <span className="font-semibold text-slate-700">{school.annualPriceFormatted}</span>
                      <span className="text-[11px] text-slate-400">Renews: {school.subscriptionExpiry}</span>
                    </div>
                  </div>

                  {/* Card Actions */}
                  <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-2">
                    <button
                      onClick={() => {
                        switchTenant(school.id);
                        setActivePage('overview');
                      }}
                      className="flex-1 px-3 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold flex items-center justify-center space-x-1.5 transition-colors shadow-xs"
                    >
                      <ArrowUpRight className="w-3.5 h-3.5" />
                      <span>Enter School Portal</span>
                    </button>

                    <button
                      onClick={() => openEditModal(school)}
                      title="Manage School Services & Locks"
                      className="p-2 rounded-xl bg-white hover:bg-slate-200 text-slate-700 border border-slate-200 transition-colors"
                    >
                      <Settings className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => updateTenantStatus(
                        school.id, 
                        school.subscriptionStatus === 'suspended' ? 'active' : 'suspended'
                      )}
                      title={school.subscriptionStatus === 'suspended' ? "Reactivate School" : "Suspend Access"}
                      className={`p-2 rounded-xl border transition-colors ${
                        school.subscriptionStatus === 'suspended'
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                          : 'bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100'
                      }`}
                    >
                      {school.subscriptionStatus === 'suspended' ? (
                        <CheckCircle2 className="w-4 h-4" />
                      ) : (
                        <XCircle className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 2: ONBOARD NEW SUBSCRIBER SCHOOL WIZARD */}
      {activeTab === 'onboard' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-xs max-w-4xl mx-auto">
          {/* Step Indicator */}
          <div className="flex items-center justify-between mb-8 pb-6 border-b border-slate-200">
            <div>
              <div className="text-xs font-bold text-emerald-700 uppercase tracking-widest">
                Global SaaS Onboarding
              </div>
              <h2 className="text-2xl font-black text-slate-900">
                Register New Subscriber School
              </h2>
            </div>

            <div className="flex items-center space-x-2">
              {[1, 2, 3, 4].map(stepNum => (
                <div
                  key={stepNum}
                  onClick={() => setOnboardStep(stepNum)}
                  className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs font-bold cursor-pointer transition-all ${
                    onboardStep === stepNum
                      ? 'bg-emerald-700 text-white ring-2 ring-emerald-700/30'
                      : onboardStep > stepNum
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-slate-100 text-slate-400'
                  }`}
                >
                  {onboardStep > stepNum ? <Check className="w-4 h-4" /> : stepNum}
                </div>
              ))}
            </div>
          </div>

          {onboardSuccessMsg && (
            <div className="mb-6 p-4 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-900 flex items-center space-x-3 animate-fade-in">
              <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0" />
              <div>
                <div className="font-bold text-sm">School Successfully Provisioned!</div>
                <div className="text-xs text-emerald-700">Subdomain, database schema, and localized currency set up on GetoCore Cloud.</div>
              </div>
            </div>
          )}

          <form onSubmit={handleFinishOnboarding} className="space-y-6">
            {/* STEP 1: Institutional Identity */}
            {onboardStep === 1 && (
              <div className="space-y-5 animate-fade-in">
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-600">
                  Step 1 of 4: Enter the school's legal identity, geographical location, and localized billing currency.
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      School Legal Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. St. Gregory Premier College"
                      value={newSchool.name}
                      onChange={e => handleSchoolNameChangeInOnboarding(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-emerald-600/30 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Target Country *
                    </label>
                    <select
                      value={newSchool.country}
                      onChange={e => handleCountryChangeInOnboarding(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-800 bg-white focus:outline-none"
                    >
                      <option value="Nigeria">🇳🇬 Nigeria</option>
                      <option value="Ghana">🇬🇭 Ghana</option>
                      <option value="United Kingdom">🇬🇧 United Kingdom</option>
                      <option value="United States">🇺🇸 United States</option>
                      <option value="United Arab Emirates">🇦🇪 United Arab Emirates</option>
                      <option value="Kenya">🇰🇪 Kenya</option>
                      <option value="Canada">🇨🇦 Canada</option>
                      <option value="SouthAfrica">🇿🇦 South Africa</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Localized Currency
                    </label>
                    <div className="px-4 py-2.5 rounded-xl bg-slate-100 border border-slate-200 text-sm font-bold text-slate-800 flex items-center justify-between">
                      <span>{newSchool.currencyCode} ({newSchool.currencySymbol})</span>
                      <span className="text-xs text-emerald-700 font-medium">Auto-configured</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      City / Metropolis *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Lagos, Accra, London, Nairobi"
                      value={newSchool.city}
                      onChange={e => setNewSchool(prev => ({ ...prev, city: e.target.value }))}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-emerald-600/30 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      State / Province / Region *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Lagos State, Greater London, Texas"
                      value={newSchool.stateOrRegion}
                      onChange={e => setNewSchool(prev => ({ ...prev, stateOrRegion: e.target.value }))}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-emerald-600/30 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Primary Official Email *
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="admin@institution.edu"
                      value={newSchool.primaryEmail}
                      onChange={e => setNewSchool(prev => ({ ...prev, primaryEmail: e.target.value }))}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-emerald-600/30 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Official Phone / WhatsApp
                    </label>
                    <input
                      type="text"
                      placeholder="+234 / +44 / +1 ..."
                      value={newSchool.phone}
                      onChange={e => setNewSchool(prev => ({ ...prev, phone: e.target.value }))}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-emerald-600/30 focus:outline-none"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      GetoCore Subdomain URL
                    </label>
                    <div className="flex items-center">
                      <span className="px-3.5 py-2.5 rounded-l-xl bg-slate-100 border border-r-0 border-slate-200 text-xs font-mono text-slate-500">
                        https://
                      </span>
                      <input
                        type="text"
                        value={newSchool.subdomain}
                        onChange={e => setNewSchool(prev => ({ ...prev, subdomain: e.target.value }))}
                        className="flex-1 px-4 py-2.5 rounded-r-xl border border-slate-200 text-sm font-mono text-emerald-700 focus:outline-none"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex justify-end pt-4">
                  <button
                    type="button"
                    onClick={() => setOnboardStep(2)}
                    className="px-6 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-sm font-bold flex items-center space-x-2"
                  >
                    <span>Proceed to Wings Provisioning</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 2: Educational Wings Provisioning */}
            {onboardStep === 2 && (
              <div className="space-y-5 animate-fade-in">
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-600">
                  Step 2 of 4: Select which educational sections this school runs. (e.g. if they only run Nursery & Primary, lock the secondary & tertiary wings).
                </div>

                <div className="space-y-3">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Institutional Tier Setup
                  </label>

                  {[
                    { key: 'primary' as EducationalTier, label: 'Early Years & Primary (Basic 1 - 6)', desc: 'Kindergarten, Nursery & Primary sections with National Curriculum, psychomotor & phonics' },
                    { key: 'junior_sec' as EducationalTier, label: 'Junior Secondary (JSS 1 - 3 / BECE)', desc: 'Basic Education Certificate Examination, Pre-Vocational & Junior Science tracking' },
                    { key: 'senior_sec' as EducationalTier, label: 'Senior Secondary (SSS 1 - 3 / WAEC / NECO / Cambridge)', desc: 'Science, Arts, Commercial streams with mock exams and terminal transcripts' },
                    { key: 'tertiary' as EducationalTier, label: 'Tertiary Wing (Colleges / Polytechnic / University)', desc: '100L - 500L, Course Registration, Faculty/Dept management & 5.0 CGPA system' },
                    { key: 'sub_program' as EducationalTier, label: 'Sub-Programs & Remedials (IJMB / JUPEB / Cambridge A-Levels)', desc: 'Accelerated direct-entry, diplomas, and pre-degree foundation cohorts' },
                  ].map(tierOption => {
                    const isSelected = newSchool.unlockedTiers.includes(tierOption.key);
                    return (
                      <div
                        key={tierOption.key}
                        onClick={() => toggleTierInOnboarding(tierOption.key)}
                        className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-start justify-between gap-4 ${
                          isSelected
                            ? 'bg-emerald-50/70 border-emerald-500 ring-1 ring-emerald-500/20'
                            : 'bg-white border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        <div className="space-y-1">
                          <div className="font-bold text-sm text-slate-900 flex items-center space-x-2">
                            <span>{tierOption.label}</span>
                            {isSelected && (
                              <span className="text-[10px] bg-emerald-700 text-white px-2 py-0.5 rounded-full font-semibold">
                                Unlocked
                              </span>
                            )}
                          </div>
                          <div className="text-xs text-slate-500">{tierOption.desc}</div>
                        </div>

                        <div className={`w-5 h-5 rounded-md border flex items-center justify-center shrink-0 ${
                          isSelected ? 'bg-emerald-700 border-emerald-700 text-white' : 'border-slate-300'
                        }`}>
                          {isSelected && <Check className="w-3.5 h-3.5" />}
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="flex justify-between pt-4">
                  <button
                    type="button"
                    onClick={() => setOnboardStep(1)}
                    className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-semibold"
                  >
                    Back
                  </button>
                  <button
                    type="button"
                    onClick={() => setOnboardStep(3)}
                    className="px-6 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-sm font-bold flex items-center space-x-2"
                  >
                    <span>Proceed to Subscription Plan</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 3: Subscription & Billing Plan */}
            {onboardStep === 3 && (
              <div className="space-y-5 animate-fade-in">
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-600">
                  Step 3 of 4: Assign an enterprise subscription tier and annual license fee.
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {[
                    {
                      plan: 'starter' as const,
                      name: 'Starter SaaS',
                      desc: 'Ideal for single-campus primary or nursery schools up to 500 students.',
                      badge: 'Standard'
                    },
                    {
                      plan: 'professional' as const,
                      name: 'Professional',
                      desc: 'For K-12 secondary schools, CBT exams, and parent portal access.',
                      badge: 'Most Popular'
                    },
                    {
                      plan: 'enterprise_global' as const,
                      name: 'Enterprise Global',
                      desc: 'Full multi-campus, tertiary/polytechnic, multi-currency & unlimited CBT.',
                      badge: 'All Features'
                    },
                  ].map(planOption => {
                    const isSelected = newSchool.subscriptionPlan === planOption.plan;
                    return (
                      <div
                        key={planOption.plan}
                        onClick={() => setNewSchool(prev => ({ ...prev, subscriptionPlan: planOption.plan }))}
                        className={`p-5 rounded-2xl border cursor-pointer transition-all flex flex-col justify-between ${
                          isSelected
                            ? 'bg-emerald-50 border-emerald-600 ring-2 ring-emerald-600/30'
                            : 'bg-white border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        <div>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                            {planOption.badge}
                          </span>
                          <h4 className="text-base font-extrabold text-slate-900 mt-2">
                            {planOption.name}
                          </h4>
                          <p className="text-xs text-slate-500 mt-1">
                            {planOption.desc}
                          </p>
                        </div>

                        <div className="mt-4 pt-3 border-t border-slate-200 flex items-center justify-between">
                          <span className="text-xs font-bold text-emerald-800">
                            {isSelected ? '✓ Selected' : 'Choose Plan'}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Billing Schedule
                    </label>
                    <select
                      value={newSchool.billingCycle}
                      onChange={e => setNewSchool(prev => ({ ...prev, billingCycle: e.target.value as any }))}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-800 bg-white focus:outline-none"
                    >
                      <option value="annual">Annual Subscription (Recommended)</option>
                      <option value="termly">Termly / Semester Billing</option>
                      <option value="monthly">Monthly Recurring</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      License Price Display ({newSchool.currencyCode})
                    </label>
                    <input
                      type="text"
                      value={newSchool.annualPriceFormatted}
                      onChange={e => setNewSchool(prev => ({ ...prev, annualPriceFormatted: e.target.value }))}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-bold text-slate-800 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="flex justify-between pt-4">
                  <button
                    type="button"
                    onClick={() => setOnboardStep(2)}
                    className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-semibold"
                  >
                    Back
                  </button>
                  <button
                    type="button"
                    onClick={() => setOnboardStep(4)}
                    className="px-6 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-sm font-bold flex items-center space-x-2"
                  >
                    <span>Proceed to Final Verification</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 4: Admin Verification & Activation */}
            {onboardStep === 4 && (
              <div className="space-y-5 animate-fade-in">
                <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900">
                  Step 4 of 4: Review summary and activate GetoCore Cloud deployment for this school.
                </div>

                {/* Summary Card */}
                <div className="p-5 rounded-2xl bg-slate-900 text-white space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                    <div>
                      <div className="text-xs text-emerald-400 font-bold uppercase">
                        {newSchool.country} {newSchool.flagEmoji}
                      </div>
                      <h3 className="text-lg font-black">{newSchool.name || 'New Subscriber School'}</h3>
                      <div className="text-xs font-mono text-slate-400">{newSchool.subdomain}</div>
                    </div>
                    <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                      {newSchool.subscriptionPlan.toUpperCase()}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                    <div>
                      <span className="text-slate-400 block">Currency</span>
                      <strong className="text-white font-bold">{newSchool.currencyCode} ({newSchool.currencySymbol})</strong>
                    </div>
                    <div>
                      <span className="text-slate-400 block">City / State</span>
                      <strong className="text-white font-bold">{newSchool.city}, {newSchool.stateOrRegion}</strong>
                    </div>
                    <div>
                      <span className="text-slate-400 block">Unlocked Wings</span>
                      <strong className="text-emerald-400 font-bold">{newSchool.unlockedTiers.length} Educational Tiers</strong>
                    </div>
                    <div>
                      <span className="text-slate-400 block">License Fee</span>
                      <strong className="text-amber-400 font-bold">{newSchool.annualPriceFormatted}</strong>
                    </div>
                  </div>
                </div>

                <div className="flex justify-between pt-4">
                  <button
                    type="button"
                    onClick={() => setOnboardStep(3)}
                    className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-semibold"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    className="px-8 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-extrabold shadow-lg shadow-emerald-900/30 flex items-center space-x-2 transition-all hover:scale-105"
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>Deploy School to GetoCore Cloud</span>
                  </button>
                </div>
              </div>
            )}
          </form>
        </div>
      )}

      {/* TAB 2B: ONBOARDING DATA INTAKE KIT & FORM */}
      {activeTab === 'intake_kit' && (
        <SchoolOnboardingKitTab 
          onGoToOnboard={() => { 
            setActiveTab('onboard'); 
            setOnboardStep(1); 
          }} 
        />
      )}

      {/* TAB 3: GLOBAL EDGE INFRASTRUCTURE */}
      {activeTab === 'clusters' && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
              <div>
                <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                  <Server className="w-5 h-5 text-emerald-600" />
                  GetoCore Global Edge Server Nodes
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Distributed cloud cluster telemetry providing low-latency CBT testing, attendance sync, and instant report card generation worldwide.
                </p>
              </div>

              <div className="flex items-center space-x-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                <span className="text-xs font-bold text-emerald-800">All Clusters Operational</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {globalMetrics.serverClusters.map((cluster, idx) => (
                <div 
                  key={idx}
                  className="p-5 rounded-2xl border border-slate-200 bg-slate-50 hover:bg-white transition-colors"
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                      {cluster.region}
                    </span>
                    <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
                      {cluster.status.toUpperCase()}
                    </span>
                  </div>

                  <h4 className="font-extrabold text-base text-slate-900 mb-1">
                    {cluster.location}
                  </h4>

                  <div className="flex items-center justify-between text-xs text-slate-600 mt-4 pt-3 border-t border-slate-200">
                    <span className="flex items-center gap-1.5 font-mono font-semibold">
                      <Wifi className="w-3.5 h-3.5 text-emerald-600" />
                      {cluster.pingMs} ms latency
                    </span>
                    <span className="text-slate-400 text-[11px]">Primary Master DB</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: GLOBAL NETWORK BROADCASTS */}
      {activeTab === 'broadcasts' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left: Dispatch Form */}
          <div className="lg:col-span-5 bg-white p-6 rounded-3xl border border-slate-200 shadow-xs h-fit space-y-5">
            <div>
              <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                <Radio className="w-4 h-4 text-emerald-600" />
                Dispatch Network Broadcast
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Send real-time alerts or maintenance notices to all subscriber schools worldwide.
              </p>
            </div>

            {broadcastSuccess && (
              <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs font-semibold flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Notice dispatched to all subscriber school portals!</span>
              </div>
            )}

            <form onSubmit={handleDispatchBroadcast} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Broadcast Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Scheduled Cloud Maintenance Window"
                  value={broadcastForm.title}
                  onChange={e => setBroadcastForm(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full px-4 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600/30"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Target Destination
                </label>
                <select
                  value={broadcastForm.targetRegion}
                  onChange={e => setBroadcastForm(prev => ({ ...prev, targetRegion: e.target.value }))}
                  className="w-full px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 bg-white focus:outline-none"
                >
                  <option value="Worldwide (All Subscriber Schools)">Worldwide (All 148 Subscriber Schools)</option>
                  <option value="Sub-Saharan Africa (Nigeria, Ghana, Kenya)">Sub-Saharan Africa (Nigeria, Ghana, Kenya)</option>
                  <option value="Europe & UK Campuses">Europe & UK Campuses</option>
                  <option value="Middle East (UAE)">Middle East (UAE)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Notice Priority
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(['info', 'important', 'critical'] as const).map(p => (
                    <button
                      type="button"
                      key={p}
                      onClick={() => setBroadcastForm(prev => ({ ...prev, priority: p }))}
                      className={`py-1.5 rounded-xl text-xs font-bold capitalize border transition-all ${
                        broadcastForm.priority === p
                          ? p === 'critical'
                            ? 'bg-rose-700 text-white border-rose-800'
                            : p === 'important'
                              ? 'bg-amber-600 text-white border-amber-700'
                              : 'bg-emerald-700 text-white border-emerald-800'
                          : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Message Content *
                </label>
                <textarea
                  rows={4}
                  required
                  placeholder="Enter detailed maintenance bulletin or release notes..."
                  value={broadcastForm.content}
                  onChange={e => setBroadcastForm(prev => ({ ...prev, content: e.target.value }))}
                  className="w-full px-4 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600/30 resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-extrabold flex items-center justify-center space-x-2 transition-colors"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Broadcast to School Networks</span>
              </button>
            </form>
          </div>

          {/* Right: Broadcasts Feed */}
          <div className="lg:col-span-7 space-y-4">
            <h3 className="text-base font-extrabold text-slate-900 flex items-center justify-between">
              <span>Active Network Bulletins</span>
              <span className="text-xs font-medium text-slate-500">{globalBroadcasts.length} Messages</span>
            </h3>

            {globalBroadcasts.map((b) => (
              <div 
                key={b.id}
                className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2.5"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                      b.priority === 'critical'
                        ? 'bg-rose-100 text-rose-800 border border-rose-300'
                        : b.priority === 'important'
                          ? 'bg-amber-100 text-amber-800 border border-amber-300'
                          : 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                    }`}>
                      {b.priority}
                    </span>
                    <span className="text-xs text-slate-500 font-medium">
                      {b.targetRegion}
                    </span>
                  </div>

                  <span className="text-[11px] text-slate-400 font-mono">
                    {b.createdAt}
                  </span>
                </div>

                <h4 className="text-base font-bold text-slate-900">
                  {b.title}
                </h4>

                <p className="text-xs text-slate-600 leading-relaxed">
                  {b.content}
                </p>

                <div className="text-[11px] text-emerald-700 font-semibold pt-1">
                  Sender: {b.sender}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* MODAL: MANAGE SCHOOL WINGS & SERVICES */}
      {selectedSchoolToEdit && (
        <div className="fixed inset-0 bg-slate-950/60 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-xs font-bold text-emerald-700 uppercase">
                  Service Provisioning & Locks
                </span>
                <h3 className="text-xl font-black text-slate-900">
                  {selectedSchoolToEdit.name}
                </h3>
                <div className="text-xs text-slate-500">
                  {selectedSchoolToEdit.city}, {selectedSchoolToEdit.country} ({selectedSchoolToEdit.currencyCode})
                </div>
              </div>

              <button
                onClick={() => setSelectedSchoolToEdit(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            </div>

            {/* Unlocked Tiers Selection */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Permitted Educational Wings
              </label>
              <div className="space-y-2">
                {[
                  { key: 'primary' as EducationalTier, label: 'Primary Wing (Basic 1-6 / Nursery)' },
                  { key: 'junior_sec' as EducationalTier, label: 'Junior Secondary (JSS 1-3)' },
                  { key: 'senior_sec' as EducationalTier, label: 'Senior Secondary (SSS 1-3)' },
                  { key: 'tertiary' as EducationalTier, label: 'Tertiary Wing (100L - 500L)' },
                  { key: 'sub_program' as EducationalTier, label: 'Sub-Programs (IJMB / Remedial)' },
                ].map(t => {
                  const active = editTiers.includes(t.key);
                  return (
                    <div
                      key={t.key}
                      onClick={() => {
                        if (active) {
                          setEditTiers(prev => prev.filter(x => x !== t.key));
                        } else {
                          setEditTiers(prev => [...prev, t.key]);
                        }
                      }}
                      className={`p-3 rounded-xl border cursor-pointer text-xs font-bold flex items-center justify-between ${
                        active ? 'bg-emerald-50 border-emerald-500 text-emerald-900' : 'bg-slate-50 border-slate-200 text-slate-600'
                      }`}
                    >
                      <span>{t.label}</span>
                      <span>{active ? '✓ Unlocked' : '🔒 Locked'}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Unlocked Services */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Module Feature Toggles
              </label>
              <div className="grid grid-cols-2 gap-2 text-xs font-bold">
                {[
                  { key: 'cbt' as const, label: 'CBT Examination Portal' },
                  { key: 'alumniCommunity' as const, label: 'Alumni Network' },
                  { key: 'digitalIdStudio' as const, label: 'Smart ID Card Studio' },
                  { key: 'parentPortal' as const, label: 'Parent Ward Monitoring' },
                  { key: 'bursaryGateways' as const, label: 'Paystack / Bank Gateways' },
                ].map(s => {
                  const active = editServices[s.key];
                  return (
                    <button
                      type="button"
                      key={s.key}
                      onClick={() => setEditServices(prev => ({ ...prev, [s.key]: !prev[s.key] }))}
                      className={`p-2.5 rounded-xl border text-left flex items-center justify-between ${
                        active ? 'bg-emerald-50 border-emerald-400 text-emerald-900' : 'bg-slate-50 border-slate-200 text-slate-500'
                      }`}
                    >
                      <span className="truncate">{s.label}</span>
                      <span>{active ? 'ON' : 'OFF'}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setSelectedSchoolToEdit(null)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={saveEditedServices}
                className="px-6 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
