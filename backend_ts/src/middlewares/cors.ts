// Configuracion de CORS (Cross-Origin Resource Sharing)
// CORS permite controlar que origenes (dominios) pueden acceder a nuestra API
// Por defecto, los navegadores bloquean peticiones de un dominio a otro
// Ejemplo: Frontend en localhost:4200 no podria llamar a Backend en localhost:3000 sin CORS
import cors from "cors";

// Configuración de CORS
// origin: Permite peticiones desde el frontend Angular (localhost:4200)
// En produccion, cambiaria al dominio real del frontend
export const corsConfig = cors({
  origin: [
    "http://localhost:4200",   // Frontend Angular en desarrollo
    "http://localhost:3000",   // Frontend Angular (alternativo)
  ],
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],  // Metodos HTTP permitidos
  allowedHeaders: ["Content-Type", "Authorization"],    // Headers permitidos
  credentials: true,  // Permite enviar cookies/headers de autenticacion
});
