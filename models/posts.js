let mongoose = require('mongoose');

let postsSchema = mongoose.Schema({
    username:{
        type:String,
    },
    messages:{
        type:String,
    },
    updated_at:{
        type:Date,
    },
    visibility:{
        type:String
    }
    
});
let posts = module.exports = mongoose.model('posts',postsSchema);
