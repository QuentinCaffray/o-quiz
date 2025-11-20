import type { Request, Response } from "express";
import crypto from "node:crypto";
import argon2 from "argon2";
import z from "zod";
import { prisma, type User } from "../models/index.ts";
import { ConflictError, UnauthorizedError } from "../lib/errors.ts";
import { generateAccessToken } from "../lib/auth.ts";

export async function registerUser(req: Request, res: Response) {
  // Validation des données
  // Schéma de validation pour le body : 
  // - firstname: string, non vide
  // - lastname: string, non vide
  // - email: string, non vide
  // - password: string, non vide, min 8 caractères, au moins 1 chiffre, 1 majuscule, 1 minuscule
  const registerUserBodySchema = z.object({
    firstname: z.string().min(1),
    lastname: z.string().min(1),
    email: z.email(),
    password: z.string()
      .min(8)
      .regex(/[a-z]/, "Password should contain a lowercased character")
      .regex(/[A-Z]/, "Password should contain a uppercased character")
      .regex(/[0-9]/, "Password should contain a digit")
      .regex(/[^a-zA-Z0-9]/, "Password should contain a special character")
  });

  // Récupère et parse le body
  const { firstname, lastname, email, password } = registerUserBodySchema.parse(req.body);

  // Autre vérification : email non déjà pris => 409 (Conflict)
  const alreadyExistingUser = await prisma.user.findFirst({ where: { email } });
  if (alreadyExistingUser) {
    throw new ConflictError("Email already taken");
  }

  // Hacher le mot de passe (bcrypt, argon2, scrypt)
  const hashedPassword = await argon2.hash(password);

  // Appel de la BDD pour enregistrer l'utilisateur
  const createdUser = await prisma.user.create({
    data: {
      firstname,
      lastname,
      email,
      password: hashedPassword
    },
    omit: {
      password: true
    }
  });

  // Réponse au client : 
  // - id / firstname / lastname / email / created_at / updated_at  (PAS LE PASSWORD HACHÉ)
  // Attention : avec Omit, il faut penser à faire un test pour vérifier qu'aucun autre champs n'est renvoyé, sous peine de prendre le risque futur de renvoyer un nouveau champ confidentiel par erreur
  res.status(201).json(createdUser);
}

export async function loginUser(req: Request, res: Response) {
  // Récupérer l'email et le mot de passe depuis le body
  const loginUserBodySchema = z.object({
    email: z.string(),
    password: z.string()
  });
  const { email, password } = loginUserBodySchema.parse(req.body);

  // Récupérer l'utilisateur en BDD
  const user = await prisma.user.findUnique({ where: { email } });

  // Si pas d'utilisateur => 401
  if (!user) {
    throw new UnauthorizedError("Wrong credentials email/password"); // => plus sécurisé, impossible de savoir si l'utilisateur existe ou non, ou si c'est le mot de passe qui n'est pas bon.
  }

  // Compare les mots de passe (celui fourni dans le body avec celui haché de la BDD).
  const isMatching = await argon2.verify(user.password, password); // Cette fonction va re-haché le "mot de passe en clair" à l'aide du sel stocké sur le "mot de passe haché" et comparer les deux hash !
  
  // Si pas de match => 401
  if(!isMatching) {
    throw new UnauthorizedError("Wrong credentials email/password");
  }

  // Générer le JWT
  const accessToken = generateAccessToken(user);

  // Générer et sauvegarder le refreshToken
  const refreshToken = await generateRefreshToken(user);

  // (Bonus) Le renvoyer dans les cookies
  setTokensInCookies(res, accessToken, refreshToken);
 
  // Le renvoyer dans le BODY
  res.json({ accessToken, refreshToken });
}

export async function getAuthenticatedUser(req: Request, res: Response) {
  // A condition d'avoir mis le middleware checkRoles juste avant ce controlleur pour avoir accès au userId dans "req"
  const userId = req.userId;

  // Récupérer le user en BDD (sans son mot de passe)
  const user = await prisma.user.findUnique({
    where: { id: userId },
    omit: { password: true }
    // Mieux : utiliser `select` et choisir explicitement les champs que l'on renvoie
  });

  // Si pas d'utilisateur correspondant au JWT fourni
  if (!user) {
    throw new UnauthorizedError("Provided JWT does not match any user currently in database");
  }

  // Le renvoyer
  res.json(user);
}

export async function refreshAccessToken(req: Request, res: Response) {
  // Récupérer le refresh token fourni (soit dans le body, soit dans les cookies)
  const rawToken = req.body.refreshToken || req.cookies.refreshToken; // taKhXtq6rAlR...

  // Valider son type (string)
  const token = z.string().parse(rawToken); // Si parsing fails => 422 (global error handler)

  // Récupérer le refresh token en BDD (accompagné de son utilisateur)
  const refreshToken = await prisma.refreshToken.findFirst({
    where: { token },
    include: { user: true } // JOINTURE entre la table des "refreshToken" et la tables des "user"
  }); // { id, token, expires_at, user: {...} }

  // Si PAS EN BDD => 401
  if (! refreshToken) { throw new UnauthorizedError("Invalid refresh token"); }

  // Si NON VALIDE => 401
  // Si la date actuelle est APRES la date d'expiration du token, alors il est périmé
  if (new Date() > refreshToken.expires_at) { throw new UnauthorizedError("Expired refresh token"); }

  // Supprimer les refreshTokens de l'utilisateur avant d'en créer un autre
  await prisma.refreshToken.deleteMany({ where: { user_id: refreshToken.user_id } });

  // On génère des nouveaux tokens
  const accessToken = generateAccessToken(refreshToken.user);
  const newRefreshToken = await generateRefreshToken(refreshToken.user);

  // On les renvoies dans les cookies
  setTokensInCookies(res, accessToken, newRefreshToken);

  // Et également dans le body
  res.json({ accessToken, refreshToken: newRefreshToken });
}

export async function logoutUser(req: Request, res: Response) {
  // Comment logout un utilisateur
  // Il suffit que le client "PERDE" son accessToken et son refreshToken ==> COTÉ CLIENT !
  // Si le client les a stocké dans le localStorage ==> document.localStorage.deleteItem("accessToken") [COTE CLIENT / SVELTE]
  // Si le client les a stocké dans les cookies     ==> le backend renvoie des nouveaux cookies "vierges" pour écraser ceux qui sont côté client
  // NOTE : il faudrait également supprimer le(s) refresh token(s) de l'utilisateur qui fait la requête de la BDD
  
  res.clearCookie("accessToken");
  res.clearCookie("refreshToken");
  res.status(204).end(); // No Content
}

export async function generateRefreshToken(user: User) {
  // Générer un refresh token (token opaque, ie. token sans information) de 7jours
  const refreshToken = crypto.randomBytes(64).toString("base64"); // chaine de caractère de 64 caractères aléatoire

  // Insérer le refresh token en BDD
  await prisma.refreshToken.create({ data: {
    token: refreshToken,
    user_id: user.id,
    expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    //                   ^ nb de MS mtn  +   7 jours en MS
  } });

  return refreshToken;
}

function setTokensInCookies(res: Response, accessToken: string, refreshToken: string) {
  res.cookie("accessToken", accessToken, {
    maxAge: 1 * 60 * 60 * 1000, // 1h en MS
    httpOnly: true // en HTTPOnly, les cookies ne sont pas lisible par le code frontend (console.log(document.cookies) -> rien !)) => sécurité !
  });

  res.cookie("refreshToken", refreshToken, {
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 jours en MS
    httpOnly: true,
    path: "/api/auth/refresh" // Pour préciser que le client ne doit envoyer le cookie que s'il fait une requête vers la route /api/auth/refresh (et pas sur les autres routes !)
  });
}
