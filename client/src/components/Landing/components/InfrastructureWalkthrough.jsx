import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Cpu, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { TechLogo } from "./TechLogo";
import { SectionLabel } from "./SectionLabel";

export const InfrastructureWalkthrough = () => {
   const [step, setStep] = useState(0);
   const [queueDepth, setQueueDepth] = useState(0);

   useEffect(() => {
      const timer = setInterval(() => {
         setStep((prev) => (prev + 1) % 5);
      }, 1200);
      return () => clearInterval(timer);
   }, []);

   useEffect(() => {
      // Simulate queue depth ticking randomly 0-3
      const interval = setInterval(() => {
         setQueueDepth(Math.floor(Math.random() * 4));
      }, 2000);
      return () => clearInterval(interval);
   }, []);

   const stations = [
      { id: 0, title: "Your App", label: "Request sent...", caption: "Middleware times and reports the hit — never blocks your response" },
      { id: 1, title: "API + Queue", label: "Queued for processing", caption: "RabbitMQ holds events so ingestion never blocks on database speed" },
      { id: 2, title: "Worker", label: "Validating event...", caption: "Background consumer validates and writes to two data stores" },
      { id: 3, title: "Storage", label: "Saved to MongoDB + PostgreSQL", caption: "Raw logs in MongoDB, aggregated stats in PostgreSQL — separate stores for different access patterns" }
   ];

   return (
      <div id="how-it-works" className="max-w-[1600px] mx-auto px-10 py-20 flex flex-col justify-center min-h-screen">
         <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="w-full"
         >
            <div className="flex flex-col items-center text-center mb-24">
               <SectionLabel number="03" title="Data Lifecycle" />
               <h2 className="text-[40px] lg:text-[64px] font-bold tracking-tighter text-foreground uppercase leading-[0.85] mt-6">
                  Real-Time<br /> <span className="text-muted-foreground">Event Architecture.</span>
               </h2>
            </div>

            <div className="relative w-full max-w-6xl mx-auto mt-10 z-10">
               {/* Horizontal Background Line (Desktop) */}
               <div className="hidden md:block absolute top-[40px] left-[12.5%] right-[12.5%] h-[2px] border-t-2 border-dashed border-border/50 z-0" />

               {/* Horizontal Progress Line (Desktop) */}
               <div className="hidden md:block absolute top-[40px] left-[12.5%] h-[2px] bg-primary z-0 transition-all duration-1000 ease-in-out shadow-[0_0_15px_rgba(0,255,150,0.5)]" style={{ width: `${Math.min(step, 3) * 25}%` }} />

               {/* Traveling dot MD */}
               <motion.div
                  className="hidden md:block absolute z-10 w-4 h-4 rounded-full bg-primary shadow-[0_0_20px_rgba(0,255,150,1)] top-[40px] -translate-y-1/2 -ml-2"
                  animate={{ left: `${12.5 + Math.min(step, 3) * 25}%`, opacity: step === 4 ? 0 : 1 }}
                  transition={{ duration: 0.8, ease: "easeInOut" }}
               />

               <div className="flex flex-col md:grid md:grid-cols-4 gap-12 md:gap-0 relative">
                  {/* Vertical Line (Mobile) */}
                  <div className="md:hidden absolute top-[40px] bottom-[40px] left-[40px] w-[2px] border-l-2 border-dashed border-border/50 z-0" />

                  {stations.map((s, i) => (
                     <div key={i} className="flex flex-row md:flex-col items-center md:text-center relative z-10 md:px-4 group w-full">

                        {/* Icon Box Container (Fixed width for left-alignment on mobile) */}
                        <div className="w-[80px] md:w-full flex-shrink-0 flex justify-center md:mb-6 relative z-10">
                           <div className={cn(
                              "w-20 h-20 rounded-2xl border-2 flex items-center justify-center bg-background/95 backdrop-blur-md relative transition-all duration-500",
                              step === i ? "border-primary shadow-[0_0_30px_-5px_rgba(0,255,150,0.4)] md:scale-110" : "border-border/50 grayscale opacity-60"
                           )}>
                              {/* The icon itself */}
                              {i === 0 && <TechLogo name="nodejs" className="w-10 h-10" />}
                              {i === 1 && <TechLogo name="rabbitmq" className="w-10 h-10" />}
                              {i === 2 && <Cpu className="w-10 h-10 text-primary" />}
                              {i === 3 && (
                                 <div className="flex gap-2">
                                    <TechLogo name="mongodb" className="w-6 h-6" />
                                    <TechLogo name="postgres" className="w-6 h-6" />
                                 </div>
                              )}

                              {/* Checkmark flash on complete */}
                              {i === 3 && step === 4 && (
                                 <motion.div
                                    initial={{ scale: 0, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    exit={{ scale: 0, opacity: 0 }}
                                    className="absolute -top-2 -right-2 bg-emerald-500 rounded-full p-1.5 shadow-lg"
                                 >
                                    <CheckCircle2 size={16} className="text-black" />
                                 </motion.div>
                              )}

                              {/* Queue Depth for station 1 */}
                              {i === 1 && (
                                 <div className="absolute -bottom-3 px-2 py-0.5 rounded text-[10px] font-mono border border-border bg-black text-muted-foreground flex items-center gap-1 shadow-lg">
                                    Queue: <span className="text-primary">{queueDepth}</span>
                                 </div>
                              )}
                           </div>
                        </div>

                        {/* Text Content */}
                        <div className="flex flex-col items-start md:items-center ml-6 md:ml-0 w-full">
                           <h3 className="text-[18px] font-bold text-foreground mb-2 text-left md:text-center">{s.title}</h3>

                           {/* Status Label (glows when active) */}
                           <div className="h-6 mb-3 flex md:justify-center w-full md:w-auto">
                              {step === i && (
                                 <motion.span
                                    initial={{ opacity: 0, y: 5 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="px-2 py-1 bg-primary/10 border border-primary/30 rounded text-[10px] font-mono text-primary uppercase tracking-wider inline-block text-left md:text-center"
                                 >
                                    {s.label}
                                 </motion.span>
                              )}
                           </div>

                           {/* Caption */}
                           <p className="text-[13px] text-muted-foreground/80 leading-relaxed md:max-w-[220px] text-left md:text-center">
                              {s.caption}
                           </p>
                        </div>
                     </div>
                  ))}
               </div>
            </div>
         </motion.div>
      </div>
   );
};
