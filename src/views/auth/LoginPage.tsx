'use client';

import React, { useState } from 'react';
import { 
  GraduationCap, 
  Lock, 
  User as UserIcon, 
  ArrowRight, 
  Eye, 
  EyeOff, 
  CheckCircle2, 
  ShieldCheck, 
  BookOpen,
  Medal,
  ChevronRight
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { ForgotPasswordModal } from './ForgotPasswordModal';

export const LoginPage: React.FC = () => {
  const { login, settings } = useApp();
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [selectedDemoRole, setSelectedDemoRole] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState('');

  const roleCards = [
    {
      id: 'usr_admin',
      role: 'admin',
      roleName: 'School Administrator',
      personName: 'Dr. Rajesh Kumar Sharma',
      personTitle: 'Principal & School Administrator',
      sub: 'Manage students, teachers, classes, fees, reports & settings',
      icon: ShieldCheck,
      accent: '#1E5A8A',
      bg: 'from-[#0B2D4D] to-[#1E5A8A]',
      pill: 'bg-[#1E5A8A]/20 text-[#93C5FD] border-[#1E5A8A]/30',
      email: 'admin@srvmschool.edu.in',
      features: ['Student & Teacher Management', 'Fee Tracking & Reports', 'Transport & Announcements']
    },
    {
      id: 'usr_teacher',
      role: 'teacher',
      roleName: 'Teacher Portal',
      personName: 'Mrs. Sunita Patel',
      personTitle: 'Senior Physics Teacher, Class XII-A',
      sub: 'Mark attendance, conduct assessments, upload study materials',
      icon: BookOpen,
      accent: '#2E7D32',
      bg: 'from-[#1B5E20] to-[#2E7D32]',
      pill: 'bg-[#2E7D32]/20 text-[#86EFAC] border-[#2E7D32]/30',
      email: 'teacher@srvmschool.edu.in',
      features: ['Attendance & Timetable', 'MCQ & Lesson Planning', 'Student Performance Analysis']
    },
    {
      id: 'usr_student',
      role: 'student',
      roleName: 'Student Portal',
      personName: 'Arjun Mehta',
      personTitle: 'Class XII-A Science Student',
      sub: 'View attendance, fees, study materials and attempt exams',
      icon: GraduationCap,
      accent: '#B45309',
      bg: 'from-[#78350F] to-[#B45309]',
      pill: 'bg-[#F59E0B]/20 text-[#FCD34D] border-[#F59E0B]/30',
      email: 'student@srvmschool.edu.in',
      features: ['My Attendance & Timetable', 'Fee Status & Exam Results', 'Study Materials & Notices']
    }
  ];

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!identifier.trim()) {
      setErrorMessage('Please enter your email or Student/Staff ID.');
      return;
    }
    setErrorMessage('');
    const success = login(identifier.trim());
    if (!success) {
      setErrorMessage('Invalid credentials. Please select a role card above or enter a valid registered email/ID.');
    }
  };

  const handleQuickLogin = (id: string, email: string) => {
    setSelectedDemoRole(id);
    setIdentifier(email);
    setErrorMessage('');
    login(id);
  };

  return (
    <div className="min-h-screen flex bg-[#F0F4F8]">
      {/* Left Branding Panel */}
      <div className="hidden lg:flex lg:w-5/12 xl:w-4/12 relative flex-col justify-between p-10 xl:p-14 bg-[#0B2D4D] overflow-hidden">
        {/* Decorative circles */}
        <div className="absolute -top-24 -left-24 w-80 h-80 rounded-full bg-[#1E5A8A]/20 blur-3xl" />
        <div className="absolute bottom-0 right-0 w-64 h-64 rounded-full bg-[#F59E0B]/10 blur-2xl" />

        {/* Top: School identity */}
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 rounded-2xl bg-[#F59E0B] flex items-center justify-center shadow-lg shadow-[#F59E0B]/30">
              <GraduationCap className="w-7 h-7 text-[#0B2D4D]" />
            </div>
            <div>
              <div className="font-poppins font-bold text-white text-[18px] leading-tight">
                {settings.schoolName}
              </div>
              <div className="font-inter text-[11px] text-[#93C5FD] uppercase tracking-widest mt-0.5">
                School Management System
              </div>
            </div>
          </div>

          <div className="mt-4 p-4 rounded-2xl bg-white/5 border border-white/10">
            <p className="font-inter text-[13px] text-white/70 italic leading-relaxed">
              "{settings.motto}"
            </p>
          </div>

          <div className="mt-8 space-y-3">
            {[
              { label: 'Session', value: settings.currentSession },
              { label: 'Term', value: settings.currentTermOrSemester },
              { label: 'Location', value: 'Visakhapatnam, Andhra Pradesh' },
            ].map(item => (
              <div key={item.label} className="flex items-center gap-3">
                <CheckCircle2 className="w-4 h-4 text-[#F59E0B] shrink-0" />
                <span className="font-inter text-[13px] text-white/80">
                  <span className="text-white/50">{item.label}: </span>{item.value}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Middle: Module summary */}
        <div className="relative z-10 my-6">
          <p className="font-poppins font-semibold text-[11px] uppercase tracking-widest text-[#F59E0B] mb-3">Platform Modules</p>
          <div className="grid grid-cols-2 gap-2">
            {['Attendance', 'Fee Management', 'Examinations', 'Study Materials', 'Timetable', 'Notifications'].map(mod => (
              <div key={mod} className="flex items-center gap-1.5 text-white/70 font-inter text-[12px]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#F59E0B]" />
                {mod}
              </div>
            ))}
          </div>
        </div>

        {/* Bottom: Attribution */}
        <div className="relative z-10 font-inter text-[11px] text-white/40 text-center">
          CBSE Affiliated · Est. 2003 · Visakhapatnam
        </div>
      </div>

      {/* Right: Login Panel */}
      <div className="flex-1 flex flex-col justify-center items-center px-4 sm:px-8 py-10 overflow-y-auto">
        <div className="w-full max-w-2xl">
          {/* Mobile header */}
          <div className="lg:hidden flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-[#0B2D4D] flex items-center justify-center">
              <GraduationCap className="w-5 h-5 text-[#F59E0B]" />
            </div>
            <div>
              <div className="font-poppins font-bold text-[#0B2D4D] text-[16px]">{settings.schoolName}</div>
              <div className="font-inter text-[11px] text-[#6B7280]">School Management System</div>
            </div>
          </div>

          <div className="mb-6">
            <h1 className="font-poppins font-bold text-[26px] text-[#1F2937]">Welcome Back</h1>
            <p className="font-inter text-[14px] text-[#6B7280] mt-1">
              Select your role below to sign in instantly, or enter your credentials manually.
            </p>
          </div>

          {/* === THREE ROLE CARDS === */}
          <div className="mb-6">
            <p className="font-poppins font-semibold text-[11px] uppercase tracking-widest text-[#6B7280] mb-3 flex items-center gap-2">
              <ShieldCheck className="w-3.5 h-3.5" />
              Choose Your Login Role
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {roleCards.map((card) => {
                const Icon = card.icon;
                const isSelected = selectedDemoRole === card.id;
                return (
                  <button
                    key={card.id}
                    type="button"
                    id={`role-btn-${card.role}`}
                    onClick={() => handleQuickLogin(card.id, card.email)}
                    className={`relative group flex flex-col text-left p-4 rounded-2xl border-2 transition-all duration-200 overflow-hidden ${
                      isSelected
                        ? 'border-[#1E5A8A] shadow-lg shadow-[#1E5A8A]/20 scale-[1.01]'
                        : 'border-[#E5E7EB] hover:border-[#1E5A8A]/50 hover:shadow-md'
                    } bg-white`}
                  >
                    {/* Gradient accent strip */}
                    <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${card.bg} transition-all`} />

                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 bg-gradient-to-br ${card.bg} shadow-sm`}>
                      <Icon className="w-5 h-5 text-white" />
                    </div>

                    <div className="font-poppins font-bold text-[14px] text-[#1F2937]">{card.roleName}</div>
                    <div className="font-inter font-medium text-[11px] text-[#6B7280] mt-0.5 mb-2">{card.personName}</div>
                    <div className="font-inter text-[11px] text-[#9CA3AF] leading-snug mb-3">{card.sub}</div>

                    <div className="mt-auto space-y-1">
                      {card.features.map(f => (
                        <div key={f} className="flex items-center gap-1.5 font-inter text-[10px] text-[#6B7280]">
                          <span className="w-1 h-1 rounded-full bg-current opacity-60 shrink-0" />
                          {f}
                        </div>
                      ))}
                    </div>

                    {isSelected && (
                      <div className="absolute top-3 right-3 w-5 h-5 rounded-full bg-[#1E5A8A] flex items-center justify-center">
                        <CheckCircle2 className="w-3.5 h-3.5 text-white" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Divider */}
          <div className="relative my-5 flex items-center">
            <div className="flex-1 border-t border-[#E5E7EB]" />
            <span className="mx-3 font-poppins font-medium text-[12px] text-[#9CA3AF] uppercase tracking-wider">
              Or sign in manually
            </span>
            <div className="flex-1 border-t border-[#E5E7EB]" />
          </div>

          {/* Manual Login Form */}
          <form onSubmit={handleFormSubmit} className="space-y-4 bg-white rounded-2xl border border-[#E5E7EB] p-6 shadow-sm">
            {errorMessage && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-xl font-inter text-[13px] text-red-700">
                {errorMessage}
              </div>
            )}

            <div>
              <label className="block font-poppins font-medium text-[12px] text-[#374151] uppercase tracking-wider mb-1.5">
                Email / Staff ID / Student Roll No.
              </label>
              <div className="relative">
                <UserIcon className="w-4 h-4 absolute left-3.5 top-3.5 text-[#9CA3AF]" />
                <input
                  id="input-identifier"
                  type="text"
                  value={identifier}
                  onChange={(e) => { setIdentifier(e.target.value); setSelectedDemoRole(''); }}
                  placeholder="e.g. admin@srvmschool.edu.in or SRVM/2024/XII/089"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#E5E7EB] font-inter text-[14px] focus:outline-none focus:ring-2 focus:ring-[#1E5A8A]/30 focus:border-[#1E5A8A] transition-all bg-[#F9FAFB] text-[#1F2937] placeholder:text-[#C4C9D4]"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block font-poppins font-medium text-[12px] text-[#374151] uppercase tracking-wider">
                  Password / PIN
                </label>
                <button
                  type="button"
                  onClick={() => setShowForgotModal(true)}
                  className="font-poppins font-medium text-[12px] text-[#1E5A8A] hover:underline"
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3.5 top-3.5 text-[#9CA3AF]" />
                <input
                  id="input-password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-[#E5E7EB] font-inter text-[14px] focus:outline-none focus:ring-2 focus:ring-[#1E5A8A]/30 focus:border-[#1E5A8A] transition-all bg-[#F9FAFB] text-[#1F2937]"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-[#9CA3AF] hover:text-[#374151] p-0.5"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              id="btn-login-submit"
              type="submit"
              className="w-full py-2.5 px-4 rounded-xl bg-[#0B2D4D] hover:bg-[#1E5A8A] text-white font-poppins font-semibold text-[14px] flex items-center justify-center gap-2 transition-all shadow-md group"
            >
              <span>Sign In to Portal</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </button>
          </form>

          {/* Demo hint */}
          <div className="mt-4 p-3 bg-[#FEF9E7] border border-[#F59E0B]/30 rounded-xl">
            <p className="font-inter text-[12px] text-[#92400E] text-center">
              <strong>Demo:</strong> Click any role card above to log in instantly without a password.
            </p>
          </div>

          {/* Footer */}
          <div className="mt-6 text-center">
            <p className="font-inter text-[12px] text-[#9CA3AF]">
              For account access, contact: <strong className="text-[#374151]">+91 891 234 5678</strong> · admin@srvmschool.edu.in
            </p>
          </div>
        </div>
      </div>

      <ForgotPasswordModal 
        isOpen={showForgotModal} 
        onClose={() => setShowForgotModal(false)} 
      />
    </div>
  );
};
