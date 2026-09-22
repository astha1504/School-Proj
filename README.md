# Federal Republic of Nigeria • Unified School Management & Multi-Tier Portal
### Powered by GetoCore Digital Innovation

A multi-tenant, cloud-native enterprise education management platform engineered for Nigerian primary, secondary, and tertiary institutions across all 36 States and the FCT Abuja.

---

## 🌟 Executive Summary & Piloting Overview

This platform provides end-to-end institutional management tailored to the **Federal Ministry of Education (FME)**, **NERDC**, **TRCN**, **WAEC**, **NECO**, **JAMB**, and **NUC/NBTE/NCCE** standards.

### Key Capabilities for Pilot Schools:
1. **Tier-Specific Customization**:
   - **Early Childhood & Primary** (Crèche, Nursery 1-2, Primary 1-6)
   - **Junior Secondary** (JSS 1-3 with BECE/Junior WAEC tracking)
   - **Senior Secondary** (SSS 1-3 Science, Arts, and Commercial tracks)
   - **Tertiary & Sub-Programs** (Undergraduate, Remedial/IJMB, Diploma, Professional Certifications)
2. **Super Admin Module Locking (GetoCore Command)**:
   - Central control to lock or unlock tiers based on the pilot school's exact operational scope (e.g. Nursery, Primary & Secondary only).
3. **Office-Specific Workspaces**:
   - **Principal / Administrator**: School-wide oversight, statutory reporting, accreditation compliance.
   - **Academic Dean / HOD**: Subject allocation, curriculum delivery, continuous assessment weighting (CA1 20%, CA2 20%, Exam 60%).
   - **Registrar**: Admissions, biometric student profiles, state of origin, NIN/TRCN records.
   - **Chief Bursar**: Nigerian fee management (Naira ₦), termly invoicing, bank teller/proof reconciliation queue.
   - **Teachers**: Grade entry, psychomotor evaluation (5-point NERDC scale), attendance tracking.
   - **Parents**: Multi-ward dashboard, sibling rebate calculator (10%), installment fee plans, Paystack / Wema Titan virtual accounts / Remita RRR teller reconciliation, official exam clearance pass generator.
   - **Students & Alumni**: CBT testing engine, performance transcripts, lifelong alumni community network.

---

## 🚀 Quick Deployment & Hosting Options

### Option 1: Instant 1-Click Hosting on Vercel (Recommended for Live Pilot)
1. Push this project to GitHub.
2. Log in to [vercel.com](https://vercel.com) and click **"Add New Project"**.
3. Select your repository (`school-management-system` or `<school-name>-portal`).
4. Click **Deploy**. Vercel will automatically build the Next.js application and assign a live, high-speed HTTPS domain (e.g., `https://your-school-portal.vercel.app` or custom domain `portal.yourschool.edu.ng`).

### Option 2: VPS / Linux Server (Ubuntu / Debian) with PM2 & Nginx
```bash
# Clone & install dependencies
git clone <your-repo-url> school-portal
cd school-portal
npm install
npm run build

# Start production server with PM2
pm2 start npm --name "school-portal" -- start -- -p 3030
pm2 save
```

### Option 3: Docker Container
```bash
docker build -t getocore/school-portal:latest .
docker run -d -p 3030:3030 --name school-portal getocore/school-portal:latest
```

---

## 🏫 Piloting Checklist for a Partner School

- [ ] School Name, Motto, and Official Crest/Logo.
- [ ] Active Educational Sections (e.g., Nursery/Primary + JSS/SSS).
- [ ] Fee Schedule & Compulsory Levies (Tuition, Development, ICT/CBT, PTA, Books, Bus, Lunch).
- [ ] Bank Account & Gateway Setup (Paystack Secret Key, Monnify, Remita RRR, or Virtual Accounts).
- [ ] Initial Staff, Teacher, and Student Enrollment CSV upload.
- [ ] Dedicated Subdomain (e.g. `pilot.getocore.com` or `portal.schoolname.edu.ng`).

---

**Developed & Engineered by GetoCore Digital Innovation**  
*Pioneering Next-Generation Educational Infrastructure for the Federal Republic of Nigeria.*
