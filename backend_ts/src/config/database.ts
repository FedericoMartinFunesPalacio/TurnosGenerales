// Conexion a la base de datos
// Una UNICA instancia de PrismaClient compartida por todos los repositories.
// Antes cada repository creaba su propia conexion a SQLite (hardcodeada);
// ahora todas usan esta y la URL viene de la variable de entorno DATABASE_URL.
//
// En local: postgresql://user:pass@localhost:5432/turnosdb (ver docker-compose)
// En Render: la URL del PostgreSQL que crea Render (env DATABASE_URL)
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma/client.js";
import { env } from "./env.js";

// El adapter de PostgreSQL recibe la connection string
const adapter = new PrismaPg({ connectionString: env.databaseUrl });

export const prisma = new PrismaClient({ adapter });
