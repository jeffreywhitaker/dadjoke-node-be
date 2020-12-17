import express from "express";

import {
  createJoke,
  deleteJoke,
  getPrivateJokes,
  getPublicJokes,
  updateJoke,
  updateJokeVote,
} from "../controllers/jokeController.js";

const router = express.Router();

// @route POST api/jokes/public
// @desc Get list of public dadjokes
// @access Public
router.post("/public", getPublicJokes);

// @route POST api/jokes/create
// @desc Create a dadjoke associated with the user
// @access Private
router.post("/add", createJoke);

// @route POST api/jokes/private
// @desc Return array of user's private dadjokes
// @access Private
router.post("/private", getPrivateJokes);

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
