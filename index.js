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

//* MESSAGE EVENT HANDLER*//
client.on('message', async (msg) => {
    try {
        if(msg.author.username == '5P.GG') return
        if(!config.channels.includes(msg.channel.id)) return

        const parsed = await parseCommand(msg);

        return msg.reply(await commands[parsed.command].process(parsed));

    } catch (err) {
        console.log(err);
    }
})

client.login(process.env.GGTOKEN);


/* COMMAND PARSING */
// Returns an object containing parsed user command data
async function parseCommand(msg) {
    // Initialize the object with the message author and the raw input
    const input = {
        user: msg.author,
        raw: msg.content
    };

    // Split the message with spaces as the discriminator and store arr in obj
    input.arr = input.raw.split(' ');
    // The first argument the user gives should always be the command so store this seperatley
    input.command = input.arr[0].replace(prefix, "");

    // Access the given command in the programs command object
    const command = commands[input.command];
    // Attach the boolean representing wether the command expects champion arguments
    input.championless = commands[input.command].championless;

    // If the command expects a champion and one has been provided attach this data to the object
    if (input.arr.length > 1 && !input.championless) {
        input.champ = {};

        let counter;
        // Catch champs with multiple words in their name
        input.diff = input.arr.length - command.args - 1;
        if (input.diff) {
            // Store this type of input in an array
            input.champ.words = [];
            counter = 1;
        }


        while (counter < input.arr.length) {
            input.champ.words.push(input.arr[counter]);
            counter++
        }

        // Format any champion names with spaces for web use
        if (input.champ.words) input.champ.squished = input.champ.words.join('');

        // Store a raw lowercase version of the champ name
        input.champ.raw = input.champ.words ? input.champ.words.join(' ') : input.arr[1].toLowerCase();

        // Attached multiple versions of the champ name for later use in webscraping, database lookup etc.
        input.champ.sentence = input.champ.raw.replace(/\b\w/g, l => l.toUpperCase());
        input.champ.clean = input.champ.raw.replace(/[^\w\s]|_/g, "")
            .replace(/\s+/g, " ");
        input.champ.formatted = '**' + input.champ.sentence + '**';
    }

    // Handle longer commands
    if (input.arr.length > 2 || (input.championless && input.arr.length > 1)) {
        input.lane = {};
        input.lane.raw = input.championless ? input.arr[1].toLowerCase() : input.arr[2].toLowerCase();
        input.lane.formatted = '**' + input.lane.raw.replace(/\b\w/g, l => l.toUpperCase()) + '**';
    }

    // Manual handling of some name edge cases
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