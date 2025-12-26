const express = require('express');
const router = express.Router();
const Candidate = require('../models/candidate');
const User = require('../models/user');
const {jwtAuthMiddleware} = require('../jwt');

// vote count 
router.get('/count', async (req, res) => {
    try{
        // Find all candidates and sort them by voteCount in descending order
        const candidate = await Candidate.find().sort({voteCount: 'desc'});

        // Map the candidates to only return their name and voteCount
        const voteRecord = candidate.map((data)=>{
            return {
                name: data.name,
                party: data.party,
                count: data.voteCount
            }
        });

        return res.status(200).json(voteRecord);
    }catch(err){
        console.log(err);
        res.status(500).json({error: 'Internal Server Error'});
    }
});

router.get('/:candidateID', jwtAuthMiddleware, async (req, res) => {
  try {
    const candidateID = req.params.candidateID;
    const userId = req.user.id;

    const candidate = await Candidate.findById(candidateID);
    if (!candidate) {
      return res.status(404).json({ message: 'Candidate not found' });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.role === 'admin') {
      return res.status(403).json({ message: 'Admin is not allowed' });
    }

    // ✅ Prevent double voting
    if (user.isVoted) {
      return res.status(400).json({
        message: 'You have already voted',
        hasVoted: true
      });
    }

    // ✅ Record vote
    candidate.votes.push({ user: userId });
    candidate.voteCount += 1;
    await candidate.save();

    // ✅ Update user voting status
    user.isVoted = true;
    await user.save();

    return res.status(200).json({
      message: 'Vote recorded successfully',
      hasVoted: true
    });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});



// Get List of all candidates with only name and party fields
router.get('/', async (req, res) => {
    try {
        // Find all candidates and select only the name and party fields, excluding _id
        const candidates = await Candidate.find({}, 'name party -_id');

        // Return the list of candidates
        res.status(200).json(candidates);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;