-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateTable
CREATE TABLE "motivos" (
    "id" SERIAL NOT NULL,
    "texto" TEXT NOT NULL,
    "proveedorId" INTEGER NOT NULL,
    "usageCount" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "motivos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "turno_motivos" (
    "id" SERIAL NOT NULL,
    "turnoId" INTEGER NOT NULL,
    "motivoId" INTEGER NOT NULL,

    CONSTRAINT "turno_motivos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "turnos" (
    "id" SERIAL NOT NULL,
    "dia" TIMESTAMP(3) NOT NULL,
    "hora" TEXT NOT NULL,
    "estado" TEXT NOT NULL DEFAULT 'DISPONIBLE',
    "documentoUrl" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "proveedorId" INTEGER NOT NULL,
    "consumidorId" INTEGER,
    "motivo_seleccionado" TEXT,
    "full_name" TEXT NOT NULL DEFAULT '',
    "email" TEXT NOT NULL DEFAULT '',
    "phone" TEXT NOT NULL DEFAULT '',
    "dni" TEXT NOT NULL DEFAULT '',

    CONSTRAINT "turnos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "usuarios" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "apellidos" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'CONSUMIDOR',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "usuarios_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "motivos_texto_proveedorId_key" ON "motivos"("texto", "proveedorId");

-- CreateIndex
CREATE UNIQUE INDEX "turno_motivos_turnoId_motivoId_key" ON "turno_motivos"("turnoId", "motivoId");

-- CreateIndex
CREATE UNIQUE INDEX "usuarios_email_key" ON "usuarios"("email");

-- AddForeignKey
ALTER TABLE "motivos" ADD CONSTRAINT "motivos_proveedorId_fkey" FOREIGN KEY ("proveedorId") REFERENCES "usuarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "turno_motivos" ADD CONSTRAINT "turno_motivos_turnoId_fkey" FOREIGN KEY ("turnoId") REFERENCES "turnos"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "turno_motivos" ADD CONSTRAINT "turno_motivos_motivoId_fkey" FOREIGN KEY ("motivoId") REFERENCES "motivos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "turnos" ADD CONSTRAINT "turnos_proveedorId_fkey" FOREIGN KEY ("proveedorId") REFERENCES "usuarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "turnos" ADD CONSTRAINT "turnos_consumidorId_fkey" FOREIGN KEY ("consumidorId") REFERENCES "usuarios"("id") ON DELETE SET NULL ON UPDATE CASCADE;

