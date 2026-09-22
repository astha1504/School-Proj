'use client';

import React, { useState } from 'react';
import { 
  Coins, 
  Plus, 
  Download, 
  Search, 
  CheckCircle2, 
  AlertCircle, 
  Printer, 
  CreditCard,
  Building,
  FileCheck,
  ShieldCheck,
  Smartphone,
  QrCode,
  ArrowRight,
  ExternalLink,
  Copy,
  Check,
  Layers,
  Sparkles
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { InvoiceRecord, EducationalTier } from '../../types';

export const FeesBursaryPage: React.FC = () => {
  const { 
    invoices, 
    createInvoice, 
    recordPayment, 
    students, 
    activeTier, 
    setActiveTier,
    settings,
    licenseConfig,
    bursaryProofTickets,
    verifyPaymentProof
  } = useApp();

  const [bursaryTab, setBursaryTab] = useState<'invoices' | 'reconciliation'>('invoices');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedInvoice, setSelectedInvoice] = useState<InvoiceRecord | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showGatewayModal, setShowGatewayModal] = useState(false);
  const [showReceiptModal, setShowReceiptModal] = useState(false);

  // Gateway Selection
  const [selectedGateway, setSelectedGateway] = useState<'paystack' | 'flutterwave' | 'remita' | 'moniepoint' | 'bank_transfer'>('paystack');
  const [paystackChannel, setPaystackChannel] = useState<'card' | 'transfer' | 'ussd' | 'qr'>('card');

  // Paystack Card Simulator
  const [cardNumber, setCardNumber] = useState('5399 4100 8820 9182');
  const [cardExpiry, setCardExpiry] = useState('08/28');
  const [cardCvv, setCardCvv] = useState('321');
  const [cardPin, setCardPin] = useState('1234');
  const [isProcessing, setIsProcessing] = useState(false);
  const [copiedAccount, setCopiedAccount] = useState(false);

  // USSD Bank Selection
  const [ussdBank, setUssdBank] = useState('gtbank');

  // Create Invoice Form
  const [targetStudentId, setTargetStudentId] = useState(students[0]?.id || '');
  const [feeType, setFeeType] = useState('First Term Tuition & Development Levy');
  const [billedAmount, setBilledAmount] = useState(125000);
  const [dueDate, setDueDate] = useState('2026-10-31');

  const filteredInvoices = invoices.filter(inv => {
    if (inv.tier !== 'all' && !licenseConfig.unlockedTiers.includes(inv.tier)) {
      return false;
    }
    const matchesTier = activeTier === 'all' ? true : inv.tier === activeTier;
    const matchesSearch = `${inv.invoiceNo} ${inv.studentName} ${inv.feeType} ${inv.admissionNo}`
      .toLowerCase().includes(searchTerm.toLowerCase());
    return matchesTier && matchesSearch;
  });

  const totalBilled = filteredInvoices.reduce((a, b) => a + b.amount, 0);
  const totalCollected = filteredInvoices.reduce((a, b) => a + b.amountPaid, 0);
  const totalPending = filteredInvoices.reduce((a, b) => a + b.balance, 0);

  const handleOpenGatewayModal = (inv: InvoiceRecord) => {
    setSelectedInvoice(inv);
    setShowGatewayModal(true);
    setIsProcessing(false);
  };

  const handleOpenReceipt = (inv: InvoiceRecord) => {
    setSelectedInvoice(inv);
    setShowReceiptModal(true);
  };

  const handleExecutePayment = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!selectedInvoice) return;

    setIsProcessing(true);

    setTimeout(() => {
      let methodText = 'Paystack Online Checkout (Debit Card)';
      let gatewayKey: any = selectedGateway;
      let ref = `PSK_NG_${Date.now().toString().slice(-8)}`;

      if (selectedGateway === 'paystack') {
        if (paystackChannel === 'card') methodText = 'Paystack Card Payment (Mastercard Verified)';
        else if (paystackChannel === 'transfer') methodText = 'Paystack Virtual Bank Transfer (Wema Bank)';
        else if (paystackChannel === 'ussd') methodText = `Paystack USSD (${ussdBank.toUpperCase()} *737#)`;
        else methodText = 'Paystack NQR Instant Payment';
      } else if (selectedGateway === 'flutterwave') {
        methodText = 'Flutterwave Rave Gateway (Online)';
        ref = `FLW_NG_${Date.now().toString().slice(-8)}`;
      } else if (selectedGateway === 'remita') {
        methodText = 'Remita RRR Bank Branch / TSA Collection';
        ref = `RRR_${Math.floor(1000 + Math.random() * 9000)}-${Math.floor(1000 + Math.random() * 9000)}-${Math.floor(1000 + Math.random() * 9000)}`;
      } else if (selectedGateway === 'moniepoint') {
        methodText = 'Moniepoint POS Counter Terminal Settlement';
        ref = `MP_POS_${Date.now().toString().slice(-6)}`;
      } else {
        methodText = 'NIBSS Instant Transfer (Zenith Bank Direct)';
        ref = `NIP_${Date.now().toString().slice(-7)}`;
      }

      recordPayment(selectedInvoice.id, selectedInvoice.balance, methodText, gatewayKey, ref);
      setIsProcessing(false);
      setShowGatewayModal(false);
      setShowReceiptModal(true);
    }, 1200);
  };

  const handleCreateInvoiceSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const student = students.find(s => s.id === targetStudentId) || students[0];
    const invNo = `INV-NG-2026-${Math.floor(1000 + Math.random() * 9000)}`;

    createInvoice({
      invoiceNo: invNo,
      studentId: student.id,
      studentName: `${student.firstName} ${student.lastName}`,
      admissionNo: student.admissionNo,
      tier: student.tier,
      feeType,
      amount: Number(billedAmount),
      amountPaid: 0,
      balance: Number(billedAmount),
      status: 'unpaid',
      session: settings.currentSession,
      termOrSemester: settings.currentTermOrSemester,
      dueDate
    });

    setShowCreateModal(false);
  };

  return (
    <div className="space-y-6 font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Official Office Jurisdiction Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="p-2 rounded-xl bg-emerald-100 text-emerald-800">
              <Coins className="w-5 h-5" />
            </span>
            <div>
              <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider block">
                Office of the Chief Bursar & Directorate of Financial Services
              </span>
              <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                Bursary, ₦ Fee Management & Paystack Gateways
              </h1>
            </div>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Nigerian Naira (₦) fee schedules, Paystack checkout integration, Remita RRR generation, and official bursary clearance.
          </p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="px-4 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-xs flex items-center space-x-2 shadow-md shadow-emerald-700/20"
        >
          <Plus className="w-4 h-4" />
          <span>Raise New Fee Invoice</span>
        </button>
      </div>

      {/* Financial KPIs in Nigerian Naira */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Total Revenue Billed (₦)
          </span>
          <div className="text-2xl font-black text-slate-900 mt-1">
            ₦{totalBilled.toLocaleString()}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">Across all licensed academic tiers</div>
        </div>

        <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs font-semibold text-emerald-700 uppercase tracking-wider">
            Total Fees Collected (₦)
          </span>
          <div className="text-2xl font-black text-emerald-700 mt-1">
            ₦{totalCollected.toLocaleString()}
          </div>
          <div className="text-[11px] text-emerald-600 font-semibold mt-1">
            Verified via Paystack, NIBSS & Bank Channels
          </div>
        </div>

        <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs font-semibold text-rose-600 uppercase tracking-wider">
            Outstanding Arrears (₦)
          </span>
          <div className="text-2xl font-black text-rose-600 mt-1">
            ₦{totalPending.toLocaleString()}
          </div>
          <div className="text-[11px] text-rose-500 font-semibold mt-1">Subject to examination clearance</div>
        </div>
      </div>

      {/* Bursary Section Navigation Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setBursaryTab('invoices')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-2 ${
            bursaryTab === 'invoices'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Coins className="w-3.5 h-3.5" />
          <span>Student Invoices & Gateways ({filteredInvoices.length})</span>
        </button>

        <button
          onClick={() => setBursaryTab('reconciliation')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-2 ${
            bursaryTab === 'reconciliation'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <FileCheck className="w-3.5 h-3.5 text-emerald-500" />
          <span>Parent Payment Proofs & Bank Tellers ({bursaryProofTickets.length})</span>
          {bursaryProofTickets.filter(t => t.status === 'submitted').length > 0 && (
            <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse"></span>
          )}
        </button>
      </div>

      {/* TAB 1: INVOICES & GATEWAY SETTLEMENT */}
      {bursaryTab === 'invoices' && (
        <>
          {/* Filter and Gateway Badges */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 absolute left-3.5 top-2.5 text-slate-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search invoice number, student, fee type..."
                className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-600"
              />
            </div>

            {/* Gateway Support Badges */}
            <div className="flex items-center space-x-2 text-[11px] text-slate-500 font-semibold overflow-x-auto">
              <span className="text-slate-400">Integrated Gateways:</span>
              <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-900 border border-emerald-300 font-bold">
                Paystack
              </span>
              <span className="px-2 py-0.5 rounded-md bg-orange-100 text-orange-900 border border-orange-300 font-bold">
                Flutterwave
              </span>
              <span className="px-2 py-0.5 rounded-md bg-cyan-100 text-cyan-900 border border-cyan-300 font-bold">
                Remita RRR
              </span>
              <span className="px-2 py-0.5 rounded-md bg-blue-100 text-blue-900 border border-blue-300 font-bold">
                Moniepoint POS
              </span>
            </div>
          </div>

          {/* Invoices List */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                  <tr>
                    <th className="p-4">Invoice No</th>
                    <th className="p-4">Student / Admission</th>
                    <th className="p-4">Fee Particulars</th>
                    <th className="p-4">Amount Billed (₦)</th>
                    <th className="p-4">Amount Paid (₦)</th>
                    <th className="p-4">Balance (₦)</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredInvoices.map((inv) => (
                    <tr key={inv.id} className="hover:bg-slate-50">
                      <td className="p-4 font-mono font-bold text-slate-900">{inv.invoiceNo}</td>
                      <td className="p-4">
                        <div className="font-bold text-slate-900">{inv.studentName}</div>
                        <div className="text-[10px] text-slate-400 font-mono">
                          {inv.admissionNo} {inv.classOrDept ? `• ${inv.classOrDept}` : ''}
                        </div>
                      </td>
                      <td className="p-4 text-slate-600 max-w-xs truncate">{inv.feeType}</td>
                      <td className="p-4 font-mono font-bold text-slate-900">₦{inv.amount.toLocaleString()}</td>
                      <td className="p-4 font-mono text-emerald-700 font-bold">₦{inv.amountPaid.toLocaleString()}</td>
                      <td className="p-4 font-mono">
                        {inv.balance > 0 ? (
                          <span className="font-bold text-rose-600">₦{inv.balance.toLocaleString()}</span>
                        ) : (
                          <span className="text-slate-400">₦0</span>
                        )}
                      </td>
                      <td className="p-4">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase ${
                          inv.status === 'paid'
                            ? 'bg-emerald-100 text-emerald-800'
                            : inv.status === 'partial'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-rose-100 text-rose-800'
                        }`}>
                          {inv.status}
                        </span>
                      </td>
                      <td className="p-4 text-center">
                        <div className="flex items-center justify-center space-x-2">
                          {inv.balance > 0 ? (
                            <button
                              onClick={() => handleOpenGatewayModal(inv)}
                              className="px-3 py-1.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs flex items-center space-x-1 shadow-xs"
                            >
                              <CreditCard className="w-3.5 h-3.5" />
                              <span>Pay via Paystack</span>
                            </button>
                          ) : (
                            <button
                              onClick={() => handleOpenReceipt(inv)}
                              className="px-3 py-1.5 rounded-xl border border-slate-200 text-slate-700 font-semibold text-xs hover:bg-slate-50 flex items-center space-x-1"
                            >
                              <Printer className="w-3.5 h-3.5" />
                              <span>Official Receipt</span>
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {/* TAB 2: PARENT PAYMENT RECONCILIATION & TELLER PROOFS */}
      {bursaryTab === 'reconciliation' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                <FileCheck className="w-5 h-5 text-emerald-600" />
                Parent Payment Reconciliation Desk & Bank Teller Slips
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Review submitted transfer receipts, bank teller slips, and POS references uploaded by parents from the Parent Portal.
              </p>
            </div>
            <span className="text-xs font-bold text-slate-500 bg-slate-100 px-3 py-1.5 rounded-xl">
              {bursaryProofTickets.filter(t => t.status === 'submitted').length} Pending Verification
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                <tr>
                  <th className="p-3.5">Date / Time</th>
                  <th className="p-3.5">Payer (Parent)</th>
                  <th className="p-3.5">Scholar / Ward</th>
                  <th className="p-3.5">Amount (₦)</th>
                  <th className="p-3.5">Channel / Bank</th>
                  <th className="p-3.5">Reference / Slip</th>
                  <th className="p-3.5">Status</th>
                  <th className="p-3.5 text-center">Bursar Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {bursaryProofTickets.map(ticket => (
                  <tr key={ticket.id} className="hover:bg-slate-50">
                    <td className="p-3.5 text-slate-500 font-mono text-[11px] whitespace-nowrap">
                      {ticket.paymentDate}
                    </td>
                    <td className="p-3.5">
                      <div className="font-bold text-slate-900">{ticket.parentName}</div>
                      <div className="text-[10px] text-slate-400">{ticket.parentPhone}</div>
                    </td>
                    <td className="p-3.5">
                      <div className="font-bold text-slate-900">{ticket.studentName}</div>
                      <div className="text-[10px] text-slate-400 font-mono">{ticket.admissionNo} • {ticket.gradeLevel}</div>
                    </td>
                    <td className="p-3.5 font-mono font-black text-emerald-700">
                      ₦{ticket.amount.toLocaleString()}
                    </td>
                    <td className="p-3.5">
                      <div className="font-semibold text-slate-800 capitalize">{ticket.paymentMethod.replace('_', ' ')}</div>
                      <div className="text-[10px] text-slate-500">{ticket.bankName}</div>
                    </td>
                    <td className="p-3.5">
                      <span className="font-mono text-xs font-bold text-slate-800 bg-slate-100 px-2 py-0.5 rounded">
                        {ticket.referenceOrTellerNo}
                      </span>
                      {ticket.proofAttachmentName && (
                        <div className="text-[10px] text-blue-600 mt-0.5 underline cursor-pointer">
                          📎 {ticket.proofAttachmentName}
                        </div>
                      )}
                    </td>
                    <td className="p-3.5">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase ${
                        ticket.status === 'verified_cleared'
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                          : 'bg-amber-100 text-amber-800 border border-amber-300'
                      }`}>
                        {ticket.status === 'verified_cleared' ? '✓ Reconciled' : 'Pending Audit'}
                      </span>
                    </td>
                    <td className="p-3.5 text-center">
                      {ticket.status === 'submitted' ? (
                        <button
                          onClick={() => verifyPaymentProof(ticket.id, 'Bank credit confirmed on commercial statement. Approved and cleared.')}
                          className="px-3 py-1.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs flex items-center space-x-1 shadow-xs mx-auto transition-all"
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>Verify & Clear Credit</span>
                        </button>
                      ) : (
                        <span className="text-[11px] text-emerald-700 font-bold flex items-center justify-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Cleared by Bursar</span>
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* MULTI-GATEWAY CHECKOUT MODAL (PAYSTACK & OTHERS) */}
      {showGatewayModal && selectedInvoice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-sm p-4">
          <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95">
            {/* Paystack Styled Header */}
            <div className="px-6 py-4 bg-[#0BA4DB] text-white flex items-center justify-between">
              <div className="flex items-center space-x-2.5">
                <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center">
                  <ShieldCheck className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="text-[10px] font-extrabold uppercase tracking-widest text-emerald-100">
                    Secure Payment Gateway
                  </div>
                  <h3 className="font-extrabold text-sm tracking-tight">Paystack / Bank Multi-Channel Checkout</h3>
                </div>
              </div>
              <button 
                onClick={() => setShowGatewayModal(false)} 
                className="text-white/80 hover:text-white p-1 text-lg font-bold"
              >
                ✕
              </button>
            </div>

            {/* Bill Summary Banner */}
            <div className="px-6 py-3.5 bg-slate-50 border-b border-slate-200 flex items-center justify-between text-xs">
              <div>
                <span className="text-slate-400 block text-[10px]">Student / Invoice</span>
                <strong className="text-slate-900">{selectedInvoice.studentName} ({selectedInvoice.invoiceNo})</strong>
              </div>
              <div className="text-right">
                <span className="text-slate-400 block text-[10px]">Amount Payable:</span>
                <span className="text-base font-black text-emerald-700">₦{selectedInvoice.balance.toLocaleString()}</span>
              </div>
            </div>

            {/* Gateway Switcher Tabs */}
            <div className="p-6 space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 uppercase tracking-wider mb-2 text-[10px]">
                  Select Payment Gateway / Provider
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setSelectedGateway('paystack')}
                    className={`p-2.5 rounded-xl border text-center font-bold transition-all ${
                      selectedGateway === 'paystack'
                        ? 'border-[#0BA4DB] bg-cyan-50 text-[#0BA4DB] shadow-xs ring-1 ring-[#0BA4DB]'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    Paystack
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedGateway('flutterwave')}
                    className={`p-2.5 rounded-xl border text-center font-bold transition-all ${
                      selectedGateway === 'flutterwave'
                        ? 'border-orange-500 bg-orange-50 text-orange-600 shadow-xs ring-1 ring-orange-500'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    Flutterwave
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedGateway('remita')}
                    className={`p-2.5 rounded-xl border text-center font-bold transition-all ${
                      selectedGateway === 'remita'
                        ? 'border-rose-500 bg-rose-50 text-rose-600 shadow-xs ring-1 ring-rose-500'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    Remita (RRR)
                  </button>
                </div>
              </div>

              {/* PAYSTACK CHANNELS */}
              {selectedGateway === 'paystack' && (
                <div className="space-y-4">
                  <div className="flex border-b border-slate-200 text-[11px] font-bold">
                    {[
                      { id: 'card', label: 'Card' },
                      { id: 'transfer', label: 'Bank Transfer' },
                      { id: 'ussd', label: 'USSD' },
                      { id: 'qr', label: 'NQR / Scan' }
                    ].map(ch => (
                      <button
                        key={ch.id}
                        type="button"
                        onClick={() => setPaystackChannel(ch.id as any)}
                        className={`pb-2 px-3 border-b-2 transition-all ${
                          paystackChannel === ch.id
                            ? 'border-[#0BA4DB] text-[#0BA4DB]'
                            : 'border-transparent text-slate-400 hover:text-slate-700'
                        }`}
                      >
                        {ch.label}
                      </button>
                    ))}
                  </div>

                  {/* CHANNEL 1: CARD */}
                  {paystackChannel === 'card' && (
                    <div className="space-y-3 bg-slate-50 p-4 rounded-2xl border border-slate-200">
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
                            Valid Thru (MM/YY)
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
                            CVV (3 Digits)
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

                  {/* CHANNEL 2: VIRTUAL BANK TRANSFER */}
                  {paystackChannel === 'transfer' && (
                    <div className="p-4 bg-cyan-50/70 rounded-2xl border border-cyan-200 space-y-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-800 block">
                        Dynamic Dedicated Virtual Account
                      </span>
                      <p className="text-xs text-slate-700">
                        Transfer exactly <strong>₦{selectedInvoice.balance.toLocaleString()}</strong> to the designated account below:
                      </p>

                      <div className="p-3 bg-white rounded-xl border border-cyan-200 flex items-center justify-between">
                        <div>
                          <div className="text-[10px] text-slate-400 font-semibold">Bank Name: WEMA BANK / PAYSTACK TITAN</div>
                          <div className="font-mono text-base font-black text-slate-900 tracking-wider">
                            9928 3748 23
                          </div>
                          <div className="text-[10px] text-emerald-700 font-semibold">Beneficiary: EduSphere Apex Royal School</div>
                        </div>

                        <button
                          type="button"
                          onClick={() => {
                            setCopiedAccount(true);
                            setTimeout(() => setCopiedAccount(false), 2000);
                          }}
                          className="px-3 py-1.5 rounded-lg bg-cyan-100 hover:bg-cyan-200 text-cyan-900 font-bold text-xs flex items-center space-x-1"
                        >
                          {copiedAccount ? <Check className="w-3.5 h-3.5 text-emerald-700" /> : <Copy className="w-3.5 h-3.5" />}
                          <span>{copiedAccount ? 'Copied' : 'Copy'}</span>
                        </button>
                      </div>
                      <div className="text-[10px] text-slate-500 italic">
                        Account expires in 30 minutes. Payment verifies automatically.
                      </div>
                    </div>
                  )}

                  {/* CHANNEL 3: USSD */}
                  {paystackChannel === 'ussd' && (
                    <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                      <div>
                        <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">
                          Select Your Nigerian Bank
                        </label>
                        <select
                          value={ussdBank}
                          onChange={(e) => setUssdBank(e.target.value)}
                          className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold bg-white"
                        >
                          <option value="gtbank">Guaranty Trust Bank (GTBank - *737#)</option>
                          <option value="zenith">Zenith Bank (*966#)</option>
                          <option value="access">Access Bank (*901#)</option>
                          <option value="uba">United Bank for Africa (UBA - *919#)</option>
                          <option value="firstbank">First Bank of Nigeria (*894#)</option>
                        </select>
                      </div>

                      <div className="p-3 bg-white rounded-xl border border-slate-200 text-center space-y-1">
                        <span className="text-[10px] text-slate-400 block">Dial this string on your phone:</span>
                        <div className="font-mono text-base font-black text-indigo-700">
                          {ussdBank === 'gtbank' ? `*737*000*${Math.floor(1000 + Math.random() * 9000)}#`
                            : ussdBank === 'zenith' ? `*966*000*${Math.floor(1000 + Math.random() * 9000)}#`
                            : `*901*000*${Math.floor(1000 + Math.random() * 9000)}#`}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* CHANNEL 4: NQR */}
                  {paystackChannel === 'qr' && (
                    <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-center space-y-3">
                      <div className="w-32 h-32 mx-auto bg-white p-2 rounded-2xl border border-slate-300 shadow-xs flex items-center justify-center">
                        <QrCode className="w-24 h-24 text-slate-800" />
                      </div>
                      <p className="text-[11px] text-slate-600">
                        Scan with your Nigerian Banking App (Access More, GTWorld, Kuda, Moniepoint, OPay).
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* REMITA RRR GENERATOR */}
              {selectedGateway === 'remita' && (
                <div className="p-4 bg-rose-50 rounded-2xl border border-rose-200 space-y-3">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-rose-800 block">
                    Remita Retrieval Reference (RRR)
                  </span>
                  <div className="p-3 bg-white rounded-xl border border-rose-200 text-center space-y-1">
                    <span className="text-[10px] text-slate-400">Your 12-Digit RRR Code:</span>
                    <div className="font-mono text-lg font-black text-rose-700 tracking-widest">
                      2408-9821-3412
                    </div>
                  </div>
                  <p className="text-[11px] text-slate-600 leading-relaxed">
                    Take this code to any commercial bank branch nationwide or pay online via Remita.net to complete tuition settlement.
                  </p>
                </div>
              )}

              {/* FLUTTERWAVE GATEWAY */}
              {selectedGateway === 'flutterwave' && (
                <div className="p-4 bg-orange-50 rounded-2xl border border-orange-200 space-y-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-orange-800 block">
                    Flutterwave Rave Checkout
                  </span>
                  <p className="text-[11px] text-slate-700">
                    Accepting Nigerian Debit Cards, Barter, USSD, and Mobile Money with automated settlement.
                  </p>
                </div>
              )}

              {/* Action Button */}
              <div className="pt-2">
                <button
                  type="button"
                  disabled={isProcessing}
                  onClick={() => handleExecutePayment()}
                  className="w-full py-3 rounded-2xl bg-[#0BA4DB] hover:bg-[#0883AF] text-white font-black text-xs flex items-center justify-center space-x-2 shadow-lg shadow-cyan-600/30 transition-all disabled:opacity-50"
                >
                  {isProcessing ? (
                    <span>Verifying Transaction with Bank...</span>
                  ) : (
                    <>
                      <span>Authorize Payment of ₦{selectedInvoice.balance.toLocaleString()}</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </div>

            <div className="p-3 bg-slate-100 text-center text-[10px] text-slate-400 border-t border-slate-200">
              Secured with 256-Bit SSL Encryption • Powered by <strong>GetoCore Digital Innovation</strong>
            </div>
          </div>
        </div>
      )}

      {/* OFFICIAL PRINTABLE RECEIPT MODAL */}
      {showReceiptModal && selectedInvoice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="bg-white w-full max-w-xl rounded-3xl shadow-2xl p-6 sm:p-8 space-y-4 border border-slate-200 animate-in fade-in zoom-in-95 max-h-[95vh] overflow-y-auto">
            <div className="text-center border-b-2 border-slate-900 pb-4">
              <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-800">
                Official Bursary Payment Acknowledgment
              </span>
              <h3 className="text-xl font-black text-slate-900 uppercase mt-0.5">{settings.schoolName}</h3>
              <p className="text-[11px] text-slate-500">{settings.address} • {settings.phone}</p>
              <div className="mt-2 text-xs font-mono font-bold bg-slate-100 py-1 px-3 rounded-full inline-block">
                Receipt Ref: {selectedInvoice.transactionRef || 'PSK_NG_2026_8891023'}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>Student: <strong>{selectedInvoice.studentName}</strong></div>
              <div>Admission No: <strong>{selectedInvoice.admissionNo}</strong></div>
              <div>Fee Particulars: <strong>{selectedInvoice.feeType}</strong></div>
              <div>Date Issued: <strong>{selectedInvoice.receiptDate || new Date().toISOString().split('T')[0]}</strong></div>
            </div>

            <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 text-center">
              <span className="text-xs text-emerald-800 font-semibold">Total Amount Received:</span>
              <div className="text-3xl font-black text-emerald-900 mt-1">
                ₦{selectedInvoice.amountPaid.toLocaleString()}
              </div>
              <div className="text-[11px] text-emerald-700 mt-1">
                Settled via {selectedInvoice.paymentMethod || 'Paystack Instant Gateway'}
              </div>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between text-[11px]">
              <div>
                <span className="text-slate-400 block text-[10px]">Verified By:</span>
                <strong className="text-slate-800">Alhaji Rasheed Salami (FCA)</strong>
                <div className="text-[10px] text-slate-500">Chief Bursar & Financial Controller</div>
              </div>
              <div className="text-right">
                <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">
                  OFFICIAL BURSARY STAMP ✓
                </span>
              </div>
            </div>

            <div className="text-center text-[10px] text-slate-400">
              Electronic Billing &amp; Clearing Infrastructure Powered by <strong className="text-slate-700">GetoCore Digital Innovation</strong>
            </div>

            <div className="flex justify-between items-center pt-4 border-t border-slate-200">
              <button
                onClick={() => setShowReceiptModal(false)}
                className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 text-xs font-semibold"
              >
                Close
              </button>
              <button
                onClick={() => window.print()}
                className="px-5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold flex items-center space-x-1.5"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print Official Receipt</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CREATE INVOICE MODAL */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95">
            <div className="px-6 py-4 bg-emerald-50 border-b border-emerald-100 flex items-center justify-between">
              <div className="flex items-center space-x-2 text-emerald-800">
                <Coins className="w-5 h-5" />
                <h3 className="font-bold text-slate-900">Issue Fee Invoice (₦)</h3>
              </div>
              <button onClick={() => setShowCreateModal(false)} className="text-slate-400 p-1">✕</button>
            </div>

            <form onSubmit={handleCreateInvoiceSubmit} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Select Student
                </label>
                <select
                  value={targetStudentId}
                  onChange={(e) => setTargetStudentId(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-emerald-600"
                >
                  {students.map(s => (
                    <option key={s.id} value={s.id}>
                      {s.firstName} {s.lastName} ({s.classOrDept} - {s.admissionNo})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Fee Description / Particulars
                </label>
                <input
                  type="text"
                  required
                  value={feeType}
                  onChange={(e) => setFeeType(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-emerald-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Billed Amount (in ₦ Naira)
                  </label>
                  <input
                    type="number"
                    required
                    value={billedAmount}
                    onChange={(e) => setBilledAmount(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold focus:ring-2 focus:ring-emerald-600"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Due Date
                  </label>
                  <input
                    type="date"
                    required
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-emerald-600"
                  />
                </div>
              </div>

              <div className="pt-3 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-semibold shadow-md shadow-emerald-700/20"
                >
                  Generate & Send Invoice
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
