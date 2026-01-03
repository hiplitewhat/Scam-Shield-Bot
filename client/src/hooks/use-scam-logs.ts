import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl } from "@shared/routes";
import { type ScamLog, type Setting } from "@shared/schema";

// === LOGS ===
export function useScamLogs() {
  return useQuery({
    queryKey: [api.logs.list.path],
    queryFn: async () => {
      const res = await fetch(api.logs.list.path);
      if (!res.ok) throw new Error("Failed to fetch logs");
      return api.logs.list.responses[200].parse(await res.json());
    },
    refetchInterval: 5000, // Poll every 5s for realtime feel
  });
}

// === STATS ===
export function useScamStats() {
  return useQuery({
    queryKey: [api.logs.stats.path],
    queryFn: async () => {
      const res = await fetch(api.logs.stats.path);
      if (!res.ok) throw new Error("Failed to fetch stats");
      return api.logs.stats.responses[200].parse(await res.json());
    },
    refetchInterval: 10000,
  });
}

// === SETTINGS ===
export function useSettings() {
  return useQuery({
    queryKey: [api.settings.list.path],
    queryFn: async () => {
      const res = await fetch(api.settings.list.path);
      if (!res.ok) throw new Error("Failed to fetch settings");
      return api.settings.list.responses[200].parse(await res.json());
    },
  });
}

export function useUpdateSetting() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ key, value }: { key: string; value: string }) => {
      const res = await fetch(api.settings.update.path, {
        method: api.settings.update.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key, value }),
      });
      if (!res.ok) throw new Error("Failed to update setting");
      return api.settings.update.responses[200].parse(await res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.settings.list.path] });
    },
  });
}
