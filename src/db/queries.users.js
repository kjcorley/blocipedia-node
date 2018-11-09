const User = require("./models").User;
const bcrypt = require("bcryptjs");

module.exports = {
    createUser(newUser, callback){
        const salt = bcrypt.genSaltSync();
        const hashedPassword = bcrypt.hashSync(newUser.password, salt);
        return User.create({
            name: newUser.name,
            email: newUser.email,
            password: hashedPassword
        })
        .then((user) => {
            callback(null, user);
        })
        .catch((err) => {
            callback(err);
        })
    },
    changeRole(user, newRole, callback){
        return User.findById(user.id)
        .then((user) => {
            user.update({role: newRole})
            .then((user) => {
                callback(null, user);
            })
            .catch((err)=>{
                callback(err);
            })
        })
        .catch((err) => {
            callback(err);
        })
    },
}