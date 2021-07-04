import * as ms from 'ms';
import { ServerInfo } from '../definitions';
import MinecraftServerListPing from '../utils/MinecraftServerListPing';

export default class MinecraftStatus {
  private latestInfo: ServerInfo;
  private ip: string;
  private port: string;
  private timeout: number;
  constructor(ip: string, port: string) {
    this.ip = ip;
    this.port = port;
    this.timeout = ms('1m');
  }

  public async ping(): Promise<ServerInfo> {
    const info = await MinecraftServerListPing.ping(
      4,
      this.ip,
      Number(this.port),
      this.timeout,
    );

    this.latestInfo = {
      status: info.version.name ? 'success' : 'error',
      error: null,
      online: Boolean(info.version.name),
      motd: info.description?.text,
      favicon: info.favicon ? encodeURIComponent(info.favicon) : null,
      players: {
        max: info.players.max,
        now: info.players.online,
        sample: info.players.sample,
      },
      server: {
        name: info.description?.text,
        protocol: info.version.protocol,
      },
      timestamp: new Date().getTime(),
    };

    return this.latestInfo;
  }
}
