import React, { useState } from 'react';
import CodeBlock from './CodeBlock';
import { cn } from '@/lib/utils';
import { AlertCircle, CheckCircle2, ShieldAlert } from 'lucide-react';

export default function DocsContent() {
  const [activeTab, setActiveTab] = useState('express');

  const frameworks = [
    { id: 'express', label: 'Express' },
    { id: 'fastify', label: 'Fastify' },
    { id: 'raw', label: 'Raw Node' },
    { id: 'other', label: 'Other Languages' },
  ];

  const snippets = {
    express: {
      install: 'npm install orionops',
      code: `const express = require('express');
const orionops = require('orionops');

const app = express();

app.use(orionops({ 
  apiKey: process.env.ORIONOPS_API_KEY, 
  serviceName: 'my-express-api' 
}));`,
      note: 'Express middleware automatically hooks into the response finish event to ensure it never blocks your request handling.'
    },
    fastify: {
      install: 'npm install orionops fastify-plugin',
      code: `const fastify = require('fastify')();
const orionopsFastify = require('orionops/adapters/fastify');

fastify.register(orionopsFastify, {
  apiKey: process.env.ORIONOPS_API_KEY,
  serviceName: 'my-fastify-api'
});`,
      note: 'Fastify requires fastify-plugin to ensure the hook is registered globally across all scoped routes.'
    },

    raw: {
      install: 'npm install orionops',
      code: `const http = require('http');
const orionopsHttp = require('orionops/adapters/http');

const server = http.createServer((req, res) => {
  // Wrap your handler logic
  orionopsHttp.wrapHandler(req, res, {
    apiKey: process.env.ORIONOPS_API_KEY,
    serviceName: 'my-raw-api'
  });
  
  res.end('Hello World');
});`,
      note: 'The raw HTTP adapter wraps the request/response objects directly without assuming any routing layer.'
    },
    other: {
      install: '# No installation required for raw HTTP',
      code: `curl -X POST https://orionops-api-c8gdc0h3dzdxh4bt.centralindia-01.azurewebsites.net/api/hit \\
  -H "x-api-key: YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "serviceName": "python-worker",
    "endpoint": "/process",
    "method": "POST",
    "statusCode": 200,
    "latencyMs": 45
  }'`,
      note: 'For non-Node.js environments, you can report metrics by sending a JSON payload directly to our ingestion endpoint.'
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-12 space-y-24 pb-32">
      {/* QUICKSTART */}
      <section id="quickstart" className="scroll-mt-12 space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tighter text-foreground mb-4">Quickstart</h1>
          <p className="text-muted-foreground">
            Integrate OrionOps into your Node.js application in under 60 seconds.
          </p>
        </div>
        
        <div className="space-y-4">
          <CodeBlock language="bash" code="npm install orionops" />
          <CodeBlock language="javascript" code={snippets.express.code} />
        </div>
        
        <div className="flex items-start gap-3 p-4 bg-primary/10 border border-primary/20 rounded-md">
          <CheckCircle2 size={20} className="text-primary shrink-0 mt-0.5" />
          <p className="text-sm text-foreground/90">
            <strong>See your data in your dashboard within seconds.</strong> Send a test request to any route after integrating, and it will immediately appear.
          </p>
        </div>
      </section>

      {/* FRAMEWORK TABS */}
      <section id="frameworks" className="scroll-mt-12 space-y-6">
        <div>
          <h2 className="text-2xl font-bold tracking-tighter text-foreground mb-4">Framework Guides</h2>
          <p className="text-muted-foreground">Select your framework to see the exact integration snippet.</p>
        </div>

        <div className="border border-border rounded-lg bg-card overflow-hidden">
          <div className="flex overflow-x-auto border-b border-border bg-muted/30 scrollbar-hide">
            {frameworks.map(fw => (
              <button
                key={fw.id}
                onClick={() => setActiveTab(fw.id)}
                className={cn(
                  "px-4 py-3 text-sm font-bold transition-all whitespace-nowrap cursor-pointer border-b-2",
                  activeTab === fw.id
                    ? "text-primary border-primary bg-background"
                    : "text-muted-foreground border-transparent hover:text-foreground hover:bg-muted/50"
                )}
              >
                {fw.label}
              </button>
            ))}
          </div>
          <div className="p-6 space-y-6">
            <div className="space-y-2">
              <h3 className="text-xs font-mono font-bold text-muted-foreground uppercase tracking-wider">Installation</h3>
              <CodeBlock language="bash" code={snippets[activeTab].install} />
            </div>
            
            <div className="space-y-2">
              <h3 className="text-xs font-mono font-bold text-muted-foreground uppercase tracking-wider">Integration</h3>
              <CodeBlock 
                language={activeTab === 'other' ? 'bash' : 'javascript'} 
                code={snippets[activeTab].code} 
              />
            </div>
            
            <div className="flex items-start gap-3 p-4 bg-secondary rounded-md border border-border">
              <AlertCircle size={18} className="text-muted-foreground shrink-0 mt-0.5" />
              <p className="text-sm text-foreground/80">{snippets[activeTab].note}</p>
            </div>
          </div>
        </div>
      </section>

      {/* CONFIGURATION REFERENCE */}
      <section id="configuration" className="scroll-mt-12 space-y-6">
        <div>
          <h2 className="text-2xl font-bold tracking-tighter text-foreground mb-4">Configuration Reference</h2>
          <p className="text-muted-foreground">Options can be passed to the middleware or set via environment variables.</p>
        </div>

        <div className="border border-border rounded-lg overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs font-mono text-muted-foreground uppercase bg-muted/50 border-b border-border">
              <tr>
                <th className="px-6 py-4">Option</th>
                <th className="px-6 py-4">Env Var</th>
                <th className="px-6 py-4">Default</th>
                <th className="px-6 py-4">Description</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {[
                { opt: 'apiKey', env: 'ORIONOPS_API_KEY', def: 'null', desc: 'Required. Your project API key.' },
                { opt: 'serviceName', env: 'ORIONOPS_SERVICE_NAME', def: 'null', desc: 'Required. Logical name for this service/API.' },
                { opt: 'endpoint', env: 'ORIONOPS_ENDPOINT', def: '"https://orionops-api-c8gdc0h3dzdxh4bt.centralindia-01.azurewebsites.net/api/hit"', desc: 'Override the ingestion URL (for enterprise/on-prem).' },
                { opt: 'enabled', env: 'ORIONOPS_ENABLED', def: 'true', desc: 'Set to false to completely disable metrics collection.' },
                { opt: 'enableLogging', env: 'ORIONOPS_ENABLE_LOGGING', def: 'false', desc: 'If true, logs a warning to console if ingestion fails.' },
                { opt: 'timeout', env: 'ORIONOPS_TIMEOUT', def: '5000', desc: 'Timeout in ms for sending metrics to the ingestion server.' },
                { opt: 'skipPaths', env: 'ORIONOPS_SKIP_PATHS', def: "['/health']", desc: 'Array of exact path strings to ignore.' }
              ].map((row, i) => (
                <tr key={i} className="bg-card hover:bg-muted/30 transition-colors">
                  <td className="px-6 py-4 font-mono font-bold text-primary">{row.opt}</td>
                  <td className="px-6 py-4 font-mono text-xs">{row.env}</td>
                  <td className="px-6 py-4 font-mono text-xs text-muted-foreground">{row.def}</td>
                  <td className="px-6 py-4 text-foreground/80">{row.desc}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* WHAT GETS SENT / DATA & PRIVACY */}
      <section id="data-privacy" className="scroll-mt-12 space-y-6">
        <div>
          <h2 className="text-2xl font-bold tracking-tighter text-foreground mb-4">Data & Privacy</h2>
          <p className="text-muted-foreground">We take data minimization seriously. Here is exactly what leaves your servers.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <div className="flex flex-col gap-4">
              <div className="flex items-start gap-3 p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-md">
                <ShieldAlert size={20} className="text-emerald-500 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-foreground mb-1">No PII or Bodies</h4>
                  <p className="text-sm text-foreground/80">
                    We never capture request bodies, response bodies, query parameters, or authorization headers.
                  </p>
                </div>
              </div>
              <p className="text-sm leading-relaxed text-muted-foreground">
                OrionOps only tracks high-level request metadata to give you visibility into performance and usage rates. This ensures compliance with GDPR, HIPAA, and other strict data privacy regulations by default.
              </p>
            </div>
          </div>
          <div>
             <h3 className="text-xs font-mono font-bold text-muted-foreground uppercase tracking-wider mb-2">Exact Payload Shape</h3>
             <CodeBlock language="json" code={`{
  "serviceName": "auth-svc",
  "endpoint": "/login",
  "method": "POST",
  "statusCode": 200,
  "latencyMs": 124,
  "ip": "192.168.1.1",
  "userAgent": "Mozilla/5.0..."
}`} />
          </div>
        </div>
      </section>

      {/* DASHBOARD WALKTHROUGH */}
      <section id="dashboard" className="scroll-mt-12 space-y-6">
        <div>
          <h2 className="text-2xl font-bold tracking-tighter text-foreground mb-4">Dashboard Walkthrough</h2>
          <p className="text-muted-foreground">Once data is flowing, you'll get immediate visibility into your infrastructure.</p>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          <div className="group relative rounded-2xl overflow-hidden bg-[#0d0d0d] border border-white/5 shadow-2xl transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_20px_40px_-15px_rgba(0,255,150,0.15)] flex flex-col">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
            <div className="flex items-center px-4 py-3 bg-white/[0.02] border-b border-white/5 relative z-10">
               <div className="flex gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-500/20 border border-red-500/50"></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/20 border border-yellow-500/50"></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-green-500/20 border border-green-500/50"></div>
               </div>
               <span className="ml-4 text-[10px] font-mono font-bold text-muted-foreground/50 uppercase tracking-widest">Global Metrics</span>
            </div>
            <div className="relative aspect-[16/10] bg-[#050505] overflow-hidden flex items-center justify-center p-4 md:p-6">
               <img src="/orionops_global_metrics.png" alt="Global Metrics Dashboard" className="w-full h-full object-cover rounded-lg border border-white/5 shadow-[0_0_30px_-5px_rgba(0,0,0,0.8)] transition-transform duration-700 group-hover:scale-[1.02]" />
            </div>
            <div className="p-6 relative z-10 bg-black/40 border-t border-white/5 flex-1">
               <h4 className="font-bold text-lg mb-2 text-foreground flex items-center gap-2">
                 Global Metrics 
                 <span className="h-1.5 w-1.5 rounded-full bg-primary shadow-[0_0_8px_rgba(0,255,150,0.8)] animate-pulse" />
               </h4>
               <p className="text-sm text-muted-foreground/80 leading-relaxed">View aggregate latency, error rates, and traffic volume across all connected services in real-time.</p>
            </div>
          </div>

          <div className="group relative rounded-2xl overflow-hidden bg-[#0d0d0d] border border-white/5 shadow-2xl transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_20px_40px_-15px_rgba(150,0,255,0.15)] flex flex-col">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
            <div className="flex items-center px-4 py-3 bg-white/[0.02] border-b border-white/5 relative z-10">
               <div className="flex gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-500/20 border border-red-500/50"></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/20 border border-yellow-500/50"></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-green-500/20 border border-green-500/50"></div>
               </div>
               <span className="ml-4 text-[10px] font-mono font-bold text-muted-foreground/50 uppercase tracking-widest">Endpoint Analysis</span>
            </div>
            <div className="relative aspect-[16/10] bg-[#050505] overflow-hidden flex items-center justify-center p-4 md:p-6">
               <img src="/orionops_endpoint_analysis.png" alt="Endpoint Analysis Dashboard" className="w-full h-full object-cover rounded-lg border border-white/5 shadow-[0_0_30px_-5px_rgba(0,0,0,0.8)] transition-transform duration-700 group-hover:scale-[1.02]" />
            </div>
            <div className="p-6 relative z-10 bg-black/40 border-t border-white/5 flex-1">
               <h4 className="font-bold text-lg mb-2 text-foreground flex items-center gap-2">
                 Endpoint Analysis 
                 <span className="h-1.5 w-1.5 rounded-full bg-purple-500 shadow-[0_0_8px_rgba(150,0,255,0.8)] animate-pulse" />
               </h4>
               <p className="text-sm text-muted-foreground/80 leading-relaxed">Drill down into specific routes to identify bottlenecks or frequent 500 errors immediately.</p>
            </div>
          </div>
        </div>
      </section>

      {/* TROUBLESHOOTING */}
      <section id="troubleshooting" className="scroll-mt-12 space-y-6">
        <div>
          <h2 className="text-2xl font-bold tracking-tighter text-foreground mb-4">Troubleshooting</h2>
          <p className="text-muted-foreground">Common issues and their solutions.</p>
        </div>

        <div className="space-y-4">
          {[
            {
              q: "I integrated this but see no data in the dashboard.",
              a: "Check that your API key is correct. Ensure the endpoint URL is reachable from your environment. Verify that the route you're testing isn't included in the skipPaths array (by default, /health is skipped)."
            },
            {
              q: "Will this slow down my app?",
              a: "No. The reporting happens completely asynchronously after the response has already been sent to the client (using setImmediate or equivalent response finish hooks). Your user-facing latency is unaffected."
            },
            {
              q: "What happens if OrionOps is down?",
              a: "The middleware fails silently by default. It catches its own network errors so it will never throw or crash your application. If you want visibility into these failures, set enableLogging: true."
            }
          ].map((faq, i) => (
            <div key={i} className="p-6 bg-card border border-border rounded-lg">
              <h4 className="font-bold text-foreground mb-2 flex items-start gap-2">
                 <span className="text-primary mt-0.5">Q:</span> {faq.q}
              </h4>
              <p className="text-muted-foreground text-sm pl-6">{faq.a}</p>
            </div>
          ))}
        </div>
      </section>

      {/* API REFERENCE */}
      <section id="api-reference" className="scroll-mt-12 space-y-6">
        <div>
          <h2 className="text-2xl font-bold tracking-tighter text-foreground mb-4">Raw API Reference</h2>
          <p className="text-muted-foreground">Contract for the ingestion endpoint if you are building a custom integration.</p>
        </div>

        <div className="bg-card border border-border rounded-lg p-6 space-y-6">
           <div className="flex items-center gap-4 border-b border-border pb-4">
             <span className="text-xs font-mono font-bold text-primary bg-primary/10 px-2 py-1 rounded-md">POST</span>
             <code className="text-sm font-mono text-foreground">https://orionops-api-c8gdc0h3dzdxh4bt.centralindia-01.azurewebsites.net/api/hit</code>
           </div>

           <div>
              <h4 className="text-xs font-mono font-bold text-muted-foreground uppercase tracking-wider mb-3">Required Headers</h4>
              <ul className="space-y-2 text-sm font-mono">
                 <li><span className="text-foreground">x-api-key:</span> <span className="text-muted-foreground">string</span></li>
                 <li><span className="text-foreground">Content-Type:</span> <span className="text-muted-foreground">application/json</span></li>
              </ul>
           </div>

           <div className="space-y-4">
              <h4 className="text-xs font-mono font-bold text-muted-foreground uppercase tracking-wider">Responses</h4>
              <div className="grid gap-3">
                 <div className="flex gap-4 p-3 border border-border rounded-md">
                   <span className="font-mono text-emerald-400 font-bold">200</span>
                   <code className="text-sm">{"{ \"success\": true }"}</code>
                 </div>
                 <div className="flex gap-4 p-3 border border-border rounded-md">
                   <span className="font-mono text-rose-400 font-bold">401</span>
                   <code className="text-sm">{"{ \"error\": \"Missing or invalid API key\" }"}</code>
                 </div>
                 <div className="flex gap-4 p-3 border border-border rounded-md">
                   <span className="font-mono text-rose-400 font-bold">400</span>
                   <code className="text-sm">{"{ \"error\": \"Invalid payload format\" }"}</code>
                 </div>
              </div>
           </div>
        </div>
      </section>
    </div>
  );
}
