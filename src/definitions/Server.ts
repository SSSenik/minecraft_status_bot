export interface ServerInfo {
  status: 'success' | 'error';
  online: boolean;
  motd: string;
  favicon: string | null;
  error: 'string' | null;
  players: {
    max: number;
    now: number;
    sample: { name: string; id: string }[];
  } | null;
  server: { name: string; protocol: number };
  last_updated?: string;
  last_online?: string;
  duration?: number;
  timestamp: number;
}
