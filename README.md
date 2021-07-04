# Minecraft server status checker bot for discord

## Getting Started

```
# install dependencies
npm i

# setup environment variables
# tip: use the dotenv package
# create ".env" file in base directory with the contents:
BOT_TOKEN='[DISCORD_BOT_TOKEN]'
DEFAULT_PORT='25565'

# build
npm run build

# start the bot
npm run start
```

## Bot Commands

### /setup

sets the values to be used by the scheduler and the ping system

#### Usage

`/setup ip=12.152.123.132; port=25565; time=1m`
Note: `port` is optional

### /start

Starts the scheduler.
After X time (specified in the setup) will emit the server status

### /check

Emits the current (or latest returned) server status

### /stop

Stops the scheduler.
