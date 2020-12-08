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

// @route GET api/jokes/public
// @desc Get list of public dadjokes
// @access Public
router.get("/dadjokes/public", getPublicJokes);

// @route POST api/jokes/create
// @desc Create a dadjoke associated with the user
// @access Private
router.post("/dadjokes/add", auth, createJoke);

// @route GET api/jokes/private
// @desc Return array of user's private dadjokes
// @access Private
router.get("/dadjokes/private", auth, getPrivateJokes);

// @route PUT api/jokes/:id
// @desc Finds joke via ID and updates it
// @access Private
router.put("/dadjokes/:_id", auth, updateJoke);

// @route DELETE api/jokes/:id
// @desc Finds joke via ID and deletes it
// @access Private
router.delete("/dadjokes/:_id", auth, deleteJoke);

// @route POST api/jokes/vote/:id
// @desc Adds an upvote or downvote (or no vote) to the joke
// @access Private
router.post("/dadjokes/vote/:_id", auth, updateJokeVote);

function auth(req, res, next) {
  console.log("inside auth func");
  next();
}

// export
export default router;
