// Configuracion de variables de entorno
// dotenv carga las variables del archivo .env y las hace disponibles en process.env
// Esto permite configurar el puerto, la DB, etc. sin hardcodear valores
import dotenv from "dotenv";

dotenv.config();

// Funcion para obtener una variable de entorno obligatoria
// Si no esta definida, lanza un error al iniciar
export function getEnvVariable(key: string): string {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Variable de entorno ${key} no definida. Agregala en backend_ts/.env`);
  }
  return value;
}

// Exportamos un objeto con las variables de entorno tipadas
// Si alguna variable es obligatoria y no esta definida, lanzamos un error al iniciar
export const env = {
  // Puerto del servidor. Si no existe, usamos 3000 por defecto
  port: parseInt(process.env.PORT || "3000", 10),

  // URL de conexion a la base de datos (definida en .env)
  // Ejemplo SQLite: "file:./dev.db"
  // Ejemplo PostgreSQL: "postgresql://user:password@localhost:5432/mydb"
  databaseUrl: process.env.DATABASE_URL || "file:./dev.db",
};
