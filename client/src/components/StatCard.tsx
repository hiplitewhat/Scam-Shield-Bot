import { motion } from "framer-motion";
import { Divide, LucideIcon } from "lucide-react";

interface StatCardProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  trend?: string;
  color?: "primary" | "accent" | "secondary";
}

export function StatCard({ label, value, icon: Icon, trend, color = "primary" }: StatCardProps) {
  const colors = {
    primary: "text-primary border-primary/20 bg-primary/5",
    accent: "text-accent border-accent/20 bg-accent/5",
    secondary: "text-blue-500 border-blue-500/20 bg-blue-500/5",
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`
        relative overflow-hidden rounded-xl border p-6
        ${colors[color]}
        backdrop-blur-sm
      `}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium uppercase tracking-wider opacity-70 mb-1">{label}</p>
          <h3 className="text-3xl font-display font-bold">{value}</h3>
          {trend && <p className="text-xs mt-2 opacity-60 font-mono">{trend}</p>}
        </div>
        <div className={`p-3 rounded-lg bg-background/50 border border-current opacity-80`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
      
      {/* Decorative background element */}
      <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-current opacity-5 blur-2xl rounded-full" />
    </motion.div>
  );
}
