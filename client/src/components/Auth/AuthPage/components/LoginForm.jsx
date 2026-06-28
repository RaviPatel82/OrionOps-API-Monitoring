import React from "react";
import { User, Lock, ShieldAlert, Loader2, ArrowRight, Building2, LogIn, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import FormField from "./FormField.jsx";

export default function LoginForm({
  formData,
  setFormData,
  handleLoginSubmit,
  error,
  loading,
  showLoginPassword,
  setShowLoginPassword,
  setStandardView,
  setError,
  onAuthSuccess
}) {
  return (
    <form onSubmit={handleLoginSubmit} className="space-y-6">
      {error && (
        <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-[4px] flex items-center gap-3">
          <ShieldAlert size={14} className="text-red-500 shrink-0" />
          <span className="text-[10px] font-bold text-red-400 uppercase tracking-tight">{error}</span>
        </div>
      )}

      <div className="space-y-5">
        <FormField label="Username" icon={User}>
          <Input
            placeholder="operator_id"
            required
            className="pl-10 h-10 bg-transparent border-border focus-visible:ring-primary focus-visible:ring-1 rounded-[4px] font-mono text-[12px] text-foreground"
            value={formData.username}
            onChange={(e) => setFormData({ ...formData, username: e.target.value })}
          />
        </FormField>

        <FormField label="Password" icon={Lock}>
          <Input
            type={showLoginPassword ? "text" : "password"}
            placeholder="••••••••"
            required
            className="pl-10 pr-10 h-10 bg-transparent border-border focus-visible:ring-primary focus-visible:ring-1 rounded-[4px] font-mono text-[12px] text-foreground"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          />
          <button
            type="button"
            onClick={() => setShowLoginPassword(!showLoginPassword)}
            className="absolute right-3.5 top-2.5 text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
            tabIndex={-1}
          >
            {showLoginPassword ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </FormField>
      </div>

      <Button
        type="submit"
        disabled={loading}
        variant="zapier"
        className="w-full h-14 rounded-[4px] font-bold uppercase tracking-[0.3em] text-[11px] shadow-none mt-4 transition-all cursor-pointer"
      >
        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : (
          <span className="flex items-center gap-3">
            Establish Connection <ArrowRight size={14} />
          </span>
        )}
      </Button>

      <div className="text-center pt-4 border-t border-border space-y-3">
        <button
          type="button"
          onClick={() => { setStandardView("register"); setError(""); }}
          className="text-[9px] font-bold text-foreground uppercase tracking-widest hover:text-primary transition-colors cursor-pointer flex items-center justify-center gap-1.5 mx-auto"
        >
          <Building2 size={10} /> Don't have an account? Register
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
