import * as Discord from 'discord.js';

const SERVER_UP_COLOR = '#32a852';
const ERROR_COLOR = '#a83232';
const DEFAULT_THUMBNAIL =
  'https://img.icons8.com/color/452/angola-circular.png';

interface SuccessValues {
  title: string;
  thumbnail: string | null;
  status: 'Online' | 'Offline';
  players?: {
    max: number;
    now: number;
    list: string[];
  };
  updatedAt: number;
}
interface ErrorValues {
  title: string;
  message: string;
}

export function embedSuccess(values: SuccessValues): Discord.MessageEmbed {
  const embed = new Discord.MessageEmbed();
  const updatedAt = new Date(values.updatedAt);
  const time = `${updatedAt.getHours()}:${updatedAt.getMinutes()}`;
  embed
    .setColor(values.status === 'Online' ? SERVER_UP_COLOR : ERROR_COLOR)
    .setTitle(values.title)
    .setThumbnail(values.thumbnail || DEFAULT_THUMBNAIL)
    .setFooter(`Updated At: ${time}`)
    .addFields({
      name: 'Status',
      value: values.status,
      inline: true,
    });

  if (values.players) {
    embed.addFields({
      name: 'Players',
      value: `${values.players.now}/${values.players.max}`,
      inline: true,
    });
    embed.addFields({
      name: 'Player List',
      value: values.players.list.join(', '),
    });
  }
  return embed;
}

export function embedError(values: ErrorValues): Discord.MessageEmbed {
  const embed = new Discord.MessageEmbed();
  embed
    .setColor(ERROR_COLOR)
    .setTitle(values.title)
    .setThumbnail(DEFAULT_THUMBNAIL)
    .addFields({
      name: 'Message',
      value: values.message,
    });
  return embed;
}
