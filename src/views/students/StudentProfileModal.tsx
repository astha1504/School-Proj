'use client';
import React from 'react';
import { X, User, Phone, Mail, MapPin, Calendar, Award, Coins, CheckCircle2, Shield } from 'lucide-react';
import { Student } from '../../types';

interface Props {
  student: Student | null;
  isOpen: boolean;
  onClose: () => void;
}

export const StudentProfileModal: React.FC<Props> = ({ student, isOpen, onClose }) => {
  if (!isOpen || !student) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 font-['Plus_Jakarta_Sans',sans-serif]">
      <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95">
        {/* Header Ribbon */}
        <div className="relative bg-gradient-to-r from-slate-900 via-emerald-950 to-slate-900 p-6 text-white flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 rounded-2xl overflow-hidden bg-slate-800 ring-2 ring-emerald-400 shrink-0">
              {student.avatarUrl ? (
                <img src={student.avatarUrl} alt={student.firstName} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center font-bold text-lg text-emerald-400">
                  {student.firstName[0]}
                </div>
              )}
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-300 px-2.5 py-0.5 rounded-full border border-emerald-500/30">
                  {student.tier.replace('_', ' ')}
                </span>
                <span className="text-xs text-slate-300 font-mono">{student.admissionNo}</span>
              </div>
              <h2 className="text-xl font-bold text-white mt-1">
                {student.firstName} {student.otherName ? student.otherName + ' ' : ''}{student.lastName}
              </h2>
              <p className="text-xs text-slate-300">
                {student.classOrDept} {student.armOrStream ? `• ${student.armOrStream}` : ''}
              </p>
            </div>
          </div>

          <button 
            onClick={onClose}
            className="text-slate-400 hover:text-white p-2 rounded-xl hover:bg-white/10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          {/* Metrics Grid */}
          <div className="grid grid-cols-3 gap-3">
            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 text-center">
              <span className="text-[11px] text-slate-500 font-medium">Academic Rating</span>
              <div className="text-lg font-extrabold text-slate-900 mt-0.5">
                {student.termAverage ? `${student.termAverage}%` : student.cgpa ? `${student.cgpa} CGPA` : 'N/A'}
              </div>
            </div>
            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 text-center">
              <span className="text-[11px] text-slate-500 font-medium">Attendance Rate</span>
              <div className="text-lg font-extrabold text-emerald-700 mt-0.5">
                {student.attendanceRate}%
              </div>
            </div>
            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 text-center">
              <span className="text-[11px] text-slate-500 font-medium">Fee Balance (₦)</span>
              <div className={`text-lg font-extrabold mt-0.5 ${student.feeBalance === 0 ? 'text-emerald-700' : 'text-rose-600'}`}>
                ₦{student.feeBalance.toLocaleString()}
              </div>
            </div>
          </div>

          {/* Student Bio & Demographics */}
          <div>
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2.5">
              Personal Bio & Enrollment Details
            </h4>
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
                <span className="text-slate-400">Gender & Birth:</span>
                <div className="font-semibold text-slate-800">{student.gender} • Born {student.dob}</div>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
                <span className="text-slate-400">State of Origin (Nigeria):</span>
                <div className="font-semibold text-slate-800">{student.stateOfOrigin || 'FCT Abuja'}</div>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
                <span className="text-slate-400">Status:</span>
                <div className="font-semibold text-emerald-700 capitalize flex items-center space-x-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>{student.status}</span>
                </div>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
                <span className="text-slate-400">Educational Stream:</span>
                <div className="font-semibold text-slate-800">{student.tier.toUpperCase()}</div>
              </div>
            </div>
          </div>

          {/* Guardian / Parent Contacts */}
          <div>
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2.5">
              Parent & Guardian Contact Information
            </h4>
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Primary Guardian:</span>
                <strong className="text-slate-900">{student.guardianName}</strong>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500 flex items-center space-x-1">
                  <Phone className="w-3.5 h-3.5 text-slate-400" />
                  <span>Emergency Phone:</span>
                </span>
                <strong className="text-slate-900">{student.guardianPhone}</strong>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500 flex items-center space-x-1">
                  <Mail className="w-3.5 h-3.5 text-slate-400" />
                  <span>Email Address:</span>
                </span>
                <strong className="text-slate-900">{student.guardianEmail}</strong>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-900 text-white text-xs font-semibold hover:bg-slate-800"
          >
            Close Profile
          </button>
        </div>
      </div>
    </div>
  );
};
