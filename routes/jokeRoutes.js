import express from "express";
import passport from "passport";

const router = express.Router();

// export
export default router;

// @route GET api/jokes/public
// @desc Get list of public dadjokes
// @access Public
router.get("/api/jokes/public");
