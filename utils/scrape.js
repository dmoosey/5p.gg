const rp = require('request-promise');
const $ = require('cheerio');
const fs = require('fs');

const champion_data = require('../data/champs.json');

// Returns basic information from champs.json for specified champion
// champ_name should be in 'key' format e.g TwistedFate
JSON_data = (champ_name) => {
    // Only valid champs will make it this far so we can just write grab and return the data we need
    try{
        const champ_obj = champion_data[champ_name]
        return {
            id: champ_obj["id"],
            name: champ_obj["name"],
            key: champ_obj["key"],
            title: champ_obj["title"],
            tags: champ_obj["tags"]
        }
    }
    catch(err){
        throw new TypeError(`Invalid Champion name provided`)
    }
}

OPGG_data = {
    // Returns general information from op.gg for specified champion#
    // champ_name should be in 'key' format e.g TwistedFate
    overview : async (champ_name) => {
        // fetch champ overview page
        const url = `https://euw.op.gg/champion/${champ_input}/statistics/`;
        const html = await rp(url);
        
        // specify class attr value for role element
        const role_class = 'champion-stats-header__position__role';

    }
}

champ = (champ_input) => {
    // Initialize an array identifying which champs data is available for
    valid_champ_names = Object.keys(champion_data);

    // Identify JSON inputs
    if (typeof champ_input == 'object' && !Array.isArray(champ_input)) {
        champ_input = Object.keys(champ_input)
    };

    // Identify queries for a single champ
    if (typeof champ_input == 'string') {
        champ_input = new Array(champ_input)
    };

    // return Filtered Array with only valid names (ones that we have data for)
    champ_input_filtered = champ_input.filter((v, i) => {
        return valid_champ_names.includes(v)
    });

    // How many champs are we working with
    champ_count = champ_input_filtered.length;

    // All champs were invalid and have been filtered out
    if (champ_count == 0) throw new TypeError(`No valid champion names provided`)

    // For single queries no container object is needed so just return the single object
    if (champ_count == 1) return JSON_data(champ_input_filtered[0])

    // Container object
    champs = {};

    // Iterate over our filtered array retreiving and writing our champ objects into their container
    champ_input_filtered.forEach(champ_name => {
        champ_data = JSON_data(champ_name);
        champs[champ_name] = champ_data;
    })
    // return master object
    return champs
}

module.exports = { champ , JSON_data , OPGG_data }