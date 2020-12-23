import express from "express";
import { addComment, getComments } from "../controllers/commentController.js";

const router = express.Router();

// @route POST api/comments/add
// @desc Add a comment
// @access Private
router.post("/add", addComment);

// @route GET api/comments/:jokeID
// @desc Get comments associated with joke
// @access Public
router.get("/:jokeID", getComments);

export default router;
