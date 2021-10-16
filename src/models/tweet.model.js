const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TweetSchema = new Schema( {

    tweet : { type : String, required : true },
     
    like : [{ type: mongoose.Types.ObjectId, ref: 'User'}],
    
    comment : [{
            comment : { type : String },
            user : { type : mongoose.Types.ObjectId, ref: 'User' },
            time : { type: String }
       }],

    creator : { type: mongoose.Types.ObjectId, ref: 'User' },
}, 
    { timestamps : true }
);

const Tweet = mongoose.model('Tweet', TweetSchema);

module.exports = {
    Tweet, 
}