import { PrismaClient, Usuario } from "../generated/prisma/client.js";
import { PrismaLibSql } from "@prisma/adapter-libsql";
import { CreateUsuarioInput } from "../schemas/usuario.schema.js";

const adapter = new PrismaLibSql({ url: "file:./dev.db" });
const prisma = new PrismaClient({ adapter });

const userSelect = {
  id: true,
  nombre: true,
  apellidos: true,
  email: true,
  phone: true,
  role: true,
  createdAt: true,
  updatedAt: true,
  password: false,
};

export async function findAllUsuarios(): Promise<Partial<Usuario>[]> {
  return prisma.usuario.findMany({ orderBy: { createdAt: "desc" }, select: userSelect });
}

export async function findUsuarioById(id: number): Promise<Partial<Usuario> | null> {
  return prisma.usuario.findUnique({ where: { id }, select: userSelect });
}

export async function findUsuarioByEmail(email: string): Promise<Usuario | null> {
  return prisma.usuario.findUnique({ where: { email } });
}

export async function createUsuario(data: CreateUsuarioInput): Promise<Partial<Usuario>> {
  return prisma.usuario.create({
    data: {
      nombre: data.nombre,
      apellidos: data.apellidos,
      password: data.password,
      email: data.email,
      phone: data.phone,
      role: data.role,
    },
    select: userSelect,
  });
}

export async function updatePassword(id: number, newPassword: string): Promise<void> {
  await prisma.usuario.update({ where: { id }, data: { password: newPassword } });
}

export async function existsByEmail(email: string): Promise<boolean> {
  const user = await prisma.usuario.findUnique({ where: { email }, select: { id: true } });
  return user !== null;
}

export async function findUsuariosByRole(role: string): Promise<Partial<Usuario>[]> {
  return prisma.usuario.findMany({
    where: { role },
    orderBy: { nombre: "asc" },
    select: userSelect,
  });
}
