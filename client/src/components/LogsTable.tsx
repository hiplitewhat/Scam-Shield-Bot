import { type ScamLog } from "@shared/schema";
import { format } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, ShieldCheck, Search, Image as ImageIcon } from "lucide-react";
import { useState } from "react";

interface LogsTableProps {
  logs: ScamLog[];
}

export function LogsTable({ logs }: LogsTableProps) {
  const [search, setSearch] = useState("");

  const filteredLogs = logs.filter(log => 
    log.content.toLowerCase().includes(search.toLowerCase()) || 
    log.authorName.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="bg-card border border-border rounded-xl overflow-hidden shadow-lg shadow-black/20">
      <div className="p-4 border-b border-border flex flex-col sm:flex-row justify-between items-center gap-4 bg-secondary/10">
        <h3 className="font-display text-lg font-bold flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-primary" />
          Detections Log
        </h3>
        
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input 
            type="text" 
            placeholder="Search logs..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-background border border-border rounded-lg text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-secondary/30 text-muted-foreground font-display uppercase text-xs tracking-wider">
            <tr>
              <th className="px-6 py-3 font-semibold">Time</th>
              <th className="px-6 py-3 font-semibold">Author</th>
              <th className="px-6 py-3 font-semibold">Content</th>
              <th className="px-6 py-3 font-semibold">Detection</th>
              <th className="px-6 py-3 font-semibold">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/50">
            <AnimatePresence>
              {filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-muted-foreground">
                    No logs found matching your search.
                  </td>
                </tr>
              ) : (
                filteredLogs.map((log) => (
                  <motion.tr 
                    key={log.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0 }}
                    className="hover:bg-primary/5 transition-colors group"
                  >
                    <td className="px-6 py-4 font-mono text-xs text-muted-foreground whitespace-nowrap">
                      {log.detectedAt ? format(new Date(log.detectedAt), 'HH:mm:ss dd/MM') : '-'}
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-medium text-foreground">{log.authorName}</div>
                      <div className="text-xs text-muted-foreground font-mono">{log.authorId}</div>
                    </td>
                    <td className="px-6 py-4 max-w-xs">
                      <div className="truncate text-muted-foreground group-hover:text-foreground transition-colors">
                        {log.content}
                      </div>
                      {log.ocrText && (
                        <div className="flex items-center gap-1 mt-1 text-xs text-accent">
                          <ImageIcon className="w-3 h-3" />
                          <span className="truncate max-w-[200px]">OCR: {log.ocrText}</span>
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`
                        inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border
                        ${log.isScam 
                          ? 'bg-red-500/10 text-red-500 border-red-500/20' 
                          : 'bg-green-500/10 text-green-500 border-green-500/20'
                        }
                      `}>
                        {log.isScam && <AlertTriangle className="w-3 h-3" />}
                        {log.isScam ? 'SCAM DETECTED' : 'SAFE'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-mono text-xs px-2 py-1 bg-secondary rounded border border-border">
                        {log.actionTaken?.toUpperCase()}
                      </span>
                    </td>
                  </motion.tr>
                ))
              )}
            </AnimatePresence>
          </tbody>
        </table>
      </div>
    </div>
  );
}
