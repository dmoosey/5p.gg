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
    try{
        const parsed = parseCommand(msg);
        msg.reply(await commands[parsed.command].process(parsed))

    } catch (err) {
        console.log(err);
    }
    
    
})

client.login(process.env.GGTOKEN);


/* COMMAND PARSING */
function parseCommand(msg){
    const input = {
        user: msg.author,
        raw: msg.content
    };

    input.arr = input.raw.split(' ');
    input.command = input.arr[0].replace(prefix, "");


    const isValidCommand = Object.keys(commands).includes(input.command);
    if(!isValidCommand) throw new Error(`Invalid Command.`)

    input.championless = commands[input.command].championless;

    if(input.arr.length > 1 && !input.championless){
        input.champ = {};
        input.champ.raw = input.arr[1].toLowerCase();
        input.champ.sentence = input.champ.raw.replace(/\b\w/g, l => l.toUpperCase());
        input.champ.clean = input.champ.raw.replace(/[^\w\s]|_/g, "")
        .replace(/\s+/g, " ");
        input.champ.formatted = '**' + input.champ.sentence + '**';
    }

    if(input.arr.length > 2 || (input.championless && input.arr.length > 1)){
        input.lane = {};
        input.lane.raw = input.championless ? input.arr[1].toLowerCase() : input.arr[2].toLowerCase();
        input.lane.formatted = '**' + input.lane.raw.replace(/\b\w/g, l => l.toUpperCase()) + '**';
    }

    console.log(input);

    return input
}