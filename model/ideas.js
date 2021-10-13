const mongoose = require('mongoose');

const ideaSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
    },

    name:{
        type: String,
        required: true,

    },
   title: {
        type: String,
    },
   description : {
        type: String,
    },
   
    
    created:{
        type:Date,
        default:()=> Date.now(),

    },


});
module.exports = mongoose.model("idea", ideaSchema);