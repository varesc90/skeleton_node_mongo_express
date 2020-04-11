
var {Transaction} = require("../models/transaction");

var createTransaction = (req,res)=>{
    var transaction = new Transaction({
        amount:req.body.amount,
        type:req.body.type
    });

    transaction.save().then((doc)=>{
        res.send(doc);
    },(err)=>{
        res.status(400).send(err);
    });
}

module.exports= {createTransaction};