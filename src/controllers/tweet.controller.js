const { TweetService } = require('../services/tweet.service');
const { UserService } = require('../services/user.service');

class tweetController {

    static checkCurrUser = async (req,res) => {
        const user = await UserService.getUserByUsername(req.user);
        if(!user) {
            res.status(404).json({message : 'user not found'});
        }
        return user;
    }

    static getUserTweets = async (req,res,next) => {
        const user = await this.checkCurrUser(req,res);
        if(!user) return;
        
        await user.populate('tweets');
        const tweets = user.tweets;
        return res.status(200).json({tweets});
    }

    static getOwnTweets = async (req, res, next) => {
        const user = await this.checkCurrUser(req,res);
        if(!user) return;

        await user.populate('tweets');
        const tweets = user.tweets;
        return res.status(200).json({tweets});
    }

    static postTweet = async (req, res, next) => {
        const user = await this.checkCurrUser(req,res);
        if(!user) return;

        const tweetBody = "another tweet";

        const tweet = await TweetService.createNewTweet(tweetBody, user);
        return res.status(200).json({tweet});
    }

    static postLikeTweet = async (req, res, next) => {
        const user = await this.checkCurrUser(req,res);
        if(!user) return;

        const tweetId = req.params.tweetId;
        const tweet = await TweetService.getTweetById(tweetId);
        tweet.like = [...tweet.like, user._id];
        await tweet.save();
        return res.status(200).json({message : "Liked Tweet"});

    }

    static postCommentTweet = async (req, res, next) => {
        const user = await this.checkCurrUser(req,res);
        if(!user) return;

        const tweetId = req.params.tweetId;
        const tweet = await TweetService.getTweetById(tweetId);
        const comment = {
            comment : "comment", //req.body
            user : user._id,
            time : new Date()
        }
        tweet.comment = [...tweet.comment, comment];
        await tweet.save();

        return res.status(200).json({ message : "Commented"});
    }

    static getFeeds =  async (req, res, next) => {
        const user = await this.checkCurrUser(req,res);
        if(!user) return;

        const tweets = await TweetService.getFeedTweets(user);

        return res.status(200).json({tweets});
    }

    static postEditTweet = async (req, res, next) => {
        const user = await this.checkCurrUser(req,res);
        if(!user) return;

        const tweetId = req.params.tweetId;
        const tweet = await TweetService.getTweetById(tweetId);
        if(!tweet) return res.json({ message : "Not found!"})
        const updatedTweet = "updated Tweet 789" ; //req body
        await TweetService.updatedTweet(updatedTweet, tweet);

        return res.status(200).json({tweet});
    }

    static deleteATweet = async (req, res, next) => {
        const user = await this.checkCurrUser(req,res);
        if(!user) return;

        const tweetId = req.params.tweetId;
        let ifTweeted = false;
        user.tweets.forEach(tweet => {
            if(tweet._id.toString()===tweetId.toString()) ifTweeted = true;
        });
        if(!ifTweeted) {
            return res.status(404).json({ message : 'User has not tweeted this or this tweet does not exist'});
        }
       
        const tweet = await TweetService.deleteTweetById(tweetId,user);
        if(!tweet) {
            return res.status(200).json({ message : "Error Deleting Tweet"}) ;
        } 
       return res.status(200).json({ message : "Deleted"}) ;

    }

}

module.exports = {tweetController};