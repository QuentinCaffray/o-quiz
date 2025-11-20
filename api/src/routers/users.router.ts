import { Router } from "express";
import { getAllUsers, getOneUser} from "../controllers/users.controller.ts";
import { checkRoles } from "../middlewares/check-roles.middleware.ts";

export const router = Router();

router.get("/users", checkRoles(["admin"]), getAllUsers);
router.get("/users/:id", checkRoles(["admin"]), getOneUser);

