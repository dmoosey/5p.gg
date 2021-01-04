const rp = require('request-promise');
const $ = require('cheerio');
const fs = require('fs');

// Write data to users pool and return an object containing matchup data for opponents choice vs your champ pool
const scrape = async (pool, matchup, lane) => {
    // initalize op.gg url pointing to opponent champ data
    const url = 'https://euw.op.gg/champion/' + matchup + '/statistics/' + lane + '/matchup';

    // fetch the webpage html
    const html = await rp(url);

    // acquire matchup stats for each champ in champ pool
    for (const champ of Object.keys(pool)) {
        // if the matchup is the same as current champ skip scraping we know it will be null
        if (champ.toLowerCase() === matchup.toLowerCase()) continue
        // store query to identify data element
        const query = `[data-champion-name=${champ}]`;
        // select data element
        const DATA_ELEMENT = $(query, html);
        // check we have some data on the matchup
        if (!Object.keys(DATA_ELEMENT).includes('0')) {
            pool[champ][matchup] = { winrate: null, sample: null };
        } else {
            // parse out internal data object
            const DATA_OBJ = DATA_ELEMENT['0'].attribs;
            // extract wanted data and store in data object
            const winrate = Math.abs(DATA_OBJ['data-value-winrate'] * 100 - 100).toFixed(2);
            pool[champ][matchup] = { winrate: winrate, sample: DATA_OBJ['data-value-totalplayed'] };
        }

    }

    return pool;
}

const validate = async (champ) => {
  // Capitalize champ string
  champ = champ.charAt(0).toUpperCase() + champ.slice(1);
  // initialize uri to scrape
  const url = 'https://euw.op.gg/champion/' + champ
  // wait for rp to resolve html
  const html = await rp(url);
  // store search params to see if we landed on a champ page
  const query = ".champion-stats-header-info__name";
  // store contents of champ header and boolean representation as to wether we are on the right page
  const HEADER_ELEMENT = $(query, html);
  const found = Object.keys(HEADER_ELEMENT).includes('0');

  if(!found) return false

  return true
  
}

// Returns an array of op.gg tier 1 champion names
const getOP = async (role) => {
    const url = 'https://euw.op.gg/champion/statistics';
    const html = await rp(url);
    const op = [];

    const trendTable = "champion-index-table";
    const tab = "champion-trend-tier-" + role.toUpperCase();
    const tierOne = `"//opgg-static.akamaized.net/images/site/champion/icon-champtier-1.png"`;
    const tableValue = ".champion-index-table__cell--value";

    const query = ".champion-trend-tier-" + role.toUpperCase() + "> tr:has(td:has(img[src$=" + tierOne + "])) > .champion-index-table__cell--champion > a > .champion-index-table__name";

    const DATA = $(query, html);

    for(let i = 0; i < DATA.length; i++){
        const champ = DATA[i];
        op.push(champ.children[0].data);
    }


    return op;
}

module.exports = {scrape, validate, getOP};