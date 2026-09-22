const mongoose = require('mongoose');

const invoiceRecordSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  invoiceNo: { type: String, required: true },
  studentId: { type: String, required: true },
  studentName: { type: String, required: true },
  admissionNo: { type: String, required: true },
  tier: { type: String, required: true },
  classOrDept: { type: String },
  feeType: { type: String, required: true },
  amount: { type: Number, required: true },
  amountPaid: { type: Number, default: 0 },
  balance: { type: Number, required: true },
  status: { type: String, enum: ['paid', 'partial', 'unpaid'], default: 'unpaid' },
  session: { type: String },
  termOrSemester: { type: String },
  dueDate: { type: String },
  transactionRef: { type: String },
  paymentMethod: { type: String },
  paymentGateway: { type: String },
  receiptDate: { type: String },
  clearedByOffice: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('InvoiceRecord', invoiceRecordSchema);
