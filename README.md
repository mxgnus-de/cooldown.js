# 🚀 Getting started

## Installation

Use the node package manager [npm](https://nodejs.org/en/download/) to install cooldown.js.

```bash
npm i cooldown.js
```

## Example

```js
const Discord = require('discord.js');
const Cooldown = require('cooldown.js');

const bot = new Discord.Client({
   intents: [
      Discord.Intents.FLAGS.GUILDS,
      Discord.Intents.FLAGS.GUILD_MESSAGES,
   ],
});

const cooldown = new Cooldown();

bot.on('ready', () => {
   console.log('Ready!');
});

bot.on('messageCreate', async (message) => {
   if (message.author.bot) return;

   if (message.content === '!ping') {
      const pingCooldown = new cooldown.Command(
         message.guild.id /* the guild id of the guild */,
         'ping' /* the command name */,
      ); // create a new cooldown for the command
      const userCooldown = pingCooldown.has(message.author.id); // get the cooldown for the user

      if (userCooldown) {
         // if the user has a cooldown
         message.reply(
            "You're on cooldown! Try again in " +
               userCooldown.secondsleft +
               ' seconds.',
         );
         return;
      }

      // if the user doesn't have a cooldown
      message.reply('Pong!');
      pingCooldown.add(
         message.author.id /* the user id */,
         1000 * 10 /* 10 seconds */,
      ); // add the user to the cooldown
   }
});

bot.login('your token');
```

### Need help?

#### [Discord Server](https://discord.gg/M6Tf9b2Tvt)

### License

[ISC](https://choosealicense.com/licenses/isc/)
