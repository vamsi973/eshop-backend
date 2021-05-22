const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    name: String,
    image: String,
    countInStock: {
        type: Number,
        required: true
    }
});


userSchema.virtual('id').get(() => {
    return this._id.myDT.toHexString();
})

userSchema.set('toJson', {
    virtuals: true
})
exports.User =mongoose.model('User', userSchema);