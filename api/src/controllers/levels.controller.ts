import type { Request, Response } from "express";
import z from "zod";
import { prisma } from "../models/index.ts";
import { ConflictError, NotFoundError } from "../lib/errors.ts";

export async function getAllLevels(req: Request, res: Response) {
  // Récupérer les levels de la BDD via notre ORM
  const levels = await prisma.level.findMany();

  // Les renvoyer
  res.json(levels);
}

export async function getLevel(req: Request, res: Response) {
  const levelId = z.coerce.number().min(1).parse(req.params.id);

  const level = await prisma.level.findUnique({
    where: { id: levelId },
  });

  if (!level) {
    throw new NotFoundError("Level not found");
  }

  res.json(level);
}

export async function createLevel(req: Request, res: Response) {
  // Créer un schéma de validation
  const createLevelSchema = z.object({
    name: z.string().min(1),
  });

  // Valider les données avec Zod et récupérer les infos importantes
  const { name: levelName } = createLevelSchema.parse(req.body); // Lève une exception si la validation ne passe pas ==> transferée au global erreur handler

  // Vérifier que le niveau n'existe pas déjà
  await assertLevelNameIsAvailable(levelName);

  // Ajouter le niveau en BDD
  const createdLevel = await prisma.level.create({ data: { name: levelName } });

  // Répondre au client
  res.status(201).json(createdLevel);
}

export async function updateLevel(req: Request, res: Response) {
  // Récupérer l'ID du level à mettre à jour depuis les params
  // -> Valider dans la foulée
  const levelId = z.coerce.number().min(1).parse(req.params.id); // Si parsing fail => Global error handler => 422

  // Récupérer les données du level à mettre à jour depuis le body
  // -> Valider via un schéma Zod
  const updateLevelSchema = z.object({
    name: z.string().min(1),
  });
  const { name: levelName } = updateLevelSchema.parse(req.body);

  // Récupérer le level dans la BDD
  const level = await prisma.level.findUnique({ where: { id: levelId } });

  // Vérifier que le level existe, sinon => 404
  if (!level) {
    throw new NotFoundError("Level not found"); // Global error handler => 404
  }

  // Vérifier que le nom cible n'est pas déjà pris par un autre level
  await assertLevelNameIsAvailable(levelName);

  // Faire la mise à jour en BDD
  const updatedLevel = await prisma.level.update({
    where: { id: levelId },
    data: { name: levelName },
  });

  // Renvoyer le niveau mis à jour
  res.json(updatedLevel);
}

async function assertLevelNameIsAvailable(levelName: string) {
  const nbOfLevelExisting = await prisma.level.count({
    where: { name: levelName },
  }); // On compte le nombre de niveau avec déjà le même nom
  if (nbOfLevelExisting > 0) {
    throw new ConflictError(`Level name '${levelName}' already exists`);
  }
}

export async function deleteLevel(req: Request, res: Response) {
  // Je récupère l'id du level à delete.
  const levelId = z.coerce.number().min(1).parse(req.params.id);

  // Je récupère le level dans ma BDD
  const level = await prisma.level.findUnique({ where: { id: levelId } });

  // Gestion de l'erreur
  if (!level) {
    throw new NotFoundError("Level not found"); // Global error handler => 404
  }
  // On supprime le level
  await prisma.level.delete({ where: { id: levelId } });

  // On renvoit la réponse au client
  res.status(204).send();
}
