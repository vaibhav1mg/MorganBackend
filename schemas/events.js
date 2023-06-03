const mongoose =require("mongoose");
const {User,UserSchema} = require('./user');

// participants will be same as attendance !!
const eventSchema=new mongoose.Schema({
    sessionId:String, // to identify the session !!
    category:String,// category means like whether it is a legal camp or what !!
    participants:[UserSchema],
    feedback:[
        // which user and what feedback they have !!
        {
            user:[UserSchema],
            content:String
        }
    ]
})
// progress ? checklist ? how to maintain ?

const Event=mongoose.model("event",eventSchema);

module.exports=Event;