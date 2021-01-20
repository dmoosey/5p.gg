/* MODULES */
const discord = require("discord.js"),
    commands = require("./utils/commands"),
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
    try {
        if(msg.author.username == '5P.GG') return
        const parsed = await parseCommand(msg);
        return msg.reply(await commands[parsed.command].process(parsed));

    } catch (err) {
        console.log(err);
    }


})

client.login(process.env.GGTOKEN);


/* COMMAND PARSING */
async function parseCommand(msg) {
    const input = {
        user: msg.author,
        raw: msg.content
    };

    input.arr = input.raw.split(' ');
    input.command = input.arr[0].replace(prefix, "");

    const command = commands[input.command];
    input.championless = commands[input.command].championless;


    if (input.arr.length > 1 && !input.championless) {
        input.champ = {};

        let counter;

        input.diff = input.arr.length - command.args - 1;
        if (input.diff) {
            input.champ.words = [];
            counter = 1;
        }


        while (counter < input.arr.length) {
            input.champ.words.push(input.arr[counter]);
            counter++
        }

        if (input.champ.words) input.champ.squished = input.champ.words.join('');

        input.champ.raw = input.champ.words ? input.champ.words.join(' ') : input.arr[1].toLowerCase();

        input.champ.sentence = input.champ.raw.replace(/\b\w/g, l => l.toUpperCase());
        input.champ.clean = input.champ.raw.replace(/[^\w\s]|_/g, "")
            .replace(/\s+/g, " ");
        input.champ.formatted = '**' + input.champ.sentence + '**';
    }

    if (input.arr.length > 2 || (input.championless && input.arr.length > 1)) {
        input.lane = {};
        input.lane.raw = input.championless ? input.arr[1].toLowerCase() : input.arr[2].toLowerCase();
        input.lane.formatted = '**' + input.lane.raw.replace(/\b\w/g, l => l.toUpperCase()) + '**';
    }


    const edgeCases = ['jarvan', 'nunu'];
    if (edgeCases.includes(input.arr[1])) {
        switch (input.arr[1]) {
            case 'jarvan':
                input.champ.raw = 'jarvan iv';
                input.champ.clean = 'jarvaniv';
                input.champ.sentence = 'Jarvan IV';
                input.champ.formatted = '**Jarvan IV**';
                break;

            case 'nunu':
                input.champ.sentence = 'Nunu & Willump';
                break;
        }
    }
    console.log(input);
    return input
}