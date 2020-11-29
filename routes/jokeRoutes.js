import express from "express";
import { createJoke, getPublicJokes } from "../controllers/jokeController.js";

const router = express.Router();

// @route GET api/jokes/public
// @desc Get list of public dadjokes
// @access Public
router.get("/api/jokes/public", getPublicJokes);

// @route POST api/jokes/create
// @desc Add a joke to the database
// @access Private
router.get("/api/jokes/create", auth, createJoke);

function auth(req, res, next) {
  next();
}

// export
export default router;
