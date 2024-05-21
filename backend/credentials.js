const mongoose = require('mongoose');

const User = new mongoose.Schema({
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        require:true
    }

});

const UserModel = mongoose.model("Credential", User);
module.exports  = UserModel;