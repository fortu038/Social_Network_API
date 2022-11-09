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
    console.log(">>>createUser");
    res.sendStatus(200);
  },

  updateUser(req, res) {
    console.log(">>>updateUser");
    res.sendStatus(200);
  },

  deleteUser(req, res) {
    console.log(">>>deleteUser");
    res.sendStatus(200);
  },

  addFriend(req, res) {
    console.log(">>>addFriend");
    res.sendStatus(200);
  },

  deleteFriend(req, res) {
    console.log(">>>deleteFriend");
    res.sendStatus(200);
  }
};