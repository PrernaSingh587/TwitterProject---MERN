const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const FeedbackSchema = new Schema ({

        description : {
            type: String
        },
        rating : {
            type: Number
        }
        
})

const Feedback = mongoose.model('Feedback', FeedbackSchema);

module.exports = {
    Feedback
}