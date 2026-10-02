// Router principal
// Este archivo monta todos los routers de la aplicacion bajo sus prefijos
// Es el punto central de enrutamiento de la API
import { Router } from "express";
import turnosRouter from "./turnos.routes.js";
import usuariosRouter from "./usuarios.routes.js";
import uploadRouter from "./upload.routes.js";
import motivosRouter from "./motivos.routes.js";

// Creamos el router principal
const router = Router();

// ==========================================
// Montamos cada router con su prefijo de ruta
// Esto crea la estructura:
//   /api/v1/turnos/*   → turnosRouter
//   /api/v1/users/*    → usuariosRouter
//   /api/v1/upload/*   → uploadRouter
// ==========================================

router.use("/api/v1/turnos", turnosRouter);
router.use("/api/v1/users", usuariosRouter);
router.use("/api/v1/upload", uploadRouter);
router.use("/api/v1/motivos", motivosRouter);

// Endpoint de salud (health check)
// Util para verificar que el servidor esta funcionando
// GET /api/health
router.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),  // Tiempo que lleva el servidor corriendo
  });
});

export default router;
