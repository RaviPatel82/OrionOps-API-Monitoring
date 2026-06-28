import React from "react";
import { motion } from "framer-motion";
import { Key } from "lucide-react";
import { SectionLabel } from "./SectionLabel";
import { BentoCard } from "./BentoCard";

export const FeaturesSection = () => {
   return (
      <>
         <div className="py-12 border-y border-border bg-secondary/40 overflow-hidden relative z-10">
            <div className="flex whitespace-nowrap">
               <motion.div
                  animate={{ x: ["0%", "-50%"] }}
                  transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                  className="flex items-center gap-20 pr-20 w-max"
               >
                  {[
                     "Real-Time Analytics", "Zero Configuration", "Distributed Tracing",
                     "Secure API Keys", "Payload Inspection", "Error Tracking", "Rate Limiting",
                     "Real-Time Analytics", "Zero Configuration", "Distributed Tracing",
                     "Secure API Keys", "Payload Inspection", "Error Tracking", "Rate Limiting"
                  ].map((benefit, i) => (
                     <div key={i} className="flex items-center gap-20 group cursor-default">
                        <span className="text-[16px] font-bold tracking-[0.2em] text-foreground uppercase opacity-40 group-hover:opacity-100 group-hover:text-primary transition-all">
                           {benefit}
                        </span>
                        <div className="h-1.5 w-1.5 rounded-full bg-primary/40 group-hover:bg-primary transition-colors" />
                     </div>
                  ))}
               </motion.div>
            </div>
         </div>

         <section id="features" className="px-10 relative z-10 min-h-screen flex items-center">
            <div className="max-w-[1600px] mx-auto w-full py-20">
               <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.6 }}
                  className="flex flex-col lg:flex-row lg:items-end justify-between mb-16"
               >
                  <div className="max-w-2xl">
                     <SectionLabel number="02" title="Core Features" />
                     <h2 className="text-[40px] lg:text-[64px] font-bold tracking-tighter text-foreground uppercase leading-[0.85]">
                        Everything You Need<br /> <span className="text-muted-foreground">To Manage Your APIs.</span>
                     </h2>
                  </div>
               </motion.div>
               <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[340px]"
               >
                  {/* Card 1: Live Traffic */}
                  <BentoCard
                     className="md:col-span-2"
                     title="Live Traffic Tracking"
                     description="See exactly who is calling your APIs and how fast your system is responding in real-time. Gain total visibility into your traffic patterns."
                  >
                     <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
                     <div className="relative w-full h-full flex items-end justify-center gap-2 p-6 pb-0 overflow-hidden">
                        {[40, 70, 45, 90, 65, 85, 110, 75, 50].map((h, i) => (
                           <motion.div
                              key={i}
                              className="w-8 rounded-t-sm bg-primary/20 border-t border-primary/50 relative overflow-hidden"
                              style={{ height: `${h}%` }}
                              initial={{ y: "100%" }}
                              whileInView={{ y: 0 }}
                              transition={{ duration: 0.5, delay: i * 0.05 + 0.2, type: "spring" }}
                           >
                              <motion.div
                                 className="absolute top-0 left-0 right-0 h-[2px] bg-primary"
                                 animate={{ opacity: [0.3, 1, 0.3] }}
                                 transition={{ duration: 2, repeat: Infinity, delay: i * 0.2 }}
                              />
                           </motion.div>
                        ))}
                     </div>
                  </BentoCard>

                  {/* Card 2: Multi-Tenant Data */}
                  <BentoCard
                     className="md:col-span-1"
                     title="Multi-Tenant Data"
                     description="Keep your different business clients or environments organized and securely separated."
                  >
                     <div className="relative w-full h-full flex flex-col items-center justify-center gap-4">
                        <div className="w-32 h-12 bg-background border border-border/50 rounded-xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.5)] flex items-center px-4 gap-3 z-30 group-hover:-translate-y-2 transition-transform duration-500">
                           <div className="w-6 h-6 rounded-full bg-blue-500/20 border border-blue-500/50"></div>
                           <div className="w-12 h-2 rounded-full bg-border"></div>
                        </div>
                        <div className="w-32 h-12 bg-background border border-border/50 rounded-xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.5)] flex items-center px-4 gap-3 z-20 -mt-8 scale-95 opacity-80 group-hover:mt-2 transition-all duration-500">
                           <div className="w-6 h-6 rounded-full bg-emerald-500/20 border border-emerald-500/50"></div>
                           <div className="w-12 h-2 rounded-full bg-border"></div>
                        </div>
                        <div className="w-32 h-12 bg-background border border-border/50 rounded-xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.5)] flex items-center px-4 gap-3 z-10 -mt-8 scale-90 opacity-60 group-hover:mt-2 transition-all duration-500">
                           <div className="w-6 h-6 rounded-full bg-purple-500/20 border border-purple-500/50"></div>
                           <div className="w-12 h-2 rounded-full bg-border"></div>
                        </div>
                     </div>
                  </BentoCard>

                  {/* Card 3: Secure API Keys */}
                  <BentoCard
                     className="md:col-span-1"
                     title="Secure API Keys"
                     description="Generate scoped API keys per client to securely manage and track access across your system."
                  >
                     <div className="relative w-full h-full flex items-center justify-center p-6">
                        <div className="absolute w-[150px] h-[150px] bg-primary/20 blur-[60px] rounded-full group-hover:bg-primary/30 transition-colors duration-500"></div>
                        <div className="relative w-full bg-[#0a0a0a] border border-white/10 rounded-xl p-4 flex items-center justify-between shadow-2xl group-hover:scale-105 transition-transform duration-500">
                           <div className="flex items-center gap-3">
                              <Key className="text-primary" size={16} />
                              <span className="text-[12px] font-mono text-muted-foreground">sk_live_••••••••</span>
                           </div>
                           <div className="w-6 h-6 rounded-md bg-white/5 flex items-center justify-center">
                              <div className="w-2.5 h-2.5 border border-muted-foreground/50 rounded-sm"></div>
                           </div>
                        </div>
                     </div>
                  </BentoCard>

                  {/* Card 4: Payload Inspection */}
                  <BentoCard
                     className="md:col-span-2"
                     title="Payload Inspection"
                     description="Deep dive into the bodies of your HTTP requests and responses. Debug faster by seeing exactly what your users are sending and receiving."
                  >
                     <div className="absolute inset-0 bg-[#050505] opacity-50"></div>
                     <div className="relative w-full h-full p-2 sm:p-3 flex flex-col justify-center items-center">
                        <div className="w-full max-w-[400px] bg-[#0d0d0d] border border-white/5 rounded-xl overflow-hidden shadow-2xl group-hover:-translate-y-2 group-hover:shadow-[0_20px_40px_-10px_rgba(0,0,0,0.8)] transition-all duration-500">
                           <div className="flex items-center px-4 py-1.5 bg-white/[0.02] border-b border-white/5">
                              <div className="flex gap-1.5">
                                 <div className="w-2.5 h-2.5 rounded-full bg-red-500/20 border border-red-500/50"></div>
                                 <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/20 border border-yellow-500/50"></div>
                                 <div className="w-2.5 h-2.5 rounded-full bg-green-500/20 border border-green-500/50"></div>
                              </div>
                              <span className="ml-4 text-[9px] text-muted-foreground/50 font-mono">response.json</span>
                           </div>
                           <div className="p-3 sm:p-4 font-mono text-[9px] sm:text-[10px] leading-relaxed">
                              <span className="text-white/40">{"{"}</span><br />
                              <span className="text-white/40 ml-4">"data": </span><span className="text-white/40">{"{"}</span><br />
                              <span className="text-white/40 ml-8">"serviceName": </span><span className="text-blue-400">"User_Service"</span>,<br />
                              <span className="text-white/40 ml-8">"endpoint": </span><span className="text-purple-400">"/v1/users/all"</span>,<br />
                              <span className="text-white/40 ml-8">"method": </span><span className="text-purple-400">"GET"</span>,<br />
                              <span className="text-white/40 ml-8">"latencyMs": </span><span className="text-emerald-400">45</span>,<br />
                              <span className="text-white/40 ml-4">{"}"}</span><br />
                              <span className="text-white/40">{"}"}</span>
                           </div>
                        </div>
                     </div>
                  </BentoCard>
               </motion.div>
            </div>
         </section>
      </>
   );
};
