/* MODULES */
const discord = require("discord.js"),
      fivep = require("./5p.js"),
      config = require("./data/config.json"),
      prefix = config.prefix,
      fs = require('fs');

/* DISCORD.JS BOILERPLATE */

const client = new discord.Client();

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

/* MAIN COMMAND HANDLING */

client.on('message', async (msg) => {
    if (msg.content === `${prefix}start`) {
        msg.channel.send(await commands["start"].process(msg, msg.author));
    }

    if (msg.content.split(' ')[0] === `${prefix}add`) {
        msg.reply(await commands["add <champ name>"].process(msg, msg.author));
    }

    if (msg.content.split(' ')[0] === `${prefix}delete`) {
        msg.reply(await commands["delete <champ name>"].process(msg, msg.author));
    }

    if (msg.content === `${prefix}pool`) {
        msg.channel.send(commands["pool"].process(msg, msg.author));
    }

    if (msg.content.split(' ')[0] === `${prefix}counter`) {
        msg.reply(await commands["counter <champ name> <lane>"].process(msg, msg.author));
    }

    if (msg.content.split(' ')[0] === `${prefix}op`) {
        msg.reply(await commands["op <lane>"].process(msg.content.split(' ')[1]));
    }
})

client.login(process.env.GGTOKEN);

/* COMMANDS */
const commands = {
    "start": {
        description: "Initalizes a 5p.gg object for the user",
        process: fivep.user.addUser
    },

    "add <champ name>": {
        description: "Adds a new champion to the users pool",
        process: fivep.pool.addChamp
    },

    "delete <champ name>": {
        description: "Removes a champion from the users pool",
        process: fivep.pool.deleteChamp
    },

    "pool": {
        description: "List all champions saved in users pool",
        process: fivep.pool.displayPool
    },

    "counter <champ name> <lane>": {
        description: "Return the winrates for the users pool versus given champ ",
        process: fivep.pool.counter
    },
    
    "op <lane>": {
        description: "Logs the 3 strongest champions for given role",
        process: fivep.pool.op
    }
}