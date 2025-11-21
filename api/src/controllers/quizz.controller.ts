import type { Request, Response } from "express";
import z from "zod";
import { prisma } from "../models/index.ts";
import { ConflictError, NotFoundError } from "../lib/errors.ts";

// Recupère tout les Quizzes
export async function getAllQuizzes(req: Request, res: Response) {
  // Je récupère les quizzes de la BDD
  const quizzes = await prisma.quiz.findMany();

  // Je les renvoie
  res.json(quizzes);
}

// Récupère le quizz voulu
export async function getQuiz(req: Request, res: Response) {
  // Je récupère l'id du quiz
  const quizId = z.coerce.number().min(1).parse(req.params.id);

  const quiz = await prisma.quiz.findUnique({
    where: { id: quizId },
  });

  if (!quiz) {
    throw new NotFoundError("Quiz not found");
  }

  res.json(quiz);
}

// Récupère les 6 derniers quizzes
export async function getRecentQuizzes(req: Request, res: Response) {
  const quizzes = await prisma.quiz.findMany({
    orderBy: {
      created_at: "desc",
    },
    take: 6,
  });
  res.json(quizzes);
}

// Récupère les questions d'un Quizz
export async function getQuestionsByQuizId(req: Request, res: Response) {
  const quizId = z.coerce.number().min(1).parse(req.params.id);

  const quiz = await prisma.quiz.findUnique({
    where: { id: quizId },
    include: {
      questions: {
        include: {
          choices: true,
        },
      },
    },
  });

  if (!quiz) {
    throw new NotFoundError("Quiz not found");
  }

  res.json(quiz.questions);
}
