import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import HeroSlider from './components/HeroSlider';
import ServicesSection from './components/ServicesSection';
import AboutSection from './components/AboutSection';
import BlogSection from './components/BlogSection';
import ContactSection from './components/ContactSection';
import Footer from './components/Footer';
import DynamicPage from './components/DynamicPage';

import ServiceDetailPage from './components/ServiceDetailPage';
import ServiceCategoryPage from './components/ServiceCategoryPage';
import AllServicesPage from './components/AllServicesPage';

import BlogDetailPage from './components/BlogDetailPage';
import AllBlogPage from './components/AllBlogPage';

import AdminLogin from './admin/AdminLogin';
import AdminLayout from './admin/AdminLayout';
import { apiService } from './services/api';

export default function App() {
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [adminUser, setAdminUser] = useState(null);
  const [inAdminPanel, setInAdminPanel] = useState(false);
  const [currentPath, setCurrentPath] = useState(window.location.pathname);

  useEffect(() => {
    const user = apiService.getUser();
    if (user) {
      setAdminUser(user);
    }

    if (window.location.pathname === '/admin' || window.location.pathname === '/login') {
      if (user) {
        setInAdminPanel(true);
      } else {
        setShowAdminLogin(true);
      }
    }

    const handlePopState = () => {
      const path = window.location.pathname;
      setCurrentPath(path);
      if (path === '/admin' || path === '/login') {
        const u = apiService.getUser();
        if (u) {
          setInAdminPanel(true);
        } else {
          setShowAdminLogin(true);
        }
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const handleOpenAdmin = () => {
    if (adminUser) {
      setInAdminPanel(true);
    } else {
      setShowAdminLogin(true);
    }
  };

  const handleLoginSuccess = (user) => {
    setAdminUser(user);
    setShowAdminLogin(false);
    setInAdminPanel(true);
  };

  const handleLogout = () => {
    apiService.logout();
    setAdminUser(null);
    setInAdminPanel(false);
  };

  const navigateToHome = () => {
    window.history.pushState({}, '', '/');
    setCurrentPath('/');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Determine dynamic routing
  let isAllServices = currentPath === '/services';
  let isAllBlog = currentPath === '/blog';

  let serviceCategorySlug = null;
  let serviceSlug = null;
  let blogSlug = null;
  let customPageSlug = null;

  if (currentPath.startsWith('/service/category/')) {
    serviceCategorySlug = currentPath.replace(/^\/service\/category\//, '');
  } else if (currentPath.startsWith('/service/')) {
    serviceSlug = currentPath.replace(/^\/service\//, '');
  } else if (currentPath.startsWith('/blog/')) {
    blogSlug = currentPath.replace(/^\/blog\//, '');
  } else if (currentPath !== '/' && !isAllServices && !isAllBlog && !currentPath.startsWith('/api') && !currentPath.startsWith('/admin')) {
    customPageSlug = currentPath.replace(/^\//, '');
  }

  return (
    <div className="min-h-screen w-full bg-[#081425] text-slate-100 font-sans selection:bg-indigo-600 selection:text-white flex flex-col items-center justify-center overflow-x-hidden">
      
      {/* Public Web Layout */}
      {!inAdminPanel && (
        <>
          <Header onOpenAdmin={handleOpenAdmin} />
          
          <main className="w-full flex flex-col items-center justify-center">
            {isAllServices ? (
              <AllServicesPage onBack={navigateToHome} />
            ) : isAllBlog ? (
              <AllBlogPage onBack={navigateToHome} />
            ) : serviceCategorySlug ? (
              <ServiceCategoryPage categorySlug={serviceCategorySlug} onBack={navigateToHome} />
            ) : serviceSlug ? (
              <ServiceDetailPage slug={serviceSlug} onBack={navigateToHome} />
            ) : blogSlug ? (
              <BlogDetailPage slug={blogSlug} onBack={navigateToHome} />
            ) : customPageSlug ? (
              <DynamicPage slug={customPageSlug} onBack={navigateToHome} />
            ) : (
              <>
                <HeroSlider />
                <ServicesSection />
                <AboutSection />
                <BlogSection />
                <ContactSection />
              </>
            )}
          </main>

          <Footer />
        </>
      )}

      {/* Admin Login Overlay */}
      {showAdminLogin && (
        <AdminLogin 
          onLoginSuccess={handleLoginSuccess}
          onClose={() => setShowAdminLogin(false)}
        />
      )}

      {/* Admin Panel Main View */}
      {inAdminPanel && (
        <AdminLayout 
          user={adminUser}
          onLogout={handleLogout}
          onCloseAdmin={() => setInAdminPanel(false)}
        />
      )}

    </div>
  );
}
