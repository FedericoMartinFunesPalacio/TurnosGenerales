// Service de Email
// Envia emails de notificacion usando Gmail SMTP
// Requiere App Password de Google (no la contrasena normal)
// Configuracion: https://myaccount.google.com/apppasswords

import nodemailer from "nodemailer";
import { getEnvVariable } from "../config/env.js";

// Crear transporter de nodemailer con configuracion Gmail
// Un "transporter" es el objeto que se encarga de enviar los emails
const transporter = nodemailer.createTransport({
  service: "gmail",                    // Usar Gmail como servicio SMTP
  host: "smtp.gmail.com",
  port: 587,
  secure: false,                       // TLS se negocia en la conexion
  auth: {
    user: getEnvVariable("EMAIL_USER"),     // Email del remitente
    pass: getEnvVariable("EMAIL_PASS"),     // App Password de Google (16 caracteres)
  },
});

// ==========================================
// TIPOS DE EMAIL QUE SE ENVIAN
// ==========================================

// Email cuando un consumidor agenda un turno (aviso al proveedor)
export async function enviarEmailTurnoAgendado(
  emailProveedor: string,
  nombreProveedor: string,
  nombreConsumidor: string,
  turno: {
    motivo: string;
    dia: Date;
    hora: string;
  }
): Promise<void> {
  const fechaFormateada = turno.dia.toLocaleDateString("es-AR", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  await transporter.sendMail({
    from: `"Turnos App" <${getEnvVariable("EMAIL_USER")}>`,
    to: emailProveedor,
    subject: `Nuevo turno agendado - ${fechaFormateada} ${turno.hora}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2563eb;">Nuevo turno agendado</h2>
        <p>Hola <strong>${nombreProveedor}</strong>,</p>
        <p>Un consumidor ha agendado un turno en tu agenda:</p>
        <div style="background: #f3f4f6; padding: 15px; border-radius: 8px; margin: 15px 0;">
          <p><strong>📅 Fecha:</strong> ${fechaFormateada}</p>
          <p><strong>🕐 Hora:</strong> ${turno.hora}</p>
          <p><strong>📋 Motivo:</strong> ${turno.motivo}</p>
          <p><strong>👤 Consumidor:</strong> ${nombreConsumidor}</p>
        </div>
        <p>El turno esta en estado <strong>POR_CONFIRMAR</strong>. Ingresa a la app para confirmarlo o rechazarlo.</p>
        <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 20px 0;">
        <p style="color: #6b7280; font-size: 12px;">Este email fue enviado por Turnos App</p>
      </div>
    `,
  });
}

// Email cuando el proveedor confirma un turno (aviso al consumidor)
export async function enviarEmailTurnoConfirmado(
  emailConsumidor: string,
  nombreConsumidor: string,
  nombreProveedor: string,
  turno: {
    motivo: string;
    dia: Date;
    hora: string;
  }
): Promise<void> {
  const fechaFormateada = turno.dia.toLocaleDateString("es-AR", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  await transporter.sendMail({
    from: `"Turnos App" <${getEnvVariable("EMAIL_USER")}>`,
    to: emailConsumidor,
    subject: `Turno confirmado - ${fechaFormateada} ${turno.hora}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #16a34a;">Turno confirmado</h2>
        <p>Hola <strong>${nombreConsumidor}</strong>,</p>
        <p>Tu turno ha sido confirmado por el proveedor:</p>
        <div style="background: #f0fdf4; padding: 15px; border-radius: 8px; margin: 15px 0; border-left: 4px solid #16a34a;">
          <p><strong>📅 Fecha:</strong> ${fechaFormateada}</p>
          <p><strong>🕐 Hora:</strong> ${turno.hora}</p>
          <p><strong>📋 Motivo:</strong> ${turno.motivo}</p>
          <p><strong>🏪 Proveedor:</strong> ${nombreProveedor}</p>
        </div>
        <p>Puedes descargar tu comprobante desde la app en "Mis Turnos".</p>
        <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 20px 0;">
        <p style="color: #6b7280; font-size: 12px;">Este email fue enviado por Turnos App</p>
      </div>
    `,
  });
}

// Email cuando el proveedor cancela un turno (aviso al consumidor)
export async function enviarEmailTurnoCancelado(
  emailConsumidor: string,
  nombreConsumidor: string,
  nombreProveedor: string,
  turno: {
    motivo: string;
    dia: Date;
    hora: string;
  }
): Promise<void> {
  const fechaFormateada = turno.dia.toLocaleDateString("es-AR", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  await transporter.sendMail({
    from: `"Turnos App" <${getEnvVariable("EMAIL_USER")}>`,
    to: emailConsumidor,
    subject: `Turno cancelado - ${fechaFormateada} ${turno.hora}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #dc2626;">Turno cancelado</h2>
        <p>Hola <strong>${nombreConsumidor}</strong>,</p>
        <p>Lamentablemente tu turno ha sido cancelado por el proveedor:</p>
        <div style="background: #fef2f2; padding: 15px; border-radius: 8px; margin: 15px 0; border-left: 4px solid #dc2626;">
          <p><strong>📅 Fecha:</strong> ${fechaFormateada}</p>
          <p><strong>🕐 Hora:</strong> ${turno.hora}</p>
          <p><strong>📋 Motivo:</strong> ${turno.motivo}</p>
          <p><strong>🏪 Proveedor:</strong> ${nombreProveedor}</p>
        </div>
        <p>Puedes elegir otro horario disponible desde la app.</p>
        <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 20px 0;">
        <p style="color: #6b7280; font-size: 12px;">Este email fue enviado por Turnos App</p>
      </div>
    `,
  });
}
