'use client';
import React, { useState } from 'react';
import { X, Mail, CheckCircle2, ShieldAlert } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const ForgotPasswordModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const [emailOrId, setEmailOrId] = useState('');
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (emailOrId.trim()) {
      setSubmitted(true);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95 duration-200">
        <div className="px-6 py-4 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center space-x-2 text-emerald-700">
            <ShieldAlert className="w-5 h-5" />
            <h3 className="font-semibold text-slate-800">Password Recovery & PIN Reset</h3>
          </div>
          <button 
            onClick={() => { setSubmitted(false); onClose(); }}
            className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          {!submitted ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <p className="text-sm text-slate-600 leading-relaxed">
                Enter your registered institutional email, Staff ID, Student Matric Number, or Parent Phone Number. A secure recovery OTP link will be dispatched via SMS/Email.
              </p>
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  Identifier or Email
                </label>
                <div className="relative">
                  <Mail className="w-5 h-5 absolute left-3.5 top-3 text-slate-400" />
                  <input
                    type="text"
                    required
                    value={emailOrId}
                    onChange={(e) => setEmailOrId(e.target.value)}
                    placeholder="e.g. SSS/25/089 or parent.adeleke@gmail.com"
                    className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-sm font-semibold text-white bg-emerald-700 hover:bg-emerald-800 shadow-md shadow-emerald-700/20"
                >
                  Send Recovery Link
                </button>
              </div>
            </form>
          ) : (
            <div className="text-center py-4 space-y-3">
              <div className="w-12 h-12 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-bold text-slate-800">Recovery Instructions Sent!</h4>
              <p className="text-sm text-slate-600">
                A verification link has been sent to the contact associated with <strong>{emailOrId}</strong>.
              </p>
              <button
                onClick={() => { setSubmitted(false); onClose(); }}
                className="mt-4 px-6 py-2 rounded-xl text-sm font-semibold text-white bg-emerald-700 hover:bg-emerald-800"
              >
                Back to Sign In
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
