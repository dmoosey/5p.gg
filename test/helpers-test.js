const assert = require('assert');
const Helpers = require('../utils/helpers');

describe('Helpers', () => {
    describe('imgurl_to_string', () => {
        it('returns the name of the rune in the image (Keystone)', () => {
            const input = '//opgg-static.akamaized.net/images/lol/perk/8112.png?image=c_scale,q_auto,w_42&v=1614735388';
            const expected = 'Electrocute';
            const result = Helpers.imgurl_to_string(input);
            assert.equal(result, expected);
        })
        it('returns the name of the rune in the image (Tree)', () => {
            const input = '//opgg-static.akamaized.net/images/lol/perkStyle/8100.png?image=c_scale,q_auto,w_26&v=1614735388';
            const expected = 'Domination';
            const result = Helpers.imgurl_to_string(input);
            assert.equal(result, expected);
        })
    })
})