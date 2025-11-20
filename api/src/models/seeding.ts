// Échantillonnage
import argon2 from "argon2";
import { prisma } from "./index.ts";

// Ajouter quelques utilisateurs dans la BDD
await prisma.user.createMany({ data: [
  { firstname: "Alice", lastname: "Oclock", email: "alice@oclock.io", password: await argon2.hash("password"), role: "admin" },
  { firstname: "Bob", lastname: "Oclock", email: "bob@oclock.io", password: await argon2.hash("password") },
  { firstname: "Carol", lastname: "Oclock", email: "caroline@oclock.io", password: await argon2.hash("password") }
]});

// Ajouter quelques levels dans la BDD
await prisma.level.createMany({ data: [
  { name: "Facile" },
  { name: "Moyen" },
  { name: "Difficile" },
]});

// Déconnecter le client Prisma
await prisma.$disconnect();
