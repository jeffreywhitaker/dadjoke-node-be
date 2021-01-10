import express from "express";

import {
  createJoke,
  deleteJoke,
  getJokes,
  updateJoke,
  updateJokeVote,
} from "../controllers/jokeController.js";

const router = express.Router();

// @route GET api/jokes/
// @desc Get list of public or private dadjokes
// @access Public or Private
router.get("/", getJokes);

// @route POST api/jokes/create
// @desc Create a dadjoke associated with the user
// @access Private
router.post("/add", createJoke);

// @route PUT api/jokes/:id
// @desc Finds joke via ID and updates it
// @access Private
router.put("/:_id", updateJoke);

// @route DELETE api/jokes/:id
// @desc Finds joke via ID and deletes it
// @access Private
router.delete("/:_id", deleteJoke);

// @route POST api/jokes/vote/:id
// @desc Adds an upvote or downvote (or no vote) to the joke
// @access Private
router.post("/vote/:_id", updateJokeVote);

// export
export default router;
