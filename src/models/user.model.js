const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema ( {
    name : {
        type: String,
        required: true,
    },
    username : {
        type: String,
        index: true,
        unique: true,
        required: true,
    },
    email : {
        type: String,
        index: true,
        unique: true,
        required: true,
    },
    password : {
        type : String,
        required: true,
    },
    profilePic : {
        type : String,
    },
    coverPic : {
        type : String,
    },
    followers : [{
        type : mongoose.Types.ObjectId,
        ref : 'User',
        index : true,
    }],
    following : [{
        type : mongoose.Types.ObjectId,
        ref : 'User',
        index : true,
    }],
    tweets : [{
        type : mongoose.Types.ObjectId,
        ref : 'Tweet'
    }],
},
    { timestamps : true }  
);

const User = mongoose.model('User' , UserSchema);

module.exports = {
    User,
}

