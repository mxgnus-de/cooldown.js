import path from 'path';
import fs from 'fs';

interface CooldownFile {
   [guildId: string]: {
      [commandName: string]: {
         [userId: string]: {
            start: Date;
            time: number;
         };
      };
   };
}

const cooldownPath = path.resolve(__dirname, 'cooldown.json');
if (!fs.existsSync(cooldownPath)) {
   fs.writeFileSync(cooldownPath, JSON.stringify({}));
}
const cooldowns: CooldownFile = JSON.parse(
   fs.readFileSync(cooldownPath, 'utf8'),
);

export class Cooldown {
   public Command = Command;
   constructor() {
      return this;
   }
}

class Command {
   private guildId: string;
   private commandName: string;

   constructor(guildId: string, commandName: string) {
      if (!guildId || typeof guildId !== 'string')
         throw new Error('Guild ID must be a string');
      if (!commandName || typeof commandName !== 'string')
         throw new Error('Command name must be a string');

      this.guildId = guildId;
      this.commandName = commandName;

      cooldowns[guildId] = cooldowns[guildId] || {};
      cooldowns[guildId][commandName] = cooldowns[guildId][commandName] || {};
      saveCooldowns();
      return this;
   }

   public add(userId: string, time: number) {
      if (!userId || typeof userId !== 'string')
         throw new Error('User ID must be a string');
      if (!time || typeof time !== 'number')
         throw new Error('Cooldown must be a number');

      if (
         !cooldowns[this.guildId] ||
         !cooldowns[this.guildId][this.commandName]
      )
         return;
      const now = new Date();
      cooldowns[this.guildId][this.commandName][userId] = {
         start: now,
         time,
      };
      saveCooldowns();
   }

   public remove(userId: string) {
      if (!userId || typeof userId !== 'string')
         throw new Error('User ID must be a string');

      if (
         !cooldowns[this.guildId] ||
         !cooldowns[this.guildId][this.commandName][userId]
      )
         return;
      delete cooldowns[this.guildId][this.commandName][userId];
      saveCooldowns();
   }

   public has(userId: string) {
      if (!userId || typeof userId !== 'string')
         throw new Error('User ID must be a string');

      if (
         !cooldowns[this.guildId] ||
         !cooldowns[this.guildId][this.commandName] ||
         !cooldowns[this.guildId][this.commandName][userId]
      )
         return false;
      const now = new Date();
      const { start, time } = cooldowns[this.guildId][this.commandName][userId];
      const diff = now.getTime() - new Date(start).getTime();
      if (diff > time) return false;
      const msleft = time - diff;
      const secondsleft = Math.floor((msleft / 1000) % 60);
      const minutesleft = Math.floor((msleft / 1000 / 60) % 60);
      const hoursleft = Math.floor((msleft / 1000 / 60 / 60) % 24);
      const daysleft = Math.floor(msleft / 1000 / 60 / 60 / 24);
      const cooldownObj = {
         msleft,
         secondsleft,
         minutesleft,
         hoursleft,
         daysleft,
      };
      return cooldownObj;
   }
}

function saveCooldowns() {
   fs.writeFileSync(cooldownPath, JSON.stringify(cooldowns));
}
