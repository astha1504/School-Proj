const express = require('express');
const router = express.Router();

const User = require('../models/User');
const Student = require('../models/Student');
const ClassArm = require('../models/ClassArm');
const Subject = require('../models/Subject');
const StaffMember = require('../models/StaffMember');
const GradeRecord = require('../models/GradeRecord');
const InvoiceRecord = require('../models/InvoiceRecord');
const CBTExam = require('../models/CBTExam');
const Announcement = require('../models/Announcement');
const TenantSchool = require('../models/TenantSchool');

// Helper to safely execute db or return mock fallback
const handleAsync = (fn) => async (req, res, next) => {
  try {
    await fn(req, res, next);
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// --- AUTH / USER ROUTES ---
router.post('/auth/login', handleAsync(async (req, res) => {
  const { query } = req.body;
  if (!query) return res.status(400).json({ success: false, message: 'Query string required' });
  const qLower = query.trim().toLowerCase();
  
  const user = await User.findOne({
    $or: [
      { id: qLower },
      { email: qLower },
      { role: qLower },
      { identifierId: qLower }
    ]
  });

  if (user) {
    return res.json({ success: true, user });
  }
  res.status(404).json({ success: false, message: 'User not found' });
}));

router.get('/users', handleAsync(async (req, res) => {
  const users = await User.find();
  res.json({ success: true, data: users });
}));

// --- STUDENTS ROUTES ---
router.get('/students', handleAsync(async (req, res) => {
  const students = await Student.find().sort({ createdAt: -1 });
  res.json({ success: true, data: students });
}));

router.post('/students', handleAsync(async (req, res) => {
  const newStudent = new Student({ ...req.body, id: req.body.id || `std_${Date.now()}` });
  await newStudent.save();
  res.status(201).json({ success: true, data: newStudent });
}));

router.put('/students/:id', handleAsync(async (req, res) => {
  const updated = await Student.findOneAndUpdate({ id: req.params.id }, req.body, { new: true });
  res.json({ success: true, data: updated });
}));

router.delete('/students/:id', handleAsync(async (req, res) => {
  await Student.findOneAndDelete({ id: req.params.id });
  res.json({ success: true, message: 'Student deleted successfully' });
}));

// --- CLASSES ROUTES ---
router.get('/classes', handleAsync(async (req, res) => {
  const classes = await ClassArm.find();
  res.json({ success: true, data: classes });
}));

router.post('/classes', handleAsync(async (req, res) => {
  const newClass = new ClassArm({ ...req.body, id: req.body.id || `cls_${Date.now()}` });
  await newClass.save();
  res.status(201).json({ success: true, data: newClass });
}));

// --- SUBJECTS ROUTES ---
router.get('/subjects', handleAsync(async (req, res) => {
  const subjects = await Subject.find();
  res.json({ success: true, data: subjects });
}));

router.post('/subjects', handleAsync(async (req, res) => {
  const newSub = new Subject({ ...req.body, id: req.body.id || `sub_${Date.now()}` });
  await newSub.save();
  res.status(201).json({ success: true, data: newSub });
}));

// --- STAFF ROUTES ---
router.get('/staff', handleAsync(async (req, res) => {
  const staff = await StaffMember.find();
  res.json({ success: true, data: staff });
}));

router.post('/staff', handleAsync(async (req, res) => {
  const newStaff = new StaffMember({ ...req.body, id: req.body.id || `stf_${Date.now()}` });
  await newStaff.save();
  res.status(201).json({ success: true, data: newStaff });
}));

// --- GRADES ROUTES ---
router.get('/grades', handleAsync(async (req, res) => {
  const grades = await GradeRecord.find();
  res.json({ success: true, data: grades });
}));

router.post('/grades', handleAsync(async (req, res) => {
  const newGrade = new GradeRecord({ ...req.body, id: req.body.id || `grd_${Date.now()}` });
  await newGrade.save();
  res.status(201).json({ success: true, data: newGrade });
}));

// --- INVOICES & BURSARY ROUTES ---
router.get('/invoices', handleAsync(async (req, res) => {
  const invoices = await InvoiceRecord.find();
  res.json({ success: true, data: invoices });
}));

router.post('/invoices', handleAsync(async (req, res) => {
  const newInv = new InvoiceRecord({ ...req.body, id: req.body.id || `inv_${Date.now()}` });
  await newInv.save();
  res.status(201).json({ success: true, data: newInv });
}));

router.post('/invoices/:id/payment', handleAsync(async (req, res) => {
  const { amount, paymentMethod, paymentGateway, customRef } = req.body;
  const inv = await InvoiceRecord.findOne({ id: req.params.id });
  if (!inv) return res.status(404).json({ success: false, message: 'Invoice not found' });
  
  const newPaid = inv.amountPaid + Number(amount);
  const newBal = Math.max(0, inv.amount - newPaid);
  const newStatus = newBal === 0 ? 'paid' : (newPaid > 0 ? 'partial' : 'unpaid');
  
  inv.amountPaid = newPaid;
  inv.balance = newBal;
  inv.status = newStatus;
  inv.paymentMethod = paymentMethod || 'paystack';
  inv.paymentGateway = paymentGateway || 'paystack';
  inv.transactionRef = customRef || `PSK_NG_${Date.now().toString().slice(-8)}`;
  inv.receiptDate = new Date().toISOString().split('T')[0];
  inv.clearedByOffice = "Office of the Chief Bursar";

  await inv.save();
  res.json({ success: true, data: inv });
}));

// --- CBT EXAMS ROUTES ---
router.get('/cbt', handleAsync(async (req, res) => {
  const exams = await CBTExam.find();
  res.json({ success: true, data: exams });
}));

// --- ANNOUNCEMENTS ROUTES ---
router.get('/announcements', handleAsync(async (req, res) => {
  const notices = await Announcement.find();
  res.json({ success: true, data: notices });
}));

// --- TENANTS / MULTI-TENANCY ROUTES ---
router.get('/tenants', handleAsync(async (req, res) => {
  const tenants = await TenantSchool.find();
  res.json({ success: true, data: tenants });
}));

module.exports = router;
