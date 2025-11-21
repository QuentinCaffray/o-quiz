import { Router } from "express";
import { healthCheck } from "../controllers/main.controller.ts";
import { router as authRouter } from "./auth.router.ts";
import { router as usersRouter } from "./users.router.ts";
import { router as levelsRouter } from "./levels.router.ts";
import { router as tagsRouter } from "./tag.router.ts";
import { router as quizzesRouter } from "./quizzes.router.ts";

export const router = Router();

router.get("/health", healthCheck);

// Brancher les différents routeurs
router.use(authRouter);
router.use(usersRouter);
router.use(levelsRouter);
router.use(tagsRouter);
router.use(quizzesRouter);
