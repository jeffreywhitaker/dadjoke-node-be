import express from "express";
import {
  deleteSelf,
  getUserFromCookie,
  getOtherUserProfileStats,
  getProfileStats,
  login,
  logout,
  signup,
} from "../controllers/userController.js";

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
router.post("/deleteuser", auth, deleteSelf);

// @route POST api/users/signup
// @desc Uses cookie to attempt an automatic login
// @access Private
router.get("/cookie", getUserFromCookie);

// @route GET api/users/logout
// @desc Uses cookie to attempt an automatic login
// @access Private
router.get("/logout", logout);

// stats for own profile
router.get("/users/profile", getOwnProfileStats);
router.get("/users/profile/:username", getOtherUserProfileStats);

// export
export default router;
