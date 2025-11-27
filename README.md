# 🌲 Tree Rings Analysis Client

Cliente web para el análisis automático de anillos de crecimiento en troncos de
árboles. Esta aplicación permite subir imágenes de secciones transversales de
troncos, marcar el centro del árbol y obtener resultados de múltiples algoritmos
de detección de anillos en tiempo real.

![Next.js](https://img.shields.io/badge/Next.js-16.0.4-black?logo=next.js)
![React](https://img.shields.io/badge/React-19.2.0-61DAFB?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?logo=typescript)
![Socket.IO](https://img.shields.io/badge/Socket.IO-4.8.1-010101?logo=socket.io)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.0-38B2AC?logo=tailwind-css)

## 📋 Tabla de Contenidos

- [Características](#-características)
- [Arquitectura](#-arquitectura)
- [Requisitos Previos](#-requisitos-previos)
- [Instalación](#-instalación)
- [Configuración](#-configuración)
- [Uso](#-uso)
- [Estructura del Proyecto](#-estructura-del-proyecto)
- [Tecnologías](#-tecnologías)
- [Scripts Disponibles](#-scripts-disponibles)

## ✨ Características

- **📤 Carga de Imágenes**: Soporte para múltiples imágenes (hasta 64) con drag
  & drop
- **🎯 Marcado de Centro**: Canvas interactivo con zoom y pan para marcar el
  centro del tronco
- **⚡ Procesamiento en Tiempo Real**: Recepción de resultados vía WebSocket
  (Socket.IO)
- **📊 Múltiples Algoritmos**: Visualización de resultados de 6 algoritmos
  diferentes:
  - Ring Detection (detección básica)
  - Polar Ring Detection (coordenadas polares)
  - Sobel Ring Detection (filtro Sobel)
  - Autocorrelation Periodicity (periodicidad)
  - Second Derivative (segunda derivada)
  - Unsharp Masking (mejora de contraste)
- **🖼️ Galería de Resultados**: Visualización de imágenes procesadas por cada
  algoritmo
- **📱 Diseño Responsivo**: Interfaz adaptable a diferentes tamaños de pantalla
- **🌙 Tema Oscuro/Claro**: Soporte para preferencias del sistema

## 🏗️ Arquitectura

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│                 │     │                 │     │                 │
│   Next.js 16    │────▶│   NestJS API    │────▶│  Cloudflare R2  │
│   (Frontend)    │     │   (Backend)     │     │   (Storage)     │
│                 │     │                 │     │                 │
└────────┬────────┘     └────────┬────────┘     └─────────────────┘
         │                       │
         │  Socket.IO            │  Kafka
         │                       ▼
         │              ┌─────────────────┐
         │              │                 │
         └─────────────▶│  Apache Spark   │
                        │  (Processing)   │
                        │                 │
                        └─────────────────┘
```

### Flujo de Datos

1. **Upload**: El usuario sube imágenes → Se obtienen URLs firmadas (presigned) → Se suben directamente a Cloudflare R2
2. **Process**: Se envía solicitud de procesamiento → Backend encola mensaje en Apache Kafka → Spark consume y procesa
3. **Results**: Spark publica resultados en Kafka → Backend consume y emite vía Socket.IO → Frontend actualiza UI en tiempo real

## 📦 Requisitos Previos

- **Node.js** >= 20.x
- **pnpm** >= 9.x (recomendado) o npm/yarn
- **Backend API** ([tree-rings-kafka-api](https://github.com/devEddu17x/tree-rings-kafka-api)) corriendo en `http://localhost:8000`
- **Apache Kafka** configurado y corriendo
- **Apache Spark** ([apache-spark-perception-tree-rings](https://github.com/devEddu17x/apache-spark-perception-tree-rings)) para procesamiento de imágenes

## 🚀 Instalación

### 1. Clonar el Repositorio

```bash
git clone https://github.com/devEddu17x/tree-rings-next-client.git
cd tree-rings-next-client
```

### 2. Instalar Dependencias

```bash
# Con pnpm (recomendado)
pnpm install

# Con npm
npm install

# Con yarn
yarn install
```

### 3. Configurar Variables de Entorno

Crear archivo `.env.local` en la raíz del proyecto:

```env
# URL del Backend API
NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1

# URL del WebSocket (Socket.IO)
NEXT_PUBLIC_WS_URL=http://localhost:8000
```

### 4. Iniciar en Desarrollo

```bash
pnpm dev
```

Abrir [http://localhost:3000](http://localhost:3000) en el navegador.

## ⚙️ Configuración

### Variables de Entorno

| Variable              | Descripción                | Valor por Defecto              |
| --------------------- | -------------------------- | ------------------------------ |
| `NEXT_PUBLIC_API_URL` | URL base de la API REST    | `http://localhost:8000/api/v1` |
| `NEXT_PUBLIC_WS_URL`  | URL del servidor Socket.IO | `http://localhost:8000`        |

### Configuración de Imágenes

En `next.config.ts`, se configuran los dominios permitidos para carga de
imágenes:

```typescript
images: {
  remotePatterns: [
    { hostname: 'edducode.me' },
    { hostname: '*.r2.cloudflarestorage.com' },
    { hostname: 'apache-spark-perception-tree-rings.edducode.me' }
  ]
}
```

## 📖 Uso

### 1. Subir Imágenes

- Navegar a la página principal (`/`)
- Arrastrar imágenes al área de drop o hacer clic para seleccionar
- Formatos soportados: JPG, JPEG, PNG, WEBP
- Tamaño máximo por archivo: 20MB
- Máximo 64 imágenes por sesión

### 2. Marcar Centro del Tronco

- Para cada imagen, hacer clic en el centro del tronco
- Usar controles de zoom (+/-) para mayor precisión
- Navegar entre imágenes con las flechas

### 3. Procesar y Ver Resultados

- Iniciar el procesamiento
- Ver progreso en tiempo real (subida, cola, resultados)
- Explorar resultados por imagen en el acordeón
- Cambiar entre algoritmos usando las pestañas
- Ver imágenes procesadas en la galería

## 📁 Estructura del Proyecto

```
tree-rings-next-client/
├── app/                          # App Router de Next.js
│   ├── layout.tsx                # Layout principal
│   └── (analysis)/
│       └── (routes)/
│           ├── page.tsx          # Página de upload
│           ├── coordinates/      # Página de marcado
│           └── process/          # Página de resultados
├── components/
│   └── ui/                       # Componentes shadcn/ui
├── modules/
│   └── analysis/
│       ├── constants.ts          # Constantes y configuración
│       ├── hooks/                # Custom hooks
│       │   ├── use-unified-process.ts
│       │   ├── use-image-marker.ts
│       │   └── ...
│       ├── services/
│       │   └── analysis-api.ts   # Servicios API
│       ├── store/
│       │   └── analysis-store.ts # Estado global (Zustand)
│       ├── types/
│       │   └── index.ts          # Tipos TypeScript
│       └── ui/
│           └── components/       # Componentes del módulo
│               ├── process/      # Componentes de resultados
│               └── ...
├── lib/
│   └── utils.ts                  # Utilidades generales
├── styles/
│   └── globals.css               # Estilos globales (Tailwind)
└── public/                       # Archivos estáticos
```

## 🛠️ Tecnologías

### Frontend

| Tecnología                                    | Versión | Descripción                      |
| --------------------------------------------- | ------- | -------------------------------- |
| [Next.js](https://nextjs.org/)                | 16.0.4  | Framework React con App Router   |
| [React](https://react.dev/)                   | 19.2.0  | Biblioteca UI con React Compiler |
| [TypeScript](https://www.typescriptlang.org/) | 5.x     | Tipado estático                  |
| [Tailwind CSS](https://tailwindcss.com/)      | 4.0     | Framework CSS utility-first      |
| [Zustand](https://zustand-demo.pmnd.rs/)      | 5.0.8   | Gestión de estado                |
| [Socket.IO Client](https://socket.io/)        | 4.8.1   | WebSocket para tiempo real       |

### UI Components

| Librería                                | Descripción                       |
| --------------------------------------- | --------------------------------- |
| [shadcn/ui](https://ui.shadcn.com/)     | Componentes accesibles (Radix UI) |
| [Lucide React](https://lucide.dev/)     | Iconos                            |
| [GSAP](https://greensock.com/gsap/)     | Animaciones                       |
| [Sonner](https://sonner.emilkowal.ski/) | Notificaciones toast              |

## 📜 Scripts Disponibles

```bash
# Desarrollo con hot reload
pnpm dev

# Build de producción
pnpm build

# Iniciar servidor de producción
pnpm start

# Ejecutar linter
pnpm lint
```

## 🔗 Repositorios Relacionados

| Repositorio | Descripción | Tecnologías |
|-------------|-------------|-------------|
| [tree-rings-kafka-api](https://github.com/devEddu17x/tree-rings-kafka-api) | API Backend - Gestiona uploads, Kafka y WebSocket | NestJS, KafkaJS, Socket.IO, AWS S3 SDK |
| [apache-spark-perception-tree-rings](https://github.com/devEddu17x/apache-spark-perception-tree-rings) | Procesamiento de imágenes con algoritmos de detección | Apache Spark, Python, OpenCV |

## 🔌 API Endpoints

El backend expone los siguientes endpoints:

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| `POST` | `/api/v1/analysis/request-upload` | Solicita URLs firmadas para subir imágenes a R2 |
| `POST` | `/api/v1/analysis/start-process` | Inicia el procesamiento de imágenes (encola en Kafka) |
| `WS` | `/?clientId={uuid}` | Conexión Socket.IO para recibir resultados en tiempo real |

### Evento WebSocket

- **`process_finished`**: Emitido cuando Spark termina de procesar una imagen

## 📄 Licencia

Este proyecto es parte de un trabajo académico de investigación.

---

Desarrollado con ❤️ usando Next.js 16 y React 19
