import { Router } from "express";
import {
  getAllTags,
  getTag,
  createTag,
} from "../controllers/tag.controller.ts";
import { checkRoles } from "../middlewares/check-roles.middleware.ts";

export const router = Router();

router.get("/tags", checkRoles(["member", "author", "admin"]), getAllTags);
router.get("/tags/:id", checkRoles(["member", "author", "admin"]), getTag);
router.post("/tags", checkRoles(["admin"]), createTag);
