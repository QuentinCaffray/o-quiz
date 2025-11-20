import { execSync } from "node:child_process";
import { after, before, beforeEach, type TestContext } from "node:test";
import { prisma } from "../../src/models/index.ts";
import { app } from "../../src/app.ts";
import type { Server } from "node:http";

let server: Server;

// S'exécute 1 fois AVANT TOUS les tests
before(() => {
  // (Hack) S'assurer qu'aucune BDD de test n'est préalablement lancée
  execSync(`docker rm -f oquiztest 2>/dev/null || true`); // Note : '2>/dev/null' permet de ne rien écrire en console. Note : "|| true" nous assure que si la BDD était déjà supprimé, alors ça ne plante pas

  // Créer un conteneur Postgres (notre BDD de test)
  execSync(`
    docker run                            \
      -d                                  \
      --name oquiztest                    \
      -p 5437:5432                        \
      -e POSTGRES_USER=oquiztest          \
      -e POSTGRES_PASSWORD=oquiztest      \
      -e POSTGRES_DB=oquiztest            \
    postgres:18
  `);

  // (Hack) Attendre une petite seconde pour s'assurer qu'elle tourne bien
  execSync(`sleep 1`); // 1 seconde

  // Créer les tables dans la BDD
  // Comment prisma sait qu'il faut appeller la BDD DE TEST (oquiztest)
  // plutot que d'appeler la BDD DE DEV (oquiz) ?
  // ==> .env.test (chargé grâce à --env-file=./test/config/.env.test)
  execSync(`npx prisma migrate deploy`);

  // Lancer un serveur de test
  server = app.listen(process.env.PORT); // 7357
});

// S'execute AVANT CHAQUE TEST
beforeEach(async (t) => {
  // Désactiver les logs des console.info()
  // Commenter cette ligne si vous souhaitez voir les console.info() dans vos tests
  (t as TestContext).mock.method(console, "info", () => {});

  // Vider les données de la BDD de test (en concervant les tables existantes) => truncate
  await truncateTables();
});

// S'exécute 1 fois APRES TOUS les tests
after(async () => {
  // Eteindre le client prisma
  await prisma.$disconnect();

  // Supprimer le conteneur Postgres
  execSync(`docker rm -f oquiztest`);

  // Eteindre le serveur
  server.close();
});

async function truncateTables() {
  // https://stackoverflow.com/questions/3327312/how-can-i-drop-all-the-tables-in-a-postgresql-database
  await prisma.$executeRawUnsafe(`
    DO $$ DECLARE
      r RECORD;
    BEGIN
      FOR r IN (SELECT tablename FROM pg_tables WHERE schemaname = 'public') LOOP
        EXECUTE 'TRUNCATE TABLE "' || r.tablename || '" RESTART IDENTITY CASCADE';
      END LOOP;
    END $$;
  `);
}
