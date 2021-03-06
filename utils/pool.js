const fs = require('fs'),
    webScraper = require('./webscraper');

let DATABASE = JSON.parse(fs.readFileSync('./data/DATABASE.json')),
    USER_OBJ = DATABASE["users"];

/*HELPERS-----------------------------------------------------------------------------------------------------------------------------------------------------------------*/
//Ensures program is referencing most current data
const readDB = () => {
    DATABASE = JSON.parse(fs.readFileSync('./data/DATABASE.json'));
    USER_OBJ = DATABASE["users"];
};

//Returns champion names in sentence case
const format = (str) => {
    str = str.replace(/\b[a-z]/g, (letter) => letter.toUpperCase());
    str = str.replace(/'(S) /g, (letter) => letter.toLowerCase());
    return `**${str}**`;
};

/*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/


// Adds provided champion to the users pool object
const addChamp = async (input) => {
    // Enclosed in try-catch block for error handling
    try {
        readDB();
        // Initialize variables for pool info
        const userPool = USER_OBJ[input.user.id]["pool"];
        const champs = Object.keys(userPool);

        // Check if the champ has already been added to the users pool
        if (champs.includes(input.champ.raw)) throw new Error(`${input.champ.formatted} is already in your champion pool.`);

        // Check if the given name is a valid champion
        const valid = await webScraper.validate(input);

        // Throw an error for invalid inputs
        if (!valid) throw new Error(`Please provide a valid champion name.`)

        // Create the empty object to store champ data
        userPool[input.champ.raw] = {};

        // Update and write to DATABASE
        DATABASE["users"][input.user.id]["pool"] = userPool;

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
const deleteChamp = async (input) => {
    // Enclosed in try-catch block for error handling
    try {
        // Initialize variables for pool info
        const userPool = USER_OBJ[input.user.id]["pool"];
        const champs = Object.keys(userPool);

        // Validate champion input
        const valid = await webScraper.validate(input);
        // Throw error for invalid inputs
        if (!valid) throw new Error(`Please provide a valid champion name.`)
        // If the champ isn't in the pool tell the user
        if (!champs.includes(input.champ.raw)) return `${input.champ.formatted} is not in your champion pool.`;
        // Once validated and found remove from DATABASE
        delete DATABASE["users"][input.user.id]["pool"][input.champ.raw];
        // Write updated data
        fs.writeFileSync('./data/DATABASE.json', JSON.stringify(DATABASE));
        // Log a message
        return `${input.champ.formatted} removed from your champion pool!`;
        // Catch and log errors
    } catch (err) {
        console.log(err);
        return err.message
    }

}

/*-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
// Returns a formatted string containing all the users champion pool
const displayPool = (input) => {
    try {
        readDB();
        // Read users pool and store keys (champs)
        const champs = Object.keys(USER_OBJ[input.user.id]["pool"]);

        // If the user doesn't have a champ pool let them know
        if (champs.length <= 0) return "You haven't added any champs to your pool yet use **' >add <champ name> '** to get started."

        // Convert the champ names to sentence case

        champs.forEach((champ, index, champs) => {
            let formatted = format(champ);
            // hard coded edge case
            if (champ == 'jarvan iv') formatted = `**Jarvan IV**`;
            champs[index] = formatted;
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
    } catch (err) {
        console.log(err);
        return err.message
    }

}

/*-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
// Returns a string containing matchup data for the users champion pool vs given champ
const counter = async (input) => {
    try {
        const roles = ['top', 'jungle', 'mid', 'bot', 'support'];

        const matchup = input.champ.raw;
        const lane = input.lane.raw;

        const valid = await webScraper.validate(input);

        if (!valid) throw new Error(`Please provide a valid champion name.`)
        if (!roles.includes(lane)) throw new Error(`Please provide a valid role, one of; top, jungle, mid, bot or support.`)

        const stats = await webScraper.scrape(USER_OBJ[input.user.id]["pool"], input);

        DATABASE["users"][input.user.id]["pool"] = stats;

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

            //hard coded edge case
            if (champ == 'Jarvan Iv') champ = `Jarvan IV`;

            statsArr.push(`**${champ}** | ${wr}% *(${sample} games)*`);
        }

        const paragraph = statsArr.join('\n');

        return `vs ${input.champ.formatted} ${input.lane.formatted}\n` + paragraph;

    } catch (err) {
        console.log(err);
        return err.message
    }

}

/*-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
// Returns a formatted string containing op.gg tier one champs for the given role
const op = async (input) => {
    try {
        const lane = input.lane.raw;

        const data = await webScraper.getOP(lane);

        const names = Object.keys(data);

        if (!names[0]) return `Please provide a valid role, one of: **top**, **jungle**, **mid**, **adc** or **support**.`
        let formatted = [`**OP** > **${input.lane.formatted}** `];

        names.forEach(champ => {
            const wr = data[champ].wr;
            const wrFloat = parseFloat(wr);
            const sample = data[champ].sample;
            const medal = wrFloat > 52.6 ? ':first_place:' : wrFloat > 51.5 ? ':second_place:' : ':third_place:';
            const str = medal + ` **${champ}** | ${wr} (*${sample} games*)`

            formatted.push(str);
        })

        return formatted.join('\n')
    } catch (err) {
        console.log(err);
        return err.message
    }
}

const runes = (input) => {
    const url = 'https://euw.op.gg/champion/' + input.champ.raw + '/statistics/' + input.lane.raw + '/rune';
    return url
}

const bans = async (input) => {
    try {
        readDB();
        const userPool = USER_OBJ[input.user.id]["pool"];
        // scores will be an object containing ban scores for any champion that holds a <50% winrate versus a champ in the users pool
        const scores = await webScraper.getBanScores(userPool);

        console.log(scores);
        
        const totalScores = {}

        for (const champ of Object.keys(scores)) {
            const badMatchups = Object.keys(scores[champ]);

            for (const matchup of badMatchups) {
                if (!Object.keys(totalScores).includes(matchup)) {
                    totalScores[matchup] = scores[champ][matchup].score;
                } else {
                    totalScores[matchup] += scores[champ][matchup].score;
                }
            }
        }

        const getMax = object => {
            return Object.keys(object).filter(x => {
                return object[x] == Math.max.apply(null,
                    Object.values(object));
            });
        };

        let formatted = [`**Best Bans** *for your pool*`];

        for (let i = 0; i < 3; i++) {
            const ban = (getMax(totalScores))[0];
            const ban_formatted = format(ban);
            const score = totalScores[ban];

            const medal = i === 0 ? ':first_place:' : i === 1 ? ':second_place:' : ':third_place:';
            const str =`${medal}${ban_formatted} | Ban Score: **${score}**`
            formatted.push(str);
            delete totalScores[ban];
        }

        return formatted.join('\n')

    } catch (err) {
        console.log(err);
        return err.message
    }

}

module.exports = { addChamp, displayPool, deleteChamp, counter, op, runes, bans };