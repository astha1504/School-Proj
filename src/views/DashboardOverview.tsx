'use client';

import React from 'react';
import { 
  Users, 
  BookOpen, 
  CalendarCheck, 
  GraduationCap, 
  ArrowUpRight, 
  MonitorPlay, 
  Bell,
  CheckCircle2,
  AlertCircle,
  Clock,
  FileText,
  Award,
  BarChart2,
  Bus,
  ClipboardList,
  BookMarked,
  Coins
} from 'lucide-react';
import { useApp } from '../context/AppContext';

// ─── ADMIN DASHBOARD ───────────────────────────────────────────────────
const AdminDashboard: React.FC = () => {
  const { students, staff, invoices, announcements, setActivePage, settings, cbtExams } = useApp();

  const totalFees = invoices.reduce((a, b) => a + b.amountPaid, 0);
  const pendingFees = invoices.reduce((a, b) => a + b.balance, 0);
  const avgAttendance = students.length > 0
    ? Math.round(students.reduce((a, s) => a + s.attendanceRate, 0) / students.length)
    : 94;

  const kpis = [
    { label: 'Total Students', value: students.length || 248, sub: 'Enrolled this session', icon: Users, color: '#1E5A8A', onClick: () => setActivePage('students') },
    { label: 'Teaching Staff', value: staff.length || 18, sub: 'Active teachers', icon: BookOpen, color: '#2E7D32', onClick: () => setActivePage('staff') },
    { label: 'Avg Attendance', value: `${avgAttendance}%`, sub: 'School-wide today', icon: CalendarCheck, color: '#F59E0B', onClick: () => setActivePage('attendance') },
    { label: 'Fee Collected', value: `₹${(totalFees || 1842000).toLocaleString('en-IN')}`, sub: `₹${(pendingFees || 245000).toLocaleString('en-IN')} pending`, icon: Coins, color: '#7C3AED', onClick: () => setActivePage('bursary') },
  ];

  const quickActions = [
    { label: 'Admit Student', page: 'students', icon: Users },
    { label: 'Add Teacher', page: 'staff', icon: BookOpen },
    { label: 'Manage Classes', page: 'classes', icon: GraduationCap },
    { label: 'Create Exam', page: 'cbt', icon: MonitorPlay },
    { label: 'Fee Reports', page: 'bursary', icon: Coins },
    { label: 'Announcements', page: 'notices', icon: Bell },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-br from-[#0B2D4D] to-[#1E5A8A] rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute -top-10 -right-10 w-48 h-48 rounded-full bg-white/5 blur-2xl" />
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 bg-white/10 px-3 py-1 rounded-full text-[12px] font-poppins font-medium mb-3 border border-white/20">
            <span className="w-2 h-2 rounded-full bg-[#4ADE80] animate-pulse" />
            Admin Portal — {settings.currentSession}, {settings.currentTermOrSemester}
          </div>
          <h1 className="font-poppins font-bold text-[26px] text-white leading-tight">
            School Administration Panel
          </h1>
          <p className="font-inter text-[14px] text-white/75 mt-1 mb-5 max-w-2xl">
            Manage students, teachers, classes, fees, transportation, examinations, and school-wide operations from one central dashboard.
          </p>
          <div className="flex flex-wrap gap-2">
            {quickActions.map(a => (
              <button
                key={a.label}
                id={`admin-quick-${a.page}`}
                onClick={() => setActivePage(a.page)}
                className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 font-poppins font-medium text-[13px] flex items-center gap-2 transition-all"
              >
                <a.icon className="w-3.5 h-3.5 text-[#FCD34D]" />
                {a.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map(kpi => (
          <button
            key={kpi.label}
            id={`admin-kpi-${kpi.label.toLowerCase().replace(/ /g, '-')}`}
            onClick={kpi.onClick}
            className="text-left bg-white p-5 rounded-2xl border border-[#E5E7EB] shadow-sm hover:shadow-md hover:border-[#1E5A8A]/40 transition-all group"
          >
            <div className="flex items-center justify-between">
              <span className="font-inter text-[11px] font-medium text-[#6B7280] uppercase tracking-wider">{kpi.label}</span>
              <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ backgroundColor: kpi.color + '18' }}>
                <kpi.icon className="w-4 h-4" style={{ color: kpi.color }} />
              </div>
            </div>
            <div className="font-poppins font-bold text-[22px] text-[#1F2937] mt-2">{kpi.value}</div>
            <div className="font-inter text-[11px] text-[#6B7280] mt-0.5">{kpi.sub}</div>
          </button>
        ))}
      </div>

      {/* Two-column grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Announcements */}
        <div className="bg-white rounded-2xl border border-[#E5E7EB] shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-poppins font-semibold text-[16px] text-[#1F2937]">School Announcements</h2>
            <button onClick={() => setActivePage('notices')} className="font-inter text-[12px] text-[#1E5A8A] hover:underline flex items-center gap-1">
              View all <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="space-y-3">
            {announcements.slice(0, 3).map(ann => (
              <div key={ann.id} className="p-3 rounded-xl bg-[#F5F7FA] border border-[#E5E7EB]">
                <div className="flex items-start gap-2">
                  <span className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${
                    ann.priority === 'urgent' ? 'bg-red-500' : ann.priority === 'important' ? 'bg-amber-500' : 'bg-blue-500'
                  }`} />
                  <div>
                    <div className="font-poppins font-semibold text-[13px] text-[#1F2937]">{ann.title}</div>
                    <div className="font-inter text-[11px] text-[#6B7280] mt-0.5 line-clamp-2">{ann.content}</div>
                    <div className="font-inter text-[10px] text-[#9CA3AF] mt-1">{ann.author} · {ann.date}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Module Summary */}
        <div className="bg-white rounded-2xl border border-[#E5E7EB] shadow-sm p-6">
          <h2 className="font-poppins font-semibold text-[16px] text-[#1F2937] mb-4">Admin Module Overview</h2>
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: 'Teacher Management', desc: 'Add, edit, assign teachers', page: 'staff', icon: BookOpen, color: '#2E7D32' },
              { label: 'Student Management', desc: 'Profiles, admissions, records', page: 'students', icon: Users, color: '#1E5A8A' },
              { label: 'Class & Programs', desc: 'Sections, timetables', page: 'classes', icon: GraduationCap, color: '#7C3AED' },
              { label: 'Reports & Analytics', desc: 'Performance, attendance', page: 'grading', icon: BarChart2, color: '#F59E0B' },
              { label: 'Fee Management', desc: 'Track payments & dues', page: 'bursary', icon: Coins, color: '#0891B2' },
              { label: 'Notices & Alerts', desc: 'School-wide announcements', page: 'notices', icon: Bell, color: '#DC2626' },
            ].map(m => (
              <button
                key={m.label}
                id={`admin-module-${m.page}`}
                onClick={() => setActivePage(m.page)}
                className="flex items-start gap-2.5 p-3 rounded-xl border border-[#E5E7EB] hover:border-[#1E5A8A]/40 hover:bg-[#F5F7FA] transition-all text-left"
              >
                <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: m.color + '18' }}>
                  <m.icon className="w-4 h-4" style={{ color: m.color }} />
                </div>
                <div>
                  <div className="font-poppins font-semibold text-[12px] text-[#1F2937]">{m.label}</div>
                  <div className="font-inter text-[10px] text-[#9CA3AF]">{m.desc}</div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── TEACHER DASHBOARD ──────────────────────────────────────────────────
const TeacherDashboard: React.FC = () => {
  const { currentUser, students, cbtExams, announcements, setActivePage, settings } = useApp();

  const myClass = 'Class XII — Science A';
  const mySubject = 'Physics';

  const timetable = [
    { time: '8:00 – 8:45 AM', class: 'Class X-B', subject: 'Physics – Wave Optics' },
    { time: '9:00 – 9:45 AM', class: 'Class XI-A', subject: 'Physics – Electrostatics' },
    { time: '10:15 – 11:00 AM', class: 'Class XII-A', subject: 'Physics – Nuclear Physics' },
    { time: '11:15 – 12:00 PM', class: 'Class XII-B', subject: 'Physics – Semiconductor Devices' },
  ];

  const teacherModules = [
    { label: 'Mark Attendance', desc: 'Daily roll call management', page: 'attendance', icon: CalendarCheck, color: '#2E7D32' },
    { label: 'Assessments / MCQ', desc: 'Create & assign exams', page: 'cbt', icon: MonitorPlay, color: '#1E5A8A' },
    { label: 'Study Materials', desc: 'Upload notes & resources', page: 'academics', icon: BookMarked, color: '#7C3AED' },
    { label: 'Lesson Planning', desc: 'Plan class-wise topics', page: 'academics', icon: FileText, color: '#F59E0B' },
    { label: 'Student Performance', desc: 'Grades & progress reports', page: 'grading', icon: BarChart2, color: '#0891B2' },
    { label: 'Notices', desc: 'School announcements', page: 'notices', icon: Bell, color: '#DC2626' },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-br from-[#1B5E20] to-[#2E7D32] rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute -top-10 -right-10 w-48 h-48 rounded-full bg-white/5 blur-2xl" />
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 bg-white/10 px-3 py-1 rounded-full text-[12px] font-poppins font-medium mb-3 border border-white/20">
            <span className="w-2 h-2 rounded-full bg-[#4ADE80] animate-pulse" />
            Teacher Portal — {settings.currentSession}
          </div>
          <h1 className="font-poppins font-bold text-[26px] text-white leading-tight">
            Good Morning, {currentUser?.name?.split(' ')[1] || 'Teacher'}!
          </h1>
          <p className="font-inter text-[14px] text-white/75 mt-1">
            Class Teacher: <strong className="text-white">{myClass}</strong> &nbsp;|&nbsp; Subject In-charge: <strong className="text-white">{mySubject}</strong>
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            {[
              { label: 'Mark Attendance', page: 'attendance' },
              { label: 'Create MCQ Exam', page: 'cbt' },
              { label: 'Upload Materials', page: 'academics' },
              { label: 'My Students', page: 'students' },
            ].map(a => (
              <button key={a.label} id={`teacher-quick-${a.page}`} onClick={() => setActivePage(a.page)}
                className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 font-poppins font-medium text-[13px] flex items-center gap-2 transition-all">
                {a.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "My Class Students", value: students.length || 38, icon: Users, color: '#2E7D32' },
          { label: "Today's Classes", value: 4, icon: CalendarCheck, color: '#1E5A8A' },
          { label: "Exams Created", value: cbtExams.length || 3, icon: MonitorPlay, color: '#7C3AED' },
          { label: "Pending Assessments", value: 2, icon: ClipboardList, color: '#F59E0B' },
        ].map(stat => (
          <div key={stat.label} className="bg-white p-5 rounded-2xl border border-[#E5E7EB] shadow-sm">
            <div className="flex items-center justify-between">
              <span className="font-inter text-[11px] font-medium text-[#6B7280] uppercase tracking-wider">{stat.label}</span>
              <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ backgroundColor: stat.color + '18' }}>
                <stat.icon className="w-4 h-4" style={{ color: stat.color }} />
              </div>
            </div>
            <div className="font-poppins font-bold text-[22px] text-[#1F2937] mt-2">{stat.value}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Today's Timetable */}
        <div className="bg-white rounded-2xl border border-[#E5E7EB] shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-poppins font-semibold text-[16px] text-[#1F2937]">Today's Timetable</h2>
            <span className="font-inter text-[11px] text-[#6B7280] bg-[#F5F7FA] px-2 py-0.5 rounded-lg border border-[#E5E7EB]">Tuesday</span>
          </div>
          <div className="space-y-2.5">
            {timetable.map((row, i) => (
              <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-[#F5F7FA] border border-[#E5E7EB]">
                <div className="text-right shrink-0 w-28">
                  <div className="font-inter text-[11px] text-[#6B7280]">{row.time}</div>
                </div>
                <div className="w-px h-8 bg-[#2E7D32]/40" />
                <div>
                  <div className="font-poppins font-semibold text-[13px] text-[#1F2937]">{row.class}</div>
                  <div className="font-inter text-[11px] text-[#6B7280]">{row.subject}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Teacher Modules */}
        <div className="bg-white rounded-2xl border border-[#E5E7EB] shadow-sm p-6">
          <h2 className="font-poppins font-semibold text-[16px] text-[#1F2937] mb-4">Teacher Module Access</h2>
          <div className="grid grid-cols-2 gap-3">
            {teacherModules.map(m => (
              <button key={m.label} id={`teacher-module-${m.page}`} onClick={() => setActivePage(m.page)}
                className="flex items-start gap-2.5 p-3 rounded-xl border border-[#E5E7EB] hover:border-[#2E7D32]/40 hover:bg-[#F5F7FA] transition-all text-left">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: m.color + '18' }}>
                  <m.icon className="w-4 h-4" style={{ color: m.color }} />
                </div>
                <div>
                  <div className="font-poppins font-semibold text-[12px] text-[#1F2937]">{m.label}</div>
                  <div className="font-inter text-[10px] text-[#9CA3AF]">{m.desc}</div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Announcements for Teacher */}
      <div className="bg-white rounded-2xl border border-[#E5E7EB] shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-poppins font-semibold text-[16px] text-[#1F2937]">School Notices</h2>
          <button onClick={() => setActivePage('notices')} className="font-inter text-[12px] text-[#2E7D32] hover:underline flex items-center gap-1">
            View all <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {announcements.slice(0, 3).map(ann => (
            <div key={ann.id} className="p-3 rounded-xl bg-[#F5F7FA] border border-[#E5E7EB]">
              <div className="font-poppins font-semibold text-[12px] text-[#1F2937] mb-1">{ann.title}</div>
              <div className="font-inter text-[11px] text-[#6B7280] line-clamp-2">{ann.content}</div>
              <div className="font-inter text-[10px] text-[#9CA3AF] mt-2">{ann.date}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// ─── STUDENT DASHBOARD ──────────────────────────────────────────────────
const StudentDashboard: React.FC = () => {
  const { currentUser, invoices, announcements, setActivePage, settings, cbtExams } = useApp();

  const myStudent = {
    name: currentUser?.name || 'Arjun Mehta',
    rollNo: currentUser?.identifierId || 'SRVM/2024/XII/089',
    class: 'Class XII — Science A',
    attendance: 93,
    totalFee: 32000,
    paidFee: 27500,
    pendingFee: 4500,
  };

  const timetable = [
    { period: '1st', time: '8:00–8:45', subject: 'Physics', teacher: 'Mrs. Sunita Patel' },
    { period: '2nd', time: '8:45–9:30', subject: 'Mathematics', teacher: 'Mr. Arun Krishnamurthy' },
    { period: '3rd', time: '9:45–10:30', subject: 'Chemistry', teacher: 'Mr. Vikram Joshi' },
    { period: '4th', time: '10:30–11:15', subject: 'English', teacher: 'Ms. Deepa Iyer' },
    { period: '5th', time: '11:30–12:15', subject: 'Biology', teacher: 'Dr. Meena Pillai' },
  ];

  const studentModules = [
    { label: 'My Attendance', desc: 'View daily & overall %', page: 'attendance', icon: CalendarCheck, color: '#2E7D32' },
    { label: 'Fee Status', desc: 'Paid, pending & history', page: 'bursary', icon: Coins, color: '#7C3AED' },
    { label: 'Study Materials', desc: 'Notes, assignments & PPTs', page: 'academics', icon: BookMarked, color: '#1E5A8A' },
    { label: 'Timetable', desc: 'Daily & weekly schedule', page: 'classes', icon: Clock, color: '#F59E0B' },
    { label: 'Exams & MCQ', desc: 'Attempt assigned tests', page: 'cbt', icon: MonitorPlay, color: '#DC2626' },
    { label: 'My Results', desc: 'Scores & grade report', page: 'grading', icon: Award, color: '#0891B2' },
    { label: 'Notices', desc: 'School announcements', page: 'notices', icon: Bell, color: '#6366F1' },
    { label: 'Transportation', desc: 'Bus route & schedule', page: 'notices', icon: Bus, color: '#059669' },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-br from-[#78350F] to-[#D97706] rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute -top-10 -right-10 w-48 h-48 rounded-full bg-white/5 blur-2xl" />
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 bg-white/10 px-3 py-1 rounded-full text-[12px] font-poppins font-medium mb-3 border border-white/20">
            <span className="w-2 h-2 rounded-full bg-[#FCD34D] animate-pulse" />
            Student Portal — {settings.currentSession}
          </div>
          <h1 className="font-poppins font-bold text-[26px] text-white leading-tight">
            Hello, {myStudent.name.split(' ')[0]}! 👋
          </h1>
          <p className="font-inter text-[14px] text-white/80 mt-1">
            {myStudent.class} &nbsp;·&nbsp; Roll No: <strong className="text-white">{myStudent.rollNo}</strong>
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            {[
              { label: 'My Attendance', page: 'attendance' },
              { label: 'Attempt Exam', page: 'cbt' },
              { label: 'Study Materials', page: 'academics' },
              { label: 'My Results', page: 'grading' },
            ].map(a => (
              <button key={a.label} onClick={() => setActivePage(a.page)}
                className="px-3 py-1.5 rounded-xl bg-white/15 hover:bg-white/25 border border-white/25 font-poppins font-medium text-[12px] transition-all">
                {a.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Student KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-[#E5E7EB] shadow-sm">
          <div className="flex items-center justify-between">
            <span className="font-inter text-[11px] font-medium text-[#6B7280] uppercase tracking-wider">My Attendance</span>
            <CalendarCheck className="w-4 h-4 text-[#2E7D32]" />
          </div>
          <div className="font-poppins font-bold text-[24px] text-[#1F2937] mt-2">{myStudent.attendance}%</div>
          <div className={`font-inter text-[11px] mt-0.5 flex items-center gap-1 ${myStudent.attendance >= 75 ? 'text-[#2E7D32]' : 'text-red-500'}`}>
            {myStudent.attendance >= 75 ? <CheckCircle2 className="w-3 h-3" /> : <AlertCircle className="w-3 h-3" />}
            {myStudent.attendance >= 75 ? 'Above minimum 75%' : 'Below minimum 75%'}
          </div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-[#E5E7EB] shadow-sm">
          <div className="flex items-center justify-between">
            <span className="font-inter text-[11px] font-medium text-[#6B7280] uppercase tracking-wider">Fee Status</span>
            <Coins className="w-4 h-4 text-[#7C3AED]" />
          </div>
          <div className="font-poppins font-bold text-[24px] text-[#1F2937] mt-2">₹{(myStudent.paidFee).toLocaleString('en-IN')}</div>
          <div className="font-inter text-[11px] text-red-500 mt-0.5 flex items-center gap-1">
            <AlertCircle className="w-3 h-3" />
            ₹{myStudent.pendingFee.toLocaleString('en-IN')} pending
          </div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-[#E5E7EB] shadow-sm">
          <div className="flex items-center justify-between">
            <span className="font-inter text-[11px] font-medium text-[#6B7280] uppercase tracking-wider">Upcoming Exams</span>
            <MonitorPlay className="w-4 h-4 text-[#DC2626]" />
          </div>
          <div className="font-poppins font-bold text-[24px] text-[#1F2937] mt-2">{cbtExams.length || 2}</div>
          <div className="font-inter text-[11px] text-amber-600 mt-0.5">Check exam schedule</div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-[#E5E7EB] shadow-sm">
          <div className="flex items-center justify-between">
            <span className="font-inter text-[11px] font-medium text-[#6B7280] uppercase tracking-wider">Today's Classes</span>
            <Clock className="w-4 h-4 text-[#F59E0B]" />
          </div>
          <div className="font-poppins font-bold text-[24px] text-[#1F2937] mt-2">5</div>
          <div className="font-inter text-[11px] text-[#6B7280] mt-0.5">Full school day</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Today's Timetable */}
        <div className="bg-white rounded-2xl border border-[#E5E7EB] shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-poppins font-semibold text-[16px] text-[#1F2937]">Today's Timetable</h2>
            <span className="font-inter text-[11px] bg-[#F5F7FA] text-[#6B7280] px-2.5 py-0.5 rounded-lg border border-[#E5E7EB]">Tuesday</span>
          </div>
          <div className="space-y-2">
            {timetable.map((row, i) => (
              <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-[#F5F7FA] border border-[#E5E7EB]">
                <span className="font-inter font-semibold text-[11px] text-[#D97706] w-8 shrink-0">{row.period}</span>
                <div className="w-px h-8 bg-[#E5E7EB]" />
                <div className="flex-1 min-w-0">
                  <div className="font-poppins font-semibold text-[13px] text-[#1F2937]">{row.subject}</div>
                  <div className="font-inter text-[10px] text-[#9CA3AF] truncate">{row.teacher} · {row.time}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Notices */}
        <div className="bg-white rounded-2xl border border-[#E5E7EB] shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-poppins font-semibold text-[16px] text-[#1F2937]">School Notices</h2>
            <button onClick={() => setActivePage('notices')} className="font-inter text-[12px] text-[#D97706] hover:underline flex items-center gap-1">
              See all <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="space-y-2.5">
            {announcements.slice(0, 3).map(ann => (
              <div key={ann.id} className="p-3 rounded-xl bg-[#FEF9E7] border border-[#FCD34D]/30">
                <div className="font-poppins font-semibold text-[12px] text-[#1F2937] mb-0.5">{ann.title}</div>
                <div className="font-inter text-[11px] text-[#6B7280] line-clamp-2">{ann.content}</div>
                <div className="font-inter text-[10px] text-[#9CA3AF] mt-1.5">{ann.date}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Student Modules Grid */}
      <div className="bg-white rounded-2xl border border-[#E5E7EB] shadow-sm p-6">
        <h2 className="font-poppins font-semibold text-[16px] text-[#1F2937] mb-4">Your Student Portal</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {studentModules.map(m => (
            <button key={m.label} id={`student-module-${m.page}`} onClick={() => setActivePage(m.page)}
              className="flex flex-col items-center text-center gap-2 p-4 rounded-2xl border border-[#E5E7EB] hover:border-[#D97706]/40 hover:bg-[#FEF9E7] transition-all">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: m.color + '18' }}>
                <m.icon className="w-5 h-5" style={{ color: m.color }} />
              </div>
              <div className="font-poppins font-semibold text-[12px] text-[#1F2937]">{m.label}</div>
              <div className="font-inter text-[10px] text-[#9CA3AF]">{m.desc}</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

// ─── MAIN EXPORT ────────────────────────────────────────────────────────
export const DashboardOverview: React.FC = () => {
  const { currentUser } = useApp();
  const role = (currentUser?.role || '') as string;

  if (role === 'teacher' || role === 'teacher_lecturer' || role === 'principal_head') {
    return <TeacherDashboard />;
  }
  if (role === 'student') {
    return <StudentDashboard />;
  }
  // admin, super_admin, bursar, getocore_admin
  return <AdminDashboard />;
};
