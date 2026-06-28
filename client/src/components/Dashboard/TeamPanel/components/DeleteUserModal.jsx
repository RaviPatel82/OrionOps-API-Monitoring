import React from 'react';
import { UserMinus, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getRoleBadge } from '../utils.jsx';

export default function DeleteUserModal({ deleteTarget, setDeleteTarget, deleting, handleDeleteUser }) {
  if (!deleteTarget) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={() => { if (!deleting) setDeleteTarget(null); }}
      />
      {/* Modal */}
      <div className="relative w-full max-w-md mx-4 bg-card border border-border rounded-lg shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-5 border-b border-border bg-tech-rose/5 flex items-center gap-3">
          <div className="h-9 w-9 rounded-md bg-tech-rose/10 border border-tech-rose/20 flex items-center justify-center">
            <UserMinus size={16} className="text-tech-rose" />
          </div>
          <div>
            <h3 className="text-[11px] font-mono font-bold uppercase tracking-widest text-foreground">Remove Member</h3>
            <p className="text-[9px] text-muted-foreground font-medium mt-0.5">Revoke access from this team member</p>
          </div>
        </div>
        {/* Body */}
        <div className="p-6 space-y-4">
          <p className="text-[11px] text-muted-foreground leading-relaxed">
            Are you sure you want to remove <span className="font-bold text-foreground">"{deleteTarget.username}"</span> from the team?
          </p>
          {/* User Info */}
          <div className="bg-background border border-border rounded-md p-3 flex items-center gap-3">
            <div className="h-7 w-7 rounded-md border border-border bg-card flex items-center justify-center text-foreground font-bold text-[9px] uppercase">
              {deleteTarget.username.substring(0, 2)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[11px] font-bold text-foreground truncate">{deleteTarget.username}</p>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-[9px] text-muted-foreground font-mono">{deleteTarget.email}</span>
                {getRoleBadge(deleteTarget.role)}
              </div>
            </div>
          </div>
          {/* Warning */}
          <div className="bg-tech-amber/5 border border-tech-amber/15 rounded-md px-4 py-3 flex items-start gap-3">
            <AlertCircle size={14} className="text-tech-amber flex-shrink-0 mt-0.5" />
            <p className="text-[10px] text-tech-amber/80 font-medium leading-relaxed">
              This will revoke their access immediately. Their activity history will be preserved.
            </p>
          </div>
        </div>
        {/* Actions */}
        <div className="p-5 border-t border-border bg-card flex items-center justify-end gap-3">
          <Button
            variant="outline"
            disabled={deleting}
            onClick={() => setDeleteTarget(null)}
            className="h-9 px-5 rounded-md text-[10px] font-bold uppercase tracking-tight cursor-pointer border-border text-muted-foreground hover:text-foreground hover:border-foreground/20"
          >
            Cancel
          </Button>
          <Button
            onClick={handleDeleteUser}
            disabled={deleting}
            className="h-9 px-5 rounded-md font-bold uppercase tracking-tight text-[10px] bg-tech-rose text-white hover:bg-tech-rose/90 cursor-pointer flex items-center justify-center gap-2 shadow-[0_2px_12px_rgba(244,63,94,0.25)]"
          >
            <UserMinus size={12} />
            {deleting ? 'Removing...' : 'Remove Member'}
          </Button>
        </div>
      </div>
    </div>
  );
}
