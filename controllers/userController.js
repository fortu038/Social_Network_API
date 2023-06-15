const { ObjectId } = require('mongoose').Types;
const { User, Thought } = require('../models');

const friendCount = async () => {
  User.aggregate()
    .count('friendCount')
    .then((numFriends) => numFriends);
}

const getAllUsers = async (req, res) => {
  try {
    const getAllQuery = await User.find({});
    res.status(200).json({ result: "success", payload: getAllQuery });
  }
  catch(err) {
    res.status(404).json({ message: "Unable to find any users. Please check your connection or try again later." });
  }
};

const getUserById = async (req, res) => {
  try {
    const getByIdQuery = await User.findById(req.params.userId)
    res.status(200).json({ result: "success", payload: getByIdQuery });
  }
  catch(err) {
    res.status(400).json({ message: "No user found with that ID!" });
  }
};

const createUser = async (req, res) => {
  try {
    const createQuery = await User.create(req.body);
    res.status(201).json({result: "success", payload: createQuery});
  }
  catch(err) {
    const usernameCheck = await User.findOne({username: req.body.username});
    if(usernameCheck != null) {
      res.status(400).json({message: "This username is already in use."});
      return;
    }

    const emailCheck = await User.findOne({email: req.body.email});
    if(emailCheck != null) {
      res.status(400).json({message: "This email is already in use."});
      return;
    }
    res.status(404).json({ message: "An error occured while trying create a user. Please check your connection or try again later." });
  }
};

const updateUserById = async (req, res) => {
  try {
    const updateByIdQuery = await User.findOneAndUpdate(
      {_id: req.params.userId},
      { $set: req.body },
      { runValidators: true, new: true }
    );
    res.status(200).json({ result: "success", payload: updateByIdQuery });
  }
  catch(err) {
    const userCheck = await User.findById(req.params.userId);
    if(userCheck == null) {
      res.status(400).json({ message: "No user found with that ID, cannot update!" });
      return;
    }
    res.status(404).json({ message: "An error occured while trying to update this user. Please check your connection or try again later."});
  }
};

const deleteUserById = async (req,res) => {
  try {
    const delByIdQuery = await User.findOneAndDelete({ _id: req.params.userId });

    res.status(200).json({ result: "success", payload: delByIdQuery });
  }
  catch(err) {
    res.status(400).json({ message: "No user found with that ID!" });
  }
};

const addFriendById = async (req, res) =>  {
  try {
    const addFriendByIdQuery = await User.findOneAndUpdate(
      {_id: req.params.userId},
      {$addToSet: { friends: req.params.friendId }},
      {runValidators: true, new: true}
    );
    res.status(200).json({ result: "success", payload: addFriendByIdQuery });
  }
  catch(err) {
    const userCheck = findById(req.params.userId);
    if(userCheck == null) {
      res.status(400).json({ message: "No user with that ID found!"});
      return;
    }

    const friendCheck = findById(req.params.friendId);
    if(friendCheck == null) {
      res.status(400).json({ message: "No friend with that ID found!"});
      return;
    }

    res.status(404).json({ message: "An error occured while trying to add a friend. Please check your connection or try again later." });
  }
};

const deleteFriendById = async (req, res) => {
  try {
    const deleteFriendByIdQuery = await User.findOneAndUpdate(
      {_id: req.params.userId},
      {$pull: {friends: req.params.friendId}},
      {runValidators: true, new: true}
    );
    res.status(200).json({ result: "success", payload: deleteFriendByIdQuery });
  }
  catch(err) {
    const userCheck = findById(req.params.userId);
    if(userCheck == null) {
      res.status(400).json({ message: "No user with that ID found!"});
      return;
    }

    if(!userCheck.friends.includes(req.params.friendId)) {
      res.status(400).json({ message: "No friend with that ID found in friends list!"});
      return;
    }
    res.status(404).json({ message: "An error occured while trying to remove a friend. Please check your connection or try again later." });
  }
};

module.exports = { 
  getAllUsers,
  getUserById,
  createUser,
  updateUserById,
  deleteUserById,
  addFriendById,
  deleteFriendById
};