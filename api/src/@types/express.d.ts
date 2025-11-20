import type { Role } from "../models/index.ts";

// OPTION 1 
// On défini une nouvelle interface AuthedRequest (avec les champs en plus)

// export interface AuthedRequest extends Request {
//   userId: number;
//   userRole: Role;
// }


// OPTION 2 
// On surcharge la Request d'express (avec des champs en plus)
declare global {
  namespace Express {
    interface Request {
      userId: number;
      userRole: Role;
    }
  }
}
