import express from "express";
import { login, signup } from "../controllers/userController.js";

const router = express.Router();

// @route POST api/users/login
// @desc User login
// @access Public
router.post("/api/users/login", login);

// @route POST api/users/signup
// @desc User signup
// @access Public
router.post("/api/users/signup", signup);

// export
export default router;
