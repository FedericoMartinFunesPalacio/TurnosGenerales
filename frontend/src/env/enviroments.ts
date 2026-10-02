// Configuracion de URLs del backend.
//
// El frontend se sirve desde dos lugares distintos:
//
// 1) GitHub Pages (produccion): hosting estatico, NO puede reenviar
//    peticiones al backend, asi que hay que usar la URL ABSOLUTA de Render.
// 2) Local: ng serve (proxy.conf.json) y Docker (nginx.conf) reenvian
//    /api/v1 y /uploads/ al backend, asi que usamos rutas RELATIVAS.
//
// Se detecta en runtime si estamos en GitHub Pages (el dominio termina
// en .github.io) y se elige la URL en consecuencia.
const isGitHubPages = window.location.hostname.endsWith('.github.io');

// URL publica del backend en Render
const RENDER_BACKEND = 'https://turnosgeneralesbe.onrender.com';

export const enviroment = {
  // Base de la API (endpoints: /users, /turnos, /motivos, /upload)
  apiBaseUrl: isGitHubPages ? `${RENDER_BACKEND}/api/v1` : '/api/v1',

  // Origen del backend para archivos FUERA de la API (ej: /uploads/archivo.pdf).
  // En GitHub Pages se usa el origen de Render; en local cadena vacia
  // para que la peticion vaya al mismo origen (la resuelve el proxy/nginx).
  apiOrigin: isGitHubPages ? RENDER_BACKEND : '',
};
