const mongoose = require('mongoose');
const { Schema } = mongoose;
const productSchema = new Schema({
    name: {
        type: String,
        required: true,
        min: 0
    },
    price: {
        type: Number,
        required: true,
        min: 0
    },
    category: {
        type: String,
        lowercase: true,
        enum: ['fruit', 'vegetable', 'dairy']
    },
    // this is the reference to the farm
    farm: {
        type: Schema.Types.ObjectId,
        ref: 'Farm'
    }

})

const Product = mongoose.model('Product', productSchema);

module.exports = Product;