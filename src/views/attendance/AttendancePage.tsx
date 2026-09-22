'use client';
import React, { useState } from 'react';
import { 
  CalendarCheck, 
  Check, 
  X, 
  Clock, 
  AlertTriangle, 
  Users, 
  Calendar,
  Save,
  CheckCircle2
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const AttendancePage: React.FC = () => {
  const { students, activeTier, settings } = useApp();
  const [selectedDate, setSelectedDate] = useState<string>('2026-09-11');
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Filter students based on activeTier
  const filteredStudents = activeTier === 'all'
    ? students
    : students.filter(s => s.tier === activeTier);

  // Attendance status mapping for the day
  const [attendanceMap, setAttendanceMap] = useState<Record<string, 'present' | 'absent' | 'late' | 'excused'>>(() => {
    const map: Record<string, 'present' | 'absent' | 'late' | 'excused'> = {};
    students.forEach((s, idx) => {
      map[s.id] = idx === 1 ? 'late' : (idx === 3 ? 'absent' : 'present');
    });
    return map;
  });

  const setStatus = (studentId: string, status: 'present' | 'absent' | 'late' | 'excused') => {
    setAttendanceMap(prev => ({
      ...prev,
      [studentId]: status
    }));
  };

  const handleSaveAttendance = () => {
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  const presentCount = Object.values(attendanceMap).filter(v => v === 'present').length;
  const absentCount = Object.values(attendanceMap).filter(v => v === 'absent').length;
  const lateCount = Object.values(attendanceMap).filter(v => v === 'late').length;

  return (
    <div className="space-y-6 font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="p-2 rounded-xl bg-teal-100 text-teal-700">
              <CalendarCheck className="w-5 h-5" />
            </span>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              Daily Roll-Call & Lecture Attendance
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Tracking punctuality and roll-call records for basic, secondary, and tertiary cohorts.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold bg-white focus:outline-none focus:ring-2 focus:ring-emerald-600"
          />
          <button
            onClick={handleSaveAttendance}
            className="px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-xs flex items-center space-x-1.5 shadow-md shadow-emerald-700/20"
          >
            <Save className="w-4 h-4" />
            <span>Save Attendance Register</span>
          </button>
        </div>
      </div>

      {savedSuccess && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs font-semibold text-emerald-800 flex items-center space-x-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4" />
          <span>Attendance register saved successfully. Parent alert dispatched for absent scholars.</span>
        </div>
      )}

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs font-semibold text-slate-500">Scholars on Register</span>
          <div className="text-xl font-bold text-slate-900 mt-1">{filteredStudents.length} Students</div>
        </div>
        <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs font-semibold text-emerald-700">Present Today</span>
          <div className="text-xl font-bold text-emerald-700 mt-1">{presentCount} Present</div>
        </div>
        <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs font-semibold text-rose-600">Absent</span>
          <div className="text-xl font-bold text-rose-600 mt-1">{absentCount} Absent</div>
        </div>
        <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs font-semibold text-amber-600">Late Punctuality</span>
          <div className="text-xl font-bold text-amber-600 mt-1">{lateCount} Late</div>
        </div>
      </div>

      {/* Roll Call Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
              <tr>
                <th className="p-3.5">Student / Admission No</th>
                <th className="p-3.5">Tier & Class</th>
                <th className="p-3.5">Overall Attendance</th>
                <th className="p-3.5">Today's Status</th>
                <th className="p-3.5 text-right">Quick Marking</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredStudents.map((s) => {
                const currentStatus = attendanceMap[s.id] || 'present';
                return (
                  <tr key={s.id} className="hover:bg-slate-50">
                    <td className="p-3.5 font-bold text-slate-900">
                      <div>{s.firstName} {s.lastName}</div>
                      <span className="text-[10px] font-mono text-slate-400">{s.admissionNo}</span>
                    </td>
                    <td className="p-3.5">
                      <div className="font-semibold text-slate-800">{s.classOrDept}</div>
                      <span className="text-[10px] text-slate-500 uppercase">{s.tier.replace('_', ' ')}</span>
                    </td>
                    <td className="p-3.5 font-bold text-emerald-700">
                      {s.attendanceRate}%
                    </td>
                    <td className="p-3.5">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${
                        currentStatus === 'present'
                          ? 'bg-emerald-100 text-emerald-800'
                          : currentStatus === 'absent'
                          ? 'bg-rose-100 text-rose-800'
                          : currentStatus === 'late'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-slate-100 text-slate-700'
                      }`}>
                        {currentStatus}
                      </span>
                    </td>
                    <td className="p-3.5 text-right">
                      <div className="inline-flex rounded-lg border border-slate-200 p-0.5 bg-slate-50">
                        <button
                          onClick={() => setStatus(s.id, 'present')}
                          className={`px-2.5 py-1 rounded-md text-[11px] font-bold transition-all ${
                            currentStatus === 'present' ? 'bg-emerald-700 text-white' : 'text-slate-600 hover:text-slate-900'
                          }`}
                        >
                          Present
                        </button>
                        <button
                          onClick={() => setStatus(s.id, 'late')}
                          className={`px-2.5 py-1 rounded-md text-[11px] font-bold transition-all ${
                            currentStatus === 'late' ? 'bg-amber-500 text-white' : 'text-slate-600 hover:text-slate-900'
                          }`}
                        >
                          Late
                        </button>
                        <button
                          onClick={() => setStatus(s.id, 'absent')}
                          className={`px-2.5 py-1 rounded-md text-[11px] font-bold transition-all ${
                            currentStatus === 'absent' ? 'bg-rose-600 text-white' : 'text-slate-600 hover:text-slate-900'
                          }`}
                        >
                          Absent
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
    </div>
  );
};
