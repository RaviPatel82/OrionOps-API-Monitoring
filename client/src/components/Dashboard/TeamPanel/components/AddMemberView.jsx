import React from 'react';
import { UserPlus2, UserCheck, CheckCircle2, AlertCircle, Eye, EyeOff } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export default function AddMemberView({
  selectedClient,
  handleAddUser,
  newUser,
  setNewUser,
  fieldErrors,
  setFieldErrors,
  showPassword,
  setShowPassword,
  loading,
  activeClientId
}) {
  return (
    <div className="w-full">
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 max-w-5xl mx-auto">
        {/* Form — takes 3 columns */}
        <div className="lg:col-span-3 relative bento-item overflow-hidden bg-card/40 border border-border/50">
          <div className="p-5 border-b border-border/50 flex items-center justify-between bg-secondary/10">
            <div>
              <h3 className="text-[11px] font-mono font-bold uppercase tracking-widest text-foreground">New Team Member</h3>
              {selectedClient && <p className="text-[9px] text-primary font-bold mt-1 uppercase tracking-wider">Target: {selectedClient.name}</p>}
            </div>
            <div className="h-8 w-8 rounded-md bg-primary/10 border border-primary/20 flex items-center justify-center">
              <UserPlus2 size={14} className="text-primary" />
            </div>
          </div>
          <div className="p-6">
            <form onSubmit={handleAddUser} className="space-y-5">
              <div className="space-y-1.5">
                <label className="text-[8px] font-bold text-foreground uppercase tracking-widest">Username <span className="text-tech-rose">*</span></label>
                <Input
                  placeholder="e.g. john_doe"
                  required
                  className={cn("bg-transparent rounded-md h-9 text-[11px] font-mono", fieldErrors.username ? "border-tech-rose focus:border-tech-rose" : "border-border focus:border-primary")}
                  value={newUser.username}
                  onChange={e => { setNewUser({ ...newUser, username: e.target.value }); setFieldErrors(prev => ({ ...prev, username: '' })); }}
                />
                {fieldErrors.username
                  ? <p className="text-[9px] text-tech-rose font-bold">{fieldErrors.username}</p>
                  : <p className="text-[9px] text-muted-foreground font-medium">Min 3 characters, alphanumeric and . _ - allowed</p>
                }
              </div>
              <div className="space-y-1.5">
                <label className="text-[8px] font-bold text-foreground uppercase tracking-widest">Email <span className="text-tech-rose">*</span></label>
                <Input
                  type="email"
                  placeholder="user@orionops.app"
                  required
                  className={cn("bg-transparent rounded-md h-9 text-[11px] font-mono", fieldErrors.email ? "border-tech-rose focus:border-tech-rose" : "border-border focus:border-primary")}
                  value={newUser.email}
                  onChange={e => { setNewUser({ ...newUser, email: e.target.value }); setFieldErrors(prev => ({ ...prev, email: '' })); }}
                />
                {fieldErrors.email && <p className="text-[9px] text-tech-rose font-bold">{fieldErrors.email}</p>}
              </div>
              <div className="space-y-1.5">
                <label className="text-[8px] font-bold text-foreground uppercase tracking-widest">Initial Password <span className="text-tech-rose">*</span></label>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    required
                    className={cn("bg-transparent rounded-md h-9 text-[11px] font-mono pr-9", fieldErrors.password ? "border-tech-rose focus:border-tech-rose" : "border-border focus:border-primary")}
                    value={newUser.password}
                    onChange={e => { setNewUser({ ...newUser, password: e.target.value }); setFieldErrors(prev => ({ ...prev, password: '' })); }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                </div>
                {fieldErrors.password
                  ? <p className="text-[9px] text-tech-rose font-bold">{fieldErrors.password}</p>
                  : <p className="text-[9px] text-muted-foreground font-medium">Min 8 characters with uppercase, lowercase, number, and a special character</p>
                }
              </div>
              <div className="space-y-2">
                <label className="text-[8px] font-bold text-foreground uppercase tracking-widest">Role</label>
                <div className="flex flex-wrap gap-2">
                  {[
                    { value: 'client_viewer', label: 'Viewer' },
                    { value: 'client_admin', label: 'Administrator' },
                  ].map(role => (
                    <button
                      key={role.value}
                      type="button"
                      onClick={() => setNewUser({ ...newUser, role: role.value })}
                      className={cn(
                        "px-4 py-1.5 rounded-md border text-[10px] font-bold uppercase transition-all cursor-pointer",
                        newUser.role === role.value
                          ? role.value === 'client_admin'
                            ? "bg-primary/10 text-primary border-primary/30 shadow-[0_2px_8px_rgba(99,102,241,0.1)]"
                            : "bg-tech-emerald/10 text-tech-emerald border-tech-emerald/30 shadow-[0_2px_8px_rgba(16,185,129,0.1)]"
                          : "bg-background text-muted-foreground border-border hover:text-foreground hover:border-foreground/20"
                      )}
                    >
                      {role.label}
                    </button>
                  ))}
                </div>
              </div>
              <div className="pt-3">
                <Button type="submit" disabled={loading || !activeClientId} className="w-full h-10 rounded-md font-bold uppercase tracking-tight text-[10px] bg-primary text-primary-foreground hover:bg-primary/90 cursor-pointer flex items-center justify-center gap-2 shadow-[0_2px_12px_rgba(99,102,241,0.2)]">
                  <UserPlus2 size={12} />
                  {loading ? 'Adding...' : 'Add Member'}
                </Button>
              </div>
            </form>
          </div>
        </div>

        {/* Info Sidebar — takes 2 columns */}
        <div className="lg:col-span-2 space-y-4">
          <div className="relative bento-item bg-card/40 border border-border/50 p-5 space-y-4">
            <h4 className="text-[10px] font-mono font-bold uppercase tracking-widest text-foreground flex items-center gap-2">
              <UserCheck size={12} className="text-primary" />
              Role Permissions
            </h4>
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Badge className="rounded-[4px] px-1.5 py-0.5 font-bold uppercase text-[8px] border shadow-none bg-tech-emerald/10 text-tech-emerald border-tech-emerald/20">Viewer</Badge>
                </div>
                <ul className="space-y-1 pl-1">
                  <li className="text-[10px] text-muted-foreground font-medium flex items-center gap-2">
                    <CheckCircle2 size={10} className="text-tech-emerald flex-shrink-0" /> View analytics dashboard
                  </li>
                  <li className="text-[10px] text-muted-foreground font-medium flex items-center gap-2">
                    <CheckCircle2 size={10} className="text-tech-emerald flex-shrink-0" /> View API hit data
                  </li>
                </ul>
              </div>
              <div className="border-t border-border pt-4 space-y-2">
                <div className="flex items-center gap-2">
                  <Badge className="rounded-[4px] px-1.5 py-0.5 font-bold uppercase text-[8px] border shadow-none bg-primary/5 text-primary border-primary/20">Admin</Badge>
                </div>
                <ul className="space-y-1 pl-1">
                  <li className="text-[10px] text-muted-foreground font-medium flex items-center gap-2">
                    <CheckCircle2 size={10} className="text-primary flex-shrink-0" /> All viewer permissions
                  </li>
                  <li className="text-[10px] text-muted-foreground font-medium flex items-center gap-2">
                    <CheckCircle2 size={10} className="text-primary flex-shrink-0" /> Create & manage API keys
                  </li>
                  <li className="text-[10px] text-muted-foreground font-medium flex items-center gap-2">
                    <CheckCircle2 size={10} className="text-primary flex-shrink-0" /> Manage team members
                  </li>
                  <li className="text-[10px] text-muted-foreground font-medium flex items-center gap-2">
                    <CheckCircle2 size={10} className="text-primary flex-shrink-0" /> Export data
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div className="bg-tech-amber/5 border border-tech-amber/15 rounded-md px-4 py-3 flex items-start gap-3">
            <AlertCircle size={14} className="text-tech-amber flex-shrink-0 mt-0.5" />
            <p className="text-[10px] text-tech-amber/80 font-medium leading-relaxed">
              The member will use the <span className="font-bold text-tech-amber">initial password</span> to log in for the first time. Share it securely.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
