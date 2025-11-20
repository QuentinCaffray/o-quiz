import type { NextFunction, Request, Response } from "express";
import z from "zod";
import { HttpError } from "../lib/errors.ts";

// Un middleware d'erreur dans express prend 4 paramètres
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function globalErrorHandler(error: Error, req: Request, res: Response, next: NextFunction) {
  
  // Si l'error est une erreur de validation Zod
  if (error instanceof z.ZodError) {
    // Alors, on renvoie une 422
    console.info(error);
    res.status(422).json({ error: z.prettifyError(error) });
    return; // On arrête la fonction
  }
  
  // Si l'erreur est une HttpError, on renvoie son status et le message
  if (error instanceof HttpError) {
    console.info(error);
    res.status(error.statusCode).json({ error: error.message });
    return;
  }

  // Logger (pour les dev qui debuggent)
  console.error(error);

  // Répondre au client par une 500
  res.status(500).json({ error: "Unexpected server error" });
}
