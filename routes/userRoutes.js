import express from "express";
import {
  deleteSelf,
  getUserFromCookie,
  login,
  logout,
  signup,
} from "../controllers/userController.js";
import {
  followOtherUser,
  unfollowOtherUser,
} from "../controllers/followingController.js";
import { getProfileStats } from "../controllers/profileController.js";

const auth = (req, res, next) => {
  if (req.isAuthenticated()) next();
  res.status(400).json({ error: "you must be logged in" });
};

const router = express.Router();

// @route POST api/users/login
// @desc User login
// @access Public
router.post("/login", login);

// @route POST api/users/signup
// @desc User signup
// @access Public
router.post("/createnewuser", signup);

// @route POST api/users/signup
// @desc Deletes the user, as well as their jokes
// @access Private
router.post("/deleteself", auth, deleteSelf);

// @route POST api/users/cookie
// @desc Uses cookie to attempt an automatic login
// @access Private
router.get("/cookie", getUserFromCookie);

// @route GET api/users/logout
// @desc Uses cookie to attempt an automatic login
// @access Private
router.get("/logout", logout);

// @route GET api/users/profile/:username
// @desc Gets profile info for :username
// @access Public
router.get("/profile/:username", getProfileStats);

router.post("/follow/:username", followOtherUser);
router.post("/unfollow/:username", unfollowOtherUser);

// export
export default router;
