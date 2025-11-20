export const config = {
  port: Number.parseInt(process.env.PORT || "3000"),
  allowedOrigin: getEnv(process.env.ALLOWED_ORIGIN, "ALLOWED_ORIGIN"),
  jwtSecret: getEnv(process.env.JWT_SECRET, "JWT_SECRET")
};

// Bonus : pour éviter d'oublier de set une variable d'environnement
// Fonctionnement : lorsqu'on lance le serveur, si une des variables d'env n'est pas définie, alors le lancement de l'app Express plante
function getEnv(variable: string | undefined, variableName: string): string {
  if (!variable) { throw new Error(`Missing environnement variable ${variableName}`); }

  return variable;
}
