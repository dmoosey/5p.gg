const rune_data = require('../data/runes.json');

const imgurl_to_string = (url) => {
    let str = '';
    rune_data.forEach(tree => {
        if(url.includes(tree.id)){
            str = tree.name;
        } else {
            const keystones = tree.slots[0].runes;
            keystones.forEach(keystone => {
                if(url.includes(keystone.id)){
                    str = keystone.name;
                }
            })

        }
    })
    return str
}

module.exports = {imgurl_to_string};