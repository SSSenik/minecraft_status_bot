import * as dotenv from 'dotenv';
import * as Discord from 'discord.js';
import * as ms from 'ms';
import MinecraftStatus from './servers/MinecraftStatus';
import Scheduler from './utils/Scheduler';
import { postError, postSuccess } from './utils/post';
import { commandParser } from './utils/commandParser';
import { ipv4Parser } from './utils/ipv4Parser';

const COMMAND_START = '/start';
const COMMAND_STOP = '/stop';
const COMMAND_CHECK = '/check';
const COMMAND_SETUP = '/setup';

function main() {
  const { parsed: env } = dotenv.config();

  const client = new Discord.Client();
  try {
    client.login(env.BOT_TOKEN);
  } catch (err) {
    console.log('INVALID LOGIN');
  }

  let server: MinecraftStatus | null = null;
  let scheduler: Scheduler | null = null;

  client.on('message', async (message) => {
    const [command, paramsString] = message.content.split(/ (.+)/);

    if (command === COMMAND_SETUP) {
      const params: { ip: string; port: string; time: string } =
        commandParser(paramsString);

      if (!params) {
        postError('MISSING PARAMS', 'No params specified', message);
        return;
      }

      if (!params.ip) {
        postError('MISSING PARAMS', 'Ip not provided', message);
        return;
      }
      if (!ipv4Parser(params.ip)) {
        postError(
          'INVALID IP',
          'The provided ip is invalid. Format XXX.XXX.XXX.XXX',
          message,
        );
        return;
      }
      if (!params.time) {
        postError('MISSING PARAMS', 'Interval time not provided', message);
        return;
      }

      let time = 0;
      try {
        time = ms(params.time);
      } catch (err) {
        postError(
          'ERROR SETTING INTERVAL',
          'interval value invalid. Check https://www.npmjs.com/package/ms for examples ',
          message,
        );
        return;
      }
      if (time < ms('1m')) {
        postError(
          'ERROR SETTING UP',
          'interval must be more than 1 minute',
          message,
        );
        return;
      }

      server = new MinecraftStatus(params.ip, params.port || env.DEFAULT_PORT);
      scheduler = new Scheduler(time);

      message.channel.send('Setup done. Use /start to initialize the service');
    }

    if (command === COMMAND_START) {
      await requestAndPost(scheduler, server, message);
      scheduler.start(async () => {
        await requestAndPost(scheduler, server, message);
      });
    }

    if (command === COMMAND_STOP) {
      if (!scheduler) {
        postError('NO SETUP', 'please setup the service using /setup', message);
        return;
      }
      scheduler.stop();
      postError('SERVICE STOPPED', 'Service has stopped', message);
      return;
    }

    if (command === COMMAND_CHECK) {
      await requestAndPost(scheduler, server, message);
    }
  });
}
main();

async function requestAndPost(
  scheduler: Scheduler,
  server: MinecraftStatus,
  message: Discord.Message,
) {
  if (!scheduler) {
    postError('NO SETUP', 'please setup the service using /setup', message);
    return;
  }
  try {
    const serverInfo = await server.ping();
    if (!serverInfo)
      throw Error('No data requested yet. Wait for the next ping');
    postSuccess(serverInfo, message);
  } catch (err) {
    postError('ERROR RETRIEVING STATUS', err, message);
  }
}
