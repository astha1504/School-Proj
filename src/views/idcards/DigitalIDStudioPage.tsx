'use client';

import React, { useState } from 'react';
import { 
  CreditCard, 
  QrCode, 
  Printer, 
  Download, 
  ShieldCheck, 
  Sparkles, 
  Award, 
  GraduationCap, 
  CheckCircle2,
  Building,
  UserCheck,
  RefreshCw,
  Eye
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Student } from '../../types';

export const DigitalIDStudioPage: React.FC = () => {
  const { students, settings, activeTier } = useApp();

  const [selectedStudentId, setSelectedStudentId] = useState<string>(students[0]?.id || 'std_04');
  const [cardType, setCardType] = useState<'student_id' | 'alumni_card' | 'certificate'>('student_id');
  const [showVerifyModal, setShowVerifyModal] = useState(false);

  const activeStudent = students.find(s => s.id === selectedStudentId) || students[0];

  return (
    <div className="space-y-6 font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="p-2 rounded-xl bg-amber-100 text-amber-800">
              <CreditCard className="w-5 h-5" />
            </span>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              Smart Digital ID & Verifiable Credential Studio
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Unique biometric identity generation with live scannable QR verification for active scholars and lifelong alumni.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => window.print()}
            className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs flex items-center space-x-2 shadow-xs transition-all"
          >
            <Printer className="w-4 h-4" />
            <span>Print PVC Card</span>
          </button>
        </div>
      </div>

      {/* Selector Ribbon */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Scholar Select */}
        <div className="flex items-center space-x-3 w-full md:w-auto">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider shrink-0">
            Select Scholar / Alumnus:
          </label>
          <select
            value={selectedStudentId}
            onChange={(e) => setSelectedStudentId(e.target.value)}
            className="px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-600 w-full sm:w-80"
          >
            {students.map(s => (
              <option key={s.id} value={s.id}>
                {s.firstName} {s.lastName} ({s.classOrDept} • {s.admissionNo})
              </option>
            ))}
          </select>
        </div>

        {/* Card Type Selector */}
        <div className="flex items-center space-x-1 bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs">
          <button
            onClick={() => setCardType('student_id')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
              cardType === 'student_id' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Student Smart ID
          </button>
          <button
            onClick={() => setCardType('alumni_card')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
              cardType === 'alumni_card' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Alumni Lifetime Card
          </button>
          <button
            onClick={() => setCardType('certificate')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
              cardType === 'certificate' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Digital Certificate
          </button>
        </div>
      </div>

      {/* CARD VIEWER CONTAINER */}
      {activeStudent && (
        <div className="space-y-6">
          {/* TYPE 1: STUDENT SMART ID (FRONT & BACK) */}
          {cardType === 'student_id' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
              {/* Card Front */}
              <div className="rounded-3xl p-6 bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950 text-white shadow-2xl border border-slate-800 relative overflow-hidden flex flex-col justify-between min-h-[340px]">
                <div className="absolute -right-10 -bottom-10 w-44 h-44 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none"></div>

                {/* Top Header */}
                <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
                  <div className="flex items-center space-x-2.5">
                    <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center font-bold text-white shadow-sm">
                      <GraduationCap className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-black tracking-tight text-white uppercase">{settings.schoolName}</h4>
                      <p className="text-[9px] text-emerald-400 font-semibold">STUDENT IDENTITY CARD • NIGERIA</p>
                    </div>
                  </div>
                  <span className="text-[9px] font-bold uppercase tracking-wider bg-emerald-950/80 text-emerald-300 border border-emerald-700/50 px-2 py-0.5 rounded-md">
                    {activeStudent.tier.replace('_', ' ')}
                  </span>
                </div>

                {/* Middle: Photo & Bio */}
                <div className="flex items-center space-x-4 my-4">
                  <div className="w-24 h-28 rounded-2xl overflow-hidden bg-slate-800 ring-2 ring-emerald-500/50 shrink-0 shadow-md">
                    {activeStudent.avatarUrl ? (
                      <img src={activeStudent.avatarUrl} alt={activeStudent.firstName} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center font-bold text-xl text-emerald-400">
                        {activeStudent.firstName[0]}
                      </div>
                    )}
                  </div>

                  <div className="space-y-1 text-xs">
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase font-semibold">Full Name</span>
                      <div className="text-sm font-black text-white">{activeStudent.firstName} {activeStudent.lastName}</div>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase font-semibold">Admission / Matric No</span>
                      <div className="font-mono text-xs font-bold text-emerald-400">{activeStudent.admissionNo}</div>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase font-semibold">Level / Stream</span>
                      <div className="text-slate-200">{activeStudent.classOrDept} {activeStudent.armOrStream ? `(${activeStudent.armOrStream})` : ''}</div>
                    </div>
                  </div>
                </div>

                {/* Bottom Bar & Chip */}
                <div className="flex items-center justify-between pt-3 border-t border-slate-800/80 text-[10px] text-slate-400">
                  <div className="flex items-center space-x-2">
                    <div className="w-7 h-5 rounded bg-amber-400/80 border border-amber-300 flex items-center justify-center">
                      <div className="w-4 h-3 border border-amber-600/60 rounded-xs"></div>
                    </div>
                    <span className="font-mono text-slate-300">VALID: {settings.currentSession}</span>
                  </div>

                  <div className="text-[9px] text-slate-400">
                    Powered by <strong className="text-emerald-400">GetoCore</strong>
                  </div>

                  <button
                    onClick={() => setShowVerifyModal(true)}
                    className="flex items-center space-x-1 text-emerald-400 hover:text-emerald-300 font-bold"
                  >
                    <QrCode className="w-3.5 h-3.5" />
                    <span>Scan to Verify</span>
                  </button>
                </div>
              </div>

              {/* Card Back */}
              <div className="rounded-3xl p-6 bg-slate-900 text-white shadow-2xl border border-slate-800 relative flex flex-col justify-between min-h-[340px]">
                {/* Magnetic Stripe */}
                <div className="-mx-6 -mt-2 h-10 bg-slate-950 border-y border-slate-800"></div>

                <div className="text-xs space-y-3 my-2">
                  <p className="text-[10px] text-slate-400 leading-relaxed italic">
                    This credential card remains the property of {settings.schoolName}. If found, please return to any accredited campus office or contact the Registrar at {settings.phone}.
                  </p>

                  <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 space-y-1">
                    <div className="text-slate-400 text-[10px]">Emergency Guardian:</div>
                    <div className="font-bold text-white text-xs">{activeStudent.guardianName}</div>
                    <div className="text-emerald-400 font-mono text-xs">{activeStudent.guardianPhone}</div>
                  </div>
                </div>

                {/* QR Code & Barcode Section */}
                <div className="flex items-center justify-between pt-3 border-t border-slate-800">
                  <div 
                    onClick={() => setShowVerifyModal(true)}
                    className="p-2 bg-white rounded-xl cursor-pointer hover:ring-2 hover:ring-emerald-400 transition-all shadow-sm"
                  >
                    <QrCode className="w-12 h-12 text-slate-900" />
                  </div>

                  <div className="text-right space-y-0.5">
                    <div className="text-[9px] text-slate-400 uppercase font-mono">REGISTRAR SIGNATURE</div>
                    <div className="font-serif italic text-emerald-400 text-sm">Dr. A. Mohammed</div>
                    <div className="text-[9px] text-slate-500 font-mono">HASH: {activeStudent.id.toUpperCase()}-NG</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TYPE 2: ALUMNI LIFETIME MEMBERSHIP CARD */}
          {cardType === 'alumni_card' && (
            <div className="max-w-md mx-auto">
              <div className="rounded-3xl p-7 bg-gradient-to-br from-amber-950 via-slate-950 to-stone-900 text-white shadow-2xl border-2 border-amber-500/40 relative overflow-hidden flex flex-col justify-between min-h-[360px]">
                {/* Gold Seal Watermark */}
                <div className="absolute right-3 top-3 w-20 h-20 rounded-full border border-amber-500/20 flex items-center justify-center text-amber-400/20 font-black text-xs uppercase tracking-tighter pointer-events-none">
                  LIFETIME<br/>ALUMNI
                </div>

                <div>
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-10 h-10 rounded-xl bg-amber-500 text-amber-950 flex items-center justify-center font-black">
                      <Award className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-extrabold text-sm text-amber-400 uppercase tracking-wider">{settings.schoolName}</h3>
                      <p className="text-[10px] text-slate-300 font-semibold tracking-widest">ALUMNI ASSOCIATION LIFETIME MEMBER</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4 my-4">
                    <div className="w-20 h-24 rounded-xl overflow-hidden bg-slate-800 ring-2 ring-amber-500/40 shrink-0">
                      {activeStudent.avatarUrl ? (
                        <img src={activeStudent.avatarUrl} alt={activeStudent.firstName} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center font-bold text-amber-400">
                          {activeStudent.firstName[0]}
                        </div>
                      )}
                    </div>

                    <div className="space-y-1 text-xs">
                      <div>
                        <span className="text-[9px] text-amber-400/80 uppercase font-bold">Alumnus Name</span>
                        <div className="text-sm font-bold text-white">{activeStudent.firstName} {activeStudent.lastName}</div>
                      </div>
                      <div>
                        <span className="text-[9px] text-amber-400/80 uppercase font-bold">Lifetime Member ID</span>
                        <div className="font-mono text-xs font-bold text-amber-300">ALM-APX-{activeStudent.admissionNo.replace(/\//g, '-')}</div>
                      </div>
                      <div>
                        <span className="text-[9px] text-amber-400/80 uppercase font-bold">Graduating Class</span>
                        <div className="text-slate-300">Class of 2026 • {activeStudent.classOrDept}</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-amber-500/30 text-xs">
                  <div 
                    onClick={() => setShowVerifyModal(true)}
                    className="p-1.5 bg-white rounded-lg cursor-pointer hover:ring-2 hover:ring-amber-400 transition-all"
                  >
                    <QrCode className="w-10 h-10 text-slate-900" />
                  </div>
                  <div className="text-right text-[10px] text-amber-400 font-semibold">
                    <div>PERMANENT CREDENTIAL</div>
                    <div className="text-slate-400">Nigeria & Global Chapters</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TYPE 3: DIGITAL CERTIFICATE */}
          {cardType === 'certificate' && (
            <div className="max-w-3xl mx-auto bg-white rounded-3xl p-8 sm:p-12 border-8 border-double border-amber-800/60 shadow-2xl text-center space-y-6 text-slate-900 relative">
              <div className="text-xs font-bold uppercase tracking-widest text-emerald-800">
                Federal Republic of Nigeria • Accredited Academic Institution
              </div>

              <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-slate-900">
                {settings.schoolName}
              </h2>
              <p className="text-xs text-slate-500 italic">"{settings.motto}"</p>

              <div className="py-2">
                <span className="text-xs font-bold uppercase tracking-widest text-amber-700 bg-amber-50 px-4 py-1.5 rounded-full border border-amber-200">
                  Certificate of Academic Completion & Excellence
                </span>
              </div>

              <p className="text-xs text-slate-600">This is to officially certify that</p>

              <h3 className="text-3xl font-serif font-black text-slate-900 underline decoration-amber-600 underline-offset-8">
                {activeStudent.firstName} {activeStudent.lastName}
              </h3>

              <p className="text-xs text-slate-700 max-w-lg mx-auto leading-relaxed">
                has satisfactorily fulfilled all academic standards, character assessments, and examinations prescribed for <strong>{activeStudent.classOrDept}</strong> within the <strong>{activeStudent.tier.replace('_', ' ').toUpperCase()}</strong> division during the {settings.currentSession} academic session.
              </p>

              <div className="pt-8 grid grid-cols-3 gap-6 items-end border-t border-slate-200 text-xs">
                <div>
                  <div className="font-serif italic text-slate-800 text-sm border-b border-slate-400 pb-1 w-32 mx-auto">
                    Dr. A. Mohammed
                  </div>
                  <span className="text-[10px] text-slate-500 font-bold block mt-1">Registrar</span>
                </div>

                <div>
                  <div 
                    onClick={() => setShowVerifyModal(true)}
                    className="w-14 h-14 bg-slate-900 text-white rounded-2xl mx-auto flex items-center justify-center p-2 cursor-pointer shadow-md"
                  >
                    <QrCode className="w-10 h-10 text-white" />
                  </div>
                  <span className="text-[9px] text-emerald-800 font-bold block mt-1">CLICK TO VERIFY QR</span>
                  <span className="text-[8px] text-slate-400 block">Powered by GetoCore</span>
                </div>

                <div>
                  <div className="font-serif italic text-slate-800 text-sm border-b border-slate-400 pb-1 w-32 mx-auto">
                    Dr. A. Umar
                  </div>
                  <span className="text-[10px] text-slate-500 font-bold block mt-1">Head of School / Dean</span>
                </div>
              </div>

              <div className="text-[9px] text-slate-400 pt-2">
                Digital Security Architecture &amp; Biometric Ledger Powered by <strong>GetoCore Digital Innovation</strong>
              </div>
            </div>
          )}
        </div>
      )}

      {/* LIVE ONLINE VERIFICATION MODAL */}
      {showVerifyModal && activeStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in zoom-in-95">
          <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden border border-slate-200 text-xs">
            <div className="px-6 py-4 bg-emerald-700 text-white flex items-center justify-between">
              <div className="flex items-center space-x-2 font-bold">
                <ShieldCheck className="w-5 h-5" />
                <span>EduSphere Credential Verification</span>
              </div>
              <button onClick={() => setShowVerifyModal(false)} className="text-emerald-200 hover:text-white p-1">✕</button>
            </div>

            <div className="p-6 space-y-4">
              <div className="text-center space-y-1">
                <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto mb-2">
                  <CheckCircle2 className="w-7 h-7" />
                </div>
                <h4 className="text-base font-bold text-slate-900">VERIFIED AUTHENTIC CREDENTIAL</h4>
                <p className="text-[11px] text-slate-500">
                  This record is validated in the Federal / State Education Cloud Registry.
                </p>
                <div className="text-[10px] font-semibold text-emerald-800 bg-emerald-50 py-0.5 px-2 rounded-full inline-block">
                  Verified by GetoCore Digital Innovation Engine
                </div>
              </div>

              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-500">Student Name:</span>
                  <strong className="text-slate-900">{activeStudent.firstName} {activeStudent.lastName}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Admission No:</span>
                  <strong className="font-mono text-emerald-800">{activeStudent.admissionNo}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Educational Wing:</span>
                  <strong className="uppercase">{activeStudent.tier.replace('_', ' ')}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Institution:</span>
                  <strong>{settings.schoolName}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Status:</span>
                  <span className="font-bold text-emerald-700 uppercase">ACTIVE & REGISTERED</span>
                </div>
              </div>

              <div className="text-[10px] text-slate-400 font-mono text-center">
                Digital Verification Hash: SHA256-APX-{activeStudent.id.toUpperCase()}-SECURE
              </div>

              <button
                onClick={() => setShowVerifyModal(false)}
                className="w-full py-2.5 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800"
              >
                Close Verification Slip
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
