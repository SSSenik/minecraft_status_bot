import * as Discord from 'discord.js';
import { ServerInfo } from '../definitions';
import { embedError, embedSuccess } from './embedTemplates';
export function postSuccess(
  serverInfo: ServerInfo,
  message: Discord.Message,
): void {
  if (serverInfo === null) return;
  const embed = embedSuccess({
    title: 'SERVER STATUS',
    thumbnail: serverInfo.favicon,
    status: serverInfo.online ? 'Online' : 'Offline',
    players: serverInfo.online
      ? {
          max: serverInfo.players.max,
          now: serverInfo.players.now,
          list: serverInfo.players.sample.map((info) => info.name),
        }
      : undefined,
    updatedAt: serverInfo.timestamp,
  });

  message.channel.send(embed);
}

export function postError(
  title: string,
  errorMessage: string,
  message: Discord.Message,
): void {
  const embed = embedError({
    title: title,
    message: errorMessage,
  });
  message.channel.send(embed);
}
