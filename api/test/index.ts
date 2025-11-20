import axios from "axios";
import { config } from "../config.ts";
import type { User } from "../prisma/generated/prisma/client.ts";
import { generateAccessToken } from "../src/lib/auth.ts";

// Utilitaire pour fabriquer un faux utilisateur
let fakeUserId = 0;
export function generateFakeUser(user?: Partial<User>): User {
  fakeUserId++;
  return {
    id: fakeUserId,
    firstname: "firstname",
    lastname: "lastname",
    email: `user${fakeUserId}@oclock.io`,
    password: "P4$$Mundo",
    role: "admin",
    created_at: new Date(),
    updated_at: new Date(),
    ...user,
  };
}

// ==== POUR FAIRE DES APPELS HTTP NON AUTHENTIFIÉ DANS LES TESTS ====
export const httpRequester = axios.create({
  baseURL: `http://localhost:${config.port}/api`,
  validateStatus: () => true, // Faire en sorte que l'instance AXIOS ne lève pas d'erreur quand on a une 4XX ou une 5XX mais simplement la renvoie
});

// ==== POUR FAIRE DES APPELS HTTP AUTHENTIFIÉ (via un JWT dans le header) DANS LES TESTS ====
export const authedRequester = buildAuthedRequester(
  generateFakeUser({ role: "member" })
); // Request en tant que member
export const authorRequester = buildAuthedRequester(
  generateFakeUser({ role: "author" })
); // Request en tant qu'auteur
export const adminRequester = buildAuthedRequester(
  generateFakeUser({ role: "admin" })
);

export function buildAuthedRequester(user: User) {
  const jwt = generateAccessToken(user);

  return axios.create({
    baseURL: `http://localhost:${config.port}/api`,
    headers: { Authorization: `Bearer ${jwt}` },
    validateStatus: () => true, // Faire en sorte que l'instance AXIOS ne lève pas d'erreur quand on a une 4XX ou une 5XX mais simplement la renvoie
  });
}
