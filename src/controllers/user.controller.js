const { validationResult } = require('express-validator')
const { UserService } = require('../services/user.service');
const { FeedbackService } = require('../services/feedback.service');
const bcrypt = require('bcrypt');
const { TweetService } = require('../services/tweet.service');

class userController {

    static checkCurrUser = async (req,res) => {
        const user = await UserService.getUserByUsername(req.user);
        if(!user) {
            res.status(404).json({message : 'user not found'});
        }
        return user;
    }

    static getLoginUser = (req,res,_next) => {
        
    }

    static postLoginUser = async (req,res,_next) => {
        try {
        const error =  validationResult(req);
        if(!error.isEmpty()) {
            return next( new Error("Invalid Input Bro") );
        }

        const { username , password } = req.body;
        let user;
            user =  await UserService.getUserByUsername(username);
        if(user) {
            let hashedPassword = user.password;
            const verified = bcrypt.compareSync(password,hashedPassword);
            if(verified) {
                res.status(200).json({ message : 'LoggedIn'});
            } else {
                res.status(200).json({ message : 'Invalid Password'})
            }
        } else {
            res.status(403).json({ message : 'Invalid Username'});
        }
    }  catch(error) {
        return next(new Error('Error Occured'));
    }
    } 

    static getSignUpUser = (req,res,_next) => {
    }

    static postSignUpUser = async (req,res,next) => {
        try {
       const error =  validationResult(req);
        if(!error.isEmpty()) {
            return next( new Error("Invalid Input Bro") );
        }

        const { username, password, name, email } = req.body;
        let user = await UserService.getOneUserByEmailAndUsername( username, email, next);
        if(user) {
            console.log({user});
           return res.status(403).json({ message : "User Already Exists" });
        } 

        const createdUser = UserService.createUser(username, password, email, name, next);

       return res.status(200).json({ message : 'User Created' });
    } catch(error) {
        return next(new Error( `Some error occurred : ${error}` ));
         }

    }

    static postFollowUser = async (req,res,next) => {
        try {
            const user = await this.checkCurrUser(req,res);
            if(!user) return;
            const userToBeFollowed = await UserService.getUserByUsername(req.params.username);
            if(!userToBeFollowed) {
                return next(new Error("Error Occured"));
            }

            let ifFollowed = false;
            user.following.forEach(p => {  //Can do Better
                if(p._id.toString() === userToBeFollowed._id.toString()) {
                    ifFollowed = true; 
                }
            })

            userToBeFollowed.followers.forEach(p => {
                if(p._id.toString() === user._id.toString()) {
                    ifFollowed = ifFollowed && true; 
                }
            })

            if(ifFollowed) {
                return next(new Error('Already Followed'));
            }
 
            if(user._id.toString() === userToBeFollowed._id.toString()) {
                throw new Error('Cant Follow yourself');
            }
           user.following = [...user.following, userToBeFollowed._id];
            await user.save();
            userToBeFollowed.followers = [...userToBeFollowed.followers, user._id];
            await userToBeFollowed.save();
           return res.send({message : "Followed"});
        } catch(error) {
            return next(new Error(`Error occured : ${error}`));
        }
    }

    static postUnfollowUser = async (req,res,next) => {
        const user = await this.checkCurrUser(req,res);
        if(!user) return;

        const userToBeUnFollowed = await UserService.getUserByUsername(req.params.username);
            if(!userToBeUnFollowed) {
                return next(new Error("Error Occured"));
            }
         let ifFollowed = false;
         user.following.forEach(p => {  //Can do Better
             if(p._id.toString() === userToBeUnFollowed._id.toString()) {
                ifFollowed = true; 
             }
         })

        userToBeUnFollowed.followers.forEach(p => {
             if(p._id.toString() === user._id.toString()) {
                ifFollowed = ifFollowed && true; 
             }
        })

        if(!ifFollowed) {
            return next(new Error('Not Following'));
        }

        const updatedFollowerList = user.following.filter(p => 
            userToBeUnFollowed._id.toString()!==p._id.toString()
        )
        user.following = updatedFollowerList;

        const updatedFollowingList = userToBeUnFollowed.followers.filter(p => 
            user._id.toString()!==p._id.toString()
        )
        userToBeUnFollowed.followers = updatedFollowingList;

        await user.save();
        await userToBeUnFollowed.save();

        res.status(200).json({ message : 'Unfollowed'});
 
    }

    static getFollowers = async (req,res,next) => {
        const user = await this.checkCurrUser(req,res);
        if(!user) return;

        await user.populate('followers');
        const followersList = user.following.map(f => {
            return {
               _id : f._id, 
               name: f.name, 
               username : f.username, 
               email : f.email, 
               followers: f.followers,
               following:  f.following, 
               tweets : f.tweets
            };
        });
        return res.status(200).json({followersList});
        }
    
    static getFollowing = async (req,res,next) => {
        const user = await this.checkCurrUser(req,res);
        if(!user) return;

        await user.populate('following');
        const followingList = user.following.map(f => {
            return {
               _id : f._id, 
               name: f.name, 
               username : f.username, 
               email : f.email, 
               followers: f.followers,
               following:  f.following, 
               tweets : f.tweets
            };
        });
       
        return res.status(200).json({followingList});
    }

    static postTerminateAccount = async (req,res,next) => {
        const user = await this.checkCurrUser(req,res);
        if(!user) return;

       const { description , rating } = { description: "Nice app", rating: 5 }; //req.body
        
        await FeedbackService.addFeedback(description, rating);
        await TweetService.deleteAllTweets(user);
        const deleteUser = await UserService.deleteUser(user);
        

        return res.json({message : `Deleted User : ${deleteUser.username}`});

    }

}

module.exports = {userController};