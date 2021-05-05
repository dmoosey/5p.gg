const Champ = require('../data/Champ');
const db = require('./db');

db.on('error', console.error.bind(console, 'connection error:'));

get_champ_data = async function (c) {
    champ_data = await Champ.findById(c);
    return champ_data
}

log_data = async function (c){
    champ_data = await get_champ_data(c);
    console.log(champ_data.overview.title)
}

log_data('Fizz')

