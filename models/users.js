const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    email:{
        type: String,
        required:true
    },
    passwordHash:{
        type: String,
        required:true
    },
    isAdmin:{
        type: Boolean
    }
})

User = mongoose.model('User', userSchema);

module.exports = User;
