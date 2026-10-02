// Entry point de la aplicacion
// Este archivo es el que se ejecuta cuando iniciamos el servidor
// Su unica responsabilidad es levantar el servidor en el puerto configurado
// La configuracion de la app esta en app.ts (separacion de responsabilidades)
import app from "./app.js";
import { env } from "./config/env.js";

// ==========================================
// INICIO DEL SERVIDOR
// ==========================================

// Express escucha peticiones HTTP en el puerto configurado
// Cuando recibe una peticion, la pasa por los middlewares y rutas en orden
app.listen(env.port, () => {
  console.log(`====================================`);
  console.log(`Servidor corriendo en http://localhost:${env.port}`);
  console.log(`Entorno: ${process.env.NODE_ENV || "development"}`);
  console.log(`====================================`);
});

// Manejo de errores no capturados
// Si el servidor crashea, lo registramos antes de salir
process.on("unhandledRejection", (reason, promise) => {
  console.error("Unhandled Rejection at:", promise, "reason:", reason);
});

process.on("uncaughtException", (error) => {
  console.error("Uncaught Exception:", error);
  // En produccion, aqui deberiamos cerrar el servidor gracefully
  process.exit(1);
});
