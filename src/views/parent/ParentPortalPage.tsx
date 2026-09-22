'use client';

import React, { useState } from 'react';
import { 
  HeartHandshake, 
  Users, 
  Award, 
  Coins, 
  CalendarCheck, 
  CheckCircle2, 
  AlertCircle, 
  Download, 
  MessageSquare, 
  Sparkles,
  Phone,
  Mail,
  FileText,
  CreditCard,
  Building,
  ShieldCheck,
  Smartphone,
  QrCode,
  ArrowRight,
  Copy,
  Check,
  Printer,
  HelpCircle,
  Clock,
  Landmark,
  Calculator,
  Percent,
  Receipt,
  FileCheck,
  Send,
  Upload,
  Calendar,
  Layers,
  ChevronRight,
  DollarSign
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Student, InvoiceRecord, BursaryPaymentProofTicket, ParentBursaryMessage } from '../../types';

export const ParentPortalPage: React.FC = () => {
  const { 
    currentUser,
    students, 
    grades, 
    invoices, 
    recordPayment, 
    recordConsolidatedFamilyPayment,
    bursaryProofTickets,
    submitPaymentProof,
    bursaryMessages,
    sendParentBursaryMessage,
    selectedWardId, 
    setSelectedWardId,
    settings,
    setActivePage,
    loadDemoParentWards
  } = useApp();

  // Active navigation tab
  const [activeTab, setActiveTab] = useState<'overview' | 'calculator' | 'payments' | 'bursary_desk' | 'directory'>('overview');

  // Group all students into families for Admin inspection
  const families = React.useMemo(() => {
    const map = new Map<string, Student[]>();
    students.forEach(s => {
      const guardian = s.guardianName?.trim() || 'Parent / Guardian';
      if (!map.has(guardian)) {
        map.set(guardian, []);
      }
      map.get(guardian)!.push(s);
    });
    return Array.from(map.entries()).map(([guardianName, wards]) => ({
      guardianName,
      wards,
      phone: wards[0]?.guardianPhone || 'N/A',
      email: wards[0]?.guardianEmail || 'N/A',
      totalBalance: invoices.filter(inv => wards.some(w => w.id === inv.studentId)).reduce((sum, inv) => sum + inv.balance, 0),
      allPaid: wards.every(w => w.feeStatus === 'paid')
    }));
  }, [students, invoices]);

  const [selectedGuardian, setSelectedGuardian] = useState<string>('');

  // Dynamically resolve wards linked to current session or selected family
  const myWards = React.useMemo(() => {
    if (currentUser && (currentUser.role as string) === 'parent') {
      const wardIds = currentUser.wardIds;
      if (wardIds && wardIds.length > 0) {
        const matching = students.filter(s => wardIds.includes(s.id));
        if (matching.length > 0) return matching;
      }
      const userEmail = currentUser.email || '';
      const userName = currentUser.name || '';
      const byEmailOrName = students.filter(s => 
        (s.guardianEmail && s.guardianEmail.toLowerCase() === userEmail.toLowerCase()) ||
        (s.guardianName && s.guardianName.toLowerCase().includes(userName.toLowerCase()))
      );
      if (byEmailOrName.length > 0) return byEmailOrName;
    }

    if (selectedGuardian) {
      const fam = families.find(f => f.guardianName === selectedGuardian);
      if (fam && fam.wards.length > 0) return fam.wards;
    }

    const adeleke = students.filter(s => s.guardianName?.includes('Adeleke') || s.id === 'std_01' || s.id === 'std_04');
    if (adeleke.length > 0) return adeleke;

    if (families.length > 0) return families[0].wards;

    if (students.length > 0) return students;

    return [];
  }, [currentUser, students, selectedGuardian, families]);
  
  // Active selected ward for academic inspection (safe fallback)
  const activeWard = myWards.find(s => s.id === selectedWardId) || myWards[0] || null;

  // Family naming
  const activeFamilyName = (currentUser?.role as string) === 'parent' 
    ? (currentUser?.name || 'Adeleke Family')
    : (myWards[0]?.guardianName ? `${myWards[0].guardianName} Family` : 'Adeleke Family');

  const isAdmin = (currentUser?.role as string) === 'super_admin' || (currentUser?.role as string) === 'getocore_admin' || (currentUser?.role as string) === 'principal_head' || (currentUser?.role as string) === 'bursar' || (currentUser?.role as string) === 'teacher_lecturer';

  // Ward specific records
  const wardGrades = grades.filter(g => g.studentId === activeWard?.id);
  const wardInvoices = invoices.filter(i => i.studentId === activeWard?.id);
  
  // Consolidated family financial metrics
  const allFamilyInvoices = invoices.filter(inv => myWards.some(w => w.id === inv.studentId));
  const familyTotalBilled = allFamilyInvoices.reduce((acc, inv) => acc + inv.amount, 0);
  const familyTotalPaid = allFamilyInvoices.reduce((acc, inv) => acc + inv.amountPaid, 0);
  const familyTotalBalance = allFamilyInvoices.reduce((acc, inv) => acc + inv.balance, 0);
  const totalWardBalance = wardInvoices.reduce((a, b) => a + b.balance, 0);

  // Optional services selected state in calculator
  const [optionalServices, setOptionalServices] = useState<{
    [studentId: string]: { bus: boolean; lunch: boolean }
  }>({
    std_01: { bus: true, lunch: true },
    std_04: { bus: false, lunch: false }
  });

  // Installment schedule selection in calculator
  const [selectedInstallmentPlan, setSelectedInstallmentPlan] = useState<'full' | 'two_part' | 'three_part'>('two_part');

  // Payment Modal State
  const [selectedInvoice, setSelectedInvoice] = useState<InvoiceRecord | null>(null);
  const [isConsolidatedPayment, setIsConsolidatedPayment] = useState(false);
  const [consolidatedAmountToPay, setConsolidatedAmountToPay] = useState(familyTotalBalance);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showReceiptModal, setShowReceiptModal] = useState(false);
  const [activeReceiptInvoice, setActiveReceiptInvoice] = useState<InvoiceRecord | null>(null);
  const [showClearanceModal, setShowClearanceModal] = useState(false);

  // Payment Gateway Tab inside modal
  const [paymentGatewayTab, setPaymentGatewayTab] = useState<'paystack' | 'transfer' | 'pos' | 'banks'>('paystack');

  // Paystack sub-channels
  const [paystackMethod, setPaystackMethod] = useState<'card' | 'ussd' | 'qr'>('card');
  const [cardNumber, setCardNumber] = useState('5399 4100 8820 9182');
  const [cardExpiry, setCardExpiry] = useState('09/28');
  const [cardCvv, setCardCvv] = useState('412');
  const [ussdBank, setUssdBank] = useState('gtbank');

  // Bank Teller & POS state
  const [bankTellerNo, setBankTellerNo] = useState('TEL-ZEN-2026-8819');
  const [posTerminalNo, setPosTerminalNo] = useState('MP-POS-09923');
  const [selectedSchoolBank, setSelectedSchoolBank] = useState('zenith');

  // Processing & UI state
  const [isProcessing, setIsProcessing] = useState(false);
  const [copiedAccount, setCopiedAccount] = useState(false);

  // Payment Proof Submission Form State
  const [proofForm, setProofForm] = useState({
    studentId: myWards[0]?.id || '',
    amount: 45000,
    paymentMethod: 'bank_transfer' as BursaryPaymentProofTicket['paymentMethod'],
    referenceOrTellerNo: '',
    bankName: 'Zenith Bank PLC',
    paymentDate: new Date().toISOString().split('T')[0],
    proofAttachmentName: 'Receipt_Slip.pdf',
    parentNote: ''
  });
  const [proofSubmittedSuccess, setProofSubmittedSuccess] = useState(false);

  // Bursary Message Form State
  const [bursaryMessageSubject, setBursaryMessageSubject] = useState('');
  const [bursaryMessageText, setBursaryMessageText] = useState('');
  const [bursaryMsgSentSuccess, setBursaryMsgSentSuccess] = useState(false);

  // Open Individual Invoice Payment
  const handleOpenPay = (inv: InvoiceRecord) => {
    setSelectedInvoice(inv);
    setIsConsolidatedPayment(false);
    setShowPaymentModal(true);
    setIsProcessing(false);
  };

  // Open Consolidated Family Payment
  const handleOpenConsolidatedPay = (amount?: number) => {
    setIsConsolidatedPayment(true);
    setSelectedInvoice(null);
    setConsolidatedAmountToPay(amount || familyTotalBalance);
    setShowPaymentModal(true);
    setIsProcessing(false);
  };

  const handleOpenReceipt = (inv: InvoiceRecord) => {
    setActiveReceiptInvoice(inv);
    setShowReceiptModal(true);
  };

  // Authorize Payment (Individual or Consolidated)
  const handleAuthorizeParentPayment = () => {
    setIsProcessing(true);

    setTimeout(() => {
      let methodDescription = 'Paystack Online (Mastercard)';
      let gatewayKey: any = 'paystack';
      let ref = `PSK_NG_${Date.now().toString().slice(-8)}`;

      if (paymentGatewayTab === 'paystack') {
        if (paystackMethod === 'card') {
          methodDescription = 'Paystack Debit Card Payment (3D Secure OTP Verified)';
          gatewayKey = 'paystack';
        } else if (paystackMethod === 'ussd') {
          methodDescription = `Paystack USSD (${ussdBank.toUpperCase()} Bank *737#)`;
          gatewayKey = 'paystack';
        } else {
          methodDescription = 'Paystack NQR Mobile Scan Payment';
          gatewayKey = 'paystack';
        }
      } else if (paymentGatewayTab === 'transfer') {
        methodDescription = 'Dedicated Virtual Bank Transfer (Wema Bank Titan)';
        gatewayKey = 'bank_transfer';
        ref = `NIP_TRF_${Date.now().toString().slice(-8)}`;
      } else if (paymentGatewayTab === 'pos') {
        methodDescription = `Bursary Counter POS Swipe (Terminal Ref: ${posTerminalNo})`;
        gatewayKey = 'pos';
        ref = `MP_POS_${Date.now().toString().slice(-7)}`;
      } else if (paymentGatewayTab === 'banks') {
        const bankName = selectedSchoolBank === 'zenith' ? 'Zenith Bank PLC' : selectedSchoolBank === 'gtbank' ? 'Guaranty Trust Bank' : 'Access Bank PLC';
        methodDescription = `Bank Branch Deposit / Teller (${bankName} - Slip: ${bankTellerNo})`;
        gatewayKey = 'bank_transfer';
        ref = `BNK_DEP_${Date.now().toString().slice(-7)}`;
      }

      if (isConsolidatedPayment) {
        // Consolidated family settlement
        const wardIds = myWards.map(w => w.id);
        recordConsolidatedFamilyPayment(wardIds, consolidatedAmountToPay, methodDescription, gatewayKey, ref);

        const syntheticFamilyInv: InvoiceRecord = {
          id: `inv_fam_${Date.now()}`,
          invoiceNo: `FAM-RCP-${Date.now().toString().slice(-6)}`,
          studentId: 'multi_ward_family',
          studentName: `${activeFamilyName} Consolidated (${myWards.map(w => w.firstName).join(' & ') || 'Wards'})`,
          admissionNo: 'FAMILY-CLEARANCE',
          tier: 'all',
          classOrDept: myWards.map(w => w.classOrDept).join(', ') || 'All Wards',
          session: settings.currentSession,
          termOrSemester: settings.currentTermOrSemester,
          feeType: 'Multi-Ward Consolidated Tuition & Levies Clearance',
          amount: consolidatedAmountToPay,
          amountPaid: consolidatedAmountToPay,
          balance: 0,
          status: 'paid',
          dueDate: new Date().toISOString().split('T')[0],
          paymentMethod: methodDescription,
          paymentGateway: gatewayKey,
          receiptDate: new Date().toISOString().split('T')[0],
          transactionRef: ref,
          clearedByOffice: 'Office of the Chief Bursar'
        };

        setIsProcessing(false);
        setShowPaymentModal(false);
        setActiveReceiptInvoice(syntheticFamilyInv);
        setShowReceiptModal(true);
      } else if (selectedInvoice) {
        recordPayment(selectedInvoice.id, selectedInvoice.balance, methodDescription, gatewayKey, ref);

        const updatedInv = {
          ...selectedInvoice,
          amountPaid: selectedInvoice.amount,
          balance: 0,
          status: 'paid' as const,
          paymentMethod: methodDescription,
          transactionRef: ref,
          receiptDate: new Date().toISOString().split('T')[0]
        };

        setIsProcessing(false);
        setShowPaymentModal(false);
        setActiveReceiptInvoice(updatedInv);
        setShowReceiptModal(true);
      }
    }, 1200);
  };

  // Submit Proof of Payment Ticket
  const handleSubmitProof = (e: React.FormEvent) => {
    e.preventDefault();
    if (!proofForm.referenceOrTellerNo.trim()) {
      alert('Please enter your Bank Teller Number, RRR, or Transfer Reference.');
      return;
    }

    const targetWard = myWards.find(w => w.id === proofForm.studentId) || myWards[0];

    submitPaymentProof({
      parentId: 'usr_parent',
      parentName: 'Chief Oladipo Adeleke',
      parentPhone: '+234 803 441 2099',
      parentEmail: 'oladipo.adeleke@gmail.com',
      studentId: targetWard.id,
      studentName: `${targetWard.firstName} ${targetWard.lastName}`,
      admissionNo: targetWard.admissionNo,
      gradeLevel: targetWard.classOrDept,
      feeType: 'First Term Tuition & Levies Payment',
      amount: Number(proofForm.amount),
      paymentMethod: proofForm.paymentMethod,
      referenceOrTellerNo: proofForm.referenceOrTellerNo,
      bankName: proofForm.bankName,
      paymentDate: proofForm.paymentDate,
      proofAttachmentName: proofForm.proofAttachmentName || 'Bank_Teller_Deposit.pdf',
      parentNote: proofForm.parentNote
    });

    setProofSubmittedSuccess(true);
    setProofForm(prev => ({
      ...prev,
      referenceOrTellerNo: '',
      parentNote: ''
    }));

    setTimeout(() => setProofSubmittedSuccess(false), 3500);
  };

  // Send Direct Message to Bursary
  const handleSendBursaryMsg = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bursaryMessageText.trim() || !bursaryMessageSubject.trim()) return;

    sendParentBursaryMessage({
      parentId: currentUser?.id || 'usr_parent',
      parentName: currentUser?.name || activeFamilyName,
      senderRole: 'parent',
      subject: bursaryMessageSubject,
      message: bursaryMessageText,
      wardId: activeWard?.id,
      wardName: activeWard ? `${activeWard.firstName} ${activeWard.lastName}` : 'Enrolled Scholar'
    });

    setBursaryMsgSentSuccess(true);
    setBursaryMessageSubject('');
    setBursaryMessageText('');

    setTimeout(() => setBursaryMsgSentSuccess(false), 3500);
  };

  // Calculations for Multi-Ward Accounting
  const wardCalculations = myWards.map((w, index) => {
    const isPrimary = w.tier === 'primary';
    const baseTuition = isPrimary ? 85000 : 125000;
    const developmentLevy = 20000;
    const ictCbtLevy = isPrimary ? 10000 : 15000;
    const labLevy = isPrimary ? 5000 : 25000; // WAEC/NECO lab for secondary
    const ptaSports = 10000;
    const booksUniform = isPrimary ? 25000 : 35000;

    // Optional services
    const opt = optionalServices[w.id] || { bus: false, lunch: false };
    const busFee = opt.bus ? 25000 : 0;
    const lunchFee = opt.lunch ? 18000 : 0;
    const optionalTotal = busFee + lunchFee;

    const leviesTotal = developmentLevy + ictCbtLevy + labLevy + ptaSports + booksUniform;
    const subtotal = baseTuition + leviesTotal + optionalTotal;

    // Sibling rebate (10% off tuition on 2nd and subsequent wards)
    const discountPercent = index > 0 ? 10 : 0;
    const discountAmount = (baseTuition * discountPercent) / 100;
    const netPayable = subtotal - discountAmount;

    // Invoices matching
    const matchingInvoices = invoices.filter(i => i.studentId === w.id);
    const paid = matchingInvoices.reduce((a, b) => a + b.amountPaid, 0);
    const balance = matchingInvoices.reduce((a, b) => a + b.balance, 0);

    return {
      student: w,
      index,
      baseTuition,
      developmentLevy,
      ictCbtLevy,
      labLevy,
      ptaSports,
      booksUniform,
      busFee,
      lunchFee,
      optionalTotal,
      leviesTotal,
      subtotal,
      discountPercent,
      discountAmount,
      netPayable,
      paid,
      balance
    };
  });

  const totalFamilySubtotal = wardCalculations.reduce((a, b) => a + b.subtotal, 0);
  const totalFamilySiblingDiscount = wardCalculations.reduce((a, b) => a + b.discountAmount, 0);
  const totalFamilyNetPayable = wardCalculations.reduce((a, b) => a + b.netPayable, 0);

  return (
    <div className="space-y-6 font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="p-2 rounded-xl bg-rose-100 text-rose-700">
              <HeartHandshake className="w-5 h-5" />
            </span>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              Parent Monitoring & Ward Financial Hub
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Official portal for {activeFamilyName} • Academic progress, multi-ward accounting, Paystack/Bank payments, and direct Bursary liaison.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {isAdmin && families.length > 0 && (
            <div className="flex items-center space-x-2 bg-purple-50 border border-purple-200 px-3 py-1.5 rounded-xl text-xs">
              <Users className="w-3.5 h-3.5 text-purple-700" />
              <span className="text-purple-900 font-semibold">Inspect Family:</span>
              <select
                value={selectedGuardian}
                onChange={e => setSelectedGuardian(e.target.value)}
                className="bg-white border border-purple-200 rounded-lg px-2 py-1 text-xs font-bold text-slate-800 outline-none"
              >
                <option value="">{families[0]?.guardianName ? `${families[0].guardianName} (Default)` : 'Select Family'}</option>
                {families.map(f => (
                  <option key={f.guardianName} value={f.guardianName}>
                    {f.guardianName} ({f.wards.length} {f.wards.length === 1 ? 'ward' : 'wards'})
                  </option>
                ))}
              </select>
            </div>
          )}

          <div className="flex items-center space-x-2 text-xs text-slate-600 bg-white px-3.5 py-2 rounded-xl border border-slate-200 shadow-xs">
            <Phone className="w-3.5 h-3.5 text-emerald-700" />
            <span>Chief Bursar Helpline: <strong>+234 803 555 0199</strong></span>
          </div>
        </div>
      </div>

      {/* CONSOLIDATED FAMILY FINANCIAL SNAPSHOT HERO BANNER */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-950 via-slate-900 to-emerald-950 text-white p-6 sm:p-8 shadow-xl border border-slate-800">
        <div className="absolute inset-0 bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:24px_24px] opacity-15 pointer-events-none"></div>

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-500/30">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Consolidated Family Ledger • {myWards.length} Enrolled {myWards.length === 1 ? 'Scholar' : 'Scholars'}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              {activeFamilyName} Account
            </h2>
            <div className="flex flex-wrap items-center gap-3 text-xs text-slate-300">
              {myWards.length > 0 ? (
                myWards.map(w => (
                  <span key={w.id} className="flex items-center gap-1.5 bg-slate-800/80 px-2.5 py-1 rounded-lg">
                    {w.firstName} ({w.classOrDept})
                  </span>
                ))
              ) : (
                <span className="text-slate-400 italic">No scholars currently linked to this profile</span>
              )}
              {myWards.length > 1 && (
                <span className="text-emerald-400 font-semibold">
                  • 10% Sibling Discount Enforced
                </span>
              )}
            </div>
          </div>

          {/* Quick Balance & Action Card */}
          <div className="bg-slate-900/90 border border-emerald-500/40 p-5 rounded-2xl shrink-0 text-center lg:text-right flex flex-col sm:flex-row lg:flex-col items-center sm:justify-between lg:justify-center gap-4">
            <div>
              <span className="text-[10px] text-emerald-300 uppercase tracking-wider block font-semibold">
                Consolidated Family Balance Due
              </span>
              <div className="text-3xl font-black text-white mt-0.5">
                ₦{familyTotalBalance.toLocaleString()}
              </div>
              <div className="text-[11px] text-slate-400 mt-0.5">
                Paid to date: ₦{familyTotalPaid.toLocaleString()} of ₦{familyTotalBilled.toLocaleString()}
              </div>
            </div>

            {familyTotalBalance > 0 ? (
              <button
                onClick={() => handleOpenConsolidatedPay()}
                className="w-full px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs flex items-center justify-center space-x-2 shadow-lg shadow-emerald-900/50 transition-all hover:scale-[1.02]"
              >
                <CreditCard className="w-4 h-4" />
                <span>Pay Family Bill (₦{familyTotalBalance.toLocaleString()})</span>
              </button>
            ) : (
              <div className="space-y-1">
                <div className="px-4 py-2 rounded-xl bg-emerald-500/20 text-emerald-300 font-bold text-xs flex items-center justify-center gap-1.5 border border-emerald-500/40">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>All Family Fees Cleared</span>
                </div>
                {myWards.length > 0 && (
                  <button
                    onClick={() => setShowClearanceModal(true)}
                    className="w-full text-center text-[11px] text-emerald-400 underline font-semibold hover:text-emerald-300 pt-1"
                  >
                    Print Examination Clearance Pass
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Hero Bottom Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-5 border-t border-slate-800/80 text-xs">
          <div>
            <span className="text-slate-400 block text-[10px]">Total Family Billed</span>
            <strong className="text-white font-bold text-sm">₦{familyTotalBilled.toLocaleString()}</strong>
          </div>
          <div>
            <span className="text-slate-400 block text-[10px]">Settled & Verified</span>
            <strong className="text-emerald-400 font-bold text-sm">₦{familyTotalPaid.toLocaleString()}</strong>
          </div>
          <div>
            <span className="text-slate-400 block text-[10px]">Sibling Discount Savings</span>
            <strong className="text-amber-400 font-bold text-sm">
              ₦{totalFamilySiblingDiscount.toLocaleString()} {totalFamilySiblingDiscount > 0 ? '(10% Rebate)' : '(N/A)'}
            </strong>
          </div>
          <div>
            <span className="text-slate-400 block text-[10px]">Bursary Exam Standing</span>
            <strong className={`${familyTotalBalance === 0 ? 'text-emerald-400' : 'text-cyan-400'} font-bold text-sm flex items-center gap-1`}>
              <ShieldCheck className="w-3.5 h-3.5" />
              {familyTotalBalance === 0 ? 'Fully Cleared' : 'Installment Approved'}
            </strong>
          </div>
        </div>
      </div>

      {/* NAVIGATION TABS */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm flex items-center space-x-2 transition-all ${
            activeTab === 'overview'
              ? 'bg-slate-900 text-white shadow-md'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Award className="w-4 h-4" />
          <span>Academic & Attendance Oversight</span>
        </button>

        <button
          onClick={() => setActiveTab('calculator')}
          className={`px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm flex items-center space-x-2 transition-all ${
            activeTab === 'calculator'
              ? 'bg-slate-900 text-white shadow-md'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Calculator className="w-4 h-4 text-amber-500" />
          <span>Multi-Ward Accounting & Fee Calculator</span>
        </button>

        <button
          onClick={() => setActiveTab('payments')}
          className={`px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm flex items-center space-x-2 transition-all ${
            activeTab === 'payments'
              ? 'bg-slate-900 text-white shadow-md'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Coins className="w-4 h-4 text-emerald-500" />
          <span>Payment Hub & Paystack Gateways ({allFamilyInvoices.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('bursary_desk')}
          className={`px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm flex items-center space-x-2 transition-all ${
            activeTab === 'bursary_desk'
              ? 'bg-slate-900 text-white shadow-md'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <MessageSquare className="w-4 h-4 text-blue-500" />
          <span>Bursary Direct Desk & Teller Proofs</span>
          {bursaryProofTickets.filter(t => t.status === 'submitted').length > 0 && (
            <span className="w-2 h-2 rounded-full bg-rose-500"></span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('directory')}
          className={`px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm flex items-center space-x-2 transition-all ${
            activeTab === 'directory'
              ? 'bg-slate-900 text-white shadow-md'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Users className="w-4 h-4 text-purple-500" />
          <span>Parent & Guardian Register ({families.length})</span>
        </button>
      </div>

      {/* ZERO WARDS CALLOUT BANNER */}
      {myWards.length === 0 && (
        <div className="bg-white rounded-3xl border-2 border-dashed border-amber-300 bg-amber-50/40 p-6 sm:p-8 text-center space-y-4 shadow-xs">
          <div className="w-14 h-14 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center mx-auto shadow-xs">
            <Users className="w-7 h-7" />
          </div>
          <div className="max-w-xl mx-auto space-y-1.5">
            <h3 className="text-lg font-black text-slate-900">
              No Enrolled Scholars Linked to this Parent Profile
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              {(currentUser?.role as string) === 'parent'
                ? `Welcome, ${currentUser?.name || 'Parent / Guardian'}! The school admissions registry currently has no active student records assigned to your email address (${currentUser?.email || ''}). Once the school records your children, your terminal reports, fee invoices, and Paystack receipts will load here automatically.`
                : 'The system database has been cleared for school onboarding. In live production, registered students automatically link to their parent/guardian accounts here.'}
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              onClick={() => loadDemoParentWards()}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-700 to-teal-700 hover:from-emerald-800 hover:to-teal-800 text-white font-extrabold text-xs shadow-md shadow-emerald-700/20 flex items-center space-x-2 transition-all hover:scale-105"
            >
              <Sparkles className="w-4 h-4 text-emerald-300" />
              <span>Load Sample Adeleke Family Wards (Demo)</span>
            </button>

            {isAdmin && (
              <button
                onClick={() => setActivePage('students')}
                className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center space-x-2 shadow-xs"
              >
                <Users className="w-4 h-4" />
                <span>Go to Student Admissions Register</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* TAB 1: ACADEMIC & ATTENDANCE OVERSIGHT */}
      {activeTab === 'overview' && (
        myWards.length === 0 ? (
          <div className="bg-white p-8 rounded-3xl border border-slate-200 text-center space-y-4 shadow-xs">
            <div className="w-16 h-16 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto">
              <Award className="w-8 h-8" />
            </div>
            <div className="max-w-md mx-auto space-y-1">
              <h3 className="text-lg font-extrabold text-slate-900">No Academic Records to Display</h3>
              <p className="text-xs text-slate-500">
                Link or register your wards to view continuous assessments (CA1, CA2), terminal examination results, affective ratings, and attendance logs.
              </p>
            </div>
            <div className="pt-2 flex justify-center gap-3">
              <button
                onClick={() => loadDemoParentWards()}
                className="px-5 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs flex items-center space-x-2 shadow-sm"
              >
                <Sparkles className="w-4 h-4 text-emerald-300" />
                <span>Load Sample Adeleke Family Wards (Demo)</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Ward Selector Ribbon */}
            <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-xs">
              <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2.5 flex items-center justify-between">
                <span>Select Child to Inspect Records:</span>
                <span className="text-emerald-700 font-semibold">{myWards.length} Wards Linked</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {myWards.map((ward) => {
                  const isSelected = activeWard?.id === ward.id;
                  return (
                    <div
                      key={ward.id}
                      onClick={() => setSelectedWardId(ward.id)}
                      className={`flex items-center p-3.5 rounded-2xl border cursor-pointer transition-all ${
                        isSelected
                          ? 'border-rose-600 bg-rose-50/50 shadow-sm ring-1 ring-rose-600'
                          : 'border-slate-200 hover:border-slate-300 bg-slate-50/40'
                      }`}
                    >
                      <div className="w-11 h-11 rounded-xl overflow-hidden bg-slate-200 mr-3 shrink-0 ring-2 ring-white">
                        {ward.avatarUrl ? (
                          <img src={ward.avatarUrl} alt={ward.firstName} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center font-bold text-slate-600 text-xs">
                            {ward.firstName?.[0] || 'S'}
                          </div>
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="font-extrabold text-sm text-slate-900 truncate">
                          {ward.firstName} {ward.lastName}
                        </div>
                        <div className="text-xs text-slate-500 font-medium">
                          {ward.classOrDept} • {ward.admissionNo}
                        </div>
                        <div className="mt-1 flex items-center space-x-2">
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                            ward.feeStatus === 'paid' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                          }`}>
                            {ward.feeStatus === 'paid' ? 'Fees Cleared' : `₦${ward.feeBalance.toLocaleString()} Due`}
                          </span>
                          <span className="text-[10px] text-slate-400">
                            {ward.attendanceRate}% Attendance
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Academic Continuous Assessment Table */}
            <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    Continuous Assessment & Terminal Scores — {activeWard?.firstName || 'Enrolled Scholar'}
                  </h3>
                  <p className="text-xs text-slate-500">Live breakdown of CA1 (20), CA2 (20), and Terminal Exam (60)</p>
                </div>
                <span className="text-xs font-semibold text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-xl">
                  NERDC Standard Evaluation
                </span>
              </div>

              {wardGrades.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                      <tr>
                        <th className="p-3">Subject</th>
                        <th className="p-3">CA1 (20)</th>
                        <th className="p-3">CA2 (20)</th>
                        <th className="p-3">Exam (60)</th>
                        <th className="p-3">Total (100)</th>
                        <th className="p-3">Grade</th>
                        <th className="p-3">Teacher's Remark</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {wardGrades.map((g) => (
                        <tr key={g.id} className="hover:bg-slate-50">
                          <td className="p-3 font-bold text-slate-900">
                            <div>{g.subjectName}</div>
                            <span className="text-[10px] text-slate-400 font-mono">{g.subjectCode}</span>
                          </td>
                          <td className="p-3 font-mono text-slate-700">{g.ca1Score}</td>
                          <td className="p-3 font-mono text-slate-700">{g.ca2Score}</td>
                          <td className="p-3 font-mono text-slate-700">{g.examScore}</td>
                          <td className="p-3 font-mono font-bold text-slate-900">{g.totalScore}%</td>
                          <td className="p-3">
                            <span className="px-2 py-0.5 rounded-md font-extrabold text-[11px] bg-emerald-100 text-emerald-800">
                              {g.grade}
                            </span>
                          </td>
                          <td className="p-3 text-slate-600 max-w-xs leading-relaxed">{g.remarks}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="p-6 text-center text-xs text-slate-500 bg-slate-50 rounded-xl">
                  Terminal examination compilation in progress. Continuous assessments updated weekly.
                </div>
              )}

              {/* Psychomotor Ratings for Primary Ward */}
              {activeWard?.tier === 'primary' && wardGrades[0]?.psychomotor && (
                <div className="p-4 rounded-2xl bg-amber-50/50 border border-amber-200">
                  <h4 className="text-xs font-bold text-amber-900 uppercase tracking-wider mb-2">
                    Behavioral & Affective Domain Evaluation (Scale of 1 to 5)
                  </h4>
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-xs">
                    <div className="bg-white p-2.5 rounded-xl border border-amber-200/80 text-center">
                      <span className="text-slate-500 block text-[10px]">Punctuality</span>
                      <strong className="text-amber-800 text-sm font-bold">{wardGrades[0].psychomotor.punctuality ?? 5} / 5</strong>
                    </div>
                    <div className="bg-white p-2.5 rounded-xl border border-amber-200/80 text-center">
                      <span className="text-slate-500 block text-[10px]">Neatness</span>
                      <strong className="text-amber-800 text-sm font-bold">{wardGrades[0].psychomotor.neatness ?? 5} / 5</strong>
                    </div>
                    <div className="bg-white p-2.5 rounded-xl border border-amber-200/80 text-center">
                      <span className="text-slate-500 block text-[10px]">Politeness</span>
                      <strong className="text-amber-800 text-sm font-bold">{wardGrades[0].psychomotor.politeness ?? 5} / 5</strong>
                    </div>
                    <div className="bg-white p-2.5 rounded-xl border border-amber-200/80 text-center">
                      <span className="text-slate-500 block text-[10px]">Attentiveness</span>
                      <strong className="text-amber-800 text-sm font-bold">{wardGrades[0].psychomotor.attentiveness ?? 5} / 5</strong>
                    </div>
                    <div className="bg-white p-2.5 rounded-xl border border-amber-200/80 text-center">
                      <span className="text-slate-500 block text-[10px]">Sports & Gym</span>
                      <strong className="text-amber-800 text-sm font-bold">{wardGrades[0].psychomotor.sportsAndGym ?? 4} / 5</strong>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )
      )}

      {/* TAB 2: MULTI-WARD ACCOUNTING & FEE CALCULATOR */}
      {activeTab === 'calculator' && (
        myWards.length === 0 ? (
          <div className="bg-white p-8 rounded-3xl border border-slate-200 text-center space-y-4 shadow-xs">
            <div className="w-16 h-16 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto">
              <Calculator className="w-8 h-8" />
            </div>
            <div className="max-w-md mx-auto space-y-1">
              <h3 className="text-lg font-bold text-slate-900">Multi-Ward Calculator Inactive</h3>
              <p className="text-xs text-slate-500">
                To calculate tuition fees, sibling rebates, and optional bus/lunch services, at least one student ward must be enrolled under this family account.
              </p>
            </div>
            <div className="pt-2 flex justify-center gap-3">
              <button
                onClick={() => loadDemoParentWards()}
                className="px-5 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs flex items-center space-x-2 shadow-sm"
              >
                <Sparkles className="w-4 h-4 text-emerald-300" />
                <span>Load Sample Adeleke Family Wards (Demo)</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Sibling Rebate Notice Banner */}
            <div className="p-5 rounded-3xl bg-amber-50 border border-amber-200 flex items-start gap-4 text-xs text-amber-900">
            <Percent className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <h4 className="font-extrabold text-sm text-amber-950">
                Institutional Sibling Rebate Policy Activated (10% Discount)
              </h4>
              <p className="leading-relaxed">
                Parents with 2 or more children concurrently enrolled receive an automatic <strong>10% sibling rebate</strong> deducted from the tuition component of the 2nd child onwards. Your total sibling rebate savings this term is <strong>₦{totalFamilySiblingDiscount.toLocaleString()}</strong>.
              </p>
            </div>
          </div>

          {/* Ward-by-Ward Itemized Breakdown Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {wardCalculations.map((wc) => (
              <div 
                key={wc.student.id}
                className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs flex flex-col justify-between space-y-4"
              >
                <div>
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-xl overflow-hidden bg-slate-100 border border-slate-200">
                        {wc.student.avatarUrl ? (
                          <img src={wc.student.avatarUrl} alt={wc.student.firstName} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center font-bold text-xs">{wc.student.firstName[0]}</div>
                        )}
                      </div>
                      <div>
                        <h4 className="font-extrabold text-slate-900 text-sm">
                          {wc.student.firstName} {wc.student.lastName}
                        </h4>
                        <span className="text-xs text-slate-500 font-mono">
                          {wc.student.classOrDept} • {wc.student.admissionNo}
                        </span>
                      </div>
                    </div>

                    {wc.discountPercent > 0 ? (
                      <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center gap-1">
                        <Check className="w-3 h-3" />
                        10% Sibling Rebate
                      </span>
                    ) : (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                        1st Scholar (Standard)
                      </span>
                    )}
                  </div>

                  {/* Itemized Fee Components */}
                  <div className="mt-4 space-y-2 text-xs">
                    <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      Standard Compulsory Levies
                    </div>

                    <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50">
                      <span className="text-slate-700">Base Tuition & Teaching Fee</span>
                      <div className="text-right">
                        <span className="font-bold text-slate-900">₦{wc.baseTuition.toLocaleString()}</span>
                        {wc.discountAmount > 0 && (
                          <div className="text-[10px] text-emerald-700 font-semibold">
                            -₦{wc.discountAmount.toLocaleString()} (10% Off)
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50">
                      <span className="text-slate-700">Development & Infrastructure Levy</span>
                      <span className="font-bold text-slate-900">₦{wc.developmentLevy.toLocaleString()}</span>
                    </div>

                    <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50">
                      <span className="text-slate-700">ICT, CBT & Computer Lab Access</span>
                      <span className="font-bold text-slate-900">₦{wc.ictCbtLevy.toLocaleString()}</span>
                    </div>

                    <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50">
                      <span className="text-slate-700">
                        {wc.student.tier === 'primary' ? 'Phonics & Handcraft Consumables' : 'WAEC/NECO Science Practical Materials'}
                      </span>
                      <span className="font-bold text-slate-900">₦{wc.labLevy.toLocaleString()}</span>
                    </div>

                    <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50">
                      <span className="text-slate-700">PTA Levy & Sports Kit</span>
                      <span className="font-bold text-slate-900">₦{wc.ptaSports.toLocaleString()}</span>
                    </div>

                    <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50">
                      <span className="text-slate-700">Textbooks, Notebooks & Uniform Package</span>
                      <span className="font-bold text-slate-900">₦{wc.booksUniform.toLocaleString()}</span>
                    </div>

                    {/* Optional Services Checkboxes */}
                    <div className="pt-2">
                      <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                        Optional Add-on Ancillary Services
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <label className={`p-2.5 rounded-xl border cursor-pointer flex items-center justify-between transition-colors ${
                          optionalServices[wc.student.id]?.bus ? 'bg-emerald-50 border-emerald-400 text-emerald-900' : 'bg-white border-slate-200'
                        }`}>
                          <div className="flex items-center space-x-2">
                            <input
                              type="checkbox"
                              checked={optionalServices[wc.student.id]?.bus || false}
                              onChange={(e) => {
                                setOptionalServices(prev => ({
                                  ...prev,
                                  [wc.student.id]: { ...prev[wc.student.id], bus: e.target.checked }
                                }));
                              }}
                              className="rounded text-emerald-600 focus:ring-emerald-500"
                            />
                            <span className="text-xs font-semibold">School Bus</span>
                          </div>
                          <span className="font-bold text-xs">+₦25,000</span>
                        </label>

                        <label className={`p-2.5 rounded-xl border cursor-pointer flex items-center justify-between transition-colors ${
                          optionalServices[wc.student.id]?.lunch ? 'bg-emerald-50 border-emerald-400 text-emerald-900' : 'bg-white border-slate-200'
                        }`}>
                          <div className="flex items-center space-x-2">
                            <input
                              type="checkbox"
                              checked={optionalServices[wc.student.id]?.lunch || false}
                              onChange={(e) => {
                                setOptionalServices(prev => ({
                                  ...prev,
                                  [wc.student.id]: { ...prev[wc.student.id], lunch: e.target.checked }
                                }));
                              }}
                              className="rounded text-emerald-600 focus:ring-emerald-500"
                            />
                            <span className="text-xs font-semibold">Daily Lunch</span>
                          </div>
                          <span className="font-bold text-xs">+₦18,000</span>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Subtotal & Net Card Footer */}
                <div className="pt-3 border-t border-slate-200 space-y-1.5 text-xs">
                  <div className="flex justify-between text-slate-500">
                    <span>Gross Subtotal:</span>
                    <span>₦{wc.subtotal.toLocaleString()}</span>
                  </div>
                  {wc.discountAmount > 0 && (
                    <div className="flex justify-between text-emerald-700 font-bold">
                      <span>Sibling Discount (10%):</span>
                      <span>-₦{wc.discountAmount.toLocaleString()}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-slate-900 font-extrabold text-sm pt-1 border-t border-slate-100">
                    <span>Net Terminal Bill:</span>
                    <span className="text-emerald-700">₦{wc.netPayable.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* INSTALLMENT PAYMENT SCHEDULE CALCULATOR */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
            <div>
              <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                <Calculator className="w-5 h-5 text-emerald-700" />
                Flexible Installment Payment Schedule Calculator
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Calculate family fee breakdown across approved payment milestones according to school financial policy.
              </p>
            </div>

            {/* Installment Options Selector */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {[
                {
                  id: 'full' as const,
                  name: 'Option A: 100% Full Payment',
                  desc: 'Pay full family fee upfront and enjoy a 2.5% prompt settlement cash rebate.',
                  badge: '2.5% Cash Rebate'
                },
                {
                  id: 'two_part' as const,
                  name: 'Option B: 2-Part Installment (60% / 40%)',
                  desc: '60% at term opening for full registration, 40% before mid-term CA2 examinations.',
                  badge: 'Recommended'
                },
                {
                  id: 'three_part' as const,
                  name: 'Option C: 3-Part Monthly (40% / 30% / 30%)',
                  desc: 'Structured monthly installments spread across September, October, and November.',
                  badge: 'Budget Friendly'
                }
              ].map(plan => (
                <div
                  key={plan.id}
                  onClick={() => setSelectedInstallmentPlan(plan.id)}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all flex flex-col justify-between ${
                    selectedInstallmentPlan === plan.id
                      ? 'border-emerald-600 bg-emerald-50/70 ring-2 ring-emerald-600/20'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-700">
                      {plan.badge}
                    </span>
                    <h4 className="font-extrabold text-xs text-slate-900 mt-2">{plan.name}</h4>
                    <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">{plan.desc}</p>
                  </div>
                  <div className="mt-3 text-xs font-bold text-emerald-800">
                    {selectedInstallmentPlan === plan.id ? '✓ Selected Plan' : 'Select Plan'}
                  </div>
                </div>
              ))}
            </div>

            {/* Calculated Installment Milestones Table */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
              <div className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Calculated Milestone Schedules for Adeleke Family:
              </div>

              {selectedInstallmentPlan === 'full' && (
                <div className="flex flex-col sm:flex-row sm:items-center justify-between p-3.5 bg-white rounded-xl border border-slate-200 gap-3">
                  <div>
                    <span className="text-xs font-bold text-slate-900">Full Term Upfront Clearance (100%)</span>
                    <div className="text-[11px] text-slate-500">Due: 2026-09-30 • Instant Examination Clearance Pass Issued</div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className="text-base font-black text-emerald-700">₦{familyTotalBalance.toLocaleString()}</span>
                    <button
                      onClick={() => handleOpenConsolidatedPay(familyTotalBalance)}
                      className="px-4 py-2 rounded-xl bg-emerald-700 text-white font-bold text-xs hover:bg-emerald-800"
                    >
                      Pay Now
                    </button>
                  </div>
                </div>
              )}

              {selectedInstallmentPlan === 'two_part' && (
                <div className="space-y-2 text-xs">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between p-3 bg-white rounded-xl border border-slate-200 gap-3">
                    <div>
                      <span className="font-bold text-slate-900">Milestone 1 (60% Term Registration Deposit)</span>
                      <div className="text-[11px] text-slate-500">Due: 2026-09-30 • Qualifies scholar for lab, library & classes</div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span className="font-black text-slate-900">₦{Math.round(familyTotalBalance * 0.6).toLocaleString()}</span>
                      <button
                        onClick={() => handleOpenConsolidatedPay(Math.round(familyTotalBalance * 0.6))}
                        className="px-4 py-1.5 rounded-xl bg-emerald-700 text-white font-bold text-xs hover:bg-emerald-800"
                      >
                        Pay 60%
                      </button>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between p-3 bg-white rounded-xl border border-slate-200 gap-3">
                    <div>
                      <span className="font-bold text-slate-900">Milestone 2 (40% Final Exam Clearance)</span>
                      <div className="text-[11px] text-slate-500">Due: 2026-11-15 • Required before WAEC & terminal exams</div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span className="font-black text-slate-900">₦{Math.round(familyTotalBalance * 0.4).toLocaleString()}</span>
                      <button
                        onClick={() => handleOpenConsolidatedPay(Math.round(familyTotalBalance * 0.4))}
                        className="px-4 py-1.5 rounded-xl bg-slate-800 text-white font-bold text-xs hover:bg-slate-700"
                      >
                        Schedule / Pay
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {selectedInstallmentPlan === 'three_part' && (
                <div className="space-y-2 text-xs">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between p-3 bg-white rounded-xl border border-slate-200 gap-3">
                    <div>
                      <span className="font-bold text-slate-900">Installment 1 (40% - September)</span>
                      <div className="text-[11px] text-slate-500">Due: 2026-09-30</div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span className="font-black text-slate-900">₦{Math.round(familyTotalBalance * 0.4).toLocaleString()}</span>
                      <button
                        onClick={() => handleOpenConsolidatedPay(Math.round(familyTotalBalance * 0.4))}
                        className="px-3.5 py-1.5 rounded-xl bg-emerald-700 text-white font-bold text-xs"
                      >
                        Pay
                      </button>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between p-3 bg-white rounded-xl border border-slate-200 gap-3">
                    <div>
                      <span className="font-bold text-slate-900">Installment 2 (30% - October)</span>
                      <div className="text-[11px] text-slate-500">Due: 2026-10-31</div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span className="font-black text-slate-900">₦{Math.round(familyTotalBalance * 0.3).toLocaleString()}</span>
                      <button
                        onClick={() => handleOpenConsolidatedPay(Math.round(familyTotalBalance * 0.3))}
                        className="px-3.5 py-1.5 rounded-xl bg-slate-800 text-white font-bold text-xs"
                      >
                        Pay
                      </button>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between p-3 bg-white rounded-xl border border-slate-200 gap-3">
                    <div>
                      <span className="font-bold text-slate-900">Installment 3 (30% - November)</span>
                      <div className="text-[11px] text-slate-500">Due: 2026-11-30</div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span className="font-black text-slate-900">₦{Math.round(familyTotalBalance * 0.3).toLocaleString()}</span>
                      <button
                        onClick={() => handleOpenConsolidatedPay(Math.round(familyTotalBalance * 0.3))}
                        className="px-3.5 py-1.5 rounded-xl bg-slate-800 text-white font-bold text-xs"
                      >
                        Pay
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        )
      )}

      {/* TAB 3: PAYMENT HUB & CONSOLIDATED SETTLEMENT */}
      {activeTab === 'payments' && (
        <div className="space-y-6">
          {/* Consolidated Family Bill Card */}
          <div className="p-6 rounded-3xl bg-slate-900 text-white border border-slate-800 shadow-md flex flex-col md:flex-row items-center justify-between gap-4">
            <div>
              <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-widest block">
                Single Multi-Ward Transaction
              </span>
              <h3 className="text-lg font-black mt-0.5">Pay Entire Family Balance Together</h3>
              <p className="text-xs text-slate-400 mt-1 max-w-xl">
                Avoid making separate payments for each child. Settle {myWards.length > 0 ? myWards.map(w => w.firstName).join(' and ') + "'s" : 'your wards\''} tuition with a single Paystack, transfer, or POS authorization.
              </p>
            </div>

            <div className="flex items-center space-x-4 shrink-0">
              <div className="text-right">
                <span className="text-[10px] text-slate-400 block">Total Balance Due</span>
                <span className="text-2xl font-black text-emerald-400">₦{familyTotalBalance.toLocaleString()}</span>
              </div>
              {familyTotalBalance > 0 && (
                <button
                  onClick={() => handleOpenConsolidatedPay()}
                  className="px-5 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center space-x-1.5 shadow-lg shadow-emerald-900/50"
                >
                  <CreditCard className="w-4 h-4" />
                  <span>Consolidated Checkout</span>
                </button>
              )}
            </div>
          </div>

          {/* Individual Wards Invoice List */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-base font-extrabold text-slate-900">
                  Individual Ward Invoices & Terminal Statements
                </h3>
                <p className="text-xs text-slate-500">Official bursary invoices issued by Apex Royal Academy</p>
              </div>

              <div className="hidden sm:flex items-center space-x-2 text-xs text-slate-500">
                <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-900 font-semibold">Paystack</span>
                <span className="px-2 py-0.5 rounded-md bg-blue-100 text-blue-900 font-semibold">Virtual Transfer</span>
                <span className="px-2 py-0.5 rounded-md bg-purple-100 text-purple-900 font-semibold">POS</span>
              </div>
            </div>

            {allFamilyInvoices.length > 0 ? (
              <div className="space-y-3">
                {allFamilyInvoices.map((inv) => (
                  <div 
                    key={inv.id} 
                    className="p-5 rounded-2xl border border-slate-200 bg-slate-50/60 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-slate-50 transition-colors"
                  >
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-mono text-xs font-bold text-slate-800">{inv.invoiceNo}</span>
                        <span className={`text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full ${
                          inv.status === 'paid' ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' : 'bg-rose-100 text-rose-800 border border-rose-300'
                        }`}>
                          {inv.status}
                        </span>
                      </div>

                      <h4 className="text-sm font-extrabold text-slate-900 mt-1">
                        {inv.feeType}
                      </h4>

                      <div className="text-xs text-slate-600 mt-0.5 flex flex-wrap items-center gap-2">
                        <span className="font-semibold text-emerald-800">{inv.studentName} ({inv.classOrDept})</span>
                        <span>•</span>
                        <span>Session: {inv.session}</span>
                        <span>•</span>
                        <span>Due: {inv.dueDate}</span>
                      </div>

                      {inv.paymentMethod && (
                        <div className="text-[11px] text-emerald-700 font-semibold mt-1">
                          Settled via {inv.paymentMethod} (Ref: {inv.transactionRef})
                        </div>
                      )}
                    </div>

                    <div className="flex items-center space-x-4 shrink-0">
                      <div className="text-right">
                        <div className="text-xs text-slate-500">Amount Billed</div>
                        <div className="text-sm font-bold text-slate-900">₦{inv.amount.toLocaleString()}</div>
                        {inv.balance > 0 && (
                          <div className="text-xs font-bold text-rose-600">Balance: ₦{inv.balance.toLocaleString()}</div>
                        )}
                      </div>

                      {inv.balance > 0 ? (
                        <button
                          onClick={() => handleOpenPay(inv)}
                          className="px-4 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs flex items-center space-x-1.5 shadow-md shadow-emerald-700/20 transition-all"
                        >
                          <CreditCard className="w-4 h-4" />
                          <span>Pay ₦{inv.balance.toLocaleString()}</span>
                        </button>
                      ) : (
                        <button
                          onClick={() => handleOpenReceipt(inv)}
                          className="px-3.5 py-2 rounded-xl border border-slate-300 bg-white text-slate-800 font-bold text-xs hover:bg-slate-50 flex items-center space-x-1.5 shadow-xs transition-all"
                        >
                          <Printer className="w-3.5 h-3.5 text-slate-600" />
                          <span>View Stamped Receipt</span>
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center text-xs text-slate-500 bg-slate-50 rounded-2xl border border-dashed border-slate-200 space-y-3">
                <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400 mx-auto">
                  <Receipt className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-800 text-sm">No Pending or Historical Invoices</h4>
                  <p className="mt-0.5">Official bursary invoices are issued by the Chief Bursar at the commencement of each academic term.</p>
                </div>
                {myWards.length === 0 && (
                  <div className="pt-1">
                    <button
                      onClick={() => loadDemoParentWards()}
                      className="px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs inline-flex items-center space-x-2"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-emerald-300" />
                      <span>Load Sample Adeleke Family Invoices (Demo)</span>
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 4: BURSARY DIRECT DESK & PAYMENT RECONCILIATION */}
      {activeTab === 'bursary_desk' && (
        <div className="space-y-6">
          {/* Bursary Section Header Card */}
          <div className="p-6 rounded-3xl bg-slate-900 text-white border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center space-x-3.5">
              <div className="w-12 h-12 rounded-2xl bg-emerald-600 flex items-center justify-center font-bold text-white shrink-0 shadow-md">
                <Landmark className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-widest block">
                  Office of the Chief Bursar & Financial Registry
                </span>
                <h3 className="text-lg font-black">
                  Direct Parent-to-Bursary Accounting Desk
                </h3>
                <p className="text-xs text-slate-400">
                  Officer in Charge: <strong>Dr. Joshua Adeleke (FCA, Chief Bursar)</strong> • Official Reconciliation & Clearances
                </p>
              </div>
            </div>

            <button
              onClick={() => setShowClearanceModal(true)}
              className="px-4 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white font-bold text-xs flex items-center space-x-2 shrink-0 transition-colors"
            >
              <FileCheck className="w-4 h-4" />
              <span>Examination Clearance Pass</span>
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left: Submit Proof of Payment Form */}
            <div className="lg:col-span-6 bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
              <div className="border-b border-slate-100 pb-3">
                <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                  <Upload className="w-4 h-4 text-emerald-700" />
                  Submit Bank Transfer / POS Proof for Reconciliation
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Paid via direct bank transfer, POS counter swipe, or bank branch teller? Submit your reference for immediate credit reconciliation.
                </p>
              </div>

              {proofSubmittedSuccess && (
                <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs font-semibold flex items-center space-x-2 animate-fade-in">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                  <div>
                    <div className="font-bold">Proof of Payment Successfully Submitted!</div>
                    <div className="text-[11px] text-emerald-700">Ticket routed to the Chief Bursar's queue for instant verification.</div>
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmitProof} className="space-y-3.5 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Select Target Ward / Scholar *
                  </label>
                  <select
                    value={proofForm.studentId}
                    onChange={e => setProofForm(prev => ({ ...prev, studentId: e.target.value }))}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold bg-white focus:ring-2 focus:ring-emerald-600/30"
                  >
                    {myWards.map(w => (
                      <option key={w.id} value={w.id}>
                        {w.firstName} {w.lastName} ({w.classOrDept} - {w.admissionNo})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      Amount Paid (₦) *
                    </label>
                    <input
                      type="number"
                      required
                      value={proofForm.amount}
                      onChange={e => setProofForm(prev => ({ ...prev, amount: Number(e.target.value) }))}
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-200 font-bold text-xs"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      Payment Channel *
                    </label>
                    <select
                      value={proofForm.paymentMethod}
                      onChange={e => setProofForm(prev => ({ ...prev, paymentMethod: e.target.value as any }))}
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-200 font-semibold text-xs bg-white"
                    >
                      <option value="bank_transfer">Direct Mobile Bank Transfer (NIP)</option>
                      <option value="bank_branch">Commercial Bank Teller Slip / RRR</option>
                      <option value="pos">Bursary Counter POS Terminal</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      Bank Name / Source *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Zenith Bank PLC / GTBank"
                      value={proofForm.bankName}
                      onChange={e => setProofForm(prev => ({ ...prev, bankName: e.target.value }))}
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      Reference / Teller Number *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. TEL-ZEN-9921 or NIP Ref"
                      value={proofForm.referenceOrTellerNo}
                      onChange={e => setProofForm(prev => ({ ...prev, referenceOrTellerNo: e.target.value }))}
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-200 font-mono text-xs font-bold text-emerald-800"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      Payment Date *
                    </label>
                    <input
                      type="date"
                      required
                      value={proofForm.paymentDate}
                      onChange={e => setProofForm(prev => ({ ...prev, paymentDate: e.target.value }))}
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      Receipt Slip Filename
                    </label>
                    <input
                      type="text"
                      value={proofForm.proofAttachmentName}
                      onChange={e => setProofForm(prev => ({ ...prev, proofAttachmentName: e.target.value }))}
                      placeholder="Deposit_Receipt.pdf"
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs text-slate-500 font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Remark / Instruction to Chief Bursar
                  </label>
                  <textarea
                    rows={2}
                    value={proofForm.parentNote}
                    onChange={e => setProofForm(prev => ({ ...prev, parentNote: e.target.value }))}
                    placeholder="e.g. Paid for first installment of tuition and WAEC practical levy."
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs flex items-center justify-center space-x-2 transition-colors shadow-sm"
                >
                  <Upload className="w-4 h-4" />
                  <span>Transmit Payment Proof to Bursar</span>
                </button>
              </form>
            </div>

            {/* Right: Submitted Proof Tickets & Verification Feed */}
            <div className="lg:col-span-6 space-y-4">
              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div>
                    <h3 className="text-base font-extrabold text-slate-900">
                      Payment Reconciliation Tickets
                    </h3>
                    <p className="text-xs text-slate-500">Live verification status by the Chief Bursar</p>
                  </div>
                  <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-xl">
                    {bursaryProofTickets.length} Tickets
                  </span>
                </div>

                <div className="space-y-3">
                  {bursaryProofTickets.map(ticket => (
                    <div
                      key={ticket.id}
                      className="p-4 rounded-2xl border border-slate-200 bg-slate-50/70 space-y-2 text-xs"
                    >
                      <div className="flex items-center justify-between">
                        <div className="font-bold text-slate-900 flex items-center gap-1.5">
                          <span>{ticket.studentName}</span>
                          <span className="text-[10px] text-slate-400 font-mono">({ticket.gradeLevel})</span>
                        </div>

                        <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full uppercase ${
                          ticket.status === 'verified_cleared'
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                            : 'bg-amber-100 text-amber-800 border border-amber-300'
                        }`}>
                          {ticket.status === 'verified_cleared' ? '✓ Cleared & Reconciled' : 'Under Bursary Review'}
                        </span>
                      </div>

                      <div className="flex flex-wrap items-center justify-between text-slate-600">
                        <span className="font-extrabold text-sm text-emerald-700">₦{ticket.amount.toLocaleString()}</span>
                        <span className="font-mono text-[11px] text-slate-500">{ticket.referenceOrTellerNo}</span>
                        <span className="text-[11px] text-slate-400">{ticket.paymentDate}</span>
                      </div>

                      {ticket.parentNote && (
                        <p className="text-[11px] text-slate-600 bg-white p-2 rounded-xl border border-slate-100 italic">
                          Parent Note: "{ticket.parentNote}"
                        </p>
                      )}

                      {ticket.bursarRemark && (
                        <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-[11px]">
                          <strong>Bursar Remark:</strong> {ticket.bursarRemark}
                          <div className="text-[10px] text-emerald-700 mt-0.5">
                            Verified by {ticket.bursarName} on {ticket.verifiedAt}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Direct Message Feed with Bursar */}
              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div>
                    <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                      <MessageSquare className="w-4 h-4 text-emerald-700" />
                      Two-Way Communications with Chief Bursar
                    </h3>
                    <p className="text-xs text-slate-500">Official inquiries regarding fees, sibling rebates, and installment plans</p>
                  </div>
                </div>

                {bursaryMsgSentSuccess && (
                  <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-semibold">
                    Message dispatched to Dr. Joshua Adeleke (Chief Bursar). Response will be returned here.
                  </div>
                )}

                {/* Conversation Thread */}
                <div className="space-y-3 max-h-60 overflow-y-auto pr-1 text-xs">
                  {bursaryMessages.map(msg => {
                    const isBursar = msg.senderRole === 'bursar';
                    return (
                      <div
                        key={msg.id}
                        className={`p-3.5 rounded-2xl border ${
                          isBursar 
                            ? 'bg-emerald-50/70 border-emerald-200 text-emerald-950 ml-4' 
                            : 'bg-slate-50 border-slate-200 text-slate-900 mr-4'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-extrabold text-xs">
                            {isBursar ? '🏛️ Dr. Joshua Adeleke (Chief Bursar)' : '👤 Chief Oladipo Adeleke (Parent)'}
                          </span>
                          <span className="text-[10px] text-slate-400 font-mono">{msg.createdAt}</span>
                        </div>
                        <div className="font-bold text-[11px] text-slate-700 mb-1">{msg.subject}</div>
                        <p className="text-xs text-slate-600 leading-relaxed">{msg.message}</p>
                      </div>
                    );
                  })}
                </div>

                {/* Send New Message Box */}
                <form onSubmit={handleSendBursaryMsg} className="space-y-2 pt-2 border-t border-slate-100">
                  <input
                    type="text"
                    required
                    placeholder="Subject: e.g. Request for Installment Receipt Confirmation"
                    value={bursaryMessageSubject}
                    onChange={e => setBursaryMessageSubject(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-600/30"
                  />
                  <textarea
                    rows={2}
                    required
                    placeholder="Type your official inquiry or message to the Bursar..."
                    value={bursaryMessageText}
                    onChange={e => setBursaryMessageText(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs resize-none focus:outline-none focus:ring-2 focus:ring-emerald-600/30"
                  />
                  <div className="flex justify-end">
                    <button
                      type="submit"
                      className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center space-x-1.5 transition-colors"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Send Message to Bursary</span>
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: PARENT & GUARDIAN REGISTER DIRECTORY */}
      {activeTab === 'directory' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
            <div>
              <div className="flex items-center space-x-2">
                <span className="p-1.5 rounded-lg bg-purple-100 text-purple-700">
                  <Users className="w-4 h-4" />
                </span>
                <h3 className="text-base font-extrabold text-slate-900">
                  Parent & Guardian Community Register
                </h3>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Directory of all registered parents and guardians across nursery, primary, and secondary tiers.
              </p>
            </div>

            <div className="flex items-center space-x-2">
              <span className="text-xs font-bold text-purple-900 bg-purple-50 border border-purple-200 px-3 py-1.5 rounded-xl">
                {families.length} {families.length === 1 ? 'Registered Family' : 'Registered Families'}
              </span>
            </div>
          </div>

          {families.length === 0 ? (
            <div className="text-center py-12 space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center mx-auto">
                <Users className="w-8 h-8" />
              </div>
              <div className="max-w-md mx-auto space-y-1">
                <h4 className="text-base font-bold text-slate-900">No Parent Accounts Registered Yet</h4>
                <p className="text-xs text-slate-500">
                  Parents are automatically added to this directory when student scholars are admitted with their guardian details.
                </p>
              </div>
              <div className="pt-2 flex justify-center gap-3">
                <button
                  onClick={() => loadDemoParentWards()}
                  className="px-5 py-2.5 rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-bold text-xs flex items-center space-x-2 shadow-sm"
                >
                  <Sparkles className="w-4 h-4 text-purple-200" />
                  <span>Load Sample Adeleke Family Wards (Demo)</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {families.map((fam, idx) => (
                <div
                  key={idx}
                  className="p-5 rounded-2xl border border-slate-200 bg-slate-50/50 hover:bg-slate-50 transition-all flex flex-col justify-between space-y-3"
                >
                  <div>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-800 flex items-center justify-center font-black text-sm">
                          {fam.guardianName[0] || 'P'}
                        </div>
                        <div>
                          <h4 className="font-extrabold text-sm text-slate-900">{fam.guardianName}</h4>
                          <span className="text-[11px] text-slate-500 font-medium">{fam.wards.length} {fam.wards.length === 1 ? 'Enrolled Child' : 'Enrolled Children'}</span>
                        </div>
                      </div>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                        fam.allPaid ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                      }`}>
                        {fam.allPaid ? 'Cleared' : `₦${fam.totalBalance.toLocaleString()} Due`}
                      </span>
                    </div>

                    <div className="mt-3 space-y-1.5 text-xs text-slate-600 bg-white p-3 rounded-xl border border-slate-200/80">
                      <div className="flex items-center space-x-2 text-[11px]">
                        <Phone className="w-3 h-3 text-slate-400" />
                        <span>{fam.phone}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-[11px]">
                        <Mail className="w-3 h-3 text-slate-400" />
                        <span className="truncate">{fam.email}</span>
                      </div>
                    </div>

                    <div className="mt-3">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                        Enrolled Scholars:
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {fam.wards.map(w => (
                          <span key={w.id} className="text-[11px] bg-slate-200/80 px-2 py-0.5 rounded-md font-medium text-slate-800">
                            {w.firstName} {w.lastName} ({w.classOrDept})
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-200/80 flex items-center justify-between">
                    <div className="text-[11px] text-slate-500">
                      Total Due: <strong className="text-slate-900">₦{fam.totalBalance.toLocaleString()}</strong>
                    </div>
                    <button
                      onClick={() => {
                        setSelectedGuardian(fam.guardianName);
                        setActiveTab('overview');
                      }}
                      className="px-3 py-1.5 rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-bold text-xs flex items-center space-x-1 transition-colors"
                    >
                      <span>View Family Ledger</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* PARENT PAYMENT HUB MODAL (PAYSTACK, VIRTUAL TRANSFER, POS, BANKS) */}
      {showPaymentModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-sm p-4">
          <div className="bg-white w-full max-w-xl rounded-3xl shadow-2xl overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95 max-h-[95vh] flex flex-col">
            {/* Modal Header */}
            <div className="px-6 py-4 bg-gradient-to-r from-emerald-800 to-teal-700 text-white flex items-center justify-between">
              <div className="flex items-center space-x-2.5">
                <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center">
                  <Coins className="w-5 h-5 text-white" />
                </div>
                <div>
                  <span className="text-[10px] font-extrabold uppercase tracking-widest text-emerald-100 block">
                    Parent Fee Payment Gateway
                  </span>
                  <h3 className="font-extrabold text-sm">
                    {isConsolidatedPayment ? 'Consolidated Family Checkout' : 'Ward Fee Payment'}
                  </h3>
                </div>
              </div>
              <button 
                onClick={() => setShowPaymentModal(false)}
                className="text-white/80 hover:text-white p-1 text-lg font-bold"
              >
                ✕
              </button>
            </div>

            {/* Bill Info Banner */}
            <div className="px-6 py-3.5 bg-slate-50 border-b border-slate-200 flex items-center justify-between text-xs">
              <div>
                <span className="text-slate-400 block text-[10px]">Beneficiary / Scholars</span>
                <strong className="text-slate-900">
                  {isConsolidatedPayment ? `${activeFamilyName} (${myWards.map(w => w.firstName).join(' & ') || 'Wards'})` : `${selectedInvoice?.studentName} (${selectedInvoice?.admissionNo})`}
                </strong>
                <div className="text-[11px] text-slate-500">
                  {isConsolidatedPayment ? 'All Terminal Tuition & Levies' : selectedInvoice?.feeType}
                </div>
              </div>
              <div className="text-right">
                <span className="text-slate-400 block text-[10px]">Amount Payable:</span>
                <span className="text-xl font-black text-emerald-700">
                  ₦{(isConsolidatedPayment ? consolidatedAmountToPay : selectedInvoice?.balance || 0).toLocaleString()}
                </span>
              </div>
            </div>

            {/* Payment Avenues Selector */}
            <div className="p-6 space-y-4 text-xs overflow-y-auto flex-1">
              <div>
                <label className="block font-semibold text-slate-700 uppercase tracking-wider mb-2 text-[10px]">
                  Choose How You Want to Pay:
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  <button
                    type="button"
                    onClick={() => setPaymentGatewayTab('paystack')}
                    className={`p-3 rounded-2xl border text-center font-bold transition-all flex flex-col items-center justify-center space-y-1 ${
                      paymentGatewayTab === 'paystack'
                        ? 'border-[#0BA4DB] bg-cyan-50/80 text-[#0BA4DB] ring-2 ring-[#0BA4DB]/20 shadow-xs'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <CreditCard className="w-5 h-5" />
                    <span className="text-xs">Paystack</span>
                    <span className="text-[9px] font-normal text-slate-500">Card / USSD / NQR</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentGatewayTab('transfer')}
                    className={`p-3 rounded-2xl border text-center font-bold transition-all flex flex-col items-center justify-center space-y-1 ${
                      paymentGatewayTab === 'transfer'
                        ? 'border-blue-600 bg-blue-50/80 text-blue-700 ring-2 ring-blue-600/20 shadow-xs'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <Smartphone className="w-5 h-5" />
                    <span className="text-xs">Bank Transfer</span>
                    <span className="text-[9px] font-normal text-slate-500">Virtual Account</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentGatewayTab('pos')}
                    className={`p-3 rounded-2xl border text-center font-bold transition-all flex flex-col items-center justify-center space-y-1 ${
                      paymentGatewayTab === 'pos'
                        ? 'border-purple-600 bg-purple-50/80 text-purple-700 ring-2 ring-purple-600/20 shadow-xs'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <Smartphone className="w-5 h-5" />
                    <span className="text-xs">POS Terminal</span>
                    <span className="text-[9px] font-normal text-slate-500">Counter Swipe</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentGatewayTab('banks')}
                    className={`p-3 rounded-2xl border text-center font-bold transition-all flex flex-col items-center justify-center space-y-1 ${
                      paymentGatewayTab === 'banks'
                        ? 'border-emerald-600 bg-emerald-50/80 text-emerald-800 ring-2 ring-emerald-600/20 shadow-xs'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <Landmark className="w-5 h-5" />
                    <span className="text-xs">Bank Branch</span>
                    <span className="text-[9px] font-normal text-slate-500">Teller / Remita RRR</span>
                  </button>
                </div>
              </div>

              {/* 1. PAYSTACK METHOD */}
              {paymentGatewayTab === 'paystack' && (
                <div className="space-y-3 bg-slate-50 p-4 rounded-2xl border border-slate-200">
                  <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                    <span className="font-bold text-[#0BA4DB] text-xs">Paystack Checkout Channels</span>
                    <div className="flex space-x-1">
                      {['card', 'ussd', 'qr'].map(m => (
                        <button
                          key={m}
                          type="button"
                          onClick={() => setPaystackMethod(m as any)}
                          className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase transition-all ${
                            paystackMethod === m 
                              ? 'bg-[#0BA4DB] text-white' 
                              : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                          }`}
                        >
                          {m}
                        </button>
                      ))}
                    </div>
                  </div>

                  {paystackMethod === 'card' && (
                    <div className="space-y-3 pt-1">
                      <div>
                        <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">
                          Card Number (Mastercard / Visa / Verve)
                        </label>
                        <input
                          type="text"
                          value={cardNumber}
                          onChange={(e) => setCardNumber(e.target.value)}
                          className="w-full px-3 py-2 rounded-xl border border-slate-200 font-mono text-xs font-bold focus:ring-2 focus:ring-[#0BA4DB] bg-white"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">
                            Expiry (MM/YY)
                          </label>
                          <input
                            type="text"
                            value={cardExpiry}
                            onChange={(e) => setCardExpiry(e.target.value)}
                            className="w-full px-3 py-2 rounded-xl border border-slate-200 font-mono text-xs font-bold focus:ring-2 focus:ring-[#0BA4DB] bg-white"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">
                            CVV
                          </label>
                          <input
                            type="password"
                            maxLength={3}
                            value={cardCvv}
                            onChange={(e) => setCardCvv(e.target.value)}
                            className="w-full px-3 py-2 rounded-xl border border-slate-200 font-mono text-xs font-bold focus:ring-2 focus:ring-[#0BA4DB] bg-white"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {paystackMethod === 'ussd' && (
                    <div className="space-y-2.5 pt-1">
                      <div>
                        <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">
                          Select Bank to Dial
                        </label>
                        <select
                          value={ussdBank}
                          onChange={(e) => setUssdBank(e.target.value)}
                          className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold bg-white"
                        >
                          <option value="gtbank">Guaranty Trust Bank (GTBank - *737#)</option>
                          <option value="zenith">Zenith Bank (*966#)</option>
                          <option value="access">Access Bank (*901#)</option>
                          <option value="uba">UBA (*919#)</option>
                          <option value="firstbank">First Bank of Nigeria (*894#)</option>
                        </select>
                      </div>

                      <div className="p-3 bg-white rounded-xl border border-slate-200 text-center space-y-0.5">
                        <span className="text-[10px] text-slate-400 block">Dial USSD string on your registered SIM:</span>
                        <div className="font-mono text-base font-black text-indigo-700">
                          {ussdBank === 'gtbank' ? `*737*000*${Math.floor(1000 + Math.random() * 9000)}#`
                            : ussdBank === 'zenith' ? `*966*000*${Math.floor(1000 + Math.random() * 9000)}#`
                            : `*901*000*${Math.floor(1000 + Math.random() * 9000)}#`}
                        </div>
                      </div>
                    </div>
                  )}

                  {paystackMethod === 'qr' && (
                    <div className="p-3 bg-white rounded-xl border border-slate-200 text-center space-y-2">
                      <div className="w-28 h-28 mx-auto bg-slate-50 p-2 rounded-xl border border-slate-200 flex items-center justify-center">
                        <QrCode className="w-20 h-20 text-slate-800" />
                      </div>
                      <span className="text-[11px] text-slate-600 block">
                        Open your mobile banking app and scan NQR code to pay ₦{(isConsolidatedPayment ? consolidatedAmountToPay : selectedInvoice?.balance || 0).toLocaleString()}.
                      </span>
                    </div>
                  )}
                </div>
              )}

              {/* 2. DEDICATED VIRTUAL BANK TRANSFER */}
              {paymentGatewayTab === 'transfer' && (
                <div className="p-4 bg-blue-50/70 rounded-2xl border border-blue-200 space-y-3">
                  <div className="flex items-center space-x-2 text-blue-900">
                    <Smartphone className="w-4 h-4 text-blue-700" />
                    <span className="font-bold text-xs">Dedicated School Virtual Account</span>
                  </div>
                  <p className="text-xs text-slate-700 leading-relaxed">
                    Make a direct bank transfer of <strong>₦{(isConsolidatedPayment ? consolidatedAmountToPay : selectedInvoice?.balance || 0).toLocaleString()}</strong> via your mobile banking app or internet banking to the account below:
                  </p>

                  <div className="p-3.5 bg-white rounded-2xl border border-blue-200 flex items-center justify-between">
                    <div>
                      <div className="text-[10px] text-slate-400 font-semibold">Bank Name: WEMA BANK / PAYSTACK TITAN</div>
                      <div className="font-mono text-lg font-black text-slate-900 tracking-wider">
                        9928 3748 23
                      </div>
                      <div className="text-[10px] text-emerald-700 font-semibold">
                        Beneficiary: Apex Royal School ({isConsolidatedPayment ? 'Adeleke Family' : selectedInvoice?.studentName})
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        setCopiedAccount(true);
                        setTimeout(() => setCopiedAccount(false), 2000);
                      }}
                      className="px-3.5 py-2 rounded-xl bg-blue-100 hover:bg-blue-200 text-blue-900 font-bold text-xs flex items-center space-x-1 transition-colors"
                    >
                      {copiedAccount ? <Check className="w-4 h-4 text-emerald-700" /> : <Copy className="w-4 h-4" />}
                      <span>{copiedAccount ? 'Copied!' : 'Copy'}</span>
                    </button>
                  </div>

                  <div className="text-[11px] text-slate-500 flex items-center space-x-1">
                    <Clock className="w-3.5 h-3.5 text-blue-700" />
                    <span>Transfers are acknowledged and reconciled in real-time.</span>
                  </div>
                </div>
              )}

              {/* 3. POS TERMINAL COUNTER PAYMENT */}
              {paymentGatewayTab === 'pos' && (
                <div className="p-4 bg-purple-50/70 rounded-2xl border border-purple-200 space-y-3">
                  <div className="flex items-center space-x-2 text-purple-900">
                    <CreditCard className="w-4 h-4 text-purple-700" />
                    <span className="font-bold text-xs">School Bursary POS Counter / Moniepoint Agent</span>
                  </div>
                  <p className="text-xs text-slate-700 leading-relaxed">
                    If you paid or are paying with your debit card at the school bursary counter terminal or through an authorized Moniepoint / OPay terminal, record the reference below:
                  </p>

                  <div>
                    <label className="block text-[10px] font-bold uppercase text-slate-600 mb-1">
                      POS Terminal / Retrieval Reference Number (RRN)
                    </label>
                    <input
                      type="text"
                      value={posTerminalNo}
                      onChange={(e) => setPosTerminalNo(e.target.value)}
                      placeholder="e.g. MP-POS-09923 or RRN 9021882"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-purple-200 font-mono text-xs font-bold bg-white focus:ring-2 focus:ring-purple-600"
                    />
                  </div>
                </div>
              )}

              {/* 4. COMMERCIAL BANKS / TELLER / REMITA RRR */}
              {paymentGatewayTab === 'banks' && (
                <div className="p-4 bg-emerald-50/70 rounded-2xl border border-emerald-200 space-y-3">
                  <div className="flex items-center space-x-2 text-emerald-900">
                    <Landmark className="w-4 h-4 text-emerald-700" />
                    <span className="font-bold text-xs">Commercial Bank Branch & Remita RRR</span>
                  </div>
                  <p className="text-xs text-slate-700">
                    You can pay into the school's official bank accounts or walk into any commercial bank branch nationwide with your Remita RRR:
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
                    <div className="p-2.5 bg-white rounded-xl border border-emerald-200">
                      <span className="text-slate-400 block text-[10px]">Zenith Bank PLC:</span>
                      <strong className="font-mono text-slate-900 text-xs">1019 2837 41</strong>
                      <div className="text-[10px] text-emerald-800">Apex Royal Schools Bursary</div>
                    </div>
                    <div className="p-2.5 bg-white rounded-xl border border-emerald-200">
                      <span className="text-slate-400 block text-[10px]">GTBank:</span>
                      <strong className="font-mono text-slate-900 text-xs">0218 3920 11</strong>
                      <div className="text-[10px] text-emerald-800">Apex Royal Main Collection</div>
                    </div>
                  </div>

                  <div className="p-2.5 bg-white rounded-xl border border-emerald-200 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-slate-400 block">12-Digit Remita Retrieval Reference (RRR):</span>
                      <span className="font-mono text-sm font-black text-slate-900">2408-9821-3412</span>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">Bank Teller Slip</span>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase text-slate-600 mb-1">
                      Bank Deposit Teller Slip Number
                    </label>
                    <input
                      type="text"
                      value={bankTellerNo}
                      onChange={(e) => setBankTellerNo(e.target.value)}
                      placeholder="e.g. TEL-ZEN-2026-8819"
                      className="w-full px-3 py-2 rounded-xl border border-emerald-200 font-mono text-xs font-bold bg-white"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Modal Actions */}
            <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setShowPaymentModal(false)}
                className="px-4 py-2 rounded-xl border border-slate-300 text-slate-600 font-bold text-xs hover:bg-slate-100"
              >
                Cancel
              </button>

              <button
                type="button"
                disabled={isProcessing}
                onClick={handleAuthorizeParentPayment}
                className="px-6 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-black text-xs flex items-center space-x-2 shadow-md shadow-emerald-700/20 disabled:opacity-50"
              >
                {isProcessing ? (
                  <>
                    <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    <span>Processing Gateway Authorization...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Complete Payment Authorization</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* OFFICIAL STAMPED ELECTRONIC PAYMENT RECEIPT MODAL */}
      {showReceiptModal && activeReceiptInvoice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-sm p-4">
          <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95 max-h-[95vh] flex flex-col">
            <div className="p-6 overflow-y-auto space-y-6 text-xs" id="printable-receipt">
              {/* Receipt Top Header */}
              <div className="text-center border-b border-slate-200 pb-4 space-y-1">
                <div className="flex items-center justify-center space-x-2 mb-2">
                  <div className="w-10 h-10 rounded-xl bg-emerald-700 flex items-center justify-center text-white font-black">
                    AR
                  </div>
                </div>
                <h3 className="font-black text-base text-slate-900 tracking-tight uppercase">
                  {settings.schoolName}
                </h3>
                <p className="text-[10px] text-slate-500">{settings.address}</p>
                <div className="text-[10px] font-bold text-emerald-800 uppercase tracking-widest pt-1">
                  OFFICIAL BURSARY ELECTRONIC PAYMENT RECEIPT
                </div>
              </div>

              {/* Receipt Particulars */}
              <div className="grid grid-cols-2 gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                <div>
                  <span className="text-[10px] text-slate-400 block">Receipt / Ref No:</span>
                  <strong className="font-mono text-slate-900">{activeReceiptInvoice.transactionRef || activeReceiptInvoice.invoiceNo}</strong>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block">Date of Clearance:</span>
                  <strong className="text-slate-900">{activeReceiptInvoice.receiptDate || new Date().toISOString().split('T')[0]}</strong>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block">Payer (Parent/Guardian):</span>
                  <strong className="text-slate-900">{activeFamilyName}</strong>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block">Enrolled Scholar(s):</span>
                  <strong className="text-slate-900">{activeReceiptInvoice.studentName}</strong>
                </div>
              </div>

              {/* Itemized Table */}
              <div className="space-y-2">
                <div className="flex justify-between font-bold border-b border-slate-200 pb-1 text-slate-700">
                  <span>Description of Service</span>
                  <span>Amount Paid</span>
                </div>
                <div className="flex justify-between text-slate-900 py-1">
                  <span>{activeReceiptInvoice.feeType}</span>
                  <span className="font-bold">₦{activeReceiptInvoice.amountPaid.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-emerald-700 font-bold border-t border-slate-200 pt-2 text-sm">
                  <span>Total Settlement Cleared:</span>
                  <span>₦{activeReceiptInvoice.amountPaid.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-slate-500 text-[11px]">
                  <span>Outstanding Balance:</span>
                  <span className="text-emerald-700 font-bold">₦0.00 (PAID IN FULL)</span>
                </div>
              </div>

              {/* Stamped Certification Seal */}
              <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-300 flex items-center justify-between">
                <div>
                  <div className="text-[10px] font-bold uppercase text-emerald-900">Bursary Clearance Status:</div>
                  <div className="text-xs font-black text-emerald-700">OFFICIALLY CLEARED & AUDITED</div>
                  <div className="text-[10px] text-slate-600 mt-0.5">Signed: Dr. Joshua Adeleke (Chief Bursar)</div>
                </div>

                <div className="w-14 h-14 rounded-full border-2 border-dashed border-emerald-600 flex items-center justify-center text-center p-1 text-[8px] font-black text-emerald-700 rotate-12 uppercase">
                  Bursary Stamped
                </div>
              </div>

              {/* Powered by GetoCore */}
              <div className="text-center text-[10px] text-slate-400 border-t border-slate-100 pt-2 font-medium">
                Verified through Paystack & Commercial Clearing Gateway • Powered by <strong>GetoCore Digital Innovation</strong>
              </div>
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setShowReceiptModal(false)}
                className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 font-bold text-xs hover:bg-slate-100"
              >
                Close
              </button>

              <button
                type="button"
                onClick={() => window.print()}
                className="px-5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center space-x-1.5"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print Official Receipt</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* OFFICIAL BURSARY EXAMINATION CLEARANCE CERTIFICATE MODAL */}
      {showClearanceModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-sm p-4">
          <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95 max-h-[95vh] flex flex-col">
            <div className="p-8 overflow-y-auto space-y-6 text-xs text-center" id="printable-clearance">
              <div className="w-16 h-16 mx-auto rounded-2xl bg-emerald-700 text-white flex items-center justify-center text-2xl font-black shadow-lg">
                AR
              </div>

              <div>
                <h3 className="font-black text-lg text-slate-900 uppercase">
                  {settings.schoolName}
                </h3>
                <div className="text-[11px] font-mono text-emerald-700 font-bold">
                  OFFICE OF THE CHIEF BURSAR & DIRECTORATE OF FINANCIAL SERVICES
                </div>
                <div className="text-xs text-slate-500">{settings.address}</div>
              </div>

              <div className="p-4 rounded-2xl bg-emerald-50 border-2 border-emerald-400 space-y-2">
                <span className="text-[10px] font-black uppercase tracking-widest text-emerald-900">
                  OFFICIAL EXAMINATION CLEARANCE PASS
                </span>
                <h4 className="text-base font-black text-emerald-950 uppercase">
                  {activeFamilyName} ({myWards.map(w => w.firstName).join(' & ').toUpperCase() || 'ENROLLED SCHOLARS'})
                </h4>
                <div className="text-xs text-emerald-800 leading-relaxed font-medium">
                  This certifies that <strong>{myWards.length > 0 ? myWards.map(w => `${w.firstName} ${w.lastName} (${w.classOrDept})`).join(' and ') : 'Enrolled Scholars'}</strong> are officially cleared in fee standing for the {settings.currentSession} academic session ({settings.currentTermOrSemester}). All examination tickets, lab access, and CBT logins are hereby fully validated.
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-left bg-slate-50 p-4 rounded-2xl border border-slate-200">
                <div>
                  <span className="text-[10px] text-slate-400 block">Clearance Pass ID:</span>
                  <strong className="font-mono text-slate-900">CLR-2026-ADELEKE-992</strong>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block">Parent / Guardian:</span>
                  <strong className="text-slate-900">{activeFamilyName}</strong>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block">Issue Date:</span>
                  <strong className="text-slate-900">{new Date().toISOString().split('T')[0]}</strong>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block">Exam Hall Admission:</span>
                  <strong className="text-emerald-700 font-bold">APPROVED (ALL PAPERS)</strong>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-between border-t border-slate-200 text-left">
                <div>
                  <div className="font-bold text-xs text-slate-900">Dr. Joshua Adeleke (FCA)</div>
                  <div className="text-[10px] text-slate-500">Chief Bursar & Directorate of Finance</div>
                </div>
                <div className="w-20 h-20 border-2 border-emerald-600 rounded-2xl flex items-center justify-center p-1 text-center font-mono text-[9px] text-emerald-700 font-bold">
                  [ QR VALIDATED ]
                </div>
              </div>
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setShowClearanceModal(false)}
                className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 font-bold text-xs hover:bg-slate-100"
              >
                Close
              </button>

              <button
                type="button"
                onClick={() => window.print()}
                className="px-5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center space-x-1.5"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print Clearance Pass</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
