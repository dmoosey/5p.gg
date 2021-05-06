const Champ = require('../data/Champ');
const db = require('./db');

db.on('error', console.error.bind(console, 'connection error:'));

get_champ_data = async function (champ) {
    champ_data = await Champ.findById(champ);
    return champ_data
}

fetch_runes = async (parsed_command) => {
    const champ_name = parsed_command.champ.sentence
    const champ_data = await get_champ_data(champ_name);
    if (!champ_data) return `Please provide a valid champion name and role`
    const role = parsed_command.lane.raw
    const data = champ_data.runes[role] || `No data found for ${champ_name} in ${role}`;
    return data
}

module.exports = { fetch_runes }


