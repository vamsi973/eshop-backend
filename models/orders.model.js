const mongoose = require('mongoose');

const orderSchema = mongoose.Schema({
    name: String,
    image: String,
    countInStock: {
        type: Number,
        required: true
    }
});


orderSchema.virtual('id').get(() => {
    return this._id.myDT.toHexString();
})

orderSchema.set('toJson', {
    virtuals: true
})

exports.Order = mongoose.model('Order', orderSchema);