import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShieldAlert, Loader2, ArrowRight, Building2, User, Mail, FileText, Link2, Lock, ChevronLeft, LogIn, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import FormField from "./FormField.jsx";

export default function RegisterForm({
  registerData,
  updateRegister,
  handleRegisterSubmit,
  error,
  loading,
  registerStep,
  setRegisterStep,
  fieldErrors,
  showRegisterPassword,
  setShowRegisterPassword,
  setStandardView,
  setError,
  onAuthSuccess
}) {
  return (
    <form onSubmit={handleRegisterSubmit} className="space-y-6">
      {error && (
        <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-[4px] flex items-center gap-3">
          <ShieldAlert size={14} className="text-red-500 shrink-0" />
          <span className="text-[10px] font-bold text-red-400 uppercase tracking-tight">{error}</span>
        </div>
      )}

      {/* Step indicator */}
      <div className="flex items-center gap-3 justify-center mb-2">
        <div className={cn(
          "flex items-center gap-2 px-3 py-1.5 rounded-full border transition-all",
          registerStep === 1 ? "border-primary bg-primary/10 text-primary" : "border-border text-muted-foreground"
        )}>
          <Building2 size={10} />
          <span className="text-[8px] font-bold uppercase tracking-widest">Company</span>
        </div>
        <div className="h-[1px] w-6 bg-border" />
        <div className={cn(
          "flex items-center gap-2 px-3 py-1.5 rounded-full border transition-all",
          registerStep === 2 ? "border-primary bg-primary/10 text-primary" : "border-border text-muted-foreground"
        )}>
          <User size={10} />
          <span className="text-[8px] font-bold uppercase tracking-widest">Admin</span>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {registerStep === 1 ? (
          <motion.div
            key="step1"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
            className="space-y-5"
          >
            <FormField label="Company Name" icon={Building2} error={fieldErrors.companyName}>
              <Input
                placeholder="Acme Corp"
                required
                className={cn("pl-10 h-10 bg-transparent focus-visible:ring-1 rounded-[4px] font-mono text-[12px] text-foreground", fieldErrors.companyName ? "border-red-500 focus-visible:ring-red-500" : "border-border focus-visible:ring-primary")}
                value={registerData.companyName}
                onChange={(e) => updateRegister('companyName', e.target.value)}
              />
            </FormField>

            <FormField label="Company Email" icon={Mail} error={fieldErrors.companyEmail}>
              <Input
                type="email"
                placeholder="contact@acme.com"
                required
                className={cn("pl-10 h-10 bg-transparent focus-visible:ring-1 rounded-[4px] font-mono text-[12px] text-foreground", fieldErrors.companyEmail ? "border-red-500 focus-visible:ring-red-500" : "border-border focus-visible:ring-primary")}
                value={registerData.companyEmail}
                onChange={(e) => updateRegister('companyEmail', e.target.value)}
              />
            </FormField>

            <FormField label="Description" icon={FileText}>
              <Input
                placeholder="Brief description of your company"
                className="pl-10 h-10 bg-transparent border-border focus-visible:ring-primary focus-visible:ring-1 rounded-[4px] font-mono text-[12px] text-foreground"
                value={registerData.description}
                onChange={(e) => updateRegister('description', e.target.value)}
              />
            </FormField>

            <FormField label="Website" icon={Link2}>
              <Input
                placeholder="https://acme.com"
                className="pl-10 h-10 bg-transparent border-border focus-visible:ring-primary focus-visible:ring-1 rounded-[4px] font-mono text-[12px] text-foreground"
                value={registerData.website}
                onChange={(e) => updateRegister('website', e.target.value)}
              />
            </FormField>
          </motion.div>
        ) : (
          <motion.div
            key="step2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.2 }}
            className="space-y-5"
          >
            <FormField label="Admin Username" icon={User} error={fieldErrors.adminName} hint="Min 3 characters, alphanumeric and . _ - allowed">
              <Input
                placeholder="admin_operator"
                required
                className={cn("pl-10 h-10 bg-transparent focus-visible:ring-1 rounded-[4px] font-mono text-[12px] text-foreground", fieldErrors.adminName ? "border-red-500 focus-visible:ring-red-500" : "border-border focus-visible:ring-primary")}
                value={registerData.adminName}
                onChange={(e) => updateRegister('adminName', e.target.value)}
              />
            </FormField>

            <FormField label="Admin Email" icon={Mail} error={fieldErrors.adminEmail}>
              <Input
                type="email"
                placeholder="admin@acme.com"
                required
                className={cn("pl-10 h-10 bg-transparent focus-visible:ring-1 rounded-[4px] font-mono text-[12px] text-foreground", fieldErrors.adminEmail ? "border-red-500 focus-visible:ring-red-500" : "border-border focus-visible:ring-primary")}
                value={registerData.adminEmail}
                onChange={(e) => updateRegister('adminEmail', e.target.value)}
              />
            </FormField>

            <FormField label="Password" icon={Lock} error={fieldErrors.adminPassword} hint="Min 6 characters with uppercase, lowercase, and a number">
              <Input
                type={showRegisterPassword ? "text" : "password"}
                placeholder="••••••••"
                required
                className={cn("pl-10 pr-10 h-10 bg-transparent focus-visible:ring-1 rounded-[4px] font-mono text-[12px] text-foreground", fieldErrors.adminPassword ? "border-red-500 focus-visible:ring-red-500" : "border-border focus-visible:ring-primary")}
                value={registerData.adminPassword}
                onChange={(e) => updateRegister('adminPassword', e.target.value)}
              />
              <button
                type="button"
                onClick={() => setShowRegisterPassword(!showRegisterPassword)}
                className="absolute right-3.5 top-2.5 text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                tabIndex={-1}
              >
                {showRegisterPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </FormField>

            {/* Back to step 1 */}
            <button
              type="button"
              onClick={() => { setRegisterStep(1); setError(""); }}
              className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest hover:text-primary transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <ChevronLeft size={12} /> Back to Company Details
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <Button
        type="submit"
        disabled={loading}
        variant="zapier"
        className="w-full h-14 rounded-[4px] font-bold uppercase tracking-[0.3em] text-[11px] shadow-none mt-4 transition-all cursor-pointer"
      >
        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : (
          <span className="flex items-center gap-3">
            {registerStep === 1 ? 'Continue to Admin Setup' : 'Create Account'} <ArrowRight size={14} />
          </span>
        )}
      </Button>

      <div className="text-center pt-4 border-t border-border space-y-3">
        <button
          type="button"
          onClick={() => { setStandardView("login"); setError(""); setRegisterStep(1); }}
          className="text-[9px] font-bold text-foreground uppercase tracking-widest hover:text-primary transition-colors cursor-pointer flex items-center justify-center gap-1.5 mx-auto"
        >
          <LogIn size={10} /> Already have an account? Login
        </button>
        <button
          type="button"
          onClick={() => onAuthSuccess({ username: "Guest_Operator", role: "GUEST" })}
          className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest hover:text-primary transition-colors cursor-pointer"
        >
          Need a quick preview? Use Guest Mode
        </button>
      </div>
    </form>
  );
}
