'use client';

import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Users, Briefcase, Building2, Zap, BookOpen, IndianRupee, Crown, Trash2, Loader2, ArrowLeft, Plus, Layers } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer } from 'recharts';

const chartData = [
  { name: 'Mon', revenue: 4000, users: 240 },
  { name: 'Tue', revenue: 3000, users: 139 },
  { name: 'Wed', revenue: 2000, users: 980 },
  { name: 'Thu', revenue: 2780, users: 390 },
  { name: 'Fri', revenue: 1890, users: 480 },
  { name: 'Sat', revenue: 2390, users: 380 },
  { name: 'Sun', revenue: 3490, users: 430 },
];

const api = async (path, options = {}) => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  const headers = { ...(options.headers || {}) };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  if (!(options.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
  }
  const res = await fetch(`/api${path}`, { ...options, headers });
  if (!res.ok) {
    let msg = 'API Error';
    try { const d = await res.json(); msg = d.error || d.message || msg; } catch (e) {}
    throw new Error(msg);
  }
  return res.json();
};

function StatCard({ icon: Icon, label, value, color = 'blue' }) {
  const colors = {
    blue: 'from-blue-500 to-indigo-600 shadow-blue-500/20 text-blue-50',
    green: 'from-emerald-500 to-teal-600 shadow-emerald-500/20 text-emerald-50',
    amber: 'from-amber-400 to-orange-500 shadow-amber-500/20 text-amber-50',
    indigo: 'from-indigo-600 to-purple-600 shadow-indigo-600/20 text-indigo-50',
    emerald: 'from-emerald-400 to-emerald-600 shadow-emerald-500/20 text-emerald-50',
    orange: 'from-orange-500 to-rose-500 shadow-orange-500/20 text-orange-50',
    purple: 'from-purple-500 to-pink-600 shadow-purple-500/20 text-purple-50',
  };
  return (
    <Card className="border-none shadow-xl shadow-slate-200/50 rounded-[2rem] overflow-hidden bg-white relative group">
      <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${colors[color]} opacity-50 group-hover:opacity-100 transition-opacity`} />
      <CardContent className="p-8">
        <div className="flex items-center justify-between mb-6">
          <div className={`h-14 w-14 rounded-2xl flex items-center justify-center bg-gradient-to-br ${colors[color]} shadow-lg group-hover:scale-110 transition-transform duration-500`}>
            <Icon className="h-6 w-6 text-white" />
          </div>
          <div className="text-4xl font-black text-slate-900 tracking-tight drop-shadow-sm">{value}</div>
        </div>
        <div className="text-sm font-bold text-slate-400 uppercase tracking-widest">{label}</div>
      </CardContent>
    </Card>
  );
}

function EmptyState({ icon: Icon, title, subtitle }) {
  return (
    <div className="text-center py-24 bg-slate-50/50 rounded-[2.5rem] border border-dashed border-slate-200">
      <div className="h-24 w-24 bg-white rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-xl shadow-slate-200/50 rotate-3 hover:rotate-0 transition-transform duration-500">
        <Icon className="h-10 w-10 text-indigo-300" />
      </div>
      <h3 className="text-2xl font-bold text-slate-900 mb-3 tracking-tight">{title}</h3>
      {subtitle && <p className="text-slate-500 font-medium max-w-sm mx-auto">{subtitle}</p>}
    </div>
  );
}

function AdminTabContent({ value, items, type, onAdd, onDelete }) {
  return (
    <TabsContent value={value} className="m-0 focus:outline-none">
      <Card className="border-none shadow-2xl shadow-slate-200/50 rounded-[2.5rem] bg-white overflow-hidden">
        <div className="p-8 border-b border-slate-50 flex justify-between items-center bg-white">
          <div>
            <h3 className="text-2xl font-bold text-slate-900 tracking-tight capitalize">{type} Directory</h3>
            <p className="text-sm font-medium text-slate-500 mt-1">Manage {type} data across the platform.</p>
          </div>
          <Button onClick={onAdd} className="bg-indigo-600 hover:bg-indigo-700 h-12 px-6 rounded-2xl font-bold shadow-xl shadow-indigo-600/20 transition-all hover:scale-105 active:scale-95">
            <Plus className="h-5 w-5 mr-2" />Add New
          </Button>
        </div>
        <CardContent className="p-0 max-h-[700px] overflow-y-auto custom-scrollbar">
          {items.map((i, idx) => (
            <div key={i.id} className={`flex items-center justify-between p-6 hover:bg-slate-50/80 transition-colors group ${idx !== items.length - 1 ? 'border-b border-slate-50' : ''}`}>
              <div className="flex items-center gap-6">
                {i.image || i.logo ? (
                  <img src={i.image || i.logo} alt="" className="w-16 h-16 rounded-[1.25rem] object-cover shadow-sm" />
                ) : (
                  <div className="w-16 h-16 rounded-[1.25rem] bg-gradient-to-br from-indigo-50 to-purple-50 border border-indigo-100/50 flex items-center justify-center text-indigo-600 font-bold text-2xl shadow-sm group-hover:scale-105 transition-transform">
                    {(i.name || i.title || '?').charAt(0)}
                  </div>
                )}
                <div>
                  <div className="font-bold text-xl text-slate-900 line-clamp-1 group-hover:text-indigo-600 transition-colors">{i.title || i.name}</div>
                  <div className="text-sm font-medium text-slate-500 line-clamp-1 mt-1">{i.description || i.bio || 'No description provided'}</div>
                </div>
              </div>
              <Button size="icon" variant="ghost" className="h-12 w-12 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-2xl opacity-0 group-hover:opacity-100 transition-all" onClick={() => onDelete(i.id)}>
                <Trash2 className="h-5 w-5" />
              </Button>
            </div>
          ))}
          {items.length === 0 && <div className="p-12"><EmptyState icon={Layers} title={`No ${type} found`} subtitle="Click the button above to add the first record." /></div>}
        </CardContent>
      </Card>
    </TabsContent>
  );
}

export default function AdminPage() {
  const router = useRouter();
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [payments, setPayments] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [freelance, setFreelance] = useState([]);
  const [academy, setAcademy] = useState([]);
  const [community, setCommunity] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    try {
      const { user } = await api('/auth/me');
      if (user.role !== 'ADMIN' && user.role !== 'SUPERADMIN') {
        toast.error('Unauthorized');
        router.push('/');
        return;
      }
      const [s, u, j, p, c, f, a, co] = await Promise.all([
        api('/admin/stats'), api('/admin/users'), api('/admin/jobs'), api('/admin/payments'),
        api('/admin/companies'), api('/admin/freelance'), api('/admin/academy'), api('/admin/community')
      ]);
      setStats(s); setUsers(u.users); setJobs(j.jobs); setPayments(p.payments);
      setCompanies(c.companies); setFreelance(f.items); setAcademy(a.items); setCommunity(co.items);
    } catch (e) { 
      toast.error(e.message || 'Error loading dashboard'); 
      if (e.message !== 'Unauthorized') router.push('/');
    }
    finally { setLoading(false); }
  };
  
  useEffect(() => { load(); }, []);

  const deleteItem = async (type, id) => {
    if (!confirm('Are you sure?')) return;
    try {
      await api(`/admin/${type}/${id}`, { method: 'DELETE' });
      toast.success('Deleted');
      load();
    } catch (e) { toast.error(e.message); }
  };

  const addItem = async (type) => {
    const title = prompt(`Enter ${type} title/name:`);
    if (!title) return;
    const description = prompt(`Enter ${type} description:`);
    const image = prompt(`Enter ${type} image URL (optional):`);
    try {
      await api(`/admin/${type}`, { method: 'POST', body: JSON.stringify({ [type === 'companies' ? 'name' : 'title']: title, description, image, category: 'General' }) });
      toast.success('Added');
      load();
    } catch (e) { toast.error(e.message); }
  };

  const togglePremium = async (u) => { 
    await api(`/admin/users/${u.id}/premium`, { method: 'PATCH', body: JSON.stringify({ isPremium: !u.isPremium }) }); 
    toast.success('Updated'); 
    load(); 
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-slate-50"><Loader2 className="h-10 w-10 animate-spin text-indigo-600" /></div>;

  return (
    <div className="min-h-screen bg-[#F8F9FD] text-slate-900 font-sans relative overflow-hidden pb-20">
      {/* Animated Background Blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-indigo-500/10 rounded-full blur-[120px] pointer-events-none animate-pulse" />
      <div className="absolute bottom-[10%] right-[-10%] w-[600px] h-[600px] bg-purple-500/10 rounded-full blur-[120px] pointer-events-none animate-pulse" style={{ animationDelay: '2s' }} />

      {/* Header */}
      <div className="bg-white/70 backdrop-blur-2xl border-b border-slate-200/50 py-4 px-6 sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto flex justify-between items-center max-w-[1400px]">
          <div className="flex items-center gap-5">
            <Link href="/">
              <Button variant="ghost" size="icon" className="h-12 w-12 rounded-2xl bg-white shadow-sm border border-slate-100 hover:bg-slate-50 text-slate-500 hover:scale-105 transition-all">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <div className="h-8 w-[1px] bg-slate-200" />
            <div className="flex flex-col">
              <h1 className="text-2xl font-black tracking-tight text-slate-900 flex items-center gap-2 drop-shadow-sm">
                <Crown className="h-6 w-6 text-indigo-600 drop-shadow-md" /> RCM<span className="text-indigo-600">Admin</span>
              </h1>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Enterprise Control Center</span>
            </div>
          </div>
          <Button onClick={load} className="h-12 px-6 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold shadow-xl shadow-indigo-600/20 transition-all hover:scale-105 group border-0">
            <Zap className="h-4 w-4 mr-2 group-hover:rotate-12 transition-transform" /> Sync Data
          </Button>
        </div>
      </div>

      <section className="container mx-auto px-6 py-12 max-w-[1400px] relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
          <StatCard icon={Users} label="Total Users" value={stats?.userCount ?? '—'} color="blue" />
          <StatCard icon={Briefcase} label="Active Jobs" value={stats?.jobCount ?? '—'} color="indigo" />
          <StatCard icon={Building2} label="Companies" value={companies.length} color="emerald" />
          <StatCard icon={IndianRupee} label="Total Revenue" value={`₹${stats?.revenue ?? 0}`} color="green" />
        </div>

        <Tabs defaultValue="overview" className="grid lg:grid-cols-4 gap-10">
          {/* Left Sidebar */}
          <div className="lg:col-span-1 space-y-8">
            <Card className="border-none shadow-2xl shadow-slate-200/40 rounded-[2.5rem] bg-white overflow-hidden sticky top-32">
              <div className="p-6 border-b border-slate-50 bg-gradient-to-r from-indigo-50 to-white">
                 <h4 className="font-bold text-slate-900 text-sm uppercase tracking-widest">Navigation</h4>
              </div>
              <TabsList className="flex flex-col h-auto w-full bg-transparent p-4 gap-2 border-0">
                {['overview', 'users', 'jobs', 'companies', 'community', 'payments'].map((tab) => (
                  <TabsTrigger 
                    key={tab} 
                    value={tab}
                    className="w-full justify-start rounded-2xl px-5 py-4 font-bold text-slate-500 hover:bg-slate-50 hover:text-indigo-600 data-[state=active]:bg-indigo-600 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-indigo-600/20 capitalize tracking-wide transition-all text-left"
                  >
                    {tab}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Card>
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-3 min-h-[600px]">
            <TabsContent value="overview" className="space-y-8 m-0 focus:outline-none">
              <Card className="border-none shadow-2xl shadow-slate-200/50 rounded-[2.5rem] bg-white overflow-hidden p-8">
                <div className="mb-8">
                  <h3 className="text-2xl font-bold text-slate-900 tracking-tight">Platform Growth</h3>
                  <p className="text-sm font-medium text-slate-500 mt-1">Revenue trends over the last 7 days.</p>
                </div>
                <div className="h-[400px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                      <defs>
                        <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#4F46E5" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#4F46E5" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94A3B8', fontSize: 12, fontWeight: 600 }} dy={10} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94A3B8', fontSize: 12, fontWeight: 600 }} dx={-10} />
                      <RechartsTooltip 
                        contentStyle={{ borderRadius: '1.5rem', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)', fontWeight: 'bold' }}
                      />
                      <Area type="monotone" dataKey="revenue" stroke="#4F46E5" strokeWidth={4} fillOpacity={1} fill="url(#colorRevenue)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="users" className="m-0 focus:outline-none">
              <Card className="border-none shadow-2xl shadow-slate-200/50 rounded-[2.5rem] bg-white overflow-hidden">
                <div className="p-8 border-b border-slate-50 bg-white">
                  <h3 className="text-2xl font-bold text-slate-900 tracking-tight">User Directory</h3>
                  <p className="text-sm font-medium text-slate-500 mt-1">Manage platform users and roles.</p>
                </div>
                <CardContent className="p-0 max-h-[700px] overflow-y-auto custom-scrollbar">
                {users.map((u, idx) => (
                  <div key={u.id} className={`flex flex-col sm:flex-row sm:items-center justify-between p-6 hover:bg-slate-50/80 transition-colors group ${idx !== users.length - 1 ? 'border-b border-slate-50' : ''}`}>
                    <div className="flex items-center gap-6 mb-4 sm:mb-0">
                      <div className="h-16 w-16 rounded-[1.25rem] bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100/50 flex items-center justify-center text-blue-600 font-bold text-2xl shadow-sm">
                        {u.name.charAt(0)}
                      </div>
                      <div>
                        <div className="font-bold text-xl text-slate-900 flex items-center gap-3">
                          {u.name} 
                          <Badge className={`px-3 py-1 uppercase tracking-widest text-[9px] font-black rounded-full ${u.role === 'ADMIN' ? 'bg-rose-100 text-rose-700' : u.role === 'EMPLOYER' ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-600'}`}>
                            {u.role}
                          </Badge>
                        </div>
                        <div className="text-sm font-medium text-slate-500 mt-1">{u.email}</div>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <Button size="sm" variant={u.isPremium ? 'default' : 'outline'} onClick={() => togglePremium(u)} className={`h-12 px-5 rounded-2xl font-bold transition-all ${u.isPremium ? 'bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-500 hover:to-orange-600 border-0 shadow-xl shadow-amber-500/20 text-white hover:scale-105' : 'border-slate-200 text-slate-600 hover:bg-slate-50'}`}>
                        <Crown className="h-4 w-4 mr-2" />{u.isPremium ? 'Premium Active' : 'Upgrade Premium'}
                      </Button>
                      <Button size="icon" variant="ghost" onClick={() => deleteItem('users', u.id)} className="h-12 w-12 rounded-2xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-all">
                        <Trash2 className="h-5 w-5" />
                      </Button>
                    </div>
                  </div>
                ))}
                {users.length === 0 && <div className="p-12"><EmptyState icon={Users} title="No users found" /></div>}
                </CardContent>
              </Card>
            </TabsContent>

            <AdminTabContent value="jobs" items={jobs} type="jobs" onAdd={() => alert('Jobs should be added via the Employer dashboard.')} onDelete={(id) => deleteItem('jobs', id)} />
            <AdminTabContent value="companies" items={companies} type="companies" onAdd={() => addItem('companies')} onDelete={(id) => deleteItem('companies', id)} />
            <AdminTabContent value="community" items={community} type="community" onAdd={() => addItem('community')} onDelete={(id) => deleteItem('community', id)} />

            <TabsContent value="payments" className="m-0 focus:outline-none">
              <Card className="border-none shadow-2xl shadow-slate-200/50 rounded-[2.5rem] bg-white overflow-hidden">
                <div className="p-8 border-b border-slate-50 bg-white">
                  <h3 className="text-2xl font-bold text-slate-900 tracking-tight">Transaction Ledger</h3>
                  <p className="text-sm font-medium text-slate-500 mt-1">Review all processed payments across the platform.</p>
                </div>
                <CardContent className="p-0 max-h-[700px] overflow-y-auto custom-scrollbar">
                {payments.map((p, idx) => (
                  <div key={p.id} className={`flex items-center justify-between p-6 hover:bg-slate-50/80 transition-colors ${idx !== payments.length - 1 ? 'border-b border-slate-50' : ''}`}>
                    <div className="flex items-center gap-6">
                      <div className="h-16 w-16 rounded-[1.25rem] bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 shadow-sm">
                        <IndianRupee className="h-6 w-6" />
                      </div>
                      <div>
                        <div className="font-bold text-xl text-slate-900 mb-1">{p.userName} <span className="text-slate-300 mx-2">|</span> <span className="text-emerald-600">₹{p.amount}</span></div>
                        <div className="text-xs font-mono font-bold text-slate-400 bg-slate-100 px-3 py-1.5 rounded-lg inline-block">TXN: {p.razorpayPaymentId}</div>
                      </div>
                    </div>
                    <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-200/50 px-4 py-2 h-auto rounded-full font-black text-[10px] tracking-widest shadow-sm">SUCCESS</Badge>
                  </div>
                ))}
                {payments.length === 0 && <div className="p-12"><EmptyState icon={IndianRupee} title="No payments recorded" subtitle="Transactions will appear here once processed." /></div>}
              </CardContent></Card>
            </TabsContent>
          </div>
        </Tabs>
      </section>
    </div>
  );
}
