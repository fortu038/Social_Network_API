const { ObjectId } = require('mongoose').Types;
const { User, Thought, Reaction } = require('../models');

const getAllThoughts = async (req, res) => {
  try {
    const getAllQuery = await Thought.find({});

    res.status(200).json({ result: "success", payload: getAllQuery });
  }
  catch(err) {
    res.status(404).json({ message: "A connection issue has occured. Please check your connection or try again later." });
  }
};

const getThoughtById = async (req, res) => {
  try {
    const getByIdQuery = await Thought.findById(req.params.thoughtId);

    if(getByIdQuery === null) {
      res.status(400).json({ message: "No thought with that ID found!" });
      return;
    }

    res.status(200).json({ result: "success", payload: getByIdQuery });
  }
  catch(err) {
    res.status(404).json({ message: "A connection issue has occured. Please check your connection or try again later." });
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
    const txt = req.body.thoughtText;
    const usr = req.body.username;

    if(txt === undefined) {
      res.status(400).json({ message: "No thought text provided." });
      return;
    }

    if(usr === undefined) {
      res.status(400).json({ message: "No username associated with this thought." });
      return;
    }

    res.status(404).json({ message: "An error occured while trying create a thought. Please check your connection or try again later." });
  }
};

const updateThoughtById = async (req, res) => {
  try {
    const updateByIdQuery = await Thought.findOneAndUpdate(
      {_id: req.params.thoughtId},
      { $set: req.body },
      { runValidators: true, new: true }
    );

    if(updateByIdQuery === null) {
      res.status(400).json({ message: "No thought with that ID found so no updates could be made" });
      return;
    }

    res.status(200).json({ result: "success", payload: updateByIdQuery });
  }
  catch(err) {
    res.status(404).json({ message: "An error occured while trying to update this thought. Please check your connection or try again later."});
  }
};

const deleteThoughtById = async (req, res) => {
  try {
    const thought_id = req.params.thoughtId

    const delByIdQuery = await Thought.findOneAndDelete({ _id: thought_id });
    
    if(delByIdQuery === null) {
      res.status(400).json({ message: "No thought found with that ID!" });
      return;
    }

    const ownerOfThoughtQuery = await User.findOneAndUpdate(
      {username: delByIdQuery.username},
      {$pull: {thoughts: thought_id}},
      {runValidators: true, new: true}
    );

    if(ownerOfThoughtQuery === null) {
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
    const addReactionQuery = await Thought.findOneAndUpdate(
      { _id: req.params.thoughtId },
      { $addToSet: { reactions: req.body } },
      { runValidators: true, new: true}
    );

    if(addReactionQuery === null) {
      res.status(400).json({ message: "No thought with that ID found so no reactions could be added." });
      return;
    }

    res.status(200).json({ result: "success", payload: addReactionQuery })
  }
  catch(err) {
    const body = req.body;

    if(body.username === undefined) {
      res.status(400).json({ message: "No username assoicated with this reaction so it cannot be posted." });
      return;
    }

    if(body.reactionBody === undefined) {
      res.status(400).json({ message: "This reaction has no body text so it can't be posted." });
      return;
    }

    res.status(404).json({ message: "An error occured while trying to add a reaction. Please check your connection or try again later." });
  }
};

const deleteReactionById = async (req, res) => {
  try {
    const thought_id = req.params.thoughtId;
    const reaction_id = req.params.reactionId;

    const thoughtCheck = await Thought.findOne({ _id: thought_id });

    if(thoughtCheck === null) {
      res.status(400).json({ message: "No thought with that ID found so no reactions can be deleted from it." });
      return;
    }

    let is_found = thoughtCheck.reactions.find(reaction => reaction.reactionId.toString() === reaction_id);

    if(is_found === undefined) {
      res.status(400).json({ message: "No reaction with that ID assoicated with this thought." });
      return;
    }

    const delReactionQuery = await Thought.findOneAndUpdate(
      { _id: thought_id },
      { $pull: { reactions: { reactionId: reaction_id } } },
      { runValidators: true, new: true }
    );

    res.status(200).json({ result: "success", payload: delReactionQuery })
  }
  catch(err) {
    res.status(404).json({ message: "An error occured while trying to delete a reaction. Please check your connection or try again later." });
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