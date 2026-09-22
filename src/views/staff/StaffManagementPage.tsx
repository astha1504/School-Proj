'use client';

import React, { useState } from 'react';
import { 
  Users, 
  Plus, 
  Search, 
  Award, 
  FileCheck2, 
  CheckCircle2, 
  Mail, 
  Phone, 
  Briefcase, 
  BookOpen, 
  Edit3, 
  Trash2, 
  ShieldCheck, 
  Layers, 
  Clock,
  Calendar,
  Building2,
  AlertCircle
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { StaffMember, EducationalTier } from '../../types';

export const StaffManagementPage: React.FC = () => {
  const { 
    staff, 
    addStaff, 
    updateStaff, 
    deleteStaff, 
    classes, 
    activeTier, 
    setActiveTier, 
    licenseConfig 
  } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingStaff, setEditingStaff] = useState<StaffMember | null>(null);

  // Form Fields
  const [staffId, setStaffId] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState('Senior Subject Teacher & Form Master');
  const [tier, setTier] = useState<EducationalTier | 'all'>('primary');
  const [qualification, setQualification] = useState('B.Ed (Hons) Mathematics, NCE');
  const [departmentOrClass, setDepartmentOrClass] = useState('Primary Department');
  const [assignedSubjectsStr, setAssignedSubjectsStr] = useState('Mathematics & Quantitative');
  const [assignedClassArm, setAssignedClassArm] = useState('');
  const [trcnNumber, setTrcnNumber] = useState('TRCN/LA/2026/1094');
  const [trcnStatus, setTrcnStatus] = useState<'certified' | 'pending' | 'exempt'>('certified');
  const [employmentDate, setEmploymentDate] = useState('2024-09-01');
  const [salaryGrade, setSalaryGrade] = useState('GL 10');
  const [periodsPerWeek, setPeriodsPerWeek] = useState(16);
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [status, setStatus] = useState<'active' | 'on_leave'>('active');

  const filteredStaff = staff.filter(st => {
    // Check tier validity
    if (st.tier !== 'all' && !licenseConfig.unlockedTiers.includes(st.tier)) {
      return false;
    }
    const matchesTier = activeTier === 'all' ? true : (st.tier === 'all' || st.tier === activeTier);
    const matchesSearch = `${st.name} ${st.staffId} ${st.role} ${st.qualification} ${st.trcnNumber || ''} ${st.assignedSubjects.join(' ')}`
      .toLowerCase().includes(searchTerm.toLowerCase());
    return matchesTier && matchesSearch;
  });

  const trcnCertifiedCount = filteredStaff.filter(s => s.trcnStatus === 'certified').length;
  const activeStaffCount = filteredStaff.filter(s => s.status === 'active').length;

  const handleOpenAddModal = () => {
    setEditingStaff(null);
    const nextId = `STF/NG/2026/${Math.floor(100 + Math.random() * 900)}`;
    setStaffId(nextId);
    setName('');
    setRole('Senior Subject Teacher & Form Master');
    setTier(licenseConfig.unlockedTiers[0] || 'primary');
    setQualification('B.Ed (Hons) Science, NCE');
    setDepartmentOrClass('Academic Faculty');
    setAssignedSubjectsStr('Basic Science, Mathematics');
    setAssignedClassArm(classes[0]?.name || '');
    setTrcnNumber(`TRCN/FCT/2026/${Math.floor(1000 + Math.random() * 9000)}`);
    setTrcnStatus('certified');
    setEmploymentDate('2024-09-01');
    setSalaryGrade('GL 10');
    setPeriodsPerWeek(16);
    setEmail('');
    setPhone('+234 803 000 1122');
    setStatus('active');
    setShowModal(true);
  };

  const handleOpenEditModal = (st: StaffMember) => {
    setEditingStaff(st);
    setStaffId(st.staffId);
    setName(st.name);
    setRole(st.role);
    setTier(st.tier);
    setQualification(st.qualification);
    setDepartmentOrClass(st.departmentOrClass);
    setAssignedSubjectsStr(st.assignedSubjects.join(', '));
    setAssignedClassArm(st.assignedClassArm || '');
    setTrcnNumber(st.trcnNumber || '');
    setTrcnStatus(st.trcnStatus);
    setEmploymentDate(st.employmentDate || '2022-01-01');
    setSalaryGrade(st.salaryGrade || 'GL 10');
    setPeriodsPerWeek(st.periodsPerWeek || 16);
    setEmail(st.email);
    setPhone(st.phone);
    setStatus(st.status);
    setShowModal(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const subArray = assignedSubjectsStr.split(',').map(s => s.trim()).filter(Boolean);

    if (editingStaff) {
      updateStaff(editingStaff.id, {
        staffId,
        name,
        role,
        tier,
        qualification,
        departmentOrClass,
        assignedSubjects: subArray,
        assignedClassArm,
        trcnNumber,
        trcnStatus,
        employmentDate,
        salaryGrade,
        periodsPerWeek: Number(periodsPerWeek),
        email,
        phone,
        status
      });
    } else {
      addStaff({
        staffId,
        name,
        role,
        tier,
        qualification,
        departmentOrClass,
        assignedSubjects: subArray,
        assignedClassArm,
        trcnNumber,
        trcnStatus,
        employmentDate,
        salaryGrade,
        periodsPerWeek: Number(periodsPerWeek),
        officeJurisdiction: 'Office of the Registrar',
        email: email || `${name.toLowerCase().replace(/\s+/g, '.')}@apexroyal.edu.ng`,
        phone,
        status
      });
    }

    setShowModal(false);
  };

  return (
    <div className="space-y-6 font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Official Office Jurisdiction Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="p-2 rounded-xl bg-emerald-100 text-emerald-800">
              <Users className="w-5 h-5" />
            </span>
            <div>
              <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider block">
                Office of the Registrar & Directorate of Human Resources
              </span>
              <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                Academic & Administrative Staff Management
              </h1>
            </div>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Official staff register, TRCN licensing verification, teaching workloads, and form master deployment.
          </p>
        </div>

        <button
          onClick={handleOpenAddModal}
          className="px-4 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-xs flex items-center space-x-2 shadow-md shadow-emerald-700/20"
        >
          <Plus className="w-4 h-4" />
          <span>Onboard New Staff Member</span>
        </button>
      </div>

      {/* Staff KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Total Academic Staff
          </span>
          <div className="text-2xl font-black text-slate-900 mt-1">
            {filteredStaff.length} Faculty
          </div>
          <div className="text-[11px] text-emerald-600 font-semibold mt-1">
            {activeStaffCount} currently active on duty
          </div>
        </div>

        <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs font-semibold text-emerald-700 uppercase tracking-wider">
            TRCN Certified Ratio
          </span>
          <div className="text-2xl font-black text-emerald-700 mt-1">
            {trcnCertifiedCount} / {filteredStaff.length}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            Teachers Registration Council of Nigeria
          </div>
        </div>

        <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs font-semibold text-blue-700 uppercase tracking-wider">
            Average Weekly Workload
          </span>
          <div className="text-2xl font-black text-blue-700 mt-1">
            15.2 Periods/wk
          </div>
          <div className="text-[11px] text-blue-600 font-semibold mt-1">
            Complies with Federal Ministry Guidelines
          </div>
        </div>

        <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs font-semibold text-indigo-700 uppercase tracking-wider">
            Staff Retention Rate
          </span>
          <div className="text-2xl font-black text-indigo-700 mt-1">
            97.4%
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            Session 2026/2027 benchmark
          </div>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3.5 top-2.5 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search staff name, ID, qualification, TRCN..."
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-600"
          />
        </div>

        {/* Tier Filter */}
        <div className="flex items-center space-x-1.5 overflow-x-auto w-full sm:w-auto">
          <button
            onClick={() => setActiveTier('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              activeTier === 'all' 
                ? 'bg-slate-900 text-white' 
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            All Staff
          </button>
          {licenseConfig.unlockedTiers.map(t => (
            <button
              key={t}
              onClick={() => setActiveTier(t)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold capitalize whitespace-nowrap transition-all ${
                activeTier === t 
                  ? 'bg-emerald-700 text-white' 
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {t.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Staff Directory Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
              <tr>
                <th className="p-4">Staff Member / ID</th>
                <th className="p-4">Designation & Office</th>
                <th className="p-4">Academic Qualifications</th>
                <th className="p-4">TRCN Accreditation</th>
                <th className="p-4">Form Master / Teaching Load</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredStaff.map((st) => (
                <tr key={st.id} className="hover:bg-slate-50 transition-colors">
                  {/* Name & ID */}
                  <td className="p-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-800 font-extrabold flex items-center justify-center text-xs shrink-0">
                        {st.name.slice(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <div className="font-extrabold text-slate-900 text-sm">{st.name}</div>
                        <div className="text-[10px] font-mono text-slate-400 font-bold">{st.staffId}</div>
                      </div>
                    </div>
                  </td>

                  {/* Designation */}
                  <td className="p-4">
                    <div className="font-semibold text-slate-800">{st.role}</div>
                    <div className="text-[10px] text-slate-400">{st.departmentOrClass}</div>
                    <span className={`text-[9px] px-1.5 py-0.2 rounded font-bold uppercase inline-block mt-0.5 ${
                      st.tier === 'primary' 
                        ? 'bg-amber-100 text-amber-800' 
                        : st.tier === 'junior_sec' 
                          ? 'bg-cyan-100 text-cyan-800' 
                          : st.tier === 'senior_sec' 
                            ? 'bg-indigo-100 text-indigo-800' 
                            : 'bg-blue-100 text-blue-800'
                    }`}>
                      {st.tier.replace('_', ' ')}
                    </span>
                  </td>

                  {/* Qualifications */}
                  <td className="p-4">
                    <div className="font-semibold text-slate-700">{st.qualification}</div>
                    <div className="text-[10px] text-slate-400 mt-0.5">Salary Grade: <strong>{st.salaryGrade || 'GL 10'}</strong></div>
                  </td>

                  {/* TRCN Status */}
                  <td className="p-4">
                    {st.trcnStatus === 'certified' ? (
                      <div>
                        <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>TRCN CERTIFIED</span>
                        </span>
                        <div className="text-[10px] font-mono text-slate-400 mt-0.5">{st.trcnNumber}</div>
                      </div>
                    ) : st.trcnStatus === 'exempt' ? (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-600">
                        EXEMPT (TERTIARY/BURSAR)
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">
                        TRCN PENDING
                      </span>
                    )}
                  </td>

                  {/* Form Master & Load */}
                  <td className="p-4">
                    {st.assignedClassArm ? (
                      <div className="font-bold text-emerald-700 text-xs">
                        Form Master: {st.assignedClassArm}
                      </div>
                    ) : (
                      <span className="text-slate-400 text-[11px]">Subject Specialist</span>
                    )}
                    <div className="text-[10px] text-slate-500 mt-0.5">
                      {st.periodsPerWeek || 14} periods/wk • {st.assignedSubjects.join(', ')}
                    </div>
                  </td>

                  {/* Status */}
                  <td className="p-4">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                      st.status === 'active' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                    }`}>
                      {st.status.replace('_', ' ')}
                    </span>
                  </td>

                  {/* Actions */}
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end space-x-1.5">
                      <button
                        onClick={() => handleOpenEditModal(st)}
                        className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Edit Staff File"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => {
                          if (confirm(`Are you sure you want to remove ${st.name} from active faculty?`)) {
                            deleteStaff(st.id);
                          }
                        }}
                        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                        title="Deactivate Faculty"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ADD / EDIT STAFF MODAL */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="bg-white w-full max-w-xl rounded-3xl shadow-2xl overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95 max-h-[92vh] flex flex-col">
            <div className="px-6 py-4 bg-emerald-50 border-b border-emerald-100 flex items-center justify-between">
              <div className="flex items-center space-x-2 text-emerald-900">
                <Users className="w-5 h-5" />
                <h3 className="font-bold text-slate-900">
                  {editingStaff ? 'Update Staff Member Credentials' : 'Staff Onboarding & Registration Form'}
                </h3>
              </div>
              <button onClick={() => setShowModal(false)} className="text-slate-400 p-1">✕</button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs overflow-y-auto flex-1">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Staff Identity Number (ID)
                  </label>
                  <input
                    type="text"
                    required
                    value={staffId}
                    onChange={(e) => setStaffId(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-mono font-bold focus:ring-2 focus:ring-emerald-600"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Assigned Educational Wing
                  </label>
                  <select
                    value={tier}
                    onChange={(e) => setTier(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-emerald-600 font-semibold"
                  >
                    <option value="all">Institutional / All Wings</option>
                    {licenseConfig.unlockedTiers.map(t => (
                      <option key={t} value={t}>{t.replace('_', ' ').toUpperCase()}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Full Legal Name & Title
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Dr. Babatunde Balogun (NCE, B.Ed)"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold focus:ring-2 focus:ring-emerald-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Designation / Role
                  </label>
                  <input
                    type="text"
                    required
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-emerald-600"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Department / Unit
                  </label>
                  <input
                    type="text"
                    required
                    value={departmentOrClass}
                    onChange={(e) => setDepartmentOrClass(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-emerald-600"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Academic Qualifications (NCE, B.Ed, B.Sc, M.Ed, Ph.D, ICAN)
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. B.Ed English (Univ. of Ibadan), NCE"
                  value={qualification}
                  onChange={(e) => setQualification(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-emerald-600"
                />
              </div>

              {/* TRCN Block */}
              <div className="p-3.5 bg-emerald-50/60 rounded-2xl border border-emerald-100 space-y-2.5">
                <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-widest block">
                  Teachers Registration Council of Nigeria (TRCN) Accreditation
                </span>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 uppercase tracking-wider mb-1">
                      TRCN Registration Number
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. TRCN/LA/2021/04912"
                      value={trcnNumber}
                      onChange={(e) => setTrcnNumber(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-mono focus:ring-2 focus:ring-emerald-600 bg-white"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 uppercase tracking-wider mb-1">
                      Accreditation Status
                    </label>
                    <select
                      value={trcnStatus}
                      onChange={(e) => setTrcnStatus(e.target.value as any)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-emerald-600 bg-white font-semibold"
                    >
                      <option value="certified">TRCN Certified / Licensed</option>
                      <option value="pending">Registration Pending</option>
                      <option value="exempt">Exempt (Tertiary / Non-Teaching)</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Form Master for Class Arm
                  </label>
                  <select
                    value={assignedClassArm}
                    onChange={(e) => setAssignedClassArm(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-emerald-600 font-semibold"
                  >
                    <option value="">None (Subject Teacher Only)</option>
                    {classes.map(c => (
                      <option key={c.id} value={c.name}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Weekly Teaching Periods
                  </label>
                  <input
                    type="number"
                    min={2}
                    max={35}
                    value={periodsPerWeek}
                    onChange={(e) => setPeriodsPerWeek(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold focus:ring-2 focus:ring-emerald-600"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Assigned Subjects Taught (comma-separated)
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. General Mathematics, Further Mathematics"
                  value={assignedSubjectsStr}
                  onChange={(e) => setAssignedSubjectsStr(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-emerald-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Salary Grade Level
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. GL 10, GL 12, CONUASS 07"
                    value={salaryGrade}
                    onChange={(e) => setSalaryGrade(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-emerald-600 font-bold"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Official Contact Phone
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="+234 803 000 0000"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-emerald-600"
                  />
                </div>
              </div>

              <div className="pt-3 flex justify-end space-x-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-semibold shadow-md shadow-emerald-700/20"
                >
                  {editingStaff ? 'Save Credentials' : 'Enroll Staff to Register'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
