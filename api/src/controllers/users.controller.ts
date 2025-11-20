import type { Request, Response } from "express";
import { prisma } from "../models/index.ts";

export async function getAllUsers(req: Request, res: Response) {
  const users = await prisma.user.findMany({ omit: { password: true } });

  res.json(users);
}

export async function getOneUser(req: Request, res: Response) {
  // Récupérer l'ID depuis les params de la requête
  const userId = Number.parseInt(req.params.id);

  // Récupérer le user correspondant à l'ID
  const user = await prisma.user.findUnique({
    where: { id: userId },
    omit: { password: true }
  });

  // Si aucun user n'est trouvé, il faut renvoyer une 404
  if (! user) {
    res.status(404).json({ error: "User not found" }); // Répondre au client 
    return; // On arrête la fonction
    // On pourrait throw new Error mais dans ce cas, il faudrait un try/catch qui s'occupe de récupérer l'erreur puis de répondre au client de manière appropriée
  }

  // Le renvoyer
  res.json(user);
}
