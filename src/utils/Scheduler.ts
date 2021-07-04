export default class Scheduler {
  private time: number;
  private callback: () => Promise<void>;
  private interval: NodeJS.Timeout;
  constructor(time: number) {
    this.time = time;
  }

  public start(callback: () => Promise<void>): void {
    if (this.interval) this.stop();
    this.callback = callback;
    this.interval = setInterval(async () => {
      await this.callback();
    }, this.time);
  }

  public stop(): void {
    if (!this.interval) return;
    clearInterval(this.interval);
    this.interval = null;
  }
}
