import { Toaster } from 'sonner';
import './globals.css';

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
      <body>
        {children}
        <Toaster position="top-right" richColors />
      </body>
    </html>
  );
}
