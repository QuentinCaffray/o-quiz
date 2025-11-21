import { Router } from "express";
import {
  getAllQuizzes,
  getQuiz,
  getRecentQuizzes,
  getQuestionsByQuizId,
} from "../controllers/quizz.controller.ts";
import { checkRoles } from "../middlewares/check-roles.middleware.ts";

export const router = Router();

router.get(
  "/quizzes",
  checkRoles(["member", "author", "admin"]),
  getAllQuizzes
);
router.get(
  "/quizzes/recent",
  checkRoles(["member", "author", "admin"]),
  getRecentQuizzes
);
router.get(
  "/quizzes/:id/questions",
  checkRoles(["member", "author", "admin"]),
  getQuestionsByQuizId
);
router.get("/quizzes/:id", checkRoles(["member", "author", "admin"]), getQuiz);
