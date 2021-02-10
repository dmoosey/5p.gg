const champion_data = require('../data/champs.json');

champ = (champ_input) => {
    valid_champ_names = Object.keys(champion_data);

    // Returns basic information from champs.json for specified champion
    const get_JSON_data = (champ_name) => {

        //if (!valid_champ_names.includes(champ_name)) throw new TypeError(`Error: Invalid champion name: ('${champ_name}')`)

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

    // Identify Single champ strings
    if (typeof champ_input == 'string') {
        champ_input = new Array(champ_input)
    };

    // return Filtered Array with only valid names
    champ_input_filtered = champ_input.filter((v, i) => {
        return valid_champ_names.includes(v)
    });

    champ_count = champ_input_filtered.length;

    if(champ_count == 0) throw new TypeError(`Error: No valid champion names provided`)

    if(champ_count == 1) return get_JSON_data(champ_input_filtered[0]) 

    champs = {};

    champ_input_filtered.forEach(champ_name => {
        champ_data = get_JSON_data(champ_name);
        champs[champ_name] = champ_data;
    })

    return champs
}

module.exports = { champ }