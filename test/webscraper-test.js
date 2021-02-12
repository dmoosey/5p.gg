var assert = require('assert');
var Scrape = require('../utils/scrape');

describe('Scrape', () => {
    describe('#JSON_data', () => {
        it('returns an object containing local (champs.json) data for the given champion', () => {
            const input = "Fizz"
            const expected = {
                id : "Fizz",
                name : "Fizz",
                key : "105",
                title : "the Tidal Trickster",
                tags : ["Assassin","Fighter"]
            }
            const result = Scrape.JSON_data(input);
            assert.deepStrictEqual(result, expected);
        })
        it('raises a type error when an invalid champion input is passed', () => {
            const input = 'Jhizz';
            const result = () => {Scrape.JSON_data(input)};
            assert.throws(result, /Invalid Champion name/);
        })
    })
    describe('#OPGG_data', () => {
        describe('#overview', () => {
            it('returns an object containing data from champs op.gg overview page', () => {
                const input = "Fizz";
                const expected = {
                    roles : ["Middle"],
                    tier : "Tier 2" 
                }
                const result = Scrape.OPGG_data.overview(input)
                assert.deepStrictEqual(result, expected);
            })
        })
    })
    describe('#champ', () => {
        it('returns a champion object containing data for the provided champion', () => {
            const input = "Fizz";
            const expected = true;
            const result = Scrape.champ(input);
            const compare = typeof result && (Object.keys(result).length > 0);
            assert.strictEqual(compare, expected);
        })
        it('returns multiple nested objects when an array of champions is given', () => {
            const input = ["Fizz", "Zoe"];
            const expected = {
                "Fizz" : Scrape.champ(input[0]),
                "Zoe" : Scrape.champ(input[1])
            }
            const result = Scrape.champ(input);
            assert.deepStrictEqual(result, expected);
        })
        it('filter out any invalid champion names in provided array', () => {
            const input = ["Jhizz", "Fizz", "Glizz"]
            const result = Scrape.champ(input);
            const expected = Scrape.champ("Fizz");
            assert.deepStrictEqual(result, expected);
        })
        it('filter out any invalid champion names in provided array (multiple valid)', () => {
            const input = ["Jhizz", "Fizz", "Glizz", "Zoe"];
            const result = Scrape.champ(input);
            const expected = Scrape.champ(["Fizz", "Zoe"]);
            assert.deepStrictEqual(result, expected);
        })
        it('returns an object for every champion in a given JSON file', () => {
            // Expected amount of keys in master object
            const expected = 154;
            const input = require('../data/champs.json');
            const result = Object.keys(Scrape.champ(input)).length;
            assert.strictEqual(result, expected);
        })
        it('filter out any invalid champion names in given JSON file', () => {
            const input = {"Jhizz" : {}, "Fizz" : {}, "Glizz": {}};
            const result = Scrape.champ(input);
            const expected = Scrape.champ("Fizz");
            assert.deepStrictEqual(result, expected);
        })
        it('filter out any invalid champion names in given JSON file (multiple valid)', () => {
            const input = {"Jhizz" : {}, "Fizz" : {}, "Glizz": {}, "Zoe": {}};
            const result = Scrape.champ(input);
            const expected = Scrape.champ(["Fizz", "Zoe"]);
            assert.deepStrictEqual(result, expected);
        })
        it('raises an error if no valid champion names were given', () => {
            const input = ["Jhizz", "Glizz", "Whizz"];
            const result = () => {Scrape.champ(input)};
            assert.throws(result, /No valid champion names provided/);
        })
    })
})