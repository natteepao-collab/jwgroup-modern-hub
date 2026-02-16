import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { LazyMotion, domAnimation } from "framer-motion";
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
import { lazy, Suspense } from 'react';
import Loading from "./components/Loading";

const Index = lazy(() => import("./pages/Index"));
const About = lazy(() => import("./pages/About"));
const Business = lazy(() => import("./pages/Business"));
const News = lazy(() => import("./pages/News"));
const NewsDetail = lazy(() => import("./pages/NewsDetail"));
const Careers = lazy(() => import("./pages/Careers"));
const Contact = lazy(() => import("./pages/Contact"));
const Privacy = lazy(() => import("./pages/Privacy"));
const Terms = lazy(() => import("./pages/Terms"));
const PDPA = lazy(() => import("./pages/PDPA"));
const VisionMission = lazy(() => import("./pages/VisionMission"));
const Auth = lazy(() => import("./pages/Auth"));
const Admin = lazy(() => import("./pages/Admin"));
const NotFound = lazy(() => import("./pages/NotFound"));
const Awards = lazy(() => import("./pages/Awards"));
const PremiumAnalysis = lazy(() => import("./pages/PremiumAnalysis"));
const Sustainability = lazy(() => import("./pages/Sustainability"));
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
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
            <LazyMotion features={domAnimation}>
              <CookieConsentProvider>
                <Layout>
                  <PageTransition>
                    <Suspense fallback={<Loading />}>
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
                    </Suspense>
                  </PageTransition>
                </Layout>
              </CookieConsentProvider>
            </LazyMotion>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </I18nextProvider>
  </QueryClientProvider>
);

export default App;
