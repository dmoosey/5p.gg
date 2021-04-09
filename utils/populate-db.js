const Scrape = require('./scrape');
const mongoose = require('mongoose');
const champ_data = Object.keys(require('../data/champs.json'));
const cliProgress = require('cli-progress');

mongoose.set('useFindAndModify', false);

const Schema = mongoose.Schema;

// rework schema with JSON -> schema mapping tool
const champ_schema = new Schema({
    _id: String,
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
mongoose.connect(
    mongo_uri, { useNewUrlParser: true, useUnifiedTopology: true }, () =>
    console.log(" Mongoose is connected")
);

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));

db.once('open', async function () {
    const champ_bar = new cliProgress.SingleBar({}, cliProgress.Presets.shades_classic);
    champ_bar.start(champ_data.length, 0);
    for (const champ of champ_data) {

        exists = await Champ.findById(champ);

        const doc = new Champ(await Scrape.champ(champ));
        doc._id = champ;

        if (exists) {
            await Champ.findOneAndUpdate({ _id: champ }, doc)
            champ_bar.increment();
            continue
        }

        await doc.save(function (err, champion) {
            if (err) return console.error(err);
            champ_bar.increment();
            console.log(champ, ' data saved to db.')
        });
    };
    champ_bar.stop();
    console.log('All champs updated.')
});

