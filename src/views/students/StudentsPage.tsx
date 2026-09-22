'use client';

import React, { useState } from 'react';
import { 
  Users, 
  Search, 
  Plus, 
  Filter, 
  GraduationCap, 
  Eye, 
  Trash2, 
  Download, 
  CheckCircle2, 
  AlertCircle,
  Award
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { EducationalTier, Student } from '../../types';
import { StudentProfileModal } from './StudentProfileModal';

export const StudentsPage: React.FC = () => {
  const { 
    students, 
    addStudent, 
    deleteStudent, 
    activeTier, 
    setActiveTier,
    setActivePage 
  } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);

  // New Student Form State
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [gender, setGender] = useState<'Male' | 'Female'>('Male');
  const [dob, setDob] = useState('2014-06-15');
  const [tier, setTier] = useState<EducationalTier>('senior_sec');
  const [classOrDept, setClassOrDept] = useState('SSS 1 (Science)');
  const [armOrStream, setArmOrStream] = useState('Arm A');
  const [stateOfOrigin, setStateOfOrigin] = useState('Lagos State');
  const [guardianName, setGuardianName] = useState('');
  const [guardianPhone, setGuardianPhone] = useState('');
  const [guardianEmail, setGuardianEmail] = useState('');
  const [initialTuition, setInitialTuition] = useState(120000);

  // Filter students based on activeTier and searchTerm
  const filtered = students.filter(s => {
    const matchesTier = activeTier === 'all' ? true : s.tier === activeTier;
    const matchesSearch = 
      `${s.firstName} ${s.lastName} ${s.admissionNo} ${s.classOrDept}`.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesTier && matchesSearch;
  });

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstName.trim() || !lastName.trim() || !guardianName.trim()) return;

    const prefixMap: Record<EducationalTier, string> = {
      primary: 'EDU/PRI/2026',
      junior_sec: 'JSS/26',
      senior_sec: 'SSS/26',
      tertiary: 'APX/2026/UNI',
      sub_program: 'SUB/26'
    };

    const newAdmissionNo = `${prefixMap[tier]}/${Math.floor(100 + Math.random() * 900)}`;

    addStudent({
      admissionNo: newAdmissionNo,
      firstName,
      lastName,
      gender,
      dob,
      tier,
      classOrDept,
      armOrStream,
      stateOfOrigin,
      guardianName,
      guardianPhone: guardianPhone || '+234 800 000 0000',
      guardianEmail: guardianEmail || `${firstName.toLowerCase()}@guardian.ng`,
      feeStatus: 'partial',
      feeBalance: initialTuition,
      termAverage: 80.0,
      attendanceRate: 95,
      status: 'active',
      avatarUrl: `https://images.unsplash.com/photo-${gender === 'Male' ? '1500648767791-00dcc994a43e' : '1534528741775-53994a69daeb'}?w=150&auto=format&fit=crop&q=80`
    });

    setShowAddModal(false);
    setFirstName('');
    setLastName('');
    setGuardianName('');
  };

  const handleViewProfile = (student: Student) => {
    setSelectedStudent(student);
    setShowProfileModal(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="p-2 rounded-xl bg-[#123B63]/10 text-[#123B63]">
              <Users className="w-5 h-5 text-[#123B63]" />
            </span>
            <h1 className="font-poppins font-semibold text-[28px] text-[#123B63] tracking-tight">
              Student Information System (SIS)
            </h1>
          </div>
          <p className="font-inter font-normal text-[14px] text-[#6B7280] mt-1">
            Centralized registry for Primary Pupils, JSS Scholars, SSS Candidates, Undergraduates, and Trainees.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2.5 rounded-xl bg-[#1E5A8A] hover:bg-[#123B63] text-white font-poppins font-medium text-[14px] flex items-center space-x-2 shadow-md transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Admit New Student</span>
        </button>
      </div>

      {/* Tier Filter Tabs */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-1">
        {[
          { key: 'all', label: 'All Students' },
          { key: 'primary', label: 'Primary (Basic 1-6)' },
          { key: 'junior_sec', label: 'Junior Secondary (JSS)' },
          { key: 'senior_sec', label: 'Senior Secondary (SSS)' },
          { key: 'tertiary', label: 'Tertiary (100L-500L)' },
          { key: 'sub_program', label: 'Sub-Programs (IJMB/Dipl)' }
        ].map(t => (
          <button
            key={t.key}
            onClick={() => setActiveTier(t.key as any)}
            className={`px-3.5 py-1.5 rounded-xl font-poppins font-medium text-[14px] whitespace-nowrap transition-all ${
              activeTier === t.key
                ? 'bg-[#123B63] text-white shadow-xs'
                : 'bg-white text-[#6B7280] border border-[#E5E7EB] hover:bg-[#F5F7FA]'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Search Bar & Stats */}
      <div className="bg-white p-4 rounded-2xl border border-[#E5E7EB] shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3.5 top-3 text-[#6B7280]" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by name, ID, or class..."
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-[#E5E7EB] font-inter font-normal text-[14px] focus:outline-none focus:ring-2 focus:ring-[#1E5A8A] bg-white text-[#1F2937]"
          />
        </div>

        <div className="font-inter font-normal text-[14px] text-[#6B7280] flex items-center space-x-2">
          <span>Showing <strong className="font-inter font-semibold text-[#1F2937]">{filtered.length}</strong> of <strong className="font-inter font-semibold text-[#1F2937]">{students.length}</strong> scholars</span>
        </div>
      </div>

      {/* Students Table */}
      <div className="bg-white rounded-2xl border border-[#E5E7EB] shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left font-inter font-normal text-[14px]">
            <thead className="bg-[#123B63] text-white font-poppins font-semibold text-[14px] border-b border-[#0B2D4D]">
              <tr>
                <th className="p-3.5">Student / Admission No</th>
                <th className="p-3.5">Educational Wing</th>
                <th className="p-3.5">Class / Department</th>
                <th className="p-3.5">Guardian & State</th>
                <th className="p-3.5">Performance</th>
                <th className="p-3.5">Fee Status (₦)</th>
                <th className="p-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5E7EB]">
              {filtered.map((s) => {
                return (
                  <tr key={s.id} className="hover:bg-[#F5F7FA] transition-colors">
                    <td className="p-3.5">
                      <div className="flex items-center space-x-3">
                        <div className="w-9 h-9 rounded-xl overflow-hidden bg-[#F5F7FA] ring-1 ring-[#E5E7EB] shrink-0">
                          {s.avatarUrl ? (
                            <img src={s.avatarUrl} alt={s.firstName} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center font-poppins font-semibold text-[#123B63]">
                              {s.firstName[0]}
                            </div>
                          )}
                        </div>
                        <div>
                          <div className="font-poppins font-semibold text-[14px] text-[#1F2937]">{s.firstName} {s.lastName}</div>
                          <div className="font-inter font-normal text-[12px] text-[#6B7280]">{s.admissionNo}</div>
                        </div>
                      </div>
                    </td>

                    <td className="p-3.5">
                      <span className="px-2 py-0.5 rounded-full font-inter font-semibold text-[12px] uppercase border bg-[#123B63]/10 text-[#123B63] border-[#123B63]/20">
                        {s.tier.replace('_', ' ')}
                      </span>
                    </td>

                    <td className="p-3.5">
                      <div className="font-inter font-semibold text-[14px] text-[#1F2937]">{s.classOrDept}</div>
                      <div className="font-inter font-normal text-[12px] text-[#6B7280]">{s.armOrStream || 'Standard'}</div>
                    </td>

                    <td className="p-3.5">
                      <div className="font-inter font-normal text-[14px] text-[#1F2937]">{s.guardianName}</div>
                      <div className="font-inter font-normal text-[12px] text-[#6B7280]">{s.stateOfOrigin || 'Nigeria'}</div>
                    </td>

                    <td className="p-3.5">
                      <div className="font-inter font-semibold text-[14px] text-[#1F2937]">
                        {s.termAverage ? `${s.termAverage}%` : s.cgpa ? `${s.cgpa} CGPA` : 'N/A'}
                      </div>
                      <div className="font-inter font-medium text-[12px] text-[#2E7D32]">{s.attendanceRate}% Attd.</div>
                    </td>

                    <td className="p-3.5">
                      <div className="flex items-center space-x-1.5">
                        {s.feeBalance === 0 ? (
                          <span className="text-[#2E7D32] font-inter font-semibold text-[14px] flex items-center space-x-1">
                            <CheckCircle2 className="w-4 h-4" />
                            <span>Paid</span>
                          </span>
                        ) : (
                          <span className="text-[#C62828] font-inter font-semibold text-[14px] flex items-center space-x-1">
                            <AlertCircle className="w-4 h-4" />
                            <span>₦{s.feeBalance.toLocaleString()}</span>
                          </span>
                        )}
                      </div>
                    </td>

                    <td className="p-3.5 text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          onClick={() => handleViewProfile(s)}
                          title="View Student File"
                          className="p-1.5 rounded-lg text-[#6B7280] hover:text-[#1E5A8A] hover:bg-[#F5F7FA]"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setActivePage('grading')}
                          title="View Grades & Report"
                          className="p-1.5 rounded-lg text-[#6B7280] hover:text-[#123B63] hover:bg-[#F5F7FA]"
                        >
                          <Award className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => deleteStudent(s.id)}
                          title="Archive / Remove"
                          className="p-1.5 rounded-lg text-[#6B7280] hover:text-[#C62828] hover:bg-[#FCECEC]"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* ADMIT NEW STUDENT MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0B2D4D]/60 backdrop-blur-sm p-4">
          <div className="bg-white w-full max-w-xl rounded-3xl shadow-2xl overflow-hidden border border-[#E5E7EB]">
            <div className="px-6 py-4 bg-[#123B63] text-white flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <GraduationCap className="w-5 h-5 text-[#F59E0B]" />
                <h3 className="font-poppins font-semibold text-[16px] text-white">Student Admission & Enrollment Portal</h3>
              </div>
              <button 
                onClick={() => setShowAddModal(false)}
                className="text-white/70 hover:text-white p-1 rounded-lg"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto font-inter font-normal text-[14px]">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-inter font-medium text-[14px] text-[#1F2937] mb-1">
                    First Name
                  </label>
                  <input
                    type="text"
                    required
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="e.g. Somto"
                    className="w-full px-3 py-2 rounded-xl border border-[#E5E7EB] font-inter font-normal text-[14px] focus:outline-none focus:ring-2 focus:ring-[#1E5A8A] bg-white text-[#1F2937]"
                  />
                </div>
                <div>
                  <label className="block font-inter font-medium text-[14px] text-[#1F2937] mb-1">
                    Last / Surname
                  </label>
                  <input
                    type="text"
                    required
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="e.g. Okonkwo"
                    className="w-full px-3 py-2 rounded-xl border border-[#E5E7EB] font-inter font-normal text-[14px] focus:outline-none focus:ring-2 focus:ring-[#1E5A8A] bg-white text-[#1F2937]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-inter font-medium text-[14px] text-[#1F2937] mb-1">
                    Gender
                  </label>
                  <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl border border-[#E5E7EB] font-inter font-normal text-[14px] focus:outline-none focus:ring-2 focus:ring-[#1E5A8A] bg-white text-[#1F2937]"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                </div>

                <div>
                  <label className="block font-inter font-medium text-[14px] text-[#1F2937] mb-1">
                    Educational Wing
                  </label>
                  <select
                    value={tier}
                    onChange={(e) => setTier(e.target.value as EducationalTier)}
                    className="w-full px-3 py-2 rounded-xl border border-[#E5E7EB] font-inter font-normal text-[14px] focus:outline-none focus:ring-2 focus:ring-[#1E5A8A] bg-white text-[#1F2937]"
                  >
                    <option value="primary">Primary (Basic 1-6)</option>
                    <option value="junior_sec">Junior Secondary (JSS 1-3)</option>
                    <option value="senior_sec">Senior Secondary (SSS 1-3)</option>
                    <option value="tertiary">Tertiary / University</option>
                    <option value="sub_program">Sub-Programs (IJMB)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-inter font-medium text-[14px] text-[#1F2937] mb-1">
                    State of Origin
                  </label>
                  <input
                    type="text"
                    value={stateOfOrigin}
                    onChange={(e) => setStateOfOrigin(e.target.value)}
                    placeholder="e.g. Ogun State"
                    className="w-full px-3 py-2 rounded-xl border border-[#E5E7EB] font-inter font-normal text-[14px] focus:outline-none focus:ring-2 focus:ring-[#1E5A8A] bg-white text-[#1F2937]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-inter font-medium text-[14px] text-[#1F2937] mb-1">
                    Class or Department
                  </label>
                  <input
                    type="text"
                    required
                    value={classOrDept}
                    onChange={(e) => setClassOrDept(e.target.value)}
                    placeholder="e.g. SSS 2 or Computer Science"
                    className="w-full px-3 py-2 rounded-xl border border-[#E5E7EB] font-inter font-normal text-[14px] focus:outline-none focus:ring-2 focus:ring-[#1E5A8A] bg-white text-[#1F2937]"
                  />
                </div>

                <div>
                  <label className="block font-inter font-medium text-[14px] text-[#1F2937] mb-1">
                    Arm / Stream
                  </label>
                  <input
                    type="text"
                    value={armOrStream}
                    onChange={(e) => setArmOrStream(e.target.value)}
                    placeholder="e.g. Science Arm A or 200 Level"
                    className="w-full px-3 py-2 rounded-xl border border-[#E5E7EB] font-inter font-normal text-[14px] focus:outline-none focus:ring-2 focus:ring-[#1E5A8A] bg-white text-[#1F2937]"
                  />
                </div>
              </div>

              {/* Guardian Section */}
              <div className="border-t border-[#E5E7EB] pt-3">
                <span className="block font-poppins font-semibold text-[14px] text-[#123B63] mb-2">Guardian / Parent Contact Details</span>
                <div className="space-y-3">
                  <div>
                    <label className="block font-inter font-normal text-[12px] text-[#6B7280] mb-1">Guardian Full Name</label>
                    <input
                      type="text"
                      required
                      value={guardianName}
                      onChange={(e) => setGuardianName(e.target.value)}
                      placeholder="e.g. Chief Emeka Okonkwo"
                      className="w-full px-3 py-2 rounded-xl border border-[#E5E7EB] font-inter font-normal text-[14px] focus:outline-none focus:ring-2 focus:ring-[#1E5A8A] bg-white text-[#1F2937]"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-inter font-normal text-[12px] text-[#6B7280] mb-1">Phone Number (Nigeria)</label>
                      <input
                        type="text"
                        value={guardianPhone}
                        onChange={(e) => setGuardianPhone(e.target.value)}
                        placeholder="+234 803 000 1122"
                        className="w-full px-3 py-2 rounded-xl border border-[#E5E7EB] font-inter font-normal text-[14px] focus:outline-none focus:ring-2 focus:ring-[#1E5A8A] bg-white text-[#1F2937]"
                      />
                    </div>
                    <div>
                      <label className="block font-inter font-normal text-[12px] text-[#6B7280] mb-1">Initial Tuition Billed (₦)</label>
                      <input
                        type="number"
                        value={initialTuition}
                        onChange={(e) => setInitialTuition(Number(e.target.value))}
                        className="w-full px-3 py-2 rounded-xl border border-[#E5E7EB] font-inter font-semibold text-[14px] focus:outline-none focus:ring-2 focus:ring-[#1E5A8A] bg-white text-[#1F2937]"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-3 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl text-[#6B7280] hover:bg-[#F5F7FA] font-poppins font-medium text-[14px]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#1E5A8A] hover:bg-[#123B63] text-white font-poppins font-medium text-[14px] shadow-md transition-all"
                >
                  Generate Admission & Enroll
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Student Profile Modal */}
      <StudentProfileModal
        student={selectedStudent}
        isOpen={showProfileModal}
        onClose={() => setShowProfileModal(false)}
      />
    </div>
  );
};
