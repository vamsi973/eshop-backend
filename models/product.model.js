const mongoose = require('mongoose');

const productSchema = mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    richDescription: { type: String, required: true },
    image: { type: String, default: '' },
    images: [{ type: String }],
    brand: { type: String, required: true },
    price: { type: Number, required: true },
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
    countInStock: {
        type: Number,
        required: true,
        min: 0,
        max: 255
    },
    rating: { type: Number, default: 0 },
    numReviews: { type: Number, default: 0 },
    isFeatured: { type: Boolean, default: false },
    dateCreated: { type: Date, default: Date.now },
});

productSchema.virtual('id').get(() => {
    return this._id.myDT.toHexString();
})

productSchema.set('toJson', {
    virtuals: true
})
exports.Product = mongoose.model('Product', productSchema);