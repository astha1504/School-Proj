'use client';

import React, { useState } from 'react';
import { 
  BookOpen, 
  Layers, 
  Plus, 
  Building2, 
  Award, 
  Calendar, 
  GraduationCap, 
  CheckCircle2,
  Clock,
  UserCheck,
  Search,
  Edit3,
  Trash2,
  FileText,
  BookmarkCheck,
  Printer
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { SubjectOrCourse, EducationalTier } from '../../types';

export const AcademicsPage: React.FC = () => {
  const { 
    subjects, 
    addSubject, 
    updateSubject, 
    deleteSubject, 
    staff, 
    activeTier, 
    setActiveTier, 
    settings, 
    licenseConfig 
  } = useApp();

  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingSubject, setEditingSubject] = useState<SubjectOrCourse | null>(null);

  // Form Fields
  const [code, setCode] = useState('');
  const [name, setName] = useState('');
  const [tier, setTier] = useState<EducationalTier>('primary');
  const [level, setLevel] = useState('Basic 1 - 6');
  const [category, setCategory] = useState<'Core' | 'Science' | 'Arts' | 'Commercial' | 'Vocational' | 'General'>('Core');
  const [periodsPerWeek, setPeriodsPerWeek] = useState(5);
  const [creditUnits, setCreditUnits] = useState(3);
  const [assignedTeacherId, setAssignedTeacherId] = useState('');
  const [syllabusOutline, setSyllabusOutline] = useState('');

  const filteredSubjects = subjects.filter(sub => {
    // Hide if tier is locked by GetoCore Central Admin
    if (!licenseConfig.unlockedTiers.includes(sub.tier)) {
      return false;
    }
    const matchesTier = activeTier === 'all' ? true : sub.tier === activeTier;
    const matchesCat = selectedCategory === 'All' ? true : sub.category === selectedCategory;
    const matchesSearch = `${sub.code} ${sub.name} ${sub.level} ${sub.teacherName || ''} ${sub.category || ''}`
      .toLowerCase().includes(searchTerm.toLowerCase());
    return matchesTier && matchesCat && matchesSearch;
  });

  const totalPeriods = filteredSubjects.reduce((a, b) => a + (b.periodsPerWeek || 4), 0);
  const coreCount = filteredSubjects.filter(s => s.category === 'Core').length;
  const scienceCount = filteredSubjects.filter(s => s.category === 'Science').length;

  const handleOpenAddModal = () => {
    setEditingSubject(null);
    setCode('AGR-JSS-01');
    setName('Agricultural Science & Practicals');
    setTier(licenseConfig.unlockedTiers[0] || 'primary');
    setLevel('JSS 1 - 3');
    setCategory('Science');
    setPeriodsPerWeek(4);
    setCreditUnits(3);
    setAssignedTeacherId(staff[0]?.id || '');
    setSyllabusOutline('NERDC Curriculum: Crop production, soil science, farm tools, animal husbandry, and weekly school farm practicals.');
    setShowModal(true);
  };

  const handleOpenEditModal = (sub: SubjectOrCourse) => {
    setEditingSubject(sub);
    setCode(sub.code);
    setName(sub.name);
    setTier(sub.tier);
    setLevel(sub.level);
    setCategory(sub.category || 'Core');
    setPeriodsPerWeek(sub.periodsPerWeek || 4);
    setCreditUnits(sub.creditUnits || 3);
    setAssignedTeacherId(sub.assignedTeacherId || staff[0]?.id || '');
    setSyllabusOutline(sub.syllabusOutline || '');
    setShowModal(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const assignedStaff = staff.find(s => s.id === assignedTeacherId) || staff[0];

    if (editingSubject) {
      updateSubject(editingSubject.id, {
        code,
        name,
        tier,
        level,
        category,
        periodsPerWeek: Number(periodsPerWeek),
        creditUnits: tier === 'tertiary' ? Number(creditUnits) : undefined,
        assignedTeacherId: assignedStaff.id,
        teacherName: assignedStaff.name,
        syllabusOutline,
        approvedByOffice: "Office of the Vice Principal (Academics)"
      });
    } else {
      addSubject({
        code,
        name,
        tier,
        level,
        category,
        periodsPerWeek: Number(periodsPerWeek),
        creditUnits: tier === 'tertiary' ? Number(creditUnits) : undefined,
        assignedTeacherId: assignedStaff.id,
        teacherName: assignedStaff.name,
        syllabusOutline,
        approvedByOffice: "Office of the Vice Principal (Academics)",
        status: 'active'
      });
    }

    setShowModal(false);
  };

  return (
    <div className="space-y-6 font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Official Jurisdiction Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="p-2 rounded-xl bg-indigo-100 text-indigo-800">
              <BookOpen className="w-5 h-5" />
            </span>
            <div>
              <span className="text-[10px] font-bold text-indigo-800 uppercase tracking-wider block">
                Office of the Vice Principal (Academic Affairs) & Curriculum Board
              </span>
              <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                Subject Management & Academic Curricula
              </h1>
            </div>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            NERDC syllabi, WAEC/NECO subject groupings, weekly period allocations, and assigned specialist teachers.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={handleOpenAddModal}
            className="px-4 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-xs flex items-center space-x-2 shadow-md shadow-emerald-700/20"
          >
            <Plus className="w-4 h-4" />
            <span>Create New Subject</span>
          </button>
        </div>
      </div>

      {/* Curriculum KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Active Subjects & Courses
          </span>
          <div className="text-2xl font-black text-slate-900 mt-1">
            {filteredSubjects.length} Courses
          </div>
          <div className="text-[11px] text-emerald-600 font-semibold mt-1">
            Approved NERDC / WAEC Scheme
          </div>
        </div>

        <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs font-semibold text-indigo-700 uppercase tracking-wider">
            Core Compulsory Subjects
          </span>
          <div className="text-2xl font-black text-indigo-700 mt-1">
            {coreCount} Core Subjects
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            English, Maths & Foundations
          </div>
        </div>

        <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs font-semibold text-blue-700 uppercase tracking-wider">
            Science & Tech Practicals
          </span>
          <div className="text-2xl font-black text-blue-700 mt-1">
            {scienceCount} Lab Subjects
          </div>
          <div className="text-[11px] text-blue-600 font-semibold mt-1">
            With dedicated laboratory sessions
          </div>
        </div>

        <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs font-semibold text-emerald-700 uppercase tracking-wider">
            Total Weekly Teaching Load
          </span>
          <div className="text-2xl font-black text-emerald-700 mt-1">
            {totalPeriods} Periods/wk
          </div>
          <div className="text-[11px] text-emerald-600 font-semibold mt-1">
            Timetabled across all school arms
          </div>
        </div>
      </div>

      {/* Tier Filter Tabs */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-1">
        <button
          onClick={() => setActiveTier('all')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
            activeTier === 'all'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          All Curricula ({subjects.length})
        </button>

        {licenseConfig.unlockedTiers.map(t => (
          <button
            key={t}
            onClick={() => setActiveTier(t)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold capitalize whitespace-nowrap transition-all ${
              activeTier === t
                ? 'bg-emerald-700 text-white shadow-xs'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            {t === 'primary' ? 'Primary Wing (Basic 1-6)'
              : t === 'junior_sec' ? 'Junior Secondary (BECE)'
              : t === 'senior_sec' ? 'Senior Secondary (WAEC/NECO)'
              : t === 'tertiary' ? 'Tertiary (Faculties & Units)'
              : 'Sub-Programs (IJMB/Dipl)'}
          </button>
        ))}
      </div>

      {/* Search & Category Filter Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3.5 top-2.5 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search subject code, title, teacher..."
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-600"
          />
        </div>

        {/* Category Pills */}
        <div className="flex items-center space-x-1.5 overflow-x-auto w-full sm:w-auto">
          {['All', 'Core', 'Science', 'Commercial', 'Arts', 'General'].map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                selectedCategory === cat 
                  ? 'bg-indigo-600 text-white shadow-xs' 
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Subjects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredSubjects.map((sub) => (
          <div 
            key={sub.id} 
            className="bg-white rounded-3xl border border-slate-200 shadow-xs p-5 space-y-3.5 hover:border-slate-300 transition-all flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-mono text-xs font-extrabold text-indigo-700 bg-indigo-50 px-2.5 py-0.5 rounded-md border border-indigo-200">
                      {sub.code}
                    </span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                      sub.category === 'Core' ? 'bg-slate-900 text-white' :
                      sub.category === 'Science' ? 'bg-emerald-100 text-emerald-800' :
                      sub.category === 'Commercial' ? 'bg-amber-100 text-amber-800' :
                      'bg-purple-100 text-purple-800'
                    }`}>
                      {sub.category || 'General'}
                    </span>
                  </div>

                  <h3 className="font-bold text-slate-900 text-sm mt-1.5">
                    {sub.name}
                  </h3>
                </div>

                <div className="flex items-center space-x-1">
                  <button
                    onClick={() => handleOpenEditModal(sub)}
                    className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    title="Edit Subject"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => {
                      if (confirm(`Delete ${sub.name} (${sub.code}) from curriculum?`)) {
                        deleteSubject(sub.id);
                      }
                    }}
                    className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                    title="Remove Subject"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Syllabus Outline */}
              <p className="text-xs text-slate-600 leading-relaxed bg-slate-50/80 p-3 rounded-xl border border-slate-100">
                {sub.syllabusOutline || 'Approved NERDC / WAEC scheme of work covering termly continuous assessments and exam objectives.'}
              </p>

              {/* Teacher & Workload */}
              <div className="space-y-1.5 text-xs">
                <div className="flex items-center justify-between text-slate-600">
                  <span className="flex items-center space-x-1.5 text-[11px] text-slate-400">
                    <UserCheck className="w-3.5 h-3.5" />
                    <span>Specialist Teacher:</span>
                  </span>
                  <span className="font-bold text-slate-800">{sub.teacherName || 'Unassigned'}</span>
                </div>

                <div className="flex items-center justify-between text-slate-600">
                  <span className="flex items-center space-x-1.5 text-[11px] text-slate-400">
                    <Clock className="w-3.5 h-3.5" />
                    <span>Weekly Allocation:</span>
                  </span>
                  <span className="font-bold text-emerald-700">
                    {sub.periodsPerWeek || 4} Periods / Week
                    {sub.creditUnits && ` • ${sub.creditUnits} Credit Units`}
                  </span>
                </div>
              </div>
            </div>

            {/* Footer Authority Stamp */}
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400">
              <span className="flex items-center space-x-1 text-emerald-700 font-semibold">
                <BookmarkCheck className="w-3 h-3" />
                <span>NERDC Approved</span>
              </span>
              <span>{sub.approvedByOffice || 'VP Academics'}</span>
            </div>
          </div>
        ))}
      </div>

      {/* ADD / EDIT SUBJECT MODAL */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95 max-h-[92vh] flex flex-col">
            <div className="px-6 py-4 bg-indigo-50 border-b border-indigo-100 flex items-center justify-between">
              <div className="flex items-center space-x-2 text-indigo-900">
                <BookOpen className="w-5 h-5" />
                <h3 className="font-bold text-slate-900">
                  {editingSubject ? 'Edit Subject Curricula' : 'Register New Subject in Curriculum'}
                </h3>
              </div>
              <button onClick={() => setShowModal(false)} className="text-slate-400 p-1">✕</button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs overflow-y-auto flex-1">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Subject Code
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. MTH-PRI, PHY-SSS, CSC 301"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-mono font-bold focus:ring-2 focus:ring-emerald-600"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Educational Wing
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
              </div>

              <div>
                <label className="block font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Subject / Course Full Title
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Agricultural Science & Practicals"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold focus:ring-2 focus:ring-emerald-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Applicable Classes / Level
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Basic 1 - 6, JSS 1 - 3, SSS 1 - 3"
                    value={level}
                    onChange={(e) => setLevel(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-emerald-600"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Classification Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-emerald-600 font-semibold"
                  >
                    <option value="Core">Core Compulsory</option>
                    <option value="Science">Pure / Basic Science</option>
                    <option value="Commercial">Commercial & Financial</option>
                    <option value="Arts">Arts & Humanities</option>
                    <option value="Vocational">Vocational & Technical</option>
                    <option value="General">General Studies</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Weekly Periods Allocated
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={12}
                    value={periodsPerWeek}
                    onChange={(e) => setPeriodsPerWeek(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold focus:ring-2 focus:ring-emerald-600"
                  />
                </div>

                {tier === 'tertiary' ? (
                  <div>
                    <label className="block font-semibold text-slate-700 uppercase tracking-wider mb-1">
                      Credit Units (CU)
                    </label>
                    <input
                      type="number"
                      min={1}
                      max={6}
                      value={creditUnits}
                      onChange={(e) => setCreditUnits(Number(e.target.value))}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold focus:ring-2 focus:ring-emerald-600"
                    />
                  </div>
                ) : (
                  <div>
                    <label className="block font-semibold text-slate-700 uppercase tracking-wider mb-1">
                      Target Exam
                    </label>
                    <div className="px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-600">
                      {tier === 'primary' ? 'National Common Entrance' : tier === 'junior_sec' ? 'BECE / Junior WAEC' : 'WAEC / NECO Senior'}
                    </div>
                  </div>
                )}
              </div>

              <div>
                <label className="block font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Assign Specialist Subject Teacher
                </label>
                <select
                  value={assignedTeacherId}
                  onChange={(e) => setAssignedTeacherId(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-emerald-600 font-semibold"
                >
                  {staff.map(st => (
                    <option key={st.id} value={st.id}>
                      {st.name} ({st.role} • {st.qualification})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Scheme of Work & Syllabus Scope
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="Outline topics, weekly breakdown, and terminal competencies..."
                  value={syllabusOutline}
                  onChange={(e) => setSyllabusOutline(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-emerald-600"
                />
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
                  className="px-5 py-2 rounded-xl bg-indigo-700 hover:bg-indigo-800 text-white font-semibold shadow-md shadow-indigo-700/20"
                >
                  {editingSubject ? 'Save Changes' : 'Add Subject to Scheme'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
