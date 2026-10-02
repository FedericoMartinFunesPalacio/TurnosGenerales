// Middleware de Upload con Multer
// Multer procesa archivos multipart/form-data (subida de imagenes/documentos)
// Los archivos se guardan en la carpeta /uploads con un nombre unico
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";

// __dirname equivalent para ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Carpeta donde se guardan los archivos subidos
const UPLOADS_DIR = path.join(__dirname, "../../uploads");

// Configuracion de almacenamiento
const storage = multer.diskStorage({
  // Destination: donde guardar el archivo
  destination: (_req, _file, cb) => {
    cb(null, UPLOADS_DIR);
  },
  // Filename: como nombrar el archivo (evita colisiones con timestamp + random)
  filename: (_req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname); // .jpg, .pdf, etc.
    cb(null, `doc-${uniqueSuffix}${ext}`);
  },
});

// Filtro de archivos: solo permitir imagenes y PDFs
const fileFilter = (
  _req: Express.Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
): void => {
  const allowedMimes = [
    "image/jpeg",
    "image/png",
    "image/webp",
    "application/pdf",
  ];

  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true);  // Aceptar el archivo
  } else {
    cb(new Error("Tipo de archivo no permitido. Solo se aceptan JPG, PNG, WEBP y PDF"));
  }
};

// Middleware de multer configurado
// limits: maximo 5MB por archivo
export const uploadMiddleware = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB maximo
  },
});
