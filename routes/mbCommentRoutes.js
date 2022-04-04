import express from "express";

import {
  createComment,
  deleteComment,
  // getTopics,
  updateComment,
} from "../controllers/mbCommentController.js";

const router = express.Router();

// @route GET api/mbtopic/
// @desc Get list of public or private dadjokes
// @access Public or Private
// router.get("/", getThreads);

// @route POST api/mbtopic/
// @desc Create a topic in the message board
// @access Private
router.post("/", createComment);

// @route PUT api/mbcomment/
// @desc Finds comment via ID and updates
// @access Private
router.put("/", updateComment);

// @route DELETE api/jokes/:id
// @desc Finds board topic via ID and deletes it
// @access Private
router.delete("/:_id", deleteComment);

// @route POST api/jokes/vote/:id
// @desc Adds an upvote or downvote (or no vote) to the joke
// @access Private
// router.post("/vote/:_id", updateThread);

// export
export default router;
