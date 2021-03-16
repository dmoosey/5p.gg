const Scrape = require('./scrape');
const mongoose = require('mongoose');
const champ_data = require('../data/champs.json')

const Schema = mongoose.Schema;

const champ_schema = new Schema({
    _id : String,
    overview: {
        id: String,
        name: String,
        key: String,
        title: String,
        tags: [String],
        roles: [String],
        tier: String
    },
    items: Schema.Types.Mixed,
    skills: Schema.Types.Mixed,
    runes: Schema.Types.Mixed,
    trends: Schema.Types.Mixed,
    counters: Schema.Types.Mixed,
});

const Champ = mongoose.model('Champ', champ_schema, 'champs');

const mongo_uri = "mongodb+srv://dmoore:Nkv1Tp0EnrYdChnf@5pgg.xwr1h.mongodb.net/Champion?retryWrites=true&w=majority";

// Connect to the MongoDB cluster
try {
    // Connect to the MongoDB cluster
    mongoose.connect(
        mongo_uri, { useNewUrlParser: true, useUnifiedTopology: true }, () =>
        console.log(" Mongoose is connected")
    );

} catch (e) {
    console.log("could not connect");
}

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));

db.once('open', async function () {
    for (const champ of Object.keys(champ_data)) {

        if(await Champ.findById(champ)) continue //skip already existing entries for now

        const doc = new Champ(await Scrape.champ(champ));
        doc._id = champ;

        await doc.save(function (err, champion) {
            if (err) return console.error(err);
            console.log(champ, ' data saved to db.')
        });
    };
});

console.log('All champs updated.')