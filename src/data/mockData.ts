import {
  Student,
  StaffMember,
  SubjectOrCourse,
  GradeRecord,
  InvoiceRecord,
  Announcement,
  CBTExam,
  CBTSubmission,
  SchoolSettings,
  User,
  AlumniProfile,
  CommunityPost,
  ClassArm,
  GetoCoreLicenseConfig,
  TenantSchool,
  GlobalSaaSMetrics,
  GlobalBroadcastNotice,
  BursaryPaymentProofTicket,
  ParentBursaryMessage
} from '../types';

export const initialSettings: SchoolSettings = {
  schoolName: "Shri Ramanujan Vidya Mandir",
  motto: "ज्ञानं परमं बलम् — Knowledge is the Ultimate Strength",
  address: "Sector 12, Dwaraka Nagar, Visakhapatnam, Andhra Pradesh — 530016",
  email: "admin@srvmschool.edu.in",
  phone: "+91 891 234 5678 / +91 984 500 0199",
  currentSession: "2026/2027",
  currentTermOrSemester: "First Term — June to September",
  currencySymbol: "₹",
  currencyCode: "INR",
  tertiaryGradingSystem: "5.0_scale"
};

export const mockUsers: User[] = [
  {
    id: "usr_admin",
    name: "Dr. Rajesh Kumar Sharma",
    email: "admin@srvmschool.edu.in",
    role: "admin",
    tier: "all",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
    identifierId: "SRVM-ADMIN-001",
    officeTitle: "School Principal & Administrator"
  },
  {
    id: "usr_teacher",
    name: "Mrs. Sunita Patel",
    email: "teacher@srvmschool.edu.in",
    role: "teacher",
    tier: "senior_sec",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80",
    identifierId: "SRVM-TCH-PHY-07",
    officeTitle: "Senior Physics Teacher & Class XII-A Form Teacher"
  },
  {
    id: "usr_student",
    name: "Arjun Mehta",
    email: "student@srvmschool.edu.in",
    role: "student",
    tier: "senior_sec",
    avatar: "https://images.unsplash.com/photo-1544717305-2782549b5136?w=150&auto=format&fit=crop&q=80",
    identifierId: "SRVM/2024/XII/089",
    officeTitle: "Class XII Science Student"
  }
];

export const mockStudents: Student[] = [];

export const sampleDemoWards: Student[] = [
  {
    id: "std_01",
    admissionNo: "SRVM/2024/V/042",
    firstName: "Priya",
    lastName: "Nair",
    gender: "Female",
    dob: "2016-04-12",
    tier: "primary",
    classOrDept: "Class V - A",
    armOrStream: "Section A",
    stateOfOrigin: "Kerala",
    guardianName: "Mr. Suresh Nair",
    guardianPhone: "+91 984 567 1234",
    guardianEmail: "parent@srvmschool.edu.in",
    feeStatus: "paid",
    feeBalance: 0,
    termAverage: 88.4,
    attendanceRate: 97,
    status: "active",
    avatarUrl: "https://images.unsplash.com/photo-1544717305-2782549b5136?w=150&auto=format&fit=crop&q=80"
  },
  {
    id: "std_04",
    admissionNo: "SRVM/2022/XII/089",
    firstName: "Arjun",
    lastName: "Mehta",
    gender: "Male",
    dob: "2008-08-22",
    tier: "senior_sec",
    classOrDept: "Class XII - Science A",
    armOrStream: "Science Stream A",
    stateOfOrigin: "Gujarat",
    guardianName: "Mr. Suresh Nair",
    guardianPhone: "+91 984 567 1234",
    guardianEmail: "parent@srvmschool.edu.in",
    feeStatus: "partial",
    feeBalance: 4500,
    termAverage: 91.2,
    attendanceRate: 99,
    status: "active",
    avatarUrl: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80"
  }
];

export const sampleDemoGrades: GradeRecord[] = [
  {
    id: "grd_01",
    studentId: "std_01",
    studentName: "Priya Nair",
    admissionNo: "SRVM/2024/V/042",
    tier: "primary",
    classOrDept: "Class V - A",
    subjectCode: "MTH-V",
    subjectName: "Mathematics",
    ca1Score: 18,
    ca2Score: 19,
    examScore: 54,
    totalScore: 91,
    grade: "A+",
    remarks: "Excellent grasp of arithmetic and problem-solving.",
    session: "2026/2027",
    termOrSemester: "First Term",
    psychomotor: {
      punctuality: 5,
      neatness: 5,
      politeness: 5,
      attentiveness: 5,
      sportsAndGym: 4
    }
  },
  {
    id: "grd_02",
    studentId: "std_01",
    studentName: "Priya Nair",
    admissionNo: "SRVM/2024/V/042",
    tier: "primary",
    classOrDept: "Class V - A",
    subjectCode: "ENG-V",
    subjectName: "English Language",
    ca1Score: 19,
    ca2Score: 17,
    examScore: 52,
    totalScore: 88,
    grade: "A",
    remarks: "Speaks with clarity and exhibits high comprehension.",
    session: "2026/2027",
    termOrSemester: "First Term"
  },
  {
    id: "grd_03",
    studentId: "std_04",
    studentName: "Arjun Mehta",
    admissionNo: "SRVM/2022/XII/089",
    tier: "senior_sec",
    classOrDept: "Class XII - Science A",
    subjectCode: "PHY-XII",
    subjectName: "Physics",
    ca1Score: 19,
    ca2Score: 20,
    examScore: 56,
    totalScore: 95,
    grade: "A+",
    remarks: "Outstanding performance. Excellent lab technique and numerical accuracy.",
    session: "2026/2027",
    termOrSemester: "First Term"
  },
  {
    id: "grd_04",
    studentId: "std_04",
    studentName: "Arjun Mehta",
    admissionNo: "SRVM/2022/XII/089",
    tier: "senior_sec",
    classOrDept: "Class XII - Science A",
    subjectCode: "CHM-XII",
    subjectName: "Chemistry",
    ca1Score: 18,
    ca2Score: 18,
    examScore: 53,
    totalScore: 89,
    grade: "A",
    remarks: "Strong command over organic chemistry and reaction mechanisms.",
    session: "2026/2027",
    termOrSemester: "First Term"
  }
];

export const sampleDemoInvoices: InvoiceRecord[] = [
  {
    id: "inv_01",
    invoiceNo: "INV-SRVM-2026-0041",
    studentId: "std_01",
    studentName: "Priya Nair",
    admissionNo: "SRVM/2024/V/042",
    tier: "primary",
    feeType: "Primary School Tuition & Academic Materials",
    amount: 18000,
    amountPaid: 18000,
    balance: 0,
    status: "paid",
    session: "2026/2027",
    termOrSemester: "First Term",
    dueDate: "2026-06-30",
    transactionRef: "UPI-SRVM-9982140",
    paymentMethod: "UPI / Online Transfer",
    receiptDate: "2026-06-04",
    clearedByOffice: "Office of the Accounts Incharge"
  },
  {
    id: "inv_04",
    invoiceNo: "INV-SRVM-2026-0115",
    studentId: "std_04",
    studentName: "Arjun Mehta",
    admissionNo: "SRVM/2022/XII/089",
    tier: "senior_sec",
    feeType: "Class XII Board Examination & Annual Tuition",
    amount: 32000,
    amountPaid: 27500,
    balance: 4500,
    status: "unpaid",
    session: "2026/2027",
    termOrSemester: "First Term",
    dueDate: "2026-07-31",
    transactionRef: "NEFT-SRVM-4418291",
    paymentMethod: "NEFT Bank Transfer",
    receiptDate: "2026-06-10",
    clearedByOffice: "Office of the Accounts Incharge"
  }
];

export const mockSubjects: SubjectOrCourse[] = [
  // Primary Wing (NERDC Standard)
  {
    id: "sub_p1",
    code: "ENG-PRI",
    name: "English Studies & Phonics",
    tier: "primary",
    level: "Primary 1 - 6",
    category: "Core",
    periodsPerWeek: 5,
    teacherName: "Unassigned",
    syllabusOutline: "NERDC Primary English: Jolly Phonics, reading comprehension, vocabulary expansion, and composition.",
    approvedByOffice: "Office of the Vice Principal (Academics)",
    status: "active"
  },
  {
    id: "sub_p2",
    code: "MTH-PRI",
    name: "Mathematics & Quantitative Reasoning",
    tier: "primary",
    level: "Primary 1 - 6",
    category: "Core",
    periodsPerWeek: 5,
    teacherName: "Unassigned",
    syllabusOutline: "Numeracy, mental arithmetic, geometry, word problems, and quantitative aptitude test drills.",
    approvedByOffice: "Office of the Vice Principal (Academics)",
    status: "active"
  },
  {
    id: "sub_p3",
    code: "BST-PRI",
    name: "Basic Science & Technology",
    tier: "primary",
    level: "Primary 1 - 6",
    category: "Science",
    periodsPerWeek: 4,
    teacherName: "Unassigned",
    syllabusOutline: "Living and non-living things, weather observation, energy forms, basic ICT and computer appreciation.",
    approvedByOffice: "Office of the Vice Principal (Academics)",
    status: "active"
  },
  {
    id: "sub_p4",
    code: "NVE-PRI",
    name: "National Values & Civic Education",
    tier: "primary",
    level: "Primary 1 - 6",
    category: "General",
    periodsPerWeek: 3,
    teacherName: "Unassigned",
    syllabusOutline: "Civic rights, Nigerian cultural heritage, peace education, social habits, and moral instructions.",
    approvedByOffice: "Office of the Vice Principal (Academics)",
    status: "active"
  },
  {
    id: "sub_p5",
    code: "AGR-PRI",
    name: "Agricultural Science & Nature Studies",
    tier: "primary",
    level: "Primary 1 - 6",
    category: "Vocational",
    periodsPerWeek: 3,
    teacherName: "Unassigned",
    syllabusOutline: "Soil classification, school garden farm management, domestic animal husbandry, and food storage.",
    approvedByOffice: "Office of the Vice Principal (Academics)",
    status: "active"
  },

  // Junior Secondary Wing (NERDC 9-Year Basic Education Curriculum)
  {
    id: "sub_j1",
    code: "ENG-JSS",
    name: "English Studies & Literature in English",
    tier: "junior_sec",
    level: "JSS 1 - 3",
    category: "Core",
    periodsPerWeek: 5,
    teacherName: "Unassigned",
    syllabusOutline: "BECE preparation: Grammatical structures, prose, poetry, phonetics (vowel/consonant contrasts), and formal letter writing.",
    approvedByOffice: "Department of Languages & Humanities",
    status: "active"
  },
  {
    id: "sub_j2",
    code: "MTH-JSS",
    name: "General Mathematics",
    tier: "junior_sec",
    level: "JSS 1 - 3",
    category: "Core",
    periodsPerWeek: 5,
    teacherName: "Unassigned",
    syllabusOutline: "Algebraic expressions, linear equations, plane geometry, statistics, probability, and commercial arithmetic.",
    approvedByOffice: "Department of Mathematics & Computing",
    status: "active"
  },
  {
    id: "sub_j3",
    code: "BSC-JSS",
    name: "Basic Science",
    tier: "junior_sec",
    level: "JSS 1 - 3",
    category: "Science",
    periodsPerWeek: 4,
    teacherName: "Unassigned",
    syllabusOutline: "Energy quantization, chemical systems, human digestive anatomy, ecosystem interactions, and laboratory safety.",
    approvedByOffice: "Department of Pure Sciences",
    status: "active"
  },
  {
    id: "sub_j4",
    code: "BTECH-JSS",
    name: "Basic Technology & Technical Drawing",
    tier: "junior_sec",
    level: "JSS 1 - 3",
    category: "Vocational",
    periodsPerWeek: 4,
    teacherName: "Unassigned",
    syllabusOutline: "Orthographic projection, workshop hand tools, woodwork, metalwork joints, basic electronics, and drafting boards.",
    approvedByOffice: "Department of Vocational & Technical Education",
    status: "active"
  },
  {
    id: "sub_j5",
    code: "BUS-JSS",
    name: "Business Studies & Bookkeeping",
    tier: "junior_sec",
    level: "JSS 1 - 3",
    category: "Commercial",
    periodsPerWeek: 3,
    teacherName: "Unassigned",
    syllabusOutline: "Double-entry bookkeeping, office practice, keyboarding, petty cash book, and entrepreneurial trade.",
    approvedByOffice: "Department of Commercial Studies",
    status: "active"
  },

  // Senior Secondary Wing (WAEC/NECO Standard)
  {
    id: "sub_s1",
    code: "ENG-SSS",
    name: "English Language (WASSCE/SSCE)",
    tier: "senior_sec",
    level: "SSS 1 - 3",
    category: "Core",
    periodsPerWeek: 5,
    teacherName: "Unassigned",
    syllabusOutline: "WASSCE Syllabus: Essay writing, summary passage synthesis, comprehension, test of orals, and registers.",
    approvedByOffice: "Senior Secondary Academic Directorate",
    status: "active"
  },
  {
    id: "sub_s2",
    code: "MTH-SSS",
    name: "General Mathematics",
    tier: "senior_sec",
    level: "SSS 1 - 3",
    category: "Core",
    periodsPerWeek: 5,
    teacherName: "Unassigned",
    syllabusOutline: "Trigonometry, quadratic functions, circle geometry theorems, vectors, calculus basics, and cumulative frequency.",
    approvedByOffice: "Senior Secondary Academic Directorate",
    status: "active"
  },
  {
    id: "sub_s3",
    code: "PHY-SSS",
    name: "Physics & Practicals",
    tier: "senior_sec",
    level: "SSS 1 - 3",
    category: "Science",
    periodsPerWeek: 4,
    teacherName: "Unassigned",
    syllabusOutline: "Mechanics, waves & optics, electricity & electromagnetism, atomic & nuclear physics, and WAEC alternative to practicals.",
    approvedByOffice: "Senior Secondary Academic Directorate",
    status: "active"
  },
  {
    id: "sub_s4",
    code: "CHM-SSS",
    name: "Chemistry & Lab Experiments",
    tier: "senior_sec",
    level: "SSS 1 - 3",
    category: "Science",
    periodsPerWeek: 4,
    teacherName: "Unassigned",
    syllabusOutline: "Volumetric titration analysis, qualitative cation/anion tests, chemical kinetics, organic chemistry mechanisms, and equilibrium.",
    approvedByOffice: "Senior Secondary Academic Directorate",
    status: "active"
  },
  {
    id: "sub_s5",
    code: "BIO-SSS",
    name: "Biology & Microscopic Studies",
    tier: "senior_sec",
    level: "SSS 1 - 3",
    category: "Science",
    periodsPerWeek: 4,
    teacherName: "Unassigned",
    syllabusOutline: "Genetics, Mendelian inheritance, ecological field surveys, cellular respiration, plant physiology, and specimen dissection.",
    approvedByOffice: "Senior Secondary Academic Directorate",
    status: "active"
  },
  {
    id: "sub_s6",
    code: "ECN-SSS",
    name: "Economics & Public Finance",
    tier: "senior_sec",
    level: "SSS 1 - 3",
    category: "Commercial",
    periodsPerWeek: 4,
    teacherName: "Unassigned",
    syllabusOutline: "National income accounting, elasticity of demand/supply, Nigerian fiscal policy, balance of payments, and monetary theory.",
    approvedByOffice: "Senior Secondary Academic Directorate",
    status: "active"
  },

  // Tertiary Wing (NUC/NBTE Standard)
  {
    id: "sub_u1",
    code: "CSC 301",
    name: "Data Structures & Algorithms",
    tier: "tertiary",
    level: "300 Level",
    creditUnits: 3,
    category: "Core",
    periodsPerWeek: 3,
    teacherName: "Unassigned",
    syllabusOutline: "Asymptotic notation, balanced trees (AVL, Red-Black), dynamic programming, graph algorithms (Dijkstra, Kruskal), and NP-completeness.",
    approvedByOffice: "Departmental Board of Studies (Faculty of Computing)",
    status: "active"
  },
  {
    id: "sub_u2",
    code: "CSC 305",
    name: "Database Design & Management Systems",
    tier: "tertiary",
    level: "300 Level",
    creditUnits: 3,
    category: "Core",
    periodsPerWeek: 3,
    teacherName: "Unassigned",
    syllabusOutline: "Relational algebra, SQL DDL/DML, BCNF normalization, ACID transactions, indexing, and distributed databases.",
    approvedByOffice: "Departmental Board of Studies (Faculty of Computing)",
    status: "active"
  },

  // Sub-Programs Wing
  {
    id: "sub_rem1",
    code: "MTH-IJMB",
    name: "Advanced Pure Mathematics (IJMB)",
    tier: "sub_program",
    level: "IJMB Cohort",
    category: "Core",
    periodsPerWeek: 4,
    teacherName: "Unassigned",
    syllabusOutline: "ABU IJMB Syllabus: Differential calculus, vectors, complex numbers, series and differential equations.",
    approvedByOffice: "Directorate of Remedial Studies",
    status: "active"
  }
];

export const mockGrades: GradeRecord[] = [];

export const mockInvoices: InvoiceRecord[] = [];

export const mockCBTExams: CBTExam[] = [];

export const mockCBTSubmissions: CBTSubmission[] = [];

export const mockAnnouncements: Announcement[] = [
  {
    id: "ann_01",
    title: "Welcome to Shri Ramanujan Vidya Mandir — School Management Portal",
    content: "The School Management System is now active. Principal Dr. Rajesh Kumar Sharma welcomes all staff and students to the new digital platform. Please complete your profiles and check your respective dashboards.",
    targetTier: "all",
    priority: "important",
    author: "Dr. Rajesh Kumar Sharma — School Principal",
    date: "2026-06-01"
  },
  {
    id: "ann_02",
    title: "Annual Sports Day — 15th October 2026",
    content: "All students and teachers are requested to attend the Annual Sports Day on 15th October 2026 at the school ground. Students interested in participating should register with their class teacher by 10th October.",
    targetTier: "all",
    priority: "normal",
    author: "PT Department — SRVM",
    date: "2026-09-20"
  },
  {
    id: "ann_03",
    title: "First Term Examination Schedule Released",
    content: "The First Term Examination for all classes (I–XII) will commence from 1st November 2026. Students are advised to collect their admit cards from the administrative office by 25th October. Study materials are uploaded in the portal.",
    targetTier: "all",
    priority: "urgent",
    author: "Mrs. Sunita Patel — Examination Coordinator",
    date: "2026-09-22"
  }
];

export const mockStaff: StaffMember[] = [
  {
    id: "stf_01",
    staffId: "SRVM/PRIN/001",
    name: "Dr. Rajesh Kumar Sharma",
    role: "Principal & School Administrator",
    tier: "all",
    qualification: "Ph.D Education, M.Ed, B.Ed (Hons), NET Qualified",
    departmentOrClass: "Central Administration",
    assignedSubjects: [],
    assignedClassArm: "All Classes",
    trcnNumber: "CBSE-UP/2013/0001",
    trcnStatus: "certified",
    employmentDate: "2018-06-01",
    salaryGrade: "PB-4 GP 10000",
    periodsPerWeek: 0,
    officeJurisdiction: "Principal's Office",
    email: "admin@srvmschool.edu.in",
    phone: "+91 891 234 5678",
    status: "active"
  },
  {
    id: "stf_02",
    staffId: "SRVM/TCH/007",
    name: "Mrs. Sunita Patel",
    role: "Senior Teacher — Physics",
    tier: "senior_sec",
    qualification: "M.Sc Physics, B.Ed, CTET Qualified",
    departmentOrClass: "Science Department",
    assignedSubjects: ["Physics"],
    assignedClassArm: "Class XII - Science A",
    trcnNumber: "CBSE-GJ/2017/0047",
    trcnStatus: "certified",
    employmentDate: "2019-07-15",
    salaryGrade: "PB-3 GP 5400",
    periodsPerWeek: 28,
    officeJurisdiction: "Science Department Office",
    email: "teacher@srvmschool.edu.in",
    phone: "+91 982 345 6789",
    status: "active"
  },
  {
    id: "stf_03",
    staffId: "SRVM/TCH/012",
    name: "Mr. Arun Krishnamurthy",
    role: "Senior Teacher — Mathematics",
    tier: "senior_sec",
    qualification: "M.Sc Mathematics, B.Ed, TET Certified",
    departmentOrClass: "Mathematics Department",
    assignedSubjects: ["Mathematics"],
    assignedClassArm: "Class XI-XII",
    trcnNumber: "CBSE-AP/2016/0082",
    trcnStatus: "certified",
    employmentDate: "2020-06-10",
    salaryGrade: "PB-3 GP 5400",
    periodsPerWeek: 30,
    officeJurisdiction: "Mathematics Department Office",
    email: "arun.krishnamurthy@srvmschool.edu.in",
    phone: "+91 893 456 7890",
    status: "active"
  },
  {
    id: "stf_04",
    staffId: "SRVM/TCH/018",
    name: "Ms. Pooja Verma",
    role: "Teacher — Hindi & Social Studies",
    tier: "junior_sec",
    qualification: "M.A Hindi, B.Ed, CTET Qualified",
    departmentOrClass: "Humanities Department",
    assignedSubjects: ["Hindi", "Social Studies"],
    assignedClassArm: "Class VII-IX",
    trcnNumber: "CBSE-UP/2019/0153",
    trcnStatus: "certified",
    employmentDate: "2021-07-01",
    salaryGrade: "PB-2 GP 4600",
    periodsPerWeek: 32,
    officeJurisdiction: "Humanities Block, Staff Room 2",
    email: "pooja.verma@srvmschool.edu.in",
    phone: "+91 901 234 5678",
    status: "active"
  }
];

export const mockAlumniProfiles: AlumniProfile[] = [];

export const mockCommunityPosts: CommunityPost[] = [];

export const mockClasses: ClassArm[] = [
  // Primary Wing (Nursery & Basic 1-6)
  {
    id: "cls_nur1",
    name: "Nursery 1",
    tier: "primary",
    gradeLevel: "Nursery 1",
    armOrStream: "Main Arm",
    capacity: 25,
    enrolledCount: 0,
    formTeacherName: "Unassigned",
    classroomBlock: "Early Childhood Block, Room N01",
    classPrefect: "Unassigned",
    status: "active"
  },
  {
    id: "cls_nur2",
    name: "Nursery 2",
    tier: "primary",
    gradeLevel: "Nursery 2",
    armOrStream: "Main Arm",
    capacity: 25,
    enrolledCount: 0,
    formTeacherName: "Unassigned",
    classroomBlock: "Early Childhood Block, Room N02",
    classPrefect: "Unassigned",
    status: "active"
  },
  {
    id: "cls_pri1",
    name: "Basic 1",
    tier: "primary",
    gradeLevel: "Basic 1",
    armOrStream: "Gold Arm",
    capacity: 35,
    enrolledCount: 0,
    formTeacherName: "Unassigned",
    classroomBlock: "Primary Block A, Room 101",
    classPrefect: "Unassigned",
    status: "active"
  },
  {
    id: "cls_pri2",
    name: "Basic 2",
    tier: "primary",
    gradeLevel: "Basic 2",
    armOrStream: "Gold Arm",
    capacity: 35,
    enrolledCount: 0,
    formTeacherName: "Unassigned",
    classroomBlock: "Primary Block A, Room 102",
    classPrefect: "Unassigned",
    status: "active"
  },
  {
    id: "cls_pri3",
    name: "Basic 3",
    tier: "primary",
    gradeLevel: "Basic 3",
    armOrStream: "Gold Arm",
    capacity: 35,
    enrolledCount: 0,
    formTeacherName: "Unassigned",
    classroomBlock: "Primary Block A, Room 103",
    classPrefect: "Unassigned",
    status: "active"
  },
  {
    id: "cls_pri4",
    name: "Basic 4",
    tier: "primary",
    gradeLevel: "Basic 4",
    armOrStream: "Gold Arm",
    capacity: 35,
    enrolledCount: 0,
    formTeacherName: "Unassigned",
    classroomBlock: "Primary Wing, Floor 1, Room 104",
    classPrefect: "Unassigned",
    status: "active"
  },
  {
    id: "cls_pri5",
    name: "Basic 5",
    tier: "primary",
    gradeLevel: "Basic 5",
    armOrStream: "Gold Arm",
    capacity: 35,
    enrolledCount: 0,
    formTeacherName: "Unassigned",
    classroomBlock: "Primary Wing, Floor 2, Room 201",
    classPrefect: "Unassigned",
    status: "active"
  },
  {
    id: "cls_pri6",
    name: "Basic 6",
    tier: "primary",
    gradeLevel: "Basic 6",
    armOrStream: "Gold Arm",
    capacity: 35,
    enrolledCount: 0,
    formTeacherName: "Unassigned",
    classroomBlock: "Primary Wing, Floor 2, Room 202",
    classPrefect: "Unassigned",
    status: "active"
  },

  // Junior Secondary Wing (JSS 1-3 & BECE)
  {
    id: "cls_jss1",
    name: "JSS 1",
    tier: "junior_sec",
    gradeLevel: "JSS 1",
    armOrStream: "Arm A",
    capacity: 40,
    enrolledCount: 0,
    formTeacherName: "Unassigned",
    classroomBlock: "Junior Secondary Block, Room J101",
    classPrefect: "Unassigned",
    status: "active"
  },
  {
    id: "cls_jss2",
    name: "JSS 2",
    tier: "junior_sec",
    gradeLevel: "JSS 2",
    armOrStream: "Arm A",
    capacity: 40,
    enrolledCount: 0,
    formTeacherName: "Unassigned",
    classroomBlock: "Junior Secondary Block, Room J201",
    classPrefect: "Unassigned",
    status: "active"
  },
  {
    id: "cls_jss3",
    name: "JSS 3 (BECE Class)",
    tier: "junior_sec",
    gradeLevel: "JSS 3",
    armOrStream: "Arm A",
    capacity: 40,
    enrolledCount: 0,
    formTeacherName: "Unassigned",
    classroomBlock: "Junior Secondary Block, Room J301",
    classPrefect: "Unassigned",
    status: "active"
  },

  // Senior Secondary Wing (SSS 1-3 & WAEC/NECO)
  {
    id: "cls_sss1",
    name: "SSS 1",
    tier: "senior_sec",
    gradeLevel: "SSS 1",
    armOrStream: "General Stream",
    capacity: 40,
    enrolledCount: 0,
    formTeacherName: "Unassigned",
    classroomBlock: "Senior Secondary Complex, Room S1",
    classPrefect: "Unassigned",
    status: "active"
  },
  {
    id: "cls_sss2_sci",
    name: "SSS 2 Science",
    tier: "senior_sec",
    gradeLevel: "SSS 2",
    armOrStream: "Science Stream",
    capacity: 40,
    enrolledCount: 0,
    formTeacherName: "Unassigned",
    classroomBlock: "Senior Science Complex, Lab 1",
    classPrefect: "Unassigned",
    status: "active"
  },
  {
    id: "cls_sss3_sci",
    name: "SSS 3 Science (WAEC/NECO Set)",
    tier: "senior_sec",
    gradeLevel: "SSS 3",
    armOrStream: "Pure Science Stream",
    capacity: 40,
    enrolledCount: 0,
    formTeacherName: "Unassigned",
    classroomBlock: "Senior Science Complex, Hall S3",
    classPrefect: "Unassigned",
    status: "active"
  },
  {
    id: "cls_sss3_comm",
    name: "SSS 3 Commercial",
    tier: "senior_sec",
    gradeLevel: "SSS 3",
    armOrStream: "Commercial Stream",
    capacity: 35,
    enrolledCount: 0,
    formTeacherName: "Unassigned",
    classroomBlock: "Senior Commerce Wing, Room C3",
    classPrefect: "Unassigned",
    status: "active"
  },
  {
    id: "cls_sss3_arts",
    name: "SSS 3 Arts & Humanities",
    tier: "senior_sec",
    gradeLevel: "SSS 3",
    armOrStream: "Arts & Humanities Stream",
    capacity: 35,
    enrolledCount: 0,
    formTeacherName: "Unassigned",
    classroomBlock: "Senior Arts Wing, Room A3",
    classPrefect: "Unassigned",
    status: "active"
  },

  // Tertiary Wing (When Unlocked)
  {
    id: "cls_uni_csc3",
    name: "Computer Science (300L)",
    tier: "tertiary",
    gradeLevel: "300 Level",
    armOrStream: "Faculty of Computing",
    capacity: 60,
    enrolledCount: 0,
    formTeacherName: "Unassigned",
    classroomBlock: "Computing Complex, Lecture Theatre 1",
    classPrefect: "Unassigned",
    status: "active"
  },

  // Sub-Programs Wing (When Unlocked)
  {
    id: "cls_sub_ijmb",
    name: "IJMB 'A' Level Direct Entry",
    tier: "sub_program",
    gradeLevel: "Cohort 2026",
    armOrStream: "Remedial Sciences",
    capacity: 45,
    enrolledCount: 0,
    formTeacherName: "Unassigned",
    classroomBlock: "Remedial Center, Room R01",
    classPrefect: "Unassigned",
    status: "active"
  }
];

export const initialLicenseConfig: GetoCoreLicenseConfig = {
  schoolTierMode: 'basic_secondary',
  unlockedTiers: ['primary', 'junior_sec', 'senior_sec'],
  unlockedServices: {
    cbt: true,
    alumniCommunity: true,
    digitalIdStudio: true,
    parentPortal: true,
    bursaryGateways: true
  },
  adminMasterKey: "GETO-2026-HQ",
  licenseStatus: 'active',
  tenantTierDescription: "Basic & Secondary Enterprise License (Nursery, Primary, JSS 1-3, SSS 1-3)",
  lastUpdated: "2026-09-18"
};

export const mockTenantSchools: TenantSchool[] = [
  {
    id: "tenant_apex",
    slug: "apexroyal",
    name: "Apex Royal Academy & Polytechnic College",
    motto: "Knowledge, Character, and Innovation for the Nation",
    country: "Nigeria",
    countryCode: "NG",
    flagEmoji: "🇳🇬",
    city: "Abuja",
    stateOrRegion: "Federal Capital Territory",
    currencySymbol: "₦",
    currencyCode: "NGN",
    primaryEmail: "admin@apexroyal.edu.ng",
    phone: "+234 803 555 0199",
    subdomain: "apexroyal.getocore.edu",
    logoUrl: "https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=100&auto=format&fit=crop&q=80",
    subscriptionPlan: "enterprise_global",
    billingCycle: "annual",
    annualPriceFormatted: "₦3,500,000 / yr",
    subscriptionStatus: "active",
    subscriptionExpiry: "2027-10-31",
    schoolTierMode: "basic_secondary",
    unlockedTiers: ["primary", "junior_sec", "senior_sec"],
    unlockedServices: {
      cbt: true,
      alumniCommunity: true,
      digitalIdStudio: true,
      parentPortal: true,
      bursaryGateways: true
    },
    stats: {
      totalStudents: 0,
      totalStaff: 1,
      totalClasses: 0,
      activeSession: "2026/2027",
      totalRevenueCollected: 0
    },
    createdAt: "2026-09-18"
  }
];

export const mockGlobalSaaSMetrics: GlobalSaaSMetrics = {
  totalSchools: 1,
  activeSchools: 1,
  totalStudents: 0,
  totalStaff: 1,
  annualRecurringRevenueUSD: 2300,
  annualRecurringRevenueNGN: 3500000,
  serverClusters: [
    { region: "Africa West", location: "Lagos (LOS-1)", pingMs: 12, status: "optimal" },
    { region: "Africa Central", location: "Abuja (ABV-2)", pingMs: 14, status: "optimal" },
    { region: "Europe West", location: "London (LHR-1)", pingMs: 78, status: "optimal" },
    { region: "US East", location: "Virginia (IAD-1)", pingMs: 95, status: "optimal" }
  ]
};

export const mockGlobalBroadcasts: GlobalBroadcastNotice[] = [
  {
    id: "gb_01",
    title: "GetoCore School Management System Initialized",
    content: "Platform is ready for school onboarding. GetoCore Central Admin can onboard new schools, configure tier locks, and issue institutional Super Admin credentials.",
    priority: "info",
    targetRegion: "all_regions",
    sender: "GetoCore Digital Innovation - Central Licensing Authority",
    createdAt: "2026-09-18"
  }
];

export const mockBursaryPaymentProofs: BursaryPaymentProofTicket[] = [];

export const mockParentBursaryMessages: ParentBursaryMessage[] = [];
