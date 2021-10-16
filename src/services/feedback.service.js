const { Feedback } = require("../models/feedback.model");

class FeedbackService {

    static addFeedback = async (description , rating) => {
        try {
            const feedback =new Feedback({
                description,
                rating
            });
            await feedback.save();
            
            return feedback;
        } catch(error) {
            throw new Error(`Error occured : ${error}`);
        }
    }
}

module.exports = {
    FeedbackService
}