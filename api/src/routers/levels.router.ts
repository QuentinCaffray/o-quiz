import { Router } from "express";
import { getAllLevels, createLevel, updateLevel } from "../controllers/levels.controller.ts";
import { checkRoles } from "../middlewares/check-roles.middleware.ts";

export const router = Router();

router.get("/levels", checkRoles(["member", "author", "admin"]), getAllLevels);
router.post("/levels", checkRoles(["admin"]), createLevel);
router.patch("/levels/:id", checkRoles(["admin"]), updateLevel);
