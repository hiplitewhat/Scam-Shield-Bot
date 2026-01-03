import { useScamLogs, useScamStats } from "@/hooks/use-scam-logs";
import { StatCard } from "@/components/StatCard";
import { LogsTable } from "@/components/LogsTable";
import { SettingsPanel } from "@/components/SettingsPanel";
import { Shield, Activity, Users, AlertOctagon, Terminal } from "lucide-react";

export default function Dashboard() {
  const { data: logs, isLoading: logsLoading } = useScamLogs();
  const { data: stats, isLoading: statsLoading } = useScamStats();

  const isLoading = logsLoading || statsLoading;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center space-y-4">
        <div className="relative w-24 h-24">
          <div className="absolute inset-0 border-4 border-primary/20 rounded-full animate-ping"></div>
          <div className="absolute inset-0 border-4 border-t-primary rounded-full animate-spin"></div>
          <Shield className="absolute inset-0 m-auto text-primary w-10 h-10 animate-pulse" />
        </div>
        <p className="font-mono text-primary animate-pulse text-sm">INITIALIZING SECURITY PROTOCOLS...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground pb-20 grid-bg">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg border border-primary/20">
              <Shield className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h1 className="text-xl font-display font-bold leading-none">Sentinel<span className="text-primary">AI</span></h1>
              <p className="text-[10px] font-mono text-muted-foreground tracking-widest uppercase">Scam Detection System</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-500/10 border border-green-500/20 text-green-500 text-xs font-bold font-mono animate-pulse">
              <span className="w-2 h-2 rounded-full bg-green-500"></span>
              SYSTEM ONLINE
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatCard 
            label="Total Scams Blocked" 
            value={stats?.totalScams || 0} 
            icon={AlertOctagon} 
            trend="All time detections"
            color="primary"
          />
          <StatCard 
            label="Last 24 Hours" 
            value={stats?.last24h || 0} 
            icon={Activity} 
            trend="+12% vs yesterday"
            color="accent"
          />
          <StatCard 
            label="Active Monitored Channels" 
            value={3} // Static for now, could be dynamic
            icon={Terminal} 
            trend="Scanning in real-time"
            color="secondary"
          />
        </div>

        {/* Main Content Area */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column: Logs (Takes up 2/3) */}
          <div className="lg:col-span-2 space-y-6">
            <LogsTable logs={stats?.recentLogs || []} />
          </div>

          {/* Right Column: Settings & Info (Takes up 1/3) */}
          <div className="space-y-6">
            <SettingsPanel />
            
            {/* System Info Card */}
            <div className="bg-card border border-border rounded-xl p-6 shadow-lg shadow-black/20">
              <h3 className="font-display text-lg font-bold flex items-center gap-2 mb-4">
                <Terminal className="w-5 h-5 text-muted-foreground" />
                System Status
              </h3>
              <div className="space-y-3 font-mono text-xs">
                <div className="flex justify-between items-center p-2 bg-background rounded border border-border">
                  <span className="text-muted-foreground">OCR ENGINE</span>
                  <span className="text-green-500">ACTIVE</span>
                </div>
                <div className="flex justify-between items-center p-2 bg-background rounded border border-border">
                  <span className="text-muted-foreground">AI MODEL</span>
                  <span className="text-accent">LLAMA-3-8B</span>
                </div>
                <div className="flex justify-between items-center p-2 bg-background rounded border border-border">
                  <span className="text-muted-foreground">LATENCY</span>
                  <span className="text-foreground">45ms</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
