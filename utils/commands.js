const user = require('./user'),
      pool = require('./pool'),
      prefix = require('../data/config.json').prefix;

module.exports = {
    "start": {
        description: "Initalizes a 5p.gg object for the user",
        usage: `${prefix}start`,
        championless: true,
        args: 0,
        process: user.addUser
    },

    "add": {
        description: "Adds a new champion to the users pool",
        usage: `${prefix}add <champ name>`,
        championless: false,
        args: 1,
        process: pool.addChamp
    },

    "delete": {
        description: "Removes a champion from the users pool",
        usage: `${prefix}delete <champ name>`,
        championless: false,
        args: 1,
        process: pool.deleteChamp
    },

    "pool": {
        description: "List all champions saved in users pool",
        usage: `${prefix}pool`,
        championless: true,
        args: 0,
        process: pool.displayPool
    },

    "counter": {
        description: "Return the winrates for the users pool versus given champ ",
        usage: `${prefix}counter <champ name> <lane>`,
        championless: false,
        args: 2,
        process: pool.counter
    },
    
    "op": {
        description: "Logs the 3 strongest champions for given role",
        usage: `${prefix}op <lane>`,
        championless: true,
        args: 1,
        process: pool.op
    },
};