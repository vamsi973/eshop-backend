const mongoose = require('mongoose');

const categorySchema = mongoose.Schema({
    name: { type: String, required: true },
    color: { type: String, required: true },
    icon: { type: String, }
});


categorySchema.virtual('id').get(() => {
    return this._id.myDT.toHexString();
})

categorySchema.set('toJson', {
    virtuals: true
})

exports.Category = mongoose.model('Category', categorySchema);