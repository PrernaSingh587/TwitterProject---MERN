const {User} = require('../models/user.model');
const bcrypt = require('bcrypt');

class UserService {
    static getOneUserByEmailAndUsername = async (username, email) => {
        let user;
        try {
           user = await User.findOne({ username, email });
           return user;
        } catch(error) {
            throw new Error(error);
        }
    }

    static createUser = async (username, password, email, name) => {
        let user; 
        try {
            const hashedPassword = bcrypt.hashSync(password, 10);
            console.log(hashedPassword);
            user = new User ({
                username,
                password : hashedPassword,
                email,
                name
            });
            await user.save();
            return user;
        } catch(error) {
            throw (new Error(error));
        }
    }

    static getUserByUsername = async (username) => {
        let user ;
        try {
            user = await User.findOne({ username });
            return user;
        } catch(error) {
            throw (new Error(error));
        }
    }

    static deleteUser =  async (user) => {
        try {
            await user.remove();
            return user;
        } catch(error) {
            throw (new Error(error));
        }
    }

}

module.exports = {
    UserService,
}