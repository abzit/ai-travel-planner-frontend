import './globals.css';
import Navbar from '@/components/Navbar';
import 'leaflet/dist/leaflet.css';

export const metadata = {
  title: 'AI Travel Planner',
  description: 'Plan your next adventure with Generative AI',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-slate-50 min-h-screen font-sans text-slate-800 antialiased">
        <Navbar />
        <main className="pt-16">
          {children}
        </main>
      </body>
    </html>
  );
}
