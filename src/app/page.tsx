'use client';

import React from 'react';
import { useApp, AppProvider } from '../context/AppContext';
import { LoginPage } from '../views/auth/LoginPage';
import { AppLayout } from '../components/layout/AppLayout';
import { DashboardOverview } from '../views/DashboardOverview';
import { StudentsPage } from '../views/students/StudentsPage';
import { ClassManagementPage } from '../views/classes/ClassManagementPage';
import { AcademicsPage } from '../views/academics/AcademicsPage';
import { StaffManagementPage } from '../views/staff/StaffManagementPage';
import { CBTExamPage } from '../views/cbt/CBTExamPage';
import { GradingPage } from '../views/grading/GradingPage';
import { ParentPortalPage } from '../views/parent/ParentPortalPage';
import { CommunityPage } from '../views/community/CommunityPage';
import { DigitalIDStudioPage } from '../views/idcards/DigitalIDStudioPage';
import { AttendancePage } from '../views/attendance/AttendancePage';
import { FeesBursaryPage } from '../views/bursary/FeesBursaryPage';
import { NoticeBoardPage } from '../views/notices/NoticeBoardPage';
import { SettingsPage } from '../views/settings/SettingsPage';
import { GetoCoreAdminLockPage } from '../views/admin/GetoCoreAdminLockPage';
import { GetoCoreGlobalCommandCenter } from '../views/admin/GetoCoreGlobalCommandCenter';

function AppContent() {
  const { currentUser, activePage } = useApp();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  // STANDALONE LOGIN / SIGN-IN VIEW
  // Isolated, distraction-free authentication experience without dashboard frame
  if (!mounted || !currentUser) {
    return <LoginPage />;
  }

  const getRoleAllowedPages = (role?: string): string[] => {
    switch (role) {
      case 'student':
        return ['overview', 'cbt', 'grading', 'attendance', 'notices', 'community', 'bursary'];
      case 'teacher':
        return ['overview', 'students', 'classes', 'academics', 'attendance', 'cbt', 'grading', 'notices', 'community'];
      case 'admin':
      default:
        return ['overview', 'students', 'classes', 'academics', 'staff', 'attendance', 'bursary', 'cbt', 'grading', 'community', 'notices', 'settings'];
    }
  };

  const allowedPages = getRoleAllowedPages(currentUser.role);
  const effectivePage = allowedPages.includes(activePage) 
    ? activePage 
    : 'overview';

  // AUTHENTICATED DASHBOARD APPLICATION
  const renderPage = () => {
    switch (effectivePage) {
      case 'overview':
        return <DashboardOverview />;
      case 'students':
        return <StudentsPage />;
      case 'classes':
        return <ClassManagementPage />;
      case 'academics':
        return <AcademicsPage />;
      case 'staff':
        return <StaffManagementPage />;
      case 'cbt':
        return <CBTExamPage />;
      case 'grading':
        return <GradingPage />;
      case 'community':
        return <CommunityPage />;
      case 'attendance':
        return <AttendancePage />;
      case 'bursary':
        return <FeesBursaryPage />;
      case 'notices':
        return <NoticeBoardPage />;
      case 'settings':
        return <SettingsPage />;
      default:
        return <DashboardOverview />;
    }
  };

  return <AppLayout>{renderPage()}</AppLayout>;
}

export default function Home() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
