import React from 'react';
import { Trash2, AlertCircle, Key } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getEnvBadge } from '../utils.jsx';

export default function DeleteKeyModal({ 
  deleteTarget, 
  setDeleteTarget, 
  deleting, 
  handleDeleteApiKey 
}) {
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
            <Trash2 size={16} className="text-tech-rose" />
          </div>
          <div>
            <h3 className="text-[11px] font-mono font-bold uppercase tracking-widest text-foreground">Delete API Key</h3>
            <p className="text-[9px] text-muted-foreground font-medium mt-0.5">This action cannot be undone</p>
          </div>
        </div>
        {/* Body */}
        <div className="p-6 space-y-4">
          <p className="text-[11px] text-muted-foreground leading-relaxed">
            Are you sure you want to permanently delete the API key{' '}
            <span className="font-bold text-foreground">"{deleteTarget.name}"</span>?
            Any services using this key will immediately lose access.
          </p>
          {/* Key Info */}
          <div className="bg-background border border-border rounded-md p-3 flex items-center gap-3">
            <div className="h-7 w-7 rounded-md border border-border bg-card flex items-center justify-center">
              <Key size={12} className="text-muted-foreground" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[11px] font-bold text-foreground truncate">{deleteTarget.name}</p>
              <div className="flex items-center gap-2 mt-0.5">
                <code className="text-[9px] text-muted-foreground font-mono">{deleteTarget.prefix || 'apim_...'}</code>
                {getEnvBadge(deleteTarget.environment)}
              </div>
            </div>
          </div>
          {/* Warning */}
          <div className="bg-tech-rose/5 border border-tech-rose/15 rounded-md px-4 py-3 flex items-start gap-3">
            <AlertCircle size={14} className="text-tech-rose flex-shrink-0 mt-0.5" />
            <p className="text-[10px] text-tech-rose/80 font-medium leading-relaxed">
              All active requests authenticated with this key will be <span className="font-bold text-tech-rose">rejected immediately</span> after deletion.
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
            onClick={handleDeleteApiKey}
            disabled={deleting}
            className="h-9 px-5 rounded-md font-bold uppercase tracking-tight text-[10px] bg-tech-rose text-white hover:bg-tech-rose/90 cursor-pointer flex items-center justify-center gap-2 shadow-[0_2px_12px_rgba(244,63,94,0.25)]"
          >
            <Trash2 size={12} />
            {deleting ? 'Deleting...' : 'Delete Key'}
          </Button>
        </div>
      </div>
    </div>
  );
}
