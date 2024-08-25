const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const placeSchema = new Schema({
    owner: {type: mongoose.Schema.Types.ObjectId, ref:'User'},
    title: String,
    address: String,
    photos: [String],
    description: String,
    perks: [String],
    extraInfo: String,
    checkIn: Number,
    checkOut: Number,
    maxGuests: Number,
    maxBaby: Number,
    maxChilds: Number,
    price: Number,
}, { timestamps: true});

const PlaceModel = mongoose.model('Place', placeSchema);
module.exports = PlaceModel;