const router = require('express').Router();
const {
  getAllThoughts,
  getThoughtById,
  createThought,
  addReaction,
  updateThoughtById,
  deleteThoughtById,
  deleteReactionById,
} = require("../../controllers/thoughtController");

router.route("/").get(getAllThoughts);
router.route("/:thoughtId").get(getThoughtById);

router.route("/").post(createThought);
router.route("/:thoughtId/reactions").post(addReaction);

router.route("/:thoughtId").put(updateThoughtById);

router.route("/:thoughtId").delete(deleteThoughtById);
router.route("/:thoughtId/reactions/:reactionId").delete(deleteReactionById);

module.exports = router;