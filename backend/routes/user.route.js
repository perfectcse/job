import express from "express";
import {
  login,
  logout,
  register,
  updateProfile,
} from "../controllers/user.controller.js";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import upload from "../middlewares/mutler.js";

const router = express.Router();

// router.post("/register",register)
// router.route("/register").post(singleUpload, register);
router.post("/register", upload.single("profilePhoto"), register);
router.post("/login", login);
router.get("/logout", logout);
router.post(
  "/profile/update",
  isAuthenticated,
  upload.single("resume"),
  updateProfile
);

export default router;
