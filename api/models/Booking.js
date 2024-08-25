const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const bookingSchema = new Schema({
    owner: {type: mongoose.Schema.Types.ObjectId, ref:'User', required: true},
    place: {type: mongoose.Schema.Types.ObjectId, ref:'Place', required: true},
    checkIn: {type:Date, required: true},
    checkOut: {type:Date, required: true},
    totalOfGuests: {type: Number, required: true},
    name: {type: String, required: true},
    phone: {type: String, required: true},
    price: {type:Number, required: true}
});

const BookingModel = mongoose.model('Booking', bookingSchema);
module.exports = BookingModel;