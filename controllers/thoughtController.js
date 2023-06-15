const { ObjectId } = require('mongoose').Types;
const { User, Thought, Reaction } = require('../models');

const getAllThoughts = async (req, res) => {
  try {
    const getAllQuery = await Thought.find({});
    res.status(200).json({ result: "success", payload: getAllQuery });
  }
  catch(err) {
    res.status(404).json({ message: "Unable to find any thoughts. Please check your connection or try again later." });
  }
};

const getThoughtById = async (req, res) => {
  try {
    const getByIdQuery = await Thought.findById(req.params.thoughtId);
    res.status(200).json({ result: "success", payload: getByIdQuery });
  }
  catch(err) {
    res.status(400).json({ message: "No thought found with that ID!" });
  }
};

const createThought = async (req, res) => {
  try {
    const createQuery = await Thought.create(req.body);

    await User.findOneAndUpdate(
      {username: req.body.username},
      {$addToSet: {thoughts: createQuery._id}},
      {new: true}
    );

    res.status(201).json({result: "success", payload: createQuery});
  }
  catch(err) {
    if(req.body.thoughtText == null) {
      res.status(400).json({message: "No text in thought."});
      return;
    }

    const usernameCheck = await User.findOne({username: req.body.username});
    if(usernameCheck != null) {
      res.status(400).json({message: "No user found with that username."});
      return;
    }

    res.status(404).json({ message: "An error occured while trying create a user. Please check your connection or try again later." });
  }
};

const updateThoughtById = async (req, res) => {
  try {
    const updateByIdQuery = await Thought.findOneAndUpdate(
      {_id: req.params.thoughtId},
      { $set: req.body },
      { runValidators: true, new: true }
    );
    res.status(200).json({ result: "success", payload: updateByIdQuery });
  }
  catch(err) {
    const thoughtCheck = await Thought.findById(req.params.thoughtId);
    if(thoughtCheck == null) {
      res.status(400).json({ message: "No thought found with that ID, cannot update!" });
      return;
    }
    res.status(404).json({ message: "An error occured while trying to update this thought. Please check your connection or try again later."});
  }
};

const deleteThoughtById = async (req, res) => {
  try {
    const delByIdQuery = await Thought.findOneAndDelete({ _id: req.params.thoughtId });
    
    if(delByIdQuery == null) {
      res.status(400).json({ message: "No thought found with that ID!" });
      return;
    }

    const ownerOfThoughtQuery = await User.findOneAndUpdate(
      {username: delByIdQuery.username},
      {$pull: {thoughts: req.params.thoughtId}},
      {runValidators: true, new: true}
    );

    if(ownerOfThoughtQuery == null) {
      res.status(404).json({ message: "Thought deleted but no associated user found."});
      return;
    }

    res.status(200).json({ result: "success", payload: delByIdQuery });
  }
  catch(err) {
    res.status(400).json({ message: "An error occured while trying to delete this thought. Please check your connection or try again later." });
  }
};

const addReaction = async (req, res) => {
  try {
    if(req.body.username == null) {
      res.status(400).json({ message: "No username provided!" });
      return;
    }

    if(User.findOne({ username: req.body.username }) == null) {
      res.status(400).json({ message: "No user with that username found" });
      return;
    }

    if(req.body.reactionBody == null) {
      res.status(400).json({ message: "No reaction body text!"});
      return;
    }

    const thoughtCheck = Thought.findById(req.params.thoughtId);
    if(thoughtCheck == null) {
      res.status(400).json({ message: "No thought with that ID found!"});
      return;
    }

    const addReactionQuery = await Thought.findOneAndUpdate(
      { _id: req.params.thoughtId },
      { $addToSet: { reactions: req.body } },
      { runValidators: true, new: true}
    );

    res.status(200).json({ result: "success", payload: addReactionQuery })
  }
  catch(err) {
    res.status(404).json({ message: "An error occured while trying to add a reaction. Please check your connection or try again later." });
  }
};

const deleteReactionById = async (req, res) => {
  try {
    const delReactionQuery = await Thought.findOneAndUpdate(
      { _id: req.params.thoughtId },
      { $pull: { reactions: { reactionId: req.params.reactionId } } },
      { runValidators: true, new: true }
    );

    res.status(200).json({ result: "success", payload: delReactionQuery })
  }
  catch(err) {
    res.status(404).json({ message: "An error occured while trying to add a reaction. Please check your connection or try again later." });
  }
};

module.exports = {
  getAllThoughts,
  getThoughtById,
  createThought,
  addReaction,
  updateThoughtById,
  deleteThoughtById,
  deleteReactionById,
};