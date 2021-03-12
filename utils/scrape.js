const rp = require('request-promise');
const $ = require('cheerio');
var Helpers = require('./helpers');

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
    if (!validate_input(champ_name)) throw new Error("Invalid champion name provided.")

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
    roles_web: { "Middle": "mid", "Bottom": "bot", "Support": "support", "Jungle": "jungle", "Bottom": "bot" },
    // Returns general information from op.gg for specified champion#
    // champ_input is the object returned from JSON_data(champ_name)
    overview: async (champ_input) => {
        const champ_name = champ_input.name;
        if (!validate_input(champ_name)) throw new Error("Invalid champion name provided.")
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
        let overview = { roles, tier };
        let champ_general = Object.assign(champ_input, overview);

        return champ_general

    },
    // Returns information on item builds for the specified champ
    // champ_input is the object returned from OPGG_data()
    items: async (champ_input) => {
        const champ_name = champ_input.name;
        const items = {};
        for (const role of champ_input.roles) {
            const role_key = OPGG_data.roles_web[role];
            const url = `https://euw.op.gg/champion/${champ_name}/statistics/${role_key}/item`;
            const html = await rp(url);

            let core = [];
            let boots = '';
            let starter = [];

            /* CORE BUILD */

            const core_class = '.champion-stats__list';

            const core_best_ul = $(core_class, html);

            const core_li_tags = core_best_ul[0].children.filter(e => {
                return e.type == 'tag' && e.name == 'li'
            })

            for (const li of core_li_tags) {
                const data = li.attribs.title;
                if (data === undefined) continue
                const item = $('b', data);
                const item_name = item[0].children[0].data;
                core.push(item_name);
            }

            /* BOOTS */
            const boots_class = '.champion-stats__single__item';
            const boots_div = $(boots_class, html);

            boots = boots_div[0].children[2].children[0].data;

            /* STARTER ITEMS */
            const starter_box = $('.l-champion-statistics-content__main > .champion-box:last-child', html);
            const best_starter = $('tbody > tr:first-child', starter_box);

            const starter_li = $('.champion-stats__list__item', best_starter);
            for (const li of starter_li) {
                const data = li.attribs.title;
                if (data === undefined) continue
                const item = $('b', data);
                const item_name = item[0].children[0].data;
                starter.push(item_name);
            }

            const role_obj = {
                boots: boots,
                core: core,
                starter: starter
            }
            items[role_key] = role_obj;
        }
        return items
    },
    skills: async (champ_input) => {
        const champ_name = champ_input.name;
        let skill_order = {};

        for (const role of champ_input.roles) {
            const role_key = OPGG_data.roles_web[role];
            const url = `https://euw.op.gg/champion/${champ_name}/statistics/${role_key}/skill`;
            const html = await rp(url);

            const role_skills = [];

            const li_selector = 'li[data-tab-show-class="ChampionSkillPriorites-1"]';
            const li_tag = $(li_selector, html);
            const best_order = $('li > span', li_tag).text();
            Object.assign(role_skills, best_order);

            skill_order[role_key] = role_skills;
        }
        return skill_order
    },
    runes: async (champ_input) => {
        const champ_name = champ_input.name;
        let runes = {};

        for (const role of champ_input.roles) {
            const role_key = OPGG_data.roles_web[role];
            const url = `https://euw.op.gg/champion/${champ_name}/statistics/${role_key}/rune`;
            const html = await rp(url);

            const role_runes = [];

            const img_selector = 'li[data-tab-show-class="ChampionKeystoneRune-1"] > img';
            const best_runes = $(img_selector, html);
            for(let i = 0; i < best_runes.length; i++){
                role_runes.push(Helpers.imgurl_to_string(best_runes[i].attribs.src))
            }

            runes[role_key] = role_runes;
        }

        return runes
    },
    trends : async (champ_input) => {
        const champ_name = champ_input.name;
        let trend_data = {};

        for (const role of champ_input.roles) {
            const role_key = OPGG_data.roles_web[role];
            const url = `https://euw.op.gg/champion/${champ_name}/statistics/${role_key}/trend`;
            const html = await rp(url);

            const role_trends = {};
            const data_order = ['winrate', 'pickrate', 'banrate'];

            const div_selector = '.champion-stats-trend-rate';
            const trend_div = $(div_selector, html);

            for(let i = 0; i < data_order.length; i++) {
                const data = trend_div[i].children[0].data;
                const to_float = parseFloat(data);
                role_trends[data_order[i]] = to_float;
            }
            trend_data[role_key] = role_trends;
        }
        return trend_data
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