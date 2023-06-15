const router = require('express').Router();
const {
  getAllUsers,
  getUserById,
  createUser,
  addFriendById,
  updateUserById,
  deleteUserById,
  deleteFriendById,
} = require("../../controllers/userController");

router.route("/").get(getAllUsers);
router.route("/:userId").get(getUserById);

router.route("/").post(createUser);
router.route("/:userId/friends/:friendId").post(addFriendById);

router.route("/:userId").put(updateUserById);

router.route("/:userId").delete(deleteUserById);
router.route("/:userId/friends/:friendId").delete(deleteFriendById);

module.exports = router;