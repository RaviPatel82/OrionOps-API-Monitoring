import React from "react";
import { User, Lock, ShieldAlert, Loader2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import FormField from "./FormField.jsx";

export default function DemoForm({
  formData,
  setFormData,
  handleDemoSubmit,
  error,
  loading
}) {
  return (
    <form onSubmit={handleDemoSubmit} className="space-y-6">
      {error && (
        <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-[4px] flex items-center gap-3">
          <ShieldAlert size={14} className="text-red-500" />
          <span className="text-[10px] font-bold text-red-400 uppercase tracking-tight">{error}</span>
        </div>
      )}

      <div className="space-y-5">
        <FormField label="Identity Handle" icon={User}>
          <Input
            placeholder="operator_id"
            required
            className="pl-10 h-10 bg-transparent border-border focus-visible:ring-primary focus-visible:ring-1 rounded-[4px] font-mono text-[12px] text-foreground"
            value={formData.username}
            onChange={(e) => setFormData({ ...formData, username: e.target.value })}
          />
          <div className="absolute right-3 top-2.5 px-1.5 py-0.5 bg-primary/10 border border-primary/20 text-[7px] font-bold text-primary uppercase tracking-widest rounded-sm">
            Pre-filled
          </div>
        </FormField>

        <FormField label="Access Secret" icon={Lock}>
          <Input
            type="password"
            placeholder="••••••••"
            required
            className="pl-10 h-10 bg-transparent border-border focus-visible:ring-primary focus-visible:ring-1 rounded-[4px] font-mono text-[12px] text-foreground"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          />
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
            Initialize Super-Admin <ArrowRight size={14} />
          </span>
        )}
      </Button>
    </form>
  );
}
