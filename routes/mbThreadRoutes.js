import express from "express";

import {
  createThread,
  deleteThread,
  getThreads,
  // updateTopic,
} from "../controllers/mbThreadController.js";

const router = express.Router();

// @route GET api/mbthread/
// @desc Get list of public or private mb threads
// @access Public or Private
router.get("/", getThreads);

// @route POST api/mbthread/
// @desc Create a topic in the message board
// @access Private
router.post("/add", createThread);

// @route PUT api/mbthread/:_id
// @desc Finds board topic via ID and updates
// @access Private
// router.put("/:_id", updateThread);

// @route DELETE api/jokes/:id
// @desc Finds board topic via ID and deletes it
// @access Private
router.delete("/:_id", deleteThread);

// @route POST api/jokes/vote/:id
// @desc Adds an upvote or downvote (or no vote) to the joke
// @access Private
// router.post("/vote/:_id", updateThread);

// export
export default router;
