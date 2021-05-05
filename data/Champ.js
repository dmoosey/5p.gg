const mongoose = require('mongoose');

const Schema = mongoose.Schema;

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

module.exports = Champ