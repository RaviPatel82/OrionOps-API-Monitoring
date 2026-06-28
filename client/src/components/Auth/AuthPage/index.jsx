import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Building2, ShieldCheck } from "lucide-react";
import { login } from "../../../api";
import { onboardClient, createClientUser } from "../../../api/client";
import { useLocation } from "react-router-dom";

import IdentityCard from "./components/IdentityCard.jsx";
import RegistrationSuccess from "./components/RegistrationSuccess.jsx";
import LoginForm from "./components/LoginForm.jsx";
import RegisterForm from "./components/RegisterForm.jsx";
import DemoForm from "./components/DemoForm.jsx";
import AuthFooter from "./components/AuthFooter.jsx";

export default function AuthPage({ onAuthSuccess, onBack }) {
  const location = useLocation();

  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [registerData, setRegisterData] = useState({
    companyName: "",
    companyEmail: "",
    description: "",
    website: "",
    adminName: "",
    adminEmail: "",
    adminPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [mode, setMode] = useState("standard"); // 'standard' or 'demo'
  // Initialize to 'login' if navigated here from the Login button
  const [standardView, setStandardView] = useState(
    location.state?.view === 'login' ? 'login' : 'register'
  );
  const [registerStep, setRegisterStep] = useState(1);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [showRegisterPassword, setShowRegisterPassword] = useState(false);

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await login(formData);
      onAuthSuccess(res.data || res);
    } catch (err) {
      setError(err.message || "Credential verification failed");
    } finally {
      setLoading(false);
    }
  };

  const handleDemoSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Smart Demo Bypass: If recruiter uses the demo credentials, let them in immediately
    if (formData.username === "admin_demo" && formData.password === "demo1234") {
      setTimeout(() => {
        onAuthSuccess({
          username: "Admin_Demo",
          role: "super_admin",
          isDemo: true,
          permissions: { canManageUsers: true, canViewAnalytics: true }
        });
      }, 1000);
      return;
    }

    try {
      const res = await login(formData);
      onAuthSuccess(res.data);
    } catch (err) {
      setError(err.message || "Credential verification failed");
    } finally {
      setLoading(false);
    }
  };

  const validateRegisterStep1 = () => {
    const errors = {};
    if (!registerData.companyName || registerData.companyName.trim().length < 2) {
      errors.companyName = 'Company name must be at least 2 characters.';
    }
    if (!registerData.companyEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(registerData.companyEmail)) {
      errors.companyEmail = 'Please enter a valid email address.';
    }
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const validateRegisterStep2 = () => {
    const errors = {};
    if (!registerData.adminName || registerData.adminName.trim().length < 3) {
      errors.adminName = 'Username must be at least 3 characters.';
    } else if (!/^[a-zA-Z0-9._-]+$/.test(registerData.adminName)) {
      errors.adminName = 'Username can only contain letters, numbers, dots, underscores, and hyphens.';
    }
    if (!registerData.adminEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(registerData.adminEmail)) {
      errors.adminEmail = 'Please enter a valid email address.';
    }
    if (!registerData.adminPassword || registerData.adminPassword.length < 8) {
      errors.adminPassword = 'Password must be at least 8 characters.';
    } else if (!/[A-Z]/.test(registerData.adminPassword)) {
      errors.adminPassword = 'Password must contain at least one uppercase letter.';
    } else if (!/[a-z]/.test(registerData.adminPassword)) {
      errors.adminPassword = 'Password must contain at least one lowercase letter.';
    } else if (!/[0-9]/.test(registerData.adminPassword)) {
      errors.adminPassword = 'Password must contain at least one number.';
    } else if (!/[^A-Za-z0-9]/.test(registerData.adminPassword)) {
      errors.adminPassword = 'Password must contain at least one special character.';
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Step 1 → Step 2
    if (registerStep === 1) {
      if (!validateRegisterStep1()) return;
      setFieldErrors({});
      setRegisterStep(2);
      return;
    }

    // Step 2 → Submit
    if (!validateRegisterStep2()) return;

    setLoading(true);
    setFieldErrors({});

    try {
      // Step 1: Create client/company
      const clientRes = await onboardClient({
        name: registerData.companyName,
        email: registerData.companyEmail,
        discription: registerData.description,
        website: registerData.website,
      });

      const clientId = clientRes?.data?.clientId || clientRes?.clientId || clientRes?.data?._id || clientRes?._id;

      if (!clientId) {
        throw new Error("Failed to retrieve client ID from onboarding response");
      }

      // Step 2: Create client admin user
      await createClientUser(clientId, {
        username: registerData.adminName,
        email: registerData.adminEmail,
        password: registerData.adminPassword,
        role: "client_admin",
      });

      // Show success state briefly, then auto-login
      setRegistrationSuccess(true);

      // Try auto-login with the just-created credentials
      setTimeout(async () => {
        try {
          const loginRes = await login({
            username: registerData.adminName,
            password: registerData.adminPassword,
          });
          onAuthSuccess(loginRes.data || loginRes);
        } catch {
          // If auto-login fails, still redirect with basic user data
          onAuthSuccess({
            username: registerData.adminName,
            email: registerData.adminEmail,
            role: "client_admin",
            clientId,
          });
        }
      }, 1500);
    } catch (err) {
      setError(err.message || "Registration failed. Please try again.");
      setLoading(false);
    }
  };

  const selectDemo = () => {
    setMode("demo");
    setError("");
    setFormData({
      username: "admin_demo",
      password: "demo1234"
    });
  };

  const selectStandard = () => {
    setMode("standard");
    setError("");
    setStandardView("register");
    setRegisterStep(1);
    setRegistrationSuccess(false);
    setFormData({
      username: "",
      password: ""
    });
  };

  const updateRegister = (field, value) => {
    setRegisterData(prev => ({ ...prev, [field]: value }));
    setFieldErrors(prev => ({ ...prev, [field]: '' }));
  };

  return (
    <div className="min-h-screen w-full bg-background flex flex-col items-center justify-center p-8 relative selection:bg-primary/20 overflow-hidden">
      <div className="absolute inset-0 bg-technical-grid opacity-5 pointer-events-none" />

      {/* Brand Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center cursor-pointer group mb-8 z-20"
        onClick={onBack}
      >
        <h2 className="text-[32px] font-bold tracking-tighter text-foreground uppercase leading-none group-hover:text-primary transition-colors">
          OrionOps<span className="text-primary group-hover:text-foreground">.</span>
        </h2>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-[500px] bg-secondary border border-border rounded-[4px] overflow-hidden shadow-[0_30px_60px_rgba(0,0,0,0.3)] relative z-10"
      >
        <div className="border-b border-border bg-black/40 p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
            <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-foreground">
              {mode === 'demo' ? 'System Identification' : standardView === 'login' ? 'Operator Login' : 'New Registration'}
            </span>
          </div>
          <button onClick={onBack} className="text-[8px] font-bold text-muted-foreground uppercase tracking-widest hover:text-primary transition-colors flex items-center gap-1.5 cursor-pointer">
            Protocol: Abort <X size={10} />
          </button>
        </div>

        <div className="p-8 lg:p-10">
          {/* Step 1: Identity Selection */}
          <div className="mb-10">
            <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-[0.4em] mb-4 text-center">Select Access Profile</p>
            <div className="flex gap-4">
              <IdentityCard
                title="Register"
                subtitle="New Company Setup"
                icon={Building2}
                active={mode === "standard"}
                onClick={selectStandard}
              />
              <IdentityCard
                title="Super Admin"
                subtitle="Recruiter Demo"
                icon={ShieldCheck}
                active={mode === "demo"}
                onClick={selectDemo}
              />
            </div>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={`${mode}-${standardView}-${registerStep}-${registrationSuccess}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {/* ===== REGISTRATION SUCCESS STATE ===== */}
              {mode === 'standard' && registrationSuccess ? (
                <RegistrationSuccess />
              ) : mode === 'standard' && standardView === 'login' ? (
                /* ===== LOGIN FORM ===== */
                <LoginForm
                  formData={formData}
                  setFormData={setFormData}
                  handleLoginSubmit={handleLoginSubmit}
                  error={error}
                  loading={loading}
                  showLoginPassword={showLoginPassword}
                  setShowLoginPassword={setShowLoginPassword}
                  setStandardView={setStandardView}
                  setError={setError}
                  onAuthSuccess={onAuthSuccess}
                />
              ) : mode === 'standard' ? (
                /* ===== REGISTRATION FORM ===== */
                <RegisterForm
                  registerData={registerData}
                  updateRegister={updateRegister}
                  handleRegisterSubmit={handleRegisterSubmit}
                  error={error}
                  loading={loading}
                  registerStep={registerStep}
                  setRegisterStep={setRegisterStep}
                  fieldErrors={fieldErrors}
                  showRegisterPassword={showRegisterPassword}
                  setShowRegisterPassword={setShowRegisterPassword}
                  setStandardView={setStandardView}
                  setError={setError}
                  onAuthSuccess={onAuthSuccess}
                />
              ) : (
                /* ===== DEMO LOGIN FORM ===== */
                <DemoForm
                  formData={formData}
                  setFormData={setFormData}
                  handleDemoSubmit={handleDemoSubmit}
                  error={error}
                  loading={loading}
                />
              )}
            </motion.div>
          </AnimatePresence>

          <AuthFooter />
        </div>
      </motion.div>
    </div>
  );
}
