import type { Request, Response } from "express";
import z from "zod";
import { prisma } from "../models/index.ts";
import { ConflictError, NotFoundError } from "../lib/errors.ts";

export async function getAllTags(req: Request, res: Response) {
  // Je récupère les tags de la BDD
  const tags = await prisma.tag.findMany();

  // Je les renvoient
  res.json(tags);
}

export async function getTag(req: Request, res: Response) {
  // Je récupère l'id du tag
  const tagId = z.coerce.number().min(1).parse(req.params.id);

  const tag = await prisma.tag.findUnique({
    where: { id: tagId },
  });

  // Gestion de l'erreur
  if (!tag) {
    throw new NotFoundError("Tag not found");
  }

  res.json(tag);
}

export async function createTag(req: Request, res: Response) {
  // Schéma de validation (pour filtrer)
  const createTagSchema = z.object({
    name: z.string().min(1),
  });

  const { name: tagName } = createTagSchema.parse(req.body);

  const tagAlreadyExist = await prisma.tag.findFirst({
    where: { name: tagName },
  });
  if (tagAlreadyExist) {
    throw new ConflictError(`Tag name ${tagName} already exists`);
  }

  const createdTag = await prisma.tag.create({ data: { name: tagName } });

  res.status(201).json(createdTag);
}

export async function updateTag(req: Request, res: Response) {
  // Récupérer l'ID du tag à mettre à jour depuis les params
  const tagId = z.coerce.number().min(1).parse(req.params.id); // Si parsing fail => Global error handler => 422

  // Récupérer les données du tag à mettre à jour depuis le body
  // -> Valider via un schéma Zod
  const updateTagSchema = z.object({
    name: z.string().min(1),
  });
  const { name: tagName } = updateTagSchema.parse(req.body);

  // Récupérer le tag dans la BDD
  const tag = await prisma.tag.findUnique({ where: { id: tagId } });

  // Vérifier que le tag existe, sinon => 404
  if (!tag) {
    throw new NotFoundError("Tag not found"); // Global error handler => 404
  }

  // Vérifier que le nom cible n'est pas déjà pris par un AUTRE tag
  const tagAlreadyExist = await prisma.tag.findFirst({
    where: {
      name: tagName,
      id: { not: tagId },
    },
  });
  if (tagAlreadyExist) {
    throw new ConflictError(`Tag name ${tagName} already exists`);
  }
  // Faire la mise à jour en BDD
  const updatedTag = await prisma.tag.update({
    where: { id: tagId },
    data: { name: tagName },
  });

  // Renvoyer le niveau mis à jour
  res.json(updatedTag);
}

export async function deleteTag(req: Request, res: Response) {
  const tagId = z.coerce.number().min(1).parse(req.params.id);

  const tag = await prisma.tag.findUnique({ where: { id: tagId } });

  if (!tag) {
    throw new NotFoundError("Tag not found"); // Global error handler => 404
  }
  // On supprime le tag
  await prisma.tag.delete({ where: { id: tagId } });

  // On renvoit la réponse au client
  res.status(204).send();
}
