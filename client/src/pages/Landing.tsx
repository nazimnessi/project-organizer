import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ArrowRight, Code2, Database, ShieldCheck, Bug, Lightbulb, CheckSquare } from "lucide-react";

export default function Landing() {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-screen bg-background text-foreground overflow-hidden selection:bg-primary/20">
      {/* Background Gradient */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] rounded-full bg-primary/10 blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] rounded-full bg-indigo-500/10 blur-[150px]" />
      </div>

      <nav className="relative z-10 container mx-auto px-6 py-6 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="bg-primary/10 p-2 rounded-lg border border-primary/20">
            <Code2 className="w-6 h-6 text-primary" />
          </div>
          <span className="font-display font-bold text-xl tracking-tight">Project Hub</span>
        </div>
        <Button asChild variant="outline" className="border-primary/20 hover:bg-primary/10 hover:text-primary">
          <a href="/api/login">Log In</a>
        </Button>
      </nav>

      <main className="relative z-10 container mx-auto px-6 pt-20 pb-32">
        <motion.div 
          variants={container}
          initial="hidden"
          animate="show"
          className="max-w-4xl mx-auto text-center"
        >
          <motion.div variants={item} className="mb-6 inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-secondary/30 border border-white/5 text-sm font-medium text-primary-foreground/80">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
            </span>
            Private Project Documentation
          </motion.div>
          
          <motion.h1 variants={item} className="text-5xl md:text-7xl font-display font-bold leading-[1.1] mb-8 bg-gradient-to-br from-white via-white/90 to-white/50 bg-clip-text text-transparent">
            Your personal engineering <br className="hidden md:block"/> knowledge base.
          </motion.h1>
          
          <motion.p variants={item} className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed">
            Stop losing track of your side projects. Centralize your environment variables, test users, bug reports, and improvement backlogs in one secure place.
          </motion.p>
          
          <motion.div variants={item} className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button asChild size="lg" className="h-14 px-8 text-lg rounded-full shadow-[0_0_40px_-10px_rgba(59,130,246,0.5)]">
              <a href="/api/login">
                Start Documenting <ArrowRight className="ml-2 w-5 h-5" />
              </a>
            </Button>
          </motion.div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="mt-32 grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          <FeatureCard 
            icon={<ShieldCheck className="w-8 h-8 text-emerald-400" />}
            title="Secure Credentials"
            description="Store environment variables, API keys, and test user accounts securely. Never forget your admin login again."
          />
          <FeatureCard 
            icon={<Database className="w-8 h-8 text-blue-400" />}
            title="Tech Stack Tracking"
            description="Document your database schemas, deployment pipelines, and repo links for every project."
          />
          <FeatureCard 
            icon={<Bug className="w-8 h-8 text-rose-400" />}
            title="Backlog Management"
            description="Keep track of bugs, feature requests, and improvements so you know exactly where you left off."
          />
        </motion.div>

        {/* Visual Preview */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="mt-24 rounded-xl border border-white/10 shadow-2xl overflow-hidden glass-panel max-w-5xl mx-auto"
        >
          <div className="bg-black/40 border-b border-white/5 p-4 flex gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500/50" />
            <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
            <div className="w-3 h-3 rounded-full bg-green-500/50" />
          </div>
          <div className="p-8 md:p-12 bg-gradient-to-b from-card/50 to-background/50">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-4">
                <div className="h-4 w-32 bg-white/10 rounded animate-pulse" />
                <div className="h-3 w-24 bg-white/5 rounded animate-pulse" />
                <div className="h-3 w-28 bg-white/5 rounded animate-pulse" />
              </div>
              <div className="col-span-2 space-y-6">
                 <div className="h-32 bg-white/5 rounded-lg border border-white/5 p-4 space-y-3">
                    <div className="flex gap-2">
                       <CheckSquare className="w-5 h-5 text-primary/50" />
                       <div className="h-4 w-3/4 bg-white/10 rounded" />
                    </div>
                    <div className="flex gap-2">
                       <Bug className="w-5 h-5 text-red-400/50" />
                       <div className="h-4 w-1/2 bg-white/10 rounded" />
                    </div>
                    <div className="flex gap-2">
                       <Lightbulb className="w-5 h-5 text-yellow-400/50" />
                       <div className="h-4 w-2/3 bg-white/10 rounded" />
                    </div>
                 </div>
              </div>
            </div>
          </div>
        </motion.div>
      </main>

      <footer className="border-t border-white/5 py-12 text-center text-muted-foreground">
        <p>© 2024 Project Hub. Built for builders.</p>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="p-8 rounded-2xl bg-card/40 border border-white/5 hover:bg-card/60 transition-colors">
      <div className="mb-6 p-3 bg-white/5 rounded-xl inline-block w-fit">
        {icon}
      </div>
      <h3 className="text-xl font-bold font-display mb-3 text-foreground">{title}</h3>
      <p className="text-muted-foreground leading-relaxed">
        {description}
      </p>
    </div>
  );
}
