'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  User, 
  UserRole,
  EducationalTier, 
  Student, 
  StaffMember, 
  SubjectOrCourse, 
  GradeRecord, 
  InvoiceRecord, 
  Announcement, 
  CBTExam, 
  CBTSubmission,
  SchoolSettings,
  CommunityPost,
  AlumniProfile,
  CommunityComment,
  ClassArm,
  GetoCoreLicenseConfig,
  TenantSchool,
  GlobalBroadcastNotice,
  GlobalSaaSMetrics,
  BursaryPaymentProofTicket,
  ParentBursaryMessage
} from '../types';
import { 
  mockUsers, 
  mockStudents, 
  mockSubjects, 
  mockGrades, 
  mockInvoices, 
  mockAnnouncements, 
  mockCBTExams, 
  mockStaff, 
  mockClasses,
  initialSettings,
  initialLicenseConfig,
  mockCommunityPosts,
  mockAlumniProfiles,
  mockTenantSchools,
  mockGlobalSaaSMetrics,
  mockGlobalBroadcasts,
  mockBursaryPaymentProofs,
  mockParentBursaryMessages,
  sampleDemoWards,
  sampleDemoGrades,
  sampleDemoInvoices
} from '../data/mockData';

const safeGetItem = (key: string): string | null => {
  if (typeof window !== 'undefined') {
    try {
      return localStorage.getItem(key);
    } catch {
      return null;
    }
  }
  return null;
};

const safeSetItem = (key: string, value: string) => {
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(key, value);
    } catch {}
  }
};

const safeRemoveItem = (key: string) => {
  if (typeof window !== 'undefined') {
    try {
      localStorage.removeItem(key);
    } catch {}
  }
};

interface AppContextType {
  currentUser: User | null;
  activeTier: EducationalTier | 'all';
  setActiveTier: (tier: EducationalTier | 'all') => void;
  activePage: string;
  setActivePage: (page: string) => void;
  students: Student[];
  subjects: SubjectOrCourse[];
  grades: GradeRecord[];
  invoices: InvoiceRecord[];
  cbtExams: CBTExam[];
  cbtSubmissions: CBTSubmission[];
  announcements: Announcement[];
  staff: StaffMember[];
  classes: ClassArm[];
  settings: SchoolSettings;
  licenseConfig: GetoCoreLicenseConfig;
  communityPosts: CommunityPost[];
  alumniProfiles: AlumniProfile[];
  login: (userOrId: string) => boolean;
  logout: () => void;
  addStudent: (student: Omit<Student, 'id'>) => void;
  updateStudent: (id: string, updates: Partial<Student>) => void;
  deleteStudent: (id: string) => void;
  addClass: (newClass: Omit<ClassArm, 'id'>) => void;
  updateClass: (id: string, updates: Partial<ClassArm>) => void;
  deleteClass: (id: string) => void;
  addSubject: (newSub: Omit<SubjectOrCourse, 'id'>) => void;
  updateSubject: (id: string, updates: Partial<SubjectOrCourse>) => void;
  deleteSubject: (id: string) => void;
  addStaff: (newStaff: Omit<StaffMember, 'id'>) => void;
  updateStaff: (id: string, updates: Partial<StaffMember>) => void;
  deleteStaff: (id: string) => void;
  addGrade: (grade: Omit<GradeRecord, 'id'>) => void;
  recordPayment: (
    invoiceId: string, 
    amount: number, 
    paymentMethod: string, 
    gateway?: 'paystack' | 'flutterwave' | 'remita' | 'moniepoint' | 'bank_transfer' | 'pos',
    customRef?: string
  ) => void;
  createInvoice: (inv: Omit<InvoiceRecord, 'id'>) => void;
  addAnnouncement: (ann: Omit<Announcement, 'id'>) => void;
  submitCBTExam: (submission: Omit<CBTSubmission, 'id'>) => void;
  addCBTExam: (exam: Omit<CBTExam, 'id'>) => void;
  addCommunityPost: (post: Omit<CommunityPost, 'id' | 'likesCount' | 'createdAt' | 'comments'>) => void;
  likeCommunityPost: (postId: string) => void;
  addCommunityComment: (postId: string, text: string) => void;
  selectedWardId: string;
  setSelectedWardId: (id: string) => void;
  updateSettings: (newSettings: Partial<SchoolSettings>) => void;
  updateLicenseConfig: (newConfig: Partial<GetoCoreLicenseConfig>) => void;
  isTierUnlocked: (tier: EducationalTier) => boolean;
  tenantSchools: TenantSchool[];
  currentTenantId: string;
  currentTenant: TenantSchool;
  globalBroadcasts: GlobalBroadcastNotice[];
  globalMetrics: GlobalSaaSMetrics;
  switchTenant: (tenantId: string) => void;
  onboardTenantSchool: (newSchool: Omit<TenantSchool, 'id' | 'stats' | 'createdAt'>) => void;
  updateTenantStatus: (tenantId: string, status: 'active' | 'trial' | 'past_due' | 'suspended') => void;
  updateTenantServices: (tenantId: string, unlockedTiers: EducationalTier[], unlockedServices: TenantSchool['unlockedServices']) => void;
  addGlobalBroadcast: (broadcast: Omit<GlobalBroadcastNotice, 'id' | 'createdAt'>) => void;
  bursaryProofTickets: BursaryPaymentProofTicket[];
  bursaryMessages: ParentBursaryMessage[];
  submitPaymentProof: (ticket: Omit<BursaryPaymentProofTicket, 'id' | 'createdAt' | 'status'>) => void;
  verifyPaymentProof: (ticketId: string, bursarRemark: string) => void;
  sendParentBursaryMessage: (msg: Omit<ParentBursaryMessage, 'id' | 'createdAt' | 'isRead'>) => void;
  recordConsolidatedFamilyPayment: (
    wardIds: string[], 
    amount: number, 
    paymentMethod: string, 
    gateway?: 'paystack' | 'flutterwave' | 'remita' | 'moniepoint' | 'bank_transfer' | 'pos', 
    customRef?: string
  ) => void;
  users: User[];
  addUser: (user: User) => void;
  resetDatabaseToCleanState: () => void;
  loadDemoParentWards: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const saved = safeGetItem('edusphere_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [activeTier, setActiveTier] = useState<EducationalTier | 'all'>('all');
  const [activePage, setActivePage] = useState<string>('overview');

  const [licenseConfig, setLicenseConfig] = useState<GetoCoreLicenseConfig>(() => {
    const saved = safeGetItem('edusphere_license');
    return saved ? JSON.parse(saved) : initialLicenseConfig;
  });

  const [students, setStudents] = useState<Student[]>(() => {
    const saved = safeGetItem('edusphere_students');
    return saved ? JSON.parse(saved) : mockStudents;
  });

  const [classes, setClasses] = useState<ClassArm[]>(() => {
    const saved = safeGetItem('edusphere_classes');
    return saved ? JSON.parse(saved) : mockClasses;
  });

  const [subjects, setSubjects] = useState<SubjectOrCourse[]>(() => {
    const saved = safeGetItem('edusphere_subjects');
    return saved ? JSON.parse(saved) : mockSubjects;
  });

  const [staff, setStaff] = useState<StaffMember[]>(() => {
    const saved = safeGetItem('edusphere_staff');
    return saved ? JSON.parse(saved) : mockStaff;
  });

  const [grades, setGrades] = useState<GradeRecord[]>(() => {
    const saved = safeGetItem('edusphere_grades');
    return saved ? JSON.parse(saved) : mockGrades;
  });

  const [invoices, setInvoices] = useState<InvoiceRecord[]>(() => {
    const saved = safeGetItem('edusphere_invoices');
    return saved ? JSON.parse(saved) : mockInvoices;
  });

  const [cbtExams, setCbtExams] = useState<CBTExam[]>(() => {
    const saved = safeGetItem('edusphere_cbt');
    return saved ? JSON.parse(saved) : mockCBTExams;
  });

  const [cbtSubmissions, setCbtSubmissions] = useState<CBTSubmission[]>(() => {
    const saved = safeGetItem('edusphere_cbt_submissions');
    return saved ? JSON.parse(saved) : [];
  });

  const [communityPosts, setCommunityPosts] = useState<CommunityPost[]>(() => {
    const saved = safeGetItem('edusphere_community_posts');
    return saved ? JSON.parse(saved) : mockCommunityPosts;
  });

  const [alumniProfiles] = useState<AlumniProfile[]>(mockAlumniProfiles);
  const [announcements, setAnnouncements] = useState<Announcement[]>(mockAnnouncements);
  const [settings, setSettings] = useState<SchoolSettings>(initialSettings);
  const [selectedWardId, setSelectedWardId] = useState<string>('std_01');

  const [users, setUsers] = useState<User[]>(() => {
    const saved = safeGetItem('edusphere_users');
    return saved ? JSON.parse(saved) : mockUsers;
  });

  // Multi-Tenant Global Schools & SaaS State
  const [tenantSchools, setTenantSchools] = useState<TenantSchool[]>(() => {
    const saved = safeGetItem('edusphere_tenant_schools');
    return saved ? JSON.parse(saved) : mockTenantSchools;
  });

  const [currentTenantId, setCurrentTenantId] = useState<string>(() => {
    const saved = safeGetItem('edusphere_current_tenant_id');
    return saved || 'tenant_apex';
  });

  const [globalBroadcasts, setGlobalBroadcasts] = useState<GlobalBroadcastNotice[]>(() => {
    const saved = safeGetItem('edusphere_global_broadcasts');
    return saved ? JSON.parse(saved) : mockGlobalBroadcasts;
  });

  const [bursaryProofTickets, setBursaryProofTickets] = useState<BursaryPaymentProofTicket[]>(() => {
    const saved = safeGetItem('edusphere_bursary_proofs');
    return saved ? JSON.parse(saved) : mockBursaryPaymentProofs;
  });

  const [bursaryMessages, setBursaryMessages] = useState<ParentBursaryMessage[]>(() => {
    const saved = safeGetItem('edusphere_bursary_messages');
    return saved ? JSON.parse(saved) : mockParentBursaryMessages;
  });

  const [globalMetrics] = useState<GlobalSaaSMetrics>(mockGlobalSaaSMetrics);

  // Production Clean Database State Initializer (Purges cached demo data)
  useEffect(() => {
    const DB_CLEAN_VERSION = 'getocore_clean_prod_v2';
    const currentVer = safeGetItem('edusphere_db_version');
    if (currentVer !== DB_CLEAN_VERSION) {
      safeSetItem('edusphere_db_version', DB_CLEAN_VERSION);
      safeSetItem('edusphere_students', JSON.stringify([]));
      safeSetItem('edusphere_grades', JSON.stringify([]));
      safeSetItem('edusphere_invoices', JSON.stringify([]));
      safeSetItem('edusphere_cbt_submissions', JSON.stringify([]));
      safeSetItem('edusphere_cbt', JSON.stringify([]));
      safeSetItem('edusphere_community_posts', JSON.stringify([]));
      safeSetItem('edusphere_bursary_proofs', JSON.stringify([]));
      safeSetItem('edusphere_bursary_messages', JSON.stringify([]));
      safeSetItem('edusphere_users', JSON.stringify(mockUsers));
      safeSetItem('edusphere_staff', JSON.stringify(mockStaff));
      safeSetItem('edusphere_classes', JSON.stringify(mockClasses));
      safeSetItem('edusphere_subjects', JSON.stringify(mockSubjects));
      safeSetItem('edusphere_announcements', JSON.stringify(mockAnnouncements));

      setStudents([]);
      setGrades([]);
      setInvoices([]);
      setCbtSubmissions([]);
      setCbtExams([]);
      setCommunityPosts([]);
      setBursaryProofTickets([]);
      setBursaryMessages([]);
      setUsers(mockUsers);
      setStaff(mockStaff);
      setClasses(mockClasses);
      setSubjects(mockSubjects);
      setAnnouncements(mockAnnouncements);
    }
  }, []);

  // Persistence effects
  useEffect(() => {
    if (currentUser) {
      safeSetItem('edusphere_user', JSON.stringify(currentUser));
    } else {
      safeRemoveItem('edusphere_user');
    }
  }, [currentUser]);

  useEffect(() => {
    safeSetItem('edusphere_users', JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    safeSetItem('edusphere_license', JSON.stringify(licenseConfig));
  }, [licenseConfig]);

  useEffect(() => {
    safeSetItem('edusphere_tenant_schools', JSON.stringify(tenantSchools));
  }, [tenantSchools]);

  useEffect(() => {
    safeSetItem('edusphere_current_tenant_id', currentTenantId);
  }, [currentTenantId]);

  useEffect(() => {
    safeSetItem('edusphere_global_broadcasts', JSON.stringify(globalBroadcasts));
  }, [globalBroadcasts]);

  useEffect(() => {
    safeSetItem('edusphere_bursary_proofs', JSON.stringify(bursaryProofTickets));
  }, [bursaryProofTickets]);

  useEffect(() => {
    safeSetItem('edusphere_bursary_messages', JSON.stringify(bursaryMessages));
  }, [bursaryMessages]);

  useEffect(() => {
    safeSetItem('edusphere_students', JSON.stringify(students));
  }, [students]);

  useEffect(() => {
    safeSetItem('edusphere_classes', JSON.stringify(classes));
  }, [classes]);

  useEffect(() => {
    safeSetItem('edusphere_subjects', JSON.stringify(subjects));
  }, [subjects]);

  useEffect(() => {
    safeSetItem('edusphere_staff', JSON.stringify(staff));
  }, [staff]);

  useEffect(() => {
    safeSetItem('edusphere_grades', JSON.stringify(grades));
  }, [grades]);

  useEffect(() => {
    safeSetItem('edusphere_invoices', JSON.stringify(invoices));
  }, [invoices]);

  useEffect(() => {
    safeSetItem('edusphere_cbt_submissions', JSON.stringify(cbtSubmissions));
  }, [cbtSubmissions]);

  useEffect(() => {
    safeSetItem('edusphere_community_posts', JSON.stringify(communityPosts));
  }, [communityPosts]);

  const currentTenant = tenantSchools.find(t => t.id === currentTenantId) || tenantSchools[0];

  const switchTenant = (tenantId: string) => {
    const target = tenantSchools.find(t => t.id === tenantId);
    if (!target) return;
    setCurrentTenantId(tenantId);
    
    // Dynamically synchronize active institution settings and currency
    setSettings(prev => ({
      ...prev,
      schoolName: target.name,
      motto: target.motto,
      address: `${target.city}, ${target.stateOrRegion}, ${target.country}`,
      email: target.primaryEmail,
      phone: target.phone,
      currencySymbol: target.currencySymbol,
      currencyCode: target.currencyCode
    }));

    // Synchronize license configuration with target school's unlocked wings & services
    setLicenseConfig({
      schoolTierMode: target.schoolTierMode,
      unlockedTiers: target.unlockedTiers,
      unlockedServices: target.unlockedServices,
      adminMasterKey: "GETO-2026-HQ",
      licenseStatus: target.subscriptionStatus === 'active' || target.subscriptionStatus === 'trial' ? 'active' : 'suspended',
      tenantTierDescription: `${target.name} (${target.country} ${target.flagEmoji}) - ${target.subscriptionPlan.toUpperCase()}`,
      lastUpdated: new Date().toISOString().split('T')[0]
    });

    // Reset activeTier if not present in the new school
    if (target.unlockedTiers.length > 0 && !target.unlockedTiers.includes(activeTier as EducationalTier) && activeTier !== 'all') {
      setActiveTier(target.unlockedTiers[0]);
    }
  };

  const onboardTenantSchool = (newSchoolData: Omit<TenantSchool, 'id' | 'stats' | 'createdAt'>) => {
    const newId = `tenant_${newSchoolData.slug.toLowerCase().replace(/[^a-z0-9]/g, '')}_${Date.now().toString().slice(-4)}`;
    const newSchool: TenantSchool = {
      ...newSchoolData,
      id: newId,
      stats: {
        totalStudents: 0,
        totalStaff: 1,
        totalClasses: 0,
        activeSession: '2026/2027',
        totalRevenueCollected: 0
      },
      createdAt: new Date().toISOString().split('T')[0]
    };
    setTenantSchools(prev => [newSchool, ...prev]);

    // Automatically provision the School Super Admin account for this newly onboarded school
    const schoolAdminUser: User = {
      id: `usr_${newSchool.slug}_admin`,
      name: `Administrator - ${newSchool.name}`,
      email: newSchool.primaryEmail,
      role: 'admin',
      tier: 'all',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      identifierId: `${newSchool.slug.toUpperCase().slice(0, 4)}-ADM-01`,
      officeTitle: `Principal / Admin (${newSchool.name})`
    };
    setUsers(prev => [schoolAdminUser, ...prev.filter(u => u.email.toLowerCase() !== schoolAdminUser.email.toLowerCase())]);
  };

  const updateTenantStatus = (tenantId: string, status: 'active' | 'trial' | 'past_due' | 'suspended') => {
    setTenantSchools(prev => prev.map(s => s.id === tenantId ? { ...s, subscriptionStatus: status } : s));
  };

  const updateTenantServices = (
    tenantId: string, 
    unlockedTiers: EducationalTier[], 
    unlockedServices: TenantSchool['unlockedServices']
  ) => {
    setTenantSchools(prev => prev.map(s => {
      if (s.id === tenantId) {
        return {
          ...s,
          unlockedTiers,
          unlockedServices
        };
      }
      return s;
    }));

    if (tenantId === currentTenantId) {
      setLicenseConfig(prev => ({
        ...prev,
        unlockedTiers,
        unlockedServices,
        lastUpdated: new Date().toISOString().split('T')[0]
      }));
    }
  };

  const addGlobalBroadcast = (broadcast: Omit<GlobalBroadcastNotice, 'id' | 'createdAt'>) => {
    const item: GlobalBroadcastNotice = {
      ...broadcast,
      id: `gb_${Date.now()}`,
      createdAt: new Date().toISOString().replace('T', ' ').slice(0, 16)
    };
    setGlobalBroadcasts(prev => [item, ...prev]);
  };

  const isTierUnlocked = (tier: EducationalTier): boolean => {
    return licenseConfig.unlockedTiers.includes(tier);
  };

  const login = (userIdOrRole: string): boolean => {
    const query = userIdOrRole.trim().toLowerCase();
    const found = users.find(u => 
      u.id.toLowerCase() === query || 
      u.email.toLowerCase() === query || 
      u.role.toLowerCase() === query ||
      (u.identifierId && u.identifierId.toLowerCase() === query)
    ) || mockUsers.find(u => 
      u.id.toLowerCase() === query || 
      u.email.toLowerCase() === query || 
      u.role.toLowerCase() === query ||
      (u.identifierId && u.identifierId.toLowerCase() === query)
    );

    if (found) {
      setCurrentUser(found);
      if (found.role === 'admin') {
        setActivePage('overview');
        setActiveTier('all');
      } else if (found.tier && found.tier !== 'all') {
        setActiveTier(found.tier);
        setActivePage('overview');
      } else {
        setActivePage('overview');
      }
      return true;
    }
    return false;
  };

  const loadDemoParentWards = () => {
    setStudents(prev => {
      const existingIds = new Set(prev.map(s => s.id));
      const toAdd = sampleDemoWards.filter(w => !existingIds.has(w.id));
      const updated = [...toAdd, ...prev];
      safeSetItem('edusphere_students', JSON.stringify(updated));
      return updated;
    });
    setGrades(prev => {
      const existingIds = new Set(prev.map(g => g.id));
      const toAdd = sampleDemoGrades.filter(g => !existingIds.has(g.id));
      const updated = [...toAdd, ...prev];
      safeSetItem('edusphere_grades', JSON.stringify(updated));
      return updated;
    });
    setInvoices(prev => {
      const existingIds = new Set(prev.map(i => i.id));
      const toAdd = sampleDemoInvoices.filter(i => !existingIds.has(i.id));
      const updated = [...toAdd, ...prev];
      safeSetItem('edusphere_invoices', JSON.stringify(updated));
      return updated;
    });
    setSelectedWardId('std_01');
  };

  const resetDatabaseToCleanState = () => {
    safeSetItem('edusphere_db_version', 'getocore_clean_prod_v2');
    safeSetItem('edusphere_students', JSON.stringify([]));
    safeSetItem('edusphere_grades', JSON.stringify([]));
    safeSetItem('edusphere_invoices', JSON.stringify([]));
    safeSetItem('edusphere_cbt_submissions', JSON.stringify([]));
    safeSetItem('edusphere_cbt', JSON.stringify([]));
    safeSetItem('edusphere_community_posts', JSON.stringify([]));
    safeSetItem('edusphere_bursary_proofs', JSON.stringify([]));
    safeSetItem('edusphere_bursary_messages', JSON.stringify([]));
    safeSetItem('edusphere_users', JSON.stringify(mockUsers));
    safeSetItem('edusphere_staff', JSON.stringify(mockStaff));
    safeSetItem('edusphere_classes', JSON.stringify(mockClasses));
    safeSetItem('edusphere_subjects', JSON.stringify(mockSubjects));
    safeSetItem('edusphere_announcements', JSON.stringify(mockAnnouncements));

    setStudents([]);
    setGrades([]);
    setInvoices([]);
    setCbtSubmissions([]);
    setCbtExams([]);
    setCommunityPosts([]);
    setBursaryProofTickets([]);
    setBursaryMessages([]);
    setUsers(mockUsers);
    setStaff(mockStaff);
    setClasses(mockClasses);
    setSubjects(mockSubjects);
    setAnnouncements(mockAnnouncements);
  };

  const addUser = (newUser: User) => {
    setUsers(prev => [newUser, ...prev.filter(u => u.email.toLowerCase() !== newUser.email.toLowerCase())]);
  };

  const logout = () => {
    setCurrentUser(null);
    setActivePage('overview');
    setActiveTier('all');
  };

  // Student CRUD
  const addStudent = (newStudent: Omit<Student, 'id'>) => {
    const student: Student = { ...newStudent, id: `std_${Date.now()}` };
    setStudents(prev => [student, ...prev]);
  };

  const updateStudent = (id: string, updates: Partial<Student>) => {
    setStudents(prev => prev.map(s => s.id === id ? { ...s, ...updates } : s));
  };

  const deleteStudent = (id: string) => {
    setStudents(prev => prev.filter(s => s.id !== id));
  };

  // Class Management CRUD
  const addClass = (newClass: Omit<ClassArm, 'id'>) => {
    const classArm: ClassArm = { ...newClass, id: `cls_${Date.now()}` };
    setClasses(prev => [classArm, ...prev]);
  };

  const updateClass = (id: string, updates: Partial<ClassArm>) => {
    setClasses(prev => prev.map(c => c.id === id ? { ...c, ...updates } : c));
  };

  const deleteClass = (id: string) => {
    setClasses(prev => prev.filter(c => c.id !== id));
  };

  // Subject Management CRUD
  const addSubject = (newSub: Omit<SubjectOrCourse, 'id'>) => {
    const sub: SubjectOrCourse = { ...newSub, id: `sub_${Date.now()}` };
    setSubjects(prev => [sub, ...prev]);
  };

  const updateSubject = (id: string, updates: Partial<SubjectOrCourse>) => {
    setSubjects(prev => prev.map(s => s.id === id ? { ...s, ...updates } : s));
  };

  const deleteSubject = (id: string) => {
    setSubjects(prev => prev.filter(s => s.id !== id));
  };

  // Staff Management CRUD
  const addStaff = (newStaffMember: Omit<StaffMember, 'id'>) => {
    const staffId = `stf_${Date.now()}`;
    const staffMember: StaffMember = { ...newStaffMember, id: staffId };
    setStaff(prev => [staffMember, ...prev]);

    let role: UserRole = 'teacher';
    const rLower = newStaffMember.role.toLowerCase();
    if (rLower.includes('principal') || rLower.includes('head') || rLower.includes('director') || rLower.includes('admin')) {
      role = 'admin';
    } else {
      role = 'teacher';
    }

    const newUser: User = {
      id: `usr_${staffId}`,
      name: newStaffMember.name,
      email: newStaffMember.email,
      role: role,
      tier: newStaffMember.tier,
      identifierId: newStaffMember.staffId,
      phone: newStaffMember.phone,
      officeTitle: newStaffMember.officeJurisdiction || newStaffMember.role
    };
    setUsers(prev => [newUser, ...prev.filter(u => u.email.toLowerCase() !== newUser.email.toLowerCase())]);
  };

  const updateStaff = (id: string, updates: Partial<StaffMember>) => {
    setStaff(prev => prev.map(st => st.id === id ? { ...st, ...updates } : st));
  };

  const deleteStaff = (id: string) => {
    setStaff(prev => prev.filter(st => st.id !== id));
  };

  const addGrade = (newGrade: Omit<GradeRecord, 'id'>) => {
    const record: GradeRecord = { ...newGrade, id: `grd_${Date.now()}` };
    setGrades(prev => [record, ...prev]);
  };

  // Bursary & Multi-Gateway Payment Recording
  const recordPayment = (
    invoiceId: string, 
    paymentAmount: number, 
    paymentMethod: string,
    gateway: 'paystack' | 'flutterwave' | 'remita' | 'moniepoint' | 'bank_transfer' | 'pos' = 'paystack',
    customRef?: string
  ) => {
    const ref = customRef || (
      gateway === 'paystack' 
        ? `PSK_NG_${Date.now().toString().slice(-8)}` 
        : gateway === 'flutterwave'
          ? `FLW_NG_${Date.now().toString().slice(-8)}`
          : gateway === 'remita'
            ? `RRR_${Math.floor(1000 + Math.random() * 9000)}-${Math.floor(1000 + Math.random() * 9000)}-${Math.floor(1000 + Math.random() * 9000)}`
            : gateway === 'moniepoint'
              ? `MP_POS_${Date.now().toString().slice(-6)}`
              : `NIBSS_TRF_${Date.now().toString().slice(-7)}`
    );

    setInvoices(prev => prev.map(inv => {
      if (inv.id === invoiceId) {
        const newPaid = inv.amountPaid + paymentAmount;
        const newBal = Math.max(0, inv.amount - newPaid);
        const newStatus = newBal === 0 ? 'paid' : (newPaid > 0 ? 'partial' : 'unpaid');
        return {
          ...inv,
          amountPaid: newPaid,
          balance: newBal,
          status: newStatus,
          paymentMethod,
          paymentGateway: gateway,
          receiptDate: new Date().toISOString().split('T')[0],
          transactionRef: ref,
          clearedByOffice: "Office of the Chief Bursar"
        };
      }
      return inv;
    }));

    const targetInv = invoices.find(i => i.id === invoiceId);
    if (targetInv) {
      updateStudent(targetInv.studentId, {
        feeBalance: Math.max(0, targetInv.balance - paymentAmount),
        feeStatus: (targetInv.balance - paymentAmount) <= 0 ? 'paid' : 'partial'
      });
    }
  };

  const recordConsolidatedFamilyPayment = (
    wardIds: string[], 
    amount: number, 
    paymentMethod: string, 
    gateway: 'paystack' | 'flutterwave' | 'remita' | 'moniepoint' | 'bank_transfer' | 'pos' = 'paystack', 
    customRef?: string
  ) => {
    const ref = customRef || `FAM_PSK_${Date.now().toString().slice(-7)}`;
    const today = new Date().toISOString().split('T')[0];

    setInvoices(prev => prev.map(inv => {
      if (wardIds.includes(inv.studentId) && inv.balance > 0) {
        return {
          ...inv,
          amountPaid: inv.amount,
          balance: 0,
          status: 'paid',
          paymentMethod,
          paymentGateway: gateway,
          receiptDate: today,
          transactionRef: ref,
          clearedByOffice: "Office of the Chief Bursar"
        };
      }
      return inv;
    }));

    wardIds.forEach(wId => {
      updateStudent(wId, {
        feeBalance: 0,
        feeStatus: 'paid'
      });
    });
  };

  const submitPaymentProof = (ticket: Omit<BursaryPaymentProofTicket, 'id' | 'createdAt' | 'status'>) => {
    const newTicket: BursaryPaymentProofTicket = {
      ...ticket,
      id: `proof_${Date.now()}`,
      status: 'submitted',
      createdAt: new Date().toISOString().replace('T', ' ').slice(0, 16)
    };
    setBursaryProofTickets(prev => [newTicket, ...prev]);
  };

  const verifyPaymentProof = (ticketId: string, bursarRemark: string) => {
    const target = bursaryProofTickets.find(t => t.id === ticketId);
    if (!target) return;

    setBursaryProofTickets(prev => prev.map(t => {
      if (t.id === ticketId) {
        return {
          ...t,
          status: 'verified_cleared',
          bursarRemark,
          bursarName: 'Dr. Joshua Adeleke (Chief Bursar)',
          verifiedAt: new Date().toISOString().replace('T', ' ').slice(0, 16)
        };
      }
      return t;
    }));

    // Settle the corresponding invoice
    const studentInvoices = invoices.filter(i => i.studentId === target.studentId && i.balance > 0);
    if (studentInvoices.length > 0) {
      const inv = studentInvoices[0];
      recordPayment(
        inv.id,
        Math.min(target.amount, inv.balance),
        `Verified Proof: ${target.paymentMethod.toUpperCase()} (${target.bankName} - ${target.referenceOrTellerNo})`,
        'bank_transfer',
        target.referenceOrTellerNo
      );
    }
  };

  const sendParentBursaryMessage = (msg: Omit<ParentBursaryMessage, 'id' | 'createdAt' | 'isRead'>) => {
    const newMsg: ParentBursaryMessage = {
      ...msg,
      id: `msg_${Date.now()}`,
      isRead: false,
      createdAt: new Date().toISOString().replace('T', ' ').slice(0, 16)
    };
    setBursaryMessages(prev => [newMsg, ...prev]);
  };

  const createInvoice = (newInv: Omit<InvoiceRecord, 'id'>) => {
    const invoice: InvoiceRecord = { ...newInv, id: `inv_${Date.now()}` };
    setInvoices(prev => [invoice, ...prev]);
  };

  const addAnnouncement = (newAnn: Omit<Announcement, 'id'>) => {
    const ann: Announcement = { ...newAnn, id: `ann_${Date.now()}` };
    setAnnouncements(prev => [ann, ...prev]);
  };

  const submitCBTExam = (sub: Omit<CBTSubmission, 'id'>) => {
    const submission: CBTSubmission = { ...sub, id: `sub_${Date.now()}` };
    setCbtSubmissions(prev => [submission, ...prev]);
  };

  const addCBTExam = (exam: Omit<CBTExam, 'id'>) => {
    const newExam: CBTExam = { ...exam, id: `cbt_${Date.now()}` };
    setCbtExams(prev => [newExam, ...prev]);
  };

  const addCommunityPost = (post: Omit<CommunityPost, 'id' | 'likesCount' | 'createdAt' | 'comments'>) => {
    const newPost: CommunityPost = {
      ...post,
      id: `post_${Date.now()}`,
      likesCount: 1,
      createdAt: 'Just now',
      comments: []
    };
    setCommunityPosts(prev => [newPost, ...prev]);
  };

  const likeCommunityPost = (postId: string) => {
    setCommunityPosts(prev => prev.map(p => {
      if (p.id === postId) {
        const hasLiked = !p.hasLiked;
        return {
          ...p,
          hasLiked,
          likesCount: hasLiked ? p.likesCount + 1 : Math.max(0, p.likesCount - 1)
        };
      }
      return p;
    }));
  };

  const addCommunityComment = (postId: string, text: string) => {
    if (!text.trim()) return;
    const newComment: CommunityComment = {
      id: `c_${Date.now()}`,
      authorName: currentUser?.name || 'Authorized Member',
      authorRole: currentUser?.role.replace('_', ' ').toUpperCase() || 'MEMBER',
      authorAvatar: currentUser?.avatar,
      content: text,
      createdAt: 'Just now'
    };

    setCommunityPosts(prev => prev.map(p => {
      if (p.id === postId) {
        return {
          ...p,
          comments: [...p.comments, newComment]
        };
      }
      return p;
    }));
  };

  const updateSettings = (newSettings: Partial<SchoolSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  };

  const updateLicenseConfig = (newConfig: Partial<GetoCoreLicenseConfig>) => {
    setLicenseConfig(prev => {
      const updated = { ...prev, ...newConfig, lastUpdated: new Date().toISOString().split('T')[0] };
      // If currently active tier is locked, reset to 'all' or first unlocked tier
      if (activeTier !== 'all' && !updated.unlockedTiers.includes(activeTier)) {
        setActiveTier(updated.unlockedTiers[0] || 'all');
      }
      return updated;
    });
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        activeTier,
        setActiveTier,
        activePage,
        setActivePage,
        students,
        classes,
        subjects,
        grades,
        invoices,
        cbtExams,
        cbtSubmissions,
        announcements,
        staff,
        settings,
        licenseConfig,
        communityPosts,
        alumniProfiles,
        login,
        logout,
        addStudent,
        updateStudent,
        deleteStudent,
        addClass,
        updateClass,
        deleteClass,
        addSubject,
        updateSubject,
        deleteSubject,
        addStaff,
        updateStaff,
        deleteStaff,
        addGrade,
        recordPayment,
        createInvoice,
        addAnnouncement,
        submitCBTExam,
        addCBTExam,
        addCommunityPost,
        likeCommunityPost,
        addCommunityComment,
        selectedWardId,
        setSelectedWardId,
        updateSettings,
        updateLicenseConfig,
        isTierUnlocked,
        tenantSchools,
        currentTenantId,
        currentTenant,
        globalBroadcasts,
        globalMetrics,
        switchTenant,
        onboardTenantSchool,
        updateTenantStatus,
        updateTenantServices,
        addGlobalBroadcast,
        bursaryProofTickets,
        bursaryMessages,
        submitPaymentProof,
        verifyPaymentProof,
        sendParentBursaryMessage,
        recordConsolidatedFamilyPayment,
        users,
        addUser,
        resetDatabaseToCleanState,
        loadDemoParentWards
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
