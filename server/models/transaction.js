var mongoose = require("mongoose");

var Transaction = mongoose.model('Transaction',{
    amount:{
        type: Number,
        required:true,
        minlength:1,
        trim:true
    },
    note:{
        type: String,
        default:null
    },
    type:{
        type: String,
        required:true,
    },
    // _creator:{
    //     type: mongoose.Schema.ObjectId,
    //     required:true
    // }
});

module.exports = {Transaction};