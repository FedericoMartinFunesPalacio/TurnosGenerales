// Middleware de Upload con Multer
// Multer procesa archivos multipart/form-data (subida de imagenes/documentos)
//
// Usamos memoryStorage: el archivo queda en RAM como req.file.buffer y luego
// el controller lo sube a Supabase Storage. NO escribimos en disco porque
// el disco de Render (plan gratis) es efimero: todo lo que se guarde ahi
// se borra en cada sleep/redeploy.
// El maximo de 5MB hace que mantener el archivo en memoria no sea problema.
import multer from "multer";

// El archivo se queda en memoria (req.file.buffer)
const storage = multer.memoryStorage();

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
