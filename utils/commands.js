const user = require('./user'),
    pool = require('./pool'),
    prefix = require('../data/config.json').prefix;

module.exports = {
    "start": {
        description: "Initalizes a 5P.GG profile for the user",
        usage: `${prefix}start`,
        championless: true,
        args: 0,
        process: user.addUser
    },

    "add": {
        description: "Adds <champ name> to the users pool",
        usage: `${prefix}add <champ name>`,
        championless: false,
        args: 1,
        process: pool.addChamp
    },

    "delete": {
        description: "Removes <champ name> from the users pool",
        usage: `${prefix}delete <champ name>`,
        championless: false,
        args: 1,
        process: pool.deleteChamp
    },

    "pool": {
        description: "List all champions currently in the users pool",
        usage: `${prefix}pool`,
        championless: true,
        args: 0,
        process: pool.displayPool
    },

    "counter": {
        description: "Provides winrates for the users champion pool versus <champ name> in <lane>",
        usage: `${prefix}counter <champ name> <lane>`,
        championless: false,
        args: 2,
        process: pool.counter
    },

    "op": {
        description: "Lists and ranks all op.gg tier 1 champions for <lane>",
        usage: `${prefix}op <lane>`,
        championless: true,
        args: 1,
        process: pool.op
    },

    "info": {
        description: "Provides a basic overview on the given champ",
        usage: `${prefix}info <champ>`,
        championless: false,
        args: 1,
        process: pool.info

    },

    "commands": {
        description: "Lists all commands available to the 5P.GG bot",
        usage: `${prefix}commands`,
        championless: true,
        args: 0,
        process: (input) => {
            const commandsArr = Object.keys(module.exports).map(command => {
                const COMMAND_OBJ = module.exports[command]
                const formatted = `**${COMMAND_OBJ.usage}** - ${COMMAND_OBJ.description}`
                return formatted
            });

            commandsArr.unshift('**5P.GG Command List**');

            return commandsArr.join('\n')

        }
    }
};

