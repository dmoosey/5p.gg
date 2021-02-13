const rp = require('request-promise');
const $ = require('cheerio');

const champion_data = require('../data/champs.json');

// parses wether champ name string or a champ object containing a name property are valid
validate_input = (champ_input) => {
    valid_champ_names = Object.keys(champion_data);
    if (typeof champ_input == 'string') return valid_champ_names.includes(champ_input)
    if (typeof champ_input == 'object' && !Array.isArray(champ_input)) {
        try {
            if (!champ_input.name) throw new Error('No property "name" found on input.')
            const valid = valid_champ_names.includes(champ_input.name);
            return valid
        } catch (err) {
            return err
        }
    }
}

// Returns basic information from champs.json for specified champion
// champ_name should be in 'key' format e.g TwistedFate
JSON_data = (champ_name) => {
    if (!this.validate_input(champ_name)) throw new Error("Invalid champion name provided.")
    
    const champ_obj = champion_data[champ_name]
    return {
        id: champ_obj["id"],
        name: champ_obj["name"],
        key: champ_obj["key"],
        title: champ_obj["title"],
        tags: champ_obj["tags"]
    }
}

OPGG_data = {
    // Returns general information from op.gg for specified champion#
    // champ_name should be in 'key' format e.g TwistedFate
    overview: async (champ_name) => {
        if (!this.validate_input(champ_name)) throw new Error("Invalid champion name provided.")
        // fetch champ overview page
        const url = `https://euw.op.gg/champion/${champ_name}/statistics/`;
        const html = await rp(url);

        let roles = null;
        let tier = null;

        // specify query for role element
        const role_class = 'a > .champion-stats-header__position__role';
        const span_tags = $(role_class, html);
        if (span_tags.length > 0) {
            roles = []
            for (let i = 0; i < span_tags.length; i++) {
                roles.push(span_tags[i].children[0].data);
            }
        }

        // specify query for tier element
        const tier_class = '.champion-stats-header-info__tier';
        const div_class = $(tier_class, html);
        if (div_class.length > 0) {
            const b_tag = div_class[0].children[1];
            tier = b_tag.children[0].data;
        }

        return {
            roles,
            tier,
        }

    }
}

champ = (champ_input) => {
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
        return validate_input(v)
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

module.exports = { champ, JSON_data, OPGG_data, validate_input }