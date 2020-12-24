import express from "express";
import { addComment, getComments } from "../controllers/commentController.js";

const router = express.Router();

// @route POST api/comments/add
// @desc Add a comment
// @access Private
router.post("/add", addComment);

// @route POST api/comments/:jokeID
// @desc Get comments associated with joke, using criteria in body
// @access Public
router.post("/:jokeID", getComments);

export default router;
