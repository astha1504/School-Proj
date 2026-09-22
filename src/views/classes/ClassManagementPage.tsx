'use client';

import React, { useState } from 'react';
import { 
  Building2, 
  Users, 
  Plus, 
  Search, 
  UserCheck, 
  DoorClosed, 
  Sparkles, 
  CheckCircle2, 
  Edit3, 
  Trash2, 
  GraduationCap, 
  Layers, 
  CalendarCheck,
  Coins,
  ArrowUpRight,
  ShieldCheck,
  Eye,
  AlertCircle
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { ClassArm, EducationalTier } from '../../types';

export const ClassManagementPage: React.FC = () => {
  const { 
    classes, 
    addClass, 
    updateClass, 
    deleteClass, 
    staff, 
    students, 
    activeTier, 
    setActiveTier, 
    licenseConfig 
  } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedClassForRoster, setSelectedClassForRoster] = useState<ClassArm | null>(null);
  const [editingClass, setEditingClass] = useState<ClassArm | null>(null);

  // Form State for Add/Edit
  const [name, setName] = useState('');
  const [tier, setTier] = useState<EducationalTier>('primary');
  const [gradeLevel, setGradeLevel] = useState('Basic 5');
  const [armOrStream, setArmOrStream] = useState('Gold');
  const [capacity, setCapacity] = useState(35);
  const [formTeacherId, setFormTeacherId] = useState('');
  const [classroomBlock, setClassroomBlock] = useState('Primary Block A, Room 201');
  const [classPrefect, setClassPrefect] = useState('');

  // Filter classes according to activeTier and search term
  const filteredClasses = classes.filter(c => {
    // Only show if tier is unlocked by GetoCore Central Admin
    const isUnlocked = licenseConfig.unlockedTiers.includes(c.tier);
    if (!isUnlocked) return false;

    const matchesTier = activeTier === 'all' ? true : c.tier === activeTier;
    const matchesSearch = `${c.name} ${c.gradeLevel} ${c.formTeacherName} ${c.classroomBlock}`.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesTier && matchesSearch;
  });

  const totalCapacity = filteredClasses.reduce((a, b) => a + b.capacity, 0);
  const totalEnrolled = filteredClasses.reduce((a, b) => a + b.enrolledCount, 0);
  const avgUtilization = totalCapacity > 0 ? Math.round((totalEnrolled / totalCapacity) * 100) : 0;

  const handleOpenAddModal = () => {
    setEditingClass(null);
    setName('Basic 5 Emerald');
    setTier(licenseConfig.unlockedTiers[0] || 'primary');
    setGradeLevel('Basic 5');
    setArmOrStream('Emerald');
    setCapacity(35);
    setFormTeacherId(staff[0]?.id || '');
    setClassroomBlock('Academic Block B, Room 204');
    setClassPrefect('');
    setShowAddModal(true);
  };

  const handleOpenEditModal = (c: ClassArm) => {
    setEditingClass(c);
    setName(c.name);
    setTier(c.tier);
    setGradeLevel(c.gradeLevel);
    setArmOrStream(c.armOrStream);
    setCapacity(c.capacity);
    setFormTeacherId(c.formTeacherId || '');
    setClassroomBlock(c.classroomBlock);
    setClassPrefect(c.classPrefect || '');
    setShowAddModal(true);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const assignedStaff = staff.find(s => s.id === formTeacherId) || staff[0];

    if (editingClass) {
      updateClass(editingClass.id, {
        name,
        tier,
        gradeLevel,
        armOrStream,
        capacity: Number(capacity),
        formTeacherId: assignedStaff ? assignedStaff.id : '',
        formTeacherName: assignedStaff ? assignedStaff.name : 'Unassigned',
        classroomBlock,
        classPrefect
      });
    } else {
      addClass({
        name,
        tier,
        gradeLevel,
        armOrStream,
        capacity: Number(capacity),
        enrolledCount: 0,
        formTeacherId: assignedStaff ? assignedStaff.id : '',
        formTeacherName: assignedStaff ? assignedStaff.name : 'Unassigned',
        classroomBlock,
        classPrefect,
        status: 'active'
      });
    }
    setShowAddModal(false);
  };

  // Get students enrolled in a specific class
  const classStudents = selectedClassForRoster 
    ? students.filter(s => s.classOrDept.includes(selectedClassForRoster.gradeLevel) || s.armOrStream?.includes(selectedClassForRoster.armOrStream))
    : [];

  return (
    <div className="space-y-6 font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Official Office Jurisdiction Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="p-2 rounded-xl bg-blue-100 text-blue-800">
              <Building2 className="w-5 h-5" />
            </span>
            <div>
              <span className="text-[10px] font-bold text-blue-800 uppercase tracking-wider block">
                Office of the Vice Principal (Administration) & Academic Registry
              </span>
              <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                Class Structure & Form Master Management
              </h1>
            </div>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Maintain classroom arm allocations, form master assignments, capacity quotas, and class student registers.
          </p>
        </div>

        <button
          onClick={handleOpenAddModal}
          className="px-4 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-xs flex items-center space-x-2 shadow-md shadow-emerald-700/20"
        >
          <Plus className="w-4 h-4" />
          <span>Create New Class Arm</span>
        </button>
      </div>

      {/* Class Statistics KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Total Active Arms
          </span>
          <div className="text-2xl font-black text-slate-900 mt-1">
            {filteredClasses.length} Arms
          </div>
          <div className="text-[11px] text-emerald-600 font-semibold mt-1">
            Across licensed educational tiers
          </div>
        </div>

        <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs font-semibold text-blue-700 uppercase tracking-wider">
            Enrolled Students
          </span>
          <div className="text-2xl font-black text-blue-700 mt-1">
            {totalEnrolled} Pupils / Students
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            Total Capacity: {totalCapacity} desks
          </div>
        </div>

        <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs font-semibold text-emerald-700 uppercase tracking-wider">
            Average Utilization
          </span>
          <div className="text-2xl font-black text-emerald-700 mt-1">
            {avgUtilization}% Full
          </div>
          <div className="w-full bg-slate-100 rounded-full h-1.5 mt-2 overflow-hidden">
            <div 
              className="bg-emerald-600 h-full rounded-full" 
              style={{ width: `${Math.min(100, avgUtilization)}%` }}
            />
          </div>
        </div>

        <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs font-semibold text-indigo-700 uppercase tracking-wider">
            Form Masters Deployed
          </span>
          <div className="text-2xl font-black text-indigo-700 mt-1">
            {filteredClasses.length} Masters
          </div>
          <div className="text-[11px] text-indigo-600 font-semibold mt-1">
            100% Class Teacher Coverage
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3.5 top-2.5 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search class arm, teacher, hall..."
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-600"
          />
        </div>

        {/* Tier Filter Buttons */}
        <div className="flex items-center space-x-1.5 overflow-x-auto w-full sm:w-auto">
          <button
            onClick={() => setActiveTier('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              activeTier === 'all' 
                ? 'bg-slate-900 text-white' 
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            All Tiers
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

      {/* Class Arms Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredClasses.map((c) => {
          const fillPercentage = Math.round((c.enrolledCount / c.capacity) * 100);
          return (
            <div 
              key={c.id} 
              className="bg-white rounded-3xl border border-slate-200 shadow-xs p-5 space-y-4 hover:border-slate-300 transition-all flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                      c.tier === 'primary' 
                        ? 'bg-amber-100 text-amber-800' 
                        : c.tier === 'junior_sec' 
                          ? 'bg-cyan-100 text-cyan-800' 
                          : c.tier === 'senior_sec' 
                            ? 'bg-indigo-100 text-indigo-800' 
                            : 'bg-blue-100 text-blue-800'
                    }`}>
                      {c.tier.replace('_', ' ')}
                    </span>
                    <h3 className="text-base font-extrabold text-slate-900 mt-1">
                      {c.name}
                    </h3>
                  </div>

                  <div className="flex items-center space-x-1">
                    <button
                      onClick={() => handleOpenEditModal(c)}
                      title="Edit Class Particulars"
                      className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => {
                        if (confirm(`Are you sure you want to delete ${c.name}?`)) {
                          deleteClass(c.id);
                        }
                      }}
                      title="Archive Class Arm"
                      className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Form Teacher Information */}
                <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 flex items-center space-x-3">
                  <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center shrink-0 text-xs">
                    {c.formTeacherName ? c.formTeacherName.slice(0, 2).toUpperCase() : 'FT'}
                  </div>
                  <div className="min-w-0 flex-1">
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
                      Form Master / Mistress
                    </span>
                    <div className="text-xs font-bold text-slate-900 truncate">
                      {c.formTeacherName || 'Unassigned'}
                    </div>
                  </div>
                </div>

                {/* Hall & Prefect Details */}
                <div className="space-y-1.5 text-xs">
                  <div className="flex items-center justify-between text-slate-600">
                    <span className="flex items-center space-x-1.5 text-[11px] text-slate-400">
                      <DoorClosed className="w-3.5 h-3.5" />
                      <span>Classroom Location:</span>
                    </span>
                    <span className="font-semibold text-slate-800 truncate max-w-[170px]">{c.classroomBlock}</span>
                  </div>

                  {c.classPrefect && (
                    <div className="flex items-center justify-between text-slate-600">
                      <span className="flex items-center space-x-1.5 text-[11px] text-slate-400">
                        <UserCheck className="w-3.5 h-3.5" />
                        <span>Class Prefect:</span>
                      </span>
                      <span className="font-semibold text-emerald-700">{c.classPrefect}</span>
                    </div>
                  )}
                </div>

                {/* Capacity Gauge */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-500 text-[11px]">Enrollment Capacity:</span>
                    <span className="font-bold text-slate-900">
                      {c.enrolledCount} / {c.capacity} Desks ({fillPercentage}%)
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                    <div 
                      className={`h-full rounded-full transition-all ${
                        fillPercentage >= 95 ? 'bg-rose-500' : fillPercentage >= 80 ? 'bg-amber-500' : 'bg-emerald-600'
                      }`}
                      style={{ width: `${Math.min(100, fillPercentage)}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <button
                  onClick={() => setSelectedClassForRoster(c)}
                  className="w-full py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center justify-center space-x-1.5 transition-colors"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>View Student Register</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* STUDENT ROSTER MODAL */}
      {selectedClassForRoster && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95 max-h-[90vh] flex flex-col">
            <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest block">
                  Official Class Register
                </span>
                <h3 className="text-lg font-black">{selectedClassForRoster.name}</h3>
              </div>
              <button 
                onClick={() => setSelectedClassForRoster(null)}
                className="text-slate-400 hover:text-white p-1"
              >
                ✕
              </button>
            </div>

            <div className="p-4 bg-slate-50 border-b border-slate-200 grid grid-cols-3 gap-2 text-xs">
              <div>
                <span className="text-slate-400 block text-[10px]">Form Master:</span>
                <strong className="text-slate-900">{selectedClassForRoster.formTeacherName}</strong>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">Classroom Hall:</span>
                <strong className="text-slate-900">{selectedClassForRoster.classroomBlock}</strong>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">Total Enrolled:</span>
                <strong className="text-emerald-700">{selectedClassForRoster.enrolledCount} Students</strong>
              </div>
            </div>

            <div className="p-6 overflow-y-auto space-y-3 flex-1">
              <h4 className="text-xs font-bold uppercase text-slate-500 tracking-wider">
                Enrolled Scholars & Fee Standing
              </h4>

              {classStudents.length === 0 ? (
                <div className="p-8 text-center text-slate-400 text-xs">
                  No students currently tagged to this specific arm. You can admit or transfer students into this arm via the Student Directory.
                </div>
              ) : (
                <div className="divide-y divide-slate-100 border border-slate-200 rounded-2xl overflow-hidden">
                  {classStudents.map(s => (
                    <div key={s.id} className="p-3.5 flex items-center justify-between text-xs hover:bg-slate-50">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center text-xs">
                          {s.firstName[0]}{s.lastName[0]}
                        </div>
                        <div>
                          <div className="font-bold text-slate-900">{s.firstName} {s.lastName}</div>
                          <div className="text-[10px] text-slate-400 font-mono">{s.admissionNo} • {s.gender}</div>
                        </div>
                      </div>

                      <div className="flex items-center space-x-3 text-right">
                        <div>
                          <span className="text-[10px] text-slate-400 block">Attendance</span>
                          <strong className="text-slate-800 font-mono">{s.attendanceRate}%</strong>
                        </div>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                          s.feeStatus === 'paid' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                        }`}>
                          {s.feeStatus === 'paid' ? 'Clear' : 'Owing'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end">
              <button
                onClick={() => setSelectedClassForRoster(null)}
                className="px-5 py-2 rounded-xl bg-slate-900 text-white font-semibold text-xs"
              >
                Close Register
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ADD / EDIT CLASS MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95">
            <div className="px-6 py-4 bg-blue-50 border-b border-blue-100 flex items-center justify-between">
              <div className="flex items-center space-x-2 text-blue-900">
                <Building2 className="w-5 h-5" />
                <h3 className="font-bold text-slate-900">
                  {editingClass ? 'Edit Class Arm Particulars' : 'Create New Class Arm'}
                </h3>
              </div>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 p-1">✕</button>
            </div>

            <form onSubmit={handleFormSubmit} className="p-6 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Educational Tier
                  </label>
                  <select
                    value={tier}
                    onChange={(e) => setTier(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-emerald-600 font-semibold"
                  >
                    {licenseConfig.unlockedTiers.map(t => (
                      <option key={t} value={t}>{t.replace('_', ' ').toUpperCase()}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Grade Level
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Basic 5, JSS 2, SSS 3"
                    value={gradeLevel}
                    onChange={(e) => setGradeLevel(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-emerald-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Arm / Stream Title
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Gold, Arm A, Science Stream"
                    value={armOrStream}
                    onChange={(e) => setArmOrStream(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-emerald-600"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Desk Capacity
                  </label>
                  <input
                    type="number"
                    required
                    min={10}
                    max={100}
                    value={capacity}
                    onChange={(e) => setCapacity(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-emerald-600 font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Full Display Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Basic 5 Gold, JSS 2 Arm A"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-emerald-600 font-bold text-slate-900"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Assign Form Master / Mistress
                </label>
                <select
                  value={formTeacherId}
                  onChange={(e) => setFormTeacherId(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-emerald-600 font-semibold"
                >
                  {staff.map(st => (
                    <option key={st.id} value={st.id}>
                      {st.name} ({st.role} • {st.qualification})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Classroom Location / Block
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Block A, Room 102"
                    value={classroomBlock}
                    onChange={(e) => setClassroomBlock(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-emerald-600"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Class Prefect / Captain
                  </label>
                  <input
                    type="text"
                    placeholder="Student Name"
                    value={classPrefect}
                    onChange={(e) => setClassPrefect(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-emerald-600"
                  />
                </div>
              </div>

              <div className="pt-3 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-blue-700 hover:bg-blue-800 text-white font-semibold shadow-md shadow-blue-700/20"
                >
                  {editingClass ? 'Save Changes' : 'Create Class Arm'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
