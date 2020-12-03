import express from "express";
import {
  deleteSelf,
  getUserFromCookie,
  login,
  signup,
} from "../controllers/userController.js";

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
// @desc User signup
// @access Public
router.post("/deleteuser", deleteSelf);

router.get("/cookie", getUserFromCookie);

const auth = (req, res, next) => {
  if (req.isAuthenticated()) next();
  res.status(400).json({ error: "you must be logged in" });
};
// export
export default router;
