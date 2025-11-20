import { Router } from "express";
import {
  getAllLevels,
  createLevel,
  updateLevel,
  getLevel,
  deleteLevel,
} from "../controllers/levels.controller.ts";
import { checkRoles } from "../middlewares/check-roles.middleware.ts";

export const router = Router();

router.get("/levels", checkRoles(["member", "author", "admin"]), getAllLevels);
router.post("/levels", checkRoles(["admin"]), createLevel);
router.get("/levels/:id", checkRoles(["member", "author", "admin"]), getLevel);
router.patch("/levels/:id", checkRoles(["admin"]), updateLevel);
router.delete("/levels/:id", checkRoles(["admin"]), deleteLevel);
