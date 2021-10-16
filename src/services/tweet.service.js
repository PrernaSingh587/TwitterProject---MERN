const { Tweet } = require('../models/tweet.model');
const { UserService } = require('./user.service');

class TweetService {

    static getTweetById = async (tweetId) => {
        try {
            const tweet = await Tweet.findOne({_id : tweetId});
            if(!tweet) {
                return res.status(404).json({message : "Not found"});
            }
            return tweet;
        } catch(error) {
            throw (new Error(`Error Occured in fetching tweet : ${error}`));
        }
        
    }

    static createNewTweet = async (tweetBody,user) => {
        try {
           const tweet = new Tweet( {
                tweet: tweetBody,
                like : [],
                comment : [],
                creator : user._id
            });
            await tweet.save();
            user.tweets = [...user.tweets, tweet._id];
            await user.save();
            
            return tweet;
        } catch(error) {
            throw (new Error(`Error Occured in creating tweet : ${error}`));
        }
    }
    
    static getFeedTweets = async (user) => {
        try {
            await user.populate('following');
            const { following } = user;
            const followingWithTweetsPromises = following.map(f => {
                return f.populate('tweets');
            });

            const followingWithTweets = await Promise.all(followingWithTweetsPromises);

            const tweets = followingWithTweets.reduce((prevTweets, f) => {
                prevTweets = [...prevTweets, ...f.tweets];
                return [...prevTweets];
            }, []);

            console.log(tweets);
           return tweets;

        } catch(error) {
            throw (new Error(`Error Occured in fetching tweets : ${error}`));
        }
    }

    static updatedTweet = async (updatedTweet, tweet) => {
        try {
            tweet.tweet = updatedTweet;
        await tweet.save();
        return tweet;

        } catch(error) {
            throw (new Error(`Error Occured in fetching tweets : ${error}`));
        }
    }

    static deleteTweetById = async (tweetId, user) =>  {
        try {

            const deletedTweet = await Tweet.findById(tweetId);
            if(!deletedTweet) {
                return;
            }
            const delTweet = await deletedTweet.deleteOne();
            const updatedTweetsForUser = user.tweets.filter(t => t._id.toString()!==tweetId.toString());
            user.tweets = updatedTweetsForUser;
            await user.save();
            return delTweet;

        } catch(error) {
            throw (new Error(`Error Occured in fetching tweets : ${error}`));
        }
    }

    static deleteAllTweets = async (user) => {
        try {

            await Tweet.find({creator : user._id}).deleteMany();
            return ;

        } catch(error) {
            throw (new Error(`Error Occured in fetching tweets : ${error}`));
        }
        
    }

}

module.exports = {
    TweetService,
}