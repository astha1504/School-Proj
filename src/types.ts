export type EducationalTier = 'primary' | 'junior_sec' | 'senior_sec' | 'tertiary' | 'sub_program';

export type UserRole = 'admin' | 'teacher' | 'student';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  tier?: EducationalTier | 'all';
  avatar?: string;
  phone?: string;
  identifierId?: string; // Staff ID, Matric No, Parent PIN, SuperAdmin Key
  wardIds?: string[]; // If parent, IDs of their children/wards
  officeTitle?: string; // e.g. "Office of the Vice Principal (Academics)"
}

export interface Student {
  id: string;
  admissionNo: string; // e.g., EDU/PRI/2026/042, JSS/26/102, SSS/25/089, UNN/2023/CSC/014, SUB/IJMB/26/05
  firstName: string;
  lastName: string;
  otherName?: string;
  gender: 'Male' | 'Female';
  dob: string;
  tier: EducationalTier;
  classOrDept: string; // e.g. "Basic 5", "JSS 2", "SSS 3 (Science)", "Computer Science", "IJMB Remedial"
  armOrStream?: string; // e.g. "Gold", "Arm B", "Science Stream", "300 Level", "Cohort 4"
  stateOfOrigin?: string;
  guardianName: string;
  guardianPhone: string;
  guardianEmail: string;
  feeStatus: 'paid' | 'partial' | 'unpaid';
  feeBalance: number; // in NGN
  termAverage?: number; // e.g. 84.5%
  cgpa?: number; // e.g. 4.62 (out of 5.0 for tertiary)
  attendanceRate: number; // percentage
  status: 'active' | 'graduated' | 'suspended';
  avatarUrl?: string;
}

export interface ClassArm {
  id: string;
  name: string; // e.g., "Basic 5 Gold", "JSS 2A", "SSS 3 Science A", "CSC 300 Level"
  tier: EducationalTier;
  gradeLevel: string; // "Basic 5", "JSS 2", "SSS 3", "300L"
  armOrStream: string; // "Gold", "Arm A", "Science Stream", "Department of Computer Science"
  capacity: number;
  enrolledCount: number;
  formTeacherId?: string;
  formTeacherName?: string;
  classroomBlock: string;
  classPrefect?: string;
  status: 'active' | 'archived';
}

export interface CBTQuestion {
  id: string;
  questionText: string;
  options: string[];
  correctOptionIndex: number;
  explanation?: string;
  marks: number;
}

export interface CBTExam {
  id: string;
  title: string;
  subject: string;
  tier: EducationalTier;
  classLevel: string;
  durationMinutes: number;
  totalMarks: number;
  questionsCount: number;
  status: 'active' | 'upcoming' | 'completed';
  passPercentage: number;
  instructions: string;
  questions: CBTQuestion[];
}

export interface CBTSubmission {
  id: string;
  examId: string;
  examTitle: string;
  subject: string;
  studentId: string;
  studentName: string;
  tier: EducationalTier;
  score: number;
  totalMarks: number;
  percentage: number;
  status: 'passed' | 'failed';
  submittedAt: string;
  answers: Record<number, number>; // questionIndex -> selectedOption
}

export interface StaffMember {
  id: string;
  staffId: string;
  name: string;
  role: string;
  tier: EducationalTier | 'all';
  qualification: string;
  departmentOrClass: string;
  assignedSubjects: string[];
  assignedClassArm?: string;
  trcnNumber?: string;
  trcnStatus: 'certified' | 'pending' | 'exempt';
  employmentDate: string;
  salaryGrade: string; // e.g. "GL 08", "GL 10", "GL 12", "GL 14"
  periodsPerWeek?: number;
  officeJurisdiction?: string; // "Registry & Human Resources"
  email: string;
  phone: string;
  status: 'active' | 'on_leave';
}

export interface SubjectOrCourse {
  id: string;
  code: string;
  name: string;
  tier: EducationalTier;
  level: string; // "Basic 1-6", "JSS 1-3", "SSS 1-3", "300 Level"
  creditUnits?: number; // For Tertiary (e.g. 3 CU)
  category?: 'Core' | 'Science' | 'Arts' | 'Commercial' | 'Vocational' | 'General';
  periodsPerWeek: number; // e.g. 4
  assignedTeacherId?: string;
  teacherName?: string;
  syllabusOutline?: string;
  status?: 'active' | 'archived';
  approvedByOffice?: string; // "Office of the Vice Principal (Academics)"
}

export interface GradeRecord {
  id: string;
  studentId: string;
  studentName: string;
  admissionNo: string;
  tier: EducationalTier;
  classOrDept: string;
  subjectCode: string;
  subjectName: string;
  ca1Score: number; // 20 marks
  ca2Score: number; // 20 marks
  examScore: number; // 60 marks
  totalScore: number; // 100 marks
  grade: string; // A1, B2, C4... or A, B, C, D, E, F
  gradePoint?: number; // 5.0 scale for tertiary
  creditUnits?: number;
  remarks: string;
  session?: string;
  termOrSemester?: string;
  psychomotor?: {
    punctuality: number; // 1 to 5
    neatness: number;
    politeness: number;
    attentiveness: number;
    sportsAndGym: number;
  };
}

export interface InvoiceRecord {
  id: string;
  invoiceNo: string;
  studentId: string;
  studentName: string;
  admissionNo: string;
  tier: EducationalTier | 'all';
  classOrDept?: string;
  feeType: string; // e.g. "School Tuition", "PTA & Development Levy", "Science Lab & Practicals", "WAEC Exam Fee", "Acceptance & Faculty Dues"
  amount: number; // in NGN
  amountPaid: number;
  balance: number;
  status: 'paid' | 'partial' | 'unpaid';
  session: string;
  termOrSemester: string;
  dueDate: string;
  transactionRef?: string;
  paymentMethod?: string;
  paymentGateway?: 'paystack' | 'flutterwave' | 'remita' | 'moniepoint' | 'bank_transfer' | 'pos';
  receiptDate?: string;
  clearedByOffice?: string; // "Office of the Chief Bursar"
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  targetTier: EducationalTier | 'all' | 'parents';
  priority: 'normal' | 'important' | 'urgent';
  author: string;
  date: string;
}

export interface AttendanceRecord {
  id: string;
  date: string;
  studentId: string;
  studentName: string;
  tier: EducationalTier;
  classOrDept: string;
  status: 'present' | 'absent' | 'late' | 'excused';
  remark?: string;
}

export interface SchoolSettings {
  schoolName: string;
  motto: string;
  address: string;
  email: string;
  phone: string;
  currentSession: string; // "2026/2027"
  currentTermOrSemester: string; // "First Term / Harmattan Semester"
  currencySymbol: string; // "₦"
  currencyCode: string; // "NGN"
  tertiaryGradingSystem: '5.0_scale' | '4.0_scale';
}

export interface GetoCoreLicenseConfig {
  schoolTierMode: 'basic_secondary' | 'k12_tertiary' | 'primary_only' | 'custom';
  unlockedTiers: EducationalTier[]; // e.g. ['primary', 'junior_sec', 'senior_sec']
  unlockedServices: {
    cbt: boolean;
    alumniCommunity: boolean;
    digitalIdStudio: boolean;
    parentPortal: boolean;
    bursaryGateways: boolean;
  };
  adminMasterKey: string;
  licenseStatus: 'active' | 'suspended' | 'trial';
  tenantTierDescription: string;
  lastUpdated: string;
}

export interface CommunityComment {
  id: string;
  authorName: string;
  authorRole: string;
  authorAvatar?: string;
  isAlumni?: boolean;
  graduatingYear?: string;
  content: string;
  createdAt: string;
}

export interface CommunityPost {
  id: string;
  authorName: string;
  authorRole: string; // e.g. "Alumnus (Class of 2024)", "SSS 3 Student", "Lecturer"
  authorAvatar?: string;
  isAlumni: boolean;
  graduatingYear?: string; // e.g. "Class of 2024"
  circle: 'general' | 'alumni' | 'careers' | 'academics' | 'tertiary';
  title: string;
  content: string;
  likesCount: number;
  hasLiked?: boolean;
  tags: string[];
  createdAt: string;
  comments: CommunityComment[];
}

export interface AlumniProfile {
  id: string;
  name: string;
  admissionNo: string;
  graduatingYear: string;
  tier: EducationalTier;
  qualificationOrClass: string;
  currentRole: string; // e.g. "Software Engineer at Flutterwave", "Chartered Accountant"
  location: string;
  avatarUrl?: string;
  linkedInOrEmail?: string;
  mentorshipAvailable: boolean;
}

export interface TenantSchool {
  id: string; // e.g. "tenant_apex", "tenant_kings", "tenant_greenfield"
  slug: string; // "apexroyal", "kingscollege", "greenfield-intl"
  name: string; // "Apex Royal Academy & Polytechnic College"
  motto: string;
  country: string; // "Nigeria", "Ghana", "United Kingdom", "United States", "Kenya", "UAE"
  countryCode: string; // "NG", "GH", "GB", "US", "KE", "AE"
  flagEmoji: string; // "🇳🇬", "🇬🇭", "🇬🇧", "🇺🇸", "🇰🇪", "🇦🇪"
  city: string;
  stateOrRegion: string;
  currencySymbol: string; // "₦", "$", "£", "€", "GH₵", "KSh"
  currencyCode: string; // "NGN", "USD", "GBP", "EUR", "GHS", "KES"
  primaryEmail: string;
  phone: string;
  subdomain: string; // "apexroyal.getocore.edu"
  logoUrl?: string;
  
  // Licensing & Subscription
  subscriptionPlan: 'starter' | 'professional' | 'enterprise_global';
  billingCycle: 'annual' | 'termly' | 'monthly';
  annualPriceFormatted: string; // e.g. "₦1,850,000 / yr" or "$2,500 / yr"
  subscriptionStatus: 'active' | 'trial' | 'past_due' | 'suspended';
  subscriptionExpiry: string; // "2027-09-30"
  
  // Tier Provisioning
  schoolTierMode: 'basic_secondary' | 'k12_tertiary' | 'primary_only' | 'custom';
  unlockedTiers: EducationalTier[];
  unlockedServices: {
    cbt: boolean;
    alumniCommunity: boolean;
    digitalIdStudio: boolean;
    parentPortal: boolean;
    bursaryGateways: boolean;
  };
  
  // Metrics & Stats
  stats: {
    totalStudents: number;
    totalStaff: number;
    totalClasses: number;
    activeSession: string;
    totalRevenueCollected: number;
  };

  createdAt: string;
}

export interface GlobalSaaSMetrics {
  totalSchools: number;
  activeSchools: number;
  totalStudents: number;
  totalStaff: number;
  annualRecurringRevenueUSD: number;
  annualRecurringRevenueNGN: number;
  serverClusters: {
    region: string;
    location: string;
    pingMs: number;
    status: 'optimal' | 'warning' | 'degraded';
  }[];
}

export interface GlobalBroadcastNotice {
  id: string;
  title: string;
  content: string;
  priority: 'info' | 'important' | 'critical';
  sender: string;
  targetRegion: string;
  createdAt: string;
}

export interface BursaryPaymentProofTicket {
  id: string;
  parentId: string;
  parentName: string;
  parentPhone: string;
  parentEmail?: string;
  studentId: string;
  studentName: string;
  admissionNo: string;
  gradeLevel: string;
  feeType: string;
  amount: number;
  paymentMethod: 'bank_transfer' | 'pos' | 'bank_branch' | 'paystack';
  referenceOrTellerNo: string;
  bankName: string;
  paymentDate: string;
  proofAttachmentName?: string;
  parentNote?: string;
  status: 'submitted' | 'verified_cleared' | 'flagged_query';
  bursarRemark?: string;
  bursarName?: string;
  verifiedAt?: string;
  createdAt: string;
}

export interface ParentBursaryMessage {
  id: string;
  parentId: string;
  parentName: string;
  senderRole: 'parent' | 'bursar';
  subject: string;
  message: string;
  wardId?: string;
  wardName?: string;
  isRead: boolean;
  createdAt: string;
}

export interface FeeItemComponent {
  category: string;
  name: string;
  amount: number;
  isOptional: boolean;
  selected?: boolean;
}

export interface WardFeeCalculation {
  studentId: string;
  studentName: string;
  admissionNo: string;
  gradeLevel: string;
  tier: EducationalTier;
  components: FeeItemComponent[];
  baseTuition: number;
  leviesTotal: number;
  optionalTotal: number;
  subtotal: number;
  siblingDiscountPercent: number; // e.g. 10% on 2nd ward
  siblingDiscountAmount: number;
  netPayable: number;
  alreadyPaid: number;
  balanceDue: number;
}

export interface TransportRoute {
  id: string;
  routeName: string;
  busNumber: string;
  driverName: string;
  driverPhone: string;
  pickupStops: string[];
  capacity: number;
  assignedStudentCount: number;
  monthlyFee: number;
  status: 'active' | 'maintenance';
}

export interface LessonPlan {
  id: string;
  teacherId: string;
  teacherName: string;
  subjectCode: string;
  subjectName: string;
  classOrArm: string;
  topicTitle: string;
  weekNumber: number;
  termOrSemester: string;
  learningObjectives: string;
  status: 'planned' | 'in_progress' | 'completed';
  date: string;
}

export interface StudyMaterial {
  id: string;
  title: string;
  subjectCode: string;
  subjectName: string;
  classOrArm: string;
  fileType: 'pdf' | 'docx' | 'pptx' | 'link';
  fileUrl: string;
  description: string;
  uploadedBy: string;
  uploadedDate: string;
}

export interface DisciplineRecord {
  id: string;
  studentId: string;
  studentName: string;
  admissionNo: string;
  classOrArm: string;
  incidentDate: string;
  infractionType: string;
  actionTaken: string;
  issuedBy: string;
  status: 'active' | 'resolved';
}
