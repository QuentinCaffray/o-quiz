import type { Request, Response, NextFunction } from "express";
import { decodeJWT, extractAccessTokenFromRequest } from "../lib/auth.ts";
import type { Role } from "../models/index.ts";
import { ForbiddenError } from "../lib/errors.ts";

export function checkRoles(roles: Role[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    // Controler si l'utilisateur qui fait la requête (req) fourni un JWT et que le rôle associé à ce JWT est l'un des rôles 'roles'
    const accessToken = extractAccessTokenFromRequest(req);
    
    // Décoder et valider l'accès token
    const { userId, userRole } = decodeJWT(accessToken);

    // Accrocher le role et userId à `req` pour s'en reservir dans les controleurs futurs
    req.userId = userId;
    req.userRole = userRole;

    // Vérifier le rôle de l'utilisateur
    if (! roles.includes(userRole)) {
      throw new ForbiddenError(`Forbidden access for user with role: ${userRole}`);
    }

    // Sinon on laisse passer
    next();
  };
}
