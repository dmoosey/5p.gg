const mongoose = require('mongoose');

mongoose.set('useFindAndModify', false);

const mongo_uri = "mongodb+srv://dmoore:Nkv1Tp0EnrYdChnf@5pgg.xwr1h.mongodb.net/Champion?retryWrites=true&w=majority";

// Connect to the MongoDB cluster
mongoose.connect(
    mongo_uri, { useNewUrlParser: true, useUnifiedTopology: true }, () =>
    console.log(" Mongoose is connected")
);

const db = mongoose.connection;

module.exports = db;
