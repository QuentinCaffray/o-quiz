import { PrismaClient } from "../../prisma/generated/prisma/client.ts";

// Client de connexion Prisma vers notre BDD Postgres
export const prisma = new PrismaClient();

export * from "../../prisma/generated/prisma/client.ts";
