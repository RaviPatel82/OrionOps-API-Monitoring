import React from 'react';
import { Link } from 'react-router-dom';
import { Key, Server, CheckCircle2, AlertCircle, Copy } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { getEnvBadge } from '../utils.jsx';

export default function GenerateKeyView({ 
  generatedKey, 
  setGeneratedKey, 
  setActiveTab, 
  copyToClipboard, 
  selectedClient, 
  handleCreateApiKey, 
  newKeyForm, 
  setNewKeyForm, 
  loading, 
  activeClientId 
}) {
  return (
    <div className="w-full">
      {generatedKey ? (
        <div className="max-w-2xl mx-auto relative bento-item bg-card/40 border border-primary/30 rounded-md overflow-hidden shadow-[0_0_24px_rgba(99,102,241,0.06)]">
          <div className="p-5 border-b border-primary/20 bg-gradient-to-r from-primary/5 to-transparent flex items-center gap-3">
            <div className="h-8 w-8 rounded-md bg-tech-emerald/10 border border-tech-emerald/20 flex items-center justify-center">
              <CheckCircle2 size={16} className="text-tech-emerald" />
            </div>
            <div>
              <h3 className="text-[11px] font-mono font-bold uppercase tracking-widest text-foreground">Key Generated Successfully</h3>
              <p className="text-[9px] text-muted-foreground font-medium mt-0.5">Store this key securely — it will not be displayed again</p>
            </div>
          </div>
          <div className="p-6 space-y-5">
            {/* Key Display */}
            <div className="space-y-2">
              <label className="text-[8px] font-bold text-foreground uppercase tracking-widest">Your API Key</label>
              <div className="bg-background border border-border rounded-md p-4 relative group">
                <code className="text-[13px] font-mono text-primary break-all block leading-relaxed select-all">{generatedKey.keyValue}</code>
              </div>
            </div>

            {/* Key Details */}
            {(generatedKey.name || generatedKey.environment) && (
              <div className="grid grid-cols-2 gap-4">
                {generatedKey.name && (
                  <div className="space-y-1">
                    <span className="text-[8px] font-bold text-muted-foreground uppercase tracking-widest">Key Name</span>
                    <p className="text-[12px] font-bold text-foreground">{generatedKey.name}</p>
                  </div>
                )}
                {generatedKey.environment && (
                  <div className="space-y-1">
                    <span className="text-[8px] font-bold text-muted-foreground uppercase tracking-widest">Environment</span>
                    {getEnvBadge(generatedKey.environment)}
                  </div>
                )}
              </div>
            )}

            {/* Security Warning */}
            <div className="bg-tech-rose/5 border border-tech-rose/15 rounded-md px-4 py-3 flex items-start gap-3">
              <AlertCircle size={14} className="text-tech-rose flex-shrink-0 mt-0.5" />
              <p className="text-[10px] text-tech-rose/80 font-medium leading-relaxed">
                This is the <span className="font-bold text-tech-rose">only time</span> your full API key will be visible. Copy it now and store it in a secure location. You will not be able to retrieve it later.
              </p>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3 pt-2">
              <Button
                onClick={() => copyToClipboard(generatedKey.keyValue)}
                className="flex-1 h-10 rounded-md font-bold uppercase tracking-tight text-[10px] bg-primary text-primary-foreground hover:bg-primary/90 cursor-pointer flex items-center justify-center gap-2"
              >
                <Copy size={12} />
                Copy to Clipboard
              </Button>
              <Button
                variant="outline"
                onClick={() => { setGeneratedKey(null); setActiveTab('keys'); }}
                className="h-10 px-6 rounded-md text-[10px] font-bold uppercase tracking-tight cursor-pointer border-border text-muted-foreground hover:text-foreground hover:border-foreground/20"
              >
                Done
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 max-w-5xl mx-auto">
          {/* Form — takes 3 columns */}
          <div className="lg:col-span-3 relative bento-item overflow-hidden bg-card/40 border border-border/50">
            <div className="p-5 border-b border-border/50 flex items-center justify-between bg-secondary/10">
              <div>
                <h3 className="text-[11px] font-mono font-bold uppercase tracking-widest text-foreground">New API Key</h3>
                {selectedClient && <p className="text-[9px] text-primary font-bold mt-1 uppercase tracking-wider">Target: {selectedClient.name}</p>}
              </div>
              <div className="h-8 w-8 rounded-md bg-primary/10 border border-primary/20 flex items-center justify-center">
                <Key size={14} className="text-primary" />
              </div>
            </div>
            <div className="p-6">
              <form onSubmit={handleCreateApiKey} className="space-y-5">
                <div className="space-y-1.5">
                  <label className="text-[8px] font-bold text-foreground uppercase tracking-widest">Key Name <span className="text-tech-rose">*</span></label>
                  <Input
                    placeholder="e.g. Payment Service"
                    required
                    className="bg-transparent border-border rounded-md focus:border-primary h-9 text-[11px] font-mono"
                    value={newKeyForm.name}
                    onChange={e => setNewKeyForm({ ...newKeyForm, name: e.target.value })}
                  />
                  <p className="text-[9px] text-muted-foreground font-medium">A descriptive name to identify this key</p>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[8px] font-bold text-foreground uppercase tracking-widest">Description</label>
                  <Input
                    placeholder="What is this key used for?"
                    className="bg-transparent border-border rounded-md focus:border-primary h-9 text-[11px] font-mono"
                    value={newKeyForm.description}
                    onChange={e => setNewKeyForm({ ...newKeyForm, description: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[8px] font-bold text-foreground uppercase tracking-widest">Environment</label>
                  <div className="flex flex-wrap gap-2">
                    {['production', 'staging', 'development', 'testing'].map(env => (
                      <button
                        key={env}
                        type="button"
                        onClick={() => setNewKeyForm({ ...newKeyForm, environment: env })}
                        className={cn(
                          "px-3 py-1.5 rounded-md border text-[10px] font-bold uppercase transition-all cursor-pointer",
                          newKeyForm.environment === env
                            ? env === 'production'
                              ? "bg-tech-rose/10 text-tech-rose border-tech-rose/30 shadow-[0_2px_8px_rgba(244,63,94,0.1)]"
                              : "bg-primary/10 text-primary border-primary/30 shadow-[0_2px_8px_rgba(99,102,241,0.1)]"
                            : "bg-background text-muted-foreground border-border hover:text-foreground hover:border-foreground/20"
                        )}
                      >
                        {env}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="pt-3">
                  <Button type="submit" disabled={loading || !activeClientId} className="w-full h-10 rounded-md font-bold uppercase tracking-tight text-[10px] bg-primary text-primary-foreground hover:bg-primary/90 cursor-pointer flex items-center justify-center gap-2 shadow-[0_2px_12px_rgba(99,102,241,0.2)]">
                    <Key size={12} />
                    {loading ? 'Generating...' : 'Generate API Key'}
                  </Button>
                </div>
              </form>
            </div>
          </div>

          {/* Info Sidebar — takes 2 columns */}
          <div className="lg:col-span-2 space-y-4">
            <div className="relative bento-item bg-card/40 border border-border/50 p-5 space-y-4">
              <h4 className="text-[10px] font-mono font-bold uppercase tracking-widest text-foreground flex items-center gap-2">
                <Server size={12} className="text-primary" />
                Quick Start
              </h4>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="h-5 w-5 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-[8px] font-bold text-primary">1</span>
                  </div>
                  <p className="text-[10px] text-muted-foreground leading-relaxed font-medium">Generate a key and <span className="text-foreground font-bold">copy it immediately</span></p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="h-5 w-5 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-[8px] font-bold text-primary">2</span>
                  </div>
                  <p className="text-[10px] text-muted-foreground leading-relaxed font-medium">Add the key to your service as <code className="text-[9px] font-mono text-primary bg-primary/5 px-1 rounded">x-api-key</code> header</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="h-5 w-5 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-[8px] font-bold text-primary">3</span>
                  </div>
                  <p className="text-[10px] text-muted-foreground leading-relaxed font-medium">Start sending hits to <code className="text-[9px] font-mono text-primary bg-primary/5 px-1 rounded">POST /api/hit</code></p>
                </div>
              </div>
            </div>

            <div className="relative bento-item bg-card/40 border border-border/50 p-5 space-y-3">
              <div className="flex justify-between items-center">
                <h4 className="text-[10px] font-mono font-bold uppercase tracking-widest text-foreground">Usage Example</h4>
                <Link to="/docs" className="text-[10px] font-bold text-primary hover:text-primary/80 transition-colors">Full docs &rarr;</Link>
              </div>
              <div className="bg-background border border-border rounded-md p-3 overflow-x-auto">
                <pre className="text-[9px] font-mono text-muted-foreground leading-relaxed whitespace-pre"><span className="text-primary">curl</span> -X POST /api/hit {'\n'}  -H <span className="text-tech-emerald">"x-api-key: apim_..."</span> {'\n'}  -H <span className="text-tech-emerald">"Content-Type: application/json"</span> {'\n'}  -d <span className="text-tech-emerald">'{`{"serviceName":"my-app"}`}'</span></pre>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
