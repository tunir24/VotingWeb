const mongoose = require('mongoose');

const CandidateSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true
    },
    party:{
        type: String,
        required: true
    },
    age:{
        type: Number,
        required: true
    },
    address:{
        type: String,
        required: true
    },
    votes:[{
            user:{
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User'
            },
            votedAt:{
                type: Date,
                default: Date.now   
        }
    }],
    voteCount:{
        type: Number,
        default: 0
    }
   
});

const candidate = mongoose.model('Candidate', CandidateSchema);
module.exports = candidate;