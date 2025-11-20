import type { Request } from "express";
import { UnauthorizedError } from "./errors.ts";
import type { JwtPayload } from "jsonwebtoken";
import jwt from "jsonwebtoken";
import { config } from "../../config.ts";
import type { Role, User } from "../models/index.ts";

export function extractAccessTokenFromRequest(req: Request) {
  // Récupérer l'accessToken depuis les cookies ? 
  if (typeof req.cookies.accessToken === "string") {
    return req.cookies.accessToken;
  }

  // Récupérer le header "authorization"
  const authorizationHeader = req.headers.authorization; // "Bearer eyJhbGciOiJIUzI1..."
  if (! authorizationHeader || ! authorizationHeader.startsWith("Bearer ")) {
    throw new UnauthorizedError("Authorization header missing or does not contain Bearer keyword");
  }

  // Extraire la partie JWT du header (retirer le mot "Bearer")
  const accessToken = authorizationHeader.substring("Bearer ".length); // "eyJhbGciOiJIUzI1...""
  return accessToken;
}


// On peut déclarer les interfaces APRES leur utilisation, pour faciliter la lecture
// On peut tout à fait la déclarer AVANT la fonction
// Dans un UserPayload, nous avons les champs de JwtPayload (iat, exp...) + les champs custom (userId)
export interface UserPayload extends JwtPayload {
  userId: number;
  userRole: Role;
}

export function decodeJWT(accessToken: string) {
  // Gestion des erreurs lors du décodage du payload
  // - non expiré
  // - non falsifié (signature)
  // - en extraire le payload { userId }

  try {

    const payload = jwt.verify(accessToken, config.jwtSecret) as UserPayload;
    return payload;

  } catch(error) {
    if (error instanceof jwt.JsonWebTokenError) { // Si le token est malformé, on veut renvoyé une 401
      throw new UnauthorizedError(`JWT error: ${error.message}`);
    }
    if (error instanceof jwt.TokenExpiredError) { // Si le token est expiré, on veut renvoyé une 401
      throw new UnauthorizedError(`Expired JWT token`);
    }

    // Si c'est un autre type d'erreur (quel type ? idk)
    throw error; // Alors on passe la main au global erreur handler
  }
}

export function generateAccessToken(user: User) {
  // Génère un JWT
  // - Payload : 
  //   - userId
  //   - role
  // Signer : 
  //   - JWT_SECRET dans le .env (-> config.ts)
  // Durée de vie : 
  //   - 1h dans l'.env (-> config.ts)
  const paydload = {
    userId: user.id,
    userRole: user.role
  };
  const accessToken = jwt.sign(paydload, config.jwtSecret, { expiresIn: "1h" }); // JWT secret = sorte de "tampon" pour notre passport JWT qui atteste de sa non-falsification
  return accessToken;
}