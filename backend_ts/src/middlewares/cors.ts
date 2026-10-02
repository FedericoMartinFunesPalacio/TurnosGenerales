// Configuracion de CORS
// CORS (Cross-Origin Resource Sharing) controla desde que origenes
// el navegador puede hacer peticiones a esta API.
//
// En desarrollo: http://localhost:4200 (Angular dev server)
// En produccion: la URL de GitHub Pages, definida en la env CORS_ORIGINS
//
// Render permite definir variables de entorno en el dashboard del servicio.
import cors from "cors";
import { env } from "../config/env.js";

// Leemos los origenes de la variable de entorno (separados por coma)
// y los agregamos siempre a localhost para desarrollo local
const allowedOrigins = [
  ...env.corsOrigins.split(",").map((origin) => origin.trim()).filter(Boolean),
  "http://localhost:4200",
  "http://localhost:3000",
];

export const corsConfig = cors({
  origin: allowedOrigins,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
});
