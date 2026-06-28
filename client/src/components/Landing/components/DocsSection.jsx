import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Globe, Database, Zap, Copy, ShieldCheck, Cpu, ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";

export const DocsSection = () => {
   const [activeDocTab, setActiveDocTab] = useState('express');

   return (
      <section id="docs" className="px-10 py-32 bg-background relative z-10 border-t border-border">
         <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="max-w-[1400px] mx-auto"
         >
            <div className="flex flex-col gap-4 mb-20 items-start">
               <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full border border-primary/20 bg-primary/5">
                  <span className="text-[10px] font-black text-primary uppercase tracking-widest">
                     PROTOCOL V1.2
                  </span>
                  <div className="h-1 w-1 rounded-full bg-primary/50" />
                  <span className="text-[10px] font-bold text-foreground uppercase tracking-widest opacity-80">
                     NODE.JS INTEGRATION
                  </span>
               </div>
               <h2 className="text-[40px] lg:text-[64px] font-bold tracking-tighter text-foreground uppercase leading-none">
                  Node.js <span className="text-muted-foreground">Integration.</span>
               </h2>
               <p className="text-[14px] text-muted-foreground font-medium max-w-xl leading-relaxed">
                  OrionOps provides seamless integration for your Node.js ecosystem. Easily monitor APIs built with Raw Node HTTP, Express, or Fastify.
               </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 bg-[#0d0d0d] border border-white/10 rounded-2xl shadow-[0_0_50px_-12px_rgba(0,0,0,0.8)] overflow-hidden min-h-[600px] relative">
               {/* Left Sidebar */}
               <div className="lg:col-span-3 border-b lg:border-b-0 lg:border-r border-white/10 bg-white/[0.01] flex flex-col z-10">
                  <div className="p-6 border-b border-white/10 flex items-center gap-2">
                     <div className="h-2 w-2 rounded-full bg-primary animate-pulse shadow-[0_0_8px_rgba(0,255,150,0.8)]" />
                     <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">Protocol Stacks</span>
                  </div>
                  <nav className="flex flex-col flex-1">
                     {[
                        { id: 'express', t: 'Express', d: 'High-speed middleware pattern' },
                        { id: 'fastify', t: 'Fastify', d: 'Native hook integration' },
                        { id: 'http', t: 'Raw Node http', d: 'Zero-dependency wrapper' },
                        { id: 'schema', t: 'Payload Schema', d: 'Standardized JSON structure' }
                     ].map((nav, i) => (
                        <button
                           key={i}
                           onClick={() => setActiveDocTab(nav.id)}
                           className={cn(
                              "text-left p-6 border-b border-white/5 transition-all group cursor-pointer relative overflow-hidden",
                              activeDocTab === nav.id ? "bg-primary/5" : "hover:bg-white/[0.02]"
                           )}
                        >
                           {activeDocTab === nav.id && (
                              <motion.div
                                 layoutId="activeDocTab"
                                 className="absolute left-0 top-0 bottom-0 w-[2px] bg-primary shadow-[0_0_10px_rgba(0,255,150,0.8)]"
                              />
                           )}
                           <p className={cn(
                              "text-[12px] font-bold uppercase tracking-tight mb-1 transition-colors relative z-10",
                              activeDocTab === nav.id ? "text-primary" : "text-foreground group-hover:text-foreground/80"
                           )}>{nav.t}</p>
                           <p className="text-[10px] text-muted-foreground font-medium relative z-10">{nav.d}</p>
                        </button>
                     ))}
                  </nav>
               </div>

               {/* Right Content Area */}
               <div className="lg:col-span-9 p-0 flex flex-col relative z-10">
                  {/* Mac-style Window Header */}
                  <div className="px-6 py-4 border-b border-white/10 bg-black/40 flex items-center justify-between backdrop-blur-md">
                     <div className="flex items-center gap-4">
                        <div className="flex gap-1.5">
                           <div className="w-3 h-3 rounded-full bg-red-500/80 border border-red-500/50 shadow-[0_0_10px_rgba(239,68,68,0.2)]"></div>
                           <div className="w-3 h-3 rounded-full bg-yellow-500/80 border border-yellow-500/50 shadow-[0_0_10px_rgba(234,179,8,0.2)]"></div>
                           <div className="w-3 h-3 rounded-full bg-green-500/80 border border-green-500/50 shadow-[0_0_10px_rgba(34,197,94,0.2)]"></div>
                        </div>
                        <div className="h-4 w-[1px] bg-white/10 mx-2" />
                        <div className="flex items-center gap-2 text-muted-foreground/50">
                           <Globe size={12} />
                           <span className="text-[10px] font-mono tracking-wider">
                              {activeDocTab === 'express' && 'express_middleware.js'}
                              {activeDocTab === 'fastify' && 'fastify_plugin.js'}
                              {activeDocTab === 'http' && 'http_wrapper.js'}
                              {activeDocTab === 'schema' && 'payload_v1.2.json'}
                           </span>
                        </div>
                     </div>
                     <div className="flex items-center gap-6">
                        <span className="text-[9px] font-bold text-tech-emerald uppercase tracking-widest flex items-center gap-2 font-mono bg-tech-emerald/10 px-2 py-1 rounded">
                           <div className="h-1.5 w-1.5 rounded-full bg-tech-emerald animate-pulse" /> Node.js Native
                        </span>
                     </div>
                  </div>

                  {/* Split View: Left=Explanation, Right=Terminal */}
                  <div className="flex-1 grid grid-cols-1 xl:grid-cols-2 relative bg-background/20">
                     {/* Subtle background glow */}
                     <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/10 blur-[120px] rounded-full pointer-events-none z-0" />

                     {/* Explanation Side */}
                     <div className="p-10 border-b xl:border-b-0 xl:border-r border-white/10 relative z-10 flex flex-col justify-center">
                        <h3 className="text-[11px] font-black text-foreground uppercase tracking-widest mb-6 flex items-center gap-2">
                           {activeDocTab === 'schema' ? <Database size={14} className="text-primary" /> : <Zap size={14} className="text-primary" />}
                           {activeDocTab === 'schema' ? 'Data Structure' : 'Execution Logic'}
                        </h3>
                        <div className="space-y-6">
                           <p className="text-[13px] text-muted-foreground font-medium leading-relaxed">
                              {activeDocTab === 'express' && 'Our Express middleware captures performance telemetry automatically. It logs the hit after the response finishes, never blocking the client.'}
                              {activeDocTab === 'fastify' && 'Our Fastify plugin uses the native onResponse hook. It guarantees telemetry is shipped only after the client has safely received their response.'}
                              {activeDocTab === 'http' && 'Our zero-dependency wrapper seamlessly intercepts raw Node.js HTTP requests, logging telemetry without modifying your core handler logic.'}
                              {activeDocTab === 'schema' && 'The OrionOps protocol requires a standardized set of keys to ensure your charts and metrics are aggregated with high precision.'}
                           </p>

                           <div className="bg-black/40 border border-white/5 p-6 rounded-xl space-y-4 shadow-inner">
                              <h4 className="text-[9px] font-bold text-foreground/80 uppercase tracking-[0.2em]">
                                 {activeDocTab === 'schema' ? 'Core Properties' : 'The Ingestion Rule'}
                              </h4>
                              {activeDocTab === 'schema' ? (
                                 <div className="space-y-2">
                                    <p className="text-[11px] font-mono text-muted-foreground"><span className="text-primary">serviceName</span>: string</p>
                                    <p className="text-[11px] font-mono text-muted-foreground"><span className="text-primary">latencyMs</span>: number</p>
                                 </div>
                              ) : (
                                 <p className="text-[12px] text-muted-foreground leading-relaxed italic font-sans border-l-2 border-primary/50 pl-3">
                                    "If it speaks HTTP, it speaks OrionOps."
                                 </p>
                              )}
                              <div className="grid grid-cols-2 gap-4 pt-4 mt-2 border-t border-white/5">
                                 <div>
                                    <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider mb-1">Method</p>
                                    <p className="text-[12px] font-mono text-primary font-bold">POST</p>
                                 </div>
                                 <div>
                                    <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider mb-1">Payload</p>
                                    <p className="text-[12px] font-mono text-foreground/90">JSON</p>
                                 </div>
                              </div>
                           </div>
                        </div>
                     </div>

                     {/* Code Editor Side */}
                     <div className="bg-black/40 p-10 font-mono text-[13px] leading-relaxed relative group overflow-hidden z-10 flex flex-col justify-center">
                        <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity z-20">
                           <button className="bg-white/10 hover:bg-white/20 text-white p-2 rounded-md transition-all cursor-pointer hover:scale-105 active:scale-95 shadow-lg backdrop-blur-md border border-white/10">
                              <Copy size={14} />
                           </button>
                        </div>

                        <div className="relative">
                           <AnimatePresence mode="wait">
                              <motion.div
                                 key={activeDocTab}
                                 initial={{ opacity: 0, x: 10, filter: "blur(4px)" }}
                                 animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
                                 exit={{ opacity: 0, x: -10, filter: "blur(4px)" }}
                                 transition={{ duration: 0.3 }}
                              >
                                 {activeDocTab === 'express' && (
                                    <>
                                       <pre className="text-white/30 italic mb-6">// Express Middleware Pattern</pre>
                                       <pre className="text-white"><span className="text-blue-400">const</span> orionops = <span className="text-purple-400">require</span>(<span className="text-emerald-400">'orionops'</span>);</pre>
                                       <br />
                                       <pre className="text-white">app.<span className="text-blue-300">use</span>(orionops({"{"}</pre>
                                       <pre className="text-white">  apiKey: <span className="text-emerald-400">'YOUR_API_KEY'</span>,</pre>
                                       <pre className="text-white">  serviceName: <span className="text-emerald-400">'express-api'</span></pre>
                                       <pre className="text-white">{"}"}));</pre>
                                    </>
                                 )}

                                 {activeDocTab === 'fastify' && (
                                    <>
                                       <pre className="text-white/30 italic mb-6">// Fastify Plugin Pattern</pre>
                                       <pre className="text-white"><span className="text-blue-400">const</span> orionopsFastify = <span className="text-purple-400">require</span>(<span className="text-emerald-400">'orionops/adapters/fastify'</span>);</pre>
                                       <br />
                                       <pre className="text-white">fastify.<span className="text-blue-300">register</span>(orionopsFastify, {"{"}</pre>
                                       <pre className="text-white">  apiKey: <span className="text-emerald-400">'YOUR_API_KEY'</span>,</pre>
                                       <pre className="text-white">  serviceName: <span className="text-emerald-400">'fastify-api'</span></pre>
                                       <pre className="text-white">{"}"});</pre>
                                    </>
                                 )}

                                 {activeDocTab === 'http' && (
                                    <>
                                       <pre className="text-white/30 italic mb-6">// Raw Node.js HTTP Wrapper</pre>
                                       <pre className="text-white"><span className="text-blue-400">const</span> {"{"} wrapHandler {"}"} = <span className="text-purple-400">require</span>(<span className="text-emerald-400">'orionops/adapters/http'</span>);</pre>
                                       <br />
                                       <pre className="text-white">http.<span className="text-blue-300">createServer</span>(wrapHandler(handler, {"{"}</pre>
                                       <pre className="text-white">  apiKey: <span className="text-emerald-400">'YOUR_API_KEY'</span>,</pre>
                                       <pre className="text-white">  serviceName: <span className="text-emerald-400">'raw-node-api'</span></pre>
                                       <pre className="text-white">{"}"}));</pre>
                                    </>
                                 )}

                                 {activeDocTab === 'schema' && (
                                    <>
                                       <pre className="text-white/30 italic mb-6">// Ingestion Schema Definition</pre>
                                       <pre className="text-white">{"{"}</pre>
                                       <pre className="text-white">  <span className="text-blue-300">"serviceName"</span>: <span className="text-emerald-400">"string"</span>,</pre>
                                       <pre className="text-white">  <span className="text-blue-300">"endpoint"</span>: <span className="text-emerald-400">"string"</span>,</pre>
                                       <pre className="text-white">  <span className="text-blue-300">"method"</span>: <span className="text-emerald-400">"GET | POST | etc"</span>,</pre>
                                       <pre className="text-white">  <span className="text-blue-300">"statusCode"</span>: <span className="text-purple-400">number</span>,</pre>
                                       <pre className="text-white">  <span className="text-blue-300">"latencyMs"</span>: <span className="text-purple-400">number</span></pre>
                                       <pre className="text-white">{"}"}</pre>
                                    </>
                                 )}
                                 <br />
                                 <pre className="text-white/30 italic mt-4">// 202 Accepted</pre>
                              </motion.div>
                           </AnimatePresence>
                        </div>
                     </div>
                  </div>

                  {/* Bottom Footer */}
                  <div className="px-10 py-6 border-t border-white/10 bg-black/60 flex items-center justify-between backdrop-blur-md relative z-10">
                     <div className="flex gap-10">
                        <div className="flex items-center gap-2">
                           <ShieldCheck size={14} className="text-muted-foreground" />
                           <span className="text-[10px] font-bold text-foreground uppercase tracking-widest font-mono">Secure Ingestion</span>
                        </div>
                        <div className="flex items-center gap-2">
                           <Cpu size={14} className="text-muted-foreground" />
                           <span className="text-[10px] font-bold text-foreground uppercase tracking-widest font-mono">Any Architecture</span>
                        </div>
                     </div>
                     <Link to="/docs" className="text-[11px] font-black text-primary uppercase tracking-widest hover:underline flex items-center gap-2 cursor-pointer transition-transform hover:scale-105 active:scale-95">
                        View Full API Spec <ArrowUpRight size={14} />
                     </Link>
                  </div>
               </div>
            </div>
         </motion.div>
      </section>
   );
};
