const express = require('express');
const route = express.Router();

const {tweetController} = require('../controllers/tweet.controller');

route.get('/:username/tweets',tweetController.getUserTweets);
route.get('/tweets',tweetController.getOwnTweets);
route.post('/tweet',tweetController.postTweet);
route.post('/like/:tweetId',tweetController.postLikeTweet);
route.post('/comment/:tweetId', tweetController.postCommentTweet);
// route.put('/edit-comment/:tweetId',userController.postEditCommentTweet);
route.put('/:tweetId',tweetController.postEditTweet);
route.get('/feed', tweetController.getFeeds);
route.delete('/:tweetId',tweetController.deleteATweet);

module.exports = route;