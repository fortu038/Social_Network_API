const { ObjectId } = require('mongoose').Types;
const { User, Thought } = require('../models');

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
    // console.log(">>>createThought");
    // res.sendStatus(200);
    Thought.create(req.body)
      .then(async (newThought) => {
        console.log(newThought);
        // console.log(req.body);
        await User.findOne({ username: req.body.username})
          // .then(async (user) => await console.log(thought._id));
          .then(async (user) => {
            console.log(user);
            await user.thoughts.push(newThought._id);
          });
          // ^ This insertion isn't working right; how can I fix it?

        res.json(newThought);
      })
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
    console.log(">>>deleteThought");
    res.sendStatus(200);
  },

  addReaction(req, res) {
    console.log(">>>addReaction");
    res.sendStatus(200);
  },

  deleteReaction(req, res) {
    console.log(">>>deleteReaction");
    res.sendStatus(200);
  }
};