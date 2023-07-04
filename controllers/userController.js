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
    res.status(404).json({ message: "A connection issue has occured. Please check your connection or try again later." });
  }
};

const getUserById = async (req, res) => {
  try {
    const getByIdQuery = await User.findById(req.params.userId);

    if(getByIdQuery === null) {
      res.status(400).json({ message: "No user with that ID found." });
      return;
    }

    res.status(200).json({ result: "success", payload: getByIdQuery });
  }
  catch(err) {
    res.status(404).json({ message: "A connection issue has occured. Please check your connection or try again later." });
  }
};

const createUser = async (req, res) => {
  try {
    const createQuery = await User.create(req.body);

    res.status(201).json({ result: "success", payload: createQuery });
  }
  catch(err) {
    const username = req.body.username;
    const email = req.body.email;

    if(username === undefined || email === undefined) {
      res.status(400).json({ message: "Username or email is missing from account creation details." });
      return;
    }

    const usernameCheck = await User.findOne({ username: username });

    if(usernameCheck !== null) {
      res.status(400).json({ message: "This username is already in use." });
      return;
    }

    const emailCheck = await User.findOne({ email: email });

    if(emailCheck !== null) {
      res.status(400).json({ message: "This email is already in use." });
      return;
    }

    res.status(404).json({ message: "An error occured while trying create a user. Please check your connection or try again later." });
  }
};

const updateUserById = async (req, res) => {
  try {
    const updateByIdQuery = await User.findOneAndUpdate(
      { _id: req.params.userId },
      { $set: req.body },
      { runValidators: true, new: true }
    );

    if(updateByIdQuery === null) {
      res.status(400).json({ message: "No user with that ID found so no updates can occur." });
      return;
    }
    
    res.status(200).json({ result: "success", payload: updateByIdQuery });
  }
  catch(err) {
    res.status(404).json({ message: "An error occured while trying to update this user. Please check your connection or try again later."});
  }
};

const deleteUserById = async (req,res) => {
  try {
    const delByIdQuery = await User.findOneAndDelete({ _id: req.params.userId });

    if(delByIdQuery === null) {
      res.status(400).json({ message: "No user with that ID found so no deletion can occur." });
      return;
    }

    res.status(200).json({ result: "success", payload: delByIdQuery });
  }
  catch(err) {
    res.status(404).json({ message: "A connection issue has occured. Please check your connection or try again later." });
  }
};

const addFriendById = async (req, res) =>  {
  try {
    const usr_id = req.params.userId;
    const frnd_id = req.params.friendId;

    const userCheck = await User.findOne({ _id: usr_id });

    if(userCheck === null) {
      res.status(400).json({ message: "No user with that ID found so their friends list cannot be modified." });
      return;
    }

    if(usr_id === frnd_id) {
      res.status(400).json({ message: "A user cannot add themselves as a friend." });
      return;
    }

    const friendCheck = await User.findOne({ _id: frnd_id });

    if(friendCheck === null) {
      res.status(400).json({ message: "This friend can't be added since no user with that ID was found." });
      return;
    }

    if(userCheck.friends.includes(frnd_id)) {
      res.status(400).json({ message: "You two are already friends." });
      return;
    }

    const addFriendByIdQuery = await User.findOneAndUpdate(
      {_id: usr_id},
      {$addToSet: { friends: frnd_id }},
      {runValidators: true, new: true}
    );

    res.status(200).json({ result: "success", payload: addFriendByIdQuery });
  }
  catch(err) {
    res.status(404).json({ message: "An error occured while trying to add a friend. Please check your connection or try again later." });
  }
};

const deleteFriendById = async (req, res) => {
  try {
    const usr_id = req.params.userId;
    const frnd_id = req.params.friendId;

    const userCheck = await User.findOne({ _id: usr_id });

    if(userCheck === null) {
      res.status(400).json({ message: "No user with that ID found so their friends list cannot be modified." });
      return;
    }

    if(usr_id === frnd_id) {
      res.status(400).json({ message: "A user cannot be deleted from their own friends list." });
      return;
    }

    const friendCheck = await User.findOne({ _id: frnd_id });

    if(friendCheck === null) {
      res.status(400).json({ message: "This friend can't be removed since no user with that ID was found." });
      return;
    }

    if(!userCheck.friends.includes(frnd_id)) {
      res.status(400).json({ message: "User cannot be removed from friends list since they're not on it." });
      return;
    }

    const delFriendByIdQuery = await User.findOneAndUpdate(
      {_id: usr_id},
      {$pull: {friends: frnd_id}},
      {runValidators: true, new: true}
    );

    res.status(200).json({ result: "success", payload: delFriendByIdQuery });
  }
  catch(err) {
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