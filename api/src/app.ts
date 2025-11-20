import express from "express";
import cors from "cors";
import { config } from "../config.ts";
import { router as apiRouter } from "./routers/index.router.ts";
import { globalErrorHandler } from "./middlewares/global-error-handler.middleware.ts";
import cookieParser from "cookie-parser";

// Create Express app
export const app = express();

// Autoriser les CORS (Cross-Origin Requests)
app.use(cors({ origin: config.allowedOrigin }));

// Body parser
app.use(express.json()); // parse body de type `application/json` // prend le "body de la requête" et ça l'ajoute à "req.body" (dé-serialization)``

// Cookie parser
app.use(cookieParser());

// Configure app
app.use("/api", apiRouter);

// Global error handler
// (Middleware d'erreur => c'est le dernier)
// Cette fonction va s'appeler toute seule lorsqu'une erreur est levé dans un controlleur
app.use(globalErrorHandler);

// On sépare l'index afin :
// - définir l'app (app.ts)
// - lancer les serveurs (index.ts (prod/dev) et global-setup.ts (test))
