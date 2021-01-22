const rp = require('request-promise');
const $ = require('cheerio');
const fs = require('fs');

// Write data to users pool and return an object containing matchup data for opponents choice vs your champ pool
const scrape = async (pool, input) => {
    const matchup = input.champ.raw;
    const lane = input.lane.raw;
    // initalize op.gg url pointing to opponent champ data
    const url = 'https://euw.op.gg/champion/' + matchup + '/statistics/' + lane + '/matchup';

    // fetch the webpage html
    const html = await rp(url);

    // acquire matchup stats for each champ in champ pool
    for (const champ of Object.keys(pool)) {
        // if the matchup is the same as current champ skip scraping we know it will be null
        if (champ.toLowerCase() === matchup.toLowerCase()) continue
        const champKey = champ.replace(/[^\w\s]|_/g, "")
            .replace(/\s+/g, "");
        // store query to identify data element
        const query = `[data-champion-key=${champKey}]`;
        // select data element
        const DATA_ELEMENT = $(query, html);
        // check we have some data on the matchup
        if (!Object.keys(DATA_ELEMENT).includes('0')) {
            continue
        } else {
            // parse out internal data object
            const MATCHUP_OBJ = DATA_ELEMENT['0'].attribs;
            // extract wanted data and store in data object
            const winrate = Math.abs(MATCHUP_OBJ['data-value-winrate'] * 100 - 100).toFixed(2);
            pool[champ][matchup] = { winrate: winrate, sample: MATCHUP_OBJ['data-value-totalplayed'] };
        }

    }

    return pool;
}

const validate = async (input) => {
    // set champ path to land on correct page
    let champPath = input.champ.squished ? input.champ.squished : input.champ.clean;
    champPath = champPath.replace(/[^\w\s]|_/g, "")
        .replace(/\s+/g, "");
    // initialize uri to scrape
    const url = 'https://euw.op.gg/champion/' + champPath;
    // wait for rp to resolve html
    const html = await rp(url);
    // store search params to see if we landed on a champ page
    const query = ".champion-stats-header-info__name";
    // store contents of champ header and boolean representation as to wether we are on the right page
    const HEADER_ELEMENT = $(query, html);

    const found = Object.keys(HEADER_ELEMENT).includes("0");

    if (!found) return false

    return true

}

// Returns an array of op.gg tier 1 champion names
const getOP = async (lane) => {
    const url = 'https://euw.op.gg/champion/statistics';
    const html = await rp(url);
    const op = {};

    const tierOne = `"//opgg-static.akamaized.net/images/site/champion/icon-champtier-1.png"`;

    const statQuery = ".champion-trend-tier-" + lane.toUpperCase() + "> tr:has(td:has(img[src$=" + tierOne + "])) > .champion-index-table__cell--value:contains('%')";
    const nameQuery = ".champion-trend-tier-" + lane.toUpperCase() + "> tr:has(td:has(img[src$=" + tierOne + "])) > .champion-index-table__cell--champion > a > .champion-index-table__name";

    const CHAMP_NAMES = $(nameQuery, html);
    const CHAMP_STATS = $(statQuery, html);


    for (let i = 0; i < CHAMP_NAMES.length; i++) {
        const champName = CHAMP_NAMES[i].children[0].data;
        op[champName] = {
            wr: CHAMP_STATS[i * 2].children[0].data,
            sample: CHAMP_STATS[i * 2 + 1].children[0].data,
        }
    }

    return op;
}


const getBanScores = async (pool) => {
    const scores = {};
    for (const champ of Object.keys(pool)) {

        scores[champ] = {};

        let url = 'https://euw.op.gg/champion/' + champ;
        const champ_main = await rp(url);
        const counters_tab = "a:contains('Counters')";
        const countersPath = $(counters_tab, champ_main)[0].attribs.href;

        url = 'https://euw.op.gg' + countersPath;
        const champ_counters = await rp(url);
        const matchup_data = ".champion-matchup-champion-list__item";
        const total_played = ".champion-matchup-list__totalplayed > span";

        const MATCHUP_DATA_ELEMENT = $(matchup_data, champ_counters);
        const PLAYED_DATA_ELEMENT = $(total_played, champ_counters);

        for (let i = 0; i < ((Object.keys(MATCHUP_DATA_ELEMENT).length) - 4); i++) {

            
            const MATCHUP_OBJ = MATCHUP_DATA_ELEMENT[i].attribs;
            const PLAYED_OBJ = PLAYED_DATA_ELEMENT[i].children[0];
            
            const matchup_name = MATCHUP_OBJ['data-champion-name'];
            const user_win_rate = Math.abs(MATCHUP_OBJ['data-value-winrate'] * 100).toFixed(2);
            const play_rate = Number(cleanString(PLAYED_OBJ.data));
            

            if (user_win_rate >= 50) continue

            const played = MATCHUP_OBJ['data-value-totalplayed'];

            if (play_rate <= 1) continue

            const score = Math.round(((50 - user_win_rate) * play_rate) * 100);

            scores[champ][matchup_name] = score;
        }
    }
    return scores
}

const cleanString = (str) => {
    return str.replace(/[|&;$%@"<>()+,]/g, "")
}

module.exports = { scrape, validate, getOP, getBanScores };