import express from "express";

import {
  createComment,
  // deleteTopic,
  // getTopics,
  // updateTopic,
} from "../controllers/mbCommentController.js";

const router = express.Router();

// @route GET api/mbtopic/
// @desc Get list of public or private dadjokes
// @access Public or Private
// router.get("/", getThreads);

// @route POST api/mbtopic/
// @desc Create a topic in the message board
// @access Private
router.post("/add", createComment);

// @route PUT api/mbtopic/:_id
// @desc Finds board topic via ID and updates
// @access Private
// router.put("/:_id", updateThread);

// @route DELETE api/jokes/:id
// @desc Finds board topic via ID and deletes it
// @access Private
// router.delete("/:_id", deleteThread);

// @route POST api/jokes/vote/:id
// @desc Adds an upvote or downvote (or no vote) to the joke
// @access Private
// router.post("/vote/:_id", updateThread);

// export
export default router;
