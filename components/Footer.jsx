import { Mail, Phone, MapPin, Facebook, Twitter, Linkedin, Instagram } from 'lucide-react';

export default function Footer({ setView }) {
  return (
    <footer className="bg-slate-900 pt-12 sm:pt-20 pb-10">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-10 sm:gap-12 mb-12 sm:mb-16">
          {/* Logo & Description */}
          <div className="space-y-6 lg:col-span-1">
            <button onClick={() => setView?.('home')} className="flex items-center gap-3 group">
              <img src="/assests/favicon.svg" alt="RCM Job Logo" className="h-10 w-10 group-hover:scale-110 transition duration-300" />
              <span className="text-2xl font-black text-white tracking-tight">RCM<span className="text-indigo-400">JOB</span></span>
            </button>
            <p className="text-slate-400 font-medium leading-relaxed">
              The world's first specialized ecosystem for Healthcare Revenue Cycle Management professionals.
            </p>
            <div className="flex gap-4">
              <SocialLink href="#" icon={Facebook} />
              <SocialLink href="#" icon={Twitter} />
              <SocialLink href="#" icon={Linkedin} />
              <SocialLink href="#" icon={Instagram} />
            </div>
          </div>

          {/* Platform */}
          <div>
            <h4 className="text-white font-bold text-lg mb-6 tracking-tight">Platform</h4>
            <ul className="space-y-4">
              <li><FooterBtn onClick={() => setView?.('jobs')}>Browse Jobs</FooterBtn></li>
              <li><FooterBtn onClick={() => setView?.('resume-builder')}>Resume Builder</FooterBtn></li>
              <li><FooterBtn onClick={() => setView?.('register')}>Post a Job</FooterBtn></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-white font-bold text-lg mb-6 tracking-tight">Company</h4>
            <ul className="space-y-4">
              <li><FooterBtn onClick={() => setView?.('about')}>About Us</FooterBtn></li>
              <li><FooterBtn onClick={() => setView?.('contact')}>Contact Us</FooterBtn></li>
              <li><FooterBtn onClick={() => setView?.('privacy')}>Privacy Policy</FooterBtn></li>
              <li><FooterBtn onClick={() => setView?.('terms')}>Terms of Service</FooterBtn></li>
            </ul>
          </div>

          {/* Contact & Support */}
          <div>
            <h4 className="text-white font-bold text-lg mb-6 tracking-tight">Contact Us</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 text-slate-400">
                <MapPin className="h-5 w-5 text-indigo-400 shrink-0 mt-0.5" />
                <span className="text-sm font-medium">Sector 62, Noida, UP, India</span>
              </li>
              <li className="flex items-center gap-3 text-slate-400">
                <Phone className="h-5 w-5 text-indigo-400 shrink-0" />
                <span className="text-sm font-medium">+91 (120) 456-7890</span>
              </li>
              <li className="flex items-center gap-3 text-slate-400">
                <Mail className="h-5 w-5 text-indigo-400 shrink-0" />
                <span className="text-sm font-medium">support@rcmjob.com</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 sm:pt-10 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4 sm:gap-6 text-center md:text-left">
          <p className="text-slate-500 text-sm font-medium tracking-wide">
            © {new Date().getFullYear()} RCMJOB. All rights reserved.
          </p>
          <div className="flex gap-6 text-slate-500 text-sm">
            <button onClick={() => setView?.('privacy')} className="hover:text-white transition">Privacy</button>
            <button onClick={() => setView?.('terms')} className="hover:text-white transition">Terms</button>
            <button onClick={() => setView?.('contact')} className="hover:text-white transition">Support</button>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterBtn({ onClick, children }) {
  return (
    <button
      onClick={onClick}
      className="text-slate-400 font-medium hover:text-white transition hover:translate-x-1 inline-block text-sm"
    >
      {children}
    </button>
  );
}

function SocialLink({ href, icon: Icon }) {
  return (
    <a
      href={href}
      className="h-10 w-10 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-400 hover:bg-indigo-600 hover:text-white hover:border-indigo-600 transition-all duration-300"
    >
      <Icon className="h-5 w-5" />
    </a>
  );
}
