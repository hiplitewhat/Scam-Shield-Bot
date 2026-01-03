import { useSettings, useUpdateSetting } from "@/hooks/use-scam-logs";
import { motion } from "framer-motion";
import { Settings, Save, RefreshCw } from "lucide-react";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";

export function SettingsPanel() {
  const { data: settings, isLoading } = useSettings();
  const updateMutation = useUpdateSetting();
  const { toast } = useToast();
  
  // Local state for forms
  const [formData, setFormData] = useState<Record<string, string>>({});

  useEffect(() => {
    if (settings) {
      const initialData: Record<string, string> = {};
      settings.forEach(s => {
        initialData[s.key] = s.value;
      });
      setFormData(initialData);
    }
  }, [settings]);

  const handleSave = (key: string) => {
    updateMutation.mutate({ key, value: formData[key] }, {
      onSuccess: () => {
        toast({
          title: "Setting Updated",
          description: `Successfully updated ${key}`,
        });
      },
      onError: () => {
        toast({
          title: "Update Failed",
          description: "Could not save setting.",
          variant: "destructive",
        });
      }
    });
  };

  if (isLoading) return <div className="h-64 flex items-center justify-center text-muted-foreground animate-pulse">Loading settings...</div>;

  return (
    <div className="bg-card border border-border rounded-xl p-6 shadow-lg shadow-black/20">
      <h3 className="font-display text-lg font-bold flex items-center gap-2 mb-6 border-b border-border pb-4">
        <Settings className="w-5 h-5 text-accent" />
        Bot Configuration
      </h3>

      <div className="space-y-6">
        {settings?.map((setting) => (
          <motion.div 
            key={setting.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="group"
          >
            <label className="block text-sm font-medium text-muted-foreground mb-2 font-mono uppercase text-xs tracking-wider">
              {setting.key.replace(/_/g, " ")}
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={formData[setting.key] || ""}
                onChange={(e) => setFormData(prev => ({ ...prev, [setting.key]: e.target.value }))}
                className="flex-1 bg-background border border-border rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all font-mono"
              />
              <button
                onClick={() => handleSave(setting.key)}
                disabled={updateMutation.isPending}
                className="
                  px-4 py-2 rounded-lg bg-accent/10 text-accent border border-accent/20
                  hover:bg-accent hover:text-accent-foreground transition-all
                  disabled:opacity-50 disabled:cursor-not-allowed
                  flex items-center gap-2
                "
              >
                {updateMutation.isPending ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <Save className="w-4 h-4" />
                )}
                Save
              </button>
            </div>
          </motion.div>
        ))}

        {(!settings || settings.length === 0) && (
          <div className="text-center py-8 text-muted-foreground italic">
            No configurable settings found.
          </div>
        )}
      </div>
    </div>
  );
}
