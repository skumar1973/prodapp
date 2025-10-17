const {Schema, model} = require("mongoose");

const productSchema = new Schema({
    code : {
        type: String,
        required: true
    },
    name : {
        type: String,
        required: true
    },
    productImageURL:{
        type: String,
        default: "/images/default.png"
    },
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: "user"
    }

}, {timestamps: true}
);


const Product = model('product', productSchema);

module.exports = Product;

