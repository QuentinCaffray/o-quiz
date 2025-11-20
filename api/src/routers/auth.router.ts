import { Router } from "express";
import { registerUser, loginUser, getAuthenticatedUser, refreshAccessToken, logoutUser } from "../controllers/auth.controller.ts";
import { checkRoles } from "../middlewares/check-roles.middleware.ts";

export const router = Router();

router.post("/auth/register", registerUser);
router.post("/auth/login", loginUser);
router.post("/auth/refresh", refreshAccessToken);
router.get("/auth/me", checkRoles(["member", "author", "admin"]), getAuthenticatedUser);
router.post("/auth/logout", checkRoles(["member", "author", "admin"]), logoutUser);
