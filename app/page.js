"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Gamepad2,
  Facebook,
  Twitter,
  Gift,
  Briefcase,
  Search,
  MapPin,
  DollarSign,
  Clock,
  Upload,
  FileText,
  LogOut,
  User,
  Plus,
  Crown,
  Trash2,
  CheckCircle2,
  XCircle,
  Star,
  Building2,
  GraduationCap,
  Users,
  BarChart3,
  IndianRupee,
  Sparkles,
  ArrowRight,
  Loader2,
  Image as LucideImage,
  ChevronDown,
  LayoutDashboard,
  Mail,
  Lock,
  ShieldCheck,
  Heart,
  Globe,
  MessageSquare,
  BookOpen,
  Layers,
  Zap,
  X,
  ArrowLeft,
  MoreHorizontal,
  Phone,
  Linkedin,
  Instagram,
  ChevronLeft,
  ChevronRight,
  Quote,
  HelpCircle,
  CheckCircle,
  Minus,
  Menu,
  Home as HomeIcon,
  Info,
  Award,
  TrendingUp,
  Send,
  Filter,
  Search as SearchIcon,
} from "lucide-react";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Switch } from "@/components/ui/switch";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import Footer from "@/components/Footer";

const HERO_IMG =
  "https://images.unsplash.com/photo-1573497161223-d9c42d7b0bad?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NTYxOTB8MHwxfHNlYXJjaHwxfHxjYXJlZXIlMjBwcm9mZXNzaW9uYWxzfGVufDB8fHxibHVlfDE3Nzc2NTY3MjR8MA&ixlib=rb-4.1.0&q=85";

const api = async (path, options = {}) => {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;
  const headers = { ...(options.headers || {}) };
  if (token) headers["Authorization"] = `Bearer ${token}`;
  if (
    options.body &&
    !(options.body instanceof FormData) &&
    !headers["Content-Type"]
  ) {
    headers["Content-Type"] = "application/json";
  }
  const res = await fetch(`/api${path}`, { ...options, headers });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || "Request failed");
  return data;
};

function App() {
  const [view, setView] = useState("home");
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedJobId, setSelectedJobId] = useState(null);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [viewingJobApplicantsId, setViewingJobApplicantsId] = useState(null);

  const [showInviteModal, setShowInviteModal] = useState(false);
  const [funMode, setFunMode] = useState(false);
  const [showQuizModal, setShowQuizModal] = useState(false);
  const [showGameHub, setShowGameHub] = useState(false);
  const [userPoints, setUserPoints] = useState(0);

  useEffect(() => {
    if (showGameHub) {
      setTimeout(() => {
        const element = document.getElementById("fun-mode-section");
        if (element) {
          element.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }, 100);
    }
  }, [showGameHub]);

  useEffect(() => {
    const saved = localStorage.getItem("rcm_points");
    if (saved) setUserPoints(parseInt(saved));

    (async () => {
      try {
        const token = localStorage.getItem("token");
        if (token) {
          const { user } = await api("/auth/me");
          setUser(user);
        }
      } catch (e) {
        localStorage.removeItem("token");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    setView("home");
    toast.success("Logged out");
  };

  const goDashboard = () => {
    if (!user) return setView("login");
    if (user.role === "ADMIN" || user.role === "SUPERADMIN")
      window.location.href = "/admin";
    else if (user.role === "EMPLOYER") setView("employerDash");
    else setView("candidateDash");
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
      <Navbar
        user={user}
        view={view}
        setView={setView}
        logout={logout}
        goDashboard={goDashboard}
        funMode={funMode}
        setFunMode={setFunMode}
        onFunModeEnable={() => setShowGameHub(true)}
        onFunModeDisable={() => setShowGameHub(false)}
      />
      <main>
        {view === "home" && (
          <Home
            setView={setView}
            setSelectedJobId={setSelectedJobId}
            user={user}
            showGameHub={showGameHub}
            setShowGameHub={setShowGameHub}
            userPoints={userPoints}
            setUserPoints={setUserPoints}
          />
        )}
        {view === "jobs" && (
          <Jobs setView={setView} setSelectedJobId={setSelectedJobId} />
        )}
        {view === "jobDetails" && (
          <JobDetails
            jobId={selectedJobId}
            setView={setView}
            user={user}
            onApplied={() => setView("jobs")}
          />
        )}
        {view === "login" && (
          <AuthPage mode="login" setUser={setUser} setView={setView} />
        )}
        {view === "register" && (
          <AuthPage mode="register" setUser={setUser} setView={setView} />
        )}
        {view === "candidateDash" && (
          <CandidateDashboard
            user={user}
            setUser={setUser}
            setView={setView}
            setSelectedJobId={setSelectedJobId}
          />
        )}
        {view === "employerDash" && (
          <EmployerDashboard
            user={user}
            setUser={setUser}
            setView={setView}
            setViewingJobApplicantsId={setViewingJobApplicantsId}
          />
        )}
        {view === "applicants" && (
          <ApplicantsView jobId={viewingJobApplicantsId} setView={setView} />
        )}
        {view === "premium" && (
          <PremiumPage user={user} setUser={setUser} setView={setView} />
        )}
        {view === "postJob" && (
          <PostJobPage user={user} setUser={setUser} setView={setView} />
        )}
        {view === "profile" && (
          <ProfilePage user={user} setUser={setUser} setView={setView} />
        )}
        {view === "resume-builder" && (
          <ResumeBuilder user={user} setView={setView} />
        )}

        {view === "companies_view" && (
          <CompaniesList
            setView={setView}
            setSelectedCompany={setSelectedCompany}
          />
        )}
        {view === "companyDetails" && (
          <CompanyDetails
            company={selectedCompany}
            setView={setView}
            setSelectedJobId={setSelectedJobId}
          />
        )}

        {view === "freelance_view" && (
          <DataListView
            type="freelance"
            title="Freelance Hub"
            setView={setView}
          />
        )}
        {view === "academy_view" && (
          <DataListView type="academy" title="RCM Academy" setView={setView} />
        )}
        {view === "community_view" && (
          <CommunityHub setView={setView} user={user} />
        )}
        {view === "rewards_view" && (
          <RewardsPage setView={setView} user={user} />
        )}
        {view === "about" && <AboutPage setView={setView} />}
        {view === "privacy" && <PrivacyPage setView={setView} />}
        {view === "terms" && <TermsPage setView={setView} />}
        {view === "contact" && <ContactPage setView={setView} />}
      </main>
      <Footer setView={setView} />

      <InviteEarnModal
        open={showInviteModal}
        onOpenChange={setShowInviteModal}
        user={user}
        
      />

      {/* FLOATING REWARDS BUTTON */}
      <div className="fixed bottom-4 right-4 sm:bottom-8 sm:right-8 z-[40]">
        <button
          onClick={() => setShowInviteModal(true)}
          className="h-14 w-14 sm:h-16 sm:w-16 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-[0_8px_30px_rgb(37,99,235,0.4)] hover:scale-110 hover:-translate-y-1 active:scale-95 transition-all group relative"
        >
          <div className="absolute -top-1 -right-1 h-4 w-4 sm:h-5 sm:w-5 bg-amber-400 border-2 border-white rounded-full animate-pulse" />
          <Gift className="h-7 w-7 sm:h-8 sm:w-8 group-hover:rotate-12 transition-transform" />

          <div className="hidden sm:block absolute right-full mr-4 bg-white text-slate-900 px-4 py-2 rounded-xl shadow-xl text-sm font-bold whitespace-nowrap opacity-0 translate-x-4 pointer-events-none group-hover:opacity-100 group-hover:translate-x-0 transition-all border border-slate-100">
            Invite & Earn Rewards! 🎁
          </div>
        </button>
      </div>
    </div>
  );
}

// ============ NAVBAR ============
function Navbar({
  user,
  view,
  setView,
  logout,
  goDashboard,
  funMode,
  setFunMode,
  onFunModeEnable,
  onFunModeDisable,
}) {
  const [scrolled, setScrolled] = useState(false);
  const [catSections, setCatSections] = useState([]);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    api("/categories")
      .then((d) => setCatSections(d.sections || []))
      .catch(() => { });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navigateMobile = (target) => {
    setMobileOpen(false);
    setView(target);
  };

  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: "spring", stiffness: 100, damping: 20 }}
      className={`sticky top-0 z-50 transition-all duration-300 ${scrolled
          ? "bg-white/90 backdrop-blur-lg border-b border-slate-200 py-2"
          : "bg-white/80 backdrop-blur-md lg:bg-transparent py-3 lg:py-4"
        }`}
    >
      <div className="container mx-auto px-4 sm:px-6 flex items-center justify-between gap-3">
        <button
          onClick={() => setView("home")}
          className="flex items-center gap-2 sm:gap-3 group flex-shrink-0"
        >
          <img
            src="/assests/favicon.svg"
            alt="RCM Job Logo"
            className="h-8 w-8 sm:h-10 sm:w-10 group-hover:scale-110 transition duration-300"
          />
          <span className="font-bold text-lg sm:text-2xl tracking-tight text-[#2D314D]">
            RCM <span className="text-[#4B55E3]">Job</span>
          </span>
        </button>

        <nav className="hidden lg:flex items-center gap-8">
          <div className="group relative">
            <button
              onClick={() => setView("jobs")}
              className="flex items-center gap-1 text-sm font-medium text-slate-600 hover:text-indigo-600 py-2"
            >
              Jobs <ChevronDown className="h-4 w-4" />
            </button>
            <div className="absolute top-full left-0 w-64 pt-2 opacity-0 translate-y-2 pointer-events-none group-hover:opacity-100 group-hover:translate-y-0 group-hover:pointer-events-auto transition-all">
              <div className="bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden">
                <div className="bg-gradient-to-r from-indigo-600 to-blue-600 p-4 text-white">
                  <div className="text-xs font-bold uppercase tracking-widest opacity-80 mb-1">
                    Job Categories
                  </div>
                </div>
                <div className="p-2 space-y-1 max-h-[400px] overflow-y-auto">
                  {catSections.length > 0 ? (
                    catSections.map((sec) => (
                      <div key={sec.name}>
                        <div className="px-3 py-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                          {sec.name}
                        </div>
                        {sec.items.map((item) => (
                          <button
                            key={item}
                            onClick={() => setView("jobs")}
                            className="w-full text-left px-3 py-2 text-sm text-slate-600 hover:bg-indigo-50 hover:text-indigo-600 rounded-lg flex items-center justify-between group/item"
                          >
                            {item}{" "}
                            <ArrowRight className="h-3 w-3 opacity-0 group-hover/item:opacity-100 transition" />
                          </button>
                        ))}
                      </div>
                    ))
                  ) : (
                    <div className="p-4 text-center text-slate-400 text-xs">
                      Loading categories...
                    </div>
                  )}

                  <div className="p-2 border-t mt-2">
                    <Button
                      onClick={() => setView("jobs")}
                      size="sm"
                      className="w-full bg-indigo-600 hover:bg-indigo-700 rounded-xl font-bold"
                    >
                      View All Jobs
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="group relative">
            <button
              onClick={() => setView("companies_view")}
              className="flex items-center gap-1 text-sm font-medium text-slate-600 hover:text-indigo-600 py-2"
            >
              Companies
            </button>
          </div>
          <button
            onClick={() => setView("about")}
            className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition"
          >
            About Us
          </button>
          <button
            onClick={() => setView("community_view")}
            className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition"
          >
            Community
          </button>
          <button
            onClick={() => setView("contact")}
            className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition"
          >
            Contact Us
          </button>
        </nav>

        <div className="flex items-center gap-2 sm:gap-4 lg:gap-6">
          <motion.div
            animate={{ y: [0, -4, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className={`hidden lg:flex items-center gap-3 px-4 py-2 rounded-full border-2 transition-all duration-300 shadow-lg ${
              funMode 
                ? "bg-gradient-to-r from-amber-50 to-orange-50 border-orange-300 shadow-orange-300/40" 
                : "bg-gradient-to-r from-indigo-50 to-purple-50 border-indigo-200 hover:border-indigo-300 shadow-indigo-200/40"
            }`}
          >
            <motion.div
              animate={{ rotate: [0, -15, 15, -15, 15, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 1 }}
            >
              <Gamepad2 className={`h-5 w-5 ${funMode ? "text-orange-500" : "text-indigo-600"}`} />
            </motion.div>
            <div className="flex flex-col">
              <Label
                htmlFor="fun-mode"
                className={`text-[11px] font-extrabold uppercase tracking-widest cursor-pointer ${
                  funMode ? "text-orange-600" : "text-indigo-700"
                }`}
              >
                Fun Mode
              </Label>
            </div>
            <Switch
              id="fun-mode"
              checked={funMode}
              onCheckedChange={(checked) => {
                setFunMode(checked);
                if (checked) onFunModeEnable();
                else onFunModeDisable();
              }}
              className={`ml-1 data-[state=checked]:bg-orange-500 data-[state=unchecked]:bg-indigo-400`}
            />
          </motion.div>

          {user ? (
            <div className="flex items-center gap-2 sm:gap-3">
              <Button
                onClick={goDashboard}
                variant="ghost"
                className="hidden md:flex gap-2 text-slate-600"
              >
                <LayoutDashboard className="h-4 w-4" /> Dashboard
              </Button>
              <div className="h-8 w-[1px] bg-slate-200 hidden md:block" />
              <div className="flex items-center gap-3">
                <div className="hidden md:flex flex-col items-end">
                  <span className="text-sm font-semibold">{user.name}</span>
                  <span className="text-[10px] text-slate-500 uppercase tracking-wider">
                    {user.role}
                  </span>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger>
                    <div className="h-9 w-9 sm:h-10 sm:w-10 rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 border border-white flex items-center justify-center text-indigo-700 font-bold shadow-sm">
                      {user.name.charAt(0)}
                    </div>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    {user.role === "CANDIDATE" && (
                      <>
                        <DropdownMenuItem onClick={() => setView("profile")}>
                          <User className="h-4 w-4 mr-2" /> Profile
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setView("resume-builder")}>
                          <FileText className="h-4 w-4 mr-2" /> Resume Builder
                        </DropdownMenuItem>
                      </>
                    )}
                    <DropdownMenuItem onClick={goDashboard}>
                      <LayoutDashboard className="h-4 w-4 mr-2" /> Dashboard
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={logout} className="text-red-600">
                      <LogOut className="h-4 w-4 mr-2" /> Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          ) : (
            <div className="hidden sm:flex items-center gap-2 sm:gap-4">
              <button
                onClick={() => setView("login")}
                className="text-[#4B55E3] font-bold text-sm hover:text-indigo-800 transition"
              >
                Login
              </button>
              <Button
                onClick={() => setView("register")}
                className="bg-[#4B55E3] hover:bg-[#3A43C5] px-4 sm:px-6 rounded-lg font-medium shadow-md shadow-indigo-100 h-9 sm:h-10 text-sm"
              >
                Sign Up
              </Button>
            </div>
          )}

          {/* Mobile menu trigger */}
          <button
            type="button"
            aria-label="Open menu"
            onClick={() => setMobileOpen(true)}
            className="lg:hidden inline-flex items-center justify-center h-10 w-10 rounded-xl border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 active:scale-95 transition relative z-[60]"
          >
            <Menu className="h-5 w-5" />
          </button>
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetContent side="right" className="w-[85vw] sm:w-[360px] p-0 overflow-y-auto z-[70]">
              <div className="bg-gradient-to-br from-indigo-600 via-blue-600 to-indigo-700 px-5 py-6 text-white">
                <div className="flex items-center gap-3">
                  <img
                    src="/assests/favicon.svg"
                    alt="RCM Job Logo"
                    className="h-10 w-10 bg-white/10 p-1 rounded-xl"
                  />
                  <div>
                    <div className="font-bold text-xl tracking-tight">
                      RCM <span className="text-amber-300">Job</span>
                    </div>
                  </div>
                </div>

                {user ? (
                  <div className="mt-5 flex items-center gap-3 bg-white/10 backdrop-blur-md rounded-2xl p-3 border border-white/10">
                    <div className="h-11 w-11 rounded-xl bg-white text-indigo-600 flex items-center justify-center font-bold text-lg shadow-md">
                      {user.name.charAt(0)}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="font-bold truncate">{user.name}</div>
                      <div className="text-[10px] uppercase tracking-widest text-indigo-100/80 font-bold">
                        {user.role}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="mt-5 grid grid-cols-2 gap-2">
                    <Button
                      onClick={() => navigateMobile("login")}
                      className="bg-white/10 hover:bg-white/20 text-white border border-white/20 h-10 rounded-xl font-bold"
                    >
                      Login
                    </Button>
                    <Button
                      onClick={() => navigateMobile("register")}
                      className="bg-white text-indigo-600 hover:bg-indigo-50 h-10 rounded-xl font-bold"
                    >
                      Sign Up
                    </Button>
                  </div>
                )}
              </div>

              <nav className="p-4 space-y-1">
                <MobileNavLink icon={HomeIcon} label="Home" onClick={() => navigateMobile("home")} />
                <MobileNavLink icon={Briefcase} label="Browse Jobs" onClick={() => navigateMobile("jobs")} />
                <MobileNavLink icon={Building2} label="Companies" onClick={() => navigateMobile("companies_view")} />
                <MobileNavLink icon={Users} label="Community" onClick={() => navigateMobile("community_view")} />
                <MobileNavLink icon={Info} label="About Us" onClick={() => navigateMobile("about")} />
                <MobileNavLink icon={Phone} label="Contact Us" onClick={() => navigateMobile("contact")} />
                {user && (
                  <>
                    <div className="my-2 border-t border-slate-100" />
                    <MobileNavLink
                      icon={LayoutDashboard}
                      label="Dashboard"
                      onClick={() => {
                        setMobileOpen(false);
                        goDashboard();
                      }}
                    />
                    {user.role === "CANDIDATE" && (
                      <>
                        <MobileNavLink icon={User} label="Profile" onClick={() => navigateMobile("profile")} />
                        <MobileNavLink icon={FileText} label="Resume Builder" onClick={() => navigateMobile("resume-builder")} />
                      </>
                    )}
                    {user.role === "EMPLOYER" && (
                      <MobileNavLink icon={Crown} label="Premium Plans" onClick={() => navigateMobile("premium")} />
                    )}
                  </>
                )}
              </nav>

              <div className="px-4 pb-6">
                <motion.div
                  animate={{ y: [0, -4, 0] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                  className={`flex items-center justify-between rounded-2xl p-4 border-2 transition-all duration-300 shadow-lg ${
                    funMode
                      ? "bg-gradient-to-r from-amber-50 to-orange-50 border-orange-300 shadow-orange-300/40"
                      : "bg-gradient-to-r from-indigo-50 to-purple-50 border-indigo-200 shadow-indigo-200/40"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <motion.div
                      animate={{ rotate: [0, -15, 15, -15, 15, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 1 }}
                      className={`h-10 w-10 rounded-xl flex items-center justify-center shadow-sm ${
                        funMode ? "bg-orange-100 text-orange-500" : "bg-indigo-100 text-indigo-600"
                      }`}
                    >
                      <Gamepad2 className="h-5 w-5" />
                    </motion.div>
                    <div>
                      <div className={`text-sm font-bold ${funMode ? "text-orange-700" : "text-indigo-800"}`}>
                        Fun Mode
                      </div>
                      <div className={`text-[10px] font-bold uppercase tracking-wider ${funMode ? "text-orange-500" : "text-indigo-500"}`}>
                        {funMode ? "Active!" : "Disabled"}
                      </div>
                    </div>
                  </div>
                  <Switch
                    checked={funMode}
                    onCheckedChange={(checked) => {
                      setFunMode(checked);
                      if (checked) onFunModeEnable();
                      else onFunModeDisable();
                    }}
                    className={`data-[state=checked]:bg-orange-500 data-[state=unchecked]:bg-indigo-400`}
                  />
                </motion.div>

                {user && (
                  <Button
                    onClick={() => {
                      setMobileOpen(false);
                      logout();
                    }}
                    className="w-full mt-4 bg-red-50 hover:bg-red-100 text-red-600 border border-red-100 h-11 rounded-xl font-bold"
                  >
                    <LogOut className="h-4 w-4 mr-2" /> Logout
                  </Button>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </motion.header>
  );
}

function MobileNavLink({ icon: Icon, label, onClick }) {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-3 px-3 py-3 rounded-xl text-slate-700 hover:bg-indigo-50 hover:text-indigo-700 active:scale-[0.98] transition-all text-sm font-semibold"
    >
      <div className="h-9 w-9 rounded-xl bg-slate-50 flex items-center justify-center text-slate-500 group-hover:bg-indigo-100 group-hover:text-indigo-600">
        <Icon className="h-4 w-4" />
      </div>
      <span>{label}</span>
      <ArrowRight className="h-4 w-4 ml-auto text-slate-300" />
    </button>
  );
}

// ============ HOME ============
function Home({
  setView,
  setSelectedJobId,
  user,
  showGameHub,
  setShowGameHub,
  userPoints,
  setUserPoints,
}) {
  const [jobs, setJobs] = useState([]);
  const [search, setSearch] = useState("");
  const [location, setLocation] = useState("India, Delhi");
  const [activeFaq, setActiveFaq] = useState(0);

  useEffect(() => {
    api("/jobs?limit=6")
      .then((d) => setJobs(d.jobs || []))
      .catch(() => { });
  }, []);

  const onSearch = (e) => {
    e.preventDefault();
    setView("jobs");
  };

  const companies = [
    { name: "Vodafone", logo: "/assests/brands/brand1.png" },
    { name: "Intel", logo: "/assests/brands/brand2.png" },
    { name: "Tesla", logo: "/assests/brands/brand3.png" },
    { name: "AMD", logo: "/assests/brands/brand4.png" },
    { name: "Talkit", logo: "/assests/brands/brand5.png" },
  ];

  return (
    <div className="bg-white overflow-x-hidden">
      {/* HERO SECTION */}
      <section className="relative z-10 overflow-x-hidden bg-gradient-to-br from-[#F8F8FD] via-white to-indigo-50/40 py-8 sm:py-10 pb-0 lg:py-0 lg:pt-5">
        {/* Decorative ambient orbs */}
        <div className="absolute top-20 -left-32 w-[400px] h-[400px] bg-indigo-300/20 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-blue-300/20 rounded-full blur-[120px] pointer-events-none" />

        <div className="relative z-10 container mx-auto px-4 sm:px-6 w-full overflow-hidden">
          <div className="grid h-full w-full grid-cols-1 items-center gap-10 lg:grid-cols-2">
            {/* Left Section */}
            <div className="lg:self-start lg:pt-28">
              <motion.div
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-indigo-100 shadow-sm shadow-indigo-100/50 mb-6"
              >
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-xs font-bold text-indigo-700 uppercase tracking-widest">Now Hiring</span>
              </motion.div>
              <div className="relative inline-block">
                <div className="absolute -top-10 -left-10 w-32 h-32 bg-indigo-500/10 rounded-full blur-3xl" />
                <motion.h1
                  initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }}
                  className="mb-6 sm:mb-9 text-3xl sm:text-4xl md:text-5xl leading-tight sm:leading-none font-bold text-[#2A2E43] xl:text-[5rem] tracking-tight relative z-10">
                  Discover more than{" "}
                  <span className="text-indigo-600 relative inline-block">
                    5000+ Jobs
                    <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 200 8" preserveAspectRatio="none">
                      <path d="M0 4 Q 50 0, 100 4 T 200 4" stroke="currentColor" strokeWidth="3" fill="none" strokeLinecap="round" className="text-indigo-300" />
                    </svg>
                  </span>
                </motion.h1>
              </div>
              <motion.p
                initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }}
                className="text-slate-500 mb-3 max-w-[90%] text-base leading-7">
                Great platform for job seekers passionate about startups and
                seeking new career heights.
              </motion.p>
              {/* Search Bar */}
              <motion.div
                initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.3 }}
                className="relative z-20 mx-auto mt-5 max-w-full rounded-2xl bg-white px-5 py-5 shadow-2xl shadow-indigo-200/40 lg:w-full lg:min-w-[700px] lg:py-4 border border-slate-100">
                <form
                  onSubmit={onSearch}
                  className="flex flex-wrap items-center gap-5 lg:flex-nowrap"
                >
                  {/* Job Title Input */}
                  <div className="group flex h-full w-full items-center gap-3 border-b border-slate-200 transition duration-300 focus-within:border-indigo-600 lg:border-b-0 lg:border-r lg:pr-4">
                    <div className="pb-3 lg:pb-0 transition duration-300 text-slate-400 group-focus-within:text-indigo-600">
                      <Search size={18} />
                    </div>
                    <input
                      type="text"
                      className="w-full pb-2 lg:pb-0 text-[#2A2E43] placeholder:text-slate-400 outline-none"
                      placeholder="Job title or Keywords"
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                    />
                  </div>
                  {/* Location Input */}
                  <div className="relative flex h-full w-full items-center border-b border-slate-200 transition duration-300 focus-within:border-indigo-600 lg:border-b-0 lg:pr-4">
                    <div className="pb-3 lg:pb-0 text-slate-400 transition duration-300">
                      <MapPin size={18} />
                    </div>
                    <div className="flex w-full items-center justify-between">
                      <input
                        type="text"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        placeholder="India, Delhi"
                        className="w-full px-3 pb-2 lg:pb-0 text-[#2A2E43] placeholder:text-slate-400 outline-none"
                      />
                      <div className="text-slate-400 pb-3 lg:pb-0">
                        <ChevronDown size={18} />
                      </div>
                    </div>
                  </div>
                  {/* Search Button */}
                  <button
                    className="h-full w-full cursor-pointer rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 px-6 py-3 text-base font-bold whitespace-nowrap text-white transition duration-300 hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-indigo-300/40 lg:w-fit flex items-center justify-center gap-2"
                    type="submit"
                  >
                    Search my job
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </form>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.4 }}
                className="mt-8 flex flex-col gap-4 text-base text-slate-500 md:flex-row md:items-center"
              >
                <p className="text-[15px] font-medium"> Popular Tags:</p>
                <div className="flex flex-wrap gap-2.5">
                  {["UI Designer", "UX Researcher", "Android", "Admin"].map(
                    (list) => (
                      <span
                        key={list}
                        className="inline-block shrink-0 cursor-pointer rounded-lg border border-slate-200 px-3 py-1.5 text-sm font-medium text-slate-500 bg-white/50 backdrop-blur-sm hover:bg-indigo-50 hover:border-indigo-200 hover:text-indigo-700 transition sm:mb-0 sm:py-2"
                      >
                        {list}
                      </span>
                    )
                  )}
                </div>
              </motion.div>
            </div>
            {/* Right Section */}
            <div className="w-full flex-shrink-0 relative pt-10 lg:pt-0">
              {/* Floating stat card 1 */}
              <motion.div
                initial={{ opacity: 0, x: 30, y: -20 }} animate={{ opacity: 1, x: 0, y: 0 }} transition={{ duration: 0.6, delay: 0.6 }}
                className="hidden lg:flex absolute top-32 left-4 items-center gap-3 bg-white rounded-2xl px-4 py-3 shadow-xl shadow-indigo-200/40 border border-slate-100 z-20"
              >
                <div className="h-10 w-10 rounded-xl bg-emerald-50 flex items-center justify-center">
                  <CheckCircle className="h-5 w-5 text-emerald-600" />
                </div>
                <div>
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Verified</div>
                  <div className="text-sm font-bold text-slate-900">10K+ Hires</div>
                </div>
              </motion.div>

              {/* Floating stat card 2 */}
              <motion.div
                initial={{ opacity: 0, x: -30, y: 20 }} animate={{ opacity: 1, x: 0, y: 0 }} transition={{ duration: 0.6, delay: 0.75 }}
                className="hidden lg:flex absolute bottom-24 left-12 items-center gap-3 bg-white rounded-2xl px-4 py-3 shadow-xl shadow-indigo-200/40 border border-slate-100 z-20"
              >
                <div className="h-10 w-10 rounded-xl bg-indigo-50 flex items-center justify-center">
                  <Briefcase className="h-5 w-5 text-indigo-600" />
                </div>
                <div>
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Daily</div>
                  <div className="text-sm font-bold text-slate-900">500+ New Jobs</div>
                </div>
              </motion.div>

              <img
                src="/assests/hero-image.png"
                className="mx-auto block w-[300px] lg:mx-0 lg:ml-auto lg:flex xl:w-[450px] relative z-10 animate-float"
                alt="Hero representation"
              />
              <div className="absolute right-0 -bottom-[455px] h-[716px] w-[280px] rotate-[64deg] bg-white z-20" />
            </div>
          </div>
          <img
            src="/assests/Pattern.svg"
            className="absolute top-0 right-0 -z-10 w-[860px] pointer-events-none"
            alt="Background pattern"
          />
        </div>
      </section>

      {/* TRUST SECTION */}



      {/* PATH SELECTION SECTION */}
      <section className="py-24 bg-gradient-to-b from-slate-50 via-white to-slate-50 relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-200/40 rounded-full blur-[120px] -mr-32 -mt-32 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-emerald-200/40 rounded-full blur-[120px] -ml-32 -mb-32 pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-amber-100/30 rounded-full blur-[120px] -translate-x-1/2 -translate-y-1/2 pointer-events-none" />

        <div className="container mx-auto px-4 sm:px-6 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-indigo-100 shadow-sm shadow-indigo-100/50 mb-6"
          >
            <Sparkles className="h-3.5 w-3.5 text-indigo-600" />
            <span className="text-xs font-bold text-indigo-700 uppercase tracking-widest">Your Journey</span>
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.5 }}
            className="text-4xl lg:text-5xl font-bold text-slate-900 mb-4 tracking-tight"
          >
            What brings you <span className="text-indigo-600">here today?</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-slate-600 mb-16 max-w-2xl mx-auto text-lg"
          >
            Choose your professional path and let RCM Job help you achieve your
            career goals with verified opportunities and expert guidance.
          </motion.p>

          <div className="grid md:grid-cols-3 gap-8">
            <PathCard
              icon={Briefcase}
              title="I am Hiring"
              desc="Post a verified requirement and receive proposals from certified billers and coders across the globe."
              btnText="Post Requirement"
              color="indigo"
              onClick={() => setView("login")}
            />
            <PathCard
              icon={Search}
              title="I want Work"
              desc="Find high-paying contracts, apply with your scorecard, and get gamified job selections based on your merit."
              btnText="Browse Jobs"
              color="emerald"
              onClick={() => setView("jobs")}
            />
            <PathCard
              icon={BookOpen}
              title="RCM Academy & More"
              desc="Access crash courses, job guarantees, and different earning platforms to boost your professional value."
              btnText="Explore Academy"
              color="orange"
              onClick={() => setView("academy_view")}
            />
          </div>
        </div>
      </section>

      <section className="py-20 border-y border-slate-100 bg-white">
        <div className="container mx-auto px-4 sm:px-6">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-slate-500 text-sm font-bold uppercase tracking-[0.2em] mb-12 text-center"
          >
            Companies we helped grow
          </motion.p>
          <div className="overflow-hidden w-full relative whitespace-nowrap py-4">
            <div className="absolute left-0 top-0 w-16 sm:w-32 h-full bg-gradient-to-r from-white to-transparent z-10 pointer-events-none"></div>
            <div className="absolute right-0 top-0 w-16 sm:w-32 h-full bg-gradient-to-l from-white to-transparent z-10 pointer-events-none"></div>
            <motion.div
              animate={{ x: ["0%", "-50%"] }}
              transition={{ ease: "linear", duration: 25, repeat: Infinity }}
              className="flex w-max gap-16 lg:gap-24 items-center opacity-50 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-500"
            >
              {[...companies, ...companies, ...companies, ...companies].map((company, index) => (
                <img
                  key={`${company.name}-${index}`}
                  src={company.logo}
                  alt={company.name}
                  className="h-9 lg:h-12 object-contain hover:scale-110 transition-transform duration-300 cursor-pointer"
                />
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* EXPLORE BY CATEGORY */}
      <section className="py-24 bg-white overflow-hidden relative">
        {/* Decorative orbs */}
        <div className="absolute top-32 right-0 w-72 h-72 bg-purple-100/40 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-32 left-0 w-72 h-72 bg-indigo-100/40 rounded-full blur-[100px] pointer-events-none" />

        <div className="container mx-auto px-4 sm:px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.5 }}
            className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12"
          >
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-50 border border-indigo-100 mb-4">
                <Layers className="h-3.5 w-3.5 text-indigo-600" />
                <span className="text-xs font-bold text-indigo-700 uppercase tracking-widest">Browse Roles</span>
              </div>
              <h2 className="text-4xl lg:text-5xl font-bold text-slate-900 mb-3 tracking-tight">
                Explore by <span className="text-indigo-600">category</span>
              </h2>
              <p className="text-slate-500 font-medium text-lg">
                Browse through thousands of opportunities across various sectors
              </p>
            </div>
            <Button
              variant="ghost"
              onClick={() => setView("jobs")}
              className="text-indigo-600 font-bold group self-start md:self-auto bg-white border border-indigo-100 rounded-2xl px-6 h-12 shadow-sm shadow-indigo-100 hover:bg-indigo-50 hover:border-indigo-200 transition-all"
            >
              Show all jobs{" "}
              <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition" />
            </Button>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <CategoryCard
              icon={LayoutDashboard}
              title="Design"
              jobs="235"
              color="blue"
              onClick={() => setView("jobs")}
            />
            <CategoryCard
              icon={BarChart3}
              title="Sales"
              jobs="760"
              color="indigo"
              onClick={() => setView("jobs")}
            />
            <CategoryCard
              icon={Mail}
              title="Marketing"
              jobs="400"
              color="purple"
              active
              onClick={() => setView("jobs")}
            />
            <CategoryCard
              icon={IndianRupee}
              title="Finance"
              jobs="150"
              color="emerald"
              onClick={() => setView("jobs")}
            />
            <CategoryCard
              icon={Zap}
              title="Technology"
              jobs="320"
              color="orange"
              onClick={() => setView("jobs")}
            />
            <CategoryCard
              icon={Plus}
              title="Engineering"
              jobs="543"
              color="blue"
              onClick={() => setView("jobs")}
            />
            <CategoryCard
              icon={Briefcase}
              title="Business"
              jobs="200"
              color="slate"
              onClick={() => setView("jobs")}
            />
            <CategoryCard
              icon={Users}
              title="Human Resources"
              jobs="320"
              color="rose"
              onClick={() => setView("jobs")}
            />
          </div>
        </div>
      </section>

      {showGameHub && (
        <section
          id="fun-mode-section"
          className="animate-in fade-in slide-in-from-top duration-700"
        >
          <GameHub
            onBack={() => setShowGameHub(false)}
            setView={setView}
            userPoints={userPoints}
            setUserPoints={setUserPoints}
          />
        </section>
      )}

      <TopCompanies />

      {/* FEATURED JOBS SECTION */}
      <section className="py-24 container mx-auto px-4 sm:px-6 relative">
        <div className="absolute top-20 right-0 w-72 h-72 bg-indigo-100/40 rounded-full blur-[100px] pointer-events-none -z-10" />
        <div className="absolute bottom-20 left-0 w-72 h-72 bg-blue-100/40 rounded-full blur-[100px] pointer-events-none -z-10" />

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5 }}
          className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-16"
        >
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-50 border border-indigo-100 mb-4">
              <Sparkles className="h-3.5 w-3.5 text-indigo-600" />
              <span className="text-xs font-bold text-indigo-700 uppercase tracking-widest">Hand-picked</span>
            </div>
            <h2 className="text-4xl lg:text-5xl font-bold text-slate-900 mb-3 tracking-tight">
              Featured <span className="text-indigo-600 font-bold">jobs</span>
            </h2>
            <p className="text-slate-500 font-medium text-lg max-w-xl">
              Find your next career move with our hand-picked opportunities
            </p>
          </div>
          <Button
            variant="ghost"
            onClick={() => setView("jobs")}
            className="text-indigo-600 font-bold group self-start md:self-auto bg-white border border-indigo-100 rounded-2xl px-6 h-12 shadow-sm shadow-indigo-100 hover:bg-indigo-50 hover:border-indigo-200 transition-all"
          >
            Show all jobs{" "}
            <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition" />
          </Button>
        </motion.div>
        {jobs.length === 0 ? (
          <EmptyState icon={Briefcase} title="No jobs posted yet" />
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {jobs.map((job, idx) => (
              <JobCard
                key={job.id}
                job={job}
                featuredIndex={idx}
                onClick={() => {
                  setSelectedJobId(job.id);
                  setView("jobDetails");
                }}
              />
            ))}
          </div>
        )}
      </section>

      {/* NEW LIGHT-THEMED SECTIONS */}

      {/* PROCESS TIMELINE */}
      <section className="py-24 bg-slate-50">
        <div className="container mx-auto px-4 sm:px-6 max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.5 }}
            className="text-center mb-20"
          >
            <h2 className="text-sm font-bold tracking-widest text-indigo-600 uppercase mb-4">
              How it works
            </h2>
            <h3 className="text-4xl lg:text-5xl font-bold mb-6 text-slate-900 tracking-tight">
              Bringing Out The{" "}
              <span className="text-indigo-600">Potential</span> In You
            </h3>
            <p className="text-slate-500 max-w-2xl mx-auto text-lg">
              Follow our simple process to elevate your RCM career. We guide you
              every step of the way from signing up to landing your dream job.
            </p>
          </motion.div>

          <div className="relative flex flex-col md:flex-row justify-between items-start max-w-5xl mx-auto gap-10 md:gap-0">
            {/* Connecting Line (Desktop) */}
            <div className="hidden md:block absolute top-7 left-16 right-16 h-[2px] bg-slate-200 -z-10" />

            {[
              {
                step: 1,
                title: "Sign up on RCM Job",
                desc: "Create your profile and add your coding/billing certifications.",
              },
              {
                step: 2,
                title: "Apply For The Job",
                desc: "Browse thousands of verified RCM jobs and submit applications.",
              },
              {
                step: 3,
                title: "Job Interview",
                desc: "Connect with top healthcare employers and showcase your skills.",
              },
              {
                step: 4,
                title: "Get Your Dream Job",
                desc: "Secure your offer and start your new career journey today.",
              },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.4, delay: i * 0.12 }}
                className="flex flex-col items-center md:w-1/4 text-center"
              >
                <motion.div
                  whileHover={{ scale: 1.08, rotate: 5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                  className="w-14 h-14 rounded-full bg-white border-4 border-indigo-100 text-indigo-600 flex items-center justify-center font-extrabold text-xl mb-6 shadow-xl shadow-indigo-100/50"
                >
                  {item.step}
                </motion.div>
                <h4 className="text-lg font-bold mb-2 text-slate-900">
                  {item.title}
                </h4>
                <p className="text-sm text-slate-500 text-center px-4 leading-relaxed">
                  {item.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS (CAROUSEL DESIGN) */}
      <section className="py-24 bg-gradient-to-b from-[#F8F9FD] via-white to-[#F8F9FD] border-t border-slate-100 overflow-hidden relative">
        {/* Decorative blobs */}
        <div className="absolute top-20 -left-20 w-[420px] h-[420px] bg-indigo-200/30 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-20 -right-20 w-[420px] h-[420px] bg-pink-200/30 rounded-full blur-[120px] pointer-events-none" />

        <div className="container mx-auto px-4 sm:px-6 max-w-7xl relative z-10">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.5 }}
            className="text-center mb-16 max-w-3xl mx-auto"
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-indigo-100 shadow-sm shadow-indigo-100/50 mb-5">
              <Sparkles className="h-3.5 w-3.5 text-indigo-600" />
              <span className="text-xs font-bold text-indigo-700 uppercase tracking-widest">Testimonials</span>
            </div>
            <h2 className="text-4xl lg:text-5xl font-bold text-slate-900 tracking-tight mb-4">
              Customer <span className="text-indigo-600">Reviews</span>
            </h2>
            <p className="text-slate-500 text-lg font-medium">
              Real stories from our candidates who experienced the best career journeys with us.
            </p>
          </motion.div>

          {/* Reviews container */}
          <div className="flex overflow-x-auto snap-x snap-mandatory gap-8 pb-12 pt-4 px-4 -mx-4 hide-scrollbar" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
            {[
              {
                title: "Excellent Service!",
                name: "Michael Chen",
                role: "RCM Manager",
                review: "This platform completely transformed how we hire certified coders. The gamified skills assessment ensures we only interview top talent.",
                image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=150"
              },
              {
                title: "A career to remember",
                name: "Jessica Torres",
                role: "Billing Specialist",
                review: "Everything was perfectly curated. I found my current remote position through RCM Job and the process was incredibly smooth.",
                image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=150"
              },
              {
                title: "Flawless Execution",
                name: "David Smith",
                role: "Healthcare Admin",
                review: "The best talent pool for revenue cycle management. We filled our open positions in half the usual time with exactly the right candidates.",
                image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=150"
              },
              {
                title: "Highly Recommended!",
                name: "Emily Clark",
                role: "Compliance Auditor",
                review: "RCM Academy helped me update my certifications, and immediately after, I landed a senior role. Fantastic platform!",
                image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150"
              },
              {
                title: "Incredible Platform",
                name: "Sarah Jenkins",
                role: "Medical Coder",
                review: "The job matches are incredibly accurate to my specific coding certifications. Best platform for healthcare billing professionals.",
                image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150"
              }
            ].map((testimonial, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
                whileHover={{ y: -8 }}
                className="snap-center shrink-0 w-[85vw] md:w-[400px] relative group"
              >
                {/* Gradient ring on hover */}
                <div className="absolute -inset-px bg-gradient-to-br from-indigo-500/0 via-indigo-500/0 to-pink-500/0 group-hover:from-indigo-500/40 group-hover:via-indigo-300/30 group-hover:to-pink-500/40 rounded-[2.5rem] blur opacity-0 group-hover:opacity-100 transition-all duration-500" />

                <div className="relative bg-white rounded-[2.5rem] p-10 shadow-xl shadow-slate-200/60 flex flex-col justify-between border border-slate-100/80 h-full overflow-hidden">
                  {/* Decorative quote mark */}
                  <Quote
                    className="absolute -top-2 -right-2 w-32 h-32 text-indigo-50 rotate-180 pointer-events-none"
                    strokeWidth={1}
                    fill="currentColor"
                  />

                  <div className="relative z-10">
                    <div className="flex items-center justify-between mb-8">
                      <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star key={star} className="w-4 h-4 fill-amber-500 text-amber-500" />
                        ))}
                      </div>
                      <div className="flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-100 px-2.5 py-1 rounded-full">
                        <CheckCircle className="w-3 h-3" />
                        Verified
                      </div>
                    </div>
                    <h4 className="text-xl font-black text-slate-900 mb-4 tracking-tight">"{testimonial.title}"</h4>
                    <p className="text-slate-600 font-medium leading-relaxed text-[15px] mb-10">{testimonial.review}</p>
                  </div>

                  <div className="relative z-10 flex items-center gap-4 pt-6 border-t border-slate-100">
                    <div className="relative">
                      <div className="absolute inset-0 rounded-full bg-gradient-to-br from-indigo-500 to-pink-500 blur-sm opacity-60 group-hover:opacity-100 transition" />
                      <div className="relative w-14 h-14 rounded-full bg-white p-0.5 shadow-md">
                        <div className="w-full h-full rounded-full overflow-hidden">
                          <img src={testimonial.image} alt={testimonial.name} className="w-full h-full object-cover" />
                        </div>
                      </div>
                    </div>
                    <div>
                      <h5 className="font-bold text-slate-900 text-base">{testimonial.name}</h5>
                      <p className="text-[11px] font-bold text-indigo-600/80 uppercase tracking-widest mt-0.5">{testimonial.role}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Scroll hint */}
          <div className="flex items-center justify-center gap-2 mt-2 text-slate-400 text-xs font-medium">
            <ChevronLeft className="w-3.5 h-3.5" />
            <span className="uppercase tracking-widest">Scroll to explore</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </div>
        </div>
      </section>

      {/* FAQ SECTION */}
      <section className="py-24 bg-[#F8F9FD] relative overflow-hidden">
        {/* Intense Colorful Blobs for FAQ */}
        <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-indigo-500/10 rounded-full blur-[100px] pointer-events-none animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-pink-500/10 rounded-full blur-[100px] pointer-events-none animate-pulse" style={{ animationDelay: '2s' }} />
        {/* Subtle grid overlay */}
        <div
          className="absolute inset-0 opacity-[0.04] pointer-events-none"
          style={{
            backgroundImage: "linear-gradient(to right, #6366f1 1px, transparent 1px), linear-gradient(to bottom, #6366f1 1px, transparent 1px)",
            backgroundSize: "48px 48px"
          }}
        />

        <div className="container mx-auto px-4 sm:px-6 max-w-6xl relative z-10">
          <div className="grid lg:grid-cols-[1fr,1.4fr] gap-12 lg:gap-20 items-start">
            {/* Left: Heading column */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.5 }}
              className="lg:sticky lg:top-24"
            >
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-indigo-100 shadow-sm shadow-indigo-100/50 mb-5">
                <HelpCircle className="h-3.5 w-3.5 text-indigo-600" />
                <span className="text-xs font-black tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-pink-600 uppercase">
                  Answers & Insights
                </span>
              </div>
              <h2 className="text-4xl lg:text-5xl font-bold text-slate-900 mb-5 tracking-tight leading-[1.1]">
                Frequently Asked <span className="text-indigo-600">Questions</span>
              </h2>
              <p className="text-slate-500 text-lg font-medium leading-relaxed mb-8">
                Everything you need to know about the platform — from getting started to landing your dream role.
              </p>

              <div className="hidden lg:flex items-center gap-4 p-5 rounded-2xl bg-white border border-slate-100 shadow-lg shadow-indigo-100/40">
                <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-blue-600 flex items-center justify-center text-white shadow-md shadow-indigo-500/30 flex-shrink-0">
                  <MessageSquare className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-900">Still have questions?</p>
                  <p className="text-xs text-slate-500 font-medium">We're here to help — reach out anytime.</p>
                </div>
              </div>
            </motion.div>

            {/* Right: FAQ list */}
            <div className="grid gap-3 relative z-10">
              {[
                {
                  q: "Do You Provide Interview Assistance?",
                  a: "Yes, our platform includes dedicated resources and RCM Academy modules designed to prepare you for technical and behavioral interviews specific to revenue cycle roles.",
                },
                {
                  q: "Can I Search For Both IT And Healthcare?",
                  a: "RCM Job specializes in Revenue Cycle Management and healthcare administration roles, though some roles may overlap with healthcare IT depending on the facility.",
                },
                {
                  q: "What Are The Most Popular Job Roles?",
                  a: "The most frequent openings are for Medical Coders (CPC, CCS), Billing Specialists, RCM Managers, and Compliance Auditors.",
                },
                {
                  q: "Is It Free To Create An Account?",
                  a: "Absolutely. Job seekers can create a profile, take skills assessments, and apply to jobs completely free of charge. We only charge employers for premium postings.",
                },
                {
                  q: "How Do I Register As An Employer?",
                  a: 'Click "Sign Up" and select the Employer option. You will need to verify your company details and healthcare facility credentials before posting jobs.',
                },
              ].map((faq, i) => {
                const isActive = activeFaq === i;
                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-40px" }}
                    transition={{ duration: 0.35, delay: i * 0.07 }}
                    onClick={() => setActiveFaq(isActive ? null : i)}
                    className={`group cursor-pointer rounded-2xl border transition-all duration-300 overflow-hidden ${isActive
                      ? "bg-white border-indigo-200 shadow-xl shadow-indigo-200/40"
                      : "bg-white/70 backdrop-blur-sm border-slate-100 hover:border-indigo-200 hover:bg-white hover:shadow-md hover:shadow-indigo-100/50"
                      }`}
                  >
                    <div className="flex items-start gap-4 p-5">
                      {/* Number badge */}
                      <div
                        className={`flex-shrink-0 w-9 h-9 rounded-lg flex items-center justify-center text-xs font-black tracking-tight transition-all duration-300 ${isActive
                          ? "bg-gradient-to-br from-indigo-600 to-blue-600 text-white shadow-md shadow-indigo-500/40"
                          : "bg-slate-100 text-slate-500 group-hover:bg-indigo-50 group-hover:text-indigo-600"
                          }`}
                      >
                        {String(i + 1).padStart(2, "0")}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-4">
                          <h4
                            className={`font-bold text-[15px] transition-colors duration-300 leading-snug ${isActive ? "text-indigo-700" : "text-slate-900 group-hover:text-indigo-700"
                              }`}
                          >
                            {faq.q}
                          </h4>
                          <div
                            className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${isActive
                              ? "bg-indigo-600 rotate-180"
                              : "bg-slate-50 group-hover:bg-indigo-100"
                              }`}
                          >
                            <ChevronDown
                              className={`w-4 h-4 transition-colors duration-300 ${isActive ? "text-white" : "text-slate-500 group-hover:text-indigo-600"
                                }`}
                            />
                          </div>
                        </div>

                        <AnimatePresence initial={false}>
                          {isActive && (
                            <motion.div
                              key="content"
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: "auto" }}
                              exit={{ opacity: 0, height: 0 }}
                              transition={{ duration: 0.3, ease: "easeInOut" }}
                              className="overflow-hidden"
                            >
                              <p className="text-slate-600 leading-relaxed font-medium text-sm mt-4 pr-12">
                                {faq.a}
                              </p>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* POST JOB CTA BANNER */}
      <section className="py-12 container mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          className="bg-gradient-to-br from-indigo-600 via-indigo-700 to-blue-700 rounded-[2.5rem] overflow-hidden relative min-h-[420px] flex items-center shadow-2xl shadow-indigo-600/30"
        >
          {/* Decorative orbs */}
          <div className="absolute top-0 left-0 w-64 h-64 bg-pink-500/20 rounded-full blur-[100px] -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
          <div className="absolute bottom-0 right-1/3 w-72 h-72 bg-blue-400/20 rounded-full blur-[100px] translate-y-1/2 pointer-events-none" />

          {/* Subtle grid pattern */}
          <div
            className="absolute inset-0 opacity-[0.08] pointer-events-none"
            style={{
              backgroundImage: "linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)",
              backgroundSize: "40px 40px"
            }}
          />

          <div className="absolute top-0 right-0 w-1/2 h-full hidden lg:block">
            <div className="absolute inset-0 bg-white/10 skew-x-12 translate-x-32" />
            <img
              src="/assests/3.1 Dashboard Company.jpg"
              alt="Dashboard"
              className="absolute inset-0 w-full h-full mix-blend-overlay opacity-50"
            />
          </div>

          {/* Floating decorative badges */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            whileInView={{ opacity: 1, scale: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.45 }}
            className="hidden xl:flex absolute top-12 right-12 items-center gap-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl px-5 py-3 shadow-xl"
          >
            <div className="h-10 w-10 rounded-xl bg-emerald-400/20 flex items-center justify-center">
              <CheckCircle className="h-5 w-5 text-emerald-300" />
            </div>
            <div className="text-left">
              <div className="text-[10px] font-bold uppercase tracking-widest text-white/70">Verified Talent</div>
              <div className="text-sm font-bold text-white">10,000+ Candidates</div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            whileInView={{ opacity: 1, scale: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.55 }}
            className="hidden xl:flex absolute bottom-12 right-24 items-center gap-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl px-5 py-3 shadow-xl"
          >
            <div className="h-10 w-10 rounded-xl bg-amber-400/20 flex items-center justify-center">
              <Star className="h-5 w-5 text-amber-300 fill-amber-300" />
            </div>
            <div className="text-left">
              <div className="text-[10px] font-bold uppercase tracking-widest text-white/70">Trusted by</div>
              <div className="text-sm font-bold text-white">500+ Companies</div>
            </div>
          </motion.div>

          <div className="relative z-10 px-8 md:px-12 lg:px-24 py-16 lg:w-3/5 text-white">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/20 backdrop-blur-md mb-6"
            >
              <Sparkles className="h-3.5 w-3.5 text-amber-300" />
              <span className="text-xs font-bold text-white uppercase tracking-widest">For Employers</span>
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.15 }}
              className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight tracking-tight"
            >
              Start posting <br /> jobs today
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.25 }}
              className="text-lg lg:text-xl text-white/80 mb-10 max-w-md leading-relaxed"
            >
              Connect with thousands of certified professionals and grow your
              team with the best RCM talent in the industry.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.35 }}
              className="flex flex-wrap items-center gap-4"
            >
              <Button
                onClick={() => setView("register")}
                className="bg-white text-indigo-600 hover:bg-slate-50 h-14 px-10 rounded-2xl font-bold text-lg shadow-xl shadow-black/20 transition-all hover:scale-105 active:scale-95 group"
              >
                Sign up for free
                <ArrowRight className="h-5 w-5 ml-2 group-hover:translate-x-1 transition" />
              </Button>
              <div className="flex items-center gap-2 text-white/80 text-sm font-medium">
                <CheckCircle className="h-4 w-4 text-emerald-300" />
                No credit card required
              </div>
            </motion.div>
          </div>
        </motion.div>
      </section>

    </div>
  );
}

// ============ CATEGORY CARD ============
function CategoryCard({ icon: Icon, title, jobs, color, active, onClick }) {
  const colors = {
    blue: "text-blue-600 bg-blue-50",
    indigo: "text-indigo-600 bg-indigo-50",
    purple: "text-purple-600 bg-purple-50",
    emerald: "text-emerald-600 bg-emerald-50",
    orange: "text-orange-600 bg-orange-50",
    rose: "text-rose-600 bg-rose-50",
    slate: "text-slate-600 bg-slate-50",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      whileHover={{ y: -6 }}
      transition={{ duration: 0.4 }}
    >
      <Card
        onClick={onClick}
        className={`p-6 cursor-pointer transition-all duration-300 border group rounded-3xl relative overflow-hidden ${active
            ? "bg-gradient-to-br from-indigo-600 to-blue-600 border-indigo-600 shadow-xl shadow-indigo-300/40"
            : "bg-white border-slate-100 hover:border-indigo-200 hover:shadow-xl hover:shadow-indigo-100/30"
          }`}
      >
        {/* Decorative blob on hover */}
        {!active && (
          <div className="absolute -top-12 -right-12 w-32 h-32 rounded-full bg-indigo-500/0 group-hover:bg-indigo-500/10 blur-2xl transition-all duration-500 pointer-events-none" />
        )}
        {active && (
          <div className="absolute -top-12 -right-12 w-32 h-32 rounded-full bg-white/10 blur-2xl pointer-events-none" />
        )}

        <div
          className={`relative h-14 w-14 rounded-2xl flex items-center justify-center mb-6 transition-all group-hover:scale-110 group-hover:rotate-3 ${active ? "bg-white/20 text-white border border-white/30" : `${colors[color] || colors.indigo} border border-slate-100`
            }`}
        >
          <Icon className="h-7 w-7" />
        </div>
        <h3
          className={`text-xl font-bold mb-1 tracking-tight ${active
              ? "text-white"
              : "text-slate-900 group-hover:text-indigo-600 transition"
            }`}
        >
          {title}
        </h3>
        <div
          className={`flex items-center justify-between mt-4 ${active ? "text-white/80" : "text-slate-500"
            }`}
        >
          <span className="text-sm font-medium">{jobs} Jobs available</span>
          <ArrowRight
            className={`h-4 w-4 transition-all group-hover:translate-x-1 ${active ? "text-white" : "text-slate-300 group-hover:text-indigo-600"
              }`}
          />
        </div>
      </Card>
    </motion.div>
  );
}
function PathCard({
  icon: Icon,
  title,
  desc,
  btnText,
  btnColor,
  color,
  onClick,
}) {
  const palette = {
    indigo: {
      bar: "from-indigo-500 to-blue-500",
      iconBg: "bg-indigo-50",
      iconBorder: "border-indigo-100",
      iconText: "text-indigo-600",
      btn: "from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 shadow-indigo-500/30",
      glow: "from-indigo-500/0 to-indigo-500/0 group-hover:from-indigo-500/20 group-hover:to-blue-500/20",
      hoverBorder: "hover:border-indigo-200",
    },
    emerald: {
      bar: "from-emerald-500 to-teal-500",
      iconBg: "bg-emerald-50",
      iconBorder: "border-emerald-100",
      iconText: "text-emerald-600",
      btn: "from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 shadow-emerald-500/30",
      glow: "from-emerald-500/0 to-emerald-500/0 group-hover:from-emerald-500/20 group-hover:to-teal-500/20",
      hoverBorder: "hover:border-emerald-200",
    },
    orange: {
      bar: "from-orange-500 to-amber-500",
      iconBg: "bg-orange-50",
      iconBorder: "border-orange-100",
      iconText: "text-orange-600",
      btn: "from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 shadow-orange-500/30",
      glow: "from-orange-500/0 to-orange-500/0 group-hover:from-orange-500/20 group-hover:to-amber-500/20",
      hoverBorder: "hover:border-orange-200",
    },
  }[color] || {};

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: 20 }}
      whileInView={{ opacity: 1, scale: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.4, type: "spring", bounce: 0.4 }}
      whileHover={{ y: -6 }}
      className="h-full"
    >
      <Card className={`h-full p-8 bg-white border border-slate-100 ${palette.hoverBorder} hover:shadow-2xl transition-all duration-300 group rounded-3xl overflow-hidden relative text-left`}>
        {/* Top gradient bar */}
        <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${palette.bar}`} />
        {/* Hover glow */}
        <div className={`absolute -top-20 -right-20 w-48 h-48 rounded-full blur-3xl bg-gradient-to-br ${palette.glow} transition-all duration-500 pointer-events-none`} />

        <div className={`relative h-14 w-14 rounded-2xl ${palette.iconBg} ${palette.iconBorder} border flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
          <Icon className={`h-7 w-7 ${palette.iconText}`} />
        </div>
        <h3 className="text-2xl font-bold text-slate-900 mb-3 tracking-tight">{title}</h3>
        <p className="text-slate-500 mb-8 leading-relaxed text-sm">{desc}</p>
        <Button
          onClick={onClick}
          className={`w-full h-12 rounded-xl text-white font-bold transition-all shadow-lg bg-gradient-to-r ${palette.btn} hover:scale-[1.02] active:scale-[0.98] group/btn`}
        >
          {btnText} <ArrowRight className="h-4 w-4 ml-2 group-hover/btn:translate-x-1 transition-transform" />
        </Button>
      </Card>
    </motion.div>
  );
}

// ============ TOP COMPANIES ============
const TOP_COMPANIES = [
  {
    category: "Tech Giants",
    items: [
      {
        name: "Google",
        jobs: "1245",
        logo: "https://www.google.com/images/branding/googlelogo/2x/googlelogo_color_92x30dp.png",
      },
      {
        name: "Microsoft",
        jobs: "982",
        logo: "https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg",
      },
      {
        name: "Meta",
        jobs: "876",
        logo: "https://upload.wikimedia.org/wikipedia/commons/7/7b/Meta_Platforms_Inc._logo.svg",
      },
    ],
  },
  {
    category: "Entertainment",
    items: [
      {
        name: "Netflix",
        jobs: "543",
        logo: "https://upload.wikimedia.org/wikipedia/commons/0/08/Netflix_2015_logo.svg",
      },
      {
        name: "Spotify",
        jobs: "321",
        logo: "/assests/spotify.png",
      },
      {
        name: "Reddit",
        jobs: "210",
        logo: "/assests/reddit.png",
      },
    ],
  },
  {
    category: "Startups",
    items: [
      { name: "Talkit", jobs: "98", logo: "/assests/brands/brand5.png" },
      { name: "Vodafone", jobs: "156", logo: "/assests/brands/brand1.png" },
      { name: "Intel", jobs: "87", logo: "/assests/brands/brand2.png" },
    ],
  },
];

function TopCompanies() {
  const accent = {
    "Tech Giants": { bg: "from-indigo-500 to-blue-500", chip: "bg-indigo-50 text-indigo-700 border-indigo-100", icon: Zap },
    "Entertainment": { bg: "from-pink-500 to-rose-500", chip: "bg-pink-50 text-pink-700 border-pink-100", icon: Sparkles },
    "Startups": { bg: "from-emerald-500 to-teal-500", chip: "bg-emerald-50 text-emerald-700 border-emerald-100", icon: Star },
  };
  return (
    <section className="py-24 bg-gradient-to-b from-slate-50/30 via-white to-slate-50/30 relative overflow-hidden">
      <div className="absolute top-1/4 left-0 w-[400px] h-[400px] bg-indigo-200/30 rounded-full blur-[120px] -ml-48 pointer-events-none" />
      <div className="absolute bottom-1/4 right-0 w-[400px] h-[400px] bg-pink-200/30 rounded-full blur-[120px] -mr-48 pointer-events-none" />

      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-50 border border-emerald-100 mb-5">
            <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
            <span className="text-xs font-bold text-emerald-700 uppercase tracking-widest">Live · Hiring Now</span>
          </div>
          <h2 className="text-4xl lg:text-5xl font-bold text-slate-900 tracking-tight">
            Top Companies<span className="text-indigo-600"> Hiring Now</span>
          </h2>
          <p className="text-slate-500 font-medium mt-3 max-w-xl mx-auto text-lg">
            Join leading brands actively recruiting talent like you.
          </p>
        </motion.div>
        <div className="grid md:grid-cols-3 gap-8">
          {TOP_COMPANIES.map((group, idx) => {
            const ac = accent[group.category] || accent["Tech Giants"];
            const Ico = ac.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.4, delay: idx * 0.1 }}
                whileHover={{ y: -6 }}
                className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl shadow-slate-200/40 border border-white/60 hover:border-indigo-200 hover:shadow-2xl hover:shadow-indigo-200/30 transition-all duration-500 group overflow-hidden relative"
              >
                {/* Top gradient strip */}
                <div className={`h-1.5 w-full bg-gradient-to-r ${ac.bg}`} />

                <div className="p-7">
                  <div className="flex items-center justify-between mb-7">
                    <div className="flex items-center gap-3">
                      <div className={`h-10 w-10 rounded-xl bg-gradient-to-br ${ac.bg} text-white flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-300`}>
                        <Ico className="h-5 w-5" />
                      </div>
                      <h3 className="text-lg font-bold text-slate-900 tracking-tight">
                        {group.category}
                      </h3>
                    </div>
                    <span className={`text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full border ${ac.chip}`}>
                      {group.items.length}
                    </span>
                  </div>
                  <div className="space-y-2">
                    {group.items.map((company, cIdx) => (
                      <div
                        key={cIdx}
                        className="flex items-center justify-between group/item cursor-pointer hover:bg-slate-50 p-2.5 rounded-2xl transition border border-transparent hover:border-slate-100"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="h-11 w-11 rounded-xl bg-white border border-slate-100 p-2 shadow-sm flex items-center justify-center group-hover/item:scale-110 group-hover/item:border-indigo-200 transition flex-shrink-0">
                            <img
                              src={company.logo}
                              alt={company.name}
                              className="h-full w-full object-contain"
                            />
                          </div>
                          <div className="min-w-0">
                            <h4 className="font-bold text-slate-900 text-sm group-hover/item:text-indigo-600 transition truncate">
                              {company.name}
                            </h4>
                            <p className="text-[11px] font-bold text-slate-400 flex items-center gap-1">
                              <Briefcase className="h-2.5 w-2.5" />
                              {company.jobs} jobs
                            </p>
                          </div>
                        </div>
                        <ArrowRight className="h-4 w-4 text-slate-300 group-hover/item:text-indigo-600 group-hover/item:translate-x-1 transition flex-shrink-0" />
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function timeAgo(date) {
  if (!date) return "Recently";
  const seconds = Math.floor((new Date() - new Date(date)) / 1000);
  let interval = seconds / 31536000;
  if (interval > 1) return Math.floor(interval) + " years ago";
  interval = seconds / 2592000;
  if (interval > 1) return Math.floor(interval) + " months ago";
  interval = seconds / 86400;
  if (interval > 1) return Math.floor(interval) + " days ago";
  interval = seconds / 3600;
  if (interval > 1) return Math.floor(interval) + " hours ago";
  interval = seconds / 60;
  if (interval > 1) return Math.floor(interval) + " minutes ago";
  return "Just now";
}

// ============ JOB CARD ============
// ============ PREMIUM COMPONENTS ============
function ModernSpinner({ size = "md", color = "indigo" }) {
  const sizes = {
    sm: "h-6 w-6 border-2",
    md: "h-12 w-12 border-4",
    lg: "h-20 w-20 border-[6px]"
  };
  const colors = {
    indigo: "border-indigo-500/20 border-t-indigo-600",
    white: "border-white/20 border-t-white",
    purple: "border-purple-500/20 border-t-purple-600"
  };

  return (
    <div className="relative flex items-center justify-center">
      <div className={`rounded-full animate-spin ${sizes[size]} ${colors[color]}`} />
      <div className={`absolute rounded-full blur-md opacity-40 animate-pulse ${sizes[size]} ${colors[color]}`} />
    </div>
  );
}

function GameHeader({ userPoints, onBack, title = "Game Hub", subtitle = "Elevate your career through play." }) {
  return (
    <div className="bg-gradient-to-r from-indigo-900 via-slate-900 to-purple-900 py-8 px-8 text-white border-b border-white/5 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="container mx-auto flex flex-col md:flex-row items-center justify-between relative z-10 gap-8">
        <div className="flex items-center gap-6">
          <button
            onClick={onBack}
            className="h-14 w-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-2xl shadow-indigo-500/20 ring-4 ring-white/5 hover:scale-105 transition-all active:scale-95 group"
          >
            <ArrowLeft className="h-7 w-7 group-hover:-translate-x-1 transition-transform" />
          </button>
          <div>
            <div className="text-3xl font-bold tracking-tight">RCM <span className="text-indigo-400">{title}</span></div>
            <p className="text-slate-400 font-medium">{subtitle}</p>
          </div>
        </div>
        <div className="flex items-center gap-10 bg-white/5 backdrop-blur-xl p-6 rounded-3xl border border-white/10 shadow-2xl">
          <div className="text-center">
            <div className="text-2xl font-bold text-indigo-400">{userPoints}</div>
            <div className="text-[10px] uppercase font-bold tracking-widest text-slate-400">Points</div>
          </div>
          <div className="w-px h-10 bg-white/10" />
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-400">Lvl {Math.floor(userPoints / 50) + 1}</div>
            <div className="text-[10px] uppercase font-bold tracking-widest text-slate-400">Level</div>
          </div>
          <div className="w-px h-10 bg-white/10" />
          <div className="text-center">
            <div className="text-2xl font-bold flex items-center gap-2 text-amber-400">
              {Math.floor(userPoints / 20)} <Sparkles className="h-5 w-5" />
            </div>
            <div className="text-[10px] uppercase font-bold tracking-widest text-slate-400">Merit</div>
          </div>
        </div>
      </div>
    </div>
  );
}

function JobCard({ job, onClick, featuredIndex }) {
  const isFeatured = featuredIndex === 1;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9 }}
      whileHover={{ y: -8 }}
      transition={{ duration: 0.4, type: "spring", bounce: 0.3 }}
      onClick={onClick}
      className={`group cursor-pointer rounded-3xl p-8 bg-white border transition-all duration-500 flex flex-col min-h-[380px] relative overflow-hidden ${isFeatured
          ? "border-indigo-600 shadow-2xl shadow-indigo-100 ring-4 ring-indigo-50"
          : "border-slate-100 shadow-xl shadow-slate-100/30 hover:border-indigo-200 hover:shadow-2xl hover:shadow-indigo-200/20"
        }`}
    >
      {/* Featured Badge */}
      {isFeatured && (
        <div className="absolute top-0 right-0">
          <div className="bg-indigo-600 text-white text-[10px] font-bold uppercase tracking-widest px-4 py-1.5 rounded-bl-2xl flex items-center gap-1.5 shadow-lg">
            <Sparkles className="h-3 w-3" /> Featured
          </div>
        </div>
      )}

      {/* Header Section */}
      <div className="flex items-start justify-between mb-6">
        <div className="flex items-center gap-4">
          <div className="h-14 w-14 flex-shrink-0 rounded-2xl bg-gradient-to-br from-slate-50 to-white border border-slate-100 shadow-sm flex items-center justify-center p-2.5 group-hover:scale-105 transition duration-500 overflow-hidden">
            {(job.logo || job.companyLogo) ? (
              <img src={job.logo || job.companyLogo} alt={job.companyName} className="w-full h-full object-contain" onError={(e) => { e.currentTarget.style.display = 'none'; e.currentTarget.nextElementSibling.style.display = 'flex'; }} />
            ) : null}
            <div className={`font-bold text-xl text-indigo-600 ${(job.logo || job.companyLogo) ? 'hidden' : 'flex items-center justify-center w-full h-full'}`}>{(job.companyName || "C").charAt(0)}</div>
          </div>
          <div className="min-w-0">
            <h3 className="text-lg font-bold text-slate-900 group-hover:text-indigo-600 transition truncate leading-tight">
              {job.title}
            </h3>
            <div className="flex items-center gap-2 mt-1">
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                {job.companyName}
              </p>
              <span className="h-1 w-1 rounded-full bg-slate-300" />
              <p className="text-[10px] font-medium text-slate-400">
                {timeAgo(job.createdAt)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Tags Section */}
      <div className="flex flex-wrap gap-2 mb-6">
        <div className="bg-indigo-50 text-indigo-600 text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-lg border border-indigo-100/50">
          {job.category || "General"}
        </div>
        {job.location && (
          <div className="bg-slate-50 text-slate-500 text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-lg border border-slate-100 flex items-center gap-1">
            <MapPin className="h-3 w-3" /> {job.location}
          </div>
        )}
      </div>

      {/* Description */}
      <p className="text-slate-500 text-sm font-medium leading-relaxed mb-6 line-clamp-2 flex-1">
        {job.description || "Join our team to make an impact in the RCM industry with top-tier professionals."}
      </p>

      {/* Stats Row */}
      <div className="grid grid-cols-2 gap-8 pt-6 border-t border-slate-50 mb-8">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-xl bg-purple-50 flex items-center justify-center text-purple-600 border border-purple-100/50">
            <Briefcase className="h-4 w-4" />
          </div>
          <div>
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-1">Exp.</div>
            <div className="text-xs font-bold text-slate-700">{job.experienceRequired || 0}+ Yrs</div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 border border-blue-100/50">
            <Users className="h-4 w-4" />
          </div>
          <div>
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-1">Applicants</div>
            <div className="text-xs font-bold text-slate-700">{job.applicantCount || 0}</div>
          </div>
        </div>
      </div>

      {/* Footer Section */}
      <div className="flex items-center justify-between mt-auto">
        <div>
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Annual Salary</div>
          <div className="text-xl font-bold text-slate-900">
            ₹{job.salary > 0 ? (job.salary / 1000).toFixed(0) + "k" : "12k"}
            <span className="text-xs text-slate-400 font-semibold ml-1 uppercase">/yr</span>
          </div>
        </div>
        <Button className="rounded-xl px-6 h-10 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white font-bold text-xs shadow-lg shadow-indigo-600/20 transition-all active:scale-95 group/btn">
          Apply Now <ArrowRight className="h-3 w-3 ml-2 group-hover/btn:translate-x-1 transition-transform" />
        </Button>
      </div>
    </motion.div>
  );
}

// ============ JOBS LIST ============
function Jobs({ setView, setSelectedJobId }) {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [location, setLocation] = useState("");
  const [skill, setSkill] = useState("");
  const [minSalary, setMinSalary] = useState("");
  const [category, setCategory] = useState("");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.set("search", search);
      if (location) params.set("location", location);
      if (skill) params.set("skill", skill);
      if (category) params.set("category", category);
      if (minSalary) params.set("minSalary", minSalary);
      params.set("page", page);
      params.set("limit", "12");
      const d = await api(`/jobs?${params.toString()}`);
      setJobs(d.jobs || []);
      setTotal(d.total || 0);
    } catch (e) {
      toast.error(e.message);
    } finally {
      setLoading(false);
    }
  }, [search, location, skill, category, minSalary, page]);

  const [categories, setCategories] = useState([]);

  useEffect(() => {
    api("/categories")
      .then((d) => {
        const all = d.sections.flatMap((s) => s.items);
        setCategories(all);
      })
      .catch(() => { });
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const totalPages = Math.ceil(total / 12) || 1;

  return (
    <div className="bg-[#F8F9FE] min-h-screen">
      {/* Hero Banner */}
      <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 pt-12 sm:pt-20 lg:pt-32 pb-28 sm:pb-36 lg:pb-44 relative overflow-hidden">
        {/* Decorative Background Elements */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-indigo-500/20 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 w-96 h-96 bg-blue-500/15 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 w-[700px] h-[700px] bg-purple-500/5 rounded-full blur-[120px] pointer-events-none -translate-x-1/2 -translate-y-1/2" />

        {/* Subtle grid */}
        <div
          className="absolute inset-0 opacity-[0.05] pointer-events-none"
          style={{
            backgroundImage: "linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)",
            backgroundSize: "50px 50px"
          }}
        />

        {/* Animated Particles */}
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-indigo-400 rounded-full animate-pulse" />
        <div className="absolute top-1/2 right-1/3 w-3 h-3 bg-emerald-400 rounded-full animate-pulse delay-700" />
        <div className="absolute bottom-1/4 left-1/2 w-2 h-2 bg-blue-400 rounded-full animate-pulse delay-500" />
        <div className="absolute top-1/3 right-1/4 w-1.5 h-1.5 bg-blue-400 rounded-full animate-pulse delay-1000" />

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="container mx-auto px-4 sm:px-6 text-center relative z-10"
        >
          <Badge className="bg-white/10 text-indigo-300 border-white/10 mb-6 px-4 py-1.5 rounded-full backdrop-blur-md uppercase tracking-widest text-[10px] font-bold">
            <Sparkles className="h-3 w-3 mr-2" /> Explore 5000+ Opportunities
          </Badge>
          <h1 className="text-3xl sm:text-5xl lg:text-7xl font-bold text-white mb-6 tracking-tight leading-tight sm:leading-[1.05]">
            Find Your Dream <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-blue-400 to-cyan-400">Career</span>
          </h1>
          <p className="text-slate-400 font-semibold max-w-2xl mx-auto text-sm sm:text-base lg:text-lg leading-relaxed">
            Discover hand-picked roles from top-tier companies and take the next step in your professional journey.
          </p>

          {/* Stats strip */}
          <div className="hidden md:flex items-center justify-center gap-10 mt-12">
            <div className="flex items-center gap-2 text-white/80 text-sm font-medium">
              <CheckCircle className="h-4 w-4 text-emerald-400" />
              <span>5,000+ Verified Jobs</span>
            </div>
            <div className="h-4 w-px bg-white/20" />
            <div className="flex items-center gap-2 text-white/80 text-sm font-medium">
              <Building2 className="h-4 w-4 text-blue-400" />
              <span>500+ Companies</span>
            </div>
            <div className="h-4 w-px bg-white/20" />
            <div className="flex items-center gap-2 text-white/80 text-sm font-medium">
              <Users className="h-4 w-4 text-pink-400" />
              <span>10,000+ Candidates</span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Floating Search Bar */}
      <div className="container mx-auto px-4 sm:px-6 max-w-6xl -mt-16 relative z-20">
        <div className="bg-white rounded-3xl p-3 sm:p-4 shadow-2xl shadow-indigo-900/10 flex flex-col lg:flex-row items-stretch lg:items-center border border-slate-100 gap-3 lg:gap-0">
          <div className="w-full lg:flex-1 flex items-center gap-4 px-6 py-3 lg:border-r border-slate-100">
            <Search className="h-5 w-5 text-indigo-600" />
            <div className="flex-1">
              <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">
                Role Title
              </div>
              <Input
                placeholder="e.g. Web Developer"
                className="border-0 shadow-none p-0 h-auto rounded-none focus-visible:ring-0 text-slate-900 font-bold text-base placeholder:text-slate-300"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
              />
            </div>
          </div>

          <div className="w-full lg:flex-1 flex items-center gap-4 px-6 py-3 lg:border-r border-slate-100">
            <Layers className="h-5 w-5 text-blue-500" />
            <div className="flex-1">
              <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">
                Category
              </div>
              <Select
                value={category}
                onValueChange={(v) => {
                  setCategory(v === "all" ? "" : v);
                  setPage(1);
                }}
              >
                <SelectTrigger className="border-0 shadow-none p-0 h-auto rounded-none focus:ring-0 text-slate-900 font-bold text-base [&>span]:line-clamp-1 w-full">
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent className="rounded-2xl border-slate-100">
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map((c) => (
                    <SelectItem key={c} value={c}>
                      {c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="w-full lg:flex-1 flex items-center gap-4 px-6 py-3">
            <MapPin className="h-5 w-5 text-emerald-500" />
            <div className="flex-1">
              <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">
                Location
              </div>
              <Input
                placeholder="e.g. Remote"
                className="border-0 shadow-none p-0 h-auto rounded-none focus-visible:ring-0 text-slate-900 font-bold text-base placeholder:text-slate-300"
                value={location}
                onChange={(e) => {
                  setLocation(e.target.value);
                  setPage(1);
                }}
              />
            </div>
          </div>

          <Button
            onClick={load}
            className="w-full lg:w-auto rounded-2xl px-10 h-16 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white font-bold transition-all shadow-xl shadow-indigo-600/20 text-base"
          >
            Find Job
          </Button>
        </div>
      </div>

      <section className="container mx-auto px-4 sm:px-6 py-10 sm:py-16 max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 sm:mb-12 gap-4 sm:gap-6 bg-white p-4 sm:p-6 rounded-3xl border border-slate-100 shadow-sm shadow-indigo-100/30"
        >
          <div className="flex items-center gap-3 text-slate-500 font-semibold">
            <div className="h-10 w-10 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center">
              <Briefcase className="h-5 w-5 text-indigo-600" />
            </div>
            <div>
              <div className="text-xs uppercase tracking-widest text-slate-400 font-bold mb-0.5">Results</div>
              <div>
                Showing <span className="text-indigo-600 px-2 py-0.5 bg-indigo-50 rounded-lg font-bold">{jobs.length}</span> of <span className="text-slate-900 font-bold">{total}</span> opportunities
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Sort By</span>
              <Select defaultValue="recent">
                <SelectTrigger className="w-[180px] rounded-xl bg-slate-50 border-none font-bold h-12 hover:bg-indigo-50 transition">
                  <SelectValue placeholder="Recently Added" />
                </SelectTrigger>
                <SelectContent className="rounded-2xl border-slate-100">
                  <SelectItem value="recent">Recently Added</SelectItem>
                  <SelectItem value="salary">Highest Salary</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </motion.div>

        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="h-10 w-10 animate-spin text-indigo-600" />
          </div>
        ) : jobs.length === 0 ? (
          <EmptyState
            icon={Search}
            title="No jobs match your filters"
            subtitle="Try adjusting your search criteria."
          />
        ) : (
          <>
            <motion.div layout className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              <AnimatePresence mode="popLayout">
                {jobs.map((job, index) => (
                  <JobCard
                    key={job.id}
                    job={job}
                    featuredIndex={index}
                    onClick={() => {
                      setSelectedJobId(job.id);
                      setView("jobDetails");
                    }}
                  />
                ))}
              </AnimatePresence>
            </motion.div>

            <div className="flex justify-center items-center gap-2 mt-16">
              <button
                disabled={page <= 1}
                onClick={() => setPage((p) => p - 1)}
                className="w-11 h-11 rounded-2xl flex items-center justify-center bg-white border border-slate-200 text-slate-500 hover:border-indigo-600 hover:text-indigo-600 hover:shadow-md hover:shadow-indigo-100 transition disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              {[...Array(totalPages)].map((_, i) => {
                const pageNum = i + 1;
                if (
                  pageNum === 1 ||
                  pageNum === totalPages ||
                  (pageNum >= page - 1 && pageNum <= page + 1)
                ) {
                  return (
                    <button
                      key={pageNum}
                      onClick={() => setPage(pageNum)}
                      className={`w-11 h-11 rounded-2xl flex items-center justify-center font-black text-sm transition-all ${page === pageNum
                          ? "bg-gradient-to-br from-indigo-600 to-blue-600 text-white shadow-lg shadow-indigo-300/50 scale-110"
                          : "bg-white text-slate-500 hover:bg-indigo-50 hover:text-indigo-600 border border-slate-100"
                        }`}
                    >
                      {pageNum}
                    </button>
                  );
                }
                if (pageNum === 2 && page > 3)
                  return (
                    <span key="dots1" className="text-slate-400 px-1 font-bold">
                      ···
                    </span>
                  );
                if (pageNum === totalPages - 1 && page < totalPages - 2)
                  return (
                    <span key="dots2" className="text-slate-400 px-1 font-bold">
                      ···
                    </span>
                  );
                return null;
              })}
              <button
                disabled={page >= totalPages}
                onClick={() => setPage((p) => p + 1)}
                className="w-11 h-11 rounded-2xl flex items-center justify-center bg-gradient-to-br from-indigo-600 to-blue-600 text-white shadow-lg shadow-indigo-300/50 hover:shadow-xl hover:shadow-indigo-300/60 transition disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </>
        )}
      </section>

    </div>
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
        if (user?.role === "CANDIDATE") {
          const p = await api("/profile");
          setProfile(p.profile);
        }
      } catch (e) {
        toast.error(e.message);
      } finally {
        setLoading(false);
      }
    })();
  }, [jobId, user]);

  const apply = async () => {
    if (!user) {
      toast.error("Please log in first");
      return setView("login");
    }
    if (user.role !== "CANDIDATE")
      return toast.error("Only candidates can apply");
    if (!profile?.resumeUrl) {
      toast.error("Please upload your resume first");
      return setView("profile");
    }
    setApplying(true);
    try {
      await api("/applications", {
        method: "POST",
        body: JSON.stringify({
          jobId,
          resumeUrl: profile.resumeUrl,
          resumeName: profile.resumeName,
        }),
      });
      toast.success("Application submitted!");
      onApplied?.();
    } catch (e) {
      toast.error(e.message);
    } finally {
      setApplying(false);
    }
  };

  if (loading)
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  if (!job) return <EmptyState icon={XCircle} title="Job not found" />;

  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ type: "spring", bounce: 0, duration: 0.4 }}
      className="bg-[#F8F9FE] min-h-screen pb-20"
    >
      {/* Hero Header */}
      <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 pt-10 sm:pt-16 lg:pt-24 pb-20 sm:pb-28 relative overflow-hidden">
        {/* Animated Background Orbs */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-600/20 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute -bottom-32 -left-32 w-[400px] h-[400px] bg-blue-600/15 rounded-full blur-[100px] animate-pulse delay-1000" />

        {/* Subtle grid */}
        <div
          className="absolute inset-0 opacity-[0.05] pointer-events-none"
          style={{
            backgroundImage: "linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)",
            backgroundSize: "40px 40px"
          }}
        />

        <div className="container mx-auto px-4 sm:px-6 max-w-6xl relative z-10">
          <button
            onClick={() => setView("jobs")}
            className="group mb-8 inline-flex items-center gap-2 text-white/60 hover:text-white transition-all font-bold text-xs uppercase tracking-widest bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl px-4 py-2 backdrop-blur-md"
          >
            <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
            Back to Explore
          </button>

          <div className="flex flex-col md:flex-row items-center md:items-start text-center md:text-left gap-6">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="relative"
            >
              <div className="absolute -inset-1.5 rounded-2xl bg-gradient-to-br from-indigo-500 to-blue-500 blur-lg opacity-40" />
              <div className="relative h-20 w-20 rounded-2xl bg-white flex items-center justify-center p-3 shadow-xl border-4 border-white/10 group hover:rotate-3 transition-transform duration-500 overflow-hidden">
                {(job.logo || job.companyLogo) ? (
                  <img
                    src={job.logo || job.companyLogo}
                    alt={job.companyName}
                    className="w-full h-full object-contain"
                    onError={(e) => { e.currentTarget.style.display = 'none'; e.currentTarget.nextElementSibling.style.display = 'flex'; }}
                  />
                ) : null}
                <div className={`font-black text-3xl text-indigo-600 ${(job.logo || job.companyLogo) ? 'hidden' : 'flex items-center justify-center w-full h-full'}`}>
                  {(job.companyName || "C").charAt(0)}
                </div>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="flex-1"
            >
              <div className="flex flex-wrap justify-center md:justify-start gap-2 mb-3">
                <Badge className="bg-indigo-500/20 text-indigo-300 border-indigo-500/30 rounded-full px-3 py-0.5 text-[10px] backdrop-blur-md">
                  <Sparkles className="h-2.5 w-2.5 mr-1" /> Featured Role
                </Badge>
                <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-500/30 rounded-full px-3 py-0.5 text-[10px] backdrop-blur-md">
                  <CheckCircle className="h-2.5 w-2.5 mr-1" /> Verified Client
                </Badge>
              </div>
              <h1 className="text-2xl lg:text-4xl font-bold text-white mb-3 leading-tight tracking-tight">
                {job.title}
              </h1>
              <div className="flex flex-wrap justify-center md:justify-start items-center gap-x-4 gap-y-2 text-indigo-200/80 text-sm font-semibold">
                <div className="flex items-center gap-1.5">
                  <Building2 className="w-4 h-4" /> {job.companyName}
                </div>
                <span className="hidden md:inline h-1 w-1 rounded-full bg-white/30" />
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-4 h-4" /> {job.location || "Remote"}
                </div>
                <span className="hidden md:inline h-1 w-1 rounded-full bg-white/30" />
                <div className="flex items-center gap-1.5">
                  <Users className="w-4 h-4" /> {job.applicantCount || 0} Applicants
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 sm:px-6 max-w-6xl -mt-12 relative z-20">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Column - Detailed Info */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="rounded-2xl border-none shadow-xl shadow-indigo-900/5 p-6 md:p-8 bg-white">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-1 h-6 bg-indigo-600 rounded-full" />
                <h2 className="text-xl font-bold text-slate-900 tracking-tight">
                  About the <span className="text-indigo-600">Position</span>
                </h2>
              </div>
              <div className="text-slate-600 leading-relaxed whitespace-pre-wrap text-sm font-medium">
                {job.description}
              </div>

              <div className="mt-8 pt-8 border-t border-slate-100">
                <h3 className="text-lg font-bold text-slate-900 mb-5 tracking-tight">
                  Core Requirements & <span className="text-blue-500">Skills</span>
                </h3>
                <div className="flex flex-wrap gap-2">
                  {(job.requiredSkills || []).map((s) => (
                    <Badge
                      key={s}
                      className="bg-slate-50 text-slate-700 hover:bg-indigo-600 hover:text-white border-slate-100 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-default"
                    >
                      {s}
                    </Badge>
                  ))}
                </div>
              </div>
            </Card>

            {/* Perks / Benefits Section */}
            <div className="grid md:grid-cols-3 gap-4">
              {[
                { icon: Zap, title: "Fast Tracking", desc: "Quick application response", color: "indigo" },
                { icon: ShieldCheck, title: "Verified", desc: "Legit company profile", color: "emerald" },
                { icon: Sparkles, title: "Top Perks", desc: "Competitive benefits", color: "amber" },
              ].map((perk, i) => {
                const palette = {
                  indigo: { bg: "bg-indigo-50", text: "text-indigo-600", border: "border-indigo-100", hover: "hover:border-indigo-300" },
                  emerald: { bg: "bg-emerald-50", text: "text-emerald-600", border: "border-emerald-100", hover: "hover:border-emerald-300" },
                  amber: { bg: "bg-amber-50", text: "text-amber-600", border: "border-amber-100", hover: "hover:border-amber-300" },
                }[perk.color];
                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-40px" }}
                    transition={{ duration: 0.4, delay: i * 0.08 }}
                    whileHover={{ y: -3 }}
                    className={`bg-white p-5 rounded-2xl shadow-md shadow-slate-100/50 border border-slate-100 ${palette.hover} transition-all duration-300 group`}
                  >
                    <div className={`h-10 w-10 rounded-xl ${palette.bg} ${palette.border} border flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300`}>
                      <perk.icon className={`w-5 h-5 ${palette.text}`} />
                    </div>
                    <h4 className="font-bold text-slate-900 text-sm mb-0.5">{perk.title}</h4>
                    <p className="text-xs text-slate-400 font-medium">{perk.desc}</p>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Right Column - Sticky Sidebar */}
          <div className="space-y-6">
            <div className="sticky top-28">
              <Card className="rounded-2xl border-none shadow-xl shadow-indigo-900/10 p-6 bg-white overflow-hidden relative">
                <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-600/5 rounded-full -mr-12 -mt-12" />
                <div className="absolute -bottom-8 -left-8 w-24 h-24 bg-blue-500/5 rounded-full" />

                <div className="flex items-center gap-2.5 mb-6">
                  <div className="w-1 h-6 bg-gradient-to-b from-indigo-600 to-blue-600 rounded-full" />
                  <h2 className="text-lg font-bold text-slate-900 tracking-tight">
                    Job <span className="text-indigo-600">Snapshot</span>
                  </h2>
                </div>

                <div className="space-y-4 mb-6">
                  <div className="flex items-center gap-3 group">
                    <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600 group-hover:scale-110 transition flex-shrink-0">
                      <IndianRupee className="w-5 h-5" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Annual Salary</div>
                      <div className="text-sm font-bold text-slate-900 truncate">
                        {job.salary > 0 ? `₹${job.salary.toLocaleString()}` : "Negotiable"}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 group">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 group-hover:scale-110 transition flex-shrink-0">
                      <MapPin className="w-5 h-5" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Work Location</div>
                      <div className="text-sm font-bold text-slate-900 truncate">{job.location || "Remote"}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 group">
                    <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center text-orange-600 group-hover:scale-110 transition flex-shrink-0">
                      <Briefcase className="w-5 h-5" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Experience</div>
                      <div className="text-sm font-bold text-slate-900">{job.experienceRequired || 0}+ Years</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 group">
                    <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center text-purple-600 group-hover:scale-110 transition flex-shrink-0">
                      <Clock className="w-5 h-5" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Date Posted</div>
                      <div className="text-sm font-bold text-slate-900">{timeAgo(job.createdAt)}</div>
                    </div>
                  </div>
                </div>

                <Button
                  onClick={apply}
                  disabled={applying}
                  className="w-full h-12 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white rounded-xl font-bold text-sm shadow-lg shadow-indigo-600/30 transition-all hover:scale-[1.02] active:scale-95 group"
                >
                  {applying ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    <>
                      Apply for this position
                      <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition" />
                    </>
                  )}
                </Button>

                <div className="flex items-center justify-center gap-1.5 text-slate-400 text-[10px] font-bold mt-4 uppercase tracking-widest">
                  <ShieldCheck className="h-3 w-3 text-emerald-500" />
                  100% Safe & Secure
                </div>
              </Card>

              {/* Share Job */}
              <div className="mt-5 flex items-center justify-center gap-3">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Share this job</span>
                <div className="flex gap-1.5">
                  {[Linkedin, Twitter, Facebook].map((Icon, i) => (
                    <button key={i} className="w-8 h-8 rounded-lg bg-white border border-slate-100 flex items-center justify-center text-slate-400 hover:text-indigo-600 hover:border-indigo-600 transition">
                      <Icon className="w-4 h-4" />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// ============ AUTH ============
function AuthPage({ mode, setUser, setView }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("CANDIDATE");
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const endpoint = mode === "login" ? "/auth/login" : "/auth/register";
      const body =
        mode === "login"
          ? { email, password }
          : { name, email, password, role };
      const d = await api(endpoint, {
        method: "POST",
        body: JSON.stringify(body),
      });
      localStorage.setItem("token", d.token);
      setUser(d.user);
      toast.success(mode === "login" ? "Welcome back!" : "Account created!");
      setTimeout(() => {
        if (d.user.role === "ADMIN" || d.user.role === "SUPERADMIN")
          window.location.href = "/admin";
        else if (d.user.role === "EMPLOYER") setView("employerDash");
        else setView("candidateDash");
      }, 50);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="min-h-[calc(100vh-64px)] flex items-center justify-center bg-[#0f0f12] relative overflow-hidden py-10">
      {/* Decorative Gradients */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-purple-600/20 rounded-full blur-[120px] -mr-64 -mt-64" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px] -ml-64 -mb-64" />

      <div className="container mx-auto px-4 sm:px-6 relative z-10 grid lg:grid-cols-2 gap-8 lg:gap-12 items-center max-w-6xl">
        {/* Left Side Info (from image) */}
        <div className="hidden lg:block space-y-8">
          <h1 className="text-4xl xl:text-6xl font-bold text-white leading-tight">
            Welcome{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">
              Back
            </span>
          </h1>
          <p className="text-xl text-slate-400 max-w-md leading-relaxed">
            Sign in to access your personalized dashboard and continue your
            journey with RCM Job
          </p>

          <div className="space-y-6">
            <div className="flex gap-4">
              <div className="h-12 w-12 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
                <User className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-white font-semibold">
                  Personalized Experience
                </h3>
                <p className="text-slate-400 text-sm">
                  Tailored job recommendations and insights
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="h-12 w-12 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-white font-semibold">Secure Platform</h3>
                <p className="text-slate-400 text-sm">
                  Your data is protected with enterprise-grade security
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="h-12 w-12 rounded-xl bg-green-500/10 border border-green-500/20 flex items-center justify-center text-green-400">
                <Sparkles className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-white font-semibold">Quick Access</h3>
                <p className="text-slate-400 text-sm">
                  Instant login from any device, anywhere
                </p>
              </div>
            </div>
          </div>

          <div className="flex gap-12 pt-8 border-t border-white/5">
            <div>
              <div className="text-3xl font-bold text-white">2M+</div>
              <div className="text-slate-500 text-sm">Active Users</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-white">50K+</div>
              <div className="text-slate-500 text-sm">Companies</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-white">98%</div>
              <div className="text-slate-500 text-sm">Satisfaction</div>
            </div>
          </div>
        </div>

        {/* Right Side Card (from image) */}
        <div className="w-full max-w-md mx-auto">
          <Card className="bg-white/5 border-white/10 backdrop-blur-xl text-white shadow-2xl overflow-hidden">
            <CardHeader className="text-center space-y-1 pb-4">
              <div className="mx-auto h-12 w-12 rounded-2xl bg-purple-500/20 border border-purple-500/30 flex items-center justify-center text-purple-400 mb-2">
                <User className="h-7 w-7" />
              </div>
              <CardTitle className="text-2xl font-bold">Sign In</CardTitle>
              <CardDescription className="text-slate-400 text-sm">
                Enter your credentials to access your account
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">



              <form onSubmit={submit} className="space-y-4">
                {mode === "register" && (
                  <div className="space-y-1.5">
                    <Label className="text-slate-400">Full name</Label>
                    <Input
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Jane Doe"
                      className="bg-white/5 border-white/10 text-white h-11"
                    />
                  </div>
                )}
                <div className="space-y-1.5">
                  <Label className="text-slate-400">Email address</Label>
                  <div className="relative">
                    <Mail className="h-4 w-4 absolute left-3 top-3.5 text-slate-500" />
                    <Input
                      required
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      className="bg-white/5 border-white/10 text-white h-11 pl-10"
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-slate-400">Password</Label>
                  <div className="relative">
                    <Lock className="h-4 w-4 absolute left-3 top-3.5 text-slate-500" />
                    <Input
                      required
                      type="password"
                      minLength={6}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="bg-white/5 border-white/10 text-white h-11 pl-10"
                    />
                  </div>
                </div>
                {mode === "register" && (
                  <div className="space-y-1.5">
                    <Label className="text-slate-400">I am a</Label>
                    <Select value={role} onValueChange={setRole}>
                      <SelectTrigger className="bg-white/5 border-white/10 text-white h-11">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-900 border-white/10 text-white">
                        <SelectItem value="CANDIDATE">
                          Job seeker (Candidate)
                        </SelectItem>
                        <SelectItem value="EMPLOYER">
                          Employer (hiring)
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}

                <div className="flex items-center justify-between text-sm">
                  <button
                    type="button"
                    className="text-purple-400 hover:text-purple-300 transition"
                  >
                    Forgot password?
                  </button>
                </div>

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white h-12 text-lg"
                >
                  {loading ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : mode === "login" ? (
                    "Sign In"
                  ) : (
                    "Create Account"
                  )}
                </Button>
              </form>
            </CardContent>
            <CardFooter className="justify-center border-t border-white/5 py-6">
              <p className="text-slate-400 text-sm">
                {mode === "login" ? (
                  <>
                    Don't have an account?{" "}
                    <button
                      onClick={() => setView("register")}
                      className="text-purple-400 font-medium hover:underline"
                    >
                      Sign up
                    </button>
                  </>
                ) : (
                  <>
                    Already have an account?{" "}
                    <button
                      onClick={() => setView("login")}
                      className="text-purple-400 font-medium hover:underline"
                    >
                      Log in
                    </button>
                  </>
                )}
              </p>

            </CardFooter>

          </Card>
        </div>
      </div>
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
        const [a, p] = await Promise.all([
          api("/applications/mine"),
          api("/profile"),
        ]);
        setApps(a.applications || []);
        setProfile(p.profile);
      } catch (e) {
        toast.error(e.message);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const statusColor = (s) => {
    switch (s) {
      case "APPLIED":
        return "bg-blue-50 text-blue-600 border-blue-100";
      case "SHORTLISTED":
        return "bg-emerald-50 text-emerald-600 border-emerald-100";
      case "REJECTED":
        return "bg-rose-50 text-rose-600 border-rose-100";
      case "IN_REVIEW":
        return "bg-amber-50 text-amber-600 border-amber-100";
      default:
        return "bg-slate-50 text-slate-600 border-slate-100";
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, type: "spring", bounce: 0 }}
      className="min-h-screen bg-[#F8F9FD] pb-20 overflow-x-hidden"
    >
      {/* Hero banner */}
      <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 pt-8 sm:pt-12 pb-24 sm:pb-28 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-indigo-600/20 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 w-[300px] h-[300px] bg-blue-600/15 rounded-full blur-[100px] pointer-events-none" />
        <div
          className="absolute inset-0 opacity-[0.05] pointer-events-none"
          style={{
            backgroundImage: "linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)",
            backgroundSize: "40px 40px"
          }}
        />

        <div className="container mx-auto px-4 sm:px-6 relative z-10">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-5 sm:gap-6">
            <div className="flex items-start sm:items-center gap-4 sm:gap-5">
              {/* Avatar */}
              <div className="relative flex-shrink-0">
                <div className="absolute -inset-1 rounded-2xl bg-gradient-to-br from-indigo-500 to-pink-500 blur-md opacity-50" />
                <div className="relative h-14 w-14 sm:h-16 sm:w-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-blue-600 flex items-center justify-center font-bold text-white text-xl sm:text-2xl shadow-xl border-4 border-white/10">
                  {user.name?.charAt(0)?.toUpperCase() || "C"}
                </div>
                <div className="absolute -bottom-1 -right-1 bg-emerald-500 p-1 rounded-full shadow-md border-2 border-slate-900">
                  <CheckCircle className="h-3 w-3 text-white" />
                </div>
              </div>
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-1.5">
                  <Badge className="bg-white/10 text-indigo-300 border-white/10 backdrop-blur-md px-3 py-0.5 text-[10px] font-bold uppercase tracking-widest">
                    Candidate
                  </Badge>
                  <span className="text-xs font-medium text-white/50">
                    ID: RCM-{user.id?.slice(-6) || "8821"}
                  </span>
                </div>
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white tracking-tight">
                  Welcome back, {user.name.split(" ")[0]}! <span className="inline-block animate-wave">👋</span>
                </h1>
                <p className="text-slate-300 text-xs sm:text-sm mt-1 font-medium">
                  You have {apps.filter((a) => a.status === "APPLIED").length}{" "}
                  active applications this week.
                </p>
              </div>
            </div>
            <div className="grid grid-cols-2 sm:flex items-center gap-2 sm:gap-3 self-stretch sm:self-auto md:self-auto">
              <Button
                onClick={() => setView("profile")}
                className="h-10 sm:h-11 px-3 sm:px-5 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/20 backdrop-blur-md font-bold transition-all text-xs sm:text-sm"
              >
                <User className="h-4 w-4 mr-1.5 sm:mr-2" /> Edit Profile
              </Button>
              <Button
                onClick={() => setView("resume-builder")}
                className="h-10 sm:h-11 px-3 sm:px-5 rounded-xl bg-white text-indigo-600 hover:bg-slate-50 font-bold shadow-xl shadow-black/20 transition-all hover:scale-[1.02] group text-xs sm:text-sm"
              >
                <FileText className="h-4 w-4 mr-1.5 sm:mr-2" /> Build Resume
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 -mt-16 relative z-20">
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-8">
          {[
            { icon: Briefcase, label: "Total Applied", value: apps.length, color: "from-indigo-500 to-blue-500", bg: "bg-indigo-50", text: "text-indigo-600" },
            { icon: CheckCircle2, label: "Shortlisted", value: apps.filter((a) => a.status === "SHORTLISTED").length, color: "from-emerald-500 to-teal-500", bg: "bg-emerald-50", text: "text-emerald-600" },
            { icon: Clock, label: "In Review", value: apps.filter((a) => a.status === "APPLIED").length, color: "from-amber-500 to-orange-500", bg: "bg-amber-50", text: "text-amber-600" },
            { icon: Star, label: "Skill Score", value: "850", color: "from-pink-500 to-rose-500", bg: "bg-pink-50", text: "text-pink-600" },
          ].map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.06 }}
              whileHover={{ y: -4 }}
              className="bg-white rounded-2xl p-3 sm:p-5 border border-slate-100 shadow-lg shadow-slate-200/50 hover:shadow-xl hover:border-indigo-200 transition-all duration-300 group relative overflow-hidden"
            >
              <div className={`absolute -top-8 -right-8 w-24 h-24 rounded-full bg-gradient-to-br ${stat.color} opacity-0 group-hover:opacity-10 blur-2xl transition-all duration-500 pointer-events-none`} />
              <div className="flex items-center justify-between mb-2 sm:mb-3 relative z-10">
                <div className={`h-9 w-9 sm:h-10 sm:w-10 rounded-xl ${stat.bg} flex items-center justify-center ${stat.text} group-hover:scale-110 transition-transform`}>
                  <stat.icon className="h-4 w-4 sm:h-5 sm:w-5" />
                </div>
              </div>
              <div className="text-lg sm:text-2xl font-bold text-slate-900 mb-0.5 relative z-10">{stat.value}</div>
              <div className="text-[9px] sm:text-[10px] font-bold text-slate-400 uppercase tracking-widest relative z-10">{stat.label}</div>
            </motion.div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-4 sm:gap-6">
          <div className="lg:col-span-2 space-y-4 sm:space-y-6">
            <Card className="border border-slate-100 shadow-xl shadow-slate-200/40 rounded-3xl overflow-hidden bg-white">
              <CardHeader className="border-b border-slate-100 pb-4 sm:pb-5 flex-row items-center justify-between gap-2 px-4 sm:px-6">
                <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                  <div className="w-1 h-7 sm:h-8 bg-gradient-to-b from-indigo-600 to-blue-600 rounded-full flex-shrink-0" />
                  <div className="min-w-0">
                    <CardTitle className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
                      Recent Applications
                    </CardTitle>
                    <CardDescription className="text-[11px] sm:text-xs hidden sm:block">
                      Keep track of your job search progress
                    </CardDescription>
                  </div>
                </div>
                <Button
                  onClick={() => setView("jobs")}
                  variant="ghost"
                  className="text-indigo-600 font-bold text-xs sm:text-sm group px-2 sm:px-3 flex-shrink-0"
                >
                  View All <ArrowRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition" />
                </Button>
              </CardHeader>
              <CardContent className="pt-4 sm:pt-5 px-3 sm:px-6">
                {loading ? (
                  <div className="flex justify-center py-20">
                    <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
                  </div>
                ) : apps.length === 0 ? (
                  <EmptyState
                    icon={Briefcase}
                    title="No applications yet"
                    subtitle="Start your career journey by applying to premium RCM jobs."
                    action={{
                      label: "Explore Jobs",
                      onClick: () => setView("jobs"),
                    }}
                  />
                ) : (
                  <div className="space-y-3">
                    {apps.map((a, idx) => (
                      <motion.div
                        key={a.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: idx * 0.05 }}
                        whileHover={{ x: 4 }}
                        onClick={() => {
                          setSelectedJobId(a.jobId);
                          setView("jobDetails");
                        }}
                        className="group flex items-center justify-between gap-2 p-3 sm:p-4 border border-slate-100 rounded-2xl hover:bg-slate-50 hover:border-indigo-200 hover:shadow-md transition-all cursor-pointer"
                      >
                        <div className="flex items-center gap-3 sm:gap-4 min-w-0 flex-1">
                          <div className="relative flex-shrink-0">
                            <div className="absolute -inset-0.5 rounded-2xl bg-gradient-to-br from-indigo-500/0 to-blue-500/0 group-hover:from-indigo-500/40 group-hover:to-blue-500/40 blur transition" />
                            <div className="relative h-10 w-10 sm:h-12 sm:w-12 rounded-2xl bg-white shadow-sm border border-slate-100 flex items-center justify-center font-bold text-indigo-600 text-base sm:text-lg overflow-hidden p-1">
                              {(a.companyLogo || a.logo) ? (
                                <img
                                  src={a.companyLogo || a.logo}
                                  alt={a.companyName}
                                  className="w-full h-full object-contain"
                                  onError={(e) => { e.currentTarget.style.display = 'none'; e.currentTarget.nextElementSibling.style.display = 'flex'; }}
                                />
                              ) : null}
                              <span className={(a.companyLogo || a.logo) ? 'hidden' : 'flex items-center justify-center w-full h-full'}>
                                {a.companyName?.charAt(0)}
                              </span>
                            </div>
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="font-bold text-xs sm:text-sm text-slate-900 group-hover:text-indigo-600 transition truncate">
                              {a.jobTitle}
                            </div>
                            <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-[11px] sm:text-xs text-slate-500 mt-0.5">
                              <span className="font-semibold text-slate-600 truncate max-w-[120px] sm:max-w-none">
                                {a.companyName}
                              </span>
                              <span className="hidden sm:inline-block h-1 w-1 rounded-full bg-slate-300 flex-shrink-0" />
                              <div className="flex items-center gap-1 flex-shrink-0">
                                <Clock className="h-3 w-3" /> {new Date(a.appliedAt).toLocaleDateString()}
                              </div>
                            </div>
                          </div>
                        </div>
                        <Badge
                          variant="outline"
                          className={`${statusColor(
                            a.status
                          )} font-bold px-2 sm:px-3 py-0.5 sm:py-1 rounded-full border text-[9px] sm:text-[10px] uppercase tracking-wider flex-shrink-0`}
                        >
                          {a.status}
                        </Badge>
                      </motion.div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="space-y-4 sm:space-y-6">
            <Card className="border-none shadow-xl shadow-indigo-200/40 rounded-3xl overflow-hidden bg-gradient-to-br from-indigo-600 via-indigo-700 to-blue-700 text-white relative">
              <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -mr-20 -mt-20 blur-2xl" />
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-pink-500/20 rounded-full -ml-16 -mb-16 blur-2xl" />
              <div
                className="absolute inset-0 opacity-[0.06] pointer-events-none"
                style={{
                  backgroundImage: "linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)",
                  backgroundSize: "30px 30px"
                }}
              />
              <CardContent className="pt-6 sm:pt-7 pb-6 sm:pb-7 px-5 sm:px-7 relative z-10">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 mb-4 sm:mb-5">
                  <Sparkles className="h-3 w-3 text-amber-300" />
                  <span className="text-[10px] font-bold text-white uppercase tracking-widest">Boost Profile</span>
                </div>
                <h3 className="text-lg sm:text-xl font-bold mb-2 sm:mb-2.5 leading-tight tracking-tight">
                  Complete your profile to stand out!
                </h3>
                <p className="text-white/80 text-xs sm:text-sm mb-4 sm:mb-5 leading-relaxed">
                  Profiles with a complete summary and resume get 3x more
                  interview invites from top employers.
                </p>
                <div className="space-y-2 mb-5">
                  <div className="flex justify-between text-xs font-bold">
                    <span>Profile Strength</span>
                    <span className="text-emerald-300">75%</span>
                  </div>
                  <div className="h-2 w-full bg-white/20 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: "75%" }}
                      transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
                      className="h-full bg-gradient-to-r from-emerald-400 to-emerald-300 rounded-full"
                    />
                  </div>
                </div>
                <Button
                  onClick={() => setView("profile")}
                  className="w-full bg-white text-indigo-600 hover:bg-slate-50 h-11 rounded-xl font-bold transition-all hover:scale-[1.02] group"
                >
                  Complete Profile
                  <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition" />
                </Button>
              </CardContent>
            </Card>

            <Card className="border border-slate-100 shadow-xl shadow-slate-200/40 rounded-3xl overflow-hidden bg-white">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-1 h-6 bg-gradient-to-b from-indigo-600 to-blue-600 rounded-full" />
                  <CardTitle className="text-base font-bold tracking-tight">
                    Quick Actions
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-1.5">
                {[
                  { icon: FileText, title: "Resume Builder", desc: "Create a professional CV", view: "resume-builder", bg: "bg-blue-50", text: "text-blue-600", border: "border-blue-100" },
                  { icon: Search, title: "Browse Jobs", desc: "Find new opportunities", view: "jobs", bg: "bg-emerald-50", text: "text-emerald-600", border: "border-emerald-100" },
                  { icon: Crown, title: "Go Premium", desc: "Boost your application", view: "premium", bg: "bg-amber-50", text: "text-amber-600", border: "border-amber-100" },
                ].map((action, i) => (
                  <button
                    key={i}
                    onClick={() => setView(action.view)}
                    className="w-full flex items-center gap-3 p-3 rounded-2xl hover:bg-slate-50 transition-all border border-transparent hover:border-slate-100 group hover:shadow-sm"
                  >
                    <div className={`h-10 w-10 rounded-xl ${action.bg} ${action.text} ${action.border} border flex items-center justify-center group-hover:scale-110 transition flex-shrink-0`}>
                      <action.icon className="h-5 w-5" />
                    </div>
                    <div className="text-left flex-1 min-w-0">
                      <div className="font-bold text-sm text-slate-900 group-hover:text-indigo-600 transition truncate">
                        {action.title}
                      </div>
                      <div className="text-[11px] text-slate-500 truncate">
                        {action.desc}
                      </div>
                    </div>
                    <ArrowRight className="h-4 w-4 text-slate-300 group-hover:text-indigo-600 group-hover:translate-x-1 transition flex-shrink-0" />
                  </button>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// ============ PROFILE PAGE ============
function ProfilePage({ user, setUser, setView }) {
  const [profile, setProfile] = useState({
    phone: "",
    location: "",
    skills: "",
    experience: 0,
    education: "",
    projects: "",
    resumeUrl: "",
    resumeName: "",
    bio: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef();

  useEffect(() => {
    api("/profile")
      .then((d) => {
        if (d.profile) {
          setProfile({
            ...d.profile,
            skills: (d.profile.skills || []).join(", "),
          });
        }
      })
      .catch(() => { })
      .finally(() => setLoading(false));
  }, []);

  const uploadResume = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const r = await api("/upload/resume", { method: "POST", body: fd });
      // Persist immediately so user doesn't have to click Save Changes
      const updated = { ...profile, resumeUrl: r.url, resumeName: r.name };
      setProfile(updated);
      const body = {
        ...updated,
        skills: updated.skills
          ? updated.skills.split(",").map((s) => s.trim())
          : [],
      };
      await api("/profile", { method: "PUT", body: JSON.stringify(body) });
      toast.success("Resume uploaded & saved!");
    } catch (err) {
      toast.error(err.message || "Upload failed");
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  const save = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const body = {
        ...profile,
        skills: profile.skills
          ? profile.skills.split(",").map((s) => s.trim())
          : [],
      };
      await api("/profile", { method: "PUT", body: JSON.stringify(body) });
      toast.success("Profile saved");
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading)
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
      </div>
    );

  // Inputs share these classes
  const inputCls = "h-11 pl-10 pr-3 rounded-xl border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all text-sm font-medium bg-white w-full";

  // Compute profile strength based on filled fields
  const filledFields = [profile.phone, profile.location, profile.skills, profile.education, profile.bio, profile.projects, profile.resumeUrl].filter(Boolean).length;
  const strength = Math.min(100, Math.round((filledFields / 7) * 100));

  return (
    <section className="min-h-screen bg-[#F8F9FD] pb-16 overflow-x-hidden">
      {/* Hero banner */}
      <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 pt-8 sm:pt-10 pb-24 sm:pb-28 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-indigo-600/20 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 w-[300px] h-[300px] bg-blue-600/15 rounded-full blur-[100px] pointer-events-none" />
        <div
          className="absolute inset-0 opacity-[0.05] pointer-events-none"
          style={{
            backgroundImage: "linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)",
            backgroundSize: "40px 40px"
          }}
        />
        <div className="container mx-auto px-4 sm:px-6 max-w-6xl relative z-10">
          <Button
            onClick={() => setView("candidateDash")}
            className="mb-5 sm:mb-6 inline-flex items-center gap-2 h-9 px-3 sm:px-4 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/20 backdrop-blur-md text-[10px] sm:text-xs font-bold uppercase tracking-widest transition-all group"
          >
            <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
            Back to Dashboard
          </Button>
          <div className="flex items-center gap-3 mb-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/10 backdrop-blur-md">
              <User className="h-3 w-3 text-indigo-300" />
              <span className="text-[10px] font-bold text-white/80 uppercase tracking-widest">Edit Profile</span>
            </div>
          </div>
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white tracking-tight">
            Personal <span className="text-indigo-400">Profile</span>
          </h1>
          <p className="text-slate-300 mt-1.5 font-medium text-xs sm:text-sm">
            Keep your information up to date for the best matches.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 max-w-6xl -mt-16 relative z-20">
        <div className="grid lg:grid-cols-3 gap-4 sm:gap-6 min-w-0">
          {/* LEFT COLUMN */}
          <div className="lg:col-span-1 space-y-4 sm:space-y-6 min-w-0 w-full">
            {/* Profile Card */}
            <Card className="border border-slate-100 shadow-xl shadow-slate-200/40 rounded-3xl overflow-hidden bg-white w-full">
              <div className="bg-gradient-to-br from-indigo-600 via-indigo-700 to-blue-700 p-5 sm:p-6 pb-10 sm:pb-12 relative overflow-hidden">
                <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/10 rounded-full blur-2xl pointer-events-none" />
              </div>
              <CardContent className="pt-0 -mt-10 flex flex-col items-center pb-5 sm:pb-6 px-4 sm:px-6">
                <div className="relative mb-3 sm:mb-4">
                  <div className="absolute -inset-1 rounded-2xl bg-gradient-to-br from-indigo-500 to-pink-500 blur opacity-60" />
                  <div className="relative h-16 w-16 sm:h-20 sm:w-20 rounded-2xl bg-gradient-to-br from-indigo-500 to-blue-600 flex items-center justify-center text-white text-2xl sm:text-3xl font-bold shadow-xl border-4 border-white">
                    {user.name.charAt(0)}
                  </div>
                  <div className="absolute -bottom-1 -right-1 bg-emerald-500 p-1 rounded-full shadow-md border-2 border-white">
                    <CheckCircle className="h-3 w-3 text-white" />
                  </div>
                </div>
                <h2 className="text-sm sm:text-base font-bold text-slate-900 tracking-tight text-center break-all px-2">
                  {user.name}
                </h2>
                <p className="text-slate-500 text-[11px] sm:text-xs mb-4 sm:mb-5 text-center break-all px-2">{user.email}</p>

                {/* Profile Strength */}
                <div className="w-full p-4 rounded-2xl bg-gradient-to-br from-indigo-50 to-blue-50 border border-indigo-100 mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-bold text-indigo-700 uppercase tracking-widest">Profile Strength</span>
                    <span className="text-sm font-bold text-indigo-700">{strength}%</span>
                  </div>
                  <div className="h-1.5 w-full bg-white rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${strength}%` }}
                      transition={{ duration: 0.8, ease: "easeOut" }}
                      className="h-full bg-gradient-to-r from-indigo-600 to-blue-600 rounded-full"
                    />
                  </div>
                </div>

                <div className="w-full pt-4 border-t border-slate-100 space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400 font-semibold">Account Type</span>
                    <Badge className="bg-indigo-50 text-indigo-700 border border-indigo-100 font-bold uppercase text-[10px] rounded-lg px-2 py-0.5">
                      {user.role}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400 font-semibold">Member Since</span>
                    <span className="font-bold text-slate-900">May 2026</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Resume Card */}
            <Card className="border border-slate-100 shadow-xl shadow-slate-200/40 rounded-3xl overflow-hidden bg-white">
              <CardHeader className="pb-3 px-4 sm:px-6">
                <div className="flex items-center gap-2.5">
                  <div className="w-1 h-6 bg-gradient-to-b from-indigo-600 to-blue-600 rounded-full" />
                  <div>
                    <CardTitle className="text-base font-bold tracking-tight">Resume</CardTitle>
                    <CardDescription className="text-[11px] sm:text-xs">Job ready status</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4 px-4 sm:px-6">
                {profile.resumeUrl ? (
                  <div className="space-y-3 min-w-0">
                    <div className="flex items-center gap-3 p-3 bg-emerald-50 rounded-2xl border border-emerald-100 min-w-0">
                      <div className="h-9 w-9 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center flex-shrink-0">
                        <CheckCircle2 className="h-5 w-5" />
                      </div>
                      <div className="min-w-0 flex-1 overflow-hidden">
                        <div className="text-[9px] font-bold text-emerald-700 uppercase tracking-widest">
                          Resume Uploaded
                        </div>
                        <div className="text-xs font-bold text-slate-900 truncate">
                          {profile.resumeName || "resume.pdf"}
                        </div>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => window.open(profile.resumeUrl)}
                        className="rounded-xl font-bold h-9 border-slate-200 text-xs hover:bg-indigo-50 hover:border-indigo-300 hover:text-indigo-700"
                      >
                        View
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => fileRef.current?.click()}
                        className="rounded-xl font-bold h-9 border-slate-200 text-xs hover:bg-indigo-50 hover:border-indigo-300 hover:text-indigo-700"
                      >
                        Replace
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-2 border-2 border-dashed border-slate-200 rounded-2xl px-4 py-6">
                    <div className="h-12 w-12 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center mx-auto mb-3">
                      <Upload className="h-5 w-5 text-indigo-600" />
                    </div>
                    <p className="text-xs text-slate-500 mb-4 font-medium">
                      No resume uploaded yet. Add a professional CV.
                    </p>
                    <Button
                      onClick={() => fileRef.current?.click()}
                      className="w-full bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 h-10 rounded-xl font-bold shadow-md shadow-indigo-200 text-sm"
                    >
                      Upload Resume
                    </Button>
                  </div>
                )}
                <input
                  ref={fileRef}
                  type="file"
                  hidden
                  accept=".pdf,.doc,.docx"
                  onChange={uploadResume}
                />

                <Separator className="bg-slate-100" />

                <Button
                  onClick={() => setView("resume-builder")}
                  className="w-full bg-white text-indigo-600 hover:bg-indigo-50 border border-indigo-100 rounded-xl h-10 font-bold text-sm group"
                >
                  <Sparkles className="h-4 w-4 mr-2" />
                  Launch Resume Builder
                  <ArrowRight className="h-3 w-3 ml-2 group-hover:translate-x-1 transition" />
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* RIGHT COLUMN - FORM */}
          <div className="lg:col-span-2 min-w-0 w-full">
            <form onSubmit={save} className="w-full">
              <Card className="border border-slate-100 shadow-xl shadow-slate-200/40 rounded-3xl overflow-hidden bg-white w-full">
                <CardHeader className="pb-4 sm:pb-5 border-b border-slate-100 px-4 sm:px-6">
                  <div className="flex items-center gap-2.5">
                    <div className="w-1 h-7 sm:h-8 bg-gradient-to-b from-indigo-600 to-blue-600 rounded-full" />
                    <div>
                      <CardTitle className="text-base sm:text-lg font-bold tracking-tight">
                        Profile Details
                      </CardTitle>
                      <CardDescription className="text-[11px] sm:text-xs">
                        Professional information for potential employers
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-5 sm:pt-6 space-y-5 px-4 sm:px-6">
                  {/* Contact section */}
                  <div>
                    <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                      <Phone className="h-3 w-3" /> Contact Information
                    </h4>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <Label className="text-slate-600 font-semibold text-xs ml-1">
                          Phone Number
                        </Label>
                        <div className="relative">
                          <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                          <Input
                            value={profile.phone}
                            onChange={(e) =>
                              setProfile((p) => ({ ...p, phone: e.target.value }))
                            }
                            className={inputCls}
                            placeholder="+91 98765 43210"
                          />
                        </div>
                      </div>
                      <div className="space-y-1.5">
                        <Label className="text-slate-600 font-semibold text-xs ml-1">
                          Current Location
                        </Label>
                        <div className="relative">
                          <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                          <Input
                            value={profile.location}
                            onChange={(e) =>
                              setProfile((p) => ({
                                ...p,
                                location: e.target.value,
                              }))
                            }
                            className={inputCls}
                            placeholder="Delhi, India"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <Separator className="bg-slate-100" />

                  {/* Professional section */}
                  <div>
                    <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                      <Briefcase className="h-3 w-3" /> Professional
                    </h4>
                    <div className="space-y-4">
                      <div className="space-y-1.5">
                        <Label className="text-slate-600 font-semibold text-xs ml-1">
                          Key Skills (comma separated)
                        </Label>
                        <div className="relative">
                          <Zap className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                          <Input
                            value={profile.skills}
                            onChange={(e) =>
                              setProfile((p) => ({ ...p, skills: e.target.value }))
                            }
                            className={inputCls}
                            placeholder="React, Node.js, Python, Medical Coding"
                          />
                        </div>
                        {profile.skills && (
                          <div className="flex flex-wrap gap-1.5 pt-2">
                            {profile.skills.split(",").map((s) => s.trim()).filter(Boolean).slice(0, 8).map((sk, idx) => (
                              <Badge key={idx} className="bg-indigo-50 text-indigo-700 border border-indigo-100 rounded-lg px-2 py-0.5 text-[10px] font-bold">
                                {sk}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <Label className="text-slate-600 font-semibold text-xs ml-1">
                            Years of Experience
                          </Label>
                          <div className="relative">
                            <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                            <Input
                              type="number"
                              min="0"
                              value={profile.experience}
                              onChange={(e) =>
                                setProfile((p) => ({
                                  ...p,
                                  experience: e.target.value,
                                }))
                              }
                              className={inputCls}
                            />
                          </div>
                        </div>
                        <div className="space-y-1.5">
                          <Label className="text-slate-600 font-semibold text-xs ml-1">
                            Highest Education
                          </Label>
                          <div className="relative">
                            <GraduationCap className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                            <Input
                              value={profile.education}
                              onChange={(e) =>
                                setProfile((p) => ({
                                  ...p,
                                  education: e.target.value,
                                }))
                              }
                              className={inputCls}
                              placeholder="B.Tech Computer Science"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <Separator className="bg-slate-100" />

                  {/* About section */}
                  <div>
                    <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                      <FileText className="h-3 w-3" /> About You
                    </h4>
                    <div className="space-y-4">
                      <div className="space-y-1.5">
                        <Label className="text-slate-600 font-semibold text-xs ml-1">
                          Professional Bio
                        </Label>
                        <Textarea
                          rows={4}
                          value={profile.bio}
                          onChange={(e) =>
                            setProfile((p) => ({ ...p, bio: e.target.value }))
                          }
                          className="px-4 py-3 rounded-2xl border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all text-sm leading-relaxed font-medium bg-white"
                          placeholder="Briefly describe your career journey and goals..."
                        />
                      </div>

                      <div className="space-y-1.5">
                        <Label className="text-slate-600 font-semibold text-xs ml-1">
                          Notable Projects / Achievements
                        </Label>
                        <Textarea
                          rows={4}
                          value={profile.projects}
                          onChange={(e) =>
                            setProfile((p) => ({ ...p, projects: e.target.value }))
                          }
                          className="px-4 py-3 rounded-2xl border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all text-sm leading-relaxed font-medium bg-white"
                          placeholder="List your key projects or significant career highlights..."
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="bg-slate-50 p-4 sm:p-5 flex flex-col sm:flex-row justify-between sm:items-center gap-3 sm:gap-4 border-t border-slate-100">
                  <div className="flex items-center gap-2 text-slate-500 text-xs font-medium">
                    <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
                    Your data is secure
                  </div>
                  <div className="grid grid-cols-2 sm:flex items-center gap-2">
                    <Button
                      type="button"
                      onClick={() => setView("candidateDash")}
                      variant="ghost"
                      className="h-11 px-4 sm:px-5 rounded-xl font-bold text-sm hover:bg-white border border-slate-200 sm:border-transparent"
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      disabled={saving}
                      className="h-11 px-4 sm:px-7 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 rounded-xl font-bold shadow-lg shadow-indigo-200 transition-all hover:scale-[1.02] active:scale-[0.98] text-sm"
                    >
                      {saving ? (
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      ) : (
                        <CheckCircle2 className="h-4 w-4 mr-2" />
                      )}
                      Save Changes
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}

// ============ EMPLOYER DASHBOARD ============
function EmployerDashboard({
  user,
  setUser,
  setView,
  setViewingJobApplicantsId,
}) {
  const [jobs, setJobs] = useState([]);
  const [company, setCompany] = useState(null);
  const [loading, setLoading] = useState(true);

  const isPremium = !!(user?.isPremium || user?.premium);

  const handlePostJob = () => {
    if (!isPremium) {
      toast.error("Premium subscription required to post jobs");
      return setView("premium");
    }
    setView("postJob");
  };

  const load = async () => {
    try {
      // FIX: Call /api/jobs/mine to get accurate applicant counts for the employer
      const [j, c] = await Promise.all([
        api("/jobs/mine"),
        api("/employer/company"),
      ]);
      setJobs(j.jobs || []);
      setCompany(c.company);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    load();
  }, []);

  if (loading)
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="h-10 w-10 animate-spin text-indigo-600" />
      </div>
    );

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, type: "spring", bounce: 0 }}
      className="bg-[#F8F9FE] min-h-screen"
    >
      {/* Header banner */}
      <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 pt-8 sm:pt-12 pb-24 sm:pb-28 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-indigo-600/20 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 w-[300px] h-[300px] bg-blue-600/15 rounded-full blur-[100px] pointer-events-none" />
        <div
          className="absolute inset-0 opacity-[0.05] pointer-events-none"
          style={{
            backgroundImage: "linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)",
            backgroundSize: "40px 40px"
          }}
        />

        <div className="container mx-auto px-4 sm:px-6 relative z-10">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5 sm:gap-6">
            <div className="min-w-0">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/10 backdrop-blur-md mb-3">
                <LayoutDashboard className="h-3.5 w-3.5 text-indigo-300" />
                <span className="text-[10px] font-bold text-white/80 uppercase tracking-widest">Employer</span>
              </div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white tracking-tight break-words">
                {company?.name ? `Welcome back, ${company.name}` : "Employer Dashboard"}
              </h1>
              <p className="text-slate-300 mt-2 font-medium text-sm sm:text-base">
                Manage your company profile and job postings
              </p>
            </div>
            <Button
              onClick={handlePostJob}
              className={`h-11 sm:h-12 px-5 sm:px-6 rounded-xl font-bold shadow-xl shadow-black/20 transition-all hover:scale-[1.02] group self-start md:self-auto text-sm sm:text-base ${
                isPremium
                  ? "bg-white text-indigo-600 hover:bg-slate-50"
                  : "bg-gradient-to-r from-amber-400 to-amber-500 text-amber-950 hover:from-amber-500 hover:to-amber-600"
              }`}
            >
              {isPremium ? (
                <>
                  <Plus className="h-5 w-5 mr-2 group-hover:rotate-90 transition-transform duration-300" /> Post a New Job
                </>
              ) : (
                <>
                  <Crown className="h-5 w-5 mr-2" /> Upgrade to Post Jobs
                </>
              )}
            </Button>
          </div>

          {/* Premium gate banner */}
          {!isPremium && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="mt-6 bg-gradient-to-r from-amber-400/20 to-orange-400/20 backdrop-blur-md border border-amber-300/40 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-md flex-shrink-0">
                  <Crown className="h-5 w-5 text-white" />
                </div>
                <div className="min-w-0">
                  <div className="text-sm font-bold text-white">Subscribe to post jobs</div>
                  <div className="text-xs text-amber-100/80">Unlock unlimited job postings, premium placement and verified applicants.</div>
                </div>
              </div>
              <Button
                onClick={() => setView("premium")}
                className="bg-white text-amber-700 hover:bg-amber-50 h-10 px-4 rounded-xl font-bold text-sm shadow-md flex-shrink-0 w-full sm:w-auto"
              >
                View Plans <ArrowRight className="h-4 w-4 ml-1" />
              </Button>
            </motion.div>
          )}

          {/* Stat strip */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mt-8 sm:mt-10">
            {[
              { label: "Active Jobs", value: jobs.length, icon: Briefcase, color: "from-indigo-500 to-blue-500" },
              { label: "Total Applicants", value: jobs.reduce((sum, j) => sum + (j.applicantCount || 0), 0), icon: Users, color: "from-emerald-500 to-teal-500" },
              { label: "Avg. Salary", value: jobs.length > 0 ? `₹${Math.round(jobs.reduce((s, j) => s + (j.salary || 0), 0) / jobs.length / 1000)}k` : "—", icon: IndianRupee, color: "from-amber-500 to-orange-500" },
              { label: "Profile Status", value: company?.name ? "Verified" : "Pending", icon: ShieldCheck, color: "from-pink-500 to-rose-500" },
            ].map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.1 + i * 0.06 }}
                className="bg-white/10 backdrop-blur-md border border-white/10 rounded-2xl p-4 flex items-center gap-3"
              >
                <div className={`h-10 w-10 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center shadow-md flex-shrink-0`}>
                  <stat.icon className="h-5 w-5 text-white" />
                </div>
                <div className="min-w-0">
                  <div className="text-[10px] font-bold text-white/60 uppercase tracking-widest">{stat.label}</div>
                  <div className="text-lg font-bold text-white truncate">{stat.value}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 -mt-16 relative z-20 pb-16">
        <Tabs defaultValue="jobs" className="space-y-6">
          <TabsList className="bg-white p-1.5 rounded-2xl w-full max-w-md shadow-xl shadow-indigo-100/40 border border-slate-100 h-auto">
            <TabsTrigger value="jobs" className="flex-1 rounded-xl font-bold py-2.5 text-xs sm:text-sm data-[state=active]:bg-gradient-to-r data-[state=active]:from-indigo-600 data-[state=active]:to-blue-600 data-[state=active]:text-white data-[state=active]:shadow-md">
              <Briefcase className="h-4 w-4 mr-1.5 sm:mr-2" /> Active Jobs
            </TabsTrigger>
            <TabsTrigger value="company" className="flex-1 rounded-xl font-bold py-2.5 text-xs sm:text-sm data-[state=active]:bg-gradient-to-r data-[state=active]:from-indigo-600 data-[state=active]:to-blue-600 data-[state=active]:text-white data-[state=active]:shadow-md">
              <Building2 className="h-4 w-4 mr-1.5 sm:mr-2" /> Company Profile
            </TabsTrigger>
          </TabsList>

        <TabsContent value="jobs">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {jobs.map((j, idx) => (
              <motion.div
                key={j.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: (idx % 6) * 0.05 }}
                whileHover={{ y: -4 }}
              >
                <Card className="bg-white border border-slate-100 hover:border-indigo-200 hover:shadow-2xl hover:shadow-indigo-100/40 transition-all rounded-3xl overflow-hidden group relative">
                  {/* Top accent strip */}
                  <div className="h-1 w-full bg-gradient-to-r from-indigo-600 to-blue-600" />
                  {/* Decorative blob on hover */}
                  <div className="absolute -top-12 -right-12 w-32 h-32 rounded-full bg-indigo-500/0 group-hover:bg-indigo-500/10 blur-2xl transition-all duration-500 pointer-events-none" />

                  <CardHeader className="pb-3 pt-5">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex flex-wrap gap-2">
                        <Badge className="bg-indigo-50 text-indigo-700 border border-indigo-100 rounded-lg px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
                          <MapPin className="h-3 w-3" /> {j.location || "Remote"}
                        </Badge>
                        <Badge className="bg-emerald-50 text-emerald-700 border border-emerald-100 rounded-lg px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
                          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" /> Active
                        </Badge>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-slate-400 hover:bg-slate-50 hover:text-indigo-600 rounded-xl flex-shrink-0"
                          >
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                          align="end"
                          className="rounded-2xl p-2 border-slate-100 shadow-xl"
                        >
                          <DropdownMenuItem
                            onClick={() => {
                              setViewingJobApplicantsId(j.id);
                              setView("applicants");
                            }}
                            className="rounded-xl font-medium"
                          >
                            <Users className="h-4 w-4 mr-2" /> View Applicants
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            className="text-red-600 rounded-xl font-medium focus:text-red-600"
                            onClick={async () => {
                              if (confirm("Delete?")) {
                                await api(`/jobs/${j.id}`, { method: "DELETE" });
                                load();
                              }
                            }}
                          >
                            <Trash2 className="h-4 w-4 mr-2" /> Delete Job
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                    <CardTitle className="text-lg font-bold text-slate-900 group-hover:text-indigo-600 transition-colors tracking-tight leading-snug line-clamp-2">
                      {j.title}
                    </CardTitle>
                    <p className="text-xs text-slate-400 font-medium mt-1.5 flex items-center gap-1.5">
                      <Clock className="h-3 w-3" /> Posted {timeAgo(j.createdAt)}
                    </p>
                  </CardHeader>
                  <CardContent className="pt-3 pb-5">
                    {/* Stat row */}
                    <div className="grid grid-cols-2 gap-3 mb-5">
                      <div className="bg-slate-50 rounded-xl p-3 border border-slate-100">
                        <div className="flex items-center gap-2 mb-1">
                          <div className="h-7 w-7 rounded-lg bg-indigo-100 flex items-center justify-center">
                            <Users className="h-3.5 w-3.5 text-indigo-600" />
                          </div>
                          <div className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Applicants</div>
                        </div>
                        <div className="text-base font-bold text-slate-900">{j.applicantCount || 0}</div>
                      </div>
                      <div className="bg-slate-50 rounded-xl p-3 border border-slate-100">
                        <div className="flex items-center gap-2 mb-1">
                          <div className="h-7 w-7 rounded-lg bg-emerald-100 flex items-center justify-center">
                            <IndianRupee className="h-3.5 w-3.5 text-emerald-600" />
                          </div>
                          <div className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Salary</div>
                        </div>
                        <div className="text-base font-bold text-slate-900">₹{(j.salary / 1000).toFixed(0)}k<span className="text-xs text-slate-400 font-medium">/yr</span></div>
                      </div>
                    </div>

                    <Button
                      className="w-full rounded-xl h-11 font-bold bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white shadow-md shadow-indigo-200 transition-all hover:scale-[1.02] active:scale-[0.98] group/btn"
                      onClick={() => {
                        setViewingJobApplicantsId(j.id);
                        setView("applicants");
                      }}
                    >
                      Manage Applicants
                      <ArrowRight className="h-4 w-4 ml-2 group-hover/btn:translate-x-1 transition-transform" />
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
            {jobs.length === 0 && (
              <div className="col-span-full">
                <Card className="bg-white border-2 border-dashed border-slate-200 rounded-3xl p-12">
                  <div className="text-center max-w-md mx-auto">
                    <div className="h-16 w-16 rounded-2xl bg-indigo-50 flex items-center justify-center mx-auto mb-5">
                      <Briefcase className="h-8 w-8 text-indigo-600" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2 tracking-tight">No jobs posted yet</h3>
                    <p className="text-slate-500 text-sm mb-6">{isPremium ? "Post your first job to start hiring talent." : "Subscribe to premium to start posting jobs."}</p>
                    <Button
                      onClick={handlePostJob}
                      className={`h-11 px-6 rounded-xl font-bold shadow-lg ${
                        isPremium
                          ? "bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white shadow-indigo-200"
                          : "bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white shadow-amber-200"
                      }`}
                    >
                      {isPremium ? (
                        <><Plus className="h-4 w-4 mr-2" /> Post Your First Job</>
                      ) : (
                        <><Crown className="h-4 w-4 mr-2" /> Subscribe to Post Jobs</>
                      )}
                    </Button>
                  </div>
                </Card>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="company">
          <CompanyProfileForm company={company} onSaved={load} />
        </TabsContent>
        </Tabs>
      </div>
    </motion.section>
  );
}

function CompanyProfileForm({ company, onSaved }) {
  const [name, setName] = useState(company?.name || "");
  const [bio, setBio] = useState(company?.bio || "");
  const [logo, setLogo] = useState(company?.logo || "");
  const [website, setWebsite] = useState(company?.website || "");
  const [loading, setLoading] = useState(false);

  const save = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api("/employer/company", {
        method: "POST",
        body: JSON.stringify({ name, bio, logo, website }),
      });
      toast.success("Profile updated successfully!");
      onSaved();
    } catch (e) {
      toast.error(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="grid lg:grid-cols-5 gap-8 items-start mt-2"
    >
      {/* Left Column - Form */}
      <div className="lg:col-span-3">
        <Card className="bg-white border border-slate-100 rounded-3xl shadow-xl shadow-slate-200/40 overflow-hidden">
          {/* Card header with preview */}
          <div className="bg-gradient-to-br from-indigo-600 via-indigo-700 to-blue-700 p-6 relative overflow-hidden">
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-2xl pointer-events-none" />
            <div className="relative z-10 flex items-center gap-4">
              <div className="relative">
                <div className="h-16 w-16 rounded-2xl bg-white p-2.5 shadow-xl border-4 border-white/20 flex items-center justify-center">
                  {logo ? (
                    <img src={logo} alt={name} className="w-full h-full object-contain rounded-lg" />
                  ) : (
                    <div className="font-bold text-2xl text-indigo-600">
                      {(name || "C").charAt(0)}
                    </div>
                  )}
                </div>
                <div className="absolute -bottom-1 -right-1 bg-emerald-500 p-1 rounded-full shadow-md border-2 border-indigo-700">
                  <ShieldCheck className="h-3 w-3 text-white" />
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <h2 className="text-xl font-bold text-white tracking-tight truncate">
                  {name || "Your Company Name"}
                </h2>
                <p className="text-indigo-200 text-sm font-medium truncate">
                  {website || "your-website.com"}
                </p>
              </div>
            </div>
          </div>

          <div className="p-6 md:p-8">
            <div className="flex items-center gap-2.5 mb-6">
              <div className="w-1 h-6 bg-gradient-to-b from-indigo-600 to-blue-600 rounded-full" />
              <h3 className="text-lg font-bold text-slate-900 tracking-tight">
                Company <span className="text-indigo-600">Details</span>
              </h3>
            </div>

            <form onSubmit={save} className="space-y-5">
              <div className="grid md:grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <Label className="text-slate-600 font-semibold text-xs uppercase tracking-wider ml-1">
                    Company Name
                  </Label>
                  <div className="relative">
                    <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Acme Health Solutions"
                      className="h-12 pl-11 rounded-xl border-slate-200 focus:ring-indigo-500 focus:border-indigo-500 bg-white text-sm"
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-slate-600 font-semibold text-xs uppercase tracking-wider ml-1">
                    Website URL
                  </Label>
                  <div className="relative">
                    <Globe className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input
                      value={website}
                      onChange={(e) => setWebsite(e.target.value)}
                      placeholder="https://acme-rcm.com"
                      className="h-12 pl-11 rounded-xl border-slate-200 focus:ring-indigo-500 focus:border-indigo-500 bg-white text-sm"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-1.5">
                <Label className="text-slate-600 font-semibold text-xs uppercase tracking-wider ml-1">
                  Company Logo URL
                </Label>
                <div className="relative">
                  <LucideImage className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input
                    value={logo}
                    onChange={(e) => setLogo(e.target.value)}
                    placeholder="https://acme.com/logo.png"
                    className="h-12 pl-11 rounded-xl border-slate-200 focus:ring-indigo-500 focus:border-indigo-500 bg-white text-sm"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label className="text-slate-600 font-semibold text-xs uppercase tracking-wider ml-1">
                  About Company
                </Label>
                <textarea
                  required
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Tell candidates about your company culture, mission, and what makes you special..."
                  className="w-full h-36 rounded-2xl border border-slate-200 p-4 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm bg-white outline-none resize-none"
                />
                <p className="text-[10px] text-slate-400 font-medium ml-1">
                  {bio.length}/500 characters
                </p>
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="px-8 h-12 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 rounded-xl font-bold shadow-lg shadow-indigo-200 flex items-center gap-2 group transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                {loading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <>
                    Save Changes
                    <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition" />
                  </>
                )}
              </Button>
            </form>
          </div>
        </Card>
      </div>

      {/* Right Column - Info/Image */}
      <div className="lg:col-span-2 space-y-6">
        {/* Tips card */}
        <Card className="bg-white border border-slate-100 rounded-3xl shadow-xl shadow-slate-200/40 overflow-hidden">
          <div className="relative">
            <img
              src="https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&q=80"
              alt="Recruitment Branding"
              className="w-full aspect-[16/10] object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/20 to-transparent" />
            <div className="absolute bottom-4 left-4 right-4">
              <Badge className="bg-white/20 text-white border-white/30 rounded-full px-3 py-0.5 text-[10px] backdrop-blur-md mb-2">
                <Sparkles className="h-2.5 w-2.5 mr-1" /> Pro Tip
              </Badge>
              <h3 className="text-white font-bold text-lg tracking-tight leading-tight">Branding Tips</h3>
            </div>
          </div>
          <div className="p-5 space-y-3">
            {[
              { icon: LucideImage, text: "Use a high-resolution logo for better visibility" },
              { icon: FileText, text: "Write a clear, engaging company bio" },
              { icon: Globe, text: "Add a verified website link to build trust" },
            ].map((tip, i) => (
              <div key={i} className="flex items-start gap-3 group">
                <div className="h-8 w-8 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center flex-shrink-0 group-hover:bg-indigo-600 group-hover:border-indigo-600 transition-colors">
                  <tip.icon className="h-4 w-4 text-indigo-600 group-hover:text-white transition-colors" />
                </div>
                <p className="text-sm text-slate-600 font-medium pt-1.5">{tip.text}</p>
              </div>
            ))}
          </div>
        </Card>

        {/* Support card */}
        <Card className="bg-gradient-to-br from-slate-50 to-white border border-slate-100 rounded-3xl shadow-md shadow-slate-200/40 p-6">
          <div className="flex items-center gap-2.5 mb-5">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-indigo-500 to-pink-500 flex items-center justify-center shadow-md">
              <MessageSquare className="h-4 w-4 text-white" />
            </div>
            <h4 className="font-bold text-slate-900 tracking-tight">Need Support?</h4>
          </div>
          <p className="text-slate-500 text-sm leading-relaxed mb-5">
            Our employer relations team is here to help you optimize your
            profile for better visibility.
          </p>

          <div className="grid grid-cols-1 gap-3">
            <div className="flex items-center gap-3 group p-3 rounded-xl hover:bg-white hover:shadow-sm transition-all border border-transparent hover:border-slate-100">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-100 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Mail className="h-4 w-4" />
              </div>
              <div className="min-w-0">
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  Email Us
                </div>
                <div className="font-bold text-slate-700 text-sm truncate">
                  support@rcmjob.com
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 group p-3 rounded-xl hover:bg-white hover:shadow-sm transition-all border border-transparent hover:border-slate-100">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Globe className="h-4 w-4" />
              </div>
              <div className="min-w-0">
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  Our HQ
                </div>
                <div className="font-bold text-slate-700 text-sm truncate">
                  New Delhi, DL 110001
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </motion.div>
  );
}

// ============ POST JOB PAGE ============
function PostJobPage({ user, setView }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [salary, setSalary] = useState("");
  const [experience, setExperience] = useState("");
  const [skills, setSkills] = useState("");
  const [category, setCategory] = useState("");
  const [loading, setLoading] = useState(false);
  const [company, setCompany] = useState(null);
  const [categories, setCategories] = useState([]);

  const isPremium = !!(user?.isPremium || user?.premium);

  useEffect(() => {
    if (!isPremium) return;
    api("/employer/company")
      .then((d) => setCompany(d.company))
      .catch(() => { });
    api("/categories")
      .then((d) => {
        const all = d.sections.flatMap((s) => s.items);
        setCategories(all);
        if (all.length > 0) setCategory(all[0]);
      })
      .catch(() => { });
  }, [isPremium]);

  // Premium gate: block the page entirely if user is not premium
  if (!isPremium) {
    return (
      <section className="min-h-screen bg-[#F8F9FD] py-16">
        <div className="container mx-auto px-4 sm:px-6 max-w-3xl">
          <Button
            onClick={() => setView("employerDash")}
            variant="ghost"
            className="mb-6 h-9 px-4 rounded-xl border border-slate-200 text-xs font-bold uppercase tracking-widest text-slate-600 group"
          >
            <ArrowLeft className="w-3.5 h-3.5 mr-2 group-hover:-translate-x-1 transition-transform" />
            Back to Dashboard
          </Button>
          <Card className="bg-white border border-amber-200 rounded-3xl shadow-2xl shadow-amber-200/30 overflow-hidden">
            <div className="bg-gradient-to-br from-amber-400 via-amber-500 to-orange-500 p-10 text-center relative overflow-hidden">
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/20 rounded-full blur-2xl pointer-events-none" />
              <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-white/10 rounded-full blur-2xl pointer-events-none" />
              <div className="relative z-10">
                <div className="inline-flex items-center justify-center h-16 w-16 rounded-2xl bg-white/20 backdrop-blur-md border border-white/30 mb-5 shadow-xl">
                  <Crown className="h-8 w-8 text-white" />
                </div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 border border-white/30 backdrop-blur-md mb-4">
                  <Sparkles className="h-3 w-3 text-white" />
                  <span className="text-[10px] font-bold text-white uppercase tracking-widest">Premium Required</span>
                </div>
                <h1 className="text-3xl lg:text-4xl font-bold text-white tracking-tight mb-3">
                  Upgrade to Post Jobs
                </h1>
                <p className="text-white/90 text-base font-medium max-w-md mx-auto">
                  A premium subscription is required to post jobs. Unlock unlimited listings and reach verified candidates.
                </p>
              </div>
            </div>
            <CardContent className="p-8">
              <div className="grid sm:grid-cols-2 gap-3 mb-7">
                {[
                  { icon: Briefcase, text: "Unlimited job postings" },
                  { icon: Users, text: "Verified RCM candidates" },
                  { icon: Sparkles, text: "Premium placement" },
                  { icon: ShieldCheck, text: "Priority support" },
                ].map((perk, i) => (
                  <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-amber-50 border border-amber-100">
                    <div className="h-8 w-8 rounded-lg bg-white border border-amber-200 flex items-center justify-center flex-shrink-0">
                      <perk.icon className="h-4 w-4 text-amber-600" />
                    </div>
                    <span className="text-sm font-semibold text-slate-700">{perk.text}</span>
                  </div>
                ))}
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                <Button
                  onClick={() => setView("premium")}
                  className="flex-1 h-12 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white rounded-xl font-bold shadow-lg shadow-amber-200 transition-all hover:scale-[1.02] group"
                >
                  <Crown className="h-4 w-4 mr-2" /> View Premium Plans
                  <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition" />
                </Button>
                <Button
                  onClick={() => setView("employerDash")}
                  variant="outline"
                  className="h-12 px-6 rounded-xl border-slate-200 font-bold"
                >
                  Maybe Later
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    );
  }

  const submit = async (e) => {
    e.preventDefault();
    if (!isPremium) {
      toast.error("Premium subscription required to post jobs");
      return setView("premium");
    }
    if (!company)
      return toast.error("Please register your company profile first!");
    setLoading(true);
    try {
      await api("/jobs", {
        method: "POST",
        body: JSON.stringify({
          title,
          description,
          location,
          category,
          salary: parseInt(salary),
          experienceRequired: parseInt(experience),
          requiredSkills: skills.split(",").map((s) => s.trim()),
          companyName: company.name,
          companyLogo: company.logo,
          createdBy: user.id,
        }),
      });
      toast.success("Job posted successfully!");
      setView("employerDash");
    } catch (err) {
      const msg = err.message || "";
      if (/premium/i.test(msg) || /subscription/i.test(msg)) {
        toast.error(msg);
        setView("premium");
      } else {
        toast.error(msg);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white min-h-screen pb-20">
      {/* Hero Banner Section */}
      <div className="bg-gradient-to-r from-slate-900 to-indigo-900 pt-28 pb-40 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-[400px] h-[400px] bg-emerald-500/5 rounded-full blur-[100px] pointer-events-none" />

        <div className="container mx-auto px-4 sm:px-6 relative z-10 flex flex-col md:flex-row items-center gap-12">
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-4xl lg:text-6xl font-extrabold text-white mb-6 leading-tight">
              Hire the Best <span className="text-emerald-400">RCM Talent</span>{" "}
              for Your Team!
            </h1>
            <p className="text-indigo-100 text-lg lg:text-xl max-w-2xl font-medium opacity-90 leading-relaxed mb-8">
              Fill out the job details below to find the perfect professional
              for your billing, coding, or management needs.
            </p>
            <div className="flex flex-wrap justify-center md:justify-start gap-4">
              <div className="bg-white/10 backdrop-blur-md px-6 py-3 rounded-2xl border border-white/10 flex items-center gap-3">
                <Users className="h-5 w-5 text-emerald-400" />
                <span className="text-white font-bold">5,000+ Candidates</span>
              </div>
              <div className="bg-white/10 backdrop-blur-md px-6 py-3 rounded-2xl border border-white/10 flex items-center gap-3">
                <Zap className="h-5 w-5 text-amber-400" />
                <span className="text-white font-bold">Fast Hiring</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 max-w-7xl -mt-20 relative z-20">
        <div className="grid lg:grid-cols-5 gap-12 items-start">
          {/* Left Column - Form */}
          <div className="lg:col-span-3 bg-white p-8 md:p-12 rounded-[2.5rem] shadow-2xl shadow-indigo-900/5 border border-slate-100">
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-slate-900 mb-2">
                Job Details
              </h2>
              <p className="text-slate-500">
                Provide accurate information to attract the right candidates.
              </p>
            </div>

            {!company && (
              <Alert className="mb-8 bg-amber-50 border-amber-200 text-amber-800 rounded-2xl">
                <ShieldCheck className="h-5 w-5" />
                <AlertTitle className="font-bold">
                  Company Profile Required
                </AlertTitle>
                <AlertDescription>
                  You must set up your company profile before you can post a
                  job.{" "}
                  <button
                    onClick={() => setView("employerDash")}
                    className="font-bold underline"
                  >
                    Go to Profile
                  </button>
                </AlertDescription>
              </Alert>
            )}

            <form onSubmit={submit} className="space-y-8">
              <div className="space-y-2">
                <Label className="text-slate-600 font-semibold ml-1">
                  Job Title
                </Label>
                <Input
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Senior Medical Biller"
                  className="h-14 rounded-2xl border-slate-200 focus:ring-indigo-500 focus:border-indigo-500 bg-white"
                />
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <Label className="text-slate-600 font-semibold ml-1">
                    Location
                  </Label>
                  <Input
                    required
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="e.g. Delhi, Remote"
                    className="h-14 rounded-2xl border-slate-200 focus:ring-indigo-500 focus:border-indigo-500 bg-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-slate-600 font-semibold ml-1">
                    Annual Salary (INR)
                  </Label>
                  <Input
                    required
                    type="number"
                    value={salary}
                    onChange={(e) => setSalary(e.target.value)}
                    placeholder="e.g. 600000"
                    className="h-14 rounded-2xl border-slate-200 focus:ring-indigo-500 focus:border-indigo-500 bg-white"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <Label className="text-slate-600 font-semibold ml-1">
                    Experience Required (Years)
                  </Label>
                  <Input
                    required
                    type="number"
                    value={experience}
                    onChange={(e) => setExperience(e.target.value)}
                    placeholder="e.g. 2"
                    className="h-14 rounded-2xl border-slate-200 focus:ring-indigo-500 focus:border-indigo-500 bg-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-slate-600 font-semibold ml-1">
                    Job Category
                  </Label>
                  <Select value={category} onValueChange={setCategory}>
                    <SelectTrigger className="h-14 rounded-2xl border-slate-200 focus:ring-indigo-500 bg-white">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((c) => (
                        <SelectItem key={c} value={c}>
                          {c}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-slate-600 font-semibold ml-1">
                  Required Skills (comma separated)
                </Label>
                <Input
                  required
                  value={skills}
                  onChange={(e) => setSkills(e.target.value)}
                  placeholder="e.g. RCM, Coding, Billing"
                  className="h-14 rounded-2xl border-slate-200 focus:ring-indigo-500 focus:border-indigo-500 bg-white"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-slate-600 font-semibold ml-1">
                  Job Description
                </Label>
                <textarea
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full h-48 rounded-[2rem] border-slate-200 p-6 focus:ring-indigo-500 focus:border-indigo-500 text-base bg-white"
                  placeholder="Describe the role, responsibilities, and benefits..."
                />
              </div>

              <div className="flex items-center gap-6 pt-4">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setView("employerDash")}
                  className="flex-1 h-14 rounded-full font-bold hover:bg-slate-100"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={loading || !company}
                  className="flex-[2] h-14 bg-indigo-600 hover:bg-indigo-700 rounded-full font-bold shadow-xl shadow-indigo-100 flex items-center justify-center gap-2 group transition-all"
                >
                  {loading ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    <>
                      Post Job Now{" "}
                      <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition" />
                    </>
                  )}
                </Button>
              </div>
            </form>
          </div>

          {/* Right Column - Info */}
          <div className="lg:col-span-2 space-y-10">
            <div>
              <div className="rounded-[2.5rem] overflow-hidden shadow-2xl shadow-slate-200 border-8 border-white">
                <img
                  src="https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?auto=format&fit=crop&q=80"
                  alt="Contact Support"
                  className="w-full aspect-[4/3] object-cover"
                />
              </div>
            </div>

            <div className="space-y-8 bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm">
              <div className="space-y-4">
                <div className="flex items-center gap-4 group">
                  <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-colors shadow-sm">
                    <Mail className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                      Email Us
                    </div>
                    <div className="font-bold text-slate-700">
                      employer-support@rcmjob.com
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4 group">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-white transition-colors shadow-sm">
                    <Globe className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                      Help Center
                    </div>
                    <div className="font-bold text-slate-700">
                      www.rcmjob.com/help
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============ APPLICANTS VIEW ============
function ApplicantsView({ jobId, setView }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [sortBy, setSortBy] = useState("match");
  const [searchTerm, setSearchTerm] = useState("");

  const load = async () => {
    try {
      const d = await api(`/applications/job/${jobId}`);
      setData(d);
    } catch (e) {
      toast.error(e.message);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    load();
  }, [jobId]);

  const updateStatus = async (appId, status) => {
    try {
      await api(`/applications/${appId}`, {
        method: "PATCH",
        body: JSON.stringify({ status }),
      });
      toast.success(`Marked as ${status}`);
      load();
    } catch (e) {
      toast.error(e.message);
    }
  };

  if (loading)
    return (
      <div className="flex flex-col items-center justify-center py-40 gap-4">
        <Loader2 className="h-10 w-10 animate-spin text-indigo-600" />
        <p className="text-slate-500 font-medium animate-pulse">
          Loading applicant data...
        </p>
      </div>
    );

  const allApps = data?.applications || [];
  const stats = {
    total: allApps.length,
    shortlisted: allApps.filter((a) => a.status === "SHORTLISTED").length,
    rejected: allApps.filter((a) => a.status === "REJECTED").length,
    pending: allApps.filter((a) => a.status !== "SHORTLISTED" && a.status !== "REJECTED").length,
  };

  let filtered = allApps;
  if (statusFilter !== "ALL") {
    if (statusFilter === "PENDING") {
      filtered = filtered.filter((a) => a.status !== "SHORTLISTED" && a.status !== "REJECTED");
    } else {
      filtered = filtered.filter((a) => a.status === statusFilter);
    }
  }
  if (searchTerm.trim()) {
    const q = searchTerm.toLowerCase();
    filtered = filtered.filter(
      (a) =>
        a.candidateName?.toLowerCase().includes(q) ||
        a.candidateEmail?.toLowerCase().includes(q) ||
        (a.candidateSkills || []).some((s) => s.toLowerCase().includes(q))
    );
  }
  filtered = [...filtered].sort((a, b) => {
    if (sortBy === "match") return (b.matchScore || 0) - (a.matchScore || 0);
    if (sortBy === "experience") return (b.candidateExperience || 0) - (a.candidateExperience || 0);
    if (sortBy === "date") return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
    return 0;
  });

  const filterTabs = [
    { key: "ALL", label: "All", count: stats.total, color: "from-indigo-500 to-blue-500" },
    { key: "PENDING", label: "New", count: stats.pending, color: "from-amber-500 to-orange-500" },
    { key: "SHORTLISTED", label: "Shortlisted", count: stats.shortlisted, color: "from-emerald-500 to-teal-500" },
    { key: "REJECTED", label: "Rejected", count: stats.rejected, color: "from-rose-500 to-red-500" },
  ];

  return (
    <div className="bg-[#F6F7FB] min-h-screen pb-16">
      {/* Hero Header */}
      <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 pt-8 sm:pt-12 pb-24 sm:pb-28 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[300px] sm:w-[400px] h-[300px] sm:h-[400px] bg-indigo-600/20 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 w-[250px] sm:w-[300px] h-[250px] sm:h-[300px] bg-blue-600/15 rounded-full blur-[100px] pointer-events-none" />
        <div
          className="absolute inset-0 opacity-[0.05] pointer-events-none"
          style={{
            backgroundImage:
              "linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />

        <div className="container mx-auto px-4 sm:px-6 relative z-10 max-w-6xl">
          <Button
            onClick={() => setView("employerDash")}
            className="mb-5 inline-flex items-center gap-2 h-9 px-4 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/20 backdrop-blur-md text-xs font-bold uppercase tracking-widest transition-all group"
          >
            <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
            Back to Dashboard
          </Button>

          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
            <div className="min-w-0">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/10 backdrop-blur-md mb-3">
                <Users className="h-3.5 w-3.5 text-indigo-300" />
                <span className="text-[10px] font-bold text-white/80 uppercase tracking-widest">
                  Applicant Pipeline
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white tracking-tight">
                Applicants for{" "}
                <span className="text-indigo-300">{data?.job?.title}</span>
              </h1>
              <p className="text-slate-300 mt-2 font-medium text-sm sm:text-base">
                {stats.total} candidate{stats.total === 1 ? "" : "s"} have applied to this position.
              </p>
            </div>
          </div>

          {/* Stats strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mt-8">
            {[
              { label: "Total", value: stats.total, icon: Users, color: "from-indigo-500 to-blue-500" },
              { label: "New", value: stats.pending, icon: Sparkles, color: "from-amber-500 to-orange-500" },
              { label: "Shortlisted", value: stats.shortlisted, icon: CheckCircle2, color: "from-emerald-500 to-teal-500" },
              { label: "Rejected", value: stats.rejected, icon: XCircle, color: "from-rose-500 to-red-500" },
            ].map((s, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.1 + i * 0.05 }}
                className="bg-white/10 backdrop-blur-md border border-white/10 rounded-2xl p-3 sm:p-4 flex items-center gap-2.5 sm:gap-3"
              >
                <div
                  className={`h-9 w-9 sm:h-10 sm:w-10 rounded-xl bg-gradient-to-br ${s.color} flex items-center justify-center shadow-md flex-shrink-0`}
                >
                  <s.icon className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                </div>
                <div className="min-w-0">
                  <div className="text-[9px] sm:text-[10px] font-bold text-white/60 uppercase tracking-widest">
                    {s.label}
                  </div>
                  <div className="text-lg sm:text-xl font-bold text-white">{s.value}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="container mx-auto px-4 sm:px-6 -mt-16 sm:-mt-16 relative z-20 max-w-6xl">
        <div className="bg-white rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/40 p-3 sm:p-4 mb-6">
          <div className="flex flex-col md:flex-row md:items-center gap-3">
            <div className="relative flex-1 min-w-0">
              <SearchIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by name, email or skill..."
                className="h-11 pl-10 rounded-xl border-slate-200 bg-slate-50 focus-visible:ring-indigo-500 focus-visible:bg-white text-sm"
              />
            </div>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-full md:w-44 h-11 rounded-xl border-slate-200 bg-slate-50 text-sm font-medium">
                <Filter className="h-4 w-4 mr-2 text-slate-400" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="rounded-2xl">
                <SelectItem value="match">Match Score</SelectItem>
                <SelectItem value="date">Date Applied</SelectItem>
                <SelectItem value="experience">Experience</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Status filter chips */}
          <div className="flex items-center gap-2 mt-3 overflow-x-auto pb-1 -mx-1 px-1 scrollbar-hide">
            {filterTabs.map((t) => (
              <button
                key={t.key}
                onClick={() => setStatusFilter(t.key)}
                className={`flex-shrink-0 inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                  statusFilter === t.key
                    ? `bg-gradient-to-r ${t.color} text-white shadow-md`
                    : "bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-100"
                }`}
              >
                {t.label}
                <span
                  className={`inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-full text-[10px] font-bold ${
                    statusFilter === t.key ? "bg-white/25 text-white" : "bg-white text-slate-700 border border-slate-100"
                  }`}
                >
                  {t.count}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <section className="container mx-auto px-4 sm:px-6 max-w-6xl">
        {filtered.length === 0 ? (
          <div className="bg-white border-2 border-dashed border-slate-200 rounded-3xl p-10 sm:p-16 text-center">
            <div className="h-16 w-16 rounded-2xl bg-indigo-50 flex items-center justify-center mx-auto mb-5">
              <Users className="h-8 w-8 text-indigo-600" />
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-slate-900 mb-2 tracking-tight">
              {allApps.length === 0 ? "No applicants yet" : "No matches found"}
            </h3>
            <p className="text-slate-500 text-sm max-w-md mx-auto">
              {allApps.length === 0
                ? "You'll see candidates here once they apply for this position."
                : "Try changing your filters or search to see more applicants."}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-5 pb-4">
            {filtered.map((a, idx) => (
              <ApplicantCard
                key={a.id}
                a={a}
                idx={idx}
                onShortlist={() => updateStatus(a.id, "SHORTLISTED")}
                onReject={() => updateStatus(a.id, "REJECTED")}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

function ApplicantCard({ a, idx, onShortlist, onReject }) {
  const statusStyles = {
    SHORTLISTED: {
      badge: "bg-emerald-50 text-emerald-700 border-emerald-100",
      dot: "bg-emerald-500",
      stripe: "from-emerald-500 to-teal-500",
    },
    REJECTED: {
      badge: "bg-rose-50 text-rose-700 border-rose-100",
      dot: "bg-rose-500",
      stripe: "from-rose-500 to-red-500",
    },
    APPLIED: {
      badge: "bg-indigo-50 text-indigo-700 border-indigo-100",
      dot: "bg-indigo-500",
      stripe: "from-indigo-500 to-blue-500",
    },
  };
  const s = statusStyles[a.status] || statusStyles.APPLIED;
  const score = a.matchScore || 0;
  const scoreColor =
    score >= 70 ? "from-emerald-500 to-teal-500" : score >= 40 ? "from-amber-500 to-orange-500" : "from-rose-500 to-red-500";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: (idx % 6) * 0.05 }}
      whileHover={{ y: -3 }}
      className="bg-white rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/40 overflow-hidden hover:border-indigo-200 hover:shadow-2xl hover:shadow-indigo-100/40 transition-all duration-300 flex flex-col"
    >
      <div className={`h-1.5 w-full bg-gradient-to-r ${s.stripe}`} />

      <div className="p-4 sm:p-6 flex-1">
        <div className="flex items-start gap-3 sm:gap-4">
          <div className="relative flex-shrink-0">
            <div className="h-14 w-14 sm:h-16 sm:w-16 rounded-2xl bg-gradient-to-br from-indigo-100 to-blue-100 flex items-center justify-center font-bold text-xl sm:text-2xl text-indigo-700 shadow-inner">
              {a.candidateName?.charAt(0).toUpperCase()}
            </div>
            <div
              className={`absolute -bottom-1 -right-1 h-5 w-5 rounded-full border-2 border-white flex items-center justify-center ${s.dot}`}
            >
              <span className="h-1.5 w-1.5 rounded-full bg-white" />
            </div>
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2 mb-1.5">
              <h3 className="text-base sm:text-lg font-bold text-slate-900 truncate tracking-tight">
                {a.candidateName}
              </h3>
              <Badge
                className={`flex-shrink-0 border ${s.badge} rounded-lg px-2 py-0.5 text-[9px] sm:text-[10px] font-extrabold tracking-widest uppercase`}
              >
                {a.status}
              </Badge>
            </div>
            <div className="flex flex-col gap-1 text-xs sm:text-sm text-slate-500 font-medium">
              <span className="flex items-center gap-1.5 min-w-0">
                <Mail className="h-3.5 w-3.5 flex-shrink-0 text-slate-400" />
                <span className="truncate">{a.candidateEmail}</span>
              </span>
              <span className="flex items-center gap-1.5">
                <MapPin className="h-3.5 w-3.5 flex-shrink-0 text-slate-400" />
                {a.candidateLocation || "India"}
              </span>
            </div>
          </div>
        </div>

        {/* Match score */}
        <div className="mt-4 sm:mt-5 bg-slate-50 border border-slate-100 rounded-2xl p-3 sm:p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
              Skill Match
            </span>
            <span className="text-base sm:text-lg font-extrabold text-slate-900">{score}%</span>
          </div>
          <div className="h-2.5 w-full bg-white rounded-full overflow-hidden border border-slate-100">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${score}%` }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className={`h-full bg-gradient-to-r ${scoreColor} rounded-full`}
            />
          </div>
        </div>

        {/* Meta grid */}
        <div className="grid grid-cols-2 gap-2 sm:gap-3 mt-3 sm:mt-4">
          <div className="bg-white border border-slate-100 rounded-xl p-3">
            <div className="flex items-center gap-1.5 mb-1">
              <Award className="h-3 w-3 text-indigo-500" />
              <div className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">
                Experience
              </div>
            </div>
            <div className="text-sm font-bold text-slate-900">
              {a.candidateExperience || 0} yrs
            </div>
          </div>
          <div className="bg-white border border-slate-100 rounded-xl p-3">
            <div className="flex items-center gap-1.5 mb-1">
              <Clock className="h-3 w-3 text-indigo-500" />
              <div className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">
                Applied
              </div>
            </div>
            <div className="text-sm font-bold text-slate-900">
              {timeAgo(a.createdAt || Date.now())}
            </div>
          </div>
        </div>

        {/* Skills */}
        {(a.candidateSkills || []).length > 0 && (
          <div className="mt-4">
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">
              Top Skills
            </div>
            <div className="flex flex-wrap gap-1.5">
              {(a.candidateSkills || []).slice(0, 6).map((sk) => (
                <Badge
                  key={sk}
                  variant="secondary"
                  className="bg-indigo-50 text-indigo-700 border border-indigo-100 font-bold text-[10px] sm:text-xs py-0.5 px-2 rounded-md"
                >
                  {sk}
                </Badge>
              ))}
              {(a.candidateSkills || []).length > 6 && (
                <Badge className="bg-slate-50 text-slate-500 border border-slate-100 font-bold text-[10px] sm:text-xs py-0.5 px-2 rounded-md">
                  +{(a.candidateSkills || []).length - 6}
                </Badge>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="bg-slate-50/60 border-t border-slate-100 px-4 sm:px-6 py-3 sm:py-4 flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3">
        {a.resumeUrl ? (
          <a
            href={a.resumeUrl}
            target="_blank"
            rel="noreferrer"
            className="flex-1 inline-flex items-center justify-center gap-2 h-10 rounded-xl bg-white border border-slate-200 text-indigo-600 font-bold text-xs sm:text-sm hover:bg-indigo-50 hover:border-indigo-200 transition-all"
          >
            <FileText className="h-4 w-4" /> View Resume
          </a>
        ) : (
          <div className="flex-1 inline-flex items-center justify-center gap-2 h-10 rounded-xl bg-white border border-slate-100 text-slate-400 font-bold text-xs sm:text-sm">
            No resume
          </div>
        )}
        <div className="grid grid-cols-2 sm:flex gap-2">
          <Button
            onClick={onShortlist}
            disabled={a.status === "SHORTLISTED"}
            className="h-10 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <CheckCircle2 className="h-4 w-4" /> Shortlist
          </Button>
          <Button
            onClick={onReject}
            disabled={a.status === "REJECTED"}
            className="h-10 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <XCircle className="h-4 w-4" /> Reject
          </Button>
        </div>
      </div>
    </motion.div>
  );
}

// ============ PREMIUM PAGE ============
function PremiumPage({ user, setUser, setView }) {
  const [loading, setLoading] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState("pro");

  // Candidates don't need premium - redirect them to jobs
  if (user?.role === "CANDIDATE") {
    return (
      <section className="container mx-auto px-4 sm:px-6 py-16 sm:py-20 max-w-lg text-center">
        <div className="h-16 w-16 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center mx-auto mb-5">
          <CheckCircle className="h-8 w-8 text-emerald-600" />
        </div>
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-2 tracking-tight">All Features Free for Candidates</h2>
        <p className="text-slate-500 mb-6 text-sm sm:text-base">
          Job seekers don't need a premium subscription. Apply to as many jobs as you like — no charges, no limits.
        </p>
        <Button onClick={() => setView("jobs")} className="bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white h-11 px-6 rounded-xl font-bold shadow-lg shadow-indigo-200">
          Browse Jobs <ArrowRight className="h-4 w-4 ml-2" />
        </Button>
      </section>
    );
  }

  if (user?.isPremium) {
    return (
      <section className="container mx-auto px-4 sm:px-6 py-16 sm:py-20 max-w-lg text-center">
        <div className="h-20 w-20 rounded-3xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center mx-auto mb-5 shadow-xl shadow-amber-200">
          <Crown className="h-10 w-10 text-white" />
        </div>
        <Badge className="mb-3 bg-emerald-50 text-emerald-700 border border-emerald-100 rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-widest">
          Active Subscription
        </Badge>
        <h2 className="text-2xl sm:text-3xl font-bold mb-2 tracking-tight">You're already Premium!</h2>
        <p className="text-slate-500 mb-6">
          Enjoy unlimited posting and all premium features.
        </p>
        <Button
          onClick={() => setView("employerDash")}
          className="bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white h-11 px-6 rounded-xl font-bold shadow-lg shadow-indigo-200"
        >
          Go to dashboard <ArrowRight className="h-4 w-4 ml-2" />
        </Button>
      </section>
    );
  }

  const plans = [
    {
      key: "starter",
      name: "Starter",
      tagline: "For small teams just getting started",
      price: 199,
      period: "month",
      gradient: "from-slate-500 to-slate-600",
      light: "from-slate-50 to-slate-100",
      icon: Briefcase,
      features: [
        { ok: true, text: "Post up to 3 active jobs" },
        { ok: true, text: "Basic applicant tracking" },
        { ok: true, text: "Email notifications" },
        { ok: false, text: "Skill-match scoring" },
        { ok: false, text: "Priority listings" },
        { ok: false, text: "Verified employer badge" },
      ],
    },
    {
      key: "pro",
      name: "Pro",
      tagline: "Most popular — unlock the full hiring suite",
      price: 499,
      period: "lifetime",
      gradient: "from-indigo-600 via-blue-600 to-indigo-700",
      light: "from-indigo-50 to-blue-50",
      icon: Crown,
      popular: true,
      features: [
        { ok: true, text: "Post unlimited jobs" },
        { ok: true, text: "Advanced applicant tracking" },
        { ok: true, text: "Skill-match scoring" },
        { ok: true, text: "Shortlist & reject applicants" },
        { ok: true, text: "Priority email support" },
        { ok: true, text: "Verified employer badge" },
      ],
    },
    {
      key: "enterprise",
      name: "Enterprise",
      tagline: "For large recruiters that need more control",
      price: 1499,
      period: "month",
      gradient: "from-amber-500 via-orange-500 to-rose-500",
      light: "from-amber-50 to-orange-50",
      icon: Sparkles,
      features: [
        { ok: true, text: "Everything in Pro" },
        { ok: true, text: "Dedicated account manager" },
        { ok: true, text: "Featured company spotlight" },
        { ok: true, text: "Bulk candidate export" },
        { ok: true, text: "Custom hiring workflows" },
        { ok: true, text: "24/7 priority support" },
      ],
    },
  ];

  const pay = async (plan) => {
    setLoading(true);
    try {
      const order = await api("/payment/create-order", {
        method: "POST",
        body: JSON.stringify({ amount: plan.price }),
      });
      const rzp = new window.Razorpay({
        key: order.keyId,
        amount: order.amount,
        currency: order.currency,
        name: "RCM Job Premium",
        description: `${plan.name} plan`,
        order_id: order.orderId,
        prefill: { name: user?.name, email: user?.email },
        theme: { color: "#4B55E3" },
        handler: async (response) => {
          try {
            await api("/payment/verify", {
              method: "POST",
              body: JSON.stringify({ ...response, amount: plan.price }),
            });
            toast.success("Payment successful! You are now Premium 🎉");
            const { user: refreshed } = await api("/auth/me");
            setUser(refreshed);
            setView("employerDash");
          } catch (e) {
            toast.error("Verification failed: " + e.message);
          }
        },
        modal: { ondismiss: () => setLoading(false) },
      });
      rzp.on("payment.failed", () => {
        toast.error("Payment failed");
        setLoading(false);
      });
      rzp.open();
    } catch (e) {
      toast.error(e.message);
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#F6F7FB] min-h-screen pb-16">
      {/* Hero */}
      <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 pt-10 pb-32 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[300px] sm:w-[400px] h-[300px] sm:h-[400px] bg-indigo-600/20 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 w-[250px] sm:w-[300px] h-[250px] sm:h-[300px] bg-amber-500/15 rounded-full blur-[100px] pointer-events-none" />
        <div
          className="absolute inset-0 opacity-[0.05] pointer-events-none"
          style={{
            backgroundImage:
              "linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />

        <div className="container mx-auto px-4 sm:px-6 relative z-10 max-w-6xl">
          <Button
            onClick={() => setView("employerDash")}
            className="mb-6 inline-flex items-center gap-2 h-9 px-4 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/20 backdrop-blur-md text-xs font-bold uppercase tracking-widest transition-all group"
          >
            <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
            Back to Dashboard
          </Button>

          <div className="text-center max-w-3xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/20 border border-amber-300/40 backdrop-blur-md mb-4"
            >
              <Crown className="h-3.5 w-3.5 text-amber-300" />
              <span className="text-[10px] font-bold text-amber-100 uppercase tracking-widest">
                Employer Premium
              </span>
            </motion.div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight leading-tight">
              Hire the best talent <br className="hidden sm:block" />
              with the <span className="text-amber-300">right plan</span>
            </h1>
            <p className="mt-4 text-slate-300 font-medium text-sm sm:text-base max-w-xl mx-auto">
              Choose the package that fits your hiring goals. Cancel anytime — no hidden fees, no surprises.
            </p>

            {/* trust strip */}
            <div className="mt-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-white/70 text-xs sm:text-sm font-medium">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="h-4 w-4 text-emerald-400" /> Secure payments
              </span>
              <span className="flex items-center gap-1.5">
                <Zap className="h-4 w-4 text-amber-300" /> Instant activation
              </span>
              <span className="flex items-center gap-1.5">
                <Heart className="h-4 w-4 text-pink-300" /> Loved by 5,000+ teams
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Plans */}
      <div className="container mx-auto px-4 sm:px-6 -mt-24 relative z-20 max-w-6xl">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6">
          {plans.map((p, idx) => {
            const isSelected = selectedPlan === p.key;
            return (
              <motion.div
                key={p.key}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: idx * 0.08 }}
                whileHover={{ y: -4 }}
                className={`relative bg-white rounded-3xl border-2 transition-all duration-300 overflow-hidden shadow-xl ${
                  p.popular
                    ? "border-indigo-200 shadow-indigo-200/40 md:scale-[1.03] z-10"
                    : isSelected
                    ? "border-indigo-200 shadow-indigo-100/40"
                    : "border-slate-100 shadow-slate-200/40"
                }`}
              >
                {p.popular && (
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 bg-gradient-to-r from-amber-400 to-orange-500 text-white text-[10px] font-extrabold uppercase tracking-widest px-4 py-1 rounded-b-xl shadow-md">
                    Most Popular
                  </div>
                )}

                <div className={`bg-gradient-to-br ${p.light} p-6 sm:p-7 relative overflow-hidden`}>
                  <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/40 rounded-full blur-2xl pointer-events-none" />
                  <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-4">
                      <div
                        className={`h-12 w-12 rounded-2xl bg-gradient-to-br ${p.gradient} flex items-center justify-center shadow-lg`}
                      >
                        <p.icon className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <div className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">
                          {p.name}
                        </div>
                        <div className="text-[10px] sm:text-xs text-slate-500 font-medium">
                          {p.tagline}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-baseline gap-1">
                      <span className="text-3xl sm:text-4xl font-extrabold text-slate-900">
                        ₹{p.price}
                      </span>
                      <span className="text-slate-500 text-xs sm:text-sm font-medium">
                        /{p.period}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="p-6 sm:p-7">
                  <ul className="space-y-3 mb-6">
                    {p.features.map((f, i) => (
                      <li key={i} className="flex items-start gap-2.5">
                        <div
                          className={`h-5 w-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${
                            f.ok ? "bg-emerald-100" : "bg-slate-100"
                          }`}
                        >
                          {f.ok ? (
                            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                          ) : (
                            <Minus className="h-3 w-3 text-slate-400" />
                          )}
                        </div>
                        <span
                          className={`text-xs sm:text-sm font-medium ${
                            f.ok ? "text-slate-700" : "text-slate-400 line-through"
                          }`}
                        >
                          {f.text}
                        </span>
                      </li>
                    ))}
                  </ul>

                  <Button
                    onClick={() => {
                      setSelectedPlan(p.key);
                      pay(p);
                    }}
                    disabled={loading}
                    className={`w-full h-12 rounded-xl font-bold text-sm sm:text-base shadow-lg transition-all active:scale-[0.98] ${
                      p.popular
                        ? "bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white shadow-indigo-200"
                        : "bg-white text-slate-900 border-2 border-slate-200 hover:border-indigo-300 hover:text-indigo-600 shadow-slate-200/50"
                    }`}
                  >
                    {loading && selectedPlan === p.key ? (
                      <Loader2 className="h-5 w-5 animate-spin" />
                    ) : (
                      <>
                        Choose {p.name}
                        <ArrowRight className="h-4 w-4 ml-2" />
                      </>
                    )}
                  </Button>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Features comparison strip */}
        <div className="mt-12 bg-white border border-slate-100 rounded-3xl shadow-xl shadow-slate-200/40 p-6 sm:p-8">
          <div className="text-center mb-6">
            <Badge className="bg-indigo-50 text-indigo-700 border border-indigo-100 rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-widest mb-3">
              Why upgrade
            </Badge>
            <h3 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              Everything you need to <span className="text-indigo-600">scale hiring</span>
            </h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
            {[
              { icon: Users, title: "Unlimited applicants", desc: "Review every candidate, no caps.", color: "from-indigo-500 to-blue-500" },
              { icon: TrendingUp, title: "Skill-match insights", desc: "Smart ranking by job fit.", color: "from-emerald-500 to-teal-500" },
              { icon: ShieldCheck, title: "Verified employer", desc: "Stand out with a trusted badge.", color: "from-amber-500 to-orange-500" },
              { icon: MessageSquare, title: "Priority support", desc: "We answer in hours, not days.", color: "from-rose-500 to-pink-500" },
            ].map((f, i) => (
              <div key={i} className="bg-slate-50/50 border border-slate-100 rounded-2xl p-4 sm:p-5">
                <div className={`h-10 w-10 rounded-xl bg-gradient-to-br ${f.color} flex items-center justify-center shadow-md mb-3`}>
                  <f.icon className="h-5 w-5 text-white" />
                </div>
                <div className="text-sm sm:text-base font-bold text-slate-900 mb-1">{f.title}</div>
                <div className="text-xs sm:text-sm text-slate-500 font-medium">{f.desc}</div>
              </div>
            ))}
          </div>
        </div>

        {/* FAQ note */}
        <p className="text-center text-xs text-slate-500 mt-8 font-medium">
          🔒 Secure checkout via Razorpay · Test card: <span className="font-mono">4111 1111 1111 1111</span> · any CVV/date
        </p>
      </div>
    </div>
  );
}

// ============ RESUME BUILDER ============
function ResumeBuilder({ user, setView }) {
  const [data, setData] = useState({
    personal: {
      name: user?.name || "",
      email: user?.email || "",
      phone: "",
      location: "",
      summary: "",
    },
    experience: [{ company: "", role: "", period: "", desc: "" }],
    education: [{ school: "", degree: "", year: "" }],
    skills: "",
    projects: [{ name: "", link: "", desc: "" }],
  });
  const [template, setTemplate] = useState("modern");

  const addExp = () =>
    setData((prev) => ({
      ...prev,
      experience: [
        ...prev.experience,
        { company: "", role: "", period: "", desc: "" },
      ],
    }));
  const addEdu = () =>
    setData((prev) => ({
      ...prev,
      education: [...prev.education, { school: "", degree: "", year: "" }],
    }));
  const addProj = () =>
    setData((prev) => ({
      ...prev,
      projects: [...prev.projects, { name: "", link: "", desc: "" }],
    }));

  const print = () => window.print();

  // Compute completion
  const filled = [
    data.personal.phone,
    data.personal.location,
    data.personal.summary,
    data.experience.some(e => e.company || e.role),
    data.education.some(e => e.school || e.degree),
    data.skills,
  ].filter(Boolean).length;
  const completion = Math.round((filled / 6) * 100);

  return (
    <div className="min-h-screen bg-[#F8F9FD] pb-12 print:p-0 print:bg-white overflow-x-hidden">
      {/* Hero banner */}
      <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 pt-8 sm:pt-10 pb-24 sm:pb-28 relative overflow-hidden print:hidden">
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-indigo-600/20 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 w-[300px] h-[300px] bg-blue-600/15 rounded-full blur-[100px] pointer-events-none" />
        <div
          className="absolute inset-0 opacity-[0.05] pointer-events-none"
          style={{
            backgroundImage: "linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)",
            backgroundSize: "40px 40px"
          }}
        />
        <div className="container mx-auto px-4 sm:px-6 relative z-10">
          <Button
            onClick={() => setView("candidateDash")}
            className="mb-5 sm:mb-6 inline-flex items-center gap-2 h-9 px-3 sm:px-4 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/20 backdrop-blur-md text-[10px] sm:text-xs font-bold uppercase tracking-widest transition-all group"
          >
            <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
            Back to Dashboard
          </Button>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-5 sm:gap-6">
            <div className="min-w-0">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/10 backdrop-blur-md mb-3">
                <FileText className="h-3 w-3 text-indigo-300" />
                <span className="text-[10px] font-bold text-white/80 uppercase tracking-widest">Resume Builder</span>
              </div>
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white tracking-tight">
                Build a <span className="text-indigo-400">winning</span> resume
              </h1>
              <p className="text-slate-300 mt-1.5 font-medium text-xs sm:text-sm">
                Fill in your details and preview your resume in real time.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3 self-stretch sm:self-auto md:self-auto">
              <Select value={template} onValueChange={setTemplate}>
                <SelectTrigger className="w-full sm:w-44 h-11 rounded-xl bg-white/10 border border-white/20 text-white text-sm font-bold backdrop-blur-md hover:bg-white/20 transition-all">
                  <SelectValue placeholder="Template" />
                </SelectTrigger>
                <SelectContent className="rounded-2xl border-slate-100">
                  <SelectItem value="modern">Modern Professional</SelectItem>
                  <SelectItem value="classic">Classic Executive</SelectItem>
                  <SelectItem value="creative">Clean & Minimal</SelectItem>
                </SelectContent>
              </Select>
              <Button
                onClick={print}
                className="h-11 px-5 rounded-xl bg-white text-indigo-600 hover:bg-slate-50 font-bold shadow-xl shadow-black/20 transition-all hover:scale-[1.02] group w-full sm:w-auto justify-center"
              >
                <Upload className="h-4 w-4 mr-2" /> Download PDF
              </Button>
            </div>
          </div>

          {/* Completion progress */}
          <div className="mt-6 max-w-md">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-bold text-white/70 uppercase tracking-widest flex items-center gap-1.5">
                <Sparkles className="h-3 w-3" /> Resume Completion
              </span>
              <span className="text-xs font-bold text-emerald-300">{completion}%</span>
            </div>
            <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${completion}%` }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="h-full bg-gradient-to-r from-emerald-400 to-emerald-300 rounded-full"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 -mt-16 relative z-20 grid lg:grid-cols-2 gap-4 sm:gap-6 print:gap-0 print:mt-0 print:p-0 min-w-0">
        {/* FORM SIDE */}
        <div className="space-y-4 sm:space-y-5 print:hidden min-w-0 w-full">
          <Card className="border border-slate-100 shadow-xl shadow-slate-200/40 rounded-3xl overflow-hidden bg-white">
            <CardHeader className="border-b border-slate-100 pb-3 sm:pb-4 px-4 sm:px-6 bg-gradient-to-br from-indigo-50 to-blue-50">
              <div className="flex items-center gap-2.5">
                <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-indigo-500 to-blue-500 flex items-center justify-center shadow-md flex-shrink-0">
                  <User className="h-4 w-4 text-white" />
                </div>
                <CardTitle className="text-base font-bold tracking-tight">Personal Info</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="pt-4 sm:pt-5 space-y-4 px-4 sm:px-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label className="text-slate-500 font-bold text-[10px] uppercase tracking-wider ml-1">
                    Phone
                  </Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
                    <Input
                      value={data.personal.phone}
                      onChange={(e) =>
                        setData({
                          ...data,
                          personal: { ...data.personal, phone: e.target.value },
                        })
                      }
                      className="h-10 pl-9 rounded-xl border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 text-sm"
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-slate-500 font-bold text-[10px] uppercase tracking-wider ml-1">
                    Location
                  </Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
                    <Input
                      value={data.personal.location}
                      onChange={(e) =>
                        setData({
                          ...data,
                          personal: {
                            ...data.personal,
                            location: e.target.value,
                          },
                        })
                      }
                      className="h-10 pl-9 rounded-xl border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 text-sm"
                    />
                  </div>
                </div>
              </div>
              <div className="space-y-1.5">
                <Label className="text-slate-500 font-bold text-[10px] uppercase tracking-wider ml-1">
                  Professional Summary
                </Label>
                <Textarea
                  value={data.personal.summary}
                  onChange={(e) =>
                    setData({
                      ...data,
                      personal: { ...data.personal, summary: e.target.value },
                    })
                  }
                  rows={3}
                  placeholder="A short paragraph about your career objective..."
                  className="rounded-xl border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 text-sm px-4 py-3"
                />
              </div>
            </CardContent>
          </Card>

          <Card className="border border-slate-100 shadow-xl shadow-slate-200/40 rounded-3xl overflow-hidden bg-white">
            <CardHeader className="border-b border-slate-100 pb-3 sm:pb-4 px-4 sm:px-6 bg-gradient-to-br from-purple-50 to-pink-50 flex-row items-center justify-between gap-2">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-md flex-shrink-0">
                  <Briefcase className="h-4 w-4 text-white" />
                </div>
                <CardTitle className="text-base font-bold tracking-tight">Experience</CardTitle>
              </div>
              <Button
                onClick={addExp}
                variant="outline"
                size="sm"
                className="rounded-xl h-8 border-purple-200 bg-white text-purple-700 hover:bg-purple-50 font-bold text-xs flex-shrink-0"
              >
                <Plus className="h-3.5 w-3.5 mr-1" /> Add
              </Button>
            </CardHeader>
            <CardContent className="pt-4 sm:pt-5 space-y-4 px-4 sm:px-6">
              {data.experience.map((exp, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-3 p-3 sm:p-4 rounded-2xl bg-slate-50 border border-slate-100 relative group"
                >
                  <div className="absolute top-3 left-3 h-6 w-6 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-[10px] font-black text-slate-500">
                    {String(i + 1).padStart(2, "0")}
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pl-9">
                    <Input
                      placeholder="Company"
                      value={exp.company}
                      onChange={(e) => {
                        const newExp = [...data.experience];
                        newExp[i].company = e.target.value;
                        setData({ ...data, experience: newExp });
                      }}
                      className="h-10 rounded-xl border-slate-200 bg-white text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                    />
                    <Input
                      placeholder="Role"
                      value={exp.role}
                      onChange={(e) => {
                        const newExp = [...data.experience];
                        newExp[i].role = e.target.value;
                        setData({ ...data, experience: newExp });
                      }}
                      className="h-10 rounded-xl border-slate-200 bg-white text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                    />
                  </div>
                  <Input
                    placeholder="Period (e.g. 2021 - Present)"
                    value={exp.period}
                    onChange={(e) => {
                      const newExp = [...data.experience];
                      newExp[i].period = e.target.value;
                      setData({ ...data, experience: newExp });
                    }}
                    className="h-10 rounded-xl border-slate-200 bg-white text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                  />
                  <Textarea
                    placeholder="Key responsibilities..."
                    value={exp.desc}
                    onChange={(e) => {
                      const newExp = [...data.experience];
                      newExp[i].desc = e.target.value;
                      setData({ ...data, experience: newExp });
                    }}
                    rows={2}
                    className="rounded-xl border-slate-200 bg-white text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 px-4 py-2"
                  />
                  {data.experience.length > 1 && (
                    <button
                      type="button"
                      onClick={() => {
                        const newExp = data.experience.filter(
                          (_, idx) => idx !== i
                        );
                        setData({ ...data, experience: newExp });
                      }}
                      className="absolute top-3 right-3 h-7 w-7 rounded-lg bg-rose-50 text-rose-500 hover:bg-rose-100 flex items-center justify-center lg:opacity-0 lg:group-hover:opacity-100 transition"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  )}
                </motion.div>
              ))}
            </CardContent>
          </Card>

          <Card className="border border-slate-100 shadow-xl shadow-slate-200/40 rounded-3xl overflow-hidden bg-white">
            <CardHeader className="border-b border-slate-100 pb-3 sm:pb-4 px-4 sm:px-6 bg-gradient-to-br from-emerald-50 to-teal-50 flex-row items-center justify-between gap-2">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center shadow-md flex-shrink-0">
                  <GraduationCap className="h-4 w-4 text-white" />
                </div>
                <CardTitle className="text-base font-bold tracking-tight">Education</CardTitle>
              </div>
              <Button
                onClick={addEdu}
                variant="outline"
                size="sm"
                className="rounded-xl h-8 border-emerald-200 bg-white text-emerald-700 hover:bg-emerald-50 font-bold text-xs flex-shrink-0"
              >
                <Plus className="h-3.5 w-3.5 mr-1" /> Add
              </Button>
            </CardHeader>
            <CardContent className="pt-4 sm:pt-5 space-y-3 px-4 sm:px-6">
              {data.education.map((edu, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="grid grid-cols-1 sm:grid-cols-3 gap-2 p-3 rounded-2xl bg-slate-50 border border-slate-100"
                >
                  <Input
                    placeholder="School/Uni"
                    value={edu.school}
                    onChange={(e) => {
                      const newEdu = [...data.education];
                      newEdu[i].school = e.target.value;
                      setData({ ...data, education: newEdu });
                    }}
                    className="sm:col-span-1 h-10 rounded-xl border-slate-200 bg-white text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                  />
                  <Input
                    placeholder="Degree"
                    value={edu.degree}
                    onChange={(e) => {
                      const newEdu = [...data.education];
                      newEdu[i].degree = e.target.value;
                      setData({ ...data, education: newEdu });
                    }}
                    className="sm:col-span-1 h-10 rounded-xl border-slate-200 bg-white text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                  />
                  <Input
                    placeholder="Year"
                    value={edu.year}
                    onChange={(e) => {
                      const newEdu = [...data.education];
                      newEdu[i].year = e.target.value;
                      setData({ ...data, education: newEdu });
                    }}
                    className="sm:col-span-1 h-10 rounded-xl border-slate-200 bg-white text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                  />
                </motion.div>
              ))}
            </CardContent>
          </Card>

          <Card className="border border-slate-100 shadow-xl shadow-slate-200/40 rounded-3xl overflow-hidden bg-white">
            <CardHeader className="border-b border-slate-100 pb-3 sm:pb-4 px-4 sm:px-6 bg-gradient-to-br from-amber-50 to-orange-50">
              <div className="flex items-center gap-2.5">
                <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center shadow-md flex-shrink-0">
                  <Zap className="h-4 w-4 text-white" />
                </div>
                <CardTitle className="text-base font-bold tracking-tight">Skills</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="pt-4 sm:pt-5 space-y-3 px-4 sm:px-6">
              <Textarea
                value={data.skills}
                onChange={(e) => setData({ ...data, skills: e.target.value })}
                placeholder="React, Python, SQL, Project Management..."
                rows={3}
                className="rounded-xl border-slate-200 text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 px-4 py-3"
              />
              {data.skills && (
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {data.skills.split(",").map((s) => s.trim()).filter(Boolean).slice(0, 12).map((sk, idx) => (
                    <Badge key={idx} className="bg-amber-50 text-amber-700 border border-amber-100 rounded-lg px-2 py-0.5 text-[10px] font-bold">
                      {sk}
                    </Badge>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* PREVIEW SIDE */}
        <div className="lg:sticky lg:top-24 lg:h-[1100px] print:h-auto print:static min-w-0 w-full">
          <div className="flex items-center justify-between mb-2 sm:mb-3 print:hidden">
            <div className="flex items-center gap-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
              <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              Live Preview
            </div>
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              {template === "modern" ? "Modern Professional" : template === "classic" ? "Classic Executive" : "Clean & Minimal"}
            </div>
          </div>
          {/* Mobile scaled preview */}
          <div className="lg:hidden bg-slate-100 shadow-2xl shadow-slate-300/50 rounded-2xl border border-slate-100 overflow-hidden print:hidden w-full max-w-full">
            <div className="h-[480px] overflow-auto p-3 max-w-full">
              <div
                style={{
                  width: "794px",
                  transformOrigin: "top left",
                }}
                className="origin-top-left transform scale-[0.4] sm:scale-[0.6] bg-white shadow-md rounded-md p-[40px] resume-preview-mobile"
              >
                {template === "modern" && <ModernTemplate data={data} />}
                {template === "classic" && <ClassicTemplate data={data} />}
                {template === "creative" && <CreativeTemplate data={data} />}
              </div>
            </div>
            <div className="bg-slate-50 border-t border-slate-100 px-4 py-2.5 text-center">
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                Preview scaled · Download PDF for full size
              </p>
            </div>
          </div>
          {/* Desktop preview */}
          <div className="hidden lg:block bg-white shadow-2xl shadow-slate-300/50 rounded-2xl h-full overflow-y-auto print:shadow-none print:rounded-none overflow-x-hidden p-[40px] resume-preview border border-slate-100 print:border-0">
            {template === "modern" && <ModernTemplate data={data} />}
            {template === "classic" && <ClassicTemplate data={data} />}
            {template === "creative" && <CreativeTemplate data={data} />}
          </div>
          {/* Print-only full preview */}
          <div className="hidden print:block resume-preview p-[40px]">
            {template === "modern" && <ModernTemplate data={data} />}
            {template === "classic" && <ClassicTemplate data={data} />}
            {template === "creative" && <CreativeTemplate data={data} />}
          </div>
        </div>
      </div>

      <style jsx global>{`
        @media print {
          body * {
            visibility: hidden;
          }
          .resume-preview,
          .resume-preview * {
            visibility: visible;
          }
          .resume-preview {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            padding: 0;
          }
          .print\\:hidden {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
}

function ModernTemplate({ data }) {
  return (
    <div className="text-slate-800 font-sans leading-relaxed">
      <header className="border-b-4 border-indigo-600 pb-8 mb-8">
        <h1 className="text-5xl font-extrabold text-slate-900 tracking-tight uppercase mb-2">
          {data.personal.name}
        </h1>
        <div className="flex flex-wrap gap-4 text-sm font-bold text-slate-500 uppercase tracking-widest">
          <span>{data.personal.email}</span>
          <span>•</span>
          <span>{data.personal.phone}</span>
          <span>•</span>
          <span>{data.personal.location}</span>
        </div>
      </header>

      <div className="grid grid-cols-12 gap-10">
        <div className="col-span-8 space-y-10">
          <section>
            <h2 className="text-xl font-black text-indigo-600 uppercase tracking-[0.2em] mb-4">
              Summary
            </h2>
            <p className="text-slate-600 text-lg leading-relaxed">
              {data.personal.summary}
            </p>
          </section>

          <section>
            <h2 className="text-xl font-black text-indigo-600 uppercase tracking-[0.2em] mb-6">
              Experience
            </h2>
            <div className="space-y-8">
              {data.experience.map((exp, i) => (
                <div key={i}>
                  <div className="flex justify-between items-baseline mb-2">
                    <h3 className="text-xl font-bold text-slate-900">
                      {exp.role}
                    </h3>
                    <span className="text-sm font-bold text-slate-400">
                      {exp.period}
                    </span>
                  </div>
                  <div className="text-indigo-600 font-bold mb-3">
                    {exp.company}
                  </div>
                  <p className="text-slate-600 whitespace-pre-line">
                    {exp.desc}
                  </p>
                </div>
              ))}
            </div>
          </section>
        </div>

        <div className="col-span-4 space-y-10">
          <section>
            <h2 className="text-xl font-black text-indigo-600 uppercase tracking-[0.2em] mb-6">
              Skills
            </h2>
            <div className="flex flex-wrap gap-2">
              {data.skills.split(",").map(
                (s, i) =>
                  s.trim() && (
                    <span
                      key={i}
                      className="bg-slate-100 text-slate-700 px-3 py-1 rounded-md text-sm font-bold"
                    >
                      {s.trim()}
                    </span>
                  )
              )}
            </div>
          </section>

          <section>
            <h2 className="text-xl font-black text-indigo-600 uppercase tracking-[0.2em] mb-6">
              Education
            </h2>
            <div className="space-y-6">
              {data.education.map((edu, i) => (
                <div key={i}>
                  <div className="font-bold text-slate-900">{edu.degree}</div>
                  <div className="text-slate-500 text-sm">{edu.school}</div>
                  <div className="text-slate-400 text-xs mt-1">{edu.year}</div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

function ClassicTemplate({ data }) {
  return (
    <div className="text-slate-800 font-serif leading-normal max-w-4xl mx-auto">
      <header className="text-center mb-10 border-b border-slate-300 pb-6">
        <h1 className="text-4xl font-bold mb-2">{data.personal.name}</h1>
        <div className="text-sm text-slate-600 italic">
          {data.personal.email} | {data.personal.phone} |{" "}
          {data.personal.location}
        </div>
      </header>

      <section className="mb-8">
        <h2 className="text-lg font-bold border-b-2 border-slate-800 mb-3 uppercase tracking-wider">
          Professional Profile
        </h2>
        <p className="text-slate-700 leading-relaxed italic">
          {data.personal.summary}
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-lg font-bold border-b-2 border-slate-800 mb-4 uppercase tracking-wider">
          Experience
        </h2>
        {data.experience.map((exp, i) => (
          <div key={i} className="mb-6">
            <div className="flex justify-between font-bold">
              <span>{exp.company}</span>
              <span>{exp.period}</span>
            </div>
            <div className="italic text-slate-600 mb-2">{exp.role}</div>
            <p className="text-slate-700 text-sm whitespace-pre-line border-l-2 border-slate-100 pl-4 ml-1">
              {exp.desc}
            </p>
          </div>
        ))}
      </section>

      <div className="grid grid-cols-2 gap-10">
        <section>
          <h2 className="text-lg font-bold border-b-2 border-slate-800 mb-4 uppercase tracking-wider">
            Education
          </h2>
          {data.education.map((edu, i) => (
            <div key={i} className="mb-3">
              <div className="font-bold text-sm">{edu.school}</div>
              <div className="text-sm">
                {edu.degree} ({edu.year})
              </div>
            </div>
          ))}
        </section>
        <section>
          <h2 className="text-lg font-bold border-b-2 border-slate-800 mb-4 uppercase tracking-wider">
            Expertise
          </h2>
          <p className="text-sm text-slate-700">{data.skills}</p>
        </section>
      </div>
    </div>
  );
}

function CreativeTemplate({ data }) {
  return (
    <div className="text-slate-700 font-sans">
      <div className="flex gap-12">
        <aside className="w-1/3 bg-slate-900 -m-[40px] p-[40px] text-white min-h-[1100px]">
          <h1 className="text-3xl font-black mb-10 leading-tight tracking-tighter uppercase">
            {data.personal.name.split(" ").map((n, i) => (
              <div key={i} className={i === 1 ? "text-indigo-400" : ""}>
                {n}
              </div>
            ))}
          </h1>

          <div className="space-y-12">
            <section>
              <h2 className="text-xs font-black uppercase tracking-[0.3em] text-slate-400 mb-6">
                Contact
              </h2>
              <div className="space-y-4 text-sm font-medium">
                <div className="flex items-center gap-3">
                  <Mail className="h-4 w-4 text-indigo-400" />{" "}
                  {data.personal.email}
                </div>
                <div className="flex items-center gap-3">
                  <MapPin className="h-4 w-4 text-indigo-400" />{" "}
                  {data.personal.location}
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-xs font-black uppercase tracking-[0.3em] text-slate-400 mb-6">
                Expertise
              </h2>
              <div className="space-y-3">
                {data.skills.split(",").map(
                  (s, i) =>
                    s.trim() && (
                      <div key={i} className="flex flex-col gap-1.5">
                        <span className="text-xs font-bold uppercase">
                          {s.trim()}
                        </span>
                        <div className="h-1 w-full bg-white/10 rounded-full overflow-hidden">
                          <div className="h-full bg-indigo-400 w-[80%]" />
                        </div>
                      </div>
                    )
                )}
              </div>
            </section>

            <section>
              <h2 className="text-xs font-black uppercase tracking-[0.3em] text-slate-400 mb-6">
                Education
              </h2>
              {data.education.map((edu, i) => (
                <div key={i} className="mb-4">
                  <div className="text-sm font-bold text-indigo-400">
                    {edu.degree}
                  </div>
                  <div className="text-xs text-slate-300 mt-1">
                    {edu.school}
                  </div>
                  <div className="text-[10px] text-slate-500 mt-0.5">
                    {edu.year}
                  </div>
                </div>
              ))}
            </section>
          </div>
        </aside>

        <main className="w-2/3 py-6 space-y-12">
          <section>
            <h2 className="text-xs font-black uppercase tracking-[0.3em] text-indigo-600 mb-6">
              About Me
            </h2>
            <p className="text-lg leading-relaxed font-medium text-slate-600 italic">
              "{data.personal.summary}"
            </p>
          </section>

          <section>
            <h2 className="text-xs font-black uppercase tracking-[0.3em] text-indigo-600 mb-8">
              Professional Path
            </h2>
            <div className="space-y-10 relative">
              <div className="absolute left-0 top-0 bottom-0 w-[1px] bg-slate-100" />
              {data.experience.map((exp, i) => (
                <div key={i} className="pl-8 relative">
                  <div className="absolute left-[-4px] top-1.5 h-2 w-2 rounded-full bg-indigo-600 shadow-[0_0_10px_rgba(79,70,229,0.5)]" />
                  <div className="flex justify-between items-baseline mb-2">
                    <h3 className="font-bold text-slate-900 text-lg uppercase">
                      {exp.role}
                    </h3>
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                      {exp.period}
                    </span>
                  </div>
                  <div className="text-sm font-black text-indigo-600 uppercase tracking-widest mb-4">
                    {exp.company}
                  </div>
                  <p className="text-sm text-slate-500 leading-relaxed whitespace-pre-line">
                    {exp.desc}
                  </p>
                </div>
              ))}
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}

// ============ SHARED ============
function StatCard({ icon: Icon, label, value, color = "blue" }) {
  const colors = {
    blue: "bg-blue-100 text-blue-600",
    green: "bg-green-100 text-green-600",
    amber: "bg-amber-100 text-amber-600",
    indigo: "bg-indigo-100 text-indigo-600",
    emerald: "bg-emerald-100 text-emerald-600",
    orange: "bg-orange-100 text-orange-600",
    purple: "bg-purple-100 text-purple-600",
    rose: "bg-rose-100 text-rose-600",
  };
  return (
    <Card className="border-slate-100 shadow-sm hover:shadow-md transition">
      <CardContent className="pt-6 flex items-center gap-4">
        <div
          className={`h-12 w-12 rounded-xl flex items-center justify-center ${colors[color] || colors.blue
            }`}
        >
          <Icon className="h-6 w-6" />
        </div>
        <div>
          <div className="text-[10px] uppercase tracking-wider font-bold text-slate-400">
            {label}
          </div>
          <div className="text-xl font-bold text-slate-900">{value}</div>
        </div>
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
      {action && (
        <Button
          onClick={action.onClick}
          className="mt-4 bg-blue-600 hover:bg-blue-700"
        >
          {action.label}
        </Button>
      )}
    </div>
  );
}

// ============ ABOUT PAGE ============
function AboutPage({ setView }) {
  return (
    <div className="bg-white">
      {/* HERO SECTION */}
      <section className="relative py-12 sm:py-20 lg:py-24 overflow-hidden bg-slate-50">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-indigo-600/5 -skew-x-12 translate-x-32" />
        <div className="container mx-auto px-4 sm:px-6 relative z-10">
          <div className="max-w-3xl">
            <Badge className="mb-4 bg-indigo-50 text-indigo-600 border-indigo-100 hover:bg-indigo-50 px-4 py-1.5 rounded-full font-bold uppercase tracking-widest text-xs">
              Our Mission
            </Badge>
            <h1 className="text-3xl sm:text-5xl lg:text-7xl font-black text-slate-900 mb-6 sm:mb-8 leading-tight sm:leading-[1.1]">
              Bridging the gap in{" "}
              <span className="text-indigo-600">Healthcare RCM</span>{" "}
              excellence.
            </h1>
            <p className="text-base sm:text-lg lg:text-xl text-slate-600 leading-relaxed mb-8 sm:mb-10">
              RCM Job is the world's first specialized ecosystem designed
              exclusively for Revenue Cycle Management professionals. We combine
              elite job connections with world-class education and a vibrant
              community.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button
                onClick={() => setView("jobs")}
                className="h-14 px-8 rounded-2xl bg-indigo-600 hover:bg-indigo-700 font-bold shadow-xl shadow-indigo-100 text-lg"
              >
                Find Opportunities
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* WHAT WE DO */}
      <section className="py-24 bg-slate-900 text-white overflow-hidden relative">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20" />
        <div className="container mx-auto px-4 sm:px-6 relative z-10">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            <div>
              <h2 className="text-4xl lg:text-5xl font-bold mb-8 leading-tight">
                Everything you need to{" "}
                <span className="text-indigo-400">master</span> your RCM career.
              </h2>
              <div className="space-y-8">
                <FeatureItem
                  title="Elite Job Portal"
                  desc="Access verified roles from top healthcare facilities across the globe."
                />
                <FeatureItem
                  title="RCM Academy"
                  desc="Industry-leading certifications and crash courses with job guarantees."
                />
                <FeatureItem
                  title="Gamified Networking"
                  desc="Earn rewards and boost your professional scorecard through community participation."
                />
              </div>
            </div>
            <div className="relative">
              <div className="absolute inset-0 bg-indigo-500/20 rounded-[3rem] blur-3xl" />
              <img
                src="https://images.unsplash.com/photo-1551434678-e076c223a692?auto=format&fit=crop&q=80"
                alt="Team"
                className="rounded-[3rem] shadow-2xl relative z-10 border border-white/10"
              />
            </div>
          </div>
        </div>
      </section>

      {/* CORE VALUES */}
      <section className="py-24 container mx-auto px-4 sm:px-6">
        <div className="text-center mb-20">
          <h2 className="text-sm font-black text-indigo-600 uppercase tracking-[0.3em] mb-4">
            Why We Exist
          </h2>
          <h3 className="text-4xl lg:text-5xl font-bold text-slate-900">
            The RCM Job <span className="text-indigo-600">Difference</span>
          </h3>
        </div>

        <div className="grid md:grid-cols-3 gap-10">
          <ValueCard
            icon={Zap}
            title="Accelerated Growth"
            desc="Our specialized training and job placement services are designed to fast-track your career in healthcare administration."
            color="indigo"
          />
          <ValueCard
            icon={ShieldCheck}
            title="Verified Quality"
            desc="Every job posting and professional profile undergoes rigorous verification to ensure the highest standards of integrity."
            color="emerald"
          />
          <ValueCard
            icon={Users}
            title="Community Driven"
            desc="Join a network of thousands of RCM experts to share knowledge, find mentors, and stay ahead of industry trends."
            color="amber"
          />
        </div>
      </section>



      {/* STATS */}

    </div>
  );
}

function ValueCard({ icon: Icon, title, desc, color }) {
  const colors = {
    indigo: "bg-indigo-50 text-indigo-600",
    emerald: "bg-emerald-50 text-emerald-600",
    amber: "bg-amber-50 text-amber-600",
  };
  return (
    <Card className="p-10 border-none shadow-xl shadow-slate-200/50 rounded-[2.5rem] hover:-translate-y-2 transition-all duration-300">
      <div
        className={`h-16 w-16 rounded-2xl ${colors[color]} flex items-center justify-center mb-8`}
      >
        <Icon className="h-8 w-8" />
      </div>
      <h4 className="text-2xl font-bold text-slate-900 mb-4">{title}</h4>
      <p className="text-slate-500 leading-relaxed">{desc}</p>
    </Card>
  );
}

function FeatureItem({ title, desc }) {
  return (
    <div className="flex gap-5">
      <div className="h-6 w-6 rounded-full bg-indigo-500 flex items-center justify-center shrink-0 mt-1">
        <CheckCircle2 className="h-4 w-4 text-white" />
      </div>
      <div>
        <h4 className="text-xl font-bold mb-2">{title}</h4>
        <p className="text-slate-400">{desc}</p>
      </div>
    </div>
  );
}

function StatItem({ value, label }) {
  return (
    <div className="text-center">
      <div className="text-5xl lg:text-6xl font-black mb-2 tracking-tighter">
        {value}
      </div>
      <div className="text-indigo-100 font-bold uppercase tracking-widest text-sm">
        {label}
      </div>
    </div>
  );
}

// ============ CONTACT PAGE ============
function ContactPage({ setView }) {
  const [status, setStatus] = useState(null);
  const handleSubmit = (e) => {
    e.preventDefault();
    setStatus("sending");
    setTimeout(() => {
      setStatus("success");
      toast.success("Message sent successfully! We'll get back to you soon.");
    }, 1500);
  };

  return (
    <div className="bg-white min-h-screen">
      {/* HEADER */}
      <section className="bg-slate-900 py-12 sm:py-20 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-indigo-600/10 skew-x-12 translate-x-32" />
        <div className="container mx-auto px-4 sm:px-6 relative z-10 text-center">
          <Badge className="mb-4 bg-indigo-500/20 text-indigo-300 border-indigo-500/30 px-4 py-1.5 rounded-full font-bold uppercase tracking-widest text-xs">
            Contact Us
          </Badge>
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white mb-4 sm:mb-6">
            Get in <span className="text-indigo-400">touch</span>
          </h1>
          <p className="text-slate-400 max-w-2xl mx-auto text-sm sm:text-base lg:text-lg">
            Have questions about RCM Job or the Academy? Our team is here to
            help you navigate your professional journey.
          </p>
        </div>
      </section>

      <section className="py-12 sm:py-20 lg:py-24 container mx-auto px-4 sm:px-6">
        <div className="grid lg:grid-cols-12 gap-10 sm:gap-16">
          {/* CONTACT INFO */}
          <div className="lg:col-span-5 space-y-12">
            <div>
              <h2 className="text-3xl font-bold text-slate-900 mb-8">
                Contact Information
              </h2>
              <div className="space-y-8">
                <ContactInfoItem
                  icon={MapPin}
                  title="Our Office"
                  detail="Sector 62, Noida, UP, India"
                />
                <ContactInfoItem
                  icon={Phone}
                  title="Phone Number"
                  detail="+91 (120) 456-7890"
                />
                <ContactInfoItem
                  icon={Mail}
                  title="Email Address"
                  detail="support@rcmjob.com"
                />
              </div>
            </div>

            <div className="p-8 bg-indigo-50 rounded-[2.5rem] border border-indigo-100">
              <h3 className="text-xl font-bold text-indigo-900 mb-4">
                Support Hours
              </h3>
              <div className="space-y-2 text-indigo-700/80 font-medium">
                <div className="flex justify-between">
                  <span>Monday - Friday</span> <span>9:00 AM - 6:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span>Saturday</span> <span>10:00 AM - 2:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span>Sunday</span>{" "}
                  <span className="font-bold text-indigo-600">Closed</span>
                </div>
              </div>
            </div>

            <div className="flex gap-4">
              <SocialBtn icon={Facebook} />
              <SocialBtn icon={Twitter} />
              <SocialBtn icon={Linkedin} />
              <SocialBtn icon={Instagram} />
            </div>
          </div>

          {/* CONTACT FORM */}
          <div className="lg:col-span-7">
            <Card className="border-none shadow-2xl shadow-slate-200/60 rounded-[3rem] p-8 lg:p-12">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label className="text-sm font-bold text-slate-500 ml-1">
                      Full Name
                    </Label>
                    <Input
                      required
                      placeholder="John Doe"
                      className="h-12 rounded-xl border-slate-100 bg-slate-50/50"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-bold text-slate-500 ml-1">
                      Email Address
                    </Label>
                    <Input
                      required
                      type="email"
                      placeholder="john@example.com"
                      className="h-12 rounded-xl border-slate-100 bg-slate-50/50"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-bold text-slate-500 ml-1">
                    Subject
                  </Label>
                  <Input
                    required
                    placeholder="How can we help?"
                    className="h-12 rounded-xl border-slate-100 bg-slate-50/50"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-bold text-slate-500 ml-1">
                    Message
                  </Label>
                  <Textarea
                    required
                    placeholder="Tell us more about your inquiry..."
                    rows={6}
                    className="rounded-xl border-slate-100 bg-slate-50/50"
                  />
                </div>
                <Button
                  disabled={status === "sending"}
                  className="w-full h-14 rounded-2xl bg-indigo-600 hover:bg-indigo-700 font-bold text-lg shadow-xl shadow-indigo-100 transition-all"
                >
                  {status === "sending" ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    "Send Message"
                  )}
                </Button>
                {status === "success" && (
                  <p className="text-center text-emerald-600 font-bold animate-in fade-in slide-in-from-top-2">
                    ✓ Message sent successfully!
                  </p>
                )}
              </form>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}

function ContactInfoItem({ icon: Icon, title, detail }) {
  return (
    <div className="flex gap-6 items-start">
      <div className="h-14 w-14 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0 border border-indigo-100 shadow-sm">
        <Icon className="h-6 w-6" />
      </div>
      <div>
        <h4 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-1">
          {title}
        </h4>
        <p className="text-xl font-bold text-slate-900">{detail}</p>
      </div>
    </div>
  );
}

function SocialBtn({ icon: Icon }) {
  return (
    <button className="h-12 w-12 rounded-xl bg-slate-100 text-slate-600 flex items-center justify-center hover:bg-indigo-600 hover:text-white hover:shadow-lg hover:shadow-indigo-200 transition-all">
      <Icon className="h-5 w-5" />
    </button>
  );
}

// ============ PRIVACY POLICY ============
function PrivacyPage() {
  return (
    <div className="min-h-screen bg-slate-50 py-20">
      <div className="container mx-auto px-4 sm:px-6 max-w-4xl">
        <Card className="border-none shadow-2xl shadow-slate-200/50 rounded-[2.5rem] overflow-hidden bg-white p-12 lg:p-20">
          <Badge className="mb-6 bg-indigo-50 text-indigo-600 border-indigo-100 hover:bg-indigo-50 px-4 py-1.5 rounded-full font-bold uppercase tracking-widest text-xs">
            Security First
          </Badge>
          <h1 className="text-4xl lg:text-5xl font-black text-slate-900 mb-10 leading-tight">
            Privacy <span className="text-indigo-600">Policy</span>
          </h1>

          <div className="space-y-10 text-slate-600 leading-relaxed">
            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">
                1. Data Collection
              </h2>
              <p>
                At RCM Job, we collect information that you provide directly to
                us when creating an account, including your name, email, phone
                number, and professional certifications. We also collect usage
                data to improve our services.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">
                2. Use of Information
              </h2>
              <p>
                Your information is used to connect you with relevant job
                opportunities, personalize your experience in RCM Academy, and
                ensure a secure environment for all users. We never sell your
                personal data to third parties.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">
                3. Data Protection
              </h2>
              <p>
                We implement industry-standard security measures to protect your
                information, including encryption for sensitive data and secure
                server environments. Your trust is our priority.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">
                4. Your Rights
              </h2>
              <p>
                You have the right to access, update, or delete your personal
                information at any time through your profile settings or by
                contacting our support team at support@rcmjob.com.
              </p>
            </section>

            <div className="pt-10 border-t border-slate-100 text-sm text-slate-400 italic">
              Last updated: May 2026
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

// ============ TERMS OF SERVICE ============
function TermsPage() {
  return (
    <div className="min-h-screen bg-slate-50 py-20">
      <div className="container mx-auto px-4 sm:px-6 max-w-4xl">
        <Card className="border-none shadow-2xl shadow-slate-200/50 rounded-[2.5rem] overflow-hidden bg-white p-12 lg:p-20">
          <Badge className="mb-6 bg-emerald-50 text-emerald-600 border-emerald-100 hover:bg-emerald-50 px-4 py-1.5 rounded-full font-bold uppercase tracking-widest text-xs">
            Legal Agreement
          </Badge>
          <h1 className="text-4xl lg:text-5xl font-black text-slate-900 mb-10 leading-tight">
            Terms of <span className="text-indigo-600">Service</span>
          </h1>

          <div className="space-y-10 text-slate-600 leading-relaxed">
            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">
                1. Acceptance of Terms
              </h2>
              <p>
                By accessing and using RCM Job, you agree to comply with and be
                bound by these Terms of Service. If you do not agree to these
                terms, please do not use the platform.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">
                2. User Responsibilities
              </h2>
              <p>
                Users are responsible for maintaining the confidentiality of
                their account credentials and for all activities that occur
                under their account. You agree to provide accurate and truthful
                information.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">
                3. Prohibited Conduct
              </h2>
              <p>
                Users may not use the platform for any illegal purposes or to
                distribute fraudulent job postings or profiles. We reserve the
                right to suspend accounts that violate these guidelines.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">
                4. Intellectual Property
              </h2>
              <p>
                All content on the RCM Job platform, including the logo, design,
                and software, is the property of RCM Job and is protected by
                international copyright laws.
              </p>
            </section>

            <div className="pt-10 border-t border-slate-100 text-sm text-slate-400 italic">
              Last updated: May 2026
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

// ============ COMPANIES LIST ============
function CompaniesList({ setView, setSelectedCompany }) {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    api("/companies")
      .then((d) => {
        setCompanies(d.companies || []);
      })
      .catch((e) => toast.error(e.message))
      .finally(() => setLoading(false));
  }, []);

  const filtered = companies.filter(
    (c) =>
      c.name?.toLowerCase().includes(search.toLowerCase()) ||
      c.description?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="bg-[#F8F9FE] min-h-screen pb-20">
      {/* Hero Header */}
      <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 pt-12 sm:pt-20 lg:pt-32 pb-28 sm:pb-36 lg:pb-44 relative overflow-hidden">
        {/* Decorative Background Elements */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-indigo-500/20 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 w-96 h-96 bg-blue-500/15 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 w-[600px] h-[600px] bg-purple-500/5 rounded-full blur-[120px] pointer-events-none -translate-x-1/2 -translate-y-1/2" />

        {/* Subtle grid */}
        <div
          className="absolute inset-0 opacity-[0.05] pointer-events-none"
          style={{
            backgroundImage: "linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)",
            backgroundSize: "50px 50px"
          }}
        />

        {/* Animated particles */}
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-indigo-400 rounded-full animate-pulse" />
        <div className="absolute top-1/2 right-1/3 w-3 h-3 bg-blue-400 rounded-full animate-pulse delay-700" />
        <div className="absolute bottom-1/4 left-1/2 w-2 h-2 bg-pink-400 rounded-full animate-pulse delay-500" />

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="container mx-auto px-4 sm:px-6 text-center relative z-10"
        >
          <Badge className="bg-white/10 text-indigo-300 border-white/10 mb-6 px-4 py-1.5 rounded-full backdrop-blur-md uppercase tracking-widest text-[10px] font-bold">
            <Building2 className="h-3 w-3 mr-2" /> Connect with Industry Leaders
          </Badge>
          <h1 className="text-3xl sm:text-5xl lg:text-7xl font-bold text-white mb-6 tracking-tight leading-tight sm:leading-[1.05]">
            Top <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-blue-400 to-cyan-400">Companies</span>
          </h1>
          <p className="text-slate-400 font-semibold max-w-2xl mx-auto text-sm sm:text-base lg:text-lg leading-relaxed">
            Discover verified companies and explore high-growth opportunities across the RCM ecosystem.
          </p>

          {/* Stats strip */}
          <div className="hidden md:flex items-center justify-center gap-10 mt-12">
            <div className="flex items-center gap-2 text-white/80 text-sm font-medium">
              <CheckCircle className="h-4 w-4 text-emerald-400" />
              <span>500+ Companies</span>
            </div>
            <div className="h-4 w-px bg-white/20" />
            <div className="flex items-center gap-2 text-white/80 text-sm font-medium">
              <ShieldCheck className="h-4 w-4 text-blue-400" />
              <span>100% Verified</span>
            </div>
            <div className="h-4 w-px bg-white/20" />
            <div className="flex items-center gap-2 text-white/80 text-sm font-medium">
              <Briefcase className="h-4 w-4 text-pink-400" />
              <span>5,000+ Open Roles</span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Floating Search Bar */}
      <div className="container mx-auto px-4 sm:px-6 max-w-4xl -mt-16 relative z-20">
        <div className="bg-white rounded-3xl p-4 shadow-2xl shadow-indigo-900/10 flex flex-col sm:flex-row items-center border border-slate-100 gap-4 sm:gap-0">
          <div className="flex-1 flex items-center gap-4 px-6 py-3 sm:border-r border-slate-100 w-full">
            <Search className="h-5 w-5 text-indigo-600" />
            <div className="flex-1">
              <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">
                Company Search
              </div>
              <Input
                placeholder="Search by company name or industry..."
                className="border-0 shadow-none p-0 h-auto rounded-none focus-visible:ring-0 text-slate-900 font-bold text-base placeholder:text-slate-300 w-full"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
          <Button className="w-full sm:w-auto rounded-2xl px-10 h-16 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white font-bold transition-all shadow-xl shadow-indigo-600/20 text-base">
            Search
          </Button>
        </div>
      </div>

      <section className="container mx-auto px-4 sm:px-6 py-16 max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="flex flex-col md:flex-row justify-between items-center mb-12 gap-6 bg-white p-6 rounded-3xl border border-slate-100 shadow-sm shadow-indigo-100/30"
        >
          <div className="flex items-center gap-3 text-slate-500 font-semibold">
            <div className="h-10 w-10 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center">
              <Building2 className="h-5 w-5 text-indigo-600" />
            </div>
            <div>
              <div className="text-xs uppercase tracking-widest text-slate-400 font-bold mb-0.5">Results</div>
              <div>
                Showing <span className="text-indigo-600 px-2 py-0.5 bg-indigo-50 rounded-lg font-bold">{filtered.length}</span> companies
              </div>
            </div>
          </div>
        </motion.div>

        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="h-10 w-10 animate-spin text-indigo-600" />
          </div>
        ) : filtered.length === 0 ? (
          <EmptyState
            icon={Building2}
            title="No companies match your search"
            subtitle="Try adjusting your query."
          />
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filtered.map((company, idx) => (
              <motion.div
                key={company.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.4, delay: (idx % 6) * 0.06 }}
                whileHover={{ y: -8 }}
                onClick={() => {
                  setSelectedCompany(company);
                  setView("companyDetails");
                }}
                className="bg-white border border-slate-100 rounded-3xl p-8 shadow-xl shadow-slate-100/30 hover:border-indigo-200 hover:shadow-2xl hover:shadow-indigo-200/20 transition-all duration-500 group flex flex-col cursor-pointer relative overflow-hidden"
              >
                {/* Decorative gradient blob */}
                <div className="absolute -top-10 -right-10 w-40 h-40 bg-indigo-500/0 group-hover:bg-indigo-500/10 rounded-full blur-2xl transition-all duration-500 pointer-events-none" />

                <div className="relative z-10 flex items-start justify-between mb-8">
                  <div className="relative">
                    <div className="absolute -inset-1 bg-gradient-to-br from-indigo-500/0 to-blue-500/0 group-hover:from-indigo-500/40 group-hover:to-blue-500/40 rounded-2xl blur opacity-0 group-hover:opacity-100 transition-all duration-500" />
                    <div className="relative h-16 w-16 rounded-2xl bg-gradient-to-br from-slate-50 to-white border border-slate-100 shadow-sm flex items-center justify-center p-3 group-hover:scale-105 transition duration-500">
                      {company.logo || company.image ? (
                        <img
                          src={company.logo || company.image}
                          alt={company.name}
                          className="w-full h-full object-contain"
                        />
                      ) : (
                        <div className="font-bold text-2xl text-indigo-600">
                          {(company.name || "C").charAt(0)}
                        </div>
                      )}
                    </div>
                  </div>
                  {company.jobs && company.jobs.length > 0 && (
                    <Badge
                      className="bg-emerald-50 text-emerald-700 border border-emerald-100 px-3 py-1 text-[10px] uppercase font-bold rounded-full flex items-center gap-1"
                    >
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      {company.jobs.length} Open
                    </Badge>
                  )}
                </div>

                <div className="relative z-10 flex items-center gap-2 mb-3">
                  <h3 className="text-xl font-bold text-slate-900 group-hover:text-indigo-600 transition truncate">
                    {company.name}
                  </h3>
                  <ShieldCheck className="h-4 w-4 text-emerald-500 flex-shrink-0" />
                </div>
                <p className="text-slate-500 text-sm font-medium leading-relaxed mb-8 line-clamp-3 flex-1 relative z-10">
                  {company.description || "Discover career growth and excellence with one of the industry's leading organizations."}
                </p>

                <Button
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedCompany(company);
                    setView("companyDetails");
                  }}
                  className="relative z-10 w-full rounded-xl h-12 bg-slate-50 hover:bg-gradient-to-r hover:from-indigo-600 hover:to-blue-600 hover:text-white text-slate-700 border border-slate-100 hover:border-transparent transition-all font-bold group/btn shadow-sm"
                >
                  View Company Profile <ArrowRight className="h-4 w-4 ml-2 group-hover/btn:translate-x-1 transition-transform" />
                </Button>
              </motion.div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

// ============ COMPANY DETAILS ============
function CompanyDetails({ company, setView, setSelectedJobId }) {
  if (!company)
    return <EmptyState icon={Building2} title="Company not found" />;

  return (
    <div className="bg-[#F8F9FE] min-h-screen pb-20">
      {/* Hero Header */}
      <div className="relative pt-24 pb-28 overflow-hidden">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&q=80&w=2000"
            alt="Corporate Office"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-900/95 to-indigo-950/90" />
        </div>

        {/* Decorative Elements */}
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-indigo-500/20 rounded-full blur-[100px] pointer-events-none translate-x-1/3 -translate-y-1/3" />
        <div className="absolute -bottom-20 left-1/3 w-[350px] h-[350px] bg-blue-500/10 rounded-full blur-[100px] pointer-events-none" />

        {/* Subtle grid */}
        <div
          className="absolute inset-0 opacity-[0.04] pointer-events-none z-0"
          style={{
            backgroundImage: "linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)",
            backgroundSize: "40px 40px"
          }}
        />

        <div className="container mx-auto px-4 sm:px-6 max-w-7xl relative z-10">
          <Button
            variant="ghost"
            onClick={() => setView("companies_view")}
            className="mb-8 h-9 text-white/70 hover:bg-white/10 hover:text-white border border-white/10 rounded-xl px-4 text-xs transition backdrop-blur-sm group"
          >
            <ArrowLeft className="w-3.5 h-3.5 mr-2 group-hover:-translate-x-1 transition-transform" /> Back to companies
          </Button>

          <div className="flex flex-col md:flex-row items-center md:items-end gap-6">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="relative group"
            >
              <div className="absolute -inset-2 bg-gradient-to-tr from-indigo-500 to-blue-500 rounded-2xl blur-lg opacity-40 group-hover:opacity-60 transition duration-500" />
              <div className="h-20 w-20 rounded-2xl bg-white flex items-center justify-center p-3 shadow-xl relative z-10 border-4 border-white/20">
                {company.logo || company.image ? (
                  <img
                    src={company.logo || company.image}
                    alt={company.name}
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <div className="font-bold text-3xl text-indigo-600">
                    {(company.name || "C").charAt(0)}
                  </div>
                )}
              </div>
              <div className="absolute -bottom-1.5 -right-1.5 bg-emerald-500 text-white p-1.5 rounded-full shadow-lg border-2 border-slate-900 z-20">
                <ShieldCheck className="h-3 w-3" />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="flex-1 text-center md:text-left pb-1"
            >
              <div className="flex flex-wrap justify-center md:justify-start gap-2 mb-3">
                <Badge className="bg-indigo-500/20 text-indigo-300 border-indigo-500/30 rounded-full px-3 py-0.5 text-[10px] backdrop-blur-md">
                  <ShieldCheck className="h-2.5 w-2.5 mr-1" /> Verified Enterprise
                </Badge>
                <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-500/30 rounded-full px-3 py-0.5 text-[10px] backdrop-blur-md">
                  <Sparkles className="h-2.5 w-2.5 mr-1" /> Trusted Partner
                </Badge>
              </div>
              <h1 className="text-2xl lg:text-4xl font-bold text-white mb-3 tracking-tight drop-shadow-sm leading-tight">
                {company.name}
              </h1>
              <div className="flex flex-wrap justify-center md:justify-start items-center gap-x-4 gap-y-2 text-slate-300 text-sm font-semibold tracking-wide">
                <span className="flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-indigo-400" /> {company.location || "Global HQ"}
                </span>
                <span className="hidden md:inline h-1 w-1 rounded-full bg-white/30" />
                <span className="flex items-center gap-1.5">
                  <Briefcase className="w-4 h-4 text-emerald-400" /> {company.jobs?.length || 0} Open Positions
                </span>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 sm:px-6 max-w-7xl -mt-12 relative z-20">
        <div className="grid md:grid-cols-3 gap-6">
          <div className="md:col-span-1 space-y-6">
            <Card className="rounded-2xl border-slate-100 shadow-xl shadow-slate-100/30 overflow-hidden bg-white group hover:border-indigo-100 transition-all duration-300">
              <div className="bg-gradient-to-r from-indigo-600 to-blue-600 p-4">
                <h2 className="text-base font-bold text-white flex items-center gap-2">
                  <Sparkles className="h-4 w-4" /> About Company
                </h2>
              </div>
              <div className="p-5">
                <div className="text-slate-600 text-sm leading-relaxed whitespace-pre-wrap font-medium">
                  {company.description ||
                    `Welcome to ${company.name || "this industry leader"}. We are dedicated to delivering excellence and innovation in the RCM sector. Our mission is to empower professionals and organizations through cutting-edge solutions and a commitment to growth and integrity.`}
                </div>

                <div className="mt-5 pt-5 border-t border-slate-100 grid grid-cols-1 gap-3">
                  <div className="flex items-center gap-2.5 text-slate-500">
                    <div className="h-7 w-7 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600 flex-shrink-0">
                      <Globe className="h-3.5 w-3.5" />
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-wider">Verified Organization</span>
                  </div>
                  <div className="flex items-center gap-2.5 text-slate-500">
                    <div className="h-7 w-7 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600 flex-shrink-0">
                      <ShieldCheck className="h-3.5 w-3.5" />
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-wider">Top Tier Talent Hub</span>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          <div className="md:col-span-2 space-y-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-1 h-6 bg-gradient-to-b from-indigo-600 to-blue-600 rounded-full" />
                <h2 className="text-lg lg:text-xl font-bold text-slate-900 tracking-tight">
                  Active Jobs at <span className="text-indigo-600">{company.name}</span>
                </h2>
              </div>
              {company.jobs && company.jobs.length > 0 && (
                <Badge className="bg-indigo-50 text-indigo-700 border border-indigo-100 px-2.5 py-0.5 text-[10px] uppercase font-bold rounded-full flex-shrink-0">
                  {company.jobs.length} Roles
                </Badge>
              )}
            </div>
            {!company.jobs || company.jobs.length === 0 ? (
              <EmptyState
                icon={Briefcase}
                title="No active jobs"
                subtitle="This company has no open positions currently."
              />
            ) : (
              <div className="grid md:grid-cols-2 gap-6">
                {company.jobs.map((job) => (
                  <JobCard
                    key={job.id}
                    job={job}
                    featuredIndex={-1}
                    onClick={() => {
                      setSelectedJobId(job.id);
                      setView("jobDetails");
                    }}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ============ DATA LIST VIEW ============
function DataListView({ type, title, setView, setSelectedJobId }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api(`/${type}`)
      .then((d) => {
        setItems(d.companies || d.items || []);
      })
      .catch(() => { })
      .finally(() => setLoading(false));
  }, [type]);

  const icons = {
    companies: Building2,
    freelance: Zap,
    academy: BookOpen,
    community: MessageSquare,
  };
  const Icon = icons[type] || Layers;

  return (
    <section className="container mx-auto px-4 sm:px-6 py-16">
      <div className="flex items-center gap-4 mb-10">
        <Button variant="ghost" onClick={() => setView("home")}>
          ← Back
        </Button>
        <h1 className="text-4xl font-bold text-slate-900">{title}</h1>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="h-10 w-10 animate-spin text-indigo-600" />
        </div>
      ) : items.length === 0 ? (
        <EmptyState
          icon={Icon}
          title={`No ${type} found`}
          subtitle="Our team is working on adding more content soon."
        />
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {items.map((item) => (
            <Card
              key={item.id}
              className="hover:shadow-xl transition-all duration-300 border-slate-100 overflow-hidden group"
            >
              <div className="h-40 bg-slate-50 relative overflow-hidden">
                {item.logo || item.image ? (
                  <img
                    src={item.logo || item.image}
                    alt={item.name || item.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-200">
                    <Icon className="h-16 w-16" />
                  </div>
                )}
                {item.badge && (
                  <Badge className="absolute top-4 right-4 bg-white/90 backdrop-blur text-indigo-600 border-0">
                    {item.badge}
                  </Badge>
                )}
              </div>
              <CardContent className="p-6">
                <h3 className="text-xl font-bold mb-2 text-slate-900">
                  {item.name || item.title}
                </h3>
                <p className="text-slate-500 text-sm mb-4 line-clamp-3">
                  {item.bio || item.description}
                </p>

                {type === "companies" && item.jobs?.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-slate-50">
                    <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">
                      Open Positions ({item.jobs.length})
                    </div>
                    <div className="space-y-2">
                      {item.jobs.slice(0, 2).map((job) => (
                        <button
                          key={job.id}
                          onClick={() => {
                            setSelectedJobId(job.id);
                            setView("jobDetails");
                          }}
                          className="w-full text-left p-2 rounded-lg hover:bg-indigo-50 text-sm font-medium text-slate-600 truncate transition"
                        >
                          {job.title}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-between mt-6">
                  <span className="text-xs font-bold text-indigo-600 uppercase tracking-widest">
                    {item.category || item.type}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    className="rounded-lg group-hover:bg-indigo-600 group-hover:text-white transition"
                  >
                    Explore Details
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </section>
  );
}

// ============ COMMUNITY HUB ============
function CommunityHub({ setView, user }) {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newPost, setNewPost] = useState("");
  const [posting, setPosting] = useState(false);

  const load = async () => {
    try {
      const d = await api("/community");
      setPosts(d.items || []);
    } catch (e) {
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    load();
  }, []);

  const handlePost = async (e) => {
    e.preventDefault();
    if (!newPost.trim()) return;
    if (!user) return setView("login");
    setPosting(true);
    try {
      await api("/community", {
        method: "POST",
        body: JSON.stringify({ description: newPost }),
      });
      setNewPost("");
      load();
      toast.success("Insights shared with the community!");
    } catch (e) {
      toast.error(e.message);
    } finally {
      setPosting(false);
    }
  };

  return (
    <div className="bg-[#F8F9FE] min-h-screen pb-20 pt-10 sm:pt-16">
      <div className="container mx-auto px-4 sm:px-6 max-w-5xl">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 sm:mb-12 gap-5 sm:gap-6">
          <div className="min-w-0">
            <Badge className="bg-indigo-50 text-indigo-600 border-none px-4 py-1.5 rounded-full mb-4 text-[10px] font-bold uppercase tracking-widest">
              Professional Network
            </Badge>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 mb-3 sm:mb-4 tracking-tight">
              Community <span className="text-indigo-600">Hub</span>
            </h1>
            <p className="text-slate-500 font-medium text-sm sm:text-base lg:text-lg">
              Connect with RCM professionals, share insights, and grow together.
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex -space-x-3 overflow-hidden p-2">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="inline-block h-10 w-10 rounded-full ring-2 ring-white bg-slate-200 flex items-center justify-center text-xs font-bold text-slate-400">
                  {String.fromCharCode(64 + i)}
                </div>
              ))}
              <div className="inline-block h-10 w-10 rounded-full ring-2 ring-white bg-indigo-600 flex items-center justify-center text-xs font-bold text-white">
                +12k
              </div>
            </div>
            <div className="text-sm font-bold text-slate-400 uppercase tracking-widest">Active Members</div>
          </div>
        </div>

        {/* Post Creation Box */}
        <Card className="mb-12 border-slate-100 shadow-2xl shadow-indigo-100/30 rounded-3xl overflow-hidden bg-white/80 backdrop-blur-md">
          <CardContent className="p-8">
            <div className="flex gap-6">
              <div className="h-14 w-14 rounded-2xl bg-indigo-50 flex items-center justify-center flex-shrink-0 text-indigo-600 border border-indigo-100 shadow-inner">
                <User className="h-7 w-7" />
              </div>
              <div className="flex-1">
                <textarea
                  value={newPost}
                  onChange={(e) => setNewPost(e.target.value)}
                  placeholder="Share an insight or ask a question..."
                  className="w-full h-32 border-0 focus:ring-0 text-slate-800 placeholder:text-slate-300 resize-none text-xl py-2 font-medium bg-transparent"
                />
                <div className="flex items-center justify-between mt-6 pt-6 border-t border-slate-50">
                  <div className="flex items-center gap-4">
                    <button className="h-10 w-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 hover:bg-indigo-50 hover:text-indigo-600 transition-all border border-slate-100">
                      <LucideImage className="h-5 w-5" />
                    </button>
                    <button className="h-10 w-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 hover:bg-indigo-50 hover:text-indigo-600 transition-all border border-slate-100">
                      <Globe className="h-5 w-5" />
                    </button>
                  </div>
                  <Button
                    onClick={handlePost}
                    disabled={posting || !newPost.trim()}
                    className="bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 h-14 px-10 rounded-2xl font-bold shadow-xl shadow-indigo-600/20 text-base"
                  >
                    {posting ? (
                      <Loader2 className="h-5 w-5 animate-spin" />
                    ) : (
                      "Share Insight"
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex flex-wrap items-center gap-4 mb-10">
          <Button
            variant="secondary"
            className="bg-indigo-600 text-white px-8 h-12 rounded-2xl font-bold shadow-lg shadow-indigo-600/20"
          >
            All Insights
          </Button>
          <Button
            variant="ghost"
            className="text-slate-500 px-8 h-12 rounded-2xl font-bold hover:bg-white transition-all"
          >
            Trending
          </Button>
          <Button
            variant="ghost"
            className="text-slate-500 px-8 h-12 rounded-2xl font-bold hover:bg-white transition-all"
          >
            My Posts
          </Button>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-32 gap-6">
            <ModernSpinner size="lg" color="indigo" />
            <p className="text-slate-400 font-bold uppercase tracking-[0.3em] text-xs animate-pulse">Syncing Community...</p>
          </div>
        ) : (
          <div className="space-y-8">
            {posts.map((post) => (
              <Card
                key={post.id}
                className="border-slate-100 hover:border-indigo-200 transition-all duration-500 rounded-3xl shadow-xl shadow-slate-100/30 bg-white group overflow-hidden"
              >
                <CardContent className="p-8">
                  <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-4">
                      <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-indigo-50 to-white border border-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-xl shadow-sm">
                        {post.userName?.charAt(0)}
                      </div>
                      <div>
                        <div className="font-bold text-slate-900 flex items-center gap-2 text-lg">
                          {post.userName}
                          {post.userRole === "EMPLOYER" && (
                            <Badge className="bg-emerald-50 text-emerald-600 border-emerald-100 text-[10px] py-1 px-3 h-auto font-bold rounded-full">
                              VERIFIED PARTNER
                            </Badge>
                          )}
                        </div>
                        <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-0.5">
                          {timeAgo(post.createdAt)} • Community Voice
                        </div>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-12 w-12 rounded-xl text-slate-200 hover:text-rose-500 hover:bg-rose-50 transition-all border border-transparent hover:border-rose-100"
                    >
                      <Heart className="h-6 w-6" />
                    </Button>
                  </div>
                  <p className="text-slate-600 leading-[1.8] text-xl mb-10 whitespace-pre-wrap font-medium">
                    {post.description}
                  </p>
                  <div className="flex flex-wrap items-center gap-8 text-sm text-slate-400 font-bold pt-8 border-t border-slate-50 uppercase tracking-widest">
                    <button className="flex items-center gap-3 hover:text-rose-500 transition-all group/stat">
                      <div className="p-2 rounded-lg bg-slate-50 group-hover/stat:bg-rose-50 transition-colors">
                        <Heart className="h-5 w-5" />
                      </div>
                      {post.likes || 0} Likes
                    </button>
                    <button className="flex items-center gap-3 hover:text-indigo-600 transition-all group/stat">
                      <div className="p-2 rounded-lg bg-slate-50 group-hover/stat:bg-indigo-50 transition-colors">
                        <MessageSquare className="h-5 w-5" />
                      </div>
                      {post.comments?.length || 0} Discussions
                    </button>
                    <button className="flex items-center gap-3 hover:text-blue-500 transition-all group/stat ml-auto">
                      <div className="p-2 rounded-lg bg-slate-50 group-hover/stat:bg-blue-50 transition-colors">
                        <Globe className="h-5 w-5" />
                      </div>
                      Share
                    </button>
                  </div>
                </CardContent>
              </Card>
            ))}
            {posts.length === 0 && (
              <EmptyState
                icon={MessageSquare}
                title="No posts yet"
                subtitle="Be the first one to start a conversation!"
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// ============ REWARDS PAGE ============
function RewardsPage({ setView, user }) {
  const [copied, setCopied] = useState(false);
  const referralCode = user
    ? `RCM-${user.id.slice(0, 8).toUpperCase()}`
    : "SIGN-UP-TO-GET-CODE";

  const copyCode = () => {
    navigator.clipboard.writeText(referralCode);
    setCopied(true);
    toast.success("Referral code copied!");
    setTimeout(() => setCopied(false), 2000);
  };

  const rewards = [
    {
      title: "Bronze",
      referrals: 5,
      reward: "Premium for 1 Month",
      color: "text-orange-600 bg-orange-50",
    },
    {
      title: "Silver",
      referrals: 15,
      reward: "Featured Profile (2 Weeks)",
      color: "text-slate-400 bg-slate-50",
    },
    {
      title: "Gold",
      referrals: 50,
      reward: "Life-time Premium Access",
      color: "text-amber-600 bg-amber-50",
    },
  ];

  return (
    <div className="bg-white min-h-screen">
      <section className="bg-indigo-600 py-12 sm:py-20 lg:py-24 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-64 h-64 bg-white rounded-full -translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full translate-x-1/2 translate-y-1/2" />
        </div>

        <div className="container mx-auto px-4 sm:px-6 relative z-10 text-center text-white">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 mb-6 sm:mb-8">
            <Sparkles className="h-4 w-4 text-amber-300" />
            <span className="text-xs sm:text-sm font-bold tracking-widest uppercase">
              Referral Program
            </span>
          </div>
          <h1 className="text-3xl sm:text-5xl lg:text-7xl font-bold mb-6 sm:mb-8 leading-tight">
            Invite your friends <br className="hidden sm:block" /> & Earn{" "}
            <span className="text-amber-300">Rewards</span>
          </h1>
          <p className="text-base sm:text-lg lg:text-xl text-white/80 max-w-2xl mx-auto mb-10 sm:mb-12 leading-relaxed">
            Help your colleagues find their dream jobs and get exclusive premium
            perks for every successful referral.
          </p>

          <div className="max-w-md mx-auto bg-white rounded-3xl p-2 flex items-center shadow-2xl">
            <div className="flex-1 px-6 text-slate-900 font-bold tracking-wider">
              {referralCode}
            </div>
            <Button
              onClick={copyCode}
              className="bg-indigo-600 hover:bg-indigo-700 rounded-2xl h-12 px-8 font-bold"
            >
              {copied ? "Copied!" : "Copy Code"}
            </Button>
          </div>
        </div>
      </section>

      <section className="py-24 container mx-auto px-4 sm:px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-slate-900 mb-4">
            How it works
          </h2>
          <p className="text-slate-500">Three simple steps to start earning</p>
        </div>

        <div className="grid md:grid-cols-3 gap-12">
          {[
            {
              step: "01",
              title: "Share Code",
              desc: "Send your unique referral code to your professional network.",
              icon: Mail,
            },
            {
              step: "02",
              title: "They Sign Up",
              desc: "When they register using your code, you both get a head start.",
              icon: User,
            },
            {
              step: "03",
              title: "Earn Rewards",
              desc: "Unlock exclusive tiers and features as your network grows.",
              icon: Gift,
            },
          ].map((item, i) => (
            <div
              key={i}
              className="relative p-8 rounded-3xl border border-slate-100 hover:border-indigo-100 transition group"
            >
              <div className="absolute -top-6 left-8 h-12 w-12 bg-indigo-600 text-white rounded-2xl flex items-center justify-center font-bold text-xl shadow-lg shadow-indigo-100">
                {item.step}
              </div>
              <div className="mt-4 mb-6 h-14 w-14 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600 group-hover:scale-110 transition">
                <item.icon className="h-7 w-7" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-3">
                {item.title}
              </h3>
              <p className="text-slate-500 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="py-24 bg-slate-50">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">
              Rewards Tiers
            </h2>
            <p className="text-slate-500">
              The more you invite, the more you win
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {rewards.map((tier, i) => (
              <Card
                key={i}
                className="p-8 border-slate-100 hover:shadow-2xl transition-all duration-500 rounded-3xl group overflow-hidden relative"
              >
                <div
                  className={`absolute top-0 right-0 w-32 h-32 opacity-10 rounded-full translate-x-12 -translate-y-12 ${tier.color.split(" ")[0]
                    }`}
                />
                <div
                  className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest mb-6 ${tier.color}`}
                >
                  {tier.title} Tier
                </div>
                <h3 className="text-3xl font-bold text-slate-900 mb-2">
                  {tier.referrals} Referrals
                </h3>
                <p className="text-slate-500 mb-8">Unlock {tier.reward}</p>
                <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden mb-8">
                  <div
                    className={`h-full ${tier.color.split(" ")[1]
                      } opacity-50 w-0 group-hover:w-full transition-all duration-1000`}
                  />
                </div>
                <Button
                  variant="outline"
                  className="w-full rounded-xl font-bold group-hover:bg-indigo-600 group-hover:text-white transition"
                >
                  View Details
                </Button>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 container mx-auto px-4 sm:px-6 text-center">
        <Card className="bg-slate-900 text-white p-12 lg:p-24 rounded-[3rem] overflow-hidden relative">
          <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl -mr-32 -mt-32" />
          <h2 className="text-4xl lg:text-6xl font-bold mb-8 relative z-10">
            Ready to boost your rewards?
          </h2>
          <p className="text-xl text-white/60 mb-12 max-w-2xl mx-auto relative z-10">
            Join thousands of professionals already earning exclusive benefits
            on RCM Job.
          </p>
          <div className="flex flex-wrap justify-center gap-4 relative z-10">
            <Button
              onClick={copyCode}
              className="bg-indigo-600 hover:bg-indigo-700 h-14 px-10 rounded-2xl font-bold text-lg"
            >
              Copy Invite Code
            </Button>
            <Button
              onClick={() => setView("home")}
              variant="outline"
              className="border-white/20 hover:bg-white/10 h-14 px-10 rounded-2xl font-bold text-lg text-white"
            >
              Back to Home
            </Button>
          </div>
        </Card>
      </section>
    </div>
  );
}

// ============ INVITE & EARN MODAL ============
function InviteEarnModal({ open, onOpenChange, user }) {
  const [copied, setCopied] = useState(false);
  const referralLink = user
    ? `http://localhost:5173/signup?ref=${user.id.slice(0, 8)}`
    : "http://localhost:5173/signup?ref=guest";

  const copyLink = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    toast.success("Referral link copied!");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[450px] p-0 rounded-3xl overflow-hidden border-none shadow-2xl">
        <div className="p-8 space-y-8">
          <div className="flex items-center justify-between">
            <h2 className="text-3xl font-bold text-slate-900">Invite & Earn</h2>
            <button
              onClick={() => onOpenChange(false)}
              className="h-8 w-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 hover:text-slate-600 transition"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="bg-indigo-50/50 rounded-2xl p-6 space-y-4">
            <h3 className="text-indigo-600 font-bold">How it works</h3>
            <div className="space-y-4">
              {[
                `Invite your friends to RCM Job`,
                `They sign up using your referral link`,
                `You both earn rewards when they get hired!`,
              ].map((text, i) => (
                <div key={i} className="flex items-center gap-4">
                  <div className="h-6 w-6 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xs font-bold shrink-0">
                    {i + 1}
                  </div>
                  <p className="text-slate-600 text-sm font-medium">{text}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <Label className="text-slate-500 font-semibold">
              Your referral link
            </Label>
            <div className="flex gap-0 border border-slate-200 rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-indigo-500/20 transition-all">
              <Input
                readOnly
                value={referralLink}
                className="border-none h-12 text-sm text-slate-600 bg-white font-medium"
              />
              <Button
                onClick={copyLink}
                className="bg-indigo-600 hover:bg-indigo-700 h-12 px-6 rounded-none font-bold"
              >
                {copied ? "Copied" : "Copy"}
              </Button>
            </div>
          </div>

          <div className="space-y-4">
            <p className="text-slate-500 text-sm font-semibold text-center">
              Share your link via:
            </p>
            <div className="flex justify-center gap-4">
              {[
                {
                  icon: MessageSquare,
                  color: "bg-emerald-50 text-emerald-600",
                  label: "WhatsApp",
                },
                {
                  icon: Facebook,
                  color: "bg-blue-50 text-blue-600",
                  label: "Facebook",
                },
                {
                  icon: Twitter,
                  color: "bg-sky-50 text-sky-600",
                  label: "Twitter",
                },
                {
                  icon: Mail,
                  color: "bg-slate-50 text-slate-600",
                  label: "Email",
                },
              ].map((social, i) => (
                <button
                  key={i}
                  className={`h-12 w-12 rounded-full flex items-center justify-center transition-all hover:scale-110 active:scale-95 ${social.color}`}
                >
                  <social.icon className="h-5 w-5" />
                </button>
              ))}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

const QUESTION_BANK = {
  "Skill Development": [
    {
      q: "What is the most professional way to handle a workplace error?",
      a: [
        "Hide it",
        "Report it immediately and suggest a fix",
        "Blame a colleague",
        "Ignore it",
      ],
      c: 1,
    },
    {
      q: "What does 'Professional Ethics' mean?",
      a: [
        "Following company rules only",
        "Doing what is right even when not watched",
        "Working long hours",
        "Dressing well",
      ],
      c: 1,
    },
    {
      q: "Why is 'Soft Skills' important in RCM?",
      a: [
        "For better communication with patients/teams",
        "For technical coding",
        "For faster typing",
        "It is not important",
      ],
      c: 0,
    },
    {
      q: "What is 'Time Management' in a professional setting?",
      a: [
        "Doing everything at once",
        "Prioritizing tasks based on urgency and importance",
        "Working as slowly as possible",
        "Working without a schedule",
      ],
      c: 1,
    },
    {
      q: "How should you prepare for a professional meeting?",
      a: [
        "Just show up",
        "Review the agenda and prepare your contributions",
        "Bring food",
        "Talk as much as possible",
      ],
      c: 1,
    },
  ],
  "Resume Building": [
    {
      q: "What should be the tone of your professional summary?",
      a: [
        "Funny and casual",
        "Results-oriented and professional",
        "Very long and detailed",
        "Boastful",
      ],
      c: 1,
    },
    {
      q: "How should you list your achievements on a resume?",
      a: [
        "Using bullet points with metrics (e.g. 20% growth)",
        "In a long paragraph",
        "List hobbies instead",
        "Mention personal life",
      ],
      c: 0,
    },
    {
      q: "What is the purpose of keywords in a resume?",
      a: [
        "To look smart",
        "To pass Applicant Tracking Systems (ATS)",
        "To fill space",
        "To confuse recruiters",
      ],
      c: 1,
    },
    {
      q: "Which font style is most professional for a resume?",
      a: [
        "Cursive/Script",
        "Clean Sans-Serif or Serif (e.g. Arial, Calibri)",
        "Comic Sans",
        "Bright colors",
      ],
      c: 1,
    },
    {
      q: "What should you do if you have a career gap?",
      a: [
        "Leave it blank and hope nobody notices",
        "Explain it briefly and focus on skills gained or courses taken",
        "Lie about the dates",
        "Write 'I was bored'",
      ],
      c: 1,
    },
  ],
  "Interview Skills": [
    {
      q: "How soon should you send a 'Thank You' email after an interview?",
      a: [
        "After a week",
        "Within 24 hours",
        "Never",
        "Immediately during the interview",
      ],
      c: 1,
    },
    {
      q: "What is professional body language in an interview?",
      a: [
        "Slouching",
        "Maintaining eye contact and sitting upright",
        "Looking at your phone",
        "Fidgeting",
      ],
      c: 1,
    },
    {
      q: "What should you do if you don't know the answer to a question?",
      a: [
        "Lie",
        "Be honest and explain how you would find the answer",
        "Stay silent",
        "Guess randomly",
      ],
      c: 1,
    },
    {
      q: "What is the 'STAR' method in behavioral interviews?",
      a: [
        "Situation, Task, Action, Result",
        "Start, Talk, Act, Repeat",
        "See, Think, Ask, Review",
        "None",
      ],
      c: 0,
    },
    {
      q: "What is an appropriate outfit for a professional job interview?",
      a: [
        "Casual jeans and a t-shirt",
        "Business professional or business casual",
        "Party wear",
        "Gym clothes",
      ],
      c: 1,
    },
  ],
  Networking: [
    {
      q: "What is the most professional way to reach out on LinkedIn?",
      a: [
        "'Give me a job'",
        "Send a personalized note explaining your interest",
        "Send 50 messages a day",
        "Like every post",
      ],
      c: 1,
    },
    {
      q: "What is the benefit of 'Informational Interviews'?",
      a: [
        "To get a job immediately",
        "To learn about the industry and build connections",
        "To get free lunch",
        "None",
      ],
      c: 1,
    },
    {
      q: "How should you maintain your professional network?",
      a: [
        "Only talk when you need a job",
        "Regularly share value and check in",
        "Spam everyone",
        "Don't maintain it",
      ],
      c: 1,
    },
    {
      q: "What is an 'Elevator Pitch' in networking?",
      a: [
        "A long story about your life",
        "A concise 30-second summary of your value",
        "A literal pitch for an elevator company",
        "A joke",
      ],
      c: 1,
    },
    {
      q: "How should you follow up after a networking event?",
      a: [
        "Wait for them to contact you",
        "Send a brief, personalized thank-you note",
        "Call them repeatedly",
        "Ignore them",
      ],
      c: 1,
    },
  ],
  "Salary Negotiation": [
    {
      q: "What is the most professional way to reject a low offer?",
      a: [
        "Get angry",
        "Thank them and explain your value/market research",
        "Stop replying",
        "Accept it and quit later",
      ],
      c: 1,
    },
    {
      q: "When should you discuss benefits (insurance, leave)?",
      a: [
        "In the first 5 minutes",
        "After the base salary is discussed",
        "Never",
        "On your first day",
      ],
      c: 1,
    },
    {
      q: "How to research professional salary standards?",
      a: [
        "Ask your friends only",
        "Use Glassdoor, LinkedIn, and Industry Reports",
        "Guess",
        "Ask for the maximum possible",
      ],
      c: 1,
    },
    {
      q: "What should you do if an employer asks for your salary history?",
      a: [
        "Get defensive",
        "Provide your current salary range and focus on the value you bring",
        "Lie and double it",
        "Refuse to answer",
      ],
      c: 1,
    },
    {
      q: "Is it professional to negotiate multiple offers?",
      a: [
        "Yes, as long as you are honest and respectful",
        "No, it is dishonest",
        "Only for high-level roles",
        "It depends on the company",
      ],
      c: 0,
    },
  ],
  "Career Growth": [
    {
      q: "What is a 'Mentor's' role in your career?",
      a: [
        "To do your work",
        "To provide guidance and share experience",
        "To pay for your courses",
        "To promote you",
      ],
      c: 1,
    },
    {
      q: "How to handle professional feedback?",
      a: [
        "Take it personally",
        "Listen, reflect, and use it to improve",
        "Defend yourself immediately",
        "Ignore it",
      ],
      c: 1,
    },
    {
      q: "What is 'Professional Development'?",
      a: [
        "Taking more holidays",
        "Continuous learning and certification",
        "Talking to colleagues",
        "None",
      ],
      c: 1,
    },
    {
      q: "What does 'Upskilling' mean?",
      a: [
        "Learning new skills to stay relevant in your field",
        "Changing your job every year",
        "Moving to a higher floor office",
        "None",
      ],
      c: 0,
    },
    {
      q: "How can you build a 'Personal Brand' at work?",
      a: [
        "By talking about yourself constantly",
        "By consistently delivering high-quality work and being reliable",
        "By dressing expensively",
        "By avoiding team projects",
      ],
      c: 1,
    },
  ],
  "Daily Challenge": [
    {
      q: "What is 'Workplace Etiquette'?",
      a: [
        "Socially acceptable behavior in an office",
        "A type of coffee",
        "Company software",
        "Overtime work",
      ],
      c: 0,
    },
    {
      q: "Why is 'Integrity' crucial in Revenue Cycle?",
      a: [
        "To get paid faster",
        "Because you handle sensitive financial/health data",
        "To impress the boss",
        "None",
      ],
      c: 1,
    },
    {
      q: "What is 'Active Listening'?",
      a: [
        "Hearing words without responding",
        "Focusing fully on the speaker and understanding their message",
        "Interrupting with your own ideas",
        "Multitasking while someone talks",
      ],
      c: 1,
    },
    {
      q: "What is the best way to handle a conflict with a coworker?",
      a: [
        "Gossip about it",
        "Talk to them privately and professionally to find a solution",
        "Report them immediately to HR without talking",
        "Ignore them forever",
      ],
      c: 1,
    },
    {
      q: "What does 'Accountability' mean in a professional context?",
      a: [
        "Blaming others for mistakes",
        "Taking responsibility for your actions and results",
        "Counting the hours you work",
        "None",
      ],
      c: 1,
    },
  ],
};

// ============ QUIZ GAME ============
function QuizGame({ category, onBack, userPoints, setUserPoints }) {
  const [questions, setQuestions] = useState([]);
  const [current, setCurrent] = useState(0);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);

  useEffect(() => {
    const pool = QUESTION_BANK[category] || QUESTION_BANK["Skill Development"];
    const shuffled = [...pool].sort(() => 0.5 - Math.random()).slice(0, 3);
    setQuestions(shuffled);
  }, [category]);

  const handleAnswer = (idx) => {
    if (idx === questions[current].c) {
      setScore((s) => s + 10);
      const newPoints = userPoints + 10;
      setUserPoints(newPoints);
      localStorage.setItem("rcm_points", newPoints.toString());
    }
    if (current < questions.length - 1) setCurrent((c) => c + 1);
    else setFinished(true);
  };

  if (questions.length === 0) return null;

  if (finished) {
    return (
      <div className="min-h-screen bg-[#0F172A]">
        <GameHeader userPoints={userPoints} onBack={onBack} title="Results" subtitle="Review your career performance." />
        <div className="flex flex-col items-center justify-center p-12 text-center space-y-8 pt-20">
          <div className="h-24 w-24 rounded-[2rem] bg-indigo-600 text-white flex items-center justify-center text-5xl shadow-2xl shadow-indigo-600/30 ring-4 ring-white/5">
            🏆
          </div>
          <div>
            <h2 className="text-4xl font-bold text-white mb-2 tracking-tight">Quiz Completed!</h2>
            <div className="text-4xl font-bold text-indigo-400">+{score} pts</div>
          </div>
          <p className="text-slate-400 text-lg font-medium">
            Great job! Your total points are now: <span className="text-white font-bold">{userPoints + score}</span>
          </p>
          <Button
            onClick={onBack}
            className="h-14 px-12 bg-white text-slate-900 hover:bg-slate-100 rounded-3xl font-bold text-lg transition-all active:scale-95 shadow-2xl"
          >
            Back to Game Hub
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0F172A]">
      <GameHeader userPoints={userPoints} onBack={onBack} title="Expert Quiz" subtitle={`Mastering ${category}`} />

      <div className="container mx-auto px-4 sm:px-6 py-12 max-w-2xl">
        <div className="mb-12">
          <div className="flex items-center justify-between mb-4">
            <Badge className="bg-indigo-500/10 text-indigo-400 border-indigo-500/20 px-4 py-1.5 rounded-full uppercase tracking-[0.2em] text-[10px] font-bold">
              Step {current + 1} of {questions.length}
            </Badge>
            <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
              {(Math.round(((current + 1) / questions.length) * 100))}% COMPLETE
            </div>
          </div>
          <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden border border-white/5 shadow-inner p-0.5">
            <div
              className="h-full bg-gradient-to-r from-indigo-600 to-purple-500 rounded-full transition-all duration-1000 ease-in-out shadow-[0_0_15px_rgba(79,70,229,0.4)]"
              style={{ width: `${((current + 1) / questions.length) * 100}%` }}
            />
          </div>
        </div>

        <Card className="p-10 rounded-[2.5rem] border-white/5 bg-slate-900/50 backdrop-blur-xl shadow-2xl mb-8 relative overflow-hidden">
          <h3 className="text-2xl font-bold text-white mb-10 leading-relaxed tracking-tight">
            {questions[current].q}
          </h3>
          <div className="grid gap-4">
            {questions[current].a.map((opt, i) => (
              <button
                key={i}
                onClick={() => handleAnswer(i)}
                className="w-full p-6 text-left bg-white/5 border border-white/5 hover:border-indigo-500 hover:bg-indigo-500/10 rounded-2xl transition-all font-bold text-slate-300 hover:text-white flex justify-between items-center group/opt active:scale-[0.98]"
              >
                <span className="text-base">{opt}</span>
                <div className="h-7 w-7 rounded-full border-2 border-white/10 group-hover/opt:border-indigo-500 transition-all flex items-center justify-center text-[10px]">
                  {String.fromCharCode(65 + i)}
                </div>
              </button>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}

// ============ STREAK RUSH ============
function StreakRush({ onBack, userPoints, setUserPoints }) {
  const [allQuestions, setAllQuestions] = useState([]);
  const [current, setCurrent] = useState(0);
  const [streak, setStreak] = useState(0);
  const [gameOver, setGameOver] = useState(false);

  useEffect(() => {
    const flat = Object.values(QUESTION_BANK)
      .flat()
      .sort(() => 0.5 - Math.random());
    setAllQuestions(flat);
  }, []);

  const handleAnswer = (idx) => {
    if (idx === allQuestions[current % allQuestions.length].c) {
      setStreak((s) => s + 1);
      setCurrent((c) => c + 1);
      const newPoints = userPoints + 5;
      setUserPoints(newPoints);
      localStorage.setItem("rcm_points", newPoints.toString());
      toast.success("Correct! +5 pts 🔥 Streak: " + (streak + 1));
    } else {
      setGameOver(true);
      toast.error("Oops! Game Over.");
    }
  };

  if (allQuestions.length === 0) return null;

  if (gameOver) {
    return (
      <div className="min-h-screen bg-[#0F172A]">
        <GameHeader userPoints={userPoints} onBack={onBack} title="Game Over" subtitle="Better luck next time!" />
        <div className="flex flex-col items-center justify-center p-12 text-center space-y-10 pt-20">
          <div className="h-30 w-30 rounded-[2.5rem] bg-rose-500 text-white flex items-center justify-center text-6xl shadow-2xl shadow-rose-500/20 ring-4 ring-white/5 animate-bounce">
            🔥
          </div>
          <div>
            <h2 className="text-4xl font-bold text-white mb-2 tracking-tight">Game Over!</h2>
            <div className="text-5xl font-black text-rose-500 drop-shadow-2xl">{streak}</div>
            <div className="text-sm font-bold text-rose-400 uppercase tracking-[0.3em] mt-2">Maximum Streak</div>
          </div>
          <p className="text-slate-400 text-lg font-medium max-w-md">
            Your merit continues to grow! Your current total points are: <span className="text-white font-bold">{userPoints}</span>
          </p>
          <Button
            onClick={onBack}
            className="h-16 px-12 bg-white text-slate-900 hover:bg-slate-100 rounded-3xl font-bold text-lg transition-all active:scale-95 shadow-2xl"
          >
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0F172A]">
      <GameHeader userPoints={userPoints} onBack={onBack} title="Streak Rush" subtitle="How long can you last?" />

      <div className="container mx-auto px-4 sm:px-6 py-20 max-w-2xl">
        <div className="mb-10 text-center">
          <div className="text-5xl font-black text-rose-500 mb-2 drop-shadow-lg animate-pulse">{streak}</div>
          <div className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.3em]">Current Streak</div>
        </div>

        <Card className="p-10 rounded-[2.5rem] border-white/5 bg-slate-900/50 backdrop-blur-xl shadow-2xl mb-8 relative overflow-hidden">
          <h3 className="text-2xl font-bold text-white mb-10 leading-relaxed tracking-tight">
            {allQuestions[current % allQuestions.length].q}
          </h3>
          <div className="grid gap-4">
            {allQuestions[current % allQuestions.length].a.map((opt, i) => (
              <button
                key={i}
                onClick={() => handleAnswer(i)}
                className="w-full p-6 text-left bg-white/5 border border-white/5 hover:border-rose-500 hover:bg-rose-500/10 rounded-2xl transition-all font-bold text-slate-300 hover:text-white flex justify-between items-center group/opt active:scale-[0.98]"
              >
                <span className="text-base">{opt}</span>
                <div className="h-7 w-7 rounded-full border-2 border-white/10 group-hover/opt:border-rose-500 transition-all flex items-center justify-center text-[10px]">
                  {String.fromCharCode(65 + i)}
                </div>
              </button>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}

// ============ GAME HUB ============
function GameHub({ onBack, setView, userPoints, setUserPoints }) {
  const [activeTab, setActiveTab] = useState("hub");
  const [selectedCategory, setSelectedCategory] = useState("");

  if (activeTab === "spin")
    return (
      <SpinWheel
        userPoints={userPoints}
        onBack={() => setActiveTab("hub")}
        onSelected={(cat) => {
          setSelectedCategory(cat);
          setActiveTab("quiz");
        }}
      />
    );
  if (activeTab === "quiz")
    return (
      <QuizGame
        category={selectedCategory}
        onBack={() => setActiveTab("hub")}
        userPoints={userPoints}
        setUserPoints={setUserPoints}
      />
    );
  if (activeTab === "streak")
    return (
      <StreakRush
        onBack={() => setActiveTab("hub")}
        userPoints={userPoints}
        setUserPoints={setUserPoints}
      />
    );

  return (
    <div className="bg-[#0F172A] min-h-screen overflow-hidden">
      <GameHeader userPoints={userPoints} onBack={onBack} title="RCM Game Hub" subtitle="Spin to unlock new career challenges." />

      <div className="container mx-auto px-4 sm:px-6 py-24 text-center">
        <Badge className="bg-indigo-500/10 text-indigo-400 border-indigo-500/20 mb-6 px-4 py-1.5 rounded-full uppercase tracking-[0.2em] text-[10px] font-bold">
          Available Game Modes
        </Badge>
        <p className="text-slate-400 mb-20 text-lg font-medium max-w-2xl mx-auto">
          Engage in interactive challenges designed to sharpen your professional expertise while earning exclusive rewards.
        </p>

        <div className="grid md:grid-cols-3 gap-10 max-w-6xl mx-auto">
          {[
            {
              title: "Spin & Learn",
              desc: "Spin the wheel to unlock random career categories and test your rapid-fire knowledge.",
              icon: "🎡",
              tag: "POPULAR",
              tagCol: "text-purple-400 bg-purple-500/10",
              onClick: () => setActiveTab("spin"),
            },
            {
              title: "Daily Quest",
              desc: "Master one high-impact question every 24 hours to maintain your professional streak.",
              icon: "🎯",
              tag: "DAILY",
              tagCol: "text-pink-400 bg-pink-500/10",
              onClick: () => {
                setSelectedCategory("Daily Challenge");
                setActiveTab("quiz");
              },
            },
            {
              title: "Streak Rush",
              desc: "Answer continuously under pressure. How long can you maintain your expertise?",
              icon: "🔥",
              tag: "INTENSE",
              tagCol: "text-orange-400 bg-orange-500/10",
              onClick: () => setActiveTab("streak"),
            },
          ].map((mode, i) => (
            <Card
              key={i}
              className="p-10 rounded-[2.5rem] border-white/5 bg-slate-900/50 backdrop-blur-md shadow-2xl hover:shadow-indigo-500/10 hover:-translate-y-3 transition-all cursor-pointer group text-left relative overflow-hidden"
              onClick={mode.onClick}
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full translate-x-12 -translate-y-12 group-hover:scale-150 transition-transform duration-700" />
              <div className="flex justify-between items-start mb-8 relative z-10">
                <div className="text-5xl group-hover:scale-110 transition-transform duration-500">{mode.icon}</div>
                <div
                  className={`text-[10px] font-bold px-4 py-1.5 rounded-full border border-white/10 ${mode.tagCol}`}
                >
                  {mode.tag}
                </div>
              </div>
              <h3 className="text-2xl font-bold text-white mb-4 relative z-10 tracking-tight">
                {mode.title}
              </h3>
              <p className="text-slate-400 text-sm mb-10 leading-relaxed relative z-10 font-medium">
                {mode.desc}
              </p>
              <div
                className="flex items-center gap-3 text-sm font-bold text-indigo-400 group-hover:gap-5 transition-all duration-300 relative z-10"
              >
                <span>ENTER MODE</span> <ArrowRight className="h-4 w-4" />
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

// ============ SPIN WHEEL ============
function SpinWheel({ onBack, onSelected, userPoints }) {
  const [spinning, setSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);

  const categories = [
    {
      name: "Skill Development",
      color: "#FFAB00",
      icon: "⚡",
      desc: "Develop in-demand skills",
    },
    {
      name: "Resume Building",
      color: "#00A3FF",
      icon: "📝",
      desc: "Build professional resumes",
    },
    {
      name: "Interview Skills",
      color: "#D633E1",
      icon: "🎯",
      desc: "Master your interviews",
    },
    {
      name: "Networking",
      color: "#00C853",
      icon: "🤝",
      desc: "Build professional connections",
    },
    {
      name: "Salary Negotiation",
      color: "#FF6D00",
      icon: "💰",
      desc: "Get what you deserve",
    },
    {
      name: "Career Growth",
      color: "#304FFE",
      icon: "🚀",
      desc: "Advance your career path",
    },
  ];

  const spin = () => {
    if (spinning) return;
    setSpinning(true);
    const extra = 1800 + Math.random() * 360;
    setRotation((r) => r + extra);
    setTimeout(() => {
      setSpinning(false);
      const index = Math.floor(((rotation + extra) % 360) / 60);
      const cat = categories[5 - index].name;
      toast.success(`${cat} Selected! Loading questions...`);
      setTimeout(() => onSelected(cat), 1000);
    }, 4000);
  };

  return (
    <div className="bg-[#0F172A] min-h-screen">
      <GameHeader userPoints={userPoints} onBack={onBack} title="Game Hub" subtitle="Spin to unlock new career challenges." />
      <div className="py-20 flex flex-col items-center relative overflow-hidden">
        {/* Decorative Gradients */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[600px] bg-gradient-to-b from-indigo-500/10 to-transparent pointer-events-none" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-purple-500/10 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-blue-500/10 rounded-full blur-[100px] pointer-events-none" />

        <div className="relative z-10 text-center px-6">
          <Badge className="bg-white/10 text-indigo-300 border-white/10 mb-6 px-4 py-1.5 rounded-full backdrop-blur-md uppercase tracking-[0.2em] text-[10px] font-bold">
            Daily Fortune Wheel
          </Badge>
          <h1 className="text-5xl lg:text-5xl font-bold text-white mb-6 tracking-tight drop-shadow-2xl">
            Spin <span className="text-indigo-400">&</span> Learn
          </h1>
          <p className="text-slate-400 mb-12 text-lg font-medium max-w-2xl mx-auto leading-relaxed">
            Unlock your potential. Spin the wheel to select a category and earn merit points to boost your professional profile.
          </p>


        </div>

        <div className="relative mb-32 scale-90 lg:scale-100 z-20">
          {/* Pointer with Glow */}
          <div className="absolute -top-10 left-1/2 -translate-x-1/2 z-40 drop-shadow-[0_0_20px_rgba(255,0,0,0.5)]">
            <div className="w-0 h-0 border-l-[22px] border-l-transparent border-r-[22px] border-r-transparent border-t-[36px] border-t-red-500 rounded-sm" />
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -mt-1.5 h-4 w-4 bg-amber-400 rounded-full border-4 border-slate-900 shadow-xl" />
          </div>

          {/* Outer Ring Glow */}
          <div className="absolute inset-0 rounded-full bg-indigo-500/20 blur-[60px] animate-pulse" />

          {/* The Wheel */}
          <div className="relative p-6 rounded-full bg-slate-900 shadow-[0_30px_100px_rgba(0,0,0,0.6)] border-[12px] border-slate-800 ring-4 ring-white/5">
            <div
              className="w-96 h-96 rounded-full relative overflow-hidden transition-transform duration-[4000ms] cubic-bezier(0.1, 0, 0, 1) border-4 border-white/10"
              style={{ transform: `rotate(${rotation}deg)` }}
            >
              {categories.map((cat, i) => (
                <div
                  key={i}
                  className="absolute top-0 left-0 w-full h-full origin-center"
                  style={{
                    transform: `rotate(${i * 60}deg)`,
                    clipPath: "polygon(50% 50%, 50% 0%, 100% 0%, 100% 50%)",
                  }}
                >
                  <div
                    className="w-full h-full flex flex-col items-center pt-16 border-l border-white/10"
                    style={{ backgroundColor: cat.color }}
                  >
                  </div>
                </div>
              ))}
              {/* Overlay Gradient for depth */}
              <div className="absolute inset-0 bg-gradient-to-tr from-black/20 via-transparent to-white/10 pointer-events-none" />
            </div>

            {/* Spin Center Button */}
            <div className="absolute inset-0 m-auto w-32 h-32 rounded-full bg-slate-900 border-[8px] border-slate-800 shadow-[0_0_50px_rgba(0,0,0,0.5)] flex items-center justify-center z-30 overflow-hidden group">
              <button
                onClick={spin}
                disabled={spinning}
                className="w-full h-full bg-gradient-to-br from-indigo-500 via-purple-600 to-pink-500 text-white text-base font-bold tracking-[0.2em] uppercase hover:scale-105 active:scale-95 transition-all flex items-center justify-center shadow-inner relative"
              >
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
                {spinning ? (
                  <div className="flex flex-col items-center gap-3">
                    <ModernSpinner size="sm" color="white" />
                    <span className="text-[10px] font-black tracking-widest">SPINNING</span>
                  </div>
                ) : (
                  <div className="flex flex-col items-center">
                    <span className="text-[10px] opacity-70 mb-1">Press</span>
                    <span className="text-xl">SPIN</span>
                  </div>
                )}
              </button>
              <div className="absolute inset-0 bg-white/5 pointer-events-none" />
            </div>
          </div>
        </div>
      </div>

      {/* Category Legend - Enhanced Design */}
      <div className="container mx-auto px-4 sm:px-6 pb-32 max-w-6xl">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((cat, i) => (
            <div
              key={i}
              className="group relative p-8 rounded-[2.5rem] bg-slate-900/40 backdrop-blur-xl border border-white/5 hover:border-white/10 transition-all duration-500 hover:-translate-y-2 overflow-hidden"
            >
              <div
                className="absolute top-0 left-0 w-full h-1"
                style={{ backgroundColor: cat.color }}
              />
              <div className="flex items-start gap-6 relative z-10">
                <div className="h-14 w-14 rounded-2xl bg-white/5 flex items-center justify-center text-3xl group-hover:scale-110 transition duration-500 border border-white/10 shadow-inner">
                  {cat.icon}
                </div>
                <div className="flex-1">
                  <h4 className="text-xl font-bold text-white mb-2 tracking-tight group-hover:text-indigo-400 transition-colors">
                    {cat.name}
                  </h4>
                  <p className="text-slate-400 text-sm font-medium leading-relaxed">
                    {cat.desc || "Master key concepts and earn bonus points."}
                  </p>
                </div>
              </div>
              <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-white/5 rounded-full blur-3xl group-hover:bg-indigo-500/10 transition-all duration-700" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;
