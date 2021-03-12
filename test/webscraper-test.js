var assert = require('assert');
var Scrape = require('../utils/scrape');

describe('Scrape', () => {
    describe('#JSON_data', () => {
        it('returns an object containing local (champs.json) data for the given champion', () => {
            const input = "Fizz"
            const expected = {
                id: "Fizz",
                name: "Fizz",
                key: "105",
                title: "the Tidal Trickster",
                tags: ["Assassin", "Fighter"]
            }
            const result = Scrape.JSON_data(input);
            assert.deepStrictEqual(result, expected);
        })
        it('raises a type error when an invalid champion input is passed', () => {
            const input = 'Jhizz';
            const result = () => { Scrape.JSON_data(input) };
            assert.throws(result, /Invalid champion name provided/);
        })
    })
    describe('#OPGG_data', () => {
        describe('#overview', () => {
            it('resolves to an object containing data from champs op.gg overview page', async function () {
                this.timeout(3000);
                const input = Scrape.JSON_data("Fizz");
                const expected = Object.assign(input, {
                    roles: ["Middle"],
                    tier: 'Tier 2'
                });
                // Asynchronous assertion pattern 1
                return Scrape.OPGG_data.overview(input).then(result => {
                    assert.deepStrictEqual(result, expected)
                })
            })
            it('resolves to an object containing data from champs op.gg overview page (multiple roles)', async function () {
                this.timeout(3000);
                const input = Scrape.JSON_data("Ekko")
                const expected = Object.assign(input, {
                    roles: ["Jungle", "Middle"],
                    tier: "Tier 2"
                });

                return Scrape.OPGG_data.overview(input).then(result => {
                    assert.deepStrictEqual(result, expected)
                })
            })
            it('returns null values if desired data is not available', async function () {
                this.timeout(3000);
                const input = Scrape.JSON_data("Amumu")
                const expected = Object.assign(input, {
                    roles: null,
                    tier: null
                });

                return Scrape.OPGG_data.overview(input).then(result => {
                    assert.deepStrictEqual(result, expected)
                })
            })
        })
        describe('#items', () => {
            it('resolves to an object containing data from op.gg items page (1 role)', async function () {
                this.timeout(5000);
                const input = await Scrape.OPGG_data.overview(Scrape.JSON_data("Fizz"));
                const expected = {
                    mid: {
                        core: ["Zhonya's Hourglass", "Luden's Tempest", "Lich Bane"],
                        boots: "Ionian Boots of Lucidity",
                        starter: ["Corrupting Potion"]
                    }
                }
                // Asynchronous assertion pattern 2
                const result = await Scrape.OPGG_data.items(input);
                assert.deepStrictEqual(result, expected);
            })
            it('resolves to an object containing data from op.gg items page (multiple roles)', async function () {
                this.timeout(5000);
                const input = await Scrape.OPGG_data.overview(Scrape.JSON_data("Ekko"));
                const expected = {
                    jungle: {
                        core: ["Hextech Rocketbelt", "Lich Bane", "Zhonya's Hourglass"],
                        boots: "Sorcerer's Shoes",
                        starter: ["Hailblade", "Refillable Potion"]
                    },
                    mid: {
                        core: ["Hextech Rocketbelt", "Lich Bane", "Zhonya's Hourglass"],
                        boots: "Sorcerer's Shoes",
                        starter: ["Corrupting Potion"]
                    }
                }
                const result = await Scrape.OPGG_data.items(input);
                assert.deepStrictEqual(result, expected);
            })
        })
        describe('#skills', () => {
            it('resolves to an array ordered for the champions best skill path', async function () {
                this.timeout(5000);
                const input = await Scrape.OPGG_data.overview(Scrape.JSON_data("Fizz"));
                const expected = {
                    mid: ['E', 'W', 'Q']
                };
                const result = await Scrape.OPGG_data.skills(input);
                assert.deepStrictEqual(result, expected);
            })
            it('resolves to an array ordered for the champions best skill path (multiple roles)', async function () {
                this.timeout(5000);
                const input = await Scrape.OPGG_data.overview(Scrape.JSON_data("Ekko"));
                const expected = {
                    jungle: ['Q', 'E', 'W'],
                    mid : ['Q', 'E', 'W']
                };
                const result = await Scrape.OPGG_data.skills(input);
                assert.deepStrictEqual(result, expected);
            })
        })
        describe('#runes', () => {
            it('returns an array containing the champs best rune setup', async function () {
                this.timeout(5000);
                const input = await Scrape.OPGG_data.overview(Scrape.JSON_data("Fizz"));
                const expected = {
                    mid: ['Domination', 'Electrocute', 'Precision']
                }
                const result = await Scrape.OPGG_data.runes(input);
                assert.deepStrictEqual(result, expected);
            })
            it('resolves to an object containing an array of rune data (multiple roles)', async function () {
                this.timeout(5000);
                const input = await Scrape.OPGG_data.overview(Scrape.JSON_data("Ekko"));
                const expected = {
                    jungle: ['Domination', 'Dark Harvest', 'Inspiration'],
                    mid: ['Domination', 'Electrocute', 'Sorcery']
                }
                const result = await Scrape.OPGG_data.runes(input);
                assert.deepStrictEqual(result, expected);
            })
        })
        describe('#trends', () => {
            it('resolves to an object containing champion trend data', async function (){
                this.timeout(5000);
                const input = await Scrape.OPGG_data.overview(Scrape.JSON_data('Fizz'));
                const expected = {
                    mid : {
                        winrate : 50.47,
                        pickrate : 5.97,
                        banrate : 16.54
                    }
                };
                const result = await Scrape.OPGG_data.trends(input);
                assert.deepStrictEqual(result, expected);
            })
            it('seperates role data into their own objects', async function (){
                this.timeout(5000);
                const input = await Scrape.OPGG_data.overview(Scrape.JSON_data('Ekko'));
                const expected = {
                    jungle: {
                        winrate: 48.5,
                        pickrate: 5.1,
                        banrate: 2.97
                    },
                    mid : {
                        winrate : 51.9,
                        pickrate : 4.2,
                        banrate : 2.97
                    }
                };
                const result = await Scrape.OPGG_data.trends(input);
                assert.deepStrictEqual(result, expected);
            })
        })
        describe('#counters', () => {
            it('returns stats for common matchups', async function() {
                this.timeout(5000);
                const input = await Scrape.OPGG_data.overview(Scrape.JSON_data('Fizz'));
                const expected = {
                    mid : {}
                };
                const expected_length = 50;
                const result = await Scrape.OPGG_data.counters(input);
                assert.deepEqual(Object.keys(result), Object.keys(expected));
                assert.equal(Object.keys(result.mid).length, expected_length);
            })
            it('returns stats for common matchups in each role', async function() {
                this.timeout(5000);
                const input = await Scrape.OPGG_data.overview(Scrape.JSON_data('Ekko'));
                const expected = {
                    jungle: {},
                    mid : {}
                };
                const result = await Scrape.OPGG_data.counters(input);
                assert.deepEqual(Object.keys(result), Object.keys(expected));
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
                "Fizz": Scrape.champ(input[0]),
                "Zoe": Scrape.champ(input[1])
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
            const input = { "Jhizz": {}, "Fizz": {}, "Glizz": {} };
            const result = Scrape.champ(input);
            const expected = Scrape.champ("Fizz");
            assert.deepStrictEqual(result, expected);
        })
        it('filter out any invalid champion names in given JSON file (multiple valid)', () => {
            const input = { "Jhizz": {}, "Fizz": {}, "Glizz": {}, "Zoe": {} };
            const result = Scrape.champ(input);
            const expected = Scrape.champ(["Fizz", "Zoe"]);
            assert.deepStrictEqual(result, expected);
        })
    })
    describe('#validate_input', () => {
        it('returns false for invalid champion names', () => {
            const expected = false;
            const input = "Jhizz";
            const result = Scrape.validate_input(input);
            assert.equal(result, expected);
        })
        it('returns false for invalid champion objects', () => {
            const expected = false;
            const input = {
                name: "Jhizz",
                winrate: 50.0,
                pickrate: 4.99
            };
            const result = Scrape.validate_input(input);
            assert.equal(result, expected);
        })
        it('returns an error if object has no name property', () => {
            const input = {
                winrate: 50.0,
                pickrate: 4.99
            };
            const expected = Error('No property "name" found on input.');
            const result = Scrape.validate_input(input);
            assert.deepEqual(result, expected);
        })
    })
})