import { Toaster } from 'sonner';
import './globals.css';
import Footer from '@/components/Footer';

export const metadata = {
  title: 'CareerConnect — Find Your Next Opportunity',
  description: 'A modern job portal connecting candidates with top employers.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <script src="https://checkout.razorpay.com/v1/checkout.js" async></script>
      </head>
      <body className="antialiased selection:bg-indigo-100 selection:text-indigo-900 overflow-x-hidden">

          <div className="flex flex-col min-h-screen overflow-x-hidden">

            <main className="flex-grow overflow-x-hidden">
              {children}
            </main>

          </div>
          <Toaster position="top-right" richColors closeButton />

      </body>
    </html>
  );
}
