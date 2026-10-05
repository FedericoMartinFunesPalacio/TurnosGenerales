// Service de Storage — Supabase Storage
// Sube, borra, lista y firma documentos en un bucket PRIVADO de Supabase.
//
// ¿Por qué Supabase Storage y no la carpeta /uploads del backend?
// Porque en Render (plan gratis) el disco es EFIMERO: cada sleep/redeploy
// borra todo lo que se escriba en el filesystem. El bucket de Supabase
// persiste (1 GB gratis) y se accede por HTTPS, que si tiene IPv4.
//
// SEGURIDAD:
// - El bucket es PRIVADO: para ver un archivo hace falta una URL firmada
//   temporal (5 minutos) que genera este backend con la service role key.
// - La service role key es de SOLO SERVIDOR. Nunca va al frontend.
import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { AppError } from "../middlewares/error.handler.js";

// Bucket donde viven los documentos (se configura en .env)
const BUCKET = process.env.SUPABASE_BUCKET || "documentos";

// Cliente singleton: se crea en el PRIMER uso (lazy), asi dotenv ya cargo
// las variables de entorno cuando llega la primera peticion
let cliente: SupabaseClient | null = null;

function obtenerCliente(): SupabaseClient {
  if (cliente) return cliente;

  const url = process.env.SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceKey) {
    throw new AppError(
      "SUPABASE_URL y SUPABASE_SERVICE_ROLE_KEY no estan configurados",
      500
    );
  }

  // persistSession: false → no guardamos tokens en memoria/disco
  cliente = createClient(url, serviceKey, { auth: { persistSession: false } });
  return cliente;
}

// Extension canonica segun el mimetype.
// No confiamos en la extension que manda el cliente en originalname:
// con esto un .exe renombrado a .jpg queda como .jpg igual (y ademas
// el fileFilter del middleware multer ya rechaza mimetype no permitidos)
const EXTENSIONES: Record<string, string> = {
  "image/jpeg": ".jpg",
  "image/png": ".png",
  "image/webp": ".webp",
  "application/pdf": ".pdf",
};

// Genera un nombre unico para el objeto dentro del bucket
// Formato: doc-<timestamp>-<random><extension>  (ej: doc-1770000000000-482913745.jpg)
// El prefijo "doc-" tambien lo valida el endpoint GET /documento/:filename
export function generarNombreArchivo(mimetype: string): string {
  const ext = EXTENSIONES[mimetype] ?? ".bin";
  return `doc-${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
}

// Sube un buffer al bucket y devuelve la KEY del objeto
// upsert: false → si ya existiera un archivo con ese nombre, falla en vez de pisarlo
export async function subirDocumento(
  buffer: Buffer,
  nombre: string,
  mimetype: string
): Promise<string> {
  const { error } = await obtenerCliente()
    .storage.from(BUCKET)
    .upload(nombre, buffer, { contentType: mimetype, upsert: false });

  if (error) {
    throw new AppError(`Error al subir el documento: ${error.message}`, 500);
  }
  return nombre;
}

// Borra un objeto del bucket.
// Si falla lanza AppError: cada caller decide si es "best-effort"
// (catch + loguear, el cleanup diario lo retira) o fatal.
export async function eliminarDocumento(nombre: string): Promise<void> {
  const { error } = await obtenerCliente().storage.from(BUCKET).remove([nombre]);
  if (error) {
    throw new AppError(`Error al eliminar el documento: ${error.message}`, 500);
  }
}

// Crea una URL firmada temporal (300 s = 5 min) para un objeto PRIVADO.
// Cualquiera con esa URL puede ver el archivo hasta que expira.
export async function firmarDocumento(nombre: string): Promise<string> {
  const { data, error } = await obtenerCliente()
    .storage.from(BUCKET)
    .createSignedUrl(nombre, 300);

  if (error || !data) {
    // "Object not found" u otro error de storage → 404
    throw new AppError("Documento no encontrado", 404);
  }
  return data.signedUrl;
}

// Interface de un archivo listado del bucket
export interface ArchivoBucket {
  nombre: string;
  creadoEn: string; // ISO timestamp
}

// Lista todos los archivos del bucket (pagina de 100 hasta el final).
// Lo usa el cleanup para comparar contra lo que referencia la DB.
export async function listarDocumentos(): Promise<ArchivoBucket[]> {
  const resultados: ArchivoBucket[] = [];
  const pagina = 100;
  let offset = 0;
  const supabase = obtenerCliente();

  for (;;) {
    const { data, error } = await supabase.storage
      .from(BUCKET)
      .list("", { limit: pagina, offset });

    if (error) {
      throw new AppError(`Error listando el bucket: ${error.message}`, 500);
    }
    if (!data || data.length === 0) break;

    for (const item of data) {
      // Los "directorios" vienen con id === null; no tenemos carpetas, pero por las dudas
      if (item.id === null) continue;
      resultados.push({ nombre: item.name, creadoEn: item.created_at ?? new Date().toISOString() });
    }

    if (data.length < pagina) break;
    offset += pagina;
  }
  return resultados;
}

// Extrae la key del nombre guardado en la DB.
// documentoUrl: "/api/v1/upload/documento/doc-123-456.jpg" → "doc-123-456.jpg"
export function extraerNombreArchivo(documentoUrl: string): string {
  return documentoUrl.split("/").pop() || "";
}
