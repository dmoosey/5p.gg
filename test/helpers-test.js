const assert = require('assert');
const Helpers = require('../utils/helpers');

describe('Helpers', () => {
    describe('imgurl_to_string', () => {
        it('returns the name of the item in the image', () => {
            const input = '//opgg-static.akamaized.net/images/lol/item/4636.png?image=q_auto:best&v=1612855207';
            const expected = 'Night Harvester';
            const result = Helpers.imgurl_to_string(input);
            assert.equal(result, expected);
        })
    })
})