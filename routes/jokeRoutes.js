import express from "express";
import passport from "passport";
import {
  createJoke,
  deleteJoke,
  getPrivateJokes,
  getPublicJokes,
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

// @route DELETE api/jokes/:id
// @desc Finds joke via ID and deletes it
// @access Private
router.delete("/dadjokes/:id", auth, deleteJoke);

function auth(req, res, next) {
  console.log("inside auth func");
  next();
}

// export
export default router;
