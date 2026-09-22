const mongoose = require('mongoose');
const connectDB = require('./config/db');

const User = require('./models/User');
const Student = require('./models/Student');
const ClassArm = require('./models/ClassArm');
const Subject = require('./models/Subject');
const StaffMember = require('./models/StaffMember');
const GradeRecord = require('./models/GradeRecord');
const InvoiceRecord = require('./models/InvoiceRecord');
const CBTExam = require('./models/CBTExam');
const Announcement = require('./models/Announcement');
const TenantSchool = require('./models/TenantSchool');

const seedData = async () => {
  await connectDB();

  console.log('Seeding initial MongoDB database records...');

  try {
    await User.deleteMany({});
    await Student.deleteMany({});
    await ClassArm.deleteMany({});
    await Subject.deleteMany({});
    await StaffMember.deleteMany({});
    await GradeRecord.deleteMany({});
    await InvoiceRecord.deleteMany({});
    await CBTExam.deleteMany({});
    await Announcement.deleteMany({});
    await TenantSchool.deleteMany({});

    // Users
    await User.insertMany([
      {
        id: 'usr_superadmin',
        name: 'Dr. Evelyn Okonkwo',
        email: 'admin@apexroyal.edu.ng',
        role: 'super_admin',
        tier: 'all',
        avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
        identifierId: 'GETO-SA-001',
        officeTitle: 'Office of the Executive Director & Principal'
      },
      {
        id: 'usr_teacher_01',
        name: 'Mr. Babatunde Lawal',
        email: 'babatunde.lawal@apexroyal.edu.ng',
        role: 'teacher_lecturer',
        tier: 'senior_sec',
        identifierId: 'TRCN-2024-8849',
        officeTitle: 'Head of Mathematics Department'
      },
      {
        id: 'usr_bursar',
        name: 'Dr. Joshua Adeleke',
        email: 'bursar@apexroyal.edu.ng',
        role: 'bursar',
        tier: 'all',
        identifierId: 'BURSAR-01',
        officeTitle: 'Chief Bursar & Director of Finance'
      }
    ]);

    // Sample Students
    await Student.insertMany([
      {
        id: 'std_01',
        admissionNo: 'EDU/SSS/2026/014',
        firstName: 'Chidimma',
        lastName: 'Eze',
        gender: 'Female',
        dob: '2009-04-12',
        tier: 'senior_sec',
        classOrDept: 'SSS 3',
        armOrStream: 'Science Stream',
        stateOfOrigin: 'Anambra',
        guardianName: 'Chief Emeka Eze',
        guardianPhone: '08031234567',
        guardianEmail: 'parent@apexroyal.edu.ng',
        feeStatus: 'paid',
        feeBalance: 0,
        termAverage: 88.5,
        attendanceRate: 98,
        status: 'active'
      },
      {
        id: 'std_02',
        admissionNo: 'EDU/CSC/2024/089',
        firstName: 'Oluwaseun',
        lastName: 'Adeyemi',
        gender: 'Male',
        dob: '2004-08-21',
        tier: 'tertiary',
        classOrDept: 'Computer Science',
        armOrStream: '300 Level',
        stateOfOrigin: 'Oyo',
        guardianName: 'Engr. Taiwo Adeyemi',
        guardianPhone: '08029876543',
        guardianEmail: 'tadeyemi@yahoo.com',
        feeStatus: 'partial',
        feeBalance: 45000,
        cgpa: 4.62,
        attendanceRate: 94,
        status: 'active'
      }
    ]);

    console.log('MongoDB Seeded Successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedData();
