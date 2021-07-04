import axios from 'axios';
import * as ms from 'ms';
import { ServerInfo } from '../definitions';

export default class AxiosChecker {
  private latestInfo: ServerInfo;
  private ip: string;
  constructor(ip: string) {
    this.ip = ip;
  }

  public async ping(): Promise<ServerInfo | null> {
    const currentTime = new Date().getTime();
    if (this.latestInfo) {
      const lastPing = this.latestInfo.timestamp;
      if (currentTime - lastPing < ms('1m')) {
        return this.latestInfo;
      }
    }

    const { data } = await axios.get(
      `https://mcapi.us/server/status?ip=${this.ip}`,
    );

    this.latestInfo = {
      ...(<ServerInfo>data),
      timestamp: new Date().getTime(),
    };

    return this.latestInfo;
  }
}
