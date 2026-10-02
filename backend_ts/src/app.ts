// App de Express
// Este archivo configura la aplicacion Express con todos sus middlewares y rutas
// Separamos la configuracion de la app del servidor (index.ts) para mejor organizacion
// y para poder testear la app sin levantar el servidor
import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { corsConfig } from "./middlewares/cors.js";
import { errorHandler } from "./middlewares/error.handler.js";
import routes from "./routes/index.js";

// __dirname equivalent para ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Creamos la instancia de Express
const app = express();

// ==========================================
// MIDDLEWARES (se ejecutan en orden de registro)
// Un middleware es una funcion que tiene acceso a req, res y next
// Se ejecutan antes de llegar a los handlers de las rutas
// ==========================================

// 1. CORS: Permite peticiones desde otros origenes (frontend Angular)
app.use(corsConfig);

// 2. Body Parsing: Parsea el body de las peticiones JSON
// Sin esto, req.body seria undefined
// Ejemplo: si el cliente envia {"motivo": "Consulta"}, Express lo parsea a un objeto JS
app.use(express.json());

// 3. URL Encoded: Parsea bodies en formato URL-encoded (formularios HTML)
app.use(express.urlencoded({ extended: true }));

// 4. Archivos estaticos: Servir la carpeta /uploads
// Permite acceder a archivos subidos via URL: http://localhost:3000/uploads/doc-xxx.jpg
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

// ==========================================
// RUTAS
// Montamos todas las rutas definidas en routes/index.ts
// Esto registra todos los endpoints de la API
// ==========================================
app.use(routes);

// ==========================================
// MIDDLEWARE DE ERRORES
// Se registra DESPUES de las rutas para capturar errores de cualquier ruta
// En Express, un middleware de errores tiene 4 parametros: (err, req, res, next)
// ==========================================
app.use(errorHandler);

// Exportamos la app para poder importarla en index.ts
export default app;
