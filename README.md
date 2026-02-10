# LCDLL

Este es un clon digital del juego de cartas **"Hasta Donde Puedas" (HDP)**, un juego de humor negro para jugar con amigos.

## 🚀 Características

- **Multijugador Online:** Creá salas privadas o públicas y jugá con amigos en tiempo real.
- **Dos Modos de Juego:**
  - **Modo Remoto:** Para jugar de forma remota, sin poder hablar.
  - **Modo Presencial:** Para juntadas. Un "Czar" lee las cartas en voz alta y coordina la ronda.
- **Cartas Personalizadas:** Soporte para aportes de temas y mazos personalizados.

## 💻 Instalación y Uso

### Requisitos
- Node.js (v18 o superior recomendado)
- npm o yarn

### Pasos
1. Clona el repositorio.
2. Instala las dependencias:
   ```bash
   npm install
   ```
3. Iniciá el servidor de desarrollo (cliente):
   ```bash
   npm run dev
   ```
4. Iniciá el servidor de sockets/backend:
   ```bash
   npm run build
   npm run server
   ```

Por defecto, el cliente correrá en el puerto `5173` y el servidor en el `3000`.

## 📂 Estructura del Proyecto

- `/src`: Lógica del frontend y componentes React.
  - `/components/playing`: Vistas de las fases de juego (Votación, Lectura, Resultados).
  - `/hooks`: Gestión de estado de Socket y lógica del juego online.
  - `/data`: Archivos JSON con el contenido de las cartas (Mazos).
- `/server`: Manejadores de salas, lógica de backend y control de sesiones.
- `server.cjs`: Punto de entrada del servidor principal.

---