const champion_data = require('../data/champs.json');

champ = (champ_input) => {
    // Initialize an array identifying which champs data is available for
    valid_champ_names = Object.keys(champion_data);

    // Returns basic information from champs.json for specified champion
    // champ_name should be in 'key' format e.g TwistedFate
    const get_JSON_data = (champ_name) => {
        // Only valid champs will make it this far so we can just write grab and return the data we need
        const champ_obj = champion_data[champ_name]
        return {
            id: champ_obj["id"],
            name: champ_obj["name"],
            key: champ_obj["key"],
            title: champ_obj["title"],
            tags: champ_obj["tags"]
        }
    }

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
    if(champ_count == 0) throw new TypeError(`Error: No valid champion names provided`)

    // For single queries no container object is needed so just return the single object
    if(champ_count == 1) return get_JSON_data(champ_input_filtered[0]) 

    // Container object
    champs = {};

    // Iterate over our filtered array retreiving and writing our champ objects into their container
    champ_input_filtered.forEach(champ_name => {
        champ_data = get_JSON_data(champ_name);
        champs[champ_name] = champ_data;
    })
    // return master object
    return champs
}

module.exports = { champ }