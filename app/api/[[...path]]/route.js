import { NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import { getDb } from '@/lib/db';
import { hashPassword, verifyPassword, signToken, getUserFromRequest } from '@/lib/auth';
import { uploadBufferToCloudinary } from '@/lib/cloudinary';
import { razorpay, verifyRazorpaySignature } from '@/lib/razorpayClient';

export const dynamic = 'force-dynamic';

const json = (data, status = 200) => NextResponse.json(data, { status });
const err = (message, status = 400) => NextResponse.json({ error: message }, { status });

// Attach a logo to each job from the companies collection when missing.
async function attachLogos(db, jobs) {
  if (!Array.isArray(jobs) || jobs.length === 0) return jobs;
  const missingNames = [...new Set(jobs.filter(j => !j.companyLogo && !j.logo).map(j => j.companyName).filter(Boolean))];
  if (missingNames.length === 0) {
    jobs.forEach(j => { if (j.companyLogo && !j.logo) j.logo = j.companyLogo; });
    return jobs;
  }
  const companies = await db.collection('companies').find({ name: { $in: missingNames } }, { projection: { name: 1, logo: 1, _id: 0 } }).toArray();
  const map = Object.fromEntries(companies.map(c => [c.name, c.logo]));
  jobs.forEach(j => {
    const found = map[j.companyName];
    if (!j.companyLogo && found) j.companyLogo = found;
    if (!j.logo) j.logo = j.companyLogo || found || '';
  });
  return jobs;
}

async function route(request, { params }) {
  const path = params?.path || [];
  const method = request.method;
  const url = new URL(request.url);
  const segs = path;
  const s0 = segs[0];
  const s1 = segs[1];
  const s2 = segs[2];

  try {
    const db = await getDb();

    // Health
    if (segs.length === 0 || (s0 === 'health' && method === 'GET')) {
      return json({ ok: true, service: 'jobportal-api' });
    }

    // ======= AUTH =======
    if (s0 === 'auth') {
      if (s1 === 'register' && method === 'POST') {
        const body = await request.json();
        const { name, email, password, role } = body || {};
        if (!name || !email || !password || !role) return err('Missing fields');
        // Admin accounts cannot be self-registered
        if (!['EMPLOYER', 'CANDIDATE'].includes(role)) return err('Invalid role');
        const existing = await db.collection('users').findOne({ email: email.toLowerCase() });
        if (existing) return err('Email already registered', 409);
        const user = {
          id: uuidv4(),
          name,
          email: email.toLowerCase(),
          password: await hashPassword(password),
          role,
          isPremium: false,
          createdAt: new Date(),
        };
        await db.collection('users').insertOne(user);
        const token = signToken({ userId: user.id, role: user.role });
        const { password: _p, _id, ...safe } = user;
        return json({ token, user: safe });
      }

      if (s1 === 'login' && method === 'POST') {
        const body = await request.json();
        const { email, password } = body || {};
        if (!email || !password) return err('Missing fields');
        const user = await db.collection('users').findOne({ email: email.toLowerCase() });
        if (!user) return err('Invalid credentials', 401);
        const ok = await verifyPassword(password, user.password);
        if (!ok) return err('Invalid credentials', 401);
        const token = signToken({ userId: user.id, role: user.role });
        const { password: _p, _id, ...safe } = user;
        return json({ token, user: safe });
      }

      if (s1 === 'me' && method === 'GET') {
        const user = await getUserFromRequest(request);
        if (!user) return err('Unauthorized', 401);
        return json({ user });
      }
    }
    // ======= CATEGORIES =======
    if (s0 === 'categories' && method === 'GET') {
      const sections = [
        { name: 'Front-End RCM', items: ['Patient Scheduling','Eligibility & Benefits Verification','Prior Authorization','Credentialing'] },
        { name: 'Back-End RCM', items: ['Coding', 'Charge Posting / Claim Scrubbing & Submission', 'Payment Posting', 'Account Receivable (AR)', 'Underpayments', 'Credit Balance'] }
      ];
      return json({ sections });
    }

    // ======= JOBS =======
    if (s0 === 'jobs') {
      // GET /api/jobs (public list with search/filter)
      if (segs.length === 1 && method === 'GET') {
        const search = url.searchParams.get('search')?.trim();
        const location = url.searchParams.get('location')?.trim();
        const skill = url.searchParams.get('skill')?.trim();
        const category = url.searchParams.get('category')?.trim();
        const minSalary = parseInt(url.searchParams.get('minSalary') || '0', 10);
        const page = Math.max(1, parseInt(url.searchParams.get('page') || '1', 10));
        const limit = Math.min(50, parseInt(url.searchParams.get('limit') || '12', 10));
        const q = {};
        if (search) q.$or = [
          { title: { $regex: search, $options: 'i' } },
          { description: { $regex: search, $options: 'i' } },
          { companyName: { $regex: search, $options: 'i' } },
        ];
        if (location) q.location = { $regex: location, $options: 'i' };
        if (skill) q.requiredSkills = { $regex: skill, $options: 'i' };
        if (category) q.category = { $regex: category, $options: 'i' };
        if (minSalary > 0) q.salary = { $gte: minSalary };
        const total = await db.collection('jobs').countDocuments(q);
        const jobs = await db.collection('jobs')
          .find(q, { projection: { _id: 0 } })
          .sort({ createdAt: -1 })
          .skip((page - 1) * limit)
          .limit(limit)
          .toArray();
        await attachLogos(db, jobs);
        return json({ jobs, total, page, limit });
      }

      // GET /api/jobs/mine (employer's own jobs)
      if (s1 === 'mine' && method === 'GET') {
        const user = await getUserFromRequest(request);
        if (!user) return err('Unauthorized', 401);
        const jobs = await db.collection('jobs').find({ createdBy: user.id }, { projection: { _id: 0 } }).sort({ createdAt: -1 }).toArray();
        
        // Attach application counts
        const ids = jobs.map(j => j.id);
        const counts = await db.collection('applications').aggregate([
          { $match: { jobId: { $in: ids } } },
          { $group: { _id: '$jobId', count: { $sum: 1 } } },
        ]).toArray();
        const countMap = Object.fromEntries(counts.map(c => [c._id, c.count]));
        jobs.forEach(j => { j.applicantCount = countMap[j.id] || 0; });
        await attachLogos(db, jobs);
        return json({ jobs });
      }

      // GET /api/jobs/:id
      if (segs.length === 2 && method === 'GET') {
        const job = await db.collection('jobs').findOne({ id: s1 }, { projection: { _id: 0 } });
        if (!job) return err('Not found', 404);
        const arr = [job];
        await attachLogos(db, arr);
        return json({ job: arr[0] });
      }

      // POST /api/jobs (employer, premium)
      if (segs.length === 1 && method === 'POST') {
        const user = await getUserFromRequest(request);
        if (!user) return err('Unauthorized', 401);
        if (user.role !== 'EMPLOYER' && user.role !== 'employer') return err('Only employers can post jobs', 403);
        // Premium subscription gate (employers must be premium to post jobs)
        const empUser = await db.collection('users').findOne({ id: user.id });
        if (!empUser?.isPremium && !empUser?.premium) return err('Premium subscription required to post jobs', 402);
        const body = await request.json();
        const { title, description, requiredSkills = [], experienceRequired = 0, companyName, companyLogo, location, salary = 0, category = 'General' } = body || {};
        if (!title || !description || !companyName || !location) return err('Missing fields');
        // Fallback: pull logo from company profile if not provided
        let logo = companyLogo || '';
        if (!logo) {
          const comp = await db.collection('companies').findOne({ createdBy: user.id });
          logo = comp?.logo || '';
        }
        const job = {
          id: uuidv4(),
          title,
          description,
          category,
          requiredSkills: Array.isArray(requiredSkills) ? requiredSkills : String(requiredSkills).split(',').map(s => s.trim()).filter(Boolean),
          experienceRequired: Number(experienceRequired) || 0,
          companyName,
          companyLogo: logo,
          logo: logo,
          location,
          salary: Number(salary) || 0,
          createdBy: user.id,
          createdByName: user.name,
          createdAt: new Date(),
        };
        await db.collection('jobs').insertOne(job);
        const { _id, ...safe } = job;
        return json({ job: safe });
      }

      // PUT /api/jobs/:id (employer own)
      if (segs.length === 2 && method === 'PUT') {
        const user = await getUserFromRequest(request);
        if (!user) return err('Unauthorized', 401);
        const job = await db.collection('jobs').findOne({ id: s1 });
        if (!job) return err('Not found', 404);
        if (user.role !== 'ADMIN' && job.createdBy !== user.id) return err('Forbidden', 403);
        const body = await request.json();
        const update = {};
        ['title', 'description', 'companyName', 'location'].forEach(k => { if (body[k] !== undefined) update[k] = body[k]; });
        if (body.requiredSkills !== undefined) {
          update.requiredSkills = Array.isArray(body.requiredSkills) ? body.requiredSkills : String(body.requiredSkills).split(',').map(s => s.trim()).filter(Boolean);
        }
        if (body.experienceRequired !== undefined) update.experienceRequired = Number(body.experienceRequired) || 0;
        if (body.salary !== undefined) update.salary = Number(body.salary) || 0;
        await db.collection('jobs').updateOne({ id: s1 }, { $set: update });
        return json({ ok: true });
      }

      // DELETE /api/jobs/:id
      if (segs.length === 2 && method === 'DELETE') {
        const user = await getUserFromRequest(request);
        if (!user) return err('Unauthorized', 401);
        const job = await db.collection('jobs').findOne({ id: s1 });
        if (!job) return err('Not found', 404);
        if (user.role !== 'ADMIN' && job.createdBy !== user.id) return err('Forbidden', 403);
        await db.collection('jobs').deleteOne({ id: s1 });
        await db.collection('applications').deleteMany({ jobId: s1 });
        return json({ ok: true });
      }

    }

    // ======= RESUME UPLOAD =======
    if (s0 === 'upload' && s1 === 'resume' && method === 'POST') {
      const user = await getUserFromRequest(request);
      if (!user) return err('Unauthorized', 401);
      const formData = await request.formData();
      const file = formData.get('file');
      if (!file || typeof file.arrayBuffer !== 'function') return err('No file provided');
      if (file.size > 10 * 1024 * 1024) return err('File too large (max 10MB)');
      const allowed = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      // Some browsers send empty content-type; also check extension
      const name = file.name || 'resume';
      const extOk = /\.(pdf|doc|docx)$/i.test(name);
      if (!allowed.includes(file.type) && !extOk) return err('Only PDF/DOC/DOCX allowed');
      const buf = Buffer.from(await file.arrayBuffer());
      const publicId = `resume_${user.id}_${Date.now()}`;
      const result = await uploadBufferToCloudinary(buf, {
        resource_type: 'raw',
        folder: 'resumes',
        public_id: publicId,
        use_filename: false,
        unique_filename: false,
        format: name.split('.').pop().toLowerCase(),
      });
      return json({ url: result.secure_url, publicId: result.public_id, bytes: result.bytes, name });
    }

    // ======= PROFILE (candidate) =======
    if (s0 === 'profile') {
      const user = await getUserFromRequest(request);
      if (!user) return err('Unauthorized', 401);
      if (segs.length === 1 && method === 'GET') {
        const profile = await db.collection('candidateProfiles').findOne({ userId: user.id }, { projection: { _id: 0 } });
        return json({ profile: profile || null, user });
      }
      if (segs.length === 1 && method === 'PUT') {
        const body = await request.json();
        const { phone, location, skills, experience, education, projects, resumeUrl, resumeName, bio } = body || {};
        const update = {
          userId: user.id,
          phone: phone || '',
          location: location || '',
          skills: Array.isArray(skills) ? skills : (typeof skills === 'string' ? skills.split(',').map(s => s.trim()).filter(Boolean) : []),
          experience: Number(experience) || 0,
          education: education || '',
          projects: projects || '',
          resumeUrl: resumeUrl || '',
          resumeName: resumeName || '',
          bio: bio || '',
          updatedAt: new Date(),
        };
        await db.collection('candidateProfiles').updateOne(
          { userId: user.id },
          { $set: update, $setOnInsert: { createdAt: new Date() } },
          { upsert: true }
        );
        return json({ ok: true, profile: update });
      }
    }

    // ======= APPLICATIONS =======
    if (s0 === 'applications') {
      const user = await getUserFromRequest(request);
      if (!user) return err('Unauthorized', 401);

      // POST /api/applications
      if (segs.length === 1 && method === 'POST') {
        if (user.role !== 'CANDIDATE') return err('Only candidates can apply', 403);
        const body = await request.json();
        const { jobId, resumeUrl, resumeName } = body || {};
        if (!jobId || !resumeUrl) return err('Missing fields');
        const job = await db.collection('jobs').findOne({ id: jobId });
        if (!job) return err('Job not found', 404);
        const existing = await db.collection('applications').findOne({ jobId, candidateId: user.id });
        if (existing) return err('Already applied', 409);
        // Resolve company logo
        let logo = job.companyLogo || job.logo || '';
        if (!logo) {
          const comp = await db.collection('companies').findOne({ name: job.companyName });
          logo = comp?.logo || '';
        }
        const application = {
          id: uuidv4(),
          jobId,
          jobTitle: job.title,
          companyName: job.companyName,
          companyLogo: logo,
          candidateId: user.id,
          candidateName: user.name,
          candidateEmail: user.email,
          resumeUrl,
          resumeName: resumeName || 'resume',
          status: 'APPLIED',
          appliedAt: new Date(),
        };
        await db.collection('applications').insertOne(application);
        const { _id, ...safe } = application;
        return json({ application: safe });
      }

      // GET /api/applications/mine (candidate)
      if (s1 === 'mine' && method === 'GET') {
        const apps = await db.collection('applications').find({ candidateId: user.id }, { projection: { _id: 0 } }).sort({ appliedAt: -1 }).toArray();
        // Attach company logo for older applications missing it
        const missing = [...new Set(apps.filter(a => !a.companyLogo).map(a => a.companyName).filter(Boolean))];
        if (missing.length > 0) {
          const comps = await db.collection('companies').find({ name: { $in: missing } }, { projection: { name: 1, logo: 1, _id: 0 } }).toArray();
          const cmap = Object.fromEntries(comps.map(c => [c.name, c.logo]));
          apps.forEach(a => { if (!a.companyLogo) a.companyLogo = cmap[a.companyName] || ''; });
        }
        return json({ applications: apps });
      }

      // GET /api/applications/job/:jobId (employer)
      if (s1 === 'job' && s2 && method === 'GET') {
        const job = await db.collection('jobs').findOne({ id: s2 });
        if (!job) return err('Job not found', 404);
        if (user.role !== 'ADMIN' && job.createdBy !== user.id) return err('Forbidden', 403);
        const apps = await db.collection('applications').find({ jobId: s2 }, { projection: { _id: 0 } }).sort({ appliedAt: -1 }).toArray();

        // Enrich with candidate profiles for skill matching
        const candidateIds = apps.map(a => a.candidateId);
        const profiles = await db.collection('candidateProfiles').find({ userId: { $in: candidateIds } }, { projection: { _id: 0 } }).toArray();
        const profMap = Object.fromEntries(profiles.map(p => [p.userId, p]));
        const required = (job.requiredSkills || []).map(s => s.toLowerCase());
        apps.forEach(a => {
          const p = profMap[a.candidateId];
          a.candidateSkills = p?.skills || [];
          a.candidateExperience = p?.experience || 0;
          const cand = (p?.skills || []).map(s => s.toLowerCase());
          const matches = required.filter(r => cand.some(c => c.includes(r) || r.includes(c))).length;
          a.matchScore = required.length ? Math.round((matches / required.length) * 100) : 0;
        });
        apps.sort((a, b) => b.matchScore - a.matchScore);
        return json({ applications: apps, job: { id: job.id, title: job.title, companyName: job.companyName } });
      }

      // PATCH /api/applications/:id  body: {status}
      if (segs.length === 2 && method === 'PATCH') {
        const body = await request.json();
        const { status } = body || {};
        if (!['APPLIED', 'SHORTLISTED', 'REJECTED'].includes(status)) return err('Invalid status');
        const app = await db.collection('applications').findOne({ id: s1 });
        if (!app) return err('Not found', 404);
        const job = await db.collection('jobs').findOne({ id: app.jobId });
        if (!job) return err('Job not found', 404);
        if (user.role !== 'ADMIN' && job.createdBy !== user.id) return err('Forbidden', 403);
        await db.collection('applications').updateOne({ id: s1 }, { $set: { status } });
        return json({ ok: true });
      }
    }

    // ======= PAYMENT (Razorpay) =======
    if (s0 === 'payment') {
      if (s1 === 'create-order' && method === 'POST') {
        const user = await getUserFromRequest(request);
        if (!user) return err('Unauthorized', 401);
        const body = await request.json();
        const amount = Number(body?.amount) || 499; // default 499 INR
        const order = await razorpay.orders.create({
          amount: amount * 100, // paise
          currency: 'INR',
          receipt: `rcpt_${user.id.slice(0, 8)}_${Date.now()}`,
          notes: { userId: user.id, purpose: 'premium_upgrade' },
        });
        return json({
          orderId: order.id,
          amount: order.amount,
          currency: order.currency,
          keyId: process.env.RAZORPAY_KEY_ID,
        });
      }

      if (s1 === 'verify' && method === 'POST') {
        const user = await getUserFromRequest(request);
        if (!user) return err('Unauthorized', 401);
        const body = await request.json();
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature, amount } = body || {};
        const valid = verifyRazorpaySignature({ razorpay_order_id, razorpay_payment_id, razorpay_signature });
        if (!valid) return err('Signature verification failed', 400);
        // Mark premium
        await db.collection('users').updateOne({ id: user.id }, { $set: { isPremium: true } });
        const payment = {
          id: uuidv4(),
          userId: user.id,
          userName: user.name,
          userEmail: user.email,
          amount: Number(amount) || 499,
          razorpayOrderId: razorpay_order_id,
          razorpayPaymentId: razorpay_payment_id,
          razorpaySignature: razorpay_signature,
          status: 'SUCCESS',
          createdAt: new Date(),
        };
        await db.collection('payments').insertOne(payment);
        return json({ ok: true, isPremium: true });
      }
    }

    // ============ COMMUNITY ============
    if (s0 === 'community' && method === 'GET') {
      const items = await db.collection('community').find({}).sort({ createdAt: -1 }).toArray();
      return json({ items });
    }
    if (s0 === 'community' && method === 'POST') {
      const u = await getUserFromRequest(request);
      if (!u) return err('Unauthorized', 401);
      const body = await request.json();
      const item = { id: uuidv4(), ...body, userId: u.id, userName: u.name, userRole: u.role, createdAt: new Date(), likes: 0, comments: [] };
      await db.collection('community').insertOne(item);
      return json(item);
    }

    // ============ EMPLOYER / COMPANY ============
    if (s0 === 'employer' && s1 === 'company') {
      const u = await getUserFromRequest(request);
      if (!u) return err('Unauthorized', 401);
      if (u.role !== 'EMPLOYER' && u.role !== 'ADMIN') return err('Forbidden', 403);
      if (method === 'GET') {
        const company = await db.collection('companies').findOne({ employerId: u.id });
        return json({ company });
      }
      if (method === 'POST') {
        const body = await request.json();
        const existing = await db.collection('companies').findOne({ employerId: u.id });
        if (existing) {
          await db.collection('companies').updateOne({ employerId: u.id }, { $set: { ...body, updatedAt: new Date() } });
          return json({ ...existing, ...body });
        } else {
          const item = { id: uuidv4(), ...body, employerId: u.id, createdAt: new Date() };
          await db.collection('companies').insertOne(item);
          return json(item);
        }
      }
    }

    // ============ PUBLIC COLLECTIONS ============
    if (['companies', 'freelance', 'academy'].includes(s0) && method === 'GET') {
      const items = await db.collection(s0).find({}).toArray();
      if (s0 === 'companies') {
        const enriched = await Promise.all(items.map(async (c) => {
          const jobs = await db.collection('jobs').find({ companyName: c.name }).toArray();
          // Make sure jobs returned with a company carry the company logo
          jobs.forEach(j => {
            if (!j.logo) j.logo = j.companyLogo || c.logo || '';
            if (!j.companyLogo) j.companyLogo = c.logo || '';
          });
          return { ...c, jobs };
        }));
        return json({ companies: enriched });
      }
      return json({ [s0]: items, items });
    }

    // ======= ADMIN =======
    if (s0 === 'admin') {
      const user = await getUserFromRequest(request);
      if (!user) return err('Unauthorized', 401);
      if (user.role !== 'ADMIN') return err('Forbidden', 403);

      if (s1 === 'stats' && method === 'GET') {
        const [userCount, jobCount, appCount, payAgg] = await Promise.all([
          db.collection('users').countDocuments({}),
          db.collection('jobs').countDocuments({}),
          db.collection('applications').countDocuments({}),
          db.collection('payments').aggregate([{ $match: { status: 'SUCCESS' } }, { $group: { _id: null, total: { $sum: '$amount' } } }]).toArray(),
        ]);
        const revenue = payAgg[0]?.total || 0;
        const premiumCount = await db.collection('users').countDocuments({ isPremium: true });
        return json({ userCount, jobCount, appCount, revenue, premiumCount });
      }
      if (s1 === 'users' && method === 'GET') {
        const users = await db.collection('users').find({}, { projection: { _id: 0, password: 0 } }).sort({ createdAt: -1 }).toArray();
        return json({ users });
      }
      if (s1 === 'users' && s2 && method === 'DELETE') {
        await db.collection('users').deleteOne({ id: s2 });
        await db.collection('jobs').deleteMany({ createdBy: s2 });
        await db.collection('applications').deleteMany({ candidateId: s2 });
        return json({ ok: true });
      }
      if (s1 === 'users' && s2 && segs[3] === 'premium' && method === 'PATCH') {
        const body = await request.json();
        const val = !!body?.isPremium;
        await db.collection('users').updateOne({ id: s2 }, { $set: { isPremium: val } });
        return json({ ok: true });
      }
      if (s1 === 'jobs' && method === 'GET') {
        const jobs = await db.collection('jobs').find({}, { projection: { _id: 0 } }).sort({ createdAt: -1 }).toArray();
        return json({ jobs });
      }
      if (s1 === 'payments' && method === 'GET') {
        const payments = await db.collection('payments').find({}, { projection: { _id: 0 } }).sort({ createdAt: -1 }).toArray();
        return json({ payments });
      }

      if (s1 === 'reports' && method === 'GET') {
        const type = s2;
        if (type === 'candidates') {
          const candidates = await db.collection('users').find({ role: 'CANDIDATE' }, { projection: { _id: 0, password: 0 } }).toArray();
          const profiles = await db.collection('candidateProfiles').find({}, { projection: { _id: 0 } }).toArray();
          const profileMap = Object.fromEntries(profiles.map(p => [p.userId, p]));
          const apps = await db.collection('applications').aggregate([{ $group: { _id: '$candidateId', count: { $sum: 1 } } }]).toArray();
          const appMap = Object.fromEntries(apps.map(a => [a._id, a.count]));

          const report = candidates.map(c => {
            const p = profileMap[c.id] || {};
            return {
              'Name': c.name || '',
              'Phone': p.phone || '',
              'Email': c.email || '',
              'Address': p.location || '',
              'State': '',
              'DOB': '',
              'Gender': '',
              'Marital Status': '',
              'Nationality': '',
              'Industry': '',
              "Company's Strength": '',
              "Candidate's Designation": '',
              'Total Experience': p.experience || '',
              'Linkedin Profile Link': '',
              'Website/Portal Link': '',
              'Highest Educational Degree/Diploma': p.education || '',
              'Operating Since': '',
              'RCM Jobs Registration Date': c.createdAt ? new Date(c.createdAt).toLocaleDateString() : '',
              'Year of Certification (Education)': '',
              'Board/University': '',
              "Current/Last Organization's Name": '',
              'Current/Last Designation': '',
              "All Organization's Names": '',
              'Total Applications': '',
              'Qualified Candidates': '',
              'Interview Conducted': '',
              'Speciality/Department': '',
              'Work Location': '',
              'Ready to relocate?': '',
              "First Organization's Joining date/Year": '',
              'Offers Released': '',
              'Offer Accepted': '',
              'Specialities Worked (as of now)': '',
              'PMS Worked (as of now)': '',
              "Last/Current Organization's Jonining Date/Year": '',
              "Last/Current Organization's Leaving Date/Year": '',
              'Total Cost': '',
              'Last/Current Posting Date': '',
              'Hospital/Physician Billing Experience': '',
              'Calling Experience Duration': '',
              'Languages Known': '',
              'Resume Uploaded?': p.resumeUrl ? 'Yes' : 'No',
              'Last/Current Posting Job': '',
              'Last/Current Job Posting ID': '',
              'Top Profile Posting': '',
              'Current/Last Salary Drawn': '',
              'Salary Expectation': '',
              'Hiring Status': '',
              'Skills': (p.skills || []).join(', '),
              'Hobbies': '',
              'Achievements': '',
              'Notice Period': '',
              'Total Jobs Applied': appMap[c.id] || 0,
              'Total Interview Scheduled': '',
              'Registration Source': '',
              'Last Activity Date': '',
              'Profile Score': '',
              'Questions Attempted': '',
              '# of Referrences': '',
              'Referred by': '',
              'Other Industry candidate would ilke to work': '',
              'Additional Professional Certifications': '',
              'Salary increase % age after joining RCM Jobs': '',
              'Favorite Places to Visit': '',
              'Favorite Food': '',
              "Life's Goal": '',
              'Favorite Time Pass': '',
              'Changes you want to bring in RCM': '',
              'Your Ideal': '',
              'Which social media platform you would like to access the most?': '',
              'Which all trainings you would like to get for yourself?': '',
              'Did you ever try to start up your own business?': '',
              'If yes, which industry you tried business in?': '',
              'Out of these which of the items you spend the most?': '',
            };
          });
          return json({ report });
        }
        
        if (type === 'employers') {
          const companies = await db.collection('companies').find({}, { projection: { _id: 0 } }).toArray();
          const jobsAgg = await db.collection('jobs').aggregate([{ $group: { _id: '$companyName', count: { $sum: 1 } } }]).toArray();
          const jobsMap = Object.fromEntries(jobsAgg.map(j => [j._id, j.count]));

          const report = companies.map(c => {
            return {
              "Company's Name": c.name || '',
              "Contact Person": '',
              "Phone": '',
              "Fax": '',
              "Operating Since": '',
              "Total Jobs Posted": jobsMap[c.name] || 0,
              "Total Views": '',
            };
          });
          return json({ report });
        }

        if (type === 'jobs') {
          const jobs = await db.collection('jobs').find({}, { projection: { _id: 0 } }).toArray();
          const apps = await db.collection('applications').find({}, { projection: { _id: 0 } }).toArray();
          
          const report = [];
          for (const job of jobs) {
            const jobApps = apps.filter(a => a.jobId === job.id);
            if (jobApps.length === 0) {
              report.push({
                "Job Posting ID": job.id,
                "Job Posting Title": job.title,
                "Company's Name": job.companyName,
                "Applied Candidate Name": ""
              });
            } else {
              for (const app of jobApps) {
                report.push({
                  "Job Posting ID": job.id,
                  "Job Posting Title": job.title,
                  "Company's Name": job.companyName,
                  "Applied Candidate Name": app.candidateName || ""
                });
              }
            }
          }
          return json({ report });
        }
        
        return err('Invalid report type', 400);
      }

      // NEW ADMIN SECTIONS
      if (s1 === 'companies') {
        if (method === 'GET') return json({ companies: await db.collection('companies').find({}, { projection: { _id: 0 } }).sort({ name: 1 }).toArray() });
        if (method === 'POST') {
          const body = await request.json();
          const item = { id: uuidv4(), ...body, createdAt: new Date() };
          await db.collection('companies').insertOne(item);
          return json(item);
        }
        if (s2 && method === 'DELETE') { await db.collection('companies').deleteOne({ id: s2 }); return json({ ok: true }); }
      }
      if (s1 === 'freelance') {
        if (method === 'GET') return json({ items: await db.collection('freelance').find({}, { projection: { _id: 0 } }).sort({ createdAt: -1 }).toArray() });
        if (method === 'POST') {
          const body = await request.json();
          const item = { id: uuidv4(), ...body, createdAt: new Date() };
          await db.collection('freelance').insertOne(item);
          return json(item);
        }
        if (s2 && method === 'DELETE') { await db.collection('freelance').deleteOne({ id: s2 }); return json({ ok: true }); }
      }
      if (s1 === 'academy') {
        if (method === 'GET') return json({ items: await db.collection('academy').find({}, { projection: { _id: 0 } }).sort({ createdAt: -1 }).toArray() });
        if (method === 'POST') {
          const body = await request.json();
          const item = { id: uuidv4(), ...body, createdAt: new Date() };
          await db.collection('academy').insertOne(item);
          return json(item);
        }
        if (s2 && method === 'DELETE') { await db.collection('academy').deleteOne({ id: s2 }); return json({ ok: true }); }
      }
      if (s1 === 'community') {
        if (method === 'GET') return json({ items: await db.collection('community').find({}, { projection: { _id: 0 } }).sort({ createdAt: -1 }).toArray() });
        if (method === 'POST') {
          const body = await request.json();
          const item = { id: uuidv4(), ...body, createdAt: new Date() };
          await db.collection('community').insertOne(item);
          return json(item);
        }
        if (s2 && method === 'DELETE') { await db.collection('community').deleteOne({ id: s2 }); return json({ ok: true }); }
      }
    }

    // Public GET endpoints for the new sections
    if (s0 === 'companies' && method === 'GET') return json({ companies: await db.collection('companies').find({}, { projection: { _id: 0 } }).sort({ name: 1 }).toArray() });
    if (s0 === 'freelance' && method === 'GET') return json({ items: await db.collection('freelance').find({}, { projection: { _id: 0 } }).sort({ createdAt: -1 }).toArray() });
    if (s0 === 'academy' && method === 'GET') return json({ items: await db.collection('academy').find({}, { projection: { _id: 0 } }).sort({ createdAt: -1 }).toArray() });
    if (s0 === 'community' && method === 'GET') return json({ items: await db.collection('community').find({}, { projection: { _id: 0 } }).sort({ createdAt: -1 }).toArray() });

    return err('Not found', 404);
  } catch (e) {
    console.error('API error', e);
    return err(e?.message || 'Server error', 500);
  }
}

export const GET = route;
export const POST = route;
export const PUT = route;
export const PATCH = route;
export const DELETE = route;
