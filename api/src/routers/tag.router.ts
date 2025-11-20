import { Router } from "express";
import {
  getAllTags,
  getTag,
  createTag,
  updateTag,
  deleteTag,
} from "../controllers/tag.controller.ts";
import { checkRoles } from "../middlewares/check-roles.middleware.ts";

export const router = Router();

router.get("/tags", checkRoles(["member", "author", "admin"]), getAllTags);
router.get("/tags/:id", checkRoles(["member", "author", "admin"]), getTag);
router.post("/tags", checkRoles(["admin"]), createTag);
router.patch("/tags/:id", checkRoles(["admin"]), updateTag);
router.delete("/tags/:id", checkRoles(["admin"]), deleteTag);
