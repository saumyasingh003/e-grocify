import express from "express";
import { loginUser, logoutUser, registerUser } from "../Controllers/user.js";
import { protect } from "../middleware/auth.js";


const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", protect, logoutUser);

export default router;
 