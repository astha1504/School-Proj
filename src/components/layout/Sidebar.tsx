'use client';

import React from 'react';
import { 
  LayoutDashboard, 
  Users, 
  BookOpen, 
  Award, 
  CalendarCheck, 
  Coins, 
  Bell, 
  Settings, 
  GraduationCap, 
  LogOut,
  MonitorPlay,
  HeartHandshake,
  MessageSquare,
  CreditCard,
  Building2,
  Lock,
  UserCheck,
  ShieldCheck,
  Globe
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const Sidebar: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const { activePage, setActivePage, logout, currentUser, settings } = useApp();

  // Define allowed nav item IDs per user role
  const getRoleAllowedItems = (role?: string): string[] => {
    switch (role) {
      case 'student':
        return ['overview', 'attendance', 'bursary', 'cbt', 'grading', 'academics', 'notices'];
      case 'teacher':
      case 'teacher_lecturer':
      case 'principal_head':
        return ['overview', 'students', 'classes', 'academics', 'attendance', 'cbt', 'grading', 'notices'];
      case 'admin':
      case 'super_admin':
      case 'bursar':
      default:
        return ['overview', 'students', 'classes', 'academics', 'staff', 'attendance', 'bursary', 'cbt', 'grading', 'notices', 'settings'];
    }
  };

  const allowedItemIds = getRoleAllowedItems(currentUser?.role);

  const rawNavigationSections = [
    {
      title: 'Administration',
      items: [
        { id: 'overview', label: 'Dashboard & Analytics', icon: LayoutDashboard, badge: null, office: null },
        { id: 'students', label: 'Student Management', icon: Users, badge: null, office: 'Admissions' },
        { id: 'staff', label: 'Teacher Management', icon: UserCheck, badge: null, office: 'HR' },
        { id: 'classes', label: 'Classes & Programs', icon: Building2, badge: null, office: 'Admin' },
        { id: 'academics', label: 'Study Materials & Curriculum', icon: BookOpen, badge: null, office: 'Academics' },
      ]
    },
    {
      title: 'Attendance & Examination',
      items: [
        { id: 'attendance', label: 'Attendance Management', icon: CalendarCheck, badge: null, office: null },
        { id: 'cbt', label: 'Assessments & MCQ Exams', icon: MonitorPlay, badge: 'Live', office: null },
        { id: 'grading', label: 'Results & Performance', icon: Award, badge: null, office: 'Academics' },
      ]
    },
    {
      title: 'Finance & Communication',
      items: [
        { id: 'bursary', label: 'Fee Management', icon: Coins, badge: null, office: 'Accounts' },
        { id: 'notices', label: 'Notifications & Notices', icon: Bell, badge: null, office: null },
      ]
    },
    {
      title: 'Settings',
      items: [
        { id: 'settings', label: 'School Settings', icon: Settings, badge: null, office: 'Admin' },
      ]
    }
  ];

  const navigationSections = rawNavigationSections
    .map(sec => ({
      ...sec,
      items: sec.items.filter(item => allowedItemIds.includes(item.id))
    }))
    .filter(sec => sec.items.length > 0);

  const handleNavClick = (id: string) => {
    setActivePage(id);
    onClose();
  };

  const userRoleStr = (currentUser?.role || '') as string;
  const roleLabel =
    userRoleStr === 'admin' || userRoleStr === 'super_admin' ? 'School Administrator' :
    userRoleStr === 'teacher' || userRoleStr === 'teacher_lecturer' ? 'Teacher Portal' :
    userRoleStr === 'student' ? 'Student Portal' :
    userRoleStr === 'bursar' ? 'Bursary / Accounts' :
    (userRoleStr || 'Portal').replace('_', ' ');

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          onClick={onClose} 
          className="fixed inset-0 bg-[#0B2D4D]/60 z-40 lg:hidden backdrop-blur-xs"
        />
      )}

      {/* Sidebar background: Deep Navy Blue #123B63 */}
      <aside className={`fixed lg:static top-0 bottom-0 left-0 z-50 w-72 bg-[#123B63] text-white flex flex-col border-r border-[#0B2D4D] transition-transform duration-300 ease-in-out ${
        isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      }`}>
        {/* Brand Header */}
        <div className="p-5 border-b border-[#0B2D4D] flex items-center space-x-3 bg-[#0B2D4D]">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#1E5A8A] to-[#123B63] p-0.5 shadow-md shrink-0 flex items-center justify-center border border-white/20">
            <div className="w-full h-full bg-[#0B2D4D] rounded-[10px] flex items-center justify-center">
              <GraduationCap className="w-5 h-5 text-white" />
            </div>
          </div>
          <div className="min-w-0 flex-1">
            <h2 className="font-poppins font-semibold text-[15px] text-white truncate tracking-tight">
              {settings.schoolName}
            </h2>
            <p className="font-poppins font-medium text-[10px] text-[#F59E0B] uppercase tracking-wider">
              EduSphere MERN ERP
            </p>
          </div>
        </div>

        {/* Current Role Pill */}
        <div className="px-4 py-3 bg-[#0B2D4D]/90 border-b border-[#1E5A8A]/40 flex items-center justify-between">
          <div className="flex items-center space-x-2 min-w-0">
            <span className="w-2 h-2 rounded-full bg-[#2E7D32] animate-pulse" />
            <span className="font-poppins font-medium text-[12px] text-white truncate capitalize">
              {roleLabel}
            </span>
          </div>
          <span className="font-inter font-semibold text-[10px] bg-[#123B63] text-white px-2 py-0.5 rounded border border-[#1E5A8A]">
            {currentUser?.identifierId || 'PORTAL'}
          </span>
        </div>

        {/* Navigation Sections */}
        <nav className="flex-1 overflow-y-auto px-3 py-3 space-y-4">
          {navigationSections.map((sec, secIdx) => (
            <div key={secIdx} className="space-y-1">
              <div className="px-3 font-poppins font-semibold text-[10px] uppercase tracking-widest text-[#E5E7EB]/70">
                {sec.title}
              </div>
              {sec.items.map((item) => {
                const Icon = item.icon;
                const isActive = activePage === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleNavClick(item.id)}
                    className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-poppins font-medium text-[14px] transition-all group ${
                      isActive
                        ? 'bg-[#1E5A8A] text-white shadow-md shadow-[#0B2D4D]/50 border-l-4 border-[#F59E0B]'
                        : 'text-white/80 hover:text-white hover:bg-[#0B2D4D]/80'
                    }`}
                  >
                    <div className="flex items-center space-x-3 min-w-0">
                      <Icon className={`w-4 h-4 transition-colors ${
                        isActive ? 'text-white' : 'text-white/70 group-hover:text-white'
                      }`} />
                      <span className="truncate">{item.label}</span>
                    </div>

                    {item.badge && (
                      <span className={`font-inter font-semibold text-[10px] px-2 py-0.5 rounded shrink-0 ${
                        isActive 
                          ? 'bg-white/20 text-white' 
                          : item.id === 'getocore_global_hq'
                            ? 'bg-[#F59E0B] text-[#0B2D4D]'
                            : item.id === 'getocore_admin'
                              ? 'bg-[#C62828] text-white'
                              : item.id === 'bursary'
                                ? 'bg-[#2E7D32] text-white'
                                : 'bg-[#0B2D4D] text-white/90 border border-white/10'
                      }`}>
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          ))}
        </nav>

        {/* User Card & Standalone Signout */}
        <div className="p-3 border-t border-[#0B2D4D] bg-[#0B2D4D]">
          <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#123B63] border border-[#1E5A8A]">
            <div className="flex items-center space-x-2.5 min-w-0">
              <div className="w-8 h-8 rounded-lg overflow-hidden bg-[#1E5A8A] text-white flex items-center justify-center font-poppins font-semibold text-[12px] shrink-0">
                {currentUser?.name ? currentUser.name.slice(0, 2).toUpperCase() : 'US'}
              </div>
              <div className="min-w-0 flex-1">
                <div className="font-poppins font-medium text-[12px] text-white truncate">{currentUser?.name}</div>
                <div className="font-inter font-normal text-[10px] text-white/70 truncate">{currentUser?.email}</div>
              </div>
            </div>

            <button
              onClick={logout}
              title="Sign Out to Standalone Login"
              className="p-1.5 text-white/70 hover:text-[#C62828] hover:bg-[#FCECEC] rounded-lg transition-colors ml-1"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>

          {/* GetoCore Digital Innovation Attribution */}
          <div className="mt-2 text-center font-inter font-normal text-[10px] text-white/60">
            <span>Powered by </span>
            <strong className="font-poppins font-medium text-[#F59E0B]">GetoCore MERN Stack</strong>
          </div>
        </div>
      </aside>
    </>
  );
};
