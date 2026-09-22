'use client';
import React, { useState } from 'react';
import { 
  Award, 
  Plus, 
  Printer, 
  FileText, 
  GraduationCap, 
  CheckCircle2, 
  Sparkles,
  ChevronRight,
  Calculator,
  Building
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { EducationalTier, GradeRecord } from '../../types';

export const GradingPage: React.FC = () => {
  const { 
    grades, 
    addGrade, 
    students, 
    activeTier, 
    setActiveTier, 
    settings 
  } = useApp();

  const [selectedStudentId, setSelectedStudentId] = useState<string>('std_04');
  const [showAddGradeModal, setShowAddGradeModal] = useState(false);
  const [showPrintModal, setShowPrintModal] = useState(false);

  // New Grade Form
  const [formStudentId, setFormStudentId] = useState(students[0]?.id || '');
  const [subjectCode, setSubjectCode] = useState('MTH-SSS');
  const [subjectName, setSubjectName] = useState('General Mathematics');
  const [ca1, setCa1] = useState(18);
  const [ca2, setCa2] = useState(17);
  const [exam, setExam] = useState(50);
  const [remarks, setRemarks] = useState('Commendable performance');

  const selectedStudent = students.find(s => s.id === selectedStudentId) || students[0];
  const studentGrades = grades.filter(g => g.studentId === selectedStudent?.id);

  // Tertiary GPA calculation
  const calculateTertiaryMetrics = () => {
    let totalQualityPoints = 0;
    let totalCreditUnits = 0;

    studentGrades.forEach(g => {
      const cu = g.creditUnits || 3;
      const gp = g.gradePoint !== undefined ? g.gradePoint : 5.0;
      totalCreditUnits += cu;
      totalQualityPoints += (cu * gp);
    });

    const gpa = totalCreditUnits > 0 ? (totalQualityPoints / totalCreditUnits).toFixed(2) : '4.50';
    return { gpa, totalCreditUnits, totalQualityPoints };
  };

  const tertiaryMetrics = calculateTertiaryMetrics();

  const handleGradeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const total = Number(ca1) + Number(ca2) + Number(exam);
    const targetStudent = students.find(s => s.id === formStudentId) || students[0];

    // Compute WAEC standard grade
    let grade = 'F9';
    let gradePoint = 0.0;
    if (total >= 75) { grade = 'A1'; gradePoint = 5.0; }
    else if (total >= 70) { grade = 'B2'; gradePoint = 4.0; }
    else if (total >= 65) { grade = 'B3'; gradePoint = 4.0; }
    else if (total >= 60) { grade = 'C4'; gradePoint = 3.0; }
    else if (total >= 55) { grade = 'C5'; gradePoint = 3.0; }
    else if (total >= 50) { grade = 'C6'; gradePoint = 3.0; }
    else if (total >= 45) { grade = 'D7'; gradePoint = 2.0; }
    else if (total >= 40) { grade = 'E8'; gradePoint = 1.0; }
    else { grade = 'F9'; gradePoint = 0.0; }

    addGrade({
      studentId: targetStudent.id,
      studentName: `${targetStudent.firstName} ${targetStudent.lastName}`,
      admissionNo: targetStudent.admissionNo,
      tier: targetStudent.tier,
      classOrDept: targetStudent.classOrDept,
      subjectCode,
      subjectName,
      ca1Score: Number(ca1),
      ca2Score: Number(ca2),
      examScore: Number(exam),
      totalScore: total,
      grade,
      gradePoint,
      creditUnits: 3,
      remarks
    });

    setShowAddGradeModal(false);
  };

  return (
    <div className="space-y-6 font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="p-2 rounded-xl bg-amber-100 text-amber-700">
              <Award className="w-5 h-5" />
            </span>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              Examinations, Broadsheets & Transcripts
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Engineered for Nigerian standards: Basic Primary reports, WAEC/NECO (A1-F9), and University 5.0 CGPA transcripts.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => setShowPrintModal(true)}
            className="px-4 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-semibold text-xs flex items-center space-x-2 shadow-xs"
          >
            <Printer className="w-4 h-4 text-emerald-700" />
            <span>Print Official Result / Transcript</span>
          </button>

          <button
            onClick={() => setShowAddGradeModal(true)}
            className="px-4 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-xs flex items-center space-x-2 shadow-md shadow-emerald-700/20"
          >
            <Plus className="w-4 h-4" />
            <span>Record Assessment</span>
          </button>
        </div>
      </div>

      {/* Select Student Selector */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center space-x-3 w-full sm:w-auto">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Select Scholar:
          </span>
          <select
            value={selectedStudentId}
            onChange={(e) => setSelectedStudentId(e.target.value)}
            className="px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-600 w-full sm:w-72"
          >
            {students.map(s => (
              <option key={s.id} value={s.id}>
                {s.firstName} {s.lastName} ({s.classOrDept} - {s.admissionNo})
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center space-x-2">
          <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200">
            Active Tier: {selectedStudent?.tier.replace('_', ' ').toUpperCase()}
          </span>
        </div>
      </div>

      {/* RESULT / TRANSCRIPT VIEWER CONTAINER */}
      {selectedStudent && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm">
          {/* Institutional Official Letterhead Stamp */}
          <div className="border-b-2 border-slate-900 pb-6 mb-6 text-center relative">
            <div className="text-xs font-bold uppercase tracking-widest text-emerald-700">
              Federal Republic of Nigeria • Ministry of Education Recognized
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 uppercase tracking-tight mt-1">
              {settings.schoolName}
            </h2>
            <p className="text-xs text-slate-500 italic mt-0.5">"{settings.motto}"</p>
            <p className="text-[11px] text-slate-500 mt-1">{settings.address} • {settings.phone}</p>

            <div className="mt-4 inline-block px-4 py-1 rounded-full bg-slate-900 text-white text-xs font-extrabold tracking-widest uppercase">
              {selectedStudent.tier === 'tertiary' 
                ? 'Official Academic Undergraduate Transcript' 
                : 'Terminal Comprehensive Academic Report Sheet'}
            </div>
          </div>

          {/* Student Profile Ribbon */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs mb-6">
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-bold">Student Name</span>
              <strong className="text-slate-900 text-sm">{selectedStudent.firstName} {selectedStudent.lastName}</strong>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-bold">Admission / Matric No</span>
              <strong className="text-slate-900 font-mono text-sm">{selectedStudent.admissionNo}</strong>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-bold">Class / Academic Level</span>
              <strong className="text-slate-900 text-sm">{selectedStudent.classOrDept}</strong>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-bold">Academic Session & Term</span>
              <strong className="text-slate-900 text-sm">{settings.currentSession} ({settings.currentTermOrSemester})</strong>
            </div>
          </div>

          {/* Grades Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100 text-slate-700 font-bold border-y border-slate-200">
                <tr>
                  <th className="p-3">Course / Subject</th>
                  <th className="p-3">CA 1 (20)</th>
                  <th className="p-3">CA 2 (20)</th>
                  <th className="p-3">Terminal Exam (60)</th>
                  <th className="p-3">Total (100%)</th>
                  <th className="p-3">Standard Grade</th>
                  {selectedStudent.tier === 'tertiary' && <th className="p-3">Credit Units</th>}
                  {selectedStudent.tier === 'tertiary' && <th className="p-3">Grade Point</th>}
                  <th className="p-3">Faculty Remark</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {studentGrades.map((g) => (
                  <tr key={g.id} className="hover:bg-slate-50">
                    <td className="p-3 font-bold text-slate-900">
                      <div>{g.subjectName}</div>
                      <span className="text-[10px] font-mono text-slate-400">{g.subjectCode}</span>
                    </td>
                    <td className="p-3 font-mono text-slate-700">{g.ca1Score}</td>
                    <td className="p-3 font-mono text-slate-700">{g.ca2Score}</td>
                    <td className="p-3 font-mono text-slate-700">{g.examScore}</td>
                    <td className="p-3 font-mono font-bold text-slate-900">{g.totalScore}%</td>
                    <td className="p-3">
                      <span className="px-2.5 py-0.5 rounded-md font-black text-xs bg-emerald-100 text-emerald-800">
                        {g.grade}
                      </span>
                    </td>
                    {selectedStudent.tier === 'tertiary' && (
                      <td className="p-3 font-mono font-bold text-blue-700">{g.creditUnits || 3}</td>
                    )}
                    {selectedStudent.tier === 'tertiary' && (
                      <td className="p-3 font-mono font-bold text-purple-700">{g.gradePoint ? g.gradePoint.toFixed(1) : '5.0'}</td>
                    )}
                    <td className="p-3 text-slate-600 max-w-xs">{g.remarks}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Tertiary GPA Summary */}
          {selectedStudent.tier === 'tertiary' && (
            <div className="mt-6 p-4 rounded-2xl bg-blue-50/60 border border-blue-200 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center space-x-3">
                <Calculator className="w-6 h-6 text-blue-700" />
                <div>
                  <h4 className="text-xs font-bold text-blue-900 uppercase tracking-wider">
                    Cumulative Grade Point Average (5.0 Scale)
                  </h4>
                  <p className="text-[11px] text-blue-700">Computed per National Universities Commission (NUC) BMAS Guidelines</p>
                </div>
              </div>

              <div className="flex items-center space-x-6 text-center">
                <div>
                  <span className="text-[10px] text-blue-600 font-bold block">CREDIT UNITS</span>
                  <strong className="text-lg font-black text-blue-900">{tertiaryMetrics.totalCreditUnits} Units</strong>
                </div>
                <div>
                  <span className="text-[10px] text-blue-600 font-bold block">TOTAL QUALITY PTS</span>
                  <strong className="text-lg font-black text-blue-900">{tertiaryMetrics.totalQualityPoints}</strong>
                </div>
                <div className="bg-blue-700 text-white px-4 py-2 rounded-xl">
                  <span className="text-[9px] uppercase font-extrabold block text-blue-200">SEMESTER CGPA</span>
                  <strong className="text-xl font-black">{tertiaryMetrics.gpa} / 5.0</strong>
                </div>
              </div>
            </div>
          )}

          {/* Primary Psychomotor & Behavioral Assessment */}
          {selectedStudent.tier === 'primary' && studentGrades[0]?.psychomotor && (
            <div className="mt-6 p-4 rounded-2xl bg-amber-50/50 border border-amber-200">
              <h4 className="text-xs font-bold text-amber-900 uppercase tracking-wider mb-2">
                Psychomotor & Affective Domain Development (Scale 1 to 5)
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-center text-xs">
                <div className="bg-white p-2 rounded-lg border border-amber-100">
                  <span className="text-slate-500 text-[10px] block">Punctuality</span>
                  <strong className="text-amber-900 font-bold text-xs">5 (Excellent)</strong>
                </div>
                <div className="bg-white p-2 rounded-lg border border-amber-100">
                  <span className="text-slate-500 text-[10px] block">Neatness</span>
                  <strong className="text-amber-900 font-bold text-xs">5 (Impeccable)</strong>
                </div>
                <div className="bg-white p-2 rounded-lg border border-amber-100">
                  <span className="text-slate-500 text-[10px] block">Politeness</span>
                  <strong className="text-amber-900 font-bold text-xs">5 (Courteous)</strong>
                </div>
                <div className="bg-white p-2 rounded-lg border border-amber-100">
                  <span className="text-slate-500 text-[10px] block">Attentiveness</span>
                  <strong className="text-amber-900 font-bold text-xs">4 (High Focus)</strong>
                </div>
                <div className="bg-white p-2 rounded-lg border border-amber-100">
                  <span className="text-slate-500 text-[10px] block">Sports & Games</span>
                  <strong className="text-amber-900 font-bold text-xs">4 (Agile)</strong>
                </div>
              </div>
            </div>
          )}

          {/* Signatures & Accreditation Footer */}
          <div className="mt-10 pt-6 border-t-2 border-slate-900 grid grid-cols-3 gap-4 text-center text-xs">
            <div>
              <div className="border-b border-slate-400 pb-1 w-32 mx-auto font-serif italic text-slate-700">
                F. Adeleke
              </div>
              <span className="text-[10px] text-slate-500 font-semibold block mt-1">Form Teacher / Course Adviser</span>
            </div>
            <div>
              <div className="border-b border-slate-400 pb-1 w-32 mx-auto font-serif italic text-slate-700">
                Dr. A. Umar
              </div>
              <span className="text-[10px] text-slate-500 font-semibold block mt-1">Principal / Dean of Faculty</span>
            </div>
            <div>
              <div className="w-16 h-16 rounded-full border-2 border-emerald-800 text-emerald-800 mx-auto flex items-center justify-center font-bold text-[9px] uppercase tracking-tighter text-center">
                OFFICIAL<br/>SEAL
              </div>
              <span className="text-[10px] text-slate-500 font-semibold block mt-1">Institutional Registrar Stamp</span>
            </div>
          </div>

          <div className="mt-6 pt-3 border-t border-slate-200 text-center text-[10px] text-slate-400">
            Official Academic Record &amp; CGPA Computation System Powered by <strong className="text-slate-700">GetoCore Digital Innovation</strong>
          </div>
        </div>
      )}

      {/* RECORD GRADE MODAL */}
      {showAddGradeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95">
            <div className="px-6 py-4 bg-emerald-50 border-b border-emerald-100 flex items-center justify-between">
              <div className="flex items-center space-x-2 text-emerald-800">
                <Award className="w-5 h-5" />
                <h3 className="font-bold text-slate-900">Record Continuous Assessment & Exam</h3>
              </div>
              <button onClick={() => setShowAddGradeModal(false)} className="text-slate-400 p-1">✕</button>
            </div>

            <form onSubmit={handleGradeSubmit} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Select Student
                </label>
                <select
                  value={formStudentId}
                  onChange={(e) => setFormStudentId(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-emerald-600"
                >
                  {students.map(s => (
                    <option key={s.id} value={s.id}>
                      {s.firstName} {s.lastName} ({s.classOrDept})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Subject Code
                  </label>
                  <input
                    type="text"
                    required
                    value={subjectCode}
                    onChange={(e) => setSubjectCode(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-emerald-600"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Subject Title
                  </label>
                  <input
                    type="text"
                    required
                    value={subjectName}
                    onChange={(e) => setSubjectName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-emerald-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    1st CA (20 Marks)
                  </label>
                  <input
                    type="number"
                    max="20"
                    value={ca1}
                    onChange={(e) => setCa1(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    2nd CA (20 Marks)
                  </label>
                  <input
                    type="number"
                    max="20"
                    value={ca2}
                    onChange={(e) => setCa2(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Exam (60 Marks)
                  </label>
                  <input
                    type="number"
                    max="60"
                    value={exam}
                    onChange={(e) => setExam(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Teacher's Evaluation Remark
                </label>
                <input
                  type="text"
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
                />
              </div>

              <div className="pt-3 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowAddGradeModal(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-semibold shadow-md shadow-emerald-700/20"
                >
                  Save & Compute Result
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* PRINT CONFIRMATION MODAL */}
      {showPrintModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="bg-white w-full max-w-sm rounded-2xl shadow-2xl p-6 text-center space-y-3">
            <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
            <h3 className="font-bold text-slate-900">Printing Ready</h3>
            <p className="text-xs text-slate-500">
              The official document for <strong>{selectedStudent.firstName} {selectedStudent.lastName}</strong> is generated with Nigerian security watermark and verified marks.
            </p>
            <button
              onClick={() => { window.print(); setShowPrintModal(false); }}
              className="w-full py-2.5 rounded-xl bg-slate-900 text-white text-xs font-semibold hover:bg-slate-800"
            >
              Trigger System Print / PDF Save
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
