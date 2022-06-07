
const mongoose = require('mongoose');


const productSchema = new mongoose.Schema({
    title: {
        type: String,
        required: 'Title is required',
        unique: true,
        trim: true
    },
    description: {
        type: String,
        required: 'Description is required',
        trim: true
    },
    price: {

        type:Number,
        required:true, 
        //valid number/decim
        type: Number,
        required: 'Price is required'

    },
    currencyId: {
        type: String,
        required: "Currency Id is required",
        enum: ['INR'],
        trim:true,
    },
    currencyFormat: {
        type: String,
        trim:true,
        required: 'Currrency format is required',
    },
    isFreeShipping: {
        type:Boolean,
         default: false
        },
    productImage: { type:String,
        required:true,
    },  // s3 link
    style: { type:String,
       },
    availableSizes: {
        type:[String],
         enum:["S", "XS","M","X", "L","XXL", "XL"]},
    installments: {
        type:Number
    },
    deletedAt: {
        type:Date,
        default:null //when the document is deleted
    }, 
    isDeleted: {
        type: Boolean,
        default: false
    },

}, { timestamps: true });

module.exports=mongoose.model('product',productSchema) 