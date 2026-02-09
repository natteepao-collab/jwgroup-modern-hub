import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HelmetProvider } from 'react-helmet-async';
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { I18nextProvider } from 'react-i18next';
import i18n from './i18n/config';
import { AuthProvider } from './contexts/AuthContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import FloatingActions from './components/FloatingActions';
import Snowfall from './components/Snowfall';
import ChristmasTheme from './components/ChristmasTheme';
import { CookieConsentProvider } from './components/CookieConsent';
import PageTransition from './components/PageTransition';
import Index from "./pages/Index";
import About from "./pages/About";
import Business from "./pages/Business";
import News from "./pages/News";
import NewsDetail from "./pages/NewsDetail";
import Careers from "./pages/Careers";
import Contact from "./pages/Contact";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";
import PDPA from "./pages/PDPA";
import VisionMission from "./pages/VisionMission";
import Auth from "./pages/Auth";
import Admin from "./pages/Admin";
import NotFound from "./pages/NotFound";
import Awards from "./pages/Awards";
import PremiumAnalysis from "./pages/PremiumAnalysis";
import Sustainability from "./pages/Sustainability";

const queryClient = new QueryClient();

// Layout wrapper to conditionally show Navbar/Footer
const Layout = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  const isAdminRoute = location.pathname === '/admin' || location.pathname === '/auth';

  return (
    <div className="flex flex-col min-h-screen">
      <Snowfall />
      <ChristmasTheme />
      {!isAdminRoute && <Navbar />}
      <main className="flex-grow">
        {children}
      </main>
      {!isAdminRoute && <Footer />}
      {!isAdminRoute && <FloatingActions />}
    </div>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <I18nextProvider i18n={i18n}>
      <AuthProvider>
        <HelmetProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
              <CookieConsentProvider>
                <Layout>
                  <PageTransition>
                    <Routes>
                      <Route path="/" element={<Index />} />
                      <Route path="/about/*" element={<About />} />
                      <Route path="/about/awards" element={<Awards />} />
                      <Route path="/business" element={<Business />} />
                      <Route path="/awards" element={<Awards />} />
                      <Route path="/premium-search" element={<PremiumAnalysis />} />
                      <Route path="/news" element={<News />} />
                      <Route path="/news/:id" element={<NewsDetail />} />
                      <Route path="/careers" element={<Careers />} />
                      <Route path="/contact" element={<Contact />} />
                      <Route path="/privacy" element={<Privacy />} />
                      <Route path="/terms" element={<Terms />} />
                      <Route path="/pdpa" element={<PDPA />} />
                      <Route path="/sustainability" element={<Sustainability />} />
                      <Route path="/vision-mission" element={<VisionMission />} />
                      <Route path="/auth" element={<Auth />} />
                      <Route path="/admin" element={<Admin />} />
                      {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                      <Route path="*" element={<NotFound />} />
                    </Routes>
                  </PageTransition>
                </Layout>
              </CookieConsentProvider>
            </BrowserRouter>
          </TooltipProvider>
        </HelmetProvider>
      </AuthProvider>
    </I18nextProvider>
  </QueryClientProvider>
);

export default App;
