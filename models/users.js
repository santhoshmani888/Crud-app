let mongoose = require('mongoose');

let usersSchema = mongoose.Schema({
    username:{
        type:String,
        required: true
    },
    email:{
        type:String,
        required: true
    },
    bday:{
        type:String,
        required : true
    }
    
    
});
let users = module.exports = mongoose.model('users',usersSchema);

