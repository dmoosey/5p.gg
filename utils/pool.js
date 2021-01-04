const fs = require('fs'),
    webScraper = require('./webscraper'),
    command = require('./commands'),
    DATABASE = JSON.parse(fs.readFileSync('./data/DATABASE.json'));
    USER_OBJ = DATABASE["users"];

/*-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------*/

// Adds provided champion to the users pool object
const addChamp = async (msg, user) => {
    // Enclosed in try-catch block for error handling
    try {
        // Initialize variables for pool info
        const userPool = USER_OBJ[user.id]["pool"];
        const champs = Object.keys(userPool);

        // Get input object from parseCommand helper
        const input = command.parseCommand(msg);

        // Check if the champ has already been added to the users pool
        if (champs.includes(input.champ.raw)) throw new Error(`${input.champ.formatted} is already in your champion pool.`);

        // Check if the given name is a valid champion
        const valid = await webScraper.validate(input.champ.raw);

        // Throw an error for invalid inputs
        if (!valid) throw new Error(`Please provide a valid champion name.`)

        // Create the empty object to store champ data
        userPool[input.champ.raw] = {};

        // Update and write to DATABASE
        DATABASE["users"][user.id]["pool"] = userPool;

        fs.writeFileSync('./data/DATABASE.json', JSON.stringify(DATABASE));

        // Message to be logged by bot
        return `${input.champ.formatted} has been added to your champion pool!`;
    }
    // Log and return errors
    catch (err) {
        console.log(err);
        return err.message
    }
}

/*-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
// Removes provided champion from the users pool
const deleteChamp = async (msg, user) => {
    // Enclosed in try-catch block for error handling
    try {
        // Initialize variables for pool info
        const userPool = USER_OBJ[user.id]["pool"];
        const champs = Object.keys(userPool);

        // Get input object from parseCommand helper
        const input = command.parseCommand(msg);
        // Validate champion input
        const valid = await webScraper.validate(input.champ.raw);
        // Throw error for invalid inputs
        if (!valid) throw new Error(`Please provide a valid champion name.`)
        // If the champ isn't in the pool tell the user
        if (!champs.includes(input.champ.raw)) return `${input.champ.formatted} is not in your champion pool.`;
        // Once validated and found remove from DATABASE
        delete DATABASE["users"][user.id]["pool"][input.champ.raw];
        // Write updated data
        fs.writeFileSync('./data/DATABASE.json', JSON.stringify(DATABASE));
        // Log a message
        return `${input.champ.formatted} removed from your champion pool!`;
        // Catch and log errors
    } catch { err } {
        console.log(err);
        return err.message
    }

}

/*-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
// Returns a formatted string containing all the users champion pool
const displayPool = (msg, user) => {
    // Read users pool and store keys (champs)
    const champs = Object.keys(USER_OBJ[user.id]["pool"]);


    // If the user doesn't have a champ pool let them know
    if (champs.length <= 0) return "You haven't added any champs to your pool yet use **' >add <champ name> '** to get started."

    // Convert the champ names to sentence case
    champs.forEach((champ, index, champs) => {

        const format = champ.slice(0, 1).toUpperCase() + champ.slice(1).toLowerCase();
        champs[index] = format;
    });


    // Format the array into a string with proper punctuation
    champs.forEach((champ, index, champs) => {

        if (index + 1 === champs.length) {
            champs[index] = champs[index].concat('.');
        }

        if (!(index + 1 === champs.length)) {
            champs[index] = champs[index].concat(',');
        }

    })

    if (champs.length > 2) {
        champs.splice(champs.length - 1, 0, 'and');
    }

    return `Currently in your pool: ${champs.join(' ')}`;
}
/*-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
// Returns a string containing matchup data for the users champion pool vs given champ
const counter = async (msg, user) => {
    try {
        const roles = ['top', 'jungle', 'mid', 'bot', 'support'];
        const input = command.parseCommand(msg);

        const matchup = input.champ.raw;
        const lane = input.lane.raw;

        const valid = await webScraper.validate(matchup);

        if(!valid) throw new Error(`Please provide a valid champion name.`)
        if(!roles.includes(lane)) throw new Error(`Please provide a valid role, one of; top, jungle, mid, bot or support.`)

        const stats = await webScraper.scrape(USER_OBJ[user.id]["pool"], matchup, lane);

        DATABASE["users"][user.id]["pool"] = stats;

        fs.writeFileSync('./data/DATABASE.json', JSON.stringify(DATABASE));

        // Format string for logging 
        const statsArr = [];
        const champArr = Object.keys(stats).sort((a, b) => {
            if (!stats[a][matchup] || !stats[b][matchup]) return
            return stats[b][matchup].winrate - stats[a][matchup].winrate
        });

        for (let champ of champArr) {
            if (!stats[champ][matchup]) continue

            const wr = stats[champ][matchup].winrate;
            const sample = stats[champ][matchup].sample;
   
            champ = champ.replace(/\b\w/g, l => l.toUpperCase());

            statsArr.push(`**${champ}** | ${wr}% *(${sample} games)*`);
        }

        const paragraph = statsArr.join('\n');

        return `vs **${input.champ.formatted} ${input.lane.formatted}**\n` + paragraph;
        
    } catch (err) {
        console.log(err);
        return err.message
    }

}

const op = async (lane) => {
    const data = await webScraper.getOP(lane);
    return data.join(', ');
}

module.exports = { addChamp, displayPool, deleteChamp, counter, op };