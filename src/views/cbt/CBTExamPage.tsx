'use client';
import React, { useState, useEffect } from 'react';
import { 
  MonitorPlay, 
  Clock, 
  Award, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  Plus, 
  RotateCcw, 
  Flag, 
  ChevronLeft, 
  ChevronRight,
  HelpCircle,
  FileCheck,
  UserCheck
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { CBTExam, CBTQuestion, CBTSubmission, EducationalTier } from '../../types';

export const CBTExamPage: React.FC = () => {
  const { 
    cbtExams, 
    cbtSubmissions, 
    submitCBTExam, 
    addCBTExam, 
    activeTier,
    currentUser 
  } = useApp();

  // Active Exam state
  const [selectedExam, setSelectedExam] = useState<CBTExam | null>(null);
  const [isTakingExam, setIsTakingExam] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [flaggedQuestions, setFlaggedQuestions] = useState<Record<number, boolean>>({});
  const [secondsRemaining, setSecondsRemaining] = useState(0);
  const [examFinished, setExamFinished] = useState(false);
  const [lastSubmission, setLastSubmission] = useState<CBTSubmission | null>(null);

  // New Exam Modal state
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newExamTitle, setNewExamTitle] = useState('');
  const [newExamSubject, setNewExamSubject] = useState('');
  const [newExamTier, setNewExamTier] = useState<EducationalTier>('senior_sec');
  const [newExamClass, setNewExamClass] = useState('SSS 3');
  const [newExamDuration, setNewExamDuration] = useState(15);

  // Filter exams by active tier if not 'all'
  const filteredExams = activeTier === 'all'
    ? cbtExams
    : cbtExams.filter(e => e.tier === activeTier);

  // Timer Effect
  useEffect(() => {
    let interval: any = null;
    if (isTakingExam && secondsRemaining > 0 && !examFinished) {
      interval = setInterval(() => {
        setSecondsRemaining(prev => {
          if (prev <= 1) {
            clearInterval(interval);
            handleAutoSubmit();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTakingExam, secondsRemaining, examFinished]);

  const handleStartExam = (exam: CBTExam) => {
    setSelectedExam(exam);
    setSelectedAnswers({});
    setFlaggedQuestions({});
    setCurrentQuestionIndex(0);
    setSecondsRemaining(exam.durationMinutes * 60);
    setExamFinished(false);
    setLastSubmission(null);
    setIsTakingExam(true);
  };

  const handleSelectOption = (questionIdx: number, optionIdx: number) => {
    setSelectedAnswers(prev => ({
      ...prev,
      [questionIdx]: optionIdx
    }));
  };

  const toggleFlag = (questionIdx: number) => {
    setFlaggedQuestions(prev => ({
      ...prev,
      [questionIdx]: !prev[questionIdx]
    }));
  };

  const handleAutoSubmit = () => {
    if (!selectedExam) return;
    submitAnswers();
  };

  const submitAnswers = () => {
    if (!selectedExam) return;

    let score = 0;
    selectedExam.questions.forEach((q, idx) => {
      if (selectedAnswers[idx] === q.correctOptionIndex) {
        score += q.marks;
      }
    });

    const percentage = Math.round((score / selectedExam.totalMarks) * 100);
    const passed = percentage >= selectedExam.passPercentage;

    const submission: Omit<CBTSubmission, 'id'> = {
      examId: selectedExam.id,
      examTitle: selectedExam.title,
      subject: selectedExam.subject,
      studentId: currentUser?.identifierId || 'STD-TEMP-01',
      studentName: currentUser?.name || 'Current Scholar',
      tier: selectedExam.tier,
      score,
      totalMarks: selectedExam.totalMarks,
      percentage,
      status: passed ? 'passed' : 'failed',
      submittedAt: new Date().toLocaleString(),
      answers: selectedAnswers
    };

    submitCBTExam(submission);
    setLastSubmission({ ...submission, id: `sub_${Date.now()}` });
    setExamFinished(true);
    setIsTakingExam(false);
  };

  const handleCreateExam = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newExamTitle.trim() || !newExamSubject.trim()) return;

    const dummyQuestions: CBTQuestion[] = [
      {
        id: `q_${Date.now()}_1`,
        questionText: `Sample Question 1 for ${newExamSubject}: Which principle applies best?`,
        options: ["Option Alpha", "Option Beta (Correct)", "Option Gamma", "Option Delta"],
        correctOptionIndex: 1,
        explanation: "Option Beta is the verified standard answer under the NERDC syllabus.",
        marks: 5
      },
      {
        id: `q_${Date.now()}_2`,
        questionText: `Sample Question 2 for ${newExamSubject}: Calculate the fundamental unit or factor.`,
        options: ["10.5 Units", "25.0 Units", "100 Units", "None of the above"],
        correctOptionIndex: 0,
        explanation: "10.5 Units derived from standard baseline calculation.",
        marks: 5
      }
    ];

    addCBTExam({
      title: newExamTitle,
      subject: newExamSubject,
      tier: newExamTier,
      classLevel: newExamClass,
      durationMinutes: Number(newExamDuration),
      totalMarks: 10,
      questionsCount: 2,
      status: 'active',
      passPercentage: 50,
      instructions: "Answer all questions within the allocated duration. Calculators permitted where applicable.",
      questions: dummyQuestions
    });

    setShowCreateModal(false);
    setNewExamTitle('');
    setNewExamSubject('');
  };

  const formatTime = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-6 font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="p-2 rounded-xl bg-purple-100 text-purple-700">
              <MonitorPlay className="w-5 h-5" />
            </span>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              Computer-Based Test (CBT) Portal
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            JAMB/WAEC/BECE and University CBT engine with real-time countdown, automatic marking, and instant result analysis.
          </p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="px-4 py-2.5 rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-semibold text-xs flex items-center space-x-2 shadow-md shadow-purple-700/20"
        >
          <Plus className="w-4 h-4" />
          <span>Create New CBT Test</span>
        </button>
      </div>

      {/* VIEW 1: ACTIVE EXAM SIMULATION ROOM */}
      {isTakingExam && selectedExam && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xl overflow-hidden animate-in fade-in duration-200">
          {/* Top Exam Status Bar */}
          <div className="px-6 py-4 bg-slate-900 text-white flex flex-wrap items-center justify-between gap-3 border-b border-slate-800">
            <div>
              <div className="text-xs text-purple-400 font-semibold uppercase tracking-wider">
                {selectedExam.subject} • {selectedExam.classLevel}
              </div>
              <h2 className="text-lg font-bold text-white">{selectedExam.title}</h2>
            </div>

            {/* Countdown Timer Widget */}
            <div className={`flex items-center space-x-2 px-4 py-2 rounded-xl border font-mono font-bold text-base ${
              secondsRemaining < 120 
                ? 'bg-rose-500/20 text-rose-300 border-rose-500/40 animate-pulse' 
                : 'bg-slate-800 text-emerald-400 border-slate-700'
            }`}>
              <Clock className="w-5 h-5" />
              <span>Time Left: {formatTime(secondsRemaining)}</span>
            </div>

            <button
              onClick={submitAnswers}
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-700/20"
            >
              Finish & Submit Test
            </button>
          </div>

          {/* Exam Body Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-4 divide-y lg:divide-y-0 lg:divide-x divide-slate-200">
            {/* Left: Question Viewer (3 Columns) */}
            <div className="lg:col-span-3 p-6 sm:p-8 flex flex-col justify-between min-h-[440px]">
              {selectedExam.questions[currentQuestionIndex] && (
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-500 bg-slate-100 px-3 py-1 rounded-lg">
                      Question {currentQuestionIndex + 1} of {selectedExam.questions.length}
                    </span>
                    <button
                      onClick={() => toggleFlag(currentQuestionIndex)}
                      className={`flex items-center space-x-1.5 text-xs font-semibold px-3 py-1 rounded-lg border transition-all ${
                        flaggedQuestions[currentQuestionIndex]
                          ? 'bg-amber-100 text-amber-800 border-amber-300'
                          : 'text-slate-500 border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      <Flag className="w-3.5 h-3.5" />
                      <span>{flaggedQuestions[currentQuestionIndex] ? 'Flagged for Review' : 'Flag Question'}</span>
                    </button>
                  </div>

                  <p className="text-base sm:text-lg font-semibold text-slate-800 leading-relaxed mb-6">
                    {selectedExam.questions[currentQuestionIndex].questionText}
                  </p>

                  {/* Options List */}
                  <div className="space-y-3">
                    {selectedExam.questions[currentQuestionIndex].options.map((option, optIdx) => {
                      const isSelected = selectedAnswers[currentQuestionIndex] === optIdx;
                      const letter = String.fromCharCode(65 + optIdx); // A, B, C, D
                      return (
                        <div
                          key={optIdx}
                          onClick={() => handleSelectOption(currentQuestionIndex, optIdx)}
                          className={`flex items-center p-3.5 rounded-xl border cursor-pointer transition-all ${
                            isSelected
                              ? 'bg-purple-50 border-purple-600 text-purple-900 shadow-xs ring-1 ring-purple-600'
                              : 'border-slate-200 hover:bg-slate-50 hover:border-slate-300'
                          }`}
                        >
                          <div className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs mr-3 shrink-0 ${
                            isSelected 
                              ? 'bg-purple-700 text-white' 
                              : 'bg-slate-100 text-slate-600'
                          }`}>
                            {letter}
                          </div>
                          <span className="text-sm font-medium">{option}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Bottom Nav Controls */}
              <div className="flex items-center justify-between pt-6 mt-6 border-t border-slate-100">
                <button
                  disabled={currentQuestionIndex === 0}
                  onClick={() => setCurrentQuestionIndex(prev => prev - 1)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50 disabled:opacity-40 flex items-center space-x-1"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Previous</span>
                </button>

                <div className="text-xs text-slate-400">
                  {Object.keys(selectedAnswers).length} of {selectedExam.questions.length} Answered
                </div>

                {currentQuestionIndex < selectedExam.questions.length - 1 ? (
                  <button
                    onClick={() => setCurrentQuestionIndex(prev => prev + 1)}
                    className="px-4 py-2 rounded-xl bg-purple-700 text-white text-xs font-semibold hover:bg-purple-800 flex items-center space-x-1"
                  >
                    <span>Next Question</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    onClick={submitAnswers}
                    className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold"
                  >
                    Submit Exam
                  </button>
                )}
              </div>
            </div>

            {/* Right: Question Pallette & Legend */}
            <div className="p-6 bg-slate-50">
              <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3">
                Question Navigation
              </h4>

              <div className="grid grid-cols-4 gap-2 mb-6">
                {selectedExam.questions.map((_, idx) => {
                  const isAnswered = selectedAnswers[idx] !== undefined;
                  const isFlagged = flaggedQuestions[idx];
                  const isCurrent = currentQuestionIndex === idx;

                  let btnStyle = 'bg-white text-slate-700 border-slate-200';
                  if (isCurrent) {
                    btnStyle = 'ring-2 ring-purple-600 bg-purple-100 text-purple-900 font-bold border-purple-400';
                  } else if (isFlagged) {
                    btnStyle = 'bg-amber-100 text-amber-900 border-amber-300 font-semibold';
                  } else if (isAnswered) {
                    btnStyle = 'bg-emerald-600 text-white border-emerald-700 font-semibold';
                  }

                  return (
                    <button
                      key={idx}
                      onClick={() => setCurrentQuestionIndex(idx)}
                      className={`h-9 rounded-lg border text-xs flex items-center justify-center transition-all ${btnStyle}`}
                    >
                      {idx + 1}
                    </button>
                  );
                })}
              </div>

              {/* Legend */}
              <div className="space-y-2 text-[11px] text-slate-600 border-t border-slate-200 pt-4">
                <div className="flex items-center space-x-2">
                  <span className="w-3 h-3 rounded bg-emerald-600"></span>
                  <span>Answered Question</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="w-3 h-3 rounded bg-amber-100 border border-amber-300"></span>
                  <span>Flagged for Review</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="w-3 h-3 rounded bg-white border border-slate-300"></span>
                  <span>Unanswered</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="w-3 h-3 rounded ring-2 ring-purple-600 bg-purple-100"></span>
                  <span>Current Question</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* VIEW 2: CBT EXAM RESULT SLIP */}
      {examFinished && lastSubmission && selectedExam && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xl p-6 sm:p-8 animate-in fade-in zoom-in-95">
          <div className="text-center max-w-lg mx-auto mb-8">
            <div className={`w-16 h-16 rounded-full mx-auto flex items-center justify-center mb-3 ${
              lastSubmission.status === 'passed' 
                ? 'bg-emerald-100 text-emerald-700' 
                : 'bg-rose-100 text-rose-700'
            }`}>
              {lastSubmission.status === 'passed' ? <CheckCircle2 className="w-9 h-9" /> : <XCircle className="w-9 h-9" />}
            </div>
            <h3 className="text-2xl font-extrabold text-slate-900">
              {lastSubmission.status === 'passed' ? 'CBT Examination Passed!' : 'Assessment Needs Improvement'}
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Official score record dispatched to student broadsheet and parent monitoring system.
            </p>

            <div className="mt-6 p-4 rounded-2xl bg-slate-50 border border-slate-200 grid grid-cols-3 gap-2 text-center">
              <div>
                <div className="text-xs text-slate-500">Score Achieved</div>
                <div className="text-xl font-black text-slate-900">{lastSubmission.score} / {lastSubmission.totalMarks}</div>
              </div>
              <div>
                <div className="text-xs text-slate-500">Percentage</div>
                <div className="text-xl font-black text-purple-700">{lastSubmission.percentage}%</div>
              </div>
              <div>
                <div className="text-xs text-slate-500">Verdict</div>
                <div className={`text-xs font-bold uppercase mt-1 px-2 py-0.5 rounded-full inline-block ${
                  lastSubmission.status === 'passed' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                }`}>
                  {lastSubmission.status}
                </div>
              </div>
            </div>
          </div>

          {/* Detailed Question Corrections Review */}
          <div className="border-t border-slate-200 pt-6">
            <h4 className="text-sm font-bold text-slate-900 mb-4 flex items-center space-x-2">
              <FileCheck className="w-4 h-4 text-emerald-600" />
              <span>Detailed Question Review & Corrections</span>
            </h4>

            <div className="space-y-4">
              {selectedExam.questions.map((q, idx) => {
                const studentAns = lastSubmission.answers[idx];
                const isCorrect = studentAns === q.correctOptionIndex;
                return (
                  <div key={q.id} className={`p-4 rounded-xl border ${isCorrect ? 'bg-emerald-50/30 border-emerald-200' : 'bg-rose-50/30 border-rose-200'}`}>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xs font-bold text-slate-700">Question {idx + 1}</span>
                      <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${isCorrect ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'}`}>
                        {isCorrect ? 'Correct (+5)' : 'Incorrect (0)'}
                      </span>
                    </div>
                    <p className="text-xs font-semibold text-slate-800 mb-2">{q.questionText}</p>
                    <div className="text-xs space-y-1">
                      <div className="text-slate-600">
                        Your Answer: <strong>{studentAns !== undefined ? q.options[studentAns] : 'None Selected'}</strong>
                      </div>
                      <div className="text-emerald-700">
                        Correct Answer: <strong>{q.options[q.correctOptionIndex]}</strong>
                      </div>
                      {q.explanation && (
                        <div className="text-[11px] text-slate-500 italic mt-1 bg-white/70 p-2 rounded border border-slate-200/60">
                          Explanation: {q.explanation}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => { setExamFinished(false); setSelectedExam(null); }}
                className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold"
              >
                Return to CBT Catalog
              </button>
            </div>
          </div>
        </div>
      )}

      {/* VIEW 3: CBT EXAMS LIST */}
      {!isTakingExam && !examFinished && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredExams.map((exam) => {
              const tierBadgeColors: Record<string, string> = {
                primary: 'bg-amber-100 text-amber-800 border-amber-200',
                junior_sec: 'bg-cyan-100 text-cyan-800 border-cyan-200',
                senior_sec: 'bg-indigo-100 text-indigo-800 border-indigo-200',
                tertiary: 'bg-blue-100 text-blue-800 border-blue-200',
                sub_program: 'bg-emerald-100 text-emerald-800 border-emerald-200'
              };

              return (
                <div 
                  key={exam.id} 
                  className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded border ${tierBadgeColors[exam.tier] || 'bg-slate-100 text-slate-700'}`}>
                        {exam.tier.replace('_', ' ')}
                      </span>
                      <span className="text-xs text-slate-500 flex items-center space-x-1 font-mono">
                        <Clock className="w-3.5 h-3.5" />
                        <span>{exam.durationMinutes} Mins</span>
                      </span>
                    </div>

                    <h3 className="text-sm font-bold text-slate-900 leading-snug">{exam.title}</h3>
                    <p className="text-xs text-slate-500 mt-1">{exam.subject} • {exam.classLevel}</p>

                    <div className="mt-4 p-3 bg-slate-50 rounded-xl text-xs space-y-1 text-slate-600 border border-slate-100">
                      <div className="flex justify-between">
                        <span>Total Questions:</span>
                        <strong className="text-slate-800">{exam.questions.length}</strong>
                      </div>
                      <div className="flex justify-between">
                        <span>Total Score:</span>
                        <strong className="text-slate-800">{exam.totalMarks} Marks</strong>
                      </div>
                      <div className="flex justify-between">
                        <span>Passing Benchmark:</span>
                        <strong className="text-slate-800">{exam.passPercentage}%</strong>
                      </div>
                    </div>
                  </div>

                  <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-[11px] text-emerald-700 font-semibold flex items-center space-x-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Ready for Testing</span>
                    </span>

                    <button
                      onClick={() => handleStartExam(exam)}
                      className="px-4 py-2 rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-semibold text-xs shadow-xs transition-all"
                    >
                      Begin CBT Exam
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Submissions Log Table */}
          {cbtSubmissions.length > 0 && (
            <div className="mt-8 bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
              <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center space-x-2">
                <Award className="w-4 h-4 text-purple-700" />
                <span>Recent CBT Student Submissions & Scores</span>
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
                    <tr>
                      <th className="p-3">Student Name</th>
                      <th className="p-3">CBT Examination</th>
                      <th className="p-3">Tier</th>
                      <th className="p-3">Score / Max</th>
                      <th className="p-3">Percentage</th>
                      <th className="p-3">Status</th>
                      <th className="p-3">Timestamp</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {cbtSubmissions.map((sub) => (
                      <tr key={sub.id} className="hover:bg-slate-50">
                        <td className="p-3 font-semibold text-slate-900">{sub.studentName}</td>
                        <td className="p-3 text-slate-700">{sub.examTitle}</td>
                        <td className="p-3 uppercase text-slate-500 text-[10px] font-bold">{sub.tier}</td>
                        <td className="p-3 font-mono font-bold text-slate-800">{sub.score} / {sub.totalMarks}</td>
                        <td className="p-3 font-bold text-purple-700">{sub.percentage}%</td>
                        <td className="p-3">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                            sub.status === 'passed' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                          }`}>
                            {sub.status}
                          </span>
                        </td>
                        <td className="p-3 text-slate-400">{sub.submittedAt}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* CREATE NEW CBT TEST MODAL */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95">
            <div className="px-6 py-4 bg-purple-50 border-b border-purple-100 flex items-center justify-between">
              <div className="flex items-center space-x-2 text-purple-800">
                <MonitorPlay className="w-5 h-5" />
                <h3 className="font-bold text-slate-900">Configure New CBT Examination</h3>
              </div>
              <button 
                onClick={() => setShowCreateModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateExam} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Exam Title
                </label>
                <input
                  type="text"
                  required
                  value={newExamTitle}
                  onChange={(e) => setNewExamTitle(e.target.value)}
                  placeholder="e.g. WAEC Mock: General Mathematics Paper 1"
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-purple-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Subject / Course
                  </label>
                  <input
                    type="text"
                    required
                    value={newExamSubject}
                    onChange={(e) => setNewExamSubject(e.target.value)}
                    placeholder="e.g. Mathematics"
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-purple-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Educational Tier
                  </label>
                  <select
                    value={newExamTier}
                    onChange={(e) => setNewExamTier(e.target.value as EducationalTier)}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-purple-600"
                  >
                    <option value="primary">Primary (Basic 1-6)</option>
                    <option value="junior_sec">Junior Secondary (JSS 1-3)</option>
                    <option value="senior_sec">Senior Secondary (SSS 1-3)</option>
                    <option value="tertiary">Tertiary / University</option>
                    <option value="sub_program">Sub-Programs (IJMB/Dipl)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Class / Level
                  </label>
                  <input
                    type="text"
                    value={newExamClass}
                    onChange={(e) => setNewExamClass(e.target.value)}
                    placeholder="e.g. JSS 3 or 300 Level"
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-purple-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Duration (Minutes)
                  </label>
                  <input
                    type="number"
                    min="5"
                    max="180"
                    value={newExamDuration}
                    onChange={(e) => setNewExamDuration(Number(e.target.value))}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-purple-600"
                  />
                </div>
              </div>

              <div className="pt-3 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-semibold text-xs shadow-md shadow-purple-700/20"
                >
                  Save & Publish CBT Exam
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
