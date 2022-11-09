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
    // console.log(">>>deleteThought");
    // res.sendStatus(200);
    Thought.findOneAndDelete({ _id: req.params.thoughtId })
      .then((thought) =>
        !thought
          ? res.status(404).json({ message: 'No thought with that ID' })
          : User.deleteMany({ _id: { $in: thought.reactions } })
      )
      .then(() => res.json({ message: 'Thought and reactions deleted!' }))
      .catch((err) => res.status(500).json(err));
  },

  addReaction(req, res) {
    // console.log(">>>addReaction");
    // res.sendStatus(200);
    Thought.findOne({_id: req.params.thoughtId})
      .then((thought) => {
        // console.log(thought);
        !thought
          ? res.status(404).json({message: "No thought with that ID found"})
          : () => {
            Reaction.create(req.body)
              .then((reaction) => {
                console.log(reaction);
                thought.reactions.push(reaction._id)
              })
          }
      })
      .then((result) => {
        // console.log(result);
        !result
          ? res.status(404).json({message: "Reaction not added"})
          : res.json({message: "Reaction added"})
        })
      .catch((err) => {
        console.log(err);
        res.status(500).json(err);
      })
  },

  deleteReaction(req, res) {
    console.log(">>>deleteReaction");
    res.sendStatus(200);
  }
};