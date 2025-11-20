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
