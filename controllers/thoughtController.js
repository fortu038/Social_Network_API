const { ObjectId } = require('mongoose').Types;
const { User, Thought, Reaction } = require('../models');

module.exports = {
  getThoughts(req, res) {
    Thought.find()
      .then(async (thoughts) => {
        const thoughtObj = {
          thoughts,
        };
        return res.json(thoughtObj);
      })
      .catch((err) => {
        console.log(err);
        return res.status(500).json(err);
      });
  },

  getSingleThought(req, res) {
    // console.log(">>>getSingleThought");
    // res.sendStatus(200);
    Thought.findOne({ _id: req.params.thoughtId })
    .select('-__v')
    .then(async (thought) =>
      !thought
        ? res.status(404).json({ message: 'No thought with that ID' })
        : res.json({
            thought,
          })
    )
    .catch((err) => {
      console.log(err);
      return res.status(500).json(err);
    });
  },

  createThought(req, res) {
    Thought.create(req.body)
      .then(async (newThought) => {
        await User.findOneAndUpdate(
            {username: req.body.username},
            {$addToSet: {thoughts: newThought._id}},
            {new: true}
          );
      })
      .then((user) =>
      !user
        ? res.status(404).json({
            message: 'Thought created but no user with that name was found',
          })
        : res.json("Created thought")
      )
      .catch((err) => res.status(500).json(err));
  },

  updateThought(req, res) {
    // console.log(">>>updateThought");
    // res.sendStatus(200);
    Thought.findOneAndUpdate(
      { _id: req.params.thoughtId },
      { $set: req.body },
      { runValidators: true, new: true }
    )
      .then((updatedThought) =>
        !updatedThought
          ? res.status(404).json({ message: 'No thought with this ID!' })
          : res.json(updatedThought)
      )
      .catch((err) => {
        console.log(err);
        res.status(500).json(err);
      });
  },

  deleteThought(req, res) {
    // console.log(">>>deleteThought");
    // res.sendStatus(200);
    Thought.findOneAndDelete({ _id: req.params.thoughtId })
      .then((thought) =>
        !thought
          ? res.status(404).json({ message: 'No thought with that ID' })
          : User.findOneAndUpdate(
            { username: thought.username},
            {$pull: {thoughts: req.params.thoughtId}},
            {runValidators: true, new: true}
          )
      )
      .then(() => res.json({ message: 'Thought and reactions deleted!' }))
      .catch((err) => res.status(500).json(err));
  },

  addReaction(req, res) {
    // console.log(">>>addReaction");
    // res.sendStatus(200);
    Thought.findOneAndUpdate(
      { _id: req.params.thoughtId },
      { $addToSet: { reactions: req.body } },
      { runValidators: true, new: true}
    )
      .then((thought) =>
        !thought
          ? res.status(404).json({message: "No thought with this ID"})
          : res.json(thought)
      )
      .catch((err) => res.status(500).json(err));
  },

  deleteReaction(req, res) {
    // console.log(">>>deleteReaction");
    // res.sendStatus(200);
    Thought.findOneAndUpdate(
      { _id: req.params.thoughtId },
      { $pull: { reactions: { reactionId: req.params.reactionId } } },
      { runValidators: true, new: true }
    )
      .then((thought) =>
        !thought
          ? res.status(404).json({ message: 'No thought with this id!' })
          : res.json(thought)
      )
      .catch((err) => res.status(500).json(err));
  }
};