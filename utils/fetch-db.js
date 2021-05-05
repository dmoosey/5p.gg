const Champ = require('../data/Champ');
const db = require('./db');

c = 'Fizz';

db.on('error', console.error.bind(console, 'connection error:'));

db.once('open', async function () {
    console.log(await Champ.findById(c))
});
