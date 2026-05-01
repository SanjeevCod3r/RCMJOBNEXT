'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Briefcase, Search, MapPin, DollarSign, Clock, Upload, FileText, LogOut, User, Plus,
  Crown, Trash2, CheckCircle2, XCircle, Star, Building2, GraduationCap, Users, BarChart3,
  IndianRupee, Sparkles, ArrowRight, Loader2,
} from 'lucide-react';

const HERO_IMG = 'https://images.unsplash.com/photo-1573497161223-d9c42d7b0bad?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NTYxOTB8MHwxfHNlYXJjaHwxfHxjYXJlZXIlMjBwcm9mZXNzaW9uYWxzfGVufDB8fHxibHVlfDE3Nzc2NTY3MjR8MA&ixlib=rb-4.1.0&q=85';

const api = async (path, options = {}) => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  const headers = { ...(options.headers || {}) };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  if (options.body && !(options.body instanceof FormData) && !headers['Content-Type']) {
    headers['Content-Type'] = 'application/json';
  }
  const res = await fetch(`/api${path}`, { ...options, headers });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || 'Request failed');
  return data;
};

function App() {
  const [view, setView] = useState('home');
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedJobId, setSelectedJobId] = useState(null);
  const [viewingJobApplicantsId, setViewingJobApplicantsId] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const token = localStorage.getItem('token');
        if (token) {
          const { user } = await api('/auth/me');
          setUser(user);
        }
      } catch (e) {
        localStorage.removeItem('token');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    setView('home');
    toast.success('Logged out');
  };

  const goDashboard = () => {
    if (!user) return setView('login');
    if (user.role === 'ADMIN') setView('adminDash');
    else if (user.role === 'EMPLOYER') setView('employerDash');
    else setView('candidateDash');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <Navbar user={user} view={view} setView={setView} logout={logout} goDashboard={goDashboard} />
      <main>
        {view === 'home' && <Home setView={setView} setSelectedJobId={setSelectedJobId} user={user} />}
        {view === 'jobs' && <Jobs setView={setView} setSelectedJobId={setSelectedJobId} user={user} />}
        {view === 'jobDetails' && <JobDetails jobId={selectedJobId} setView={setView} user={user} onApplied={() => setView('candidateDash')} />}
        {view === 'login' && <AuthPage mode="login" setUser={setUser} setView={setView} onSuccess={goDashboard} />}
        {view === 'register' && <AuthPage mode="register" setUser={setUser} setView={setView} onSuccess={goDashboard} />}
        {view === 'candidateDash' && <CandidateDashboard user={user} setUser={setUser} setView={setView} setSelectedJobId={setSelectedJobId} />}
        {view === 'employerDash' && <EmployerDashboard user={user} setUser={setUser} setView={setView} setViewingJobApplicantsId={setViewingJobApplicantsId} />}
        {view === 'applicants' && <ApplicantsView jobId={viewingJobApplicantsId} setView={setView} />}
        {view === 'adminDash' && <AdminDashboard setView={setView} />}
        {view === 'premium' && <PremiumPage user={user} setUser={setUser} setView={setView} />}
        {view === 'postJob' && <PostJobPage user={user} setUser={setUser} setView={setView} />}
        {view === 'profile' && <ProfilePage user={user} setUser={setUser} />}
      </main>
      <Footer />
    </div>
  );
}

// ============ NAVBAR ============
function Navbar({ user, view, setView, logout, goDashboard }) {
  return (
    <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-slate-200">
      <div className="container mx-auto px-6 py-3 flex items-center justify-between">
        <button onClick={() => setView('home')} className="flex items-center gap-2 font-bold text-xl">
          <div className="h-9 w-9 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center">
            <Briefcase className="h-5 w-5 text-white" />
          </div>
          <span>CareerConnect</span>
        </button>
        <nav className="hidden md:flex items-center gap-6 text-sm">
          <button onClick={() => setView('home')} className={`hover:text-blue-600 ${view === 'home' ? 'text-blue-600 font-medium' : 'text-slate-600'}`}>Home</button>
          <button onClick={() => setView('jobs')} className={`hover:text-blue-600 ${view === 'jobs' ? 'text-blue-600 font-medium' : 'text-slate-600'}`}>Browse Jobs</button>
          {user && <button onClick={goDashboard} className="text-slate-600 hover:text-blue-600">Dashboard</button>}
        </nav>
        <div className="flex items-center gap-2">
          {user ? (
            <>
              {user.isPremium && <Badge className="bg-gradient-to-r from-amber-500 to-orange-500 text-white border-0"><Crown className="h-3 w-3 mr-1" />Premium</Badge>}
              <span className="hidden sm:inline text-sm text-slate-700">Hi, {user.name.split(' ')[0]}</span>
              <Button variant="ghost" size="icon" onClick={logout} title="Logout"><LogOut className="h-4 w-4" /></Button>
            </>
          ) : (
            <>
              <Button variant="ghost" onClick={() => setView('login')}>Log in</Button>
              <Button onClick={() => setView('register')} className="bg-blue-600 hover:bg-blue-700">Sign up</Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

// ============ HOME ============
function Home({ setView, setSelectedJobId, user }) {
  const [jobs, setJobs] = useState([]);
  const [q, setQ] = useState('');

  useEffect(() => {
    api('/jobs?limit=6').then(d => setJobs(d.jobs || [])).catch(() => {});
  }, []);

  const onSearch = (e) => {
    e.preventDefault();
    setView('jobs');
  };

  return (
    <div>
      {/* HERO */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 text-white">
        <div className="container mx-auto px-6 py-20 md:py-28 grid md:grid-cols-2 gap-10 items-center">
          <div>
            <Badge className="bg-white/20 text-white border-0 mb-4 backdrop-blur"><Sparkles className="h-3 w-3 mr-1" /> Trusted by top employers</Badge>
            <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-5">
              Find the job <br />made for you.
            </h1>
            <p className="text-lg md:text-xl text-blue-100 mb-8 max-w-lg">
              Search thousands of openings, apply with your resume in one click, and track your applications in real time.
            </p>
            <form onSubmit={onSearch} className="flex flex-col sm:flex-row gap-3 bg-white rounded-xl p-2 shadow-2xl">
              <div className="flex-1 flex items-center gap-2 px-3">
                <Search className="h-5 w-5 text-slate-400" />
                <input
                  className="flex-1 outline-none text-slate-900 py-2"
                  placeholder="Job title, keyword or company"
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                />
              </div>
              <Button type="submit" size="lg" className="bg-blue-600 hover:bg-blue-700">Search Jobs <ArrowRight className="h-4 w-4 ml-1" /></Button>
            </form>
            <div className="flex items-center gap-8 mt-8 text-sm text-blue-100">
              <div><span className="text-2xl font-bold text-white">10k+</span><br />Active jobs</div>
              <div><span className="text-2xl font-bold text-white">2k+</span><br />Companies</div>
              <div><span className="text-2xl font-bold text-white">95%</span><br />Match rate</div>
            </div>
          </div>
          <div className="hidden md:block">
            <div className="relative">
              <img src={HERO_IMG} alt="Professionals at work" className="rounded-2xl shadow-2xl w-full object-cover h-[420px]" />
              <div className="absolute -bottom-6 -left-6 bg-white text-slate-900 rounded-xl p-4 shadow-xl w-64">
                <div className="flex items-center gap-2 mb-2">
                  <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                    <CheckCircle2 className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <div className="font-semibold text-sm">Application submitted</div>
                    <div className="text-xs text-slate-500">Senior Engineer @ Acme</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* RECENT JOBS */}
      <section className="container mx-auto px-6 py-16">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold">Latest Opportunities</h2>
            <p className="text-slate-600 mt-1">Hand-picked jobs from premium employers</p>
          </div>
          <Button variant="outline" onClick={() => setView('jobs')}>View all <ArrowRight className="h-4 w-4 ml-1" /></Button>
        </div>
        {jobs.length === 0 ? (
          <EmptyState icon={Briefcase} title="No jobs posted yet" subtitle="Be the first employer to post — upgrade to premium to get started." action={user?.role === 'EMPLOYER' ? { label: 'Go Premium', onClick: () => setView('premium') } : null} />
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {jobs.map(job => <JobCard key={job.id} job={job} onClick={() => { setSelectedJobId(job.id); setView('jobDetails'); }} />)}
          </div>
        )}
      </section>

      {/* CTA STRIP */}
      <section className="bg-slate-900 text-white py-16">
        <div className="container mx-auto px-6 grid md:grid-cols-2 gap-8 items-center">
          <div>
            <h3 className="text-3xl font-bold mb-3">Hiring? Post jobs to reach top talent.</h3>
            <p className="text-slate-300">Upgrade to Premium for ₹499 and unlock unlimited job postings + applicant match scores.</p>
          </div>
          <div className="flex gap-3 md:justify-end">
            <Button size="lg" className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600" onClick={() => setView(user ? 'premium' : 'register')}>
              <Crown className="h-4 w-4 mr-2" /> Go Premium
            </Button>
            <Button size="lg" variant="outline" className="bg-transparent border-white text-white hover:bg-white hover:text-slate-900" onClick={() => setView('register')}>Get started</Button>
          </div>
        </div>
      </section>
    </div>
  );
}

// ============ JOB CARD ============
function JobCard({ job, onClick }) {
  return (
    <Card onClick={onClick} className="hover:shadow-lg hover:-translate-y-0.5 transition cursor-pointer border-slate-200">
      <CardHeader>
        <div className="flex items-start gap-3">
          <div className="h-11 w-11 rounded-lg bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center flex-shrink-0">
            <Building2 className="h-5 w-5 text-blue-600" />
          </div>
          <div className="flex-1 min-w-0">
            <CardTitle className="text-lg truncate">{job.title}</CardTitle>
            <CardDescription className="font-medium text-slate-700">{job.companyName}</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2 text-xs text-slate-600 mb-3">
          <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{job.location}</span>
          {job.salary > 0 && <span className="flex items-center gap-1"><IndianRupee className="h-3 w-3" />{job.salary.toLocaleString()} /yr</span>}
          <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{job.experienceRequired}+ yrs</span>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {(job.requiredSkills || []).slice(0, 4).map(s => <Badge key={s} variant="secondary" className="text-xs">{s}</Badge>)}
          {(job.requiredSkills || []).length > 4 && <Badge variant="outline" className="text-xs">+{job.requiredSkills.length - 4}</Badge>}
        </div>
      </CardContent>
    </Card>
  );
}

// ============ JOBS LIST ============
function Jobs({ setView, setSelectedJobId }) {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [location, setLocation] = useState('');
  const [skill, setSkill] = useState('');
  const [minSalary, setMinSalary] = useState('');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.set('search', search);
      if (location) params.set('location', location);
      if (skill) params.set('skill', skill);
      if (minSalary) params.set('minSalary', minSalary);
      params.set('page', page);
      params.set('limit', '12');
      const d = await api(`/jobs?${params.toString()}`);
      setJobs(d.jobs || []);
      setTotal(d.total || 0);
    } catch (e) { toast.error(e.message); }
    finally { setLoading(false); }
  }, [search, location, skill, minSalary, page]);

  useEffect(() => { load(); }, [load]);

  const totalPages = Math.ceil(total / 12) || 1;

  return (
    <section className="container mx-auto px-6 py-10">
      <h2 className="text-3xl font-bold mb-1">Browse Jobs</h2>
      <p className="text-slate-600 mb-6">{total} opportunities available</p>

      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="grid md:grid-cols-4 gap-3">
            <div className="relative">
              <Search className="h-4 w-4 absolute left-3 top-3 text-slate-400" />
              <Input placeholder="Title, keyword, company" className="pl-9" value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} />
            </div>
            <div className="relative">
              <MapPin className="h-4 w-4 absolute left-3 top-3 text-slate-400" />
              <Input placeholder="Location" className="pl-9" value={location} onChange={e => { setLocation(e.target.value); setPage(1); }} />
            </div>
            <Input placeholder="Skill (e.g. React)" value={skill} onChange={e => { setSkill(e.target.value); setPage(1); }} />
            <Input placeholder="Min salary (INR)" type="number" value={minSalary} onChange={e => { setMinSalary(e.target.value); setPage(1); }} />
          </div>
        </CardContent>
      </Card>

      {loading ? (
        <div className="flex justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-blue-600" /></div>
      ) : jobs.length === 0 ? (
        <EmptyState icon={Search} title="No jobs match your filters" subtitle="Try adjusting your search criteria." />
      ) : (
        <>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {jobs.map(job => <JobCard key={job.id} job={job} onClick={() => { setSelectedJobId(job.id); setView('jobDetails'); }} />)}
          </div>
          <div className="flex justify-center items-center gap-2 mt-8">
            <Button variant="outline" disabled={page <= 1} onClick={() => setPage(p => p - 1)}>Previous</Button>
            <span className="text-sm text-slate-600">Page {page} of {totalPages}</span>
            <Button variant="outline" disabled={page >= totalPages} onClick={() => setPage(p => p + 1)}>Next</Button>
          </div>
        </>
      )}
    </section>
  );
}

// ============ JOB DETAILS ============
function JobDetails({ jobId, setView, user, onApplied }) {
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const d = await api(`/jobs/${jobId}`);
        setJob(d.job);
        if (user?.role === 'CANDIDATE') {
          const p = await api('/profile');
          setProfile(p.profile);
        }
      } catch (e) { toast.error(e.message); }
      finally { setLoading(false); }
    })();
  }, [jobId, user]);

  const apply = async () => {
    if (!user) { toast.error('Please log in first'); return setView('login'); }
    if (user.role !== 'CANDIDATE') return toast.error('Only candidates can apply');
    if (!profile?.resumeUrl) { toast.error('Please upload your resume first'); return setView('profile'); }
    setApplying(true);
    try {
      await api('/applications', { method: 'POST', body: JSON.stringify({ jobId, resumeUrl: profile.resumeUrl, resumeName: profile.resumeName }) });
      toast.success('Application submitted!');
      onApplied?.();
    } catch (e) { toast.error(e.message); }
    finally { setApplying(false); }
  };

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="h-8 w-8 animate-spin" /></div>;
  if (!job) return <EmptyState icon={XCircle} title="Job not found" />;

  return (
    <section className="container mx-auto px-6 py-10 max-w-4xl">
      <Button variant="ghost" onClick={() => setView('jobs')} className="mb-4">← Back to jobs</Button>
      <Card>
        <CardHeader>
          <div className="flex items-start gap-4">
            <div className="h-14 w-14 rounded-xl bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center">
              <Building2 className="h-7 w-7 text-blue-600" />
            </div>
            <div className="flex-1">
              <CardTitle className="text-2xl">{job.title}</CardTitle>
              <CardDescription className="text-base">{job.companyName}</CardDescription>
              <div className="flex flex-wrap gap-3 mt-3 text-sm text-slate-600">
                <span className="flex items-center gap-1"><MapPin className="h-4 w-4" />{job.location}</span>
                {job.salary > 0 && <span className="flex items-center gap-1"><IndianRupee className="h-4 w-4" />{job.salary.toLocaleString()} /yr</span>}
                <span className="flex items-center gap-1"><Clock className="h-4 w-4" />{job.experienceRequired}+ years</span>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="font-semibold mb-2">Required Skills</h3>
            <div className="flex flex-wrap gap-2">
              {(job.requiredSkills || []).map(s => <Badge key={s} className="bg-blue-100 text-blue-800 hover:bg-blue-100">{s}</Badge>)}
            </div>
          </div>
          <div>
            <h3 className="font-semibold mb-2">Job Description</h3>
            <p className="text-slate-700 whitespace-pre-wrap">{job.description}</p>
          </div>
        </CardContent>
        <CardFooter className="border-t pt-6">
          <Button size="lg" onClick={apply} disabled={applying} className="bg-blue-600 hover:bg-blue-700 w-full sm:w-auto">
            {applying ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Applying...</> : <>Apply with Resume <ArrowRight className="h-4 w-4 ml-2" /></>}
          </Button>
        </CardFooter>
      </Card>
    </section>
  );
}

// ============ AUTH ============
function AuthPage({ mode, setUser, setView, onSuccess }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('CANDIDATE');
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const endpoint = mode === 'login' ? '/auth/login' : '/auth/register';
      const body = mode === 'login' ? { email, password } : { name, email, password, role };
      const d = await api(endpoint, { method: 'POST', body: JSON.stringify(body) });
      localStorage.setItem('token', d.token);
      setUser(d.user);
      toast.success(mode === 'login' ? 'Welcome back!' : 'Account created!');
      setTimeout(() => {
        if (d.user.role === 'ADMIN') setView('adminDash');
        else if (d.user.role === 'EMPLOYER') setView('employerDash');
        else setView('candidateDash');
      }, 50);
    } catch (err) { toast.error(err.message); }
    finally { setLoading(false); }
  };

  return (
    <section className="container mx-auto px-6 py-16 max-w-md">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">{mode === 'login' ? 'Welcome back' : 'Create your account'}</CardTitle>
          <CardDescription>{mode === 'login' ? 'Log in to continue' : 'Join CareerConnect in seconds'}</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={submit} className="space-y-4">
            {mode === 'register' && (
              <div>
                <Label>Full name</Label>
                <Input required value={name} onChange={e => setName(e.target.value)} placeholder="Jane Doe" />
              </div>
            )}
            <div>
              <Label>Email</Label>
              <Input required type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" />
            </div>
            <div>
              <Label>Password</Label>
              <Input required type="password" minLength={6} value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" />
            </div>
            {mode === 'register' && (
              <div>
                <Label>I am a</Label>
                <Select value={role} onValueChange={setRole}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="CANDIDATE">Job seeker (Candidate)</SelectItem>
                    <SelectItem value="EMPLOYER">Employer (hiring)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
            <Button type="submit" disabled={loading} className="w-full bg-blue-600 hover:bg-blue-700">
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : (mode === 'login' ? 'Log in' : 'Create account')}
            </Button>
          </form>
          <div className="mt-4 text-center text-sm text-slate-600">
            {mode === 'login' ? (
              <>Don't have an account? <button onClick={() => setView('register')} className="text-blue-600 font-medium">Sign up</button></>
            ) : (
              <>Already have an account? <button onClick={() => setView('login')} className="text-blue-600 font-medium">Log in</button></>
            )}
          </div>
        </CardContent>
      </Card>
    </section>
  );
}

// ============ CANDIDATE DASHBOARD ============
function CandidateDashboard({ user, setView, setSelectedJobId }) {
  const [apps, setApps] = useState([]);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const [a, p] = await Promise.all([api('/applications/mine'), api('/profile')]);
        setApps(a.applications || []);
        setProfile(p.profile);
      } catch (e) { toast.error(e.message); }
      finally { setLoading(false); }
    })();
  }, []);

  const statusColor = (s) => s === 'APPLIED' ? 'bg-blue-100 text-blue-800' : s === 'SHORTLISTED' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800';

  return (
    <section className="container mx-auto px-6 py-10">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">Welcome, {user.name.split(' ')[0]}!</h1>
          <p className="text-slate-600">Track your applications and manage your profile.</p>
        </div>
        <Button onClick={() => setView('profile')} variant="outline"><User className="h-4 w-4 mr-2" />Edit Profile</Button>
      </div>

      {!profile?.resumeUrl && (
        <Card className="mb-6 border-amber-300 bg-amber-50">
          <CardContent className="pt-6 flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-3">
              <Upload className="h-8 w-8 text-amber-600" />
              <div>
                <div className="font-semibold">Upload your resume to apply for jobs</div>
                <div className="text-sm text-slate-600">Your resume helps employers find you.</div>
              </div>
            </div>
            <Button onClick={() => setView('profile')} className="bg-amber-600 hover:bg-amber-700">Upload resume</Button>
          </CardContent>
        </Card>
      )}

      <div className="grid md:grid-cols-3 gap-4 mb-6">
        <StatCard icon={FileText} label="Applications" value={apps.length} color="blue" />
        <StatCard icon={CheckCircle2} label="Shortlisted" value={apps.filter(a => a.status === 'SHORTLISTED').length} color="green" />
        <StatCard icon={Clock} label="In review" value={apps.filter(a => a.status === 'APPLIED').length} color="amber" />
      </div>

      <Card>
        <CardHeader className="flex-row items-center justify-between">
          <div>
            <CardTitle>Your Applications</CardTitle>
            <CardDescription>Track your job applications</CardDescription>
          </div>
          <Button onClick={() => setView('jobs')} variant="outline"><Search className="h-4 w-4 mr-2" />Find jobs</Button>
        </CardHeader>
        <CardContent>
          {loading ? <Loader2 className="h-6 w-6 animate-spin" /> : apps.length === 0 ? (
            <EmptyState icon={FileText} title="No applications yet" subtitle="Start exploring jobs and apply." action={{ label: 'Browse Jobs', onClick: () => setView('jobs') }} />
          ) : (
            <div className="space-y-3">
              {apps.map(a => (
                <div key={a.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-slate-50 cursor-pointer" onClick={() => { setSelectedJobId(a.jobId); setView('jobDetails'); }}>
                  <div>
                    <div className="font-semibold">{a.jobTitle}</div>
                    <div className="text-sm text-slate-600">{a.companyName} • Applied {new Date(a.appliedAt).toLocaleDateString()}</div>
                  </div>
                  <Badge className={statusColor(a.status)}>{a.status}</Badge>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </section>
  );
}

// ============ PROFILE PAGE ============
function ProfilePage({ user, setUser }) {
  const [profile, setProfile] = useState({ phone: '', location: '', skills: '', experience: 0, education: '', projects: '', resumeUrl: '', resumeName: '', bio: '' });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef();

  useEffect(() => {
    api('/profile').then(d => {
      if (d.profile) {
        setProfile({ ...d.profile, skills: (d.profile.skills || []).join(', ') });
      }
    }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const uploadResume = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append('file', file);
      const r = await api('/upload/resume', { method: 'POST', body: fd });
      setProfile(p => ({ ...p, resumeUrl: r.url, resumeName: r.name }));
      toast.success('Resume uploaded!');
    } catch (err) { toast.error(err.message); }
    finally { setUploading(false); if (fileRef.current) fileRef.current.value = ''; }
  };

  const save = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const body = { ...profile, skills: profile.skills };
      await api('/profile', { method: 'PUT', body: JSON.stringify(body) });
      toast.success('Profile saved');
    } catch (err) { toast.error(err.message); }
    finally { setSaving(false); }
  };

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="h-8 w-8 animate-spin" /></div>;

  return (
    <section className="container mx-auto px-6 py-10 max-w-3xl">
      <h1 className="text-3xl font-bold mb-6">My Profile</h1>
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Resume</CardTitle>
          <CardDescription>Upload your PDF or DOC resume (max 10MB)</CardDescription>
        </CardHeader>
        <CardContent>
          {profile.resumeUrl ? (
            <div className="flex items-center justify-between p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center gap-3">
                <FileText className="h-8 w-8 text-green-600" />
                <div>
                  <div className="font-semibold">{profile.resumeName || 'resume'}</div>
                  <a href={profile.resumeUrl} target="_blank" rel="noreferrer" className="text-sm text-blue-600 hover:underline">View uploaded file</a>
                </div>
              </div>
              <Button variant="outline" onClick={() => fileRef.current?.click()} disabled={uploading}>
                {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Replace'}
              </Button>
            </div>
          ) : (
            <Button onClick={() => fileRef.current?.click()} disabled={uploading}>
              {uploading ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Uploading...</> : <><Upload className="h-4 w-4 mr-2" /> Upload Resume</>}
            </Button>
          )}
          <input ref={fileRef} type="file" hidden accept=".pdf,.doc,.docx" onChange={uploadResume} />
        </CardContent>
      </Card>

      <form onSubmit={save}>
        <Card>
          <CardHeader>
            <CardTitle>Profile Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div><Label>Phone</Label><Input value={profile.phone} onChange={e => setProfile(p => ({ ...p, phone: e.target.value }))} /></div>
              <div><Label>Location</Label><Input value={profile.location} onChange={e => setProfile(p => ({ ...p, location: e.target.value }))} placeholder="Bangalore, India" /></div>
            </div>
            <div><Label>Skills (comma-separated)</Label><Input value={profile.skills} onChange={e => setProfile(p => ({ ...p, skills: e.target.value }))} placeholder="React, Node.js, MongoDB" /></div>
            <div className="grid md:grid-cols-2 gap-4">
              <div><Label>Experience (years)</Label><Input type="number" min="0" value={profile.experience} onChange={e => setProfile(p => ({ ...p, experience: e.target.value }))} /></div>
              <div><Label>Education</Label><Input value={profile.education} onChange={e => setProfile(p => ({ ...p, education: e.target.value }))} placeholder="B.Tech CS, IIT" /></div>
            </div>
            <div><Label>Bio</Label><Textarea rows={3} value={profile.bio} onChange={e => setProfile(p => ({ ...p, bio: e.target.value }))} placeholder="Tell employers about yourself..." /></div>
            <div><Label>Projects</Label><Textarea rows={3} value={profile.projects} onChange={e => setProfile(p => ({ ...p, projects: e.target.value }))} placeholder="Notable projects..." /></div>
          </CardContent>
          <CardFooter><Button type="submit" disabled={saving} className="bg-blue-600 hover:bg-blue-700">{saving ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Save Profile'}</Button></CardFooter>
        </Card>
      </form>
    </section>
  );
}

// ============ EMPLOYER DASHBOARD ============
function EmployerDashboard({ user, setView, setViewingJobApplicantsId }) {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    try { const d = await api('/jobs/mine'); setJobs(d.jobs || []); }
    catch (e) { toast.error(e.message); }
    finally { setLoading(false); }
  };
  useEffect(() => { load(); }, []);

  const remove = async (id) => {
    if (!confirm('Delete this job and all applications?')) return;
    try { await api(`/jobs/${id}`, { method: 'DELETE' }); toast.success('Deleted'); load(); }
    catch (e) { toast.error(e.message); }
  };

  return (
    <section className="container mx-auto px-6 py-10">
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div>
          <h1 className="text-3xl font-bold">Employer Dashboard</h1>
          <p className="text-slate-600">Manage your job postings and view applicants.</p>
        </div>
        {user.isPremium ? (
          <Button onClick={() => setView('postJob')} className="bg-blue-600 hover:bg-blue-700"><Plus className="h-4 w-4 mr-2" />Post a Job</Button>
        ) : (
          <Button onClick={() => setView('premium')} className="bg-gradient-to-r from-amber-500 to-orange-500"><Crown className="h-4 w-4 mr-2" />Upgrade to Post Jobs</Button>
        )}
      </div>

      {!user.isPremium && (
        <Card className="mb-6 border-amber-300 bg-gradient-to-r from-amber-50 to-orange-50">
          <CardContent className="pt-6 flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-3">
              <Crown className="h-10 w-10 text-amber-600" />
              <div>
                <div className="font-bold">Unlock unlimited job postings</div>
                <div className="text-sm text-slate-600">Upgrade to Premium for just ₹499 and start hiring today.</div>
              </div>
            </div>
            <Button onClick={() => setView('premium')} className="bg-gradient-to-r from-amber-500 to-orange-500">Go Premium</Button>
          </CardContent>
        </Card>
      )}

      <div className="grid md:grid-cols-3 gap-4 mb-6">
        <StatCard icon={Briefcase} label="Active Jobs" value={jobs.length} color="blue" />
        <StatCard icon={Users} label="Total Applicants" value={jobs.reduce((s, j) => s + (j.applicantCount || 0), 0)} color="green" />
        <StatCard icon={Crown} label="Status" value={user.isPremium ? 'Premium' : 'Free'} color="amber" />
      </div>

      <Card>
        <CardHeader><CardTitle>Your Jobs</CardTitle></CardHeader>
        <CardContent>
          {loading ? <Loader2 className="h-6 w-6 animate-spin" /> : jobs.length === 0 ? (
            <EmptyState icon={Briefcase} title="No jobs posted yet" subtitle={user.isPremium ? "Post your first job now." : "Upgrade to premium to start posting."} action={user.isPremium ? { label: 'Post a Job', onClick: () => setView('postJob') } : { label: 'Go Premium', onClick: () => setView('premium') }} />
          ) : (
            <div className="space-y-3">
              {jobs.map(j => (
                <div key={j.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <div className="font-semibold">{j.title}</div>
                    <div className="text-sm text-slate-600">{j.companyName} • {j.location} • {j.applicantCount} applicant{j.applicantCount !== 1 ? 's' : ''}</div>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={() => { setViewingJobApplicantsId(j.id); setView('applicants'); }}>
                      <Users className="h-4 w-4 mr-1" />Applicants
                    </Button>
                    <Button size="sm" variant="ghost" onClick={() => remove(j.id)}><Trash2 className="h-4 w-4 text-red-500" /></Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </section>
  );
}

// ============ POST JOB PAGE ============
function PostJobPage({ user, setView }) {
  const [form, setForm] = useState({ title: '', companyName: '', location: '', description: '', requiredSkills: '', experienceRequired: 0, salary: 0 });
  const [saving, setSaving] = useState(false);

  if (!user.isPremium) {
    return (
      <section className="container mx-auto px-6 py-20 max-w-lg text-center">
        <Crown className="h-16 w-16 text-amber-500 mx-auto mb-4" />
        <h2 className="text-2xl font-bold mb-2">Premium required</h2>
        <p className="text-slate-600 mb-6">Upgrade to Premium to post jobs.</p>
        <Button onClick={() => setView('premium')} className="bg-gradient-to-r from-amber-500 to-orange-500">Upgrade now</Button>
      </section>
    );
  }

  const submit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api('/jobs', { method: 'POST', body: JSON.stringify(form) });
      toast.success('Job posted!');
      setView('employerDash');
    } catch (err) { toast.error(err.message); }
    finally { setSaving(false); }
  };

  return (
    <section className="container mx-auto px-6 py-10 max-w-2xl">
      <Button variant="ghost" onClick={() => setView('employerDash')} className="mb-4">← Back</Button>
      <Card>
        <CardHeader><CardTitle>Post a New Job</CardTitle><CardDescription>Reach thousands of qualified candidates</CardDescription></CardHeader>
        <CardContent>
          <form onSubmit={submit} className="space-y-4">
            <div><Label>Job title</Label><Input required value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} placeholder="Senior Frontend Engineer" /></div>
            <div className="grid md:grid-cols-2 gap-4">
              <div><Label>Company</Label><Input required value={form.companyName} onChange={e => setForm(f => ({ ...f, companyName: e.target.value }))} /></div>
              <div><Label>Location</Label><Input required value={form.location} onChange={e => setForm(f => ({ ...f, location: e.target.value }))} placeholder="Remote / Bangalore" /></div>
            </div>
            <div><Label>Required skills (comma-separated)</Label><Input required value={form.requiredSkills} onChange={e => setForm(f => ({ ...f, requiredSkills: e.target.value }))} placeholder="React, TypeScript, Node.js" /></div>
            <div className="grid md:grid-cols-2 gap-4">
              <div><Label>Experience (years)</Label><Input type="number" min="0" value={form.experienceRequired} onChange={e => setForm(f => ({ ...f, experienceRequired: e.target.value }))} /></div>
              <div><Label>Salary (INR /year)</Label><Input type="number" min="0" value={form.salary} onChange={e => setForm(f => ({ ...f, salary: e.target.value }))} /></div>
            </div>
            <div><Label>Description</Label><Textarea rows={6} required value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} placeholder="Describe the role, responsibilities, qualifications..." /></div>
            <Button type="submit" disabled={saving} className="bg-blue-600 hover:bg-blue-700">{saving ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Publish Job'}</Button>
          </form>
        </CardContent>
      </Card>
    </section>
  );
}

// ============ APPLICANTS VIEW ============
function ApplicantsView({ jobId, setView }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    try { const d = await api(`/applications/job/${jobId}`); setData(d); }
    catch (e) { toast.error(e.message); }
    finally { setLoading(false); }
  };
  useEffect(() => { load(); }, [jobId]);

  const updateStatus = async (appId, status) => {
    try { await api(`/applications/${appId}`, { method: 'PATCH', body: JSON.stringify({ status }) }); toast.success(`Marked as ${status}`); load(); }
    catch (e) { toast.error(e.message); }
  };

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="h-8 w-8 animate-spin" /></div>;

  return (
    <section className="container mx-auto px-6 py-10">
      <Button variant="ghost" onClick={() => setView('employerDash')} className="mb-4">← Back</Button>
      <h1 className="text-2xl font-bold mb-1">Applicants for {data?.job?.title}</h1>
      <p className="text-slate-600 mb-6">{data?.applications?.length || 0} applicants (sorted by skill match)</p>
      {data?.applications?.length === 0 ? (
        <EmptyState icon={Users} title="No applicants yet" />
      ) : (
        <div className="space-y-3">
          {data.applications.map(a => (
            <Card key={a.id}>
              <CardContent className="pt-6">
                <div className="flex items-start justify-between gap-4 flex-wrap">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center font-semibold text-blue-700">
                        {a.candidateName.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div className="font-semibold">{a.candidateName}</div>
                        <div className="text-sm text-slate-600">{a.candidateEmail} • {a.candidateExperience} yrs exp</div>
                      </div>
                      <Badge className={`${a.matchScore >= 70 ? 'bg-green-100 text-green-800' : a.matchScore >= 40 ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-700'}`}>
                        <Star className="h-3 w-3 mr-1" />{a.matchScore}% match
                      </Badge>
                    </div>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {(a.candidateSkills || []).slice(0, 6).map(s => <Badge key={s} variant="secondary" className="text-xs">{s}</Badge>)}
                    </div>
                  </div>
                  <div className="flex flex-col gap-2 items-end">
                    <Badge className={a.status === 'APPLIED' ? 'bg-blue-100 text-blue-800' : a.status === 'SHORTLISTED' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>{a.status}</Badge>
                    <a href={a.resumeUrl} target="_blank" rel="noreferrer" className="text-sm text-blue-600 hover:underline flex items-center gap-1"><FileText className="h-3 w-3" />View resume</a>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" onClick={() => updateStatus(a.id, 'SHORTLISTED')} className="text-green-700 border-green-300 hover:bg-green-50"><CheckCircle2 className="h-3 w-3 mr-1" />Shortlist</Button>
                      <Button size="sm" variant="outline" onClick={() => updateStatus(a.id, 'REJECTED')} className="text-red-700 border-red-300 hover:bg-red-50"><XCircle className="h-3 w-3 mr-1" />Reject</Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </section>
  );
}

// ============ PREMIUM PAGE ============
function PremiumPage({ user, setUser, setView }) {
  const [loading, setLoading] = useState(false);

  if (user?.isPremium) {
    return (
      <section className="container mx-auto px-6 py-20 max-w-lg text-center">
        <Crown className="h-16 w-16 text-amber-500 mx-auto mb-4" />
        <h2 className="text-2xl font-bold mb-2">You're already Premium!</h2>
        <p className="text-slate-600 mb-6">Enjoy unlimited posting and all premium features.</p>
        <Button onClick={() => setView('employerDash')}>Go to dashboard</Button>
      </section>
    );
  }

  const pay = async () => {
    setLoading(true);
    try {
      const order = await api('/payment/create-order', { method: 'POST', body: JSON.stringify({ amount: 499 }) });
      const rzp = new window.Razorpay({
        key: order.keyId,
        amount: order.amount,
        currency: order.currency,
        name: 'CareerConnect Premium',
        description: 'Lifetime premium access',
        order_id: order.orderId,
        prefill: { name: user?.name, email: user?.email },
        theme: { color: '#2563eb' },
        handler: async (response) => {
          try {
            await api('/payment/verify', { method: 'POST', body: JSON.stringify({ ...response, amount: 499 }) });
            toast.success('Payment successful! You are now Premium 🎉');
            const { user: refreshed } = await api('/auth/me');
            setUser(refreshed);
            setView('employerDash');
          } catch (e) { toast.error('Verification failed: ' + e.message); }
        },
        modal: { ondismiss: () => setLoading(false) },
      });
      rzp.on('payment.failed', (resp) => { toast.error('Payment failed'); setLoading(false); });
      rzp.open();
    } catch (e) { toast.error(e.message); setLoading(false); }
  };

  return (
    <section className="container mx-auto px-6 py-16 max-w-2xl">
      <Card className="overflow-hidden border-0 shadow-2xl">
        <div className="bg-gradient-to-br from-amber-500 via-orange-500 to-red-500 text-white p-10 text-center">
          <Crown className="h-16 w-16 mx-auto mb-4" />
          <h1 className="text-4xl font-bold mb-2">CareerConnect Premium</h1>
          <p className="text-white/90">Unlock unlimited hiring power</p>
          <div className="mt-6">
            <span className="text-6xl font-bold">₹499</span>
            <span className="text-white/80 ml-2">lifetime</span>
          </div>
        </div>
        <CardContent className="p-8">
          <ul className="space-y-3 mb-8">
            {['Post unlimited jobs', 'View applicant skill-match scores', 'Shortlist & reject applicants', 'Priority support', 'No hidden fees'].map(f => (
              <li key={f} className="flex items-center gap-2"><CheckCircle2 className="h-5 w-5 text-green-600" />{f}</li>
            ))}
          </ul>
          <Button onClick={pay} disabled={!user || loading} size="lg" className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-lg py-6">
            {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <>Pay ₹499 with Razorpay <ArrowRight className="h-5 w-5 ml-2" /></>}
          </Button>
          <p className="text-xs text-slate-500 text-center mt-3">Test mode — use card 4111 1111 1111 1111, any CVV/date.</p>
        </CardContent>
      </Card>
    </section>
  );
}

// ============ ADMIN DASHBOARD ============
function AdminDashboard({ setView }) {
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [payments, setPayments] = useState([]);

  const load = async () => {
    try {
      const [s, u, j, p] = await Promise.all([api('/admin/stats'), api('/admin/users'), api('/admin/jobs'), api('/admin/payments')]);
      setStats(s); setUsers(u.users); setJobs(j.jobs); setPayments(p.payments);
    } catch (e) { toast.error(e.message); }
  };
  useEffect(() => { load(); }, []);

  const deleteUser = async (id) => { if (!confirm('Delete user?')) return; await api(`/admin/users/${id}`, { method: 'DELETE' }); toast.success('Deleted'); load(); };
  const deleteJob = async (id) => { if (!confirm('Delete job?')) return; await api(`/jobs/${id}`, { method: 'DELETE' }); toast.success('Deleted'); load(); };
  const togglePremium = async (u) => { await api(`/admin/users/${u.id}/premium`, { method: 'PATCH', body: JSON.stringify({ isPremium: !u.isPremium }) }); toast.success('Updated'); load(); };

  return (
    <section className="container mx-auto px-6 py-10">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
      <div className="grid md:grid-cols-4 gap-4 mb-6">
        <StatCard icon={Users} label="Users" value={stats?.userCount ?? '—'} color="blue" />
        <StatCard icon={Briefcase} label="Jobs" value={stats?.jobCount ?? '—'} color="indigo" />
        <StatCard icon={Crown} label="Premium" value={stats?.premiumCount ?? '—'} color="amber" />
        <StatCard icon={IndianRupee} label="Revenue" value={`₹${stats?.revenue ?? 0}`} color="green" />
      </div>

      <Tabs defaultValue="users">
        <TabsList>
          <TabsTrigger value="users">Users ({users.length})</TabsTrigger>
          <TabsTrigger value="jobs">Jobs ({jobs.length})</TabsTrigger>
          <TabsTrigger value="payments">Payments ({payments.length})</TabsTrigger>
        </TabsList>
        <TabsContent value="users">
          <Card><CardContent className="pt-6">
            <div className="space-y-2">
              {users.map(u => (
                <div key={u.id} className="flex items-center justify-between p-3 border rounded-lg flex-wrap gap-2">
                  <div>
                    <div className="font-semibold">{u.name} <Badge variant="outline" className="ml-2">{u.role}</Badge></div>
                    <div className="text-sm text-slate-600">{u.email}</div>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant={u.isPremium ? 'default' : 'outline'} onClick={() => togglePremium(u)}><Crown className="h-3 w-3 mr-1" />{u.isPremium ? 'Premium' : 'Set premium'}</Button>
                    <Button size="sm" variant="ghost" onClick={() => deleteUser(u.id)}><Trash2 className="h-4 w-4 text-red-500" /></Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent></Card>
        </TabsContent>
        <TabsContent value="jobs">
          <Card><CardContent className="pt-6">
            <div className="space-y-2">
              {jobs.map(j => (
                <div key={j.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div><div className="font-semibold">{j.title}</div><div className="text-sm text-slate-600">{j.companyName} • {j.location}</div></div>
                  <Button size="sm" variant="ghost" onClick={() => deleteJob(j.id)}><Trash2 className="h-4 w-4 text-red-500" /></Button>
                </div>
              ))}
            </div>
          </CardContent></Card>
        </TabsContent>
        <TabsContent value="payments">
          <Card><CardContent className="pt-6">
            <div className="space-y-2">
              {payments.map(p => (
                <div key={p.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div><div className="font-semibold">{p.userName} — ₹{p.amount}</div><div className="text-xs text-slate-500 font-mono">{p.razorpayPaymentId}</div></div>
                  <Badge className="bg-green-100 text-green-800">{p.status}</Badge>
                </div>
              ))}
              {payments.length === 0 && <div className="text-slate-500 text-center py-6">No payments yet</div>}
            </div>
          </CardContent></Card>
        </TabsContent>
      </Tabs>
    </section>
  );
}

// ============ SHARED ============
function StatCard({ icon: Icon, label, value, color = 'blue' }) {
  const colors = { blue: 'bg-blue-100 text-blue-600', green: 'bg-green-100 text-green-600', amber: 'bg-amber-100 text-amber-600', indigo: 'bg-indigo-100 text-indigo-600' };
  return (
    <Card>
      <CardContent className="pt-6 flex items-center gap-4">
        <div className={`h-12 w-12 rounded-lg flex items-center justify-center ${colors[color]}`}><Icon className="h-6 w-6" /></div>
        <div><div className="text-sm text-slate-600">{label}</div><div className="text-2xl font-bold">{value}</div></div>
      </CardContent>
    </Card>
  );
}

function EmptyState({ icon: Icon, title, subtitle, action }) {
  return (
    <div className="text-center py-12">
      <Icon className="h-12 w-12 text-slate-300 mx-auto mb-3" />
      <h3 className="font-semibold text-lg">{title}</h3>
      {subtitle && <p className="text-slate-500 mt-1">{subtitle}</p>}
      {action && <Button onClick={action.onClick} className="mt-4 bg-blue-600 hover:bg-blue-700">{action.label}</Button>}
    </div>
  );
}

function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-400 mt-20 py-10">
      <div className="container mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Briefcase className="h-5 w-5" />
          <span className="font-semibold text-white">CareerConnect</span>
        </div>
        <div className="text-sm">© 2025 CareerConnect. Built with Next.js, MongoDB, Cloudinary & Razorpay.</div>
      </div>
    </footer>
  );
}

export default App;
