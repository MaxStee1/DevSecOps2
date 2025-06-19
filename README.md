# 🛡️ MiApp Segura - DevSecOps Pipeline

## 📋 Descripción del Proyecto

**MiApp Segura** es una aplicación web de notas personales desarrollada con enfoque DevSecOps, integrando controles de seguridad automatizados en todo el ciclo de desarrollo.

## 🎯 Objetivos

### Objetivo General
Crear un pipeline DevSecOps básico que integre controles de seguridad automatizados en una aplicación web simple desarrollada con enfoque de desarrollo seguro.

### Objetivos Específicos
- ✅ Desarrollar una aplicación web básica con autenticación
- ✅ Configurar un pipeline CI/CD con herramientas de seguridad
- ✅ Desplegar en contenedor Docker
- ✅ Documentar el proceso y evidencias

## 🏗️ Arquitectura

\`\`\`
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend API   │    │   Database      │
│   (Next.js)     │◄──►│   (Next.js API) │◄──►│   (PostgreSQL)  │
└─────────────────┘    └─────────────────┘    └─────────────────┘
\`\`\`

## 🔧 Tecnologías Utilizadas

### Frontend & Backend
- **Next.js 14** - Framework React con API Routes
- **TypeScript** - Tipado estático
- **Tailwind CSS** - Estilos
- **shadcn/ui** - Componentes UI

### Seguridad
- **bcryptjs** - Hash de contraseñas
- **jsonwebtoken** - Autenticación JWT
- **zod** - Validación de esquemas
- **Helmet** - Headers de seguridad

### DevSecOps Tools
- **ESLint Security** - Análisis estático
- **Snyk** - Escaneo de vulnerabilidades
- **CodeQL** - Análisis de código
- **Trivy** - Escaneo de contenedores
- **OWASP ZAP** - Testing dinámico (DAST)

## 🚀 Instalación y Uso

### Prerrequisitos
- Node.js 18+
- Docker
- Git

### Instalación Local
\`\`\`bash
# Clonar repositorio
git clone https://github.com/tu-usuario/miapp-segura.git
cd miapp-segura

# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env.local

# Ejecutar en desarrollo
npm run dev
\`\`\`

### Docker
\`\`\`bash
# Build de la imagen
docker build -t miapp-segura .

# Ejecutar contenedor
docker run -p 3000:3000 miapp-segura

# O usar Docker Compose
docker-compose up -d
\`\`\`

## 🛡️ Controles de Seguridad Implementados

### 1. Desarrollo Seguro
- ✅ Validación de entrada con Zod
- ✅ Hash seguro de contraseñas (bcrypt)
- ✅ Autenticación JWT con cookies HttpOnly
- ✅ Headers de seguridad (CSP, HSTS, etc.)
- ✅ Sanitización de datos
- ✅ Rate limiting

### 2. Análisis Estático (SAST)
- ✅ ESLint con reglas de seguridad
- ✅ TypeScript para prevenir errores
- ✅ CodeQL para análisis profundo

### 3. Análisis de Dependencias (SCA)
- ✅ Snyk para vulnerabilidades conocidas
- ✅ npm audit automatizado
- ✅ Dependabot para actualizaciones

### 4. Análisis de Contenedores
- ✅ Trivy para escaneo de imágenes
- ✅ Dockerfile con mejores prácticas
- ✅ Usuario no-root en contenedor

### 5. Testing Dinámico (DAST)
- ✅ OWASP ZAP baseline scan
- ✅ Tests de penetración automatizados

## 📊 Pipeline DevSecOps

```mermaid
graph LR
    A[Code Commit] --> B[Static Analysis]
    B --> C[Security Scan]
    C --> D[Unit Tests]
    D --> E[Build Container]
    E --> F[Container Scan]
    F --> G[DAST Scan]
    G --> H[Deploy]
