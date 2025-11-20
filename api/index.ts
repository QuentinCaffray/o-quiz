// Lancer un serveur de dev 
// Lancer un serveur de prod 

import { config } from "./config.ts";
import { app } from "./src/app.ts";

// Start a HTTP server
app.listen(config.port, () => {
  console.log(`Server started at http://localhost:${config.port}`);
});
