'use client';

import React, { useState } from 'react';
import { 
  FileText, 
  Copy, 
  Check, 
  Printer, 
  Building2, 
  Phone, 
  Layers, 
  Users, 
  Calendar, 
  GraduationCap, 
  CreditCard, 
  Image as ImageIcon, 
  FileSpreadsheet, 
  ShieldCheck, 
  ChevronRight, 
  Sparkles,
  CheckCircle2
} from 'lucide-react';

interface SchoolOnboardingKitTabProps {
  onGoToOnboard: () => void;
}

export const SchoolOnboardingKitTab: React.FC<SchoolOnboardingKitTabProps> = ({ onGoToOnboard }) => {
  const [activeSection, setActiveSection] = useState<string>('all');
  const [copiedText, setCopiedText] = useState(false);
  const [copiedHeader, setCopiedHeader] = useState<string | null>(null);

  const fullQuestionnaireText = `================================================================================
GETOCORE DIGITAL INNOVATION — INSTITUTIONAL ONBOARDING INTAKE QUESTIONNAIRE
Unified Cloud School Management & Multi-Tier Operating Platform
================================================================================

SECTION 1: INSTITUTIONAL & LEGAL IDENTIFICATION
1. Official Registered School Name: 
2. School Acronym / Short Name (e.g. ARA): 
3. School Motto / Slogan: 
4. Year of Establishment: 
5. Corporate Affairs Commission (CAC) Registration / RC / BN No.: 
6. State Ministry of Education Approval / Accreditation License No.: 
7. WAEC Examination Center Number (if secondary): 
8. NECO Examination Center Number (if secondary): 
9. BECE Center Number: 
10. JAMB CBT Center Code (if accredited): 
11. Ownership Type (Private / Faith-based / Public / Mission): 
12. Boarding Status (Day Only / Full Boarding / Day & Boarding): 
13. Gender Policy (Co-Educational / Boys Only / Girls Only): 

SECTION 2: CAMPUS ADDRESS & CONTACT INFORMATION
1. Main Campus Street Address: 
2. City / Town: 
3. Local Government Area (LGA): 
4. State / Region: 
5. Country: Nigeria
6. Official School Email Address: 
7. Official Telephone Lines: 
8. Existing Website URL (if any): 
9. Desired GetoCore Subdomain: [________].getocore.edu

SECTION 3: OPERATIONAL EDUCATIONAL WINGS & TIERS
(Check all operated by your school)
[ ] Early Years / Creche / Daycare (Ages 3m - 2yrs)
[ ] Nursery & Kindergarten (Nursery 1, 2, KG)
[ ] Primary Section (Basic 1 to Basic 6)
[ ] Junior Secondary School (JSS 1, 2, 3 - BECE)
[ ] Senior Secondary School (SSS 1, 2, 3 - WAEC/NECO)
[ ] Sixth Form / Cambridge A-Levels / Foundation Studies
[ ] Tertiary / Polytechnic / Sub-Programs (100L - 500L)

SECTION 4: KEY ADMINISTRATIVE HEADS (USER ROLE ASSIGNMENTS)
1. PROPRIETOR / DIRECTOR GENERAL / BOARD CHAIR:
   - Full Name: 
   - Salutation/Title: 
   - Phone: 
   - Official Email: 

2. PRINCIPAL / HEAD OF SCHOOL (PRIMARY SUPER ADMIN LOGIN):
   - Full Name: 
   - Qualifications (e.g. B.Ed, M.Ed, Ph.D): 
   - TRCN Number: 
   - Direct Phone: 
   - Official Email: 

3. VICE PRINCIPAL (ACADEMIC AFFAIRS) - Subjects & Results:
   - Full Name: 
   - Phone: 
   - Official Email: 

4. VICE PRINCIPAL (ADMINISTRATION) / REGISTRAR - Classes & Staff HR:
   - Full Name: 
   - Phone: 
   - Official Email: 

5. CHIEF BURSAR / FINANCIAL DIRECTOR - Invoices & Paystack:
   - Full Name: 
   - Certification (ICAN / ANAN): 
   - Phone: 
   - Official Email: 

6. ICT ADMINISTRATOR / CBT EXAMS OFFICER:
   - Full Name: 
   - Phone: 
   - Official Email: 

SECTION 5: ACADEMIC CALENDAR, GRADING & ASSESSMENT
1. Current Academic Session (e.g. 2026/2027): 
2. Current Active Term (1st / 2nd / 3rd Term): 
3. Term Resumption Date (DD/MM/YYYY): 
4. Mid-Term Assessment Date (DD/MM/YYYY): 
5. Term Vacation / Closing Date (DD/MM/YYYY): 
6. Assessment Weighting Breakdown:
   - 1st CA Test: ____% (e.g. 15%)
   - 2nd CA / Mid-term Project: ____% (e.g. 15%)
   - Attendance & Class Conduct: ____% (e.g. 10%)
   - Terminal Examination: ____% (e.g. 60%)
   - Total: 100%
7. Grading Scale: WAEC 9-Tier (A1 to F9) or Custom Scale: 

SECTION 6: CLASS STRUCTURE & ARM NOMENCLATURE
(List each level, active arm names e.g. Gold/Silver/A/B, and desk capacity)
- Nursery 1: Arms: ___________ | Capacity per arm: ___
- Nursery 2: Arms: ___________ | Capacity per arm: ___
- Basic 1 to 6: Arms: ___________ | Capacity per arm: ___
- JSS 1 to 3: Arms: ___________ | Capacity per arm: ___
- SSS 1 to 3: Arms: ___________ | Capacity per arm: ___

SECTION 7: BURSARY, BANKING & PAYSTACK CONFIGURATION
1. Official School Bank Account 1 (Tuition):
   - Bank Name: 
   - Account Name: 
   - NUBAN Account Number (10 digits): 
2. Official School Bank Account 2 (Development/Other):
   - Bank Name: 
   - Account Name: 
   - NUBAN Account Number (10 digits): 
3. Paystack Multi-Channel Digital Gateway:
   - Paystack Registered Business Name: 
   - Paystack Public API Key: 
   - Paystack Secret API Key (Transmitted securely): 
   - Subaccount Code (if split settlements configured): SUB_CODE
4. Termly Fee Schedule (in Nigerian Naira ₦):
   - Tuition Fee: ₦_______
   - Development Levy: ₦_______
   - ICT & CBT Access: ₦_______
   - Science Lab Materials: ₦_______
   - PTA & Sports: ₦_______
   - Optional Bus Service: ₦_______
   - Optional Lunch: ₦_______
   - Optional Boarding/Hostel: ₦_______
5. Sibling Discount Policy: Yes (___%) / No
6. Installment Policy: 100% Upfront / 2-Part (60/40) / 3-Part (40/30/30)

SECTION 8: BRAND ASSETS & DIGITAL SIGNATURES CHECKLIST
Please attach high-resolution files:
[ ] School Logo (PNG or SVG, transparent background, min 500x500px)
[ ] Official School Seal / Round Stamp (PNG transparent background)
[ ] Principal / Head of School Signature (PNG transparent background)
[ ] Chief Bursar Signature (PNG transparent background)
[ ] Primary Brand Hex Color (e.g. Navy Blue #1e3a8a)
[ ] Secondary Brand Hex Color (e.g. Gold #d97706)

SECTION 9: BULK DATA MIGRATION SPREADSHEETS
Attach 3 CSV / Excel spreadsheets:
1. students.csv: AdmissionNumber, FirstName, MiddleName, LastName, Gender, DateOfBirth, EducationalWing, ClassArm, ParentGuardianName, ParentPhone, ParentEmail, ResidentialAddress, BloodGroup, Genotype, StateOfOrigin
2. staff.csv: StaffNumber, FullName, OfficialEmail, PhoneNumber, Designation, Department, AssignedRole, TRCNNumber, HighestQualification, FormClassAssigned, AssignedSubjects
3. subjects.csv: SubjectCode, SubjectName, Category, ApplicableWing, PeriodsPerWeek, PassMarkPercentage, SyllabusOutline

SECTION 10: INSTITUTIONAL SIGN-OFF & AUTHORIZATION
Authorizing Officer Name: 
Designation (Proprietor / Head of School): 
Date: DD/MM/YYYY
Signature & School Stamp: 
================================================================================`;

  const copyToClipboard = () => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(fullQuestionnaireText);
      setCopiedText(true);
      setTimeout(() => setCopiedText(false), 2500);
    }
  };

  const copyHeaderString = (key: string, text: string) => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedHeader(key);
      setTimeout(() => setCopiedHeader(null), 2000);
    }
  };

  const handlePrint = () => {
    if (typeof window !== 'undefined') {
      window.print();
    }
  };

  const sections = [
    { id: 'all', label: 'Overview & All Sections', icon: Layers },
    { id: 'legal', label: '1. Legal & Identity', icon: Building2 },
    { id: 'contact', label: '2. Campus & Contacts', icon: Phone },
    { id: 'tiers', label: '3. Educational Wings & Tiers', icon: GraduationCap },
    { id: 'officers', label: '4. Key Administrative Heads', icon: Users },
    { id: 'academic', label: '5. Calendar & Grading', icon: Calendar },
    { id: 'classes', label: '6. Class Arms & Capacity', icon: Building2 },
    { id: 'bursary', label: '7. Bursary, Banks & Paystack', icon: CreditCard },
    { id: 'assets', label: '8. Brand Assets & Stamps', icon: ImageIcon },
    { id: 'csv', label: '9. CSV Migration Schemas', icon: FileSpreadsheet },
    { id: 'signoff', label: '10. Authorization & Sign-Off', icon: ShieldCheck }
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner with Action Buttons */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-950 p-6 sm:p-8 rounded-3xl border border-slate-700 shadow-xl text-white">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-bold border border-emerald-500/30">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Official Institutional Onboarding Intake Kit</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
              School Onboarding Information & Data Requirements
            </h2>
            <p className="text-slate-300 text-sm leading-relaxed">
              Complete data questionnaire, legal identifiers, Paystack gateway setup, and CSV migration schemas required from prospective schools before provisioning on GetoCore Cloud.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={copyToClipboard}
              className={`px-4 py-3 rounded-2xl text-sm font-bold flex items-center gap-2 transition-all shadow-md ${
                copiedText
                  ? 'bg-emerald-500 text-white'
                  : 'bg-emerald-600 hover:bg-emerald-500 text-white'
              }`}
            >
              {copiedText ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              <span>{copiedText ? 'Copied Full Questionnaire!' : 'Copy Questionnaire (Text)'}</span>
            </button>

            <button
              type="button"
              onClick={handlePrint}
              className="px-4 py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm font-semibold border border-slate-600 flex items-center gap-2 transition-colors cursor-pointer"
            >
              <Printer className="w-4 h-4 text-slate-400" />
              <span>Print / Save PDF</span>
            </button>

            <button
              type="button"
              onClick={onGoToOnboard}
              className="px-4 py-3 rounded-2xl bg-white hover:bg-slate-100 text-slate-900 text-sm font-bold flex items-center gap-2 transition-colors shadow-sm cursor-pointer"
            >
              <span>Launch Onboarding Wizard</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Quick Stats / Highlights */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 pt-6 border-t border-slate-700/60 text-xs">
          <div>
            <span className="text-slate-400 block">Total Sections</span>
            <span className="text-lg font-bold text-white">10 Critical Modules</span>
          </div>
          <div>
            <span className="text-slate-400 block">Target Jurisdiction</span>
            <span className="text-lg font-bold text-emerald-400">Nigeria (WAEC/NERDC) + Global</span>
          </div>
          <div>
            <span className="text-slate-400 block">Financial Rails</span>
            <span className="text-lg font-bold text-amber-400">Paystack, Transfer, POS, NGN ₦</span>
          </div>
          <div>
            <span className="text-slate-400 block">Deployment Speed</span>
            <span className="text-lg font-bold text-cyan-400">&lt; 24h Tenant Setup</span>
          </div>
        </div>
      </div>

      {/* Section Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin">
        {sections.map(s => {
          const Icon = s.icon;
          const isSelected = activeSection === s.id;
          return (
            <button
              key={s.id}
              type="button"
              onClick={() => setActiveSection(s.id)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap flex items-center gap-1.5 transition-all cursor-pointer ${
                isSelected
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${isSelected ? 'text-emerald-400' : 'text-slate-400'}`} />
              <span>{s.label}</span>
            </button>
          );
        })}
      </div>

      {/* Section Content Display */}
      <div className="space-y-6">

        {/* SECTION 1: LEGAL & IDENTITY */}
        {(activeSection === 'all' || activeSection === 'legal') && (
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm">
            <div className="flex items-center gap-3 pb-4 mb-6 border-b border-slate-100">
              <div className="w-10 h-10 rounded-2xl bg-blue-100 text-blue-700 flex items-center justify-center font-black">
                1
              </div>
              <div>
                <h3 className="text-lg font-black text-slate-900">Institutional & Legal Identification</h3>
                <p className="text-xs text-slate-500">Regulatory credentials and ministry accreditations</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
                <span className="text-xs font-bold text-slate-500 uppercase">1.1 Registered School Name</span>
                <p className="font-semibold text-slate-900">Full legal name as registered on CAC documents and State Ministry of Education.</p>
                <span className="text-xs text-slate-400">Example: Apex Royal Academy / Divine Grace International College</span>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
                <span className="text-xs font-bold text-slate-500 uppercase">1.2 Acronym & Motto</span>
                <p className="font-semibold text-slate-900">Official short name (2-5 characters) and official motto for report cards and badges.</p>
                <span className="text-xs text-slate-400">Example: ARA — "Knowledge, Integrity and Excellence"</span>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
                <span className="text-xs font-bold text-slate-500 uppercase">1.3 CAC & MoE Approval License</span>
                <p className="font-semibold text-slate-900">Corporate Affairs Commission (RC/BN) number and State Ministry of Education approval code.</p>
                <span className="text-xs text-slate-400">Example: RC 1492084 | MOE/ED/PR/2016/482</span>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
                <span className="text-xs font-bold text-slate-500 uppercase">1.4 Exam Center Numbers</span>
                <p className="font-semibold text-slate-900">National examination body codes: WAEC, NECO, BECE, and JAMB CBT Center Code.</p>
                <span className="text-xs text-slate-400">Essential for candidates entering terminal external examinations.</span>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1 md:col-span-2">
                <span className="text-xs font-bold text-slate-500 uppercase">1.5 Institutional Demographics</span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mt-2">
                  <div className="p-2.5 rounded-xl bg-white border border-slate-200 text-xs">
                    <span className="font-bold text-slate-700 block">Ownership</span>
                    Private, Faith-based, Public, or Mission
                  </div>
                  <div className="p-2.5 rounded-xl bg-white border border-slate-200 text-xs">
                    <span className="font-bold text-slate-700 block">Boarding</span>
                    Day Only, Full Boarding, or Mixed
                  </div>
                  <div className="p-2.5 rounded-xl bg-white border border-slate-200 text-xs">
                    <span className="font-bold text-slate-700 block">Gender</span>
                    Co-Educational (Mixed), Boys, or Girls
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* SECTION 2: CAMPUS & CONTACTS */}
        {(activeSection === 'all' || activeSection === 'contact') && (
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm">
            <div className="flex items-center gap-3 pb-4 mb-6 border-b border-slate-100">
              <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-black">
                2
              </div>
              <div>
                <h3 className="text-lg font-black text-slate-900">Campus Address & Contact Coordinates</h3>
                <p className="text-xs text-slate-500">Physical geography and custom GetoCore subdomain</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1 md:col-span-2">
                <span className="text-xs font-bold text-slate-500 uppercase">Physical Campus Address</span>
                <p className="font-semibold text-slate-900">Street, landmark, town/district, Local Government Area (LGA), and State.</p>
                <span className="text-xs text-slate-400">Example: Plot 14, Royal Palm Way, Garki II, AMAC, FCT Abuja, Nigeria</span>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
                <span className="text-xs font-bold text-slate-500 uppercase">Official School Email</span>
                <p className="font-semibold text-slate-900">Central administrative inbox for billing & official communication.</p>
                <span className="text-xs text-slate-400">Example: admin@apexroyal.edu.ng</span>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
                <span className="text-xs font-bold text-slate-500 uppercase">Official Phone Numbers</span>
                <p className="font-semibold text-slate-900">Central reception, Principal's line, and Bursary inquiry line.</p>
                <span className="text-xs text-slate-400">Example: 0803 000 1122, 0902 444 5566</span>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1 md:col-span-2">
                <span className="text-xs font-bold text-slate-500 uppercase">Desired GetoCore Cloud Subdomain</span>
                <p className="font-semibold text-emerald-700 font-mono text-base">
                  https://[your-school-slug].getocore.edu
                </p>
                <span className="text-xs text-slate-500">
                  Unique SSL-protected cloud endpoint mapped to your tenant. Custom domains (e.g. portal.school.edu.ng) are also supported.
                </span>
              </div>
            </div>
          </div>
        )}

        {/* SECTION 3: WINGS & TIERS */}
        {(activeSection === 'all' || activeSection === 'tiers') && (
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm">
            <div className="flex items-center gap-3 pb-4 mb-6 border-b border-slate-100">
              <div className="w-10 h-10 rounded-2xl bg-purple-100 text-purple-700 flex items-center justify-center font-black">
                3
              </div>
              <div>
                <h3 className="text-lg font-black text-slate-900">Educational Wings & Tier Locking Options</h3>
                <p className="text-xs text-slate-500">Locks/unlocks modules so schools only see services they operate</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 text-xs">
              {[
                { name: 'Early Childhood / Creche', desc: 'Ages 3 months to 2 years, nap/feeding logs' },
                { name: 'Nursery & Kindergarten', desc: 'Nursery 1, 2, KG / Pre-Basic foundation' },
                { name: 'Primary Section (Basic 1 - 6)', desc: 'Standard 6-year Nigerian basic education' },
                { name: 'Junior Secondary (JSS 1 - 3)', desc: 'BECE curriculum, basic science, pre-vocational' },
                { name: 'Senior Secondary (SSS 1 - 3)', desc: 'WAEC / NECO streams: Science, Commercial, Arts' },
                { name: 'Sixth Form / Cambridge A-Levels', desc: 'Advanced level & university preparatory' },
                { name: 'Collegiate / Tertiary', desc: '100L to 500L polytechnic or college departments' }
              ].map((wing, idx) => (
                <div key={idx} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1">
                  <div className="font-bold text-slate-900 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>{wing.name}</span>
                  </div>
                  <p className="text-slate-500">{wing.desc}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SECTION 4: ADMINISTRATIVE HEADS */}
        {(activeSection === 'all' || activeSection === 'officers') && (
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm">
            <div className="flex items-center gap-3 pb-4 mb-6 border-b border-slate-100">
              <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center font-black">
                4
              </div>
              <div>
                <h3 className="text-lg font-black text-slate-900">Key Administrative Heads & Role Permissions</h3>
                <p className="text-xs text-slate-500">Initial accounts auto-provisioned upon onboarding</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900 text-sm">Principal / Head of School</span>
                  <span className="px-2 py-0.5 rounded-full bg-rose-100 text-rose-700 font-bold text-[10px]">Super Admin</span>
                </div>
                <p className="text-slate-600">Full institutional authority: sets up staff logins, oversees broad-sheet approvals, admissions, and system settings.</p>
                <div className="pt-2 text-[11px] text-slate-500 space-y-0.5 border-t border-slate-200">
                  <div><strong>Required:</strong> Full Name, Qualifications (e.g. M.Ed), TRCN No, Official Email, Direct Mobile.</div>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900 text-sm">Chief Bursar / Finance Director</span>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 font-bold text-[10px]">Bursar Role</span>
                </div>
                <p className="text-slate-600">Manages fee structures, bank accounts, Paystack credentials, invoice issuance, and bank teller proof reconciliation.</p>
                <div className="pt-2 text-[11px] text-slate-500 space-y-0.5 border-t border-slate-200">
                  <div><strong>Required:</strong> Full Name, Professional Certification (ICAN/ANAN), Official Email, Direct Mobile.</div>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900 text-sm">VP Academic Affairs</span>
                  <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 font-bold text-[10px]">Academic Head</span>
                </div>
                <p className="text-slate-600">Oversees syllabus, NERDC curriculum schemes, period allocations, exam timetables, and terminal results verification.</p>
                <div className="pt-2 text-[11px] text-slate-500 space-y-0.5 border-t border-slate-200">
                  <div><strong>Required:</strong> Full Name, Email, Phone, Subjects Oversight.</div>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900 text-sm">VP Administration / Registrar</span>
                  <span className="px-2 py-0.5 rounded-full bg-purple-100 text-purple-700 font-bold text-[10px]">Registry & HR</span>
                </div>
                <p className="text-slate-600">Manages class arm desk capacities, classroom allocation, staff TRCN accreditations, and student admissions registers.</p>
                <div className="pt-2 text-[11px] text-slate-500 space-y-0.5 border-t border-slate-200">
                  <div><strong>Required:</strong> Full Name, Email, Phone, Department.</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* SECTION 5: CALENDAR & GRADING */}
        {(activeSection === 'all' || activeSection === 'academic') && (
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm">
            <div className="flex items-center gap-3 pb-4 mb-6 border-b border-slate-100">
              <div className="w-10 h-10 rounded-2xl bg-rose-100 text-rose-700 flex items-center justify-center font-black">
                5
              </div>
              <div>
                <h3 className="text-lg font-black text-slate-900">Academic Calendar, Grading & Assessment Weights</h3>
                <p className="text-xs text-slate-500">Continuous Assessment (CA) vs Exam breakdown</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
              <div className="space-y-3">
                <span className="font-bold text-slate-700 uppercase tracking-wider block">Session & Dates</span>
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Academic Session:</span>
                    <span className="font-bold text-slate-900">e.g. 2026/2027</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Current Term:</span>
                    <span className="font-bold text-slate-900">First / Second / Third Term</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Term Resumption Date:</span>
                    <span className="font-bold text-slate-900">DD / MM / YYYY</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Mid-Term Assessment:</span>
                    <span className="font-bold text-slate-900">DD / MM / YYYY</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Vacation / Closing Date:</span>
                    <span className="font-bold text-slate-900">DD / MM / YYYY</span>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <span className="font-bold text-slate-700 uppercase tracking-wider block">Assessment Model (100% Total)</span>
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-600">1st Continuous Assessment (CA):</span>
                    <span className="font-bold text-slate-900 px-2 py-0.5 rounded-lg bg-white border border-slate-200">15% - 20%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-600">2nd CA / Mid-Term Project:</span>
                    <span className="font-bold text-slate-900 px-2 py-0.5 rounded-lg bg-white border border-slate-200">15% - 20%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-600">Class Attendance & Practical:</span>
                    <span className="font-bold text-slate-900 px-2 py-0.5 rounded-lg bg-white border border-slate-200">5% - 10%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-600">Terminal Examination:</span>
                    <span className="font-bold text-emerald-700 px-2 py-0.5 rounded-lg bg-emerald-50 border border-emerald-200">60%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* SECTION 7: BURSARY & PAYSTACK */}
        {(activeSection === 'all' || activeSection === 'bursary') && (
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm">
            <div className="flex items-center gap-3 pb-4 mb-6 border-b border-slate-100">
              <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-black">
                7
              </div>
              <div>
                <h3 className="text-lg font-black text-slate-900">Bursary, Bank Accounts & Paystack Configuration</h3>
                <p className="text-xs text-slate-500">Parent fee collections, POS channels, and instant disbursements</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                <span className="font-bold text-slate-800 text-sm block">1. Commercial Bank Accounts</span>
                <p className="text-slate-500">Used for direct bank transfers, counter deposit teller slips, and Moniepoint/OPay POS machines.</p>
                <div className="p-3 bg-white rounded-xl border border-slate-200 space-y-1.5 font-mono text-[11px]">
                  <div><strong>Account 1:</strong> Zenith Bank | 1012345678 | Apex Royal Tuition</div>
                  <div><strong>Account 2:</strong> GTBank | 0123456789 | Apex Royal Projects</div>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                <span className="font-bold text-slate-800 text-sm block">2. Paystack Digital Gateway</span>
                <p className="text-slate-500">Allows parents to pay in the portal via Card, Dynamic Transfer, USSD, and NQR.</p>
                <div className="p-3 bg-white rounded-xl border border-slate-200 space-y-1.5 font-mono text-[11px]">
                  <div><strong>Public Key:</strong> PAYSTACK_PUBLIC_KEY (From Paystack API Settings)</div>
                  <div><strong>Secret Key:</strong> PAYSTACK_SECRET_KEY (Transmitted via secure vault)</div>
                  <div><strong>Split Subaccount:</strong> SUB_MERCHANT_ID (Optional)</div>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3 md:col-span-2">
                <span className="font-bold text-slate-800 text-sm block">3. Terminal Fee Items Breakdown</span>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-slate-200 text-slate-500 text-[11px]">
                        <th className="py-2">Fee Component</th>
                        <th className="py-2">Nursery / Primary</th>
                        <th className="py-2">Junior Sec (JSS)</th>
                        <th className="py-2">Senior Sec (SSS)</th>
                        <th className="py-2">Requirement</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-medium">
                      <tr>
                        <td className="py-2 font-bold text-slate-900">Tuition Fee</td>
                        <td className="py-2">₦60,000</td>
                        <td className="py-2">₦95,000</td>
                        <td className="py-2">₦120,000</td>
                        <td className="py-2 text-rose-600 font-bold">Mandatory</td>
                      </tr>
                      <tr>
                        <td className="py-2 font-bold text-slate-900">Development Levy</td>
                        <td className="py-2">₦10,000</td>
                        <td className="py-2">₦15,000</td>
                        <td className="py-2">₦20,000</td>
                        <td className="py-2 text-rose-600 font-bold">Mandatory</td>
                      </tr>
                      <tr>
                        <td className="py-2 font-bold text-slate-900">ICT & CBT Access Fee</td>
                        <td className="py-2">₦5,000</td>
                        <td className="py-2">₦10,000</td>
                        <td className="py-2">₦15,000</td>
                        <td className="py-2 text-rose-600 font-bold">Mandatory</td>
                      </tr>
                      <tr>
                        <td className="py-2 font-bold text-slate-900">School Bus Service</td>
                        <td className="py-2">₦25,000</td>
                        <td className="py-2">₦25,000</td>
                        <td className="py-2">₦25,000</td>
                        <td className="py-2 text-slate-500">Optional</td>
                      </tr>
                      <tr>
                        <td className="py-2 font-bold text-slate-900">Daily Lunch Scheme</td>
                        <td className="py-2">₦18,000</td>
                        <td className="py-2">₦18,000</td>
                        <td className="py-2">₦18,000</td>
                        <td className="py-2 text-slate-500">Optional</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* SECTION 8: BRAND ASSETS */}
        {(activeSection === 'all' || activeSection === 'assets') && (
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm">
            <div className="flex items-center gap-3 pb-4 mb-6 border-b border-slate-100">
              <div className="w-10 h-10 rounded-2xl bg-cyan-100 text-cyan-700 flex items-center justify-center font-black">
                8
              </div>
              <div>
                <h3 className="text-lg font-black text-slate-900">Brand Assets, Official Seals & Signatures</h3>
                <p className="text-xs text-slate-500">Digital assets required for automated report card and receipt stamping</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-center space-y-2">
                <div className="w-12 h-12 mx-auto rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center">
                  <ImageIcon className="w-6 h-6" />
                </div>
                <span className="font-bold text-slate-900 block">School Crest / Logo</span>
                <p className="text-slate-500 text-[11px]">High-res transparent PNG/SVG (min 500x500px) for portal header and printouts.</p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-center space-y-2">
                <div className="w-12 h-12 mx-auto rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <span className="font-bold text-slate-900 block">School Round Stamp</span>
                <p className="text-slate-500 text-[11px]">Official circular stamp in transparent PNG for electronic certification.</p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-center space-y-2">
                <div className="w-12 h-12 mx-auto rounded-2xl bg-purple-100 text-purple-600 flex items-center justify-center">
                  <FileText className="w-6 h-6" />
                </div>
                <span className="font-bold text-slate-900 block">Principal Signature</span>
                <p className="text-slate-500 text-[11px]">Scanned clean transparent PNG for automatic signature on report cards.</p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-center space-y-2">
                <div className="w-12 h-12 mx-auto rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center">
                  <CreditCard className="w-6 h-6" />
                </div>
                <span className="font-bold text-slate-900 block">Bursar Signature</span>
                <p className="text-slate-500 text-[11px]">Scanned clean transparent PNG for payment clearance passes & receipts.</p>
              </div>
            </div>
          </div>
        )}

        {/* SECTION 9: CSV DATA MIGRATION SCHEMAS */}
        {(activeSection === 'all' || activeSection === 'csv') && (
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm">
            <div className="flex items-center gap-3 pb-4 mb-6 border-b border-slate-100">
              <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-black">
                9
              </div>
              <div>
                <h3 className="text-lg font-black text-slate-900">Bulk Data Migration Spreadsheets (CSV Schemas)</h3>
                <p className="text-xs text-slate-500">Provide populated spreadsheets to batch-import your scholars, staff, and subjects</p>
              </div>
            </div>

            <div className="space-y-6 text-xs">
              {/* Students Schema */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                  <div>
                    <span className="font-black text-sm text-slate-900">1. Student Master Roster (students.csv)</span>
                    <p className="text-slate-500">Enroll scholars, link parent details, and assign class arms.</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => copyHeaderString('students', 'AdmissionNumber,FirstName,MiddleName,LastName,Gender,DateOfBirth,EducationalWing,ClassArm,ParentGuardianName,ParentPhone,ParentEmail,ResidentialAddress,BloodGroup,Genotype,StateOfOrigin')}
                    className="px-3 py-1.5 rounded-xl bg-white border border-slate-200 hover:bg-slate-100 font-bold text-slate-700 flex items-center gap-1.5 shadow-xs self-start cursor-pointer"
                  >
                    {copiedHeader === 'students' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-slate-500" />}
                    <span>{copiedHeader === 'students' ? 'Copied Header!' : 'Copy CSV Header'}</span>
                  </button>
                </div>
                <div className="p-3 bg-white rounded-xl border border-slate-200 font-mono text-[11px] overflow-x-auto text-slate-700">
                  AdmissionNumber,FirstName,MiddleName,LastName,Gender,DateOfBirth,EducationalWing,ClassArm,ParentGuardianName,ParentPhone,ParentEmail,ResidentialAddress,BloodGroup,Genotype,StateOfOrigin
                </div>
              </div>

              {/* Staff Schema */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                  <div>
                    <span className="font-black text-sm text-slate-900">2. Staff & Faculty Registry (staff.csv)</span>
                    <p className="text-slate-500">Onboard faculty with TRCN credentials, assigned form classes, and subject loads.</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => copyHeaderString('staff', 'StaffNumber,FullName,OfficialEmail,PhoneNumber,Designation,Department,AssignedRole,TRCNNumber,HighestQualification,FormClassAssigned,AssignedSubjects')}
                    className="px-3 py-1.5 rounded-xl bg-white border border-slate-200 hover:bg-slate-100 font-bold text-slate-700 flex items-center gap-1.5 shadow-xs self-start cursor-pointer"
                  >
                    {copiedHeader === 'staff' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-slate-500" />}
                    <span>{copiedHeader === 'staff' ? 'Copied Header!' : 'Copy CSV Header'}</span>
                  </button>
                </div>
                <div className="p-3 bg-white rounded-xl border border-slate-200 font-mono text-[11px] overflow-x-auto text-slate-700">
                  StaffNumber,FullName,OfficialEmail,PhoneNumber,Designation,Department,AssignedRole,TRCNNumber,HighestQualification,FormClassAssigned,AssignedSubjects
                </div>
              </div>

              {/* Subjects Schema */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                  <div>
                    <span className="font-black text-sm text-slate-900">3. Subject Curricula Scheme (subjects.csv)</span>
                    <p className="text-slate-500">Define subjects, weekly periods, and pass mark benchmarks.</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => copyHeaderString('subjects', 'SubjectCode,SubjectName,Category,ApplicableWing,PeriodsPerWeek,PassMarkPercentage,SyllabusOutline')}
                    className="px-3 py-1.5 rounded-xl bg-white border border-slate-200 hover:bg-slate-100 font-bold text-slate-700 flex items-center gap-1.5 shadow-xs self-start cursor-pointer"
                  >
                    {copiedHeader === 'subjects' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-slate-500" />}
                    <span>{copiedHeader === 'subjects' ? 'Copied Header!' : 'Copy CSV Header'}</span>
                  </button>
                </div>
                <div className="p-3 bg-white rounded-xl border border-slate-200 font-mono text-[11px] overflow-x-auto text-slate-700">
                  SubjectCode,SubjectName,Category,ApplicableWing,PeriodsPerWeek,PassMarkPercentage,SyllabusOutline
                </div>
              </div>
            </div>
          </div>
        )}

      </div>

      {/* Bottom Launch Callout */}
      <div className="p-6 rounded-3xl bg-slate-900 text-white flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h4 className="font-bold text-base">Ready to Onboard a School?</h4>
          <p className="text-xs text-slate-400">Once the school completes this intake form, enter their particulars in the 4-step deployment wizard.</p>
        </div>
        <button
          type="button"
          onClick={onGoToOnboard}
          className="px-5 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm flex items-center gap-2 transition-colors self-start sm:self-auto shrink-0 shadow-md cursor-pointer"
        >
          <span>Open 4-Step Onboard Wizard</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
