const { ObjectId } = require('mongoose').Types;
const { User, Thought } = require('../models');

const friendCount = async () => {
  User.aggregate()
    .count('friendCount')
    .then((numFriends) => numFriends);
}

module.exports = {
  getUsers(req, res) {
    User.find()
      .then(async (users) => {
        const userObj = {
          users,
        };
        return res.json(userObj);
      })
      .catch((err) => {
        console.log(err);
        return res.status(500).json(err);
      });
  },

  getSingleUser(req, res) {
    // console.log(">>>getSingleUser");
    // res.sendStatus(200);
    User.findOne({ _id: req.params.userId })
    .select('-__v')
    .then(async (user) =>
      !user
        ? res.status(404).json({ message: 'No user with that ID' })
        : res.json({
            user,
          })
    )
    .catch((err) => {
      console.log(err);
      return res.status(500).json(err);
    });
  },

  createUser(req, res) {
    // console.log(">>>createUser");
    // res.sendStatus(200);
    User.create(req.body)
      .then((user) => res.json(user))
      .catch((err) => res.status(500).json(err));
  },

  updateUser(req, res) {
    // console.log(">>>updateUser");
    // res.sendStatus(200);
    User.findOneAndUpdate(
      { _id: req.params.userId },
      { $set: req.body },
      { runValidators: true, new: true }
    )
      .then((updatedUser) =>
        !updatedUser
          ? res.status(404).json({ message: 'No user with this ID!' })
          : res.json(updatedUser)
      )
      .catch((err) => {
        console.log(err);
        res.status(500).json(err);
      });
  },

  deleteUser(req, res) {
    // console.log(">>>deleteUser");
    // res.sendStatus(200);
    User.findOneAndRemove({ _id: req.params.userId })
      .then((user) =>
        !user
          ? res.status(404).json({ message: 'No such user exists' })
          : Thought.findOneAndUpdate(
              { reactions: req.params.username },
              { $pull: { users: req.params.username } },
              { new: true }
            )
      )
      .then((thought) =>
        !thought
          ? res.status(404).json({
              message: 'User deleted, but no thoughts found',
            })
          : res.json({ message: 'User successfully deleted' })
      )
      .catch((err) => {
        console.log(err);
        res.status(500).json(err);
      });
  },

  addFriend(req, res) {
    // console.log(">>>addFriend");
    // res.sendStatus(200);
    User.findOne({_id: req.params.userId})
      .then((user) =>
        !user
          ? res.status(404).json({message: "No user with that ID found"})
          : User.findOne({_id: req.params.friendId})
            .then((friend) =>
            !friend
              ? res.status(404).json({message: "Nobody with that ID found"})
              : () => {
                if(user.friends.indexOf(friend._id) > -1) {
                  res.status(404).json({message: "You've already added this person"})
                }
                user.friends.push(friend._id) // <- Should I not be using push for ID arrays?
              }
            )
      )
      .then((result) =>
        !result
          ? res.status(404).json({message: "Friend not added"})
          : res.json({message: "Friend added"})
      )
      .catch((err) => {
        console.log(err);
        res.status(500).json(err);
      })
  },

  deleteFriend(req, res) {
    // console.log(">>>deleteFriend");
    // res.sendStatus(200);
    User.findOne({_id: req.params.userId})
      .then((user) => 
        !user
          ? res.status(404).json({message: "No user with that ID found"})
          : User.findOne({_id: req.params.friendId})
            .then((enemy) =>
              !enemy
                ? res.status(404).json({message: "Nobody with that ID found"})
                : () => {
                  const friendHolder = user.friends;
                  console.log(`>>>user is ${user}`);
                  const index = friendHolder.indexOf(enemy._id);

                  if(index <= -1 || friendHolder.length == 0) {
                    res.status(404).json({message: "No one in your friend list with that ID"});
                  }
                  friendHolder.splice(index, 1);
                }
            )
      )
      .then((result) =>
        !result
          ? res.status(404).json({message: "Friend not rmeoved"})
          : res.json({message: "Friend removed"})
      )
      .catch((err) => {
        console.log(err);
        res.status(500).json(err);
      })
  }
};