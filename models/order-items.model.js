const mongoose = require('mongoose');

const orderItemSchema = mongoose.Schema({
    product: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product',
            required: true
        }
    ],
    quantity: {
        type: Number,
        required: true
    },
});


orderItemSchema.virtual('id').get(() => {
    return this._id.myDT.toHexString();
})

orderItemSchema.set('toJson', {
    virtuals: true
})

exports.OrderItems = mongoose.model('OrderItems', orderItemSchema);